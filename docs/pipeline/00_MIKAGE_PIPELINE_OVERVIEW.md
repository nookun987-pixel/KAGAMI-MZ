# 00_MIKAGE_PIPELINE_OVERVIEW

## 1. Purpose

This document defines the Mikage Canon Asset Pipeline — the structural framework governing
how Mikage assets are created, reviewed, versioned, locked, and eventually used in
production-grade cinematic output.

The pipeline was inspired by concepts from Blender Studio Pipeline, Kitsu, AYON,
Storyboarder, and OpenUSD. None of these external tools are installed or integrated.
Mikage adapts their core principles to a repo-based, documentation-first production
structure.

---

## 2. Core Principle

Mikage must stop behaving like a render-task chain and start behaving like a controlled
asset production pipeline.

A render-task chain is reactive: generate → review → fix → repeat.
A production pipeline is proactive: define → gate → build → validate → publish → use.

Every asset has a defined status. Every status change requires evidence. Every generation
attempt requires an approved execution packet. Every output that does not match its packet
is FAIL_DO_NOT_USE.

---

## 3. Market Reference Adaptations

### 3.1 Blender Studio Pipeline → Repo-Level Production Structure

Blender Studio uses a structured repository with clearly separated asset libraries,
sequence libraries, and production data. Mikage adapts this as:

| Blender Studio concept | Mikage adaptation |
|---|---|
| Asset library (characters, props, environments) | `docs/pipeline/01_CANON_ASSET_REGISTRY.md` — all canon assets in one authoritative registry |
| Sequence library | Phase-based folder structure (`08_CHARACTER_REVIEW_CANDIDATES`, `10_COMPONENT_CANDIDATE_SET_V1`, `11_BUST_BRIDGE_CANDIDATES_V1`) |
| Production data (shots, edits) | `docs/handoff/` — handoff chain as production data |
| Publish step | Asset lock + canon approval (requires human gate) |
| Asset versioning | `_V1`, `_V2`, `_V3` naming convention in filenames |
| Library override | TEMP_REFERENCE status — used in workflow but not locked |

### 3.2 Kitsu → Asset / Task / Status Tracking

Kitsu tracks tasks (models, rigging, shading, animation) with per-task statuses.
Mikage adapts this as:

| Kitsu concept | Mikage adaptation |
|---|---|
| Asset entity | Each entry in `01_CANON_ASSET_REGISTRY.md` |
| Task types (modeling, shading, etc.) | ASSET-BUILD, ASSET-RESET, VIS, CTRL task prefixes |
| Status per task | LOCKED_CANON / TEMP_REFERENCE / REVIEW_CANDIDATE / FAILED_DO_NOT_USE / MISSING_REQUIRED / DEPRECATED / UNKNOWN_NEEDS_REVIEW |
| Playlist / review session | Quick-Pass Gate in execution packets |
| Retake / revision | Repair task (ASSET-BUILD-0N repair) before re-run |

### 3.3 AYON → Publish / Version / Review Gate

AYON enforces that only published, versioned outputs can move downstream.
Mikage adapts this as:

| AYON concept | Mikage adaptation |
|---|---|
| Publish | Canon approval + asset lock (human gate required) |
| Version | `_V1`, `_V2` in filenames and manifest entries |
| Workfile | Execution script (MIKAGE_BUST_BRIDGE_EXECUTE_V2.py) |
| Review | Quick-Pass Gate → evidence package → formal evaluation |
| Loader | Allowed-use field in asset registry — defines which downstream stages may use the asset |
| Subset / product type | Stack slot in MIKAGE_PHASE4_STACK_MANIFEST_V2 |

### 3.4 Storyboarder → Storyboard / Animatic Before Cinematic

Storyboarder enforces that a visual story structure exists before animation begins.
Mikage adapts this as:

| Storyboarder concept | Mikage adaptation |
|---|---|
| Shot list | Defined only after storyboard phase (see `07_STORYBOARD_ANIMATIC_RULES.md`) |
| Animatic | Required before any cinematic production begins |
| Board / panel | Mikage storyboard panel = character identity anchors + environment anchors |
| Export to production | Only after storyboard + animatic review PASS |

Rule: No cinematic production, no shotlist, no film plate until storyboard and animatic
gates have passed. See `08_CINEMATIC_PRODUCTION_READINESS.md`.

### 3.5 OpenUSD → Parked as Future Scene Interchange Layer

OpenUSD provides a scene graph interchange format for complex multi-asset scenes.
Mikage parks this concept for a future phase:

| OpenUSD concept | Future Mikage use (NOT ACTIVE) |
|---|---|
| Stage / layer | Scene assembly from locked canon assets |
| Prim / asset reference | Canon-locked asset paths as USD references |
| Variant set | Character variant management (helmet variants, material variants) |
| Hydra renderer | Future Blender / RenderMan / Arnold hookup |

**Current status: NOT ACTIVE. No USD files are created or referenced in the current pipeline.**

---

## 4. Pipeline Phases

| Phase | Name | Entry condition | Exit condition |
|---|---|---|---|
| Phase 1 | Concept | — | Character visual spec documented |
| Phase 2 | Identity Anchors | Phase 1 complete | Key visual V4 canon approved |
| Phase 3 | 3D Source Build | Phase 2 complete | Helmet front + side 3D sources canon approved |
| Phase 4 | Component Integration | Phase 3 complete | All required component slots filled and accepted |
| Phase 5 | Upper-Body Consistency Review | Phase 4 all slots filled | Upper-body reference set review PASS |
| Phase 6 | Storyboard / Animatic | Phase 5 complete | Storyboard and animatic approved |
| Phase 7 | Cinematic Production | Phase 6 complete | All cinematic readiness gates PASS |

**Current phase: Phase 4.  Phase 5 NOT ALLOWED.**

---

## 5. Pipeline Governance Rules (Summary)

Full rules in `02_ASSET_LIFECYCLE_RULES.md`, `04_EXECUTION_GATE_RULES.md`,
`05_REVIEW_QA_RULES.md`.

1. **No asset moves downstream without a status change supported by evidence.**
2. **No generation without an approved execution packet.**
3. **No Browser Run button for production routes.**
4. **No output accepted unless filename, directory, resolution, and batch size match the packet.**
5. **No retry without a repair task after fail.**
6. **No canon approval without human gate.**
7. **No Phase 5 until all Phase 4 slots are filled and accepted.**
8. **No cinematic production until storyboard and animatic gates pass.**
9. **One next safe task at a time. No multi-task parallel opens.**

---

## 6. Document Index

| Document | Purpose |
|---|---|
| `00_MIKAGE_PIPELINE_OVERVIEW.md` | This file — framework and market reference adaptations |
| `01_CANON_ASSET_REGISTRY.md` | Authoritative registry of all Mikage canon and candidate assets |
| `02_ASSET_LIFECYCLE_RULES.md` | Status definitions, lifecycle transitions, evidence requirements |
| `03_ASSET_BUILD_ORDER.md` | Ordered build sequence for all required asset slots |
| `04_EXECUTION_GATE_RULES.md` | Rules governing when and how generation may be submitted |
| `05_REVIEW_QA_RULES.md` | Quick-Pass Gate, evidence package, formal evaluation rules |
| `06_CLOUD_GPU_PACKET_STANDARD.md` | Format standard for cloud GPU execution packets |
| `07_STORYBOARD_ANIMATIC_RULES.md` | Rules governing storyboard and animatic before cinematic |
| `08_CINEMATIC_PRODUCTION_READINESS.md` | Gates required before any cinematic production begins |
