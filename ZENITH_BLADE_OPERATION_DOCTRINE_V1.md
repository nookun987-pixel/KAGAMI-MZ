# ZENITH BLADE — OPERATION DOCTRINE V1

**STATUS: APPROVED — Operator (BOOS BỚP) · Ruled & Signed 2026-08-07**

**Drafted:** 2026-08-07 by task `ZENITH_BLADE_OPERATION_DOCTRINE_DRAFT_VERIFY_01`
**Drafted by:** Claude Code (documentation only — no Blender, no render, no geometry or material action)
**Source:** external draft, reviewed and amended by the Cowork lane; every basis re-verified against
disk before writing. Verification results in §8.

> **THIS DOCTRINE IS IN FORCE.** Ruled and signed by the Operator (BOOS BỚP) on 2026-08-07
> (Cowork session). Three operator rulings were issued with the signature and are applied in place:
>
> | Ruling | Effect |
> |---|---|
> | **R1** | §2.1 rule = **"Vertical carry, termination down."** The "point-down" wording is **retired permanently** — CE15 has no point. Basis: `SPEC_V1:113`. |
> | **R2** | §2.3 force-division reading **ADOPTED as ruled operational law**: porcelain cutting mass takes impact; chassis / graphite bears structure. Basis: OUT3 run-log explode groups. |
> | **R3** | **ANCHOR = chassis / spine ONLY.** The OUT3 legend governs over `BOARD_V1.md:84`. The hub / handle axis is the **primary grip and load-path terminating member**, not an anchor. |
>
> **Six** of the bases supplied with the external draft did not check out on verification. Those
> rows are **retained in §8 as historical record**, each marked *superseded by operator ruling R#*.
> Nothing was deleted. The rules now stand on the rulings, not on the failed citations.

> **ASSET LOCK: NOT ISSUED · PRODUCTION READY: NOT ISSUED · CANON LOCK: NOT ISSUED.**

---

## 1. Purpose & scope

This document is **animation law** and **collision-gate input** for the Zenith Blade:

- **Animation law** — the operational rules an animator or rig solver must not violate when posing
  or moving the weapon.
- **Collision-gate input** — the pose set that a future collision pass must clear, and the zones it
  must measure.

**It is explicitly NOT:** a canon lock · an asset lock · a production-ready declaration · a material
or geometry ruling · a licence to render, animate, deploy or publish.

Governing form authority remains [ZENITH_BLADE_CANON_LOCK_V1.md](ZENITH_BLADE_CANON_LOCK_V1.md)
(+ [ERRATA 01](ZENITH_BLADE_CANON_LOCK_V1_ERRATA_01.md)) and
[ZENITH_BLADE_MATERIAL_CANON_V1.md](ZENITH_BLADE_MATERIAL_CANON_V1.md). Nothing here overrides them.

---

## 2. Operational rules

### 2.1 Carry orientation — vertical, termination down, at the hip

> **RULE.** The Blade is held and carried **vertically alongside Mikage's hip**, blunt mechanical
> termination downward. The gauntlet holds the handle; the holster / docking interface bears the
> bottom.

**Verified basis:** `docs/handoff/MIKAGE_ZENITH_BLADE_SPEC_V1.md:113` — operator ruling
"V0.15 SHELL FORM", 2026-07-24, item 6, verbatim:
*"Blade giữ vị trí dọc sát hông Mikage; gauntlet giữ handle; holster/docking chịu phần đáy."*

