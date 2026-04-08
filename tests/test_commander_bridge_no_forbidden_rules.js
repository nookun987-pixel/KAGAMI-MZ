"use strict";

const assert = require("assert");
const fs = require("fs");
const path = require("path");

const ROOT = path.resolve(__dirname, "..");
const contract = fs.readFileSync(path.join(ROOT, "control_plane", "commander_bridge", "BRIDGE_CONTRACT.md"), "utf8").toLowerCase();
assert.ok(contract.includes("no image = no pass"));
assert.ok(!contract.includes("bypass gemini judge"));
console.log("PASS");
