# MIKAGE_CHARACTER_PROXY_RIG_EXECUTION_SPEC_FROM_ANCHOR_V1

## 1. Purpose

Prepare the proxy rig execution specification from Anchor V1.

This task does not create a rig, does not modify the proxy `.blend`, and does not claim rig readiness. It defines the exact boundaries for a future execution task only.

## 2. Confirmed State

| Field | Value |
|---|---|
| START_HEAD | `8a7fec8709e80224bde38429d9bc17d3cf7d23e6` |
| CURRENT_ROUTE | `CHARACTER_PRODUCTION_FROM_ANCHOR_V1` |
| SOURCE_ANCHOR | `docs/character/anchor_v1_candidates/P3A_R4_HELMET_INPAINT_001.png` |
| PROXY_RIG_PREP_REVIEW_STATUS | PASS |
| PROXY_RIG_EXECUTION_SPEC_STATUS | PREPARED |
| 3D_ACTOR_STATUS | `PROXY_BLOCKOUT_CREATED` |
| RIG_STATUS | `NOT_STARTED` |
| CINEMATIC_PROOF_SHOT_STATUS | `NOT_STARTED` |
| ASSET_LOCK_STATUS | `NOT_LOCKED` |

## 3. Exact Files Allowed To Read

Future rig execution may read only these planning/source files unless a separate task expands the input list:

- `docs/handoff/00_LATEST_CODEX_HANDOFF.md`
- `reports/MIKAGE_CHARACTER_PROXY_RIG_PREP_REVIEW_FROM_ANCHOR_V1.md`
- `reports/MIKAGE_CHARACTER_PROXY_RIG_PREP_FROM_ANCHOR_V1.md`
- `reports/MIKAGE_CHARACTER_PROXY_REFINEMENT_OR_RIG_PREP_DECISION.md`
- `reports/MIKAGE_CHARACTER_PROXY_3D_ACTOR_BLOCKOUT_REVIEW.md`
- `production/character/proxy_actor/MIKAGE_PROXY_3D_ACTOR_FROM_ANCHOR_V1_NOTES.md`
- `production/character/proxy_actor/MIKAGE_PROXY_3D_ACTOR_FROM_ANCHOR_V1_BLOCKOUT.blend`
- `docs/character/anchor_v1_candidates/P3A_R4_HELMET_INPAINT_001.png`

The Anchor V1 image is reference only. It must not be replaced, regenerated, altered, or treated as an unlocked production variant.

## 4. Exact Blend File Allowed For Future Rig Execution

Allowed source `.blend`:

```text
production/character/proxy_actor/MIKAGE_PROXY_3D_ACTOR_FROM_ANCHOR_V1_BLOCKOUT.blend
```

Future execution must not modify this file in place. It may open/read/copy the file and save a separate rigged proxy review file.

Proposed future output `.blend`:

```text
production/character/proxy_actor/MIKAGE_PROXY_3D_ACTOR_FROM_ANCHOR_V1_RIG_PREP_BLOCKOUT.blend
```

The proposed output is for review only. It is not a final character asset and does not imply asset lock, rig readiness, or cinematic readiness.

## 5. Future Armature / Bone / Control Groups

Future rig execution may create a minimal proxy armature with these planning groups:

- Root/world control: global placement only.
- Pelvis/body root control: keeps the proxy in its monolithic Anchor V1 stance.
- Spine controls: low-count spine chain for subtle posture tests only.
- Neck/head control: helmet/head follow control with rigid helmet handling.
- Left/right pauldron controls: independent rigid pauldron placement that preserves width.
- Left/right arm controls: simple pose-blocking controls, with right-side sword relationship preserved.
- Right sword socket or sword root control: rigid attachment and separation for the sword slab.
- Left hair mass guide/control: preserves the left-side hair shell as a mass, not strands.
- Left/right leg and foot controls: simple planted stance controls only.

No facial control group is allowed.

## 6. Object Parenting / Binding Strategy

Allowed proxy object families for future rig planning are the reviewed blockout objects documented in the rig-prep plan and blockout review.

Binding strategy:

- `helmet_ovoid_proxy`, `helmet_sensor_slit_upper_void_black`, and `helmet_sensor_slit_lower_void_black` must be rigid-parented to the head/helmet control. Do not deform these objects with vertex weights.
- `pauldron_left_block_wide_proxy` and `pauldron_right_block_wide_proxy` must remain rigid, broad, and independent from upper-arm deformation.
- `sword_rectangular_slab_right_side`, `sword_guard_bar_horizontal`, and `sword_violet_accent_proxy_nonfinal` must remain rigid and visually separate from torso, arm, and pauldron geometry.
- `hair_left_mass_shell_black_proxy` may be parented or lightly guided as a single left-side mass. It must not become strand hair, a cape, or a symmetric back mass.
- Torso, waist, hips, arms, legs, and feet may receive simple proxy deformation or rigid parenting appropriate for blockout review, but motion range must remain conservative.
- `SOURCE_ANCHOR_REFERENCE_PLANE_DO_NOT_RENDER_AS_ASSET` remains reference-only. It must not be bound, deformed, rendered as an asset, or included as character geometry.

## 7. Rigid Object Rules

Helmet, sensor slits, sword, and pauldrons are rigid design anchors.

- Helmet remains a clean sealed ovoid.
- Exactly two separate black sensor slit strips remain visible and separated by white helmet material.
- Sensor slits must not merge into one visor and must not become eyes, mouth, logo, or expression marks.
- Sword remains a right-side rectangular slab.
- Pauldrons remain wide and do not collapse into normal shoulder width.

## 8. Forbidden Facial Controls

Future rig execution must not create:

- eye controls
- mouth controls
- nose, jaw, lip, brow, cheek, or expression controls
- blink controls
- visor morphs
- sensor slit animation controls
- facial shape keys
- any control that implies a face inside the helmet

The helmet is a rigid mask form, not a face rig.

## 9. Deformation Constraints

- Preserve Anchor V1 silhouette priority over articulation range.
- Keep torso bend subtle and blockout-level.
- Keep legs columnar and planted unless a later reviewed task approves expanded motion.
- Keep pauldrons visually broad in neutral and posed states.
- Keep sword separated from the body and free of bend/deformation.
- Keep hair as a left-side mass shell; do not make it cape-like or symmetric.
- Do not deform helmet or sensor slit geometry.

## 10. QA Checks After Future Execution

A future rig execution report must verify:

- Source blockout `.blend` was not overwritten.
- Proposed rigged proxy `.blend` exists at the approved output path.
- Blender file opens.
- Armature count is explained and limited to proxy rig review needs.
- Exactly two separate black sensor slit objects remain present and visible.
- No facial controls, facial bones, facial shape keys, or expression controls exist.
- Helmet, sensor slits, sword, and pauldrons remain rigid.
- Pauldron width remains visually consistent with Anchor V1.
- Sword remains right-side, rectangular, rigid, and visually separated.
- Hair remains left-side mass shell, not cape-like or symmetric.
- Source anchor reference plane remains reference-only.
- No final asset lock, rig readiness, or cinematic-ready claim is made.

## 11. Rollback / Fail Conditions

Future execution must stop or roll back if:

- The source blockout `.blend` would be modified in place.
- The Anchor V1 locked reference would be changed or replaced.
- R5 is introduced as a replacement source.
- A full-body R6 route is opened.
- New AI image rendering is invoked.
- Helmet or sensor slits become deformable.
- The two sensor slits merge, disappear, or become face features.
- Facial rig controls are introduced.
- Pauldrons collapse into normal shoulder width.
- Sword bends, merges into the body, or loses right-side slab identity.
- Hair becomes symmetric, cape-like, or strand-rigged.
- The output claims final asset lock, rig readiness, or cinematic readiness.

## 12. Next Safe Task

```text
REVIEW_PROXY_RIG_EXECUTION_SPEC_FROM_ANCHOR_V1
```

The next task should review this specification only before any rig execution is authorized.
