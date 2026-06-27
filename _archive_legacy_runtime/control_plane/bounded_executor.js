"use strict";

const { routeCommand } = require("./local_control_agent/command_router");

async function executeBounded(command, options = {}) {
  const started = Date.now();
  const execution_result = await routeCommand(command, {
    ...options,
    skipInspection: true,
  });
  return {
    status: execution_result && execution_result.status || "PASS",
    duration_ms: Date.now() - started,
    execution_result,
  };
}

module.exports = {
  executeBounded,
};
