"use strict";

const {
  getTabTarget,
  getStartupApps,
  getStartupUrls,
  getStartupFullApps,
  getStartupFullUrls,
} = require("./window_registry");
const config = require("./config");

function buildStartupWorkspacePlan() {
  return {
    apps: getStartupApps(),
    urls: getStartupUrls(),
  };
}

function buildStartupWorkspaceFullPlan() {
  return {
    apps: getStartupFullApps(),
    urls: getStartupFullUrls(),
  };
}

function buildPortableWorkspaceSummary() {
  return {
    machine_id: config.MACHINE_PROFILE.machine_id,
    node_role: config.NODE_ROLE.role_id,
    startup_apps: getStartupApps().map((item) => item.app),
    startup_urls: getStartupUrls(),
    localhost_url: getTabTarget("localhost"),
  };
}

module.exports = {
  buildStartupWorkspacePlan,
  buildStartupWorkspaceFullPlan,
  buildPortableWorkspaceSummary,
};