> ✅ **RULED — operator ruling R1, 2026-08-07 (Cowork session).** The rule is
> **"Vertical carry, termination down."** The external draft's **"point-down hold" wording is
> RETIRED PERMANENTLY** and must not be reintroduced in any brief, prompt, animation note or
> retelling. Verified basis: `docs/handoff/MIKAGE_ZENITH_BLADE_SPEC_V1.md:113`.
>
> The three failed citations below are retained as historical record — **superseded by R1**:
>
> - `MIKAGE_ZENITH_CANON_V2.md` §2.4 (lines 122–159) contains **no orientation or hold statement of
>   any kind**. **CITATION UNVERIFIED.**
> - `MIKAGE_ZENITH_BLADE_SPEC_V1.md` §3 (lines 76–85) states the opposite of a point:
>   *"**No pointed tip**, no crossguard, no wrapped/leather grip"* and *"a decisive flat-cut top"*.
>   It does not establish a hold orientation. **CITATION UNVERIFIED.**
> - Board V1 panels 1 and 11 are renders; their run-log records
>   (`RUN_LOG_outstanding_renders_v2.json` → `outputs.OUT1`, `outputs.OUT4`) carry camera, scene,
>   lighting and ROI metadata **only**. No orientation rule is asserted by either panel.
>   **CITATION UNVERIFIED as a doctrinal basis.**
> - The lineage-audit finding **does** check out and is the correct nuance:
>   `ZENITH_BLADE_LINEAGE_AUDIT_01.md:369` — *"**point-down** | **PARTIAL** — the vertical / hanging
>   orientation survived; the **point itself was removed**"*.
>
> **CE15 has no point.** Its termination is blunt mechanical (BRUTALIST CONVERGENCE ruling item 4,
> 2026-07-28). Writing "point-down" into animation law would contradict the canon-locked form.
> **R1 settles this permanently:** the rule is **vertical carry, termination down**.

### 2.2 Hub-axis primary grip — no wrapped or leather grip

> **RULE.** The primary grip is the **hub / handle axis**. There is **no wrapped or leather grip**,
> no crossguard, and no pommel. The interface is industrial hardware: a rectangular hydraulic
> Drive Hub with flush concentric mechanical rings in place of a guard, and a flat Titanium
> Flux-Pinning base with magnetic ports in place of a pommel.

**Verified basis (two, independent):**
- `docs/handoff/MIKAGE_ZENITH_BLADE_SPEC_V1.md:81` — *"No pointed tip, no crossguard, **no
  wrapped/leather grip**."*
- `docs/handoff/MIKAGE_ZENITH_BLADE_SPEC_V1.md:84` — *"Interface = industrial hardware: a
  **rectangular hydraulic Drive Hub + flush concentric mechanical rings (0.0mm tolerance)** instead
  of a guard; a **flat Titanium Flux-Pinning base** with magnetic ports instead of a pommel."*
- OUT3 legend entry `"hub / handle axis"` — `renders/board_v1_evidence/run_out3_v3.py:32`,
  `RUN_LOG_out3_v3.log` layers[5]. The hub/handle axis is the terminating member of the load path
  (§3), which is what makes it the primary grip.

> **Precision note — the hub / handle axis is the primary GRIP, not an ANCHOR.** The OUT3 legend
> tags exactly one layer as an anchor: `"chassis / spine  (ANCHOR - stays)"`. The hub/handle axis
> carries no such tag. `ZENITH_BLADE_FINAL_DESIGN_BOARD_V1.md:84` describes both as "Anchors"; that
> wording is **not** adopted — **operator ruling R3, 2026-08-07** settles it; see §3 and
> [ZENITH_BLADE_BOARD_V1_MD_ERRATA_01.md](ZENITH_BLADE_BOARD_V1_MD_ERRATA_01.md). Grip status and
> anchor status are separate claims and this rule asserts only the first.

### 2.3 Asymmetric force division — porcelain cutting mass vs. chassis-side group

> **RULE.** The Blade's two sides are **not interchangeable**. The porcelain shells `ZB45_SHELL_LL`
> and `ZB45_SHELL_UL` form the **cutting mass**. The Z-Blue graphite shells `ZB45_SHELL_LR` and
> `ZB45_SHELL_UR` are grouped as **root transitions / bearing roots**. Poses and motion must respect
> this division; the cutting mass leads, the graphite side bears.

**Verified basis (three, converging):**
- `renders/board_v1_evidence/run_out3_v3.py:30–31` and `RUN_LOG_out3_v3.log:28–31` — the OUT3
  explode assigns `ZB45_SHELL_LL` / `ZB45_SHELL_UL` to layer `"porcelain cutting mass"` and
  `ZB45_SHELL_LR` / `ZB45_SHELL_UR` to layer `"root transitions / bearing roots"`. **Measured
  grouping, not assertion.**
- `ZENITH_BLADE_CANON_LOCK_V1_ERRATA_01.md:28–29` — *"Shell plates: porcelain LL/UL (#F2EEEA per
  ruling D3) · Z-Blue graphite LR/UR — deliberate asymmetry (operator ruling D3-mat, 2026-08-06)"*;
  and `:40` — *"Shell asymmetry is **DELIBERATE**, not an error."*
