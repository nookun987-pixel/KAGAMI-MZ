# MIKAGE_ZENITH_BLADE_3PHASE_REBUILD_V0_7 — LANE B INDEPENDENT BLOCKER ANALYSIS

Status: independent (Lane B / Cowork) confirmation of Codex's V0_7 STOP. No canon-lock,
no asset-lock, no production-ready/PASS claim. This round also CORRECTS the V0_6 analysis.

## 1. Codex result
FAIL, honest STOP, no retry — correct. Blockers: P2_CLIP_VIOLATION, HUE_VIOLATION,
PHASE_SEPARATION_VIOLATION. Glare tamed (P2 clip 0.69 -> 0.58). Materials: MID strength 0.02
(P2), MAX strength 0.09 (P3); emission base linear (0.33,0,1.0) confirmed unchanged.

## 2. HEADLINE: the color is a PERFECT #8F00FF. Gate B measured it in the WRONG color space.
Gate B measures hue/R-B on the SCENE-LINEAR EXR body and compares to the band 268-280 deg /
R/B 0.45-0.65. But that band is #8F00FF's DISPLAY (sRGB) values. In LINEAR space #8F00FF is a
different number. Verified math:
- #8F00FF DISPLAY/sRGB: hue 273.6 deg, R/B 0.561.
- #8F00FF LINEAR (EXR space): hue 256.5 deg, R/B 0.275.
- V0_7 EXR body measured: hue 256.3 deg, R/B 0.278  ->  == #8F00FF in linear, essentially exact.
- V0_7 EXR body converted linear->sRGB: hue 271.4 deg, R/B 0.564  ->  == #8F00FF display, exact.
- Codex's own PNG body cross-check: P2 267.8 deg / P3 268.9 deg, R/B ~0.50 (in/at the display band).
- Lane B independent contact-sheet scan of the UNCLIPPED body: P2 268.5 deg R/B 0.507,
  P3 269.1 deg R/B 0.498 -> inside the display band.
CONCLUSION: a physically correct #8F00FF blade CANNOT pass gate B as written, because the gate
compares a linear-space measurement to a display-space target. This is FAIL_VALIDATION_METHOD.
The color question is SOLVED — the emission is #8F00FF in both spaces. Correction to the V0_6
note: the "hot body reads 274 deg" was itself a display-space read; the linear truth is 256.5 deg,
which is the SAME color (#8F00FF) — not a contradiction, just the two spaces of one correct color.

## 3. P2_CLIP 0.58 — real, but it is the glowing-core-clips physics problem
Bloom discipline moved clip 0.69 -> 0.58 (Lane B scan 0.66-0.67), still > 40%. A saturated
emissive core line clips in the tonemapped PNG by nature. Driving it under 40% likely requires
killing the glow so hard the MAX read dies. The clip gate is probably also fighting physics and
should be redefined (e.g. require a solid saturated body to EXIST, not clip-fraction < 40%).

## 4. PHASE_SEPARATION — the ONE genuinely unsolved problem
EXR energy: P2 0.7302 vs P3 0.7179 -> ratio 0.983 (P3 ~= P2, essentially EQUAL). Envelope 1.15.
EXR body medians are near-identical: P2 (1.486,0.043,5.343) vs P3 (1.494,0.018,5.402).
MAX strength (0.09) is 4.5x MID (0.02), yet the measured core radiance is ~1x. So the strength
difference is NOT reaching the measured core. Candidates (need Codex DIAGNOSIS, not tuning):
- glare "Maximum": 4.0 may clamp both phases to the same ceiling;
- the phase driver may not actually swap to a hotter emitter at P3, or MID/MAX assignment/visibility
  per phase is not what the strengths imply;
- the measured "body" may be a saturated plateau where extra strength adds bloom width, not core
  luminance (envelope grew 1.15x while core energy stayed flat — consistent with this).
This is why MID->MAX does not read at thumbnail scale. It must be diagnosed at the emitter before
any new strength number is chosen.

## 5. Direction for V0_8 (recommendation)
Color is DONE (#8F00FF, proven). Two real items remain, and the gate battery needs a fix:
  (a) GATE B METHOD: measure hue/R-B in DISPLAY/sRGB space (either the unclipped PNG body, or the
      EXR body converted linear->sRGB), band 268-280 / 0.45-0.65. Under this, V0_7 color already
      passes (~271 deg, R/B 0.56). Alternatively keep EXR-linear and set linear targets
      (~254-260 deg, R/B ~0.24-0.32). Do not keep comparing across spaces.
  (b) PHASE SEPARATION: require Codex to FIRST report per-phase source emitter radiance and confirm
      the phase driver swaps MID->MAX (and that glare Maximum is not clamping), THEN set MAX so
      EXR core energy P3 >= 1.5x P2. Fix the wiring, not just the number.
  (c) CLIP GATE: redefine to a physics-real criterion (solid saturated unclipped body present +
      controlled bloom), not clip-fraction < 40% on a glowing line.
Keep locked: geometry/rig/attachment, emission base color, one line, zero red, P1 sealed.
