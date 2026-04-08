"use strict";

const fs = require("fs");
const path = require("path");
const { classifyPath, isProtectedPath } = require("./disk_maintenance_policy");
const { STATE_ROOT } = require("./config");
const { log } = require("./audit_logger");

const DEFAULT_FILE_MIN_BYTES = 100 * 1024 * 1024;
const DEFAULT_FOLDER_MIN_BYTES = 1024 * 1024 * 1024;
const MAX_DEPTH = 4;

function ensureDir(dir) {
  if (!fs.existsSync(dir)) fs.mkdirSync(dir, { recursive: true });
}

function safeStat(target) {
  try {
    return fs.statSync(target);
  } catch (_) {
    return null;
  }
}

function walk(targetPath, depth, options, report) {
  if (depth > options.maxDepth) return 0;
  if (!fs.existsSync(targetPath)) return 0;
  if (isProtectedPath(targetPath)) {
    report.protected.push({ path: targetPath, reason: "protected_path" });
    return 0;
  }

  const stat = safeStat(targetPath);
  if (!stat) return 0;

  if (stat.isFile()) {
    const type = classifyPath(targetPath);
    if (stat.size >= options.fileMinBytes) {
      report.large_files.push({
        path: targetPath,
        size: stat.size,
        type,
      });
    }
    return stat.size;
  }

  let total = 0;
  let items = [];
  try {
    items = fs.readdirSync(targetPath);
  } catch (_) {
    return 0;
  }

  for (const item of items) {
    total += walk(path.join(targetPath, item), depth + 1, options, report);
  }

  if (total >= options.folderMinBytes) {
    report.large_folders.push({
      path: targetPath,
      size: total,
      type: classifyPath(targetPath),
    });
  }

  return total;
}

function runSmartDiskScan(targetPath, options = {}) {
  const report = {
    scanned_at: new Date().toISOString(),
    target_path: targetPath,
    file_threshold_bytes: options.fileMinBytes || DEFAULT_FILE_MIN_BYTES,
    folder_threshold_bytes: options.folderMinBytes || DEFAULT_FOLDER_MIN_BYTES,
    large_files: [],
    large_folders: [],
    protected: [],
    review_required: [],
    safe_delete: [],
  };

  const resolved = {
    fileMinBytes: options.fileMinBytes || DEFAULT_FILE_MIN_BYTES,
    folderMinBytes: options.folderMinBytes || DEFAULT_FOLDER_MIN_BYTES,
    maxDepth: options.maxDepth || MAX_DEPTH,
  };

  walk(targetPath, 0, resolved, report);

  for (const item of report.large_files.concat(report.large_folders)) {
    if (item.type === "safe_delete") report.safe_delete.push(item);
    if (item.type === "review_required") report.review_required.push(item);
  }

  ensureDir(STATE_ROOT);
  const outPath = path.join(STATE_ROOT, "smart_disk_scan_report.json");
  fs.writeFileSync(outPath, JSON.stringify(report, null, 2));
  log("disk.smart_scan", {
    targetPath,
    large_files: report.large_files.length,
    large_folders: report.large_folders.length,
    review_required: report.review_required.length,
    safe_delete: report.safe_delete.length,
  });
  return { outPath, report };
}

module.exports = {
  runSmartDiskScan,
  DEFAULT_FILE_MIN_BYTES,
  DEFAULT_FOLDER_MIN_BYTES,
};
