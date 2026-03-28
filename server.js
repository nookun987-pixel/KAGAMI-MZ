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
const { tryHandleRuntimeRoute } = require("./server_runtime_patch");

// Import orchestrator functions
const { orchestrate: run, runHealthCheck } = require("./orchestrator");

// Configuration
const PORT = process.env.PORT || 3000;
const RUNS_DIR = process.env.RUNS_DIR || path.join(__dirname, "runs");

// Ensure runs directory exists
if (!fs.existsSync(RUNS_DIR)) {
  fs.mkdirSync(RUNS_DIR, { recursive: true });
}

// In-memory job tracking
const jobStatus = new Map();

// Health check cache
let lastHealthCheck = null;
let healthCheckTimeout = null;

/**
 * Perform real health check using orchestrator's startupValidation
 */
async function performHealthCheck() {
  try {
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
      services: {}
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
        if (fs.existsSync(finalDecisionPath)) {
          finalDecision = JSON.parse(fs.readFileSync(finalDecisionPath, "utf-8"));
        }
      } catch (_) {}

      try {
        if (fs.existsSync(summaryPath)) {
          summary = JSON.parse(fs.readFileSync(summaryPath, "utf-8"));
        }
      } catch (_) {}

      try {
        if (fs.existsSync(geminiPath)) {
          gemini = JSON.parse(fs.readFileSync(geminiPath, "utf-8"));
        }
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

/**
 * Get cached health check or perform new one
 */
async function getHealthCheck(forceRefresh = false) {
  if (!lastHealthCheck || forceRefresh) {
    await performHealthCheck();

    // Cache for 30 seconds
    if (healthCheckTimeout) clearTimeout(healthCheckTimeout);
    healthCheckTimeout = setTimeout(() => {
      lastHealthCheck = null;
    }, 30000);
  }

  return lastHealthCheck;
}

/**
 * Handle POST /run - execute a job
 */
async function handleRunRequest(req, res) {
  try {
    // Parse request body
    const body = await new Promise((resolve, reject) => {
      let data = "";
      req.on("data", chunk => data += chunk);
      req.on("end", () => {
        try {
          resolve(JSON.parse(data));
        } catch (err) {
          reject(err);
        }
      });
      req.on("error", reject);
    });

    // Validate job payload
    if (!body.job_id) {
      sendJsonResponse(res, 400, { error: "Missing job_id" });
      return;
    }

    const jobId = body.job_id;
    const jobRunDir = path.join(RUNS_DIR, jobId);

    // Create job run directory
    if (!fs.existsSync(jobRunDir)) {
      fs.mkdirSync(jobRunDir, { recursive: true });
    }

    // Save request payload
    const requestFile = path.join(jobRunDir, "request.json");
    fs.writeFileSync(requestFile, JSON.stringify(body, null, 2));

    // Update job status
    jobStatus.set(jobId, {
      status: "RUNNING",
      decision: null,
      started_at: new Date().toISOString()
    });

    // Run orchestrator
    try {
      const result = await run(body);

      // Save response and artifacts
      const responseFile = path.join(jobRunDir, "response.json");
      fs.writeFileSync(responseFile, JSON.stringify(result, null, 2));

      // Save execution steps if available
      const executionStepsFile = path.join(jobRunDir, "execution-steps.json");
      if (fs.existsSync(path.join(__dirname, "execution-steps.json"))) {
        fs.copyFileSync(
          path.join(__dirname, "execution-steps.json"),
          executionStepsFile
        );
      }

      // Save validation if available
      const validationFile = path.join(jobRunDir, "validation.json");
      if (fs.existsSync(path.join(__dirname, "validation.json"))) {
        fs.copyFileSync(
          path.join(__dirname, "validation.json"),
          validationFile
        );
      }

      // Create summary
      const summary = {
        job_id: result.job_id,
        status: result.status,
        decision: result.decision,
        attempt_count: result.attempt_count,
        critic_score: result.critic_score,
        identity_score: result.identity_score,
        narrative_score: result.narrative_score,
        completed_at: new Date().toISOString(),
        output_files: result.output_files || [],
        rejected_samples: result.rejected_samples || []
      };

      const summaryFile = path.join(jobRunDir, "summary.txt");
      fs.writeFileSync(summaryFile, JSON.stringify(summary, null, 2));

      // Update job status
      jobStatus.set(jobId, {
        status: "DONE",
        decision: result.decision,
        completed_at: new Date().toISOString()
      });

      sendJsonResponse(res, 200, {
        job_id: jobId,
        status: "DONE",
        decision: result.decision,
        artifacts: {
          request: "/runs/" + jobId + "/request.json",
          response: "/runs/" + jobId + "/response.json",
          summary: "/runs/" + jobId + "/summary.txt",
          execution_steps: fs.existsSync(executionStepsFile) ? "/runs/" + jobId + "/execution-steps.json" : null,
          validation: fs.existsSync(validationFile) ? "/runs/" + jobId + "/validation.json" : null
        }
      });

    } catch (runError) {
      // Save error
      const errorFile = path.join(jobRunDir, "error.json");
      fs.writeFileSync(errorFile, JSON.stringify({
        error: runError.message,
        stack: runError.stack,
        timestamp: new Date().toISOString()
      }, null, 2));

      jobStatus.set(jobId, {
        status: "FAIL",
        decision: "FAIL",
        error: runError.message,
        failed_at: new Date().toISOString()
      });

      sendJsonResponse(res, 500, {
        job_id: jobId,
        status: "FAIL",
        decision: "FAIL",
        error: runError.message
      });
    }

  } catch (parseError) {
    sendJsonResponse(res, 400, { error: "Invalid JSON payload" });
  }
}

/**
 * Handle GET /runs/:job_id - return artifact metadata
 */
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
      url: `/runs/${jobId}/${file}`
    };
  }

  const status = jobStatus.get(jobId) || { status: "UNKNOWN", decision: null };

  sendJsonResponse(res, 200, {
    job_id: jobId,
    status: status.status,
    decision: status.decision,
    artifacts: artifacts
  });
}

