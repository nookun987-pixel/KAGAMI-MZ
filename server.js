#!/usr/bin/env node
/**
 * MIKAGE Runtime Server
 * Real service entrypoint with health and run endpoints
 */

"use strict";

require("dotenv").config();

const fs = require("fs");
const path = require("path");
const http = require("http");
const url = require("url");
const { prepareQueuedRun, executeQueuedRun } = require("./queue/task_queue_scheduler");
const { getQueueItem } = require("./queue/task_queue_authority");
const { getRunState } = require("./state/run_state_authority");
const { runOperatorTask } = require("./operator/mikage_operator_agent");
const {
  buildRequestAccessContext,
  evaluateProductionAccess,
} = require("./security/production_guard");
const {
  sweepExpiredClaims,
  repairOrphanRunningTasks,
  repairDanglingRunStates,
} = require("./stability/watchdog_sweeper");

const PORT = process.env.PORT || 3000;
const RUNS_DIR = process.env.RUNS_DIR || path.join(__dirname, "runs");

if (!fs.existsSync(RUNS_DIR)) {
  fs.mkdirSync(RUNS_DIR, { recursive: true });
}

const jobStatus = new Map();
let lastHealthCheck = null;
let healthCheckTimeout = null;

function getOrchestrator() {
  try {
    return require("./orchestrator");
  } catch (error) {
    return {
      runHealthCheck: async () => ({
        overall_status: "fail",
        timestamp: new Date().toISOString(),
        error: error.message,
        fooocus: { ok: false, error: error.message },
        ollama: { ok: false, error: error.message },
        notion: { ok: false, error: error.message },
      }),
    };
  }
}

async function tryRuntimeRoute(req, res, context) {
  try {
    const { tryHandleRuntimeRoute } = require("./server_runtime_patch");
    return tryHandleRuntimeRoute(req, res, context);
  } catch (error) {
    console.warn(`[SERVER] Runtime patch unavailable (non-fatal): ${error.message}`);
    return false;
  }
}

async function performHealthCheck() {
  try {
    const { runHealthCheck } = getOrchestrator();
    const validation = await runHealthCheck();
    const health = {
      status: validation.overall_status === "ok" ? "HEALTHY" : "DEGRADED",
      timestamp: validation.timestamp || new Date().toISOString(),
      services: {
        fooocus: {
          status: validation.fooocus && validation.fooocus.ok ? "UP" : "DOWN",
          detail: JSON.stringify(validation.fooocus || {}),
        },
        ollama: {
          status: validation.ollama && validation.ollama.ok ? "UP" : "DOWN",
          detail: JSON.stringify(validation.ollama || {}),
        },
        notion: {
          status: validation.notion && validation.notion.ok ? "UP" : "DOWN",
          detail: JSON.stringify(validation.notion || {}),
        },
      },
    };

    lastHealthCheck = health;
    return health;
  } catch (error) {
    const failHealth = {
      status: "FAIL",
      timestamp: new Date().toISOString(),
      error: error.message,
      services: {},
    };
    lastHealthCheck = failHealth;
    return failHealth;
  }
}

function readRunHistory() {
  if (!fs.existsSync(RUNS_DIR)) return [];
  return fs.readdirSync(RUNS_DIR)
    .map((name) => path.join(RUNS_DIR, name))
    .filter((runPath) => fs.statSync(runPath).isDirectory())
    .map((runPath) => {
      const jobId = path.basename(runPath);
      const finalDecisionPath = path.join(runPath, "final_decision.json");
      const summaryPath = path.join(runPath, "job_summary.json");
      const geminiPath = path.join(runPath, "gemini_validation.json");
      const outputPath = path.join(runPath, "output.png");
      let finalDecision = {};
      let summary = {};
      let gemini = {};

      try {
        if (fs.existsSync(finalDecisionPath)) finalDecision = JSON.parse(fs.readFileSync(finalDecisionPath, "utf-8"));
      } catch (_) {}

      try {
        if (fs.existsSync(summaryPath)) summary = JSON.parse(fs.readFileSync(summaryPath, "utf-8"));
      } catch (_) {}

      try {
        if (fs.existsSync(geminiPath)) gemini = JSON.parse(fs.readFileSync(geminiPath, "utf-8"));
      } catch (_) {}

      return {
        job_id: jobId,
        final_decision: finalDecision.decision || summary.decision || "UNKNOWN",
        fail_rules: finalDecision.failed_rules || summary.failed_rules || [],
        attempt_count: summary.attempt_count || finalDecision.attempt_count || 1,
        latest_output_preview: fs.existsSync(outputPath) ? `/runs/${jobId}/output.png` : null,
        material_read: gemini.material_read || null,
        drift_flags: gemini.wrong_reads || finalDecision.wrong_reads || [],
        timestamp: summary.timestamp || (fs.existsSync(finalDecisionPath) ? fs.statSync(finalDecisionPath).mtime.toISOString() : null),
      };
    })
    .sort((a, b) => String(b.timestamp || "").localeCompare(String(a.timestamp || "")));
}

