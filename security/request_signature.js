"use strict";

const crypto = require("crypto");

function safeCompare(left, right) {
  try {
    const a = Buffer.from(String(left || ""), "utf8");
    const b = Buffer.from(String(right || ""), "utf8");
    if (a.length !== b.length) return false;
    return crypto.timingSafeEqual(a, b);
  } catch (_) {
    return false;
  }
}

function signRequest(context = {}, secret = "") {
  try {
    const payload = [
      context.caller_id || "",
      context.route || "",
      String(context.timestamp || ""),
    ].join(":");
    return crypto.createHmac("sha256", String(secret || ""))
      .update(payload)
      .digest("hex");
  } catch (_) {
    return "";
  }
}

function isValidAuthToken(context = {}, policy = {}) {
  return safeCompare(context.auth_token || "", policy.auth_token || "");
}

function isValidRequestSignature(context = {}, policy = {}) {
  const expected = signRequest(context, policy.signature_secret || "");
  return safeCompare(context.request_signature || "", expected);
}

function isTimestampFresh(context = {}, policy = {}, nowMs = Date.now()) {
  const timestamp = Number(context.timestamp);
  const maxSkew = Number(policy.max_timestamp_skew_ms) || 0;
  if (!Number.isFinite(timestamp)) return false;
  return Math.abs(nowMs - timestamp) <= maxSkew;
}

module.exports = {
  safeCompare,
  signRequest,
  isValidAuthToken,
  isValidRequestSignature,
  isTimestampFresh,
};
