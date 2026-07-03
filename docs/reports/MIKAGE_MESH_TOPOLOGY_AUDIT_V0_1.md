# MIKAGE Mesh Topology + Skeleton-Fit Audit V0.1

Status: `READ-ONLY AUDIT / ESTIMATE ONLY`

Audited file: `production/character/production_actor/rig_derivatives/MIKAGE_PRODUCTION_RIG_LOOKDEV_INTEGRATION_V0_1.blend`

Coordinates below are world-space Blender units. The 29 Armature-modifier meshes from audit #37 are explicitly excluded.

## 1. Every visible, render-enabled non-legacy mesh

| Mesh | Topology | World bbox min → max | Dimensions X/Y/Z | Shape / region |
|---|---:|---|---|---|
| `MASTER_MATCH_faceless_porcelain_helmet` | 5,856 verts; 1 component | `(-0.404,-0.270,3.500)` → `(0.404,0.355,4.424)` | `(0.809,0.625,0.924)` | Separate closed faceless helmet volume; head |
| `MASTER_MATCH_single_closed_draped_void_cloak` | 288 verts; 1 component | `(-0.775,-0.512,0.140)` → `(0.775,0.506,3.280)` | `(1.550,1.018,3.140)` | One continuous tapered/draped body-cloak volume from base through shoulders; no detached limbs |
| `MASTER_MATCH_white_halo_ring` | 864 verts; 1 component | `(-0.594,0.349,3.451)` → `(0.594,0.531,4.649)` | `(1.187,0.183,1.199)` | Separate thin ring behind/around head |
| `PUBLIC_BLOCK_V03_sensor_slit_left_violet_only` | 8 verts; 1 component | `(-0.228,-0.271,4.048)` → `(-0.052,-0.245,4.072)` | `(0.176,0.025,0.023)` | Separate thin left sensor-slit block on helmet face |
| `PUBLIC_BLOCK_V03_sensor_slit_right_violet_only` | 8 verts; 1 component | `(0.052,-0.271,4.048)` → `(0.228,-0.245,4.072)` | `(0.176,0.025,0.023)` | Separate thin right sensor-slit block |
| `PUBLIC_BLOCK_V03_zenith_blade_crisp_front_plane` | 8 verts; 1 component | `(1.033,-0.172,0.345)` → `(1.138,-0.138,3.095)` | `(0.105,0.035,2.750)` | Separate tall blade face slab |
| `PUBLIC_BLOCK_zenith_blade_dark_edge` | 8 verts; 1 component | `(0.873,-0.120,0.125)` → `(0.907,0.060,3.375)` | `(0.035,0.180,3.250)` | Separate narrow blade edge slab |
| `PUBLIC_BLOCK_zenith_blade_vertical_slab` | 8 verts; 1 component | `(0.950,-0.100,0.025)` → `(1.210,0.060,3.475)` | `(0.260,0.160,3.450)` | Separate main blade slab |

`VISIBLE_NONLEGACY_MESH_COUNT = 8`

## 2. Body/cloak topology — decisive answer

`BODY_CLOAK_ONE_CONTINUOUS_VOLUME = TRUE`.

The visible body is one mesh, one connected component, spanning `Z=0.140…3.280`. There are no visible separate upper-arm, forearm, hand, thigh, shin, foot, or toe meshes. The visible silhouette therefore does not provide distinct limb volumes matching the old 16 limb bones. The helmet, two slits, halo, and three blade slabs are separate rigid parts; they are not body limbs.

## 3. All 23 existing bones: world head/tail and bbox

Each bone bbox is the axis-aligned min/max enclosing its head and tail.