- `ZENITH_BLADE_MATERIAL_CANON_V1.md:176` — *"D3 — Shell plate asymmetry — **RESOLVED: DELIBERATE**"*.

> ✅ **RULED — operator ruling R2, 2026-08-07 (Cowork session).** The force-division reading is
> **ADOPTED as ruled operational law**: **the porcelain cutting mass takes impact; the chassis /
> graphite side bears structure.** Basis accepted by the operator: the OUT3 run-log explode groups
> (measured), together with the D3-mat asymmetry ruling. It is no longer an interpretation awaiting
> a ruling — it is law.
>
> The failed citations below are retained as historical record — **superseded by R2**:
> - The Design Bible's only structural statement is `:47` — *"Central load spine + paired recessed
>   rails + **two structural lobes** surrounding the central P3 slot"*. It describes **two lobes**
>   but says **nothing about force division, cutting mass, or asymmetry between them**. It does not
>   support the rule as worded. **CITATION UNVERIFIED.**
> - Panel 7 is the core/spine section; `ZENITH_BLADE_FINAL_DESIGN_BOARD_V1.md:72` states explicitly
>   *"**No clearance dimensions are asserted by panel 7** — geometric relationship only."*
>   **CITATION UNVERIFIED for a force claim.**
> - Panel 10 is `HC_wireframe_material_proof.png`, a wireframe/material proof. It shows the material
>   split but asserts no force behaviour. **Supports the material asymmetry, not the force division.**
>
> **R2 resolves this.** The force reading is now ruled operational law, not an interpretation.
> Note its scope: it governs **pose and motion authoring** — which side leads and which side bears.
> It is **not** a physical, stress or mass claim, and it does not license mass-derived wording
> (§6 item 2 still forbids that).

### 2.4 P3 signal is not a primary load-bearing member

> **RULE.** The P3 core is a **signal**, not structure. No pose, motion, contact or load may route
> force through `ZB42_P3_SINGLE_RECESSED_CORE`. It stays at the spine.

**Verified basis, verbatim:** `renders/board_v1_evidence/run_out3_v3.py:33` and
`RUN_LOG_out3_v3.log:122` — OUT3 legend layer 7:
*"P3 SIGNAL - NOT PRIMARY LOAD-BEARING MEMBER (stays at spine)"*.

> ⚠ **Two corrections to the external draft.**
> 1. **Location.** The draft cited "panel 8 label (verbatim)". The panel-8 **printed label** is
>    *"LOAD-PATH EVIDENCE DIAGRAM — not a manufacturing exploded view."*
>    (`ZENITH_BLADE_FINAL_DESIGN_BOARD_V1.md:51`). The P3 statement is in the **OUT3 legend layer
>    text**, not the panel label. **CITATION UNVERIFIED as stated; verified at the corrected location.**
> 2. **Wording.** The record says **"NOT PRIMARY LOAD-BEARING MEMBER"**, not "non-load-bearing".
>    Those are different claims — the first excludes it from the *primary* path, the second asserts
>    it bears nothing at all. The verbatim wording is used above. **Do not upgrade it.**

---

## 3. Load-path hierarchy

Verbatim from the OUT3 legend (`renders/board_v1_evidence/run_out3_v3.py:31–33`, mirrored in
`RUN_LOG_out3_v3.log:66–122`). OUT3 defines **seven** legend entries. Six form the load path;
the seventh is the isolated core.

| Step | Legend entry (verbatim) |
|---|---|
| 1 | `porcelain cutting mass` |
| 2 | `root transitions / bearing roots` |
| 3 | `wedge followers` |
| 4 | `keyed channels / rails` |
| 5 | `chassis / spine  (ANCHOR - stays)` |
| 6 | `hub / handle axis` |
| — | `P3 SIGNAL - NOT PRIMARY LOAD-BEARING MEMBER (stays at spine)` — **isolated, not a load-path step** |

> **No numeric offsets are carried into this doctrine.** OUT3's per-layer offset multipliers and
> metre distances are **diagram layer-spacing — visualization parameters of the exploded view**, not
> mechanical properties of the weapon. The doctrine states the **order only**.

**Order:** force enters at the porcelain cutting mass and terminates at the **hub / handle axis**.

