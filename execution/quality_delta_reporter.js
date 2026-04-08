"use strict";

const path = require("path");

const { ensureDir, writeJson } = require("../MIKAGE/shared/utils/fs_utils");

function getCodes(packet) {
  return []
    .concat(packet && packet.primary_failure_codes || [])
    .concat(packet && packet.secondary_failure_codes || [])
    .filter(Boolean)
    .map((value) => String(value));
}

function getScore(packet) {
  if (packet && typeof packet.score === "number") {
    return packet.score;
  }
  if (packet && typeof packet.quality_score === "number") {
    return packet.quality_score;
  }
  return 0;
}

function writeQualityDeltaReport(originalJobId, attempts, options = {}) {
  const attempt1 = attempts && attempts[0] || {};
  const attempt2 = attempts && attempts[1] || {};
  const packet1 = attempt1.qualityFailurePacket || {};
  const packet2 = attempt2.qualityFailurePacket || {};
  const codes1 = getCodes(packet1);
  const codes2 = getCodes(packet2);
  const score1 = getScore(packet1);
  const score2 = getScore(packet2);
  const scoreDelta = score2 - score1;
  const failureDelta = codes2.length - codes1.length;
  const resolved = codes1.filter((code) => !codes2.includes(code));
  const primaryFailure1 = packet1.primary_failure_code || "";
  const primaryFailureRemoved = Boolean(primaryFailure1) && !codes2.includes(primaryFailure1);
  const genericRemoved = ["GENERIC_OBJECT", "WEAK_IDENTITY"].some((code) => codes1.includes(code) && !codes2.includes(code));
  const identityImproved = genericRemoved || ["PRODUCT_RENDER_LOOK", "LIGHTWEIGHT_OBJECT", "DECORATIVE_FORM", "MATERIAL_TOO_CLEAN", "CG_PERFECTION"].some((code) => codes1.includes(code) && !codes2.includes(code));
  const driftCodes = ["SIGNATURE_DRIFT", "EDGE_TOO_CLEAN", "MATERIAL_UNIFORM", "FORM_INCONSISTENT", "COLOR_DRIFT"];
  const driftDetected = driftCodes.some((code) => codes2.includes(code));
  const signaturePenalty = codes2.filter((code) => driftCodes.includes(code)).length * 0.2;
  const signatureConsistency = Math.max(0, Math.min(1, primaryFailureRemoved ? 1 - signaturePenalty : 1 - signaturePenalty - (codes2.length * 0.1)));

  let verdict = "RETRY_INVALID";
  if (primaryFailureRemoved && scoreDelta > 0) {
    verdict = "RECOVERY_MAJOR_IMPROVED";
  } else if (scoreDelta > 0 && failureDelta <= -1) {
    verdict = "RECOVERY_MAJOR_IMPROVED";
  } else if (scoreDelta > 0 || failureDelta < 0) {
    verdict = "RECOVERY_IMPROVED";
  } else if (scoreDelta === 0 && failureDelta === 0) {
    verdict = "RECOVERY_FLAT";
  } else if (scoreDelta < 0 || failureDelta > 0) {
    verdict = "RECOVERY_WORSE";
  }

  const report = {
    job_id: originalJobId,
    attempt_1_score: score1,
    attempt_2_score: score2,
    score_delta: scoreDelta,
    failure_count_attempt_1: codes1.length,
    failure_count_attempt_2: codes2.length,
    failure_delta: failureDelta,
    resolved_codes: resolved,
    remaining_codes: codes2,
    primary_failure_removed: primaryFailureRemoved,
    identity_improved: identityImproved,
    generic_removed: genericRemoved,
    signature_consistency: Number(signatureConsistency.toFixed(2)),
    drift_detected: driftDetected,
    improved: verdict === "RECOVERY_IMPROVED" || verdict === "RECOVERY_MAJOR_IMPROVED",
    verdict,
  };

  const traceRoot = path.resolve(options.traceRoot || path.join(process.cwd(), "traces"));
  const targetDir = path.join(traceRoot, originalJobId);
  ensureDir(targetDir);
  const reportPath = path.join(targetDir, "quality_delta_report.json");
  writeJson(reportPath, report);

  return {
    reportPath,
    report,
  };
}

module.exports = {
  writeQualityDeltaReport,
};
