# MIKAGE_CHARACTER_ANCHOR_V1_PASS_DECISION_REPORT

**Date:** 2026-05-15  
**Confirmed pushed state:** `4970acd`  
**Task:** `MIKAGE_CHARACTER_ANCHOR_V1_PASS_DECISION_REPORT`  

---

## Confirmed Artifacts

| Artifact | Status |
|---|---|
| R4 helmet-only inpaint output | EXISTS |
| Output path | `docs/character/anchor_v1_candidates/P3A_R4_HELMET_INPAINT_001.png` |
| Score report | EXISTS |
| Score report path | `reports/SCORE_P3A_R4_HELMET_INPAINT_ANCHOR_CANDIDATE.md` |
| Score | `100/100` |
| Result | `PASS` |

Commit `4970acd` is the confirmed pushed state for the pass output and score report.

---

## Verification Summary

The score report confirms:

- body preserved
- shoulders / pauldrons preserved
- sword preserved
- hair preserved
- helmet has exactly two separate horizontal sensor slits
- slits are void-black
- visible white porcelain gap exists between the slits
- no eyes, mouth, nose, visor, or logo added
- no canon lock claimed
- no asset lock claimed

Pixel-diff verification from the scoring report:

```text
allowed_slit_band=(464, 157, 540, 181)
changed_pixels=875
changed_pixels_outside_allowed_slit_band=0
```

---

## Decision Fields

| Field | Value |
|---|---|
| CURRENT_BEST_BASE | `docs/character/anchor_v1_candidates/P3A_R4_HELMET_INPAINT_001.png` |
| ANCHOR_V1_STATUS | `PASS_AS_USABLE_CANDIDATE` |
| FULL_BODY_R6_ALLOWED | NO |
| NEXT_SAFE_TASK | `PREPARE_ANCHOR_V1_LOCK_REVIEW` |
| CANON_LOCK_STATUS | `NOT_LOCKED` |
| ASSET_LOCK_STATUS | `NOT_LOCKED` |

---

## Decision

`docs/character/anchor_v1_candidates/P3A_R4_HELMET_INPAINT_001.png` is the current best base and passes as a usable Anchor V1 candidate.

This is not a canon lock and not an asset lock. The next safe task is `PREPARE_ANCHOR_V1_LOCK_REVIEW`.

Full-body R6 generation is not allowed from this decision state.