**ANCHOR = `chassis / spine` — and only that.** It is the sole layer the OUT3 legend tags as an
anchor: `"chassis / spine  (ANCHOR - stays)"`. **The core is isolated from the chain.**

> **The hub / handle axis is NOT labelled ANCHOR by the legend.** Three layers are held stationary
> in the exploded diagram — `chassis / spine (ANCHOR - stays)`, `hub / handle axis`, and the P3 core
> — but **only the first carries the ANCHOR designation**. Being held stationary is a property of the
> diagram; it does not confer anchor status, or the isolated core would qualify too.
>
> ✅ **DIVERGENCE RESOLVED — operator ruling R3, 2026-08-07 (Cowork session).**
> `ZENITH_BLADE_FINAL_DESIGN_BOARD_V1.md:84` describes the panel as *"Anchors | chassis / spine and
> hub / handle axis **stay** (offset 0)"* — using "Anchors" for both. **R3 rules that the OUT3
> legend governs:** ANCHOR = **chassis / spine only**; the hub / handle axis is the **primary grip
> and load-path terminating member**, not an anchor. The board MD's plural wording is corrected by
> [ZENITH_BLADE_BOARD_V1_MD_ERRATA_01.md](ZENITH_BLADE_BOARD_V1_MD_ERRATA_01.md) (the board MD
> itself is left byte-unchanged).

Method constraints on this diagram (`ZENITH_BLADE_FINAL_DESIGN_BOARD_V1.md:80–84`): translation only,
no rotation, no geometry edit, originals untouched; explode axis world −Y, with a secondary +Z offset
for occlusion clearance only. Panel label: *"LOAD-PATH EVIDENCE DIAGRAM — not a manufacturing
exploded view."*

---

## 4. Combat pose & collision matrix

All four poses below are **PROPOSED**. None has been built, posed, rendered or collision-tested.
Collision testing is **BLOCKED** — see §6.

### POSE_01 — `CHASSIS_GUARD` · **PROPOSED**

**Kinematic description.** Blade raised across the body, chassis/spine side presented outward;
hub/handle axis held at the gauntlet; cutting mass angled away from the actor's centre line.

**Collision-check zones.**
1. Mitten clearance at hub axis — `A2_right_porcelain_mitten_hand_attached_read` vs `ZB46_DRIVE_HUB`, `ZB48_HANDLE_REGISTERED_TO_HAND_MARKER`
2. Penetration volume vs actor armour — chassis group vs torso/forearm meshes
3. Shoulder-joint amplitude on V0.89 rig
4. Secondary contact on chassis — `ZB_ARCH03R_CHASSIS`, `ZB_ARCH03R_HUB_NECK`
5. Core–spine–rails axis alignment — `ZB42_P3_SINGLE_RECESSED_CORE` must remain isolated per §2.4

### POSE_02 — `CUTTING_MASS_SLAM` · **PROPOSED**

**Kinematic description.** Downward committed arc leading with the porcelain cutting mass
(`ZB45_SHELL_LL` / `ZB45_SHELL_UL`); chassis side trailing as the bearing member; termination
travels through the actor's forward arc.

**Collision-check zones.** As POSE_01, plus: swept-volume clearance of the cutting mass against the
actor's leading leg and forearm at maximum extension.

### POSE_03 — `DUAL_ANCHOR_PIN` · **PROPOSED**

**Kinematic description.** Both anchors loaded simultaneously — chassis/spine braced, hub/handle
axis driven — with the Blade pinned across a static contact. Tests the two-anchor condition
recorded in §2.2.

**Collision-check zones.** As POSE_01, with emphasis on 2 and 4: simultaneous chassis and hub
contact must not produce a novel collision pair.

### POSE_04 — `P3_SIGNAL_DISCHARGE` · **PROPOSED**

**Kinematic description.** Blade at full P3 extension, core exposed through the spine notch.

> **Discharge mechanics: NARRATIVE — PROPOSED.** No discharge behaviour, energy transfer, recoil,
> blast, or environmental effect is documented anywhere in the corpus. Nothing here is a physical
> claim.
>
> **Collision test for POSE_04 is STATIC GEOMETRY ONLY.** No dynamic, particle, force or simulation
> test is defined or authorised.