async function getHealthCheck(forceRefresh = false) {
  if (!lastHealthCheck || forceRefresh) {
    await performHealthCheck();
    if (healthCheckTimeout) clearTimeout(healthCheckTimeout);
    healthCheckTimeout = setTimeout(() => {
      lastHealthCheck = null;
    }, 30000);
  }
  return lastHealthCheck;
}

function triggerBackgroundHealthCheck() {
  if (healthCheckTimeout) {
    return;
  }

  healthCheckTimeout = setTimeout(() => {
    healthCheckTimeout = null;
  }, 30000);

  setImmediate(() => {
    performHealthCheck().catch((error) => {
      console.error(`[HEALTH] Background health check error: ${error.message}`);
    });
  });
}

function parseJsonBody(req) {
  return new Promise((resolve, reject) => {
    let data = "";
    req.on("data", (chunk) => {
      data += chunk;
    });
    req.on("end", () => {
      try {
        resolve(JSON.parse(data));
      } catch (error) {
        reject(error);
      }
    });
    req.on("error", reject);
  });
}

function ensureRunDir(jobId) {
  const jobRunDir = path.join(RUNS_DIR, jobId);
  if (!fs.existsSync(jobRunDir)) {
    fs.mkdirSync(jobRunDir, { recursive: true });
  }
  return jobRunDir;
}

function buildJobId(body = {}) {
  return body.job_id || body.run_id || `JOB-${Date.now()}-${Math.random().toString(36).slice(2, 8).toUpperCase()}`;
}

function isLoopbackRequest(req) {
  const remote = req && req.socket && req.socket.remoteAddress;
  return remote === "127.0.0.1" || remote === "::1" || remote === "::ffff:127.0.0.1";
}

function persistRunArtifacts(jobRunDir, body, execution, queueItem, runState) {
  const requestFile = path.join(jobRunDir, "request.json");
  const responseFile = path.join(jobRunDir, "response.json");
  const summaryFile = path.join(jobRunDir, "summary.txt");
  const executionStepsFile = path.join(jobRunDir, "execution-steps.json");
  const validationFile = path.join(jobRunDir, "validation.json");

  fs.writeFileSync(requestFile, JSON.stringify(body, null, 2));
  fs.writeFileSync(responseFile, JSON.stringify({
    execution,
    queue: queueItem,
    run_state: runState,
  }, null, 2));

  if (fs.existsSync(path.join(__dirname, "execution-steps.json"))) {
    fs.copyFileSync(path.join(__dirname, "execution-steps.json"), executionStepsFile);
  }
  if (fs.existsSync(path.join(__dirname, "validation.json"))) {
    fs.copyFileSync(path.join(__dirname, "validation.json"), validationFile);
  }

  const result = execution.execution || execution || {};
  const summary = {
    job_id: result.job_id || body.job_id,
    status: queueItem && queueItem.status ? queueItem.status.toUpperCase() : (result.status || "UNKNOWN"),
    decision: result.decision || (result.operator_verdict === "DONE" ? "ALLOW" : "FAIL"),
    attempt_count: result.attempt_count,
    critic_score: result.critic_score,
    identity_score: result.identity_score,
    narrative_score: result.narrative_score,
    completed_at: new Date().toISOString(),
    output_files: result.output_files || [],
    rejected_samples: result.rejected_samples || [],
    queue_id: queueItem && queueItem.queue_id || null,
    run_id: runState && runState.run_id || null,
  };
  fs.writeFileSync(summaryFile, JSON.stringify(summary, null, 2));

  return {
    request: "/runs/" + body.job_id + "/request.json",
    response: "/runs/" + body.job_id + "/response.json",
    summary: "/runs/" + body.job_id + "/summary.txt",
    execution_steps: fs.existsSync(executionStepsFile) ? "/runs/" + body.job_id + "/execution-steps.json" : null,
    validation: fs.existsSync(validationFile) ? "/runs/" + body.job_id + "/validation.json" : null,
  };
}

