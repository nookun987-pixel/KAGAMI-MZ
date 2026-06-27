"use strict";

const { readJson } = require("../MIKAGE/shared/utils/fs_utils");
const { compileCanonPatchPacket } = require("../canon_evolution/canon_patch_compiler");

function buildRepairAction(tracePaths, failureRoute, options = {}) {
  const trace = tracePaths && tracePaths.raw_execution_trace_path
    ? readJson(tracePaths.raw_execution_trace_path, {})
    : {};
  const currentAttempt = Number.isInteger(options.attemptIndex) ? options.attemptIndex : 1;
  const maxAttempts = Number.isInteger(options.maxAttempts) ? options.maxAttempts : 2;
  const retryAllowed = Boolean(failureRoute && failureRoute.retry_allowed);
  const qualityRetryDecision = trace && trace.qualityRetryDecision || options.qualityRetryDecision || {};
  const retryGate = typeof qualityRetryDecision.retry_allowed === "boolean"
    ? qualityRetryDecision.retry_allowed
    : retryAllowed;
  const repairable = Boolean(retryGate && currentAttempt < maxAttempts);
  const originalJobId = trace && trace.taskSpec && trace.taskSpec.context && trace.taskSpec.context.retry_of
    ? trace.taskSpec.context.retry_of
    : trace && trace.taskSpec && trace.taskSpec.job_id || "";
  const qualityFailurePacket = trace && trace.qualityFailurePacket || options.qualityFailurePacket || {};
  const repairPatchPacket = trace && trace.repairPatchPacket
    || options.repairPatchPacket
    || compileCanonPatchPacket({
      taskSpec: trace.taskSpec || {},
      qualityFailurePacket,
      canonMemory: options.canonMemory || {},
    });

  const baseAction = {
    repairable,
    repair_class: failureRoute && failureRoute.repair_class || "",
    recovery_mode: repairPatchPacket.recovery_mode || "STANDARD_RECOVERY",
    current_attempt: currentAttempt,
    max_attempts: maxAttempts,
    responsible_module: failureRoute && failureRoute.responsible_module || "",
    repair_strategy: failureRoute && failureRoute.repair_strategy || "",
    actions: [],
    next_options: {},
    prompt_patch: {
      positive_additions: [],
      negative_additions: [],
    },
    canon_patch: {
      lock_boost: [],
      blocked_trait_reinforcement: [],
      dominant_trait_reinforcement: [],
      must_have_replay: [],
      hard_negative_carryover: [],
    },
    lineage: {
      original_job_id: originalJobId,
      parent_job_id: trace && trace.taskSpec && trace.taskSpec.job_id || "",
      current_attempt: currentAttempt,
      next_attempt: repairable ? currentAttempt + 1 : null,
    },
    quality_failure_packet: qualityFailurePacket,
    repair_patch_packet: repairPatchPacket,
    quality_retry_decision: qualityRetryDecision,
    notes: [],
  };

  if (!repairable) {
    baseAction.notes.push(currentAttempt >= maxAttempts ? "Max retry cap reached." : (qualityRetryDecision.decision_reason || "Failure marked non-repairable."));
    return baseAction;
  }

  if (failureRoute.repair_class === "runtime") {
    if (failureRoute.repair_strategy === "retry_with_longer_timeout") {
      const previousTimeout = trace && trace.options && trace.options.timeoutMs || options.timeoutMs || 300000;
      baseAction.actions.push("increase_timeout");
      baseAction.next_options.timeoutMs = Math.max(previousTimeout * 4, previousTimeout + 180000, 180000);
      baseAction.notes.push("Increased timeout for retry.");
    }

    if (failureRoute.repair_strategy === "fresh_dispatch" || failureRoute.repair_strategy === "stale_claim_cleanup_path") {
      baseAction.actions.push("fresh_dispatch");
      baseAction.next_options.forceFreshDispatch = true;
    }

    if (failureRoute.repair_strategy === "stale_claim_cleanup_path") {
      baseAction.actions.push("stale_claim_cleanup");
      baseAction.next_options.cleanupStaleClaim = true;
    }

    if (failureRoute.repair_strategy === "reread_result_then_fresh_dispatch") {
      baseAction.actions.push("reread_result");
      baseAction.actions.push("fresh_dispatch");
      baseAction.next_options.rereadResultGraceMs = 3000;
      baseAction.next_options.forceFreshDispatch = true;
    }
  }

  if (failureRoute.repair_class === "quality") {
    if (failureRoute.failure_type === "unreadable_object" || failureRoute.failure_type === "object_unreadable") {
      baseAction.actions.push("prompt_reinforcement");
      baseAction.actions.push("object_readability_requirement");
      baseAction.prompt_patch.positive_additions.push("clear readable object silhouette");
      baseAction.prompt_patch.positive_additions.push("single dominant subject");
    }

    if (failureRoute.failure_type === "abstract_composition") {
      baseAction.actions.push("anti_abstract_reinforcement");
      baseAction.actions.push("strong_object_recovery");
      baseAction.prompt_patch.positive_additions.push("literal manufactured object as primary subject");
      baseAction.prompt_patch.positive_additions.push("non-abstract object-first frame hierarchy");
      baseAction.prompt_patch.positive_additions.push("clear subject separation from background");
      baseAction.prompt_patch.positive_additions.push("front-readable manufactured silhouette");
      baseAction.prompt_patch.positive_additions.push("one-glance object recognition");
      baseAction.prompt_patch.negative_additions.push("abstract composition");
      baseAction.prompt_patch.negative_additions.push("symbolic framing");
      baseAction.prompt_patch.negative_additions.push("conceptual poster-like image");
      baseAction.prompt_patch.negative_additions.push("mood-first composition");
      baseAction.prompt_patch.negative_additions.push("texture-first composition");
      baseAction.prompt_patch.negative_additions.push("atmospheric subject loss");
    }

    if (failureRoute.failure_type === "generic_object" || failureRoute.failure_type === "weak_identity") {
      baseAction.actions.push("identity_lock_reinforcement");
      baseAction.actions.push("strong_object_recovery");
      baseAction.prompt_patch.positive_additions.push("engineered ceramic artifact");
      baseAction.prompt_patch.positive_additions.push("intentional structural design");
      baseAction.prompt_patch.positive_additions.push("industrial non-consumer form");
      baseAction.prompt_patch.positive_additions.push("weight and physical presence");
      baseAction.prompt_patch.positive_additions.push("micro-imperfection and material truth");
      baseAction.prompt_patch.negative_additions.push("product render");
      baseAction.prompt_patch.negative_additions.push("design showcase");
      baseAction.prompt_patch.negative_additions.push("minimal aesthetic product shot");
      baseAction.prompt_patch.negative_additions.push("glossy finish");
      baseAction.prompt_patch.negative_additions.push("clean cg perfection");
      baseAction.prompt_patch.negative_additions.push("decorative geometry");
      baseAction.canon_reinforcements = (baseAction.canon_reinforcements || []).concat([
        "identity over aesthetics",
        "system object over design object",
        "manufactured logic over visual appeal",
      ]);
    }

    if (failureRoute.failure_type === "signature_drift" || failureRoute.failure_type === "form_inconsistent") {
      baseAction.actions.push("signature_lock_reinforcement");
      baseAction.prompt_patch.positive_additions.push("exact silhouette proportions from dominant reference");
      baseAction.prompt_patch.positive_additions.push("fixed eye cavity ratio and jaw taper");
      baseAction.prompt_patch.positive_additions.push("fixed forehead slope and mounting geometry");
      baseAction.prompt_patch.negative_additions.push("silhouette drift");
      baseAction.prompt_patch.negative_additions.push("random proportion variation");
      baseAction.prompt_patch.negative_additions.push("mounting style drift");
    }

    if (failureRoute.failure_type === "edge_too_clean") {
      baseAction.actions.push("edge_behavior_reinforcement");
      baseAction.prompt_patch.positive_additions.push("micro erosion on exposed edges");
      baseAction.prompt_patch.positive_additions.push("slight irregular bevel");
      baseAction.prompt_patch.positive_additions.push("non-uniform edge wear");
      baseAction.prompt_patch.negative_additions.push("clean cad edge");
      baseAction.prompt_patch.negative_additions.push("perfectly sharp edge");
    }

    if (failureRoute.failure_type === "material_uniform") {
      baseAction.actions.push("material_fingerprint_reinforcement");
      baseAction.prompt_patch.positive_additions.push("ceramic micro-pitting");
      baseAction.prompt_patch.positive_additions.push("uneven reflectance");
      baseAction.prompt_patch.positive_additions.push("anisotropic micro shadow");
      baseAction.prompt_patch.positive_additions.push("subtle imperfection noise");
      baseAction.prompt_patch.negative_additions.push("uniform surface");
      baseAction.prompt_patch.negative_additions.push("smooth resin");
    }

    if (failureRoute.failure_type === "color_drift") {
      baseAction.actions.push("palette_lock_reinforcement");
      baseAction.prompt_patch.positive_additions.push("restricted charcoal and off-white palette");
      baseAction.prompt_patch.positive_additions.push("controlled neutral industrial toning");
      baseAction.prompt_patch.negative_additions.push("color drift");
      baseAction.prompt_patch.negative_additions.push("trendy color grading");
    }

    if (failureRoute.failure_type === "texture_only_frame") {
      baseAction.actions.push("object_readability_requirement");
      baseAction.prompt_patch.negative_additions.push("texture-only frame");
    }

    if (failureRoute.failure_type === "material_read_fail") {
      baseAction.actions.push("material_reinforcement");
      baseAction.prompt_patch.positive_additions.push("clear ceramic material read");
    }

    if (failureRoute.failure_type === "ceramic_not_convincing") {
      baseAction.actions.push("material_reinforcement");
      baseAction.prompt_patch.positive_additions.push("convincing ceramic glaze");
    }

    if (failureRoute.failure_type === "drift_fail") {
      baseAction.actions.push("drift_negative_injection");
      baseAction.prompt_patch.negative_additions.push("off-canon drift");
    }

    if (failureRoute.failure_type === "silhouette_break") {
      baseAction.actions.push("silhouette_repair");
      baseAction.prompt_patch.positive_additions.push("clean silhouette edge");
    }

    if (failureRoute.failure_type === "composition_collapse") {
      baseAction.actions.push("composition_rebuild");
      baseAction.prompt_patch.positive_additions.push("stable centered composition");
    }
  }

  if (failureRoute.repair_class === "canon") {
    baseAction.actions.push("canon_lock_boost");
    baseAction.actions.push("must_have_replay");
    baseAction.canon_patch.lock_boost.push("global_canon_lock");
    baseAction.canon_patch.must_have_replay.push("must_have_core_traits");

    if (failureRoute.failure_type === "canon_fail") {
      baseAction.actions.push("blocked_trait_reinforcement");
      baseAction.actions.push("dominant_trait_reinforcement");
      baseAction.actions.push("hard_negative_carryover");
      baseAction.canon_patch.blocked_trait_reinforcement.push("blocked_traits");
      baseAction.canon_patch.dominant_trait_reinforcement.push("dominant_traits");
      baseAction.canon_patch.hard_negative_carryover.push("canon_hard_negatives");
    }
  }

  baseAction.prompt_patch.positive_additions = [
    ...new Set([]
      .concat(baseAction.prompt_patch.positive_additions)
      .concat(repairPatchPacket.prompt_patch && repairPatchPacket.prompt_patch.positive_additions || [])),
  ];
  baseAction.prompt_patch.negative_additions = [
    ...new Set([]
      .concat(baseAction.prompt_patch.negative_additions)
      .concat(repairPatchPacket.prompt_patch && repairPatchPacket.prompt_patch.negative_additions || [])),
  ];
  baseAction.canon_reinforcements = [
    ...new Set([]
      .concat(baseAction.canon_reinforcements || [])
      .concat(repairPatchPacket.canon_reinforcements || [])),
  ];
  baseAction.canon_patch = {
    lock_boost: [...new Set([].concat(baseAction.canon_patch.lock_boost).concat(repairPatchPacket.canon_patch && repairPatchPacket.canon_patch.dominant_traits || []))],
    blocked_trait_reinforcement: [...new Set([].concat(baseAction.canon_patch.blocked_trait_reinforcement).concat(repairPatchPacket.canon_patch && repairPatchPacket.canon_patch.blocked_traits || []))],
    dominant_trait_reinforcement: [...new Set([].concat(baseAction.canon_patch.dominant_trait_reinforcement).concat(repairPatchPacket.canon_patch && repairPatchPacket.canon_patch.dominant_traits || []))],
    must_have_replay: [...new Set([].concat(baseAction.canon_patch.must_have_replay).concat(repairPatchPacket.canon_patch && repairPatchPacket.canon_patch.must_have_traits || []))],
    hard_negative_carryover: [...new Set([].concat(baseAction.canon_patch.hard_negative_carryover).concat(repairPatchPacket.canon_patch && repairPatchPacket.canon_patch.blocked_traits || []))],
  };

  return baseAction;
}

