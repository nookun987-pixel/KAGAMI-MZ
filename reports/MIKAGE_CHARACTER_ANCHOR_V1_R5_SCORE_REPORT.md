# MIKAGE_CHARACTER_ANCHOR_V1_R5_SCORE_REPORT

**Date:** 2026-05-15  
**Candidate:** `docs/character/anchor_v1_candidates/P3A_R5_001.png`  
**Reference base:** `docs/character/anchor_v1_candidates/P3A_R4_001_STRONG_CANDIDATE.png`  
**Status:** REVISE - below anchor pass threshold  

---

## Decision

| Field | Value |
|---|---|
| TOTAL_SCORE | Below anchor pass threshold |
| STATUS | REVISE |
| ANCHOR_SELECTED | NO |
| LOCK_ALLOWED | NO |
| CURRENT_BEST_BASE | `P3A_R4_001_STRONG_CANDIDATE.png` |
| NEXT_SAFE_TASK | `MIKAGE_CHARACTER_ANCHOR_V1_R4_HELMET_ONLY_INPAINT` |

R5 improves the helmet marks marginally over R4, but it does not achieve the required clean two-slit helmet specification. The face area remains ambiguous and does not show exactly two separate ultra-thin horizontal void-black sensor slits with a clear porcelain gap.

R5 also regresses the shoulder silhouette. R4's pauldrons reached the strongest span in the current set, roughly 3.0x helmet width or better. R5 drops back to roughly 2.0-2.2x, which loses the R4 breakthrough.

Because the helmet improvement is incomplete and the pauldrons regress, R5 is not selected as Anchor V1. R4 remains the best body/base candidate and should be preserved completely for a helmet-only correction pass.

---

## R5 vs R4

| Element | R4 | R5 | Decision |
|---|---|---|---|
| Helmet slits | Blank helmet, no slits | Marginal/faint marks, still not clean two-slit spec | R5 improves only slightly |
| Pauldrons | Strongest result, about 3.0x-ish span | Regressed to about 2.0-2.2x | R4 is superior |
| Body/armor | Strong full-body anchor composition | Maintained but not improved | Preserve R4 |
| Sword | Strong rectangular slab | Maintained | Preserve R4 |
| Hair | Strong black mass | Maintained | Preserve R4 |
| Palette | Correct white/black/violet palette | Maintained | Preserve R4 |

---

## Required Follow-Up

Do not run another full-body generation from this state. The next safe correction path is helmet-only inpaint using R4 as the base.

Required edit: add exactly two separate ultra-thin horizontal void-black sensor slits to the helmet face area only.

Preserve R4 completely outside the helmet face area: pauldrons, body, armor, sword, hair, pose, lighting, palette, and background.

---

*Generated: 2026-05-15 | Task: MIKAGE_CHARACTER_ANCHOR_V1_R5_SCORE_REPORT | Decision: R5 not selected; R4 remains best base for helmet-only correction*
