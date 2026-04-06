"use strict";

const fs = require("fs");
const path = require("path");

const DEFAULT_REGISTRY_PATH = path.join(__dirname, "..", "memory", "cost_registry.json");

function safeClone(value, fallback = null) {
  try {
    return JSON.parse(JSON.stringify(value));
  } catch (_) {
    return fallback;
  }
}

function getRegistryPath() {
  return process.env.COST_REGISTRY_PATH || DEFAULT_REGISTRY_PATH;
}

function ensureRegistryFile() {
  try {
    const registryPath = getRegistryPath();
    const dir = path.dirname(registryPath);
    if (!fs.existsSync(dir)) fs.mkdirSync(dir, { recursive: true });
    if (!fs.existsSync(registryPath)) {
      fs.writeFileSync(registryPath, "[]", "utf8");
    }
    return registryPath;
  } catch (_) {
    return getRegistryPath();
  }
}

function readCostRegistry() {
  try {
    const registryPath = ensureRegistryFile();
    const parsed = JSON.parse(fs.readFileSync(registryPath, "utf8"));
    return Array.isArray(parsed) ? parsed : [];
  } catch (error) {
    console.warn(`[COST] Registry read error (non-fatal): ${error.message}`);
    return [];
  }
}

function writeCostRegistry(records) {
  try {
    const registryPath = ensureRegistryFile();
    fs.writeFileSync(registryPath, JSON.stringify(Array.isArray(records) ? records : [], null, 2), "utf8");
    return true;
  } catch (error) {
    console.warn(`[COST] Registry write error (non-fatal): ${error.message}`);
    return false;
  }
}

function summarizeCosts(records, run_id) {
  try {
    const list = Array.isArray(records) ? records : [];
    const global_used = list.reduce((sum, entry) => sum + (Number(entry && entry.cost) || 0), 0);
    const run_used = list
      .filter((entry) => entry && entry.run_id === run_id)
      .reduce((sum, entry) => sum + (Number(entry && entry.cost) || 0), 0);

    return {
      global_used,
      run_used,
      run_attempts: list.filter((entry) => entry && entry.run_id === run_id).length,
      records: safeClone(list, []),
    };
  } catch (_) {
    return {
      global_used: 0,
      run_used: 0,
      run_attempts: 0,
      records: [],
    };
  }
}

function appendCostRecord(entry = {}) {
  try {
    const records = readCostRegistry();
    const next = {
      run_id: entry.run_id || null,
      attempt: Number(entry.attempt) || 1,
      cost: Number(entry.cost) || 0,
      cumulative_run_cost: Number(entry.cumulative_run_cost) || 0,
      cumulative_global_cost: Number(entry.cumulative_global_cost) || 0,
      estimated_cost: Number(entry.estimated_cost) || 0,
      flags: Array.isArray(entry.flags) ? [...entry.flags] : [],
      timestamp: entry.timestamp || new Date().toISOString(),
    };
    records.push(next);
    writeCostRegistry(records);
    return {
      ok: true,
      entry: safeClone(next, null),
      records: safeClone(records, []),
    };
  } catch (error) {
    return {
      ok: false,
      entry: null,
      records: [],
      reason: error.message,
    };
  }
}

module.exports = {
  DEFAULT_REGISTRY_PATH,
  getRegistryPath,
  ensureRegistryFile,
  readCostRegistry,
  writeCostRegistry,
  summarizeCosts,
  appendCostRecord,
};
