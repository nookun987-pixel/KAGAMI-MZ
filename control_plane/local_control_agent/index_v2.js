"use strict";

const http = require("http");
const fs = require("fs");
const path = require("path");
const { CONTROL_PORT, CONTROL_HOST } = require("./config");
const { handle, readLatestScanReport } = require("./command_router_v2");
const { startScheduler } = require("./scheduler");

function parseBody(req) {
  return new Promise((resolve) => {
    let data = "";
    req.on("data", (c) => (data += c));
    req.on("end", () => {
      try { resolve(JSON.parse(data)); } catch { resolve({}); }
    });
  });
}

const server = http.createServer(async (req, res) => {
  if (req.method === "POST" && req.url === "/control") {
    const body = await parseBody(req);
    const result = await handle(body.command);
    res.writeHead(200, { "Content-Type": "application/json" });
    res.end(JSON.stringify(result));
    return;
  }

  if (req.method === "GET" && req.url === "/report") {
    res.writeHead(200, { "Content-Type": "application/json" });
    res.end(JSON.stringify(readLatestScanReport() || {}));
    return;
  }

  if (req.method === "GET" && req.url === "/") {
    const html = fs.readFileSync(path.join(__dirname, "dashboard.html"), "utf-8");
    res.writeHead(200, { "Content-Type": "text/html" });
    res.end(html);
    return;
  }

  res.writeHead(404);
  res.end();
});

server.listen(CONTROL_PORT, CONTROL_HOST, () => {
  console.log("MIKAGE CONTROL V2 RUNNING");
});

startScheduler();
