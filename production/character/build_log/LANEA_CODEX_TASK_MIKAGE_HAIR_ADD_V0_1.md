# LANE A CODEX TASK — MIKAGE_HAIR_ADD_V0_1

STATUS = DISPATCH (governed by AGENTS.md Fiftieth controlled exception)
TASK_ID = MIKAGE_HAIR_ADD_V0_1
DATE = 2026-07-04
AUTHORITY = OPERATOR RULING (BOOS), via Lane B (Cowork) coordination

## Why this task exists

Lane B audit found a real conflict between locked lore and the actual production asset:

- `docs/world/MIKAGE_LORE_WORLD_CANON_V0_6_SSOT.md` line 27 locks "tóc đen dài dày" (long, thick,
  dense black hair) as part of Mikage's identity.
- The current production rig — `MIKAGE_ROBE_HERO_CINE_STAGING_V0_1.blend` (exception #48's PASS
  derivative, the live production reference) — has NO hair geometry anywhere.
- The approved `MIKAGE_STANDING_HERO_TURNAROUND_V0_2` reference (all 8 angles, operator-approved
  2026-07-02) also shows no hair, confirming this gap predates this task and is not a rendering
  fluke.
- Every AI-generation pass run this week (txt2img batch, differential-diffusion pass) inherited
  the same hairless silhouette because they were conditioned on this same asset — those batches
  were separately rejected by the operator as unusable ("phá canon"), and this rig gap is the root
  cause, not a prompt-wording problem.

This task fixes the asset directly. It does not touch anything else that is already locked.

## Base file

`production/character/production_actor/rig_derivatives/MIKAGE_ROBE_HERO_CINE_STAGING_V0_1.blend`

