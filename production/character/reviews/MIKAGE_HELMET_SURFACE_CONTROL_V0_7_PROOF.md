# MIKAGE HELMET SURFACE CONTROL V0.7 — CANDIDATE PROOF

- Task: `MIKAGE_HELMET_SURFACE_CONTROL_V0_7`
- Governance: `AGENTS.md` controlled exception #23
- Date: `2026-07-01` (`Asia/Bangkok`)
- Starting commit: `2361df5 3d: subdiv V0.6 + driftcheck; add exception #23 surface-control V0.7 (Catmull-Clark, kill visor/crown-step)`
- Master/reference SHA-256 verified: `B86F6817CBC4F7D6A861B8E9F111F78096CA173F5BF5C5966A378069C0E06429`
- Helmet target read: `production/character/build_log/MIKAGE_HELMET_BLOCKING_SPEC_V0_1.md`

## Source and output

- `BASE_SELECTED = production/character/production_actor/rig_derivatives/MIKAGE_HELMET_CONTROLLED_SUBDIV_V0_6.blend`
- Base SHA-256 before/after: `77F2CE962DD651F3ED3FE7B0458E17ECADE321D7D17AB3707CE7CB46C55375F5` (unchanged)
- Output: `production/character/production_actor/rig_derivatives/MIKAGE_HELMET_SURFACE_CONTROL_V0_7.blend`
- Output SHA-256: `D3EE43423B3B6AE03780E669B758AB346BC3E7F8AD8EAAC93056FAB2E46776E0`
- Contact sheet SHA-256: `3340E07866ABD29259419CD8529B2A9D36FC35A7538C90B1654CDADCAEDE9048`

## Surface-control performed

- Helmet surface only.
- Applied true `CATMULL_CLARK` subdivision, level 1, using the dense V0.6 support cage; no SIMPLE subdivision.
- Used local support control at crown, temple, and face-plane perimeter. No second uncontrolled full subdivision.
- Relaxed the crown/temple region locally and mapped the complete crown support band into one shallow continuous dome.
- Reduced the upper face-plane projection with a smoothstep depth profile. The broad near-flat center remains, while its perimeter blends into the shell without a geometric brow band.
- Preserved the narrowed wedge jaw and restored its measured width exactly.
- Preserved helmet evaluated dimensions, object scale, slit placement, material assignment, and jaw seat.
- Exactly two thin recessed violet slits remain visible; no new seam, brow-band, visor, feature, or decoration was added.
- No material, lookdev, lighting, rig, camera, or non-helmet edit.

## Hash and lock evidence

- `BODY_HASH_BEFORE = 00BF87BC19347A079172AA72AF36D6DCE718C7082701EF4632BE0B5B258C3CEA`
- `BODY_HASH_AFTER = 935F68E127F48D9C727CCA41BCE9A47FC709DDBBDD8C97AFBEDC475FE251A6F4`
- `HELMET_HASH_BEFORE = 592DFD176B05854C55C3E65C628CB507F318F5AF36E8D82FEB7EAEB03B430EAA`
- `HELMET_HASH_AFTER = 2FC550B3D9E9D7FAE66E1C8F280646DD9BA492A103A156B318DF683661FC139E`
- `NON_HELMET_HASH_BEFORE = E4F2DDE40F734CD474BC5B2B5B71A317EE4212D83A4084AACFC616F4BF75F2D0`
- `NON_HELMET_HASH_AFTER = E4F2DDE40F734CD474BC5B2B5B71A317EE4212D83A4084AACFC616F4BF75F2D0`
- `PRESERVED_STATE_HASH_BEFORE = D1F71AE2D11CAA6BDC21B8C72B7C662C70DC1C0A2E196196DC3F874F619C307C`
- `PRESERVED_STATE_HASH_AFTER = D1F71AE2D11CAA6BDC21B8C72B7C662C70DC1C0A2E196196DC3F874F619C307C`
- Topology before: `1480 verts / 2928 edges / 1448 faces`
- Topology after/reopened: `5856 verts / 11648 edges / 5792 faces`
- Evaluated dimensions before/after: `(0.8086849, 0.6246755, 0.9236193)`
- Jaw width before/after: `0.4091067314`
- Helmet transform before/after: location `(0,0,0)`, rotation `(0,0,0)`, scale `(1,1,1)`
- Visible slit placement before/after: left `(-0.14,-0.258,4.06)`, right `(0.14,-0.258,4.06)`
- Helmet material before/after: `HERO_FINISH_glazed_sacred_porcelain`

`BODY_HASH_AFTER` changes only because the helmet surface changed. Byte-identical non-helmet geometry and preserved-state hashes verify robe, neck, halo, blade, cameras, body geometry, transforms, visibility, assignments, and slit objects were preserved.

## Visual inspection

- Contact sheet: `2880 x 1440`, plain `4 x 2` layout.
- Panels: front, strict side, standard three-quarter, elevated three-quarter, low three-quarter, wireframe close-up, and V0.6/V0.7 comparison.
- The actual final PNG was opened at original resolution and inspected.
- Crown and crown-to-temple read continuously without the V0.6 stepped contour.
- Elevated and low three-quarter views read as a sealed shell; the upper face-plane no longer projects as a separate visor slab.
- Wireframe confirms there is no continuous brow-band geometry around the slits. The remaining broad horizontal specular response comes from the locked V0.6 material/light setup, which this task was prohibited from changing.
- Face-plane remains broad and legible; jaw remains wedge-shaped; the helmet does not round into an egg.
- Final visual ruling remains with the operator.

## RESULT

```text
TASK = MIKAGE_HELMET_SURFACE_CONTROL_V0_7
BASE_SELECTED = production/character/production_actor/rig_derivatives/MIKAGE_HELMET_CONTROLLED_SUBDIV_V0_6.blend
OUTPUT_STATUS = CANDIDATE
PASS_FAIL = PASS
BLOCKER = NONE
HELMET_SCOPE_DRIFT = NO
CC_ROUNDED_FORM = NO
SUBDIVISION_METHOD = CATMULL_CLARK_LEVEL_1_WITH_LOCAL_SUPPORT_CONTROL
V0_6_SCALE_AND_DIMENSIONS_PRESERVED = PASS
JAW_WIDTH_PRESERVED = PASS
SLIT_PLACEMENT_PRESERVED = PASS
CROWN_CONTINUOUS_ARC = PASS
ELEVATED_THREE_QUARTER = PASS
LOW_THREE_QUARTER = PASS
FACE_PLANE_PRESERVED = PASS
VISOR_GEOMETRY_REMOVED = PASS
WIREFRAME_CLOSEUP = PASS
NON_HELMET_HASH_PRESERVED = PASS
PRESERVED_STATE_HASH = PASS
MATERIAL_LOOKDEV_LIGHTING_CHANGE = NO
CANON_LOCK = NO
ASSET_LOCK = NO
COMMIT = NO
PUSH = NO
```
