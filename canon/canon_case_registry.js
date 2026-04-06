"use strict";

const fs = require("fs");
const path = require("path");

const DEFAULT_CANON_GENERALIZATION_REGISTRY_PATH = path.join(__dirname, "..", "memory", "canon_generalization_registry.json");

function safeClone(value, fallback = null) {
  try {
    return JSON.parse(JSON.stringify(value));
  } catch (_) {
    return fallback;
  }
}

function getRegistryPath() {
  return process.env.CANON_GENERALIZATION_REGISTRY_PATH || DEFAULT_CANON_GENERALIZATION_REGISTRY_PATH;
}

function ensureRegistryFile() {
  try {
    const registryPath = getRegistryPath();
    const dir = path.dirname(registryPath);
    if (!fs.existsSync(dir)) fs.mkdirSync(dir, { recursive: true });
    if (!fs.existsSync(registryPath)) fs.writeFileSync(registryPath, "[]", "utf8");
    return registryPath;
  } catch (_) {
    return getRegistryPath();
  }
}

function readCanonCaseRegistry() {
  try {
    const parsed = JSON.parse(fs.readFileSync(ensureRegistryFile(), "utf8"));
    return Array.isArray(parsed) ? parsed : [];
  } catch (error) {
    console.warn(`[CANON_GEN] Registry read error (non-fatal): ${error.message}`);
    return [];
  }
}

function writeCanonCaseRegistry(records) {
  try {
    fs.writeFileSync(ensureRegistryFile(), JSON.stringify(Array.isArray(records) ? records : [], null, 2), "utf8");
    return true;
  } catch (error) {
    console.warn(`[CANON_GEN] Registry write error (non-fatal): ${error.message}`);
    return false;
  }
}

function storeCanonCases(records = []) {
  try {
    const next = Array.isArray(records) ? safeClone(records, []) : [];
    writeCanonCaseRegistry(next);
    return {
      ok: true,
      records: next,
    };
  } catch (error) {
    return {
      ok: false,
      records: [],
      reason: error.message,
    };
  }
}

function queryCanonCases(context = {}, records) {
  try {
    const registry = Array.isArray(records) ? records : readCanonCaseRegistry();
    const lane = context.lane || null;
    const relevant = registry.filter((entry) => {
      if (!entry || typeof entry !== "object") return false;
      if (entry.scope === "cross-lane") return true;
      if (entry.scope === "lane" && lane && entry.lane === lane) return true;
      return false;
    });
    return safeClone(relevant, []);
  } catch (_) {
    return [];
  }
}

module.exports = {
  DEFAULT_CANON_GENERALIZATION_REGISTRY_PATH,
  getRegistryPath,
  ensureRegistryFile,
  readCanonCaseRegistry,
  writeCanonCaseRegistry,
  storeCanonCases,
  queryCanonCases,
};
