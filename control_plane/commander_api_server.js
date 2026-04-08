"use strict";

const fs = require("fs");
const http = require("http");
const path = require("path");

const config = require("./local_control_agent/config");
const service = require("./commander_service");
const { startTelegramOperator } = require("./telegram_operator");

function parseBody(req) {
  return new Promise((resolve) => {
    let data = "";
    req.on("data", (chunk) => {
      data += chunk;
    });
    req.on("end", () => {
      if (!data.trim()) {
        resolve({});
        return;
      }
      try {
        resolve(JSON.parse(data));
      } catch (_) {
        resolve({});
      }
    });
  });
}

function sendJson(res, statusCode, payload) {
  res.writeHead(statusCode, { "Content-Type": "application/json; charset=utf-8" });
  res.end(JSON.stringify(payload, null, 2));
}

async function handleApiRoute(req, res) {
  if (req.method === "GET" && req.url === "/health") {
    sendJson(res, 200, service.getHealth());
    return true;
  }
  if (req.method === "GET" && req.url === "/status") {
    sendJson(res, 200, service.getStatus());
    return true;
  }
  if (req.method === "POST" && req.url === "/agent/start") {
    sendJson(res, 200, service.startAgent());
    return true;
  }
  if (req.method === "POST" && req.url === "/agent/stop") {
    sendJson(res, 200, service.stopAgent());
    return true;
  }
  if (req.method === "POST" && req.url === "/agent/restart") {
    sendJson(res, 200, service.restartAgent());
    return true;
  }
  if (req.method === "POST" && req.url === "/command/run") {
    const body = await parseBody(req);
    sendJson(res, 200, await service.runBridgeCommand(body));
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

function createServer() {
  return http.createServer(async (req, res) => {
    try {
      if (await handleApiRoute(req, res)) return;
      if (req.method === "GET" && req.url === "/") {
        const html = fs.readFileSync(path.join(__dirname, "local_control_agent", "dashboard.html"), "utf8");
        res.writeHead(200, { "Content-Type": "text/html; charset=utf-8" });
        res.end(html);
        return;
      }
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
  const port = options.port || config.CONTROL_API_PORT;
  const server = createServer();
  server.listen(port, host);
  const telegram = startTelegramOperator(service, options.telegram || {});
  return {
    server,
    telegram,
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
