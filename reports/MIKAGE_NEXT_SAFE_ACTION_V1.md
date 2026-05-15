# MIKAGE_NEXT_SAFE_ACTION_V1

**Updated:** 2026-05-15 — post SCORE_ANCHOR_V1_CANDIDATES

---

## CURRENT PIPELINE STATE

| Gate | Status |
|---|---|
| CANON_LOCKED | NO |
| ASSET_LOCKED | NO |
| ANCHOR_STATUS | **REVISE — TEST_002 at 78/100 CONDITIONAL, 12 pts from threshold** |
| ANCHOR_BLOCKER | Sensor slits not visible (−10 pts) + pauldrons below spec (−5 pts) |
| TEST_001 | 61/100 WEAK — reject as revision base |
| TEST_002 | 78/100 CONDITIONAL — revision base, TWO specific fixes only |
| ACTIVE_PALETTE | Electric violet #8F00FF / #7B2FFF |
| PREV_COMMIT | PENDING |

---

## NEXT_SAFE_TASK — TARGETED REVISION RUN

```
HUMAN ACTION — run revised P3-A in Fooocus:

BASE: Use P3-A from reports/MIKAGE_CHARACTER_ANCHOR_V1_PLAN.md Section 6
      Keep all existing prompt content unchanged

ADD TO POSITIVE (insert near top):
  two ultra-narrow horizontal void-black sensor slits clearly visible on helmet face,
  sensor slits are two thin dark parallel horizontal lines cut across the white
  porcelain helmet at eye level, dark recessed void channels spanning 70% of helmet
  width visible in white surface, dramatically oversized flat-topped pauldron plates
  extending far wider than the head, pauldrons are nearly three times the helmet
  width, wide horizontal shoulder armor like battlements

ADD TO NEGATIVE (append to end):
  smooth featureless helmet, completely blank helmet, sealed blank helmet, single slit,
  vertical slit, diagonal slit, V-shaped visor, curved visor, cross slit,
  narrow shoulders, small pauldrons, proportional shoulders, normal shoulder width

DO NOT CHANGE: sword prompts, hair prompts, coverage prompts, palette prompts,
               background prompts, pose prompts — all working correctly in TEST_002

SETTINGS: same as previous — Steps=35, CFG=7.5, dpmpp_2m karras, 2:3 portrait
BATCH: 5–8 seeds
SAVE TO: docs/character/anchor_v1_candidates/P3A_R2_[seed].png
RETURN: filenames to agent for scoring
TARGET: first output scoring 90+ = CHARACTER ANCHOR V1
```

---

## WHAT TWO FIXES UNLOCK

```
Current TEST_002: 78/100
+ Sensor slits score 1→2: +10 pts
+ Pauldron width score 1→2: +5 pts
+ Silhouette score 1→2: +7 pts (unlocked when pauldrons reach spec)
Projected: 93/100 — STRONG — would pass anchor gate
```

---

## WHAT IS CONFIRMED WORKING (do not adjust)

From TEST_002 scoring — these elements pass and must be preserved:

| Element | Status |
|---|---|
| Zenith Blade rectangular slab | PASS (score 2) — DO NOT change sword prompts |
| Palette (white/void black/violet) | PASS (score 2) — PRESERVE |
| Armor coverage (fully sealed) | PASS (score 2) — PRESERVE |
| Hair mass (left negative space) | PASS (score 2) — PRESERVE |
| Aesthetic axis (sacred-tech) | PASS (score 2) — PRESERVE |

---

## PENDING GIT

```
cd D:\KAGAMI-MZ_SYNC_PUSH_V2
git add docs/character/ reports/ docs/handoff/
git commit -m "character: anchor candidates scored — TEST_002 78/100 CONDITIONAL

TEST_001: 61/100 WEAK — rejected (sword drift, anime drift, coverage)
TEST_002: 78/100 CONDITIONAL — revision base
Missing: sensor slits (−10) + pauldron width (−5)
Revision prompt additions written. Projected revision score: 93/100.
NEXT: human runs revised P3-A → save to anchor_v1_candidates/"
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

*MIKAGE_NEXT_SAFE_ACTION_V1 — updated 2026-05-15 — ANCHOR REVISION REQUIRED — no assets locked*
