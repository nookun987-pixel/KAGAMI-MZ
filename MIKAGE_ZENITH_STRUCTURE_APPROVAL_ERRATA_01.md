# MIKAGE ZENITH STRUCTURE APPROVAL & LOCK READINESS — ERRATA 01

**STATUS: APPROVED — Operator (BOOS BỚP) · Ruled 2026-08-06 (Cowork session) · Signed 2026-08-07**

Corrects the weapon-core colour in
`docs/handoff/MIKAGE_ZENITH_STRUCTURE_APPROVAL_AND_LOCK_READINESS_20260602.md`.

> **The original approval document is NOT edited.** It remains byte-frozen at
> sha256 `e48335bb83663a37acb1728c4c944e0f6359e3a193ced8dc816eb5105b3b629c`
> as the signed record of the 2026-06-02 operator lock. This errata is the correction of record; the
> two documents are read together — the pattern established by
> [ZENITH_BLADE_CANON_LOCK_V1_ERRATA_01.md](ZENITH_BLADE_CANON_LOCK_V1_ERRATA_01.md).

> **Mechanical fact-alignment only, same substance as the two crimson errata signed in this round.**
> No new decision is made. The document's **structural** invariants — the synced 3-phase model, the
> B4C-outer / Titanium-inner two-layer materials, and the Compact-Idle REST block form — remain
> **ABSOLUTE INVARIANT and are untouched**.

---

## 1. Document corrected

| Field | Value |
|---|---|
| Document | `docs/handoff/MIKAGE_ZENITH_STRUCTURE_APPROVAL_AND_LOCK_READINESS_20260602.md` |
| Status of original | `🔒 LOCK EXECUTED 2026-06-02` (operator command "oki lock") · STRUCTURE_CANON = LOCKED · ABSOLUTE INVARIANT |
| Frozen sha256 (verified on disk 2026-08-07) | `e48335bb83663a37acb1728c4c944e0f6359e3a193ced8dc816eb5105b3b629c` |
| Second byte-identical copy on disk | `_tmp/zenith_blade_design_bible/selected_sources/02_OPERATOR_RULINGS/MIKAGE_ZENITH_STRUCTURE_APPROVAL_AND_LOCK_READINESS_20260602.md` — same sha256; this errata governs both |
| Sections corrected | the synced-phase table, **P3 row** (line 15); and the two-layer material line (line 22) |
| Bytes changed in either copy | **0** |

This is the **third and final** of the three crimson instances identified by
`ZENITH_BLADE_CANON_EVIDENCE_MATRIX.md` topic **L** and by
[ZENITH_BLADE_LINEAGE_AUDIT_01.md](ZENITH_BLADE_LINEAGE_AUDIT_01.md) §1 F6. The other two are closed
by [MIKAGE_ZENITH_CANON_V2_ERRATA_01.md](MIKAGE_ZENITH_CANON_V2_ERRATA_01.md) and
[MIKAGE_CINE_COLOR_CONTRACT_ERRATA_01.md](MIKAGE_CINE_COLOR_CONTRACT_ERRATA_01.md).

---

## 2. Correction A — synced-phase table, P3 row (line 15)

**Reads (original, unchanged on disk):**

```
| P3 | `Tri-Phase Final / Overdrive` (core #E60000 max, Orbital-Logic UI 3° wrap,
       acid pH1.2 vapor, thermal mirage >43°C) | `Execution` | full release, max visual violence |
```

**Should read:**

```
| P3 | `Tri-Phase Final / Overdrive` (core #8F00FF electric violet, exactly one recessed
       core, no wash/halo/ambient/fill; acid pH1.2 vapor, thermal mirage >43°C)
       | `Execution` | full release, max visual violence |
       [core colour SUPERSEDED from #E60000 — operator rulings #54->#58, 2026-07-06/07;
        reaffirmed D7, 2026-08-06. Red/crimson BANNED on this weapon at every phase.
        Orbital-Logic UI 3° wrap: colour superseded with the reversal, but the FEATURE
        itself has never been ruled and is ABSENT from the built CE15 asset — UNCONFIRMED.]
```

## 3. Correction B — two-layer material line (line 22)

**Reads (original, unchanged on disk):**

```
- Inner = black rusty Titanium load-bearing frame + Ferro-calcium core (#E60000),
  exposed when the shell splits (P2/P3).
```

**Should read:**

```
- Inner = black rusty Titanium load-bearing frame + Ferro-calcium core, exposed when the
  shell splits (P2/P3). The core's PHYSICAL STRUCTURE (Ferro-calcium) is unchanged and
  remains canon; its EMISSIVE COLOUR is #8F00FF electric violet, not #E60000.
  [colour SUPERSEDED — operator rulings #54->#58, 2026-07-06/07; reaffirmed D7, 2026-08-06]
```

---

## 4. Basis — the superseding authority

