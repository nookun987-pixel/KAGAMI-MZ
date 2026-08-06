# ZENITH BLADE — DELTA TABLE 01 · ERRATA 01

**STATUS: APPROVED — Operator (BOOS BỚP) · Ruled 2026-08-06 (Cowork session) · Signed 2026-08-07**

Corrects one factual description in [ZENITH_BLADE_DELTA_TABLE_01.md](ZENITH_BLADE_DELTA_TABLE_01.md)
and the matching annotation line on
[ZENITH_BLADE_MOCK_VS_CE15_SIDEBYSIDE.png](ZENITH_BLADE_MOCK_VS_CE15_SIDEBYSIDE.png).

> **Neither corrected artifact is edited.** Both remain byte-frozen as the audit record. This errata
> is the correction of record; the documents are read together — the pattern established by
> [ZENITH_BLADE_CANON_LOCK_V1_ERRATA_01.md](ZENITH_BLADE_CANON_LOCK_V1_ERRATA_01.md).

> **Mechanical fact-alignment only.** No new decision is made. **The RULED verdict for delta (f) is
> unaffected.**

---

## 1. Documents corrected

| Field | Value |
|---|---|
| Document A | `ZENITH_BLADE_DELTA_TABLE_01.md` |
| Frozen sha256 (verified on disk 2026-08-07) | `bbdc5823ad671808e3e270f8f3b2c5748d4ce40c1fd3df30200ea6bb45084a8a` |
| Section corrected | Table **A**, row **f** — "Porcelain mass", CE15 column |
| Document B | `ZENITH_BLADE_MOCK_VS_CE15_SIDEBYSIDE.png` (3600 × 3050 forensic composite) |
| Frozen sha256 (verified on disk 2026-08-07) | `e050acf0351942669e5ab6f5ab7a065c88898cb86559be3cf263e5144d7f75ba` |
| Element corrected | Panel-C annotation list, line `f′` |
| Bytes changed in either original | **0** |
| Produced by | `ZENITH_BLADE_CODEX_LINEAGE_AUDIT_01`, 2026-08-07 |

---

## 2. Correction — Document A (delta table, row f)

**Reads (original, unchanged on disk):**

```
Four porcelain shell plates ZB45_SHELL_UL/UR/LL/LR, #F2EEEA, metallic 0, roughness 0.46.
```

**Should read:**

```
Porcelain shell plates ZB45_SHELL_LL and ZB45_SHELL_UL (LP_PORC_* gradient on the
#F2EEEA hue, metallic 0.02, roughness 0.48/0.60) + Z-Blue graphite shell plates
ZB45_SHELL_LR and ZB45_SHELL_UR (MAT_C3_ZBLUE_GRAPHITE_CALIBRATED = #4B5866 x 0.2568,
metallic 0.72, roughness 0.45). The left/right asymmetry is DELIBERATE
(operator ruling D3-mat, 2026-08-06).
```

## 3. Correction — Document B (composite, panel-C annotation)

**Reads (original, unchanged on disk):**

```
f'  four porcelain shell plates UL/UR/LL/LR
```

**Should read:**

```
f'  porcelain shell plates LL/UL + Z-Blue graphite shell plates LR/UR
    (deliberate asymmetry, operator ruling D3-mat)
```

---

## 4. Reason for the correction

The audit described the **MAT_C-arc** material assignment (2026-07-31), in which all four shell
plates carry porcelain, and presented it as the **CE15** state. CE15's built state differs.

