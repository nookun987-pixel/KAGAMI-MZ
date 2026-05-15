# 00_LATEST_CODEX_HANDOFF

## 1. Latest Completed Task

`DECIDE_PROXY_REFINEMENT_OR_RIG_PREP_FROM_ANCHOR_V1` - complete.

## 2. Confirmed State

| Field | Value |
|---|---|
| HEAD | `38e4abb` |
| CURRENT_ROUTE | `CHARACTER_PRODUCTION_FROM_ANCHOR_V1` |
| PROXY_REFINEMENT_OR_RIG_PREP_DECISION_STATUS | COMPLETE |
| DECISION | `RIG_PREPARATION_FROM_CURRENT_PROXY_BLOCKOUT` |
| ASSET_LOCK_STATUS | `NOT_LOCKED` |
| 3D_ACTOR_STATUS | `PROXY_BLOCKOUT_CREATED` |
| RIG_STATUS | `NOT_STARTED` |
| CINEMATIC_PROOF_SHOT_STATUS | `NOT_STARTED` |

## 3. Latest Result

Decided the next route from the reviewed proxy blockout:

```text
reports/MIKAGE_CHARACTER_PROXY_REFINEMENT_OR_RIG_PREP_DECISION.md
```

Selected route:

```text
PREPARE_PROXY_RIG_PREP_FROM_ANCHOR_V1
```

Reason: the proxy blockout passed review with required Anchor V1 components present, and no documented geometry blocker requires refinement before rig-prep planning.

No rig was created. No rig readiness is claimed.

## 4. Current Route State

| Field | Value |
|---|---|
| PROXY_REFINEMENT_OR_RIG_PREP_DECISION_STATUS | COMPLETE |
| NEXT_SAFE_TASK | `PREPARE_PROXY_RIG_PREP_FROM_ANCHOR_V1` |
| ASSET_LOCK_STATUS | `NOT_LOCKED` |
| 3D_ACTOR_STATUS | `PROXY_BLOCKOUT_CREATED` |
| RIG_STATUS | `NOT_STARTED` |
| CINEMATIC_PROOF_SHOT_STATUS | `NOT_STARTED` |

## 5. Latest Report Paths

- `reports/MIKAGE_CHARACTER_PROXY_REFINEMENT_OR_RIG_PREP_DECISION.md`
- `reports/MIKAGE_CHARACTER_PROXY_3D_ACTOR_REFINEMENT_OR_RIG_PREP_FROM_ANCHOR_V1.md`
- `reports/MIKAGE_CHARACTER_PROXY_3D_ACTOR_BLOCKOUT_REVIEW.md`
- `reports/MIKAGE_CHARACTER_PROXY_3D_ACTOR_BUILD_EXECUTION_REPORT.md`
- `production/character/proxy_actor/MIKAGE_PROXY_3D_ACTOR_FROM_ANCHOR_V1_NOTES.md`

## 6. Next Safe Task

```text
PREPARE_PROXY_RIG_PREP_FROM_ANCHOR_V1
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
