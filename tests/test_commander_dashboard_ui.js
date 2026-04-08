"use strict";

const assert = require("assert");
const fs = require("fs");
const path = require("path");

const html = fs.readFileSync(path.join(__dirname, "..", "control_plane", "local_control_agent", "dashboard.html"), "utf8");

assert.ok(html.includes("SYSTEM"));
assert.ok(html.includes("SESSION"));
assert.ok(html.includes("ORCHESTRA VIEW"));
assert.ok(html.includes("OPS VIEW"));
assert.ok(html.includes("CONTROL"));
assert.ok(html.includes("COMMAND PANEL"));
assert.ok(html.includes("REPORTS"));
assert.ok(html.includes("WORKFLOWS"));
assert.ok(html.includes("EXECUTION HISTORY"));
assert.ok(html.includes("APPROVAL QUEUE"));
assert.ok(html.includes("ALERTS"));
assert.ok(html.includes("APPROVAL INBOX V1"));
assert.ok(html.includes("FAILURE CENTER V1"));
assert.ok(html.includes("RETRY QUEUE V1"));
assert.ok(html.includes("TASK LIFECYCLE V1"));
assert.ok(html.includes("GOVERNANCE SNAPSHOT V1"));
assert.ok(html.includes("WORKFLOW SUMMARY V1"));
assert.ok(html.includes("ACTIVITY FEED V1"));
assert.ok(html.includes("GOVERNANCE REPORTS V1"));
assert.ok(html.includes("Current Workflow"));
assert.ok(html.includes("Verdict Board"));
assert.ok(html.includes("Timeline Feed"));
assert.ok(html.includes("Latest Blocker"));
assert.ok(html.includes("WAKE_VERIFY"));
assert.ok(html.includes("DESKTOP_CHECK"));
assert.ok(html.includes("REPO_CHECK"));
assert.ok(html.includes("DAILY_HEALTH"));
assert.ok(html.includes("SAFE_SHUTDOWN"));
assert.ok(html.includes("setView('ops')"));
assert.ok(html.includes("setView('orchestra')"));

console.log("PASS");
