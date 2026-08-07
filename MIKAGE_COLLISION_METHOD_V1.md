# MIKAGE — COLLISION METHOD V1 (permanent standard)

**STATUS: APPROVED — Operator (BOOS BỚP) · Ruled & Signed 2026-08-07**

**Issued:** 2026-08-07 by task `CE15_ACTOR_COLLISION_REPROOF_02`
**Authority:** operator ruling **R4**, 2026-08-07 (Cowork session)

The permanent, recorded definition of the Mikage collision-overlap routine. Every future collision
proof cites this document and uses this routine verbatim.

> **ASSET LOCK: NOT ISSUED · PRODUCTION READY: NOT ISSUED.** This document defines a measurement
> procedure. It certifies nothing.

---

## 1. WHY THIS DOCUMENT EXISTS

`MIKAGE_CE15_COLLISION_REPROOF_01` established that **the historical V0.89 routine was never
recorded**. The proofs report outputs (`triangle_overlap_total`, `triangle_pair_count`,
`blade_triangle_indices`, `mitten_triangle_indices`) but no proof in the chain names the library,
the call, the tolerance, or the coordinate space.

> **PERMANENT CONSEQUENCE — do not soften in any future document:**
> **Numerical comparability between results produced under this standard and the historical
> V0.89-era numbers is UNCONFIRMED, permanently.** The historical inputs cannot be recovered.
> Historical figures may be cited as *context*, never as a *baseline to match*.

---

## 2. THE ROUTINE

### 2.1 Geometry source

- **Evaluated meshes only.** Obtain via `object.evaluated_get(depsgraph)` then `to_mesh()`.
  Modifiers, constraints, drivers and parenting must all be resolved. Never read `object.data`
  directly.
- Release every temporary mesh with `to_mesh_clear()`.
- **Exclude** any object with `hide_render = True`.

### 2.2 Coordinate space

- **World space.** Every vertex is transformed by the instance's world matrix before comparison:
  `world_co = instance.matrix_world @ vertex.co`.
- Never compare in object-local or armature space.

### 2.3 Instance handling — the double-instance rule

Iterate **`depsgraph.object_instances`**, not `bpy.data.objects`, so collection instances and
duplis are included exactly once each.

> **MANDATORY GUARD — from `MIKAGE_CE15_COLLISION_REPROOF_01` and repeated in `_02`:**
> Before any measurement, assert that the count of distinct evaluated meshes equals the expected
> object count. **This defect has now occurred twice.**
>
> - **REPROOF_01:** a collection was instanced through a new empty *without* unlinking the existing
>   direct collection link → 29 distinct blade meshes present as **58 instances**. The reported 344
>   overlapping triangle pairs were entirely the duplicate copy. Result voided.
> - **REPROOF_02:** `override_create()` left the linked **original** in the scene alongside the new
>   override → 25 actor meshes present as **50**. Caught by the guard before measurement.
>
> **Rule:** after any link, append, override or instance operation, count distinct evaluated meshes
> per group and compare against the expected count. **A mismatch aborts the run.** Never measure
> first and sanity-check later.

### 2.4 Intersection test

- **BVH triangle-pair intersection**: `mathutils.bvhtree.BVHTree.FromPolygons(verts, tris,
  all_triangles=True)` on each side, then `tree_a.overlap(tree_b)`.
- All polygons are triangulated by fan (`(v0, vi, vi+1)`) before the tree is built.
- **Tolerance: 0.** No epsilon, no inflation, no proximity margin. A shared surface counts as an
  overlap. This is deliberately strict.
- **Metric: the number of overlapping triangle pairs.** Integer. Not a volume, not a depth.

> **This routine measures triangle intersection, not penetration volume.**
> `PHYSICAL_VOLUME_EXACT_VALUE` remains **NOT VERIFIED** and is not addressed by any result from
> this standard. No mass-, force- or depth-derived wording may be built on it.

