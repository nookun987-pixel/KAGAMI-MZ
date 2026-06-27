"use strict";

const { readJsonSafe, writeJson } = require("./local_control_agent/bridge_writer");
const config = require("./local_control_agent/config");

const DEFAULT_WINDOW_MS = 60 * 1000;

function shouldEmitReport(kind, fingerprint, now = Date.now(), windowMs = DEFAULT_WINDOW_MS) {
  const cache = readJsonSafe(config.REPORT_DEDUPE_CACHE_PATH, {
    emitted: {},
  });
  cache.emitted = cache.emitted || {};
  const key = `${kind}:${fingerprint}`;
  const last = cache.emitted[key];
  if (last && (now - last) < windowMs) {
    return false;
  }
  cache.emitted[key] = now;
  writeJson(config.REPORT_DEDUPE_CACHE_PATH, cache);
  return true;
}

module.exports = {
  DEFAULT_WINDOW_MS,
  shouldEmitReport,
};
