"use strict";

const fs = require("fs");
const path = require("path");

const config = require("./config");
const { buildBringupChecklist } = require("./bringup_checklist");

const BRINGUP_REPORT_PATH = path.join(config.LOCAL_AGENT_STATE_DIR, "latest_bringup_report.json");

function writeBringupReport(options = {}) {
  const checklist = options.checklist || buildBringupChecklist();
  const report = {
    generated_at: new Date().toISOString(),
    machine_id: config.MACHINE_PROFILE.machine_id,
    node_role: config.NODE_ROLE.role_id,
    status: checklist.status,
    checklist,
  };
  fs.mkdirSync(path.dirname(BRINGUP_REPORT_PATH), { recursive: true });
  fs.writeFileSync(BRINGUP_REPORT_PATH, JSON.stringify(report, null, 2), "utf8");
  return report;
}

module.exports = {
  BRINGUP_REPORT_PATH,
  writeBringupReport,
};