| Bone | Head → tail | Bbox min → max |
|---|---|---|
| `root` | `(0,0,0)` → `(0,0,0.250)` | `(0,0,0)` → `(0,0,0.250)` |
| `pelvis` | `(0,0,0.250)` → `(0,0,0.550)` | same |
| `spine_01` | `(0,0,0.550)` → `(0,0,0.950)` | same |
| `spine_02` | `(0,0,0.950)` → `(0,0,1.300)` | same |
| `chest` | `(0,0,1.300)` → `(0,0,1.550)` | same |
| `neck` | `(0,0,1.550)` → `(0,0,1.720)` | same |
| `head` | `(0,0,1.720)` → `(0,0,2.080)` | same |
| `clavicle.L` | `(0,0,1.480)` → `(-0.220,0,1.470)` | `(-0.220,0,1.470)` → `(0,0,1.480)` |
| `upper_arm.L` | `(-0.220,0,1.470)` → `(-0.580,0,1.220)` | `(-0.580,0,1.220)` → `(-0.220,0,1.470)` |
| `forearm.L` | `(-0.580,0,1.220)` → `(-0.860,0,0.980)` | `(-0.860,0,0.980)` → `(-0.580,0,1.220)` |
| `hand.L` | `(-0.860,0,0.980)` → `(-1.020,0,0.900)` | `(-1.020,0,0.900)` → `(-0.860,0,0.980)` |
| `clavicle.R` | `(0,0,1.480)` → `(0.220,0,1.470)` | `(0,0,1.470)` → `(0.220,0,1.480)` |
| `upper_arm.R` | `(0.220,0,1.470)` → `(0.580,0,1.220)` | `(0.220,0,1.220)` → `(0.580,0,1.470)` |
| `forearm.R` | `(0.580,0,1.220)` → `(0.860,0,0.980)` | `(0.580,0,0.980)` → `(0.860,0,1.220)` |
| `hand.R` | `(0.860,0,0.980)` → `(1.020,0,0.900)` | `(0.860,0,0.900)` → `(1.020,0,0.980)` |
| `thigh.L` | `(-0.120,0,0.250)` → `(-0.180,0,-0.550)` | `(-0.180,0,-0.550)` → `(-0.120,0,0.250)` |
| `shin.L` | `(-0.180,0,-0.550)` → `(-0.160,0,-1.250)` | `(-0.180,0,-1.250)` → `(-0.160,0,-0.550)` |
| `foot.L` | `(-0.160,0,-1.250)` → `(-0.160,-0.280,-1.400)` | `(-0.160,-0.280,-1.400)` → `(-0.160,0,-1.250)` |
| `toe.L` | `(-0.160,-0.280,-1.400)` → `(-0.160,-0.480,-1.400)` | `(-0.160,-0.480,-1.400)` → `(-0.160,-0.280,-1.400)` |
| `thigh.R` | `(0.120,0,0.250)` → `(0.180,0,-0.550)` | `(0.120,0,-0.550)` → `(0.180,0,0.250)` |
| `shin.R` | `(0.180,0,-0.550)` → `(0.160,0,-1.250)` | `(0.160,0,-1.250)` → `(0.180,0,-0.550)` |
| `foot.R` | `(0.160,0,-1.250)` → `(0.160,-0.280,-1.400)` | `(0.160,-0.280,-1.400)` → `(0.160,0,-1.250)` |
| `toe.R` | `(0.160,-0.280,-1.400)` → `(0.160,-0.480,-1.400)` | `(0.160,-0.480,-1.400)` → `(0.160,-0.280,-1.400)` |

Existing skeleton aggregate span: approximately `X=-1.020…1.020`, `Y=-0.480…0`, `Z=-1.400…2.080`. Visible production aggregate span reaches `Z=4.649`.

## 4. Functional bone/mesh spatial mismatch

`Δ center` is bone center minus corresponding mesh-bbox center. `AABB distance` is zero when the bone center lies inside the mesh bbox; it does not imply a matching anatomical region.

