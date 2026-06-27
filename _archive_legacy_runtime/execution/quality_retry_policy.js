"use strict";

function buildQualityRetryDecision(context = {}) {
  const failureRoute = context.failureRoute || {};
  const qualityFailurePacket = context.qualityFailurePacket || {};
  const guard = context.guard || {};
  const proofBlocked = context.proofBlocked === true;

  if (proofBlocked && failureRoute.repair_class !== "runtime") {
    return {
      retry_allowed: false,
      repair_class: "",
      decision_reason: "QUALITY_PROOF_BLOCKED_NO_LIVE_JUDGE",
      hard_stop: true,
      repeated_failure_code: "",
      proof_blocked: true,
    };
  }

  if (failureRoute.repair_class !== "quality" && failureRoute.repair_class !== "canon") {
    return {
      retry_allowed: Boolean(failureRoute.retry_allowed),
      repair_class: failureRoute.repair_class || "",
      decision_reason: failureRoute.retry_allowed ? "Runtime retry path allowed." : "No retry required.",
      hard_stop: false,
      repeated_failure_code: "",
      proof_blocked: false,
    };
  }

  if (guard.hard_stop) {
    return {
      retry_allowed: false,
      repair_class: failureRoute.repair_class || qualityFailurePacket.repair_class || "",
      decision_reason: guard.reason || "Quality retry guard stopped retry.",
      hard_stop: true,
      repeated_failure_code: guard.repeated_failure_code || "",
      proof_blocked: false,
    };
  }

  return {
    retry_allowed: Boolean(failureRoute.retry_allowed),
    repair_class: failureRoute.repair_class || qualityFailurePacket.repair_class || "",
    decision_reason: "Canon-aware repair patch approved for retry.",
    hard_stop: false,
    repeated_failure_code: "",
    proof_blocked: false,
  };
}

module.exports = {
  buildQualityRetryDecision,
};
