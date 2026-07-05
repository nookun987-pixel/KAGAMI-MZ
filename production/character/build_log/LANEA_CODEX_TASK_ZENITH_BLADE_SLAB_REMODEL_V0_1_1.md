# LANEA_CODEX_TASK_ZENITH_BLADE_SLAB_REMODEL_V0_1_1 — SEAM HUE FIX
### Narrow follow-up to MIKAGE_ZENITH_BLADE_SLAB_REMODEL_V0_1 (geometry PASS, color FAIL). Material/render only — do NOT touch geometry.

## Why
V0_1's geometry is confirmed correct (W/L=0.240, in the 0.22-0.26 range; broad slab reads correctly
from every angle except edge-on). But Lane B independently pixel-sampled the rendered seam (not the
material node value) and found it reads pale pink/lavender — measured `#DBB1F5` at the emission core,
falling off to `#A36BCC` at the edge. This is NOT the required blue-dominant violet. This is the exact
same class of drift previously found and fixed on the helmet slits (V0.8 -> V0.8.1): the node value can
say `#8F00FF` while the actual rendered pixel (after bloom/exposure/color-management) reads magenta/pink.
Trust the rendered pixel, not the node value — same rule as before.

## Reference target
The helmet slits (already correct, do not touch them) sample as blue-dominant violet, e.g. `#870DFF`
(R135,G13,B255) or `#9718F8` (R151,G24,B248) — red channel notably lower than blue. The blade seam
right now samples `#DBB1F5` (R219,G177,B245) at core / `#A36BCC` (R163,G107,B204) at falloff — red is
much too close to blue, reading warm/pink instead of cool/violet.

## Required fix
1. Base: `production/character/production_actor/rig_derivatives/MIKAGE_ZENITH_BLADE_SLAB_REMODEL_V0_1.blend` (the just-produced candidate, geometry locked from here).
2. Adjust the blade seam's emissive material ONLY: reduce the red channel of the linear emission input color (same fix pattern as the V0.8.1 slit fix, which went from linear (0.27,0.0,1.0) to (0.05,0.0,1.0)). If bloom/exposure on the seam is also contributing to the pink wash, reduce it too — but do not change the blade mesh/geometry/transform in any way.
3. Re-render the same 3 proof assets (wireframe, turntable, key art) from the corrected material.
4. Pixel-sample the ACTUAL rendered seam color at 2+ points (core + falloff edge) on at least 2 of the 3 renders, and report the real RGB/hex values in the proof — not the node value. Compare against the helmet slit samples above; the seam should land in the same blue-dominant family (R notably lower than B, G lowest of the three).

## Locked (unchanged from V0_1)
Everything from V0_1's LOCKED list, PLUS: blade geometry itself (slab proportions, tip, seam channel
shape, ring position/size, grip) — this task is material/color ONLY on the seam emission. Do not touch
mesh, transform, or the ring/grip materials.

## Success
- Rendered seam pixel-sampled at 2+ points reads blue-dominant violet (red channel clearly below blue,
  not close to it) — report exact hex/RGB values measured, not asserted.
- Geometry hash/measurements identical to V0_1 (W/L=0.240, parallel-edge/tip fractions unchanged).
- Ring, grip, slab body materials unchanged.
- Gate folder holds exactly `contact_sheet.png` + `contact_sheet_review_report.md`; `python .mikage/tools/verify_output.py` prints PASS; no `.blend1`.

## Fail
- Rendered pixel still reads pink/magenta (red channel close to or above blue) -> `BLOCKER = SLIT_HUE_FAIL` (reuse the same blocker name as the helmet precedent).
- Any blade geometry/transform change -> `BLOCKER = SCOPE_VIOLATION`.
- Gate mis-schema'd -> `BLOCKER = VALIDATOR_SCHEMA_MISMATCH`.

## Out of scope
- The KF05 comic-panel comparison requested in V0_1's original brief — Lane B searched both the KAGAMI
  repo and the Studio OS project and found no file by that name. Drop this requirement; the SVG-reference
  silhouette comparison already done in V0_1 is sufficient. Do not block on KF05 again.
- Do not touch the public site/deck build cards.

STATUS: spec LOCKED. Codex executes in Blender. Not production-ready until pixel-sampled hue passes and operator approves.
