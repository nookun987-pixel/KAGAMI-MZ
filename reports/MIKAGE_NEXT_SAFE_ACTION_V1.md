# MIKAGE_NEXT_SAFE_ACTION_V1

**Updated:** 2026-05-15 - post R5 review and R4 helmet-only inpaint decision

---

## Current Pipeline State

| Gate | Status |
|---|---|
| CANON_LOCKED | NO |
| ASSET_LOCKED | NO |
| ANCHOR_STATUS | REVISE - no Anchor V1 locked |
| CURRENT_BEST_BASE | `docs/character/anchor_v1_candidates/P3A_R4_001_STRONG_CANDIDATE.png` |
| R4_STATUS | Best body/base candidate; strongest pauldrons, sword, hair, palette, and full-body anchor composition |
| R4_BLOCKER | Helmet slits absent |
| R5_STATUS | Not selected; helmet marks improved only marginally and pauldrons regressed |
| NEXT_SAFE_TASK | `MIKAGE_CHARACTER_ANCHOR_V1_R4_HELMET_ONLY_INPAINT` |

---

## Next Safe Task

```
MIKAGE_CHARACTER_ANCHOR_V1_R4_HELMET_ONLY_INPAINT
```

Use `docs/character/anchor_v1_candidates/P3A_R4_001_STRONG_CANDIDATE.png` as the base image.

Edit only the central helmet face area. Add exactly two separate ultra-thin horizontal void-black sensor slits spanning about 70% of the helmet width, with a visible white porcelain gap between them.

Preserve all non-helmet-face areas from R4: pauldrons, body, armor, sword, hair, pose, lighting, palette, and background.

Manual mask instruction:

```
Mask only the central helmet faceplate area where the two slits should appear.
Do not mask hair, neck, shoulders, pauldrons, body, sword, or background.
```

---

## Reject Conditions

- body changes
- shoulder changes
- sword changes
- hair changes
- blank helmet
- one slit
- merged visor
- mouth-like mark
- logo-like mark
- eyes, mouth, nose, visor, or logo added to helmet

---

## Forbidden

- Do not run another full-body generation.
- Do not point to R6 full-body generation.
- Do not overwrite R4.
- Do not claim Anchor V1 locked.
- Do not claim final canon.
- Do not change source pack or silhouette lock spec.

---

*MIKAGE_NEXT_SAFE_ACTION_V1 - updated 2026-05-15 - R4 helmet-only inpaint is the next safe task*
