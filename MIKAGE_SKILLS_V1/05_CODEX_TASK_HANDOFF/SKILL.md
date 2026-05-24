---
name: mikage-codex-task-handoff
description: Mikage Codex task handoff template rules. Use when writing, reviewing, or standardizing tasks for Codex or another AI tab to execute Mikage work.
---

# Codex Task Handoff

## Purpose

Standardize Mikage tasks sent to Codex so another tab can execute without guessing, reopening closed work, or touching forbidden files.

## Required Task Sections

Every task must include:

- `GOAL`
- `READ FIRST`
- `ALLOWED FILES`
- `FORBIDDEN FILES`
- `EXACT OUTPUT FILES`
- `VERIFY CHECKS`
- `FINAL REPORT FORMAT`
- `COMMIT/PUSH RULE`

## Required Constraints

Include explicit source rules for media tasks, especially original WAV/master audio requirements.

Include exact stop conditions for missing files, uncertain data, or approval gates.

Use `CHUA_XAC_NHAN` for unknowns rather than inventing facts.

## Verification

Before sending a task, check that outputs are exact, forbidden files are clear, and the final report format contains enough evidence for review.

## GitHub Meeting Point Rule

For every state-changing Mikage task, Codex/local agent must:

1. Update the relevant source/report file.
2. Update `docs/handoff/00_LATEST_CODEX_HANDOFF.md`.
3. Commit.
4. Push to `origin/main`.
5. Final report must include only:
   - `RESULT`
   - `COMMIT_HASH`
   - `PUSH_STATUS`
   - `MEETING_POINT_UPDATED`
   - `NEXT_SAFE_TASK`

If the handoff cannot be updated or pushed, report:

- `MEETING_POINT_UPDATED = NO`
- `REASON = exact failure reason`

Do not require the operator to paste long logs into ChatGPT.
