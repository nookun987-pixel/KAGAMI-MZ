# LANEA_CODEX_TASK_ZENITH_BLADE_3PHASE_REBUILD_V0_8

STATUS: revision of exception #60 (`V0_7`). V0_7 result: honest STOP, all three gates FAIL,
no retry — correct. This round does NOT tune color. Operator BOOS ruling 2026-07-11: the color
#8F00FF is verified correct; fix the mis-specified gates and DIAGNOSE the phase wiring.

## 0. What V0_7 proved (read before doing anything)

Lane B analysis (`production/character/reviews/MIKAGE_ZENITH_BLADE_3PHASE_REBUILD_V0_7_BLOCKER_ANALYSIS.md`):

1. THE COLOR IS A PERFECT #8F00FF. Gate B failed ONLY because it measured hue/R-B on the
   scene-linear EXR and compared to the DISPLAY-space band (268-280 deg / R/B 0.45-0.65). In linear
   space #8F00FF is hue 256.5 / R/B 0.275 — and the EXR body measured 256.3 / 0.278 (exact match).
   Converted linear->sRGB the same body is 271.4 / 0.564 (== #8F00FF display); the PNG cross-check
   and Lane B scan read ~268-269 / 0.50 (in the display band). A correct blade cannot pass gate B as
   written. Color is DONE — do not touch the emission hex.

2. PHASE SEPARATION is the one real problem. EXR energy P2 0.7302 vs P3 0.7179 = ratio 0.983
   (essentially EQUAL) although MAX strength (0.09) is 4.5x MID (0.02). The strength is not reaching
   the measured core. Suspect glare "Maximum": 4.0 clamping the core to a shared ceiling, or the
   ZB3_PHASE driver not actually swapping MID->MAX. This must be DIAGNOSED, not tuned.

## 1. SCOPE — GLARE/BLOOM + STRENGTH + EXPOSURE + COLOR-GATE METHOD. BASE COLOR LOCKED.

Base file: `production/character/production_actor/rig_derivatives/MIKAGE_ZENITH_BLADE_3PHASE_REBUILD_V0_7.blend`
(geometry byte-identical chain V0_2→V0_7). Locked: geometry, silhouette, seam geometry/position/width,
`ZB3_PHASE_CONTROL` drivers, rig, camera, pose, attachment `(1.08,-0.02,1.75)`. **EMISSION BASE COLOR
LOCKED** at linear `(0.33,0.0,1.0)`. May change ONLY: per-phase glare/bloom, per-phase emission
strengths, proof exposure, and the color-gate MEASUREMENT method. P1 sealed. Zero red. One line.
No `.blend1`. No commit/push/deploy.

## 2. GATES

**A. BODY INTEGRITY (replaces the clip-fraction gate):**
A solid unclipped in-band violet body must EXIST along the FULL seam. Report: unclipped in-band body
pixel count per phase, and confirm every sampled cross-section along the seam has >= 1 unclipped
in-band violet pixel (so the true color is genuinely readable, not only bloom fringe). Bloom stays
controlled (no runaway wash). Clip fraction is reported as INFO only — it is no longer a pass/fail.

**B. COLOR — measured in DISPLAY/sRGB space (both phases):**
Sample the unclipped in-band body; measure hue/R-B in sRGB (either the unclipped PNG body, or the
EXR body converted linear->sRGB). Band `268-280 deg` + R/B `0.45-0.65`, ref `#8F00FF`, auto-FAIL
`<260` or R/B `<0.40`. NEVER compare a linear measurement to this display band. (Expected: PASS at
~271 deg / 0.56 with the current color — this is a confirm gate.)

**C. PHASE SEPARATION — DIAGNOSIS FIRST, then energy:**
Step 1 (mandatory, before choosing any MAX strength): report the per-phase SOURCE emitter radiance
(emission base * strength, or a tiny unbloomed emitter-surface sample); confirm the ZB3_PHASE driver
actually swaps MID->MAX material/visibility between P2 and P3; confirm glare "Maximum" (currently
4.0) is not clamping the core to a shared ceiling (measure the EXR core with glare Maximum raised or
disabled and compare). If the driver does not swap or glare clamps the core, report
`PHASE_WIRING_BLOCKER` with the finding and STOP.
Step 2 (only after wiring is understood): set MAX strength / glare so EXR core energy
`P3 >= 1.5x P2` (median linear luminance over the phase-aware core mask that excludes the P3 gap).
Report both energies, the ratio, the mask definition, and the diagnosis from step 1.

**D. VISUAL MAX ENVELOPE (secondary):**
P3 glow envelope area `>= 1.3x` P2 on the display PNG, same threshold both phases (report it). No
second seam, no wash, physical seam width identical, no hue shift toward blue. Energy (gate C) is the
primary MID->MAX proof; envelope is the secondary read.

## 3. REQUIRED EVIDENCE

Contact sheet (phases readable at thumbnail); GATE_TABLE.md with: display-space body hue/R-B P2+P3
and the method used; per-phase source emitter radiance; driver-swap confirmation; glare-clamp check
result; EXR core energy P2/P3/ratio + mask definition; unclipped in-band body pixel counts + clip
fraction (INFO); envelope areas + threshold. Full-seam sampling-regions image with exclusions.
Zero-red scan; P1 zero-emissive; geometry hash audit vs V0_7; blend reopen audit (base color
unchanged + final strengths + final glare settings).

## 4. REAL DELIVERABLES

- `production/character/production_actor/rig_derivatives/MIKAGE_ZENITH_BLADE_3PHASE_REBUILD_V0_8.blend`
- `production/character/reviews/MIKAGE_ZENITH_BLADE_3PHASE_REBUILD_V0_8_CONTACTSHEET_FRONT_P1P2P3.png`
- `production/character/reviews/MIKAGE_ZENITH_BLADE_3PHASE_REBUILD_V0_8_SAMPLING_REGIONS_P2P3.png`
- `production/character/reviews/MIKAGE_ZENITH_BLADE_3PHASE_REBUILD_V0_8_GATE_TABLE.md`
- `production/character/reviews/MIKAGE_ZENITH_BLADE_3PHASE_REBUILD_V0_8_KEYART_P3.png`
- `production/character/reviews/MIKAGE_ZENITH_BLADE_3PHASE_REBUILD_V0_8_PROOF.md`

Gate folder (CONTACT_SHEET_ONLY — exactly two files): `_tmp/mikage_zenith_blade_3phase_rebuild_v0_8_gate/`
→ `contact_sheet.png` + `contact_sheet_review_report.md`.

## 5. FAILURE PROTOCOL

If any gate cannot be met inside scope: STOP, report the measured numbers, no retry loop. Blocker
codes: `PHASE_WIRING_BLOCKER` (driver not swapping / glare clamps the core), `PHASE_SEPARATION_VIOLATION`
(energy ratio < 1.5x after wiring is fixed, or envelope < 1.3x), `HUE_VIOLATION` (display-space band),
`BODY_INTEGRITY_VIOLATION` (no solid unclipped in-band body along the seam), `FAIL_VALIDATION_METHOD`
(measured color across color spaces, or wrong region), `SCOPE_VIOLATION` (geometry/rig/attachment or
base-color change), `SIGNAL_DISCIPLINE_VIOLATION`. No canon-lock, no asset-lock, no production-ready
claim. Stop after proof for operator review.
