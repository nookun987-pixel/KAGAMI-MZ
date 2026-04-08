"use strict";

const fs = require("fs");
const path = require("path");
const { classifyApprovedObjectRecord, deriveApprovedIdentityKey } = require("../memory/approved_object_memory");
const { applyTraitDecayView, ensureRecordMetrics, getFailAssociationCounts } = require("./canon_v2_lifecycle");
const { extractTraits } = require("./trait_extractor");
const { scoreTrait } = require("./trait_scorer");
const { buildLaneLeaderboards } = require("./canon_v2_resolver");

const DEFAULT_CANON_TRAIT_REGISTRY_PATH = path.join(__dirname, "..", "memory", "canon_trait_registry.json");
const DEFAULT_CANON_TRAIT_AUDIT_PATH = path.join(__dirname, "..", "memory", "canon_trait_registry.audit.json");

function normalizeText(value) {
  return String(value || "").trim();
}

function normalizeLane(value) {
  const lane = normalizeText(value).toLowerCase();
  if (!lane) return "unknown";
  if (lane.includes("mask")) return "mask";
  if (lane.includes("weapon")) return "weapon";
  if (lane.includes("material")) return "material";
  return lane;
}

function readJsonSafe(filePath, fallback) {
  try {
    return JSON.parse(fs.readFileSync(filePath, "utf8"));
  } catch (_) {
    return fallback;
  }
}

function writeJson(filePath, payload) {
  fs.mkdirSync(path.dirname(filePath), { recursive: true });
  fs.writeFileSync(filePath, JSON.stringify(payload, null, 2), "utf8");
  return filePath;
}

function getCanonTraitRegistryPath() {
  return process.env.CANON_TRAIT_REGISTRY_PATH || DEFAULT_CANON_TRAIT_REGISTRY_PATH;
}

function getCanonTraitAuditPath() {
  return process.env.CANON_TRAIT_REGISTRY_AUDIT_PATH || DEFAULT_CANON_TRAIT_AUDIT_PATH;
}

function buildEmptyRegistry() {
  return {
    version: "2.0.0",
    records: [],
  };
}

function buildEmptyAudit() {
  return {
    version: "2.0.0",
    events: [],
  };
}

function getTraitSignature(group, trait) {
  return `${normalizeText(group).toLowerCase()}::${normalizeText(trait).toLowerCase()}`;
}

function appendAuditEvent(event) {
  const auditPath = getCanonTraitAuditPath();
  const audit = readJsonSafe(auditPath, buildEmptyAudit());
  if (!Array.isArray(audit.events)) audit.events = [];
  audit.events.push(event);
  writeJson(auditPath, audit);
}

function buildMetricAggregate() {
  return {
    support_count: 0,
    success_total: 0,
    readability_total: 0,
    semantic_total: 0,
    canon_alignment_total: 0,
    consensus_seed_total: 0,
    conflict_count: 0,
    evidence_keys: [],
    provenance: [],
    final_score: 0,
    last_scored_at: null,
    fail_associations: {
      semantic: 0,
      readability: 0,
      canon: 0,
      gemini: 0,
    },
    clean_reinforcement_count: 0,
  };
}

function buildTraitsWrittenPayload({ lane, identityKey, registry, sourceKeys, action, downgraded = false }) {
  const records = Array.isArray(registry.records) ? registry.records : [];
  return {
    lane,
    identity_key: identityKey,
    action,
    downgraded,
    source_keys: sourceKeys,
    records: records
      .filter((record) => normalizeLane(record.lane) === lane && record.identity_key === identityKey)
      .map((record) => ({
        group: record.group,
        trait: record.trait,
        trait_signature: record.trait_signature,
        status: record.status,
        support_count: Number(record.metrics && record.metrics.support_count || 0),
        conflict_count: Number(record.metrics && record.metrics.conflict_count || 0),
        final_score: Number(record.metrics && record.metrics.final_score || 0),
      })),
    leaderboards: buildLaneLeaderboards(records),
  };
}