function createRetryTaskSpec(taskSpec, attemptIndex, repairAction = {}) {
  const suffix = `_R${String(attemptIndex).padStart(2, "0")}`;
  return {
    ...taskSpec,
    job_id: `${taskSpec.job_id}${suffix}`,
    constraints: [
      ...(taskSpec.constraints || []),
      ...((repairAction.prompt_patch && repairAction.prompt_patch.positive_additions) || []),
      ...((repairAction.prompt_patch && repairAction.prompt_patch.negative_additions) || []).map((value) => `NEGATIVE:${value}`),
    ],
    context: {
      ...(taskSpec.context || {}),
      retry_of: taskSpec.context && taskSpec.context.retry_of || taskSpec.job_id,
      retry_attempt: attemptIndex,
      repair_action: repairAction,
      repair_patch_packet: repairAction.repair_patch_packet || null,
      retry_context: {
        source_attempt: attemptIndex - 1,
        recovery_mode: repairAction.recovery_mode || "STANDARD_RECOVERY",
        repair_patch_packet_path: repairAction.repair_patch_packet_path || null,
        primary_failure_codes: repairAction.quality_failure_packet && repairAction.quality_failure_packet.primary_failure_codes || [],
      },
      lineage: repairAction.lineage || null,
    },
  };
}

module.exports = {
  buildRepairAction,
  createRetryTaskSpec,
};
