"use strict";

const DEFAULT_AUTH_POLICY = {
  env_mode: "prod",
  require_auth: true,
  require_signature: true,
  allowed_callers: [
    "mikage-operator",
    "trusted-internal-agent",
  ],
  allowed_routes: [
    "/run-task",
  ],
  max_timestamp_skew_ms: 300000,
  auth_token: "provided-token",
  signature_secret: "mikage-signature-secret",
};

function toBoolean(value, fallback) {
  if (typeof value === "boolean") return value;
  if (typeof value === "string") {
    if (value.toLowerCase() === "true") return true;
    if (value.toLowerCase() === "false") return false;
  }
  return fallback;
}

function toNumber(value, fallback) {
  const num = Number(value);
  return Number.isFinite(num) ? num : fallback;
}

function normalizeArray(value, fallback) {
  if (Array.isArray(value)) {
    return value.map((item) => String(item).trim()).filter(Boolean);
  }
  if (typeof value === "string") {
    return value.split(",").map((item) => item.trim()).filter(Boolean);
  }
  return [...fallback];
}

function resolveAuthPolicy(input = {}) {
  const envMode = input.env_mode || process.env.MIKAGE_ENV_MODE || process.env.NODE_ENV || DEFAULT_AUTH_POLICY.env_mode;
  const requireAuth = toBoolean(
    input.require_auth ?? process.env.MIKAGE_REQUIRE_AUTH,
    DEFAULT_AUTH_POLICY.require_auth
  );
  const requireSignature = toBoolean(
    input.require_signature ?? process.env.MIKAGE_REQUIRE_SIGNATURE,
    DEFAULT_AUTH_POLICY.require_signature
  );

  return {
    env_mode: String(envMode || DEFAULT_AUTH_POLICY.env_mode).toLowerCase() === "dev" ? "dev" : "prod",
    require_auth: requireAuth,
    require_signature: requireSignature,
    allowed_callers: normalizeArray(
      input.allowed_callers ?? process.env.MIKAGE_ALLOWED_CALLERS,
      DEFAULT_AUTH_POLICY.allowed_callers
    ),
    allowed_routes: normalizeArray(
      input.allowed_routes ?? process.env.MIKAGE_ALLOWED_ROUTES,
      DEFAULT_AUTH_POLICY.allowed_routes
    ),
    max_timestamp_skew_ms: toNumber(
      input.max_timestamp_skew_ms ?? process.env.MIKAGE_MAX_TIMESTAMP_SKEW_MS,
      DEFAULT_AUTH_POLICY.max_timestamp_skew_ms
    ),
    auth_token: String(input.auth_token ?? process.env.MIKAGE_AUTH_TOKEN ?? DEFAULT_AUTH_POLICY.auth_token),
    signature_secret: String(input.signature_secret ?? process.env.MIKAGE_SIGNATURE_SECRET ?? DEFAULT_AUTH_POLICY.signature_secret),
  };
}

module.exports = {
  DEFAULT_AUTH_POLICY,
  resolveAuthPolicy,
};
