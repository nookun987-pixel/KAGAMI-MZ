/**
 * MIKAGE — /core/state_machine.js
 * Strict linear state machine for job lifecycle.
 * No state skipping. No redesign.
 *
 * Valid path:
 *   INGESTED → STRUCTURED → PRECHECKED → NORMALIZED → TRANSLATED →
 *   RENDERING → CRITIQUED → DRIFT_CHECKED → POSTCHECKED → DECIDED →
 *   LOGGED → DONE
 *
 * Fail path (from any non-terminal state):
 *   {ANY} → FAILED → LOGGED → DONE
 *
 * Terminal states: DONE (no outbound transitions)
 */

"use strict";

// ---------------------------------------------------------------------------
// STATES
// ---------------------------------------------------------------------------

const STATES = Object.freeze({
  INGESTED:      "INGESTED",
  STRUCTURED:    "STRUCTURED",
  PRECHECKED:    "PRECHECKED",
  NORMALIZED:    "NORMALIZED",
  TRANSLATED:    "TRANSLATED",
  RENDERING:     "RENDERING",
  CRITIQUED:     "CRITIQUED",
  DRIFT_CHECKED: "DRIFT_CHECKED",
  POSTCHECKED:   "POSTCHECKED",
  DECIDED:       "DECIDED",
  LOGGED:        "LOGGED",
  DONE:          "DONE",
  FAILED:        "FAILED",
  REVIEW:        "REVIEW",
  REJECTED:      "REJECTED",
});

// ---------------------------------------------------------------------------
// TRANSITION MAP
// ---------------------------------------------------------------------------

// Key = current state, Value = Set of valid next states.
// Every non-terminal, non-fail state can also transition to FAILED.

const HAPPY_PATH = [
  STATES.INGESTED,
  STATES.STRUCTURED,
  STATES.PRECHECKED,
  STATES.NORMALIZED,
  STATES.TRANSLATED,
  STATES.RENDERING,
  STATES.CRITIQUED,
  STATES.DRIFT_CHECKED,
  STATES.POSTCHECKED,
  STATES.DECIDED,
  STATES.LOGGED,
  STATES.DONE,
];

const TRANSITION_MAP = new Map();

// Build happy-path forward edges: each state → next state in sequence
for (let i = 0; i < HAPPY_PATH.length - 1; i++) {
  const from = HAPPY_PATH[i];
  const to = HAPPY_PATH[i + 1];
  if (!TRANSITION_MAP.has(from)) {
    TRANSITION_MAP.set(from, new Set());
  }
  TRANSITION_MAP.get(from).add(to);
}

// FAILED → LOGGED (mandatory audit even on failure)
TRANSITION_MAP.set(STATES.FAILED, new Set([STATES.LOGGED]));

// REVIEW → PRECHECKED (human gate resolved, re-enter precheck)
// REVIEW → FAILED     (human gate rejected)
TRANSITION_MAP.set(STATES.REVIEW, new Set([STATES.PRECHECKED, STATES.FAILED]));

// REJECTED → LOGGED (rejected jobs must still be audited)
TRANSITION_MAP.set(STATES.REJECTED, new Set([STATES.LOGGED]));

// PRECHECKED can also go to REVIEW (when precheck returns REVIEW decision)
TRANSITION_MAP.get(STATES.PRECHECKED).add(STATES.REVIEW);

// POSTCHECKED can also go to REJECTED
TRANSITION_MAP.get(STATES.POSTCHECKED).add(STATES.REJECTED);

// DECIDED can loop back to NORMALIZED for conditional refine (attempt < max)
TRANSITION_MAP.get(STATES.DECIDED).add(STATES.NORMALIZED);

// Every non-terminal state can transition to FAILED (except DONE, FAILED itself, LOGGED when after DONE path)
const TERMINAL_STATES = new Set([STATES.DONE]);
const FAIL_EXEMPT = new Set([STATES.DONE, STATES.FAILED]);

for (const state of Object.values(STATES)) {
  if (FAIL_EXEMPT.has(state)) continue;
  if (!TRANSITION_MAP.has(state)) {
    TRANSITION_MAP.set(state, new Set());
  }
  TRANSITION_MAP.get(state).add(STATES.FAILED);
}

// DONE is terminal — no outbound edges
TRANSITION_MAP.set(STATES.DONE, new Set());

