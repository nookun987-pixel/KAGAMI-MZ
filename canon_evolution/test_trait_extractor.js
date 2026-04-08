"use strict";

const test = require("node:test");
const assert = require("node:assert/strict");
const { extractTraits } = require("./trait_extractor");

test("trait extractor emits grouped mask canon traits", () => {
  const traits = extractTraits({
    lane: "MASK_MACRO",
    objectSpec: {
      object_class: "mask",
      object_id: "MASK-001",
      readable_as: "matte black technical ceramic mask",
      material_truth: {
        primary_material: "boron carbide (B4C) technical ceramic",
        surface_finish: "matte black",
        texture_descriptor: "micro-pitted technical ceramic",
      },
      silhouette_rules: {
        must_read_as: "severe symmetrical manufactured mask artifact",
        key_contour_features: ["sealed eye band", "strict bilateral contour"],
      },
      topology: { symmetry: "perfect_bilateral" },
      must_have_parts: [
        { part_name: "sealed_eye_region", description: "sealed eye region with no readable human eyes" },
      ],
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
    finalDecision: {
      decision: "ALLOW",
      job_id: "RUN-TRAIT-001",
      completed_at: "2026-04-06T00:00:00.000Z",
      object_readability_score: 92,
      semantic_vlm_executed: false,
      canon_hard_failures: [],
    },
  });

  assert.ok(traits.some((entry) => entry.group === "material" && /boron carbide/i.test(entry.trait)));
  assert.ok(traits.some((entry) => entry.group === "composition" && /black void background/i.test(entry.trait)));
  assert.ok(traits.some((entry) => entry.group === "anti-drift negatives" && /human face read/i.test(entry.trait)));
});
