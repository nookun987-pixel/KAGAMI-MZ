# MIKAGE_ZENITH_BLADE_3PHASE_REBUILD_V0_8 — LANE B ANALYSIS (root cause FOUND)

Status: independent (Lane B / Cowork) reading of Codex's V0_8 diagnosis-first STOP. No canon-lock,
no asset-lock, no production-ready/PASS claim.

## 1. The diagnosis-first gate worked — it found the 8-round root cause
Codex stopped at gate C step 1 with `PHASE_WIRING_BLOCKER`. Finding:
`ZB3_PHASE_CONTROL["blade_phase"]` DOES NOT SWAP phase visibility. In every requested phase
(P1, P2, P3) the object `ZB3_P3_CONTINUOUS_VIOLET_SEAM` (MAX material, strength 0.09) stays VISIBLE
and `ZB3_P2_CONTINUOUS_VIOLET_SEAM` (MID material, strength 0.02) stays HIDDEN.

## 2. This retroactively explains every prior "phase separation" failure
Because both the "P2" and the "P3" render showed the SAME object (the P3/MAX seam), the measured
core was identical regardless of phase:
- V0_8 EXR energy P2 0.72492 vs P3 0.72589 = ratio 1.0013 (identical).
- V0_6/V0_7 energy ratios (0.60, 0.98) were the same artifact plus mask noise.
- Source emitter radiance is correctly 4.5x (MID B 0.02 vs MAX B 0.09) — but that 4.5x lived on a
  HIDDEN object, so it never reached any render. No amount of strength/glare tuning could ever have
  produced MID->MAX separation while the visibility driver was broken. The prior 8 rounds were
  tuning variables downstream of a broken switch.

## 3. Color is confirmed DONE (display-space gate passes)
DISPLAY body hue P2 269.17 / P3 269.42 deg, R/B 0.513 / 0.500 — both PASS the 268-280 / 0.45-0.65
band. In-band body px 1245 / 1604, every cross-section has an unclipped in-band pixel (body integrity
PASS). Clip fraction 0.56/0.57 is INFO only now. The V0_7 color-space fix is validated: measured in
the correct space, the emission is #8F00FF and passes.

## 4. What V0_9 must do — REPAIR THE VISIBILITY DRIVER (Lane A rig work)
The fix REQUIRES modifying `ZB3_PHASE_CONTROL` — a system LOCKED by every exception #54-#61. So V0_9
is a scope EXPANSION that needs operator authorization to lift that one lock. It is Lane A rig/driver
work (character rig / Blender), not a material tweak. Correct target behavior:
- P1 `Compact-Idle`: both violet seams hidden / emissive off (P1 zero-emissive must stay true).
- P2 `MID`: `ZB3_P2_CONTINUOUS_VIOLET_SEAM` VISIBLE (strength 0.02), P3 seam hidden.
- P3 `MAX`: `ZB3_P3_CONTINUOUS_VIOLET_SEAM` VISIBLE (strength 0.09), P2 seam hidden.
Keep LOCKED: all mesh geometry, proportions, seam geometry/position/width, rig bones, camera, pose,
attachment (1.08,-0.02,1.75), emission base color. Only the phase-visibility driver wiring/expression
changes.

## 5. Recommended sequencing
Option A (isolate): V0_9 = driver repair ONLY. Gate = each requested phase shows exactly the correct
seam set (rendered visibility audit for P1/P2/P3) + geometry/rig/attachment/base-color unchanged. NO
glare/strength tuning. Then V0_10 re-runs the color + energy + envelope battery on the now-correct
phases (energy P3 >= 1.5x P2 is LIKELY to pass automatically given the real 4.5x strength ratio).
Option B (combined): V0_9 = driver repair + full gate battery in one pass.
Lane B recommends Option A — the driver edit is the first invasive change in this whole arc; isolate
it, prove the swap, then tune with a working switch.
