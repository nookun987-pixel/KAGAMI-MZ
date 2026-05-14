# OPS-DB-01_CREATE_MIKAGE_OPERATING_DATABASE_V1

## TASK ID
OPS-DB-01_CREATE_MIKAGE_OPERATING_DATABASE_V1

## PURPOSE
Create a single source-of-truth operating database for Mikage Zenith Studio so future AI/agent work can read verified project status before acting.

## TASK TYPE
Documentation / database creation only.

## EXECUTOR
Claude Cowork / Local Agent, or any local filesystem-capable repo agent.

## ALLOWED ACTIONS
- Read existing project docs.
- Create Markdown files.
- Create CSV files.
- Write a completion report.
- Mark unknown fields as CHUA_XAC_NHAN.
- Cite source paths when data is found in existing files.

## FORBIDDEN ACTIONS
- Do NOT render images.
- Do NOT generate videos.
- Do NOT modify website files.
- Do NOT submit anything to TooLost.
- Do NOT modify canon assets.
- Do NOT continue any closed route.
- Do NOT invent UPC, catalog number, release date, status, or verification source.
- Do NOT claim PASS unless output files exist and are verified.

## TARGET ROOT
D:\KAGAMI-MZ_SYNC_PUSH_V2\docs\handoff

## FILES TO CREATE
1. MIKAGE_OPERATING_DATABASE_V1.md
2. MIKAGE_TRACK_CATALOG_DATABASE_V1.csv
3. MIKAGE_ASSET_ROUTE_STATUS_DATABASE_V1.csv
4. MIKAGE_AGENT_OPERATING_RULES_V1.md
5. OPS_DB_01_CREATE_MIKAGE_OPERATING_DATABASE_V1_REPORT.md

## SOURCE PATHS TO INSPECT
- D:\KAGAMI-MZ_SYNC_PUSH_V2\docs\handoff
- D:\workspace\ComfyUI\MIKAGE_CANON\00_ACTIVE_BOARD
- D:\workspace\ComfyUI\MIKAGE_CANON\08_CHARACTER_REVIEW_CANDIDATES

## DATA TO LOOK FOR
- TooLost catalog records
- Track release links
- UPC
- Catalog number
- Release date
- Proof pack status
- Website status
- Store delivery log status
- Canon asset locks
- Active board state
- Route closed/open status
- Latest task reports

## DATABASE RULE
If data is found in existing files, cite the source path in `verification_source`.
If data is only known from user/chat context and not found in files, write:
USER_CONTEXT_NOT_FILE_VERIFIED
If data is unknown, write:
CHUA_XAC_NHAN
Do not leave important cells blank.

## MIKAGE_OPERATING_DATABASE_V1.md STRUCTURE
Must contain:
- Purpose
- Source-of-truth rule
- What belongs in Memory
- What belongs in Wiki/docs
- What belongs in Database
- What belongs in GitHub/local files
- Required preflight checklist before any agent action
- Failure rules
- Update protocol

## MIKAGE_TRACK_CATALOG_DATABASE_V1.csv COLUMNS
track_no,
track_title,
language,
release_date,
toolost_status,
release_link,
upc,
catalog_number,
genre,
secondary_genre,
label,
proof_pack_status,
website_status,
store_delivery_log_status,
verification_source,
last_verified_date,
notes

## MIKAGE_ASSET_ROUTE_STATUS_DATABASE_V1.csv COLUMNS
route_id,
asset_or_route_name,
category,
status,
allowed_next_action,
forbidden_actions,
source_path,
verification_source,
last_verified_date,
notes

## REQUIRED ASSET / ROUTE CHECKS
Include rows for these if found:
- MIKAGE_UNIFIED_KEY_VISUAL_V4
- ZENITH_BLADE_V2
- AUDIO_SHORT_VISUAL_CANON_V4
- MIKAGE_VOLUME_FIRST_3D_HELMET_SIDE_V1
- MIKAGE_HELMET_FRONT_VIEW_3D_SOURCE_V1
- MIKAGE_HELMET_PAIR_TURNAROUND_EXPORT_V2B_BALANCE_TEST
- Any active/closed route found in existing board docs

If not found, still include the row with:
status = CHUA_XAC_NHAN
notes = NEED_SOURCE_VERIFICATION

## MIKAGE_AGENT_OPERATING_RULES_V1.md MUST INCLUDE
- Never claim success without checking output files.
- Never continue a closed route.
- Never create V2/V3 follow-up unless current route allows it.
- Never render when render permission is not explicitly allowed.
- Always read Operating Database before acting.
- Always write a report after task completion.
- Always include PASS / FAIL / BLOCKED.
- If missing source data, stop with concrete blocker report.
- Prefer one simple working path over multiple branches.

## REPORT FILE REQUIREMENTS
OPS_DB_01_CREATE_MIKAGE_OPERATING_DATABASE_V1_REPORT.md must contain:
- TASK_ID
- RESULT: PASS / FAIL / BLOCKED
- FILES_CREATED
- FILES_MODIFIED
- DATA_IMPORTED_FROM_EXISTING_FILES: YES/NO
- UNVERIFIED_FIELDS_COUNT
- BLOCKERS
- NEXT_SAFE_TASK

## EXPECTED RESULT
A clean operating database exists and can be used as the first-read file for all future Mikage agent tasks.

## NEXT SAFE TASK AFTER PASS
OPS-DB-02_POPULATE_AND_RECONCILE_MIKAGE_TRACK_CATALOG_FROM_VERIFIED_SOURCES_V1