**Collision-check zones.** As POSE_01. Zone 5 (core–spine–rails axis alignment) is the primary
gate for this pose.

**Render-QA gate context — not physical behaviour.** `renders/board_v1_evidence/OUT1_CORE_GATE.json`
records, for the CE15 hero render: `violet_global_pct` **0.5005**, `gate_global_pass_le_5pct`
**true**, `violet_roi_density` 0.063293, `gate_a_density_pass` true, `thumb_128_violet_px` 112.
The **≤ 5 %** figure is a **render-QA threshold on pixel coverage**. It is **not** a physical,
energetic or operational property of the weapon and must never be cited as one.

### 4.1 COMBINED COLLISION MATRIX

A future collision pass must clear **all** rows. Coverage must never shrink below the historical bar.

| # | Pose | Origin | Historical result | Doctrine status |
|---|---|---|---|---|
| 0 | `neutral` | V0.89 baseline | 0 overlaps · 0 novel pairs (P1/P2/P3) | must be re-proven on CE15 |
| 1 | `hand_hold` | V0.89 historical | 0 / 0 | must be re-proven on CE15 |
| 2 | `torso_left` | V0.89 historical | 0 / 0 | must be re-proven on CE15 |
| 3 | `torso_right` | V0.89 historical | 0 / 0 | must be re-proven on CE15 |
| 4 | `wide_stance` | V0.89 historical | 0 / 0 | must be re-proven on CE15 |
| 5 | `crouch` | V0.89 historical | 0 / 0 | must be re-proven on CE15 |
| 6 | `shoulder_elbow_limit` | V0.89 historical | 0 / 0 | must be re-proven on CE15 |
| 7 | `cloak_left` | V0.89 historical | 0 / 0 | must be re-proven on CE15 |
| 8 | `cloak_right` | V0.89 historical | 0 / 0 | must be re-proven on CE15 |
| 9 | `POSE_01 CHASSIS_GUARD` | this doctrine | — | **PROPOSED — never tested** |
| 10 | `POSE_02 CUTTING_MASS_SLAM` | this doctrine | — | **PROPOSED — never tested** |
| 11 | `POSE_03 DUAL_ANCHOR_PIN` | this doctrine | — | **PROPOSED — never tested** |
| 12 | `POSE_04 P3_SIGNAL_DISCHARGE` | this doctrine | — | **PROPOSED — static geometry only** |

**Total: 8 historical poses + neutral baseline + 4 doctrine poses = 13 rows.**

**Pose enumeration source (CONFIRMED, individually named):**
`production/character/reviews/MIKAGE_ZENITH_BLADE_MITTEN_INTERFACE_CORRECTION_V0_89_PROOF.md:32–45`,
section *"Neutral plus existing eight-pose gate"*, and
`…_V0_89_REPORT.json` → `pose_validation` (same nine keys, each with P1/P2/P3 sub-records at frames
1 / 31 / 61). The record **does** name all eight individually — no enumeration gap.

> **Critical carry-forward.** The V0.89 zero-overlap result was achieved against the **old weapon
> form**, not CE15. `ZENITH_BLADE_FINAL_DESIGN_OPERATOR_RULING.md` dual-lineage rule 5:
> *"The V0.89 zero-overlap result does not transfer to CE15 geometry. It must be re-proven against
> CE15's shell shape."* Every historical row above is therefore **must-re-prove**, not **passed**.

---

## 5. P1 / P2 STATES — UNCONFIRMED

**This doctrine defines behaviour around P3 only.**

P1 (`Compact-Idle`) and P2 (`Brutal Industrial Activation`) have documented *structural* and *signal*
definitions — closed block / shell-split, core OFF in both — but **no operational semantics**: no
carry rules beyond the §2.1 hip carry, no transition timing law, no combat behaviour, no collision
poses.

**Inventing them is forbidden.** P1/P2 operational semantics await a separate operator ruling.
Any future pose, animation or collision work touching P1 or P2 operationally is **out of scope of
this document** and must not cite it as authority.

---

## 6. Prerequisites & caveats

