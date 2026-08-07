# MIKAGE — CE15 ACTOR COLLISION RE-PROOF 04 (HAND-CHAIN DIAGNOSIS)

**Task:** `CE15_ACTOR_COLLISION_REPROOF_04` · **Date:** 2026-08-07
**By:** Claude Code · Blender 5.1.2 headless · staging opened read-only, never saved

# VERDICT: **D1 SOLVED — root cause found. D3 STOPPED at the semantics boundary. D4 not run.**

> **ASSET LOCK: NOT ISSUED · PRODUCTION READY: NOT ISSUED · TECHNICAL ACTOR CLEARANCE: BLOCKED.**
> No fix was applied. Staging was **not saved** — anchor stays v1, no v2 declared.
> No source file was opened for write. No commit, no push.

**The hand.R chain is not broken.** It behaves exactly as Blender specifies. What is broken is
something larger, which the hand.R symptom was hiding: **the control layer cannot reproduce the
rig's own neutral pose.** Details in §3.

---

## 1. STEP D1 — INSTRUMENTED DIAGNOSIS (every candidate measured, negatives included)

| # | Candidate | Measured result | Verdict |
|---|---|---|---|
| **a** | **Dependency cycle** | Blender stdout/stderr across 5 headless runs: **0 occurrences** of `Dependency cycle detected` (grep, case-insensitive). No cycle warnings of any kind. | **NOT THE EXPLANATION.** Absence of a warning in stdout is not a formal cycle detector — see the caveat below. A cycle is **no longer needed** to explain the symptom, and there is **no evidence** it is the cause. Not written as "proven absent". |
| **b** | **Constraint spaces** | All 15 pose-bone constraints are `target_space=WORLD` / `owner_space=WORLD`, influence `1.0`, unmuted. | **POSITIVE — this is the cause, see §3** |
| **c** | **Bone locks** | `lock_location`, `lock_rotation`, `lock_rotation_w`, `lock_scale` are **False on all 23 bones**. `use_inherit_rotation=True`, `inherit_scale=FULL` throughout. | **NEGATIVE — ruled out** |
| **d** | **Control parenting / does the ctrl itself move** | All 8 `*_ctrl` empties have **no parent**. Translated `hand.R_ctrl` by +0.50 m X → **the ctrl's own evaluated world matrix moved 0.500000 m**. The ctrl moves. | **NEGATIVE — ruled out** |
| **e** | **Evaluation order / duplicates / influence drivers** | Armature carries **0 drivers**. No bone holds a duplicate constraint (`root` 2, `pelvis` 2, `chest` 1, `head` 1, `hand.L` 2, `hand.R` 2, `foot.L` 2, `foot.R` 2, `forearm.R` 1 = 15). | **NEGATIVE — ruled out** |
| **f** | **`use_connect` (not on the dispatch list — found by measurement)** | See below. | **POSITIVE — explains the symptom** |

### The measurement that broke it open

Driving each control by **translation** and reading the driven bone's evaluated world head:

| Control | Bone | `use_connect` | Bone head Δ, ctrl **translated** 0.50 m | Bone head Δ, ctrl **rotated** 30° |
|---|---|---|---:|---:|
| `global_ctrl` | `root` | **False** | **0.500000** ✅ | 0.000000 † |
| `pelvis_ctrl` | `pelvis` | True | **0.000000** ❌ | 0.000000 † |
| `hand.R_ctrl` | `hand.R` | True | **0.000000** ❌ | 0.000000 † |
| `hand.L_ctrl` | `hand.L` | True | **0.000000** ❌ | 0.000000 † |

> **† Read the rotation column carefully — it does NOT mean the bone failed to rotate.**
> This probe reads `bone.head` only. A bone rotating about **its own head** leaves that head
> coordinate exactly invariant, so `0.000000` is the *expected* reading for a successful rotation.
> Rotation is proved separately, by **mesh centroid** displacement, in the table below — and that
> measurement PASSES on all three chains. The column is retained because it is the correct
> discriminator for the **translation** question, which is what D1 asked.

