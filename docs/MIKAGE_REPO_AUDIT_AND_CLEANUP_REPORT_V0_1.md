# MIKAGE REPO — AUDIT & CLEANUP REPORT (FOR OPERATOR APPROVAL)

**Status:** `AUDIT — NOTHING EXECUTED` · created 2026-06-27
**Scope:** `D:\KAGAMI-MZ_SYNC_PUSH_V2` only.
**Rule for this report:** nothing deleted, nothing moved, no git action. Every action below is a
**recommendation** the operator approves (or rejects) first. Classifications were made from
filenames + the governance/index files actually read this session; groups not opened file-by-file
are marked `UNCONFIRMED — confirm before action`.

Companion file: `00_START_HERE_SOURCE_OF_TRUTH.md` (the single read-first index this audit produced).

---

## 1. THE CORE PROBLEM (why every session feels like re-explaining)

The repo holds **two different projects layered on top of each other**, plus **three competing
"read me first / source of truth" systems** that disagree with each other:

| System | Describes | Verdict |
|---|---|---|
| `CLAUDE.md` + `docs/handoff/00_LATEST_CODEX_HANDOFF.md` + `MIKAGE_OPERATOR_MEMORY_COMPACT_READ_FIRST_V2.md` | Current studio: music, public, character rig, business | **AUTHORITATIVE (current)** |
| `docs/ai_handoff/` pack (`SOURCE_OF_TRUTH.md`, `SYSTEM_MAP.md`, `ACTIVE_FILES_INDEX.md`, …) | Old automated image-gen runtime (hub/modules/Drive-queue/Colab) | **LEGACY** — and it *wrongly* labels `docs/handoff` as "untrusted/legacy" |
| Scattered root status files (`P0/P7/P8/RAG/VERTEX/SYSTEM/ARCHITECTURE/IMAGE/VM/MODEL`) | Same old runtime's build/test history | **LEGACY clutter** |

Result: a fresh agent that opens `docs/ai_handoff/SOURCE_OF_TRUTH.md` is told the live studio docs
are untrusted — the exact reason context gets re-litigated each session. **Fix = the new
`00_START_HERE` index is the one entry point; the legacy systems get archived (below).**

Also found: a rich, **already-locked lore/narrative system** lives in `docs/handoff/`
(`MIKAGE_NARRATIVE_CORE_LOCK_V0_1`, character/world/transmission outlines). Any future "develop
lore" work must extend these — not start fresh. (The fanpage AD brief drafted earlier this session
should be reconciled against `MIKAGE_NARRATIVE_CORE_LOCK_V0_1` before publishing.)

---

## 2. HIGH-CONFIDENCE DUPLICATE / SUPERSEDED PAIRS (easy wins)