async function handleRunRequest(req, res) {
  try {
    const body = await parseJsonBody(req);
    body.job_id = buildJobId(body);
    console.log(`[RUN RECEIVED] ${JSON.stringify(body)}`);
    const routePath = ((req && req.url) ? String(req.url).split("?")[0] : "") || "/run-task";
    const useLocalRelaxedAccess = isLoopbackRequest(req)
      && !body.auth_token
      && !body.request_signature
      && !body.caller_id;
    const accessDecision = evaluateProductionAccess(
      buildRequestAccessContext(req, body, routePath === "/run" ? "/run-task" : routePath),
      { policy: useLocalRelaxedAccess ? { env_mode: "dev" } : body.auth_policy }
    );
    if (!accessDecision.allowed) {
      sendJsonResponse(res, 403, accessDecision);
      return;
    }

    const jobId = body.job_id;
    const workerId = body.worker_id || `server_${process.pid}`;
    const jobRunDir = ensureRunDir(jobId);

    sweepExpiredClaims();
    repairOrphanRunningTasks();
    repairDanglingRunStates();

    const prepared = prepareQueuedRun(body, {
      worker_id: workerId,
      request_source: "server",
      task_type: "run_render_task",
    });
    const queueItem = prepared.queue_item;
    const runState = prepared.run_state;

    if (!prepared.ok || !queueItem || !runState) {
      sendJsonResponse(res, 500, { error: prepared.reason || "Failed to queue run" });
      return;
    }

    if (prepared.duplicate && ["queued", "claimed", "running"].includes(queueItem.status)) {
      jobStatus.set(jobId, {
        status: queueItem.status.toUpperCase(),
        decision: null,
        queue_id: queueItem.queue_id,
        run_id: runState.run_id,
        updated_at: new Date().toISOString(),
      });
      sendJsonResponse(res, 202, {
        job_id: jobId,
        status: queueItem.status.toUpperCase(),
        duplicate_active: true,
        queue_id: queueItem.queue_id,
        run_id: runState.run_id,
      });
      return;
    }

    jobStatus.set(jobId, {
      status: "QUEUED",
      decision: null,
      started_at: new Date().toISOString(),
      queue_id: queueItem.queue_id,
      run_id: runState.run_id,
    });

    console.log(`[RUN QUEUED] job_id=${jobId} queue_id=${queueItem.queue_id} run_id=${runState.run_id}`);
    sendJsonResponse(res, 202, {
      status: "queued",
      job_id: jobId,
      queue_id: queueItem.queue_id,
      run_id: runState.run_id,
    });

    setImmediate(async () => {
      console.log(`[RUN DISPATCH START] job_id=${jobId} queue_id=${queueItem.queue_id} run_id=${runState.run_id}`);
      try {
        const execution = await executeQueuedRun(body, {
          queue_id: queueItem.queue_id,
          worker_id: workerId,
          task_type: "run_render_task",
          executor: async ({ queue_item, run_state, worker_id }) => runOperatorTask({
            task_id: queue_item.queue_id,
            task_type: "run_render_task",
            payload: {
              ...body,
              queue_id: queue_item.queue_id,
              run_id: run_state.run_id,
              worker_id,
              _prior_run_state: run_state,
            },
          }),
        });

        const finalizedQueue = getQueueItem(queueItem.queue_id);
        const finalizedRun = getRunState(runState.run_id);
        persistRunArtifacts(jobRunDir, body, execution, finalizedQueue, finalizedRun);
        const result = execution.execution || {};
        const publicStatus = finalizedQueue && finalizedQueue.status ? finalizedQueue.status.toUpperCase() : "DONE";
        const publicDecision = result.decision || (result.operator_verdict === "DONE" ? "ALLOW" : "FAIL");

        jobStatus.set(jobId, {
          status: publicStatus,
          decision: publicDecision,
          completed_at: new Date().toISOString(),
          queue_id: queueItem.queue_id,
          run_id: runState.run_id,
        });
      } catch (runError) {
        console.error(`[RUN DISPATCH ERROR] job_id=${jobId} queue_id=${queueItem.queue_id} run_id=${runState.run_id} error=${runError.message}`);
        const errorFile = path.join(jobRunDir, "error.json");
        fs.writeFileSync(errorFile, JSON.stringify({
          error: runError.message,
          stack: runError.stack,
          timestamp: new Date().toISOString(),
        }, null, 2));

        jobStatus.set(jobId, {
          status: "FAIL",
          decision: "FAIL",
          error: runError.message,
          failed_at: new Date().toISOString(),
          queue_id: queueItem.queue_id,
          run_id: runState.run_id,
        });
      }
    });
  } catch (_) {
    sendJsonResponse(res, 400, { error: "Invalid JSON payload" });
  }
}

