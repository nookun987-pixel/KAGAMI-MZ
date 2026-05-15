# MIKAGE_CHARACTER_PROXY_POSE_MOTION_TEST_SPEC_FROM_ANCHOR_V1

**Date:** 2026-05-16  
**Task:** `PREPARE_PROXY_POSE_MOTION_TEST_SPEC_FROM_ANCHOR_V1`  
**START_HEAD:** `899276c0623e7f4b7678fd1766b44113166a09e3`  
**Current route:** `CHARACTER_PRODUCTION_FROM_ANCHOR_V1`  

---

## Spec Status

| Field | Value |
|---|---|
| PROXY_POSE_MOTION_TEST_SPEC_STATUS | PREPARED |
| SOURCE_ANCHOR | `docs/character/anchor_v1_candidates/P3A_R4_HELMET_INPAINT_001.png` |
| REVIEW_TARGET_BLEND | `production/character/proxy_actor/MIKAGE_PROXY_3D_ACTOR_FROM_ANCHOR_V1_RIG_PREP_BLOCKOUT.blend` |
| PROXY_RIG_REVIEW_STATUS | PASS |
| 3D_ACTOR_STATUS | `PROXY_BLOCKOUT_CREATED` |
| RIG_STATUS | `PROXY_REVIEW_RIG_PASSED_CONTROLLED_TEST_GATE` |
| CINEMATIC_PROOF_SHOT_STATUS | `NOT_STARTED` |
| ASSET_LOCK_STATUS | `NOT_LOCKED` |
| NEXT_SAFE_TASK | `REVIEW_PROXY_POSE_MOTION_TEST_SPEC_FROM_ANCHOR_V1` |

This is a specification-only task. It does not create motion, animation, render output, cinematic output, or modified `.blend` files.

---

## Exact Blend File Allowed For Future Test

Future pose/motion testing may use only this review rig file:

```text
production/character/proxy_actor/MIKAGE_PROXY_3D_ACTOR_FROM_ANCHOR_V1_RIG_PREP_BLOCKOUT.blend
```

The file must be opened read/copy-only. Future test execution must save separate test output files and must not overwrite this review rig file or the original source blockout.

---

## Proposed Output Files For Future Test

Future execution may create these files only after this specification is reviewed and approved:

- `production/character/proxy_actor/motion_tests/MIKAGE_PROXY_POSE_MOTION_TEST_FROM_ANCHOR_V1.blend`
- `production/character/proxy_actor/motion_tests/MIKAGE_PROXY_POSE_MOTION_TEST_FROM_ANCHOR_V1_REVIEW_NOTES.md`
- `reports/MIKAGE_CHARACTER_PROXY_POSE_MOTION_TEST_EXECUTION_REPORT_FROM_ANCHOR_V1.md`

Optional viewport review stills may be created only if the future execution task explicitly approves non-cinematic viewport capture:

- `production/character/proxy_actor/motion_tests/review_frames/`

No cinematic render is authorized by this specification.

---

## Allowed Control Groups To Manipulate

Future test execution may manipulate only the reviewed proxy controls:

- root/world control
- pelvis/body root control
- low-count spine control
- head/helmet rigid follow control
- left/right pauldron rigid controls
- left/right simple arm controls
- right sword root/socket control
- left hair mass guide/control
- left/right simple leg controls
- left/right planted foot controls

All manipulation must remain conservative and limited to identity-preservation testing.

---

## Forbidden Controls / Features

Future test execution must not create or manipulate:

- facial controls
- facial bones
- facial shape keys
- expression controls
- visor morphs
- sensor slit animation controls
- eye, mouth, jaw, lip, brow, blink, cheek, or face-implying controls
- strand hair controls
- cape-like hair controls
- cinematic camera choreography
- final rig controls beyond the reviewed proxy rig

The helmet remains a rigid mask form, not a face rig.

---

## Pose Test List

Future pose testing should include these static checkpoints:

