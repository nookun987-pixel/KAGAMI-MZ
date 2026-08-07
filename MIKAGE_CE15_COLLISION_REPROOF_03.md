# MIKAGE — CE15 ACTOR COLLISION RE-PROOF 03 (O-A APPEND)

**Task:** `CE15_ACTOR_COLLISION_REPROOF_03` · **Date:** 2026-08-07
**By:** Claude Code · Blender 5.1.2 headless

# VERDICT: **BLOCKED — matrix not run.** Articulation gate failed on the right-arm chain.

**And a correction: `MIKAGE_CE15_COLLISION_REPROOF_02` reached the wrong conclusion.**
Library overrides were never the problem. R1 was not infeasible. See §1.

> **ASSET LOCK: NOT ISSUED · PRODUCTION READY: NOT ISSUED · TECHNICAL ACTOR CLEARANCE: BLOCKED.**
> The `METHOD_V1` §2.7 articulation gate aborted the run before any collision number was produced.
> That is the gate working as designed.

---

## 1. CORRECTION TO REPROOF_02 — the diagnosis was wrong

REPROOF_02 concluded: *"bone-parenting applied to library-override objects is stored but not
evaluated… R1 is technically infeasible."* On that basis ruling **R1′** switched the binding
mechanism to O-A (append).

**That conclusion does not survive this task.** The actor was appended as fully **local** objects —
overrides eliminated entirely — and articulation **still** measured zero. Overrides were never the
cause.

**The actual cause: the rig is CONTROL-DRIVEN.** The armature carries **15 pose-bone constraints**:

| Bone | Constraints |
|---|---|
| `root` | COPY_LOCATION + COPY_ROTATION ← `global_ctrl` |
| `pelvis` | COPY_LOCATION + COPY_ROTATION ← `pelvis_ctrl` |
| `chest` | COPY_ROTATION ← `chest_ctrl` |
| `head` | COPY_ROTATION ← `head_ctrl` |
| `hand.L` | COPY_LOCATION + COPY_ROTATION ← `hand.L_ctrl` |
| `hand.R` | COPY_LOCATION + COPY_ROTATION ← `hand.R_ctrl` |
| `foot.L` / `foot.R` | COPY_LOCATION + COPY_ROTATION ← respective `_ctrl` |
| `forearm.R` | **IK**, chain 5, target `ZB84_SECONDARY_GRIP_IK_TARGET`, influence 1.0 |

Setting `pose_bone.rotation_euler` is a **no-op** — the COPY constraints overwrite it on every
evaluation. Measured directly: `pose_bone.matrix` delta = **0.0** after a 30° rotation assignment.

REPROOF_01 and REPROOF_02 both drove bone rotations. Both were driving a layer the rig ignores.

**What this means for the earlier findings:**

| Earlier claim | Status now |
|---|---|
| "R1 (library overrides) is technically infeasible" | **WITHDRAWN — incorrect.** Overrides were never tested against the right control layer. |
| "The actor is not bound to the armature / cannot be posed" (REPROOF_01 §1) | **PARTIALLY WITHDRAWN.** The A2_ meshes genuinely have 0 armature modifiers and 0 vertex groups — that part stands. But the armature itself *is* drivable, through the control empties. |
| "The 8 historical poses are fiction" (REPROOF_01 §2, ruling R2) | **STANDS.** Independent of this: no pose definitions exist, and V0.61 recorded `drift_from_neutral: 0.0` with byte-identical results across all seven. |
| Harness fault? | **Ruled out.** A primitive control test in the same harness gives object-parent translate **5.000000 m** and bone-parent rotate **0.765367 m**. The harness evaluates correctly. |

---

## 2. WHAT SUCCEEDED THIS RUN

| Step | Result |
|---|---|
| **O-A append** | 33 linked actor objects removed; **49 objects appended as fully local** (`appended_local_all: true`) — 26 A2_ meshes, 5 intent-empties, the 23-bone armature, **8 `*_ctrl` control empties**, and `ZB84_SECONDARY_GRIP_IK_TARGET` |
| **Duplicate guard** (METHOD_V1 §2.3) | **PASS** — 26 actor meshes in scene, expected 26, **0 linked originals remaining** |
| **Rigid binding** | **26 / 26 bone-parented, 0 failures** |
| **Articulation — head chain** | `head_ctrl` +30° → hair displaced **0.893287 m**. **The actor articulates.** |

