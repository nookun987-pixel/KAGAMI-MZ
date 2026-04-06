"use strict";

const fs = require("fs");
const path = require("path");

const DEFAULT_METRICS_REGISTRY_PATH = path.join(__dirname, "..", "memory", "metrics_registry.json");

function safeClone(value, fallback = null) {
  try {
    return JSON.parse(JSON.stringify(value));
  } catch (_) {
    return fallback;
  }
}

function getRegistryPath() {
  return process.env.METRICS_REGISTRY_PATH || DEFAULT_METRICS_REGISTRY_PATH;
}

function ensureRegistryFile() {
  try {
    const registryPath = getRegistryPath();
    const dir = path.dirname(registryPath);
    if (!fs.existsSync(dir)) fs.mkdirSync(dir, { recursive: true });
    if (!fs.existsSync(registryPath)) {
      fs.writeFileSync(registryPath, JSON.stringify({ runs: {}, attempts: [] }, null, 2), "utf8");
    }
    return registryPath;
  } catch (_) {
    return getRegistryPath();
  }
}

function readMetricsRegistry() {
  try {
    const parsed = JSON.parse(fs.readFileSync(ensureRegistryFile(), "utf8"));
    return {
      runs: parsed && parsed.runs && typeof parsed.runs === "object" ? parsed.runs : {},
      attempts: Array.isArray(parsed && parsed.attempts) ? parsed.attempts : [],
    };
  } catch (error) {
    console.warn(`[OBSERVE] Registry read error (non-fatal): ${error.message}`);
    return { runs: {}, attempts: [] };
  }
}

function writeMetricsRegistry(registry) {
  try {
    const safe = {
      runs: registry && registry.runs && typeof registry.runs === "object" ? registry.runs : {},
      attempts: Array.isArray(registry && registry.attempts) ? registry.attempts : [],
    };
    fs.writeFileSync(ensureRegistryFile(), JSON.stringify(safe, null, 2), "utf8");
    return true;
  } catch (error) {
    console.warn(`[OBSERVE] Registry write error (non-fatal): ${error.message}`);
    return false;
  }
}

function getRunMetrics(run_id) {
  try {
    if (!run_id) return null;
    const registry = readMetricsRegistry();
    const record = registry.runs[String(run_id)];
    return record ? safeClone(record, null) : null;
  } catch (_) {
    return null;
  }
}

function listRunMetrics() {
  return Object.values(readMetricsRegistry().runs || {}).map((entry) => safeClone(entry, {})).filter(Boolean);
}

function listAttemptMetrics() {
  return safeClone(readMetricsRegistry().attempts || [], []);
}

module.exports = {
  DEFAULT_METRICS_REGISTRY_PATH,
  getRegistryPath,
  ensureRegistryFile,
  readMetricsRegistry,
  writeMetricsRegistry,
  getRunMetrics,
  listRunMetrics,
  listAttemptMetrics,
};