| # | Item | Status |
|---|---|---|
| 1 | **Collision testing is BLOCKED until actor-reference cleanup produces a measurable, verified actor.** Current state: the evaluated scene's non-blade meshes measure 3.450 m top-to-bottom because overlaid `PUBLIC_BLOCK` blade variants dominate the bounding box; the only armature is `MIKAGE_initial_armature_scaffold` (0.19 m scaffold, *per task brief — not re-verified*); OUT4 used a temporary **1.75 m primitive proxy**, explicitly **NOT a character asset**. | **BLOCKED** — `ZENITH_BLADE_FINAL_DESIGN_BOARD_V1.md:125–133` |
| 2 | `PHYSICAL_VOLUME_EXACT_VALUE` | **NOT VERIFIED.** All collision evidence to date is BVH triangle-overlap based. **No "heavy", "light", "massive" or any mass-derived wording may be used in any pose description, animation note or gate report.** |
| 3 | CE15 ↔ actor collision / clearance | **NOT VERIFIED** — carried from `ZENITH_BLADE_CANON_LOCK_V1.md` NOT LOCKED list and manifest `unresolved` |
| 4 | Grip-IK / mitten clearance | **NOT VERIFIED** — awaiting POSE_01…04 results, which cannot run until item 1 clears |
| 5 | In-scene actor height | **UNCONFIRMED** (overlaid variants) |
| 6 | The §2.3 "force division" reading | ✅ **RULED** — operator ruling **R2**, 2026-08-07. Adopted as operational law for pose/motion authoring. Not a physical, stress or mass claim; item 2 still applies. |
| 7 | Orbital-Logic UI / acid vapor / thermal mirage as P3 render effects | **UNCONFIRMED** — never ruled; outside this doctrine |

---

## 7. STATUS

```
DOCUMENT:          ZENITH_BLADE_OPERATION_DOCTRINE_V1
SCOPE:             animation law + collision-gate input, P3 only
DRAFTED:           2026-08-07  ·  ZENITH_BLADE_OPERATION_DOCTRINE_DRAFT_VERIFY_01
STATUS:            APPROVED — Operator (BOOS BỚP) · Ruled & Signed 2026-08-07
RULINGS APPLIED:   R1 (carry orientation) · R2 (force division) · R3 (anchor)
SIGNED BY:         Operator (BOOS BỚP / Phi Hùng)
SIGNATURE DATE:    Ruled & Signed 2026-08-07 (Cowork session)
CANON LOCK:        NOT ISSUED
ASSET LOCK:        NOT ISSUED
PRODUCTION READY:  NOT ISSUED
COLLISION TESTED:  NO — BLOCKED, see section 6
```

---

## 8. CITATION MATRIX

Every claim in §2 / §3 / §4 → `file:line` + sha256 of the cited file, recomputed from disk
2026-08-07.

