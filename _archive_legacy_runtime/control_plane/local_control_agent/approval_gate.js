"use strict";

const { evaluateActionApproval } = require("../approval_engine");

function evaluateApproval(command, systemImpact = {}) {
  const toolType = systemImpact.tool_type || "unknown";
  const result = evaluateActionApproval(command, toolType, {
    reason: systemImpact.hard_block_reason || "approval_required",
  });
  return {
    status: result.allowed ? "ALLOW" : "BLOCKED",
    allowed: result.allowed,
    reason: result.reason,
  };
}

module.exports = {
  evaluateApproval,
};
