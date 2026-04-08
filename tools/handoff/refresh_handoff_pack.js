"use strict";

const fs = require("fs");
const path = require("path");

const { buildActiveFilesManifest } = require("./build_active_files_manifest");
const { buildSourceOfTruthManifest } = require("./build_source_of_truth_manifest");
const { buildDeprecatedPathsManifest } = require("./build_deprecated_paths_manifest");
const { buildSystemEntrypoints } = require("./build_system_entrypoints");
const { buildRuntimeSnapshot } = require("./build_runtime_snapshot");

function rootPath(...parts) {
  return path.resolve(__dirname, "..", "..", ...parts);
}

function readJson(relativePath, fallback = null) {
  const filePath = rootPath(relativePath);
  if (!fs.existsSync(filePath)) {
    return fallback;
  }
  return JSON.parse(fs.readFileSync(filePath, "utf-8"));
}

function writeJson(relativePath, payload) {
  const filePath = rootPath(relativePath);
  fs.mkdirSync(path.dirname(filePath), { recursive: true });
  fs.writeFileSync(filePath, `${JSON.stringify(payload, null, 2)}\n`, "utf-8");
}

function writeText(relativePath, content) {
  const filePath = rootPath(relativePath);
  fs.mkdirSync(path.dirname(filePath), { recursive: true });
  fs.writeFileSync(filePath, content.trimEnd() + "\n", "utf-8");
}

function buildLaneRegistry() {
  return {
    generated_at: new Date().toISOString(),
    lanes: {
      image: {
        status: "active",
        confidence: "proven_from_repo",
        executor: "MIKAGE/lanes/image/image_executor.js",
        validator: "MIKAGE/lanes/image/image_validator.js",
      },
      cine: { status: "UNVERIFIED", confidence: "placeholder_only" },
      game: { status: "UNVERIFIED", confidence: "placeholder_only" },
      content: { status: "UNVERIFIED", confidence: "placeholder_only" },
      ops: { status: "UNVERIFIED", confidence: "placeholder_only" },
    },
  };
}

function renderSystemMap(moduleRegistry) {
  return `
# SYSTEM MAP

## Active Architecture

Mikage runs as a hub-controlled module system.

\`\`\`text
CONTROL HUB
-> intake module
-> generation module
-> validation module
-> decision module
-> memory placeholder
\`\`\`

## Hub

- \`MIKAGE/index.js\`
  - Single orchestration hub
  - Calls modules in strict order
  - Owns trace writing and final memory handoff

## Modules

- \`${moduleRegistry.intake_module.path}\` -> normalize input, inject canon rules, prepare prompt spec
- \`${moduleRegistry.generation_module.path}\` -> build render payload, dispatch live lane, return raw result
- \`${moduleRegistry.validation_module.path}\` -> run monitor and analyzers, enforce hard validation signals
- \`${moduleRegistry.decision_module.path}\` -> deterministic judge layer, final decision, retry and repair decision
- \`${moduleRegistry.memory_module.path}\` -> placeholder runtime interface only, no long-term ingestion yet

## Trace Writing

- \`execution/raw_trace_store.js\` writes attempt-level evidence including \`final_decision.json\`.

## Hard Rule

- NO IMAGE = NO PASS
`.trim();
}

function renderCurrentRuntimePath(systemEntrypoints) {
  return `
# CURRENT RUNTIME PATH

## Live Entrypoint

- \`start_mikage.bat\`
- \`MIKAGE/index.js\`

## Ordered Runtime Path

1. \`MIKAGE/modules/intake/index.js\`
2. \`MIKAGE/modules/generation/index.js\`
3. \`MIKAGE/modules/validation/index.js\`
4. \`MIKAGE/modules/decision/index.js\`
5. \`MIKAGE/modules/memory/index.js\`

## Live Render Path

- Queue runtime: \`${systemEntrypoints.live_render_path.queue_runtime}\`
- Worker path: \`${systemEntrypoints.live_render_path.worker_path}\`
- Render endpoint: \`${systemEntrypoints.live_render_path.renderer_endpoint}\`
- Output root: \`${systemEntrypoints.live_render_path.output_root}\`

## Fail Conditions

- no claim
- no result.json
- missing output.png
- malformed result.json
- validator fail
- Gemini unavailable on a quality-proof path

## Forbidden Endpoint

- raw Gradio as live endpoint -> UNTRUSTED
- any unproven HTTP endpoint -> UNKNOWN_NOT_PROVEN
`.trim();
}