### 2.5 Gate

- **Per check: `overlap == 0`.** Any non-zero value is a FAIL for that check.
- A check that cannot be evaluated (one side produces no triangles) is **UNMEASURABLE**, never
  counted as a pass.

### 2.6 Zones

In addition to the whole-actor vs whole-blade check, report per-zone pair counts using the same
routine restricted to named object sets:

| Zone | Actor side | Blade side |
|---|---|---|
| `mitten_hub` | right mitten + right thumb | `ZB46_DRIVE_HUB`, `ZB48_HANDLE_REGISTERED_TO_HAND_MARKER`, `ZB46_HUB_SHOULDER_L/R` |
| `armour_penetration` | all `A2_` | `ZB45_SHELL_*` |
| `chassis_secondary` | all `A2_` | `ZB_ARCH03R_CHASSIS`, `ZB_ARCH03R_HUB_NECK` |
| `core_spine_rails` | all `A2_` | `ZB42_P3_SINGLE_RECESSED_CORE`, `ZB42_CENTRAL_LOAD_SPINE`, `ZB42_FUNCTIONAL_RAIL_L/R` |

### 2.7 Articulation pre-condition — mandatory

> **Added by `CE15_ACTOR_COLLISION_REPROOF_02`. No pose matrix may be run without it.**
>
> Before any multi-pose run, prove the actor actually articulates:
>
> 1. Rotate a driving bone by a large, unambiguous angle (≥ 25°).
> 2. Measure the world-space displacement of a mesh that bone is supposed to drive, using
>    **evaluated** matrices on both sides of the comparison.
> 3. **Displacement must be non-trivial** (order of centimetres at canon scale). A result of
>    `0.000000 m` — or micrometre-scale noise such as the `0.000007 m` measured in REPROOF_02 —
>    means the actor is **not driven** and every pose in the run is neutral in disguise.
> 4. **A failed articulation test aborts the run.** Results produced without it are void.
>
> This exists because the entire historical 8-pose gate was neutral repeated nine times, and that
> was only detectable after the fact. It must be detectable *before* the fact from now on.

### 2.8 Output format

Per check, record:

```json
{"pose": "<name>", "phase": "P1|P2|P3", "frame": 1|31|61,
 "actor_tris": <int>, "blade_tris": <int>,
 "overlap": <int|null>, "gate_zero": <bool|null>,
 "zones": {"mitten_hub": <int|null>, "armour_penetration": <int|null>,
           "chassis_secondary": <int|null>, "core_spine_rails": <int|null>}}
```

Plus a run header carrying: source blend hashes, staging anchor, articulation-test result,
duplicate-guard result, and the scale verification (actor height, blade length).

---

## 3. WHAT A RESULT FROM THIS STANDARD DOES AND DOES NOT MEAN

**Does:** state whether any triangle of the actor intersects any triangle of the blade, in world
space, at zero tolerance, in the tested poses and phases.

**Does not:** establish penetration depth or volume · establish physical plausibility, mass or force
· certify poses not in the run · transfer to any other geometry version · compare numerically to
pre-2026-08-07 figures (§1).

---

```
STANDARD:          MIKAGE_COLLISION_METHOD_V1
AUTHORITY:         operator ruling R4, 2026-08-07 (Cowork session)
ISSUED:            2026-08-07  ·  CE15_ACTOR_COLLISION_REPROOF_02
STATUS:            APPROVED — Operator (BOOS BỚP) · Ruled & Signed 2026-08-07
SIGNED BY:         Operator (BOOS BỚP / Phi Hùng)
HISTORICAL COMPARABILITY: UNCONFIRMED — PERMANENT
ASSET LOCK:        NOT ISSUED
PRODUCTION READY:  NOT ISSUED
```

---

**STATUS: APPROVED — Operator (BOOS BỚP) · Ruled & Signed 2026-08-07.** In force as the permanent
collision standard. No commit, no push.
