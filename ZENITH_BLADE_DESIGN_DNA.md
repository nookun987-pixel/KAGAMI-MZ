# ZENITH BLADE — DESIGN DNA (one page)

**Derived extract of [ZENITH_BLADE_DESIGN_BIBLE_V1.md](ZENITH_BLADE_DESIGN_BIBLE_V1.md).** Every section cites the Bible section it comes from.
**This is a derived summary, NOT a second authority. On any conflict, the Bible wins.**
Date: 2026-08-06 · No canon approval · No asset lock · Not production-ready.

---

## IDENTITY — *Bible §1*
350 kg heavy industrial straight sword / đại đao. Internal identifier **PrimeTool**. Mikage Zenith's sole primary weapon, wielded by no one else.

## NON-NEGOTIABLE DNA — *Bible §2*
- Mass **350 kg**
- Blade : actor height = **0.684273 (±2 %)**
- **Four** mechanically linked outer shell plates (UL / UR / LL / LR)
- Exactly **one** violet core, visible **only in P3**
- **No red/crimson on the weapon at any phase**
- Flux Pinning, **0.5 mm** micro-vibration at magnetic joints
- **Forbidden:** curved katana · thin elegant blade · clean-laser look · fantasy ornament · pointed tip · crossguard · weapon-owned rider/gauntlet/holster/steed/rig objects

## SILHOUETTE — *Bible §3*
Brutalist monolith. Flat-cut / blunt lower termination. **No pointed tip, no crossguard.**
Form basis: **CE15** (operator ruling D1=A). Silhouette deviation **0 px beyond anti-alias** at 64 px and 128 px.
Seam grammar: **one dominant compression seam**; secondary seams closed to ~1 mm oblique hairlines; seam bevel-rims suppressed (0.06) vs dominant (0.50).

## STRUCTURE — *Bible §4*
> **Central load spine + paired recessed rails + two structural lobes surrounding the central P3 slot; upper hub, lower Flux-Pinning base, and collars are load-transition modules.** (operator ruling D2=C)

Weapon weight routes through the actor's pelvis via a docking anchor — that result belongs to the **V0.89 integration lineage**, not to CE15 geometry (*Bible §10, §13*).

## STATES — *Bible §6*
| Phase | Weapon | Core |
|---|---|---|
| **P1** | Compact-Idle — closed block, plates contracted, flux-pinned to back | **OFF** |
| **P2** | Brutal Industrial Activation — shell splits (Kintsugi) | **OFF** |
| **P3** | Tri-Phase Final / Overdrive — shell fully split | **ON** — exactly one core |

Verified on CE15: P1 violet = 0 · P2 violet = 0 · P3 violet ROI = 2879 (gate ≥ 2500) · global 0.139 % (gate ≤ 5 %).

## MOTION — *Bible §7*
Phase keying: frame **1 = P1**, **31 = P2**, **61 = P3**, constant interpolation. Turntable reference 36 frames / 6.000 s.
Flux-Pinning 0.5 mm micro-vibration: **retained in canon and mechanical spec; NOT required to be visible in stills** (operator ruling D6=B).

## CORE — *Bible §8*
Single recessed core, fixed central position. P3 visibility achieved by **notching the spine, not moving the core**; core transform unchanged since CE08.
**`#8F00FF`** electric violet — P3 only, exactly one core, no wash / halo / ambient / fill / bloom. Red banned on the weapon at every phase (operator ruling D7).

## MATERIALS — *Bible §9*
**Porcelain / B4C = `#F2EEEA`** — authoritative (operator ruling D3=B). Supersedes the `#FAFAFA` written in `MIKAGE_ZENITH_BLADE_SPEC_V1.md` §1.

⚠ **Graphite / titanium / steel = NOT RECONCILED.** Two arcs exist; D3 ruled **porcelain only**. Both are carried with provenance — **do not merge**:

