"use strict";

function buildDeprecatedPathsManifest() {
  return {
    generated_at: new Date().toISOString(),
    deprecated_or_untrusted_paths: [
      {
        path: "execution_lane",
        status: "deprecated",
        reason: "Legacy execution stack. Not the active hub-controlled runtime.",
      },
      {
        path: "renderers",
        status: "deprecated",
        reason: "Legacy renderer bridge area. Not the single active Drive queue runtime.",
      },
      {
        path: "system_control_plane",
        status: "deprecated",
        reason: "Older control stack. Current source of truth is MIKAGE/ plus modules.",
      },
      {
        path: "control_core",
        status: "deprecated",
        reason: "Historical control area not used by the active hub flow.",
      },
      {
        path: "orchestrator.js",
        status: "deprecated",
        reason: "Historical entrypoint. Live hub entry is start_mikage.bat -> MIKAGE/index.js.",
      },
      {
        path: "server.js",
        status: "deprecated",
        reason: "Historical server entrypoint. Not the proven active runtime path for the image lane.",
      },
      {
        path: "execution/execution_connector.js",
        status: "untrusted_for_active_runtime",
        reason: "Contains connector and bridge references that are not the current active image-lane source of truth.",
      },
      {
        path: "docs/handoff",
        status: "untrusted_for_current_handoff",
        reason: "Legacy docs area. New handoff pack lives in docs/ai_handoff.",
      },
      {
        path: "memory/README_DEPRECATED.md",
        status: "deprecated",
        reason: "Marker for older memory area. Current runtime memory interface is wrapped by MIKAGE/modules/memory/index.js.",
      },
      {
        path: "state/run_state_authority.js",
        status: "deprecated",
        reason: "Historical state authority. Not the current source of truth for the handoff pack.",
      },
    ],
  };
}

module.exports = {
  buildDeprecatedPathsManifest,
};

if (require.main === module) {
  process.stdout.write(`${JSON.stringify(buildDeprecatedPathsManifest(), null, 2)}\n`);
}
