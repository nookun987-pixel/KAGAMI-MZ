"use strict";

const test = require("node:test");
const assert = require("node:assert/strict");
const fs = require("fs");
const os = require("os");
const path = require("path");

function freshTempRegistry() {
  const root = fs.mkdtempSync(path.join(os.tmpdir(), "mikage-canon-v2-hardening-"));
  process.env.CANON_TRAIT_REGISTRY_PATH = path.join(root, "canon_trait_registry.json");
  process.env.CANON_TRAIT_REGISTRY_AUDIT_PATH = path.join(root, "canon_trait_registry.audit.json");
  fs.writeFileSync(process.env.CANON_TRAIT_REGISTRY_PATH, JSON.stringify({
    version: "2.0.0",
    records: [],
  }, null, 2));
  fs.writeFileSync(process.env.CANON_TRAIT_REGISTRY_AUDIT_PATH, JSON.stringify({
    version: "2.0.0",
    events: [],
  }, null, 2));
  delete require.cache[require.resolve("./canon_v2_writer")];
  delete require.cache[require.resolve("./canon_v2_resolver")];
  delete require.cache[require.resolve("./trait_dominance_engine")];
  return root;
}

function writeRegistry(records) {
  fs.writeFileSync(process.env.CANON_TRAIT_REGISTRY_PATH, JSON.stringify({
    version: "2.0.0",
    records,
  }, null, 2));
}

function buildPassingPayload(jobId) {
  return {
    finalDecision: {
      job_id: jobId,
      decision: "ALLOW",
      completed_at: new Date().toISOString(),
      gemini_pass_fail: "PASS",
      object_readability_score: 95,
      object_readability_passed: true,
      semantic_vlm_executed: false,
      semantic_reject_signals: [],
      canon_hard_failures: [],
    },
    objectSpec: {
      object_id: `MASK-${jobId}`,
      object_class: "mask",
      readable_as: "matte black technical ceramic mask front view",
      identity_core: {
        one_sentence: "A viewer sees this and immediately knows it is a matte black technical ceramic mask artifact.",
      },
      material_truth: {
        primary_material: "boron carbide (B4C) technical ceramic",
        surface_finish: "matte black",
        texture_descriptor: "micro-pitted technical ceramic",
      },
      topology: {
        symmetry: "perfect_bilateral",
      },
      silhouette_rules: {
        must_read_as: "severe symmetrical manufactured mask artifact",
        key_contour_features: ["sealed eye band", "strict bilateral contour"],
      },
      must_have_parts: [
        { part_name: "sealed_eye_region", description: "sealed eye region with no readable human eyes" },
      ],
      forbidden_parts: ["visible eyes"],
      anti_misread_rules: [],
    },
    job: {
      lane: "MASK_MACRO",
      shot_type: "MASK_MACRO",
    },
    canonPacket: {
      positive_traits: {
        material: ["matte black technical ceramic"],
        identity: ["manufactured object identity"],
        silhouette: ["perfect bilateral symmetry"],
        composition: ["black void background", "centered front artifact shot"],
      },
      negative_traits: ["human face read", "plastic or resin material read"],
    },
    postValidation: {
      semantic_reject_signals: [],
    },
    geminiValidation: {
      pass_fail: "PASS",
    },
  };
}

test("promotion threshold keeps low-evidence traits out of dominant", () => {
  freshTempRegistry();
  const { upsertCanonV2Traits } = require("./canon_v2_writer");
  const { resolveCanonV2 } = require("./canon_v2_resolver");

  upsertCanonV2Traits(buildPassingPayload("RUN-THRESH-001"));
  upsertCanonV2Traits(buildPassingPayload("RUN-THRESH-002"));

  const resolved = resolveCanonV2({ lane: "MASK_MACRO" });
  assert.equal(resolved.dominant_traits.length, 0);
  assert.ok(resolved.provisional_supportive.length > 0);
});