**`root` is the only bone in this rig with `use_connect = False`** — it has no parent, so it cannot be
connected. Every other COPY_LOCATION-driven bone (`pelvis`, `hand.L`, `hand.R`, `foot.L`, `foot.R`)
is **connected**, and a connected bone's head is welded to its parent's tail: **Blender ignores
translation on it.** COPY_LOCATION at influence 1.0 is therefore a guaranteed no-op on those five
bones. COPY_ROTATION is unaffected, which is why `chest` and `head` — rotation-only — always worked.

> This is **correct Blender behaviour, not a defect.** A connected bone is *supposed* to be
> un-translatable.

### Correction to REPROOF_03

REPROOF_03 drove `hand.R_ctrl` with a **location** delta (`+0.10 m`, `+0.50 m`) and read
`0.000000 m`. `MIKAGE_COLLISION_METHOD_V1` §2.7 step 1 specifies **"Rotate a driving bone by a large,
unambiguous angle (≥ 25°)"** — a rotation test. The rotation test was applied to the head chain but
never to the hand chain. Driven by rotation, all three chains move:

| Chain | 30° on its ctrl, mesh displacement (canon scale) |
|---|---|
| head → hair (7 meshes) | 0.756222 – 0.897446 m |
| hand.R → right mitten + thumb | 0.342973 – 0.349382 m |
| hand.L → left mitten + thumb | 0.345264 – 0.351865 m |

The head figure **0.897446 m** independently reproduces REPROOF_03's flagged **0.893287 m** to within
0.4 % — the two harnesses agree.

| Earlier claim | Status now |
|---|---|
| "hand.R chain is frozen / does not respond" (REPROOF_03 §3) | **WITHDRAWN.** It responds to rotation. Translation is blocked by `use_connect`, by design. |
| "Cause UNCONFIRMED" | **RESOLVED** — see above. |
| "not the IK, not overrides, not the harness, not the append" (REPROOF_03) | **ALL CONFIRMED CORRECT.** Re-measured independently; IK muted changes nothing (`0.000000` either way). |

---

## 2. STEP D2 — THE HEAD MAGNITUDE (0.893287 m)

**It is not a rotation error. It is geometrically exact — about the wrong pivot.**

| Hair mesh | Radius from head-bone pivot | Expected arc, 30° | Measured | Ratio |
|---|---:|---:|---:|---:|
| `A2_hair_back_mass_hidden_behind_faceted_helmet` | 7.0687 | 3.6590 | 3.6590 | **1.00** |
| `A2_hair_left_vertical_flow_behind_mask` | 6.5674 | 3.3996 | 3.3937 | **1.00** |
| `A2_hair_lower_weight_black_vertical_tail` | 5.9564 | 3.0832 | 3.0832 | **1.00** |
| `A2_hair_subtle_vertical_strand_01…04` | 6.19 | 3.205 | 3.204 | **1.00** |

(raw units; ×0.2452706705 for canon metres)

Measured displacement equals `2·r·sin(15°)` to 4 decimals for every mesh. The rotation math is
correct. The magnitude is large because **r is large**: the hair sits ~1.73 m (canon) from the head
bone's pivot — roughly the actor's entire height. At neutral, the `head` bone pivot is at world
`[0.026828, 0.950936, -0.769532]` while the actor mesh spans `z = -0.24 … 6.91` (raw). **The head
pivot sits below the actor's feet.**

**D2 answer: the magnitude is a *registration* artifact, and it shares its root cause with D1** —
both come from the WORLD/WORLD constraint spaces. See §3.

---

## 3. THE REAL BLOCKER — the control layer cannot reproduce its own neutral

