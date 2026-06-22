# AGENTS — Governance Entry Guard

## Repo Entry Protocol

Before any task starts, the agent must declare:

- ACTIVE_LANE: Current lane or phase being worked on.
- RESPONSE_MODE: Required answer/work mode.
- TASK_TYPE: Type of task being performed.
- EXACT_TARGET_FILE: Exact file to modify, or `NONE` for read-only tasks.
- ALLOWED_FILES: Files allowed to be modified for this task.
- FORBIDDEN_FILES: Files or folders that must not be touched.
- TIME_LIMIT: Maximum time allowed for the task.
- COMMAND_LIMIT: Maximum number of commands allowed.
- STATUS_WRITEBACK_TARGET: Where the result/status must be written or reported.
- SUCCESS_CHECK: Exact check required before claiming PASS.
- CANON_SOURCE: Which SSOT file authorizes the canon used in this task, or `NONE` for non-canon/process tasks. (See Canon Source Discipline.)
- DRAFT_INPUTS: Any draft/report/AI-research referenced. Must be labelled DRAFT. A draft may NOT be treated as canon.

No task may proceed if any of these fields are missing.

## Stop Conditions

Stop immediately and report blocker if any condition is true:

- Dirty repo detected before task start.
- Unexpected untracked files appear during task.
- Required command output is missing or inconclusive.
- Planned action touches files outside allowed scope.
- Any `.env` or secret file is involved.
- Task requires runtime, sync, push, deploy, GSheet, Telegram, or external service actions.
- Declared time limit is exceeded.
- Declared command limit is exceeded.
- User approval is required but has not been given.
- The current workspace is not confirmed.

## Windows Command Rule

When running commands in Windows PowerShell or CMD:

- Do not chain commands with `&&`.
- Run required verification commands one by one.
- Prefer simple commands with visible stdout:
  - `git status --porcelain=v1`
  - `git branch --show-current`
  - `git log -1 --oneline`
- If command output is missing, empty when it should not be, or inconclusive, stop and report blocker.
- Do not continue into code changes when repo state cannot be verified.
- If Windsurf command output is unreliable, request external Windows CMD verification.
- Do not treat missing stdout as success.
- Do not claim repo clean unless `git status --porcelain=v1` is visibly empty from a reliable command source.

## External CMD Evidence Fallback

If Windsurf command output is incomplete but external Windows CMD output has been provided by the operator:

- The agent may use the external CMD output as repo-state evidence.
- The external CMD output must include all required checks:
  - `git status --porcelain=v1`
  - `git branch --show-current`
  - `git log -1 --oneline`
- The agent must quote or summarize the observed external CMD evidence in the status report.
- The agent must clearly mark the evidence source as `EXTERNAL_CMD_VERIFIED`.
- If external CMD shows:
  - empty `git status --porcelain=v1`
  - branch = `main`
  - latest commit visible
  then the agent may treat repo state as verified.
- If external CMD output is missing any required check, the agent must stop and report blocker.
- External CMD fallback does not allow bypassing scope rules.
- External CMD fallback does not allow runtime, sync, push, or secret inspection.
- External CMD fallback only resolves repo-state verification issues caused by unreliable Windsurf stdout.

## Canon Source Discipline

Read `docs\architecture\MIKAGE_CANON_CONTROL_MAP.md` BEFORE any canon-touching task.

### SSOT — the ONLY canon (only the operator edits these)

- `docs\handoff\MIKAGE_ZENITH_ENTITY_PHASE_SPEC_V1.md`   (phase P1/P2/P3 + mask ruling)
- `design_system\mikage-cine-color-contract.md`          (cine color; violet only at the 2 slits or a P3 core)
- `docs\mikage_character_visual_spec.md`                  (character form spec)
- `docs\mikage_universe_visual_system.md`                 (world/universe visual)
- `mikage-zenith-design` skill                            (BRAND/UI canon — wins for web/UI)

### Rules

1. DRAFT != CANON. Any external report / deep-research / GPT-Gemini output = DRAFT. It may NOT override SSOT and may NOT be cited as canon. A draft becomes canon ONLY when the operator hand-writes the point into an SSOT file (plus a changelog line).
2. No agent edits SSOT. Only the operator promotes draft -> canon.
3. On layer conflict: BRAND/interface canon wins for web/UI; cine canon only for MV/world-art.

### STOP and report blocker if:

- An external/report doc claims "locked / Vx.x" but is NOT in the SSOT list above.
- A task cites name-collision IPs (e.g. Reo Mikage/Blue Lock, Souji Mikage/Utena, Kamisama Kiss) OR borrows Evangelion mechanics (A.T. Field wings, Berserk mode, S2 auto-regen, Blood Type Blue) as Mikage canon.
- Violet is used as fill / wash / ambient / halo (allowed ONLY at the two sensor slits or a P3 core).
- Head ratio, hair, or Ensō position is changed without that change already existing in an SSOT file.

