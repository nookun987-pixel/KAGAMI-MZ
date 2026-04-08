"use strict";

const assert = require("assert");
const fs = require("fs");
const path = require("path");

function readJson(relativePath) {
  return JSON.parse(fs.readFileSync(path.resolve(__dirname, "..", relativePath), "utf-8"));
}

const sourceManifest = readJson("state/source_of_truth_manifest.json");
assert.ok(Array.isArray(sourceManifest.ranked_sources));
assert.strictEqual(sourceManifest.ranked_sources[0].label, "real_artifacts");

const activeFiles = readJson("state/active_files_manifest.json");
for (const items of Object.values(activeFiles.categories)) {
  for (const item of items) {
    if (item.path.startsWith("G:/") || item.path.includes("<job_id>")) {
      continue;
    }
    const fullPath = path.resolve(__dirname, "..", item.path);
    assert.ok(fs.existsSync(fullPath) || item.status === "artifact", `Active manifest path missing: ${item.path}`);
  }
}

const deprecatedManifest = readJson("state/deprecated_paths_manifest.json");
assert.ok(Array.isArray(deprecatedManifest.deprecated_or_untrusted_paths));
assert.ok(deprecatedManifest.deprecated_or_untrusted_paths.some((item) => item.path === "execution_lane"));

console.log("test_handoff_pack_source_of_truth: PASS");
