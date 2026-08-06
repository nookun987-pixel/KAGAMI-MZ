# ZENITH BLADE — DESIGN BIBLE V1

**Version:** V1 (decision-resolved) · **Date:** 2026-08-06
**Supersedes:** `ZENITH_BLADE_DESIGN_BIBLE_DRAFT.md` for decisions D1–D7 only. The Draft is retained unmodified as historical record.
**Ruling authority:** [ZENITH_BLADE_FINAL_DESIGN_OPERATOR_RULING.md](ZENITH_BLADE_FINAL_DESIGN_OPERATOR_RULING.md) (2026-08-06)

**This document does NOT declare:** production approval · asset lock · actor-integration completion · physical-volume verification.
Every rule cites its source. Items still unproven are labelled **MISSING EVIDENCE** or **NOT VERIFIED** and are not silently reconciled.

---

## 1. Identity and purpose

350 kg heavy industrial straight sword / đại đao. Internal identifier **PrimeTool**. Mikage Zenith's sole primary weapon.
> "Canonical name: Zenith Blade, identifier PrimeTool; class = industrial đại đao for executing execute() commands. Wielded ONLY by Mikage." — `docs/handoff/MIKAGE_ZENITH_BLADE_SPEC_V1.md` §1

Naming resolved: "Thanh Đại Đao 3 Pha" / "Tri-phase Blade" = Zenith Blade, same object — `docs/handoff/MIKAGE_ZENITH_BLADE_OPERATOR_RULING_20260601.md`

## 2. Non-negotiable design DNA

| Rule | Source |
|---|---|
| Mass **350 kg** | `SPEC_V1.md` §1, §0.1 |
| Blade/actor height ratio **0.684273 (±2 %)** | `FORM_A1_PROOF.md`; `MZ_BLADE_HERO_LOOK_GATE_V2.md` |
| **Four** mechanically linked outer shell plates (UL/UR/LL/LR) | `V0_25_PROOF.md`; `V0_45_OPERATOR_RULING.md`; CE09→CE15 `ZB45_SHELL_*` |
| Exactly **one** violet core, visible only in P3 | every CE `*_SILHOUETTE_VIOLET_REPORT.json` |
| **No red/crimson on the weapon at any phase** | `SPEC_V1.md` banner, ruling 2026-07-06/07 |
| Flux Pinning, 0.5 mm micro-vibration at magnetic joints | `SPEC_V1.md` §1 — **retained canon (D6=B)**, not required visible in stills |
| Forbidden: curved katana · thin elegant blade · clean-laser look · fantasy ornament · pointed tip · crossguard · weapon-owned rider/gauntlet/holster/steed/rig objects | `SPEC_V1.md` §1; brutalist-convergence ruling 2026-07-28; `V0_25_PROOF.md` regression rules |

## 3. Final accepted silhouette rules — **RESOLVED (D1 = A)**

**CE15 is the final visual-form basis.**
- Artifact: `_tmp/zenith_blade_hero_e1_ce15/hero_cohesion_correction01/MIKAGE_ZENITH_BLADE_HERO_COHESION_CORRECTION_01_FIRST_PASSING_CANDIDATE.blend`
- SHA-256 `465B212EF49A4B8AD3EACD682757D9FE0512FA5D242C1B09611439B9C76C3129`

Silhouette rule (unchanged by the ruling): brutalist monolith, flat-cut/blunt lower termination, **no pointed tip, no crossguard**.
> "Pointed tip and fantasy-greatsword read are forbidden… The lower termination must be flat-cut or blunt mechanical, not pointed." — `SPEC_V1.md`, "OPERATOR RULING — ZENITH BLADE BRUTALIST CONVERGENCE — 2026-07-28"

CE15 conforms: silhouette deviation **0 px beyond anti-alias at 64 px and 128 px** vs the CE14 baseline, which in turn traces to the CE12-locked reference (`HC_TECHNICAL_INTEGRITY_REPORT.md`).

Seam grammar now canonical from CE15: **one dominant compression seam**; secondary seams closed to ~1 mm hairlines, made oblique; seam bevel-rims suppressed (weight 0.06) versus the dominant seam (0.50).

## 4. Structural architecture and load path — **RESOLVED (D2 = C)**

**Unified authoritative definition:**
> **Central load spine + paired recessed rails + two structural lobes surrounding the central P3 slot; upper hub, lower Flux-Pinning base, and collars are load-transition modules.**

This is an **operator ruling**, not a documentary finding — no prior source stated the equivalence. It reconciles:
- `V0_25_PROOF.md`: "Central spine and paired recessed-rail depth definition: PASS" / "Upper hydraulic drive-hub definition: PASS" / "Lower Flux-Pinning base definition: PASS" / "Joint-collar/load-transition definition: PASS"
- `_tmp/zenith_blade_hero_e1_ce09/architecture03_rebuild/run_arch03_rebuild.py`: `left_lobe()` / `right_lobe()` / central `SLOT` / `build_chassis()`

Weapon-weight load path routes through the actor's pelvis via a docking anchor — `DOCKING_LOAD_PATH_V0_65_PROOF.md` ("PRIMARY_DOCKING_LOAD_OWNERSHIP: PASS"). **Note:** that result belongs to the V0.89 integration lineage, not to CE15 geometry (§10).

## 5. Armor and seam grammar

Canonical from CE15 (see §3). Superseded/rejected approaches retained for reference: CE10 armor-grammar refinement ("boxes on slab"), CE11 load-path integration ("cladding beside chassis"), CE14 hero design ("segmented plates beside dominant shell, blockout terminations").

CE15's cross-boundary continuity swell (world-Y-only sculpt, silhouette-preserving) is the accepted technique for making the porcelain read as one pressure-formed shell rather than stacked plates.

## 6. Transformation states P1/P2/P3

| Phase | Weapon | Entity | Core |
|---|---|---|---|
| **P1** | Compact-Idle — closed block, plates contracted, flux-pinned to back | Imperial Clean | **OFF** |
| **P2** | Brutal Industrial Activation — shell splits (Kintsugi) | Fallen / Exile | **OFF** |
| **P3** | Tri-Phase Final / Overdrive — shell fully split | Execution | **ON — exactly one core, `#8F00FF`** |

— `SPEC_V1.md` §0b; `MIKAGE_ZENITH_ENTITY_PHASE_SPEC_V1.md` §0.5; approved `MIKAGE_ZENITH_STRUCTURE_APPROVAL_AND_LOCK_READINESS_20260602.md`

**Amended by D7:** the locked phase tables in those documents still literally read `core #E60000 max`. The core colour is `#8F00FF` — see [ZENITH_BLADE_CANON_AMENDMENT_CORE_COLOUR.md](ZENITH_BLADE_CANON_AMENDMENT_CORE_COLOUR.md). Structure and timing of the states are unchanged.

Verified on CE15: P1 violet = 0 · P2 violet = 0 · P3 violet ROI = 2879 (gate ≥ 2500) · global violet 0.139 % (gate ≤ 5 %).

## 7. Motion language

- Phase keying: frame **1 = P1**, **31 = P2**, **61 = P3**, constant interpolation — `PHASE_TIMELINE_V0_14_PROOF.md`
- Turntable reference: 36 frames, 6.000 s — `_tmp/…/ce15/…/pass_03/HC_turntable_6s.mp4`
- **Flux-Pinning 0.5 mm micro-vibration (D6 = B):** retained in canon and mechanical specification; **not required to be visible** in still renders or on the Final Design Board.

## 8. Core and violet signal

Single recessed core (`ZB42_P3_SINGLE_RECESSED_CORE`), fixed central position. Visibility in P3 achieved by **notching the spine, not moving the core** — `_tmp/zenith_blade_hero_e1_ce08/spine_notch_correction01/SNC01_REPORT.json`. Core transform unchanged since CE08.

**Authoritative colour: `#8F00FF`** — P3 only, exactly one core, no wash / halo / ambient / fill. Red banned on the weapon at every phase (D7 = CONFIRMED).
> "the Zenith Blade core/seam signal is **electric violet, `#8F00FF` family**… Red/crimson is **BANNED** on this weapon at every phase." — `SPEC_V1.md` header banner

Regression origin retained as a permanent lesson: `_tmp/zenith_blade_hero_e1_ce01/build_preview.py` line 30 `core.location.y += 0.035` caused the P3 occlusion; fixed at CE08.

## 9. Materials and surface behaviour

**Porcelain — RESOLVED (D3 = B): `#F2EEEA`** (authoritative). Source of the built value: `MAT_C1_PROOF.md` / `MAT_C3_PROOF.md`. Supersedes the `#FAFAFA` written in `SPEC_V1.md` §1.

**Other built material values — two arcs, NOT reconciled (see §13):**

| Material | MAT_C1/C3 arc (2026-07-31) | V0.29 MATERIAL_FINALING arc |
|---|---|---|
| Porcelain / B4C | `#F2EEEA` ✅ **authoritative** | linear `(0.72, 0.69, 0.65)`, metallic 0.00, roughness 0.68, coat 0.06 / 0.32 |
| Z-Blue graphite | `#4B5866` | — |
| Sumi coated metal | `#252321` | — |
| Violet-black inset | `#120A18` | — |
| Dark titanium | — | linear `(0.035, 0.045, 0.065)`, metallic 0.82, roughness 0.40 |
| Cold-steel rails | — | linear `(0.12, 0.16, 0.22)`, metallic 0.95, roughness 0.20 |
| P3 core emission | — | `(0.278, 0.0, 1.0)`, strength 0.90 (reduced from 1.25) |

D3 resolved **porcelain only**. The graphite / titanium / steel relationship between the two arcs is **NOT VERIFIED** and awaits a separate ruling.

Surface treatment (from CE13 + CE15, silhouette-preserving): satin porcelain with subtle micro-grain; rounded ceramic edge bevels; anisotropic titanium/graphite response; roughness hierarchy. No bloom, no glare, no emission increase.

## 10. Scale and human interaction

- Blade/actor height ratio **0.684273** (allowed range 0.670–0.698) — `FORM_A1_PROOF.md`
- Human-scale root factor **0.2452706705**, blade length **1.2 m** — `EDGE_B1_PROOF.md`
- **NOT VERIFIED:** canon's "Length: 35–58 inches" (`MIKAGE_ZENITH_CANON_V2.md` §2.4) has never been explicitly cross-checked against the built 1.2 m.
- **MISSING EVIDENCE:** no scale-vs-human comparison image exists in either lineage.

## 11. Hero presentation language — **RESOLVED (D5 = C)**

- **Orthographic** technical views: front, side, silhouette, dimensions, callouts.
- **HERO_E1 85 mm perspective** for the main hero plate only: 85 mm lens, AgX Medium High Contrast, −0.35 EV, background `#050508` — `HERO_E1_QA_REPORT.json`.
- Note retained: HERO_E1 itself was never operator-visually-approved ("Final visual approval pending operator"); D5 adopts its **camera language**, not its geometry — the hero plate uses **CE15 form**.

## 12. Rejected directions (retained)

| Direction | Evidence |
|---|---|
| Slab remodel V0.1 / V0.1.1 | "SUPERSEDED / WRONG CANON BASIS" |
| Pointed/tapered rebuild V0.42 | `V0_44_OPERATOR_VISUAL_RULING.md` — "MONOLITHIC_BRUTALISM: FAIL" |
| V0.29–V0.40 outer form | `VISUAL_NONCONFORMANCE_RESET_V0_41.md` — "opening box, not a unified blade" (methodology retained, form revoked) |
| CE10 armor grammar | "boxes on slab" |
| CE11 load-path integration | "cladding beside chassis" |
| CE14 hero design | technically valid; "segmented plates beside dominant shell, blockout terminations" |

## 13. Technical locks and form/rig relationship — **RESOLVED (D4 = C)**

**Two linked assets. Neither overwrites the other.**

| Asset | Authority | Path |
|---|---|---|
| **CE15** | Weapon form · silhouette · seams · materials · core behaviour | `_tmp/zenith_blade_hero_e1_ce15/hero_cohesion_correction01/…CANDIDATE.blend` |
| **V0.89** | Actor integration · docking · grip IK · collision ownership · mitten clearance | `production/character/production_actor/rig_derivatives/MIKAGE_ZENITH_BLADE_MITTEN_INTERFACE_CORRECTION_V0_89.blend` |

Consumption by **link/reference only**; any form change requires re-link **and** fresh validation. Full terms: [ZENITH_BLADE_FORM_RIG_HANDOFF_CONTRACT.md](ZENITH_BLADE_FORM_RIG_HANDOFF_CONTRACT.md).

**Currently in force:** no asset lock, no production-ready status anywhere in the project. The single historical grant (V0.33) was revoked by V0.41.

## 14. Conflicts still unresolved

1. **CE15 ↔ actor collision unproven.** V0.89's 0-overlap / 8-pose result was achieved against the *previous* weapon form. **NOT VERIFIED** for CE15.
2. **Material arcs not reconciled** (§9) — graphite/titanium/steel across MAT_C vs V0.29.
3. **Dimension reconciliation** (§10) — canon inches vs built metres.
4. **Canon authority** — `MIKAGE_CANON_CONTROL_MAP.md` lists no Blade SSOT while `SPEC_V1.md` self-declares one; `OPERATOR_PROMOTION_PACKET_V0_1.md` remains `OPERATOR_APPROVAL: PENDING`. **CONFLICT — OPEN.**
5. **Physical volume** — `PHYSICAL_VOLUME_EXACT_VALUE: NOT VERIFIED` (all collision evidence is BVH triangle-overlap based).

## 15. Missing evidence

- CE12 alpha silhouette mask (its `sil` files are thumbnail colour renders) — **MISSING**
- Standalone written ruling docs for CE12 / CE13 (acceptance exists only in session record) — **MISSING**
- Rear 3/4 orthographic · exploded load-path diagram · core/spine section · scale-vs-human image — **MISSING** in both lineages

## 16. Evidence required before production asset lock

1. Re-link CE15 into the V0.89 integration context and re-prove: collision, docking, grip IK, mitten clearance, 8-pose gate.
2. Resolve conflicts 2–5 in §14.
3. Produce the four missing board panels (§15) — see [ZENITH_BLADE_FINAL_DESIGN_BOARD_BUILD_SPEC.md](ZENITH_BLADE_FINAL_DESIGN_BOARD_BUILD_SPEC.md).
4. Close the pending canon-authority promotion packet.
5. An explicit, dated operator ruling on the **integrated** candidate — per `PROJECT_MODEL.md` I12, never on a self-reported technical pass.
