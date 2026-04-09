"use strict";

const assert = require("assert");

const { rankTaskCandidates } = require("../task_candidate_ranker");

const ranked = rankTaskCandidates([
  { title: "low", goal_relevance: 0.5, unblock_value: 0.2, safety: 1, scope_size: 1, testability: 0.5, approval_cost: 1 },
  { title: "high", goal_relevance: 1, unblock_value: 1, safety: 1, scope_size: 0.5, testability: 1, approval_cost: 0.5 },
]);

assert.strictEqual(ranked[0].title, "high");

console.log("PASS");