function renderActiveFilesIndex(activeManifest) {
  const blocks = Object.entries(activeManifest.categories).map(([key, entries]) => {
    const title = key.replace(/_/g, " ").toUpperCase();
    const lines = entries.map((item) => (
      `- path: \`${item.path}\`\n  role: ${item.role}\n  status: ${item.status}\n  confidence: ${item.confidence}`
    )).join("\n");
    return `## ${title}\n\n${lines}`;
  }).join("\n\n");
  return `# ACTIVE FILES INDEX\n\n${blocks}`.trim();
}

function renderArtifactContract() {
  return `
# ARTIFACT CONTRACT

## Minimum Files For PASS

- \`claims/<job_id>.claim.json\`
- \`outputs/<job_id>/result.json\`
- \`outputs/<job_id>/output.png\`
- \`traces/<job_id>/attempt-XX/final_decision.json\`

## Additional File For Quality-Proof Paths

- \`outputs/<job_id>/judge_output.json\`

## ALLOW Conditions

- required artifacts exist
- validator passes
- lane completion policy is satisfied
- final decision is \`ALLOW\`

## AUTO REJECT Conditions

- no image
- no result.json
- malformed result
- validator fail
- timeout
- stale claim
- required lane artifacts missing

## What Counts As Real Proof

- shared-drive artifact path
- trace \`final_decision.json\`
- exact same job id across the proof chain
`.trim();
}

function renderSourceOfTruth(sourceManifest) {
  const blocks = sourceManifest.ranked_sources.map((source) => (
    `## Rank ${source.rank}: ${source.label}\n\n- trust: ${source.trust_level}\n- status: ${source.status}\n- description: ${source.description}\n- paths:\n${source.paths.map((item) => `  - ${item}`).join("\n")}`
  )).join("\n\n");
  return `# SOURCE OF TRUTH\n\n${blocks}\n\n## Rule\n\n- real artifacts outrank active code\n- active code outranks approved memory\n- old chats and stale logs are untrusted unless re-proven from repo or artifacts`.trim();
}

function renderDoNotTouch() {
  return `
# DO NOT TOUCH

## Forbidden Changes

- bypass validator
- image-less pass
- bypass Gemini judge
- claim a live endpoint not proven from repo state
- change the active Drive queue contract casually

## Safe Zones

- \`docs/ai_handoff/\`
- \`state/*.json\`
- \`tools/handoff/\`
- handoff tests

## Review-Required Areas

- \`runtime/colab_worker/colab_one_click_worker.ipynb\`
- \`runtime/drive_queue/runtime.js\`
- \`MIKAGE/lanes/image/image_executor.js\`
- \`MIKAGE/lanes/image/image_validator.js\`
- \`evaluation/variant_judge.js\`
`.trim();
}

function renderTaskDispatchTemplate() {
  return `
# TASK DISPATCH TEMPLATE

## Objective

One task only. One proven outcome only.

## Scope

- active files only
- exact paths only
- no side refactors

## Required Output

- verdict
- files modified
- proof artifact paths
- blocker if any
`.trim();
}

function renderAgentRoleSplit() {
  return `
# AGENT ROLE SPLIT

## Agent A Repo Mapper

- map active hub, modules, lanes, and runtime contracts

## Agent B Patcher

- apply minimal scoped changes in active files only

## Agent C Test / Artifact Verifier

- run refresh, validate, tests, and verify artifact paths

## Agent D Reviewer

- check forbidden claims
- check source-of-truth alignment
`.trim();
}

function renderDeprecatedAreas(deprecatedManifest) {
  const lines = deprecatedManifest.deprecated_or_untrusted_paths.map((item) => `- \`${item.path}\` -> ${item.status} -> ${item.reason}`).join("\n");
  return `# DEPRECATED OR UNTRUSTED AREAS\n\n${lines}\n\n## Notes\n\n- Non-image lanes are UNVERIFIED unless proven by active artifacts.\n- Legacy bridge and proxy wording must not be treated as current runtime truth.`.trim();
}

