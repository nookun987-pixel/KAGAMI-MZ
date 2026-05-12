# MIKAGE_AGENT_WORK_PROTOCOL_V1

## 1. Purpose

This protocol standardizes how ChatGPT, Codex, Claude, and local workers handle Mikage tasks in `D:\KAGAMI-MZ_SYNC_PUSH_V2`.

It applies to documentation, planning, report writing, handoff updates, and task execution coordination.

It does not authorize render work, image generation, canon approval, or asset lock creation by itself.

## 2. AI_ROLE_LIMIT

- ChatGPT: may read, reason, plan, and report; must not bypass task gates.
- Codex: may edit approved repo files, commit, and push when the task explicitly allows it.
- Claude: may assist with analysis, planning, and report generation, but must obey the same gate rules.
- Local workers: may execute only the bounded work they are assigned.

## 3. FORBIDDEN_AUTONOMY

- Do not render without explicit authorization.
- Do not create new images unless the task explicitly requires image generation.
- Do not modify canon-locked assets.
- Do not create canon approval or asset lock without explicit permission.
- Do not expand scope silently.
- Do not retry around a blocker.
- Do not treat a handoff pointer as permission to execute unrelated work.

## 4. READ_FIRST Rule

Before acting on a Mikage task, read the current task source files and latest handoff state first.

Minimum read order:

1. `docs/handoff/00_LATEST_CODEX_HANDOFF.md`
2. The report or plan file referenced there
3. The current task-specific source files
4. Any required gate or protocol file

If the requested task depends on a source candidate, verify the candidate path before planning action.

## 5. VALIDATE_BEFORE_ACTION Rule

Before any action:

- verify the target file exists
- verify the task scope is still current
- verify the action is allowed
- verify the output path or destination exists, or create only the allowed documentation folder
- verify no locked asset is being modified

If validation fails, stop and report the blocker.

## 6. ACTION_RULE

Actions must be bounded, explicit, and traceable.

- One task, one objective.
- One next safe task at a time.
- One file set per documentation task unless the task explicitly requires more.
- No hidden side effects.
- No background execution that changes scope.
- No rendering unless a render authorization rule is satisfied.

## 7. REPORT_REQUIRED Schema

Every Mikage execution report must include:

- `TASK_CODE`
- `RESULT`
- `INPUT_FOUND`
- `OUTPUT_CREATED`
- `FILES_CREATED`
- `FILES_MODIFIED`
- `FORBIDDEN_ACTIONS_TRIGGERED`
- `LOCKED_ASSETS_MODIFIED`
- `APPROVAL_USED`
- `ERRORS`
- `NEXT_SHORT_TASK`

Recommended semantics:

- `RESULT`: `PASS` or `FAIL`
- `INPUT_FOUND`: `YES` or `NO`
- `OUTPUT_CREATED`: `YES` or `NO`
- `FORBIDDEN_ACTIONS_TRIGGERED`: `YES` or `NO`
- `LOCKED_ASSETS_MODIFIED`: `YES` or `NO`
- `APPROVAL_USED`: `YES` or `NO`

## 8. STOP_RULES

Stop immediately if:

- required approval is missing
- source input is missing
- the action is forbidden
- the output cannot be verified
- the task would silently expand scope
- a retry would bypass a gate
- the task would touch a canon-locked asset

Stop behavior:

- return `STOP`
- record the blocker
- do not invent a fallback path unless the task explicitly authorizes one

## 9. ONE_NEXT_SAFE_TASK Rule

Every completed Mikage task must end with exactly one next safe task.

- Do not list multiple next tasks.
- Do not list speculative alternatives as if they are active.
- If no safe next task exists, state `NONE` and explain the blocker.

## 10. GITHUB_HANDOFF_UPDATE Rule

After a completed Codex task that changes repo state or creates a new report:

- update `docs/handoff/00_LATEST_CODEX_HANDOFF.md`
- point it at the latest completed task
- keep the pointer consistent with the report or plan that was created
- commit and push the pointer update with the task artifact when the repo policy requires it

## 11. RENDER_AUTHORIZATION Rule

Rendering is forbidden unless the task explicitly authorizes it.

Before any render:

- confirm the render task code
- confirm the source candidate or workflow
- confirm the render count
- confirm the destination or pack path
- confirm the gate that will evaluate the output

If render authorization is absent, do not queue, submit, or simulate a render.

## 12. Operational Order

1. Read first.
2. Validate before action.
3. Apply the smallest allowed action.
4. Record the result.
5. Update the latest handoff pointer when required.
6. Stop with exactly one next safe task.
