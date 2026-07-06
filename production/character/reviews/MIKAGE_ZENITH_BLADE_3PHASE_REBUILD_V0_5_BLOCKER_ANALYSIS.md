# V0_5 BLOCKER ANALYSIS — COLOR_AND_PHASE_GATE_FAIL (2026-07-07, Lane B)

Codex stopped correctly per no-retry protocol. Independent Lane B re-measurement of the V0_5
contact sheet CONFIRMS Codex's numbers and identifies the failure as a MEASUREMENT-STRUCTURE
problem, not an execution problem.

## Confirmed numbers (Lane B independent scan of the contact sheet)

| Metric | P2 | P3 |
|---|---:|---:|
| Solid core-body median RGB | (102,30,210) | (96,21,200) |
| Median hue | 264.0° | 265.1° |
| R/B | 0.486 | 0.480 |
| CLIPPED core pixels (any ch ≥250) | 10,488 (~80%) | 12,019 (~82%) |
| Solid (measurable) core pixels | 2,687 | 2,582 |
| Glow envelope area (PNG) | 19,738 px | 20,895 px (+6%) |
| TOTAL linear energy from PNG | 3,980 | 4,058 (+2%) |

## Findings

1. **The 1.5× luminance gate is physically unmeasurable on a tonemapped PNG.** ~80% of the core
   line clips; a clipped pixel shows 255 whether the radiance is 1× or 4×. Excluding clipped
   pixels leaves only the dim fringe/below-ring tail (see V0_5 sampling image), where P3
   legitimately measures DIMMER. Codex's 4× strength increase is invisible to the PNG — median,
   total, and the human eye all agree: P3 ≈ P2 on screen.
2. **Consequence: raising P3 strength further can never pass, visually or numerically.** The
   energy gate must move to scene-linear EXR (pre-tonemap, unclipped), and the VISUAL separation
   must come from structure (P2 de-clipped to a readable MID body + P3 bloom envelope growth),
   not from more strength.
3. **Hue is nearly there:** 264–265° vs gate 268–280°. One more red nudge of the emission color,
   iterated against the PNG median, closes it. (V0_4 was 244°; V0_5's color direction was right.)

## Disposition

Proceed to `MIKAGE_ZENITH_BLADE_3PHASE_REBUILD_V0_6` (exception #59) with a corrected,
physically measurable gate set. V0_5 blend + sampling image + this analysis are kept as audit
trail. No retry of V0_5's method.
