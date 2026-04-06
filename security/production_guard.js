"use strict";

const fs = require("fs");
const path = require("path");
const { resolveAuthPolicy } = require("./auth_policy");
const {
  isValidAuthToken,
  isValidRequestSignature,
  isTimestampFresh,
} = require("./request_signature");

const DEFAULT_AUDIT_LOG_PATH = path.join(__dirname, "..", "memory", "access_audit_log.json");

function safeClone(value, fallback = null) {
  try {
    return JSON.parse(JSON.stringify(value));
  } catch (_) {
    return fallback;
  }
}

function getAuditLogPath() {
  return process.env.ACCESS_AUDIT_LOG_PATH || DEFAULT_AUDIT_LOG_PATH;
}

function ensureAuditLogFile() {
  try {
    const auditPath = getAuditLogPath();
    const dir = path.dirname(auditPath);
    if (!fs.existsSync(dir)) fs.mkdirSync(dir, { recursive: true });
    if (!fs.existsSync(auditPath)) fs.writeFileSync(auditPath, "[]", "utf8");
    return auditPath;
  } catch (_) {
    return getAuditLogPath();
  }
}

function readAccessAuditLog() {
  try {
    const auditPath = ensureAuditLogFile();
    const parsed = JSON.parse(fs.readFileSync(auditPath, "utf8"));
    return Array.isArray(parsed) ? parsed : [];
  } catch (error) {
    console.warn(`[SECURITY] Audit log read error (non-fatal): ${error.message}`);
    return [];
  }
}

function appendAccessAudit(entry = {}) {
  try {
    const audit = readAccessAuditLog();
    const next = {
      timestamp: entry.timestamp || new Date().toISOString(),
      caller_id: entry.caller_id || "unknown",
      route: entry.route || "unknown",
      decision: entry.decision || "REJECT",
      reason: entry.reason || "UNKNOWN",
    };
    audit.push(next);
    fs.writeFileSync(ensureAuditLogFile(), JSON.stringify(audit, null, 2), "utf8");
    return { ok: true, entry: safeClone(next, null) };
  } catch (error) {
    return { ok: false, entry: null, reason: error.message };
  }
}

function buildRequestAccessContext(req, body = {}, routeOverride) {
  const headers = (req && req.headers) || {};
  const authHeader = headers.authorization || headers.Authorization || "";
  const bearerToken = typeof authHeader === "string" && authHeader.startsWith("Bearer ")
    ? authHeader.slice("Bearer ".length)
    : "";

  return {
    env_mode: body.env_mode || headers["x-env-mode"] || process.env.MIKAGE_ENV_MODE || process.env.NODE_ENV || "prod",
    caller_id: body.caller_id || headers["x-caller-id"] || null,
    auth_token: body.auth_token || headers["x-auth-token"] || bearerToken || null,
    request_signature: body.request_signature || headers["x-request-signature"] || null,
    timestamp: body.timestamp ?? headers["x-timestamp"] ?? null,
    route: routeOverride || (req && req.url) || body.route || null,
  };
}

function evaluateProductionAccess(context = {}, options = {}) {
  try {
    const policy = resolveAuthPolicy(options.policy || context.policy || context);
    const route = context.route || "";
    const callerId = context.caller_id || "unknown";

    if (policy.env_mode === "dev") {
      const allowDev = {
        status: "ALLOW",
        allowed: true,
        reason: "AUTHORIZED_DEV_RELAXED",
      };
      appendAccessAudit({
        caller_id: callerId,
        route,
        decision: allowDev.status,
        reason: allowDev.reason,
      });
      return allowDev;
    }

    const missingAuth = !context.caller_id || !context.auth_token || !context.request_signature || context.timestamp === null || context.timestamp === undefined;
    if (policy.require_auth && missingAuth) {
      const reject = { status: "REJECT", allowed: false, reason: "AUTH_REQUIRED" };
      appendAccessAudit({ caller_id: callerId, route, decision: reject.status, reason: reject.reason });
      return reject;
    }

    if (!policy.allowed_callers.includes(context.caller_id)) {
      const reject = { status: "REJECT", allowed: false, reason: "CALLER_NOT_ALLOWED" };
      appendAccessAudit({ caller_id: callerId, route, decision: reject.status, reason: reject.reason });
      return reject;
    }

    if (!policy.allowed_routes.includes(route)) {
      const reject = { status: "REJECT", allowed: false, reason: "ROUTE_NOT_ALLOWED" };
      appendAccessAudit({ caller_id: callerId, route, decision: reject.status, reason: reject.reason });
      return reject;
    }

    if (!isTimestampFresh(context, policy, options.now_ms)) {
      const reject = { status: "REJECT", allowed: false, reason: "STALE_REQUEST" };
      appendAccessAudit({ caller_id: callerId, route, decision: reject.status, reason: reject.reason });
      return reject;
    }

    if (policy.require_auth && !isValidAuthToken(context, policy)) {
      const reject = { status: "REJECT", allowed: false, reason: "INVALID_AUTH_TOKEN" };
      appendAccessAudit({ caller_id: callerId, route, decision: reject.status, reason: reject.reason });
      return reject;
    }

    if (policy.require_signature && !isValidRequestSignature(context, policy)) {
      const reject = { status: "REJECT", allowed: false, reason: "INVALID_REQUEST_SIGNATURE" };
      appendAccessAudit({ caller_id: callerId, route, decision: reject.status, reason: reject.reason });
      return reject;
    }

    const allow = { status: "ALLOW", allowed: true, reason: "AUTHORIZED" };
    appendAccessAudit({ caller_id: callerId, route, decision: allow.status, reason: allow.reason });
    return allow;
  } catch (error) {
    const reject = { status: "REJECT", allowed: false, reason: "PRODUCTION_GUARD_ERROR" };
    appendAccessAudit({
      caller_id: context.caller_id || "unknown",
      route: context.route || "unknown",
      decision: reject.status,
      reason: reject.reason,
    });
    return {
      ...reject,
      error: error.message,
    };
  }
}

module.exports = {
  DEFAULT_AUDIT_LOG_PATH,
  getAuditLogPath,
  ensureAuditLogFile,
  readAccessAuditLog,
  appendAccessAudit,
  buildRequestAccessContext,
  evaluateProductionAccess,
};
