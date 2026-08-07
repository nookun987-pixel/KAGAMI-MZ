# OPERATOR RULING — COLLISION CAMPAIGN BRIDGE

```
STATUS:     APPROVED — HUMAN SIGNED
ASSET:      Zenith Blade CE15
SCOPE:      Collision campaign only
DATE:       2026-08-07
ISSUED VIA: CE15 collision campaign, Giai đoạn 1
```

> **ASSET LOCK: NOT ISSUED · PRODUCTION READY: NOT ISSUED.** This document is **SIGNED** and in
> force for the CE15 collision campaign. It edits **no** byte-frozen document.
> Matrix state: **0 / 15**.

**Purpose.** Three blockers stand between the signed doctrine and the collision matrix. None is a
Blender problem; all three are documentation-state problems. This ruling resolves them **without
editing** `ZENITH_BLADE_OPERATION_DOCTRINE_V1.md`, which is byte-frozen and validator-checked.

---

## A · P1 / P2 ARE STATIC GEOMETRIC STATES IN THIS MATRIX

**The conflict.** Doctrine §5 states: *"This doctrine defines behaviour around P3 only"*; P1/P2 have
*"no operational semantics… no collision poses"*; **"Inventing them is forbidden"**; and any work
*"touching P1 or P2 operationally is out of scope of this document and must not cite it as
authority."* The collision matrix is 5 rows × P1/P2/P3 — **10 of 15 cells touch P1/P2.**

**Ruling.** In the collision matrix, the P1/P2/P3 axis varies **blade state geometry only**. The
actor pose of each row is **unchanged across the three columns**.

This ruling **does NOT**:

- create operational semantics for P1 or P2;
- claim Mikage fights in, carries in, or transitions through P1 or P2;
- create any additional collision pose;
- amend, reinterpret or weaken doctrine §5.

**Separation adopted:** `operational semantics` ≠ `static geometry validation`. Measuring whether
two triangles intersect while the blade is in its P1 closed-block or P2 shell-split configuration is
a **structural** measurement. It asserts nothing about how the weapon is used. Doctrine §5 governs
the former and is untouched; this ruling authorises only the latter.

**Citation rule.** No cell in the P1 or P2 columns may cite doctrine §5, §4 or any operational
section as authority for *behaviour*. Its only authority is this ruling, and only for geometry.

---

## B · MEASUREMENT VOCABULARY — TRIANGLE PAIRS ONLY

**The conflict.** `MIKAGE_COLLISION_METHOD_V1` §2.4: *"This routine measures triangle intersection,
not penetration volume"*; `PHYSICAL_VOLUME_EXACT_VALUE` remains **NOT VERIFIED**; *"No mass-, force-
or depth-derived wording may be built on it."* Doctrine §6 item 2 repeats the prohibition.

**Ruling.** The following are **struck from every collision record, report, brief and script comment**:

```
penetration            penetration depth        penetration volume
force                  mass-derived severity    "heavy" / "light" / "massive"
```

**Each matrix cell records exactly:**

| Field | Type |
|---|---|
| pose ID | string |
| pose JSON hash | sha256 |
| neutral baseline hash | sha256 |
| blade state | `P1` \| `P2` \| `P3` |
| **overlap pair count** | integer — the only collision metric |
| **exact intersecting object pairs** | list of `(actor_object, blade_object)` |
| per-zone pair counts | integer or `null` |
| proof image | path |
| reset verification | pass/fail + drift in metres |

**Legacy wording note.** Doctrine §4 collision-check **zone 2 is named** *"Penetration volume vs
actor armour"*. That name predates METHOD_V1. It is retained as an **identifier only**; the zone is
measured as `armour_penetration` triangle-pair count. The name is not a licence to report volume.

`PHYSICAL_VOLUME_EXACT_VALUE` stays in its own backlog and is untouched by this ruling.

---

## C · DOCTRINE §6 ITEM 1 — LEGACY BLOCKER SUPERSEDED