function handleRunsRequest(req, res, jobId) {
  const jobRunDir = path.join(RUNS_DIR, jobId);
  if (!fs.existsSync(jobRunDir)) {
    sendJsonResponse(res, 404, { error: "Job not found" });
    return;
  }

  const artifacts = {};
  const files = fs.readdirSync(jobRunDir);
  for (const file of files) {
    const filePath = path.join(jobRunDir, file);
    const stats = fs.statSync(filePath);
    artifacts[file] = {
      size: stats.size,
      modified: stats.mtime.toISOString(),
      url: `/runs/${jobId}/${file}`,
    };
  }

  const status = jobStatus.get(jobId) || { status: "UNKNOWN", decision: null };
  sendJsonResponse(res, 200, {
    job_id: jobId,
    status: status.status,
    decision: status.decision,
    queue_id: status.queue_id || null,
    run_id: status.run_id || null,
    artifacts,
  });
}

function handleDashboardData(req, res) {
  sendJsonResponse(res, 200, {
    runs: readRunHistory(),
  });
}

function handleArtifactRequest(req, res, jobId, filename) {
  const filePath = path.join(RUNS_DIR, jobId, filename);
  if (!fs.existsSync(filePath)) {
    sendJsonResponse(res, 404, { error: "Artifact not found" });
    return;
  }

  const stats = fs.statSync(filePath);
  const ext = path.extname(filename).toLowerCase();
  const contentTypes = {
    ".json": "application/json",
    ".txt": "text/plain",
    ".png": "image/png",
    ".jpg": "image/jpeg",
    ".jpeg": "image/jpeg",
  };
  const contentType = contentTypes[ext] || "application/octet-stream";

  res.writeHead(200, {
    "Content-Type": contentType,
    "Content-Length": stats.size,
    "Access-Control-Allow-Origin": "*",
  });

  fs.createReadStream(filePath).pipe(res);
}

function sendJsonResponse(res, statusCode, data) {
  res.writeHead(statusCode, {
    "Content-Type": "application/json",
    "Access-Control-Allow-Origin": "*",
  });
  res.end(JSON.stringify(data, null, 2));
}

function handleCors(res) {
  res.writeHead(200, {
    "Access-Control-Allow-Origin": "*",
    "Access-Control-Allow-Methods": "GET, POST, OPTIONS",
    "Access-Control-Allow-Headers": "Content-Type",
  });
  res.end();
}

async function handleRequest(req, res) {
  const parsedUrl = url.parse(req.url, true);
  const pathname = parsedUrl.pathname;

  if (req.method === "OPTIONS") {
    handleCors(res);
    return;
  }

  if (await tryRuntimeRoute(req, res, { pathname, sendJsonResponse })) {
    return;
  }

  if (req.method === "GET" && pathname === "/") {
    console.log("[ROOT] GET /");
    triggerBackgroundHealthCheck();
    sendJsonResponse(res, 200, { status: "up" });
    return;
  }

  if (req.method === "GET" && pathname === "/health") {
    console.log("[HEALTH] GET /health");
    triggerBackgroundHealthCheck();
    sendJsonResponse(res, 200, { status: "ok" });
    return;
  }

  if (req.method === "GET" && pathname === "/dashboard-data") {
    handleDashboardData(req, res);
    return;
  }

  if (req.method === "POST" && (pathname === "/run" || pathname === "/run-task")) {
    await handleRunRequest(req, res);
    return;
  }

  if (req.method === "GET" && pathname.startsWith("/runs/")) {
    const parts = pathname.split("/").filter(Boolean);
    if (parts.length === 2) {
      handleRunsRequest(req, res, parts[1]);
      return;
    }
    if (parts.length === 3) {
      handleArtifactRequest(req, res, parts[1], parts[2]);
      return;
    }
  }

  sendJsonResponse(res, 404, { error: "Endpoint not found" });
}

function createServer() {
  return http.createServer(handleRequest);
}

if (require.main === module) {
  const server = createServer();
  server.listen(PORT, () => {
    console.log(`Mikage Runtime Server started on port ${PORT}`);
    console.log(`Health: http://localhost:${PORT}/health`);
    console.log(`Homepage: http://localhost:${PORT}/`);
    console.log(`Run API: http://localhost:${PORT}/run`);
    console.log(`Artifacts: http://localhost:${PORT}/runs/:job_id`);

    performHealthCheck().then((health) => {
      console.log(`Initial health check: ${health.status}`);
    }).catch((err) => {
      console.error(`Initial health check failed: ${err.message}`);
    });
  });

  process.on("SIGTERM", () => {
    console.log("SIGTERM received, shutting down gracefully");
    server.close(() => {
      console.log("Server closed");
      process.exit(0);
    });
  });

  process.on("SIGINT", () => {
    console.log("SIGINT received, shutting down gracefully");
    server.close(() => {
      console.log("Server closed");
      process.exit(0);
    });
  });
}

module.exports = {
  createServer,
  handleRequest,
  handleRunRequest,
};
