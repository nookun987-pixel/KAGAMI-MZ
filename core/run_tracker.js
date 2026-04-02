"use strict";

/**
 * MIKAGE — /core/run_tracker.js
 * Lightweight run-level state tracker backed by core/state_machine.js.
 *
 * Wraps state_machine transitions into a per-run context.
 * The orchestrator calls tracker methods instead of setting status strings directly.
 *
 * Usage:
 *   const tracker = createRunTracker(job_id);
 *   tracker.advance("STRUCTURED");    // INGESTED → STRUCTURED
 *   tracker.advance("PRECHECKED");    // STRUCTURED → PRECHECKED
 *   tracker.fail("render timeout");   // any → FAILED
 *   tracker.getState();               // "FAILED"
 *   tracker.getTrace();               // [{ step, timestamp, result }]
 */

const {
  STATES,
  applyTransition,
  failJob,
  finalizeFailedJob,
  createJob,
  validateTransition,
} = require("./state_machine");

/**
 * Create a new run tracker for a job.
 * The tracker holds an in-memory job object and enforces all transitions.
 *
 * @param {string} jobId
 * @returns {{ advance, fail, finalize, getState, getTrace, getJob }}
 */
function createRunTracker(jobId) {
  let job = createJob(jobId);

  return {
    /**
     * Advance to the next state. Throws if transition is invalid.
     */
    advance(nextState, detail) {
      job = applyTransition(job, nextState, detail);
      return job.status;
    },

    /**
     * Transition to FAILED state with a reason.
     */
    fail(reason) {
      job = failJob(job, reason);
      return job.status;
    },

    /**
     * Finalize a FAILED or REJECTED job through LOGGED → DONE.
     */
    finalize() {
      job = finalizeFailedJob(job);
      return job.status;
    },

    /**
     * Check if a transition is valid without applying it.
     */
    canAdvance(nextState) {
      return validateTransition(job.status, nextState);
    },

    /**
     * Get current state.
     */
    getState() {
      return job.status;
    },

    /**
     * Get the full audit trace.
     */
    getTrace() {
      return job.audit.trace;
    },

    /**
     * Get the underlying job object (for serialization).
     */
    getJob() {
      return { ...job };
    },
  };
}

/**
 * Map from orchestrator pipeline stages to state machine states.
 * Used to translate orchestrator flow into formal transitions.
 */
const PIPELINE_STATE_MAP = Object.freeze({
  intake:       STATES.INGESTED,
  structured:   STATES.STRUCTURED,
  prechecked:   STATES.PRECHECKED,
  normalized:   STATES.NORMALIZED,
  translated:   STATES.TRANSLATED,
  rendering:    STATES.RENDERING,
  critiqued:    STATES.CRITIQUED,
  drift_checked:STATES.DRIFT_CHECKED,
  postchecked:  STATES.POSTCHECKED,
  decided:      STATES.DECIDED,
  logged:       STATES.LOGGED,
  done:         STATES.DONE,
  failed:       STATES.FAILED,
  review:       STATES.REVIEW,
  rejected:     STATES.REJECTED,
});

module.exports = {
  createRunTracker,
  PIPELINE_STATE_MAP,
  STATES,
};
