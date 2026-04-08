"use strict";

const fs = require("fs");
const path = require("path");
const config = require("./config");

function logAudit(event) {
  fs.mkdirSync(path.dirname(config.AUDIT_LOG), { recursive: true });
  fs.appendFileSync(config.AUDIT_LOG, `${JSON.stringify({
    timestamp: new Date().toISOString(),
    ...event,
  })}\n`, "utf8");
}

module.exports = {
  logAudit,
};