// Freeze the map values
for (const [key, val] of TRANSITION_MAP) {
  TRANSITION_MAP.set(key, Object.freeze(val));
}

// ---------------------------------------------------------------------------
// ERRORS
// ---------------------------------------------------------------------------

class StateTransitionError extends Error {
  /**
   * @param {string} from    Current state
   * @param {string} to      Attempted target state
   * @param {string} job_id  Job identifier
   * @param {string} reason  Human-readable explanation
   */
  constructor(from, to, job_id, reason) {
    super(`[STATE_MACHINE] Transition denied: ${from} → ${to} | job=${job_id} | ${reason}`);
    this.name = "StateTransitionError";
    this.from = from;
    this.to = to;
    this.job_id = job_id;
    this.reason = reason;
  }
}

class InvalidStateError extends Error {
  constructor(state) {
    super(`[STATE_MACHINE] Unknown state: "${state}"`);
    this.name = "InvalidStateError";
    this.state = state;
  }
}

class MissingJobFieldError extends Error {
  constructor(field) {
    super(`[STATE_MACHINE] Job object missing required field: "${field}"`);
    this.name = "MissingJobFieldError";
    this.field = field;
  }
}

// ---------------------------------------------------------------------------
// VALIDATION
// ---------------------------------------------------------------------------

/**
 * Assert a string is a known state.
 * @param {string} state
 * @throws {InvalidStateError}
 */
function assertValidState(state) {
  if (!Object.values(STATES).includes(state)) {
    throw new InvalidStateError(state);
  }
}

/**
 * Validate that a transition from → to is legal.
 * @param {string} from  Current state
 * @param {string} to    Target state
 * @returns {boolean}
 */
function validateTransition(from, to) {
  assertValidState(from);
  assertValidState(to);

  const allowed = TRANSITION_MAP.get(from);
  if (!allowed) return false;
  return allowed.has(to);
}

/**
 * Get all valid next states from a given state.
 * @param {string} current
 * @returns {string[]}
 */
function getNextStates(current) {
  assertValidState(current);
  const allowed = TRANSITION_MAP.get(current);
  return allowed ? Array.from(allowed) : [];
}

/**
 * Check if a state is terminal (no outbound transitions).
 * @param {string} state
 * @returns {boolean}
 */
function isTerminal(state) {
  assertValidState(state);
  return TERMINAL_STATES.has(state);
}

// ---------------------------------------------------------------------------
// JOB VALIDATION
// ---------------------------------------------------------------------------

const REQUIRED_JOB_FIELDS = ["job_id", "status", "audit"];

/**
 * Assert job object has all required fields.
 * @param {Object} job
 * @throws {MissingJobFieldError}
 */
function assertValidJob(job) {
  if (!job || typeof job !== "object") {
    throw new MissingJobFieldError("job (null or not an object)");
  }
  for (const field of REQUIRED_JOB_FIELDS) {
    if (!(field in job)) {
      throw new MissingJobFieldError(field);
    }
  }
  if (!job.audit || !Array.isArray(job.audit.trace)) {
    throw new MissingJobFieldError("audit.trace (must be array)");
  }
}

// ---------------------------------------------------------------------------
// TRANSITION
// ---------------------------------------------------------------------------

/**
 * Apply a state transition to a job object.
 * Returns a shallow-copied job with updated status and appended audit trace.
 * Does NOT mutate the original job.
 *
 * @param {Object}  job        Job object (must contain job_id, status, audit.trace)
 * @param {string}  nextState  Target state
 * @param {Object}  [detail]   Optional detail payload for audit entry
 * @returns {Object}           New job object with updated state
 * @throws {StateTransitionError}  If transition is invalid
 * @throws {MissingJobFieldError}  If job is malformed
 * @throws {InvalidStateError}     If state is unknown
 */
function applyTransition(job, nextState, detail) {
  assertValidJob(job);
  assertValidState(nextState);

  const currentState = job.status;
  assertValidState(currentState);

  if (!validateTransition(currentState, nextState)) {
    throw new StateTransitionError(
      currentState,
      nextState,
      job.job_id,
      `Allowed from ${currentState}: [${getNextStates(currentState).join(", ")}]`
    );
  }

  const timestamp = new Date().toISOString();

  const traceEntry = {
    step: nextState,
    timestamp,
    result: nextState === STATES.FAILED ? "FAIL" : "OK",
  };

  if (detail !== undefined && detail !== null) {
    traceEntry.detail = detail;
  }

  // Shallow-copy job, deep-copy audit to avoid mutation
  const updatedJob = {
    ...job,
    status: nextState,
    audit: {
      ...job.audit,
      trace: [...job.audit.trace, traceEntry],
    },
  };

  return updatedJob;
}

