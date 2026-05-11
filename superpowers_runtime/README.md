# Mikage Superpowers Runtime Skeleton

This directory contains the minimal non-render runtime skeleton for the Mikage Superpower system.

The skeleton accepts a task object, checks the required task fields, applies the hard lane guard, routes the task through a small state trace, and returns a structured result.

## Runtime Boundary

This runtime does not:

- generate images
- generate videos
- execute renders
- use ComfyUI
- use Blender
- create public deployments
- create canon approvals
- create asset locks
- call external APIs
- start an autonomous loop

## Stages

1. `USER_REQUEST`
2. `INTAKE`
3. `STATE_CHECK`
4. `LANE_CHECK`
5. `TASK_BUILD`
6. `EXECUTION_READY`
7. `DONE_OR_STOP`

## Result Values

- `PASS`
- `FAIL`
- `BLOCKED`
- `STOPPED_BY_LANE_GUARD`

## Dry Run

```powershell
node superpowers_runtime/mikage_superpowers_runtime.js superpowers_runtime/examples/spw_03_minimal_task.json superpowers_runtime/examples/spw_03_minimal_result.json
```

The dry run writes a structured JSON result and prints the same result to stdout.
