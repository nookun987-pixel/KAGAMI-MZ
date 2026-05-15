# MIKAGE_CHARACTER_ANCHOR_V1_SELECTION_REPORT

**Status:** NO SELECTION — R5 REVISION REQUIRED (SINGLE FOCUS: SENSOR SLITS)
**Date:** 2026-05-15  
**Last scored:** P3A_R4_001_STRONG_CANDIDATE — 73/100 — REJECT (IR-02/D-01)

---

## SELECTION RESULT

**No anchor candidate selected.**

Four candidates scored across four revision iterations. P3A_R4_001 is formally disqualified by IR-02 (blank helmet) and D-01 (slits absent) mandatory checklist conditions. However, R4 is the strongest candidate in all non-slit criteria. R5 has a single job: sensor slits.

---

## CANDIDATE SUMMARY TABLE

| File | Score | Threshold | Verdict |
|---|---|---|---|
| ANCHOR_V1_P3A_TEST_001_STRONG_PARTIAL.png | 61/100 — WEAK | 90+ required | REJECTED — sword drift, anime drift, coverage |
| ANCHOR_V1_P3A_TEST_002_STRONG_PARTIAL.png | 78/100 — CONDITIONAL | 90+ required | SUPERSEDED |
| P3A_R2_001.png | 78/100 — CONDITIONAL | 90+ required | SUPERSEDED |
| P3A_R3_001_SPEC_BOARD_STRONG.png | SPEC BOARD — NOT SCORED | N/A | Design reference only — shows ideal target including slits |
| P3A_R4_001_STRONG_CANDIDATE.png | 73/100 — DISQUALIFIED | 90+ required | **REJECT (IR-02/D-01) — current revision base for R5** |

---

## WHY R4 IS DISQUALIFIED (AND WHY IT IS STILL THE REVISION BASE)

**Disqualifier:** IR-02 (helmet blank) + D-01 (slits absent) = mandatory reject per checklist.

**Why R4 is still the base:**

R4 is the first candidate in the series to score 2 (maximum) on SIX criteria simultaneously:
- Sword form (2) — maintained from TEST_002
- Palette (2) — maintained
- Coverage (2) — validated by R3 spec board
- Pauldrons (2) — **FIRST SPEC PASS IN SERIES** (~3.0–3.5× estimated vs 2.4× required)
- Aesthetic (2) — validated by R3 spec board
- Hair (2) — maintained

The one failing criterion (helmet/slits = 0) is the only remaining blocker. If R5 produces two visible slits on an R4-type output, the projected score is 100/100.

---

## WHAT IS CORRECT IN R4 (PRESERVE EXACTLY)

| Element | Status | Action |
|---|---|---|
| Zenith Blade rectangular slab | PASS (score 2) | DO NOT change sword prompts |
| Palette (white/void black/violet) | PASS (score 2) | PRESERVE |
| Armor coverage (fully sealed + flowing lower body) | PASS (score 2) | PRESERVE — spec board validates |
| Pauldrons (~3.0–3.5× helmet width) | PASS (score 2) — FIRST PASS | PRESERVE — breakthrough achieved |
| Aesthetic axis (sacred-tech) | PASS (score 2) | PRESERVE — spec board validates |
| Hair mass (left negative space) | PASS (score 2) | PRESERVE |

---

## R5 REVISION — SINGLE FOCUS: SENSOR SLITS

### What failed: zero slits across 4 of 4 candidates (R2 partial: 1 slit)

The model consistently produces smooth sealed helmets regardless of slit prompt additions. Slit prompts are being overridden or deprioritized.

**R5 strategy: priority injection — place slit prompt at absolute front of both positive and negative.**

### Add to positive (first lines — above all other positive content):
```
HELMET FACE DETAIL: two separate void-black horizontal sensor slits,
one slit at upper third of helmet face, one slit at lower third of helmet face,
gap of white porcelain between the two slits,
each slit is a thin dark horizontal recessed channel spanning 70 percent of helmet width,
both slits visible simultaneously, two parallel dark lines on white face,
slit one above slit two, vertical gap between them, TWO slits not one
```

### Add to negative (first lines — above all other negative content):
```
completely blank helmet, smooth helmet face, featureless helmet, sealed helmet face,
one slit, single slit, single line, single horizontal line, one line on helmet,
merged slits, connected slits, no markings, no features on helmet
```

### What NOT to change:
Everything else from R4 — sword, pauldrons, lower body, palette, hair, aesthetic, coverage, pose.

---

## PROJECTED SCORE AFTER R5

| Criterion | R4 current | After R5 (slits correct) | Delta |
|---|---|---|---|
| Helmet + sensor slits | 0 → 0pts | 2 → 20pts | +20 |
| Silhouette legibility | 1 → 8pts | 2 → 15pts | +7 (all other SG checks already pass) |
| All others | unchanged | unchanged | 0 |
| **Projected total** | **73** | **100** | **+27** |

**100/100 projected if both slits render correctly. Anchor gate threshold is 90+.**

Even partial improvement (slits score 0→1): 73 + 10 + 7 = 90 = at anchor gate threshold.

---

## SELECTION WILL HAPPEN WHEN

Human runs R5 prompt with slit additions at top of prompt and returns outputs to `docs/character/anchor_v1_candidates/`. Files named `P3A_R5_[seed].png`. Agent scores — first output ≥90 triggers anchor gate evaluation.

---

*Updated: 2026-05-15 | Task: SCORE_P3A_R4_ANCHOR_CANDIDATE | Selection: NONE — R5 SINGLE FOCUS: SENSOR SLITS*
