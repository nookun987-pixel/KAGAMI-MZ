"use strict";

const fs = require("fs");
const path = require("path");
const { LOG_ROOT } = require("./config");

function ensureDir(dir) {
  if (!fs.existsSync(dir)) {
    fs.mkdirSync(dir, { recursive: true });
  }
}

function log(event, payload = {}) {
  ensureDir(LOG_ROOT);
  const file = path.join(LOG_ROOT, "agent.log");
  const line = JSON.stringify({
    ts: new Date().toISOString(),
    event,
    payload,
  });
  fs.appendFileSync(file, line + "\n");
}

module.exports = { log };