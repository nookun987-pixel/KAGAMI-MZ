# MIKAGE_OPERATING_DATABASE_V1

**Version:** V1
**Created:** 2026-05-14
**Task:** OPS-DB-01_CREATE_MIKAGE_OPERATING_DATABASE_V1
**Status:** ACTIVE — first-read file for all Mikage agent tasks

---

## 1. Purpose

This document is the single source-of-truth operating database index for Mikage Zenith Studio.

Every AI agent, local executor, or Codex session must read this file before taking any action on the Mikage project. Its role is to prevent agents from acting on stale chat context, hallucinated status, or outdated task assumptions.

This database does not approve canon. It does not lock assets. It does not authorize renders or releases. It is a verified index of what is known, what is unknown, and what the current rules are.

---

## 2. Source-of-Truth Rule

| Priority | Source | Use for |
|---|---|---|
| 1 | Verified files in `D:\KAGAMI-MZ_SYNC_PUSH_V2\docs\handoff\` | Task specs, reports, route status, gate decisions |
| 2 | Verified files in `D:\workspace\ComfyUI\MIKAGE_CANON\` | Asset status, canon locks, component decisions |
| 3 | Verified files in `D:\KAGAMI-MZ_SYNC_PUSH_V2\docs\` | Pipeline rules, visual spec, master doctrine |
| 4 | USER_CONTEXT_NOT_FILE_VERIFIED | Chat-only context — never treat as verified data |
| 5 | CHUA_XAC_NHAN | Unknown — must be verified before use |

**Rule:** If a value is not confirmed by reading a file at a verified path, it is not verified. Do not act on unverified data.

---

## 3. What Belongs Where

### Memory (Agent session context only — not persisted)
- Current task instructions
- Results of file reads within this session
- Intermediate working notes

### Wiki / docs (`D:\KAGAMI-MZ_SYNC_PUSH_V2\docs\`)
- Pipeline rules: `docs/pipeline/`
- Visual spec: `docs/mikage_character_visual_spec.md`
- Master doctrine: `docs/mikage_master_doctrine.md`
- Character concept: `docs/character/`
- Agent role lock: `docs/mikage_agent_role_lock.md`

### Database (`D:\KAGAMI-MZ_SYNC_PUSH_V2\docs\handoff\` — this folder)
- Task specs (e.g. `OPS-DB-01_*.md`)
- Task reports (e.g. `*_REPORT.md`)
- Route/asset status manifests (e.g. `MIKAGE_PHASE4_STACK_MANIFEST_V2.md`)
- Operating databases (this file and companion CSVs)
- Handoff pointer: `00_LATEST_CODEX_HANDOFF.md`

### GitHub / local files (`D:\KAGAMI-MZ_SYNC_PUSH_V2\` repo root)
- Code: validators, operators, runtime
- Canon assets: `D:\workspace\ComfyUI\MIKAGE_CANON\`
- Film proofs: `film_proofs/`
- Specs: `specs/`

---

## 4. Required Preflight Checklist — Before Any Agent Action

Every agent must confirm ALL of the following before starting any task:

- [ ] Read `docs/handoff/00_LATEST_CODEX_HANDOFF.md` — confirm LATEST_COMPLETED_TASK and NEXT_SAFE_TASK
- [ ] Read `docs/handoff/MIKAGE_OPERATING_DATABASE_V1.md` — this file — confirm current rules
- [ ] Read `docs/handoff/MIKAGE_AGENT_OPERATING_RULES_V1.md` — confirm forbidden actions
- [ ] Confirm the task being executed matches the NEXT_SAFE_TASK in the handoff pointer
- [ ] Confirm required source paths are accessible — if not, report BLOCKED with exact path
- [ ] Confirm task type is allowed (no render, no video, no canon approval unless explicitly authorized)
- [ ] Confirm all output file paths are writable
- [ ] Do not use any data marked USER_CONTEXT_NOT_FILE_VERIFIED as verified fact
- [ ] Do not use any data marked CHUA_XAC_NHAN as verified fact

---

## 5. Current Pipeline State (as of 2026-05-14)

| Field | Value | Source |
|---|---|---|
| TRUE_CURRENT_PHASE | Phase 4 — Component Integration | `docs/handoff/MIKAGE_PHASE4_STACK_MANIFEST_V2.md` |
| PHASE5_ALLOWED | NO | `docs/handoff/MIKAGE_PHASE4_STACK_MANIFEST_V2.md` |
| FILM_VIDEO_ALLOWED | NO | `docs/handoff/MIKAGE_USABLE_ASSET_INVENTORY_V1.md` |
| RENDER_ALLOWED | NO | `docs/handoff/00_LATEST_CODEX_HANDOFF.md` |
| CANON_APPROVED | NO | `docs/handoff/MIKAGE_PHASE4_STACK_MANIFEST_V2.md` |
| ASSET_LOCKED | NO (character concept docs) | `docs/character/README.md` |
| BUST_BRIDGE_STATUS | SPEC_DEFINED — candidate not yet generated | `docs/handoff/MIKAGE_PHASE4_STACK_MANIFEST_V2.md` §7 |
| CANON_GATE_STATUS | SPRINT CLOSED — best 79/100 — no pass candidate | `docs/handoff/00_LATEST_CODEX_HANDOFF.md` |
| LATEST_COMPLETED_TASK | REVIEW_CHARACTER_CONCEPT_FOUNDATION_V0_1_FOR_PROMPT_LIBRARY | `docs/handoff/00_LATEST_CODEX_HANDOFF.md` |
| NEXT_SAFE_TASK | GENERATE_CHARACTER_PROMPT_TEST_SET_V0_1_FROM_LIBRARY | `docs/handoff/00_LATEST_CODEX_HANDOFF.md` |
| OPS_DB_LANE_NEXT_TASK | OPS-DB-02_POPULATE_AND_RECONCILE_MIKAGE_TRACK_CATALOG | `docs/handoff/OPS-DB-01_CREATE_MIKAGE_OPERATING_DATABASE_V1.md` |

---

## 6. Failure Rules

If any of the following conditions occur, the agent must STOP immediately and file a BLOCKED report:

- Required source path is inaccessible and data cannot be verified
- Task ID does not match a file-verified spec
- Output file cannot be written to target path
- Executing the task would require rendering, video generation, or public submission
- The task would modify a canon-locked or asset-locked file
- The task would continue a closed route

Do NOT attempt to work around a BLOCKED condition by using chat memory or assumptions.

---

## 7. Update Protocol

This database should be updated when:
- A new phase gate is passed or blocked
- A new asset is locked or rejected
- A new task lane (OPS, ASSET, FILM, etc.) is opened
- A route is officially closed
- TooLost/catalog data is verified from a file source

Update procedure:
1. Edit only the changed section
2. Add the source path as verification evidence
3. Update `docs/handoff/00_LATEST_CODEX_HANDOFF.md` to reflect the update
4. Commit and push

---

## 8. Companion Database Files

| File | Purpose |
|---|---|
| `MIKAGE_TRACK_CATALOG_DATABASE_V1.csv` | Music track release status, TooLost records, UPC, catalog numbers |
| `MIKAGE_ASSET_ROUTE_STATUS_DATABASE_V1.csv` | Visual asset and route status — locked, candidate, failed, blocked |
| `MIKAGE_AGENT_OPERATING_RULES_V1.md` | Hard operating rules for all agents |

---

*Created by OPS-DB-01 — not canon-approved — not asset-locked — update on verified change only*
