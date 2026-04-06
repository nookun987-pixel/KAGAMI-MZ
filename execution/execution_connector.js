"use strict";

const fs = require("fs");
const path = require("path");
const { buildExecutionPacket } = require("./execution_packet_builder");
const { normalizeExecutionResponse } = require("./execution_result_normalizer");

const DEFAULT_EXECUTION_REGISTRY_PATH = path.join(__dirname, "..", "memory", "execution_registry.json");
const DEFAULT_RUNS_DIR = path.join(__dirname, "..", "runs");

function safeClone(value, fallback = null) {
  try {
    return JSON.parse(JSON.stringify(value));
  } catch (_) {
    return fallback;
  }
}

function getRegistryPath() {
  return process.env.EXECUTION_REGISTRY_PATH || DEFAULT_EXECUTION_REGISTRY_PATH;
}

function ensureRegistryFile() {
  try {
    const registryPath = getRegistryPath();
    const dir = path.dirname(registryPath);
    if (!fs.existsSync(dir)) fs.mkdirSync(dir, { recursive: true });
    if (!fs.existsSync(registryPath)) fs.writeFileSync(registryPath, "[]", "utf8");
    return registryPath;
  } catch (_) {
    return getRegistryPath();
  }
}

function readExecutionRegistry() {
  try {
    const parsed = JSON.parse(fs.readFileSync(ensureRegistryFile(), "utf8"));
    return Array.isArray(parsed) ? parsed : [];
  } catch (error) {
    console.warn(`[EXECUTION] Registry read error (non-fatal): ${error.message}`);
    return [];
  }
}

function writeExecutionRegistry(records) {
  try {
    fs.writeFileSync(ensureRegistryFile(), JSON.stringify(Array.isArray(records) ? records : [], null, 2), "utf8");
    return true;
  } catch (error) {
    console.warn(`[EXECUTION] Registry write error (non-fatal): ${error.message}`);
    return false;
  }
}

function appendExecutionRegistry(entry) {
  const records = readExecutionRegistry();
  records.push(entry);
  writeExecutionRegistry(records);
  return entry;
}

async function defaultBackend(packet) {
  const orchestrator = require("../orchestrator");
  if (typeof orchestrator.orchestrate !== "function") {
    throw new Error("orchestrator.orchestrate is not available");
  }
  return orchestrator.orchestrate(packet.spec && packet.spec.job_payload ? packet.spec.job_payload : {});
}

function normalizeTarget(target) {
  const value = String(target || "orchestrator_local").trim().toLowerCase();
  if (!value) return "orchestrator_local";

  if (
    value === "orchestrator_local" ||
    value === "local" ||
    value === "local_orchestrator" ||
    value === "default"
  ) {
    return "orchestrator_local";
  }

  if (
    value === "colab" ||
    value === "colab_runner" ||
    value === "colab_imagen" ||
    value === "cloud" ||
    value === "cloud_colab"
  ) {
    return "colab_runner";
  }

  if (
    value === "google" ||
    value === "google_imagen" ||
    value === "direct_imagen" ||
    value === "imagen_api"
  ) {
    return "direct_imagen";
  }

  return value;
}

function buildColabExecutionArgs(packet) {
  const job = safeClone(packet.spec && packet.spec.job_payload, {}) || {};
  const runId = packet.run_id || job.run_id || job.job_id || "RUN-UNKNOWN";
  const jobId = job.job_id || runId;
  const runDir = path.join(process.env.RUNS_DIR || DEFAULT_RUNS_DIR, runId);
  const resolvedLane = job.lane || job.shot_type || packet.lane || "unknown";
  const resolvedPrompt = job.prompt || job.structured_prompt || packet.spec && packet.spec.prompt || "";
  const resolvedIdea = job.idea || job.user_idea || resolvedPrompt || "";
  const resolvedTarget = job.execution_target || job.target || packet.target || null;
  const promptPackage = {
    shot_type: resolvedLane,
    structured_prompt: resolvedPrompt,
    negative_prompt: packet.spec && packet.spec.negative_prompt || "",
    render_spec: safeClone(job.render_spec || job.render || {}, {}),
  };

  return {
    job: {
      ...job,
      job_id: jobId,
      run_id: runId,
      lane: resolvedLane,
      shot_type: job.shot_type || resolvedLane,
      prompt: resolvedPrompt,
      idea: resolvedIdea,
      user_idea: job.user_idea || resolvedIdea,
      execution_target: resolvedTarget,
    },
    promptPackage,
    artifactPaths: {
      run_dir: runDir,
      output_png: path.join(runDir, "output.png"),
      render_payload: path.join(runDir, "render_job_payload.json"),
      final_payload: path.join(runDir, "final_payload.json"),
    },
  };
}

