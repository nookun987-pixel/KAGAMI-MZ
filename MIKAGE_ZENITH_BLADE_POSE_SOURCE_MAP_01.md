# MIKAGE — ZENITH BLADE POSE SOURCE MAP 01

**Task:** Giai đoạn 1 · **Date:** 2026-08-07 · **By:** Claude Code
**Method:** read-only extraction. No Blender opened. No pose encoded. No pose renamed. No ambiguity resolved.

> **ASSET LOCK: NOT ISSUED · PRODUCTION READY: NOT ISSUED.** This document defines nothing. It
> extracts what signed sources already say and marks, precisely, what they do not. Matrix: **0 / 15**.

**Authority for the five rows:** `ZENITH_BLADE_OPERATION_DOCTRINE_V1_ERRATA_01.md` §2.
The 13-row table at `ZENITH_BLADE_OPERATION_DOCTRINE_V1.md` §4.1 is **superseded** — not cited here.

---

## 1. CONSTRAINTS THAT BIND EVERY ROW

Extracted verbatim from doctrine §2. These are already ruled; they are **not** operator gaps.

| § | Rule | Status |
|---|---|---|
| **2.1** | **"Vertical carry, termination down."** at the hip. The wording *"point-down"* is **retired permanently** — CE15 has no point. | RULED **R1**, basis `SPEC_V1:113` |
| **2.2** | Primary grip = **hub / handle axis**. No wrapped/leather grip, no crossguard, no pommel. The hub/handle axis is the primary **GRIP**, *not* an anchor. **ANCHOR = chassis / spine ONLY.** | RULED **R3** |
| **2.3** | The two sides are **not interchangeable**. Porcelain `ZB45_SHELL_LL` + `ZB45_SHELL_UL` = **cutting mass, leads**. Z-Blue graphite `ZB45_SHELL_LR` + `ZB45_SHELL_UR` = **bearing roots, bears**. Governs pose and motion authoring. | RULED **R2** — operational law |
| **2.4** | P3 core is a **signal**. *"No pose, motion, contact or load may route force through `ZB42_P3_SINGLE_RECESSED_CORE`. It stays at the spine."* Verbatim wording is **"NOT PRIMARY LOAD-BEARING MEMBER"** — **do not upgrade** to "non-load-bearing". | RULED |
| **6.2** | No **"heavy" / "light" / "massive"** or any mass-derived wording in any pose description, animation note or gate report. `PHYSICAL_VOLUME_EXACT_VALUE` **NOT VERIFIED**. | RULED |

---

## 2. THE FIVE ROWS

| # | Pose | Origin | Doctrine status |
|---|---|---|---|
| 0 | `neutral` | V0.89 baseline | must be re-proven on CE15 |
| 1 | `POSE_01 CHASSIS_GUARD` | doctrine §4 | **PROPOSED — never tested** |
| 2 | `POSE_02 CUTTING_MASS_SLAM` | doctrine §4 | **PROPOSED — never tested** |
| 3 | `POSE_03 DUAL_ANCHOR_PIN` | doctrine §4 | **PROPOSED — never tested** |
| 4 | `POSE_04 P3_SIGNAL_DISCHARGE` | doctrine §4 | **PROPOSED — static geometry only** |

---

## 3. PER-POSE EXTRACTION

### ROW 0 — `neutral`

- **Authoritative prose:** none in §4. Defined operationally by the signed fixture ruling.
- **Blade relationship:** §2.1 vertical carry, termination down, at the hip.
- **Collision zones:** all four METHOD_V1 §2.6 zones.
- **Explicit requirement:** the fixture neutral is the **baked constrained-neutral**
  (`MIKAGE_COLLISION_FIXTURE_NEUTRAL_RULING.md`, signed 2026-08-07), **not** the armature rest pose.
- **Operator gaps:** none for the pose itself. Its historical 0-overlap result covers **neutral only**
  and **does not transfer to CE15** (dual-lineage rule 5) — it must be re-proven.

### ROW 1 — `POSE_01 CHASSIS_GUARD`

