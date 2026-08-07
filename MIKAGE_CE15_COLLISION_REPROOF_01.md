# MIKAGE — CE15 ACTOR COLLISION RE-PROOF 01

**Task:** `CE15_ACTOR_COLLISION_REPROOF_01` · **Date:** 2026-08-07
**By:** Claude Code · Blender 5.1.2 headless

# VERDICT: **BLOCKED — CANNOT CERTIFY**

**Not PASS. Not FAIL. The 39-check matrix is not runnable, for a structural reason in the actor
that predates CE15.** No asset lock may be issued on this evidence.

> **ASSET LOCK: NOT ISSUED · PRODUCTION READY: NOT ISSUED · TECHNICAL ACTOR CLEARANCE: BLOCKED.**
> Zero collision numbers are reported as CE15 results. The one measurement this task produced was
> invalidated by a defect in my own harness and is reported as such in §5, not as a finding about
> the asset.

---

## 1. THE BLOCKING FINDING

**The actor geometry is not driven by the armature. It cannot be posed.**

Measured in `MIKAGE_COLLISION_STAGE_01.blend` (which links the designated `A2_` actor from V0.89):

| Binding of the 26 `A2_` meshes | Count |
|---|---:|
| Armature modifier | **0** |
| Vertex groups | **0** |
| Parented to an intent-empty | 19 |
| Bone-parented directly | 1 |
| Unbound entirely | 6 |

And of the five intent-empties the 19 hang from:

| Intent empty | Parent |
|---|---|
| `MESH_PREP_HAIR_HELMET_ATTACHMENT_INTENT_EMPTY_NON_RIG` | **none** |
| `MESH_PREP_HELMET_BODY_RIGIDITY_INTENT_EMPTY_NON_RIG` | **none** |
| `MESH_PREP_LEFT_ARM_HAND_ATTACHMENT_INTENT_EMPTY_NON_RIG` | **none** |
| `MESH_PREP_RIGHT_ARM_HAND_BLADE_ATTACHMENT_INTENT_EMPTY_NON_RIG` | **none** |
| `MESH_PREP_ZENITH_BLADE_ATTACHMENT_INTENT_EMPTY_NON_RIG` | `MIKAGE_initial_armature_scaffold`, bone `hand.R` |

**Rotating any armature bone moves essentially no actor geometry.** Four of five empties are
free-floating; only the blade-attachment empty is bone-parented. The suffix on every one of them —
`_NON_RIG` — says so explicitly.

This is consistent with, and explains, `docs/reports/MIKAGE_PRODUCTION_RIG_ARMATURE_AUDIT_V0_1.md:9`
(2026-07-03): *"The file contains the inherited armature… but it is **not a soft-deformation
production rig**."*

---

## 2. THE HISTORICAL "8-POSE GATE" NEVER TESTED 8 POSES

This is the more serious half of the finding, and it changes what the historical standard means.

### 2a. No pose definitions exist anywhere

Probed the V0.89 blend for every mechanism that could store a pose:

| Mechanism | Result |
|---|---|
| Actions matching any pose name | **none** — the 14 actions are `<control>Action` gait curves (frames 1–48) and `ZB*` phase curves (frames 1–61) |
| Pose assets / pose library | **none** — `asset: False` on all 14 |
| NLA tracks on the armature | **none** — `nla_tracks: []` |
| Armature's active action | **`None`** |
| Non-identity pose bones (a pose left applied) | **none** — `[]`, armature is at rest |
| Timeline markers | **none** |
| Text datablocks (a pose script) | **none** |
| Any datablock whose name contains `hand_hold`, `torso_left`, `torso_right`, `wide_stance`, `crouch`, `shoulder_elbow_limit`, `cloak_left`, `cloak_right` | **none** |

The eight pose names exist **only as row labels in JSON result tables**.

### 2b. The historical results are byte-identical across poses

`MIKAGE_ZENITH_BLADE_POSE_CLEARANCE_V0_61_REPORT.json`, P1 state, all seven recorded poses:

| Pose | collision-hits signature (md5, first 10) | `hand_center_distance` | `hand_distance_drift_from_neutral` |
|---|---|---:|---:|
| `neutral` | `243b8e1cb2` | 1.76015645 | 0.0 |
| `hand_hold` | `243b8e1cb2` | 1.76015645 | 0.0 |
| `torso_left` | `243b8e1cb2` | 1.76015645 | 0.0 |
| `torso_right` | `243b8e1cb2` | 1.76015645 | 0.0 |
| `wide_stance` | `243b8e1cb2` | 1.76015645 | 0.0 |
| `crouch` | `243b8e1cb2` | 1.76015645 | 0.0 |
| `shoulder_elbow_limit` | `243b8e1cb2` | 1.76015645 | 0.0 |

