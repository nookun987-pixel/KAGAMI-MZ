# MIKAGE_CHARACTER_ANCHOR_V1_LOCK_DECISION

**Date:** 2026-05-15  
**Task:** `PREPARE_ANCHOR_V1_LOCK_DECISION_AFTER_USER_APPROVAL`  
**Confirmed HEAD:** `a3f0e65`  
**User approval:** APPROVED to proceed with Anchor V1 lock decision  

---

## Decision Summary

| Field | Value |
|---|---|
| ANCHOR_V1_LOCK_DECISION | APPROVED |
| CURRENT_BEST_BASE | `docs/character/anchor_v1_candidates/P3A_R4_HELMET_INPAINT_001.png` |
| ANCHOR_V1_STATUS | `PASS_AS_USABLE_CANDIDATE` |
| SCORE | `100/100 PASS` |
| FULL_BODY_R6_ALLOWED | NO |
| CANON_LOCK_STATUS | `ANCHOR_V1_LOCKED_ONLY` |
| ASSET_LOCK_STATUS | `NOT_LOCKED` |

---

## Approved Anchor V1 Base

```text
docs/character/anchor_v1_candidates/P3A_R4_HELMET_INPAINT_001.png
```

This image is approved as the locked Anchor V1 reference candidate.

---

## Evidence

Source reports:

- `reports/SCORE_P3A_R4_HELMET_INPAINT_ANCHOR_CANDIDATE.md`
- `reports/MIKAGE_CHARACTER_ANCHOR_V1_PASS_DECISION_REPORT.md`
- `reports/MIKAGE_CHARACTER_ANCHOR_V1_LOCK_REVIEW.md`

Confirmed score and preservation:

- Score is `100/100 PASS`.
- Body is preserved.
- Shoulders / pauldrons are preserved.
- Sword is preserved.
- Hair is preserved.
- Helmet has exactly two separate ultra-thin horizontal void-black sensor slits.
- Visible white porcelain gap exists between slits.
- No eyes, mouth, nose, visor, or logo were added.

---

## Decision Boundary

This is an Anchor V1 lock decision only.

It does not claim final canon character asset lock. `ASSET_LOCK_STATUS` remains `NOT_LOCKED` until a separate asset lock task is created and approved.

From this decision state:

- Do not render new images.
- Do not run full-body R6.
- Do not replace the current best base with R5.
- Do not change source pack or silhouette lock spec.

---

## Result

Anchor V1 lock decision is approved for `docs/character/anchor_v1_candidates/P3A_R4_HELMET_INPAINT_001.png`.

Canon lock status is limited to `ANCHOR_V1_LOCKED_ONLY`; asset lock remains `NOT_LOCKED`.
