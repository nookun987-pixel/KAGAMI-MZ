# MIKAGE_CHARACTER_ANCHOR_V1_CANDIDATE_SCORE_REPORT

**Date:** 2026-05-15  
**Candidates scored:** 2  
**Checklist version:** MIKAGE_CHARACTER_ANCHOR_V1_REVIEW_CHECKLIST.md  
**Scoring agent:** Claude (visual inspection, no generation)  
**Status:** REVISE — neither candidate reaches anchor gate threshold (90+)

---

## VISUAL DESCRIPTION — WHAT WAS SEEN

### TEST_001 — ANCHOR_V1_P3A_TEST_001_STRONG_PARTIAL.png

Full-body armored figure on void black background. Long heavy straight black hair falling prominently on the left side — strong silhouette contribution. White plate armor with angular segmentation. Sword held in right hand, grip near waist height. Background void black with faint atmospheric depth.

Key observations:
- Helmet is white smooth oval, completely featureless — no visible sensor slits
- Sword blade appears to taper toward the tip — NOT a rectangular slab. Traditional/fantasy sword form.
- Leg armor is heavily segmented with exposed bodysuit visible between panels
- Feet are in stiletto-heeled white boots — significant anime drift marker
- Pauldrons present but not dramatically oversized (roughly 1.5× helmet width)
- Violet accent: faint violet seam lines on leg panels — correct usage, barely visible
- Cloak/dark flow element partially visible on left side
- Overall aesthetic: strong anime character-art stylization (slim proportions, heeled silhouette)

### TEST_002 — ANCHOR_V1_P3A_TEST_002_STRONG_PARTIAL.png

Full-body armored figure on void black background. Same strong hair mass as TEST_001. White plate armor, more fully enclosed than TEST_001. Sword held vertically at right side — planted stance reading.

Key observations:
- Helmet is white oval, slightly more elongated than TEST_001, still no visible horizontal sensor slits — face area appears smooth/sealed
- **SWORD: Clearly a large rectangular dark slab.** Consistent width top to bottom, horizontal guard bar visible. Near-rectangular cross-section. This is the Zenith Blade form. Major win vs TEST_001.
- Armor coverage is more complete — leg armor more fully enclosed, no stiletto drift, feet appear normally armored
- Pauldrons are slightly wider than TEST_001 — still below 2.4× spec but improved
- Violet accent: faint violet seam traces at armor joints — correct usage
- Pose: standing upright, sword at right side, composure reads as planted/stable — close to B_MONOLITH stance
- Overall aesthetic: noticeably less anime than TEST_001. More weight, more mass, more sacred-tech character

---

## SECTION 1 — INSTANT REJECT RESULTS

| # | Check | TEST_001 | TEST_002 |
|---|---|---|---|
| IR-01 | Human eye shape behind slit | PASS — no human eye reads | PASS |
| IR-02 | Sensor slits completely absent | **BORDERLINE FAIL** — helmet blank/smooth, no slits detectable | **BORDERLINE FAIL** — same, very faint ambiguity at best |
| IR-03 | Sword tapered or curved | **BORDERLINE FAIL** — sword narrows toward tip, traditional form | PASS — sword is clearly rectangular slab |
| IR-04 | Gold/warm on helmet | PASS — cool white helmet | PASS |
| IR-05 | Crimson accent | PASS — violet, not crimson | PASS |
| IR-06 | Face visible | PASS — helmet sealed | PASS |
| IR-07 | Exposed skin | **BORDERLINE FAIL** — stiletto heeled boots, possible ankle exposure | PASS — normally armored feet |

**IR result — TEST_001:** 3 borderline failures (IR-02, IR-03, IR-07). No hard instant rejects — sensor slits have faint ambiguous surface features (not absolutely absent), sword has some rectangular character. Tagged as BORDERLINE — scored below, not discarded.

**IR result — TEST_002:** 1 borderline failure (IR-02 — sensor slits not clearly visible). No hard instant rejects. Proceeds to full scoring.

