"use strict";

const fs = require("fs");
const path = require("path");

const config = require("./local_control_agent/config");
const { readJsonSafe, writeJson } = require("./local_control_agent/bridge_writer");

const MAX_INTENT_DEPTH = 3;
const FAILURE_COOLDOWN_MS = 5 * 60 * 1000;
const RETRY_COOLDOWN_MS = 2 * 60 * 1000;

function readLoopGuardState() {
  return readJsonSafe(config.LOOP_GUARD_STATE_PATH, {
    generated_at: null,
    failure_fingerprints: {},
    retry_sources: {},
    intent_depths: {},
  });
}

function writeLoopGuardState(store) {
  store.generated_at = new Date().toISOString();
  writeJson(config.LOOP_GUARD_STATE_PATH, store);
}

function evaluateLoopSafety(input, now = Date.now()) {
  const store = readLoopGuardState();
  const depth = Number(input.depth || 1);
  if (depth > MAX_INTENT_DEPTH) {
    return { allowed: false, reason: "max_intent_depth_exceeded" };
  }
  if (input.failure_fingerprint) {
    const last = store.failure_fingerprints[input.failure_fingerprint];
    if (last && (now - last) < FAILURE_COOLDOWN_MS) {
      return { allowed: false, reason: "failure_fingerprint_cooldown" };
    }
  }
  if (input.retry_source) {
    const last = store.retry_sources[input.retry_source];
    if (last && (now - last) < RETRY_COOLDOWN_MS) {
      return { allowed: false, reason: "retry_cooldown" };
    }
  }
  return { allowed: true, reason: "loop_safe" };
}

function markLoopUsage(input, now = Date.now()) {
  const store = readLoopGuardState();
  store.failure_fingerprints = store.failure_fingerprints || {};
  store.retry_sources = store.retry_sources || {};
  store.intent_depths = store.intent_depths || {};
  if (input.failure_fingerprint) store.failure_fingerprints[input.failure_fingerprint] = now;
  if (input.retry_source) store.retry_sources[input.retry_source] = now;
  if (input.intent_id) store.intent_depths[input.intent_id] = Number(input.depth || 1);
  writeLoopGuardState(store);
}

module.exports = {
  MAX_INTENT_DEPTH,
  FAILURE_COOLDOWN_MS,
  RETRY_COOLDOWN_MS,
  readLoopGuardState,
  evaluateLoopSafety,
  markLoopUsage,
};
