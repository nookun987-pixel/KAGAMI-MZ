# MIKAGE_CHARACTER_ANCHOR_V1_SELECTION_REPORT

**Status:** NO SELECTION — R6 REVISION REQUIRED (DUAL FIX: SLITS + PAULDRONS)
**Date:** 2026-05-15  
**Last scored:** P3A_R5_001 — 78/100 — REVISE

---

## SELECTION RESULT

**No anchor candidate selected.**

Five scored candidates across five iterations. No candidate reaches anchor gate (90+). The generation is oscillating between two unresolved criteria — sensor slits and pauldron width — and cannot maintain both simultaneously. R6 must force both into the same output.

---

## CANDIDATE SUMMARY TABLE

| File | Score | Threshold | Verdict |
|---|---|---|---|
| ANCHOR_V1_P3A_TEST_001 | 61/100 | 90+ required | REJECTED |
| ANCHOR_V1_P3A_TEST_002 | 78/100 | 90+ required | SUPERSEDED |
| P3A_R2_001 | 78/100 | 90+ required | SUPERSEDED |
| P3A_R3_001_SPEC_BOARD | SPEC BOARD | N/A | Design reference only |
| P3A_R4_001_STRONG_CANDIDATE | 73/100 — REJECT (IR-02/D-01) | 90+ required | Pauldron breakthrough (score 2), slits absent (score 0) |
| **P3A_R5_001** | **78/100 — CONDITIONAL** | 90+ required | **CURRENT REVISION BASE — slit marginal improvement, pauldron regression** |

---

## OSCILLATION PATTERN — BLOCKING ANALYSIS

| Candidate | Slit Score | Pauldron Score | Total |
|---|---|---|---|
| TEST_002 | 1 (borderline) | 1 (~2.0×) | 78 |
| R2 | 1 (one slit visible) | 1 (~2.2×) | 78 |
| R4 | 0 (completely blank) | **2 (~3.0–3.5× PASS)** | 73 |
| R5 | 1 (faint borderline) | 1 (~2.0–2.2×) | 78 |

**The model is trading slits for pauldrons and vice versa.** When slit prompts dominate, pauldrons regress. When pauldron prompts dominate, slits vanish. Both must appear in the same seed at 90+ total for anchor gate to open.

---

## WHAT IS CONFIRMED WORKING (PRESERVE IN R6)

| Element | Score in R5 | Action |
|---|---|---|
| Sword rectangular slab | 2 | DO NOT change |
| Palette (white/black/violet) | 2 | PRESERVE |
| Armor coverage + lower body | 2 | PRESERVE — spec-validated |
| Aesthetic axis (sacred-tech) | 2 | PRESERVE |
| Hair (left mass) | 2 | PRESERVE |

---

## R6 REVISION — DUAL PRIORITY INJECTION

Two priority blocks placed at absolute top of positive. Two negative blocks placed at absolute top of negative.

### Priority Block 1 — Sensor Slits (ABSOLUTE TOP of positive):
```
HELMET FACE DETAIL: two separate void-black horizontal sensor slits,
one slit at upper third of helmet face, one slit at lower third of helmet face,
gap of white porcelain between the two slits,
each slit is a thin dark horizontal recessed channel spanning 70 percent of helmet width,
both slits visible simultaneously, two parallel dark lines on white face,
slit one above slit two, vertical gap between them, TWO slits not one
```

### Priority Block 2 — Pauldrons (immediately after slit block):
```
enormously wide flat-topped pauldron plates three times the helmet width,
dramatic horizontal shoulder battlements spanning four times the head width,
pauldrons like aircraft wings extending from shoulders,
massively oversized superhuman shoulder armor dominating upper silhouette,
shoulder width dwarfs the head, maximum pauldron exaggeration
```

### Negative Priority (ABSOLUTE TOP of negative):
```
completely blank helmet, smooth helmet face, featureless helmet, sealed helmet face,
one slit, single slit, single line, merged slits, no features on helmet,
normal shoulders, narrow shoulders, small pauldrons, proportional shoulders,
shoulder armor matching body width, human shoulder proportions
```

### What NOT to change:
Sword, palette, coverage, lower body, aesthetic, hair — all scoring 2 and stable.

### R6 generation settings:
```
Steps=35, CFG=7.5, dpmpp_2m karras, 2:3 portrait
BATCH: 8-12 seeds (increased to capture simultaneous fix)
SAVE TO: docs/character/anchor_v1_candidates/P3A_R6_[seed].png
```

---

## PROJECTED R6 SCORE

| Scenario | Calculation | Total | Gate |
|---|---|---|---|
| Both slits + pauldrons fix | 78 + 10 + 5 + 7 | 100/100 | PASS |
| Slits only fix | 78 + 10 + 7 | 95/100 | PASS |
| Pauldrons only fix | 78 + 5 + 7 | 90/100 | AT GATE |
| Neither fixes | 78/100 | 78/100 | REVISE |

**Any single fix (slits OR pauldrons) reaching score 2 opens or equals the anchor gate threshold.**

---

## SELECTION WILL HAPPEN WHEN

Human runs R6 with dual priority prompt and returns files `P3A_R6_[seed].png` to `docs/character/anchor_v1_candidates/`. Agent scores — first output ≥90 triggers anchor gate.

---

*Updated: 2026-05-15 | Task: SCORE_P3A_R5_ANCHOR_CANDIDATE | Selection: NONE — R6 dual fix required*
