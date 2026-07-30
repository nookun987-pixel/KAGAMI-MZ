# Zenith Blade EDGE_B1 — Human Scale and Edge Proof

```text
STATUS: TECHNICAL_EVIDENCE_COMPLETE_AWAITING_OPERATOR_EDGE_VISUAL_RULING
FORM_A3_BASE_MESH_LOCK: True
HUMAN_SCALE_FACTOR: 0.2452706705
BLADE_LENGTH_M: 1.200000018
ACTOR_HEIGHT_M: 1.753685243
BLADE_ACTOR_RATIO: 0.684273317
ZB_OBJECT_SCALES_UNIT: True
MARKER_DELTA_M: 0.000000022352
HANDLE_DELTA_M: 0.000000007451
MITTEN_PHASE_RECORDS: 0
MITTEN_PHYSICAL_OVERLAPS: 0
SPINE_AXIS_DEVIATION_M: 0.000000000000
MAT_C1: BLOCKED_PENDING_OPERATOR_EDGE_APPROVAL
```

## Edge hierarchy

- Porcelain shell main edges: `2.0 mm`, 3 segments; interface vertices excluded by governed vertex group.
- Attack collar/projection: `1.2 mm`, 3 segments.
- Upper drive hub/shoulders: `1.0 mm`, 3 segments.
- Smooth shading plus weighted normals where supported; no official material, groove, panel line, screw or macro-form edit.
- One common human-scale root preserves rig, animation, drivers, registration and local `ZB*` unit scales.
- Locked-camera silhouette bounding-box change is at most `1 px` in both front and side comparisons at `2048 px`.
- `ZB45_SHELL_UR` is normals-only: its bevel was removed after the evaluated bevel produced mitten penetration; final P1/P2/P3 overlaps are zero.
- All three review images were opened and inspected after composition.
- The saved blend reopened successfully in Blender 5.1.2 with `199` objects (`198` FORM_A3 objects plus one common human-scale root); all `31` `ZB*` objects remain at scale `(1,1,1)` and no `.blend1` remains.

No EDGE visual PASS or MAT_C1 transition is claimed. No push or deploy.
