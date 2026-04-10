"use strict";

/**
 * Tests for the Gemini thinking_signature migration layer.
 * Runs with: node tests/test_gemini_state_layer.js
 *
 * Covers:
 *  1. First call with no signature → normal flow
 *  2. Second call reusing saved signature
 *  3. Missing signature response → safe fallback, state preserved
 *  4. Unsupported model → signature loaded but NOT injected
 *  5. Per-run isolation: job A signature must not leak into job B
 *  6. No job_id → completely stateless, no disk write
 */

const fs = require("fs");
const path = require("path");
const assert = require("assert").strict;

const { readGeminiState, writeGeminiState, clearGeminiSignature, geminiStatePath } = require("../gemini/gemini_state_store");
const { extractThinkingSignature, extractResponseText, augmentBodyWithSignature } = require("../gemini/gemini_call_adapter");
const { resolveModel, supportsThinkingSignature } = require("../gemini/gemini_model_config");

// ─── test harness ─────────────────────────────────────────────────────────────

let passed = 0;
let failed = 0;

function test(name, fn) {
  try {
    fn();
    console.log(`  ✓ ${name}`);
    passed++;
  } catch (err) {
    console.error(`  ✗ ${name}`);
    console.error(`    ${err.message}`);
    failed++;
  }
}

// Temp job IDs that are cleaned up after tests
const TEST_JOB_A = `test_job_${Date.now()}_A`;
const TEST_JOB_B = `test_job_${Date.now()}_B`;

function cleanup() {
  for (const jobId of [TEST_JOB_A, TEST_JOB_B]) {
    const p = geminiStatePath(jobId);
    try {
      if (fs.existsSync(p)) fs.unlinkSync(p);
      const dir = path.dirname(p);
      if (fs.existsSync(dir)) fs.rmdirSync(dir);
    } catch (_) {}
  }
}

// ─── 1. State store: read/write basics ────────────────────────────────────────

console.log("\ngemini_state_store");

test("readGeminiState returns null when no state exists", () => {
  const state = readGeminiState(TEST_JOB_A);
  assert.equal(state, null);
});

test("writeGeminiState creates state with correct defaults", () => {
  const state = writeGeminiState(TEST_JOB_A, { model: "gemini-2.5-flash", _increment_call: true });
  assert.ok(state, "state must be returned");
  assert.equal(state.model, "gemini-2.5-flash");
  assert.equal(state.call_count, 1);
  assert.equal(state.thinking_signature, null);
  assert.ok(state.last_updated);
});

test("readGeminiState reads back the written state", () => {
  const state = readGeminiState(TEST_JOB_A);
  assert.ok(state);
  assert.equal(state.model, "gemini-2.5-flash");
  assert.equal(state.call_count, 1);
});

test("writeGeminiState stores thinking_signature correctly", () => {
  const state = writeGeminiState(TEST_JOB_A, { thinking_signature: "sig_abc123", _increment_call: true });
  assert.equal(state.thinking_signature, "sig_abc123");
  assert.equal(state.call_count, 2);
});

test("readGeminiState sees stored thinking_signature", () => {
  const state = readGeminiState(TEST_JOB_A);
  assert.equal(state.thinking_signature, "sig_abc123");
});

test("clearGeminiSignature nulls out the signature", () => {
  const state = clearGeminiSignature(TEST_JOB_A);
  assert.equal(state.thinking_signature, null);
  assert.equal(state.call_count, 2); // count unchanged
});

test("writeGeminiState with no jobId returns null safely", () => {
  const result = writeGeminiState(null, { model: "x" });
  assert.equal(result, null);
});

test("readGeminiState with no jobId returns null safely", () => {
  const result = readGeminiState(null);
  assert.equal(result, null);
});

// ─── 2. Per-run isolation ─────────────────────────────────────────────────────

console.log("\nper-run isolation");

test("Job B has no state initially, independent from Job A", () => {
  writeGeminiState(TEST_JOB_A, { thinking_signature: "sig_job_a_only" });
  const stateB = readGeminiState(TEST_JOB_B);
  assert.equal(stateB, null, "Job B must not see Job A state");
});

test("Job A signature does not leak into Job B state file", () => {
  writeGeminiState(TEST_JOB_B, { model: "gemini-2.5-flash", _increment_call: true });
  const stateA = readGeminiState(TEST_JOB_A);
  const stateB = readGeminiState(TEST_JOB_B);
  assert.notEqual(stateA.thinking_signature, null, "Job A still has sig");
  assert.equal(stateB.thinking_signature, null, "Job B has null sig");
});

// ─── 3. Model config ─────────────────────────────────────────────────────────

console.log("\ngemini_model_config");

test("resolveModel returns default for unknown role", () => {
  const m = resolveModel("nonexistent_role");
  assert.ok(typeof m === "string" && m.length > 0);
});

test("supportsThinkingSignature returns false for gemini-2.5-flash", () => {
  assert.equal(supportsThinkingSignature("gemini-2.5-flash"), false);
});

test("supportsThinkingSignature returns true for gemini-3 prefix", () => {
  assert.equal(supportsThinkingSignature("gemini-3-ultra"), true);
  assert.equal(supportsThinkingSignature("gemini-3-flash"), true);
});

