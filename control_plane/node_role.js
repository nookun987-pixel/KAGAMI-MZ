"use strict";

const fs = require("fs");
const path = require("path");

const ROOT = path.resolve(__dirname, "..");
const ROLE_DIR = path.join(ROOT, "control_plane", "node_roles");

function readJson(filePath) {
  return JSON.parse(fs.readFileSync(filePath, "utf8"));
}

function resolveNodeRole(profile, options = {}) {
  const roleId = options.roleId || process.env.MIKAGE_NODE_ROLE || (profile && profile.node_role);
  if (!roleId) {
    throw new Error("node_role_not_resolved");
  }
  const rolePath = path.join(ROLE_DIR, `${roleId}.json`);
  if (!fs.existsSync(rolePath)) {
    throw new Error(`node_role_missing:${roleId}`);
  }
  return {
    ...readJson(rolePath),
    role_path: rolePath,
  };
}

module.exports = {
  ROLE_DIR,
  resolveNodeRole,
};
