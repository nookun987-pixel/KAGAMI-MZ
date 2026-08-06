# MIKAGE ZENITH CANON V2 — ERRATA 01

**STATUS: APPROVED — Operator (BOOS BỚP) · Ruled 2026-08-06 (Cowork session) · Signed 2026-08-07**

**Drafted:** 2026-08-07 by task `ZENITH_BLADE_PAPERWORK_CLOSEOUT_01`
**Drafted by:** Claude Code (documentation only — no geometry, render, material or Blender action taken)
**Origin:** [ZENITH_BLADE_LINEAGE_AUDIT_01.md](ZENITH_BLADE_LINEAGE_AUDIT_01.md) §6.2, open item 2;
independently reproduces topic **L** of [ZENITH_BLADE_CANON_EVIDENCE_MATRIX.md](ZENITH_BLADE_CANON_EVIDENCE_MATRIX.md)

Corrects one line in `MIKAGE_ZENITH_CANON_V2.md` §2.4 WEAPON — ZENITH BLADE.

> **The original canon document is NOT edited.** It remains byte-frozen at
> sha256 `4bafe29a2d8a60c4c54a6de4dd6920b003ddf56679f72bc79c405a7e7b1d5e9c`
> as the signed record. This errata is the correction of record and the two
> documents are read together — the pattern established by
> [ZENITH_BLADE_CANON_LOCK_V1_ERRATA_01.md](ZENITH_BLADE_CANON_LOCK_V1_ERRATA_01.md).

> **THIS ERRATA IS IN FORCE.** Ruled by the Operator (BOOS BỚP) on 2026-08-06 (Cowork session); signed 2026-08-07. It is the
> correction of record; §2.4 and this errata are read together. The contradiction recorded in
> §4 is CLOSED for this document. §7 is retained as the historical record of the declined
> alternative. The third crimson instance named in §4 is closed separately — see
> [MIKAGE_ZENITH_STRUCTURE_APPROVAL_ERRATA_01.md](MIKAGE_ZENITH_STRUCTURE_APPROVAL_ERRATA_01.md).

---

## 1. Document corrected

| Field | Value |
|---|---|
| Document | `MIKAGE_ZENITH_CANON_V2.md` — "MIKAGE ZENITH — SINGLE SOURCE OF TRUTH V2.0" |
| Status of original | `**Status:** LOCKED` · `**Last Updated:** 2026-03-19` · `**Authority:** Production Canon` |
| Frozen reference (sha256, verified on disk 2026-08-07) | `4bafe29a2d8a60c4c54a6de4dd6920b003ddf56679f72bc79c405a7e7b1d5e9c` |
| Section corrected | `### 2.4 WEAPON — ZENITH BLADE — LOCKED` → `**Energy Signature:**`, line 145 |
| Bytes changed in the original | **0** |

> **Note on the existing header override.** The original already carries a 2026-06-13 operator
> COLOR OVERRIDE banner (lines 8–12) stating that the palette in the file is no longer the standard
> for public/brand, while "*Phần phi-màu (body / mask / weapon / physics / lighting ratio) vẫn hiệu
> lực*" — the non-colour parts remain in force. That banner addresses the **brand/public palette**.
> It does **not** reach §2.4's weapon **Energy Signature**, which is a cine/asset-layer specification
> and is still read as LOCKED. This errata closes that specific residue.

---

## 2. Correction

**Reads (original, unchanged on disk — lines 144–148):**

```
**Energy Signature:**
- Deep crimson glowing core (#E60000)
- Directional steam venting
- Heat mirage distortion
- Orbital Logic UI text wrapping blade in 3D
```

**Should read:**

```
**Energy Signature:**
- Single recessed electric-violet core (#8F00FF), P3 only, exactly one core,
  no wash / halo / ambient / fill.  [SUPERSEDES "Deep crimson glowing core
  (#E60000)" — operator rulings #54->#58, 2026-07-06/07; reaffirmed D7,
  2026-08-06.  Red/crimson is BANNED on this weapon at every phase.]
- Directional steam venting
- Heat mirage distortion
- Orbital Logic UI text wrapping blade in 3D
  [Colour superseded with the core reversal above; the FEATURE itself has
  never been ruled on and is ABSENT from the built CE15 asset.  Status:
  UNCONFIRMED — see ERRATA 01 section 5.]
```

