# MIKAGE — CE15 LEG FIXTURE EXTENSION PREFLIGHT

**Task:** `LEG_FIXTURE_EXTENSION_PREFLIGHT` · **Date:** 2026-08-07 · **By:** Claude Code · Blender 5.1.2 headless
**Authority:** Gap Ruling V1 §3.1, operator blocking set 01, 2026-08-07
**Scope:** read-only. No save. No V0.89 edit. No geometry split, cut or remodel. No primitive proxy.

# RESULT: **`LEG_GEOMETRY_NOT_SEPARABLE`** · **POSE_02 stays BLOCKED**

> **ASSET LOCK: NOT ISSUED · PRODUCTION READY: NOT ISSUED.** Matrix **0 / 15**.
> No mapping was added. No pose was encoded.

---

## 1. FIXTURE STATE THE AUDIT RAN ON

Baked constrained-neutral per the signed fixture ruling — captured with constraints live, muted,
reconstructed into `matrix_basis` parent-before-child.

| Check | Measured | Threshold | Result |
|---|---:|---:|---|
| Neutral drift from baseline | **4.89e-07 m** | ≤ 0.00001 m | ✅ |
| Actor meshes | 26 total · **25 render-enabled** | — | — |
| `hide_render` excluded per METHOD_V1 §2.1 | `A2_blade_material_dark_front_weight_refinement` | — | — |

---

## 2. THE DECISIVE FINDING — every actor mesh is a single island

Connected-component analysis of all 25 render-enabled meshes, evaluated, world space. **No geometry
was modified**; islands were read, not created.

### Evidence hierarchy — geometry decides, naming only corroborates

```
DECISIVE     no left/right separable lower-body geometry exists
             (25 of 25 render-enabled meshes are single-island; the only
              sub-hip mesh is one island centred at cx = -0.000)

CORROBORATION  no mesh carries a leg-like name
               (no leg/thigh/shin/calf/knee/foot/ankle/toe/boot)
```

**The verdict rests on the geometry alone.** A naming convention is not evidence of anatomy — a mesh
could be called anything and still be, or not be, a separable limb. The name check is reported
because it agrees, not because it counts.

> **Disclosure about the harness that produced this run.** The script's verdict predicate was
> `lr_separable AND named_leg`, which gave the naming test veto power it should not have. **The
> result is unaffected: `lr_separable` was empty**, so the verdict is `LEG_GEOMETRY_NOT_SEPARABLE`
> under either rule. The corrected predicate for any re-run is **`lr_separable` alone**, with the
> naming check demoted to a reported observation. `leg_fixture_extension_preflight.py` is **left
> exactly as it ran** — it is the accurate record of this run, and retro-editing it to look correct
> would break the same rule this project already wrote down after the board-build round.

Actor body plan as measured, `z` in metres at canon scale (actor height 1.753685 m):

| Mesh | z-min | z-max | islands | island centre x |
|---|---:|---:|---:|---:|
| `A2_proportion_longline_lower_void_mass_extension` | **−0.0589** | **0.0441** | **1** | **−0.000** |
| `A2_proportion_center_spine_sumi_vertical_weight` | 0.0429 | 0.7665 | 1 | 0.000 |
| `A2_proportion_left_side_shadow_taper` | 0.0491 | 0.6622 | 1 | −0.103 |
| `A2_proportion_right_side_shadow_taper` | 0.0491 | 0.6622 | 1 | 0.103 |
| … 21 further meshes (torso edges, arms, hands, hair, helmet) | 0.184 → 1.695 | | 1 each | |

**The entire actor below `z ≈ 0.044` is one mesh, one island, centred on the body axis
(`cx = −0.000`).** There is no left limb and no right limb below the hip. There is a hem.

### Why this is a stop, not a mapping problem

