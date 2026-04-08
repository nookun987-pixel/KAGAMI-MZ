"use strict";

const test = require("node:test");
const assert = require("node:assert/strict");
const { classifyTraits } = require("./trait_dominance_engine");

test("trait dominance engine separates dominant supportive and blocked traits", () => {
  const classified = classifyTraits([
    {
      lane: "mask",
      identity_key: "mask::canon",
      identity_keys: ["mask::canon", "mask::canon-b"],
      group: "material",
      trait: "matte black technical ceramic",
      created_at: new Date().toISOString(),
      metrics: {
        support_count: 5,
        success_total: 5,
        readability_total: 5,
        semantic_total: 5,
        canon_alignment_total: 5,
        conflict_count: 0,
      },
    },
    {
      lane: "mask",
      identity_key: "mask::canon",
      identity_keys: ["mask::canon"],
      group: "composition",
      trait: "centered front artifact shot",
      created_at: new Date().toISOString(),
      metrics: {
        support_count: 2,
        success_total: 2,
        readability_total: 1.5,
        semantic_total: 2,
        canon_alignment_total: 2,
        conflict_count: 0,
      },
    },
    {
      lane: "mask",
      identity_key: "mask::bad",
      group: "anti-drift negatives",
      trait: "fox ears",
      created_at: new Date().toISOString(),
      block_reasons: ["contamination"],
      metrics: {
        support_count: 3,
        success_total: 0,
        readability_total: 0.5,
        semantic_total: 0,
        canon_alignment_total: 0,
        conflict_count: 3,
      },
    },
  ]);

  assert.ok(classified.dominant.some((entry) => /technical ceramic/i.test(entry.trait)));
  assert.ok(
    classified.supportive.some((entry) => /centered front artifact shot/i.test(entry.trait)) ||
    classified.dominant.some((entry) => /centered front artifact shot/i.test(entry.trait))
  );
  assert.ok(classified.blocked.some((entry) => /fox ears/i.test(entry.trait)));
});
