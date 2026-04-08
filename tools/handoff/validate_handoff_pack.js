"use strict";

const fs = require("fs");
const path = require("path");

function rootPath(...parts) {
  return path.resolve(__dirname, "..", "..", ...parts);
}

function readJson(relativePath) {
  return JSON.parse(fs.readFileSync(rootPath(relativePath), "utf-8"));
}

function fileExists(relativePath) {
  return fs.existsSync(rootPath(relativePath));
}

const REQUIRED_DOCS = [
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
];

const REQUIRED_JSON = [
  "state/runtime_status_snapshot.json",
  "state/active_files_manifest.json",
  "state/source_of_truth_manifest.json",
  "state/deprecated_paths_manifest.json",
  "state/lane_registry.json",
  "state/system_entrypoints.json",
  "state/module_registry.json",
];

const REQUIRED_MODULE_KEYS = [
  "control_hub",
  "intake_module",
  "generation_module",
  "validation_module",
  "decision_module",
  "memory_module",
];

function validateHandoffPack() {
  const errors = [];

  for (const relativePath of [...REQUIRED_DOCS, ...REQUIRED_JSON, "state/README.md"]) {
    if (!fileExists(relativePath)) {
      errors.push(`Missing required file: ${relativePath}`);
    }
  }

  for (const relativePath of REQUIRED_JSON) {
    if (!fileExists(relativePath)) {
      continue;
    }
    try {
      JSON.parse(fs.readFileSync(rootPath(relativePath), "utf-8"));
    } catch (error) {
      errors.push(`Invalid JSON: ${relativePath}`);
    }
  }

  if (fileExists("state/module_registry.json")) {
    const registry = readJson("state/module_registry.json");
    for (const key of REQUIRED_MODULE_KEYS) {
      if (!registry[key] || !registry[key].path) {
        errors.push(`module_registry.json missing required module entry: ${key}`);
      }
    }
  }

  if (fileExists("state/runtime_status_snapshot.json")) {
    const snapshot = readJson("state/runtime_status_snapshot.json");
    if (snapshot.architecture_mode !== "hub_module_control") {
      errors.push("runtime_status_snapshot.json must declare architecture_mode = hub_module_control");
    }
    if (!snapshot.hard_rules || snapshot.hard_rules.no_image_no_pass !== true) {
      errors.push("runtime_status_snapshot.json must assert no_image_no_pass = true");
    }
  }

  if (fileExists("state/system_entrypoints.json")) {
    const entrypoints = readJson("state/system_entrypoints.json");
    if (!entrypoints.live_render_path || !entrypoints.live_render_path.renderer_endpoint) {
      errors.push("system_entrypoints.json missing live_render_path.renderer_endpoint");
    }
  }

  if (fileExists("docs/ai_handoff/SYSTEM_MAP.md")) {
    const content = fs.readFileSync(rootPath("docs/ai_handoff/SYSTEM_MAP.md"), "utf-8");
    if (!content.includes("NO IMAGE = NO PASS")) {
      errors.push("SYSTEM_MAP.md must contain NO IMAGE = NO PASS");
    }
  }

  if (fileExists("docs/ai_handoff/CURRENT_RUNTIME_PATH.md")) {
    const content = fs.readFileSync(rootPath("docs/ai_handoff/CURRENT_RUNTIME_PATH.md"), "utf-8");
    if (!content.includes("UNKNOWN_NOT_PROVEN")) {
      errors.push("CURRENT_RUNTIME_PATH.md must mark unproven endpoint facts as UNKNOWN_NOT_PROVEN");
    }
  }

  if (fileExists("docs/ai_handoff/DO_NOT_TOUCH.md")) {
    const content = fs.readFileSync(rootPath("docs/ai_handoff/DO_NOT_TOUCH.md"), "utf-8").toLowerCase();
    for (const phrase of ["bypass validator", "image-less pass", "bypass gemini judge"]) {
      if (!content.includes(phrase)) {
        errors.push(`DO_NOT_TOUCH.md must mention forbidden rule: ${phrase}`);
      }
    }
  }

  return {
    ok: errors.length === 0,
    errors,
  };
}

module.exports = {
  validateHandoffPack,
};

if (require.main === module) {
  const result = validateHandoffPack();
  if (!result.ok) {
    console.error("FAIL");
    for (const error of result.errors) {
      console.error(`- ${error}`);
    }
    process.exit(1);
  }
  console.log("PASS");
}
