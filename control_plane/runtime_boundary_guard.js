"use strict";

const path = require("path");

const config = require("./local_control_agent/config");
const { analyzeWriteTargets, protectedDeleteCheck } = require("./local_control_agent/system_map_guard");

const RUNTIME_LOCKED_PATHS = [
  path.join(config.ROOT, "start_mikage.bat"),
  path.join(config.ROOT, "MIKAGE", "index.js"),
  path.join(config.ROOT, "runtime", "drive_queue", "runtime.js"),
  path.join(config.ROOT, "runtime", "colab_worker"),
];

function normalize(targetPath) {
  return String(targetPath || "").replace(/\\/g, "/").toLowerCase();
}

function collectTouchedFiles(command) {
  const touched = [];
  const payload = command.payload || {};
  if (Array.isArray(payload.files)) {
    for (const filePath of payload.files) {
      touched.push(path.resolve(config.ROOT, filePath));
    }
  }
  if (Array.isArray(payload.targets)) {
    for (const target of payload.targets) {
      if (target && target.path) touched.push(String(target.path));
    }
  }
  return touched;
}

function evaluateRuntimeBoundary(command) {
  const touched_files = collectTouchedFiles(command);
  const impact = analyzeWriteTargets(touched_files);
  const deleteBlock = command.action === "disk.safe_clean"
    ? protectedDeleteCheck(touched_files)
    : null;
  const runtimeHit = touched_files.find((target) => {
    const normalized = normalize(target);
    return RUNTIME_LOCKED_PATHS.some((locked) => normalized.startsWith(normalize(locked)));
  });
  if (runtimeHit) {
    return {
      allowed: false,
      reason: "runtime_sensitive_target",
      touched_files,
      architecture_sensitive: true,
      sensitive_paths: impact.sensitive_paths || [],
    };
  }
  if (impact.hard_block_reason || deleteBlock) {
    return {
      allowed: false,
      reason: impact.hard_block_reason || deleteBlock,
      touched_files,
      architecture_sensitive: !!impact.architecture_sensitive,
      sensitive_paths: impact.sensitive_paths || [],
    };
  }
  return {
    allowed: true,
    reason: impact.architecture_sensitive ? "architecture_sensitive" : "within_runtime_boundary",
    touched_files,
    architecture_sensitive: !!impact.architecture_sensitive,
    sensitive_paths: impact.sensitive_paths || [],
  };
}

module.exports = {
  RUNTIME_LOCKED_PATHS,
  collectTouchedFiles,
  evaluateRuntimeBoundary,
};
