# OPERATOR RULING — POSE ENCODING GAP RULING V1

```
STATUS:     PENDING HUMAN DECISIONS — NOTHING BELOW IS FILLED IN
ASSET:      Zenith Blade CE15
FIXTURE:    Actor V0.89 collision harness
DATE:       2026-08-07
```

> **ASSET LOCK: NOT ISSUED · PRODUCTION READY: NOT ISSUED.** Matrix **0 / 15**.
> This is a **decision form**, not a proposal. Every field below is a gap that **no signed source
> answers**. Claude Code filled in **none** of them. Where a recommendation appears it is labelled
> with whose recommendation it is.

**Already settled — do not reopen here** (`MIKAGE_COLLISION_BRIDGE_RULING.md`, signed 2026-08-07):
P1/P2/P3 ↔ frame mapping · Zone 5 applicability (whole zone: N/A at P1/P2, REQUIRED at P3) ·
Zone 3 out of the collision metric · `NOT_APPLICABLE` vs `UNMEASURABLE` · measurement vocabulary ·
figure state-tagging · `DUAL_ANCHOR_PIN` semantics.

**Binding on every pose below** (doctrine §2, already ruled): §2.1 vertical carry, termination down,
at the hip · §2.2 hub/handle = primary GRIP, chassis/spine = the only ANCHOR · §2.3 porcelain
cutting mass (`ZB45_SHELL_LL`/`UL`) **leads**, graphite (`ZB45_SHELL_LR`/`UR`) **bears** · §2.4 no
pose may route force through `ZB42_P3_SINGLE_RECESSED_CORE` · §6.2 no mass-derived wording.

---

## 0 · FIXTURE COVERAGE — what the gates have and have not proven

| Region | Bind map | Articulation proven | Isolation proven |
|---|---|---|---|
| `hand.R` | ✅ 3 render-enabled meshes | ✅ 0.342973 – 0.364243 m @ 30° | ✅ 3.58e-07 m |
| `head` | ✅ 8 meshes | ⚠ measured, but only pre-neutral-fix | ❌ |
| `hand.L` | ✅ 3 meshes | ⚠ measured pre-fix | ❌ |
| `spine_01` / `pelvis` (torso) | ✅ 5 meshes | ❌ | ❌ |
| `upper_arm.L/R`, `clavicle.L/R` | ✅ 4 meshes | ❌ | ❌ |
| **legs** (`thigh`, `shin`, `foot`, `toe`) | ❌ **no mesh mapped to any leg bone** | ❌ | ❌ |

> **Read this before answering POSE_02.** The current 26-mesh bind map assigns **no actor mesh to any
> leg bone**. A pose requiring a "leading leg" cannot be encoded until the bind map is extended and
> that region passes its own articulation/isolation gate.

---

## 1 · ZONE 3 — SHOULDER AMPLITUDE GATE

Classified in the Bridge Ruling as an articulation gate with no collision-pair metric. Undefined
here means it **blocks** the poses that need it.

> **DECIDED — operator, 2026-08-07. Blocking set 01.**

```
CLASSIFICATION:        ARTICULATION GATE
COLLISION_PAIR_METRIC: NONE
QUANTITY:              relative shoulder-joint angular displacement, in degrees
```

Measure **each side independently**, as the change from the baked constrained-neutral of:

- `upper_arm.L` **relative to** `clavicle.L`
- `upper_arm.R` **relative to** `clavicle.R`

> **Do not** use world-space or armature-space upper-arm rotation alone. Torso motion would be
> misreported as shoulder-joint amplitude. **Do not** collapse the two sides into `max(L, R)` —
> that discards which shoulder moved.

Each applicable pose must carry a **human-signed target amplitude for each relevant shoulder**.

```
TARGET REPRODUCTION TOLERANCE:  ±0.5°

PASS (per shoulder):  abs(measured_angle_deg - signed_target_angle_deg) <= 0.5°
```

A shoulder required to remain **isolated** uses a signed target of `0°` and the same tolerance —
one rule covers both cases.

