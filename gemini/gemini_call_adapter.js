"use strict";

/**
 * Gemini call adapter with thinking_signature migration layer.
 *
 * This is the ONLY place that touches the Gemini HTTP wire.
 * All call sites (intake, validator, judge, runtime) use callGeminiWithState().
 *
 * Gemini 3 migration surface:
 *   - Request injection:  augmentBodyWithSignature()  ← update here when API field is confirmed
 *   - Response extraction: extractThinkingSignature() ← update here when API field is confirmed
 *
 * Current behavior (Gemini 2.5-flash):
 *   - No signature present → normal call, no-op on state
 *   - Signature returned   → stored in runs/<job_id>/gemini_state.json
 *   - Signature loaded      → attached to next request (only on supported models)
 */

const { readGeminiState, writeGeminiState } = require("./gemini_state_store");
const { supportsThinkingSignature } = require("./gemini_model_config");

const GEMINI_BASE_URL = "https://generativelanguage.googleapis.com/v1beta/models";

// ─── logging ────────────────────────────────────────────────────────────────

function geminiLog(event, extras = {}) {
  if (process.env.GEMINI_STATE_LOG === "off") return;
  process.stdout.write(
    JSON.stringify({ ts: new Date().toISOString(), gemini_state: event, ...extras }) + "\n"
  );
}

// ─── signature injection (Gemini 3 migration surface) ───────────────────────

/**
 * Attach thinking_signature to request body.
 * This function is the ONLY place that knows the Gemini 3 request field name.
 * Update here when the real field is confirmed. Current: "thinkingSignature".
 */
function augmentBodyWithSignature(body, signature) {
  // TODO(gemini3): Confirm exact request field name when Gemini 3 API is published.
  // Candidate: body.thinkingSignature = signature
  return { ...body, thinkingSignature: signature };
}

// ─── signature extraction (Gemini 3 migration surface) ──────────────────────

/**
 * Extract thinking_signature from Gemini response payload.
 * This function is the ONLY place that knows the Gemini 3 response field name.
 * Update here when the real field is confirmed. Current: checks two candidate locations.
 */
function extractThinkingSignature(payload) {
  if (!payload) return null;
  // Candidate 1: top-level field (most likely for Gemini 3 based on Anthropic patterns)
  if (payload.thinkingSignature) return payload.thinkingSignature;
  // Candidate 2: inside candidates[0]
  if (
    payload.candidates &&
    payload.candidates[0] &&
    payload.candidates[0].thinkingSignature
  ) {
    return payload.candidates[0].thinkingSignature;
  }
  return null;
}

// ─── standard text extraction (unchanged from existing call sites) ───────────

/**
 * Extract response text from standard Gemini generateContent payload.
 */
function extractResponseText(payload) {
  return (
    payload &&
    payload.candidates &&
    payload.candidates[0] &&
    payload.candidates[0].content &&
    payload.candidates[0].content.parts &&
    payload.candidates[0].content.parts[0] &&
    payload.candidates[0].content.parts[0].text
  ) || null;
}

// ─── main adapter ────────────────────────────────────────────────────────────

/**
 * callGeminiWithState — stateful Gemini HTTP POST.
 *
 * Drop-in replacement for raw fetch(generateContent).
 * Maintains per-run thinking_signature in runs/<job_id>/gemini_state.json.
 *
 * @param {object} opts
 * @param {string}      opts.model  - Gemini model ID
 * @param {string}      opts.apiKey - Gemini API key
 * @param {object}      opts.body   - generateContent request body (no signature)
 * @param {string|null} opts.jobId  - per-run job ID (null = stateless, signature skipped)
 * @param {string}      opts.role   - call site label for logging: "intake"|"validator"|"judge"|"runtime"
 *
 * @returns {{ payload: object, response: Response, signatureUpdated: boolean }}
 */
async function callGeminiWithState({ model, apiKey, body, jobId = null, role = "unknown" }) {
  const ctx = { role, job_id: jobId || null, model };

  // ── 1. Load per-run state ──────────────────────────────────────────────────
  const state = readGeminiState(jobId);
  const savedSignature = state && state.thinking_signature ? state.thinking_signature : null;

  // ── 2. Optionally attach signature to request ──────────────────────────────
  let requestBody = { ...body };
  let signatureAttached = false;

  if (savedSignature) {
    if (supportsThinkingSignature(model)) {
      requestBody = augmentBodyWithSignature(requestBody, savedSignature);
      signatureAttached = true;
      geminiLog("signature_attached", { ...ctx, call_count: state ? state.call_count : 0 });
    } else {
      geminiLog("signature_not_supported", { ...ctx, call_count: state ? state.call_count : 0 });
    }
  } else if (!jobId) {
    geminiLog("no_job_id", ctx);
  } else {
    geminiLog("signature_missing", { ...ctx, call_count: state ? state.call_count : 0 });
  }

  // ── 3. HTTP call ───────────────────────────────────────────────────────────
  const response = await fetch(
    `${GEMINI_BASE_URL}/${model}:generateContent`,
    {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "x-goog-api-key": apiKey,
      },
      body: JSON.stringify(requestBody),
    }
  );

  const payload = await response.json();

  // ── 4. Extract and persist signature from response ─────────────────────────
  const returnedSignature = extractThinkingSignature(payload);
  let signatureUpdated = false;

  if (jobId) {
    const patch = { model, _increment_call: true };
    if (returnedSignature) {
      patch.thinking_signature = returnedSignature;
      signatureUpdated = true;
      geminiLog("signature_updated", ctx);
    } else {
      geminiLog("signature_not_returned", ctx);
    }
    writeGeminiState(jobId, patch);
  }

  // ── 5. Build trace block ───────────────────────────────────────────────────
  const { geminiStatePath } = require("./gemini_state_store");
  const geminiTrace = {
    model_used: model,
    role,
    job_id: jobId || null,
    gemini_state_path: jobId ? geminiStatePath(jobId) : null,
    thinking_signature_present_before_call: Boolean(savedSignature),
    thinking_signature_attached: signatureAttached,
    thinking_signature_returned: Boolean(returnedSignature),
    thinking_signature_updated: signatureUpdated,
    call_count_before: state ? Number(state.call_count) : 0,
  };

  return { payload, response, signatureUpdated, geminiTrace };
}

module.exports = {
  callGeminiWithState,
  extractThinkingSignature,
  extractResponseText,
  augmentBodyWithSignature,
};
