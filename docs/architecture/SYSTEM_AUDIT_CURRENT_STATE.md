# System Audit Current State

## Verdict

The current repo has one active MIKAGE runtime path and several older overlapping stacks still present in the tree.

## Active Runtime Path

- Batch bootstrap: `start_mikage.bat`
- Control hub: `MIKAGE/index.js`
- Module chain:
  - `MIKAGE/modules/intake/index.js`
  - `MIKAGE/modules/generation/index.js`
  - `MIKAGE/modules/validation/index.js`
  - `MIKAGE/modules/decision/index.js`
  - `MIKAGE/modules/memory/index.js`
- Active lane: `MIKAGE/lanes/image/`
- Active runtime contract: `runtime/drive_queue/runtime.js`
- Active worker path: `runtime/colab_worker/colab_one_click_worker.ipynb`
- Active trace authority: `execution/raw_trace_store.js`

## Authoritative Artifact Writers

- `execution/raw_trace_store.js`
  - writes `final_decision.json`
  - writes `gemini_validation.json`
  - writes all attempt trace artifacts
- `runtime/drive_queue/runtime.js`
  - resolves queue paths
  - reads claim/result/output state
- Colab worker notebook
  - writes `output.png`
  - writes `judge_output.json`
  - writes `result.json`

## Overlapping / Legacy Control Areas

- `orchestrator.js`
- `server.js`
- `command_center_server.js`
- `control_core/`
- `system_control_plane/`
- `execution_lane/`
- `renderers/`
- `execution/execution_connector.js`

These still exist and are large enough to confuse future automation, but they are not the current source of truth for the active image lane.

## Partially Integrated Areas

- `package.json`
  - legacy `start` still points to `server.js`
  - active hub path is now exposed via `mikage:start`
- non-image lanes under `MIKAGE/lanes/`
  - present as placeholders
  - not proven active
- memory phase 1
  - live and testable
  - still retrieval/promotion focused
  - not deeply injected into generation

## Current Truth Markers

- `state/system_entrypoints.json`
- `state/active_files_manifest.json`
- `state/source_of_truth_manifest.json`
- `state/deprecated_paths_manifest.json`
- `state/module_registry.json`
- `docs/ai_handoff/*`

## Repo Health Summary

- Active hub path is coherent.
- Trace path is coherent.
- Memory phase 1 is coherent.
- The main repo-level risk is coexistence of multiple historical entrypoints and large legacy stacks.
