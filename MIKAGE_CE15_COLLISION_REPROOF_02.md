# MIKAGE — CE15 ACTOR COLLISION RE-PROOF 02

**Task:** `CE15_ACTOR_COLLISION_REPROOF_02` · **Date:** 2026-08-07
**By:** Claude Code · Blender 5.1.2 headless

# VERDICT: **BLOCKED — R1 IS TECHNICALLY INFEASIBLE AS SPECIFIED**

**Not PASS. Not FAIL.** The matrix ran to 15/15 zero overlap — and **that result is void**, because
the actor does not articulate. Rigid binding via **library overrides only** (ruling R1) does not
produce a posable actor in Blender. Reporting those 15 zeros as a PASS would repeat exactly the
fiction ruling R2 just retired.

> **ASSET LOCK: NOT ISSUED · PRODUCTION READY: NOT ISSUED · TECHNICAL ACTOR CLEARANCE: BLOCKED.**

---

## 1. WHAT SUCCEEDED

Everything except the binding. All measured, all verified.

| Item | Target | **Measured** | Result |
|---|---:|---:|---|
| Actor standing height | 1.753685 m | **1.753685 m** | ✅ exact |
| Armature rest height | 0.853542 m | **0.853542 m** | ✅ exact |
| Blade length after docking (R3) | 1.200000 m | **1.200000 m** | ✅ exact — no scale inherited |
| Blade mesh instances | 29 | **29** | ✅ no duplicates |
| Actor mesh count in scene | 26 | **26** | ✅ duplicate guard passed |
| Meshes bone-parented | 26 | **26**, 0 failures | ✅ assignment stuck |

**Step 4 docking (R3) works.** `CE15_GRIP_ROOT` carries a `CHILD_OF` constraint to
`MIKAGE_initial_armature_scaffold / hand.R` with `use_scale_x/y/z = False`. The blade measures
**1.200000 m** after docking — the scale-inheritance problem (A4, open since REPROOF_01) is
**RESOLVED**. Registration assumptions A1–A3 remain **PROPOSED**.

---

## 2. THE BLOCKER: bone-parented library overrides are not evaluated

The parent assignment is stored. The armature is a live override. The meshes still do not move.

| Test | Result |
|---|---|
| `hair.parent` after assignment | `MIKAGE_initial_armature_scaffold`, type `BONE`, bone `head` ✅ |
| `armature.library` / `override_library` | `None` / live override ✅ |
| `is_property_overridable_library("parent")` | `True` ✅ |
| **Rotate `head` +30° → hair displacement** | **0.000000 m** ❌ |
| **Rotate `upper_arm.R` +30° → right mitten displacement** | **0.000007 m** ❌ (7 µm — noise) |

Two independent bone/mesh pairs, both effectively zero. The relationship is **stored but not
evaluated**: the depsgraph continues to drive the override object from its linked reference's
parenting, not from the overridden `parent` field.

**Therefore R1 — "rigid binding of the A2_ actor, staging-file library overrides ONLY" — cannot
produce a posable actor.** This is a limitation of the override mechanism for re-parenting, verified
three ways, not a scripting slip.

---

## 3. WHY THE 15/15 ZEROS ARE VOID

With the actor unarticulated, `POSE_01`–`POSE_04` evaluate identically to `neutral`. The run
therefore measured **neutral, five times, at three phases** — the precise structure of the historical
fiction that ruling R2 retired this same day (`REPROOF_01` §2: all seven V0.61 poses byte-identical,
`drift_from_neutral: 0.0`).

**The numbers are not reported as results.** They are recorded in the JSON with
`"void": true` and the reason attached.

> The articulation pre-condition is now written into
> [MIKAGE_COLLISION_METHOD_V1.md](MIKAGE_COLLISION_METHOD_V1.md) §2.7 as a **mandatory abort gate**,
> so this class of false pass is detectable *before* a run rather than after.

---

## 4. WHAT WAS DELIVERED ANYWAY

