# 00_LATEST_CODEX_HANDOFF

## 1. Latest Completed Task

`MIKAGE_CHARACTER_ANCHOR_V1_R4_HELMET_ONLY_INPAINT_PREP` - complete.

## 2. Latest Result

R4 remains the best body/base candidate: `docs/character/anchor_v1_candidates/P3A_R4_001_STRONG_CANDIDATE.png`.

R5 is not selected as Anchor V1. It improves helmet marks only marginally and still does not achieve exactly two clean horizontal sensor slits. It also regresses R4's strong pauldron span from roughly 3.0x-ish down to roughly 2.0-2.2x.

The next correction path is helmet-only inpaint on R4. Do not run another full-body generation.

## 3. Active Lane

Character lane - Anchor V1 helmet-only correction.

## 4. Latest Report Paths

- `reports/MIKAGE_CHARACTER_ANCHOR_V1_R5_SCORE_REPORT.md`
- `reports/MIKAGE_CHARACTER_ANCHOR_V1_R4_HELMET_INPAINT_PREP.md`
- `reports/MIKAGE_NEXT_SAFE_ACTION_V1.md`

## 5. Files Created Or Modified

- Created `reports/MIKAGE_CHARACTER_ANCHOR_V1_R4_HELMET_INPAINT_PREP.md`
- Updated `reports/MIKAGE_CHARACTER_ANCHOR_V1_R5_SCORE_REPORT.md`
- Updated `reports/MIKAGE_NEXT_SAFE_ACTION_V1.md`
- Updated `docs/handoff/00_LATEST_CODEX_HANDOFF.md`

## 6. Gate Status

| Field | Value |
|---|---|
| CANON_LOCKED | NO |
| ASSET_LOCKED | NO |
| PUBLIC_READY | NO |
| ANCHOR_STATUS | REVISE - no Anchor V1 locked |
| CURRENT_BEST_BASE | `P3A_R4_001_STRONG_CANDIDATE.png` |
| R4_STATUS | Best body/base candidate; preserve completely except helmet faceplate |
| R5_STATUS | Not selected; marginal helmet improvement, pauldron regression |
| NEXT_SAFE_TASK | `MIKAGE_CHARACTER_ANCHOR_V1_R4_HELMET_ONLY_INPAINT` |

## 7. Next Safe Task

```
MIKAGE_CHARACTER_ANCHOR_V1_R4_HELMET_ONLY_INPAINT
```

Base image:

```
docs/character/anchor_v1_candidates/P3A_R4_001_STRONG_CANDIDATE.png
```

Edit scope: helmet face area only.

Required correction: exactly two separate ultra-thin horizontal void-black sensor slits, spanning about 70% of helmet width, with a visible white porcelain gap between slits.

Manual mask instruction:

```
Mask only the central helmet faceplate area where the two slits should appear.
Do not mask hair, neck, shoulders, pauldrons, body, sword, or background.
```

Preserve: pauldrons, body, armor, sword, hair, pose, lighting, palette, and background.

Reject if the result changes body, shoulders, sword, or hair; leaves the helmet blank; creates one slit; creates a merged visor; or adds a mouth-like/logo-like mark.

## 8. Forbidden

- Do not render agent-side.
- Do not generate a new full-body R6.
- Do not overwrite R4.
- Do not approve canon.
- Do not asset-lock anything.
- Do not change source pack or silhouette lock spec.
