"use strict";

const fs = require("fs");
const http = require("http");
const path = require("path");

const config = require("./local_control_agent/config");
const service = require("./commander_service");
const { startTelegramBot } = require("./telegram_bot");
const { parseBody, sendJson, handleApiRoute: handleTaskApiRoute } = require("./api_routes");

async function handleApiRoute(req, res) {
  if (await handleTaskApiRoute(req, res, service)) {
    return true;
  }
  if (req.method === "GET" && req.url === "/health") {
    sendJson(res, 200, service.getHealth());
    return true;
  }
  if (req.method === "GET" && req.url === "/status") {
    sendJson(res, 200, service.getStatus());
    return true;
  }
  if (req.method === "POST" && req.url === "/agent/start") {
    sendJson(res, 200, await service.startAgent());
    return true;
  }
  if (req.method === "POST" && req.url === "/agent/stop") {
    sendJson(res, 200, await service.stopAgent());
    return true;
  }
  if (req.method === "POST" && req.url === "/agent/restart") {
    sendJson(res, 200, await service.restartAgent());
    return true;
  }
  if (req.method === "POST" && req.url === "/command/run") {
    const body = await parseBody(req);
    sendJson(res, 200, await service.runBridgeCommand(body));
    return true;
  }
  if (req.method === "GET" && req.url === "/api/executor-jobs") {
    sendJson(res, 200, service.getExecutorJobsView());
    return true;
  }
  if (req.method === "GET" && req.url === "/api/live-operation-proofs") {
    sendJson(res, 200, service.getLiveOperationProofs());
    return true;
  }
  if (req.method === "GET" && req.url === "/api/stability-anomalies") {
    sendJson(res, 200, service.getStabilityAnomalies());
    return true;
  }
  if (req.method === "GET" && req.url === "/api/operator-friction-reports") {
    sendJson(res, 200, service.getOperatorFrictionReports());
    return true;
  }
  if (req.method === "GET" && req.url === "/api/goal-state") {
    sendJson(res, 200, service.getGoalStateView());
    return true;
  }
  if (req.method === "GET" && req.url === "/api/next-task-plan") {
    sendJson(res, 200, service.getNextTaskPlan());
    return true;
  }
  if (req.method === "GET" && req.url === "/api/repo-health") {
    sendJson(res, 200, service.getRepoHealthView());
    return true;
  }
  if (req.method === "GET" && req.url === "/api/processes") {
    sendJson(res, 200, service.getProcessGovernorView());
    return true;
  }
  if (req.method === "GET" && req.url === "/api/process-incidents") {
    const view = service.getProcessGovernorView();
    sendJson(res, 200, {
      status: "PASS",
      incidents: view.incidents,
      active_processes: view.active_processes,
      locks: view.locks,
    });
    return true;
  }
  if (req.method === "GET" && req.url === "/api/self-heal-plan") {
    sendJson(res, 200, service.getSelfHealPlan());
    return true;
  }
  if (req.method === "POST" && req.url === "/api/executor-result/ingest") {
    const body = await parseBody(req);
    sendJson(res, 200, service.ingestExecutorResult(body));
    return true;
  }
  if (req.method === "POST" && req.url === "/api/live-operation/run") {
    const body = await parseBody(req);
    sendJson(res, 200, await service.runLiveOperationProof(body));
    return true;
  }
  if (req.method === "POST" && req.url === "/workflow/run") {
    const body = await parseBody(req);
    sendJson(res, 200, await service.runWorkflow(body.workflow, {
      requested_by: body.requested_by || "dashboard",
      reviewed_by: body.reviewed_by || null,
      approval_state: body.approval_state || null,
    }));
    return true;
  }
  if (req.method === "GET" && req.url === "/sessions") {
    sendJson(res, 200, {
      status: "PASS",
      sessions: service.getStatus().sessions,
    });
    return true;
  }
  if (req.method === "GET" && req.url === "/history") {
    sendJson(res, 200, {
      status: "PASS",
      workflow_history: service.getStatus().workflow_history,
    });
    return true;
  }
  if (req.method === "GET" && req.url === "/approval/queue") {
    sendJson(res, 200, {
      status: "PASS",
      approval_queue: service.getQueueStatus().approval_queue,
    });
    return true;
  }
  if (req.method === "GET" && req.url === "/api/approval-inbox") {
    sendJson(res, 200, service.getApprovalInbox());
    return true;
  }
  if (req.method === "GET" && req.url === "/api/failure-center") {
    sendJson(res, 200, service.getFailureCenter());
    return true;
  }
  if (req.method === "GET" && req.url === "/api/retry-queue") {
    sendJson(res, 200, service.getRetryQueue());
    return true;
  }
  if (req.method === "GET" && req.url === "/api/governance-snapshot/latest") {
    sendJson(res, 200, service.getGovernanceSnapshotLatest());
    return true;
  }
  if (req.method === "GET" && req.url === "/api/governance-reports") {
    sendJson(res, 200, service.getGovernanceReports());
    return true;
  }
  if (req.method === "GET" && req.url === "/api/activity-feed") {
    sendJson(res, 200, service.getActivityFeedView());
    return true;
  }
  if (req.method === "POST" && req.url === "/approval/approve") {
    const body = await parseBody(req);
    sendJson(res, 200, await service.approveWorkflow(body.id, body.reviewed_by || "dashboard_operator"));
    return true;
  }
  if (req.method === "POST" && req.url === "/approval/reject") {
    const body = await parseBody(req);
    sendJson(res, 200, service.rejectWorkflow(body.id, body.reviewed_by || "dashboard_operator"));
    return true;
  }
  if (req.method === "POST" && /^\/api\/approval\/[^/]+\/approve$/.test(req.url)) {
    const approvalId = decodeURIComponent(req.url.split("/")[3]);
    const body = await parseBody(req);
    sendJson(res, 200, await service.approveApproval(approvalId, body.reviewed_by || "dashboard_operator"));
    return true;
  }
  if (req.method === "POST" && /^\/api\/approval\/[^/]+\/reject$/.test(req.url)) {
    const approvalId = decodeURIComponent(req.url.split("/")[3]);
    const body = await parseBody(req);
    sendJson(res, 200, service.rejectApproval(approvalId, body.reviewed_by || "dashboard_operator"));
    return true;
  }
  if (req.method === "POST" && /^\/api\/retry\/[^/]+$/.test(req.url)) {
    const failureId = decodeURIComponent(req.url.split("/")[3]);
    sendJson(res, 200, service.retryFailureAction(failureId));
    return true;
  }
  if (req.method === "GET" && /^\/api\/task-lifecycle\/[^/]+$/.test(req.url)) {
    const taskId = decodeURIComponent(req.url.split("/")[3]);
    sendJson(res, 200, service.getTaskLifecycle(taskId));
    return true;
  }
  if (req.method === "GET" && /^\/api\/task-artifacts\/[^/]+$/.test(req.url)) {
    const taskId = decodeURIComponent(req.url.split("/")[3]);
    sendJson(res, 200, service.getTaskArtifacts(taskId));
    return true;
  }
  if (req.method === "GET" && /^\/api\/executor-job\/[^/]+$/.test(req.url)) {
    const jobId = decodeURIComponent(req.url.split("/")[3]);
    sendJson(res, 200, service.getExecutorJobView(jobId));
    return true;
  }
  if (req.method === "GET" && /^\/api\/workflow-summary\/[^/]+$/.test(req.url)) {
    const workflowId = decodeURIComponent(req.url.split("/")[3]);
    sendJson(res, 200, service.getWorkflowSummaryView(workflowId));
    return true;
  }
  if (req.method === "GET" && /^\/api\/audit\/[^/]+$/.test(req.url)) {
    const taskId = decodeURIComponent(req.url.split("/")[3]);
    sendJson(res, 200, service.getAuditTrailView(taskId));
    return true;
  }
  if (req.method === "GET" && /^\/api\/report\/[^/]+$/.test(req.url)) {
    const workflowId = decodeURIComponent(req.url.split("/")[3]);
    sendJson(res, 200, service.getWorkflowReport(workflowId));
    return true;
  }
  if (req.method === "GET" && req.url === "/reports/latest") {
    sendJson(res, 200, service.getLatestReports());
    return true;
  }
  if (req.method === "GET" && req.url === "/logs/recent") {
    sendJson(res, 200, service.getRecentLogs());
    return true;
  }
  if (req.method === "GET" && req.url === "/queue/status") {
    sendJson(res, 200, service.getQueueStatus());
    return true;
  }
  return false;
}