| Bone(s) | Corresponding visible geometry | Δ center X/Y/Z or key offset | AABB distance / finding |
|---|---|---|---|
| `root` | continuous cloak | `(0,0.003,-1.585)` | `0.015` below cloak base |
| `pelvis` | continuous cloak | `(0,0.003,-1.310)` | inside bbox |
| `spine_01` | continuous cloak | `(0,0.003,-0.960)` | inside bbox |
| `spine_02` | continuous cloak | `(0,0.003,-0.585)` | inside bbox |
| `chest` | continuous cloak | `(0,0.003,-0.285)` | inside bbox but below upper cloak region |
| `neck` | continuous cloak/legacy neck | `(0,0.003,-0.075)` vs cloak center | inside cloak bbox; no new nonlegacy neck mesh |
| `head` | helmet | `(0,-0.043,-2.062)` | `1.600` below helmet bbox; decisive vertical mismatch |
| `clavicle.L/R` | continuous cloak; no separate shoulders | `X=±0.110`, `Z=-0.235` vs cloak center | inside bbox, but no distinct shoulder topology |
| `upper_arm.L/R` | continuous cloak; no arms | `X=±0.400`, `Z=-0.365` | inside bbox, no corresponding limb volume |
| `forearm.L/R` | continuous cloak; no forearms | `X=±0.720`, `Z=-0.610` | inside outer bbox only; no corresponding topology |
| `hand.L/R` | no visible hands | `X=±0.940`, `Z=-0.770` | `0.165` outside cloak bbox |
| `thigh.L/R` | no visible thighs | `X=±0.150`, `Z=-1.860` | `0.290` below cloak bbox |
| `shin.L/R` | no visible shins | `X=±0.170`, `Z=-2.610` | `1.040` below cloak bbox |
| `foot.L/R` | no visible feet | `X=±0.160`, `Y=-0.137`, `Z=-3.035` | `1.465` outside/below cloak bbox |
| `toe.L/R` | no visible toes | `X=±0.160`, `Y=-0.377`, `Z=-3.110` | `1.540` outside/below cloak bbox |

The arm chain's apparent overlap with the cloak's broad bbox is not evidence of fit: the cloak is a monolithic volume and has no arm landmarks. The leg chain is spatially below the current visible body. Most critically, the head chain is about two units below the actual helmet/halo/slits.

## 5. Reasoned bone-count/location estimate — not a decision

For the geometry that actually exists, a reduced axial setup of roughly **7 bones** is the defensible minimum estimate:

1. `root` at/just below cloak base near `Z≈0.14`;
2. lower-body/pelvis control around `Z≈0.5–0.8`;
3. lower-spine cloak control around `Z≈1.2`;
4. upper-spine cloak control around `Z≈1.8`;
5. chest/shoulder-volume control around `Z≈2.5–3.0`;
6. neck transition around `Z≈3.3–3.5`;
7. head control centered near helmet center `Z≈3.96` and covering halo/slits.

The existing named axial chain already has seven bones (`root` through `head`) but is spatially fitted to the old lineage, especially above chest. The 16 limb bones are not justified by current visible topology because no visible limb meshes exist. A separate blade/prop control could raise the estimate to 8 only if the operator wants independent blade motion; this is an estimate, not authorization to reposition or build bones.

## 6. Blade and halo positions for future attachment planning

- Halo center `(0,0.440,4.050)`, dimensions `(1.187,0.183,1.199)`, bbox `(-0.594,0.349,3.451)` → `(0.594,0.531,4.649)`. It spatially surrounds the helmet and should follow a future correctly fitted head control; current head center is `(0,0,1.900)`, `2.150` units lower in Z.
- Blade front plane center `(1.085,-0.155,1.720)`, dimensions `(0.105,0.035,2.750)`.
- Blade dark edge center `(0.890,-0.030,1.750)`, dimensions `(0.035,0.180,3.250)`.
- Blade main slab center `(1.080,-0.020,1.750)`, dimensions `(0.260,0.160,3.450)`.
- The cloak ends at `X=0.775`; the blade begins at `X=0.873`, leaving a minimum lateral gap of about `0.098`. It is a tall independent object standing beside the body, not a hand-gripped mesh. The current `hand.R` center `(0.940,0,0.940)` lies inside the blade's broad vertical range but there is no visible hand or contact topology. Root/prop attachment is therefore more spatially defensible than assuming a hand grip; final attachment remains an operator decision.

## 7. Audit method and integrity

- Read only: object visibility, mesh vertices/edges/faces, connected components, world-space vertex bounds, armature rest-bone head/tail positions.
- `POSE_ATTEMPTED = NO`
- `RENDER_ATTEMPTED = NO`
- `BLEND_SAVE_ATTEMPTED = NO`
- No object, mesh, armature, bone, vertex group, material, or transform was created/deleted/modified.
- SHA-256 before audit: `A4A028E756B34940DDA60C7408141A444A750AA5171B45B0839F318DA2944F6E`
- SHA-256 after audit: `A4A028E756B34940DDA60C7408141A444A750AA5171B45B0839F318DA2944F6E`
- `MESH_AUDIT_FILE_MODIFIED = NO`
- `BLOCKER = NONE`

No bone-reposition/new-armature decision, canon-lock, asset-lock, push, or deploy claim is made.