**Every pose produced the identical hit list, the identical hand-centre distance, and a drift from
neutral of exactly 0.0.** A crouch that moves the hand zero millimetres from neutral is not a crouch.

### 2c. Conclusion

Three independent lines converge: no pose data is stored (2a), the results do not differ (2b), and
the actor is not bound to the armature (§1). **The historical "neutral plus existing eight-pose
gate" is the neutral rest state evaluated nine times under nine labels.**

**Consequences, stated plainly:**

1. The 8 historical poses are **UNRECONSTRUCTIBLE** — not because the records were lost, but because
   the poses were never applied.
2. The historical 0-overlap result is real **for neutral only**. Its evidentiary weight for the
   other eight rows is nil.
3. `ZENITH_BLADE_OPERATION_DOCTRINE_V1.md` §4.1's instruction that the 8 historical rows "must be
   re-proven on CE15" cannot be satisfied, and the "coverage must never shrink below the historical
   bar" requirement is met trivially — the bar is one row.
4. `POSE_01..04` cannot be authored either: with the actor unbound, any "pose" would evaluate as
   neutral, and reporting collision numbers for it would reproduce exactly the failure documented in
   2b. **I did not author them.**

---

## 3. WHAT WAS RUNNABLE: 3 of 39 checks

| Pose | P1 | P2 | P3 | Status |
|---|---|---|---|---|
| `neutral` | runnable | runnable | runnable | **run — see §5 caveat** |
| `hand_hold` … `cloak_right` (8) | — | — | — | **UNRECONSTRUCTIBLE** (§2) |
| `POSE_01`–`POSE_04` | — | — | — | **NOT AUTHORED** — would evaluate as neutral (§2c.4) |

**36 of 39 checks are not runnable. A PASS requires all 39 at zero overlap. PASS is therefore
unreachable by any honest route on the current actor.**

---

## 4. S1 — REGISTRATION (derived, PROPOSED, not applied to the saved stage)

The task's recorded UNCONFIRMED-by-design item. The derivation succeeded; the application was rolled
back with the rest of the harness run (§5).

**Governing documents.** `ZENITH_BLADE_OPERATION_DOCTRINE_V1.md` §2.2 — the primary grip is the
hub / handle axis, no wrapped grip, no crossguard. `ZENITH_BLADE_FORM_RIG_HANDOFF_CONTRACT.md` —
integration consumes CE15 by link/reference, never overwrite.

**Historical anchor found, and it is already present in the stage.**
`MESH_PREP_ZENITH_BLADE_ATTACHMENT_INTENT_EMPTY_NON_RIG` is bone-parented to **`hand.R`** — the one
actor-side empty that *is* driven by the armature. It is the V0.89 lineage's blade-attachment point
and the natural registration target.

**Blade-side reference.** `ZB48_HANDLE_REGISTERED_TO_HAND_MARKER` — named for exactly this purpose —
with `ZB46_DRIVE_HUB` as the hub-axis reference per §2.2.

**PROPOSED registration:** a local empty rigid **BONE-parented to `hand.R`**, instancing
`BLADE_CE15_LINKED`, offset so `ZB48_HANDLE_REGISTERED_TO_HAND_MARKER` coincides with the historical
attachment empty. Rigid only; no constraint stack, no IK, no new rig.

**Assumptions, all flagged:**

| # | Assumption | Status |
|---|---|---|
| A1 | The V0.89 blade-attachment empty is the correct registration target for the **CE15** blade | **PROPOSED** — no document states it for CE15 |
| A2 | Coincidence of `ZB48_HANDLE_…_MARKER` with that empty is the correct alignment | **PROPOSED** — the documents give the grip *member* (§2.2), not a transform |
| A3 | Rotation is inherited from the bone with no additional offset | **PROPOSED** — no document specifies a grip rotation |
| A4 | Bone-parenting the blade inside the scaled actor instance makes it inherit the actor scale | **MEASURED CONSEQUENCE, not an assumption** — and it means the blade would no longer be 1.200 m unless compensated. **Unresolved.** |

**A4 is a genuine open problem**, not a detail: the actor is instanced at ×0.2452706705 and the blade
is linked at 1:1. Parenting the blade to a bone inside the scaled instance rescales it. Resolving it
needs an operator decision on whether the stage should be built at V0.89 scale (blade 4.89 m) or
canon scale with an explicit inverse-scale compensator. **UNCONFIRMED.**

