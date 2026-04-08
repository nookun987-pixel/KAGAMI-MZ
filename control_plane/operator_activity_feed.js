"use strict";

const crypto = require("crypto");
const fs = require("fs");
const path = require("path");

const config = require("./local_control_agent/config");
const { readJsonSafe, writeJson } = require("./local_control_agent/bridge_writer");
const { shouldEmitReport } = require("./report_dedupe_guard");

function appendJsonl(filePath, value) {
  fs.mkdirSync(path.dirname(filePath), { recursive: true });
  fs.appendFileSync(filePath, `${JSON.stringify(value)}\n`, "utf8");
}

function readActivityFeed() {
  return readJsonSafe(config.OPERATOR_ACTIVITY_FEED_PATH, {
    generated_at: null,
    items: [],
  });
}

function writeActivityFeed(store) {
  store.generated_at = new Date().toISOString();
  writeJson(config.OPERATOR_ACTIVITY_FEED_PATH, store);
}

function appendActivityFeed(input) {
  const fingerprint = crypto.createHash("sha256").update(JSON.stringify({
    workflow_id: input.workflow_id || null,
    task_id: input.task_id || null,
    event_type: input.event_type || null,
    short_text: input.short_text || null,
    severity: input.severity || null,
  })).digest("hex");
  if (!shouldEmitReport("activity_feed", fingerprint)) {
    return { emitted: false, item: null };
  }
  const store = readActivityFeed();
  const item = {
    feed_id: input.feed_id || `feed_${Date.now()}_${crypto.randomBytes(3).toString("hex")}`,
    workflow_id: input.workflow_id || null,
    task_id: input.task_id || null,
    event_type: input.event_type,
    short_text: input.short_text || "",
    severity: input.severity || "info",
    refs: input.refs || [],
    timestamp: new Date().toISOString(),
    fingerprint,
  };
  store.items = Array.isArray(store.items) ? store.items : [];
  store.items.unshift(item);
  store.items = store.items.slice(0, 300);
  writeActivityFeed(store);
  appendJsonl(config.OPERATOR_ACTIVITY_FEED_HISTORY_JSONL, item);
  return { emitted: true, item };
}

function getActivityFeed(limit = 50) {
  const store = readActivityFeed();
  return {
    generated_at: store.generated_at || null,
    items: (store.items || []).slice(0, limit),
  };
}

module.exports = {
  appendActivityFeed,
  getActivityFeed,
};
