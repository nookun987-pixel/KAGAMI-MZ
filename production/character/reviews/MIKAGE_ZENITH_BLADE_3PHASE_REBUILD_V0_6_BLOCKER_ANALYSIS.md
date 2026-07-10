# MIKAGE_ZENITH_BLADE_3PHASE_REBUILD_V0_6 — LANE B INDEPENDENT BLOCKER ANALYSIS

Status: independent (Lane B / Cowork) confirmation of Codex's V0_6 STOP. No canon-lock,
no asset-lock, no production-ready/PASS claim. UNCONFIRMED items marked as such.

## 1. Codex result (as reported)
FAIL, honest STOP, no retry — correct behavior. Blockers: HUE_VIOLATION, P2_CLIP_VIOLATION,
PHASE_SEPARATION_VIOLATION. Emission color linear (0.33, 0.0, 1.0); P2 strength 0.014, P3 0.145.
Gate-table numbers: P2 hue 265.85 deg / P3 267.27 deg; P2 clip fraction 0.6937; EXR ratio 0.6012
(P3 DIMMER than P2); envelope ratio 1.2039.

## 2. Lane B independent pixel scan (contact sheet 3600x1800)
Method: broad emissive-core mask B>120 & B>1.3R & B>2G over the full sheet, and per-panel.
- Whole-core median RGB [159, 33, 255] -> hue 274.1 deg, R/B 0.624 (IN the 268-280 band).
- Panel 2 (P2): 5894 emissive px, median [158,42,255], G mean 42.6, clip 0.707.
- Panel 3 (P3): 6592 emissive px, median [159,26,255], G mean 27.4, clip 0.722.
- Core clip fraction (any channel 255): 0.71 — corroborates Codex's ~0.69.
- Median hue if G forced to 0: 277.4 deg.

## 3. Why Codex measured 266 deg and Lane B measured 274 deg — SAME render, both correct
Codex's gate excludes clipped (>=250) and edge/AA pixels — the "solid unclipped body." Lane B's
mask INCLUDES the hot clipped body. The gap is the whole problem:
- ~70-80% of the core clips to B=255. The hot body, if it were not clipped, reads ~274 deg
  (on-brand #8F00FF, hue 273.6, R/B 0.56).
- The only UNCLIPPED pixels left for Codex's gate are the dim antialiased fringe, which carries
  a green floor (G ~33-43) from bloom/glare white spill. That fringe reads ~266 deg and fails.
=> The hue "failure" is a MEASUREMENT-REGION artifact of over-clipping, not a base-color error.
The base violet is essentially already correct.

## 4. Root cause = BLOOM/GLARE white spill, NOT emission strength
- P2 strength was dropped to 0.014 (very low) yet clip stayed 0.69-0.71. Emission strength is
  therefore NOT the clipper. The glare/bloom node blooms the line to 255 across a wide band and
  injects the green-ish white fringe that poisons the unclipped-body hue sample.
- P2 is greener than P3 (G 42.6 vs 27.4) precisely because its lower strength makes it relatively
  MORE bloom-fringe-dominated. Lowering strength further makes hue WORSE, not better — a trap.

## 5. Why EXR ratio 0.60 (P3 dimmer than P2) — UNCONFIRMED, two candidates
P3 strength (0.145) is ~10x P2 (0.014) yet P3 EXR core-line median luminance is lower. Likely the
same-name "core-line mask" at P3's split/opened phase geometry includes dark split-gap pixels (or a
wider dispersed region), dragging the P3 median down. Needs the energy mask to track P3 phase
geometry and exclude the gap. Cannot confirm from PNG alone (EXR is transient, not in repo).

## 6. Direction for V0_7 (recommendation)
This is the 6th color/strength nudge (V0_1->V0_6). The nudge loop cannot converge because the
gate fights physics: a bright emissive blade WILL clip its core, so "median of unclipped body in
268-280 band" is close to unmeasurable while bloom saturates the line.
Fix the CLIPPER, and optionally the gate definition:
  (a) GLARE/BLOOM discipline: raise glare threshold / cut intensity / shrink size until core clip
      fraction < 40% so the true body (not the fringe) is unclipped and measurable.
  (b) VIEW TRANSFORM: if bloom alone insufficient, test a transform that does not desaturate the
      highlight to white (Standard vs AgX/Filmic) — a render setting, base hex unchanged.
  (c) GATE METHOD: measure core hue on the scene-linear EXR body (pre-tonemap, unclipped) instead
      of only on unclipped PNG pixels; and fix the energy mask to track P3 geometry.
Keep: geometry/rig/attachment locked, one line, zero red, P1 sealed.
