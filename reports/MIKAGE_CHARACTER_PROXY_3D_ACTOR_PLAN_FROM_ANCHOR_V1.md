# MIKAGE_CHARACTER_PROXY_3D_ACTOR_PLAN_FROM_ANCHOR_V1

**Date:** 2026-05-15  
**Task:** `PREPARE_PROXY_3D_ACTOR_PLAN_FROM_ANCHOR_V1`  
**Confirmed HEAD:** `7ec2975`  
**Current route:** `CHARACTER_PRODUCTION_FROM_ANCHOR_V1`  

---

## Plan Status

| Field | Value |
|---|---|
| PROXY_3D_ACTOR_PLAN_STATUS | PREPARED |
| SOURCE_ANCHOR | `docs/character/anchor_v1_candidates/P3A_R4_HELMET_INPAINT_001.png` |
| NEXT_SAFE_TASK | `REVIEW_PROXY_3D_ACTOR_PLAN_FROM_ANCHOR_V1` |
| ASSET_LOCK_STATUS | `NOT_LOCKED` |
| 3D_ACTOR_STATUS | `NOT_STARTED` |
| RIG_STATUS | `NOT_STARTED` |
| CINEMATIC_PROOF_SHOT_STATUS | `NOT_STARTED` |

This is planning only. No 3D actor is created by this report.

---

## Proxy Actor Purpose

Prepare a low-detail proxy actor plan that can later test Mikage's Anchor V1 silhouette, body proportions, sword placement, hair mass, and motion readability before any final character asset work begins.

The proxy actor is for planning and future review only. It is not a final asset, not a rigged actor, and not cinematic-ready.

---

## Source References

| Role | Path |
|---|---|
| Source anchor | `docs/character/anchor_v1_candidates/P3A_R4_HELMET_INPAINT_001.png` |
| Production source pack | `reports/MIKAGE_CHARACTER_PRODUCTION_SOURCE_PACK_FROM_ANCHOR_V1.md` |
| Full-body constraints | `reports/MIKAGE_CHARACTER_FULL_BODY_PRODUCTION_CONSTRAINTS_FROM_ANCHOR_V1.md` |
| Registry entry | `docs/character/MIKAGE_CHARACTER_ANCHOR_V1_ASSET_REGISTRY_ENTRY.md` |
| Silhouette spec | `reports/MIKAGE_SILHOUETTE_CANON_V1_LOCK_SPEC.md` |
| Score report | `reports/SCORE_P3A_R4_HELMET_INPAINT_ANCHOR_CANDIDATE.md` |

---

## Body Proportion Targets

- Use Anchor V1 as the visual source of truth.
- Helmet remains an elongated portrait ovoid, approximately 1.33x to 1.44x height-to-width.
- Pauldrons remain the dominant horizontal mass, guarded by the 2.4x to 2.9x helmet-width range from the silhouette spec.
- Torso tapers from broad shoulders into narrower waist, then slight hip flare.
- Legs read as planted, columnar armored supports.
- Overall read remains monolithic, ceremonial, and sealed.

---

## Component Constraints

### Helmet

- Ovoid helmet, cool white porcelain / ceramic.
- Sealed and faceless.
- No eyes, mouth, nose, visor, logo, mesh, or expression.

### Sensor Slits

- Exactly two separate ultra-thin horizontal void-black slits.
- Slits span about 70% of helmet width.
- Visible white porcelain gap between slits.
- No one-slit or merged-visor simplification in proxy markings.

### Pauldrons

- Broad flat-topped shoulder masses.
- Must remain much wider than torso and helmet.
- Should be blockout-readable from front view and 3/4 view.
- Do not collapse into normal human shoulder width.

### Sword

- Right-side rectangular slab proxy.
- No taper, curve, point, katana read, or thin blade.
- Guard may be a simple horizontal block.
- Sword must remain visually separate from the body and pauldrons at thumbnail scale.

### Hair

- Long black left-side mass.
- Use a simple blockout shell or ribbon-mass for proxy planning.
- Must preserve left negative-space weight and lower-body fall.
- Do not replace with short hair, strands-only hair, or symmetric cape mass.

---

## Low-Poly / Blockout Strategy

Proxy forms should be simple, measurable primitives:

- helmet: elongated ovoid mesh or scaled ellipsoid
- slits: two shallow black inset strips or material bands on helmet face
- neck: narrow dark connector
- pauldrons: wide angular block plates, left and right separate
- torso: tapered armor block stack
- hips / skirt plates: vertical slab panels preserving the monolithic lower silhouette
- legs: armored column blocks with minimal inner gap
- sword: rectangular slab plus horizontal guard block
- hair: left-side black mass shell, not individual strands

Use neutral proportions first. Detail pass is not part of this plan.

---

## Rig Preparation Notes

No rig is created by this task.

Future rig planning should reserve:

- root / pelvis control for monolithic stance tests
- spine chain sufficient for subtle ceremonial posture shifts
- shoulder controls that preserve pauldron volume without collapse
- arm controls that keep sword side readable
- hair proxy controls or simple dynamic guide for left-side mass only
- sword attachment point on right hand or right-side planted pose control
- helmet locked to head with no facial rig requirements

Do not plan facial controls. The helmet is sealed and expressionless.

---

## Motion-Test Readiness Criteria

Before a motion test can start, a reviewed proxy plan must prove:

- silhouette readable in front and 3/4 views
- helmet slits visible and still two separate marks
- pauldrons remain wide during arm pose changes
- sword remains rectangular and separate from torso
- hair mass remains left-side dominant during motion
- full body remains sealed and armored
- no facial expression or exposed skin is introduced
- thumbnail read survives simple idle, turntable, and planted sword pose tests

Motion-test readiness is not granted by this report.

---

## QA Checklist

| Check | Required Result |
|---|---|
| Source anchor unchanged | PASS |
| Proxy plan references Anchor V1 only | PASS |
| Helmet ovoid preserved | PASS |
| Exactly two separate sensor slits planned | PASS |
| No facial controls planned | PASS |
| Pauldron width preserved | PASS |
| Armor coverage preserved | PASS |
| Sword rectangular slab preserved | PASS |
| Hair mass left-side preserved | PASS |
| Low-poly/blockout only | PASS |
| No actual 3D actor created | PASS |
| No rig claim | PASS |
| No cinematic-ready claim | PASS |

---

## Forbidden Drift List

- new image rendering
- full-body R6
- replacing Anchor V1 with R5
- final asset lock claim
- actual 3D actor creation
- rig claim
- cinematic-ready claim
- changing Anchor V1 locked reference
- face controls, eyes, mouth, expression, or exposed skin
- narrow pauldrons
- curved/tapered sword
- short or symmetric hair mass
- generic mech, samurai, anime, or heroic fantasy drift

---

## Next Safe Task

```text
REVIEW_PROXY_3D_ACTOR_PLAN_FROM_ANCHOR_V1
```
