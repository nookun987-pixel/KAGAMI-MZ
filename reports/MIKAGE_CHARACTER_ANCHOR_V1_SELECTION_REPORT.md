# MIKAGE_CHARACTER_ANCHOR_V1_SELECTION_REPORT

**Status:** NO SELECTION — REVISE REQUIRED  
**Date:** 2026-05-15  
**Task:** SCORE_ANCHOR_V1_CANDIDATES

---

## SELECTION RESULT

**No anchor candidate selected.**

Two candidates scored. Neither reaches anchor gate threshold (90+). Both fail on sensor slits (score 1). TEST_001 additionally fails on sword form and aesthetic axis. TEST_002 is the only viable revision base.

---

## CANDIDATE SUMMARY TABLE

| File | Score | Threshold | Verdict |
|---|---|---|---|
| ANCHOR_V1_P3A_TEST_001_STRONG_PARTIAL.png | 61/100 — WEAK | 90+ required | REJECT as revision base |
| ANCHOR_V1_P3A_TEST_002_STRONG_PARTIAL.png | 78/100 — CONDITIONAL | 90+ required | REVISE — one targeted iteration |

---

## WHY NOT SELECTED

**TEST_001 (61/100):** Four concurrent issues — sensor slits absent, sword has traditional taper (not rectangular slab), leg armor gaps, anime drift (stiletto boots, slim proportions). Too many root problems for revision. Do not use as base.

**TEST_002 (78/100):** Two specific issues only — sensor slits not visible on helmet, pauldrons below 2.4× spec width. All other criteria correct. Foundation is valid. This is a targeted revision case, not a root rebuild.

---

## WHAT IS CORRECT IN TEST_002

These elements are working and must be preserved:
- Sword form: rectangular dark slab, correct width-to-height ratio, horizontal guard bar — **DO NOT CHANGE sword prompts**
- Palette: cool white armor, void black background, violet seam accents — **PRESERVE**
- Armor coverage: fully sealed, no exposure — **PRESERVE**
- Hair: long heavy straight black, fills left negative space — **PRESERVE**
- Aesthetic axis: sacred-tech, not anime — **PRESERVE**
- Pose: standing upright, sword at right side, planted stance — **PRESERVE**

---

## REVISION REQUIRED — EXACT PROMPT CHANGES

### Add to positive (place near start of prompt):
```
two ultra-narrow horizontal void-black sensor slits clearly visible on helmet face,
sensor slits are two thin dark parallel horizontal lines cut across the white porcelain helmet at eye level,
dark recessed void channels spanning 70% of helmet width visible in white surface,
dramatically oversized flat-topped pauldron plates extending far wider than the head,
pauldrons are nearly three times the helmet width, wide horizontal shoulder armor like battlements
```

### Add to negative (append to existing):
```
smooth featureless helmet, completely blank helmet, sealed blank helmet, single slit, vertical slit,
diagonal slit, V-shaped visor, curved visor, cross slit, narrow shoulders, small pauldrons,
proportional shoulders, normal shoulder width
```

### What NOT to change:
Everything else in P3-A prompt — sword, hair, coverage, palette, background, pose.

---

## PROJECTED SCORE AFTER REVISION

| Criterion | TEST_002 current | After revision | Delta |
|---|---|---|---|
| Helmet + sensor slits | 1 → 10pts | 2 → 20pts | +10 |
| Pauldron width | 1 → 5pts | 2 → 10pts | +5 |
| Silhouette legibility | 1 → 8pts | 2 → 15pts | +7 (pauldrons fix unlocks this) |
| All others | unchanged | unchanged | 0 |
| **Projected total** | **78** | **93** | **+15** |

**93/100 projected — STRONG — would pass anchor gate if sensor slits and pauldrons are correctly rendered.**

---

## SELECTION WILL HAPPEN WHEN

Human runs revised P3-A prompt (exact additions above) and returns at least 1 output to `docs/character/anchor_v1_candidates/`. Agent scores and runs anchor gate if score ≥ 90.

---

*Generated: 2026-05-15 | Task: SCORE_ANCHOR_V1_CANDIDATES | Selection: NONE — REVISION PENDING*
