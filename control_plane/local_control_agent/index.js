"use strict";

const http = require("http");
const { CONTROL_PORT, CONTROL_HOST } = require("./config");
const { handle } = require("./command_router");
const { log } = require("./audit_logger");

function parseBody(req) {
  return new Promise((resolve) => {
    let data = "";
    req.on("data", (c) => (data += c));
    req.on("end", () => {
      try {
        resolve(JSON.parse(data));
      } catch {
        resolve({});
      }
    });
  });
}

const server = http.createServer(async (req, res) => {
  if (req.method === "POST" && req.url === "/control") {
    const body = await parseBody(req);
    const cmd = body.command || "";
    log("command.received", { cmd });
    const result = await handle(cmd);
    res.writeHead(200, { "Content-Type": "application/json" });
    res.end(JSON.stringify({ result }));
    return;
  }

  res.writeHead(200);
  res.end("MIKAGE CONTROL AGENT RUNNING");
});

server.listen(CONTROL_PORT, CONTROL_HOST, () => {
  console.log(`Local Control Agent running at http://${CONTROL_HOST}:${CONTROL_PORT}`);
});