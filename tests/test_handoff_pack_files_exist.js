"use strict";

const assert = require("assert");
const fs = require("fs");
const path = require("path");

const requiredFiles = [
  "docs/ai_handoff/README.md",
  "docs/ai_handoff/SYSTEM_MAP.md",
  "docs/ai_handoff/CURRENT_RUNTIME_PATH.md",
  "docs/ai_handoff/ACTIVE_FILES_INDEX.md",
  "docs/ai_handoff/ARTIFACT_CONTRACT.md",
  "docs/ai_handoff/SOURCE_OF_TRUTH.md",
  "docs/ai_handoff/DO_NOT_TOUCH.md",
  "docs/ai_handoff/TASK_DISPATCH_TEMPLATE.md",
  "docs/ai_handoff/AGENT_ROLE_SPLIT.md",
  "docs/ai_handoff/DEPRECATED_OR_UNTRUSTED_AREAS.md",
  "docs/ai_handoff/FAILURE_TRIAGE.md",
  "docs/ai_handoff/MEMORY_LAYER.md",
  "docs/ai_handoff/MEMORY_WRITE_POLICY.md",
  "docs/ai_handoff/MEMORY_RETRIEVAL_RULES.md",
  "state/runtime_status_snapshot.json",
  "state/active_files_manifest.json",
  "state/source_of_truth_manifest.json",
  "state/deprecated_paths_manifest.json",
  "state/lane_registry.json",
  "state/system_entrypoints.json",
  "state/module_registry.json",
  "state/README.md",
  "tools/handoff/build_runtime_snapshot.js",
  "tools/handoff/build_active_files_manifest.js",
  "tools/handoff/build_source_of_truth_manifest.js",
  "tools/handoff/build_deprecated_paths_manifest.js",
  "tools/handoff/build_system_entrypoints.js",
  "tools/handoff/refresh_handoff_pack.js",
  "tools/handoff/validate_handoff_pack.js",
];

for (const relativePath of requiredFiles) {
  assert.ok(fs.existsSync(path.resolve(__dirname, "..", relativePath)), `Missing required file: ${relativePath}`);
}

console.log("test_handoff_pack_files_exist: PASS");
