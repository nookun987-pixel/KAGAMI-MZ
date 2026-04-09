"use strict";

const forbiddenPatterns = [
  /start_mikage\.bat/i,
  /MIKAGE[\\/]index\.js/i,
  /runtime[\\/]drive_queue[\\/]runtime\.js/i,
  /runtime[\\/]colab_worker/i,
  /^\/?$/i,
  /\.\./,
];

function evaluateCleanupScope(candidate = {}) {
  const refs = []
    .concat(candidate.scope_in || [])
    .concat(candidate.target_files || []);
  const objective = String(candidate.objective || "");
  if (/\b(delete|remove|purge|wipe|clean all|recursive)\b/i.test(objective)) {
    return { allowed: false, reason: "broad_cleanup_language_blocked" };
  }
  if (refs.some((ref) => forbiddenPatterns.some((pattern) => pattern.test(String(ref))))) {
    return { allowed: false, reason: "cleanup_scope_hits_forbidden_path" };
  }
  return { allowed: true, reason: "cleanup_scope_safe" };
}

module.exports = {
  evaluateCleanupScope,
};