**The conflict.** Doctrine §6 item 1 marks collision testing **BLOCKED**, on the basis that no
measurable actor exists: *"non-blade meshes measure 3.450 m"*, *"the only armature is … (0.19 m
scaffold, per task brief — not re-verified)"*, *"OUT4 used a temporary 1.75 m primitive proxy,
explicitly NOT a character asset."*

**What has been measured since** (`CE15_ACTOR_COLLISION_REPROOF_04`, instance-aware per METHOD_V1 §2.3):

| Legacy basis | Measured |
|---|---|
| non-blade meshes 3.450 m | actor bbox **`[0.871986, 0.230554, 1.753685]`**, 25 render-enabled instances |
| 0.19 m scaffold (not re-verified) | armature rest height **0.853542 m**, 23 bones |
| 1.75 m primitive proxy, not a character | the measured actor **is** the V0.89 actor, not a proxy |
| — | blade Z extent **1.200000 m**; blade : actor **0.684273401** |

**Ruling.**

```
LEGACY BLOCKER REASON:  SUPERSEDED
COLLISION CAMPAIGN:     CONDITIONALLY UNBLOCKED
MATRIX EXECUTION:       STILL GATED
```

- The figures `3.450 m` / `0.19 m` / `primitive proxy` **may no longer be cited as a reason to
  block**. They were superseded by measurement, not by assertion.
- **Permitted to proceed now:** Pose Source Map, pose encoding specification, pose encoding,
  fixture validation, articulation/isolation gates.
- **Matrix execution remains GATED** until **all four** conditions hold:
  1. evidence bundle **independently verified** (31/31, by the operator, not by the producing machine);
  2. pose encoding ruling **signed**;
  3. articulation / isolation gates **PASS for every region that moves**, not `hand.R` alone;
  4. `POSE_03` **`STATIC_CONTACT_FIXTURE` defined by operator ruling**.

Doctrine §6 items 2–7 are **unaffected**. Item 2 in particular remains fully in force — see §B.

---

## D · MATRIX ZONE APPLICABILITY

### D1 · Zone 3 leaves the collision result

Doctrine §4 zone 3 is *"Shoulder-joint amplitude on V0.89 rig"*. `METHOD_V1` §2.6 has **no
corresponding collision zone**, because amplitude is not a triangle-intersection quantity.

```
ZONE_3_SHOULDER_AMPLITUDE
CLASSIFICATION:        ARTICULATION GATE
COLLISION_PAIR_METRIC: NONE
```

**Ruling.** Zone 3 runs **before** the matrix, per pose, and **only for poses that require shoulder
movement**. It contributes **nothing** to `overlap pair count`. No cell may be called a collision
PASS or FAIL on the basis of zone 3, and zone 3 may not be called a collision result. Its quantity
and tolerance are deferred to the Operator Gap Ruling; until defined it is `UNDEFINED`, and an
undefined zone 3 blocks the poses that need it — it is never silently skipped.

### D2 · Zone applicability — `NOT_APPLICABLE` is not `UNMEASURABLE`

Every matrix cell carries, per zone:

```
zone_applicability: REQUIRED | NOT_APPLICABLE
```

```
NOT_APPLICABLE  = the check does not belong to that cell, by design
UNMEASURABLE    = the check belongs to the cell but the system could not evaluate it
```

**Ruling.**

- A zone whose governing condition **does not exist by design** in a given blade state is
  `NOT_APPLICABLE`. It is neither a pass nor a failure, and it does not block the cell.
- A zone that **is** assigned but cannot be evaluated — missing geometry, fixture fault, empty side —
  is `UNMEASURABLE` per `METHOD_V1` §2.5, and **that cell may not be called a PASS**.
- Misreporting the second as the first is a **forced pass** and voids the run.

This preserves METHOD_V1 §2.5 rather than working around it: §2.5 governs checks that *belong* to a
cell, and `NOT_APPLICABLE` removes the check from the cell before §2.5 applies.

### D3 · State map — PROVEN, condition discharged

