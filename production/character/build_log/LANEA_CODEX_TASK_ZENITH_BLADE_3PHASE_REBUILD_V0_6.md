# LANEA_CODEX_TASK_ZENITH_BLADE_3PHASE_REBUILD_V0_6

STATUS: revision of exception #58 (`V0_5`). V0_5 result: honest STOP, `BLOCKER =
COLOR_AND_PHASE_GATE_FAIL` — correct behavior, no retry, no PASS claim. Lane B independently
confirmed every number (`production/character/reviews/MIKAGE_ZENITH_BLADE_3PHASE_REBUILD_V0_5_BLOCKER_ANALYSIS.md`).
The failure was in the GATE STRUCTURE, not in execution. This task fixes the gates so they are
physically measurable, and finishes the hue.

## 0. Why V0_5 could never pass (read before doing anything)

~80% of the core-line pixels clip in the tonemapped PNG. A clipped pixel shows 255 whether the
radiance is 1x or 4x, so: (a) excluding clipped pixels leaves only the dim fringe → P3's median
measured DIMMER than P2 despite 4x strength; (b) including them measures nothing either (total
PNG energy +2%). The 1.5x luminance comparison is therefore moved to SCENE-LINEAR EXR, and the
VISUAL MID→MAX separation must come from structure: P2 comes DOWN out of clipping so it reads as
a controlled mid glow with a true violet body, and P3's bloom envelope must grow visibly.

Hue: V0_5 landed 264–265° (V0_4 was 244° — direction right). One more red nudge of the emission
color, iterated against the PNG median, closes the remaining ~5–10°.

## 1. SCOPE — MATERIAL/RENDER ONLY

Base file: `production/character/production_actor/rig_derivatives/MIKAGE_ZENITH_BLADE_3PHASE_REBUILD_V0_5.blend`
(geometry byte-identical chain V0_2→V0_5). Locked exactly as #58: geometry, silhouette, seam
geometry/position/width, `ZB3_PHASE_CONTROL` drivers, rig, camera, pose, attachment
`(1.08, -0.02, 1.75)`. May change: emission color, per-phase emission strengths, per-phase
bloom/glare settings, proof exposure. P1 sealed. Zero red. One line. No `.blend1`. No
commit/push/deploy.

## 2. GATES (all measured, none by eye)

**A. HUE (final PNG, both phases)** — unchanged from #58:
median of solid core-body pixels (exclude clipped any-channel≥250 and edge/AA pixels):
hue `268–280°`, R/B `0.45–0.65`, reference `#8F00FF`. AUTO-FAIL `<260°` or R/B `<0.40`.
Iterate: render → measure → adjust color → repeat until the PNG median lands `270–276°`.

**B. P2 DE-CLIP (final PNG)** — NEW:
clipped fraction of P2's core-line pixels `<= 40%` (V0_5 was ~80%). Lower P2 strength until the
P2 core shows a solid, measurable violet body. P2 = controlled MID.

**C. ENERGY (scene-linear EXR, pre-tonemap)** — replaces the PNG luminance gate:
render P2 and P3 to EXR with identical settings; median scene-linear luminance
(0.2126R+0.7152G+0.0722B) over the SAME core-line mask: P3 `>= 1.5x` P2. EXR does not clip, so
this is finally measurable. Report both medians and the ratio.

**D. VISUAL MAX READ (final PNG)** — NEW:
P3 glow/bloom envelope pixel area `>= 1.3x` P2's (same threshold definition for both phases,
report the threshold used). P3 may bloom wider around the SAME single line; no second seam, no
wash onto the blade body, physical seam width identical. P3 must be unmistakably stronger than
P2 at thumbnail scale.

Do NOT differentiate P3 by hue shift — same 268–280° band as P2.

## 3. REQUIRED EVIDENCE

1. P1/P2/P3 contact sheet — three phases distinguishable at thumbnail size.
2. Gate table: PNG median RGB/hue/R-B for P2+P3; P2 clip fraction; EXR median luminance P2, P3,
   ratio; glow envelope areas + threshold.
3. Marked sampling-regions image — this time the mask must cover the FULL seam length (above and
   below the grip ring), with clipped/edge exclusions shown per region.
4. Initial + final validator reports; zero-red scan; P1 zero-emissive check; geometry hash audit
   vs V0_5; blend reopen audit (final color + strengths + bloom settings).

## 4. REAL DELIVERABLES

- `production/character/production_actor/rig_derivatives/MIKAGE_ZENITH_BLADE_3PHASE_REBUILD_V0_6.blend`
- `production/character/reviews/MIKAGE_ZENITH_BLADE_3PHASE_REBUILD_V0_6_CONTACTSHEET_FRONT_P1P2P3.png`
- `production/character/reviews/MIKAGE_ZENITH_BLADE_3PHASE_REBUILD_V0_6_SAMPLING_REGIONS_P2P3.png`
- `production/character/reviews/MIKAGE_ZENITH_BLADE_3PHASE_REBUILD_V0_6_GATE_TABLE.md`
- `production/character/reviews/MIKAGE_ZENITH_BLADE_3PHASE_REBUILD_V0_6_KEYART_P3.png`
- `production/character/reviews/MIKAGE_ZENITH_BLADE_3PHASE_REBUILD_V0_6_PROOF.md`

Gate folder (CONTACT_SHEET_ONLY — exactly two files): `_tmp/mikage_zenith_blade_3phase_rebuild_v0_6_gate/`.

## 5. FAILURE PROTOCOL

If any gate cannot be met inside this scope: STOP, report the measured numbers, no retry loop.
Blocker codes: `HUE_VIOLATION` (gate A), `P2_CLIP_VIOLATION` (gate B), `PHASE_SEPARATION_VIOLATION`
(gate C or D), `FAIL_VALIDATION_METHOD` (measured the wrong region/space), `SCOPE_VIOLATION`,
`SIGNAL_DISCIPLINE_VIOLATION`. No canon-lock, no asset-lock, no production-ready claim. Stop
after proof for operator review.
