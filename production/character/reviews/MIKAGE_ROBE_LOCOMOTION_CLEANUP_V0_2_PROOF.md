# MIKAGE Robe Locomotion Cleanup V0.2 — Proof

TASK: `MIKAGE_ROBE_LOCOMOTION_CLEANUP_V0_2`
STATUS: `CANDIDATE / CLEANUP / NOT STAGE D`
RESULT: PASS
BLOCKER: NONE

## Source and outputs

- Extended source: `production/character/production_actor/rig_derivatives/MIKAGE_ROBE_LOCOMOTION_TEST_V0_1.blend`.
- Source SHA-256 before/after: `0931101a9ad0b3c00c016c7d5f9770c47c2de189263396b93504796c125f6d07` (unchanged).
- Derivative: `production/character/production_actor/rig_derivatives/MIKAGE_ROBE_LOCOMOTION_CLEANUP_V0_2.blend`.
- Video/keyframes: `production/character/reviews/MIKAGE_ROBE_LOCOMOTION_CLEANUP_V0_2.mp4` and `..._KEYFRAMES.png`.

## Confirmed wedge cause

The exact wedge object was `neck_matte_black_underlayer`.

- In V0.1 it still used `FIRST_PASS_ARMATURE_BIND_MIKAGE_initial_armature_scaffold`, while helmet, halo and cloak used `MIKAGE_axial_rig_v0_1`.
- Evaluated V0.1 bboxes confirmed the mismatch: the neck connector stayed fixed at world-Z `3.225–3.525` in frames 1/96/120, while the helmet moved from Z `3.500–4.424` to `2.000–2.924` by frame 120. The stationary connector therefore appeared above/outside the moving halo as the dark wedge.
- V0.1 root travel was also keyed on root local-Y. The root basis maps local-Y to world-Z, so the supposed 1.5 m forward travel was actually a 1.5 m vertical descent, producing the floating/shrinking read.
- `WEDGE_CAUSE_UNCONFIRMED = NO`.

## Root-cause remedy

- Removed only the neck connector's stale legacy-armature modifier and rigid-bound its existing vertices to axial bone `neck` via `MIKAGE_AXIAL_RIGID_NECK`.
- Remapped root travel to the bone-local axis corresponding to scene depth; camera was not changed or cropped.
- Preserved 1.5 m travel over 120 frames/5 seconds.
- Reduced bob `0.028 → 0.018 m` and lean `±1.4° → ±0.8°`.
- Restricted `drape_secondary_upper` to Z ≤ 1.20 m and halved its retained weight; softened lower helper weight to 85%. Sway is now lower `±2.0°`, upper `±0.7°`.
- No helper was added or removed; total bones remain nine (original seven plus the existing two helpers).

## Visual and deterministic checks

- Actual frames 1(start/nominal frame 0), 30, 60, 90 and 120 were opened and inspected.
- No dark wedge, detached collar, transform mismatch or object crossing outside the halo appears.
- Halo remains a clean complete circle in every sampled frame; helmet, connector and upper body remain coherent without visible scale/detach/drift.
- Motion reads as a controlled approach with restrained weight transfer rather than vertical sinking.
- Cloak remains the same single closed mesh: 288 vertices, 0 boundary edges, 0 non-manifold edges; no visible/implied legs.
- Mesh/object counts remain `101/139`; no mesh, object or bone was added.
- Halo/slit/blade materials were not changed. Halo remains white; both slit emissions remain approved `#8F00FF`.
- All blade-related objects remain free of independent animation and rigid-to-root.
- `COSMETIC_FIX_ONLY = NO`; `SCOPE_VIOLATION = NO`.

## Technical verification

- Saved derivative reopened successfully with the expected nine bones and axial neck modifier.
- ffprobe: H.264, yuv420p, 720×1280, 24 fps, 5.000000 s, video-only/no audio.
- Gate: exactly `contact_sheet.png` and `contact_sheet_review_report.md`; MP4 remains outside.
- `.blend1 = NONE`.
- `python .mikage/tools/verify_output.py = PASS` (recorded after final validation).
- PUSH_STATUS: NOT PUSHED.
- NEXT_SAFE_ACTION: Lane B/operator visual review before any Stage D decision.

No Stage D, final-walk-cycle, production-ready, canon-lock, asset-lock, push or deploy claim is made.
