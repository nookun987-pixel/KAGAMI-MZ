# Zenith Blade — Engineering Project Model

> An internal engineering model reconstructed from verified evidence only. It creates no
> canon, locks nothing, and modifies no source. Every rule cites evidence; anything not
> provable is marked **UNKNOWN**.
>
> Evidence base: this model reuses the verified findings in
> [knowledge/zenith_blade_verified_knowledge.md](knowledge/zenith_blade_verified_knowledge.md)
> (built at HEAD `f233bca`, tree clean). Where a rule is cited to `run_arch02.py`, the path is
> `_tmp/zenith_blade_hero_e1_ce05/architecture02/run_arch02.py`.
>
> Evidence-grade tags: **[HASH]** proven by SHA-256; **[CODE]** proven by reading a script;
> **[GIT]** proven by git; **[DOC]** proven by a governance/report file; **[UNKNOWN]** not provable
> without opening a `.blend`, inspecting an image, or new operator input.

---

## 1. System architecture

**What the system is.** A single Blender-built hero weapon ("Zenith Blade") with a three-phase
mechanism (P1 closed / P2 opening / P3 exposed core), rigidly coupled to a character actor's right
hand. The blade is declared **FILM / RENDER-ONLY**; low-poly retopo (stage 5) and UV+bake (stage 6)
are locked out. **[DOC** handoff:40-42]

**Build model — "immutable source + disposable pass" loop.** Development does not edit a living
master file. Each controlled cycle:
1. reads one immutable source `.blend` and asserts its SHA-256 before touching anything;
2. derives geometry procedurally in `bpy` from that source;
3. forces phase frames, runs collision + hash integrity checks, renders review PNGs;
4. writes a per-pass JSON report; saves a candidate `.blend` **only** if the technical gate passes
   *and* an explicit `--save` flag is set. **[CODE** run_arch02.py:7,15-19,99,138,143-146]

**Two render surfaces, not one line:**
- **Active** — Blender/`bpy` review render: runtime ORTHO cameras, PNG 900×900, per-pass P1/P2/P3 +
  monolith front/side/hero. **[CODE** run_arch02.py:96-127]
- **Legacy/reference** — ComfyUI+RunPod image render (RealVisXL + canny ControlNet, 832×1216),
  operator-run on a pod, dated 2026-06-02. Not the current path. **[CODE** render_zenith_blade_p1p2p3.py:1-19,28-49]

**Governance architecture.** Tasks are dispatched as append-only "controlled exception" blocks in
`AGENTS.md`; that file is the single live authority. `docs/handoff/…` and `.mikage/tasks/active_task.yaml`
are secondary pointers and are currently **stale** (point at V0.89 while HEAD dispatches Architecture02).
**[GIT** last 5 commits touch only AGENTS.md] **[DOC** handoff:51 vs `git show f233bca`]

**Current stage.** `CE_ZENITH_BLADE_ARCHITECTURE_02 = OPEN`, run to `CLOSED_EXHAUSTED_10_PASSES`:
technically clean passes existed (7–10) but every pass failed the operator visual gate; **no candidate
`.blend` was saved**; source hash unchanged. **[DOC** ARCHITECTURE_02_RESULT.md] **[HASH** Form02 unchanged]

---

## 2. Dependency graph

Object roster and edges are literal constants in `run_arch02.py:9-11,102-112`. Roles are as labelled;
internal mesh correctness is **[UNKNOWN]** (no blend opened).

```
IMMUTABLE SOURCE (untracked, _tmp):
  Form02  250352AB…FAE29  ── derived from ──▶  git-tracked root CE01  DEE257…B762
        │
        │ every Arch pass re-reads Form02 and asserts its hash first  [CODE run_arch02.py:7,99]
        ▼
PROTECTED CORE (locked, load-bearing) [CODE run_arch02.py:10]
  ZB42_CENTRAL_LOAD_SPINE ──┐
  ZB42_P3_SINGLE_RECESSED_CORE (the one P3 core) ──┤ material donor for carrier/neck
  ZB46_DRIVE_HUB ( + ZB46_FLUX_BASE ref line 120)  ─┤ [CODE :84,111-112,120]
  ZB48_HANDLE_REGISTERED_TO_HAND_MARKER ───────────┘
        │ registration
        ▼
ACTOR COUPLING (locked) [CODE :10,99]
  A2_right_porcelain_mitten_hand_attached_read
  hand_right_sword_hold_marker (in transform-lock set)

EDITABLE SHELLS (Arch02 target) [CODE :9]
  ZB45_SHELL_LL / LR / UL / UR
        ▲ derived by polygon clip from…
  ZB_ARCH02_MONOLITH_PREVIEW  (built from MONO polygon)  [CODE :101-108]

ARCH02-INTRODUCED (editable) [CODE :11,111-112]
  ZB_ARCH02_HIERARCHICAL_CHASSIS (carrier)  — material donor: CENTRAL_LOAD_SPINE
  ZB_ARCH02_HUB_NECK (neck)                 — material donor: CENTRAL_LOAD_SPINE
  ZB_ARCH02_P1_CLOSURE_SKIN (declared constant; creation NOT proven) [UNKNOWN]
```

