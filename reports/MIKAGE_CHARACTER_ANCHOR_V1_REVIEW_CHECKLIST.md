# MIKAGE_CHARACTER_ANCHOR_V1_REVIEW_CHECKLIST

**Use:** Run against every generated output before scoring or advancing.  
**Version:** V1 — 2026-05-15  
**Not canon-locked. Not asset-locked.**

---

## HOW TO USE

1. Run INSTANT REJECTS first (Section 1). Any FAIL here = discard immediately, do not continue.
2. Run SILHOUETTE GATE (Section 2). FAIL = discard.
3. Run MATERIAL GATE (Section 3). FAIL = note specific fails, adjust prompt, retry.
4. Run DRIFT CHECKS (Section 4). All 15 must PASS.
5. Run SCORING TABLE (Section 5). Must score 90+.
6. Run ANCHOR GATE (Section 6). All boxes must be checked.

---

## SECTION 1 — INSTANT REJECTS (check these first)

If ANY of these are true, discard the image immediately. Do not score.

| # | Condition | Check |
|---|---|---|
| IR-01 | Human eye visible behind sensor slit — pupil, iris, or human eye shape present | REJECT if YES |
| IR-02 | Sensor slits completely absent — helmet is fully sealed blank | REJECT if YES |
| IR-03 | Sword is tapered, curved, or has a point | REJECT if YES |
| IR-04 | Warm gold or orange dominant on helmet surface | REJECT if YES |
| IR-05 | Crimson used as accent color anywhere | REJECT if YES |
| IR-06 | Face visible — mouth, chin, jaw, or nose readable | REJECT if YES |
| IR-07 | Exposed skin at any armor joint | REJECT if YES |

**All IR checks clear?** → Proceed to Section 2.

---

## SECTION 2 — SILHOUETTE GATE

Compare against B_MONOLITH geometry (MIKAGE_SILHOUETTE_CANON_V1_LOCK_SPEC.md).  
Also compare against: `docs/character/references/mask_body_silhouette/REF_SP001_...png`

View at thumbnail scale (reduce image to approximately 100×175px equivalent) and check:

| # | Check | Pass condition | Pass / Fail |
|---|---|---|---|
| SG-01 | Helmet shape | Portrait oval — taller than wide (1.33:1 to 1.44:1 H:W) | |
| SG-02 | Sensor slits | Two thin horizontal lines visible at thumbnail scale | |
| SG-03 | Pauldrons | Shoulder span clearly wider than helmet — minimum 2.4× helmet width | |
| SG-04 | Hair mass | Left-side solid mass visible — extends beyond helmet left edge | |
| SG-05 | Blade | Vertical rectangle on right side — distinct from body at thumbnail | |
| SG-06 | Asymmetry | Left-heavy (hair) vs right-heavy (sword) readable at thumbnail | |
| SG-07 | Not samurai | Silhouette does NOT read as kimono or katana | |
| SG-08 | Memorability | Identifiable in under 2 seconds at thumbnail scale | |

**All 8 SG checks PASS?** → Proceed to Section 3.  
**Any SG FAIL?** → Discard or note fail reason, adjust prompt, retry.

---

## SECTION 3 — MATERIAL GATE

Compare helmet against: `docs/character/references/material/REF_GOOD_CERAMIC_0*__MATERIAL.png`  
Compare against reject examples to confirm output does NOT match any drift pattern.

### Zone 1 — Helmet + Armor Porcelain