function upsertCanonV2Traits({ finalDecision, objectSpec, job = {}, canonPacket = {}, postValidation = null, geminiValidation = null }) {
  const targetPath = getCanonTraitRegistryPath();
  if (!finalDecision || finalDecision.decision !== "ALLOW") {
    return { wrote: false, target: "canon_trait_registry", path: targetPath, reason: "FINAL_DECISION_NOT_ALLOW", source_keys: [], traits_written_payload: null };
  }
  if (!objectSpec || typeof objectSpec !== "object") {
    return { wrote: false, target: "canon_trait_registry", path: targetPath, reason: "NO_OBJECT_SPEC", source_keys: [], traits_written_payload: null };
  }

  const classification = classifyApprovedObjectRecord(objectSpec);
  if (classification.bucket !== "KEEP") {
    return {
      wrote: false,
      target: "canon_trait_registry",
      path: targetPath,
      reason: `CANON_V2_${classification.bucket}`,
      source_keys: [],
      identity_key: classification.identity_key,
      traits_written_payload: null,
    };
  }

  const lane = normalizeLane(job.lane || job.shot_type || objectSpec.object_class);
  const identityKey = deriveApprovedIdentityKey(objectSpec);
  const extractedTraits = extractTraits({
    objectSpec,
    canonPacket,
    finalDecision,
    postValidation,
    geminiValidation,
    lane,
    identity_key: identityKey,
  });

  const registry = readJsonSafe(targetPath, buildEmptyRegistry());
  if (!Array.isArray(registry.records)) registry.records = [];

  const newSourceKeys = [];
  for (const entry of extractedTraits || []) {
    const signature = getTraitSignature(entry.group, entry.trait);
    let record = registry.records.find((item) =>
      item &&
      normalizeLane(item.lane) === lane &&
      item.identity_key === identityKey &&
      item.trait_signature === signature
    );

    if (!record) {
      record = {
        lane,
        identity_key: identityKey,
        object_id: objectSpec.object_id || null,
        group: entry.group,
        trait: entry.trait,
        trait_signature: signature,
        identity_keys: [identityKey],
        status: "active",
        metrics: buildMetricAggregate(),
        created_at: finalDecision.completed_at,
        last_promoted_at: finalDecision.completed_at,
        last_seen_at: finalDecision.completed_at,
      };
      registry.records.push(record);
    }

    const evidenceKey = `${finalDecision.job_id}::${signature}`;
    const alreadySeen = Array.isArray(record.metrics.evidence_keys) && record.metrics.evidence_keys.includes(evidenceKey);
    record.identity_keys = Array.from(new Set([...(record.identity_keys || []), identityKey]));
    ensureRecordMetrics(record);
    if (!alreadySeen) {
      record.metrics.support_count += 1;
      record.metrics.success_total += Number(entry.metrics && entry.metrics.success_association || 0);
      record.metrics.readability_total += Number(entry.metrics && entry.metrics.readability_support || 0);
      record.metrics.semantic_total += Number(entry.metrics && entry.metrics.semantic_cleanliness || 0);
      record.metrics.canon_alignment_total += Number(entry.metrics && entry.metrics.canon_alignment || 0);
      record.metrics.consensus_seed_total += Number(entry.metrics && entry.metrics.consensus_seed || 0);
      record.metrics.conflict_count += Number(entry.metrics && entry.metrics.conflict_penalty ? 1 : 0);
      record.metrics.clean_reinforcement_count = Number(record.metrics.clean_reinforcement_count || 0) + 1;
      record.metrics.evidence_keys = [...(record.metrics.evidence_keys || []), evidenceKey];
      record.metrics.provenance = [
        ...(record.metrics.provenance || []),
        {
          run_id: finalDecision.job_id,
          job_id: finalDecision.job_id,
          timestamp: finalDecision.completed_at,
          source_object_identity: objectSpec.object_id || identityKey,
          confidence: finalDecision.gemini_pass_fail === "PASS" ? "high" : "unknown",
          reuse_level: "pass_verified",
        },
      ];
    }

    if (record.status === "blocked" && Number(record.metrics.clean_reinforcement_count || 0) >= 5) {
      record.status = "active";
    }
    record.last_seen_at = finalDecision.completed_at;
    record.last_promoted_at = finalDecision.completed_at;
    record.metrics.final_score = scoreTrait(record, record.metrics.support_count || 1).final_score;
    record.metrics.last_scored_at = finalDecision.completed_at;
    newSourceKeys.push(signature);
  }

  const decayed = applyTraitDecayView(registry.records, finalDecision.completed_at);
  registry.records = decayed.records;

  writeJson(targetPath, registry);
  appendAuditEvent({
    timestamp: finalDecision.completed_at,
    job_id: finalDecision.job_id,
    lane,
    identity_key: identityKey,
    traits_written: newSourceKeys,
    status: "ALLOW",
  });

  return {
    wrote: newSourceKeys.length > 0,
    target: "canon_trait_registry",
    path: targetPath,
    identity_key: identityKey,
    action: "upserted",
    source_keys: newSourceKeys,
    traits_written_payload: buildTraitsWrittenPayload({
      lane,
      identityKey,
      registry,
      sourceKeys: newSourceKeys,
      action: "upserted",
    }),
  };
}

