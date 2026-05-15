# MIKAGE_CHARACTER_FULL_BODY_PRODUCTION_CONSTRAINTS_FROM_ANCHOR_V1

**Date:** 2026-05-15  
**Task:** `DEFINE_FULL_BODY_PRODUCTION_CONSTRAINTS_FROM_ANCHOR_V1`  
**Confirmed HEAD:** `efe889a`  
**Current route:** `CHARACTER_PRODUCTION_FROM_ANCHOR_V1`  

---

## Constraint Status

| Field | Value |
|---|---|
| FULL_BODY_PRODUCTION_CONSTRAINTS_STATUS | PREPARED |
| SOURCE_ANCHOR | `docs/character/anchor_v1_candidates/P3A_R4_HELMET_INPAINT_001.png` |
| SOURCE_PACK | `reports/MIKAGE_CHARACTER_PRODUCTION_SOURCE_PACK_FROM_ANCHOR_V1.md` |
| NEXT_SAFE_TASK | `PREPARE_PROXY_3D_ACTOR_PLAN_FROM_ANCHOR_V1` |
| ASSET_LOCK_STATUS | `NOT_LOCKED` |
| 3D_ACTOR_STATUS | `NOT_STARTED` |
| RIG_STATUS | `NOT_STARTED` |
| CINEMATIC_PROOF_SHOT_STATUS | `NOT_STARTED` |

---

## Helmet Constraints

- Helmet must remain an elongated portrait ovoid.
- Helmet must read as cool white porcelain / ceramic, not plastic, gold, orange, or warm cream.
- Helmet must remain sealed and faceless.
- No eyes, mouth, nose, expression, visor, logo, mesh, or facial surface features beyond the two slits.
- Helmet proportions should remain consistent with the Anchor V1 source and silhouette rule range: approximately 1.33x to 1.44x height-to-width.

## Sensor Slit Constraints

- Exactly two sensor slits.
- Slits are separate, ultra-thin, horizontal, and void-black.
- Each slit spans about 70% of helmet width.
- Slits must be horizontally centered on the helmet faceplate.
- A visible white porcelain gap must separate the two slits.
- No single slit, triple slit, merged visor, glowing eyes, pupils, iris shapes, mouth-like marks, or logo-like marks.

## Shoulder / Pauldron Width Constraints

- Preserve Anchor V1's massive shoulder / pauldron presence.
- Pauldrons must remain dramatically wider than helmet and torso.
- Use the silhouette lock spec as a production guard: pauldron span should remain in the 2.4x to 2.9x helmet-width range unless a later review explicitly approves a variant.
- Shoulder mass must not collapse to normal human proportions.
- Right-side shoulder may carry slightly more visual mass to balance the sword-side composition.

## Armor Coverage Constraints

- Full body must remain sealed and fully armored.
- No exposed skin.
- No visible human anatomy beyond armored form language.
- White armor plates must retain dark panel gaps / underlayer depth.
- Lower body armor and garment-like vertical plates must preserve the monolithic ceremonial silhouette.
- Do not introduce casual clothing, fabric-heavy fantasy costume drift, or bare joints.

## Sword Constraints

- Sword remains the Zenith Blade identity: a large rectangular matte void-black slab.
- No taper, curve, point, katana read, fantasy sword bevel silhouette, or thin rapier form.
- Sword remains on the right side of the character composition.
- Guard should remain a clean horizontal bar or slab-like structural element.
- Violet accent may remain secondary; it must not become a glowing blade or overpowering effect.

## Hair Mass Constraints

- Hair remains long, heavy, black, and left-side dominant.
- Hair must read as a single strong downward mass at thumbnail scale.
- Hair should originate around the helmet crown and fall toward lower body / ankle region.
- Do not shorten, recolor, split into decorative strand bundles, or remove the left negative-space mass.

## Silhouette Constraints

- Preserve the Anchor V1 asymmetry: hair mass left, sword mass right, body centered.
- Preserve the broad shoulder / narrow torso / slight hip flare / columnar leg hierarchy.
- Helmet, pauldrons, hair, body, and sword must remain readable at thumbnail scale.
- Do not allow sword and pauldron to merge into one unreadable shape.
- Do not allow the figure to read as samurai, kimono, ordinary mech, heroic fantasy knight, or generic anime armor.

## Palette / Material Constraints

- Dominant palette: cool porcelain white, void black, and controlled violet accent.
- Background remains void black or equivalent controlled dark production space.
- No gold, orange, crimson, warm mask, or broad warm-tone drift.
- Armor material should read as matte ceramic / porcelain with structural panel depth.
- Underlayer reads as dark graphene / black mechanical depth through armor gaps.
- Avoid plastic shine, flat fill, random noise, muddy gray, and overglossed metal.

---

## Forbidden Body Drift

Reject any production candidate with:

- body changes that contradict Anchor V1 proportions
- narrow pauldrons or normal human shoulder width
- changed sword side, sword taper, sword curve, or katana read
- hair loss, hair shortening, or right-side hair dominance
- exposed face, eyes, mouth, nose, skin, or expression
- blank helmet, one slit, merged visor, logo, or mouth mark
- armor becoming cloth, robes, fantasy plate, samurai, or generic mech
- warm palette drift, crimson dominance, or gold mask
- busy non-void background that breaks the character read
- any R5-derived replacement of the source anchor
- any continuation of full-body R6 inside the closed Anchor V1 route

---

## Production QA Checklist

Before any production execution is allowed, every proposed output plan or candidate must pass:

| Check | Required Result |
|---|---|
| Source anchor unchanged | PASS |
| Source anchor path is Anchor V1 inpaint | PASS |
| Helmet ovoid preserved | PASS |
| Exactly two separate sensor slits | PASS |
| No face features | PASS |
| Pauldrons remain wide | PASS |
| Full armor coverage | PASS |
| Sword remains rectangular slab | PASS |
| Hair remains long left-side mass | PASS |
| Asymmetry remains readable | PASS |
| Palette remains white / black / violet | PASS |
| Material avoids plastic / flat / warm drift | PASS |
| Thumbnail read preserved | PASS |
| No final asset lock claimed | PASS |
| No 3D actor, rig, or cinematic-ready claim | PASS |

---

## Production Boundary

This document defines constraints only. It does not authorize execution.

Forbidden from this state:

- no new image rendering
- no full-body R6
- no R5 replacement
- no final asset lock claim
- no 3D actor claim
- no rig claim
- no cinematic-ready claim
- no changing Anchor V1 locked reference

---

## Next Safe Task

```text
PREPARE_PROXY_3D_ACTOR_PLAN_FROM_ANCHOR_V1
```