The transform ordering defect from REPROOF_02 is also fixed: mesh parents are cleared *before*
scaling, so no object is double-scaled.

---

## 3. THE REMAINING BLOCKER — the right-arm chain does not respond

| Test | Result |
|---|---|
| `head_ctrl` +30° → hair | **0.893287 m** ✅ |
| `hand.R_ctrl` +0.10 m → right mitten | **0.000000 m** ❌ |
| `hand.R_ctrl` +0.50 m → `hand.R` **bone** (IK **active**) | **0.000000 m** ❌ |
| `hand.R_ctrl` +0.50 m → `hand.R` **bone** (IK **muted**) | **0.000000 m** ❌ |
| `hand.R_ctrl` +0.50 m → `forearm.R` bone (either state) | **0.000000 m** ❌ |

`hand.R` carries COPY_LOCATION + COPY_ROTATION from `hand.R_ctrl` at influence 1.0, unmuted — and
does not follow it. Muting the `forearm.R` IK changes nothing, so the IK is **not** the cause.

**Cause: UNCONFIRMED.** I stopped rather than continue guessing. What is established: it is not the
IK, not library overrides, not the harness, and not the append.

> Note on the head figure: **0.893287 m** for a 30° rotation on a 1.753685 m actor is larger than a
> head-pivot rotation should produce. It is reported **verbatim as measured** and flagged — it may
> indicate a residual transform issue in the bind. It was not investigated because the gate aborted
> first. **UNCONFIRMED.**

---

## 4. THE GATE ABORTED — as designed

`MIKAGE_COLLISION_METHOD_V1` §2.7 requires a passing articulation test before any matrix run, with
a threshold of 0.005 m. Result: `head_ctrl` 0.893287 ✅ / `hand.R_ctrl` 0.000000 ❌ → **`pass: false`
→ run aborted, matrix not executed, file not saved.**

This is the first time the §2.7 gate has fired. It did exactly what it was written to do: it stopped
a run that would otherwise have produced 15 confident zeros from a partly-frozen actor — the same
false-pass shape as the historical fiction. **Without it, this task would have reported PASS.**

**No collision numbers were produced. No contact sheet. Nothing to report as a result.**

---

## 5. STATE OF THE RULINGS

| Ruling | Status |
|---|---|
| **R1′** (O-A append) | **EXECUTED** — and shown to be unnecessary. Overrides were not the blocker. Harmless: the append works and the local actor is a valid basis. |
| **R2** (8 poses retired) | **DISCHARGED, unaffected** — the finding is independent and stands. |
| **R3** (docking, no scale inherit) | **NOT RE-VERIFIED this run** — the abort fired before Step 3. Previously measured at 1.200000 m in REPROOF_02. |
| **R4** (collision standard) | **DISCHARGED — and it earned its keep.** §2.7 caught this. |

---

## 6. WHAT IS NEEDED NEXT

| # | Item |
|---|---|
| **N1** | Diagnose why `hand.R` ignores its COPY_LOCATION/COPY_ROTATION at influence 1.0. Not IK, not overrides, not the harness. Candidates not yet tested: constraint evaluation order, a bone-level transform lock, the control's own parent/space settings, or a custom space on the constraints. |
| **N2** | Re-verify the head-chain displacement magnitude (0.893287 m) once N1 is resolved — it may be a bind artifact. |
| **N3** | Re-run the 5×3 matrix under METHOD_V1 only after §2.7 passes on **both** test chains. |
| **N4** | Consider whether the doctrine's pose set should be authored on the control layer permanently — the poses in this run were, and that is the correct layer. |

---

## 7. INTEGRITY

| Check | Expected | Observed | Result |
|---|---|---|---|
| Staging file | `229c727f…c17e01` | `229c727f…c17e01` | **UNCHANGED — anchor v1**, abort fired before save; no v2 declared |
| V0.89 source | `15e61aa9…4b89` | identical | **BYTE-UNCHANGED** |
| CE15 durable | `465b212e…c3129` | identical | **BYTE-UNCHANGED** |
| Tripwire v2 | `3a62ac63…44c9` @79 | identical @79 | **UNCHANGED** |
| Source files edited | 0 | 0 | **NONE** |
| Pass forced | no | no | **NONE** |
| Asset lock | not issued | not issued | **NOT ISSUED** |

---

*End of MIKAGE_CE15_COLLISION_REPROOF_03. Gate BLOCKED, matrix not run. REPROOF_02's diagnosis is
corrected above. No asset lock, no production claim. No commit, no push.*
