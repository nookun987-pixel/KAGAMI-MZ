# MIKAGE_CHARACTER_PROXY_3D_ACTOR_BUILD_EXECUTION_PREP_FROM_ANCHOR_V1

**Date:** 2026-05-16  
**Task:** `PREPARE_PROXY_3D_ACTOR_BUILD_EXECUTION_FROM_ANCHOR_V1`  
**Confirmed HEAD requested:** `d167dba`  
**Actual HEAD:** `0167dbaca704b425b8fcb156462e1f9cdb0b0773`  
**Current route:** `CHARACTER_PRODUCTION_FROM_ANCHOR_V1`  

Note: `d167dba` was not a valid object in this repository. Current HEAD is `0167dba`, matching the latest build-spec review commit with a leading zero.

---

## Execution Prep Status

| Field | Value |
|---|---|
| PROXY_3D_ACTOR_BUILD_EXECUTION_PREP_STATUS | PREPARED |
| SOURCE_ANCHOR | `docs/character/anchor_v1_candidates/P3A_R4_HELMET_INPAINT_001.png` |
| NEXT_SAFE_TASK | `EXECUTE_PROXY_3D_ACTOR_BUILD_FROM_ANCHOR_V1` |
| ASSET_LOCK_STATUS | `NOT_LOCKED` |
| 3D_ACTOR_STATUS | `NOT_STARTED` |
| RIG_STATUS | `NOT_STARTED` |
| CINEMATIC_PROOF_SHOT_STATUS | `NOT_STARTED` |

This is execution preparation only. No actual 3D actor is created by this task.

---

## Build Execution Objective

Prepare a controlled execution package for a future proxy 3D actor blockout build from Anchor V1.

The future build, if separately approved, should create a low-poly/blockout proxy that tests silhouette, scale, pauldron width, helmet/slit readability, sword placement, and left-side hair mass. It must not create a final character asset, rig, cinematic proof shot, or production-ready model.

---

## Required Inputs

| Input | Path |
|---|---|
| Source anchor | `docs/character/anchor_v1_candidates/P3A_R4_HELMET_INPAINT_001.png` |
| Build spec review | `reports/MIKAGE_CHARACTER_PROXY_3D_ACTOR_BUILD_SPEC_REVIEW.md` |
| Build spec | `reports/MIKAGE_CHARACTER_PROXY_3D_ACTOR_BUILD_SPEC_FROM_ANCHOR_V1.md` |
| Proxy actor plan review | `reports/MIKAGE_CHARACTER_PROXY_3D_ACTOR_PLAN_REVIEW.md` |
| Full-body constraints | `reports/MIKAGE_CHARACTER_FULL_BODY_PRODUCTION_CONSTRAINTS_FROM_ANCHOR_V1.md` |
| Production source pack | `reports/MIKAGE_CHARACTER_PRODUCTION_SOURCE_PACK_FROM_ANCHOR_V1.md` |
| Anchor V1 registry entry | `docs/character/MIKAGE_CHARACTER_ANCHOR_V1_ASSET_REGISTRY_ENTRY.md` |

---

## Planned Output Paths

These paths are reserved for a future execution task. They are not created by this task.

| Planned Output | Path |
|---|---|
| Proxy actor scene file | `production/character/proxy_actor/MIKAGE_PROXY_3D_ACTOR_FROM_ANCHOR_V1_BLOCKOUT.blend` |
| Proxy actor notes | `production/character/proxy_actor/MIKAGE_PROXY_3D_ACTOR_FROM_ANCHOR_V1_NOTES.md` |
| Proxy actor review directory | `production/character/proxy_actor/review/` |
| Proxy actor execution report | `reports/MIKAGE_CHARACTER_PROXY_3D_ACTOR_BUILD_EXECUTION_REPORT.md` |

---

## Blender / Build Environment Requirements

Future execution should verify:

- Blender is installed and callable in the execution environment.
- Output directory `production/character/proxy_actor/` can be created or already exists.
- The source anchor image is available for viewport/reference use.
- Build script or manual build steps are reviewed before execution.
- No AI image generation pipeline is invoked.
- No full-body R6 workflow is invoked.
- No source image is overwritten.

Recommended execution environment:

- Blender scene units: metric or unitless, consistent scale.
- Camera/reference plane allowed only for comparing silhouette.
- Mesh primitives only for first pass.
- Materials are proxy placeholders only.

---

## Exact Build Stages

1. Verify source anchor and all required reports exist.
2. Create or open the proxy blockout scene.
3. Add source anchor as non-render reference plane or viewport guide.
4. Block out helmet ovoid.
5. Add exactly two separate black slit strips on helmet face.
6. Block out neck and tapered torso.
7. Block out wide left and right pauldrons.
8. Block out arms and columnar legs.
9. Block out lower vertical armor/skirt panels.
10. Block out right-side rectangular sword slab and guard.
11. Block out left-side hair mass shell.
12. Apply proxy material placeholders only.
13. Save planned scene file.
14. Create proxy notes documenting component names, proportions, and deviations.
15. Produce review captures only if separately allowed by the execution task.
16. Write execution report.

---

## QA Checkpoints Before Execution

Execution must not start unless all checks pass:

| Check | Required Result |
|---|---|
| Source anchor exists | PASS |
| Source anchor path matches Anchor V1 | PASS |
| Build spec review status is PASS | PASS |
| Asset lock status remains NOT_LOCKED | PASS |
| 3D actor status remains NOT_STARTED before execution | PASS |
| Rig status remains NOT_STARTED | PASS |
| Cinematic proof shot status remains NOT_STARTED | PASS |
| Output path does not overwrite locked source anchor | PASS |
| No AI image rendering step is included | PASS |
| No full-body R6 step is included | PASS |
| No R5 input is included | PASS |
| No final asset lock claim is included | PASS |

---

## Rollback / Blocker Rules

Stop execution preparation or future execution if:

- source anchor is missing or changed
- build spec review is missing or not PASS
- output path would overwrite Anchor V1 files
- any step invokes AI image rendering
- any step invokes full-body R6
- R5 is used as source or replacement
- Blender/build environment is unavailable
- proxy output begins to imply final asset lock, rig readiness, or cinematic readiness

Rollback rule for future execution:

- Delete only newly created proxy build outputs if execution fails.
- Do not delete or modify Anchor V1 source files.
- Preserve reports for audit unless a separate cleanup task explicitly approves removal.

---

## Forbidden Claims

- no new AI image rendering
- no full-body R6
- no R5 replacement
- no final asset lock claim
- no actual 3D actor creation in this task
- no rig claim
- no cinematic-ready claim
- no changing Anchor V1 locked reference

---

## Next Safe Task

```text
EXECUTE_PROXY_3D_ACTOR_BUILD_FROM_ANCHOR_V1
```

Execution still requires a separate explicit execution approval task.