```
IF an applicable shoulder has no signed target angle:
    ZONE_3 = UNDEFINED
    POSE   = BLOCKED (may not advance to matrix execution)
```

The angle is **never** inferred from a render. Zone 3 never contributes to `overlap pair count`.

---

## 2 · POSE_01 `CHASSIS_GUARD`

Signed prose: *"Blade raised across the body, chassis/spine side presented outward; hub/handle axis
held at the gauntlet; cutting mass angled away from the actor's centre line."*

```
BLADE STATE(S) TO TEST:        P1 [ ]   P2 [ ]   P3 [ ]
BONES PERMITTED TO MOVE:       ____________________
BONES/REGIONS REQUIRED STATIC: ____________________
"RAISED ACROSS THE BODY" =     ____________________   (angle, axis, height — measurable)
"AT THE GAUNTLET" =            ____________________   (which landmark contacts which)
"ANGLED AWAY FROM CENTRE" =    ____________________   (angle from actor centre line)
LANDMARKS + TOLERANCE:         ____________________
REJECT CONDITIONS:             ____________________
```

---

## 3 · POSE_02 `CUTTING_MASS_SLAM`

Signed prose: *"Downward committed arc leading with the porcelain cutting mass… chassis side
trailing as the bearing member; termination travels through the actor's forward arc."*
Extra zone: *"swept-volume clearance of the cutting mass against the actor's leading leg and forearm
at maximum extension."*

**Structural decision first — this row is written as motion; METHOD_V1 measures statics.**

```
POSE_02_MATRIX_STATE       = terminal / maximum-extension static state
POSE_02_ARC_CLEARANCE_GATE = separate pre-matrix sampled-path gate
```

