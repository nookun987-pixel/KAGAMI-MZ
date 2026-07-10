# MIKAGE_ZENITH_BLADE_3PHASE_REBUILD_V0_8_PROOF

Status: diagnostic stop evidence for operator review. No canon-lock, asset-lock, production-ready, final, or PASS claim.

## Scope
- Source: `production/character/production_actor/rig_derivatives/MIKAGE_ZENITH_BLADE_3PHASE_REBUILD_V0_7.blend`
- Output blend: `D:/KAGAMI-MZ_SYNC_PUSH_V2/production/character/production_actor/rig_derivatives/MIKAGE_ZENITH_BLADE_3PHASE_REBUILD_V0_8.blend`
- Scope performed: diagnosis-first phase wiring check; V0_8 derivative saved unchanged from V0_7 for audit trail; no strength/glare tuning after blocker.
- Emission base color stayed locked at linear `(0.33, 0.0, 1.0)`.

## Diagnosis
- `ZB3_PHASE_CONTROL["blade_phase"]` did not swap phase visibility.
- Requested P1/P2/P3 all leave `ZB3_P3_CONTINUOUS_VIOLET_SEAM` visible and `ZB3_P2_CONTINUOUS_VIOLET_SEAM` hidden.
- This is `PHASE_WIRING_BLOCKER`; glare/strength tuning was not performed.

## Measured Gates
# MIKAGE ZENITH BLADE 3PHASE REBUILD V0.8 GATE TABLE

| Gate | P2 | P3 | Result |
|---|---:|---:|---|
| DISPLAY body median RGB | (115, 12, 223) | (107, 5, 213) | measured on PNG/display unclipped in-band body |
| DISPLAY body hue | 269.171271 deg | 269.423077 deg | PASS |
| DISPLAY body R/B | 0.512605 | 0.500000 | PASS |
| In-band body px count | 1245 | 1604 | PASS |
| Every sampled cross-section has >=1 in-band px | True | True | PASS |
| Clip fraction INFO | 0.558629 | 0.572503 | info only |
| Source emitter radiance RGB | (0.0066, 0.0, 0.02) | (0.029700002, 0.0, 0.090000004) | source ratio B 4.500000 |
| Driver swap confirmation | P2 seam visible in requested P2 = False | P3 seam visible in requested P3 = True; P3 visible in requested P1 = True | FAIL: driver does not swap |
| Glare clamp check | not reached | not reached | PHASE_WIRING_BLOCKER before glare tuning |
| EXR energy median luminance | 0.72492456 | 0.72589482 | ratio 1.001338; diagnostic only under failed phase wiring |
| EXR energy mask | EXR violet core: b>0.001 and b>2.2*r and b>20*g | EXR violet core: b>0.001 and b>2.2*r and b>20*g | diagnostic only |
| PNG glow envelope area | 6507 px | 7448 px | ratio 1.144613; diagnostic only |

P1 zero-emissive result: True; P1 envelope px: 0
Zero-red scan hits: P1=0, P2=0, P3=0
Geometry equal vs V0_7: True; attachment_equal: True; changed geometry objects: []
Emission base color locked: True
Overall measured status: FAIL
Blocker: PHASE_WIRING_BLOCKER


## Reopen Audit
- Source blend SHA256 before: `5da3b9a8d500dc468a0e5e614548729db623581d8839720b9f0f59cecc3ba43b`
- Output blend SHA256 after: `3dca1f09c42d841303cbdc0e688032ca9e0bb09df3f367ee79489b34dea0d8b6`
- Materials: `{"ZB55_VIOLET_MAX_8F00FF": {"base": [0.33000001311302185, 0.0, 1.0, 1.0], "emission": [0.33000001311302185, 0.0, 1.0, 1.0], "source_emitter_radiance_rgb": [0.02970000236034398, 0.0, 0.09000000357627869], "strength": 0.09000000357627869}, "ZB55_VIOLET_MID_8F00FF": {"base": [0.33000001311302185, 0.0, 1.0, 1.0], "emission": [0.33000001311302185, 0.0, 1.0, 1.0], "source_emitter_radiance_rgb": [0.006600000114738935, 0.0, 0.019999999552965164], "strength": 0.019999999552965164}}`
- Glare: `{"Maximum": 4.0, "Saturation": 1.0, "Size": 0.23999999463558197, "Smoothness": 0.03999999910593033, "Strength": 0.2199999988079071, "Threshold": 2.5999999046325684}`
- Attachment world: `[1.08, -0.02, 1.75]`
- `.blend1` result: checked during close-out.
- Initial repository status: clean on `main`, latest commit `a9340f1`.
- Commit status: not committed by instruction.
- Push status: not pushed by instruction.

## Commands Run
- `git status --porcelain=v1`
- `git branch --show-current`
- `git log -1 --oneline`
- `python .mikage\tools\validate_task.py`
- Blender 5.1 phase-wiring diagnostic/render script
- Blender 5.1 EXR measurement script
- Python/Pillow V0.8 postprocess script
- `python .mikage\tools\verify_output.py`

## Result
- PASS/FAIL: FAIL
- BLOCKER: PHASE_WIRING_BLOCKER
- Next safe action: repair/restore the `ZB3_PHASE_CONTROL` visibility driver so P1/P2/P3 actually swap before any further glare or MAX tuning.