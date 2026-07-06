# LANEA_CODEX_TASK_ZENITH_BLADE_3PHASE_REBUILD_V0_5

STATUS: revision of exception #57 (`MIKAGE_ZENITH_BLADE_3PHASE_REBUILD_V0_4`). V0_4 result:
`TECHNICAL_STATUS = CANDIDATE_PASS`, `BOOS VISUAL RULING = FAIL_VISUAL` (2026-07-07, full ruling:
`production/character/reviews/MIKAGE_ZENITH_BLADE_3PHASE_REBUILD_V0_4_VISUAL_RULING.md`).
V0_4's execution and honesty were correct; the failure is in WHAT was measured and WHAT was targeted.

## 0. Why V0_4 failed visually (both causes confirmed by measurement, not by eye)

**Cause 1 — the hue was never violet.** The emission base color `(0.015, 0.0, 0.800)` linear has
almost no red channel. Whatever the strength, the tonemapped core body can only land around hue
`244–245°` (cobalt/indigo). Measured core-body medians on the V0_4 contact sheet: P2 `(48,33,255)`
hue `243.9°` R/B `0.19`; P3 `(38,19,255)` hue `245.1°` R/B `0.15`. Brand electric violet `#8F00FF`
is hue `273.6°`, R/B `0.56`. The core is ~30° too blue AT THE SOURCE. Cutting strength (V0_4's fix)
could never correct this — the base emission COLOR itself must gain red. This means the previous
"base hex unchanged" lock is EXPLICITLY LIFTED for this task: correcting the emission color's R
channel toward `#8F00FF` is the point of the task.

**Cause 2 — P2 and P3 no longer separate.** V0_4 cut both strengths to the same value
(`0.05 / 0.05`). P3 is ~1px wider and slightly more saturated but its per-pixel luminance is ~12%
LOWER than P2; total energy only ~3–4% higher. At contact-sheet scale P2 ≈ P3. MID → MAX must be
re-established by ENERGY (luminance), not by making P3 bluer or thicker.

**Method finding.** The `B-R >= 40` peak-pixel gate proves only "not red / not white" — the peak
pixel is bloom-clipped and does not represent the core body. From this task on, the color gate
measures the MEDIAN of solid core-body pixels in the final rendered PNG, excluding bloom, clipped
highlights (any channel = 255), and edge/antialias pixels.

## 1. SCOPE — MATERIAL/RENDER ONLY (geometry boundary same as V0_3/V0_4)

Do not touch: mesh geometry, silhouette, proportions, ring, point-down tip, panel spacing/hierarchy,
seam geometry/position/width, the `ZB3_PHASE_CONTROL["blade_phase"]` driver system, rig, bones,
camera, pose, or the weapon attachment point/transform `(1.08, -0.02, 1.75)`. Reuse V0_4's shape
byte-identical. What MAY change: the core/seam material's emission COLOR (this time yes — see Cause
1), per-phase emission STRENGTH, bloom/compositor settings, and proof-render exposure.

## 2. OBJECTIVE

Correct the rendered core from blue/indigo to brand electric violet, and restore a clearly readable
MID → MAX phase separation — in ONE pass.

## 3. LOCKS — DO NOT CHANGE

- Geometry, silhouette, transforms, camera, pose and blade attachment
- Core seam geometry, position and physical width (identical in P2 and P3)
- Exactly one straight core line — no secondary seam, no duplicated line
- P1 remains fully sealed (zero emissive core pixels)
- No red/crimson/#E60000 family anywhere at any phase
- No violet wash onto the blade body
- No `.blend1` left behind
- No commit, no push, no deploy

## 4. COLOR GATE — MEASURE THE FINAL PNG, NOT THE MATERIAL INPUT

Sample ONLY the solid inner body of the core line. Exclude bloom, clipped highlights (any channel
at 255 counts as clipped), and edge/antialias pixels. Report the sampling mask.

P2 and P3 target (median of sampled core-body pixels):
- Hue (HSV): `268°–280°`
- R/B ratio: `0.45–0.65`
- Blue-dominant violet; reference center `#8F00FF`
- AUTO-FAIL if median hue `< 260°` or R/B `< 0.40`

## 5. PHASE SEPARATION GATE

- P2 = controlled MID activation; P3 = unmistakable MAX activation
- P3 must be the SAME hue as P2 (within the 268–280° band) — do NOT differentiate by shifting P3
  toward blue
- P3 median linear luminance (scene-linear, from the same core-body mask) >= `1.5×` P2
- P3 bloom envelope may expand, but must remain around the same single line
- Physical seam width identical in P2 and P3
- AUTO-FAIL if P3 luminance `< 1.5× P2`, or P3 differs from P2 only by hue shift

## 6. VALIDATION & REQUIRED EVIDENCE

1. P1/P2/P3 contact sheet (same camera/framing as V0_4) — three phases must be distinguishable at
   thumbnail size.
2. Median RGB, HSV hue, R/B ratio and median linear luminance for P2 and P3 core bodies.
3. Marked sampling regions (boxes or mask overlay image) proving bloom/clipped/edge pixels were
   excluded.
4. Initial and final validator reports (`validate_task.py` / `verify_output.py`).
5. P1 zero-emissive check; single-line check; zero red/crimson scan (`R > B+35 && R > G+35`).
6. Geometry/rig/attachment hash audit vs V0_4 (byte-identical expected).
7. Blend reopen audit: final emission color + per-phase strengths read back from the saved V0_5 file.

## 7. REAL DELIVERABLES

- `production/character/production_actor/rig_derivatives/MIKAGE_ZENITH_BLADE_3PHASE_REBUILD_V0_5.blend`
- `production/character/reviews/MIKAGE_ZENITH_BLADE_3PHASE_REBUILD_V0_5_CONTACTSHEET_FRONT_P1P2P3.png`
- `production/character/reviews/MIKAGE_ZENITH_BLADE_3PHASE_REBUILD_V0_5_SAMPLING_REGIONS_P2P3.png`
- `production/character/reviews/MIKAGE_ZENITH_BLADE_3PHASE_REBUILD_V0_5_KEYART_P3.png`
- `production/character/reviews/MIKAGE_ZENITH_BLADE_3PHASE_REBUILD_V0_5_PROOF.md`

Gate folder (CONTACT_SHEET_ONLY — exactly two files): `_tmp/mikage_zenith_blade_3phase_rebuild_v0_5_gate/`
containing `contact_sheet.png` + `contact_sheet_review_report.md`.

## 8. FAILURE PROTOCOL

If the color gate or phase gate cannot be met inside this scope, STOP, report honestly with the
measured numbers, no retry loop, no PASS claim. If the validator itself measured peak instead of
core body, report `FAIL_VALIDATION_METHOD`. No canon-lock, no asset-lock, no production-ready
claim. Stop after proof for operator review.
