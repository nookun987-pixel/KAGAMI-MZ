"use strict";

const fs = require("fs");
const path = require("path");

const DEFAULT_PROOF_PACK_REGISTRY_PATH = path.join(__dirname, "..", "memory", "proof_pack_registry.json");

function safeClone(value, fallback = null) {
  try {
    return JSON.parse(JSON.stringify(value));
  } catch (_) {
    return fallback;
  }
}

function getRegistryPath() {
  return process.env.PROOF_PACK_REGISTRY_PATH || DEFAULT_PROOF_PACK_REGISTRY_PATH;
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

function readProofPackRegistry() {
  try {
    const parsed = JSON.parse(fs.readFileSync(ensureRegistryFile(), "utf8"));
    return Array.isArray(parsed) ? parsed : [];
  } catch (error) {
    console.warn(`[PROOF] Registry read error (non-fatal): ${error.message}`);
    return [];
  }
}

function writeProofPackRegistry(records) {
  try {
    fs.writeFileSync(ensureRegistryFile(), JSON.stringify(Array.isArray(records) ? records : [], null, 2), "utf8");
    return true;
  } catch (error) {
    console.warn(`[PROOF] Registry write error (non-fatal): ${error.message}`);
    return false;
  }
}

function appendProofPackRecord(record = {}) {
  const records = readProofPackRegistry();
  records.push(safeClone(record, {}));
  writeProofPackRegistry(records);
  return safeClone(record, null);
}

module.exports = {
  DEFAULT_PROOF_PACK_REGISTRY_PATH,
  getRegistryPath,
  ensureRegistryFile,
  readProofPackRegistry,
  writeProofPackRegistry,
  appendProofPackRecord,
};
