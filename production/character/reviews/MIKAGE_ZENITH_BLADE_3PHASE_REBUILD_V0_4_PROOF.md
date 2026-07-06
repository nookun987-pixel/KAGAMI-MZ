# MIKAGE_ZENITH_BLADE_3PHASE_REBUILD_V0_4 — CANDIDATE PROOF

STATUS: PASS — CANDIDATE ONLY; operator visual ruling required. No canon-lock, asset-lock, production-ready, or final claim.

## Scope

- Task: `MIKAGE_ZENITH_BLADE_3PHASE_REBUILD_V0_4` (`CONTACT_SHEET_ONLY`).
- Base: `production/character/production_actor/rig_derivatives/MIKAGE_ZENITH_BLADE_3PHASE_REBUILD_V0_3.blend`.
- Output: `production/character/production_actor/rig_derivatives/MIKAGE_ZENITH_BLADE_3PHASE_REBUILD_V0_4.blend`.
- Material/render-only correction. Mesh, proportions, tip, grip ring, panel hierarchy, phase collections, drivers, rig, and attachment were not edited.

## Required diagnostic before adjustment

Raw V0.3 shader inputs and scene-linear values were measured before changing strength:

| Phase | Material | Emission color/base, linear | Strength | Peak coordinate | Pre-tonemap RGBA |
|---|---|---:|---:|---:|---:|
| P2 | `ZB55_VIOLET_MID_8F00FF` | `(0.015, 0.0, 0.800, 1.0)` | `0.35` | `(596,210)` | `(2.2634, 2.0908, 12.4771, 1.0)` |
| P3 | `ZB55_VIOLET_MAX_8F00FF` | `(0.015, 0.0, 0.800, 1.0)` | `0.55` | `(595,210)` | `(2.4808, 2.2966, 12.9248, 1.0)` |

All RGB channels exceeded 1.0 at the V0.3 peak; blue exceeded 12.4. This confirmed severe highlight-range compression rather than a base-hue error.

## Correction performed

- Base/emission color remained byte-for-byte unchanged: `(0.015, 0.0, 0.800, 1.0)`.
- P2 strength cut from `0.35` to `0.05` (`85.7%` reduction).
- P3 strength cut from `0.55` to `0.05` (`90.9%` reduction).
- Seam geometry and width were not changed.
- Standard proof exposure changed from `-1.35` in V0.3 to final `-2.4`, bringing the peak into a hue-preserving display range while retaining readable surrounding forms.
- No compositor bloom node exists in this scene. Beauty uses normal compositing; no-bloom diagnostics use `render.use_compositing=False` with identical camera, material, geometry, and exposure.
- An intermediate P3 strength `0.08` produced beauty `#DDD5FF`, `B-R=34`; this failed and was corrected within the authorized V0.4 iteration to `0.05` plus the final proof exposure.

## Actual brightest visible-core method

The seam was rendered as a temporary object-visibility mask using the same camera and scene occlusion. Every visible seam pixel was mapped into the beauty render, and the highest RGB-sum pixel inside that exact mask was selected. This includes clipped/magenta/white candidates and does not pre-filter for a favorable hue.

## Final peak-pixel table

Beauty and no-bloom values use the same coordinates. Positive `B-R` and `B-G` indicate blue dominance.

| Phase | Peak | Beauty RGB / hex | Beauty B-R | Beauty B-G | No-bloom RGB / hex | No-bloom B-R | No-bloom B-G | Post scene-linear RGBA |
|---|---:|---|---:|---:|---|---:|---:|---|
| P2 | `(596,210)` | `(185,178,255)` / `#B9B2FF` | `70` | `77` | `(173,166,255)` / `#ADA6FF` | `82` | `89` | `(1.9775,1.8242,10.8125,1.0)` |
| P3 | `(595,210)` | `(192,186,255)` / `#C0BAFF` | `63` | `69` | `(183,176,255)` / `#B7B0FF` | `72` | `79` | `(2.2246,2.0684,11.0859,1.0)` |

Both beauty peaks exceed the required `B-R >= 40`; neither is white or `255/255/255`. Both same-coordinate no-bloom samples are also blue-dominant.

## Continuity

- V0.2 peak failure: brightest core pixels clipped with `R=B=255` (`B-R=0`).
- V0.3 peak failure: P2 `(255,254,255)`, `B-R=0`; P3 `(255,255,255)`, `B-R=0`, in beauty and no-bloom.
- V0.4 final: P2 `B-R=70`; P3 `B-R=63` in beauty.

## Zero-red and signal discipline

- Visible-seam mask scan using `R > B + 35` and `R > G + 35`: P2 `0`, P3 `0` red/crimson pixels.
- Weapon materials contain no red/crimson `#E60000` source.
- Seam remains the exact V0.3 mesh and width: one thin controlled line, no thickening or wash.

## Geometry, rig, and attachment audit

- Deterministic hashes covered every `ZB3_*` mesh, armature, and locked helmet/slit/halo/cloak mesh plus transforms and driver expressions.
- Pre/post result: `blade57_geometry_rig_byte_identical = True`.
- `ZB3_PHASE_CONTROL` phase-name string, driver signature, and properties: unchanged (`blade57_control_unchanged = True`).
- Attachment remains `(1.08, -0.02, 1.75)`.
- Saved V0.4 blend reopened successfully; final strengths read `0.05 / 0.05`, base hue unchanged.

## Required artifacts

- `MIKAGE_ZENITH_BLADE_3PHASE_REBUILD_V0_4_CONTACTSHEET_FRONT_P1P2P3.png` — `3600×1480`, inspected at readable exposure.
- `MIKAGE_ZENITH_BLADE_3PHASE_REBUILD_V0_4_BEAUTY_VS_NOBLOOM_P2P3.png` — `2400×2880`, inspected.
- `MIKAGE_ZENITH_BLADE_3PHASE_REBUILD_V0_4_KEYART_P3.png` — `1600×2000`, inspected.
- Gate contains exactly `contact_sheet.png` and `contact_sheet_review_report.md`.

## Commands and repository status

- Pre-start: empty `git status --porcelain=v1`; branch `main`; HEAD `ca48f14 Dispatch #57: blade 3-phase V0_4 (cut emission strength) + commit V0_3 FAIL artifacts (audit trail)`.
- `python .mikage/tools/validate_task.py` → `PASS` before diagnostic/build.
- Blender raw shader and EXR preflight; color-only render iterations; exact visible-seam peak scan; EXR post sample; Blender reopen audit.
- `python .mikage/tools/verify_output.py` final output: `PASS`.
- Blender's automatic V0.4 `.blend1` backup was detected and removed before final verification.
- Commit: `NOT_COMMITTED`; push: `NOT_PUSHED`; deploy: `NOT_DEPLOYED`.
- Blocker: `NONE`.
- Next safe action: operator reviews contact sheet, comparison sheet, key art, and numeric peak evidence.

FINAL RESULT: PASS — CANDIDATE ONLY, pending operator visual ruling.