Key edges (all **[CODE]**):
- Shells **derive from** the monolith preview (`derive()` clip, :104-108) — monolithic-first.
- Shells **inherit materials from** existing shell/source objects (`setmesh`/`newobj`, :58-59,82-83).
- Collision graph: {4 shells, carrier, neck} tested pairwise + against every PROTECTED object at P1/P2/P3
  (:132-135).
- Registration: handle → hand marker → actor mitten (names encode the chain; geometric proof **[UNKNOWN]**).

---

## 3. Immutable rules (must never change without a new operator exception)

Each cites its authority. "Locked" = editing it fails the technical gate or violates the dispatch.

**I1. The immutable source must not change.** Every pass asserts `source_before == EXPECTED` and re-hashes
after (`technical` includes `source_before==EXPECTED`). **[CODE** run_arch02.py:7,138,145] **[HASH** 250352AB…FAE29]

**I2. Protected objects' geometry is frozen** — spine, core, drive hub, handle, mitten. Enforced by
per-object mesh hash `h0==h1`. **[CODE** :10,20-25,138] Reinforced by AGENTS.md "Locked without exception:
source central spine, drive hub body, rails, grip, handle, marker and core object." **[DOC** AGENTS.md Arch02 block]

**I3. Transforms/registration are frozen** — parent, location, rotation, scale of all shells + protected +
`hand_right_sword_hold_marker` (`t0==t1`). **[CODE** :30,99,138]

**I4. Phase timing/actions are frozen** (P1=1, P2=31, P3=61 and existing object actions). Arch02 may not
author new phase motion. **[CODE** :11] **[DOC** AGENTS.md "existing object actions, phase frame timing … Locked"]
→ This is the specific lock Architecture03 must have lifted (see §7).

**I5. Core signal contract: OFF / OFF / ON.** Core hidden in P1 & P2, visible only in P3; exactly one
recessed centerline core, no added core. **[CODE** :136,138 (`core=={'P1':False,'P2':False,'P3':True}`)]
**[DOC** FORM02_PROOF.md:37-39]

**I6. Carrier phase contract: OFF / ON / ON** (concealed P1, visible P2/P3), deterministic. **[CODE** :137,138]

**I7. Exactly four final plates.** **[DOC** AGENTS.md "exactly four final plates"] — plate identity is fixed;
their topology is variable (see V2).

**I8. Zero novel physical collision at P1/P2/P3.** No new object-pair overlaps vs the locked baseline.
**[CODE** :130-135,138] **[DOC** ARCHITECTURE_02_RESULT.md collision=0 at passes 7-10]

**I9. Color authority: violet is a signal, not a fill.** Electric violet `#8F00FF` (secondary `#7B2FFF`),
allowed only at the two sensor slits or a P3 core — never wash/halo/ambient/fill. **[DOC** CLAUDE.md palette LOCK;
AGENTS.md:96; ARCHITECTURE_02 visual-reject "violet used as wash/halo/fill"] Emission base recorded as
linear (0.33,0,1.0). **[DOC** handoff:114]

**I10. Pipeline stages 5 (retopo) & 6 (UV/bake) are locked; bevels must be real geometry.** **[DOC** handoff:41-42]

**I11. Process locks.** No push, no deploy, no canon-lock, no asset-lock, no production-ready claim; no
`.blend1` left behind; temp assets not committed. **[DOC** AGENTS.md Arch02 block; active_task.yaml forbidden_actions]

**I12. Visual authority is the operator, not the script.** The pass scripts contain no automated visual gate;
visual PASS/FAIL is an operator ruling. Proven by the Architecture01 conflict: the run self-reported
`PASS_ARCHITECTURE_CANDIDATE` but the operator closed it `VISUAL_FAIL`. **[CODE** run_arch02.py has no visual scorer]
**[DOC** ARCHITECTURE01_RESULT.json vs AGENTS.md] → **a machine "technical PASS" never implies acceptance.**

