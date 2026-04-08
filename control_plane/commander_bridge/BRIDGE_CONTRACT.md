# Commander Bridge V1

Commander Bridge V1 is a local filesystem relay between:

- Commander: user
- Planner: ChatGPT
- Executor: local control agent and Codex

This bridge is supervised only. It is not autonomous execution.

## Folder Contract

- `inbox/`
  - pending command files
- `outbox/`
  - completed human-readable and machine-readable reports
- `state/`
  - live bridge state and snapshots
- `logs/`
  - append-only audit logs
- `archive/`
  - completed command records

## Required State Files

- `state/system_runtime_snapshot.json`
- `state/latest_agent_report.json`
- `state/pending_actions.json`

## Command Contract

Each inbox command is a JSON file with this minimum shape:

```json
{
  "command_id": "cmd_20260408_0001",
  "action": "repo.status",
  "payload": {},
  "approval": {
    "status": "auto_allow"
  },
  "requested_by": "commander",
  "created_at": "2026-04-08T00:00:00.000Z"
}
```

## Report Contract

Each completed action must write:

- one short text report
- one JSON report

Text report format:

```text
STATUS: PASS / FAIL / BLOCKED
ACTION: ...
FILES: ...
RISK: ...
NEXT: ...
```

## Approval Law

Auto-allow:

- `repo.status`
- `runtime.health`
- `disk.smart_scan`
- `disk.latest_report`
- `system.snapshot`
- `system.map_check`

Approval required:

- `repo.commit`
- `repo.push`
- `disk.safe_clean`
- `codex.build_task`
- any write outside bridge-safe paths
- any architecture-sensitive action

Hard block:

- deleting protected paths
- changing active runtime entrypoints without approval
- touching deprecated archives unless explicitly requested
- any action that bypasses bridge logging

## Active Runtime Truth

Bridge V1 must preserve the current active runtime:

- `start_mikage.bat`
- `MIKAGE/index.js`
- `runtime/drive_queue/runtime.js`
- `runtime/colab_worker/colab_one_click_worker.ipynb`

Hard rule:

- no image = no pass