---

## SECTION 2 — SILHOUETTE GATE

| # | Check | TEST_001 | TEST_002 |
|---|---|---|---|
| SG-01 | Helmet portrait oval (1.33–1.44:1 H:W) | PASS — oval shape present, roughly correct ratio | PASS — slightly more elongated, better ratio |
| SG-02 | Sensor slits readable at thumbnail | **FAIL** — no slits detectable at any scale | **FAIL** — no slits detectable at any scale |
| SG-03 | Pauldrons ≥ 2.4× helmet width | **FAIL** — ~1.5× estimate | **FAIL** — ~1.8–2.0× estimate — improved but below spec |
| SG-04 | Hair left-side solid mass | PASS — prominent, strong | PASS — prominent, strong |
| SG-05 | Sword right side, distinct from body | BORDERLINE — sword present but form unclear | PASS — large rectangular slab clearly distinct |
| SG-06 | Asymmetry left/right | PASS — hair left / sword right | PASS — hair left / sword right |
| SG-07 | NOT samurai / NOT katana | BORDERLINE — sword has some traditional character | PASS — clearly NOT a katana |
| SG-08 | Memorability in 2 seconds | BORDERLINE — anime armor character read, not distinctly Mikage | PASS — sacred-tech armored figure with distinctive sword |

**SG result — TEST_001:** 3 FAIL, 2 BORDERLINE, 3 PASS.  
**SG result — TEST_002:** 2 FAIL (SG-02, SG-03), 6 PASS.

---

## SECTION 3 — MATERIAL GATE

