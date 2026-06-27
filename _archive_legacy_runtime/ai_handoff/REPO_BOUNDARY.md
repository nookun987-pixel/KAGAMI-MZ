# REPO BOUNDARY

## Active Control-Plane Paths

- `control_plane/local_control_agent/`
- `control_plane/commander_bridge/`
- `control_plane/reviewed_operator_flow.js`
- `control_plane/node_role.js`
- `control_plane/node_roles/`
- `control_plane/runtime_status_reader.js`
- `control_plane/repo_governance.json`

## Active Runtime Paths

- `start_mikage.bat`
- `MIKAGE/index.js`
- `MIKAGE/modules/`
- `MIKAGE/lanes/image/`
- `runtime/drive_queue/runtime.js`
- `runtime/colab_worker/`

## Legacy / Dead / Unused Paths

- `execution_lane/`
- `renderers/`
- `system_control_plane/`
- `control_core/`
- `orchestrator.js`
- `server.js`
- `command_center_server.js`
- `service_manager.js`
- `bootstrap_verify.js`
- `translator/ollama_translate.js`

Status:
- legacy paths remain for historical reference only
- they are not source of truth for the active image lane

## Runtime-Sensitive Files

- `start_mikage.bat`
- `MIKAGE/index.js`
- `runtime/drive_queue/runtime.js`
- `runtime/colab_worker/colab_one_click_worker.ipynb`
- `state/system_entrypoints.json`

Rule:
- changes to runtime-sensitive files require explicit review

## Allowed Edit Zones

- `control_plane/`
- `docs/ai_handoff/`
- `state/`
- `tests/`
- non-runtime utility/config files that do not alter the image lane contract

## Generated Artifact Zones

- `control_plane/commander_bridge/inbox/`
- `control_plane/commander_bridge/outbox/`
- `control_plane/commander_bridge/archive/`
- `control_plane/commander_bridge/logs/`
- `control_plane/commander_bridge/state/*.json`
- `control_plane/local_control_agent/state/*.json`
- `control_plane/local_control_agent/state/reports/*.json`
- `traces/**`

## Git-Tracked vs Git-Ignored Zones

Git-tracked:
- source code
- canonical docs
- manifests
- governance files
- stable `.gitkeep` placeholders

Git-ignored:
- runtime-generated bridge state
- runtime-generated agent reports
- runtime-generated trace artifacts
- local outputs, caches, logs

## Interpretation Rule

- `git status` should primarily indicate source/config/doc changes
- runtime-generated state and trace churn must not be used as code-change signal
