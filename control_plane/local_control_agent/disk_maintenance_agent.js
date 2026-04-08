"use strict";

const fs = require("fs");
const path = require("path");
const config = require("./config");

function safeCandidates(rootDir) {
  const results = [];
  function walk(dir) {
    let entries = [];
    try {
      entries = fs.readdirSync(dir, { withFileTypes: true });
    } catch (_) {
      return;
    }
    for (const entry of entries) {
      const fullPath = path.join(dir, entry.name);
      if (entry.isDirectory()) {
        if (config.SAFE_CLEAN_GLOBS.includes(entry.name)) {
          results.push({ path: fullPath, reason: "safe_cache_dir" });
          continue;
        }
        walk(fullPath);
        continue;
      }
      const ext = path.extname(entry.name).toLowerCase();
      if (config.SAFE_CLEAN_EXTENSIONS.includes(ext) || config.SAFE_CLEAN_GLOBS.includes(entry.name)) {
        results.push({ path: fullPath, reason: "safe_temp_file" });
      }
    }
  }
  walk(rootDir);
  return results;
}

function diskSmartScan() {
  const candidates = safeCandidates(config.ROOT);
  return {
    root: config.ROOT,
    candidate_count: candidates.length,
    candidates: candidates.slice(0, 200),
  };
}

function diskLatestReport() {
  const reportPath = path.join(config.STATE_DIR, "latest_disk_scan.json");
  if (!fs.existsSync(reportPath)) {
    return { exists: false, report: null };
  }
  return {
    exists: true,
    report: JSON.parse(fs.readFileSync(reportPath, "utf8")),
  };
}

function diskSafeClean(targets) {
  const removed = [];
  for (const item of targets || []) {
    if (!fs.existsSync(item.path)) continue;
    const stat = fs.statSync(item.path);
    if (stat.isDirectory()) {
      fs.rmSync(item.path, { recursive: true, force: true });
    } else {
      fs.unlinkSync(item.path);
    }
    removed.push(item.path);
  }
  return { removed };
}

module.exports = {
  diskSmartScan,
  diskLatestReport,
  diskSafeClean,
};