| # | Check | TEST_001 | TEST_002 |
|---|---|---|---|
| MZ-01 | Helmet matte ceramic (not plastic/glossy) | PASS — matte surface quality | PASS — matte surface quality |
| MZ-02 | Helmet cool porcelain white (#f2eeea) | PASS — cool white | PASS — cool white |
| MZ-03 | Sensor slit surface void black recessed | **FAIL** — no slits to evaluate | **FAIL** — no slits to evaluate |
| MZ-04 | Seam lines cool silver, structural only | PASS — thin panel lines | PASS — visible structural seams |
| MZ-05 | Graphene underlayer at panel gaps | BORDERLINE — dark bodysuit visible at leg gaps, but reads as costume not graphene weave | BORDERLINE — dark seam areas visible, closer to correct depth read |
| MZ-06 | Violet usage as accent only | PASS — violet at seam lines only | PASS — violet at seam lines only |
| MZ-07 | Violet color #8F00FF range | PASS — appears correct hue | PASS — appears correct hue |
| MZ-08 | Blade matte void black, 1px silver catch | BORDERLINE — blade partially visible, not enough to evaluate fully | PASS — rectangular dark slab, correct matte read, faint edge catch |
| MZ-09 | Hair pure void black | PASS | PASS |
| MZ-10 | Hair single downward mass | PASS — strong solid mass | PASS — strong solid mass |

**MZ result — TEST_001:** MZ-03 FAIL (no slits), MZ-05 BORDERLINE, MZ-08 BORDERLINE.  
**MZ result — TEST_002:** MZ-03 FAIL (no slits to evaluate).

**Cross-check against reject examples:**
- REJECT_GOLDEN_MASK_001 (warm tone drift): Neither image matches — CLEAR
- REJECT_BAD_PLASTIC_00 (plastic surface): Neither image matches — CLEAR
- REJECT_BAD_FLAT_00 (flat no-texture): Neither image matches — CLEAR  
- REJECT_BAD_NOISE_00 (excessive noise): Neither image matches — CLEAR
- REJECT_BAD_MULTISHAPE_00 (silhouette confusion): TEST_001 slightly borderline (many armor pieces competing); TEST_002 CLEAR

---

## SECTION 4 — DRIFT CHECKS (15 items)

| # | Check | TEST_001 | TEST_002 |
|---|---|---|---|
| D-01 | Sensor slits present, no human eye | BORDERLINE — slit ambiguous; no human eye | BORDERLINE — slit ambiguous; no human eye |
| D-02 | Helmet palette cool white | PASS | PASS |
| D-03 | Sword perfectly rectangular | **FAIL** — taper visible | PASS |
| D-04 | Sword matte black, no glow | PASS | PASS |
| D-05 | Armor palette cool white | PASS | PASS |
| D-06 | Armor sealed coverage | **FAIL** — leg gaps, stiletto exposure | PASS |
| D-07 | Pauldrons wider than head | **FAIL** — only slightly wider, below spec | **FAIL** — improved but below 2.4× spec |
| D-08 | Silhouette readable | BORDERLINE | PASS |
| D-09 | Violet accent only (no crimson) | PASS | PASS |
| D-10 | Pose not symmetrical front | PASS | PASS |
| D-11 | Cloak secondary only | PASS | PASS |
| D-12 | Aesthetic axis sacred-tech | **FAIL** — anime drift (stiletto, slim proportions) | PASS — sacred-tech character dominates |
| D-13 | No expression from slits | PASS — slits absent, no expression | PASS |
| D-14 | Background void black | PASS | PASS |
| D-15 | Hair long straight black | PASS | PASS |

**TEST_001 drift: 10/15 PASS, 4 FAIL (D-03, D-06, D-07, D-12), 1 BORDERLINE (D-01, D-08)**  
**TEST_002 drift: 13/15 PASS, 1 FAIL (D-07), 1 BORDERLINE (D-01)**

---

## SECTION 5 — SCORING TABLE

### TEST_001

| Criterion | Weight | Score | Reason | Points |
|---|---|---|---|---|
| Helmet + sensor slits | 20 | **1** | Slits not visible — surface ambiguous, no clear horizontal void cuts. Not human eye (not 0). | 10 |
| Sword rectangular form | 15 | **1** | Sword narrows toward tip — not clearly rectangular slab. Some structural mass present. | 8 |
| Palette correctness | 15 | **2** | Cool white armor, void black bg, faint violet accent. No warm tones. | 15 |
| Silhouette legibility | 15 | **1** | Readable with effort. Pauldrons insufficient. Sword form ambiguous. | 8 |
| Armor coverage | 10 | **1** | Leg armor segmentation gaps. Stiletto boots concern. | 5 |
| Pauldron width | 10 | **1** | Wider than head but not significantly (~1.5× est.) | 5 |
| Aesthetic axis | 10 | **1** | Anime drift present: stiletto, slim proportions, fashion-armor feel | 5 |
| Hair presence + hierarchy | 5 | **2** | Long heavy straight black — excellent, fills left negative space | 5 |
| **TOTAL** | **100** | | | **61** |

**TEST_001: 61/100 — WEAK**

### TEST_002

| Criterion | Weight | Score | Reason | Points |
|---|---|---|---|---|
| Helmet + sensor slits | 20 | **1** | Slits not visible — helmet appears sealed/smooth. Slightly more elongated oval than TEST_001. No human eye. | 10 |
| Sword rectangular form | 15 | **2** | Clearly a large rectangular dark slab. Consistent width. Horizontal guard bar visible. Correct form. | 15 |
| Palette correctness | 15 | **2** | Cool white armor, void black bg, violet seam accents. No warm tones. | 15 |
| Silhouette legibility | 15 | **1** | Figure readable — hair left, sword right clear. Pauldron width insufficient — shoulder hierarchy weak at thumbnail. | 8 |
| Armor coverage | 10 | **2** | Fully sealed appearance. No stiletto. Complete armor panels. | 10 |
| Pauldron width | 10 | **1** | Wider than head, improved vs TEST_001 (~2.0× est.) — below 2.4× spec. | 5 |
| Aesthetic axis | 10 | **2** | Sacred-tech character clearly dominant. Heavy proportions. No anime drift markers. | 10 |
| Hair presence + hierarchy | 5 | **2** | Long heavy straight black — excellent, fills left negative space | 5 |
| **TOTAL** | **100** | | | **78** |

**TEST_002: 78/100 — CONDITIONAL**

---

## SECTION 6 — ANCHOR GATE

Neither candidate is run through the anchor gate — neither reached 90+ score required to enter anchor gate evaluation.

---

## COMPARATIVE SUMMARY

| Criterion | TEST_001 | TEST_002 | Winner |
|---|---|---|---|
| Sensor slits | 1 | 1 | Tie — both need fix |
| Sword form | 1 | **2** | TEST_002 |
| Palette | 2 | 2 | Tie |
| Silhouette | 1 | 1 | Tie (both limited by pauldron width) |
| Coverage | 1 | **2** | TEST_002 |
| Pauldrons | 1 | 1 | Tie (both below spec) |
| Aesthetic axis | 1 | **2** | TEST_002 |
| Hair | 2 | 2 | Tie |
| **TOTAL** | **61** | **78** | **TEST_002 wins 5 of 8** |

**TEST_002 is unambiguously the stronger base.** It has correct sword form, correct armor coverage, correct aesthetic axis. TEST_001 has a traditional sword form, anime drift, and coverage gaps — too many concurrent issues to recommend as a revision base.

---

## RECOMMENDATION

| Candidate | Score | Verdict | Action |
|---|---|---|---|
| TEST_001 | 61/100 — WEAK | **REJECT as revision base** | Do not build from TEST_001. The sword form and anime drift require root-level prompt correction not revision. Use as negative reference only. |
| TEST_002 | 78/100 — CONDITIONAL | **REVISE — one targeted iteration** | TEST_002 has correct foundation. Two specific fixes needed. See Section below. |

---

## TARGETED REVISION PLAN FOR TEST_002

**TEST_002 is 12 points from anchor gate threshold (90+).** Both missing points come from two criteria: sensor slits (1→2 = +10 pts) and pauldron width (1→2 = +5 pts). Either fix alone brings TEST_002 to 83–88. Both fixes together = 93/100 — STRONG.

### Fix 1 — Sensor Slits (CRITICAL, +10 pts)

The slits are not appearing. This is the single most important correction.

**Add to positive prompt:**
```
two ultra-narrow horizontal void-black sensor slits clearly visible on helmet face, 
sensor slits are two thin dark parallel horizontal lines cut across the white porcelain helmet at eye level,
dark recessed channels spanning 70% of helmet width, slits visible as dark horizontal voids in white surface
```

**Add to negative prompt:**
```
smooth featureless helmet, completely blank helmet, sealed blank helmet, no markings on helmet,
single slit, vertical slit, diagonal slit, V-shaped visor, curved visor, cross slit
```

### Fix 2 — Pauldron Width (+5 pts)

Pauldrons need to be dramatically wider than the head — target 2.4×+ helmet width.

**Add to positive prompt:**
```
dramatically oversized flat-topped pauldron plates extending far wider than the head, 
pauldrons are much wider than the helmet — nearly three times the helmet width,
wide horizontal shoulder armor dominates upper body, flat-topped pauldrons like battlements
```

**Add to negative prompt:**
```
narrow shoulders, small pauldrons, normal shoulder armor, proportional shoulders
```

### What to keep from P3-A base:

Everything else in TEST_002 is working. Do not change: palette prompts, background prompts, hair prompts, sword prompts (sword is already correct), coverage prompts, void black background.

### Expected result from targeted revision:
- Sensor slits score: 1 → 2 (+10 pts)
- Pauldron width score: 1 → 2 (+5 pts)
- Projected score: 78 + 15 = **93/100 — STRONG**

---

*Generated: 2026-05-15 | Task: SCORE_ANCHOR_V1_CANDIDATES | Not canon-locked*
