"use strict";

const fs = require("fs");
const config = require("./config");

function readPolicy() {
  return JSON.parse(fs.readFileSync(config.APPROVAL_MODEL, "utf8"));
}

function evaluateApproval(command, systemImpact = {}) {
  const policy = readPolicy();
  const action = String(command.action || "");
  const payload = command.payload || {};

  if (systemImpact.hard_block_reason) {
    return {
      status: "BLOCKED",
      allowed: false,
      reason: systemImpact.hard_block_reason,
    };
  }

  if (systemImpact.architecture_sensitive) {
    const approved = command.approval && command.approval.status === "approved";
    return {
      status: approved ? "ALLOW" : "BLOCKED",
      allowed: approved,
      reason: approved ? "explicit approval present" : "architecture-sensitive action requires approval",
    };
  }

  if (action === "desktop.open_url" || action === "desktop.open_tab") {
    const url = String(payload.url || "");
    const approvedPrefixes = policy.approved_url_prefixes || [];
    const approved = approvedPrefixes.some((prefix) => url.startsWith(prefix));
    if (approved) {
      return {
        status: "ALLOW",
        allowed: true,
        reason: "approved url prefix",
      };
    }
    const explicitApproval = command.approval && command.approval.status === "approved";
    return {
      status: explicitApproval ? "ALLOW" : "BLOCKED",
      allowed: explicitApproval,
      reason: explicitApproval ? "explicit approval present" : "url outside approved list",
    };
  }

  if ((policy.auto_allow || []).includes(action)) {
    return {
      status: "ALLOW",
      allowed: true,
      reason: "auto-allow action",
    };
  }

  if ((policy.require_approval || []).includes(action)) {
    const approved = command.approval && command.approval.status === "approved";
    return {
      status: approved ? "ALLOW" : "BLOCKED",
      allowed: approved,
      reason: approved ? "explicit approval present" : "approval required",
    };
  }

  return {
    status: "BLOCKED",
    allowed: false,
    reason: "unknown or unapproved action",
  };
}

module.exports = {
  evaluateApproval,
};
