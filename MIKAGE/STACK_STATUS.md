# MIKAGE V2 Stack Status

## Active Source Of Truth

- `MIKAGE/`
- `start_mikage.bat`
- `runtime/drive_queue/`
- `runtime/colab_worker/`

MIKAGE V2 control plane must be treated as the active architecture root.

## Legacy / Deprecated Stacks

These stacks remain in the repo for reference, compatibility, or migration support.
They are not the active MIKAGE V2 control plane:

- `execution_lane/`
- `renderers/`
- `system_control_plane/`
- `control_core/`
- `orchestrator.js`
- `server.js`
- `memory/`
- `state/`

## Memory Source Of Truth

- Active: `MIKAGE/shared/memory/`
- Legacy support only: `memory/`, `state/`

## Runtime Queue Source Of Truth

- Active: `runtime/drive_queue/runtime.js`
- All Drive queue write/read/claim/result parsing should route through this module.
