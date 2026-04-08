"use strict";

const fs = require("fs");
const path = require("path");
const { classifyPath } = require("./disk_maintenance_policy");
const { log } = require("./audit_logger");

function scanDirectory(dir, results = []) {
  if (!fs.existsSync(dir)) return results;

  const items = fs.readdirSync(dir);
  for (const item of items) {
    const full = path.join(dir, item);
    try {
      const stat = fs.statSync(full);
      const type = classifyPath(full);

      if (stat.isDirectory()) {
        results.push({ path: full, type, size: 0, kind: "dir" });
        scanDirectory(full, results);
      } else {
        results.push({ path: full, type, size: stat.size, kind: "file" });
      }
    } catch (_) {}
  }

  return results;
}

function scanDisk(targetPath) {
  const results = scanDirectory(targetPath);
  const grouped = {
    safe_delete: [],
    review_required: [],
    protected: [],
  };

  for (const r of results) {
    grouped[r.type].push(r);
  }

  log("disk.scan", { targetPath, summary: {
    safe: grouped.safe_delete.length,
    review: grouped.review_required.length,
    protected: grouped.protected.length,
  }});

  return grouped;
}

function safeClean(grouped) {
  const deleted = [];

  for (const item of grouped.safe_delete) {
    try {
      if (item.kind === "file") {
        fs.unlinkSync(item.path);
      }
      deleted.push(item.path);
    } catch (_) {}
  }

  log("disk.safe_clean", { count: deleted.length });
  return deleted;
}

module.exports = {
  scanDisk,
  safeClean,
};
