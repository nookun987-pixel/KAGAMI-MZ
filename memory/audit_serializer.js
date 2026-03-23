/**
 * MIKAGE — /memory/audit_serializer.js
 * Builds, validates, and serializes structured audit traces.
 *
 * Trace entry format (spec §12):
 *   { step: String, timestamp: ISO8601, result: String, detail?: Object }
 *
 * Also produces delta records between iterations for efficient storage.
 */

"use strict";

// ===================================================================
// VALID STEPS — from state_machine + pipeline stages
// ===================================================================

const VALID_STEPS = Object.freeze([
  // State machine states
  "INGESTED", "STRUCTURED", "PRECHECKED", "NORMALIZED", "TRANSLATED",
  "RENDERING", "CRITIQUED", "DRIFT_CHECKED", "POSTCHECKED", "DECIDED",
  "LOGGED", "DONE", "FAILED", "REVIEW", "REJECTED",
  // Pipeline sub-steps
  "PRE_CONTROL", "PRE_CONTROL_RERUN",
  "HUMAN_GATE", "HUMAN_GATE_WAITING",
  "CONTROL_TOKEN_ISSUED",
  "MIDDLEWARE_MAPPED", "MIDDLEWARE_NORMALIZED",
  "OLLAMA_TRANSLATION", "TRANSLATOR_GUARD",
  "VRAM_OLLAMA_LOAD", "VRAM_OLLAMA_UNLOAD", "VRAM_CLEAR",
  "VRAM_FOOOCUS_LOAD", "VRAM_FOOOCUS_UNLOAD",
  "VRAM_ZOMBIE_CHECK",
  "FOOOCUS_RENDER", "FOOOCUS_ABORT",
  "CRITIC_RULE", "CRITIC_VISION", "CRITIC_MERGED",
  "DRIFT_IDENTITY", "DRIFT_NARRATIVE", "DRIFT_MERGED",
  "POST_CONTROL",
  "NOTION_WRITE", "NOTION_WRITE_FAILED",
  "MATERIAL_SWAP", "PARAMETER_CHANGE",
  "LOOP_CONTINUE", "LOOP_STOP",
]);

const VALID_RESULTS = Object.freeze([
  "OK", "FAIL", "ALLOW", "REVIEW", "REJECT", "AUTO_SAFE",
  "CONDITIONAL", "PASS", "PENDING", "ABORTED",
  "STAGED", "SIMULATED", "RENDERED", "SKIPPED",
  "MATERIAL_SWAP", "PARAMETER_CHANGE",
  "TRANSLATION_FAILED", "RENDER_FAILED",
]);

// ===================================================================
// TRACE ENTRY BUILDER
// ===================================================================

/**
 * Create a single audit trace entry.
 *
 * @param {string} step       Pipeline step name
 * @param {string} result     Outcome of the step
 * @param {Object} [detail]   Optional structured detail
 * @returns {Object}          { step, timestamp, result, detail? }
 */
function createTraceEntry(step, result, detail) {
  if (!step || typeof step !== "string") {
    throw new Error("[AUDIT] step is required and must be a string");
  }
  if (!result || typeof result !== "string") {
    throw new Error("[AUDIT] result is required and must be a string");
  }

  const entry = {
    step: step.toUpperCase(),
    timestamp: new Date().toISOString(),
    result,
  };

  if (detail !== undefined && detail !== null) {
    entry.detail = detail;
  }

  return entry;
}

/**
 * Create a trace entry with explicit timestamp (for reconstruction/replay).
 *
 * @param {string} step
 * @param {string} timestamp  ISO8601
 * @param {string} result
 * @param {Object} [detail]
 * @returns {Object}
 */
function createTraceEntryAt(step, timestamp, result, detail) {
  const entry = {
    step: step.toUpperCase(),
    timestamp,
    result,
  };
  if (detail !== undefined && detail !== null) {
    entry.detail = detail;
  }
  return entry;
}

// ===================================================================
// TRACE ARRAY OPERATIONS
// ===================================================================

/**
 * Append a trace entry to an existing trace array (immutable — returns new array).
 *
 * @param {Object[]} trace     Existing trace array
 * @param {string}   step
 * @param {string}   result
 * @param {Object}   [detail]
 * @returns {Object[]}         New trace array with entry appended
 */
