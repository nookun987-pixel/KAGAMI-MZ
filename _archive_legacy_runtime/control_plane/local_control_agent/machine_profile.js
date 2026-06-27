"use strict";

const fs = require("fs");
const path = require("path");

const ROOT = path.resolve(__dirname, "..", "..");
const PROFILE_DIR = path.join(ROOT, "control_plane", "local_control_agent", "machine_profiles");
const SCHEMA_PATH = path.join(ROOT, "control_plane", "local_control_agent", "machine_profile.schema.json");

function readJson(filePath) {
  return JSON.parse(fs.readFileSync(filePath, "utf8"));
}

function loadSchema() {
  return readJson(SCHEMA_PATH);
}

function listProfiles() {
  return fs.readdirSync(PROFILE_DIR)
    .filter((name) => name.endsWith(".json"))
    .map((name) => ({
      file: name,
      path: path.join(PROFILE_DIR, name),
      profile: readJson(path.join(PROFILE_DIR, name)),
    }));
}

function validateMachineProfile(profile) {
  const schema = loadSchema();
  for (const field of schema.required_fields || []) {
    if (!(field in profile)) {
      throw new Error(`machine_profile_missing_field:${field}`);
    }
  }
  return profile;
}

function resolveMachineProfile(options = {}) {
  const explicitId = options.machineId || process.env.MIKAGE_MACHINE_PROFILE || null;
  const hostname = String(options.hostname || process.env.COMPUTERNAME || process.env.HOSTNAME || "").toUpperCase();
  const entries = listProfiles();

  let found = null;
  if (explicitId) {
    found = entries.find((entry) => entry.profile.machine_id === explicitId);
  } else if (hostname) {
    found = entries.find((entry) => Array.isArray(entry.profile.hostnames)
      && entry.profile.hostnames.map((item) => String(item).toUpperCase()).includes(hostname));
  }

  if (!found) {
    throw new Error(`machine_profile_not_found:${explicitId || hostname || "unknown"}`);
  }

  const profile = validateMachineProfile(found.profile);
  return {
    ...profile,
    profile_path: found.path,
    resolution_source: explicitId ? "machine_id" : "hostname",
    resolved_hostname: hostname || null,
  };
}

module.exports = {
  PROFILE_DIR,
  SCHEMA_PATH,
  listProfiles,
  validateMachineProfile,
  resolveMachineProfile,
};
