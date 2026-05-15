# 00_LATEST_CODEX_HANDOFF

## 1. Latest Completed Task

`REVIEW_PROXY_RIG_FROM_ANCHOR_V1` - complete.

## 2. Confirmed State

| Field | Value |
|---|---|
| START_HEAD | `3a8a302da6fa98f3f139916ccda4faa69df70444` |
| COMPLETED_COMMIT | CURRENT_COMMIT (this handoff update; see git log top entry) |
| CURRENT_ROUTE | `CHARACTER_PRODUCTION_FROM_ANCHOR_V1` |
| SOURCE_ANCHOR | `docs/character/anchor_v1_candidates/P3A_R4_HELMET_INPAINT_001.png` |
| DECISION | `RIG_PREPARATION_FROM_CURRENT_PROXY_BLOCKOUT` |
| PROXY_RIG_PREP_REVIEW_STATUS | PASS |
| PROXY_RIG_EXECUTION_SPEC_STATUS | PREPARED |
| PROXY_RIG_EXECUTION_SPEC_REVIEW_STATUS | PASS |
| PROXY_RIG_EXECUTION_STATUS | BUILT_FOR_REVIEW |
| PROXY_RIG_REVIEW_STATUS | PASS |
| ASSET_LOCK_STATUS | `NOT_LOCKED` |
| 3D_ACTOR_STATUS | `PROXY_BLOCKOUT_CREATED` |
| RIG_STATUS | `PROXY_REVIEW_RIG_PASSED_CONTROLLED_TEST_GATE` |
| CINEMATIC_PROOF_SHOT_STATUS | `NOT_STARTED` |

Note: `reports/MIKAGE_CHARACTER_PROXY_RIG_PREP_FROM_ANCHOR_V1.md` lists `Confirmed HEAD = a79d706`, while the completed prep commit is `2793ee0659bd69c0df18b7bd37b6d17ce09e85d2`. This handoff uses `START_HEAD` and `COMPLETED_COMMIT` to avoid state confusion.

## 3. Latest Result

Reviewed the proxy rig output:

```text
reports/MIKAGE_CHARACTER_PROXY_RIG_REVIEW_FROM_ANCHOR_V1.md
```

Review result: PASS.

The rigged proxy output opens in Blender, has 44 objects and 1 armature named `ARM_proxy_review_minimal_from_anchor_v1`, includes all expected minimal proxy control groups, preserves exactly two separate sensor slit objects, keeps helmet/sensor slits/sword/pauldrons as rigid anchors, keeps the sword as a right-side rectangular slab, keeps hair as a left-side mass shell, and keeps the source anchor plane reference-only and hidden from render.

No `.blend` file was modified during review. No motion test was run. No final rig readiness is claimed. No final asset lock is claimed. No cinematic readiness is claimed. The Anchor V1 locked reference was not modified.

## 4. Current Route State

| Field | Value |
|---|---|
| PROXY_RIG_PREP_REVIEW_STATUS | PASS |
| PROXY_RIG_EXECUTION_SPEC_STATUS | PREPARED |
| PROXY_RIG_EXECUTION_SPEC_REVIEW_STATUS | PASS |
| PROXY_RIG_EXECUTION_STATUS | BUILT_FOR_REVIEW |
| PROXY_RIG_REVIEW_STATUS | PASS |
| NEXT_SAFE_TASK | `PREPARE_PROXY_POSE_MOTION_TEST_SPEC_FROM_ANCHOR_V1` |
| ASSET_LOCK_STATUS | `NOT_LOCKED` |
| 3D_ACTOR_STATUS | `PROXY_BLOCKOUT_CREATED` |
| RIG_STATUS | `PROXY_REVIEW_RIG_PASSED_CONTROLLED_TEST_GATE` |
| CINEMATIC_PROOF_SHOT_STATUS | `NOT_STARTED` |

## 5. Latest Report Paths

- `reports/MIKAGE_CHARACTER_PROXY_RIG_REVIEW_FROM_ANCHOR_V1.md`
- `reports/MIKAGE_CHARACTER_PROXY_RIG_EXECUTION_REPORT_FROM_ANCHOR_V1.md`
- `production/character/proxy_actor/MIKAGE_PROXY_3D_ACTOR_FROM_ANCHOR_V1_RIG_PREP_BLOCKOUT.blend`
- `reports/MIKAGE_CHARACTER_PROXY_RIG_EXECUTION_SPEC_REVIEW_FROM_ANCHOR_V1.md`
- `reports/MIKAGE_CHARACTER_PROXY_RIG_EXECUTION_SPEC_FROM_ANCHOR_V1.md`
- `reports/MIKAGE_CHARACTER_PROXY_RIG_PREP_REVIEW_FROM_ANCHOR_V1.md`
- `reports/MIKAGE_CHARACTER_PROXY_RIG_PREP_FROM_ANCHOR_V1.md`
- `reports/MIKAGE_CHARACTER_PROXY_REFINEMENT_OR_RIG_PREP_DECISION.md`
- `reports/MIKAGE_CHARACTER_PROXY_3D_ACTOR_BLOCKOUT_REVIEW.md`
- `production/character/proxy_actor/MIKAGE_PROXY_3D_ACTOR_FROM_ANCHOR_V1_NOTES.md`

## 6. Next Safe Task

```text
PREPARE_PROXY_POSE_MOTION_TEST_SPEC_FROM_ANCHOR_V1
```

## 7. Forbidden

- Do not claim final rig readiness.
- Do not overwrite the source proxy blockout `.blend`.
- Do not run motion tests until a controlled test spec is prepared and reviewed.
- Do not render new AI images.
- Do not run full-body R6.
- Do not replace the source anchor with R5.
- Do not claim final asset lock.
- Do not claim cinematic readiness.
- Do not change the Anchor V1 locked reference.
