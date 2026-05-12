# 00_LATEST_CODEX_HANDOFF

## 1. LATEST_COMPLETED_TASK

ASSET-RESET-13_UPDATE_PHASE4_STACK_MANIFEST_WITH_HELD_CANDIDATE_DECISIONS_NO_RENDER_V1

## 2. LATEST_RESULT

PASS

## 3. ACTIVE_LANE

MIKAGE MASTER PIPELINE / Phase 4 Component Integration / held candidate rework sequence + missing asset build sequence

## 4. LATEST_REPORT_PATH

docs/handoff/ASSET-RESET-13_UPDATE_PHASE4_STACK_MANIFEST_WITH_HELD_CANDIDATE_DECISIONS_NO_RENDER_V1_REPORT.md

## 5. FILES_CREATED_OR_MODIFIED

- Created `docs/handoff/MIKAGE_PHASE4_STACK_MANIFEST_V2.md`
- Created `docs/handoff/ASSET-RESET-13_UPDATE_PHASE4_STACK_MANIFEST_WITH_HELD_CANDIDATE_DECISIONS_NO_RENDER_V1_REPORT.md`
- Updated `docs/handoff/00_LATEST_CODEX_HANDOFF.md`

## 6. PHASE4_SEQUENCE_STATUS

| Task | Status |
|---|---|
| ASSET-RESET-11 — Prepare held candidate human review summary | COMPLETE |
| ASSET-RESET-12 — Record human review decisions | COMPLETE |
| ASSET-RESET-13 — Update Phase 4 stack manifest with decisions | COMPLETE |
| ASSET-RESET-14 — Define bust/upper-body bridge spec | COMPLETE |
| ASSET-RESET-15 — Define body continuity constraint spec | BLOCKED — requires bust bridge candidate accepted |

## 7. CURRENT_NEXT_TASK

BLOCKED — NO CLAUDE TASK EXECUTABLE

All current Claude documentation tasks are complete. The pipeline is blocked on a non-Claude action:

**ACTION REQUIRED (Codex / local ComfyUI — not Claude):**
Generate a new bust / upper-body bridge candidate following the spec at:
`docs/handoff/MIKAGE_BUST_UPPER_BODY_BRIDGE_ASSET_REQUEST_SPEC_V1.md`

Once a candidate exists, submit it for evaluation using the 4-step process in Section 9 of that spec. If the candidate receives `INCLUDE_AS_PHASE4_REFERENCE`, the following Claude tasks become unblocked:
- ASSET-RESET-15_DEFINE_BODY_CONTINUITY_CONSTRAINT_SPEC_NO_RENDER_V1
- Phase 5 readiness re-review gate

## 8. PHASE5_UNBLOCKING_CONDITIONS

| Condition | Status |
|---|---|
| Held candidates have documented human decisions | MET — ASSET-RESET-12 |
| Phase 4 stack manifest updated with decisions | MET — ASSET-RESET-13 (V2 manifest) |
| Bust / upper-body bridge spec exists | MET — ASSET-RESET-14 |
| Bust / upper-body bridge candidate accepted | NOT MET — candidate not yet generated |
| Phase 5 readiness re-review PASS | NOT MET |

PHASE5_ALLOWED: NO

3 of 5 conditions MET. Blocked on bust bridge candidate generation by Codex / local ComfyUI.

## 9. ACTIVE_MANIFEST

`docs/handoff/MIKAGE_PHASE4_STACK_MANIFEST_V2.md`

V1 retained as historical record. V2 is the active manifest.

## 10. GITHUB_REVIEW_INSTRUCTION_FOR_CHATGPT

ChatGPT should read this file first whenever the user says "check GitHub", then read the latest report path listed here. The user should not need to paste task results manually.

## 11. PROHIBITED_LANES

- IMAGE: NO
- VIDEO: NO
- RENDER: NO
- COMFYUI: NO
- BLENDER: NO
- PUBLIC_DEPLOY: NO
- CANON_APPROVAL: NO
- ASSET_LOCK: NO
- FILM: NO
- SHOTLIST: NO
- CANDIDATES_AS_PRODUCTION_READY: NO
- PHASE5_STARTED: NO