test("supportsThinkingSignature returns false for gemini-2.0", () => {
  assert.equal(supportsThinkingSignature("gemini-2.0-flash"), false);
});

// ─── 4. Signature extraction from response ────────────────────────────────────

console.log("\nextractThinkingSignature");

test("returns null for empty payload", () => {
  assert.equal(extractThinkingSignature(null), null);
  assert.equal(extractThinkingSignature({}), null);
});

test("extracts top-level thinkingSignature", () => {
  const payload = { thinkingSignature: "top_level_sig", candidates: [] };
  assert.equal(extractThinkingSignature(payload), "top_level_sig");
});

test("extracts thinkingSignature from candidates[0]", () => {
  const payload = { candidates: [{ thinkingSignature: "candidate_sig" }] };
  assert.equal(extractThinkingSignature(payload), "candidate_sig");
});

test("returns null when neither location has signature", () => {
  const payload = { candidates: [{ content: { parts: [{ text: "{}" }] } }] };
  assert.equal(extractThinkingSignature(payload), null);
});

// ─── 5. Response text extraction ─────────────────────────────────────────────

console.log("\nextractResponseText");

test("extracts text from standard Gemini response", () => {
  const payload = { candidates: [{ content: { parts: [{ text: '{"ok":true}' }] } }] };
  assert.equal(extractResponseText(payload), '{"ok":true}');
});

test("returns null for malformed payload", () => {
  assert.equal(extractResponseText(null), null);
  assert.equal(extractResponseText({ candidates: [] }), null);
  assert.equal(extractResponseText({ candidates: [{}] }), null);
});

// ─── 6. augmentBodyWithSignature ─────────────────────────────────────────────

console.log("\naugmentBodyWithSignature");

test("adds thinkingSignature to body without mutating original", () => {
  const original = { contents: [], generationConfig: {} };
  const augmented = augmentBodyWithSignature(original, "mysig");
  assert.equal(augmented.thinkingSignature, "mysig");
  assert.equal(original.thinkingSignature, undefined, "original must not be mutated");
  assert.deepEqual(augmented.contents, []);
});

// ─── 7. First call flow simulation (no signature) ─────────────────────────────

console.log("\nfirst call flow simulation");

test("First call: no state → readGeminiState returns null, safe to proceed", () => {
  const freshJob = `sim_job_${Date.now()}`;
  const state = readGeminiState(freshJob);
  assert.equal(state, null);
  // Simulate what adapter does: null state → no signature attachment → normal call
  const signature = state && state.thinking_signature ? state.thinking_signature : null;
  assert.equal(signature, null);
  // Cleanup
  try { fs.rmdirSync(path.dirname(geminiStatePath(freshJob)), { recursive: true }); } catch (_) {}
});

test("Second call: signature available → reads correctly from state", () => {
  const job = `sim_job2_${Date.now()}`;
  // Simulate first call result: store a signature
  writeGeminiState(job, { model: "gemini-3-ultra", thinking_signature: "sig_round_1", _increment_call: true });
  // Simulate second call: reads signature
  const state = readGeminiState(job);
  assert.ok(state);
  assert.equal(state.thinking_signature, "sig_round_1");
  assert.equal(state.call_count, 1);
  // Would be injected because model supports it
  assert.equal(supportsThinkingSignature("gemini-3-ultra"), true);
  // Cleanup
  try { fs.rmdirSync(path.dirname(geminiStatePath(job)), { recursive: true }); } catch (_) {}
});

test("Response with no signature → state call_count increments, signature stays null", () => {
  const job = `sim_job3_${Date.now()}`;
  // No signature returned (Gemini 2.5 behavior)
  const noSigPayload = { candidates: [{ content: { parts: [{ text: '{"pass_fail":"PASS"}' }] } }] };
  const sig = extractThinkingSignature(noSigPayload);
  assert.equal(sig, null);
  // Adapter stores: no signature patch
  writeGeminiState(job, { model: "gemini-2.5-flash", _increment_call: true });
  const state = readGeminiState(job);
  assert.equal(state.thinking_signature, null);
  assert.equal(state.call_count, 1);
  // Cleanup
  try { fs.rmdirSync(path.dirname(geminiStatePath(job)), { recursive: true }); } catch (_) {}
});

// ─── 8. Unsupported model fallback ───────────────────────────────────────────

console.log("\nunsupported model fallback");

test("Unsupported model with saved signature: supportsThinkingSignature returns false", () => {
  const job = `sim_job4_${Date.now()}`;
  writeGeminiState(job, { model: "gemini-2.5-flash", thinking_signature: "old_sig", _increment_call: true });
  const state = readGeminiState(job);
  const wouldInject = state && state.thinking_signature && supportsThinkingSignature("gemini-2.5-flash");
  // Should NOT inject even though signature exists in state
  assert.equal(wouldInject, false);
  // Cleanup
  try { fs.rmdirSync(path.dirname(geminiStatePath(job)), { recursive: true }); } catch (_) {}
});

// ─── cleanup + summary ────────────────────────────────────────────────────────

cleanup();

console.log(`\n${passed + failed} tests: ${passed} passed, ${failed} failed\n`);
if (failed > 0) process.exit(1);
