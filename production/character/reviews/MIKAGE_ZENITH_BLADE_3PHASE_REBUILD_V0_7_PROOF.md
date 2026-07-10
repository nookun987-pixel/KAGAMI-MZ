# MIKAGE_ZENITH_BLADE_3PHASE_REBUILD_V0_7_PROOF

Status: measured candidate evidence for operator review. No canon-lock, asset-lock, production-ready, final, or PASS claim.

## Scope
- Source: `production/character/production_actor/rig_derivatives/MIKAGE_ZENITH_BLADE_3PHASE_REBUILD_V0_6.blend`
- Output blend: `D:/KAGAMI-MZ_SYNC_PUSH_V2/production/character/production_actor/rig_derivatives/MIKAGE_ZENITH_BLADE_3PHASE_REBUILD_V0_7.blend`
- Scope performed: glare/bloom settings, per-phase emission strengths, and proof exposure/render outputs.
- Emission base color was locked at linear `(0.33, 0.0, 1.0)` and audited after reopen.
- Locked geometry/proportions/ring/tip/panel spacing/seam geometry/driver/rig/camera/pose/attachment were not edited.

## Final Settings
- Glare settings: `{"Maximum": 4.0, "Saturation": 1.0, "Size": 0.23999999463558197, "Smoothness": 0.03999999910593033, "Strength": 0.2199999988079071, "Threshold": 2.5999999046325684}`
- Material audit: `{"ZB55_VIOLET_MAX_8F00FF": {"base": [0.33000001311302185, 0.0, 1.0, 1.0], "emission": [0.33000001311302185, 0.0, 1.0, 1.0], "strength": 0.09000000357627869}, "ZB55_VIOLET_MID_8F00FF": {"base": [0.33000001311302185, 0.0, 1.0, 1.0], "emission": [0.33000001311302185, 0.0, 1.0, 1.0], "strength": 0.019999999552965164}}`

## Measured Gates
# MIKAGE ZENITH BLADE 3PHASE REBUILD V0.7 GATE TABLE

| Gate | P2 | P3 | Result |
|---|---:|---:|---|
| PNG core-line clipped fraction | 0.581846 | 0.584609 | FAIL |
| EXR body median RGB float | (1.486145, 0.042909, 5.342641) | (1.493917, 0.017664, 5.401808) | measured pre-tonemap |
| EXR body median hue | 256.339345 deg | 256.451115 deg | FAIL |
| EXR body R/B | 0.278167 | 0.276559 | FAIL |
| PNG body hue cross-check | 267.812500 deg | 268.934010 deg | reported only |
| PNG body R/B cross-check | 0.497561 | 0.495050 | reported only |
| EXR energy median luminance | 0.73017678 | 0.71794534 | ratio 0.983249 = FAIL |
| Energy mask definition | EXR body/energy: b>0.001 and b>2.2*r and b>20*g | EXR body/energy: b>0.001 and b>2.2*r and b>20*g | phase-aware object render mask, excludes P3 gap/background |
| PNG glow envelope area | 6500 px | 7446 px | ratio 1.145538 = FAIL |
| PNG envelope threshold | b>0.18 and b>1.35*r and b>2.2*g | b>0.18 and b>1.35*r and b>2.2*g | same threshold |
| EXR body sample count | 7272 | 8434 | measured |

P1 zero-emissive violet-pixel count: 0
Zero-red scan hits: {"P1.png": 0, "P2.png": 0, "P3.png": 0}
Geometry equal vs V0_6: True; attachment_equal: True; changed geometry objects: []
Emission base color locked: True
Overall measured status: FAIL
Blocker: P2_CLIP_VIOLATION, HUE_VIOLATION, PHASE_SEPARATION_VIOLATION


## Audits
- Source blend SHA256 before: `b51142d5f6a3c101332bafbf56adef031f7fea084d935044ba826d3511e45df9`
- Output blend SHA256 after: `5da3b9a8d500dc468a0e5e614548729db623581d8839720b9f0f59cecc3ba43b`
- Attachment world: `[1.08, -0.02, 1.75]`; attachment_equal_v06: `True`
- Blend reopen audit: saved V0_7 blend was reopened before measurements.
- `.blend1` result: checked during close-out.
- Initial repository status: clean on `main`, latest commit `ae7a85b`.
- Commit status: not committed by instruction.
- Push status: not pushed by instruction.

## Commands Run
- `git status --porcelain=v1`
- `git branch --show-current`
- `git log -1 --oneline`
- `python .mikage\tools\validate_task.py`
- Blender 5.1 background V0.7 build/render script
- Blender 5.1 background V0.7 measurement script
- Python/Pillow V0.7 postprocess script
- `python .mikage\tools\verify_output.py`

## Result
- PASS/FAIL: FAIL
- BLOCKER: P2_CLIP_VIOLATION, HUE_VIOLATION, PHASE_SEPARATION_VIOLATION
- Next safe action: Operator reviews the V0.7 contact sheet, sampling regions, gate table, and P3 key art.