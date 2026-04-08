"use strict";

const test = require("node:test");
const assert = require("node:assert/strict");
const { scoreTrait } = require("./trait_scorer");

test("trait scorer applies weighted Canon V2 scoring formula", () => {
  const scored = scoreTrait({
    created_at: new Date().toISOString(),
    identity_key: "mask::canon",
    identity_keys: ["mask::canon", "mask::canon-2"],
    metrics: {
      support_count: 5,
      success_total: 5,
      readability_total: 4.5,
      semantic_total: 5,
      canon_alignment_total: 5,
      conflict_count: 0,
    },
  }, 5);

  assert.ok(scored.final_score >= 0.82);
  assert.equal(scored.metrics.conflict_penalty, 0);
  assert.equal(scored.metrics.frequency_norm, 1);
});