function serveUiAsset(req, res) {
  const uiRoot = path.join(__dirname, "ui");
  const route = req.url === "/" ? "/dashboard.html" : req.url;
  const assetPath = path.join(uiRoot, route.replace(/^\/+/, ""));
  if (!assetPath.startsWith(uiRoot) || !fs.existsSync(assetPath)) {
    return false;
  }
  const ext = path.extname(assetPath).toLowerCase();
  const contentType = ext === ".js"
    ? "application/javascript; charset=utf-8"
    : ext === ".css"
      ? "text/css; charset=utf-8"
      : "text/html; charset=utf-8";
  res.writeHead(200, { "Content-Type": contentType });
  res.end(fs.readFileSync(assetPath, "utf8"));
  return true;
}

function createServer() {
  return http.createServer(async (req, res) => {
    try {
      if (await handleApiRoute(req, res)) return;
      if (req.method === "GET" && serveUiAsset(req, res)) return;
      if (req.method === "GET" && req.url === "/dashboard/orchestra_view.js") {
        const js = fs.readFileSync(path.join(__dirname, "local_control_agent", "orchestra_view.js"), "utf8");
        res.writeHead(200, { "Content-Type": "application/javascript; charset=utf-8" });
        res.end(js);
        return;
      }
      sendJson(res, 404, { status: "FAIL", error: "not_found" });
    } catch (error) {
      sendJson(res, 500, { status: "FAIL", error: error.message });
    }
  });
}

function startCommanderApi(options = {}) {
  const host = options.host || config.CONTROL_API_HOST;
  const port = options.port || Number(process.env.MIKAGE_OPERATOR_PORT || 3030);
  const server = createServer();
  server.listen(port, host);
  const telegramBot = startTelegramBot({ ...(options.telegram || {}), port });
  return {
    server,
    telegramBot,
    host,
    port,
  };
}

if (require.main === module) {
  const started = startCommanderApi();
  console.log(`MIKAGE COMMANDER API RUNNING http://${started.host}:${started.port}`);
}

module.exports = {
  createServer,
  startCommanderApi,
  handleApiRoute,
};