- **Authoritative prose (verbatim §4):** *"Blade raised across the body, chassis/spine side presented
  outward; hub/handle axis held at the gauntlet; cutting mass angled away from the actor's centre line."*
- **Blade relationship:** chassis/spine **outward**; hub/handle at the gauntlet; cutting mass angled
  **away** from centre line. Consistent with §2.2 (grip at hub) and §2.3 (graphite bears).
- **Collision zones:** the canonical five (§4). This pose is the zone template all others inherit.
- **Operator gaps:** ❌ which bones move · ❌ "raised across the body" — no angle, no height, no side
  · ❌ "at the gauntlet" — no contact landmark · ❌ isolation set · ❌ tolerance · ❌ blade state.

### ROW 2 — `POSE_02 CUTTING_MASS_SLAM`

- **Authoritative prose (verbatim §4):** *"Downward committed arc leading with the porcelain cutting
  mass (`ZB45_SHELL_LL` / `ZB45_SHELL_UL`); chassis side trailing as the bearing member; termination
  travels through the actor's forward arc."*
- **Blade relationship:** cutting mass **leads**, chassis **trails** — direct application of §2.3 R2.
- **Collision zones:** the five, **plus** *"swept-volume clearance of the cutting mass against the
  actor's leading leg and forearm at maximum extension."*
- **Operator gaps:** ❌ **which leg is the "leading leg"** and **which forearm** · ❌ arc start/end
  angles · ❌ "maximum extension" not defined as a measurable state · ❌ isolation set · ❌ landmarks.
- ⚠ **Structural gap — this row is written as motion, the standard measures statics.** METHOD_V1
  measures triangle intersection **per pose**, not swept volume. Reducing "swept-volume clearance"
  to a single max-extension static pose is a **decision**, not a reading. It requires a ruling.
- ⚠ **Fixture gap.** Leg and forearm regions have **no articulation/isolation proof**. PRE-D0b proved
  `hand.R` only.

### ROW 3 — `POSE_03 DUAL_ANCHOR_PIN`

- **Authoritative prose (verbatim §4):** *"Both anchors loaded simultaneously — chassis/spine braced,
  hub/handle axis driven — with the Blade pinned across a static contact. Tests the two-anchor
  condition recorded in §2.2."*
- **Collision zones:** the five, *"with emphasis on 2 and 4: simultaneous chassis and hub contact
  must not produce a novel collision pair."*
- **Operator gaps:** ❌ **the "static contact" object does not exist in the fixture** · ❌ brace angle
  · ❌ drive direction · ❌ isolation set · ❌ landmarks.
- ⚠ **Terminology conflict to resolve, not to smooth over.** The prose says *"both **anchors**"* and
  names the hub/handle axis as one of them. **§2.2 R3 rules the opposite:** *"ANCHOR = chassis /
  spine ONLY; the hub / handle axis is the primary GRIP, not an ANCHOR."* Two signed sentences, one
  contradiction. R3 is the later ruling and should govern, but **the pose name itself
  (`DUAL_ANCHOR_PIN`) encodes the superseded reading.** Operator must rule which stands. Do not
  rename the pose — the name is in signed evidence.

### ROW 4 — `POSE_04 P3_SIGNAL_DISCHARGE`

- **Authoritative prose (verbatim §4):** *"Blade at full P3 extension, core exposed through the spine notch."*
- **Blade relationship:** full **P3** extension — the **only** row whose blade state is specified.
- **Collision zones:** the five; *"Zone 5 (core–spine–rails axis alignment) is the primary gate."*
- **Hard scope limits already ruled:** *"Discharge mechanics: NARRATIVE — PROPOSED… Nothing here is
  a physical claim."* · *"Collision test for POSE_04 is **STATIC GEOMETRY ONLY**. No dynamic,
  particle, force or simulation test is defined or authorised."*
- **Operator gaps:** ❌ actor pose entirely undefined — the prose describes the **blade**, not the
  actor · ❌ isolation set · ❌ landmarks.

