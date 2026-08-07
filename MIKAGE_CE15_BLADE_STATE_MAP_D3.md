# MIKAGE — CE15 BLADE STATE MAP (D3 PROOF)

**Task:** `CE15_BLADE_STATE_MAP_D3` · **Date:** 2026-08-07 · **By:** Claude Code · Blender 5.1.2 headless
**Scope:** read-only. No collision. No render. No save. Staging opened read-only.

> **ASSET LOCK: NOT ISSUED · PRODUCTION READY: NOT ISSUED.** This document maps blade states.
> It certifies no pose and no asset. Matrix: **0 / 15**.

**Question answered:** which state is P1, which is P2, which is P3 — **without** inferring P3 from
the object name `ZB42_P3_SINGLE_RECESSED_CORE`.

---

## 1. HOW THE STATE IS DRIVEN — measured, not assumed

Two scripted drivers, both on `ZB42_P3_SINGLE_RECESSED_CORE` (library `ZENITH_BLADE_CE15_SOURCE.blend`):

| Owner | Data path | Expression | Variable `phase` resolves to |
|---|---|---|---|
| `ZB42_P3_SINGLE_RECESSED_CORE` | `hide_render` | `phase!=2` | `ZB42_PHASE_CONTROL` → `["blade_phase"]` |
| `ZB42_P3_SINGLE_RECESSED_CORE` | `hide_viewport` | `phase!=2` | `ZB42_PHASE_CONTROL` → `["blade_phase"]` |

> **Harness constraint — carry this into every future script.**
> `ZB42_PHASE_CONTROL` is a **linked, read-only** object (CE15 library). `blade_phase` **cannot be
> written** in the staging file. Its value reads **0** at file load. The state is therefore selected
> by **`scene.frame_set()`**, never by assigning `blade_phase`. A harness that tries to set the
> property will silently fail or raise, and a run built on that would be measuring one state three times
> — the exact false-pass shape the campaign already hit once.

This matches `MIKAGE_COLLISION_METHOD_V1` §2.8, whose output schema pairs `"phase": P1|P2|P3` with
`"frame": 1|31|61`.

---

## 2. THE MEASUREMENT

Frames 1 / 31 / 61, evaluated depsgraph, instance-aware:

| Frame | core `hide_render` | core `hide_viewport` | core present in `object_instances` | max shell centroid separation (m) | blade render-enabled extent `dx / dy / dz` | render-enabled blade meshes |
|---:|---|---|---|---:|---|---:|
| **1** | `True` | `True` | **False** | 0.408949 | `0.473372 / 0.261320 / 1.200000` | **29** |
| **31** | `True` | `True` | **False** | 0.408977 | `0.473372 / 0.267837 / 1.200000` | **29** |
| **61** | **`False`** | **`False`** | **True** | 0.415903 | `0.473372 / 0.278489 / 1.200000` | **30** |

---

## 3. STATE ASSIGNMENT

```
frame  1  →  blade_phase 0  →  P1   (Compact-Idle · core OFF)
frame 31  →  blade_phase 1  →  P2   (Brutal Industrial Activation · core OFF)
frame 61  →  blade_phase 2  →  P3   (core exposed)
```

**Basis for P3 — decisive, measured.** The core is render-enabled at **frame 61 only**, and the
driver fires on `phase != 2`; therefore frame 61 carries `blade_phase == 2`. Doctrine §5 defines P3
as the state with the core exposed and states the core is **OFF in both P1 and P2**. Frame 61 is the
only frame where the core exists as a render-enabled instance. **CONFIRMED.**

**Basis for P1 and P2 — ruled by the standard, corroborated here.**

```
FRAME→STATE MAPPING: RULED BY METHOD_V1 §2.8
D3 MEASUREMENT:      CORROBORATED
P3 CORE STATE:       DIRECTLY MEASURED
```

`METHOD_V1` §2.8 is the signed schema and already pairs `frame 1|31|61` with `P1|P2|P3`. **That is
the authority for P1 and P2** — no further discriminator is required, and they are **not** to be
described as weakly inferred. This pass corroborates it: blade `dy` increases monotonically
`0.261320 → 0.267837 → 0.278489`, consistent with doctrine §5's *closed block → shell-split*
progression. The `dy` figures are corroboration, not authority.

*(Operator ruling, 2026-08-07, recorded in `MIKAGE_COLLISION_BRIDGE_RULING.md` §D3.)*

**Note on the shells.** All four `ZB45_SHELL_*` are render-enabled at every frame, and their centroid
separation barely moves (0.4089 → 0.4159 m). The split is a **local vertex-profile change**, per the
objects' own property `ce01_phase_b: "local_vertex_profile_depth_no_object_transform_change"` — not an
object translation. Do not look for shell separation as the P1/P2 discriminator; it is not there.

---

## 4. A PREVIOUSLY FLAGGED DISCREPANCY IS NOW RESOLVED

`MIKAGE_CE15_COLLISION_REPROOF_04.md` §4 flagged blade bbox `dy` as **UNCONFIRMED**: it measured
`0.261320` against `0.278489` in `MIKAGE_ACTOR_STAGE_BUILD_01_REPORT.md:124`.

**Both are correct; they were measured at different states.** `0.278489` is the **frame-61 / P3**
value; `0.261320` is **frame-1 / P1**, the state the file loads in. The discrepancy was a state
difference, not an error in either measurement. **RESOLVED — no correction required to either report.**

> Consequence for every future measurement: **the blade bbox is state-dependent.** Any figure quoted
> without its frame/phase is ambiguous. Quote the state.

---

## 5. CONSEQUENCE FOR ZONE 5

`ZB42_P3_SINGLE_RECESSED_CORE` is `hide_render = True` at **P1 and P2**, and `METHOD_V1` §2.1
excludes `hide_render = True` objects from measurement. The core therefore contributes **no
triangles** to the blade side at P1/P2.

With the mapping now proven, the Bridge Ruling's §D2 test can be applied: at P1/P2 the core-exposed
condition **does not exist by design**, so zone 5 is **`NOT_APPLICABLE`** in those cells — it is not
a check the fixture failed to perform. Zone 5 is **`REQUIRED`** at P3, where the core is present.

**RULED, operator, 2026-08-07** (`MIKAGE_COLLISION_BRIDGE_RULING.md` §D3-a): **the whole zone is
`NOT_APPLICABLE` at P1 and P2, and `REQUIRED` at P3.** It is not split. Zone 5's identifier is
*core–spine–rails axis **alignment***; with the core absent from the measurement set, that
three-part relationship does not exist as a check. `ZB42_CENTRAL_LOAD_SPINE` and
`ZB42_FUNCTIONAL_RAIL_L/R` measured alone are **not Zone 5** — checking them independently would
require a new gate under a new name, and the identifier `core_spine_rails` may not be reused for it.

---

## 6. INTEGRITY

| Check | Observed | Result |
|---|---|---|
| Staging file | `229c727f…c17e01` | **UNCHANGED — anchor v1** |
| V0.89 / CE15 sources | identical | **BYTE-UNCHANGED** |
| Tripwire v2 | `3a62ac63…44c9` @ 79 | **UNCHANGED** |
| Blend files saved | 0 | **NONE** |
| Renders produced | 0 | **NONE** |
| Collision checks run | 0 | **NONE** |

Harness: `_tmp/ce15_state_map/d3_phase_state_map.py` · report `D3_STATE_MAP.json` · stdout `d3_stdout.txt`.

---

*End of CE15 BLADE STATE MAP D3. Read-only. P3 confirmed by measurement; P1/P2 ordering reported
with its basis. No pose, no matrix, no lock.*
