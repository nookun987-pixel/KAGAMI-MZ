# MIKAGE HELMET CONTROLLED SUBDIV V0.6 — CANDIDATE PROOF

- Task: `MIKAGE_HELMET_CONTROLLED_SUBDIV_V0_6`
- Governance: `AGENTS.md` controlled exception #22
- Date: `2026-07-01` (`Asia/Bangkok`)
- Starting commit: `b56c66b 3d: V0.5 BLOCKING APPROVED + driftcheck; add exception #22 controlled subdiv V0.6`
- Source of truth read: `production/character/reference/MIKAGE_CHARACTER_REFERENCE_16x9.png`
- Master SHA-256 verified: `B86F6817CBC4F7D6A861B8E9F111F78096CA173F5BF5C5966A378069C0E06429`
- Helmet target read: `production/character/build_log/MIKAGE_HELMET_BLOCKING_SPEC_V0_1.md`

## Source and output

- `BASE_SELECTED = production/character/production_actor/rig_derivatives/MIKAGE_HELMET_PROPORTION_REFINE_V0_5.blend`
- Base SHA-256 before/after: `AEBAD77205FA86B7F5B1000802F6EBCBE74282C4024448ADC1A1A6DBBF326FC1` (unchanged)
- Output: `production/character/production_actor/rig_derivatives/MIKAGE_HELMET_CONTROLLED_SUBDIV_V0_6.blend`
- Output SHA-256: `77F2CE962DD651F3ED3FE7B0458E17ECADE321D7D17AB3707CE7CB46C55375F5`
- Contact sheet SHA-256: `675DAA5C6115FBEE68E7D432BB9CAD59DA1FAF7551F1CA61287BB1985471D6E5`

## Controlled subdivision performed

- Helmet mesh only.
- Baked the approved V0.5 helmet support/bevel geometry into the helmet mesh.
- Applied one `SIMPLE` controlled subdivision pass. This adds topology without Catmull–Clark shrinkage or egg rounding.
- Retained the support geometry around face-plane, crown, temple, wedge jaw, and slit recesses.
- Resolved the inherited crown stepping into one continuous shallow parabolic arc; no center bump, three-lobe, or hair-like crown read.
- Re-pinned final evaluated dimensions to V0.5. The existing jaw seat remains anchored at `Z=3.500000`; neck was not moved.
- Kept exactly two existing thin, shallow, frameless violet slit objects.
- No material, lookdev, lighting, rig, or non-helmet geometry edit.

## Geometry and preservation evidence

- `BODY_HASH_BEFORE = AEB4C14F4F6128286026BC3D8079A85EE19D4C64D025BE00EEE61C7FF8D1BEB2`
- `BODY_HASH_AFTER = 00BF87BC19347A079172AA72AF36D6DCE718C7082701EF4632BE0B5B258C3CEA`
- `HELMET_HASH_BEFORE = CFB299D8EA3910AC3B114EB0FD0C024E8DC662B4302825E71D3D7F0B72994373`
- `HELMET_HASH_AFTER = 592DFD176B05854C55C3E65C628CB507F318F5AF36E8D82FEB7EAEB03B430EAA`
- `NON_HELMET_HASH_BEFORE = E4F2DDE40F734CD474BC5B2B5B71A317EE4212D83A4084AACFC616F4BF75F2D0`
- `NON_HELMET_HASH_AFTER = E4F2DDE40F734CD474BC5B2B5B71A317EE4212D83A4084AACFC616F4BF75F2D0`
- `PRESERVED_OBJECT_STATE_HASH_BEFORE = 738A1BF044D5D2B246C1BA6DF2A2940FB47A6139ACDA059ED24AA9E3B2886964`
- `PRESERVED_OBJECT_STATE_HASH_AFTER = 738A1BF044D5D2B246C1BA6DF2A2940FB47A6139ACDA059ED24AA9E3B2886964`
- `CAMERA_HASH_BEFORE = 728C66AAFAFDC4C834EC9ECD924E8C97510C38D3CCE9D96A9842D4E6A99E9882`
- `CAMERA_HASH_AFTER = 728C66AAFAFDC4C834EC9ECD924E8C97510C38D3CCE9D96A9842D4E6A99E9882`
- Helmet topology before: `138 verts / 263 edges / 125 faces`
- Helmet topology after/reopened: `1480 verts / 2928 edges / 1448 faces`
- Evaluated dimensions before: `(0.8086850, 0.6246755, 0.9236193)`
- Evaluated dimensions after/reopened: `(0.8086849, 0.6246755, 0.9236193)`
- Maximum dimension delta: `< 1e-7 Blender unit`
- Helmet transform before/after: location `(0,0,0)`, rotation `(0,0,0)`, scale `(1,1,1)`
- Helmet material assignment before/after: `HERO_FINISH_glazed_sacred_porcelain`

`BODY_HASH_AFTER` changes only because the approved helmet mesh changed. The byte-identical non-helmet mesh hash and preserved-object state hash verify robe, neck, halo, blade, camera, body geometry, transforms, visibility, and assignments were preserved.

## Render inspection

- Contact sheet: `2160 x 1440`, plain `3 x 2` layout.
- Panels: front, strict side, three-quarter, no-slit silhouette, wireframe, and V0.5-before/V0.6-after comparison.
- The actual final PNG was opened at original resolution and inspected.
- Surface reads smoother than V0.5 while preserving the broad near-flat face-plane, temple transition, and narrowed wedge jaw.
- Crown reads as one continuous shallow arc; no central bump or three-lobe read.
- No-slit view preserves the V0.5 identity without relying on violet.
- Subdivision did not restore an egg silhouette or inflate the jaw.
- Final visual ruling remains with the operator.

## RESULT

```text
TASK = MIKAGE_HELMET_CONTROLLED_SUBDIV_V0_6
BASE_SELECTED = production/character/production_actor/rig_derivatives/MIKAGE_HELMET_PROPORTION_REFINE_V0_5.blend
OUTPUT_STATUS = CANDIDATE
PASS_FAIL = PASS
BLOCKER = NONE
HELMET_SCOPE_DRIFT = NO
SUBDIV_ROUNDED_FORM = NO
V0_5_DIMENSIONS_PRESERVED = PASS
FACE_PLANE_PRESERVED = PASS
CROWN_CONTINUOUS_SHALLOW_ARC = PASS
WEDGE_JAW_AND_NECK_SEAT = PASS
EXACTLY_TWO_SLITS = PASS
NO_SLIT_SILHOUETTE = PASS
WIREFRAME_EVIDENCE = PASS
NON_HELMET_HASH_PRESERVED = PASS
PRESERVED_OBJECT_STATE = PASS
MATERIAL_LOOKDEV_LIGHTING_CHANGE = NO
CANON_LOCK = NO
ASSET_LOCK = NO
COMMIT = NO
PUSH = NO
```