async function colabRunnerBackend(packet) {
  const { colabRunnerAdapter } = require("../renderers/colab_runner_adapter");
  if (typeof colabRunnerAdapter !== "function") {
    throw new Error("colabRunnerAdapter is not available");
  }

  const args = buildColabExecutionArgs(packet);
  return colabRunnerAdapter(args.job, args.promptPackage, args.artifactPaths);
}

async function directImagenBackend(packet) {
  const { renderExecutorAdapter } = require("../renderers/google_lane_adapter");
  if (typeof renderExecutorAdapter !== "function") {
    throw new Error("renderExecutorAdapter is not available");
  }

  const args = buildColabExecutionArgs(packet);
  return renderExecutorAdapter(args.job, args.promptPackage, args.artifactPaths);
}

function getDefaultTargetBackends() {
  return {
    orchestrator_local: defaultBackend,
    colab_runner: colabRunnerBackend,
    direct_imagen: directImagenBackend,
  };
}

function resolveBackend(packet, options = {}) {
  if (typeof options.backend === "function") {
    return options.backend;
  }

  const requestedTarget = normalizeTarget(packet && packet.target);
  const targetBackends = {
    ...getDefaultTargetBackends(),
    ...(options.targetBackends || {}),
  };

  if (typeof targetBackends[requestedTarget] === "function") {
    return targetBackends[requestedTarget];
  }

  return async () => ({
    status: "FAIL",
    error: `unsupported execution target: ${packet && packet.target ? packet.target : "unknown"}`,
    error_reason: `unsupported execution target: ${packet && packet.target ? packet.target : "unknown"}`,
    result_type: "execution_dispatch",
    run_id: packet && packet.run_id || null,
    attempt: packet && packet.attempt || null,
    target: packet && packet.target || null,
  });
}

async function dispatchExecution(context = {}, options = {}) {
  const packet = options.packet || buildExecutionPacket(context, options);
  const backend = resolveBackend(packet, options);
  try {
    const rawResponse = await backend(packet);
    const normalized = normalizeExecutionResponse(rawResponse, packet);
    appendExecutionRegistry({
      run_id: packet.run_id,
      attempt: packet.attempt,
      target: packet.target,
      packet,
      normalized_result: normalized,
      timestamp: new Date().toISOString(),
    });
    return {
      packet: safeClone(packet, null),
      normalized_result: normalized,
    };
  } catch (error) {
    const normalized = {
      status: "FAIL",
      transport_ok: false,
      execution_ok: false,
      result_type: null,
      artifacts: [],
      raw_response_present: false,
      raw_response: null,
      error_type: "TRANSPORT_FAILURE",
      error_reason: error.message,
      run_id: packet.run_id || null,
      attempt: packet.attempt || null,
      target: packet.target || null,
    };
    appendExecutionRegistry({
      run_id: packet.run_id,
      attempt: packet.attempt,
      target: packet.target,
      packet,
      normalized_result: normalized,
      timestamp: new Date().toISOString(),
    });
    return {
      packet: safeClone(packet, null),
      normalized_result: normalized,
    };
  }
}

module.exports = {
  DEFAULT_EXECUTION_REGISTRY_PATH,
  getRegistryPath,
  ensureRegistryFile,
  readExecutionRegistry,
  writeExecutionRegistry,
  normalizeTarget,
  resolveBackend,
  dispatchExecution,
};
