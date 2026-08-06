# ZENITH BLADE — CANON LOCK V1 · ERRATA 01

**STATUS: APPROVED — Operator (BOOS BỚP), 2026-08-06**

Corrects one wording line in [ZENITH_BLADE_CANON_LOCK_V1.md](ZENITH_BLADE_CANON_LOCK_V1.md).

> **The original lock document is NOT edited.** It remains byte-frozen at
> sha256 `a2f340678aa27725c3f09b6fd42c4ebc3017946425ffcdd4832575bf2541427c`
> as the signed audit record. This errata is the correction of record; the two
> documents are read together.

---

## Correction

**Document corrected:** `ZENITH_BLADE_CANON_LOCK_V1.md`
**Section:** `LOCKED (visual / geometry / behaviour)`

**Reads (original, unchanged on disk):**

```
  - Four porcelain outer shell plates (porcelain #F2EEEA per ruling D3)
```

**Should read:**

```
  - Shell plates: porcelain LL/UL (#F2EEEA per ruling D3) · Z-Blue graphite
    LR/UR — deliberate asymmetry (operator ruling D3-mat, 2026-08-06)
```

---

## Basis

| Source | Finding |
|---|---|
| Measured CE15 scene data (`ZENITH_BLADE_MATERIAL_RECONCILE_VERIFY_01`, Blender read-only, 2026-08-06) | `ZB45_SHELL_LL` and `ZB45_SHELL_UL` carry the `LP_PORC_*` porcelain gradient. `ZB45_SHELL_LR` and `ZB45_SHELL_UR` carry `MAT_C3_ZBLUE_GRAPHITE_CALIBRATED` — Z-Blue `#4B5866` at brightness factor 0.2568. |
| Operator acceptance of Board V1 | The board that was accepted, and on which the canon lock was signed, **shows this asymmetry**. The operator ruled it deliberate design. |
| Operator ruling D3-mat, 2026-08-06 | Shell asymmetry is **DELIBERATE**, not an error. |

The original wording described four porcelain plates; the built and accepted form has two. The
correction records the form that was actually accepted.

---

## Scope of this errata

- **Wording only.** No geometry, material, asset or hash of the CE15 candidate changes.
- The canon lock's other LOCKED and NOT LOCKED entries are **unaffected**.
- `ASSET LOCK: NOT ISSUED` and `PRODUCTION READY: NOT ISSUED` are **unchanged** by this errata.
- `technical_actor_clearance` remains **NOT_VERIFIED**; the CE15 ↔ actor collision/clearance
  re-proof is still outstanding.

## Related

- Material values and naming for both shell families: [ZENITH_BLADE_MATERIAL_CANON_V1.md](ZENITH_BLADE_MATERIAL_CANON_V1.md) (APPROVED 2026-08-06) — see §4 (porcelain gradient), §3 (Z-Blue family) and §6 D3.
- Machine-readable record: [ZENITH_BLADE_FINAL_DESIGN_BOARD_V1_MANIFEST.json](ZENITH_BLADE_FINAL_DESIGN_BOARD_V1_MANIFEST.json) → `canon_lock_errata`.

---

**STATUS: APPROVED — Operator (BOOS BỚP), 2026-08-06**

*Issued by task `ZENITH_BLADE_MATERIAL_CANON_V1_ISSUE`, 2026-08-06. No asset, geometry or material
was edited. The corrected document was not modified.*
