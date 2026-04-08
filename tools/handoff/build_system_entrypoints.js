"use strict";

function buildSystemEntrypoints() {
  return {
    generated_at: new Date().toISOString(),
    live_entrypoints: [
      {
        name: "batch_entrypoint",
        path: "start_mikage.bat",
        status: "active",
        confidence: "proven_from_repo",
        notes: [
          "Requires DRIVE_ROOT.",
          "Verifies job_inbox, claims, and outputs folders before launching the hub.",
        ],
      },
      {
        name: "control_hub",
        path: "MIKAGE/index.js",
        status: "active",
        confidence: "proven_from_repo",
        notes: [
          "Single hub orchestration path.",
          "Calls modules in order: intake -> generation -> validation -> decision.",
        ],
      },
    ],
    live_render_path: {
      queue_runtime: "runtime/drive_queue/runtime.js",
      worker_path: "runtime/colab_worker/colab_one_click_worker.ipynb",
      renderer_endpoint: "UNKNOWN_NOT_PROVEN",
      output_root: "G:/My Drive/mikage_runner/outputs/<job_id>",
      status: "active_drive_queue_runtime",
      confidence: "proven_for_queue_contract_but_not_for_http_endpoint",
    },
    forbidden_or_untrusted_endpoints: [
      {
        label: "raw_gradio_live_endpoint",
        value: "UNTRUSTED",
        reason: "No current repo proof that raw Gradio is the active live endpoint for the hub-controlled image lane.",
      },
      {
        label: "local_bridge_runtime",
        value: "UNTRUSTED",
        reason: "Bridge-style paths exist historically but are not the current source of truth.",
      },
    ],
  };
}

module.exports = {
  buildSystemEntrypoints,
};

if (require.main === module) {
  process.stdout.write(`${JSON.stringify(buildSystemEntrypoints(), null, 2)}\n`);
}
