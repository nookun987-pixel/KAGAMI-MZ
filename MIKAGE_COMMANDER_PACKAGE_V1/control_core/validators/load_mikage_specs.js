/**
 * MIKAGE — Spec Loader Helper
 * Loads Mikage spec files and provides paths for rule engine integration.
 */

"use strict";

const path = require("path");
const fs = require("fs");

const SPEC_DIR = path.join(__dirname, "..", "specs");

const SPEC_FILES = {
  image_control: path.join(SPEC_DIR, "mikage_image_control_spec.json"),
  z_blue: path.join(SPEC_DIR, "mikage_z_blue_spec.json"),
  failure_taxonomy: path.join(SPEC_DIR, "mikage_failure_taxonomy.json"),
  spec_code_mapping: path.join(SPEC_DIR, "mikage_spec_code_mapping.json"),
};

function getSpecPath(specName) {
  const p = SPEC_FILES[specName];
  if (!p || !fs.existsSync(p)) {
    throw new Error(`[MIKAGE_SPECS] Spec not found: ${specName}`);
  }
  return p;
}

function loadSpec(specName) {
  const p = getSpecPath(specName);
  return JSON.parse(fs.readFileSync(p, "utf-8"));
}

function getVersions() {
  const imageControl = loadSpec("image_control");
  const zBlue = loadSpec("z_blue");
  return {
    spec_version: `mikage_image_control_v${imageControl.length || 0}rules`,
    z_blue_spec_version: zBlue.version || "unknown",
  };
}

module.exports = {
  SPEC_FILES,
  getSpecPath,
  loadSpec,
  getVersions,
};