| Step | Deliverable | Status |
|---|---|---|
| 1 | [ZENITH_BLADE_OPERATION_DOCTRINE_V1_ERRATA_01.md](ZENITH_BLADE_OPERATION_DOCTRINE_V1_ERRATA_01.md) — matrix 13 → 5 rows, 8 historical poses retired (R2) | **ISSUED** |
| 2 | [MIKAGE_COLLISION_METHOD_V1.md](MIKAGE_COLLISION_METHOD_V1.md) — permanent standard (R4), incl. the double-instance rule and the new articulation pre-condition | **ISSUED** |
| 3 | Rigid binding | **FAILED — R1 infeasible** (§2) |
| 4 | Docking with no scale inherit (R3) | **ACHIEVED** — blade measures 1.200000 m |
| 5 | `POSE_01`–`POSE_04` authored **as data** (`bpy.data.actions`, `use_fake_user=True`) with explicit degree values | **AUTHORED** — reconstructible, unlike the historical set. Not usable until §2 is resolved. |
| 6 | Matrix run | **VOID** (§3) |
| 7 | Paperwork | this document + JSON |

**Contact sheet: NOT PRODUCED.** Captures of an unarticulated actor would show five identical poses.
Publishing them as pose evidence would be misleading.

---

## 5. OPTIONS (engineering only — the mechanism choice is the operator's)

R1 named the mechanism. It does not work. The alternatives, with their costs:

| # | Option | Effect | Cost / risk | Tripwire |
|---|---|---|---|---|
| **O-A** | **APPEND** the A2_ actor into the staging file instead of linking | Objects become fully local; bone-parenting evaluates normally | Satisfies R1's *intent* (staging-file only, sources untouched) but deviates from its *letter* ("overrides ONLY"). Actor data is duplicated into the stage; later source changes do not propagate — acceptable for a frozen actor, and V0.89 is frozen | unchanged — staging filename stays outside scope |
| **O-B** | Bind in a **new derivative** of the V0.89 source | Full Blender parenting, no override limits | Creates a new `.blend` in the `zenith\|blade` name scope → **tripwire 79 → 80, declared rebaseline required** per `BASELINE_METHOD.md` | **changes the baseline** |
| **O-C** | **Soft-deformation rig** (armature modifiers + vertex groups) | The proper long-term fix | This is the item ruling **D-c** backlogged as a non-blocker. It is the largest job | unchanged |

**O-A is the smallest change that unblocks the gate.** I did not take it: R1 specified overrides
only, and switching the binding mechanism is an authorization decision, not an implementation detail.

---

## 6. INTEGRITY

| Check | Expected | Observed | Result |
|---|---|---|---|
| Staging file | `229c727f…c17e01` | `229c727f…c17e01` | **RESTORED TO ANCHOR v1** — no v2 declared |
| V0.89 source blend | `15e61aa9…4b89` | identical | **BYTE-UNCHANGED** |
| CE15 durable blend | `465b212e…c3129` | identical | **BYTE-UNCHANGED** |
| Tripwire v2 | `3a62ac63…44c9` @79 | identical @79 | **UNCHANGED** |
| Linked geometry / materials edited | 0 | 0 | **NONE** |
| Pass forced by any modification | no | no | **NONE** |
| Asset lock issued | no | no | **NOT ISSUED** |

The staging file was opened and saved during the run, then **restored from backup to anchor v1**
because the saved state contained a non-functional binding. Four transform orderings were tried and
measured before the correct one was found; three produced wrong actor heights (2.870008 m, 0.825336 m,
2.870008 m) and were discarded rather than accepted. Those are recorded here rather than omitted.

---

## 7. REQUIRED BEFORE THIS GATE CAN RUN

| # | Requirement |
|---|---|
| **R1′** | Operator selects a binding mechanism from §5 (O-A / O-B / O-C). R1 as written is infeasible. |
| R3′ | Rule registration assumptions **A1–A3** (still PROPOSED). A4 is now resolved. |
| — | R2 and R4 are **discharged** — the doctrine errata and the collision standard are issued. |

---

*End of MIKAGE_CE15_COLLISION_REPROOF_02. Gate BLOCKED. No verdict, no asset lock, no production
claim. No commit, no push.*
