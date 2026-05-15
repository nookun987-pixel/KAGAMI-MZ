# MIKAGE_CHARACTER_ANCHOR_V1_ASSET_REGISTRY_ENTRY

**Date:** 2026-05-15  
**Task:** `PREPARE_CHARACTER_ANCHOR_V1_ASSET_REGISTRY_ENTRY`  
**Confirmed HEAD:** `d0015ce`  

---

## Registry Entry

| Field | Value |
|---|---|
| ASSET_REGISTRY_ENTRY_ID | `MIKAGE_CHARACTER_ANCHOR_V1` |
| CURRENT_BEST_BASE | `docs/character/anchor_v1_candidates/P3A_R4_HELMET_INPAINT_001.png` |
| SOURCE_BASE | `docs/character/anchor_v1_candidates/P3A_R4_001_STRONG_CANDIDATE.png` |
| HELMET_INPAINT_MASK | `docs/character/anchor_v1_candidates/P3A_R4_HELMET_INPAINT_001_MASK.png` |
| SCORE_REPORT | `reports/SCORE_P3A_R4_HELMET_INPAINT_ANCHOR_CANDIDATE.md` |
| LOCK_DECISION_REPORT | `reports/MIKAGE_CHARACTER_ANCHOR_V1_LOCK_DECISION.md` |
| ANCHOR_V1_LOCK_DECISION | APPROVED |
| CANON_LOCK_STATUS | `ANCHOR_V1_LOCKED_ONLY` |
| ASSET_LOCK_STATUS | `NOT_LOCKED` |
| FULL_BODY_R6_ALLOWED | NO |

---

## Verification

Confirmed before registry entry creation:

- Anchor V1 lock decision report exists.
- Locked Anchor V1 base exists.
- `CANON_LOCK_STATUS = ANCHOR_V1_LOCKED_ONLY`.
- `ASSET_LOCK_STATUS = NOT_LOCKED`.
- No new image rendering is needed.
- R5 is not the base.

---

## Candidate Summary

`docs/character/anchor_v1_candidates/P3A_R4_HELMET_INPAINT_001.png` is the approved Anchor V1 reference candidate.

It inherits R4's body, shoulders/pauldrons, armor, sword, hair, pose, lighting, palette, and background, with only the helmet faceplate corrected to exactly two separate ultra-thin horizontal void-black sensor slits.

The score report confirms `100/100 PASS`.

---

## Boundary

This registry entry records the approved Anchor V1 reference candidate only.

It does not claim final full character asset lock. `ASSET_LOCK_STATUS` remains `NOT_LOCKED` unless a separate asset lock task is created and explicitly approved.

Forbidden from this state:

- Do not render new images.
- Do not run full-body R6.
- Do not replace the current best base with R5.
- Do not claim final full character asset lock from this registry entry.