---

## 5. THE ONE MEASUREMENT I TOOK, AND WHY IT IS VOID

I ran neutral × P1/P2/P3 with BVH triangle overlap and obtained **344 overlapping triangle pairs at
each phase**. **That number is void and must not be recorded against CE15.**

**Cause: a defect in my own harness.** My script instanced `BLADE_CE15_LINKED` through the new grip
empty **without removing the existing direct collection link** placed by the stage build. Verified
after the fact: **29 distinct ZB meshes present as 58 instances** — every blade object existed twice,
once at world origin and once at the grip. The origin copy is what intersected the actor.

| Check | Value |
|---|---|
| Distinct ZB meshes | 29 |
| Total ZB instances | **58** |
| Duplicated meshes | **29 (all of them)** |

**Action taken:** the staging file was **restored from its `.blend1` backup to anchor v1**
`229c727f516b3653943c03ea687f796bd5101dd1ce30be1579d9ba4248c17e01`, byte-verified, and the backup
removed. **No anchor v2 is declared.** The stage on disk is exactly as `MIKAGE_ACTOR_STAGE_BUILD_01`
left it.

I am reporting this rather than fixing the script and re-running, because §1–§3 mean the matrix
cannot complete regardless: a corrected neutral figure would still be 3 of 39.

---

## 6. METHOD CITATION (as required, before use)

The V0.89 proof's method is **triangle-overlap**, recorded in
`MIKAGE_ZENITH_BLADE_MITTEN_INTERFACE_CORRECTION_V0_89_REPORT.json` as `triangle_overlap_total`,
`triangle_pair_count`, `blade_triangle_indices`, `mitten_triangle_indices`. The repair method line
reads: *"Minimum successful local outward-depth translation of the V0.88-proven mitten shell
vertices; no object transform or scale edit."*

**The exact overlap routine is not recorded** — no BVH call, tolerance, or library is named in any
proof in the chain. Corroborating context: `ZENITH_BLADE_DESIGN_DNA.md` and the operator ruling both
state *"all collision evidence is BVH triangle-overlap based"*, and
`MIKAGE_ZENITH_BLADE_BOUNDED_CLEARANCE_V0_85_PROOF.md:49` refers to *"the machine BVH report."*

Accordingly this task used `mathutils.bvhtree.BVHTree.overlap()` on evaluated world-space triangles
and **says so** — as the task instructed when the method is not recorded. Exact numerical
comparability with the historical figures is therefore **UNCONFIRMED**.

---

## 7. WHAT IS REQUIRED BEFORE THIS GATE CAN RUN

Not recommendations — statements of what is structurally missing.

| # | Requirement | Why |
|---|---|---|
| R1 | **Bind the actor to the armature** (weights or bone-parenting of the intent empties) | Without it no pose exists and no pose gate is meaningful. This is the soft-rig item backlogged by ruling D-c — **D-c backlogged it as a non-blocker for asset lock; this finding shows it blocks the collision gate that asset lock depends on.** The two positions need reconciling by the operator. |
| R2 | **Define the 8 historical poses, or retire them** | They were never real. Either author them as data, or amend the doctrine's 13-row matrix to what can actually be tested. |
| R3 | **Rule the S1 registration** (A1–A3) and **resolve the scale interaction (A4)** | The blade's grip transform is currently PROPOSED and the scale inheritance is unresolved. |
| R4 | **Record the collision method** so future proofs are numerically comparable | The historical numbers cannot be reproduced without it. |

---

## 8. INTEGRITY

| Check | Expected | Observed | Result |
|---|---|---|---|
| Staging file | `229c727f…c17e01` | `229c727f…c17e01` | **RESTORED TO ANCHOR v1** |
| V0.89 source blend | `15e61aa9…4b89` | identical | **BYTE-UNCHANGED** |
| CE15 durable blend | `465b212e…c3129` | identical | **BYTE-UNCHANGED** |
| Tripwire v2 | `3a62ac63…44c9` @79 | identical @79 | **UNCHANGED** |
| Geometry / materials edited | 0 | 0 | **NONE** |
| New rig created | 0 | 0 | **NONE** |
| Asset lock issued | no | no | **NOT ISSUED** |

---

*End of MIKAGE_CE15_COLLISION_REPROOF_01. Gate BLOCKED. No verdict issued, no asset lock, no
production claim. No commit, no push.*
