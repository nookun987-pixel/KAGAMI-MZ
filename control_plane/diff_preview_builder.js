"use strict";

const fs = require("fs");
const path = require("path");

const config = require("./local_control_agent/config");
const { writeJson } = require("./local_control_agent/bridge_writer");

function buildStructuredDiff(command) {
  const payload = command.payload || {};
  if (typeof payload.path === "string" && typeof payload.content === "string") {
    return {
      status: "PASS",
      kind: "inline_file_write",
      diff_lines: [
        `--- ${payload.path}`,
        `+++ ${payload.path}`,
        `@@ content @@`,
        `+${payload.content}`,
      ],
    };
  }
  return {
    status: "NO_DIFF_AVAILABLE",
    kind: "unsupported",
    diff_lines: [],
  };
}

function buildDiffPreview(command) {
  const taskId = command.payload && command.payload.task_id || command.command_id || "task";
  const diff = buildStructuredDiff(command);
  const outPath = path.join(config.DIFF_PREVIEW_DIR, `${taskId}_${Date.now()}.json`);
  fs.mkdirSync(path.dirname(outPath), { recursive: true });
  writeJson(outPath, diff);
  return {
    status: diff.status,
    artifact_path: outPath,
    diff,
  };
}

module.exports = {
  buildDiffPreview,
};
