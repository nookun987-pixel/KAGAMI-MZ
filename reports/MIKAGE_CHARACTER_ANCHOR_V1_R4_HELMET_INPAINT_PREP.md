# MIKAGE_CHARACTER_ANCHOR_V1_R4_HELMET_INPAINT_PREP

**Date:** 2026-05-15  
**Base image:** `docs/character/anchor_v1_candidates/P3A_R4_001_STRONG_CANDIDATE.png`  
**Next safe task:** `MIKAGE_CHARACTER_ANCHOR_V1_R4_HELMET_ONLY_INPAINT`  
**Status:** READY FOR HELMET-ONLY CORRECTION  

---

## Edit Scope

Edit only the helmet face area. Preserve the R4 image completely outside the helmet faceplate.

## Preserve

- pauldrons
- body
- armor
- sword
- hair
- pose
- lighting
- palette
- background

## Required Helmet Correction

- exactly two separate ultra-thin horizontal void-black sensor slits
- slits span about 70% of helmet width
- visible white porcelain gap between slits
- no eyes
- no mouth
- no nose
- no visor
- no logo

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

## Manual Mask Instruction

Mask only the central helmet faceplate area where the two slits should appear. Do not mask hair, neck, shoulders, pauldrons, body, sword, or background.

Do not fabricate a mask unless the helmet faceplate boundary can be verified precisely. A conservative manual mask is safer than an uncertain generated mask.

---

*Generated: 2026-05-15 | Task: MIKAGE_CHARACTER_ANCHOR_V1_R4_HELMET_ONLY_INPAINT_PREP*
