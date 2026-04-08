"use strict";

const assert = require("assert");
const { execFileSync } = require("child_process");

const output = execFileSync("node", ["control_plane/local_control_agent/send_command.js", "paths"], {
  cwd: __dirname + "/..",
  encoding: "utf8",
});

assert.ok(output.includes("inbox:"));
assert.ok(output.includes("outbox:"));
assert.ok(output.includes("archive:"));
assert.ok(output.includes("reports:"));
console.log("PASS");
