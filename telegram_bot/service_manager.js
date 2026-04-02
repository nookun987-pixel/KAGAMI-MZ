/**
 * telegram_bot/service_manager.js
 * Thin delegation layer — all service management is owned by lib/service_runner.js.
 * This file exists only for backward compatibility with router.js imports.
 */
const serviceRunner = require("../lib/service_runner");

async function restartService(serviceName) {
  try {
    const result = await serviceRunner.restartService(serviceName);
    return `SERVICE: ${serviceName}
STATUS: ${result.success ? "RESTARTED" : "ERROR"}
ACTION: ${result.message || "restart via service_runner"}`;
  } catch (error) {
    return `SERVICE: ${serviceName}
STATUS: ERROR
BLOCKER: ${error.message}`;
  }
}

module.exports = { restartService };
