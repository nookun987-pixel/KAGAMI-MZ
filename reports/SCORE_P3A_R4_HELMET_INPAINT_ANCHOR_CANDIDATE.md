# SCORE_P3A_R4_HELMET_INPAINT_ANCHOR_CANDIDATE

**Date:** 2026-05-15  
**Input base:** `docs/character/anchor_v1_candidates/P3A_R4_001_STRONG_CANDIDATE.png`  
**Output:** `docs/character/anchor_v1_candidates/P3A_R4_HELMET_INPAINT_001.png`  
**Helper mask:** `docs/character/anchor_v1_candidates/P3A_R4_HELMET_INPAINT_001_MASK.png`  
**Base used:** R4 only. R5 was not used as the base image.

---

## Git Status Result

Initial verification status before output creation:

```text
clean worktree
```

Status after output creation:

```text
?? docs/character/anchor_v1_candidates/P3A_R4_HELMET_INPAINT_001.png
?? docs/character/anchor_v1_candidates/P3A_R4_HELMET_INPAINT_001_MASK.png
```

---

## Input / Output Confirmation

| Field | Result |
|---|---|
| R4 base path exists | YES |
| R4 base path | `docs/character/anchor_v1_candidates/P3A_R4_001_STRONG_CANDIDATE.png` |
| R5 path exists | YES |
| R5 used as base | NO |
| Output path confirmed | `docs/character/anchor_v1_candidates/P3A_R4_HELMET_INPAINT_001.png` |
| Mask scope | Helmet faceplate slit bands only |

---

## Preservation Check

Pixel diff from R4 is confined to the helmet slit band:

```text
allowed_slit_band=(464, 157, 540, 181)
changed_pixels=875
changed_pixels_outside_allowed_slit_band=0
```

| Element | Changed? | Result |
|---|---:|---|
| Body | NO | PRESERVED |
| Shoulders / pauldrons | NO | PRESERVED |
| Armor outside helmet faceplate | NO | PRESERVED |
| Sword | NO | PRESERVED |
| Hair | NO | PRESERVED |
| Pose | NO | PRESERVED |
| Lighting outside slit band | NO | PRESERVED |
| Palette outside slit band | NO | PRESERVED |
| Background | NO | PRESERVED |

---

## Helmet Slit Check

| Requirement | Result |
|---|---|
| Exactly two horizontal slits | PASS |
| Slits separate, not merged | PASS |
| Visible white porcelain gap between slits | PASS |
| Void-black slit color | PASS |
| Approx. 70% helmet width | PASS |
| No eyes | PASS |
| No mouth | PASS |
| No nose | PASS |
| No visor | PASS |
| No logo | PASS |

---

## Score

**Score:** 100/100  
**Result:** PASS

R4's non-helmet strengths are preserved, and the helmet now contains exactly two separate ultra-thin horizontal void-black sensor slits with a visible porcelain gap. No canon lock or asset lock is claimed.
