# MIKAGE_CHARACTER_PRODUCTION_ROUTE_FROM_ANCHOR_V1_OPEN

**Date:** 2026-05-15  
**Task:** `OPEN_CHARACTER_PRODUCTION_ROUTE_FROM_ANCHOR_V1`  
**Confirmed HEAD:** `9b7d04b`  

---

## Route State

| Field | Value |
|---|---|
| CURRENT_ROUTE | `CHARACTER_PRODUCTION_FROM_ANCHOR_V1` |
| SOURCE_ANCHOR | `docs/character/anchor_v1_candidates/P3A_R4_HELMET_INPAINT_001.png` |
| ANCHOR_V1_ROUTE_STATUS | CLOSED |
| PRODUCTION_ROUTE_STATUS | OPENED |
| NEXT_SAFE_TASK | `BUILD_CHARACTER_PRODUCTION_SOURCE_PACK_FROM_ANCHOR_V1` |
| ASSET_LOCK_STATUS | `NOT_LOCKED` |
| 3D_ACTOR_STATUS | `NOT_STARTED` |
| RIG_STATUS | `NOT_STARTED` |
| CINEMATIC_PROOF_SHOT_STATUS | `NOT_STARTED` |

---

## Starting Point

Anchor V1 route is complete. Do not continue the old Anchor V1 render/revision route.

Locked Anchor V1 source:

```text
docs/character/anchor_v1_candidates/P3A_R4_HELMET_INPAINT_001.png
```

Registry:

```text
docs/character/MIKAGE_CHARACTER_ANCHOR_V1_ASSET_REGISTRY_ENTRY.md
```

Final handoff:

```text
reports/MIKAGE_CHARACTER_ANCHOR_V1_FINAL_HANDOFF.md
```

---

## Required Production Route Order

1. Audit Anchor V1 and existing locked canon sources.
2. Build character production source pack from Anchor V1.
3. Define full-body production constraints.
4. Create proxy 3D actor plan.
5. Prepare rig/motion test plan.
6. Prepare cinematic proof shot plan.
7. Only after review, allow production execution.

---

## Boundary

This opens a new character production route from Anchor V1. It does not unlock the closed Anchor V1 render/revision route.

Forbidden from this state:

- Do not render new images.
- Do not run full-body R6.
- Do not replace the source anchor with R5.
- Do not claim final asset lock.
- Do not claim 3D actor readiness.
- Do not claim rig readiness.
- Do not claim cinematic readiness.
- Do not change the Anchor V1 locked reference.

---

## Next Safe Task

```text
BUILD_CHARACTER_PRODUCTION_SOURCE_PACK_FROM_ANCHOR_V1
```
