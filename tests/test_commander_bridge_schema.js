"use strict";

const assert = require("assert");
const fs = require("fs");
const path = require("path");

const ROOT = path.resolve(__dirname, "..");
const schema = JSON.parse(fs.readFileSync(path.join(ROOT, "control_plane", "commander_bridge", "bridge_schema.json"), "utf8"));
const approval = JSON.parse(fs.readFileSync(path.join(ROOT, "control_plane", "commander_bridge", "approval_policy.json"), "utf8"));

assert.ok(schema.bridge_version);
assert.ok(Array.isArray(schema.command_schema.required));
assert.ok(Array.isArray(schema.report_schema.required));
assert.ok(approval.auto_allow.includes("repo.status"));
assert.ok(approval.requires_approval.includes("repo.commit"));

console.log("PASS");
