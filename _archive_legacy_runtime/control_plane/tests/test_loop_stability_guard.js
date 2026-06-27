"use strict";

const assert = require("assert");

const { evaluateLoopSafety, markLoopUsage, MAX_INTENT_DEPTH } = require("../loop_stability_guard");

const failureFingerprint = `failure_fp_${Date.now()}`;
const safe = evaluateLoopSafety({
  depth: 1,
  failure_fingerprint: failureFingerprint,
});
assert.strictEqual(safe.allowed, true);

markLoopUsage({
  intent_id: "intent_guard",
  depth: 1,
  failure_fingerprint: failureFingerprint,
});

const blockedCooldown = evaluateLoopSafety({
  depth: 1,
  failure_fingerprint: failureFingerprint,
});
assert.strictEqual(blockedCooldown.allowed, false);

const blockedDepth = evaluateLoopSafety({
  depth: MAX_INTENT_DEPTH + 1,
});
assert.strictEqual(blockedDepth.reason, "max_intent_depth_exceeded");

console.log("PASS");
