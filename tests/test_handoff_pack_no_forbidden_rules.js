"use strict";

const assert = require("assert");
const fs = require("fs");
const path = require("path");
const { validateHandoffPack } = require("../tools/handoff/validate_handoff_pack");

const result = validateHandoffPack();
assert.strictEqual(result.ok, true, result.errors.join("\n"));

const systemMap = fs.readFileSync(path.resolve(__dirname, "..", "docs/ai_handoff/SYSTEM_MAP.md"), "utf-8");
assert.ok(systemMap.includes("NO IMAGE = NO PASS"));

const runtimePath = fs.readFileSync(path.resolve(__dirname, "..", "docs/ai_handoff/CURRENT_RUNTIME_PATH.md"), "utf-8");
assert.ok(runtimePath.includes("UNKNOWN_NOT_PROVEN"));

console.log("test_handoff_pack_no_forbidden_rules: PASS");
