# Keep Delete Merge Plan

## Keep As Active

- `start_mikage.bat`
- `MIKAGE/`
- `runtime/drive_queue/`
- `runtime/colab_worker/`
- `execution/raw_trace_store.js`
- `evaluation/variant_judge.js`
- `memory/judge_cache.json`
- `memory/approved_variant_registry.json`
- `state/*.json` handoff manifests
- `tools/handoff/`

## Keep But Mark As Legacy / Untrusted

- `orchestrator.js`
- `server.js`
- `command_center_server.js`
- `control_core/`
- `system_control_plane/`
- `execution_lane/`
- `renderers/`
- `execution/execution_connector.js`
- `docs/handoff/`

## Delete Now

- None

Reason:

- The repo is too large and too dirty to remove old code safely without a dedicated deletion pass and direct dependency proof.
- Current task goal is a stable baseline, not a destructive prune.

## Merge Later

- duplicate status/runtime docs outside `docs/ai_handoff/`
- overlapping operator and command-center views
- legacy bridge/runtime helpers if a later deletion pass proves no active consumers

## Immediate Cleanup Performed

- Exposed active hub script in `package.json` as `mikage:start`
- Left legacy scripts intact to avoid breaking historical tooling