| # | Check | Pass | Fail | P/F |
|---|---|---|---|---|
| MZ-01 | Helmet surface | Matte ceramic — cool white to silver-grey tonal shift | Plastic sheen / glossy / warm tone / flat fill | |
| MZ-02 | Helmet color | Cool porcelain white (#f2eeea range) | Warm gold, warm ivory, orange tint, pure white with warmth | |
| MZ-03 | Sensor slit surface | Void black — dark recessed channels | Glowing / colored / pupil-like / decorative | |
| MZ-04 | Seam lines | Cool silver — structural only, thin | Warm color / gold / ornate / thick decorative lines | |

**Reject example check:** Does helmet resemble `REJECT_GOLDEN_MASK_001`? → If YES: fail MZ-02.  
**Reject example check:** Does helmet resemble `REJECT_BAD_PLASTIC_00`? → If YES: fail MZ-01.  
**Reject example check:** Does helmet resemble `REJECT_BAD_FLAT_00`? → If YES: fail MZ-01.

### Zone 2 — Graphene Underlayer

| # | Check | Pass | Fail | P/F |
|---|---|---|---|---|
| MZ-05 | Panel gap interior | Dark depth visible at seams — graphene/carbon texture | No gap depth / light colored / warm seam interior | |

*Note: May not be visible in all poses. Skip MZ-05 if panel gaps are not visible in the output.*

### Zone 3 — Violet Accent

| # | Check | Pass | Fail | P/F |
|---|---|---|---|---|
| MZ-06 | Violet usage | Accent only — halo, glyph, mist, or slit ambient | Violet as primary surface / dominant light / armor fill | |
| MZ-07 | Violet color accuracy | #8F00FF to #7B2FFF range | Crimson / magenta / blue — wrong hue | |

### Zone 4 — Zenith Blade

| # | Check | Pass | Fail | P/F |
|---|---|---|---|---|
| MZ-08 | Blade material | Pure matte void black, 1px silver edge catch only | Glow / runes / energy / reflective / warm color | |

**Compare against:** `docs/character/references/blade/REF_SP002_...png`

### Zone 5 — Hair

| # | Check | Pass | Fail | P/F |
|---|---|---|---|---|
| MZ-09 | Hair color | Pure void black | Any color / highlight / shine | |
| MZ-10 | Hair form | Single downward mass | Strands / wisps / volumetric cloud / short / bundled | |

**All required MZ checks PASS?** → Proceed to Section 4.

---

## SECTION 4 — DRIFT CHECKS (15 items)

Source: Prompt Library Section 10. All must PASS.

| # | Check | FAIL condition | PASS condition | P/F |
|---|---|---|---|---|
| D-01 | Helmet sensor slits | Human eye shape / pupil / iris visible; OR slits absent | Two ultra-narrow void-black horizontal slits present, no human eye read | |
| D-02 | Helmet palette | Warm ivory, gold trim, warm tint | Cool porcelain white to silver-grey only | |
| D-03 | Sword form | Any taper, curve, point, katana silhouette | Perfectly rectangular slab end-to-end | |
| D-04 | Sword material | Glow, runes, energy, warm color, crimson | Pure matte black, 1px silver catch only | |
| D-05 | Armor palette | Gold, orange, cream, red, warm tones, crimson | Cool white to silver-grey only | |
| D-06 | Armor coverage | Exposed skin or gap at joints | Total sealed coverage | |
| D-07 | Pauldrons width | Narrower than head | Significantly wider than head | |
| D-08 | Silhouette read | Shape ambiguous at distance | Helmet + pauldrons + slab sword + hair mass readable | |
| D-09 | Violet usage | Crimson as accent; or violet as primary surface fill | Violet #8F00FF as accent only: halo, glyph, mist, slit ambient | |
| D-10 | Pose | Symmetrical front-facing default | Diagonal or planted stance; sword anchors angle | |
| D-11 | Cloak role | Cloak dominant over armor/sword in read | Secondary geometry only | |
| D-12 | Aesthetic axis | Anime, mech, demon, heroic fantasy, cute | Sacred-tech: architectural, cold, sealed | |
| D-13 | Expression | Any emotional read; slit appearing expressive | None — slits are void, not eyes | |
| D-14 | Background | Warm, busy, landscape, warm ambient, crimson ambient | Void black or paper/ink only | |
| D-15 | Hair | Short, colored, missing in full-body shot, revealing face | Long heavy straight black hair — present, not dominant | |

**PASS count:** _____ / 15

**D-01 or D-03 score = 0?** → Immediate reject regardless of other scores.  
**All 15 PASS?** → Proceed to Section 5.

---

## SECTION 5 — SCORING TABLE

Score 0, 1, or 2 for each criterion. Maximum = 100. Must reach 90+ to advance.

| Criterion | Weight | Score 0 | Score 1 | Score 2 | Score |
|---|---|---|---|---|---|
| Helmet + sensor slits | 20 | Human eye visible; OR slits absent | Slits present but ambiguous or barely visible | Two clear ultra-narrow void-black slits, no human eye read | |
| Sword rectangular form | 15 | Tapered or curved | Mostly rectangular, slight softening | Perfect rectangular slab | |
| Palette correctness | 15 | Warm drift (gold/orange/red/crimson) | Mostly correct, minor tone shift | Void/porcelain/violet(#8F00FF)/silver accurate | |
| Silhouette legibility | 15 | Cannot read at distance | Readable with effort | Immediately clear — helmet + pauldrons + sword + hair | |
| Armor coverage | 10 | Exposed skin or gaps | Minor gap concern | Fully sealed | |
| Pauldron width | 10 | Narrower than or equal to head | Slightly wider | Significantly wider, matches spec | |
| Aesthetic axis | 10 | Anime/mech/demon/fantasy | Borderline — some sacred-tech reads | Sacred-tech clearly dominant | |
| Hair presence + hierarchy | 5 | Hair absent; or hair dominates composition | Present but short/colored/wrong form | Long heavy straight black — present, silhouette contributor | |

**TOTAL SCORE:** _____ / 100

**Threshold:**
- 90–100: Strong candidate → proceed to Anchor Gate
- 75–89: Conditional → note fails, retry with adjusted prompt
- 50–74: Weak → significant drift, rebuild prompt
- Below 50: Reject → document failure mode

---

## SECTION 6 — ANCHOR GATE

Only run if: 15/15 Drift Checks PASS + Score 90+.

| # | Requirement | Check |
|---|---|---|
| AG-01 | D-01 scored 2/2 (not 1) — slits clearly present, unambiguous | ☐ |
| AG-02 | D-03 scored 2/2 (not 1) — sword perfectly rectangular | ☐ |
| AG-03 | Silhouette matches B_MONOLITH at thumbnail — all 8 SG checks pass | ☐ |
| AG-04 | Material zones 1–5 all rendering correctly | ☐ |
| AG-05 | No warm tones visible anywhere in the image | ☐ |
| AG-06 | Human visual approval — output is accepted as viable reference | ☐ |

**All 6 AG checks checked?** → This output qualifies as CHARACTER ANCHOR V1 CANDIDATE.

**Designation action:**
- Save output as `docs/character/anchor/CHARACTER_ANCHOR_V1_CANDIDATE.png`
- Record generation parameters (model, steps, CFG, seed, prompt used)
- Return to agent for formal scoring and record writing

---

## SECTION 7 — REJECT EXAMPLE CROSS-CHECK (final step)

Before accepting any anchor candidate, confirm it does NOT visually resemble any of these:

| File | Drift pattern | Confirmed NOT matching? |
|---|---|---|
| REJECT_GOLDEN_MASK_001 | Warm gold helmet | ☐ |
| REJECT_BAD_PLASTIC_00 | Plastic surface on helmet | ☐ |
| REJECT_BAD_FLAT_00 | Completely flat surface, no material character | ☐ |
| REJECT_BAD_NOISE_00 | Excessive noise overriding form | ☐ |
| REJECT_BAD_MULTISHAPE_00 | Figure reads as multiple shapes, no hierarchy | ☐ |

**All confirmed NOT matching?** → Anchor candidate is valid for human designation.

---

*MIKAGE_CHARACTER_ANCHOR_V1_REVIEW_CHECKLIST — 2026-05-15 — Not canon-locked — Not asset-locked*