The earlier draft of this ruling required a state-map proof before P1/P2 could be marked
`NOT_APPLICABLE`. **That proof has been produced:** `MIKAGE_CE15_BLADE_STATE_MAP_D3.md`, read-only,
no render, no save.

```
frame  1  →  blade_phase 0  →  P1   core hide_render = True   (29 render-enabled blade meshes)
frame 31  →  blade_phase 1  →  P2   core hide_render = True   (29 render-enabled blade meshes)
frame 61  →  blade_phase 2  →  P3   core hide_render = False  (30 render-enabled blade meshes)
```

**Authority of the mapping — stated precisely.**

```
FRAME→STATE MAPPING: RULED BY METHOD_V1 §2.8
D3 MEASUREMENT:      CORROBORATED
P3 CORE STATE:       DIRECTLY MEASURED
```

`METHOD_V1` §2.8 already pairs `frame 1|31|61` with `P1|P2|P3` as the signed schema. That is the
authority. D3 corroborates it and, for P3, supplies a direct physical discriminator: the core is
render-enabled at frame 61 only, matching the `phase != 2` driver. The monotonic `dy` progression is
corroboration, not authority. **P1/P2 are not to be described as "weakly inferred" — they are ruled
by §2.8.**

### D3-a · Zone 5 applicability — RULED, whole zone

| State | Zone 5 (`core_spine_rails`) |
|---|---|
| P1 · frame 1 | **`NOT_APPLICABLE`** |
| P2 · frame 31 | **`NOT_APPLICABLE`** |
| P3 · frame 61 | **`REQUIRED`** |

**The zone is not split.** Zone 5's identifier is *core–spine–rails axis **alignment***. When the
core is absent from the measurement set, the three-part relationship the zone names **does not exist
as a check**. `ZB42_CENTRAL_LOAD_SPINE` and `ZB42_FUNCTIONAL_RAIL_L/R` measured on their own are
**not Zone 5**.

> **If spine/rails are ever to be checked independently, that requires a NEW gate with a NEW name.
> The identifier "Zone 5" / `core_spine_rails` may not be reused for it.** Reusing the name for a
> different measurement set is how a gate silently changes meaning between runs.

**`UNMEASURABLE` applies to Zone 5 only at P3** — the one state where it is `REQUIRED`:

```
P3 + core unexpectedly hidden   → UNMEASURABLE → cell cannot PASS
P1/P2 + core absent by design   → NOT_APPLICABLE → not a failure
```

**Harness constraint, binding on every future script.** `ZB42_PHASE_CONTROL["blade_phase"]` is
**linked and read-only**. Blade state is selected by **`scene.frame_set(1 | 31 | 61)`** only. Any
harness that attempts to assign `blade_phase` is non-conforming and its results are void.

---

## E · `DUAL_ANCHOR_PIN` — LEGACY IDENTIFIER, R3 SEMANTICS

Doctrine §4 prose for `POSE_03` says *"Both anchors loaded simultaneously… hub/handle axis driven"*,
treating the hub/handle axis as an anchor. **§2.2 ruling R3 rules the opposite** and is the later
ruling: *"ANCHOR = chassis / spine ONLY; the hub / handle axis is the primary GRIP, not an ANCHOR."*

**Ruling.**

```
POSE_03 DUAL_ANCHOR_PIN
= immutable historical pose identifier only.
```

The identifier is **not renamed** — it exists in signed evidence and renaming it would rewrite the
record. Its **semantics** follow R3:

```
ONE structural anchor:  chassis / spine
ONE primary grip:       hub / handle axis
```

**Forbidden in every report, brief, script comment and cell record:**

```
both anchors        second anchor at hub        dual load-bearing anchors
```

**Required wording:**

```
chassis/spine anchor + hub/handle primary grip
```

The pose ID, file names and JSON keys keep `DUAL_ANCHOR_PIN`. Only the prose describing what the
pose *does* is bound by R3.

---

