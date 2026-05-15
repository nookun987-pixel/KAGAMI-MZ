# 00_LATEST_CODEX_HANDOFF

## 1. Latest Completed Task

`PREPARE_PROXY_RIG_PREP_FROM_ANCHOR_V1` - complete.

## 2. Confirmed State

| Field | Value |
|---|---|
| HEAD | `a79d706` |
| CURRENT_ROUTE | `CHARACTER_PRODUCTION_FROM_ANCHOR_V1` |
| SOURCE_ANCHOR | `docs/character/anchor_v1_candidates/P3A_R4_HELMET_INPAINT_001.png` |
| DECISION | `RIG_PREPARATION_FROM_CURRENT_PROXY_BLOCKOUT` |
| PROXY_RIG_PREP_STATUS | PREPARED |
| ASSET_LOCK_STATUS | `NOT_LOCKED` |
| 3D_ACTOR_STATUS | `PROXY_BLOCKOUT_CREATED` |
| RIG_STATUS | `NOT_STARTED` |
| CINEMATIC_PROOF_SHOT_STATUS | `NOT_STARTED` |

## 3. Latest Result

Prepared the proxy rig-prep plan:

```text
reports/MIKAGE_CHARACTER_PROXY_RIG_PREP_FROM_ANCHOR_V1.md
```

The plan defines bone/control planning requirements, allowed proxy objects for rig planning, deformation-risk notes, QA checks, and forbidden changes.

No rig was created. No rig readiness is claimed. The Anchor V1 locked reference and proxy `.blend` were not modified.

## 4. Current Route State

| Field | Value |
|---|---|
| PROXY_RIG_PREP_STATUS | PREPARED |
| NEXT_SAFE_TASK | `REVIEW_PROXY_RIG_PREP_FROM_ANCHOR_V1` |
| ASSET_LOCK_STATUS | `NOT_LOCKED` |
| 3D_ACTOR_STATUS | `PROXY_BLOCKOUT_CREATED` |
| RIG_STATUS | `NOT_STARTED` |
| CINEMATIC_PROOF_SHOT_STATUS | `NOT_STARTED` |

## 5. Latest Report Paths

- `reports/MIKAGE_CHARACTER_PROXY_RIG_PREP_FROM_ANCHOR_V1.md`
- `reports/MIKAGE_CHARACTER_PROXY_REFINEMENT_OR_RIG_PREP_DECISION.md`
- `reports/MIKAGE_CHARACTER_PROXY_3D_ACTOR_BLOCKOUT_REVIEW.md`
- `production/character/proxy_actor/MIKAGE_PROXY_3D_ACTOR_FROM_ANCHOR_V1_NOTES.md`
- `production/character/proxy_actor/MIKAGE_PROXY_3D_ACTOR_FROM_ANCHOR_V1_BLOCKOUT.blend`

## 6. Next Safe Task

```text
REVIEW_PROXY_RIG_PREP_FROM_ANCHOR_V1
```

## 7. Forbidden

- Do not render new AI images.
- Do not run full-body R6.
- Do not replace the source anchor with R5.
- Do not claim final asset lock.
- Do not create a rig.
- Do not claim rig readiness.
- Do not claim cinematic readiness.
- Do not change the Anchor V1 locked reference.
