# 00_LATEST_CODEX_HANDOFF

## 1. Latest Completed Task

`REVIEW_PROXY_RIG_PREP_FROM_ANCHOR_V1` - complete.

## 2. Confirmed State

| Field | Value |
|---|---|
| START_HEAD | `2793ee0659bd69c0df18b7bd37b6d17ce09e85d2` |
| COMPLETED_COMMIT | CURRENT_COMMIT (this handoff update; see git log top entry) |
| CURRENT_ROUTE | `CHARACTER_PRODUCTION_FROM_ANCHOR_V1` |
| SOURCE_ANCHOR | `docs/character/anchor_v1_candidates/P3A_R4_HELMET_INPAINT_001.png` |
| DECISION | `RIG_PREPARATION_FROM_CURRENT_PROXY_BLOCKOUT` |
| PROXY_RIG_PREP_REVIEW_STATUS | PASS |
| ASSET_LOCK_STATUS | `NOT_LOCKED` |
| 3D_ACTOR_STATUS | `PROXY_BLOCKOUT_CREATED` |
| RIG_STATUS | `NOT_STARTED` |
| CINEMATIC_PROOF_SHOT_STATUS | `NOT_STARTED` |

Note: `reports/MIKAGE_CHARACTER_PROXY_RIG_PREP_FROM_ANCHOR_V1.md` lists `Confirmed HEAD = a79d706`, while the completed prep commit is `2793ee0659bd69c0df18b7bd37b6d17ce09e85d2`. This handoff uses `START_HEAD` and `COMPLETED_COMMIT` to avoid state confusion.

## 3. Latest Result

Reviewed the proxy rig-prep plan:

```text
reports/MIKAGE_CHARACTER_PROXY_RIG_PREP_REVIEW_FROM_ANCHOR_V1.md
```

Review result: PASS.

The plan correctly defines allowed proxy objects, bone/control planning requirements, rigid helmet handling, protection for exactly two separate sensor slits, no facial rig/control, pauldron width preservation, rigid sword separation, left-side hair mass preservation, deformation-risk notes, and QA checks.

No rig was created. No rig readiness is claimed. The proxy `.blend` and Anchor V1 locked reference were not modified.

## 4. Current Route State

| Field | Value |
|---|---|
| PROXY_RIG_PREP_REVIEW_STATUS | PASS |
| NEXT_SAFE_TASK | `PREPARE_PROXY_RIG_EXECUTION_SPEC_FROM_ANCHOR_V1` |
| ASSET_LOCK_STATUS | `NOT_LOCKED` |
| 3D_ACTOR_STATUS | `PROXY_BLOCKOUT_CREATED` |
| RIG_STATUS | `NOT_STARTED` |
| CINEMATIC_PROOF_SHOT_STATUS | `NOT_STARTED` |

## 5. Latest Report Paths

- `reports/MIKAGE_CHARACTER_PROXY_RIG_PREP_REVIEW_FROM_ANCHOR_V1.md`
- `reports/MIKAGE_CHARACTER_PROXY_RIG_PREP_FROM_ANCHOR_V1.md`
- `reports/MIKAGE_CHARACTER_PROXY_REFINEMENT_OR_RIG_PREP_DECISION.md`
- `reports/MIKAGE_CHARACTER_PROXY_3D_ACTOR_BLOCKOUT_REVIEW.md`
- `production/character/proxy_actor/MIKAGE_PROXY_3D_ACTOR_FROM_ANCHOR_V1_NOTES.md`

## 6. Next Safe Task

```text
PREPARE_PROXY_RIG_EXECUTION_SPEC_FROM_ANCHOR_V1
```

## 7. Forbidden

- Do not create a rig.
- Do not claim rig readiness.
- Do not modify the proxy `.blend`.
- Do not render new AI images.
- Do not run full-body R6.
- Do not replace the source anchor with R5.
- Do not claim final asset lock.
- Do not claim cinematic readiness.
- Do not change the Anchor V1 locked reference.
