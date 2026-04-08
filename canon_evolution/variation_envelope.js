"use strict";

const AXIS_VALUES = {
  silhouette_variant: ["anchor", "brow_guard_delta", "jaw_vent_delta", "cheek_notch_delta"],
  wear_level: ["low", "medium", "high"],
  microtexture_profile: ["fine_pitting", "striated_erosion", "sintered_grain"],
  seam_intensity: ["minimal", "visible", "pronounced"],
  asymmetry_tolerance: ["tight", "balanced", "expressive"],
};

function clampAllowed(axis, requestedValue) {
  const allowed = AXIS_VALUES[axis] || [];
  if (!allowed.length) {
    return "";
  }
  if (requestedValue && allowed.includes(requestedValue)) {
    return requestedValue;
  }
  return allowed[0];
}

function buildVariationEnvelope(options = {}) {
  const requested = options.requested || {};
  const variantSlot = String(options.variantSlot || "A").toUpperCase();
  const defaultsBySlot = {
    A: {
      silhouette_variant: "anchor",
      wear_level: "low",
      microtexture_profile: "fine_pitting",
      seam_intensity: "minimal",
      asymmetry_tolerance: "tight",
    },
    B: {
      silhouette_variant: "brow_guard_delta",
      wear_level: "medium",
      microtexture_profile: "striated_erosion",
      seam_intensity: "visible",
      asymmetry_tolerance: "tight",
    },
    C: {
      silhouette_variant: "jaw_vent_delta",
      wear_level: "high",
      microtexture_profile: "sintered_grain",
      seam_intensity: "pronounced",
      asymmetry_tolerance: "balanced",
    },
    D: {
      silhouette_variant: "cheek_notch_delta",
      wear_level: "medium",
      microtexture_profile: "fine_pitting",
      seam_intensity: "visible",
      asymmetry_tolerance: "balanced",
    },
  };
  const selected = defaultsBySlot[variantSlot] || defaultsBySlot.A;

  return {
    envelope_version: "CONTROLLED_EVOLUTION_V1",
    variant_slot: variantSlot,
    strict: true,
    bounded_axes: {
      silhouette_variant: {
        allowed: AXIS_VALUES.silhouette_variant,
        selected: clampAllowed("silhouette_variant", requested.silhouette_variant || selected.silhouette_variant),
      },
      wear_level: {
        allowed: AXIS_VALUES.wear_level,
        selected: clampAllowed("wear_level", requested.wear_level || selected.wear_level),
      },
      microtexture_profile: {
        allowed: AXIS_VALUES.microtexture_profile,
        selected: clampAllowed("microtexture_profile", requested.microtexture_profile || selected.microtexture_profile),
      },
      seam_intensity: {
        allowed: AXIS_VALUES.seam_intensity,
        selected: clampAllowed("seam_intensity", requested.seam_intensity || selected.seam_intensity),
      },
      asymmetry_tolerance: {
        allowed: AXIS_VALUES.asymmetry_tolerance,
        selected: clampAllowed("asymmetry_tolerance", requested.asymmetry_tolerance || selected.asymmetry_tolerance),
      },
    },
  };
}

module.exports = {
  buildVariationEnvelope,
};