## Current Scope Lock

- Active work is `GOVERNANCE / OPERATOR_REST_MODE_V0` for broad work.
- Rest Mode remains closed for broad runtime/sync/lane work.
- One controlled exception is open:
  - `MIKAGE_COMPLETION_LOOKDEV_V0_1_RUNTIME_PHASE = COMPLETED_SUPERSEDED_AS_ACTIVE_OUTPUT_TARGET`
  - `MIKAGE_COMPLETION_LOOKDEV_V0_2_RUNTIME_PHASE = COMPLETED_SUPERSEDED_AS_ACTIVE_OUTPUT_TARGET`
  - `MIKAGE_FORMAL_MATERIAL_SILHOUETTE_REVIEW_V0_1_PHASE = COMPLETED_SUPERSEDED_AS_ACTIVE_OUTPUT_TARGET`
  - `MIKAGE_PUBLIC_HERO_RENDER_CANDIDATE_V0_1_PHASE = OPEN`
  - Only allowed next task: `MIKAGE PUBLIC HERO RENDER CANDIDATE V0.1`
  - Only allowed outputs:
    - `production/character/reviews/MIKAGE_PUBLIC_HERO_RENDER_CANDIDATE_V0_1_CONTACT_SHEET.png`
    - `production/character/reviews/MIKAGE_PUBLIC_HERO_RENDER_CANDIDATE_V0_1_PROOF.md`
  - Source/reference files for the allowed task:
    - `production/character/production_actor/rig_derivatives/MIKAGE_PRODUCTION_ACTOR_COMPLETION_LOOKDEV_V0_2.blend`
    - `production/character/reviews/MIKAGE_COMPLETION_LOOKDEV_V0_2_PROOF.md`
    - `production/character/reviews/MIKAGE_COMPLETION_LOOKDEV_V0_2_PROOF_CONTACT_SHEET.png`
    - `production/character/reviews/MIKAGE_FORMAL_MATERIAL_SILHOUETTE_REVIEW_V0_1.md`
    - `docs/mikage_character_visual_spec.md`
    - `docs/mikage_universe_visual_system.md`
    - `design_system/mikage-cine-color-contract.md`
  - Source V0.1 must not be overwritten.
  - Source V0.3 must not be overwritten.
  - No `.blend` edits.
  - Candidate proof only.
  - No asset lock.
  - No public render ready claim.
  - No production rig ready claim.
  - No website/public deployment.
- Second controlled exception is open:
  - `LANE_A_RIG_REPAIR_EXECUTION_V0_1 = OPEN`
  - Only allowed next task: `LANE_A_RIG_REPAIR_EXECUTION_V0_1`
  - Only allowed source blend:
    - `production/character/production_actor/rig_derivatives/MIKAGE_PRODUCTION_ACTOR_FIRST_MOTION_TEST_FROM_APPROVED_GATE_V0_1.blend`
  - Only allowed output blend:
    - `production/character/production_actor/rig_derivatives/MIKAGE_PRODUCTION_ACTOR_RIG_REPAIR_PASS_V0_1_FROM_FIRST_MOTION_TEST_V0_1.blend`
  - Only allowed proof report:
    - `docs/reports/LANE_A_RIG_REPAIR_EXECUTION_RESULT_V0_1.md`
  - Inspect/repair only the 29 intended deforming meshes listed in `LANE_A_RIG_REPAIR_PLAN_V1.md`.
  - Keep `hand_right_sword_hold_marker` unbound.
  - Keep `reference_anchor_v1_plane_hidden_from_render` unbound.
  - Save only the approved derivative output blend.
  - Run metadata inspection and non-render in-memory pose check only.
  - No render.
  - No push.
  - No deploy.
  - No website/public/audio/short/release changes.
  - No production rig ready claim.
- Third controlled exception is open:
  - `MIKAGE_HERO_MOUNT_EEVEE_V0_1 = OPEN`
  - Lane B restriction waived for THIS task only (Lane A executes a Lane-B-originated render request).
  - CANON NOTE: inputs below are DRAFT ART-DIRECTION REFERENCE ONLY, not canon. They do NOT override SSOT. On conflict, `docs/mikage_character_visual_spec.md` wins. "LOCK" in these filenames = Lane-B working status, not canon lock.
  - Only allowed next task: `MIKAGE_HERO_MOUNT_EEVEE_V0_1`
  - Allowed inputs (reference only):
    - `production/character/keyart_candidates/MIKAGE_SOLO_BW_V0_4.png`
    - `production/character/keyart_candidates/MIKAGE_STEED_SKELETON_BW_V0_5.png`
    - `production/character/keyart_candidates/MIKAGE_HERO_MOUNT_V0_2.png`
    - `production/character/keyart_candidates/LANEA_BLENDER_HANDOFF_BRIEF.md`
  - Allowed outputs (candidate only):
    - `production/character/reviews/MIKAGE_HERO_MOUNT_EEVEE_V0_1_CONTACT_SHEET.png`
    - `production/character/reviews/MIKAGE_HERO_MOUNT_EEVEE_V0_1_PROOF.md`
    - new `.blend` under `production/character/` (do NOT overwrite existing actor/proxy blends)
  - Render permission GRANTED (Blender + Eevee, local, single still + clay).
  - Build FRESH from blueprints. Do NOT reuse/modify `production_actor` or `proxy_actor` blends.
  - No canon-lock. No asset-lock. No final/production-ready claim. No push. No deploy. Candidate proof only.
  - On drift or SSOT conflict: stop and report.
