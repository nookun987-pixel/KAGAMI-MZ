"use strict";

const assert = require("assert");

const { scanRepoHealth } = require("../repo_health_scanner");

const result = scanRepoHealth();
assert.strictEqual(result.status, "PASS");
assert.ok(Array.isArray(result.scan.issues));

console.log("PASS");
