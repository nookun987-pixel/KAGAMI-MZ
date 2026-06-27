# SYSTEM MAP

## Governance Version

- `repo_governance_version = REPO_GOVERNANCE_LOCK_V1`
- `system_map_version = SYSTEM_MAP_V2`

## Active Architecture

Mikage runs as a hub-controlled module system.

```text
CONTROL HUB
-> intake module
-> generation module
-> validation module
-> decision module
-> memory placeholder
```

## Hub

- `MIKAGE/index.js`
  - Single orchestration hub
  - Calls modules in strict order
  - Owns trace writing and final memory handoff

## Modules

- `MIKAGE/modules/intake/index.js` -> normalize input, inject canon rules, prepare prompt spec
- `MIKAGE/modules/generation/index.js` -> build render payload, dispatch live lane, return raw result
- `MIKAGE/modules/validation/index.js` -> run monitor and analyzers, enforce hard validation signals
- `MIKAGE/modules/decision/index.js` -> deterministic judge layer, final decision, retry and repair decision
- `MIKAGE/modules/memory/index.js` -> memory interface and safe verified-memory refresh path

## Control Plane Overlay

- `control_plane/local_control_agent/` -> local commander execution layer
- `control_plane/commander_bridge/` -> filesystem bridge contract
- `control_plane/node_roles/` -> role-based control permissions
- `control_plane/local_control_agent/machine_profiles/` -> per-machine portability layer

## Trace / Snapshot Writing

- `execution/raw_trace_store.js` writes attempt-level evidence including `final_decision.json`.
- `control_plane/commander_bridge/state/system_runtime_snapshot.json` is canonical control-plane runtime snapshot.

## Hard Rule

- NO IMAGE = NO PASS

## Boundary Rule

- active image runtime and control-plane portability are separate boundaries
- control-plane tooling may not change image runtime behavior unless explicitly tasked
