# MIKAGE_CHARACTER_PROXY_3D_ACTOR_BUILD_SPEC_FROM_ANCHOR_V1

**Date:** 2026-05-16  
**Task:** `PREPARE_PROXY_3D_ACTOR_BUILD_SPEC_FROM_ANCHOR_V1`  
**Confirmed HEAD requested:** `e2599841`  
**Actual HEAD:** `e259984446faaf67f83842da6cb7af2443226b6d`  
**Current route:** `CHARACTER_PRODUCTION_FROM_ANCHOR_V1`  

Note: `e2599841` was not a valid object in this repository. The current HEAD is `e259984`, matching the latest review commit prefix.

---

## Build Spec Status

| Field | Value |
|---|---|
| PROXY_3D_ACTOR_BUILD_SPEC_STATUS | PREPARED |
| SOURCE_ANCHOR | `docs/character/anchor_v1_candidates/P3A_R4_HELMET_INPAINT_001.png` |
| NEXT_SAFE_TASK | `REVIEW_PROXY_3D_ACTOR_BUILD_SPEC_FROM_ANCHOR_V1` |
| ASSET_LOCK_STATUS | `NOT_LOCKED` |
| 3D_ACTOR_STATUS | `NOT_STARTED` |
| RIG_STATUS | `NOT_STARTED` |
| CINEMATIC_PROOF_SHOT_STATUS | `NOT_STARTED` |

This is a build specification only. No actual 3D actor is created by this document.

---

## Build Objective

Define a future low-poly proxy actor build that can test Mikage's Anchor V1 silhouette, proportions, helmet/slit read, pauldron mass, sword placement, and hair mass before any production execution.

The proxy must be measurable, simple, and reviewable. It is not a final character asset, not a rig, and not cinematic-ready.

---

## Required Source References

| Role | Path |
|---|---|
| Source anchor | `docs/character/anchor_v1_candidates/P3A_R4_HELMET_INPAINT_001.png` |
| Proxy plan review | `reports/MIKAGE_CHARACTER_PROXY_3D_ACTOR_PLAN_REVIEW.md` |
| Proxy actor plan | `reports/MIKAGE_CHARACTER_PROXY_3D_ACTOR_PLAN_FROM_ANCHOR_V1.md` |
| Full-body constraints | `reports/MIKAGE_CHARACTER_FULL_BODY_PRODUCTION_CONSTRAINTS_FROM_ANCHOR_V1.md` |
| Production source pack | `reports/MIKAGE_CHARACTER_PRODUCTION_SOURCE_PACK_FROM_ANCHOR_V1.md` |
| Registry entry | `docs/character/MIKAGE_CHARACTER_ANCHOR_V1_ASSET_REGISTRY_ENTRY.md` |
| Silhouette spec | `reports/MIKAGE_SILHOUETTE_CANON_V1_LOCK_SPEC.md` |

---

## Proxy Mesh Components

- `helmet_ovoid_proxy`
- `helmet_sensor_slit_upper`
- `helmet_sensor_slit_lower`
- `neck_dark_connector`
- `torso_tapered_core`
- `pauldron_left_block`
- `pauldron_right_block`
- `upper_arm_left_proxy`
- `upper_arm_right_proxy`
- `forearm_left_proxy`
- `forearm_right_proxy`
- `hip_skirt_panel_center`
- `hip_skirt_panel_left`
- `hip_skirt_panel_right`
- `leg_left_column`
- `leg_right_column`
- `sword_rectangular_slab`
- `sword_guard_bar`
- `hair_left_mass_shell`

---

## Approximate Primitive Shapes

| Component | Primitive Strategy |
|---|---|
| Helmet | scaled ellipsoid / ovoid mesh |
| Sensor slits | two thin black inset rectangular strips on helmet face |
| Neck | narrow dark cylinder or tapered block |
| Torso | stacked tapered trapezoid blocks |
| Pauldrons | wide angular wedge/block plates |
| Arms | simple armored capsule/block segments |
| Hips / skirt plates | vertical slab panels |
| Legs | columnar armored blocks with minimal inner gap |
| Sword | tall rectangular cuboid slab |
| Sword guard | thin horizontal cuboid bar |
| Hair | left-side shell/ribbon mass, not strand simulation |