---

## 4. Variable design space (may change within a controlled cycle)

Editable geometry, per AGENTS.md Arch02 "Editable Architecture02 geometry" and `run_arch02.py`:

**V1. The monolithic construction mesh** (`MONO` polygon; only used to derive plates). **[CODE** :101] **[DOC** AGENTS.md]

**V2. The four plate meshes + their boundary topology** (subdivision, seam lines, notches — plate *count*
stays 4). **[CODE** :104-108] **[DOC** AGENTS.md]

**V3. Carrier/chassis mesh + bounded hub-neck / lower-load transition geometry.** **[CODE** :110-112] **[DOC** AGENTS.md]

**V4. Local bevels and wedge cross-sections** required for a thick armored-shell read. **[CODE** `wedge()` :49-56]
**[DOC** AGENTS.md]

**V5. Per-pass shape parameters** — cutting reach, lower belly, spine width, depth, seam slope (`CFG`, 10 rows).
**[CODE** :13]

**V6. Review-render framing** (ORTHO camera offsets, ortho_scale, 900×900). Changeable for review only; not an
asset property. **[CODE** :121-123]

Everything in §4 is bounded by §3: a variable may move only so far as it does not break an immutable gate
(e.g. plate topology may change but must still yield exactly 4 plates with zero novel collision).

---

## 5. Engineering assumptions (believed true, evidence-backed, but not absolute)

**A1. Form02 is the correct base for the next cycle.** It is the declared immutable source for both Arch01
and Arch02. **[HASH/DOC]** Assumption: no newer operator-blessed base has superseded it since 2026-08-04.
**[UNKNOWN** beyond HEAD]

**A2. "EEVEE" is the render engine of the current blends** — inferred from source filenames (`…_EEVEE_…`) only;
`run_arch02.py` does not set the engine. **[UNKNOWN** — not proven]

**A3. The four `ZB45_SHELL_*` objects are the moving "door/panel" elements** that produce the rejected
cabinet read. Consistent with the RESULT root-cause. **[DOC** ARCHITECTURE_02_RESULT.md:24-36,50-52] Assumption
that no other object contributes the bad read. **[UNKNOWN** — images not inspected]

**A4. Material inheritance preserves the locked palette.** Scripts copy materials from locked donors rather than
authoring new ones, so color authority is assumed intact. **[CODE** :58-59,82-83] Actual node values **[UNKNOWN]**.

**A5. Collision "zero" from BVH triangle-overlap is a sufficient physical-clearance proxy.** It is the project's
own definition of clearance. **[CODE** :27-29] Whether it captures all real interpenetration is **[UNKNOWN]**.

---

## 6. Unknowns (must be resolved by opening a blend, inspecting an image, or asking the operator)

- **U1.** Material node internals (roughness, emission strength, true rendered core hue). Blend not opened.
- **U2.** Actual render engine (EEVEE vs Cycles). Filename inference only. (A2)
- **U3.** Real-world blade scale, actor-hand ratio, spine deviation — the V0.89 `scale_audit` was pending; no
  confirmed numbers located.
- **U4.** Whether Architecture02's "cabinet/door" verdict is the operator's eyes-on ruling or the run's self-note
  awaiting review. **[DOC** RESULT says visual ruling "remains with the operator"]