| Pose Test | Required Intent |
|---|---|
| Neutral stance check | Confirm the unposed rigged proxy still matches the reviewed Anchor V1 blockout silhouette. |
| Slight head/helmet turn | Test a small rigid helmet turn without deforming helmet, slits, or implied facial features. |
| Subtle torso posture shift | Test limited ceremonial posture adjustment while preserving monolithic body read. |
| Left/right pauldron preservation | Verify pauldron width does not collapse under simple arm/body adjustments. |
| Right sword hold/readability | Verify sword remains right-side, rectangular, rigid, and visually separate. |
| Left hair mass preservation | Verify hair remains a left-side mass shell, not symmetric or cape-like. |
| Planted leg/foot stance | Verify legs and feet remain columnar/planted under slight weight adjustments. |

---

## Motion Test List

Future motion testing must be a very short controlled test only:

- duration: 2-3 seconds maximum
- tempo: slow ceremonial motion
- motion type: restrained weight shift only
- no combat action
- no performance acting
- no facial animation
- no cinematic camera move

Motion checkpoints must confirm:

- helmet remains rigid
- sensor slits remain exactly two separate objects
- sword remains rigid and right-side readable
- pauldrons do not collapse
- hair remains left-side mass
- legs/feet remain grounded and readable
- no face, emotion, visor, blink, or sensor slit animation is introduced

---

## Identity-Preservation Checks

Every future pose or motion checkpoint must verify:

- Anchor V1 source reference remains unchanged.
- R5 is not introduced as a replacement source.
- Full-body R6 route remains closed.
- Helmet is rigid and sealed.
- Exactly two separate sensor slit objects remain visible.
- Sensor slits do not merge into a visor.
- Sensor slits do not become eyes, mouth, logo, or expression marks.
- Pauldrons remain broad and identity-defining.
- Sword remains a right-side rectangular slab.
- Hair remains a left-side black mass shell.
- Source anchor plane remains reference-only and hidden from render.
- No final asset lock is claimed.
- No final rig readiness is claimed.
- No cinematic readiness is claimed.

---

## Frame / Checkpoint Review Requirements

Future execution must document at minimum:

- frame 1: neutral stance
- frame midpoint: slow weight-shift checkpoint
- final frame: return or settled ceremonial stance
- object count
- armature count
- exact sensor slit object names
- control groups manipulated
- confirmation that no facial controls, facial bones, facial shape keys, expression controls, visor morphs, or sensor slit animation controls exist
- confirmation that source and review rig `.blend` files were not overwritten

If viewport stills are approved in the future execution task, they must be labeled as review frames only, not cinematic renders.

---

## Failure Conditions

The future test must fail if any of these occur:

- source review rig `.blend` is overwritten
- original blockout `.blend` is overwritten
- Anchor V1 locked reference is changed
- R5 replaces Anchor V1
- full-body R6 is opened
- new AI image rendering is invoked
- helmet deforms
- sensor slits merge, disappear, duplicate, or animate
- facial controls, facial bones, facial shape keys, expression controls, or visor morphs appear
- pauldrons collapse into normal shoulder width
- sword bends, moves to the wrong side, or merges visually with the body
- hair becomes symmetric, cape-like, or strand-rigged
- motion exceeds a restrained 2-3 second ceremonial test
- final asset lock, final rig readiness, or cinematic readiness is claimed

---

## Rollback Boundaries

Future execution must preserve:

- `production/character/proxy_actor/MIKAGE_PROXY_3D_ACTOR_FROM_ANCHOR_V1_BLOCKOUT.blend`
- `production/character/proxy_actor/MIKAGE_PROXY_3D_ACTOR_FROM_ANCHOR_V1_RIG_PREP_BLOCKOUT.blend`
- `docs/character/anchor_v1_candidates/P3A_R4_HELMET_INPAINT_001.png`

If a future test fails, discard only the generated test output files under:

```text
production/character/proxy_actor/motion_tests/
```

Do not roll back or alter the locked Anchor V1 source, the original proxy blockout, or the reviewed rig-prep blockout.

---

## Next Safe Task

```text
REVIEW_PROXY_POSE_MOTION_TEST_SPEC_FROM_ANCHOR_V1
```

The test specification must be reviewed before any pose or motion test execution is allowed.
