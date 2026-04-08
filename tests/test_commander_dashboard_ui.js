"use strict";

const assert = require("assert");
const fs = require("fs");
const path = require("path");

const html = fs.readFileSync(path.join(__dirname, "..", "control_plane", "local_control_agent", "dashboard.html"), "utf8");

assert.ok(html.includes("SYSTEM"));
assert.ok(html.includes("CONTROL"));
assert.ok(html.includes("COMMAND PANEL"));
assert.ok(html.includes("REPORTS"));
assert.ok(html.includes("WORKFLOWS"));
assert.ok(html.includes("ALERTS"));
assert.ok(html.includes("WAKE_VERIFY"));
assert.ok(html.includes("DESKTOP_CHECK"));
assert.ok(html.includes("REPO_CHECK"));
assert.ok(html.includes("DAILY_HEALTH"));
assert.ok(html.includes("SAFE_SHUTDOWN"));

console.log("PASS");
