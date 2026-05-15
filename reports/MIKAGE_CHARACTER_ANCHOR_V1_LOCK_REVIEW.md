# MIKAGE_CHARACTER_ANCHOR_V1_LOCK_REVIEW

**Date:** 2026-05-15  
**Task:** `PREPARE_ANCHOR_V1_LOCK_REVIEW`  
**Latest confirmed commit:** `2dca4e5`  
**Inpaint pass commit:** `4970acd`  

---

## Review Package Status

| Field | Value |
|---|---|
| CURRENT_BEST_BASE | `docs/character/anchor_v1_candidates/P3A_R4_HELMET_INPAINT_001.png` |
| ANCHOR_V1_STATUS | `PASS_AS_USABLE_CANDIDATE` |
| FULL_BODY_R6_ALLOWED | NO |
| NEXT_SAFE_TASK | `PREPARE_ANCHOR_V1_LOCK_REVIEW` |
| CANON_LOCK_STATUS | `NOT_LOCKED` |
| ASSET_LOCK_STATUS | `NOT_LOCKED` |

This document prepares the Anchor V1 lock review package. It does not claim canon lock or asset lock.

---

## Required Artifact Verification

| Check | Result |
|---|---|
| Git status clean before starting | PASS |
| Output image exists | PASS |
| Output image path | `docs/character/anchor_v1_candidates/P3A_R4_HELMET_INPAINT_001.png` |
| Score report exists | PASS |
| Score report path | `reports/SCORE_P3A_R4_HELMET_INPAINT_ANCHOR_CANDIDATE.md` |
| Pass decision report exists | PASS |
| Pass decision report path | `reports/MIKAGE_CHARACTER_ANCHOR_V1_PASS_DECISION_REPORT.md` |
| Latest handoff points to inpaint output | PASS |
| Base replaced with R5 | NO |

---

## Score Confirmation

Source: `reports/SCORE_P3A_R4_HELMET_INPAINT_ANCHOR_CANDIDATE.md`

| Field | Value |
|---|---|
| Score | `100/100` |
| Result | PASS |
| Body changed | NO |
| Shoulders / pauldrons changed | NO |
| Sword changed | NO |
| Hair changed | NO |
| Exactly two separate helmet sensor slits | PASS |
| Visible white porcelain gap between slits | PASS |
| No eyes / mouth / nose / visor / logo | PASS |

Pixel-diff confirmation from the scoring report:

```text
allowed_slit_band=(464, 157, 540, 181)
changed_pixels=875
changed_pixels_outside_allowed_slit_band=0
```

---

## Lock Review Inputs

Use this image for lock review:

```text
docs/character/anchor_v1_candidates/P3A_R4_HELMET_INPAINT_001.png
```

Supporting reports:

- `reports/SCORE_P3A_R4_HELMET_INPAINT_ANCHOR_CANDIDATE.md`
- `reports/MIKAGE_CHARACTER_ANCHOR_V1_PASS_DECISION_REPORT.md`
- `docs/handoff/00_LATEST_CODEX_HANDOFF.md`

---

## Review Decision Boundary

Allowed next action:

```text
PREPARE_ANCHOR_V1_LOCK_REVIEW
```

Forbidden from this state:

- Do not claim canon lock.
- Do not claim asset lock.
- Do not render a new image.
- Do not run full-body R6.
- Do not replace the current best base with R5.
- Do not change the source pack or silhouette lock spec.

---

## Recommendation For Reviewer

Proceed to human lock review using `P3A_R4_HELMET_INPAINT_001.png` as the current best usable Anchor V1 candidate.

The candidate is ready for review consideration, but remains `NOT_LOCKED` until a separate explicit lock decision is made.
