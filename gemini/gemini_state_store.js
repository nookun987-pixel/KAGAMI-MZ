"use strict";

/**
 * Per-run Gemini state persistence.
 * Each job gets its own runs/<job_id>/gemini_state.json.
 * State is never shared across jobs — explicitly fails open (returns null) on any I/O error.
 */

const fs = require("fs");
const path = require("path");

const RUNS_DIR = path.join(__dirname, "..", "runs");

const EMPTY_STATE = () => ({
  model: null,
  thinking_signature: null,
  last_updated: null,
  call_count: 0,
});

function geminiStatePath(jobId) {
  return path.join(RUNS_DIR, String(jobId), "gemini_state.json");
}

/**
 * Read the per-run gemini state for a job.
 * Returns null if jobId is missing, path does not exist, or file is corrupt.
 */
function readGeminiState(jobId) {
  if (!jobId) return null;
  const filePath = geminiStatePath(jobId);
  if (!fs.existsSync(filePath)) return null;
  try {
    return JSON.parse(fs.readFileSync(filePath, "utf8"));
  } catch (_) {
    return null;
  }
}

/**
 * Write (merge-patch) per-run gemini state for a job.
 * Pass { _increment_call: true } to auto-increment call_count.
 * Does nothing if jobId is falsy.
 *
 * @returns {object|null} updated state, or null if jobId is missing
 */
function writeGeminiState(jobId, patch = {}) {
  if (!jobId) return null;
  const filePath = geminiStatePath(jobId);
  try {
    fs.mkdirSync(path.dirname(filePath), { recursive: true });
  } catch (_) {
    return null;
  }
  const current = readGeminiState(jobId) || EMPTY_STATE();
  const shouldIncrement = Boolean(patch._increment_call);
  const { _increment_call, ...cleanPatch } = patch;
  const updated = {
    ...current,
    ...cleanPatch,
    last_updated: new Date().toISOString(),
    call_count: (Number(current.call_count) || 0) + (shouldIncrement ? 1 : 0),
  };
  try {
    fs.writeFileSync(filePath, JSON.stringify(updated, null, 2), "utf8");
    return updated;
  } catch (_) {
    return null;
  }
}

/**
 * Clear the thinking_signature for a job (e.g. on new session start).
 */
function clearGeminiSignature(jobId) {
  if (!jobId) return null;
  return writeGeminiState(jobId, { thinking_signature: null });
}

module.exports = { readGeminiState, writeGeminiState, clearGeminiSignature, geminiStatePath };