| Claim | Cited file | Line(s) | Verdict | SHA-256 |
|---|---|---|---|---|
| §2.1 carry orientation | `docs/handoff/MIKAGE_ZENITH_BLADE_SPEC_V1.md` | 113 | ✅ VERIFIED | `55937e4439ee2eeea9cbec2405b41d3105cc42b0b41c5da587037fcc796f0acb` |
| §2.1 "point-down" nuance | `ZENITH_BLADE_LINEAGE_AUDIT_01.md` | 369 | ✅ VERIFIED (PARTIAL finding) | `6e9c268f53bfb742c19d6f43a760d9c2c8f2464aea4647c0d6de003d5d86af2e` |
| §2.1 point-down per CANON_V2 §2.4 | `MIKAGE_ZENITH_CANON_V2.md` | 122–159 | ❌ **CITATION UNVERIFIED** — no orientation statement exists — **superseded by operator ruling R1, 2026-08-07** | `4bafe29a2d8a60c4c54a6de4dd6920b003ddf56679f72bc79c405a7e7b1d5e9c`  |
| §2.1 point-down per SPEC_V1 §3 | `docs/handoff/MIKAGE_ZENITH_BLADE_SPEC_V1.md` | 76–85 | ❌ **CITATION UNVERIFIED** — §3 states "No pointed tip" — **superseded by operator ruling R1, 2026-08-07** | `55937e4439ee2eeea9cbec2405b41d3105cc42b0b41c5da587037fcc796f0acb`  |
| §2.1 point-down per panels 1 / 11 | `renders/board_v1_evidence/OUT1_HERO_P3_85MM_ANNOTATED.png` · `OUT4_SCALE_VS_HUMAN_ANNOTATED.png` | run-log `outputs.OUT1` / `outputs.OUT4` | ❌ **CITATION UNVERIFIED** — camera/scene metadata only, no rule asserted — **superseded by operator ruling R1, 2026-08-07** | `588d8f8aaca507bd082c91c6103305d5ac06a27b6f9cea94cba07d120c08db27` · `025ca12cba3b2f065e6186c86394b10081d939f61379524d5294a1c5e20a51f8`  |
| §2.2 no wrapped/leather grip | `docs/handoff/MIKAGE_ZENITH_BLADE_SPEC_V1.md` | 81 | ✅ VERIFIED | `55937e4439ee2eeea9cbec2405b41d3105cc42b0b41c5da587037fcc796f0acb` |
| §2.2 hub as interface | `docs/handoff/MIKAGE_ZENITH_BLADE_SPEC_V1.md` | 84 | ✅ VERIFIED | `55937e4439ee2eeea9cbec2405b41d3105cc42b0b41c5da587037fcc796f0acb` |
| §2.2 hub/handle axis = grip, terminating member | `renders/board_v1_evidence/run_out3_v3.py` · `RUN_LOG_out3_v3.log` | 32 · layers[5] | ✅ VERIFIED | `b0e61cfa3af8623e89296b44e05442bfa28bccea75d55e727b03fbcc297b5094` · `be9eeafa57bf3fc4a37993167a3377a489f50a33470e02bac30276ca3797979d` |
| §2.2/§3 hub/handle axis as ANCHOR | `ZENITH_BLADE_FINAL_DESIGN_BOARD_V1.md` | 84 | ⚠ **DIVERGENCE — NOT ADOPTED.** Board MD says "Anchors" for both; OUT3 legend tags only `chassis / spine`. Legend governs; board wording UNCONFIRMED — **superseded by operator ruling R3, 2026-08-07** | `30471b4e61a70513e2cc64eb0149ddd7770c61b4236193d27159f77f8e273179` |
| §3 ANCHOR = chassis/spine only | `renders/board_v1_evidence/run_out3_v3.py` · `RUN_LOG_out3_v3.log` | 32 · layers[4] | ✅ VERIFIED — sole ANCHOR-tagged layer | `b0e61cfa3af8623e89296b44e05442bfa28bccea75d55e727b03fbcc297b5094` · `be9eeafa57bf3fc4a37993167a3377a489f50a33470e02bac30276ca3797979d` |
| §2.3 shell grouping (measured) | `renders/board_v1_evidence/run_out3_v3.py` · `RUN_LOG_out3_v3.log` | 30–31 · 28–31 | ✅ VERIFIED | `b0e61cfa3af8623e89296b44e05442bfa28bccea75d55e727b03fbcc297b5094` · `be9eeafa57bf3fc4a37993167a3377a489f50a33470e02bac30276ca3797979d` |
| §2.3 shell asymmetry deliberate | `ZENITH_BLADE_CANON_LOCK_V1_ERRATA_01.md` | 28–29, 40 | ✅ VERIFIED | `ad30196a92cd7003e1381b3a5325a27a495b30784aa67a072bd70452b96448a2` |
| §2.3 D3 asymmetry ruling | `ZENITH_BLADE_MATERIAL_CANON_V1.md` | 176 | ✅ VERIFIED | `5b4c04f3777fa3685c5d47134b016a957f48bcd56f5e4ed00d874f5d926e2d20` |
| §2.3 force division per Design Bible | `ZENITH_BLADE_DESIGN_BIBLE_V1.md` | 47 | ❌ **CITATION UNVERIFIED** — states "two structural lobes"; no force claim — **superseded by operator ruling R2, 2026-08-07** | `4b0a850ea1518b405bd1ab9c9474486a8fbd6eee0567681b4918885263858bef`  |
| §2.3 force division per panel 7 | `renders/board_v1_evidence/OUT2_CORE_SPINE_SECTION_ANNOTATED.png` (method: board `:72`) | 72 | ❌ **CITATION UNVERIFIED** — "No clearance dimensions are asserted by panel 7" — **superseded by operator ruling R2, 2026-08-07** | `8a9a78881275b2b2d4664af64f3277c570c71e8057984da8991b9fd14ad89195`  |
| §2.3 material split per panel 10 | `renders/board_v1_evidence/pass_03/HC_wireframe_material_proof.png` | panel 10 | ⚠ PARTIAL — supports material split, not force behaviour — **superseded by operator ruling R2, 2026-08-07** | `e90e5ff28fe6e4940d80da85cc32b0bdf19d2428745cc462802f79d65bcbfa0d`  |
| §2.4 P3 not primary load-bearing | `renders/board_v1_evidence/run_out3_v3.py` · `RUN_LOG_out3_v3.log` | 33 · 122 | ✅ VERIFIED (verbatim) | `b0e61cfa3af8623e89296b44e05442bfa28bccea75d55e727b03fbcc297b5094` · `be9eeafa57bf3fc4a37993167a3377a489f50a33470e02bac30276ca3797979d` |
| §2.4 per "panel 8 label" | `ZENITH_BLADE_FINAL_DESIGN_BOARD_V1.md` | 51 | ❌ **CITATION UNVERIFIED** — panel-8 label is "LOAD-PATH EVIDENCE DIAGRAM…" — **location corrected; claim stands on the OUT3 legend** | `30471b4e61a70513e2cc64eb0149ddd7770c61b4236193d27159f77f8e273179`  |
| §3 six-step load path + isolated core | `renders/board_v1_evidence/run_out3_v3.py` · `RUN_LOG_out3_v3.log` | 31–33 · 66–122 | ✅ VERIFIED (7 legend entries: 6 path + 1 isolated) | `b0e61cfa3af8623e89296b44e05442bfa28bccea75d55e727b03fbcc297b5094` · `be9eeafa57bf3fc4a37993167a3377a489f50a33470e02bac30276ca3797979d` |
| §3 explode method constraints | `ZENITH_BLADE_FINAL_DESIGN_BOARD_V1.md` | 80–84 | ✅ VERIFIED | `30471b4e61a70513e2cc64eb0149ddd7770c61b4236193d27159f77f8e273179` |
| §4.1 eight historical poses | `…_MITTEN_INTERFACE_CORRECTION_V0_89_PROOF.md` | 32–45 | ✅ VERIFIED — all eight named | `d1f37d0541bf7e7877c2256ada06204cc43cc1c0428bd6b0579f0600e5a63c97` |
| §4.1 pose_validation records | `…_MITTEN_INTERFACE_CORRECTION_V0_89_REPORT.json` | `pose_validation` | ✅ VERIFIED — 9 keys × P1/P2/P3 | `9c3b54c233cd2617fa2ab3b825dbe096e676c984a180252135be64cea45d5fdb` |
| §4 POSE_04 render-QA gate | `renders/board_v1_evidence/OUT1_CORE_GATE.json` | whole file | ✅ VERIFIED — 0.5005 % measured, ≤5 % gate | `60cc44e78e090f604de9006d615fdd3ef26e9ebdc672b46e7910b14a571ebe89` |
| §4.1 V0.89 does not transfer to CE15 | `ZENITH_BLADE_FINAL_DESIGN_OPERATOR_RULING.md` | 77 (dual-lineage rule 5) | ✅ VERIFIED | `033858de1214e1427c3c3b9ee5548c765d275d382c1230c9b465033752affadd` |
| §6 actor-reference state | `ZENITH_BLADE_FINAL_DESIGN_BOARD_V1.md` | 125–133 | ✅ VERIFIED | `30471b4e61a70513e2cc64eb0149ddd7770c61b4236193d27159f77f8e273179` |

**Summary at draft time: 17 VERIFIED · 6 CITATION UNVERIFIED · 1 PARTIAL · 1 DIVERGENCE NOT ADOPTED.**

**Summary after issue (2026-08-07):** the six CITATION UNVERIFIED rows and the PARTIAL row are
**superseded by operator rulings R1 / R2**; the DIVERGENCE row is **resolved by R3**. All are
**retained above as historical record and none was deleted** — the rules now stand on the operator's
rulings, not on the failed citations. The 17 VERIFIED rows are unaffected.
No unverified citation was dropped or substituted; each is marked in place at the rule it was
offered for.

---

**STATUS: APPROVED — Operator (BOOS BỚP) · Ruled & Signed 2026-08-07.** In force as animation law and collision-gate input.
Grants no canon lock, no asset lock and no production-ready status — see the guard lines above.
Collision testing remains BLOCKED (§6). No commit, no push.
