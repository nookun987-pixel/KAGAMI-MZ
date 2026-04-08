"use strict";

function hasAnySignal(signals, patterns) {
  return (signals || []).some((signal) => patterns.includes(String(signal)));
}

const QUALITY_ROUTE_MAP = {
  OBJECT_UNREADABLE: {
    failure_type: "object_unreadable",
    repair_strategy: "identity_focus_reinforcement",
    repair_class: "quality",
  },
  ABSTRACT_COMPOSITION: {
    failure_type: "abstract_composition",
    repair_strategy: "anti_abstract_reinforcement",
    repair_class: "quality",
  },
  GENERIC_OBJECT: {
    failure_type: "generic_object",
    repair_strategy: "identity_lock_reinforcement",
    repair_class: "quality",
  },
  WEAK_IDENTITY: {
    failure_type: "weak_identity",
    repair_strategy: "identity_lock_reinforcement",
    repair_class: "quality",
  },
  MATERIAL_TOO_CLEAN: {
    failure_type: "material_too_clean",
    repair_strategy: "material_reinforcement",
    repair_class: "quality",
  },
  CG_PERFECTION: {
    failure_type: "cg_perfection",
    repair_strategy: "identity_lock_reinforcement",
    repair_class: "quality",
  },
  PRODUCT_RENDER_LOOK: {
    failure_type: "product_render_look",
    repair_strategy: "identity_lock_reinforcement",
    repair_class: "quality",
  },
  DECORATIVE_FORM: {
    failure_type: "decorative_form",
    repair_strategy: "identity_lock_reinforcement",
    repair_class: "quality",
  },
  LIGHTWEIGHT_OBJECT: {
    failure_type: "lightweight_object",
    repair_strategy: "identity_lock_reinforcement",
    repair_class: "quality",
  },
  SIGNATURE_DRIFT: {
    failure_type: "signature_drift",
    repair_strategy: "signature_lock_reinforcement",
    repair_class: "quality",
  },
  EDGE_TOO_CLEAN: {
    failure_type: "edge_too_clean",
    repair_strategy: "edge_behavior_reinforcement",
    repair_class: "quality",
  },
  MATERIAL_UNIFORM: {
    failure_type: "material_uniform",
    repair_strategy: "material_fingerprint_reinforcement",
    repair_class: "quality",
  },
  FORM_INCONSISTENT: {
    failure_type: "form_inconsistent",
    repair_strategy: "signature_lock_reinforcement",
    repair_class: "quality",
  },
  COLOR_DRIFT: {
    failure_type: "color_drift",
    repair_strategy: "palette_lock_reinforcement",
    repair_class: "quality",
  },
  TEXTURE_ONLY_FRAME: {
    failure_type: "texture_only_frame",
    repair_strategy: "object_readability_reinforcement",
    repair_class: "quality",
  },
  CERAMIC_NOT_CONVINCING: {
    failure_type: "ceramic_not_convincing",
    repair_strategy: "material_reinforcement",
    repair_class: "quality",
  },
  CANON_DRIFT: {
    failure_type: "canon_drift",
    repair_strategy: "canon_lock_boost",
    repair_class: "canon",
  },
  SILHOUETTE_BREAK: {
    failure_type: "silhouette_break",
    repair_strategy: "silhouette_repair",
    repair_class: "quality",
  },
  COMPOSITION_COLLAPSE: {
    failure_type: "composition_collapse",
    repair_strategy: "composition_rebuild",
    repair_class: "quality",
  },
};

