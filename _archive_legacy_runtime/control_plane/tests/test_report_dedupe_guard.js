"use strict";

const assert = require("assert");

const { shouldEmitReport } = require("../report_dedupe_guard");

const fingerprint = `fingerprint_${Date.now()}`;
const first = shouldEmitReport("governance", fingerprint, 1000, 60000);
const second = shouldEmitReport("governance", fingerprint, 2000, 60000);
const third = shouldEmitReport("governance", fingerprint, 70000, 60000);

assert.strictEqual(first, true);
assert.strictEqual(second, false);
assert.strictEqual(third, true);

console.log("PASS");
