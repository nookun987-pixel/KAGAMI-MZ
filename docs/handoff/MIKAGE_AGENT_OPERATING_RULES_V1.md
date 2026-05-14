# MIKAGE_AGENT_OPERATING_RULES_V1

**Version:** V1
**Created:** 2026-05-14
**Task:** OPS-DB-01_CREATE_MIKAGE_OPERATING_DATABASE_V1
**Applies to:** All AI agents, local executors, Codex sessions operating on the Mikage Zenith Studio project

---

## RULE 1 — Read Before Acting

Always read `docs/handoff/MIKAGE_OPERATING_DATABASE_V1.md` before starting any task.
Always read `docs/handoff/00_LATEST_CODEX_HANDOFF.md` to confirm the current NEXT_SAFE_TASK.
Do not act on chat memory alone. If a value is not in a file, it is not verified.

## RULE 2 — Verify Output Files Before Claiming PASS

Never claim PASS, SUCCESS, or COMPLETE unless every required output file has been verified to exist on disk.
Use filesystem inspection (e.g. `ls`, `find`, `stat`) to confirm. A file written without verification is not confirmed.

## RULE 3 — Never Continue a Closed Route

If a route is marked CLOSED, RETIRED, or BLOCKED in the operating database or handoff, do not continue it.
Do not reopen a closed route without an explicit human instruction and a new verified task spec.

## RULE 4 — Never Create V2/V3 Follow-Up Without Authorization

Do not create a V2, V3, or follow-up version of any file, asset, or task unless:
- The current route explicitly allows it, AND
- The current task spec or handoff pointer authorizes it

## RULE 5 — Never Render Without Explicit Permission

Do not start any image generation, video generation, ComfyUI workflow, Blender render, or any compute-based output creation unless the current task spec explicitly states render is allowed.
Default assumption: render is NOT allowed.

## RULE 6 — Always Write a Report

Every completed task must produce a report file. The report must include:
- TASK_ID
- RESULT: PASS / FAIL / BLOCKED
- FILES_CREATED
- FILES_MODIFIED
- BLOCKERS (if any)
- NEXT_SAFE_TASK

## RULE 7 — Always Mark Unverified Data Correctly

If data was found in a file: cite the source path in `verification_source`.
If data is known only from chat/user context and not confirmed in a file: write `USER_CONTEXT_NOT_FILE_VERIFIED`.
If data is unknown: write `CHUA_XAC_NHAN`.
Never leave important fields blank. Never invent a value.

## RULE 8 — Stop on Missing Source Data

If a required source path is inaccessible or a required data field cannot be verified from a file:
- Do not guess.
- Do not substitute chat context.
- Write `CHUA_XAC_NHAN` or `USER_CONTEXT_NOT_FILE_VERIFIED` as appropriate.
- File a BLOCKED report with the exact missing path or field.
- Stop execution of that subtask.

## RULE 9 — Prefer One Simple Working Path

Do not branch into multiple parallel approaches unless the task spec explicitly requires it.
Prefer the simplest verified path. One correct output is better than multiple unverified outputs.

## RULE 10 — Do Not Canon-Lock or Asset-Lock Without Explicit Human Authorization

Do not mark any file, asset, or output as:
- CANON_LOCKED
- ASSET_LOCKED
- PRODUCTION_READY
- PUBLIC_READY

unless the current task spec contains an explicit human authorization to do so.
Default assumption: no locks are granted by task completion alone.

## RULE 11 — Do Not Modify Canon Assets

Do not edit, overwrite, move, or delete files in:
- `D:\workspace\ComfyUI\MIKAGE_CANON\`
- Any file with `_ASSET_LOCK.md` in its name
- Any file marked LOCKED_OR_CANON_REFERENCE in the operating database

## RULE 12 — Do Not Submit to TooLost

Do not initiate, automate, or assist any submission to TooLost or any distribution platform unless explicitly instructed by a verified task spec with human authorization.

## RULE 13 — Update the Handoff Pointer After Every Task

After completing any task:
1. Update `docs/handoff/00_LATEST_CODEX_HANDOFF.md` with the completed task, result, files modified, and next safe task.
2. Commit and push, or provide exact PowerShell commands if git is not accessible.

## RULE 14 — Do Not Change Lanes Without Authorization

Do not switch from the current active task lane to a different lane unless the handoff pointer explicitly authorizes it or a human instruction changes the lane.
If multiple lanes exist (e.g. OPS-DB lane and character prompt lane), execute only the instructed lane.

---

## Quick Reference — Forbidden Actions (Always)

- Do NOT render images or video
- Do NOT use ComfyUI runtime
- Do NOT use Blender
- Do NOT generate public output
- Do NOT submit to TooLost or any store
- Do NOT create film tasks, shotlists, or video plans from the current asset state
- Do NOT approve canon or create asset locks without human authorization
- Do NOT call any candidate production-ready without evidence
- Do NOT continue a closed route (film/video, IPAdapter, 09E renders, canon gate sprint)
- Do NOT invent UPC, catalog numbers, release dates, or verification sources
- Do NOT claim PASS without verifying output files on disk

---

*MIKAGE_AGENT_OPERATING_RULES_V1 — active — applies to all sessions — update only with human authorization*
