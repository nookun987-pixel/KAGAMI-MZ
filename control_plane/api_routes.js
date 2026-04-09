"use strict";

function parseBody(req) {
  return new Promise((resolve) => {
    let data = "";
    req.on("data", (chunk) => { data += chunk; });
    req.on("end", () => {
      if (!data.trim()) return resolve({});
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

async function handleApiRoute(req, res, service) {
  if (req.method === "POST" && req.url === "/api/task/create") {
    const body = await parseBody(req);
    sendJson(res, 200, await service.createTask(body));
    return true;
  }
  if (req.method === "GET" && req.url === "/api/task/list") {
    sendJson(res, 200, service.listTasks());
    return true;
  }
  if (req.method === "POST" && req.url === "/api/task/approve") {
    const body = await parseBody(req);
    sendJson(res, 200, await service.approveTask(body.approval_id || body.id, body.reviewed_by || "dashboard_operator"));
    return true;
  }
  if (req.method === "POST" && req.url === "/api/task/reject") {
    const body = await parseBody(req);
    sendJson(res, 200, service.rejectTask(body.approval_id || body.id, body.reviewed_by || "dashboard_operator"));
    return true;
  }
  if (req.method === "GET" && req.url === "/api/job/list") {
    sendJson(res, 200, service.listJobs());
    return true;
  }
  if (req.method === "GET" && req.url === "/api/system/status") {
    sendJson(res, 200, service.getOperatorSystemStatus());
    return true;
  }
  if (req.method === "GET" && req.url === "/api/suggestions") {
    sendJson(res, 200, service.getSuggestions());
    return true;
  }
  if (req.method === "GET" && req.url === "/api/digest") {
    sendJson(res, 200, service.getDigest());
    return true;
  }
  if (req.method === "POST" && req.url === "/api/system/pause") {
    sendJson(res, 200, await service.pauseSystem());
    return true;
  }
  if (req.method === "POST" && req.url === "/api/system/resume") {
    sendJson(res, 200, await service.resumeSystem());
    return true;
  }
  if (req.method === "POST" && req.url === "/api/system/restart") {
    sendJson(res, 200, await service.restartSystem());
    return true;
  }
  return false;
}

module.exports = {
  parseBody,
  sendJson,
  handleApiRoute,
};