function routeFailure(context = {}) {
  const taskSpec = context.taskSpec || {};
  const laneResult = context.laneResult || {};
  const monitorReport = context.monitorReport || {};
  const decision = context.decision || {};
  const qualityFailurePacket = context.qualityFailurePacket || {};
  const fatalIssues = new Set(monitorReport.fatal_issues || []);
  const validatorSignals = []
    .concat((laneResult.validator_result && laneResult.validator_result.signals) || [])
    .concat((laneResult.validator_result && laneResult.validator_result.issues) || [])
    .filter(Boolean)
    .map((value) => String(value));

  if (decision.decision === "ALLOW") {
    return {
      failure_type: "",
      responsible_module: "",
      repair_strategy: "",
      repair_class: "",
      retry_allowed: false,
      repairable: false,
    };
  }

  if (fatalIssues.has("timeout")) {
    return {
      failure_type: "timeout",
      responsible_module: "runtime/drive_queue/runtime.js",
      repair_strategy: "retry_with_longer_timeout",
      repair_class: "runtime",
      retry_allowed: true,
      repairable: true,
    };
  }

  if (fatalIssues.has("stale claim")) {
    return {
      failure_type: "stale_claim",
      responsible_module: "runtime/colab_worker/colab_one_click_worker.ipynb",
      repair_strategy: "stale_claim_cleanup_path",
      repair_class: "runtime",
      retry_allowed: true,
      repairable: true,
    };
  }

  if (fatalIssues.has("missing result.json")) {
    if (!qualityFailurePacket.primary_failure_code) {
      return {
        failure_type: "missing_result",
        responsible_module: "runtime/colab_worker/colab_one_click_worker.ipynb",
        repair_strategy: "reread_result_then_fresh_dispatch",
        repair_class: "runtime",
        retry_allowed: true,
        repairable: true,
      };
    }
  }

  if (qualityFailurePacket.primary_failure_code && QUALITY_ROUTE_MAP[qualityFailurePacket.primary_failure_code]) {
    const mapped = QUALITY_ROUTE_MAP[qualityFailurePacket.primary_failure_code];
    return {
      failure_type: mapped.failure_type,
      responsible_module: `MIKAGE/lanes/${taskSpec.lane || "unknown"}`,
      repair_strategy: mapped.repair_strategy,
      repair_class: mapped.repair_class,
      retry_allowed: true,
      repairable: true,
    };
  }

  if (fatalIssues.has("missing result.json")) {
    return {
      failure_type: "missing_result",
      responsible_module: "runtime/colab_worker/colab_one_click_worker.ipynb",
      repair_strategy: "reread_result_then_fresh_dispatch",
      repair_class: "runtime",
      retry_allowed: true,
      repairable: true,
    };
  }

  if (fatalIssues.has("missing output.png")) {
    return {
      failure_type: "missing_output",
      responsible_module: "runtime/colab_worker/colab_one_click_worker.ipynb",
      repair_strategy: "fresh_dispatch",
      repair_class: "runtime",
      retry_allowed: true,
      repairable: true,
    };
  }

  if (fatalIssues.has("malformed result.json") || fatalIssues.has("malformed result")) {
    return {
      failure_type: "malformed_result",
      responsible_module: "runtime/colab_worker/colab_one_click_worker.ipynb",
      repair_strategy: "reread_result_then_fresh_dispatch",
      repair_class: "runtime",
      retry_allowed: true,
      repairable: true,
    };
  }

  if (hasAnySignal(validatorSignals, ["canon_fail", "must_have_replay", "canon_hard_fail"])) {
    return {
      failure_type: "canon_fail",
      responsible_module: `MIKAGE/lanes/${taskSpec.lane || "unknown"}`,
      repair_strategy: "canon_lock_boost",
      repair_class: "canon",
      retry_allowed: true,
      repairable: true,
    };
  }

  if (hasAnySignal(validatorSignals, ["material_read_fail", "material_fail"])) {
    return {
      failure_type: "material_read_fail",
      responsible_module: `MIKAGE/lanes/${taskSpec.lane || "unknown"}`,
      repair_strategy: "material_reinforcement",
      repair_class: "quality",
      retry_allowed: true,
      repairable: true,
    };
  }

  if (hasAnySignal(validatorSignals, ["abstract_composition", "texture_only_frame", "unreadable_object"])) {
    const mapped = hasAnySignal(validatorSignals, ["abstract_composition"])
      ? "abstract_composition"
      : hasAnySignal(validatorSignals, ["texture_only_frame"])
        ? "texture_only_frame"
        : "unreadable_object";

    return {
      failure_type: mapped,
      responsible_module: `MIKAGE/lanes/${taskSpec.lane || "unknown"}`,
      repair_strategy: mapped === "abstract_composition" ? "anti_abstract_reinforcement" : "object_readability_reinforcement",
      repair_class: "quality",
      retry_allowed: true,
      repairable: true,
    };
  }

  if (hasAnySignal(validatorSignals, ["drift_fail", "drift_negative"])) {
    return {
      failure_type: "drift_fail",
      responsible_module: `MIKAGE/lanes/${taskSpec.lane || "unknown"}`,
      repair_strategy: "drift_negative_injection",
      repair_class: "quality",
      retry_allowed: true,
      repairable: true,
    };
  }

  if (fatalIssues.has("validator fail")) {
    return {
      failure_type: "validator_fail",
      responsible_module: `MIKAGE/lanes/${taskSpec.lane || "unknown"}`,
      repair_strategy: "manual_review",
      repair_class: "quality",
      retry_allowed: false,
      repairable: false,
    };
  }

  if (laneResult.status === "failed" || laneResult.status === "rejected") {
    return {
      failure_type: "lane_failure",
      responsible_module: `MIKAGE/lanes/${taskSpec.lane || "unknown"}`,
      repair_strategy: "manual_review",
      repair_class: "quality",
      retry_allowed: false,
      repairable: false,
    };
  }

  return {
    failure_type: "unknown_failure",
    responsible_module: "MIKAGE/control_plane/final_judge.js",
    repair_strategy: "manual_review",
    repair_class: "quality",
    retry_allowed: false,
    repairable: false,
  };
}

module.exports = {
  routeFailure,
};
