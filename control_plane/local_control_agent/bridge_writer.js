"use strict";

const fs = require("fs");
const path = require("path");
const config = require("./config");
const { ensureBridgeDirs } = require("./bridge_reader");

function writeJson(filePath, data) {
  fs.mkdirSync(path.dirname(filePath), { recursive: true });
  fs.writeFileSync(filePath, JSON.stringify(data, null, 2), "utf8");
}

function readJsonSafe(filePath, fallback) {
  try {
    if (!fs.existsSync(filePath)) return fallback;
    return JSON.parse(fs.readFileSync(filePath, "utf8"));
  } catch (_) {
    return fallback;
  }
}

function formatTextReport(report) {
  return [
    `STATUS: ${report.status}`,
    `ACTION: ${report.action}`,
    `FILES: ${(report.files || []).join(", ") || "-"}`,
    `RISK: ${report.risk || "none"}`,
    `NEXT: ${report.next || "none"}`,
  ].join("\n");
}

function writeReport(report) {
  ensureBridgeDirs();
  const baseName = `${report.command_id || "report"}_${Date.now()}`;
  const jsonPath = path.join(config.OUTBOX_DIR, `${baseName}.json`);
  const txtPath = path.join(config.OUTBOX_DIR, `${baseName}.txt`);
  writeJson(jsonPath, report);
  fs.writeFileSync(txtPath, formatTextReport(report), "utf8");
  writeJson(config.LATEST_AGENT_REPORT, report);
  return { jsonPath, txtPath };
}

function archiveCommand(commandFilePath, payload, resultPaths) {
  const base = path.basename(commandFilePath, ".json");
  const archivePath = path.join(config.ARCHIVE_DIR, `${base}.json`);
  writeJson(archivePath, {
    command: payload,
    archived_at: new Date().toISOString(),
    result_paths: resultPaths,
  });
  if (fs.existsSync(commandFilePath)) fs.unlinkSync(commandFilePath);
  return archivePath;
}

function updatePendingActions(pending) {
  writeJson(config.PENDING_ACTIONS, {
    generated_at: new Date().toISOString(),
    pending,
  });
}

function readPendingActions() {
  return readJsonSafe(config.PENDING_ACTIONS, { generated_at: null, pending: [] });
}

module.exports = {
  writeJson,
  readJsonSafe,
  formatTextReport,
  writeReport,
  archiveCommand,
  updatePendingActions,
  readPendingActions,
};
