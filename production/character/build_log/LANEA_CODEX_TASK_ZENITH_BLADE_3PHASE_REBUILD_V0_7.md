# LANEA_CODEX_TASK_ZENITH_BLADE_3PHASE_REBUILD_V0_7

STATUS: revision of exception #59 (`V0_6`). V0_6 result: honest STOP, all three gates FAIL,
no retry — correct behavior. This is the 6th color/strength nudge and the nudge loop cannot
converge. Operator BOOS ruling 2026-07-10: stop nudging base color; attack the CLIPPER and
measure hue pre-tonemap.

## 0. Why V0_6 failed and what actually changed (read before doing anything)

Lane B independently pixel-scanned the V0_6 contact sheet and confirmed every Codex number, then
found the failure is a MEASUREMENT/CLIPPER artifact, not a base-color error
(`production/character/reviews/MIKAGE_ZENITH_BLADE_3PHASE_REBUILD_V0_6_BLOCKER_ANALYSIS.md`):

- The hot core BODY already reads ~274 deg (on-brand #8F00FF, R/B 0.62) when the clipped pixels
  are INCLUDED. But ~71% of the core clips to B=255.
- The unclipped-body hue gate therefore samples only the dim antialiased bloom FRINGE, which
  carries a green floor (G ~33-43 from glare white spill) and reads 266 deg → HUE_VIOLATION.
- P2 strength was dropped to 0.014 yet clip stayed 0.69 → the CLIPPER is GLARE/BLOOM, not emission
  strength. Lowering strength further makes P2 greener (more fringe-dominated), not better.

Conclusion: the base violet is essentially correct. Fix the bloom that clips the body, and measure
hue where it is physically measurable (the scene-linear EXR body, pre-tonemap).

## 1. SCOPE — GLARE/BLOOM + STRENGTH + EXPOSURE ONLY. BASE COLOR LOCKED.

Base file: `production/character/production_actor/rig_derivatives/MIKAGE_ZENITH_BLADE_3PHASE_REBUILD_V0_6.blend`
(geometry byte-identical chain V0_2→V0_6). Locked exactly as #59: geometry, silhouette, seam
geometry/position/width, `ZB3_PHASE_CONTROL` drivers, rig, camera, pose, attachment
`(1.08, -0.02, 1.75)`. **EMISSION BASE COLOR LOCKED** at linear `(0.33, 0.0, 1.0)` — do NOT touch
the hex this round; the point is to prove de-clipping fixes the hue read. May change ONLY: per-phase
glare/bloom (threshold / intensity / size), per-phase emission strengths, proof exposure. P1 sealed.
Zero red. One line. No `.blend1`. No commit/push/deploy.

## 2. GATES (all measured, none by eye)

**A. DE-CLIP — PRIMARY GATE (final PNG, both phases):**
P2 AND P3 core-line clipped fraction (any channel ≥250) `<= 40%` (V0_6 was ~0.69-0.72). Achieve it
by taming glare/bloom so the body stops blooming to white — NOT by killing emission below a visible
level. The body must remain a solid, saturated violet line.

**B. HUE — measured on SCENE-LINEAR EXR core-body (pre-tonemap, unclipped), both phases:**
median of the core-body mask on the EXR: hue `268-280°`, R/B `0.45-0.65`, ref `#8F00FF`.
AUTO-FAIL `<260°` or R/B `<0.40`. Also report the PNG body hue on the now-unclipped body as a
cross-check (should now agree, ~272-276°). Do NOT measure hue on clipped pixels.

**C. ENERGY (scene-linear EXR) with a PHASE-AWARE mask:**
render P2 and P3 to EXR, identical settings; median linear luminance
(0.2126R+0.7152G+0.0722B) over an emissive-core mask that TRACKS each phase's geometry and
EXCLUDES the P3 split-gap / background: `P3 >= 1.5x P2`. Report the mask definition and both
medians + the ratio. (V0_6's 0.60 ratio is suspected to come from the mask counting P3 gap pixels —
this gate must not repeat that.)

**D. VISUAL MAX (final PNG):**
P3 glow/bloom envelope area `>= 1.3x` P2's, same threshold definition both phases (report it). P3
blooms wider around the SAME single line — no second seam, no wash on the body, physical seam width
identical, no hue shift toward blue.

## 3. REQUIRED EVIDENCE

1. P1/P2/P3 contact sheet — three phases distinguishable at thumbnail size.
2. Gate table: PNG clip fractions P2+P3; EXR body median RGB/hue/R-B P2+P3; EXR energy median lum
   P2, P3, ratio, and the mask definition used; glow envelope areas + threshold.
3. Marked sampling-regions image — FULL seam length (above and below the grip ring), clip/edge
   exclusions shown per region; plus the EXR-body sample regions used for the hue gate.
4. Initial + final validator reports; zero-red scan; P1 zero-emissive check; geometry hash audit
   vs V0_6; blend reopen audit (base color UNCHANGED + final strengths + final bloom settings).

## 4. REAL DELIVERABLES

- `production/character/production_actor/rig_derivatives/MIKAGE_ZENITH_BLADE_3PHASE_REBUILD_V0_7.blend`
- `production/character/reviews/MIKAGE_ZENITH_BLADE_3PHASE_REBUILD_V0_7_CONTACTSHEET_FRONT_P1P2P3.png`
- `production/character/reviews/MIKAGE_ZENITH_BLADE_3PHASE_REBUILD_V0_7_SAMPLING_REGIONS_P2P3.png`
- `production/character/reviews/MIKAGE_ZENITH_BLADE_3PHASE_REBUILD_V0_7_GATE_TABLE.md`
- `production/character/reviews/MIKAGE_ZENITH_BLADE_3PHASE_REBUILD_V0_7_KEYART_P3.png`
- `production/character/reviews/MIKAGE_ZENITH_BLADE_3PHASE_REBUILD_V0_7_PROOF.md`

Gate folder (CONTACT_SHEET_ONLY — exactly two files): `_tmp/mikage_zenith_blade_3phase_rebuild_v0_7_gate/`
→ `contact_sheet.png` + `contact_sheet_review_report.md`.

## 5. FAILURE PROTOCOL

If any gate cannot be met inside this scope: STOP, report the measured numbers, no retry loop.
Blocker codes: `P2_CLIP_VIOLATION` (gate A), `HUE_VIOLATION` (gate B), `PHASE_SEPARATION_VIOLATION`
(gate C or D), `FAIL_VALIDATION_METHOD` (measured hue/energy on clipped pixels or wrong region),
`SCOPE_VIOLATION` (any geometry/rig/attachment or base-color change), `SIGNAL_DISCIPLINE_VIOLATION`.
No canon-lock, no asset-lock, no production-ready claim. Stop after proof for operator review.
