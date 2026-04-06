"use strict";

const test = require("node:test");
const assert = require("node:assert/strict");
const fs = require("fs");
const os = require("os");
const path = require("path");

function setupEnv() {
  const root = fs.mkdtempSync(path.join(os.tmpdir(), "mikage-security-"));
  process.env.ACCESS_AUDIT_LOG_PATH = path.join(root, "memory", "access_audit_log.json");
  return root;
}

function clearModuleCache() {
  for (const key of Object.keys(require.cache)) {
    if (key.includes("\\security\\")) {
      delete require.cache[key];
    }
  }
}

function loadModules() {
  clearModuleCache();
  return {
    guard: require("./production_guard"),
    signer: require("./request_signature"),
  };
}

function basePolicy(overrides = {}) {
  return {
    env_mode: "prod",
    require_auth: true,
    require_signature: true,
    allowed_callers: ["mikage-operator", "trusted-internal-agent"],
    allowed_routes: ["/run-task"],
    max_timestamp_skew_ms: 300000,
    auth_token: "provided-token",
    signature_secret: "mikage-signature-secret",
    ...overrides,
  };
}

function buildContext(signer, overrides = {}) {
  const context = {
    env_mode: "prod",
    caller_id: "mikage-operator",
    auth_token: "provided-token",
    request_signature: "",
    timestamp: 1710000000000,
    route: "/run-task",
    ...overrides,
  };
  context.request_signature = overrides.request_signature || signer.signRequest(context, "mikage-signature-secret");
  return context;
}

test("TEST 1: missing auth in prod -> reject", () => {
  setupEnv();
  const { guard } = loadModules();
  const result = guard.evaluateProductionAccess({
    env_mode: "prod",
    route: "/run-task",
  }, { policy: basePolicy() });

  assert.equal(result.allowed, false);
  assert.equal(result.reason, "AUTH_REQUIRED");
});

test("TEST 2: invalid token -> reject", () => {
  setupEnv();
  const { guard, signer } = loadModules();
  const context = buildContext(signer, { auth_token: "wrong-token" });
  const result = guard.evaluateProductionAccess(context, {
    policy: basePolicy(),
    now_ms: context.timestamp,
  });

  assert.equal(result.allowed, false);
  assert.equal(result.reason, "INVALID_AUTH_TOKEN");
});

test("TEST 3: invalid signature -> reject", () => {
  setupEnv();
  const { guard, signer } = loadModules();
  const context = buildContext(signer, { request_signature: "bad-signature" });
  const result = guard.evaluateProductionAccess(context, {
    policy: basePolicy(),
    now_ms: context.timestamp,
  });

  assert.equal(result.allowed, false);
  assert.equal(result.reason, "INVALID_REQUEST_SIGNATURE");
});

test("TEST 4: caller not allowlisted -> reject", () => {
  setupEnv();
  const { guard, signer } = loadModules();
  const context = buildContext(signer, { caller_id: "unknown-caller" });
  context.request_signature = signer.signRequest(context, "mikage-signature-secret");
  const result = guard.evaluateProductionAccess(context, {
    policy: basePolicy(),
    now_ms: context.timestamp,
  });

  assert.equal(result.allowed, false);
  assert.equal(result.reason, "CALLER_NOT_ALLOWED");
});

test("TEST 5: stale timestamp -> reject", () => {
  setupEnv();
  const { guard, signer } = loadModules();
  const context = buildContext(signer, { timestamp: 1710000000000 });
  const result = guard.evaluateProductionAccess(context, {
    policy: basePolicy(),
    now_ms: context.timestamp + 300001,
  });

  assert.equal(result.allowed, false);
  assert.equal(result.reason, "STALE_REQUEST");
});

test("TEST 6: valid prod request -> allow", () => {
  setupEnv();
  const { guard, signer } = loadModules();
  const context = buildContext(signer);
  const result = guard.evaluateProductionAccess(context, {
    policy: basePolicy(),
    now_ms: context.timestamp,
  });

  assert.equal(result.allowed, true);
  assert.equal(result.reason, "AUTHORIZED");
});

test("TEST 7: dev mode relaxed request -> allow with audit log", () => {
  setupEnv();
  const { guard } = loadModules();
  const result = guard.evaluateProductionAccess({
    env_mode: "dev",
    route: "/run-task",
  }, {
    policy: basePolicy({ env_mode: "dev" }),
  });

  assert.equal(result.allowed, true);
  assert.equal(result.reason, "AUTHORIZED_DEV_RELAXED");
});

test("TEST 8: every decision persists to access audit log", () => {
  setupEnv();
  const { guard, signer } = loadModules();
  const valid = buildContext(signer);
  const invalid = { env_mode: "prod", route: "/run-task" };

  guard.evaluateProductionAccess(valid, {
    policy: basePolicy(),
    now_ms: valid.timestamp,
  });
  guard.evaluateProductionAccess(invalid, {
    policy: basePolicy(),
    now_ms: valid.timestamp,
  });

  const audit = guard.readAccessAuditLog();
  assert.equal(audit.length, 2);
  assert.equal(audit[0].decision, "ALLOW");
  assert.equal(audit[1].decision, "REJECT");
});