---

## 3. Basis — the superseding authority

| # | Source | Date | What it establishes |
|---|---|---|---|
| 1 | `docs/handoff/MIKAGE_ZENITH_BLADE_SPEC_V1.md:5–14` — header banner recording operator visual rulings **#54 → #58** | **2026-07-06/07** | "Every reference in this document to a **red / crimson / `#E60000` weapon core, red heat-mirage, or red Orbital-Logic UI on the ZENITH BLADE is SUPERSEDED**… the Zenith Blade core/seam signal is **electric violet, `#8F00FF` family**… **Red/crimson is BANNED on this weapon at every phase.**" |
| 2 | `production/character/reviews/MIKAGE_ZENITH_BLADE_3PHASE_REBUILD_V0_4_VISUAL_RULING.md` | 2026-07-06/07 | Established the measurement method: rendered core-body median hue 268–280°, R/B 0.45–0.65. |
| 3 | `MIKAGE_ZENITH_BLADE_SPEC_V1.md:111` — operator ruling "V0.15 SHELL FORM", item 4 | 2026-07-24 | "P3: … lộ đúng một electric-violet weapon core ở trung tâm." |
| 4 | `MIKAGE_ZENITH_BLADE_SPEC_V1.md:133` — operator ruling "ORIGINAL ZENITH BLADE FORM", item 7 | 2026-07-28 | "P3 retains exactly one recessed electric-violet central core." |
| 5 | `ZENITH_BLADE_FINAL_DESIGN_OPERATOR_RULING.md` — operator decision **D7** | 2026-08-06 | "`#8F00FF` electric violet is authoritative… red banned on the weapon at every phase." **Entity crimson canon explicitly preserved.** |
| 6 | `ZENITH_BLADE_CANON_LOCK_V1.md` | 2026-08-06 | LOCKED: "P3 single recessed violet core, `#8F00FF` (ruling D7), restrained signal". |
| 7 | `ZENITH_BLADE_MATERIAL_CANON_V1.md` §1, §2 (APPROVED) | 2026-08-06 | Core violet `#8F00FF` = linear `(0.274677, 0, 1)`, measured **exact to 6 dp** in the CE15 asset; emission strength 1.25. No crimson anchor exists in the family. |
| 8 | Measurement, `ZENITH_BLADE_CODEX_LINEAGE_AUDIT_01`, read-only | 2026-08-07 | `OUT1_HERO_P3_85MM.png` (unannotated CE15 hero): **0** crimson-family pixels. |

---

## 4. The contradiction this closes

Recorded twice, independently:

> "Table literally states `core #E60000 max` (crimson) — this text was never edited after the violet
> override… **3 separate locked/invariant documents still say crimson in the table itself.**
> **OPERATOR RULING REQUIRED.**"
> — `ZENITH_BLADE_CANON_EVIDENCE_MATRIX.md`, topic **L**

> "`MIKAGE_ZENITH_CANON_V2.md` §2.4 still specifies 'Deep crimson glowing core (`#E60000`)' … as
> LOCKED… superseded *in effect* by later operator rulings, but neither document carries an
> amendment."
> — `ZENITH_BLADE_LINEAGE_AUDIT_01.md` §1 F6, §6.2

This errata closes the `MIKAGE_ZENITH_CANON_V2.md` instance. The
`design_system/mikage-cine-color-contract.md` instance is closed separately by
[MIKAGE_CINE_COLOR_CONTRACT_ERRATA_01.md](MIKAGE_CINE_COLOR_CONTRACT_ERRATA_01.md), APPROVED (ruled 2026-08-06, signed 2026-08-07).

> **Third instance — NOT closed by this errata.** Evidence Matrix topic L names a third document,
> `MIKAGE_ZENITH_STRUCTURE_APPROVAL_AND_LOCK_READINESS_20260602.md`, whose P1/P2/P3 table still reads
> "core `#E60000` max" under an ABSOLUTE INVARIANT stamp. That document was **not** in this task's
> scope and has **no errata drafted**. It remains an open contradiction. Recorded here so it is not
> mistaken for resolved.