| Source | What it establishes |
|---|---|
| `production/character/reviews/MIKAGE_ZENITH_BLADE_MAT_C1_REPORT.json` / `MAT_C2` / `MAT_C3` | `material_system.porcelain.objects` = `["ZB45_SHELL_LL","ZB45_SHELL_LR","ZB45_SHELL_UL","ZB45_SHELL_UR"]` — **all four**, at the MAT_C stage. This is what the audit read. |
| `ZENITH_BLADE_MATERIAL_CANON_V1.md` §4, §5, §6 D3 (APPROVED, Operator BOOS BỚP, 2026-08-06) | Measured CE15 scene data: shells **LL/UL** carry the `LP_PORC_*` porcelain gradient; shells **LR/UR** carry `MAT_C3_ZBLUE_GRAPHITE_CALIBRATED`. Ruling **D3-mat**: the asymmetry is **DELIBERATE**, not an error. |
| `ZENITH_BLADE_CANON_LOCK_V1_ERRATA_01.md` (APPROVED 2026-08-06) | Already corrected the identical wording in the canon lock itself: "Four porcelain outer shell plates" → "porcelain LL/UL · Z-Blue graphite LR/UR". |

**Root cause:** the audit's evidence sweep drew delta (f)'s CE15 column from the MAT_C reports rather
than from the CE15 material canon, and the two arcs disagree on this one point. The error was
self-reported by Claude Code at the close of `ZENITH_BLADE_PAPERWORK_CLOSEOUT_01` on 2026-08-07 and
is corrected here.

---

## 5. What is NOT changed

- **The verdict for delta (f) remains RULED.** Its governing authority is unchanged:
  `MIKAGE_ZENITH_BLADE_SPEC_V1.md` §1, STRUCTURE CANON LOCKED 2026-06-02 — "outer = B4C porcelain
  shell… inner = black rusty Titanium load-bearing frame". The finding that a porcelain outer mass
  was added relative to V0.1 (which used steel/platinum) stands. Only the *count and distribution*
  of porcelain plates in the built CE15 asset is corrected.
- **No other row of the delta table is affected.** Deltas a, b, c, d, e, g and process findings
  P1–P7 are unchanged.
- **No finding of `ZENITH_BLADE_LINEAGE_AUDIT_01.md` is reversed.** §5f's authority citation and its
  RULED verdict stand; its sentence "Four porcelain shell plates `ZB45_SHELL_UL/UR/LL/LR`, `#F2EEEA`,
  metallic 0, roughness 0.46" carries the same error and is corrected by this errata by reference.
- **No geometry, material, asset or candidate hash changes.** CE15 anchor
  `465b212ef49a4b8ad3eacd682757d9fe0512fa5d242c1b09611439b9c76c3129` is unaffected.
- **The composite PNG is not regenerated.** Regenerating it would change its hash and break the audit
  record; this errata governs the annotation instead.

---

## 6. Scope

Wording and fact-alignment only. Grants no asset lock, no production-ready status, no canon
authority. `ASSET LOCK: NOT ISSUED · PRODUCTION READY: NOT ISSUED`.

---

```
ERRATA:            ZENITH_BLADE_DELTA_TABLE_01_ERRATA_01
CORRECTS:          ZENITH_BLADE_DELTA_TABLE_01.md          (byte-frozen, 0 bytes changed)
                   ZENITH_BLADE_MOCK_VS_CE15_SIDEBYSIDE.png (byte-frozen, 0 bytes changed)
FROZEN SHA256 A:   bbdc5823ad671808e3e270f8f3b2c5748d4ce40c1fd3df30200ea6bb45084a8a
FROZEN SHA256 B:   e050acf0351942669e5ab6f5ab7a065c88898cb86559be3cf263e5144d7f75ba
ISSUED:            2026-08-07  ·  ZENITH_BLADE_PAPERWORK_ISSUE_01
STATUS:            APPROVED — Operator (BOOS BỚP) · Ruled 2026-08-06 (Cowork session) · Signed 2026-08-07
SIGNED BY:         Operator (BOOS BỚP / Phi Hùng)
SIGNATURE DATE:    Ruled 2026-08-06 (Cowork session) · Signed 2026-08-07
ASSET LOCK:        NOT ISSUED
PRODUCTION READY:  NOT ISSUED
```

---

**STATUS: APPROVED — Operator (BOOS BỚP) · Ruled 2026-08-06 (Cowork session) · Signed 2026-08-07.** In force. Mechanical fact-alignment only;
no new decision. The corrected documents were not modified. No commit, no push.