| | MAT_C1/C3 arc (2026-07-31) | V0.29 MATERIAL_FINALING arc |
|---|---|---|
| Z-Blue graphite | `#4B5866` | — |
| Sumi coated metal | `#252321` | — |
| Violet-black inset | `#120A18` | — |
| Dark titanium | — | linear `(0.035, 0.045, 0.065)` · met 0.82 · rough 0.40 |
| Cold-steel rails | — | linear `(0.12, 0.16, 0.22)` · met 0.95 · rough 0.20 |
| P3 core emission | — | `(0.278, 0.0, 1.0)` · strength 0.90 |

Surface: satin porcelain, subtle micro-grain, rounded ceramic edge bevels, anisotropic titanium/graphite response, roughness hierarchy. No bloom, no glare, no emission increase.

## SCALE — *Bible §10*
Ratio **0.684273** (allowed 0.670–0.698) · human-scale root factor **0.2452706705** · blade length **1.2 m**.
✅ **RECONCILED 2026-08-06:** measured **1.200000 m = 47.2441 in** is **INSIDE** canon's 35–58 in (0.889–1.4732 m); the prior "conflict" is **withdrawn as an un-converted unit check**. Scale-vs-human image now exists. *Provenance: task `ZENITH_BLADE_OUTSTANDING_RENDERS_01`, `renders/board_v1_evidence/OUT4_SCALE_VS_HUMAN_ANNOTATED.png` + `RUN_LOG_outstanding_renders_v2.json` → `outputs.OUT4_blade_measurement.inside_canon_range: true`.* Human reference was a **temporary 1.75 m primitive proxy, NOT a character asset**; in-scene actor height remains **UNCONFIRMED**.

## PRESENTATION — *Bible §11*
**Orthographic** for front, side, silhouette, dimensions, callouts. **HERO_E1 85 mm perspective** for the main hero plate only (AgX Medium High Contrast, −0.35 EV, bg `#050508`) — camera language only; the hero plate uses **CE15 form** (operator ruling D5=C).

## REJECTED — *Bible §12*
Slab remodel V0.1/V0.1.1 · pointed/tapered V0.42 ("MONOLITHIC_BRUTALISM: FAIL") · V0.29–V0.40 "opening box" form (methodology retained, form revoked) · CE10 "boxes on slab" · CE11 "cladding beside chassis" · CE14 "segmented plates beside dominant shell, blockout terminations".

## FORM ↔ RIG — *Bible §13*
Two linked assets, **neither overwrites the other** (operator ruling D4=C):
- **CE15** — weapon form, silhouette, seams, materials, core behaviour
- **V0.89** — actor integration: docking, grip IK, collision ownership, mitten clearance

Consumption by **link/reference only**. Any form change ⇒ re-link **and** fresh full validation. See [ZENITH_BLADE_FORM_RIG_HANDOFF_CONTRACT.md](ZENITH_BLADE_FORM_RIG_HANDOFF_CONTRACT.md).

## OPEN — *Bible §14, §15*
CE15 ↔ actor collision **NOT VERIFIED** · material arcs **NOT RECONCILED** · dimension reconciliation **RECONCILED 2026-08-06** *(see §SCALE above — 1.200000 m = 47.2441 in, inside canon 35–58 in; provenance task `ZENITH_BLADE_OUTSTANDING_RENDERS_01` / `OUT4_SCALE_VS_HUMAN_ANNOTATED.png`)* · canon authority **OPEN/PENDING** · physical volume **NOT VERIFIED**.
**Imagery — RESOLVED 2026-08-06** *(provenance: task `ZENITH_BLADE_OUTSTANDING_RENDERS_01`; files under `renders/board_v1_evidence/`)*: 85 mm perspective hero on CE15 form → `OUT1_HERO_P3_85MM_ANNOTATED.png` · core/spine section → `OUT2_CORE_SPINE_SECTION_ANNOTATED.png` · exploded load-path diagram → `OUT3_EXPLODED_LOADPATH_ANNOTATED.png` · scale-vs-human image → `OUT4_SCALE_VS_HUMAN_ANNOTATED.png`.
**MISSING imagery (still open):** CE12 alpha silhouette mask.
**MISSING documents:** CE12/CE13 standalone written rulings (session-record only).
*(Rear 3/4 is **not** missing — `HC_rear34_P3.png` exists in the CE15 set.)*

**Currently in force:** no asset lock, no production-ready status anywhere in the project.