function appendTrace(trace, step, result, detail) {
  const existing = Array.isArray(trace) ? trace : [];
  const entry = createTraceEntry(step, result, detail);
  return [...existing, entry];
}

/**
 * Get the last entry in a trace.
 *
 * @param {Object[]} trace
 * @returns {Object|null}
 */
function getLastEntry(trace) {
  if (!Array.isArray(trace) || trace.length === 0) return null;
  return trace[trace.length - 1];
}

/**
 * Get all entries for a specific step.
 *
 * @param {Object[]} trace
 * @param {string}   step
 * @returns {Object[]}
 */
function getEntriesByStep(trace, step) {
  if (!Array.isArray(trace)) return [];
  const s = step.toUpperCase();
  return trace.filter((e) => e.step === s);
}

/**
 * Get all entries with a specific result.
 *
 * @param {Object[]} trace
 * @param {string}   result
 * @returns {Object[]}
 */
function getEntriesByResult(trace, result) {
  if (!Array.isArray(trace)) return [];
  return trace.filter((e) => e.result === result);
}

/**
 * Count total entries in trace.
 *
 * @param {Object[]} trace
 * @returns {number}
 */
function traceLength(trace) {
  return Array.isArray(trace) ? trace.length : 0;
}

// ===================================================================
// VALIDATION
// ===================================================================

/**
 * Validate a single trace entry structure.
 *
 * @param {Object} entry
 * @returns {{ valid: boolean, errors: string[] }}
 */
function validateEntry(entry) {
  const errors = [];

  if (!entry || typeof entry !== "object") {
    return { valid: false, errors: ["Entry is null or not an object"] };
  }

  if (!entry.step || typeof entry.step !== "string") {
    errors.push("Missing or invalid step");
  }

  if (!entry.timestamp || typeof entry.timestamp !== "string") {
    errors.push("Missing or invalid timestamp");
  } else {
    const d = new Date(entry.timestamp);
    if (isNaN(d.getTime())) {
      errors.push(`Invalid ISO8601 timestamp: "${entry.timestamp}"`);
    }
  }

  if (!entry.result || typeof entry.result !== "string") {
    errors.push("Missing or invalid result");
  }

  // detail is optional but must be object if present
  if (entry.detail !== undefined && entry.detail !== null && typeof entry.detail !== "object") {
    errors.push("detail must be an object if present");
  }

  return { valid: errors.length === 0, errors };
}

/**
 * Validate an entire trace array.
 *
 * @param {Object[]} trace
 * @returns {{ valid: boolean, errors: string[], entry_errors: Object[] }}
 */
function validateTrace(trace) {
  const errors = [];
  const entryErrors = [];

  if (!Array.isArray(trace)) {
    return { valid: false, errors: ["Trace is not an array"], entry_errors: [] };
  }

  if (trace.length === 0) {
    return { valid: false, errors: ["Trace is empty"], entry_errors: [] };
  }

  // Validate each entry
  for (let i = 0; i < trace.length; i++) {
    const result = validateEntry(trace[i]);
    if (!result.valid) {
      entryErrors.push({ index: i, errors: result.errors });
    }
  }

  // Check chronological order
  for (let i = 1; i < trace.length; i++) {
    const prev = new Date(trace[i - 1].timestamp).getTime();
    const curr = new Date(trace[i].timestamp).getTime();
    if (!isNaN(prev) && !isNaN(curr) && curr < prev) {
      errors.push(`Entry ${i} timestamp before entry ${i - 1} — trace not chronological`);
    }
  }

  const allValid = errors.length === 0 && entryErrors.length === 0;

  return { valid: allValid, errors, entry_errors: entryErrors };
}

// ===================================================================
// DELTA RECORDS — store changes between iterations
// ===================================================================

/**
 * Create a delta record capturing what changed between two job states.
 * Stores only differences, not full state — efficient for Notion storage.
 *
 * @param {Object} previousState  Job state before change
 * @param {Object} currentState   Job state after change
 * @returns {Object}              Delta record
 */