test("provisional trait handling upgrades after minimum clean evidence", () => {
  freshTempRegistry();
  const { upsertCanonV2Traits } = require("./canon_v2_writer");
  const { resolveCanonV2 } = require("./canon_v2_resolver");

  upsertCanonV2Traits(buildPassingPayload("RUN-PROV-001"));
  upsertCanonV2Traits(buildPassingPayload("RUN-PROV-002"));
  let resolved = resolveCanonV2({ lane: "MASK_MACRO" });
  assert.ok(resolved.provisional_supportive.some((entry) => /technical ceramic/i.test(entry.trait)));

  upsertCanonV2Traits(buildPassingPayload("RUN-PROV-003"));
  resolved = resolveCanonV2({ lane: "MASK_MACRO" });
  assert.ok(resolved.dominant_traits.some((entry) => /technical ceramic/i.test(entry.trait)));
});

test("downgrade on fail association blocks previously learned traits", () => {
  freshTempRegistry();
  const { upsertCanonV2Traits, observeCanonV2Failure } = require("./canon_v2_writer");
  const { resolveCanonV2, readCanonTraitRegistry } = require("./canon_v2_resolver");

  upsertCanonV2Traits(buildPassingPayload("RUN-DOWN-001"));
  upsertCanonV2Traits(buildPassingPayload("RUN-DOWN-002"));
  upsertCanonV2Traits(buildPassingPayload("RUN-DOWN-003"));

  const failPayload = buildPassingPayload("RUN-DOWN-FAIL-001");
  failPayload.finalDecision.decision = "REJECT";
  failPayload.finalDecision.object_readability_passed = false;
  failPayload.finalDecision.semantic_vlm_executed = true;
  failPayload.finalDecision.semantic_reject_signals = ["human_face_read"];

  const downgraded = observeCanonV2Failure(failPayload);
  assert.equal(downgraded.wrote, true);

  const resolved = resolveCanonV2({ lane: "MASK_MACRO" });
  assert.ok(resolved.blocked_traits.length > 0);
  const registry = readCanonTraitRegistry();
  assert.ok((registry.records || []).some((record) => record.status === "blocked"));
});

test("leaderboard generation exposes score components evidence and downgrade history", () => {
  freshTempRegistry();
  const now = new Date().toISOString();
  writeRegistry([
    {
      lane: "mask",
      identity_key: "mask::canon",
      identity_keys: ["mask::canon", "mask::canon-2"],
      group: "material",
      trait: "matte black technical ceramic",
      trait_signature: "material::matte black technical ceramic",
      status: "active",
      last_promoted_at: now,
      downgrade_history: [{ timestamp: now, from: "dominant", to: "supportive", reason: "stale_supportive_decay" }],
      metrics: {
        support_count: 4,
        success_total: 4,
        readability_total: 4,
        semantic_total: 4,
        canon_alignment_total: 4,
        consensus_seed_total: 4,
        conflict_count: 0,
        fail_associations: { semantic: 0, readability: 0, canon: 0, gemini: 0 },
      },
      created_at: now,
      last_seen_at: now,
    },
  ]);

  const { resolveCanonV2 } = require("./canon_v2_resolver");
  const resolved = resolveCanonV2({ lane: "MASK_MACRO", now_iso: now });
  const leaderboard = resolved.leaderboards_detailed.MASK_MACRO;

  assert.ok(leaderboard.dominant_traits.length >= 1 || leaderboard.supportive_traits.length >= 1);
  const entry = leaderboard.dominant_traits[0] || leaderboard.supportive_traits[0];
  assert.ok(Object.prototype.hasOwnProperty.call(entry, "score_components"));
  assert.ok(Object.prototype.hasOwnProperty.call(entry, "evidence_count"));
  assert.ok(Object.prototype.hasOwnProperty.call(entry, "last_promoted_time"));
  assert.ok(Array.isArray(entry.downgrade_history));
});