Resolving `A2_proportion_longline_lower_void_mass_extension` into `thigh.L` / `thigh.R` would require
**cutting a single connected mesh into two** — explicitly forbidden by Gap Ruling §3.1 ("splitting,
cutting or remodeling actor geometry"). Mapping the whole centred mass to one leg chain, or
duplicating it to both, would be **invented anatomy**, forbidden by the same clause. Substituting a
primitive is forbidden outright.

**There is no truthful mapping available. The stop condition is returned as ruled.**

---

## 3. THE SKELETON HAS LEGS. THE MESH DOES NOT.

Leg bones exist and are laterally separated — the rig was built for a figure with legs:

| Bone | head (world, m) | tail (world, m) |
|---|---|---|
| `thigh.L` | `[-0.029432, 0.061318, 0.0]` | `[-0.044149, -0.134899, -0.0]` |
| `shin.L` | `[-0.044149, -0.134899, -0.0]` | `[-0.039243, -0.306588, -0.0]` |
| `foot.L` | `[-0.039243, -0.306588, -0.0]` | `[-0.039243, -0.228679, -0.0]` |
| `thigh.R` | `[0.029432, 0.061318, 0.0]` | `[0.044149, -0.134899, -0.0]` |
| `shin.R` | `[0.044149, -0.134899, -0.0]` | `[0.039243, -0.306588, -0.0]` |
| `foot.R` | `[0.039243, -0.306588, -0.0]` | `[0.039243, -0.228679, -0.0]` |

**The mismatch is in the source data, not in this fixture.** V0.89's actor is a longline silhouette
whose lower body terminates in a single void mass; the 23-bone scaffold carries a full leg chain
that no geometry has ever been bound to. That is why the 26-mesh map stops at `pelvis`.

> **Caveat on one of my own criteria — stated rather than buried.** The audit also flagged which
> meshes sit "below the hip" by comparing mesh `z` against the `pelvis` head's `z`. At the baked
> constrained-neutral the leg chain runs along **−Y** (all leg bones sit at `z ≈ 0`), so that
> comparison mixes two axes and is **weak evidence on its own**. It is reported for completeness and
> is **not** what the verdict rests on. The verdict rests on two orientation-independent facts:
> **no mesh is named as leg geometry**, and **every mesh is a single island**. Neither depends on
> where the skeleton is pointing.

---

## 4. WHAT WAS NOT DONE

| Forbidden by §3.1 | Done? |
|---|---|
| Editing or saving V0.89 | **No** — no blend saved, sources byte-unchanged |
| Splitting / cutting / remodeling actor geometry | **No** — islands read only |
| Inventing replacement leg geometry | **No** |
| Using a primitive proxy as leg evidence | **No** |
| Adding a leg mapping anyway | **No** — stop condition returned instead |

No articulation, isolation or reset gate was run for any leg region, because no leg region could be
mapped truthfully. Those gates remain **not attempted**, not failed.

---

## 5. CONSEQUENCE

```
LEG_GEOMETRY_NOT_SEPARABLE
POSE_02  = BLOCKED — pending a new operator ruling
```

`POSE_02 CUTTING_MASS_SLAM` requires *"swept-volume clearance of the cutting mass against the actor's
**leading leg** and forearm at maximum extension"*. The forearm side is mappable; the leg side is not.

> ### RESOLVED — operator ruling 2026-08-07: **option L2**
>
> Recorded in `MIKAGE_ZENITH_BLADE_POSE_ENCODING_GAP_RULING_V1.md` §3.2. `LEG_GEOMETRY_NOT_SEPARABLE`
> is **accepted as a truthful finding**. For the CE15 campaign only, *"clearance against the actor's
> leading leg"* is operationalized as clearance against the existing render-enabled lower-body
> silhouette geometry — `A2_proportion_longline_lower_void_mass_extension`, already bound to
> `pelvis`. **The ruling does not declare that mesh to be a leg**, creates no leg anatomy, and
> authorises no proxy, split or rebind. Downstream name:
> **`POSE_02_LOWER_BODY_SILHOUETTE_CLEARANCE`**. Leg bind extension is **CLOSED — no mapping added**.
> Matrix structure remains **5 × 3**. POSE_02 stays blocked on its remaining pose fields.

Options as they were put to the operator — **none was recommended here, and none could be taken by
an agent**:

| # | Option | Consequence |
|---|---|---|
| **L1** | Rule POSE_02's leg clearance **out of scope** for this campaign; test the forearm side only, and record the leg clearance as `NOT_APPLICABLE — no leg geometry exists in V0.89` | Matrix stays 5×3. The doctrine's zone wording would need an errata note. |
| **L2** | Rule that the lower void mass **is** the actor's lower body for collision purposes and bind it whole to `pelvis` (already the case), testing clearance against that mass rather than against a "leg" | Truthful to the geometry; renames the check, does not invent anatomy. |
| **L3** | Authorise actual leg geometry for the actor | New modelling project. Far outside this campaign, and outside the FILM/RENDER-ONLY decision of 2026-07-30. |
| **L4** | Keep POSE_02 blocked and run the matrix on the other four rows | Matrix becomes 4×3 = 12. Requires an errata to the 5-row ruling. |

---

## 6. INTEGRITY

| Check | Observed | Result |
|---|---|---|
| Staging file | `229c727f…c17e01` | **UNCHANGED — anchor v1** |
| V0.89 / CE15 sources | identical | **BYTE-UNCHANGED** |
| Tripwire v2 | `3a62ac63…44c9` @ 79 | **UNCHANGED** |
| Blend files saved | 0 | **NONE** |
| Renders produced | 0 | **NONE** |
| Collision checks run | 0 | **NONE** |

Harness: `_tmp/ce15_leg_preflight/leg_fixture_extension_preflight.py` · report `LEG_PREFLIGHT_REPORT.json`
· stdout `leg_preflight_stdout.txt`.

---

*End of LEG FIXTURE EXTENSION PREFLIGHT. Stop condition returned. No mapping added, no pose encoded,
no collision run, no asset lock.*
