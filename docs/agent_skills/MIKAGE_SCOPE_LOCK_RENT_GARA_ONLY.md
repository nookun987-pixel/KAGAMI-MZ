# MIKAGE SCOPE LOCK — RENT & GARA ONLY

## 1. Purpose
Lock the active analysis and documentation scope to only RENT and GARA operations. Prevent cross-lane drift, accidental execution on unrelated lanes, and unauthorized side effects.

## 2. When to use
- When operator requests RENT/GARA-only analysis, planning, audit, or doc work.
- When preparing status, handoff, or governance documents focused on RENT/GARA.
- When task safety requires strict lane isolation.

## 3. When not to use
- When operator explicitly approves work on non-RENT/GARA lanes.
- When task scope is explicitly global across all lanes.
- When requested work is purely unrelated to lane governance.

## 4. Required reads
- `AGENTS.md`
- `docs/MIKAGE_AGENT_SKILL.md`
- `docs/MIKAGE_MASTER_STATUS.md`
- Active task prompt and lock constraints

## 5. Allowed actions
- Read-only inspection of RENT/GARA relevant docs, status, and git state.
- Scoped documentation updates explicitly approved by operator.
- Safety checks and reporting tied to RENT/GARA scope.
- Minimal, reversible actions strictly inside approved files.

## 6. Forbidden actions
- Any lane execution without explicit operator approval.
- Any sync/export side effects.
- Telegram sends.
- GSheet append/write.
- Runtime/code/CSV edits outside explicit allowlist.
- Repo-wide scope expansion.
- Commit/push without explicit approval.

## 7. RENT allowed scope
- RENT pipeline governance documentation.
- RENT preflight, dedup/no-op policy, and reporting logic analysis.
- RENT runtime status interpretation (read-only unless explicitly approved for edits).
- RENT-related task closeout evidence formatting.

## 8. GARA allowed scope
- GARA governance and contract-path documentation.
- GARA pre-release gate/readiness analysis.
- GARA status and blocker interpretation (read-only unless explicitly approved for edits).
- GARA-related task closeout evidence formatting.

## 9. Explicitly forbidden lanes
Do not execute, modify, or broaden into:
- Image
- CALL
- Fanpage
- Finance
- Desktop UI

## 10. Expected report format
Every result should include:
1. CURRENT STATE
2. FILES CHANGED
3. COMMANDS RUN
4. REAL RESULT
5. PASS / FAIL
6. REMAINING ERROR
7. NEXT SAFE ACTION

If evidence is incomplete, report: `CHƯA XÁC NHẬN`.

## 11. Fail conditions
- Working outside approved file scope.
- Running unapproved lane/runtime commands.
- Triggering Telegram/GSheet side effects.
- Editing runtime/code/CSV without explicit approval.
- Claiming PASS without verifiable evidence.
- Dirty/unverified git state ignored.

## 12. Phase closeout checklist
- Confirm scope remained RENT/GARA-only.
- Confirm no forbidden lanes/actions were touched.
- Confirm changed files match operator allowlist.
- Confirm no temp/runtime artifacts were created by this phase.
- Provide final KEEP/REJECT/REVIEW recommendation if requested.
- Commit only after explicit operator approval.
- Re-verify repo state before any commit/push operation.
