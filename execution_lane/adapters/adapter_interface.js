/**
 * execution_lane/adapters/adapter_interface.js
 * PHASE 4 — Adapter Interface
 *
 * Abstract pattern that all execution adapters must follow.
 * Brain decides. Execution only executes. No validator/judge inside execution.
 */

"use strict";

/**
 * BaseAdapter — all execution adapters extend this.
 *
 * Required methods:
 *   name()         → string     — adapter identifier
 *   available()    → boolean    — whether the adapter can execute right now
 *   execute(spec)  → result     — execute the patched job spec, return execution result
 *
 * The execute() method must return the shape from buildExecutionResult().
 * It must NOT run validators, judges, or canon promotion.
 * It must NOT retry on failure.
 * It must NOT modify the input spec.
 */
class BaseAdapter {
  /**
   * @returns {string} Unique adapter name
   */
  name() {
    throw new Error("BaseAdapter.name() must be overridden");
  }

  /**
   * @returns {boolean} Whether this adapter can accept execution requests right now
   */
  available() {
    return false;
  }

  /**
   * Execute a validated patched_job_spec.
   * @param {object} spec — validated patched_job_spec object
   * @param {string} executionId — unique execution ID
   * @returns {object} execution result conforming to buildExecutionResult shape
   */
  execute(spec, executionId) {
    throw new Error("BaseAdapter.execute() must be overridden");
  }
}

module.exports = { BaseAdapter };