function renderFailureTriage() {
  return `
# FAILURE TRIAGE

## no claim

- verify DRIVE_ROOT contract
- verify worker queue root
- verify claim path creation

## no output

- if claim exists but no result/output, inspect worker log and runtime observation

## image missing

- no image means no pass
- inspect image validator and worker result payload

## bridge unreachable

- active path should not depend on bridge runtime
- treat bridge references as wrong path unless re-proven

## wrong endpoint

- trust only active Drive queue + Colab worker path
- unproven HTTP endpoint = UNKNOWN_NOT_PROVEN

## validator fail

- inspect analyzer_full.json and image_validator.js

## gemini fail

- inspect judge_output.json
- unavailable judge cannot support quality-proof claims

## incomplete artifacts

- require result.json + output.png + final_decision.json
`.trim();
}

function refreshHandoffPack() {
  const moduleRegistry = readJson("state/module_registry.json", {});
  const activeManifest = buildActiveFilesManifest();
  const sourceManifest = buildSourceOfTruthManifest();
  const deprecatedManifest = buildDeprecatedPathsManifest();
  const systemEntrypoints = buildSystemEntrypoints();
  const runtimeSnapshot = buildRuntimeSnapshot();
  const laneRegistry = buildLaneRegistry();

  writeJson("state/active_files_manifest.json", activeManifest);
  writeJson("state/source_of_truth_manifest.json", sourceManifest);
  writeJson("state/deprecated_paths_manifest.json", deprecatedManifest);
  writeJson("state/system_entrypoints.json", systemEntrypoints);
  writeJson("state/runtime_status_snapshot.json", runtimeSnapshot);
  writeJson("state/lane_registry.json", laneRegistry);

  writeText("docs/ai_handoff/README.md", `
# AI Handoff Pack

This pack is the fast-start surface for the current MIKAGE hub + module architecture.

Read in this order:

1. \`SYSTEM_MAP.md\`
2. \`CURRENT_RUNTIME_PATH.md\`
3. \`ACTIVE_FILES_INDEX.md\`
4. \`ARTIFACT_CONTRACT.md\`
5. \`SOURCE_OF_TRUTH.md\`
6. \`DO_NOT_TOUCH.md\`
7. \`FAILURE_TRIAGE.md\`
8. \`MEMORY_LAYER.md\`
9. \`MEMORY_WRITE_POLICY.md\`
10. \`MEMORY_RETRIEVAL_RULES.md\`

Machine-readable manifests live in \`state/\`.
Refresh and validation scripts live in \`tools/handoff/\`.
  `);
  writeText("docs/ai_handoff/SYSTEM_MAP.md", renderSystemMap(moduleRegistry));
  writeText("docs/ai_handoff/CURRENT_RUNTIME_PATH.md", renderCurrentRuntimePath(systemEntrypoints));
  writeText("docs/ai_handoff/ACTIVE_FILES_INDEX.md", renderActiveFilesIndex(activeManifest));
  writeText("docs/ai_handoff/ARTIFACT_CONTRACT.md", renderArtifactContract());
  writeText("docs/ai_handoff/SOURCE_OF_TRUTH.md", renderSourceOfTruth(sourceManifest));
  writeText("docs/ai_handoff/DO_NOT_TOUCH.md", renderDoNotTouch());
  writeText("docs/ai_handoff/TASK_DISPATCH_TEMPLATE.md", renderTaskDispatchTemplate());
  writeText("docs/ai_handoff/AGENT_ROLE_SPLIT.md", renderAgentRoleSplit());
  writeText("docs/ai_handoff/DEPRECATED_OR_UNTRUSTED_AREAS.md", renderDeprecatedAreas(deprecatedManifest));
  writeText("docs/ai_handoff/FAILURE_TRIAGE.md", renderFailureTriage());

  return {
    activeManifest,
    sourceManifest,
    deprecatedManifest,
    systemEntrypoints,
    runtimeSnapshot,
    laneRegistry,
  };
}

module.exports = {
  refreshHandoffPack,
};

if (require.main === module) {
  try {
    refreshHandoffPack();
    const { validateHandoffPack } = require("./validate_handoff_pack");
    const result = validateHandoffPack();
    if (!result.ok) {
      console.error("FAIL");
      for (const error of result.errors) {
        console.error(`- ${error}`);
      }
      process.exit(1);
    }
    console.log("PASS");
  } catch (error) {
    console.error("FAIL");
    console.error(`- ${error.message}`);
    process.exit(1);
  }
}