function observeCanonV2Failure({ finalDecision, objectSpec, job = {}, postValidation = null }) {
  const targetPath = getCanonTraitRegistryPath();
  if (!finalDecision || finalDecision.decision === "ALLOW") {
    return { wrote: false, target: "canon_trait_registry", path: targetPath, reason: "FINAL_DECISION_ALLOW", source_keys: [], traits_written_payload: null };
  }
  if (!objectSpec || typeof objectSpec !== "object") {
    return { wrote: false, target: "canon_trait_registry", path: targetPath, reason: "NO_OBJECT_SPEC", source_keys: [], traits_written_payload: null };
  }

  const lane = normalizeLane(job.lane || job.shot_type || objectSpec.object_class);
  const identityKey = deriveApprovedIdentityKey(objectSpec);
  const registry = readJsonSafe(targetPath, buildEmptyRegistry());
  if (!Array.isArray(registry.records) || registry.records.length === 0) {
    return { wrote: false, target: "canon_trait_registry", path: targetPath, reason: "NO_EXISTING_TRAITS", source_keys: [], traits_written_payload: null };
  }

  const readabilityFailed = !(finalDecision.object_readability_passed === true);
  const semanticFailed = Array.isArray(finalDecision.semantic_reject_signals) && finalDecision.semantic_reject_signals.length > 0;
  const shouldDowngrade = readabilityFailed || semanticFailed;
  if (!shouldDowngrade) {
    return { wrote: false, target: "canon_trait_registry", path: targetPath, reason: "NO_DOWNGRADE_SIGNAL", source_keys: [], traits_written_payload: null };
  }

  const targetRecords = registry.records.filter((record) =>
    record &&
    normalizeLane(record.lane) === lane &&
    record.identity_key === identityKey
  );
  if (!targetRecords.length) {
    return { wrote: false, target: "canon_trait_registry", path: targetPath, reason: "NO_MATCHING_IDENTITY_TRAITS", source_keys: [], traits_written_payload: null };
  }

  const downgradedSignatures = [];
  const failAssociations = {
    semantic: Array.isArray(finalDecision.semantic_reject_signals) && finalDecision.semantic_reject_signals.length > 0 ? 1 : 0,
    readability: finalDecision.object_readability_passed === false ? 1 : 0,
    canon: Array.isArray(finalDecision.canon_hard_failures) && finalDecision.canon_hard_failures.length > 0 ? 1 : 0,
    gemini: finalDecision.gemini_pass_fail === "FAIL" ? 1 : 0,
  };
  for (const record of targetRecords) {
    ensureRecordMetrics(record);
    record.metrics.conflict_count = Number(record.metrics.conflict_count || 0) + 1;
    record.metrics.fail_associations.semantic += failAssociations.semantic;
    record.metrics.fail_associations.readability += failAssociations.readability;
    record.metrics.fail_associations.canon += failAssociations.canon;
    record.metrics.fail_associations.gemini += failAssociations.gemini;
    record.metrics.last_scored_at = finalDecision.completed_at;
    record.last_seen_at = finalDecision.completed_at;
    const rescored = scoreTrait(record, Math.max(1, Number(record.metrics.support_count || 1)));
    record.metrics.final_score = rescored.final_score;
    if (semanticFailed || readabilityFailed || rescored.metrics.conflict_penalty >= 0.4) {
      record.status = "blocked";
      record.block_reasons = Array.from(new Set([
        ...((record.block_reasons || [])),
        ...(semanticFailed ? ["semantic_fail_association"] : []),
        ...(readabilityFailed ? ["readability_fail_association"] : []),
      ]));
    } else {
      record.status = "active";
    }
    downgradedSignatures.push(record.trait_signature);
  }

  const decayed = applyTraitDecayView(registry.records, finalDecision.completed_at);
  registry.records = decayed.records;

  writeJson(targetPath, registry);
  appendAuditEvent({
    timestamp: finalDecision.completed_at,
    job_id: finalDecision.job_id,
    lane,
    identity_key: identityKey,
    traits_written: downgradedSignatures,
    status: "REJECT_OBSERVED",
    reason: semanticFailed ? "semantic_fail_association" : "readability_fail_association",
  });

  return {
    wrote: downgradedSignatures.length > 0,
    target: "canon_trait_registry",
    path: targetPath,
    identity_key: identityKey,
    action: "downgraded",
    source_keys: downgradedSignatures,
    traits_written_payload: buildTraitsWrittenPayload({
      lane,
      identityKey,
      registry,
      sourceKeys: downgradedSignatures,
      action: "downgraded",
      downgraded: true,
    }),
  };
}

module.exports = {
  DEFAULT_CANON_TRAIT_REGISTRY_PATH,
  DEFAULT_CANON_TRAIT_AUDIT_PATH,
  getCanonTraitRegistryPath,
  getCanonTraitAuditPath,
  observeCanonV2Failure,
  upsertCanonV2Traits,
};
