"use strict";

const config = require("./config");

function normalizeTarget(targetPath) {
  return String(targetPath || "").replace(/\\/g, "/").toLowerCase();
}

function analyzeWriteTargets(targets) {
  const normalized = (targets || []).map(normalizeTarget);
  const sensitiveMatches = [];

  for (const target of normalized) {
    for (const rule of config.ARCH_SENSITIVE_PATHS) {
      const normRule = normalizeTarget(rule);
      if (target.includes(normRule)) {
        sensitiveMatches.push(rule);
      }
    }
  }

  const disallowed = normalized.find((target) => {
    return !config.ALLOWED_WRITE_PREFIXES.some((prefix) => target.startsWith(prefix.replace(/\\/g, "/")));
  });

  return {
    architecture_sensitive: sensitiveMatches.length > 0,
    sensitive_paths: [...new Set(sensitiveMatches)],
    hard_block_reason: disallowed ? `write target outside allowed bridge-safe paths: ${disallowed}` : null,
  };
}

function protectedDeleteCheck(targets) {
  const normalized = (targets || []).map(normalizeTarget);
  const blocked = normalized.find((target) => {
    return config.PROTECTED_PATH_PREFIXES.some((prefix) => target.startsWith(prefix.replace(/\\/g, "/")));
  });
  return blocked ? `protected path deletion blocked: ${blocked}` : null;
}

module.exports = {
  analyzeWriteTargets,
  protectedDeleteCheck,
};