// ---------------------------------------------------------------------------
// BATCH TRANSITION (multi-step convenience)
// ---------------------------------------------------------------------------

/**
 * Apply a sequence of transitions atomically.
 * If any transition fails, none are applied (returns error state).
 *
 * @param {Object}   job       Starting job object
 * @param {string[]} states    Ordered array of target states
 * @returns {Object}           Final job object after all transitions
 * @throws {StateTransitionError}
 */
function applyTransitionSequence(job, states) {
  let current = job;
  for (const nextState of states) {
    current = applyTransition(current, nextState);
  }
  return current;
}

// ---------------------------------------------------------------------------
// FAIL TRANSITION (convenience)
// ---------------------------------------------------------------------------

/**
 * Transition a job to FAILED state with reason.
 * Can be called from any non-terminal state.
 *
 * @param {Object} job
 * @param {string} reason
 * @returns {Object} Updated job in FAILED state
 */
function failJob(job, reason) {
  return applyTransition(job, STATES.FAILED, { reason });
}

/**
 * Transition a FAILED or REJECTED job through LOGGED → DONE.
 *
 * @param {Object} job  Must be in FAILED or REJECTED state
 * @returns {Object}    Job in DONE state
 */
function finalizeFailedJob(job) {
  let current = job;
  if (job.status === STATES.FAILED || job.status === STATES.REJECTED) {
    current = applyTransition(current, STATES.LOGGED);
  }
  current = applyTransition(current, STATES.DONE);
  return current;
}

// ---------------------------------------------------------------------------
// FACTORY
// ---------------------------------------------------------------------------

/**
 * Create a new job object in INGESTED state.
 *
 * @param {string} job_id
 * @param {Object} [meta]  Additional fields to merge into job
 * @returns {Object}
 */
function createJob(job_id, meta) {
  if (!job_id || typeof job_id !== "string") {
    throw new Error("[STATE_MACHINE] job_id must be a non-empty string");
  }

  const timestamp = new Date().toISOString();

  return {
    job_id,
    status: STATES.INGESTED,
    created_at: timestamp,
    updated_at: timestamp,
    audit: {
      trace: [
        {
          step: STATES.INGESTED,
          timestamp,
          result: "OK",
        },
      ],
      errors: [],
      review_reason: null,
    },
    ...(meta || {}),
  };
}

// ---------------------------------------------------------------------------
// INTROSPECTION (for monitoring / dashboards)
// ---------------------------------------------------------------------------

/**
 * Get full transition map as a plain object (for serialization / debugging).
 * @returns {Object<string, string[]>}
 */
function getTransitionMap() {
  const out = {};
  for (const [from, toSet] of TRANSITION_MAP) {
    out[from] = Array.from(toSet);
  }
  return out;
}

/**
 * Validate an entire audit trace for sequential consistency.
 * Returns null if valid, or an error description string if invalid.
 *
 * @param {Object[]} trace  Array of { step, timestamp, result }
 * @returns {string|null}
 */
function validateTrace(trace) {
  if (!Array.isArray(trace) || trace.length === 0) {
    return "Trace is empty or not an array";
  }

  for (let i = 0; i < trace.length - 1; i++) {
    const from = trace[i].step;
    const to = trace[i + 1].step;
    if (!validateTransition(from, to)) {
      return `Invalid transition at index ${i}: ${from} → ${to}`;
    }
  }

  return null;
}

// ---------------------------------------------------------------------------
// EXPORTS
// ---------------------------------------------------------------------------

module.exports = {
  STATES,
  TRANSITION_MAP,

  // Validation
  validateTransition,
  getNextStates,
  isTerminal,
  assertValidState,
  assertValidJob,

  // Transitions
  applyTransition,
  applyTransitionSequence,
  failJob,
  finalizeFailedJob,

  // Factory
  createJob,

  // Introspection
  getTransitionMap,
  validateTrace,

  // Errors
  StateTransitionError,
  InvalidStateError,
  MissingJobFieldError,
};
