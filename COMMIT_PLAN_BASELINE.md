# Commit Plan Baseline

## Goal

Create one clean baseline commit before any new lane or automation work stacks on top of the current repo.

## Baseline Scope

- active hub + module architecture
- handoff pack
- memory layer phase 1
- deterministic judge artifacts
- current trace contract

## Included In Baseline

- `MIKAGE/`
- `runtime/`
- `execution/`
- `evaluation/`
- `canon/`
- `canon_evolution/`
- `safe_loop/`
- `memory/`
- `state/`
- `docs/ai_handoff/`
- `tools/handoff/`
- `tests/`
- `start_mikage.bat`
- `package.json`

## Explicitly Not Included As Active Authority

- `orchestrator.js`
- `server.js`
- `command_center_server.js`
- `control_core/`
- `system_control_plane/`
- `execution_lane/`
- `renderers/`
- `execution/execution_connector.js`

## Verification Before Commit

- `node -e "require('./MIKAGE/index.js')"`
- `node tools/handoff/validate_handoff_pack.js`
- `node tests/test_memory_layer_ingest.js`
- `node tests/test_memory_layer_retrieval.js`
- `node tests/test_memory_layer_promotion.js`
- `node tests/test_post_run_refresh.js`
- `node MIKAGE/mikage.test.js`

## Proposed Baseline Commit Message

`baseline: lock active MIKAGE hub/module runtime and phase1 memory handoff state`
