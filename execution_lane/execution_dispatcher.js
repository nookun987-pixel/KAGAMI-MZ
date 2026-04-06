/**
 * execution_lane/execution_dispatcher.js
 * PHASE 4 — Execution Dispatcher
 *
 * Routes a validated patched_job_spec to the correct execution adapter.
 * Fail closed on unavailable lane or invalid contract.
 *
 * Brain decides. Execution only executes. No validator/judge inside execution.
 * No canon promotion. No auto retry. No second patch loop.
 */

"use strict";

const fs = require("fs");
const path = require("path");

const { validatePatchedJobSpec, buildExecutionResult } = require("./execution_result_contract");
const { ColabRunnerAdapter } = require("./adapters/colab_adapter");
// NOTE: FooocusAdapter removed — local Fooocus path killed. Colab = job runner, Google = render.
const { DryRunAdapter } = require("./adapters/dry_run_adapter");

const ROOT_DIR = path.resolve(__dirname, "..");
const RUNS_DIR = path.join(ROOT_DIR, "runs");

// ---------------------------------------------------------------------------
// ADAPTER REGISTRY
// Add new adapters here. First available adapter wins.
// Order = priority: production adapters first, dry_run last as fallback.
// ---------------------------------------------------------------------------
const ADAPTER_REGISTRY = [
  new ColabRunnerAdapter(),
  new DryRunAdapter(),
];

// ---------------------------------------------------------------------------
// FIND LATEST PATCHED JOB SPEC
// Scans runs/ for patched_job_spec.json, returns most recent.
// ---------------------------------------------------------------------------
function findLatestPatchedJobSpec() {
  if (!fs.existsSync(RUNS_DIR)) return null;

  const candidates = [];
  const entries = fs.readdirSync(RUNS_DIR);

  for (const dir of entries) {
    const specPath = path.join(RUNS_DIR, dir, "patched_job_spec.json");
    if (!fs.existsSync(specPath)) continue;

    try {
      const stat = fs.statSync(specPath);
      candidates.push({ dir, specPath, mtime: stat.mtimeMs });
    } catch { continue; }
  }

  if (candidates.length === 0) return null;
  candidates.sort((a, b) => b.mtime - a.mtime);
  return candidates[0];
}

// ---------------------------------------------------------------------------
// RESOLVE ADAPTER
// Returns the first available adapter, or null.
// For async adapters (like fooocus), uses checkAvailableAsync if present.
// ---------------------------------------------------------------------------
function resolveAdapterSync() {
  for (const adapter of ADAPTER_REGISTRY) {
    if (adapter.available()) {
      return adapter;
    }
  }
  return null;
}

async function resolveAdapterAsync() {
  for (const adapter of ADAPTER_REGISTRY) {
    if (typeof adapter.checkAvailableAsync === "function") {
      const ok = await adapter.checkAvailableAsync();
      if (ok) return adapter;
    } else if (adapter.available()) {
      return adapter;
    }
  }
  return null;
}

// ---------------------------------------------------------------------------
// DISPATCH EXECUTION
// Main entry point. Returns execution result contract.
// Async to support real render adapters that make HTTP calls.
// ---------------------------------------------------------------------------
async function dispatchExecution(executionId) {
  console.log(`[EXEC_DISPATCH] Starting execution ${executionId}`);

  // 1. Find latest patched_job_spec
  const found = findLatestPatchedJobSpec();
  if (!found) {
    console.log(`[EXEC_DISPATCH] No patched_job_spec.json found`);
    return buildExecutionResult({
      execution_id: executionId,
      adapter_name: null,
      execution_state: "REJECTED",
      error: "No patched_job_spec.json found in any run directory",
    });
  }
  console.log(`[EXEC_DISPATCH] Found spec: ${found.dir}`);

  // 2. Load spec
  let spec;
  try {
    spec = JSON.parse(fs.readFileSync(found.specPath, "utf-8"));
  } catch (err) {
    return buildExecutionResult({
      execution_id: executionId,
      source_run_id: found.dir,
      adapter_name: null,
      execution_state: "FAILED",
      error: `Cannot parse patched_job_spec.json: ${err.message}`,
    });
  }

  // 3. Validate contract
  const validation = validatePatchedJobSpec(spec);
  if (!validation.ok) {
    console.log(`[EXEC_DISPATCH] Contract validation FAILED: ${validation.errors.join(", ")}`);
    return buildExecutionResult({
      execution_id: executionId,
      patched_job_id: spec.job_spec ? spec.job_spec.job_id : null,
      source_run_id: found.dir,
      adapter_name: null,
      execution_state: "REJECTED",
      error: `Contract validation failed: ${validation.errors.join("; ")}`,
    });
  }
  console.log(`[EXEC_DISPATCH] Contract valid`);

  // 4. Resolve adapter (async — checks fooocus health)
  const adapter = await resolveAdapterAsync();
  if (!adapter) {
    console.log(`[EXEC_DISPATCH] No available adapter`);
    return buildExecutionResult({
      execution_id: executionId,
      patched_job_id: spec.job_spec.job_id,
      source_run_id: found.dir,
      adapter_name: null,
      execution_state: "EXECUTION_UNAVAILABLE",
      error: "No execution adapter available",
    });
  }
  console.log(`[EXEC_DISPATCH] Adapter resolved: ${adapter.name()}`);

  // 5. Execute (no retry, no second loop)
  let result;
  try {
    result = await adapter.execute(spec, executionId);
  } catch (err) {
    console.error(`[EXEC_DISPATCH] Adapter crash: ${err.message}`);
    result = buildExecutionResult({
      execution_id: executionId,
      patched_job_id: spec.job_spec.job_id,
      source_run_id: found.dir,
      adapter_name: adapter.name(),
      execution_state: "FAILED",
      error: `Adapter crash: ${err.message}`,
    });
  }

  // 6. Write execution_result.json to source run directory
  const resultPath = path.join(RUNS_DIR, found.dir, "execution_result.json");
  try {
    fs.writeFileSync(resultPath, JSON.stringify(result, null, 2), "utf-8");
    console.log(`[EXEC_DISPATCH] Written: ${resultPath}`);
    if (!result.artifacts) result.artifacts = [];
    result.artifacts.push(resultPath);
  } catch (err) {
    console.error(`[EXEC_DISPATCH] Failed to write execution_result.json: ${err.message}`);
  }

  return result;
}

module.exports = {
  dispatchExecution,
  findLatestPatchedJobSpec,
  resolveAdapterSync,
  resolveAdapterAsync,
  ADAPTER_REGISTRY,
};
