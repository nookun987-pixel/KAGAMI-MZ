# ASSET-RESET-01_CREATE_MIKAGE_USABLE_ASSET_INVENTORY_V1_TASK

## TASK

ASSET-RESET-01_CREATE_MIKAGE_USABLE_ASSET_INVENTORY_V1

## OBJECTIVE

Stop the premature film/video lane and create a real usable asset inventory for Mikage.

The current problem is not film production. The current problem is that the workspace contains many tests, candidates, guides, blockouts, and failed routes, but no clean usable production asset stack.

## HARD DECISION

FILM_VIDEO_ALLOWED: NO
FILM_RESET_03_ALLOWED: NO
SHOTLIST_ALLOWED: NO
RENDER_ALLOWED: NO

## READ FIRST

- docs/handoff/00_LATEST_CODEX_HANDOFF.md
- docs/handoff/MIKAGE_FILM_REQUIRED_ASSET_BLUEPRINT_V1.md
- docs/handoff/FILM-RESET-02_CREATE_HUMAN_SELECTION_BOARD_FOR_REQUIRED_FILM_PLATES_V1_REPORT.md
- docs/handoff/MIKAGE_GITHUB_HANDOFF_BRIDGE_RULE_V0.md
- .mikage_context
- NEXT_TASK.md

## INSPECT

Primary local source:

D:\workspace\ComfyUI\MIKAGE_CANON

Also inspect:

D:\KAGAMI-MZ_SYNC_PUSH_V2
D:\KAGAMI-MZ_SYNC_PUSH_V2\docs\handoff
D:\KAGAMI-MZ_SYNC_PUSH_V2\film_proofs

## DO NOT

- Do not create film tasks.
- Do not create shotlists.
- Do not create video.
- Do not render.
- Do not use ComfyUI runtime.
- Do not use Blender.
- Do not approve canon.
- Do not asset-lock anything.
- Do not call test outputs production-ready.

## CREATE

- docs/handoff/MIKAGE_USABLE_ASSET_INVENTORY_V1.md
- docs/handoff/ASSET-RESET-01_CREATE_MIKAGE_USABLE_ASSET_INVENTORY_V1_REPORT.md

## INVENTORY GROUPS

Group every relevant asset/file into:

1. LOCKED_OR_CANON_REFERENCE
2. USABLE_FOR_PRIVATE_REFERENCE_ONLY
3. PRODUCTION_CANDIDATE_NEEDS_REVIEW
4. GUIDE_OR_TECHNICAL_REFERENCE
5. FAILED_DO_NOT_USE
6. ARCHIVE_ONLY
7. MISSING_REQUIRED_ASSET

For each item include:

- asset name
- path
- type: character / helmet / body / environment / weapon / UI / video / audio / guide / report
- current status
- evidence file/report if any
- safe use
- forbidden use
- next action

## REQUIRED INVENTORY SECTIONS

1. Executive conclusion
2. What currently exists
3. What is usable only as reference
4. What is failed or forbidden
5. What is missing
6. Why film/video remains blocked
7. Minimum usable Mikage production asset stack
8. Recommended next 5 asset-building tasks
9. Stop rules

## REPORT REQUIREMENTS

Report must include:

- RESULT: PASS / BLOCKED
- FILES_READ
- AREAS_INSPECTED
- FILES_CREATED
- FILES_MODIFIED
- FILM_VIDEO_ALLOWED: NO
- KEY_DECISION
- NEXT_SAFE_TASK
- BLOCKERS
- PROHIBITED_ACTIONS_CONFIRMED

## NEXT SAFE TASK RULE

If inventory is created:

ASSET-RESET-02_CREATE_MIKAGE_MINIMUM_PRODUCTION_ASSET_STACK_PLAN_V1

If blocked:

Return exact blocker.

## UPDATE POINTER

Update docs/handoff/00_LATEST_CODEX_HANDOFF.md to point to the ASSET-RESET-01 report.

## GIT

Commit message:

Create Mikage usable asset inventory task output

Push to main.

## FINAL RESPONSE

Return only:

RESULT:
INVENTORY_PATH:
REPORT_PATH:
POINTER_UPDATED:
COMMIT_HASH:
PUSH_SUCCEEDED:
FILM_VIDEO_ALLOWED:
NEXT_SAFE_TASK:
BLOCKERS:
