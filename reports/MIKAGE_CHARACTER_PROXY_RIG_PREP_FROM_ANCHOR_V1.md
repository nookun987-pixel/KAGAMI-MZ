# MIKAGE_CHARACTER_PROXY_RIG_PREP_FROM_ANCHOR_V1

**Date:** 2026-05-16  
**Task:** `PREPARE_PROXY_RIG_PREP_FROM_ANCHOR_V1`  
**Confirmed HEAD:** `a79d706`  
**Current route:** `CHARACTER_PRODUCTION_FROM_ANCHOR_V1`  
**Source anchor:** `docs/character/anchor_v1_candidates/P3A_R4_HELMET_INPAINT_001.png`  

---

## Rig Prep Plan Status

| Field | Value |
|---|---|
| PROXY_RIG_PREP_STATUS | PREPARED |
| DECISION_SOURCE | `RIG_PREPARATION_FROM_CURRENT_PROXY_BLOCKOUT` |
| SOURCE_ANCHOR | `docs/character/anchor_v1_candidates/P3A_R4_HELMET_INPAINT_001.png` |
| 3D_ACTOR_STATUS | `PROXY_BLOCKOUT_CREATED` |
| RIG_STATUS | `NOT_STARTED` |
| CINEMATIC_PROOF_SHOT_STATUS | `NOT_STARTED` |
| ASSET_LOCK_STATUS | `NOT_LOCKED` |
| NEXT_SAFE_TASK | `REVIEW_PROXY_RIG_PREP_FROM_ANCHOR_V1` |

This is a rig-preparation plan only. No rig is created and no rig readiness is claimed.

---

## Inputs

- `docs/handoff/00_LATEST_CODEX_HANDOFF.md`
- `reports/MIKAGE_CHARACTER_PROXY_REFINEMENT_OR_RIG_PREP_DECISION.md`
- `reports/MIKAGE_CHARACTER_PROXY_3D_ACTOR_BLOCKOUT_REVIEW.md`
- `production/character/proxy_actor/MIKAGE_PROXY_3D_ACTOR_FROM_ANCHOR_V1_NOTES.md`
- `production/character/proxy_actor/MIKAGE_PROXY_3D_ACTOR_FROM_ANCHOR_V1_BLOCKOUT.blend`

---

## Rig Prep Objective

Prepare control-planning requirements for a future proxy rig pass on the reviewed Anchor V1 blockout.

The goal is to identify what bones and controls would be needed to test posture, silhouette preservation, sword-side readability, pauldron behavior, and left-side hair mass behavior without creating any rig in this task.

---

## Allowed Proxy Objects For Rig Planning

These existing blockout objects may be referenced for rig planning:

| Category | Objects |
|---|---|
| Reference only | `SOURCE_ANCHOR_REFERENCE_PLANE_DO_NOT_RENDER_AS_ASSET` |
| Helmet | `helmet_ovoid_proxy`, `helmet_sensor_slit_upper_void_black`, `helmet_sensor_slit_lower_void_black` |
| Neck / torso | `neck_dark_connector`, `torso_tapered_core_proxy`, `central_dark_underlayer_proxy`, `waist_narrow_proxy`, `hip_block_proxy` |
| Pauldrons | `pauldron_left_block_wide_proxy`, `pauldron_right_block_wide_proxy` |
| Arms | `upper_arm_left_proxy`, `upper_arm_right_proxy`, `forearm_left_proxy`, `forearm_right_proxy_sword_hand` |
| Lower body | `hip_skirt_panel_center`, `hip_skirt_panel_left`, `hip_skirt_panel_right`, `leg_left_column`, `leg_right_column`, `foot_left_block`, `foot_right_block` |
| Sword | `sword_rectangular_slab_right_side`, `sword_guard_bar_horizontal`, `sword_violet_accent_proxy_nonfinal` |
| Hair | `hair_left_mass_shell_black_proxy` |

Not allowed for rig planning:

- replacing the source anchor with R5
- changing Anchor V1 locked reference files
- treating the source anchor reference plane as deformable character geometry
- adding facial controls, eye controls, mouth controls, or expression controls

---

## Bone / Control Planning Requirements

Future rig planning should define these control groups:

| Control Group | Planning Requirement |
|---|---|
| Root / world | one root control for global placement only |
| Pelvis / body root | pelvis or body-root control to preserve monolithic stance |
| Spine | simple low-count spine chain for subtle posture tests, not flexible character acting |
| Neck / head | head/helmet follow control; helmet remains sealed and rigid |
| Pauldrons | left/right pauldron controls that preserve width and prevent collapse into human shoulders |
| Arms | left/right simple arm controls for pose blocking; right arm must preserve sword-side readability |
| Sword | right-hand or sword-root attachment planning; sword remains a rigid rectangular slab |
| Hair mass | left-side hair mass guide control or simple parented shell control; no strand rig planning yet |
| Lower body | simple hip/leg controls for planted stance; avoid high-flex motion assumptions |

No facial rig is allowed. Sensor slit objects should remain rigid helmet details, not deforming facial features.

---

## Deformation-Risk Notes

- Helmet deformation risk: any head/helmet deformation could distort the ovoid and slit spacing. Treat helmet as rigid.
- Sensor slit risk: slits must remain exactly two separate horizontal marks. Do not bind them to facial deformation or expression controls.
- Pauldron risk: arm motion can visually narrow or collapse shoulder width. Plan pauldron controls independently from upper arms.
- Sword risk: sword can merge with torso or pauldron mass if attachment/pivot is poorly planned. Keep sword rigid and visually separated.
- Hair risk: hair mass can become cape-like or symmetric if over-rigged. Keep it left-side dominant and simple.
- Torso risk: excessive spine bend can break the monolithic ceremonial stance. Use restrained posture range.
- Lower-body risk: wide leg articulation can break columnar stance. Use planted pose tests first.

---

## Rig-Prep QA Checklist

Before any future rig execution task, confirm:

| Check | Required Result |
|---|---|
| Proxy blockout review remains PASS | PASS |
| Source anchor unchanged | PASS |
| Armature count remains 0 before rig execution | PASS |
| Helmet planned as rigid ovoid | PASS |
| Sensor slits planned as rigid helmet details | PASS |
| No facial controls planned | PASS |
| Pauldron width preservation planned | PASS |
| Sword rigid attachment planned | PASS |
| Hair left-mass guide planned | PASS |
| Rig execution separately approved | REQUIRED |

---

## Forbidden Changes

- no new AI image rendering
- no full-body R6
- no R5 replacement
- no final asset lock claim
- no rig creation in this task
- no rig readiness claim
- no cinematic-ready claim
- no changing Anchor V1 locked reference
- no modifying the existing `.blend` during this planning task

---

## Next Safe Task

```text
REVIEW_PROXY_RIG_PREP_FROM_ANCHOR_V1
```
