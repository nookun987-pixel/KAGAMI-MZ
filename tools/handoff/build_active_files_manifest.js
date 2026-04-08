"use strict";

const fs = require("fs");
const path = require("path");

function rootPath(...parts) {
  return path.resolve(__dirname, "..", "..", ...parts);
}

function exists(relativePath) {
  return fs.existsSync(rootPath(relativePath));
}

function entry(relativePath, role, status, confidence, module) {
  return {
    path: relativePath,
    role,
    status,
    confidence,
    exists: exists(relativePath),
    module,
  };
}

function buildActiveFilesManifest() {
  const categories = {
    hub_files: [
      entry("MIKAGE/index.js", "Single orchestration hub for module-controlled runtime flow.", "active", "proven_from_repo", "control_hub"),
      entry("start_mikage.bat", "Batch entrypoint that verifies Drive queue folders before launching the hub.", "active", "proven_from_repo", "control_hub"),
    ],
    module_files: [
      entry("MIKAGE/modules/intake/index.js", "Normalize input and inject canon and variation context.", "active", "proven_from_repo", "intake_module"),
      entry("MIKAGE/modules/generation/index.js", "Dispatch live lane and return raw generation result.", "active", "proven_from_repo", "generation_module"),
      entry("MIKAGE/modules/validation/index.js", "Finalize run monitor and shape validation outputs.", "active", "proven_from_repo", "validation_module"),
      entry("MIKAGE/modules/decision/index.js", "Build effective decision, retry decision, and repair action.", "active", "proven_from_repo", "decision_module"),
      entry("MIKAGE/modules/memory/index.js", "Expose memory runtime interface and current placeholder persistence hook.", "active", "proven_from_repo", "memory_module"),
    ],
    lane_files: [
      entry("MIKAGE/lanes/image/image_intake.js", "Image-lane prompt and payload preparation.", "active", "proven_from_repo", "image_lane"),
      entry("MIKAGE/lanes/image/image_executor.js", "Image-lane Drive queue adapter and result collector.", "active", "proven_from_repo", "image_lane"),
      entry("MIKAGE/lanes/image/image_validator.js", "Image-lane artifact and live judge validation.", "active", "proven_from_repo", "image_lane"),
      entry("MIKAGE/lanes/cine/cine_executor.js", "Additional lane placeholder only.", "placeholder", "unverified_runtime", "cine_lane"),
      entry("MIKAGE/lanes/game/game_executor.js", "Additional lane placeholder only.", "placeholder", "unverified_runtime", "game_lane"),
      entry("MIKAGE/lanes/content/content_executor.js", "Additional lane placeholder only.", "placeholder", "unverified_runtime", "content_lane"),
      entry("MIKAGE/lanes/ops/ops_executor.js", "Additional lane placeholder only.", "placeholder", "unverified_runtime", "ops_lane"),
    ],
    validator_files: [
      entry("MIKAGE/control_plane/run_monitor.js", "Lane-agnostic monitor finalization and issue detection.", "active", "proven_from_repo", "validation"),
      entry("MIKAGE/control_plane/final_judge.js", "Lane-policy-based final judge with no image-less allow path.", "active", "proven_from_repo", "decision"),
      entry("evaluation/quality_failure_extractor.js", "Build structured quality failure packet from live judge output.", "active", "proven_from_repo", "validation"),
      entry("evaluation/variant_judge.js", "Deterministic variant judge with cache and consistency controls.", "active", "proven_from_repo", "decision"),
    ],
    judge_files: [
      entry("critic/vision_critic.js", "Live-or-unavailable vision critic path. Not the source of final allow by itself.", "active", "proven_from_repo", "decision"),
      entry("critic/rule_critic.js", "Rule critic that must return unavailable rather than fabricate.", "active", "proven_from_repo", "decision"),
      entry("critic/critic_merge.js", "Merge judge signals into stable schema.", "active", "proven_from_repo", "decision"),
      entry("memory/judge_cache.json", "Persistent deterministic verdict cache keyed by normalized judge input and image hash.", "active", "proven_from_repo", "decision"),
    ],
    memory_files: [
      entry("MIKAGE/control_plane/control_memory.js", "Primary active control-memory implementation.", "active", "proven_from_repo", "memory"),
      entry("MIKAGE/shared/memory/run_history.json", "Active run history backing file.", "active", "proven_from_repo", "memory"),
      entry("MIKAGE/shared/memory/lane_registry.json", "Active lane registry backing file.", "active", "proven_from_repo", "memory"),
      entry("MIKAGE/shared/memory/canon_memory.json", "Active canon memory backing file.", "active", "proven_from_repo", "memory"),
      entry("memory/approved_variant_registry.json", "Approved-variant memory registry used by controlled evolution.", "active", "proven_from_repo", "memory"),
    ],
    trace_files: [
      entry("execution/raw_trace_store.js", "Writes per-attempt trace artifacts including final_decision.json.", "active", "proven_from_repo", "trace"),
      entry("execution/quality_delta_reporter.js", "Writes quality delta report for retries and comparisons.", "active", "proven_from_repo", "trace"),
      entry("traces/batch_variant_summary.json", "Latest known batch summary artifact, present when controlled-evolution batch ran.", "artifact", "repo_artifact", "trace"),
      entry("traces/batch_variant_report.md", "Latest known batch report artifact, present when controlled-evolution batch ran.", "artifact", "repo_artifact", "trace"),
    ],
    runtime_files: [
      entry("runtime/drive_queue/runtime.js", "Single active Drive queue runtime contract.", "active", "proven_from_repo", "runtime"),
      entry("runtime/colab_worker/colab_one_click_worker.ipynb", "Live worker notebook path when Colab worker is in use.", "active", "proven_from_repo", "runtime"),
    ],
  };

  return {
    generated_at: new Date().toISOString(),
    root: rootPath().replace(/\\/g, "/"),
    categories,
  };
}

module.exports = {
  buildActiveFilesManifest,
};

if (require.main === module) {
  process.stdout.write(`${JSON.stringify(buildActiveFilesManifest(), null, 2)}\n`);
}