---

## 4. ZONE → STANDARD MAPPING (and one zone that does not map)

| Doctrine §4 zone | METHOD_V1 §2.6 zone | Measurable by the standard? |
|---|---|---|
| 1 · Mitten clearance at hub axis | `mitten_hub` | ✅ |
| 2 · "Penetration volume vs actor armour" | `armour_penetration` | ✅ **as triangle-pair count only** — the word *volume* in the zone's name is legacy; METHOD_V1 §2.4 and doctrine §6.2 forbid volume/depth |
| 3 · **Shoulder-joint amplitude on V0.89 rig** | *(none)* | ❌ **NOT A COLLISION MEASUREMENT.** No METHOD_V1 zone corresponds. This is a rig-amplitude check and needs its own gate definition, or explicit removal from the collision matrix |
| 4 · Secondary contact on chassis | `chassis_secondary` | ✅ |
| 5 · Core–spine–rails axis alignment | `core_spine_rails` | ⚠ see below |

### ⚠ Zone 5 will be UNMEASURABLE in most cells

`ZB42_P3_SINGLE_RECESSED_CORE` carries **two scripted drivers**, on `hide_render` and
`hide_viewport`, both with expression **`phase != 2`** (measured, `s0_staging_inspect.json`). The
core is therefore **render-disabled at every phase except one**, and METHOD_V1 §2.1 **excludes
`hide_render = True` objects from measurement**.

Consequence: at the phases where the core is hidden, zone 5 has **no triangles on the blade side** →
METHOD_V1 §2.5: *"A check that cannot be evaluated … is **UNMEASURABLE**, never counted as a pass."*

> **RESOLVED after this document's first issue — see `MIKAGE_CE15_BLADE_STATE_MAP_D3.md`.**
> Measured: `frame 1 → blade_phase 0 → P1` · `frame 31 → blade_phase 1 → P2` ·
> `frame 61 → blade_phase 2 → P3` (core render-enabled at frame 61 only). P3 confirmed by
> render-state measurement, not by the object name.
>
> Zone 5's core member is therefore **`NOT_APPLICABLE`** at P1/P2 — the core-exposed condition does
> not exist there *by design*, which is **not** the same as UNMEASURABLE. That distinction is ruled
> in `MIKAGE_COLLISION_BRIDGE_RULING.md` §D2, so the ten cells are not falsely blocked and §2.5 is
> not weakened.
>
> **Harness constraint:** `ZB42_PHASE_CONTROL["blade_phase"]` is **linked and read-only**. Blade
> state is selected by `scene.frame_set(1|31|61)` only — never by assigning the property.

---

## 5. GAP SUMMARY — what the operator must rule

| Gap | Rows affected | Type |
|---|---|---|
| Bone / body regions permitted to move | 1, 2, 3, 4 | **Operator gap** — absent from every signed source |
| Regions required to stay isolated | 1, 2, 3, 4 | **Operator gap** |
| Angles, extents, landmarks, tolerances | 1, 2, 3, 4 | **Operator gap** |
| Blade state per row | 1, 2, 3 (row 4 = P3) | **Operator gap** |
| `STATIC_CONTACT_FIXTURE` definition | 3 | **Operator gap** — object does not exist |
| "Leading leg" / which forearm | 2 | **Operator gap** |
| Swept volume → static max-extension reduction | 2 | **Operator gap** — standard measures statics |
| `DUAL_ANCHOR_PIN` vs §2.2 R3 anchor definition | 3 | **Signed-source conflict** |
| Zone 3 has no collision measurement | all | **Standard gap** |
| Zone 5 unmeasurable where the core is hidden | up to 10 cells | **Standard gap** |
| P1/P2 as static geometric states | 10 cells | **Bridge ruling** — drafted separately |

**No gap above was filled in this pass.** Where a signed source is silent, this document says so.

---

*End of POSE SOURCE MAP 01. Read-only. No pose defined, encoded, renamed or approved.
No Blender opened. Matrix 0 / 15.*
