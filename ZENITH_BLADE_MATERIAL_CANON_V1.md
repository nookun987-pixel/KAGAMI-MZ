# ZENITH BLADE — MATERIAL CANON V1

**STATUS: APPROVED — Operator (BOOS BỚP), 2026-08-06**

> The MAT_C and V0.29 arcs are **unified as ONE FAMILY**. Operator rulings D1–D5 (Cowork,
> 2026-08-06) resolve every discrepancy raised by the verification task; the resolutions are
> recorded in §6.
>
> Every number in this document is either computed by pure colour math or read verbatim from
> CE15 scene data — **nothing is taken from conversation.** No material, geometry or asset was
> edited to produce it or to issue it.
>
> **NOT an asset lock · NOT production-ready.** This document governs material *values and
> naming* only. Geometry canon is separate
> ([ZENITH_BLADE_CANON_LOCK_V1.md](ZENITH_BLADE_CANON_LOCK_V1.md), plus
> [ERRATA 01](ZENITH_BLADE_CANON_LOCK_V1_ERRATA_01.md)); that lock left material naming
> **NOT LOCKED**, and this document is what closes it.

**Verification basis**
- CE15 source blend, read-only: `renders/board_v1_evidence/ZENITH_BLADE_CE15_SOURCE.blend`
  sha256 `465b212ef49a4b8ad3eacd682757d9fe0512fa5d242c1b09611439b9c76c3129` — **identical pre/post read**
