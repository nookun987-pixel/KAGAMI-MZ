"use strict";

const SAFE_DELETE_PATTERNS = [
  /\\__pycache__\\?$/i,
  /\\\.pytest_cache\\?$/i,
  /\\\.cache\\?$/i,
  /\\temp\\/i,
  /\\tmp\\/i,
  /\\logs?\\/i,
  /\\\.log$/i,
  /\\Thumbs\.db$/i,
  /\\Desktop\.ini$/i,
];

const PROTECTED_PATH_PATTERNS = [
  /\\KAGAMI-MZ(\\|$)/i,
  /\\My Drive(\\|$)/i,
  /\\Users\\[^\\]+\\Desktop(\\|$)/i,
  /\\Users\\[^\\]+\\Documents(\\|$)/i,
  /\\Users\\[^\\]+\\Pictures(\\|$)/i,
  /\\Users\\[^\\]+\\Videos(\\|$)/i,
  /\\Users\\[^\\]+\\Downloads(\\|$)/i,
  /\\node_modules(\\|$)/i,
  /\\models?(\\|$)/i,
  /\\checkpoints?(\\|$)/i,
  /\\outputs?(\\|$)/i,
];

function isProtectedPath(targetPath) {
  return PROTECTED_PATH_PATTERNS.some((pattern) => pattern.test(String(targetPath || "")));
}

function isSafeDeleteCandidate(targetPath) {
  if (isProtectedPath(targetPath)) {
    return false;
  }
  return SAFE_DELETE_PATTERNS.some((pattern) => pattern.test(String(targetPath || "")));
}

function classifyPath(targetPath) {
  if (isProtectedPath(targetPath)) {
    return "protected";
  }
  if (isSafeDeleteCandidate(targetPath)) {
    return "safe_delete";
  }
  return "review_required";
}

module.exports = {
  SAFE_DELETE_PATTERNS,
  PROTECTED_PATH_PATTERNS,
  isProtectedPath,
  isSafeDeleteCandidate,
  classifyPath,
};