| # | Source | Date | What it establishes |
|---|---|---|---|
| 1 | `docs/handoff/MIKAGE_ZENITH_BLADE_SPEC_V1.md:5–14` — banner recording operator visual rulings **#54 → #58** | **2026-07-06/07** | "Every reference in this document to a **red / crimson / `#E60000` weapon core, red heat-mirage, or red Orbital-Logic UI on the ZENITH BLADE is SUPERSEDED**… the core/seam signal is **electric violet, `#8F00FF` family**… **Red/crimson is BANNED on this weapon at every phase.**" |
| 2 | `production/character/reviews/MIKAGE_ZENITH_BLADE_3PHASE_REBUILD_V0_4_VISUAL_RULING.md` | 2026-07-06/07 | Measurement method: rendered core-body median hue 268–280°, R/B 0.45–0.65. |
| 3 | `MIKAGE_ZENITH_BLADE_SPEC_V1.md:111` — V0.15 SHELL FORM ruling, item 4 | 2026-07-24 | "P3: … lộ đúng một electric-violet weapon core ở trung tâm." |
| 4 | `ZENITH_BLADE_FINAL_DESIGN_OPERATOR_RULING.md` — decision **D7** | 2026-08-06 | `#8F00FF` authoritative; red banned at every phase. **Entity crimson canon explicitly preserved.** |
| 5 | `ZENITH_BLADE_MATERIAL_CANON_V1.md` §2, §5 (APPROVED) | 2026-08-06 | Core violet measured in CE15 as linear `(0.274677, 0.000000, 1.000000)` — the **exact** conversion of `#8F00FF`, to 6 dp. Emission strength 1.25. No crimson anchor exists in the family. |
| 6 | `ZENITH_BLADE_CANON_LOCK_V1.md` | 2026-08-06 | LOCKED: "P3 single recessed violet core, `#8F00FF` (ruling D7), restrained signal". |

---

## 5. What is NOT changed

- **The 2026-06-02 structural lock stands in full.** The synced 3-phase model (P1 Compact-Idle →
  P2 Brutal Industrial Activation → P3 Tri-Phase Final/Overdrive), the B4C-outer / black-Titanium-inner
  two-layer material architecture, the Compact-Idle REST block form, the Flux-Pinning back-carry, and
  the 350 kg mass all remain **ABSOLUTE INVARIANT**. This errata corrects **colour only**.
- **The Ferro-calcium core as physical structure is unchanged and remains canon.** Only its emissive
  colour is superseded. This is the distinction the promotion packet asked for
  (point 2: "Ferro-calcium core as physical structure, with weapon color governed separately by the
  P3-only violet contract").
- **Entity crimson canon is unchanged.** Crimson `#E60000` for damage/dissolve on character renders
  and covers remains canon per `docs/character/MIKAGE_PUBLIC_LORE_STANDARD_V1.md` §ART canon and D7.
- **`ASSET_LOCK_STAMPED_BY_CLAUDE: NO` and `PRODUCTION_READY: NO`** in the original are unchanged and
  remain correct.
- No geometry, material, asset or hash changes. CE15 anchor
  `465b212ef49a4b8ad3eacd682757d9fe0512fa5d242c1b09611439b9c76c3129` unaffected.

---

## 6. Carried forward as UNCONFIRMED

| Item | Status |
|---|---|
| Orbital-Logic UI 3° wrap (line 15, and line 27 "Thermal mirage / Orbital-Logic UI / acid vapor = P3 effects") — absent from built CE15, **no ruling** dropping the feature | **UNCONFIRMED** |
| Acid pH1.2 vapor and thermal mirage >43°C as P3 render effects — absent from built CE15, **no ruling** | **UNCONFIRMED** |

Both are the same open sub-item tracked in
[ZENITH_BLADE_V0_1_DISPOSITION.md](ZENITH_BLADE_V0_1_DISPOSITION.md) §4b point 5 and in the board
manifest `unresolved` list. **This errata does not decide them.**

---

## 7. Scope

Colour wording only. Grants no asset lock, no production-ready status, no canon authority.
`ASSET LOCK: NOT ISSUED · PRODUCTION READY: NOT ISSUED`.

---

```
ERRATA:            MIKAGE_ZENITH_STRUCTURE_APPROVAL_ERRATA_01
CORRECTS:          docs/handoff/MIKAGE_ZENITH_STRUCTURE_APPROVAL_AND_LOCK_READINESS_20260602.md
                   (byte-frozen, 0 bytes changed; governs both byte-identical copies on disk)
                   scope: P3 core colour + two-layer material core colour ONLY
FROZEN SHA256:     e48335bb83663a37acb1728c4c944e0f6359e3a193ced8dc816eb5105b3b629c
ISSUED:            2026-08-07  ·  ZENITH_BLADE_PAPERWORK_ISSUE_01
STATUS:            APPROVED — Operator (BOOS BỚP) · Ruled 2026-08-06 (Cowork session) · Signed 2026-08-07
SIGNED BY:         Operator (BOOS BỚP / Phi Hùng)
SIGNATURE DATE:    Ruled 2026-08-06 (Cowork session) · Signed 2026-08-07
ASSET LOCK:        NOT ISSUED
PRODUCTION READY:  NOT ISSUED
```

---

**STATUS: APPROVED — Operator (BOOS BỚP) · Ruled 2026-08-06 (Cowork session) · Signed 2026-08-07.** In force. Mechanical fact-alignment only;
no new decision. The corrected document was not modified. No commit, no push.
