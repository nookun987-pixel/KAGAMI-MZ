"use strict";

const { buildSystemEntrypoints } = require("./build_system_entrypoints");

function buildRuntimeSnapshot() {
  const entrypoints = buildSystemEntrypoints();
  return {
    generated_at: new Date().toISOString(),
    architecture_mode: "hub_module_control",
    control_hub: "MIKAGE/index.js",
    active_modules: [
      "MIKAGE/modules/intake/index.js",
      "MIKAGE/modules/generation/index.js",
      "MIKAGE/modules/validation/index.js",
      "MIKAGE/modules/decision/index.js",
      "MIKAGE/modules/memory/index.js",
    ],
    active_lane: {
      image: {
        status: "active",
        executor: "MIKAGE/lanes/image/image_executor.js",
        validator: "MIKAGE/lanes/image/image_validator.js",
      },
      cine: { status: "UNVERIFIED" },
      game: { status: "UNVERIFIED" },
      content: { status: "UNVERIFIED" },
      ops: { status: "UNVERIFIED" },
    },
    hard_rules: {
      no_image_no_pass: true,
      validator_bypass_forbidden: true,
      gemini_bypass_forbidden: true,
      render_endpoint_change_forbidden: true,
    },
    live_entrypoints: entrypoints.live_entrypoints,
    live_render_path: entrypoints.live_render_path,
    source_of_truth_rank: [
      "real_artifacts",
      "active_code",
      "approved_memory",
      "historical_notes_untrusted",
    ],
  };
}

module.exports = {
  buildRuntimeSnapshot,
};

if (require.main === module) {
  process.stdout.write(`${JSON.stringify(buildRuntimeSnapshot(), null, 2)}\n`);
}