- Blender 5.1.2 headless, inspection only. No save, no render, no edit. `bpy.data.is_dirty` = `False` after read.
- Workstation tripwire v2: 79 files, `3a62ac63…44c9` — **identical pre/post read**
- sRGB → linear per IEC 61966-2-1 (Blender's convention)

---

## 1. THE FAMILY MODEL — CANON

The direction ruling proposed one family. **The measurements supported it, and it is now canon.**

The family is defined by **hue anchors**. Every member is that anchor scaled by a **brightness
factor** — not an independently authored colour. A value belongs to the family if its per-channel
ratio against the anchor is consistent across R, G and B.

| Anchor | Hex | Linear | Role |
|---|---|---|---|
| Porcelain / B4C | `#F2EEEA` | `(0.887923, 0.854993, 0.822786)` | cutting-mass shell hue |
| Z-Blue graphite | `#4B5866` | `(0.070360, 0.097587, 0.132868)` | **all** cold structural greys |
| Sumi coated metal | `#252321` | `(0.018500, 0.016807, 0.015209)` | chassis / spine / load path |
| Violet-black inset | `#120A18` | `(0.006049, 0.003035, 0.009134)` | recessed inset, non-emissive |
| Core violet | `#8F00FF` | `(0.274677, 0.000000, 1.000000)` | P3 emissive signal, single core |

*Provenance — porcelain, Z-Blue, sumi, inset hex: `MIKAGE_ZENITH_BLADE_MAT_C1_PROOF.md` /
`MAT_C3_PROOF.md` (D3 = B ruling). Z-Blue as the sole sanctioned cold blue ("Ao-zumi / Steel
Oxide", muted, non-emissive): `design_system/mikage-cine-color-contract.md`, locked 2026-06-04.
Core violet: `MIKAGE_ZENITH_BLADE_SPEC_V1.md` banner + ruling D7. Linear values: computed here.*

---

## 2. CORE VIOLET — the two arcs are the same colour

| Record | Linear value | Δ vs true `#8F00FF` | Source |
|---|---|---|---|
| **Measured in CE15** | `(0.274677, 0.000000, 1.000000)` | **0.0000003 — EXACT to 6 dp** | measured CE15 scene data (`LIGHT_D1_P3_CORE_ELECTRIC_VIOLET`) |
| Computed from `#8F00FF` | `(0.274677, 0.000000, 1.000000)` | — | pure colour math |
| Form02 record | `(0.275, 0, 1.0)` | 0.000323 | Form02 record |
| V0.29 record | `(0.278, 0, 1.0)` | 0.003323 | `MATERIAL_FINALING_V0_29_PROOF.md` |

**Finding.** The built asset carries the *exact* linear conversion of `#8F00FF`. The two documented
records are both **roundings of that same colour**, Form02 to 3 dp and V0.29 slightly coarser. They
were never a genuine disagreement — this half of the "MAT_C vs V0.29" conflict **dissolves under
unit conversion**, the same failure mode as the earlier scale "conflict".

**Proposed canon:** `#8F00FF` is authoritative; its linear form is `(0.274677, 0, 1)`. Documented
roundings are superseded, not contradicted.

---

## 3. THE COLD-GREY FAMILY — Z-Blue is the single hue

Every cold structural grey in both arcs is `#4B5866` at a different brightness. Tested by
per-channel ratio; "same hue" = max channel deviation from the mean ratio ≤ 5 %.

| Member | Linear | Brightness × Z-Blue | Max channel dev. | Verdict | Source |
|---|---|---|---|---|---|
| `MAT_C3_ZBLUE_GRAPHITE_CALIBRATED` | `(0.018065, 0.025056, 0.034114)` | **0.2568** | **0.00 %** | same hue | measured CE15 scene data |
| `HC_CAP_GRAPHITE` | `(0.011, 0.014, 0.020)` | 0.1501 | 4.43 % | same hue | measured CE15 scene data |
| V0.29 dark titanium | `(0.035, 0.045, 0.065)` | 0.4826 | 4.45 % | same hue | `MATERIAL_FINALING_V0_29_PROOF.md` |
| V0.29 cold-steel rails | `(0.12, 0.16, 0.22)` | 1.6669 | 2.31 % | same hue | `MATERIAL_FINALING_V0_29_PROOF.md` |

**Finding.** `MAT_C3_ZBLUE_GRAPHITE_CALIBRATED` is Z-Blue at exactly **0.2568× on all three
channels — 0.00 % deviation.** That is not an approximation; the built material is a mathematically
pure brightness variant of the canon hue. The V0.29 greys sit in the same family at 0.48× and
1.67×, within tolerance.

**Proposed canon:** one hue (`#4B5866`), N brightness variants, each named by role and recorded
with its factor. The MAT_C ↔ V0.29 "conflict" for graphite/titanium/steel is a **brightness-tier
difference, not a hue difference.**

---

## 4. PORCELAIN PLATE GRADIENT — also one hue

| Material | Linear | Brightness × `#F2EEEA` | Max channel dev. | Applied to |
|---|---|---|---|---|
| `LP_PORC_EDGE_LL` | `(0.883116, 0.848484, 0.813852)` | 0.9920 | 0.29 % | `ZB45_SHELL_LL` |
| `LP_PORC_MID_UL` | `(0.660, 0.635, 0.610)` | 0.7425 | 0.15 % | `ZB45_SHELL_UL` |
| `LP_PORC_ROOT_UL` | `(0.204, 0.196, 0.188)` | 0.2292 | 0.29 % | `ZB45_SHELL_UL` |
| `LP_PORC_ROOT_LL` | `(0.1989, 0.1911, 0.1833)` | 0.2234 | 0.29 % | `ZB45_SHELL_LL` |

*Source: measured CE15 scene data.* Edge → mid → root is a deliberate darkening gradient on one
hue. All four are within 0.29 % — the same family rule as §3.

---

## 5. MEASURED PBR PARAMETERS (verbatim from CE15)

| Material | Base colour (linear) | Metallic | Roughness | Emission colour | Emission strength |
|---|---|---|---|---|---|
| `LIGHT_D1_P3_CORE_ELECTRIC_VIOLET` | `(0.006049, 0.003035, 0.009134)` | 0.05 | 0.34 | `(0.274677, 0, 1.0)` | **1.25** |
| `MAT_C3_ZBLUE_GRAPHITE_CALIBRATED` | `(0.018065, 0.025056, 0.034114)` | 0.72 | 0.45 | — | 0.0 |
| `MAT_C3_SUMI_COATED_METAL_LOCKED_FROM_C2` | `(0.018500, 0.016807, 0.015209)` | 0.80 | 0.40 | — | 0.0 |
| `MAT_C3_SUMI_PROJECTION_LOCKED_FROM_C2` | `(0.016807, 0.015209, 0.013702)` | 0.68 | 0.31 | — | 0.0 |
| `MAT_C3_VIOLET_BLACK_INSET` | `(0.006049, 0.003035, 0.009134)` | 0.46 | 0.55 | — | 0.0 |
| `HC_CAP_GRAPHITE` | `(0.011, 0.014, 0.020)` | 0.55 | 0.68 | — | 0.0 |
| `LP_PORC_*` (4 plates) | see §4 | 0.02 | 0.48 / 0.60 | — | 0.0 |

**Exact-match confirmations** (measured vs MAT_C hex → linear, max Δ < 5×10⁻⁷):
- `MAT_C3_SUMI_COATED_METAL_LOCKED_FROM_C2` == `#252321` — **exact**
- `MAT_C3_VIOLET_BLACK_INSET` == `#120A18` — **exact**

The MAT_C arc is therefore not merely "documented" — it is **literally what is built**.

### Component → material assignment (measured)

| Component | Material |
|---|---|
| P3 core (`ZB42_P3_SINGLE_RECESSED_CORE`) | `LIGHT_D1_P3_CORE_ELECTRIC_VIOLET` |
| Central spine, base receiver, load-path bridge, blunt termination | `MAT_C3_SUMI_COATED_METAL_LOCKED_FROM_C2` |
| Functional rails L/R | `MAT_C3_ZBLUE_GRAPHITE_CALIBRATED` |
| Recessed rails L/R, hub spine key, load joints | `MAT_C3_VIOLET_BLACK_INSET` |
| Shells LL / UL | `LP_PORC_*` gradient (2 slots each) |
| Shells LR / UR | `MAT_C3_ZBLUE_GRAPHITE_CALIBRATED` |
| Drive hub, hub shoulders, arch neck | `HC_CAP_GRAPHITE` |

---

## 6. DISCREPANCY RESOLUTIONS — operator rulings D1–D5, 2026-08-06

All five discrepancies raised by `ZENITH_BLADE_MATERIAL_RECONCILE_VERIFY_01` are **RESOLVED** by
operator ruling. Each resolution keeps the superseded record visible rather than deleting it.

### D1 — Core emission strength — **RESOLVED: canon = 1.25**
| Record | Strength | Standing | Source |
|---|---|---|---|
| **Measured in CE15** | **1.25** | **CANON** | measured CE15 scene data |
| Form02 record | 1.25 | agrees with canon | Form02 record |
| V0.29 record | 0.90 | **HISTORICAL — superseded** | `MATERIAL_FINALING_V0_29_PROOF.md` |

**Canon emission strength = 1.25**, matching the built CE15 asset and the Form02 record. V0.29's
0.90 is historical and no longer authoritative. *Ruling D1, Operator (BOOS BỚP), 2026-08-06.*

The value is load-bearing, not cosmetic: emission strength drives the P3 core-density gate used in
the board's QA (`OUT1_CORE_GATE.json`). Canon and the gated evidence now agree.

### D2 — PBR parameter set — **RESOLVED: canon = measured CE15 values**
| Material role | Metallic | Roughness | Standing | Source |
|---|---|---|---|---|
| Z-Blue graphite (rails, shells LR/UR) | **0.72** | **0.45** | **CANON** | measured CE15 scene data |
| Sumi coated metal (spine, chassis, load path) | **0.80** | **0.40** | **CANON** | measured CE15 scene data |
| Violet-black inset (recessed rails, joints, hub key) | **0.46** | **0.55** | **CANON** | measured CE15 scene data |
| P3 core | **0.05** | **0.34** | **CANON** | measured CE15 scene data |
| V0.29 dark titanium | 0.82 | 0.40 | **HISTORICAL — never built** | `MATERIAL_FINALING_V0_29_PROOF.md` |
| V0.29 cold-steel rails | 0.95 | 0.20 | **HISTORICAL — never built** | `MATERIAL_FINALING_V0_29_PROOF.md` |

Canon PBR is what is actually built. The V0.29 parameter set is recorded as historical and is
noted as **never built** — it corresponds to no material present in CE15, and its brightness
factors (0.4826, 1.6669) match no CE15 blade material. *Ruling D2, Operator (BOOS BỚP),
2026-08-06.*

Additional measured values carried as canon: `MAT_C3_SUMI_PROJECTION` 0.68 / 0.31 ·
`HC_CAP_GRAPHITE` 0.55 / 0.68 · porcelain plates 0.02 / 0.48 (edge, mid) and 0.02 / 0.60 (root).
*Source: measured CE15 scene data.*

### D3 — Shell plate asymmetry — **RESOLVED: DELIBERATE**
The left/right shell difference is **intended design, not an error**:

| Plate | Material | Hue |
|---|---|---|
| `ZB45_SHELL_LL`, `ZB45_SHELL_UL` | `LP_PORC_*` gradient | porcelain `#F2EEEA` |
| `ZB45_SHELL_LR`, `ZB45_SHELL_UR` | `MAT_C3_ZBLUE_GRAPHITE_CALIBRATED` | Z-Blue `#4B5866` × 0.2568 |

*Ruling D3-mat, Operator (BOOS BỚP), 2026-08-06. Basis: measured CE15 scene data
(`MATERIAL_RECONCILE_VERIFY_01`) + operator acceptance of Board V1, which shows the asymmetry.*

The canon lock's wording *"Four porcelain outer shell plates"* is corrected by
[ZENITH_BLADE_CANON_LOCK_V1_ERRATA_01.md](ZENITH_BLADE_CANON_LOCK_V1_ERRATA_01.md). The original
signed lock is **left byte-frozen** as the audit record and was not edited.

### D4 — `#4B5866` is a pure hue anchor — **RESOLVED: recorded as such**
`#4B5866` at factor 1.0 is used by **no material on the blade**. It is canon as the **hue anchor**
for the entire cold-grey family — the reference every member is scaled from — and **not** as a
directly-applied material. Any future material claiming "Z-Blue" must be a recorded brightness
factor of this anchor. *Ruling D4, Operator (BOOS BỚP), 2026-08-06. Anchor provenance:
`design_system/mikage-cine-color-contract.md`, locked 2026-06-04.*

### D5 — Helmet violet — **RESOLVED: OUT OF SCOPE**
`LOOKDEV_V0_2_restrained_violet_slit_halo_only` — emission `(0.42, 0.0, 0.82)`, strength 0.72,
2 users, applied to **no blade object** — is helmet/actor-scope (the sensor-slit halo). It is
**explicitly OUT OF SCOPE of this material canon** and must not be merged into the blade core
family. *Ruling D5, Operator (BOOS BỚP), 2026-08-06. Source: measured CE15 scene data.*

---

## 7. WHAT THIS DOCUMENT ESTABLISHES

- **Core violet:** `#8F00FF` = linear `(0.274677, 0, 1)`, emission strength **1.25**. One colour; the Form02 and V0.29 colour records are roundings of it.
- **Cold greys:** one hue `#4B5866`, brightness-tiered; the anchor itself is never applied directly. MAT_C and V0.29 greys are the same hue at different tiers.
- **Porcelain:** one hue `#F2EEEA`, brightness-tiered edge → root.
- **Sumi `#252321` and violet-black inset `#120A18`:** carried from MAT_C unchanged; confirmed exact in the built asset.
- **PBR:** the measured CE15 values are canon; the V0.29 parameter set is historical and was never built.
- **Shell asymmetry:** deliberate — porcelain LL/UL, Z-Blue graphite LR/UR.
- **Out of scope:** the helmet slit-halo violet.

**Superseded, retained for audit:** V0.29 emission strength 0.90 · V0.29 PBR parameter set ·
V0.29 / Form02 core-colour roundings.

**Not addressed by this document** (unchanged, still open): CE15 ↔ actor collision/clearance
**NOT VERIFIED** · `PHYSICAL_VOLUME_EXACT_VALUE` **NOT VERIFIED** · canon-authority promotion
packet **OPEN/PENDING** · CE12 alpha silhouette mask **MISSING** · CE12/CE13 standalone rulings
**MISSING** · in-scene actor height **UNCONFIRMED**.

---

**STATUS: APPROVED — Operator (BOOS BỚP), 2026-08-06**

**ASSET LOCK: NOT ISSUED · PRODUCTION READY: NOT ISSUED.** This document approves material values
and naming only. It confers no asset lock and no production-ready status.

*Verified 2026-08-06 by `ZENITH_BLADE_MATERIAL_RECONCILE_VERIFY_01` (Blender read-only inspection;
CE15 blend byte-identical pre/post). Issued 2026-08-06 by `ZENITH_BLADE_MATERIAL_CANON_V1_ISSUE`.
No material, geometry or asset was edited by either task.*
