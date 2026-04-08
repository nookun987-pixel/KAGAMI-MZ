"use strict";

const assert = require("assert");
const fs = require("fs");
const path = require("path");

function readJson(relativePath) {
  return JSON.parse(fs.readFileSync(path.resolve(__dirname, "..", relativePath), "utf-8"));
}

const runtimeSnapshot = readJson("state/runtime_status_snapshot.json");
assert.strictEqual(runtimeSnapshot.architecture_mode, "hub_module_control");
assert.strictEqual(runtimeSnapshot.hard_rules.no_image_no_pass, true);

const moduleRegistry = readJson("state/module_registry.json");
for (const key of ["control_hub", "intake_module", "generation_module", "validation_module", "decision_module", "memory_module"]) {
  assert.ok(moduleRegistry[key], `Missing module: ${key}`);
  assert.ok(moduleRegistry[key].path, `Missing module path: ${key}`);
}

const systemEntrypoints = readJson("state/system_entrypoints.json");
assert.ok(Array.isArray(systemEntrypoints.live_entrypoints));
assert.ok(systemEntrypoints.live_render_path);
assert.ok(systemEntrypoints.live_render_path.renderer_endpoint);

const activeFiles = readJson("state/active_files_manifest.json");
assert.ok(activeFiles.categories);
assert.ok(Array.isArray(activeFiles.categories.module_files));
assert.ok(activeFiles.categories.module_files.length >= 5);

console.log("test_handoff_pack_schema: PASS");
