"use strict";

const assert = require("assert");
const { analyzeWriteTargets } = require("../control_plane/local_control_agent/system_map_guard");

const result = analyzeWriteTargets(["d:/KAGAMI-MZ/MIKAGE/index.js"]);
assert.strictEqual(result.architecture_sensitive, true);
assert.ok(result.sensitive_paths.includes("MIKAGE/index.js"));
console.log("PASS");
