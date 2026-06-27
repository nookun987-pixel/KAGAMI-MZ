"use strict";

const fs = require("fs");
const path = require("path");

const config = require("./config");

function checkPathExists(filePath) {
  return {
    path: filePath,
    exists: fs.existsSync(filePath),
    reason: fs.existsSync(filePath) ? "ok" : "missing_path",
  };
}

function checkCommandMapped(label, commandValue) {
  return {
    label,
    mapped: Boolean(commandValue && String(commandValue).trim()),
    value: commandValue || null,
    reason: commandValue ? "ok" : "missing_mapping",
  };
}

function buildBringupChecklist() {
  const profile = config.MACHINE_PROFILE;
  const role = config.NODE_ROLE;
  const checks = {
    profile_resolution: {
      passed: profile.machine_id === "laptop_commander",
      expected: "laptop_commander",
      actual: profile.machine_id,
      reason: profile.machine_id === "laptop_commander" ? "ok" : "machine_profile_not_laptop_commander",
    },
    node_role_resolution: {
      passed: role.role_id === "commander",
      expected: "commander",
      actual: role.role_id,
      reason: role.role_id === "commander" ? "ok" : "node_role_not_commander",
    },
    repo_root: checkPathExists(profile.repo_root),
    app_mappings: [
      checkCommandMapped("chrome_path", profile.chrome_path),
      checkCommandMapped("vscode_path", profile.vscode_path),
      checkCommandMapped("cmd_path", profile.cmd_path),
    ],
    startup_urls: {
      passed: Array.isArray(profile.startup_urls) && profile.startup_urls.length > 0,
      values: profile.startup_urls || [],
      reason: Array.isArray(profile.startup_urls) && profile.startup_urls.length > 0 ? "ok" : "missing_startup_urls",
    },
    machine_snapshot_fields: {
      passed: Boolean(config.MACHINE_PROFILE.machine_id && config.NODE_ROLE.role_id),
      machine_id: config.MACHINE_PROFILE.machine_id,
      node_role: config.NODE_ROLE.role_id,
      reason: config.MACHINE_PROFILE.machine_id && config.NODE_ROLE.role_id ? "ok" : "missing_machine_snapshot_fields",
    },
    commander_desktop_permissions: {
      passed: !!(role.permissions && role.permissions.desktop_control && role.permissions.desktop_observe),
      permissions: role.permissions || {},
      reason: role.permissions && role.permissions.desktop_control && role.permissions.desktop_observe ? "ok" : "desktop_permissions_missing",
    },
    reviewed_repo_mutation_guarded: {
      passed: role.permissions && role.permissions.reviewed_repo_mutation === true,
      reason: role.permissions && role.permissions.reviewed_repo_mutation === true ? "ok" : "reviewed_repo_mutation_not_enabled_for_commander",
    },
  };

  const appMappingsPassed = checks.app_mappings.every((entry) => entry.mapped);
  const allPassed = [
    checks.profile_resolution.passed,
    checks.node_role_resolution.passed,
    checks.repo_root.exists,
    appMappingsPassed,
    checks.startup_urls.passed,
    checks.machine_snapshot_fields.passed,
    checks.commander_desktop_permissions.passed,
    checks.reviewed_repo_mutation_guarded.passed,
  ].every(Boolean);

  return {
    machine_id: profile.machine_id,
    node_role: role.role_id,
    checks,
    status: allPassed ? "PASS" : "FAIL",
  };
}

module.exports = {
  buildBringupChecklist,
};
