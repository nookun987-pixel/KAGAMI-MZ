# LANEA_CODEX_TASK_ZENITH_BLADE_3PHASE_REBUILD_V0_9

STATUS: revision of exception #61 (`V0_8`). V0_8 stopped at the diagnosis-first gate with
`PHASE_WIRING_BLOCKER` and FOUND the 8-round root cause: the phase-visibility driver is broken.
This task REPAIRS that driver — and does ONLY that. Operator BOOS ruling 2026-07-11: isolate the
driver fix; no glare/strength/color tuning this round.

## 0. Root cause (read before doing anything)

`ZB3_PHASE_CONTROL["blade_phase"]` does NOT swap phase visibility. In every requested phase
(P1, P2, P3) the object `ZB3_P3_CONTINUOUS_VIOLET_SEAM` (MAX material, strength 0.09) stays VISIBLE
and `ZB3_P2_CONTINUOUS_VIOLET_SEAM` (MID material, strength 0.02) stays HIDDEN. So every "P2" and
"P3" render since the break showed the SAME object — which is why EXR energy ratio was ~1.0 despite
a real 4.5x source-strength difference (that difference lives on the hidden object). Full analysis:
`production/character/reviews/MIKAGE_ZENITH_BLADE_3PHASE_REBUILD_V0_8_BLOCKER_ANALYSIS.md`.
Color is already DONE (display-space gate passes P2 269.17 / P3 269.42 deg, R/B 0.51/0.50).

## 1. SCOPE — PHASE-VISIBILITY DRIVER REPAIR ONLY

Base file: `production/character/production_actor/rig_derivatives/MIKAGE_ZENITH_BLADE_3PHASE_REBUILD_V0_8.blend`
(geometry byte-identical chain V0_2→V0_8).

SCOPE EXPANSION AUTHORIZED (operator): the standing lock "do not modify the ZB3_PHASE_CONTROL driver"
is LIFTED for this task, LIMITED to the phase-VISIBILITY wiring of the two seam objects.

MAY CHANGE: only the phase-visibility driver / expression / wiring so `blade_phase` swaps correctly
(drive BOTH `hide_viewport` AND `hide_render` consistently on the two seam objects).

MUST NOT CHANGE: mesh geometry, proportions, seam geometry/position/width, rig BONES, camera, pose,
attachment `(1.08,-0.02,1.75)`, emission base color (linear 0.33,0,1.0), material strengths
(MID 0.02 / MAX 0.09), glare/bloom settings, exposure. Do NOT tune MAX for the >=1.5x energy target —
that is V0_10. Zero red. One line. No `.blend1`. No commit/push/deploy.

## 2. TARGET BEHAVIOR (what "repaired" means)

- P1 `Compact-Idle`: BOTH violet seams hidden / emissive-off. P1 must render zero emissive violet px.
- P2 `MID`: `ZB3_P2_CONTINUOUS_VIOLET_SEAM` VISIBLE + emissive (strength 0.02);
  `ZB3_P3_CONTINUOUS_VIOLET_SEAM` HIDDEN.
- P3 `MAX`: `ZB3_P3_CONTINUOUS_VIOLET_SEAM` VISIBLE + emissive (strength 0.09);
  `ZB3_P2_CONTINUOUS_VIOLET_SEAM` HIDDEN.

## 3. GATE (visibility audit — the pass criterion this round)

From the reopened blend, driver-evaluated at each phase, report the visible/hidden + emissive state
of BOTH seam objects for P1, P2, P3. All three phases must match the target above = PASS.
Corroborate with EXR core energy P2 vs P3 (should now reflect the ~4.5x source difference) — REPORT
it as evidence the swap works; do NOT tune to any energy target this round.

## 4. NON-REGRESSION (must all hold)

Geometry/silhouette/rig-bones/camera/pose/attachment byte-identical vs V0_8 (hash/measure); emission
base color unchanged (linear 0.33,0,1.0); material strengths unchanged (MID 0.02 / MAX 0.09); glare
settings unchanged; display-space color still passes (268-280 deg / 0.45-0.65); zero red; one line.

## 5. REQUIRED EVIDENCE

Contact sheet (P1/P2/P3 now visibly distinct); GATE_TABLE.md with: per-phase seam-object
visibility+emissive audit (target vs actual for both seams); EXR core energy P2/P3/ratio
(corroboration); display-space color confirm; geometry hash audit vs V0_8; base color / strengths /
glare unchanged audit; the driver expression BEFORE and AFTER the repair. Full-seam sampling-regions
image; zero-red scan; P1 zero-emissive check; blend reopen audit.

## 6. REAL DELIVERABLES

- `production/character/production_actor/rig_derivatives/MIKAGE_ZENITH_BLADE_3PHASE_REBUILD_V0_9.blend`
- `production/character/reviews/MIKAGE_ZENITH_BLADE_3PHASE_REBUILD_V0_9_CONTACTSHEET_FRONT_P1P2P3.png`
- `production/character/reviews/MIKAGE_ZENITH_BLADE_3PHASE_REBUILD_V0_9_SAMPLING_REGIONS_P2P3.png`
- `production/character/reviews/MIKAGE_ZENITH_BLADE_3PHASE_REBUILD_V0_9_GATE_TABLE.md`
- `production/character/reviews/MIKAGE_ZENITH_BLADE_3PHASE_REBUILD_V0_9_KEYART_P3.png`
- `production/character/reviews/MIKAGE_ZENITH_BLADE_3PHASE_REBUILD_V0_9_PROOF.md`

Gate folder (CONTACT_SHEET_ONLY — exactly two files): `_tmp/mikage_zenith_blade_3phase_rebuild_v0_9_gate/`
→ `contact_sheet.png` + `contact_sheet_review_report.md`.

## 7. FAILURE PROTOCOL

If the swap cannot be repaired inside scope: STOP, report the driver state and measured numbers, no
retry loop. Blocker codes: `DRIVER_REPAIR_FAILED` (swap still wrong after the edit),
`SCOPE_VIOLATION` (touched geometry / rig bones / camera / pose / attachment / base color / strengths
/ glare, or tuned for the energy target), `SIGNAL_DISCIPLINE_VIOLATION`, `FAIL_VALIDATION_METHOD`.
No canon-lock, no asset-lock, no production-ready claim. Next step if PASS: V0_10 re-runs the full
color + energy + envelope battery on the now-correct phases. Stop after proof for operator review.
