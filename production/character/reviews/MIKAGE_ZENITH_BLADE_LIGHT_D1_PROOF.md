# MIKAGE ZENITH BLADE — LIGHT_D1 PROOF

## Status

- MAT_C3 operator ruling consumed: `VISUAL_PASS_WITH_HUB_METRIC_EXCEPTION`.
- LIGHT_D1 candidate produced for operator visual review.
- Visual PASS is **not** self-declared.
- `INTEGRATION_READY = NO_OPERATOR_REVIEW_REQUIRED`.

## Locked source

- Base: `production/character/production_actor/rig_derivatives/MIKAGE_ZENITH_BLADE_MAT_C3.blend`
- Output: `production/character/production_actor/rig_derivatives/MIKAGE_ZENITH_BLADE_LIGHT_D1.blend`
- MAT_C3 geometry, bevel, normals, transforms and approved material values: unchanged.

## Lighting and color management

- Renderer: Blender Eevee.
- View transform: AgX.
- Look: AgX - Medium High Contrast.
- Exposure: -0.35; gamma: 1.0.
- Cold soft key: 520 W, 1.65 m.
- Restrained fill: 105 W, 1.55 m.
- Controlled Z-Blue rim: 430 W, 1.10 m.
- Top edge light: 145 W, 1.20 m.
- Isolated hub corrective light: **none**.

## Signal discipline

- Violet emission is assigned only to `ZB42_P3_SINGLE_RECESSED_CORE` at P3/frame 61.
- Signal color: `#8F00FF`; strength: 1.25.
- All other inset objects remain emission-zero.
- No violet fill, wash, ambient halo, or porcelain bloom was introduced.

## Technical lock audit

- Geometry/bevel/normal/transform fingerprint unchanged: `true`.
- Approved MAT_C3 material values unchanged: `true`.
- Marker world translation delta: `0.0 m`.
- Handle world translation delta: `0.0 m`.
- P1: `0` collision records, `0` triangle overlaps.
- P2: `0` collision records, `0` triangle overlaps.
- P3: `0` collision records, `0` triangle overlaps.

## Review package

- Locked-camera neutral comparison.
- Hero front, hero three-quarter and side silhouette.
- Porcelain highlight, hub reflection and attack-tip readability close-ups.
- P3 emission off/on comparison.
- Full settings and fingerprints are recorded in `MIKAGE_ZENITH_BLADE_LIGHT_D1_REPORT.json`.

## Stop

Stopped after proof for operator LIGHT_D1 visual ruling. MAT_C1 or any later stage is not opened automatically.
