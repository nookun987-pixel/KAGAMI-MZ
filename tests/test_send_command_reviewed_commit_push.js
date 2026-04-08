"use strict";

const assert = require("assert");

const { buildCommandFromFlags } = require("../control_plane/local_control_agent/send_command");

const built = buildCommandFromFlags([
  "reviewed_commit_push",
  "--message",
  "test reviewed push",
  "--files",
  "control_plane/local_control_agent/send_command.js,control_plane/reviewed_operator_flow.js",
]);

assert.strictEqual(built.mode, "command");
assert.strictEqual(built.command.action, "repo.reviewed_commit_push");
assert.strictEqual(built.command.approval.status, "approved");
assert.deepStrictEqual(built.command.payload.files, [
  "control_plane/local_control_agent/send_command.js",
  "control_plane/reviewed_operator_flow.js",
]);
assert.strictEqual(built.command.payload.branch, "main");
console.log("PASS");
