# 05_REVIEW_QA_RULES

## 1. Purpose

Defines the review and QA process that every candidate output must pass before it
can advance from REVIEW_CANDIDATE to TEMP_REFERENCE or LOCKED_CANON. No output skips
review. No output self-certifies. No output is assumed compliant without explicit gate results.

---

## 2. Two-Stage Review Process

Every candidate passes through two stages in order:

```
Stage 1 — Quick-Pass Gate (immediate, per-output)
      │
      ├─ FAIL ──► FAILED_DO_NOT_USE (stop — do not proceed to Stage 2)
      │
      └─ PASS ──► Stage 2 — Formal Evaluation (evidence package + anchor comparison)
                        │
                        ├─ INCLUDE_AS_PHASE4_REFERENCE ──► TEMP_REFERENCE
                        ├─ HOLD_FOR_REWORK ──────────────► FAILED_DO_NOT_USE (may retry with repair)
                        └─ REJECT_DO_NOT_USE ─────────────► FAILED_DO_NOT_USE (permanent)
```

---

## 3. Stage 1 — Quick-Pass Gate

Applied immediately to every output after generation, before any further review.
All 7 checks must be true. A single FAIL disqualifies the output.

| Check | Pass condition | Fail action |
|---|---|---|
| 1. Faceplate sealed | No eyes, nose, mouth, skin, open visor, cracked faceplate visible in any area | DISCARD output |
| 2. Helmet front silhouette | Consistent with `MIKAGE_HELMET_FRONT_VIEW_3D_SOURCE_V1_ORTHO` | DISCARD output |
| 3. Helmet side / volume | Consistent with `MIKAGE_VOLUME_FIRST_3D_HELMET_SIDE_V1_ORTHO` | DISCARD output |
| 4. Material — B4C porcelain | Matte, no gloss, no chrome, no metallic sheen | DISCARD output |
| 5. Graphene underlayer visible | Black underlayer visible through at least one panel gap | DISCARD output |
| 6. Background | Dark and neutral — no scene, no environment, no action staging | DISCARD output |
| 7. No drift | No anime / fashion / glamour drift visible | DISCARD output |

After Quick-Pass Gate:
- PASS → prepare evidence package and proceed to Stage 2
- FAIL → mark output FAILED_DO_NOT_USE, record which check(s) failed, note in run log

If no outputs from a batch pass the Quick-Pass Gate:
- Halt generation.
- Create fail report.
- Create repair task before next attempt.

---

## 4. Stage 2 — Formal Evaluation (Evidence Package + Anchor Comparison)

### 4.1 Evidence Package (required before Stage 2)

The following must exist before formal evaluation begins:

```
[ ] Candidate image saved at correct path:
    D:\workspace\ComfyUI\MIKAGE_CANON\11_BUST_BRIDGE_CANDIDATES_V1\
    MIKAGE_BUST_BRIDGE_CAND_[XX]_REVIEW_CANDIDATE_[DATE].png

[ ] Review report saved at:
    D:\workspace\ComfyUI\MIKAGE_CANON\11_BUST_BRIDGE_CANDIDATES_V1\
    MIKAGE_BUST_BRIDGE_CAND_[XX]_REVIEW_REPORT.md

[ ] Review report fields complete:
    - Candidate path (absolute)
    - Generation method, model, seed, steps, CFG, denoise, resolution, date, workflow file
    - Anchor comparison results (all 9 checks)
    - Proposed label
    - Forbidden uses confirmed
    - Excluded assets confirmed not used as inputs
```

### 4.2 Anchor Comparison Checklist (9 checks)

| Check | Anchor reference | Pass condition |
|---|---|---|
| Helmet front geometry match | `MIKAGE_HELMET_FRONT_VIEW_3D_SOURCE_V1_ORTHO` | Consistent silhouette and proportion |
| Helmet side volume match | `MIKAGE_VOLUME_FIRST_3D_HELMET_SIDE_V1_ORTHO` | Consistent depth and side form |
| Faceplate cleanness | `MIKAGE_COMP_01A_HELMET_FACEPLATE_CLEAN_PASS` | No drift from clean faceplate standard |
| B4C porcelain material | `MIKAGE_COMP_03A_B4C_PORCELAIN_PANEL_GAP_PASS` | Matte finish, panel gap geometry consistent |
| Graphene underlayer | `MIKAGE_COMP_04A_GRAPHENE_UNDERLAYER_HEX_GAP_PASS` | Underlayer visible through gaps |
| Identity continuity | `MIKAGE_UNIFIED_KEY_VISUAL_V4_FROM_CLEAN_SOURCES_00001_` | No drift from key visual V4 |
| Faceless standard | All identity anchors | No human facial anatomy visible anywhere |
| Anime / fashion drift | All identity anchors | ABSENT |
| Material cleanness | B4C porcelain reference | No gloss, chrome, or costume drift |

### 4.3 Allowed Outcome Labels

| Label | Meaning | Next status |
|---|---|---|
| `INCLUDE_AS_PHASE4_REFERENCE` | Passes all checks; added to stack as bust bridge slot | TEMP_REFERENCE |
| `HOLD_FOR_REWORK` | Addressable issues; deferred; not added to stack | FAILED_DO_NOT_USE (may re-attempt with repair) |
| `REJECT_DO_NOT_USE` | Fails constraints; permanently excluded | FAILED_DO_NOT_USE (permanent) |

### 4.4 Forbidden Labels

These labels must never be assigned to any output at any stage:
- `CANON_APPROVED`
- `ASSET_LOCKED`
- `PRODUCTION_READY`
- `PHASE_5_READY`
- `RENDER_READY`
- `FILM_READY`
- `VIDEO_READY`
- `PUBLIC_READY`

`INCLUDE_AS_PHASE4_REFERENCE` does not mean canon approved, asset locked, or Phase 5 permitted.

---

## 5. Post-Acceptance — What TEMP_REFERENCE Enables

When a candidate receives `INCLUDE_AS_PHASE4_REFERENCE`:

| Action | Who | Condition |
|---|---|---|
| Update Phase 4 stack manifest (bust bridge slot: MISSING → INCLUDE_AS_PHASE4_REFERENCE) | Claude | Immediate |
| Update asset registry (E-01 → TEMP_REFERENCE) | Claude | Immediate |
| Execute ASSET-RESET-15 — Define body continuity constraint spec | Claude (no-render) | Requires bust bridge accepted |
| Phase 5 readiness re-review gate | Claude + human | Requires updated manifest + bust bridge accepted |
| Phase 5 proposed | Human decision only | Requires re-review PASS |

---

## 6. QA Log Requirements

Every generation session must produce a QA log entry documenting:

```
Date:
Script:
Packet version:
Seed(s):
Batch size:
Output count:
Quick-Pass Gate results per output:
  Output 01: [checks 1-7: PASS/FAIL] → overall: PASS / FAILED_DO_NOT_USE
  Output 02: ...
  Output 03: ...
  Output 04: ...
Outputs advancing to Stage 2: [list or NONE]
Stage 2 label (if applicable):
Next action:
```

This log may be included in the run report or as a separate QA document.

---

## 7. Review Independence

Claude may execute Stage 2 formal evaluation mechanically (checking fields, tracing
evidence, assigning labels from the allowed set). However:

- Canon approval is a human gate. Claude does not approve canon.
- Asset lock is a human gate. Claude does not lock assets.
- Phase 5 start is a human decision. Claude does not start phases.

Claude confirms whether gates are met and reports status. Human decides whether to
advance.
