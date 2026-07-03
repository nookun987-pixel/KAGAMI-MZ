# MIKAGE Robe Locomotion Test V0.1 — Proof

TASK: `MIKAGE_ROBE_LOCOMOTION_TEST_V0_1`
STATUS: `CANDIDATE / FEASIBILITY TEST / NOT A FINAL WALK CYCLE`
RESULT: PASS
BLOCKER: NONE

## Source and outputs

- Read-only source: `production/character/production_actor/rig_derivatives/MIKAGE_PRODUCTION_RIG_REBUILD_V0_1.blend`.
- Derivative: `production/character/production_actor/rig_derivatives/MIKAGE_ROBE_LOCOMOTION_TEST_V0_1.blend`.
- Video: `production/character/reviews/MIKAGE_ROBE_LOCOMOTION_TEST_V0_1.mp4`.
- Keyframes: `production/character/reviews/MIKAGE_ROBE_LOCOMOTION_TEST_V0_1_KEYFRAMES.png`.
- Source SHA-256 before/after: `f5f17e2e7bc18d387bb7477d158def823604ccf829fb660b0a986ee7980ec0c5` (unchanged).

## Cloth-helper bones

Exactly two bones were added, both direct children of `root` and both transverse horizontal strips across the cloak, not vertical limb forms:

- `drape_secondary_lower`: head `(-0.66,0,0.34)`, tail `(0.66,0,0.34)`; lower-hem elastic sway.
- `drape_secondary_upper`: head `(-0.56,0,0.82)`, tail `(0.56,0,0.82)`; delayed upper-to-lower drape response.

Neither helper is limb-named, limb-shaped, or limb-positioned. No mesh/object was created: mesh count `101 → 101`, object count `139 → 139`.

## Motion

- Duration: 120 frames, 24 fps, 5.0 seconds.
- `root` advances 1.50 m along character-forward `-Y`.
- Vertical bob: 0–0.028 m.
- Alternating weight lean: ±1.4° around Y.
- Lower helper sway: ±2.8° Y plus ±1.2° X.
- Upper helper delayed sway: ±1.4° Y.
- This is a robe-glide feasibility gesture only; no visible step, leg, locomotion mesh, or final walk-cycle claim.

## Void-body-mass verification

- Cloak remains the original single object and single mesh: `MASTER_MATCH_single_closed_draped_void_cloak`.
- Topology is unchanged: 288 vertices, 0 boundary edges, 0 non-manifold edges.
- Only blended armature weights were added to the continuous lower-cloak surface; no base geometry or silhouette was edited.
- Frames 1/30/60/90/120 were rendered, opened, and inspected. The cloak remains one closed continuous volume with no split, opening, or suggestion of legs.
- `VOID_BODY_MASS_INTACT = YES`.

## Locked elements

- Slits retain material `V0_8_TWO_SLITS_ONLY`; emission input `(0.05,0,1,1)` corresponding to approved `#8F00FF`, unchanged and unanimated.
- Halo retains `V0_8_RESTRAINED_WHITE_HALO`; emission `(1,1,1,1)`, unchanged and unanimated.
- All blade-related objects have no independent animation; the three bound blade meshes remain rigid-to-root.
- `LIMB_GEOMETRY_VIOLATION = NO`; `HALO_COLOR_VIOLATION = NO`; `SLIT_HUE_FAIL = NO`; `SCOPE_VIOLATION = NO`.

## Technical and final verification

- Saved derivative reopened successfully: nine bones total (original seven plus the two approved helpers), 720×1280, 24 fps, frames 1–120.
- ffprobe: H.264, yuv420p, 720×1280, 24 fps, 5.000000 s, video-only/no audio.
- Gate contains exactly `contact_sheet.png` and `contact_sheet_review_report.md`; MP4 remains outside gate.
- `.blend1 = NONE`.
- `python .mikage/tools/verify_output.py = PASS` (recorded after final gate validation).
- PUSH_STATUS: NOT PUSHED.
- NEXT_SAFE_ACTION: Lane B/operator review whether the robe-glide reads convincingly enough for further tuning or a later Stage D.

No final/marketing, production-ready, canon-lock, asset-lock, push, or deploy claim is made.
