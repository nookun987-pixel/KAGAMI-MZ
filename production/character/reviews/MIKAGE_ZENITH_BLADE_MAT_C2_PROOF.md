# Zenith Blade MAT_C2 — Controlled Material Correction Proof

```text
STATUS: TECHNICAL_EVIDENCE_COMPLETE_AWAITING_OPERATOR_MATERIAL_VISUAL_RULING
EDGE_B1_TECHNICAL_FINGERPRINT_LOCK: True
BLADE_LENGTH_M: 1.200000018
ACTOR_HEIGHT_M: 1.753685243
BLADE_ACTOR_RATIO: 0.684273317
MARKER_DELTA_M: 0.000000000000
HANDLE_DELTA_M: 0.000000000000
MITTEN_PHASE_RECORDS: 0
MITTEN_PHYSICAL_OVERLAPS: 0
MAT_C2_EMISSION_ZERO: True
OBJECTS_REOPENED: 199
ZB_MESHES_REOPENED: 26
SILHOUETTE_FRONT_CHANGED_PIXELS: 0
SILHOUETTE_SIDE_CHANGED_PIXELS: 0
VIEW_TRANSFORM: Filmic
LOOK: Medium High Contrast
EXPOSURE: 0.0
GAMMA: 1.0
HUB_TO_PORCELAIN_LUMA_RATIO: 0.742502
REQUESTED_HUB_LUMA_RANGE: 0.45–0.55
REQUESTED_HUB_LUMA_RANGE_MET: False
LIGHT_D1: BLOCKED_PENDING_OPERATOR_MATERIAL_APPROVAL
```

- Porcelain: `#F2EEEA`, metallic `0`, roughness `0.46 ±0.015`, IOR `1.46`, coat `0.10 / 0.30`; roughness-only micro variation, no bump or color noise.
- Z-Blue graphite: `#4B5866`, metallic `0.65`, roughness `0.34`; all eight designated hub/shoulder/rail meshes verified.
- Sumi collar: `#252321`, metallic `0.68`, roughness `0.31`; lower central projection uses `#23211F` on one material-selected face.
- Violet-black inset: `#120A18`, metallic `0.20`, roughness `0.24`, emission `0`.
- Reopened saved blend: `199` objects, `26` ZB meshes, every ZB object scale `(1,1,1)`.
- Neutral hero, front, side, four close-ups, material ID, roughness/specular diagnostic, and silhouette comparison were opened and inspected.
- Pixel comparison against locked EDGE_B1 masks: front `0` changed pixels; side `0` changed pixels.
- Actual fixed-rig ROI measurement: hub `171.7071`, porcelain `231.2548`, ratio `0.742502`. This misses the requested `0.45–0.55` range.

The exact MAT_C2 shader values and material links are present, but the unchanged Filmic/Medium High Contrast neutral review still maps the hub too brightly. No light, exposure, geometry, bevel, normal, transform, scale, or arbitrary base-color compensation was used to manufacture a pass.

No MAT visual PASS or LIGHT_D1 transition is claimed. If the operator confirms failure, the ruling permits MAT_C3 for color-management and neutral-review exposure only. No push or deploy.
