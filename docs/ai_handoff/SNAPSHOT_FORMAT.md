# SNAPSHOT FORMAT

## Canonical Snapshot File

- `control_plane/commander_bridge/state/system_runtime_snapshot.json`

## Required Fields

- `generated_at`
- `system_map_version`
- `machine_id`
- `node_role`
- `branch`
- `latest_commit`
- `repo_clean`
- `repo_dirty`
- `repo_state`
- `agent_status`
- `bridge_status`
- `active_services`
- `active_runtime`
- `last_passed_workflow`
- `blockers`

## Optional Context Fields

- `pending_actions_count`
- `latest_completed_action`
- `last_action`
- `approval_status`
- `result_status`
- `desktop_status`
- `active_window`
- `open_windows`
- `browser_context`
- `machine_profile`
- `disk_scan_summary`

## Interpretation Rules

- `repo_clean` / `repo_dirty` reflect source/config/doc cleanliness after generated artifacts are ignored
- `active_services` is descriptive status, not proof of image render health
- `last_passed_workflow` means latest bridge-level completed action with `PASS`
- `blockers` must be explicit machine-readable labels, not prose dumps

## Governance Use

- this snapshot is the standard status payload for control-plane review, operator handoff, and machine bring-up
