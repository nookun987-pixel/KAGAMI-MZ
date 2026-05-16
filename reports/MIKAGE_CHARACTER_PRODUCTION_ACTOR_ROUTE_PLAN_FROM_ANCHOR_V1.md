# MIKAGE_CHARACTER_PRODUCTION_ACTOR_ROUTE_PLAN_FROM_ANCHOR_V1

**Date:** 2026-05-16  
**Task:** `PREPARE_PRODUCTION_ACTOR_ROUTE_PLAN_FROM_ANCHOR_V1`  
**START_HEAD:** `6230d77f8e4f0ab55961e4f6758137aaa8682de5`  
**Current route:** `CHARACTER_PRODUCTION_FROM_ANCHOR_V1`  

---

## Route Plan Status

| Field | Value |
|---|---|
| PRODUCTION_ACTOR_ROUTE_PLAN_STATUS | PREPARED |
| PRODUCTION_ACTOR_ROUTE_PLAN_SCOPE | `PLANNING_ONLY` |
| PRODUCTION_ACTOR_EXECUTION_STATUS | `NOT_STARTED` |
| SOURCE_ANCHOR | `docs/character/anchor_v1_candidates/P3A_R4_HELMET_INPAINT_001.png` |
| ASSET_LOCK_STATUS | `NOT_LOCKED` |
| RIG_STATUS | `PROXY_CONTROLLED_MOTION_TEST_REVIEW_PASSED_NOT_FINAL` |
| CINEMATIC_PROOF_SHOT_STATUS | `NOT_STARTED` |
| 3D_ACTOR_STATUS | `PROXY_BLOCKOUT_CREATED` |
| NEXT_SAFE_TASK | `REVIEW_PRODUCTION_ACTOR_ROUTE_PLAN_FROM_ANCHOR_V1` |

This is a planning document only. It defines the route from Anchor V1 and proxy evidence toward a future production actor pipeline. It does not execute the build, modify `.blend` files, rig, render, create new images, create new motion, alter Anchor V1, claim final asset lock, claim final rig readiness, or claim cinematic readiness.

---

## 1. Route Purpose

The purpose of this route plan is to prepare a structured path from Anchor V1 and reviewed proxy rig evidence toward a future production actor.

The plan keeps all current assets non-final unless they are separately reviewed and approved. The existing proxy blockout, rig-prep blockout, and controlled motion evidence may inform planning, but they remain proxy-level evidence and are not final production assets.

---

## 2. Source Inputs

| Source | Path / Status |
|---|---|
| Anchor V1 image | `docs/character/anchor_v1_candidates/P3A_R4_HELMET_INPAINT_001.png` |
| Original proxy blockout | `production/character/proxy_actor/MIKAGE_PROXY_3D_ACTOR_FROM_ANCHOR_V1_BLOCKOUT.blend` |
| Reviewed rig-prep blockout | `production/character/proxy_actor/MIKAGE_PROXY_3D_ACTOR_FROM_ANCHOR_V1_RIG_PREP_BLOCKOUT.blend` |
| Controlled pose/motion test | `production/character/proxy_actor/motion_tests/MIKAGE_PROXY_POSE_MOTION_TEST_FROM_ANCHOR_V1.blend` |
| Limited proxy rig package manifest | `production/character/proxy_actor/MIKAGE_LIMITED_PROXY_RIG_REVIEW_PACKAGE_MANIFEST_FROM_ANCHOR_V1.md` |
| Internal proxy rig package usage baseline review | `reports/MIKAGE_CHARACTER_INTERNAL_PROXY_RIG_PACKAGE_USAGE_BASELINE_REVIEW_FROM_ANCHOR_V1.md` |
| Next-stage decision review | `reports/MIKAGE_CHARACTER_NEXT_STAGE_DECISION_REVIEW_AFTER_INTERNAL_PROXY_RIG_BASELINE_FROM_ANCHOR_V1.md` |
| Canon asset registry | `docs/pipeline/01_CANON_ASSET_REGISTRY.md` |

The canon asset registry remains authoritative for canon and candidate asset status. This route plan does not update registry status or assign new locked status.

---

## 3. Current Protected State

| Field | Protected Value |
|---|---|
| SOURCE_ANCHOR | `docs/character/anchor_v1_candidates/P3A_R4_HELMET_INPAINT_001.png` |
| ASSET_LOCK_STATUS | `NOT_LOCKED` |
| RIG_STATUS | `PROXY_CONTROLLED_MOTION_TEST_REVIEW_PASSED_NOT_FINAL` |
| CINEMATIC_PROOF_SHOT_STATUS | `NOT_STARTED` |
| 3D_ACTOR_STATUS | `PROXY_BLOCKOUT_CREATED` |

Anchor V1 remains unchanged. The proxy rig and motion evidence remain planning references only.

---

## 4. Proposed Route Gates

### Gate 1: Production Actor Source Audit

Check all source references before any build planning advances. Confirm Anchor V1, proxy blockout, rig-prep blockout, controlled motion evidence, package manifest, baseline reports, and canon registry constraints are complete and correctly scoped.

Required output for this gate: source audit report.

### Gate 2: Production Actor Requirement Spec

Define what the future production actor must support, including identity preservation, silhouette, armor, helmet, sensor slits, hair mass, sword readability, motion needs, rig expectations, and forbidden drift.

Required output for this gate: production actor requirement specification.

### Gate 3: Modeling Strategy Decision

Decide whether the future actor should be created by refining the proxy, rebuilding a clean actor from Anchor V1, or using a hybrid approach. The decision must preserve Anchor V1 identity and avoid treating proxy evidence as final geometry.

Required output for this gate: modeling strategy decision report.

### Gate 4: Topology and Silhouette Plan

Plan body shape, armor segmentation, helmet shape, hair mass, sword placement, pauldron width, proportions, deformation zones, and rigid identity anchors before any modeling execution.

Required output for this gate: topology and silhouette plan.

### Gate 5: Material and Canon Detail Plan

Define planned material language and detail rules, including white porcelain helmet/armor, black underlayer and void slits, violet accents, left-side black hair mass, and sword material identity. This plan must align with canon registry constraints.

Required output for this gate: material and canon detail plan.

### Gate 6: Rigging Requirement Plan

Define what a future production rig must move and what must remain rigid. Helmet, two sensor slits, sword, and pauldrons require rigid preservation rules. This gate plans rig requirements only and does not create a rig.

Required output for this gate: production rigging requirement plan.

### Gate 7: Review Checklist and Approval Gates

Define the PASS criteria needed before any build or execution task. This includes source integrity, identity preservation, topology readiness, material readiness, rigging requirements, forbidden drift, and explicit non-final boundaries.

Required output for this gate: review checklist and approval gate report.

---

## 5. Allowed Future Work

Allowed future work from this route plan:

- prepare source audit
- prepare production actor requirement specs
- prepare review checklists
- prepare modeling plan
- prepare topology and silhouette plan
- prepare material and canon detail plan
- prepare rigging requirement plan
- prepare production actor build plan later, after review gates

All future work must remain planning or review until a separate execution task is approved.

---

## 6. Forbidden Now

- No production actor build.
- No `.blend` modification.
- No rig creation.
- No new render.
- No new AI image.
- No new motion.
- No final rig readiness claim.
- No asset lock.
- No cinematic readiness.
- No full-body R6.
- No R5 replacement.
- No Anchor V1 modification.
- No production animation approval.
- No final character asset approval.

---

## 7. Next Safe Task

```text
REVIEW_PRODUCTION_ACTOR_ROUTE_PLAN_FROM_ANCHOR_V1
```