function createDelta(previousState, currentState) {
  const prev = previousState || {};
  const curr = currentState || {};
  const delta = {
    timestamp: new Date().toISOString(),
    changes: {},
  };

  // Fields to track for deltas
  const trackedFields = [
    "status", "prompt", "negative_prompt", "seed",
    "identity_score", "critic_score", "risk_score",
    "narrative_score", "decision", "attempt_count",
  ];

  for (const field of trackedFields) {
    const prevVal = prev[field];
    const currVal = curr[field];
    if (prevVal !== currVal) {
      delta.changes[field] = { from: prevVal, to: currVal };
    }
  }

  // Track drift_flags array changes
  const prevFlags = Array.isArray(prev.drift_flags) ? prev.drift_flags : [];
  const currFlags = Array.isArray(curr.drift_flags) ? curr.drift_flags : [];
  const addedFlags = currFlags.filter((f) => !prevFlags.includes(f));
  const removedFlags = prevFlags.filter((f) => !currFlags.includes(f));
  if (addedFlags.length > 0 || removedFlags.length > 0) {
    delta.changes.drift_flags = { added: addedFlags, removed: removedFlags };
  }

  // Track output_files array changes
  const prevFiles = Array.isArray(prev.output_files) ? prev.output_files : [];
  const currFiles = Array.isArray(curr.output_files) ? curr.output_files : [];
  const addedFiles = currFiles.filter((f) => !prevFiles.includes(f));
  if (addedFiles.length > 0) {
    delta.changes.output_files = { added: addedFiles };
  }

  // Track rejected_samples array changes
  const prevRejected = Array.isArray(prev.rejected_samples) ? prev.rejected_samples : [];
  const currRejected = Array.isArray(curr.rejected_samples) ? curr.rejected_samples : [];
  const addedRejected = currRejected.filter((f) => !prevRejected.includes(f));
  if (addedRejected.length > 0) {
    delta.changes.rejected_samples = { added: addedRejected };
  }

  delta.change_count = Object.keys(delta.changes).length;

  return delta;
}

// ===================================================================
// SERIALIZATION — for Notion storage
// ===================================================================

/**
 * Serialize a trace array to a compact JSON string for Notion.
 * Notion rich text has a 2000 char limit per block, so we keep it tight.
 *
 * @param {Object[]} trace
 * @returns {string}  JSON string
 */
function serializeTrace(trace) {
  if (!Array.isArray(trace)) return "[]";
  // Strip detail objects if trace is too long (Notion limit)
  const serialized = JSON.stringify(trace);
  if (serialized.length <= 2000) return serialized;

  // Compact version: strip detail from all but last 3 entries
  const compact = trace.map((entry, i) => {
    if (i >= trace.length - 3) return entry;
    const { detail, ...rest } = entry;
    return rest;
  });

  return JSON.stringify(compact);
}

/**
 * Deserialize a trace from Notion storage.
 *
 * @param {string} traceString  JSON string from Notion
 * @returns {Object[]}          Trace array
 */
function deserializeTrace(traceString) {
  if (!traceString || typeof traceString !== "string") return [];
  try {
    const parsed = JSON.parse(traceString);
    return Array.isArray(parsed) ? parsed : [];
  } catch (e) {
    return [];
  }
}

/**
 * Serialize a delta record to JSON string.
 *
 * @param {Object} delta
 * @returns {string}
 */
function serializeDelta(delta) {
  return JSON.stringify(delta);
}

/**
 * Serialize an array of deltas.
 *
 * @param {Object[]} deltas
 * @returns {string}
 */
function serializeDeltas(deltas) {
  if (!Array.isArray(deltas)) return "[]";
  return JSON.stringify(deltas);
}

// ===================================================================
// EXPORTS
// ===================================================================

module.exports = {
  // Entry builders
  createTraceEntry,
  createTraceEntryAt,

  // Trace operations
  appendTrace,
  getLastEntry,
  getEntriesByStep,
  getEntriesByResult,
  traceLength,

  // Validation
  validateEntry,
  validateTrace,

  // Deltas
  createDelta,

  // Serialization
  serializeTrace,
  deserializeTrace,
  serializeDelta,
  serializeDeltas,

  // Constants
  VALID_STEPS,
  VALID_RESULTS,
};