`COPY_ROTATION` with `owner_space = WORLD` sets the bone's **world** rotation to the target's. All 8
`*_ctrl` empties sit at identity rotation. So at neutral, every constrained bone is forced to
**identity world rotation** — which lays the skeleton down 90° about X:

| Bone | Rest world | Neutral world | Δ at canon scale |
|---|---|---|---:|
| `spine_01` | `[0, 0, 0.55]` | `[0, 0.55, 0]` | 0.190776 m |
| `spine_02` | `[0, 0, 0.95]` | `[0, 0.95, 0]` | 0.329522 m |
| `head` | `[0, 0, 1.72]` | `[0.026828, 0.950936, -0.769532]` | **0.653671 m** |
| `foot.L` | `[-0.16, 0, -1.25]` | `[-0.16, -1.25, 0]` | 0.433581 m |

**22 of 23 bones are displaced by more than 1 cm at canon scale.** Maximum **0.653671 m on a
1.753685 m actor — 37 % of body height.** The mesh stands upright; the skeleton lies down.

### Can it be calibrated instead of rebuilt?

Tested: set each of the 8 ctrls to the world rotation and position its bone holds at rest, making the
calibrated state the new neutral.

| | Max deviation from rest, canon scale |
|---|---:|
| Uncalibrated neutral | 0.653671 m |
| **Calibrated neutral** | **0.355536 m** |

Calibration recovers `root`, `pelvis`, `spine_01`, `spine_02`, both legs and `hand.R` to **exactly
0.000000 m**. It does **not** recover the chain from `chest` upward — `chest` 0.161607, `neck`
0.277041, `head` **0.355536**, `clavicle.L/R` 0.244720, `upper_arm.L/R` ≈ 0.24, `forearm.L/R` ≈ 0.12,
`hand.L` 0.027704. **10 bones remain off, up to 20 % of body height.**

**Calibration is not sufficient. The control layer as authored cannot return the actor to its rest
pose.**

### Why this stops D3

The fix is to re-author the 15 `FIRST_PASS_*` constraints out of WORLD/WORLD space (LOCAL, or
LOCAL_WITH_PARENT, with the ctrls carrying rest-relative offsets). **That changes what the control
layer means — it is a rig semantic change**, which this dispatch explicitly places out of scope
("rig semantic redesign → stop and report instead"). Nothing was applied. Nothing was saved.

---

## 4. STEP D4 — NOT RUN