## F · EVERY GEOMETRY FIGURE CARRIES ITS STATE

The blade bounding box is **state-dependent**: `dy` measures `0.261320` at P1 and `0.278489` at P3.
A figure quoted without its state is ambiguous, and one such pair was already flagged as a false
discrepancy between two correct reports.

**Ruling.** Every blade extent, bbox, clearance or distance figure — in any report, JSON, brief,
commit message or script comment — **must carry** `frame`, `blade_state` and `blade_phase`.

```
FORBIDDEN:  blade dy = 0.278489

REQUIRED:   blade dy = 0.278489 m
            frame       = 61
            state       = P3
            blade_phase = 2
```

A bare figure is not a measurement; it is an ambiguity waiting to be compared against the wrong state.

---

## SCOPE

This ruling is confined to the CE15 collision campaign. It does **not** define poses, name poses,
approve any pose, define bone movement or isolation, define landmarks, unblock the matrix, redefine
the armature rest pose, repair the control rig, modify V0.89 / CE15 / staging, or grant any lock.

**Settled here — do not reopen in the Gap Ruling:** P1/P2/P3 ↔ frame mapping and its authority (§D3)
· Zone 5 applicability, whole zone (§D3-a) · Zone 3 classification out of the collision metric (§D1)
· `NOT_APPLICABLE` vs `UNMEASURABLE` (§D2) · measurement vocabulary (§B) · figure state-tagging (§F) ·
`DUAL_ANCHOR_PIN` semantics (§E).

**Deferred to the Operator Gap Ruling, explicitly not settled here:** zone 3 quantity and tolerance ·
`POSE_01` bone movement, isolation set and landmarks · `POSE_02` leading leg, forearm, terminal
static state and sampled-arc gate · `POSE_03` `STATIC_CONTACT_FIXTURE`, brace/drive geometry,
bone/isolation/landmarks · `POSE_04` actor pose, isolation, landmarks.

---

## Signature

```
Operator name:       Phi Hùng
Operator signature:  Phi Hùng
Signed date:         2026-08-07
```

**How this signature was recorded.** The operator (BOOS BỚP / Phi Hùng) approved the content
"APPROVED FOR HUMAN SIGNATURE", issued the final rulings in §D3, §D3-a and §F, and gave the
signature and the `PENDING HUMAN SIGNATURE` → `APPROVED — HUMAN SIGNED` status change as an explicit
written instruction in the session of 2026-08-07. It was transcribed by Claude Code. **The decision
is the operator's; the typing is not the decision.**

**Pre-signature diff check, as required by the operator:**

| Required | Verified |
|---|---|
| §A unchanged | **byte-identical** to the pre-signature snapshot |
| §B unchanged | **byte-identical** |
| §C unchanged | **byte-identical** |
| §D added | present, incl. §D1 / §D2 / §D3 / §D3-a |
| §E added | present |
| deferred list added | present, plus a "settled here — do not reopen" list |
| no doctrine / METHOD edits | `git diff` empty on doctrine V1, ERRATA_01, METHOD_V1; validator **PASS** 22 core + 13 registry |

> **One departure from the enumerated check, flagged rather than absorbed.** The operator's §7 ruling
> — every geometry figure must carry `frame` / `blade_state` / `blade_phase` — was first drafted
> inside §B, which would have made §B differ. It was **moved out into its own §F** so §A/§B/§C remain
> byte-identical and the check passes exactly as written. **§F is new content, authorised by the
> operator's §7 in the same message.** If §F is not wanted, strike it in one line; nothing else
> depends on it.

This ruling is now **in force**. Matrix state remains **0 / 15**. The next valid task is the
**Operator Gap Ruling** answering `MIKAGE_ZENITH_BLADE_POSE_SOURCE_MAP_01.md` §5 — not encoding,
and not the matrix.

---

*End of OPERATOR RULING — COLLISION CAMPAIGN BRIDGE. Signed 2026-08-07. No byte-frozen document was edited.
No asset lock, no production claim.*