Recommend: keep the newer/locked one as canonical; archive the other (don't delete outright).

| Keep (canonical) | Archive (superseded) | Reason |
|---|---|---|
| `P0_FORENSIC_REPORT_FINAL.md` | `P0_FORENSIC_REPORT.md` | `_FINAL` supersedes draft |
| `RAG_LIVE_VALIDATION_FINAL.md` | `RAG_LIVE_VALIDATION_REPORT.md` | final supersedes report |
| `SYSTEM_AUDIT_CURRENT_STATE.md` *(or merge)* | `AUDIT_SYSTEM_STATE.md` | near-duplicate names/topic |
| `docs/handoff/MIKAGE_VOICE_PROFILE_LOCK_V0_1.md` | `docs/handoff/MIKAGE_VOICE_PROFILE_PROPOSAL_V0_1.md` | LOCK supersedes proposal |
| `docs/handoff/MIKAGE_NARRATIVE_CORE_LOCK_V0_1.md` | `docs/handoff/MIKAGE_NARRATIVE_CORE_GAP_PROPOSAL_V0_1.md` | LOCK supersedes proposal (keep proposal as sign-off record only) |
| `docs/handoff/MIKAGE_PHASE4_STACK_MANIFEST_V2.md` | `docs/handoff/MIKAGE_PHASE4_STACK_MANIFEST_V1.md` | V2 supersedes V1 (both legacy asset-gen) |
| latest `BRIEF_COMMANDER_LYRE_…_ATTEMPT_006…` | `…ATTEMPT_004` variants (×2) + older | superseded verification attempts |
| one read-first memory file | `docs/handoff/MIKAGE_SINGLE_OPERATOR_MEMORY.md` vs `…OPERATOR_MEMORY_COMPACT_READ_FIRST_V2.md` | two "operator memory" files — pick V2, fold the other in |

`UNCONFIRMED` — confirm each pair's content before archiving the loser.

## 3. PRIOR CLEANUP ATTEMPTS ALREADY IN REPO (consolidate, don't add a 4th)
- `KEEP_DELETE_MERGE_PLAN.md` (root)
- `CLEANUP_RESTRUCTURE_REPORT.md` (root)
- `FILE_ROLE_MAP.md` (root)
- `SYSTEM_LEDGER.md` (root)

These are earlier tidy-up passes that were never finished. Recommend: treat **this report +
`00_START_HERE`** as the consolidation of all four, then archive the four once you agree.

---

## 4. LEGACY GROUPS (the old image-gen runtime) — ARCHIVE CANDIDATES

Recommend moving as ONE batch into a single `_archive_legacy_runtime/` folder (operator-run,
via `git mv` to preserve history). **Do not delete.** Confirm nothing current imports them first.

**4a. Root status/lock/report files (~55+ files), patterns:**
`P0_*`, `P7_*`, `P8_*`, `RAG_*`, `REAL_VERTEX_*`, `VERTEX_*`, `IMAGE_*`, `MODEL_*`, `VM_*`,
`SYSTEM_*`, `ARCHITECTURE_*`, `STRICT_IMAGE_LOOP_SPEC.md`, `STORAGE_POLICY_LOCK.md`,
`SMOKE_TEST.md`, `RUNTIME_MAP.md`, `SAFE_*`, `EXECUTION_CONTRACT_LOCK_COMPLETE.md`,
`DRIVE_BRIDGE_CONTRACT.md`, `ENV_SPEC.md`, `DO_NOT_BREAK.md`, `ACTIVE_ENTRYPOINTS.md`,
`COMMIT_PLAN_BASELINE.md`, `API_AUDIT_REPORT.md`, `IDENTITY_LOCK_STATUS.md`, etc.

**4b. Runtime code directories (old stack):**
`MIKAGE/`, `control_plane/`, `control_core/`, `execution/`, `evaluation/`, `critic/`, `memory/`,
`runtime/`, `deploy/`, `lanes/`, plus existing `archive_legacy/`.

**4c. The stale SOT pack:** `docs/ai_handoff/` (entire folder) — superseded by `00_START_HERE`.

**4d. Legacy asset-gen handoff chains inside `docs/handoff/`** (these clutter the live handoff folder):
`ASSET-BUILD-0x_*`, `ASSET-RESET-0x_*`, `PHASE4_*`, `PHASE5_*`, `FILM-RESET-*`,
`*_RUNPOD_COMFYUI_EXECUTION_PACKET_*`, `*_VERIFICATION_REPORT_ATTEMPT_*`, old `SESSION_RESUME_NOTE_2026*`.
→ Recommend a sub-folder `docs/handoff/_archive/` rather than the runtime archive, since they're
studio-history (not runtime code).

`UNCONFIRMED` — 4b in particular may still be referenced by `D:\public_engine` or a run script.
Verify imports/entrypoints before moving.

---

## 5. DO **NOT** TOUCH (active — must stay in place)
- `CLAUDE.md`, `00_START_HERE_SOURCE_OF_TRUTH.md`
- `.mikage/` (hard-gate tasks + validators) — moving breaks Codex gates
- `docs/handoff/00_LATEST_CODEX_HANDOFF.md`, `MIKAGE_OPERATOR_MEMORY_COMPACT_READ_FIRST_V2.md`,
  `MIKAGE_RELEASE_REGISTRY.md`, `MIKAGE_AGENT_GOVERNANCE_LAYER_V1.md`, the narrative/lore lock + outlines,
  `spotify_canvas/`, `mv/`, `revenue/`
- `docs/MIKAGE_SESSION_CHECKLIST.md`, `docs/MIKAGE_SESSION_LESSONS.md`, `docs/mikage_character_visual_spec.md`
- `docs/character/` (concept + briefs)
- `production/character/` (rig pipeline) — keep; optionally archive only old proof versions (see §6)
- `design_system/mikage-cine-color-contract.md`

---

## 6. PROPOSED CLEAN STRUCTURE (target)
```
KAGAMI-MZ_SYNC_PUSH_V2/
├─ CLAUDE.md                          # durable rules
├─ 00_START_HERE_SOURCE_OF_TRUTH.md   # the one entry point
├─ .mikage/                           # hard gate (unchanged)
├─ docs/
│  ├─ handoff/                        # CURRENT studio handoff + lore canon + release registry
│  │  └─ _archive/                    # old asset-gen/phase4-5/runpod chains (§4d)
│  ├─ character/                      # concept + AD briefs
│  ├─ MIKAGE_SESSION_CHECKLIST.md / _LESSONS.md
│  └─ MIKAGE_REPO_AUDIT_AND_CLEANUP_REPORT_V0_1.md   # this file
├─ production/character/              # rig pipeline (history kept)
│  └─ reviews/_archive/               # optional: pre-V1 proof versions
├─ design_system/
└─ _archive_legacy_runtime/           # old image-gen stack: MIKAGE/, control_plane/, …, docs/ai_handoff/, root P*/RAG*/VERTEX* (§4a–4c)
```

## 7. RECOMMENDED EXECUTION ORDER (when you approve)
1. Confirm §4b runtime dirs are not imported by anything live (incl. `D:\public_engine`).
2. `git mv` §4 groups into `_archive_legacy_runtime/` and `docs/handoff/_archive/` — one commit, history preserved.
3. Archive the §2 superseded losers + §3 old cleanup files.
4. Delete `docs/ai_handoff/SOURCE_OF_TRUTH.md`'s authority by archiving the folder (it actively misleads).
5. Operator commits + pushes. Update the §2 map in `00_START_HERE` if any path changed.

> Assistant will not run any of the above without explicit per-batch approval. Reply with which
> batches to proceed on (e.g. "đồng ý §2 + §4a", or "chỉ §4c trước").

---

## 8. OPEN QUESTIONS FOR OPERATOR
1. Is the `MIKAGE/` hub runtime (§4b) **dead**, or still used by `D:\public_engine`? (decides whether to archive or keep)
2. Archive depth for `production/character/reviews/` — keep full version history in place, or move pre-V1 proofs to `_archive/`?
3. OK to delete (not just archive) the clearly-dead duplicates in §2, or archive everything to be safe?

*Audit only. No file was created, moved, or deleted except this report and the `00_START_HERE` index.*