*(This split is the operator's own proposal, 2026-08-07 — confirm or replace.)*
Sampled-arc results may be reported as **"sampled arc clearance"**, never as *"swept volume
measured"*. Each sample is a static triangle check. Samples are a pre-matrix gate and do **not**
expand the matrix beyond 15 cells.

```
CONFIRM THE SPLIT:             yes [ ]   no [ ]   replace with: ____________________
LEADING LEG =                  left [ ]   right [ ]
FOREARM IN SWEEP TEST =        left [ ]   right [ ]   both [ ]
ARC START / END:               ____________________
NUMBER OF SAMPLES N:           ____________________
"MAXIMUM EXTENSION" =          ____________________   (measurable definition)
BLADE STATE(S):                P1 [ ]   P2 [ ]   P3 [ ]
BONES PERMITTED TO MOVE:       ____________________
BONES/REGIONS REQUIRED STATIC: ____________________
LANDMARKS + TOLERANCE:         ____________________
```

### 3.1 · LEG BIND MAP EXTENSION — **APPROVED, CONDITIONAL**

> **DECIDED — operator, 2026-08-07. Blocking set 01.**

Approval is limited to a **temporary collision-fixture preflight**. The existing 26-mesh fixture
establishes **no** leg mapping. Before POSE_02 may be encoded, the harness shall audit the
render-enabled lower-body geometry and determine whether existing V0.89 geometry can be mapped
**truthfully** to the left/right leg chains.

**Permitted:** identify existing render-enabled leg geometry · add **temporary** fixture mappings
where anatomically separable geometry **already exists** · preserve world transforms · test direct
pose-bone articulation, isolation and reset reproducibility.

**Forbidden without a separate ruling:** editing or saving V0.89 · splitting, cutting or remodeling
actor geometry · inventing replacement leg geometry · **using a primitive proxy as actor leg
evidence**.

Every newly mapped leg region must satisfy:

```
baseline / bind / reset drift      <= 0.00001 m
driven displacement                >= 0.005 m   when deliberately articulated
unrelated displacement             <= 0.00001 m
```

**Stop condition.** If no sufficiently separable render-enabled leg geometry exists, return

```
LEG_GEOMETRY_NOT_SEPARABLE
```

and **POSE_02 stays BLOCKED**, pending a new ruling. Do not map lower-body mass to `thigh`/`shin`
merely because it is the lowest geometry available — that would be an invented anatomy.

> ### PREFLIGHT RUN 2026-08-07 — STOP CONDITION RETURNED
>
> ```
> LEG_GEOMETRY_NOT_SEPARABLE
> POSE_02 = BLOCKED
> ```
>
> `MIKAGE_CE15_LEG_FIXTURE_EXTENSION_PREFLIGHT.md`. All **25** render-enabled actor meshes are
> **single-island**; **none** is named as leg geometry; the entire actor below `z ≈ 0.044 m` is
> **one centred mesh** (`A2_proportion_longline_lower_void_mass_extension`, 1 island, `cx = −0.000`).
> The 23-bone scaffold **does** carry a laterally separated leg chain — the rig has legs, the mesh
> does not. Neutral drift 4.89e-07 m. No mapping added, nothing saved.
>
> **A new operator decision is required before POSE_02 can advance.** Four options are set out in
> §5 of the preflight report (L1 leg clearance out of scope · L2 treat the void mass as the lower
> body · L3 authorise real leg geometry · L4 run a 4×3 matrix). **None is recommended by the agent
> and none may be taken without a ruling.**

### 3.2 · POSE_02 — LOWER-BODY CLEARANCE SUBSTITUTION

> **DECIDED — operator, 2026-08-07. Option L2.** L1, L3 and L4 rejected: L1 discards part of
> POSE_02's clearance intent; L3 turns the collision campaign into an actor remodel; L4 breaks the
> 5-row structure locked by ERRATA_01.

`LEG_GEOMETRY_NOT_SEPARABLE` is **accepted as a truthful finding** for the V0.89 collision fixture.
The actor contains no separable left/right leg geometry that can be bound to `thigh` / `shin` chains
without modifying or inventing anatomy.

Therefore, **for the CE15 collision campaign only**:

> The doctrine phrase *"clearance against the actor's **leading leg**"* shall be **operationalized as
> clearance against the actor's existing render-enabled lower-body silhouette geometry.**

Applicable geometry: **`A2_proportion_longline_lower_void_mass_extension`**, which **remains bound to
`pelvis`** as in the existing 26-mesh fixture. No new binding is created.

**This ruling does NOT declare that mesh to be a leg.** It does not:

- create left/right leg anatomy;
- redefine V0.89 character anatomy;
- authorize a leg proxy;
- authorize geometry splitting or remodeling;
- authorize binding the lower void mass to a `thigh`, `shin`, `foot` or `toe` bone;
- modify the signed doctrine wording.

**Downstream naming — mandatory:**

```
POSE_02_LOWER_BODY_SILHOUETTE_CLEARANCE
```

The historical doctrine phrase *"leading leg clearance"* may be cited **only** as the source
requirement, and must be followed immediately by the fixture substitution ruled here.

**Sampled-arc pre-matrix gate** shall test the porcelain cutting mass against:

1. the signed forearm selection; **and**
2. `A2_proportion_longline_lower_void_mass_extension`.

**No leg articulation gate is required**, because no independently articulable leg geometry exists in
V0.89. The lower-body mesh remains part of the actor collision set and is measured by the same
triangle-intersection method as all other actor geometry.

> `LEG_GEOMETRY_NOT_SEPARABLE` is a **resolved fixture limitation**. It is **not** a collision PASS,
> and **not** evidence that leg clearance was measured literally.

**POSE_02 remains BLOCKED** until its remaining operator fields are decided — see §3 above:
forearm selection · terminal / max-extension definition · arc start/end · sample count · blade state ·
permitted bones · isolation set · landmarks and tolerances.

---

## 4 · POSE_03 `DUAL_ANCHOR_PIN`

Signed prose: *"Both anchors loaded simultaneously — chassis/spine braced, hub/handle axis driven —
with the Blade pinned across a static contact."*
**Semantics bound by R3** (Bridge §E): chassis/spine anchor **+** hub/handle primary grip. The
phrase *"both anchors"* is forbidden in all downstream text. The identifier is not renamed.

### 4.1 `STATIC_CONTACT_FIXTURE_01` — does not exist yet

> **DECIDED — operator, 2026-08-07. Blocking set 01: OUTSIDE the actor↔blade collision set.**

Rationale, recorded: if the fixture were inside the overlap set, **the very contact POSE_03 requires
would register as a false collision.**

```
actor  ↔ blade           →  collision matrix        (overlap pair count)
blade  ↔ static fixture  →  pose / contact landmark gate   (NOT a collision metric)
```

`STATIC_CONTACT_FIXTURE_01` is a **measurement fixture only**. It shall be:

- world-anchored;
- **non-canon** as an environment / world object;
- absent from production rendering;
- reproducibly defined by transform and dimensions stored in JSON.

Its geometry **shall not contribute to**: actor↔blade `overlap pair count` · per-zone actor↔blade
pair counts · PASS/FAIL collision totals.

The required Blade↔fixture relationship is verified by a **separately defined pose/contact landmark
gate**. **An intended contact with this fixture is not an actor↔blade collision.**

Still to be set by the operator:

```
GEOMETRY TYPE:            ____________________   (plane? block? cylinder?)
DIMENSIONS:               ____________________
WORLD TRANSFORM:          ____________________   (position + orientation — operator sets, not the agent)
LANDMARK GATE DEFINITION: ____________________   (what proves the pin, and to what tolerance)
```

### 4.2 Pose

```
BLADE STATE(S):                P1 [ ]   P2 [ ]   P3 [ ]
BRACE GEOMETRY (chassis/spine): ____________________
DRIVE DIRECTION (hub/handle):   ____________________
BONES PERMITTED TO MOVE:       ____________________
BONES/REGIONS REQUIRED STATIC: ____________________
LANDMARKS + TOLERANCE:         ____________________
```

---

## 5 · POSE_04 `P3_SIGNAL_DISCHARGE`

Signed prose describes the **blade only**: *"Blade at full P3 extension, core exposed through the
spine notch."* No actor pose is specified anywhere.

Hard limits already ruled: discharge mechanics are **NARRATIVE — PROPOSED**, nothing is a physical
claim; the collision test is **STATIC GEOMETRY ONLY** — no dynamic, particle, force or simulation
test is authorised.

```
ACTOR POSE = baked constrained-neutral      confirm [ ]   or specify: ____________________
```

> **Operator's own recommendation, 2026-08-07**, on the grounds that the signed prose constrains only
> the blade and inventing an actor pose would be unnecessary. **This must be recorded as a new
> operator decision — it may not be written as "doctrine says neutral".** Doctrine says nothing.

```
BLADE STATE:                   P3 (fixed by the signed prose — core exposed)
BONES PERMITTED TO MOVE:       ____________________
BONES/REGIONS REQUIRED STATIC: ____________________
LANDMARKS + TOLERANCE:         ____________________
```

Zone 5 is `REQUIRED` at P3 and is the primary gate for this pose.

---

## 6 · ROW 0 `neutral`

No decision required. Defined by `MIKAGE_COLLISION_FIXTURE_NEUTRAL_RULING.md` (signed): the baked
constrained-neutral. Its historical 0-overlap result covers neutral only and **does not transfer to
CE15** — it must be re-proven.

---

## 7 · WHAT HAPPENS AFTER THIS RULING IS SIGNED

Encoding may begin. It may **not** include a collision run.

```
1. capture constrained-neutral (constraints LIVE)   4. verify neutral fidelity
2. mute all 15 constraints                          5. bind 26 meshes
3. reconstruct into matrix_basis, parent-first      6. encode each pose, export JSON
7. reset and re-run each JSON to prove reproducibility
8. proof render + landmark measurement per pose
9. articulation / isolation gates for EVERY moving region
```

Per pose: `POSE_ID.json` · `POSE_ID_landmarks.json` · `POSE_ID_validation.json` · `POSE_ID_proof.png`

Matrix stays **0 / 15** through all of it.

---

## Signature

```
Operator name:       ____________________
Operator signature:  ____________________
Signed date:         ____________________
```

*Unsigned decision form. No pose defined, encoded or approved. No collision run. No asset lock.*