---

## 5. Carried forward as UNCONFIRMED — not resolved by this errata

Two §2.4 features are absent from the built CE15 asset with **no ruling found** dropping them. This
errata **records** their status; it does not decide them.

| §2.4 feature | Line | Built state | Status |
|---|---|---|---|
| "Orbital Logic UI text wrapping blade in 3D" | 148 | Absent from CE15 | **UNCONFIRMED** — its *colour* is superseded by the #54→#58 reversal, but no ruling drops the feature |
| "Rotating Enso core at hilt" | 152 | Absent from CE15 | **UNCONFIRMED** — no ruling found |

Additionally, and unchanged by this errata, these §2.4 clauses remain **NOT VERIFIED** (no
measurement exists anywhere in the corpus): "Thick spine, ultra-thin edge / Appleseed geometry",
"Mass: 350kg" (`PHYSICAL_VOLUME_EXACT_VALUE: NOT VERIFIED`), and "Hilt: 6 inches".

One §2.4 clause is superseded by a *different*, earlier authority and is likewise untouched here:
"Dark rusty titanium scrap plates" as the outer material, superseded by the two-layer B4C-porcelain /
titanium ruling in `MIKAGE_ZENITH_BLADE_SPEC_V1.md` §1, STRUCTURE CANON LOCKED 2026-06-02.

---

## 6. Scope of this errata

- **Wording only.** No geometry, material, asset, colour value or hash changes.
- §2.4's other entries — classification, geometry ("Absolutely straight (zero curvature)"),
  dimensions ("Length: 35-58 inches", reconciled 2026-08-06 as 1.200 m = 47.2441 in, inside range),
  mechanical behaviour, and the Forbidden Traits list — are **unaffected**.
- All non-weapon sections of `MIKAGE_ZENITH_CANON_V2.md` are **unaffected**.
- **Entity crimson canon is unchanged.** Crimson `#E60000` for damage/dissolve on character renders
  and covers remains canon per `docs/character/MIKAGE_PUBLIC_LORE_STANDARD_V1.md` §ART canon and
  operator decision D7.
- This errata grants no asset lock, no production-ready status, and no canon authority.

---

## 7. If the operator declines to sign — HISTORICAL (superseded by the 2026-08-06 ruling)

`MIKAGE_ZENITH_CANON_V2.md` §2.4 continues to specify a crimson `#E60000` weapon core under a LOCKED
heading while the ruled, built and canon-locked weapon is violet-only. The contradiction stays open
and stays recorded (Evidence Matrix topic L; audit §6.2). No asset change is implied either way — the
operator rulings of 2026-07-06/07 and D7 continue to govern the built weapon in practice, and any
future reader of §2.4 must be pointed at those rulings manually.

---

## 8. Signature block

```
ERRATA:            MIKAGE_ZENITH_CANON_V2_ERRATA_01
CORRECTS:          MIKAGE_ZENITH_CANON_V2.md  section 2.4  (byte-frozen, 0 bytes changed)
FROZEN SHA256:     4bafe29a2d8a60c4c54a6de4dd6920b003ddf56679f72bc79c405a7e7b1d5e9c
DRAFTED:           2026-08-07  ·  ZENITH_BLADE_PAPERWORK_CLOSEOUT_01
STATUS:            APPROVED — Operator (BOOS BỚP) · Ruled 2026-08-06 (Cowork session) · Signed 2026-08-07
SIGNED BY:         Operator (BOOS BỚP / Phi Hùng)
SIGNATURE DATE:    Ruled 2026-08-06 (Cowork session) · Signed 2026-08-07
ASSET LOCK:        NOT ISSUED
PRODUCTION READY:  NOT ISSUED
```

---

**STATUS: APPROVED — Operator (BOOS BỚP) · Ruled 2026-08-06 (Cowork session) · Signed 2026-08-07.** In force. Grants no asset lock and no production-ready status — see the guard lines above.
The corrected document was not modified. No commit, no push.