Current known state (from prior exceptions, verify don't assume): 101 mesh objects, 1 armature
`MIKAGE_axial_rig_v0_1` with 9 bones (7 axial: root/pelvis/spine_01/spine_02/chest/neck/head, plus
2 drape-sway helpers: `drape_secondary_upper`/`drape_secondary_lower`), S0/S1/S2 three-state
lighting already baked in, cloak = one closed 288-vertex mesh, halo white, slits violet
(`#8F00FF` family), 3 blade slabs rigid-to-root.

Extend this file. Do not rebuild from scratch. Do not open/save any older rig_derivatives file.

## Required survey (report in the proof, before build claims)

1. Confirm no existing hair mesh, particle system, or hair-curve object exists anywhere in the
   base file (name every object if anything hair-adjacent is found, even if unused/hidden).
2. Report the helmet mesh's exact world-space bounding box and general shape, so the hair's
   attachment region can be planned without intersecting or hiding it.
3. Report the exact position of both sensor-slit meshes, to confirm the planned hair silhouette
   will clear them at all 8 turnaround angles, not just the front.

## Required build

Add a NEW hair mass reading as one heavy, dense, long black volume — sculpted/low-poly in the
same stylized language as the rest of this asset (this is NOT a fine-strand particle/groom
system, and NOT anime-style thin bangs or twin-tails; think a solid weighty shape, closer to how
the cloak itself reads as one mass rather than cloth simulation).

- Origin: back and sides of the helmet only. Never crosses the face plane. Never touches or
  overlaps either sensor slit, at any of the 8 turnaround angles.
- Length: reads as genuinely long against current body scale — reaches at least shoulder height,
  may extend further down the back/cloak line if it reads better, operator's "dài" (long) is the
  target, not a a few centimeters of fringe.
- Material: flat matte black / near-black. No specular highlights strong enough to read as a
  second light source. No violet, no warm tint, no color outside black/near-black.

## Allowed rig work

Either (a) rigid-attach the hair mass to the existing `head` bone (same pattern used for
helmet/slits/halo in exception #40), or (b) add up to 2 NEW dedicated bones for hair secondary
motion, parented to `head`, following the exact precedent of `drape_secondary_upper`/
`drape_secondary_lower` (exception #45/#46). Do not add more than 2 new bones total. Do not
reposition or reweight any of the existing 9 bones or their current bindings on helmet, slits,
halo, cloak, or blades.

## Locked — do not touch, do not reason your way into "improving"

- Helmet geometry and material.
- Both sensor-slit meshes: shape, count (exactly 2), and violet emission color family
  (`#8F00FF`-adjacent, blue-dominant, no magenta drift).
- The white Enso halo ring: geometry, and its unanimated/white-only material at S0/S1 with glow
  only at S2.
- The cloak: one closed 288-vertex mesh, 0 boundary/non-manifold edges — no limb geometry implied
  or revealed by the new hair either (e.g. don't let hair shapes read as shoulders/arms).
- All 3 blade slab objects and their rigid-to-root attachment.
- The existing 7 axial bones plus 2 drape-sway bones and their current positions/weights.
- S0/S1/S2 lighting state values.
- Void `#050508`.

## Required proof artifacts

A NEW 8-angle turnaround using the exact same azimuth convention as
`MIKAGE_STANDING_HERO_TURNAROUND_V0_2` (`000, 045, 090, 135, 180, 225, 270, 315`, 45-degree steps,
same camera type/distance logic), showing the hair at every angle. Explicitly confirm in the proof:

(a) no slit coverage at any angle (report per-angle, not just a blanket claim)
(b) helmet silhouette (oversized rounded head) still clearly legible at every angle
(c) the 180-degree back view shows the hair's actual length and density clearly — this is the
    single most important view for judging whether "dài dày" (long, thick/dense) is actually met

This turnaround may be described as superseding `MIKAGE_STANDING_HERO_TURNAROUND_V0_2` for
reference purposes pending operator review — it does NOT carry that approval automatically. Only
the operator's own ruling promotes it.

## Deliverables

- `production/character/production_actor/rig_derivatives/MIKAGE_HAIR_ADD_V0_1.blend`
- `production/character/reference/turnaround_hair_v0_1/` — 8 individual PNGs, same naming
  convention as `turnaround_v0_2` (e.g. `MIKAGE_TURNAROUND_HAIR_000.png` etc.)
- `production/character/reviews/MIKAGE_HAIR_ADD_V0_1_SHEET.png` (all 8 views composited)
- `production/character/reviews/MIKAGE_HAIR_ADD_V0_1_PROOF.md` (full survey answers + per-angle
  slit/silhouette confirmation + hash/measurement evidence that every locked item is unchanged)

Gate folder `_tmp/mikage_hair_add_v0_1_gate/` holds ONLY `contact_sheet.png` (all 8 angles,
clearly labeled) + `contact_sheet_review_report.md`.

## Pass conditions

- Hair present, reads as one heavy dense long black mass, not fine strands, not anime.
- No slit coverage at any of the 8 angles.
- Helmet silhouette still clearly legible at every angle.
- No more than 2 new bones, both hair-specific, both parented to `head`.
- Every locked item (helmet/slits/halo/cloak/blade/existing rig/lighting/void) verified unchanged
  by hash or direct measurement, not just asserted.
- 8-angle turnaround produced and visually clean at every angle, back view legible.
- Gate folder holds exactly the 2 allowed files, `python .mikage/tools/verify_output.py` prints
  PASS, no `.blend1` remains.

## Fail / blocker codes

- `HAIR_SLIT_COVERAGE` — hair crosses or shadows either slit at any angle
- `HAIR_STYLE_VIOLATION` — hair reads as fine anime strands/twin-tails instead of one heavy mass
- `HELMET_SILHOUETTE_VIOLATION` — helmet shape becomes unclear or hidden
- `LOCKED_ASSET_MODIFIED` — any locked geometry/material/rig item changed
- `RIG_SCOPE_VIOLATION` — more than 2 new bones, or an existing bone repositioned/reweighted
- `COLOR_VIOLATION` — hair introduces a color outside flat black/near-black
- `VALIDATOR_SCHEMA_MISMATCH` — gate folder mis-schema'd

## Explicitly out of scope for this task

No canon-lock. No asset-lock. No production-ready/final claim — label CANDIDATE only. No push. No
deploy. Does not re-run Stage B deformation tests, locomotion tests, or the cinematic lighting
pass — those remain on whatever their current approved state is; this task only needs the light
static 8-angle turnaround to prove the hair itself. If a full motion/deformation retest is wanted
later, that is a separate future exception.

## On conflict or ambiguity

If the SSOT's "tóc đen dài dày" reads as ambiguous beyond length/density/color (e.g. is it meant
to move independently in wind, is there a part/style beyond "long and thick"), stop and report
the ambiguity rather than inventing a specific hairstyle. This task is scoped to close the
existing canon gap, not to add new canon.
