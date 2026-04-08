"use strict";

const { approveAndCleanSafe } = require("./approve_cleanup");
const { log } = require("./audit_logger");

function startScheduler() {
  const DAY = 24 * 60 * 60 * 1000;

  setInterval(() => {
    try {
      const res = approveAndCleanSafe();
      log("scheduler.daily_clean", res);
    } catch (e) {
      log("scheduler.error", { error: e.message });
    }
  }, DAY);
}

module.exports = { startScheduler };
