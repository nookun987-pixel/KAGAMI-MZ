"use strict";

const assert = require("assert");
const http = require("http");

const { createServer } = require("../control_plane/commander_api_server");

function request(server, method, route, body) {
  const address = server.address();
  return new Promise((resolve, reject) => {
    const req = http.request({
      hostname: "127.0.0.1",
      port: address.port,
      path: route,
      method,
      headers: {
        "Content-Type": "application/json",
      },
    }, (res) => {
      let data = "";
      res.on("data", (chunk) => {
        data += chunk;
      });
      res.on("end", () => {
        try {
          resolve(JSON.parse(data));
        } catch (error) {
          reject(error);
        }
      });
    });
    req.on("error", reject);
    if (body) req.write(JSON.stringify(body));
    req.end();
  });
}

(async () => {
  const server = createServer();
  await new Promise((resolve) => server.listen(0, "127.0.0.1", resolve));
  try {
    const health = await request(server, "GET", "/health");
    assert.strictEqual(health.status, "PASS");
    assert.ok(health.bridge.ready);

    const status = await request(server, "GET", "/status");
    assert.strictEqual(status.status, "PASS");
    assert.ok(status.snapshot);

    const queue = await request(server, "GET", "/queue/status");
    assert.strictEqual(queue.status, "PASS");
    assert.ok(Array.isArray(queue.pending_actions));

    const sessions = await request(server, "GET", "/sessions");
    assert.strictEqual(sessions.status, "PASS");
    assert.ok(sessions.sessions);

    const history = await request(server, "GET", "/history");
    assert.strictEqual(history.status, "PASS");
    assert.ok(history.workflow_history);

    const approvals = await request(server, "GET", "/approval/queue");
    assert.strictEqual(approvals.status, "PASS");
    assert.ok(Array.isArray(approvals.approval_queue));

    const approvalInbox = await request(server, "GET", "/api/approval-inbox");
    assert.strictEqual(approvalInbox.status, "PASS");
    assert.ok(approvalInbox.approval_inbox);

    const failureCenter = await request(server, "GET", "/api/failure-center");
    assert.strictEqual(failureCenter.status, "PASS");
    assert.ok(failureCenter.failure_center);

    const retryQueue = await request(server, "GET", "/api/retry-queue");
    assert.strictEqual(retryQueue.status, "PASS");
    assert.ok(retryQueue.retry_queue);

    const governance = await request(server, "GET", "/api/governance-snapshot/latest");
    assert.strictEqual(governance.status, "PASS");

    const reports = await request(server, "GET", "/reports/latest");
    assert.strictEqual(reports.status, "PASS");

    const js = await new Promise((resolve, reject) => {
      const address = server.address();
      http.get({
        hostname: "127.0.0.1",
        port: address.port,
        path: "/dashboard/orchestra_view.js",
      }, (res) => {
        let data = "";
        res.on("data", (chunk) => { data += chunk; });
        res.on("end", () => resolve(data));
      }).on("error", reject);
    });
    assert.ok(js.includes("mapOrchestraState"));

    console.log("PASS");
  } finally {
    server.close();
  }
})().catch((error) => {
  console.error(error);
  process.exit(1);
});