- `RENT` / `GARA` / `Image` / `Call` runtime must not run during this phase.
- Dirty original repo `D:\KAGAMI-MZ` is HOLD only.
- Clean workspace is `D:\KAGAMI-MZ_SYNC_PUSH_V2`.
- Current clean branch baseline is `main`.
- Do not touch `D:\KAGAMI-MZ` unless the task is explicitly read-only classification.
- No Lane B.
- No website / HTML.
- No roster / queue.
- No Z-Blue archive/history cleanup.
- No push.
- Production rig remains `NO`.
- Public render ready remains `NO`.
- Asset lock remains `NO`.

## ROOT ARTIFACT CREATION LOCK

- Agents must not create new files directly in the repository root unless the user explicitly authorizes the exact filename.
- Temporary outputs, smoke results, debug files, generated reports, screenshots, images, JSON test outputs, and local run artifacts must go under one of:
  - `runtime/`
  - `data/`
  - `docs/archive/`
  - `docs/reports/`
  - `_tmp/` outside repo when possible
- If a task creates an unexpected root file, the task must STOP before commit and report:
  - file name
  - command that created it
  - whether it is tracked, untracked, or ignored
  - recommended cleanup action
- Do not use `git clean -fdx` for root cleanup unless explicitly approved by the user.
- Tracked root files must not be moved by pattern. They require an approved move list and rename-only verification.

## Required Source-of-Truth Files

The agent must read these files before proposing the next action:

- `AGENTS.md`
- `docs\architecture\MIKAGE_CANON_CONTROL_MAP.md`
- `docs\agent_dev_task_board.md`
- `docs\architecture\MIKAGE_AUTOPILOT_GUARD_V0.md`
- `docs\architecture\MIKAGE_REPO_BUTLER_MAP.md`

If any required file is missing, stop and report blocker.

## Operator Rule

- Once Operator Rest Mode is active, user must not be asked to manually courier long tasks.
- Agent must read current repo state and task board before proposing the next action.
- Agent must propose one next safe action only.
- Agent must not ask the user to choose between many technical options.
- Agent must not continue from chat memory alone.
- Repo files are the source of truth.

## Allowed Current Phase Actions

During `GOVERNANCE / OPERATOR_REST_MODE_V0`, allowed actions are limited to:

- Read governance files.
- Verify repo state.
- Use external CMD evidence only when Windsurf stdout is unreliable.
- Update one explicitly declared governance file if approved.
- Execute the single controlled exception `MIKAGE_PUBLIC_HERO_RENDER_CANDIDATE_V0_1_PHASE = OPEN` only when the task is exactly `MIKAGE PUBLIC HERO RENDER CANDIDATE V0.1` and the output set is exactly the two listed candidate proof files.
- Execute the controlled exception `LANE_A_RIG_REPAIR_EXECUTION_V0_1 = OPEN` only when the task is exactly `LANE_A_RIG_REPAIR_EXECUTION_V0_1` and the output set is exactly the approved derivative blend plus the approved proof report listed above.
- Execute the controlled exception `MIKAGE_HERO_MOUNT_EEVEE_V0_1 = OPEN` only when the task is exactly `MIKAGE_HERO_MOUNT_EEVEE_V0_1` and outputs are exactly the two listed candidate files (+ new blend).
- Report next safe action.
- Write structured status back to the requested target.

## Forbidden Current Phase Actions

During this phase, the agent must not:

- Run RENT lane.
- Run GARA lane.
- Run Image lane.
- Run Call lane.
- Run sync.
- Send Telegram messages.
- Append to GSheet.
- Inspect `.env` or credential files.
- Push to GitHub unless the user explicitly approves push for that exact task.
- Use `git add .`.
- Modify multiple files unless explicitly approved.
- Modify or delete files in `D:\KAGAMI-MZ`.

## Required Completion Report

Every task must end with this report structure:

- FILES_CHANGED =
- COMMANDS_RUN =
- EVIDENCE_SOURCE =
- REPO_STATUS =
- SUCCESS_CHECK =
- PASS_FAIL =
- BLOCKER =
- NEXT_SAFE_ACTION =
- COMMIT_DONE =
- PUSH_DONE =

The agent must not say PASS unless the success check has visible evidence.
