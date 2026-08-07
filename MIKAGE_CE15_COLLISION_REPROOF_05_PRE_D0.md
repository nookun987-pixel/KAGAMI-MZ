# MIKAGE — CE15 ACTOR COLLISION RE-PROOF 05 · PRE-D0 PREFLIGHT (O2-PROVISIONAL)

**Task:** `CE15_ACTOR_COLLISION_REPROOF_05` · **Step:** `PRE_D0` · **Date:** 2026-08-07
**By:** Claude Code · Blender 5.1.2 headless · staging opened read-only, never saved
**Authorised surface:** `pose_bone.matrix_basis` only. `arm.data.bones` / `edit_bones` / rest data **never touched.**

# VERDICT: **PRE-D0 as literally specified — FAIL on one mesh. Variant PRE-D0b — all gates PASS.**
# **O2-PROVISIONAL is viable, with one substitution. No pose defined. No matrix run.**

> **ASSET LOCK: NOT ISSUED · PRODUCTION READY: NOT ISSUED.** No blend saved, no staging edit,
> no commit, no push. The 5 doctrine poses remain **undefined** and require an operator ruling.

```
EVIDENCE STATUS: TECHNICALLY APPROVED — EVIDENCE ATTACHMENT PENDING
```

> Every figure in this report was **measured locally in this session**. None has yet been
> independently verified against a re-run from an attached bundle. **Do not write "independently
> verified" for any number here** until the harness, JSON, stdout and integrity evidence under
> `_tmp/ce15_actor_collision_reproof_04/` and `_tmp/ce15_actor_collision_reproof_05/` have been
> attached and compared. `_tmp/` is gitignored (`.gitignore:62`), so these artifacts do **not**
> travel with a commit and must be attached deliberately.

---

## 1. STEP-ORDER CORRECTION (declared before results)

The dispatch orders bind(2) → mute(3) → reset(4). **That order cannot satisfy acceptance
criterion 5.** Binding while the 15 constraints are live anchors every mesh to the scrambled
skeleton; muting and resetting then drags the meshes with it.

**Measured, not argued:** un-muting the constraints with the meshes bound displaces the actor
**2.285531 m** from baseline — on a 1.753685 m actor. The script therefore binds **after**
mute+reset, and records the rejected order as section `M`.

---

## 2. PRE-D0 AS SPECIFIED — RESULTS

| # | Gate | Measured | Result |
|---|---|---:|---|
| 1 | Append, library-aware | 45 linked removed, 45 appended fully local; 26 actor meshes; duplicate guard **PASS** | ✅ |
| 2 | Instance-aware geometry | bbox `[0.871986, 0.230554, 1.753685]`, 25 render-enabled instances, height deviation **0.000000000** | ✅ |
| 3 | Mute all constraints incl. IK | **15 / 15** muted, IK included | ✅ |
| 4 | Reset to rest via `matrix_basis.identity()` | max bone deviation from rest **7.5 × 10⁻⁸ m**, 0 bones off rest | ✅ |
| 5 | Actor neutral unchanged | max mesh drift **0.492471337 m** | ❌ |
| 6 | Rigid-bind 26 meshes | 26 bound, 0 failed — but carries the 0.492471 m from gate 5 | ❌ |
| 7 | Direct pose-bone `hand.R` 30° | driven **0.147283 / 0.170332 / 0.638713 m**; unrelated max **1.79 × 10⁻⁷ m** | ✅ |
| 8 | Reset reproducible | drift **0.492471348 m** (same single mesh) | ❌ |

### Gates 5 / 6 / 8 fail on exactly one mesh — and it is not a harness fault

**25 of 26 meshes do not move at all.** The single mesh that moves is
`A2_right_porcelain_mitten_hand_attached_read`, by **0.492471337 m**.

Cause, read from the file:

| Object | `parent` | `parent_type` | `parent_bone` |
|---|---|---|---|
| `A2_right_porcelain_mitten_hand_attached_read` | `MIKAGE_initial_armature_scaffold` | **BONE** | **`hand.R`** |
| `MESH_PREP_ZENITH_BLADE_ATTACHMENT_INTENT_EMPTY_NON_RIG` | `MIKAGE_initial_armature_scaffold` | **BONE** | **`hand.R`** |
| `A2_left_porcelain_mitten_hand_attached_read` | `MESH_PREP_LEFT_ARM…INTENT_EMPTY` | OBJECT | — |

**V0.89 bone-parents the right mitten to `hand.R`. The left mitten is not bone-parented at all.**
That asymmetry is consistent with V0.89's own remit (bounded mitten interface correction), but it
has a consequence nobody had recorded:

> **The actor's authored, canon-verified shape is defined against the CONSTRAINED-NEUTRAL pose,
> not against rest.** Rest is not the actor's neutral. Resetting to rest is what moves the mitten
> half a metre — the reset itself is correct (gate 4: 7.5 × 10⁻⁸ m) and all other transforms are
> preserved exactly (25/26 meshes at 0.000000).

This is **not** any of the four failure modes the dispatch anticipated. It is a fifth: the premise
that rest == neutral does not hold for this actor.

### A measurement error of mine, found and corrected