function handleDashboardData(req, res) {
  sendJsonResponse(res, 200, {
    runs: readRunHistory(),
  });
}

/**
 * Handle GET /runs/:job_id/:file - serve artifact files
 */
function handleArtifactRequest(req, res, jobId, filename) {
  const filePath = path.join(RUNS_DIR, jobId, filename);

  if (!fs.existsSync(filePath)) {
    sendJsonResponse(res, 404, { error: "Artifact not found" });
    return;
  }

  const stats = fs.statSync(filePath);
  const ext = path.extname(filename).toLowerCase();

  // Set content type based on file extension
  const contentTypes = {
    ".json": "application/json",
    ".txt": "text/plain",
    ".png": "image/png",
    ".jpg": "image/jpeg",
    ".jpeg": "image/jpeg"
  };

  const contentType = contentTypes[ext] || "application/octet-stream";

  res.writeHead(200, {
    "Content-Type": contentType,
    "Content-Length": stats.size,
    "Access-Control-Allow-Origin": "*"
  });

  const stream = fs.createReadStream(filePath);
  stream.pipe(res);
}

/**
 * Send JSON response
 */
function sendJsonResponse(res, statusCode, data) {
  res.writeHead(statusCode, {
    "Content-Type": "application/json",
    "Access-Control-Allow-Origin": "*"
  });
  res.end(JSON.stringify(data, null, 2));
}

/**
 * Handle CORS preflight
 */
function handleCors(res) {
  res.writeHead(200, {
    "Access-Control-Allow-Origin": "*",
    "Access-Control-Allow-Methods": "GET, POST, OPTIONS",
    "Access-Control-Allow-Headers": "Content-Type"
  });
  res.end();
}

/**
 * Main request handler
 */
