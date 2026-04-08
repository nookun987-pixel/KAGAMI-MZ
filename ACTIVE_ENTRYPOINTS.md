# Active Entrypoints

## Authoritative Runtime Entrypoints

- `start_mikage.bat`
  - requires `DRIVE_ROOT`
  - verifies `job_inbox`, `claims`, `outputs`
  - launches `MIKAGE/index.js`

- `MIKAGE/index.js`
  - single control hub
  - calls modules in order

## Module Entrypoints

- `MIKAGE/modules/intake/index.js`
- `MIKAGE/modules/generation/index.js`
- `MIKAGE/modules/validation/index.js`
- `MIKAGE/modules/decision/index.js`
- `MIKAGE/modules/memory/index.js`

## Runtime Entrypoints

- `runtime/drive_queue/runtime.js`
- `runtime/colab_worker/colab_one_click_worker.ipynb`

## Trace / Decision Entrypoints

- `execution/raw_trace_store.js`
- `MIKAGE/control_plane/final_judge.js`
- `evaluation/variant_judge.js`

## Legacy Entrypoints Still Present But Not Authoritative

- `server.js`
- `orchestrator.js`
- `command_center_server.js`

These must not be treated as the active image-lane runtime unless re-proven later.
