# Zenith Blade MAT_C3 — Final Material Calibration Proof

```text
STATUS: TECHNICAL_COMPLETE_VISUAL_METRIC_BLOCKER_RECORDED
EDGE_B1_TECHNICAL_FINGERPRINT_LOCK: True
BLADE_LENGTH_M: 1.200000018
ACTOR_HEIGHT_M: 1.753685243
BLADE_ACTOR_RATIO: 0.684273317
MARKER_DELTA_M: 0.000000000000
HANDLE_DELTA_M: 0.000000000000
MITTEN_PHASE_RECORDS: 0
MITTEN_PHYSICAL_OVERLAPS: 0
MAT_C3_EMISSION_ZERO: True
OBJECTS_REOPENED: 199
ZB_MESHES_REOPENED: 26
SILHOUETTE_FRONT_CHANGED_PIXELS: 0
SILHOUETTE_SIDE_CHANGED_PIXELS: 0
VIEW_TRANSFORM: Filmic
LOOK: Medium High Contrast
EXPOSURE: 0.0
GAMMA: 1.0
HUB_TO_PORCELAIN_MASK_RATIO: 0.684718
HUB_PASS_RANGE: 0.47–0.53
HUB_PASS_RANGE_MET: False
INSET_TO_PORCELAIN_MASK_RATIO: 0.182947
INSET_TARGET_MAX_APPROXIMATE: 0.18
INSET_TARGET_MET_STRICTLY: False
LIGHT_D1: BLOCKED
MAT_C4: PROHIBITED
```

- Porcelain and collar/projection were preserved from MAT_C2.
- Hub retains metallic `0.65`, roughness `0.34`, and the locked hue. Linear multiplier calibration sequence: `0.6734 → 0.47113 → 0.34193 → 0.25675`.
- Inset plate assignment was corrected to the visible recessed-rail plate meshes. Shader: `#120A18`, metallic `0.05`, roughness `0.34`, Specular IOR Level `0.25`, coat `0`, emission `0`.
- Reopened saved blend: `199` objects, `26` ZB meshes, material counts `4 / 5 / 9 / 8`, every ZB object scale `(1,1,1)`.
- Pixel masks are occlusion-aware and use the locked MAT_C2 hero camera. Measured hub ratio: `0.684718`; inset ratio: `0.182947`.
- Neutral hero, close-ups, material ID, roughness/specular diagnostic, luminance-mask proof, and silhouette proof were opened and inspected.
- EDGE_B1 silhouette comparison: front `0` changed pixels; side `0` changed pixels.

The inset now reads violet-black rather than slate blue. The hub remains above its numeric gate because its locked metallic/roughness response creates a specular floor under the unchanged neutral rig. No lighting, exposure, color-management, porcelain, tip, geometry, bevel, normal, transform, or scale compensation was used.

No visual PASS is claimed. LIGHT_D1 remains blocked. Per operator ruling, MAT_C4 is not opened. No push or deploy.