async function handleRequest(req, res) {
  const parsedUrl = url.parse(req.url, true);
  const pathname = parsedUrl.pathname;

  // CORS preflight
  if (req.method === "OPTIONS") {
    handleCors(res);
    return;
  }

  if (await tryHandleRuntimeRoute(req, res, { pathname, sendJsonResponse })) {
    return;
  }

  // Routes
  if (req.method === "GET" && pathname === "/") {
    // Homepage with VM and API status
    const health = await getHealthCheck();

    res.writeHead(200, { "Content-Type": "text/html" });
    res.end(`
<!DOCTYPE html>
<html>
<head>
    <title>Mikage Runtime</title>
    <style>
        body { font-family: Arial, sans-serif; margin: 40px; background: #f5f5f5; }
        .container { max-width: 800px; margin: 0 auto; background: white; padding: 30px; border-radius: 8px; box-shadow: 0 2px 10px rgba(0,0,0,0.1); }
        .status { padding: 15px; border-radius: 5px; margin: 10px 0; }
        .healthy { background: #d4edda; color: #155724; border: 1px solid #c3e6cb; }
        .degraded { background: #fff3cd; color: #856404; border: 1px solid #ffeaa7; }
        .fail { background: #f8d7da; color: #721c24; border: 1px solid #f5c6cb; }
        .service { margin: 5px 0; padding: 8px; background: #f8f9fa; border-radius: 3px; }
        .up { color: #28a745; }
        .down { color: #dc3545; }
        h1 { color: #333; }
        .endpoint { background: #e9ecef; padding: 10px; border-radius: 3px; font-family: monospace; margin: 5px 0; }
    </style>
</head>
<body>
    <div class="container">
        <h1>🎭 Mikage Runtime</h1>

        <div class="status ${health.status.toLowerCase()}">
            <strong>VM Status:</strong> ${health.status}<br>
            <strong>API Status:</strong> Online<br>
            <strong>Last Health Check:</strong> ${health.timestamp}
        </div>

        <h3>Service Health</h3>
        ${Object.entries(health.services).map(([name, service]) => `
            <div class="service">
                <strong>${name}:</strong>
                <span class="${service.status === "UP" ? "up" : "down"}">${service.status}</span>
                <br><small>${service.detail}</small>
            </div>
        `).join("")}

        <h3>API Endpoints</h3>
        <div class="endpoint">GET /health - Service health check</div>
        <div class="endpoint">POST /run - Submit job for execution</div>
        <div class="endpoint">GET /runs/:job_id - Get job artifacts metadata</div>
        <div class="endpoint">GET /runs/:job_id/:file - Download artifact file</div>
        <div class="endpoint">GET /dashboard-data - Real run history from filesystem</div>

        <h3>Active Jobs</h3>
        <p>Currently tracking ${jobStatus.size} job(s)</p>

        <h3>Recent Runs</h3>
        ${readRunHistory().slice(0, 10).map((run) => `
            <div class="service">
                <strong>${run.job_id}</strong><br>
                decision: ${run.final_decision}<br>
                fail rules: ${(run.fail_rules || []).join(", ") || "none"}<br>
                attempts: ${run.attempt_count}<br>
                material read: ${run.material_read || "n/a"}<br>
                drift flags: ${(run.drift_flags || []).join(", ") || "none"}
            </div>
        `).join("")}
    </div>
</body>
</html>
    `);
    return;
  }

  if (req.method === "GET" && pathname === "/health") {
    const health = await getHealthCheck();
    sendJsonResponse(res, 200, health);
    return;
  }

  if (req.method === "GET" && pathname === "/dashboard-data") {
    handleDashboardData(req, res);
    return;
  }

  if (req.method === "POST" && pathname === "/run") {
    await handleRunRequest(req, res);
    return;
  }

  if (req.method === "GET" && pathname.startsWith("/runs/")) {
    const parts = pathname.split("/").filter(Boolean);

    if (parts.length === 2) {
      // /runs/:job_id
      handleRunsRequest(req, res, parts[1]);
      return;
    }

    if (parts.length === 3) {
      // /runs/:job_id/:file
      handleArtifactRequest(req, res, parts[1], parts[2]);
      return;
    }
  }

  // 404
  sendJsonResponse(res, 404, { error: "Endpoint not found" });
}

/**
 * Start server
 */
const server = http.createServer(handleRequest);

server.listen(PORT, () => {
  console.log(`🎭 Mikage Runtime Server started on port ${PORT}`);
  console.log(`📊 Health: http://localhost:${PORT}/health`);
  console.log(`🏠 Homepage: http://localhost:${PORT}/`);
  console.log(`🚀 Run API: http://localhost:${PORT}/run`);
  console.log(`📁 Artifacts: http://localhost:${PORT}/runs/:job_id`);

  // Perform initial health check
  performHealthCheck().then(health => {
    console.log(`🩺 Initial health check: ${health.status}`);
  }).catch(err => {
    console.error(`❌ Initial health check failed: ${err.message}`);
  });
});

// Graceful shutdown
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