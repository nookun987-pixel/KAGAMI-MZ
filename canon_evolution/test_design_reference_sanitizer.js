"use strict";

const test = require("node:test");
const assert = require("node:assert/strict");
const {
  classifyDesignReference,
  sanitizeDesignReferenceRegistry,
} = require("./design_reference_sanitizer");

test("design reference sanitizer quarantines contaminated mask references", () => {
  const contaminated = {
    ref_id: "kitsune_noh_mask",
    object_class: "mask",
    canonical_name: "Kitsune Fox Mask",
    key_features: ["pointed ear forms at top", "fox snout"],
    design_notes: "fox spirit mask",
  };

  const classification = classifyDesignReference(contaminated);
  assert.equal(classification.status, "quarantine");
  assert.match(classification.contamination_hits.join(","), /kitsune|fox_ear/);
});

test("design reference sanitizer preserves only live-safe references in cleaned output", () => {
  const sanitized = sanitizeDesignReferenceRegistry({
    version: "1.0.0",
    references: [
      {
        ref_id: "safe_material_tile",
        object_class: "material",
        canonical_name: "Technical Ceramic Tile",
        key_features: ["matte black technical ceramic"],
      },
      {
        ref_id: "hannya_mask",
        object_class: "mask",
        canonical_name: "Hannya Demon Mask",
        key_features: ["two sharp horns"],
      },
    ],
  });

  assert.equal(sanitized.cleaned.references.length, 1);
  assert.equal(sanitized.cleaned.references[0].ref_id, "safe_material_tile");
  assert.equal(sanitized.quarantine.quarantined.length, 1);
});
