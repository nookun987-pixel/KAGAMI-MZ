# MIKAGE_ZENITH_BLADE_3PHASE_REBUILD_V0_6_PROOF

Status: measured candidate evidence for operator review. No canon-lock, asset-lock, production-ready, or final claim.

## Scope
- Source: `D:/KAGAMI-MZ_SYNC_PUSH_V2/production/character/production_actor/rig_derivatives/MIKAGE_ZENITH_BLADE_3PHASE_REBUILD_V0_5.blend`
- Output blend: `D:/KAGAMI-MZ_SYNC_PUSH_V2/production/character/production_actor/rig_derivatives/MIKAGE_ZENITH_BLADE_3PHASE_REBUILD_V0_6.blend`
- Scope performed: material/render only; violet emission color, P2/P3 emission strengths, proof exposure, and proof renders.
- Locked geometry/proportions/ring/tip/panel spacing/seam geometry/driver/rig/camera/pose/attachment were not edited by script.
- Emission color set to linear RGBA `(0.33, 0.0, 1.0, 1.0)`.
- P2 strength `0.014`; P3 strength `0.145`.

## Measured Gates
# MIKAGE ZENITH BLADE 3PHASE REBUILD V0.6 GATE TABLE

| Gate | P2 | P3 | Result |
|---|---:|---:|---|
| PNG median RGB | (119, 35, 230) | (113, 23, 221) | measured |
| PNG median hue | 265.85 deg | 267.27 deg | FAIL |
| PNG R/B | 0.5174 | 0.5113 | FAIL |
| P2 core-line clipped fraction | 0.6937 | n/a | FAIL |
| EXR median luminance | 0.19558896 | 0.11759684 | ratio 0.6012 = FAIL |
| Glow envelope area | 3944 px | 4748 px | ratio 1.2039 = FAIL |
| Envelope threshold | b>0.20 and b>1.45*r and b>3.0*g | b>0.20 and b>1.45*r and b>3.0*g | same threshold |
| Solid core sample count | 592 | 948 | measured |

P1 zero-emissive violet-pixel count: 0
Zero-red scan hits: {"P1.png": 0, "P2.png": 0, "P3.png": 0}
Overall measured status: FAIL
Blocker: HUE_VIOLATION, P2_CLIP_VIOLATION, PHASE_SEPARATION_VIOLATION


## Audits
- Source blend SHA256 before: `2985a96ddbb2dbc394a551c21576d88fd225e2958d281e5a12d21f98381e575d`
- Output blend SHA256 after: `b51142d5f6a3c101332bafbf56adef031f7fea084d935044ba826d3511e45df9`
- Geometry hash audit vs V0_5: `geometry_equal=true`; changed ZB3 geometry objects `[]`.
- Attachment reopen audit: `attachment_equal_v05=true`; `attachment_world=[1.08, -0.02, 1.75]`.
- Reopened material values: `ZB55_VIOLET_MID_8F00FF` base/emission `[0.3300000131, 0.0, 1.0, 1.0]`, strength `0.0140000004`; `ZB55_VIOLET_MAX_8F00FF` base/emission `[0.3300000131, 0.0, 1.0, 1.0]`, strength `0.1449999958`.
- P1 zero-emissive check: recorded in gate table.
- Zero-red scan: recorded in gate table.
- `.blend1` result: none found during close-out.
- Evidence source: local Blender 5.1 renders from reopened V0_6 blend, scene-linear EXR measurement, PNG/Pillow pixel scan, and manual visual inspection of generated contact/sampling PNGs.
- Initial repository status: clean on `main`, latest commit `f78a403`.
- Final repository status: only the six V0_6 real deliverables are untracked; gate folder schema verified separately and ignored by git.
- Files changed: `production/character/production_actor/rig_derivatives/MIKAGE_ZENITH_BLADE_3PHASE_REBUILD_V0_6.blend`; `production/character/reviews/MIKAGE_ZENITH_BLADE_3PHASE_REBUILD_V0_6_CONTACTSHEET_FRONT_P1P2P3.png`; `production/character/reviews/MIKAGE_ZENITH_BLADE_3PHASE_REBUILD_V0_6_SAMPLING_REGIONS_P2P3.png`; `production/character/reviews/MIKAGE_ZENITH_BLADE_3PHASE_REBUILD_V0_6_GATE_TABLE.md`; `production/character/reviews/MIKAGE_ZENITH_BLADE_3PHASE_REBUILD_V0_6_KEYART_P3.png`; `production/character/reviews/MIKAGE_ZENITH_BLADE_3PHASE_REBUILD_V0_6_PROOF.md`; gate folder contains `contact_sheet.png` and `contact_sheet_review_report.md`.
- Output validator: `python .mikage\tools\verify_output.py` printed `PASS`.
- Commit status: not committed by instruction.
- Push status: not pushed by instruction.

## Commands Run
- `git status --porcelain=v1`
- `git branch --show-current`
- `git log -1 --oneline`
- `python .mikage\tools\validate_task.py`
- Blender 5.1 background build/render script for V0.6
- Blender 5.1 background EXR measurement script
- Python/Pillow postprocess script
- `python .mikage\tools\verify_output.py`

## Result
- PASS/FAIL: FAIL
- BLOCKER: HUE_VIOLATION, P2_CLIP_VIOLATION, PHASE_SEPARATION_VIOLATION
- Next safe action: Operator reviews the V0.6 contact sheet, sampling regions, gate table, and P3 key art.