Gate 7 first read `driven_min = 0.000000` and I recorded it as a failure. Wrong: the zero came from
`A2_blade_material_dark_front_weight_refinement`, which is `hide_render = True` and is therefore
**excluded from measurement by `METHOD_V1` §2.1**. With the exclusion applied correctly, gate 7
passes on all three render-enabled driven meshes. Corrected in the harness, not worked around.

---

## 3. PRE-D0b — IS O2 SALVAGEABLE? (diagnostic beyond the literal step list)

Substitute one step: instead of `matrix_basis.identity()`, **bake the constrained-neutral pose into
`matrix_basis`** (capture each bone's armature-space matrix with constraints live, mute, then write
it back parent-first). Same authorised surface. Rest data still untouched.

| Gate | Measured | Result |
|---|---:|---|
| **A** — bake neutral | 15 constraints muted; bone reproduction error **5.67 × 10⁻⁷ m**; mesh drift **4.89 × 10⁻⁷ m** | ✅ |
| **B** — rigid-bind 26 at baked neutral | drift **4.85 × 10⁻⁷ m** | ✅ |
| **C** — pose `hand.R` 30° on top | driven **0.342973 / 0.349382 / 0.364243 m**; unrelated max **3.58 × 10⁻⁷ m** | ✅ |
| **D** — return to neutral | drift **4.87 × 10⁻⁷ m** | ✅ |

**All four gates pass.** Direct pose-bone control drives the correct meshes, well above the 0.005 m
articulation threshold, with isolation at the 10⁻⁷ m level — bones that should not move, do not.
The actor holds its canon shape throughout, and the fixture is reproducible: pose and un-pose
return to baseline within 5 × 10⁻⁷ m.

---

## 4. WHAT THIS DOES AND DOES NOT ESTABLISH

**Does:** direct `matrix_basis` control is a working, isolated, reproducible posing surface for the
rigid actor, **provided the neutral is the baked constrained-neutral, not rest.**

**Does not:** certify any pose · define any pose · establish that the 26-mesh bone map is
anatomically adequate (only `hand.R` isolation was tested) · run or substitute for the 5×3 matrix ·
grant any lock or production status.

---

## 5. RECOMMENDED AMENDMENT TO PRE-D0

Replace step 4 of the preflight:

| | Step 4 |
|---|---|
| Dispatch | reset every pose bone with `matrix_basis.identity()` |
| **Amended** | **capture the constrained-neutral in armature space, mute all 15 constraints, write it back into `matrix_basis` parent-first; that baked state is the neutral** |

and re-order to:

> **capture neutral (constraints LIVE) → mute → reconstruct into `matrix_basis`, parent-before-child
> → verify fidelity → bind → pose**

> **Do not write this as the shorthand "mute → neutral".** That phrasing inverts the load-bearing
> step: the neutral must be captured **while the constraints are still active**. Once they are muted
> the neutral no longer exists to be captured. The shorthand appeared in an earlier draft of this
> section and is corrected here.

With that amendment, PRE-D0 passes end to end. **Operator ruling required** — this changes what
"neutral" means for every pose authored afterwards, and that definition must be recorded before any
pose is signed. Ruling:
[MIKAGE_COLLISION_FIXTURE_NEUTRAL_RULING.md](MIKAGE_COLLISION_FIXTURE_NEUTRAL_RULING.md) —
**APPROVED — HUMAN SIGNED, 2026-08-07 (Phi Hùng)**. The amended neutral defined there is now the
fixture neutral for this campaign. Matrix state remains **0 / 15** pending a separate signed pose
ruling.

---

## 6. NOT DONE, DELIBERATELY

- **No pose defined.** The five names circulating in the review thread
  (`REST_REFERENCE`, `VERTICAL_LOW_CARRY`, `RIGHT_SIDE_CARRY`, `BRACED_CRUSH_READY`,
  `DOWNWARD_COMPRESSION`) do **not** appear anywhere in the REPROOF_04 deliverables —
  `grep` returns **0** in all three files. They did not originate here. REPROOF_04 §6 records only
  that "the 5 doctrine poses still need definitions". No matrix will be run on AI-authored poses.
- **No matrix run.** 0 of 15 checks.
- **No staging edit, no save, no O1.**

---

## 7. INTEGRITY

| Check | Expected | Observed | Result |
|---|---|---|---|
| Staging file | `229c727f…c17e01` | `229c727f…c17e01` | **UNCHANGED — anchor v1** |
| V0.89 source | `15e61aa9…4b89` | identical | **BYTE-UNCHANGED** |
| CE15 durable | `465b212e…c3129` | identical | **BYTE-UNCHANGED** |
| Tripwire v2 | `3a62ac63…44c9` @ 79 | identical @ 79 | **UNCHANGED** |
| Paperwork validator | PASS | PASS — 22 core + 13 registry | **PASS** |
| Blend files saved | 0 | 0 | **NONE** |
| Git tracked files modified | 0 | 0 | **NONE** |

Verbatim command output for every row above: `_tmp/ce15_actor_collision_reproof_04/INTEGRITY_EVIDENCE.txt`
Harness + JSON + captured stdout: `_tmp/ce15_actor_collision_reproof_05/`

---

*End of CE15_ACTOR_COLLISION_REPROOF_05 PRE-D0. Preflight failed as specified, passed under the
amended neutral. No pose, no matrix, no lock, no commit, no push.*
