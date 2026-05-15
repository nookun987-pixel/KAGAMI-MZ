# MIKAGE_NEXT_SAFE_ACTION_V1

**Updated:** 2026-05-15 — post SCORE_P3A_R4_ANCHOR_CANDIDATE

---

## CURRENT PIPELINE STATE

| Gate | Status |
|---|---|
| CANON_LOCKED | NO |
| ASSET_LOCKED | NO |
| ANCHOR_STATUS | **REJECT (IR-02/D-01) — R4 at 73/100 — R5 required: single focus sensor slits** |
| ANCHOR_BLOCKER | Sensor slits completely absent (IR-02 FAIL, D-01 FAIL) — only remaining blocker |
| TEST_001 | 61/100 WEAK — REJECTED |
| TEST_002 | 78/100 — SUPERSEDED |
| P3A_R2_001 | 78/100 — SUPERSEDED |
| P3A_R3_001_SPEC_BOARD | SPEC BOARD — design reference, not scored |
| P3A_R4_001 | 73/100 — DISQUALIFIED (IR-02/D-01) — **R5 REVISION BASE** |
| PAULDRON_STATUS | **RESOLVED** — R4 achieves ~3.0–3.5x helmet width (spec: >=2.4x) |
| COVERAGE_STATUS | **RESOLVED** — R4 fully sealed, flowing lower body spec-validated |
| AESTHETIC_STATUS | **RESOLVED** — R4 sacred-tech confirmed via R3 spec board |
| REMAINING_BLOCKER | Sensor slits ONLY — 0 visible, 2 required |
| ACTIVE_PALETTE | Electric violet #8F00FF / #7B2FFF |
| PREV_COMMIT | PENDING |

---

## NEXT_SAFE_TASK — R5 REVISION: SENSOR SLITS ONLY

```
HUMAN ACTION — run R5 in Fooocus:

BASE: Preserve EXACTLY the prompt elements from R4 that produced:
  - Wide pauldrons (~3x helmet width)
  - Flowing lower body coverage
  - Sacred-tech aesthetic
  - Correct sword, palette, hair

DO NOT CHANGE anything from R4 that is working.
ONLY ADD the following slit-focused additions:

ADD TO POSITIVE — PLACE AT ABSOLUTE TOP (first lines, before everything else):
  HELMET FACE DETAIL: two separate void-black horizontal sensor slits,
  one slit at upper third of helmet face, one slit at lower third of helmet face,
  gap of white porcelain between the two slits,
  each slit is a thin dark horizontal recessed channel spanning 70 percent of helmet width,
  both slits visible simultaneously, two parallel dark lines on white face,
  slit one above slit two, vertical gap between them, TWO slits not one

ADD TO NEGATIVE — PLACE AT ABSOLUTE TOP (first lines, before everything else):
  completely blank helmet, smooth helmet face, featureless helmet, sealed helmet face,
  one slit, single slit, single line, single horizontal line, one line on helmet,
  merged slits, connected slits, no markings, no features on helmet

SETTINGS: same as previous — Steps=35, CFG=7.5, dpmpp_2m karras, 2:3 portrait
BATCH: 5-8 seeds
SAVE TO: docs/character/anchor_v1_candidates/P3A_R5_[seed].png
RETURN: filenames to agent for scoring
TARGET: first output scoring 90+ = CHARACTER ANCHOR V1
```

---

## WHAT R5 WILL UNLOCK

```
R4 current: 73/100 (disqualified by IR-02/D-01 — blank helmet)

If slits score 0->1 (partial, one slit visible):
  + Helmet score: 0 -> 1 = +10 pts
  + Silhouette score: 1 -> 2 = +7 pts (all other SG checks already pass)
  = 73 + 10 + 7 = 90/100 -- AT GATE THRESHOLD -- anchor gate evaluation triggered

If slits score 0->2 (full, both slits clearly visible):
  + Helmet score: 0 -> 2 = +20 pts
  + Silhouette score: 1 -> 2 = +7 pts
  = 73 + 20 + 7 = 100/100 -- PERFECT SCORE
```

---

## WHAT IS CONFIRMED WORKING — DO NOT TOUCH (all score 2 in R4)

| Element | R4 Score | Action |
|---|---|---|
| Zenith Blade rectangular slab | 2 | DO NOT change sword prompts |
| Palette (white/void black/violet) | 2 | PRESERVE |
| Armor coverage (fully sealed + flowing lower body) | 2 | PRESERVE — spec board validates lower body |
| Pauldrons (~3.0-3.5x helmet width) | 2 | PRESERVE — first spec pass, do not risk losing |
| Aesthetic axis (sacred-tech) | 2 | PRESERVE — spec board validates direction |
| Hair mass (left negative space) | 2 | PRESERVE |

---

## PROGRESS LOG — ALL CANDIDATES

| Candidate | Sensor Slits | Pauldrons | Score | Status |
|---|---|---|---|---|
| TEST_001 | 0 visible | ~1.5x est. | 61/100 | REJECTED |
| TEST_002 | 0 visible | ~2.0x est. | 78/100 | SUPERSEDED |
| P3A_R2_001 | 1 slit visible | ~2.2x est. | 78/100 | SUPERSEDED |
| P3A_R3_001 | SPEC BOARD | SPEC BOARD | N/A | Design ref only |
| P3A_R4_001 | 0 visible (regression) | ~3.0-3.5x PASS | 73/100 | CURRENT BASE (IR-02/D-01 reject) |
| P3A_R5_TBD | Target: 2 slits | Hold at 3x+ | Target: 90+ | PENDING |

---

## PENDING GIT

```
cd D:\KAGAMI-MZ_SYNC_PUSH_V2
git add docs/character/ reports/ docs/handoff/ MIKAGE_TRACK_CATALOG_DATABASE_V1_LOCKED_21.xlsx
git commit -m "character: R4 scored 73/100 REJECT (IR-02/D-01) — pauldron breakthrough, slits absent

R4 breakthroughs: pauldrons first spec pass (~3x helmet width), coverage score 2,
aesthetic score 2. Single remaining blocker: sensor slits (0 visible, 2 required).
R5 prompt written: slit-only focus, priority injection at prompt top.
Projected R5: 90-100/100."
git push
```

---

## FORBIDDEN

```
Do not render agent-side.
Do not use ComfyUI runtime from sandbox.
Do not approve canon.
Do not asset-lock anything.
Do not call candidates production-ready.
```

---

*MIKAGE_NEXT_SAFE_ACTION_V1 — updated 2026-05-15 — R5 REQUIRED — SINGLE FOCUS: SENSOR SLITS — no assets locked*
