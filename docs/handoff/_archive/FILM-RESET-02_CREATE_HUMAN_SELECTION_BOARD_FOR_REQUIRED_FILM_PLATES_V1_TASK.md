# FILM-RESET-02_CREATE_HUMAN_SELECTION_BOARD_FOR_REQUIRED_FILM_PLATES_V1_TASK

## TASK

FILM-RESET-02_CREATE_HUMAN_SELECTION_BOARD_FOR_REQUIRED_FILM_PLATES_V1

## ROLE

You are the local Codex worker. Create a human-facing selection board for the required Mikage film plates. This task is documentation and asset-candidate organization only.

## OBJECTIVE

Create a board that lets the user approve, reject, or mark missing the three required plate roles for the first viable target:

- ENVIRONMENT_WORLD_PLATE
- CHARACTER_PRESENCE_BEYOND_MASK_PLATE
- EVENT_SYSTEM_PLATE

The current blueprint says immediate FILM-02 is not allowed. Do not create a shotlist or video.

## READ FIRST

- docs/handoff/00_LATEST_CODEX_HANDOFF.md
- docs/handoff/MIKAGE_FILM_REQUIRED_ASSET_BLUEPRINT_V1.md
- docs/handoff/FILM-RESET-01_CREATE_MIKAGE_FILM_REQUIRED_ASSET_BLUEPRINT_V1_REPORT.md
- docs/handoff/FILM-01B_IMPORT_COMFYUI_CANON_ASSETS_TO_FILM_SOURCE_PACK_V1_REPORT.md
- docs/handoff/MIKAGE_GITHUB_HANDOFF_BRIDGE_RULE_V0.md
- .mikage_context
- NEXT_TASK.md

Optional local reference source if available:

- D:\workspace\ComfyUI\MIKAGE_CANON

Use local ComfyUI files only to identify candidate stills for human selection. Do not run ComfyUI.

## DO NOT

- Do not render.
- Do not generate images.
- Do not generate video.
- Do not use ComfyUI runtime.
- Do not use Blender.
- Do not create FILM-02 shotlist.
- Do not approve canon.
- Do not asset-lock anything.
- Do not public deploy.
- Do not claim mask/key visual assets are film-ready.

## CREATE FOLDER

film_proofs/MIKAGE_FILM_PROOF_01/selection_board_v1

## CREATE FILES

- film_proofs/MIKAGE_FILM_PROOF_01/selection_board_v1/README.md
- film_proofs/MIKAGE_FILM_PROOF_01/selection_board_v1/HUMAN_SELECTION_BOARD.md
- film_proofs/MIKAGE_FILM_PROOF_01/selection_board_v1/CANDIDATE_PLATE_INDEX.md
- film_proofs/MIKAGE_FILM_PROOF_01/selection_board_v1/DECISION_TEMPLATE.md
- docs/handoff/FILM-RESET-02_CREATE_HUMAN_SELECTION_BOARD_FOR_REQUIRED_FILM_PLATES_V1_REPORT.md

## BOARD REQUIREMENTS

For each required plate role, list candidates if found:

1. ENVIRONMENT_WORLD_PLATE
2. CHARACTER_PRESENCE_BEYOND_MASK_PLATE
3. EVENT_SYSTEM_PLATE

For each candidate include:

- candidate_id
- original_path
- copied_or_referenced_path
- role_fit
- status: CANDIDATE_REQUIRES_HUMAN_REVIEW / MISSING / REFERENCE_ONLY / REJECTED_DO_NOT_USE
- risk
- human_decision: PENDING

If no usable candidate exists for a role, mark that role as MISSING and describe the missing asset request.

## IMPORTANT SELECTION RULES

A mask close-up alone cannot satisfy CHARACTER_PRESENCE_BEYOND_MASK_PLATE.
A key visual alone cannot satisfy the full film-ready set.
The board must make it easy for the user to say APPROVE, REJECT, or NEED_NEW_ASSET for each of the 3 roles.

## REPORT REQUIREMENTS

The report must include:

- RESULT: PASS_SELECTION_BOARD_CREATED / PARTIAL_MISSING_CANDIDATES / BLOCKED
- FILES_READ
- FOLDERS_CREATED
- FILES_CREATED
- LOCAL_AREAS_INSPECTED
- CANDIDATES_FOUND_BY_ROLE
- MISSING_ROLES
- IMMEDIATE_FILM_02_ALLOWED: NO
- NEXT_SAFE_TASK
- BLOCKERS
- PROHIBITED_ACTIONS_CONFIRMED

NEXT_SAFE_TASK rules:

If board created:
FILM-RESET-03_HUMAN_SELECT_OR_REJECT_ENVIRONMENT_CHARACTER_EVENT_PLATES_V1

If blocked:
Return exact blocker.

## UPDATE POINTER

Update docs/handoff/00_LATEST_CODEX_HANDOFF.md to point to the FILM-RESET-02 report and next safe task.

## GIT

Commit message:
Create Mikage film plate human selection board

Push to main.

## FINAL RESPONSE

Return only:

RESULT:
BOARD_PATH:
REPORT_PATH:
POINTER_UPDATED:
COMMIT_HASH:
PUSH_SUCCEEDED:
IMMEDIATE_FILM_02_ALLOWED:
NEXT_SAFE_TASK:
BLOCKERS:
