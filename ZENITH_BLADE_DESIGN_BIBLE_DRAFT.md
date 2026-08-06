# ZENITH_BLADE_DESIGN_BIBLE_DRAFT

**Status: DRAFT — read-only synthesis of existing evidence. This is NOT a canon lock, NOT a production-ready declaration, NOT an operator approval of any design direction. Every rule below cites its exact source. Where visual judgment is required and no operator ruling exists, this document says `OPERATOR RULING REQUIRED` rather than inventing a conclusion.**

Full supporting evidence: [ZENITH_BLADE_CANON_EVIDENCE_MATRIX.md](ZENITH_BLADE_CANON_EVIDENCE_MATRIX.md) · [ZENITH_BLADE_DESIGN_BIBLE_INDEX.md](ZENITH_BLADE_DESIGN_BIBLE_INDEX.md) (619-file inventory) · `_tmp/zenith_blade_design_bible/selected_sources/` (57-file curated evidence package with manifest).

---

## 1. Identity and purpose

The Zenith Blade ("PrimeTool" internal identifier) is a 350kg heavy industrial straight sword/đại đao — Mikage Zenith's sole primary weapon, wielded by no one else.
> "Canonical name: Zenith Blade, identifier PrimeTool; class = industrial đại đao for executing execute() commands. Wielded ONLY by Mikage." — `docs/handoff/MIKAGE_ZENITH_BLADE_SPEC_V1.md` §1

The naming history ("Thanh Đại Đao 3 Pha" / "Tri-phase Blade") was formally resolved as the same object: `docs/handoff/MIKAGE_ZENITH_BLADE_OPERATOR_RULING_20260601.md` — "'Tri-phase Blade' = 'Zenith Blade' — SAME weapon."

## 2. Non-negotiable design DNA

- **Mass: 350 kg.** — `SPEC_V1.md` §1, §0.1
- **Blade/actor height ratio: 0.684273 (±2%).** — `production/character/reviews/MIKAGE_ZENITH_BLADE_FORM_A1_PROOF.md`; `production/character/build_log/MZ_BLADE_HERO_LOOK_GATE_V2.md`
- **Four mechanically linked outer shell plates (UL/UR/LL/LR).** — `V0_25_PROOF.md`; `V0_45_OPERATOR_RULING.md`; consistent with this-session `ZB45_SHELL_LL/LR/UL/UR`
- **Exactly one violet core, visible only in P3.** — verified on every this-session pass (`*_SILHOUETTE_VIOLET_REPORT.json`)
- **No red/crimson anywhere, at any phase** (overriding the weapon's earlier crimson concept). — `SPEC_V1.md` header banner, ruling 2026-07-06/07
- **Flux Pinning reveal mechanism**, 0.5mm micro-vibration at magnetic joints. — `SPEC_V1.md` §1
- **Forbidden traits (all phases):** curved katana, thin elegant blade, clean-laser aesthetic, fantasy ornament, decorative scimitar, tiny/light proportions, pointed tip, crossguard, rider/gauntlet/holster/steed/mount/rig objects owned by the weapon itself. — `SPEC_V1.md` §1; brutalist-convergence ruling 2026-07-28

## 3. Final accepted silhouette rules

The **current, latest-dated ruling** (supersedes an interim same-day allowance) locks a brutalist, non-pointed silhouette:
> "Pointed tip and fantasy-greatsword read are forbidden... The lower termination must be flat-cut or blunt mechanical, not pointed." — `SPEC_V1.md`, "OPERATOR RULING — ZENITH BLADE BRUTALIST CONVERGENCE — 2026-07-28" (explicitly supersedes that same day's earlier "ORIGINAL ZENITH BLADE FORM" ruling)

This is corroborated by the operator's explicit rejection of the pointed/tapered V0.42 rebuild:
> "MONOLITHIC_BRUTALISM: FAIL... POINTED_TIP: [rejected]" — `MIKAGE_ZENITH_BLADE_V0_44_OPERATOR_VISUAL_RULING.md`

This-session's lineage is consistent with this rule (blunt termination object literally named `CE01_BLUNT_MECHANICAL_ATTACK_TERMINATION`), and the ce12 (silhouette fusion) candidate was accepted by the operator in this session's conversation as "final architecture and silhouette direction" — **but note: no standalone written proof document exists for that acceptance; it is recorded only in this session's chat history** (see Evidence Matrix, "Precision note").

`OPERATOR RULING REQUIRED`: formally confirm the ce15 cohesion-correction candidate (the current, most recent state) satisfies this silhouette rule — it has not yet been ruled.

## 4. Structural architecture and load path

Locked mechanical structure (ten-pass definition): central spine + paired recessed rails + upper drive hub + lower Flux-Pinning base + joint collars.
> "Four-shell connected-seam definition: PASS." / "Central spine and paired recessed-rail depth definition: PASS." / "Upper hydraulic drive-hub definition: PASS." / "Lower Flux-Pinning base definition: PASS." — `production/character/reviews/MIKAGE_ZENITH_BLADE_CANON_MECHANICAL_DEFINITION_V0_25_PROOF.md`

Weapon-weight load path routes through the actor's pelvis via a docking anchor:
> "PRIMARY_DOCKING_LOAD_OWNERSHIP: PASS" — `production/character/reviews/MIKAGE_ZENITH_BLADE_DOCKING_LOAD_PATH_V0_65_PROOF.md`

`CONFLICT`: this-session's `ce09` (`run_arch03_rebuild.py`) describes the chassis as a "two-lobe chassis with central slot" — a structurally different description than "spine+rails+hub+base+collars." No document cross-references these as the same structure. `OPERATOR RULING REQUIRED`.

## 5. Armor and seam grammar

No stable, canon-locked "armor grammar" rule currently exists. One explicit this-session attempt was tested and rejected:
> Operator feedback: "boxes on slab." — `_tmp/zenith_blade_hero_e1_ce10/armor_grammar_refinement01/`

The most recent accepted direction (ce15, `HERO_COHESION_VISUAL_CANDIDATE`, not yet operator-ruled) establishes: one dominant structural seam, tapered/hairline secondary seams (replacing evenly-spaced tile seams), directly responding to the operator's critique of ce14 ("three strong horizontal black seams create a stacked-tile rhythm"). This technique (world-Y-only compound-curvature sculpt, seam hierarchy) has **no canon-text backing** — it is a this-session innovation only.

`OPERATOR RULING REQUIRED`: define what "armor grammar" means going forward, and rule on whether the ce15 seam-hierarchy technique should be canonized.

## 6. Transformation states P1/P2/P3

Synced entity↔weapon phase model, identical wording in two locked documents:

| Phase | Weapon state | Entity | Read |
|---|---|---|---|
| P1 | Compact-Idle — closed B4C block, plates contracted, flux-pinned to back, core dim/OFF | Imperial Clean | sterile, sealed |
| P2 | Brutal Industrial Activation — shell splits (Kintsugi), core OFF | Fallen/Exile | shell opening |
| P3 | Tri-Phase Final/Overdrive — shell fully split, exactly ONE core visible/lit | Execution | full release |

— `SPEC_V1.md` §0b; `docs/handoff/MIKAGE_ZENITH_ENTITY_PHASE_SPEC_V1.md` §0.5; formally approved `docs/handoff/MIKAGE_ZENITH_STRUCTURE_APPROVAL_AND_LOCK_READINESS_20260602.md`

`CONFLICT`: the locked table text in **all three** of the above documents still literally reads `"core #E60000 max"` (crimson) for P3 — this was never edited after the later violet-core override (see Section 8). Structure/timing of the P1/P2/P3 states themselves is not in dispute; only the color word embedded in the locked table is stale.

This-session verification (every accepted `ce` pass): P1 violet = 0, P2 violet = 0, P3 violet ROI ≥ 2500 — consistent with the phase-state structure, using the corrected (violet) color.

## 7. Motion language

- Phase-timeline keying convention: frame 1 = P1, frame 31 = P2, frame 61 = P3, constant interpolation. — `production/character/reviews/MIKAGE_ZENITH_BLADE_PHASE_TIMELINE_V0_14_PROOF.md`
- Mechanical rig/attachment arc (V0.13→V0.89, separate numbering from the shape/color arcs) resolved a long chain of collision/grip defects, ending with: mitten-interface fix, **technically PASS but awaiting operator ruling**:
> "INTEGRATION_READY: YES / STATUS: AWAITING_REOPEN_AND_OPERATOR_REVIEW" — `production/character/reviews/MIKAGE_ZENITH_BLADE_MITTEN_INTERFACE_CORRECTION_V0_89_PROOF.md`
- This mechanical/rig arc has **not been shown to connect** to the FORM_A→HERO_E1 shape/material/light arc or to this-session's ce01–ce15 geometry lineage — no cross-reference was found. `OPERATOR RULING REQUIRED` on whether/how these should be merged.
- `OPERATOR RULING REQUIRED`: confirm whether the 0.5mm Flux-Pinning micro-vibration (Section 2) is still an active requirement in the currently-accepted (ce12→ce15) geometry — the more elaborate multi-stage reveal tested in `ce11` (LOCK→RELEASE→TRAVEL→LATCH) was rejected for visual reasons, and it's unclear whether a simpler mechanism silently replaced the Flux-Pinning requirement or merely re-expressed it.

## 8. Core and violet signal

Single recessed core object, fixed central position. The most rigorously evidenced rule in the entire project:
- CE01 regression traced to `_tmp/zenith_blade_hero_e1_ce01/build_preview.py` line 30: `core.location.y += 0.035` (independently re-verified byte-for-byte this synthesis pass).
- Accepted fix: `_tmp/zenith_blade_hero_e1_ce08/spine_notch_correction01/` — notches the spine, not the core; core transform has been unchanged ever since.
- Color: `#8F00FF` electric violet, P3-only, single core, no wash/halo/ambient/fill. Red banned at every phase.
> "the Zenith Blade core/seam signal is electric violet, #8F00FF family... Red/crimson is BANNED on this weapon at every phase." — `SPEC_V1.md` header banner
> Every this-session technical integrity report gates: P1/P2 violet = 0, P3 violet ROI ≥ 2500, global violet ≤ 5%.

**Unresolved canon-text conflict** (see Section 3 of the Evidence Matrix, topic L): `MIKAGE_ZENITH_CANON_V2.md` §2.4 ("Deep crimson glowing core (#E60000)") and the locked phase tables in `MIKAGE_ZENITH_STRUCTURE_APPROVAL_AND_LOCK_READINESS_20260602.md` §(a) (stamped "ABSOLUTE INVARIANT") still say crimson — never amended after the violet override. `OPERATOR RULING REQUIRED`: formally amend these three documents' table text, or issue a dated addendum.

## 9. Materials and surface behavior

**Porcelain (B4C ceramic outer shell)** — `CONFLICT`: spec says `#FAFAFA`, but the actual locked material pass uses `#F2EEEA`:
> Spec: "outer = B4C porcelain shell (white #FAFAFA...)" — `SPEC_V1.md` §1
> Built: base color `(0.72, 0.69, 0.65)` ≈ `#F2EEEA` — `production/character/reviews/MIKAGE_ZENITH_BLADE_MAT_C1_PROOF.md`, `MAT_C3_PROOF.md`
The only documented authorization for `#F2EEEA` found is scoped explicitly to "the Mikage shell" (the character's body), not the weapon — `MIKAGE_ZENITH_ENTITY_PHASE_SPEC_V1.md`, 2026-07-21 scope note. `OPERATOR RULING REQUIRED`.

**Titanium/graphite** — locked values, explicitly retained as technical reference even after the V0.29–V0.40 outer FORM was revoked:
> "Dark Titanium — Base color (0.035, 0.045, 0.065). Metallic 0.82. Roughness 0.40." / "Cold steel rails — Base color (0.12, 0.16, 0.22). Metallic 0.95. Roughness 0.20." — `production/character/reviews/MIKAGE_ZENITH_BLADE_MATERIAL_FINALING_V0_29_PROOF.md`
> "B4C, dark-Titanium and cold-steel material recipes... [retained] as technical reference." — `MIKAGE_ZENITH_BLADE_VISUAL_NONCONFORMANCE_RESET_V0_41.md`

**Core emission** — color `(0.278, 0.0, 1.0)`, strength `0.90` (reduced from 1.25 during MAT_C tuning). — `MATERIAL_FINALING_V0_29_PROOF.md`

**Surface curvature / compound curvature** — a this-session-only innovation (ce14/ce15, world-Y-only sculpt to avoid altering the locked silhouette), with **no canon backing**. First application (ce14) operator-rejected ("segmented plates beside dominant shell, blockout terminations"); revised application (ce15) not yet ruled. `OPERATOR RULING REQUIRED` to decide whether to canonize.

## 10. Scale and human interaction

Blade/actor height ratio locked at 0.684273 (±2%), applied via a human-scale root transform (factor 0.2452706705), producing a 1.2m blade length in the EDGE_B1 pass:
> "blade/actor height ratio 0.684273308... relative scale in allowed range 0.670–0.698" — `MIKAGE_ZENITH_BLADE_FORM_A1_PROOF.md`
> "human scale factor 0.2452706705... blade length 1.2m" — `MIKAGE_ZENITH_BLADE_EDGE_B1_PROOF.md`

This ratio is independently re-locked by the current governing quality standard:
> "locks blade-to-actor-height scale ratio at 0.684 (±2%)" — `production/character/build_log/MZ_BLADE_HERO_LOOK_GATE_V2.md` (itself only a PROPOSAL, "chưa duyệt, chưa canon-lock" — not yet approved/canon-locked)

## 11. Hero presentation language

Long-running production pipeline's locked hero-render settings:
> "materials unchanged, 85mm lens, AgX Medium High Contrast, -0.35EV, bg #050508" — `production/character/reviews/MIKAGE_ZENITH_BLADE_HERO_E1_QA_REPORT.json`

**Important:** HERO_E1 (the pipeline's final deliverable, 8/8 QA gates technically PASS) was **never operator-visually-approved**:
> "Final visual approval remains with the operator." / "Final visual approval pending operator." — `MIKAGE_ZENITH_BLADE_HERO_E1_QA_PROOF.md`

This-session hero renders (ce13–ce15) use a matching AgX/-0.35EV color-management pipeline but have not been confirmed to replicate HERO_E1's exact lens/framing. `OPERATOR RULING REQUIRED` to decide whether the Final Design Board should standardize on this camera language.

## 12. Explicit rejected directions

| Direction | Rejection evidence |
|---|---|
| Original slab-remodel (V0.1/V0.1.1) | Operator flagged "SUPERSEDED/WRONG CANON BASIS" — `production/character/reviews/MIKAGE_ZENITH_BLADE_SLAB_REMODEL_V0_1_PROOF.md` |
| Pointed/tapered rebuild (V0.42) | "MONOLITHIC_BRUTALISM: FAIL... FOUR_PLATE READ: FAIL" — `MIKAGE_ZENITH_BLADE_V0_44_OPERATOR_VISUAL_RULING.md` |
| V0.29–V0.40 outer form ("opening box") | "reads as an opening box rather than a unified Zenith Blade" — `MIKAGE_ZENITH_BLADE_VISUAL_NONCONFORMANCE_RESET_V0_41.md` (methodology retained, form revoked) |
| This-session armor grammar refinement (ce10) | Operator: "boxes on slab." |
| This-session load-path integration (ce11) | Operator: "cladding beside chassis." |
| This-session hero design pass (ce14) | Technically valid, operator visually rejected: "segmented plates beside dominant shell, blockout terminations." |

## 13. Technical locks

- Mechanical structure (spine/rails/hub/base/collars): `V0_25_PROOF.md` — chamfer/bevel values locked per component.
- Material values (porcelain/titanium/steel/core): `V0_29_PROOF.md` (retained as technical reference post-V0.41).
- Docking load path: `V0_65_PROOF.md`.
- Mitten-interface collision fix (0 overlaps, 0 novel collision pairs, 8-pose gate): `V0_89_PROOF.md` — technically PASS, `AWAITING_REOPEN_AND_OPERATOR_REVIEW`.
- This-session's ce12 silhouette (locked reference for ce13–ce15), ce13 (0px silhouette deviation from ce12), ce15 (0px beyond anti-aliasing deviation from ce14) — all technical-integrity-report verified.

**No asset lock or production-ready status is currently in force anywhere in the project.** The one grant (V0.33) was explicitly revoked (V0.41); a canon-authority conflict (Promotion Packet V0.1) remains `OPERATOR_APPROVAL: PENDING`.

## 14. Conflicts still unresolved

1. **P3 core color, canon-text level** (Section 8) — three locked/invariant documents still literally say crimson `#E60000`; only `SPEC_V1.md`'s banner (dated after all three) overrides it, and the override wording frames itself as brand-palette-scoped rather than an explicit weapon-spec amendment.
2. **Porcelain hex value** (Section 9) — spec `#FAFAFA` vs. built `#F2EEEA`, with only an entity-scoped (not weapon-scoped) authorization found for the latter.
3. **Chassis structural description** (Section 4) — production pipeline's "spine+rails+hub+base+collars" vs. this-session's "two-lobe chassis with central slot" — no cross-reference found.
4. **Canon authority itself** — `docs/architecture/MIKAGE_CANON_CONTROL_MAP.md` does not list a Blade mechanics/material SSOT, while `SPEC_V1.md` self-declares one; raised but unresolved in `production/character/reviews/MIKAGE_ZENITH_BLADE_OPERATOR_PROMOTION_PACKET_V0_1.md` (`OPERATOR_APPROVAL: PENDING`).
5. **Two mechanical arcs not yet merged** — the V0.13→V0.89 rig/attachment/collision arc and the FORM_A→HERO_E1 / ce01–ce15 shape arc have no found cross-reference to each other.

## 15. Unknowns

- Whether Flux-Pinning's 0.5mm micro-vibration mechanism is still active in the currently-accepted (ce12→ce15) geometry (Section 7).
- Whether the "armor grammar" concept has any locked definition beyond the one rejected this-session attempt (Section 5).
- Whether the ce15 compound-curvature/seam-hierarchy technique should be canonized (Section 9).
- Whether HERO_E1's exact camera/lens language should govern the Final Design Board's renders (Section 11).
- Whether a planned "V0.10 full gate battery" round (referenced in V0.8's blocker analysis) was ever run separately from V0.9, or folded into V0.9 itself.

## 16. Evidence required before Final Design Board

1. Operator ruling on the current (ce15) silhouette against the brutalist-convergence rule (Section 3).
2. Resolution of the P3 core-color canon-text conflict (Section 8) — even a one-line addendum to the three affected documents.
3. Resolution of the porcelain hex-value conflict (Section 9).
4. Clarification of the chassis structural-description conflict (Section 4) — same object, two descriptions, or genuinely different designs?
5. Operator ruling on whether the ce01–ce15 lineage and the V0.13–V0.89 mechanical/rig arc should be merged, and if so, how.
6. See [ZENITH_BLADE_FINAL_DESIGN_BOARD_BRIEF.md](ZENITH_BLADE_FINAL_DESIGN_BOARD_BRIEF.md) for the per-panel breakdown of what exists vs. what must still be produced.

## 17. Evidence required before production asset lock

1. A fresh, explicit operator visual ruling on a specific candidate .blend (no candidate in either lineage currently holds one — V0.33's grant was revoked, and every subsequent milestone in both lineages is technically-PASS-only).
2. Resolution of all five unresolved conflicts in Section 14.
3. Formal reconciliation of canon authority (`MIKAGE_CANON_CONTROL_MAP.md` vs. `SPEC_V1.md`) via the still-pending Promotion Packet V0.1.
4. Explicit operator confirmation of which geometry lineage (production pipeline vs. this-session ce01–ce15) is authoritative going forward, or how they merge.
5. Per this project's own standing rule (`PROJECT_MODEL.md` I12): "Never promote on a self-reported visual pass" — any future promotion must cite an explicit, dated, quoted operator ruling, not an automated gate result.
