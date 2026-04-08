"use strict";

const fs = require("fs");
const path = require("path");
const { STATE_ROOT } = require("./config");
const { safeClean } = require("./disk_maintenance_agent");
const { log } = require("./audit_logger");

function loadReport() {
  const file = path.join(STATE_ROOT, "smart_disk_scan_report.json");
  if (!fs.existsSync(file)) {
    throw new Error("NO_SCAN_REPORT");
  }
  return JSON.parse(fs.readFileSync(file, "utf-8"));
}

function approveAndCleanSafe() {
  const report = loadReport();
  const grouped = {
    safe_delete: report.safe_delete || [],
  };
  const deleted = safeClean(grouped);
  log("disk.approve_clean_safe", { deleted_count: deleted.length });
  return {
    deleted_count: deleted.length,
    deleted,
  };
}

module.exports = {
  approveAndCleanSafe,
};
