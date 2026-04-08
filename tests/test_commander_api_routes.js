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

    const reports = await request(server, "GET", "/reports/latest");
    assert.strictEqual(reports.status, "PASS");

    console.log("PASS");
  } finally {
    server.close();
  }
})().catch((error) => {
  console.error(error);
  process.exit(1);
});