test("stale trait suppression downgrades weak old traits out of active influence", () => {
  freshTempRegistry();
  const staleDate = "2026-01-01T00:00:00.000Z";
  writeRegistry([
    {
      lane: "mask",
      identity_key: "mask::stale",
      identity_keys: ["mask::stale"],
      group: "composition",
      trait: "centered front artifact shot",
      trait_signature: "composition::centered front artifact shot",
      status: "active",
      metrics: {
        support_count: 1,
        success_total: 1,
        readability_total: 1,
        semantic_total: 1,
        canon_alignment_total: 1,
        consensus_seed_total: 1,
        conflict_count: 0,
        fail_associations: { semantic: 0, readability: 0, canon: 0, gemini: 0 },
      },
      created_at: staleDate,
      last_seen_at: staleDate,
      last_promoted_at: staleDate,
    },
  ]);

  const { resolveCanonV2, readCanonTraitRegistry } = require("./canon_v2_resolver");
  const resolved = resolveCanonV2({ lane: "MASK_MACRO", now_iso: "2026-04-07T00:00:00.000Z" });
  assert.equal(resolved.dominant_traits.length, 0);
  assert.equal(resolved.supportive_traits.length, 0);
  assert.equal(resolved.provisional_supportive.length, 0);
  assert.ok(resolved.blocked_traits.length >= 1);
  const registry = readCanonTraitRegistry();
  assert.equal(registry.records.length, 1);
});

test("fail association block prevents promotion when fail rate exceeds threshold", () => {
  freshTempRegistry();
  const now = new Date().toISOString();
  writeRegistry([
    {
      lane: "mask",
      identity_key: "mask::unstable",
      identity_keys: ["mask::unstable", "mask::unstable-2"],
      group: "silhouette",
      trait: "perfect bilateral symmetry",
      trait_signature: "silhouette::perfect bilateral symmetry",
      status: "active",
      metrics: {
        support_count: 4,
        success_total: 4,
        readability_total: 4,
        semantic_total: 3,
        canon_alignment_total: 4,
        consensus_seed_total: 4,
        conflict_count: 0,
        fail_associations: { semantic: 2, readability: 0, canon: 0, gemini: 0 },
      },
      created_at: now,
      last_seen_at: now,
      last_promoted_at: now,
    },
  ]);

  const { resolveCanonV2 } = require("./canon_v2_resolver");
  const resolved = resolveCanonV2({ lane: "MASK_MACRO", now_iso: now });
  assert.ok(resolved.blocked_traits.some((entry) => /perfect bilateral symmetry/i.test(entry.trait)));
});

test("blocked trait persistence keeps blocked traits out of promotion until strong clean evidence clears them", () => {
  freshTempRegistry();
  const now = new Date().toISOString();
  writeRegistry([
    {
      lane: "mask",
      identity_key: "mask::blocked",
      identity_keys: ["mask::blocked", "mask::blocked-2"],
      group: "anti-drift negatives",
      trait: "human face read",
      trait_signature: "anti-drift negatives::human face read",
      status: "blocked",
      block_reasons: ["semantic_fail_association"],
      metrics: {
        support_count: 6,
        success_total: 6,
        readability_total: 6,
        semantic_total: 4,
        canon_alignment_total: 6,
        consensus_seed_total: 6,
        conflict_count: 3,
        clean_reinforcement_count: 2,
        fail_associations: { semantic: 2, readability: 0, canon: 0, gemini: 0 },
      },
      created_at: now,
      last_seen_at: now,
      last_promoted_at: now,
    },
  ]);

  const { resolveCanonV2 } = require("./canon_v2_resolver");
  const resolved = resolveCanonV2({ lane: "MASK_MACRO", now_iso: now });
  assert.ok(resolved.blocked_traits.some((entry) => /human face read/i.test(entry.trait)));
  assert.equal(resolved.dominant_traits.some((entry) => /human face read/i.test(entry.trait)), false);
});