§2.7 cannot be honestly passed. The rotation probes clear the 0.005 m threshold, but they clear it
*while the skeleton is 37 % of body height out of position*, and the A2_ meshes carry **0 armature
modifiers and 0 vertex groups** (REPROOF_01's finding, re-confirmed) so they can only be **rigidly**
bone-parented to that skeleton. A 5×3 matrix run on this actor would produce 15 confident numbers
describing a scrambled figure — **the same false-pass shape §2.7 exists to prevent.** The gate is
doing its job for the second time.

**No collision numbers were produced. No contact sheet. Nothing to report as a result.**

### Geometry pre-check (D4 prerequisite) — PASSES, and corrects a mid-task error of mine

Measured through `depsgraph.object_instances` as `METHOD_V1` §2.3 requires — the actor is a
**collection instance** through `ACTOR_CANON_SCALE_ROOT` (scale `0.245271`, **0 parented children**),
so `bpy.data.objects` returns the *un-instanced* originals:

| Quantity | Canon | Measured (instance-aware) | Deviation |
|---|---:|---:|---:|
| Actor standing height | 1.753685 | **1.753685** | **0.000000** |
| Blade Z extent | 1.200000 | **1.200000** | **0.000000** |
| Blade : actor ratio | 0.684273 | **0.684273401** | 4.01×10⁻⁷ |
| Actor bbox | `[0.871986, 0.230554, 1.753685]` | **identical** | — |
| Actor render-enabled meshes | 25 | **25** | — |

> **Mid-task correction, recorded deliberately.** An earlier pass in this task measured the actor at
> **7.15 m** and I reported the staging file as mis-scaled. That was **wrong** — it iterated
> `bpy.data.objects` instead of `depsgraph.object_instances`, the exact defect §2.3 was written to
> prevent. The staging file is correct. `7.150000 × 0.2452706705 = 1.753688`. Blade bbox `dy`
> measures `0.261320` against `0.278489` in `MIKAGE_ACTOR_STAGE_BUILD_01_REPORT.md:124` —
> **UNCONFIRMED**, likely a phase-state difference, not investigated.

---

## 5. STATE OF THE RULINGS

| Ruling | Status |
|---|---|
| **R1′** (O-A append) | **RE-EXECUTED, works** — 45 objects appended fully local, duplicate guard PASS (26/26 actor meshes, 0 linked originals). Note: append **bypasses the `ACTOR_CANON_SCALE_ROOT` instancer**, so the canon factor `0.2452706705` must be re-applied by hand afterwards; verified to restore 1.753685 m exactly. |
| **R2** (8 poses retired) | **DISCHARGED, unaffected.** |
| **R3** (docking, no scale inherit) | **RE-VERIFIED this run** — blade Z extent **1.200000 m**, instance-aware. |
| **R4** (collision standard) | **DISCHARGED — earned its keep again.** §2.3 caught my own error; §2.7 blocked the run. |

---

## 6. WHAT IS NEEDED NEXT — operator decision required

| # | Option | Cost | Risk |
|---|---|---|---|
| **O1** | **Re-author the 15 control constraints** to LOCAL / LOCAL_WITH_PARENT with rest-relative ctrl offsets, inside staging only. | Small, mechanical. | Changes control-layer semantics. Needs an operator ruling. **Recommended.** |
| **O2** | **Drop the control layer for this proof.** Pose the bones directly (`pose_bone.matrix_basis`) with all 15 constraints muted, authoring the 5 doctrine poses as bone data. | Smallest; touches no rig semantics. | Poses are not reusable by the control rig later. |
| **O3** | **Rebuild the control rig properly** (new-rig project). | Large. | Out of scope of every current dispatch. |
| **O4** | Accept a rigid-chunk actor and run the matrix anyway. | None. | **Do not.** Produces the false-pass shape §2.7 exists to stop. |

Independent of the option chosen: the 5 doctrine poses still need definitions (`R2` retired the
8 historical ones), and the A2_ meshes still have 0 vertex groups — only rigid attachment is possible
until a soft rig exists (already in the operator's backlog).

---

## 7. INTEGRITY

| Check | Expected | Observed | Result |
|---|---|---|---|
| Staging file | `229c727f…c17e01` | `229c727f…c17e01` | **UNCHANGED — anchor v1**, no v2 declared |
| V0.89 source | `15e61aa9…4b89` | identical | **BYTE-UNCHANGED** |
| CE15 durable | `465b212e…c3129` | identical | **BYTE-UNCHANGED** |
| Tripwire v2 | `3a62ac63…44c9` @ 79 | identical @ 79 | **UNCHANGED** |
| Source files edited | 0 | 0 | **NONE** |
| Blend files saved | 0 | 0 | **NONE** |
| Pass forced | no | no | **NONE** |
| Asset lock | not issued | not issued | **NOT ISSUED** |

Harness (kept on disk this time, not in a session scratchpad):
`_tmp/ce15_actor_collision_reproof_04/` — `s0_inspect_staging.py`, `s1_d1_d2_diagnose.py`,
`s2_verify.py`, `s3_scale_audit.py`, `s4_instancer_and_rest.py`, `s5_calibrate.py` + their JSON
outputs and captured Blender stdout.

---

*End of MIKAGE_CE15_COLLISION_REPROOF_04. D1 solved, D3 stopped at the authorization boundary,
D4 not run. No asset lock, no production claim. No commit, no push.*