---

## Material Placeholders

- `MAT_PORCELAIN_WHITE_PROXY`: cool matte white helmet and armor.
- `MAT_VOID_BLACK_PROXY`: sensor slits, underlayer, sword slab, hair mass.
- `MAT_DARK_GRAPHENE_PROXY`: dark gaps and neck connector.
- `MAT_VIOLET_ACCENT_PROXY`: restrained secondary accents only.

No final material lock is claimed. These are proxy placeholders only.

---

## Scale / Proportion Rules

- Helmet remains an elongated portrait ovoid, about 1.33x to 1.44x height-to-width.
- Pauldrons remain the dominant horizontal mass, guarded by the 2.4x to 2.9x helmet-width range.
- Torso tapers from broad shoulders to narrow waist, then slight hip flare.
- Legs remain planted, columnar, and armored.
- Hair mass occupies the left negative space and drops toward lower body.
- Sword occupies the right side and remains visually separate from body and pauldrons.
- Thumbnail read must preserve helmet, two slits, pauldrons, hair, body, and sword.

---

## Helmet / Slit Implementation Notes

- Build helmet as a sealed ovoid with no facial rig, no eyes, no mouth, no nose, no visor, and no logo.
- Place exactly two separate horizontal slit strips on the faceplate.
- Slits must be void-black and span about 70% of helmet width.
- Preserve a visible porcelain gap between slits.
- Do not simplify slits into one band or a merged visor.

## Pauldron Blockout Notes

- Use wide angular block plates, left and right separate.
- Pauldrons must stay much wider than torso and helmet.
- Right side may carry slightly stronger mass to support sword-side balance.
- Keep shoulder shapes readable in front and 3/4 view.

## Sword Slab Blockout Notes

- Use a rectangular cuboid slab with no taper, curve, point, or katana silhouette.
- Place on character right side.
- Add a simple horizontal guard bar.
- Keep blade distinct from pauldron and torso at thumbnail scale.

## Hair Mass Blockout Notes

- Use a single left-side black mass shell or ribbon-like volume.
- Hair should originate near helmet crown and descend toward lower body.
- Do not model strand detail for the proxy.
- Do not make the hair symmetric, short, or cape-like.

---

## File / Output Naming Plan

If later approved for build execution, use a separate build task and these planned names:

| Planned Output | Path |
|---|---|
| Proxy actor scene file | `production/character/proxy_actor/MIKAGE_PROXY_3D_ACTOR_FROM_ANCHOR_V1_BLOCKOUT.blend` |
| Proxy actor notes | `production/character/proxy_actor/MIKAGE_PROXY_3D_ACTOR_FROM_ANCHOR_V1_NOTES.md` |
| Proxy actor review captures | `production/character/proxy_actor/review/` |

These files are not created by this task.

---

## QA Checklist

| Check | Required Result |
|---|---|
| Source anchor unchanged | PASS |
| Build spec references Anchor V1 only | PASS |
| Helmet ovoid specified | PASS |
| Exactly two separate slits specified | PASS |
| Pauldron width specified | PASS |
| Sword rectangular slab specified | PASS |
| Hair left mass specified | PASS |
| Low-poly/blockout strategy specified | PASS |
| Material placeholders are non-final | PASS |
| File naming plan exists | PASS |
| No actual 3D actor created | PASS |
| No rig claim | PASS |
| No cinematic-ready claim | PASS |

---

## Forbidden Execution Claims

- no new image rendering
- no full-body R6
- no R5 replacement
- no final asset lock claim
- no actual 3D actor creation
- no rig claim
- no cinematic-ready claim
- no changing Anchor V1 locked reference

---

## Next Safe Task

```text
REVIEW_PROXY_3D_ACTOR_BUILD_SPEC_FROM_ANCHOR_V1
```