- **U5.** Whether `ZB_ARCH02_P1_CLOSURE_SKIN` is ever instantiated (declared constant; no creation call proven).
- **U6.** Canonical P3-core color for the current line — violet `#8F00FF` vs legacy film `#E60000` (recorded
  conflict; film line is reference-only per CLAUDE.md, but the current blend's actual value is unread).
- **U7.** Geometric truth of the handle→marker→mitten registration chain (names imply it; not measured).

---

## 7. Required evidence before Architecture03

Architecture02's own closeout defines the next cycle as **architecture-level, not another shell-outline sweep**,
and states it **requires a new operator exception because phase transforms/actions are protected**. **[DOC** ARCHITECTURE_02_RESULT.md:50-60]

Prerequisites (gates that must be satisfied before a valid Architecture03 dispatch):

**E1. A new operator exception that explicitly lifts the phase-transform/action lock (I4)** for Architecture03,
and names the exact editable set. Without it, the required work is out of scope. **[DOC** RESULT:60; AGENTS.md I4]

**E2. Operator confirmation of the Architecture02 visual ruling (U4)** — is Arch02 truly rejected? This decides
whether Arch03 proceeds at all. **[DOC** RESULT ruling-pending]

**E3. Confirmed immutable base + its hash.** Reconfirm Form02 `250352AB…FAE29` is still the intended source, or
name a new one. **[HASH]**

**E4. Resolved color canon (U6/I9).** Operator states the P3-core color for the current line so Arch03 renders
on-brand.

**E5. Baseline collision + protected-fingerprint snapshot** (the `t0/h0` set) carried forward unchanged so Arch03
can prove it broke no lock. **[CODE** :99,113,138]

**E6. (Recommended, not required) reconcile the stale pointers (handoff, active_task.yaml)** so Arch03 is not
dispatched against a V0.89 task definition. **[DOC** C1; validators gate the stale yaml — C-VAL]

**Where Architecture03 must begin (design intent, from the RESULT, not an instruction to act):**
1. make a load-bearing carrier/chassis the *persistent* weapon silhouette across P1/P2/P3;
2. convert the four shells into thick interlocking armor segments that reveal the chassis without being the full
   moving silhouette;
3. integrate a mechanical neck from the locked hub into the carrier;
4. establish a protected line of sight to the existing recessed core in P3;
5. author *new bounded phase motion* for those segments (this is why E1 is mandatory).
**[DOC** ARCHITECTURE_02_RESULT.md:54-58]

---

## 8. Decision tree for future modifications

Apply top-down; the first matching branch governs. "STOP" = not permitted under the current dispatch.

```
Q0. Is the change to a tracked SSOT canon file? (§4 SoT list)
    └─ YES → STOP. Only the operator promotes canon. [DOC AGENTS.md:88-89]
    └─ NO  → Q1.

Q1. Does it push / deploy / commit temp assets / claim final-ready / asset-lock / canon-lock?
    └─ YES → STOP. Forbidden by every dispatch. [DOC I11]
    └─ NO  → Q2.

Q2. Does it touch a PROTECTED object's geometry, transform, material, or the source hash?
    (spine, core, drive hub, handle, marker, mitten, actor rig)  [I1,I2,I3]
    └─ YES → requires a NEW operator exception naming that object. Else STOP.
    └─ NO  → Q3.

Q3. Does it change phase timing or object actions (P1/P2/P3 motion)?  [I4]
    └─ YES → requires a NEW operator exception (this is the Architecture03 unlock, E1). Else STOP.
    └─ NO  → Q4.

Q4. Does it change the core (I5) or carrier (I6) phase contract, plate count≠4 (I7),
    introduce novel collision (I8), or use violet as fill (I9)?
    └─ YES → STOP. These are the standing technical/visual reject gates.
    └─ NO  → Q5.

Q5. Is it within the editable set — monolith, 4 plate topologies, carrier/neck, bevels,
    wedge cross-sections, per-pass CFG, review cameras?  [V1–V6]
    └─ YES → PERMITTED inside a controlled ten-pass cycle: restart from the immutable source each pass,
             run collision+hash+core/carrier gates, render review, save ONLY the first pass clearing
             BOTH the technical gate AND the operator visual gate; leave no .blend1.  [CODE run_arch02.py; DOC AGENTS.md]
    └─ NO  → treat as UNKNOWN scope → ask the operator before acting.

Cross-cutting rule (applies at every PERMITTED leaf):
    A machine "technical PASS" is necessary but NOT sufficient. Final acceptance is the operator's
    visual ruling. Never promote on a self-reported visual pass.  [I12; ARCHITECTURE01 conflict]
```

---

## Self-review (performed)

Reviewed every rule for an attached citation and removed/downgraded unsupported claims:
- All material node values, the render engine, scale metrics, image reads, and the `P1_CLOSURE_SKIN` instantiation
  are marked **UNKNOWN** rather than asserted (U1–U7, A2–A5) — no `.blend` was opened and no PNG/MP4 was viewed.
- No rule in §3 stands without a `[CODE]`/`[DOC]`/`[HASH]` tag.
- Recorded conflicts (color, Arch01 disposition, stale pointers) are carried as conflicts, not resolved.
- The Architecture03 "where to begin" list is quoted from the RESULT file as design intent, explicitly not an
  instruction to build.

No source, Blender file, or git state was modified to produce this model. Waiting for operator.

END OF PROJECT MODEL.
