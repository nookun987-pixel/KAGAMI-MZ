# ASSET-BUILD-10F — Canon Gate Sprint Report
**Date:** 2026-05-14  
**Status:** DIAGNOSTIC COMPLETE — No pass candidate found  
**Canon gate threshold:** ≥85/100 for FINAL_HERO

---

## 1. SPRINT OBJECTIVE

Attempt to find or generate an image scoring ≥85 on canon gate (`mikage_zenith.json`) to unlock FINAL_HERO status before ASSET-BUILD-11 bust bridge.

---

## 2. CANDIDATES TESTED

### Round 3 Baseline (pre-sprint)
- All R3 images: **79/100** — plateau
- Lowest categories: production_usability(4), blade(6), environment(9), helmet(11)

### Round 4 — ChatGPT/Imagen Full-Body References (16 images)
- Location: `MIKAGE_CANON/09_GEN_ROUND_4_REFERENCE/`
- Canon gate results: **72–77/100** — WORSE than R3
- Root cause: Figure too small in frame → `white_ratio` too low → helmet/armor scores drop
- `environment` improved to 10/10 (dark BG in prompts) but `helmet` dropped to 9-10 due to small figure

### MASK_V3 Pipeline Frames (April 12 2026 batch)
- Source: Google Drive — 50+ frames from ComfyUI MASK_V3 pipeline
- Downloaded samples: 7 files to `MIKAGE_CANON/09_GEN_ROUND_4_REFERENCE/MASK_V3_SAMPLE/`
- Content: ALL are white porcelain helmet closeups on gray background (anchor slit pattern)
- NOT full-body compositions
- Predicted scores: **72–76/100**
  - helmet: ~15/20 (high white_ratio ✓)
  - blade: ~2/10 (no blade, gray bg hurts dark_ratio ✗)
  - environment: ~6/10 (gray bg, not dark ✗)
  - non_sexualized: 20/20 ✓
- Verdict: **WILL NOT PASS** — gray background kills blade+environment

---

## 3. CANON GATE FORMULA DECODED (key blockers)

```python
# HELMET — needs high white_ratio + low_saturation
porcelain = clamp(0.65 * white_ratio + 0.35 * low_saturation)
shell_like = clamp(0.45 * porcelain + 0.25 * contrast + 0.30 * edge_density)
face_clear = 1.0 - clamp(max(center_skin_ratio, center_warm_ratio))
helmet_score = clamp(0.45*porcelain + 0.30*face_clear + 0.25*shell_like) * 20

# BLADE — needs dark_ratio + contrast + edge_density
blade_like = clamp(0.40 * contrast + 0.35 * edge_density + 0.25 * dark_ratio)
blade_score = clamp(0.50*blade_like + 0.25*clutter_clear + 0.25*contrast) * 10

# ENVIRONMENT — needs dark_ratio (dark bg critical)
environment_like = clamp(0.40 * dark_ratio + 0.35 * low_saturation + 0.25 * clutter_clear)
environment_score = environment_like * 10

# PRODUCTION — needs min(image.size) >= 1024px
resolution_score = clamp(min(image.size) / 1024.0)
production_score = clamp(0.40*resolution_score + 0.25*aspect_score + 0.20*contrast + 0.15*brightness) * 5
```

---

## 4. SCORE GAP ANALYSIS — What needs to change to reach 85

Current R3 best: **79/100**. Gap: **6 points**.

| Category | R3 Score | Max | Gap | Fix Required |
|---|---|---|---|---|
| helmet | 11 | 20 | -9 | Figure must fill 80%+ of frame; white armor dominant |
| blade | 6 | 10 | -4 | Blade must be large, dark, high-contrast; fills lower frame |
| environment | 9 | 10 | -1 | Pure black background only |
| production_usability | 4 | 5 | -1 | Export at ≥1024px min side |
| armor | 13 | 20 | -7 | More white sealed panels, less gap |
| face_traits | 12 | 15 | -3 | Zero skin pixels in center zone |
| non_sexualized | 18 | 20 | -2 | No warm/skin tones anywhere |

**Minimum viable fix for +6:**
- Pure black background → environment +1
- Figure fills 80%+ of frame → helmet +3, armor +2
- Export ≥1024px → production +1
= **+7 points → 86/100 predicted**

---

## 5. RECOMMENDED PATH TO ≥85

```
PROMPT ADDENDUM FOR NEXT GENERATION:
- Figure fills 80%+ of frame (tight 3/4 shot or bust, NOT full body standing)
- Pure black (#000000) background — NO gray, no gradient
- Blade/weapon occupies lower 30% of frame, dark steel, high contrast
- Export at minimum 1024x1024
- No face exposure — full helmet seal
```

**Composition guidance:**
- AVOID: full-body standing figure with empty sky/floor
- USE: 3/4 body shot, figure from thighs up, fills frame edge to edge
- Blade: held diagonally, visible against dark bg, steel/dark material
- Armor: close enough that individual panels are visible

---

## 6. CURRENT STATUS

- No ≥85 candidate found this sprint
- Canon gate formula fully understood — scoring is predictable
- MASK_V3 frames confirmed as helmet-only, not useful for full-body canon gate
- Recommended: generate revised composition per Section 5 prompt addendum

---

## 7. HANDOFF STATE

Per `00_LATEST_CODEX_HANDOFF.md`:
- Canon gate eligibility: REQUIRES bust bridge composite first
- NEXT_SAFE_TASK: **ASSET-BUILD-11_BUST_BRIDGE_COMPOSITE** (requires human authorization)
- This sprint was exploratory — no handoff advancement
- Bust bridge authorization still pending

---

*Report generated: 2026-05-14*
