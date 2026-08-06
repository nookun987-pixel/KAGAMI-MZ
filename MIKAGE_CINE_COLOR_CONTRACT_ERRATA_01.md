# MIKAGE CINE COLOR CONTRACT — ERRATA 01

**STATUS: APPROVED — Operator (BOOS BỚP) · Ruled 2026-08-06 (Cowork session) · Signed 2026-08-07**

**Drafted:** 2026-08-07 by task `ZENITH_BLADE_PAPERWORK_CLOSEOUT_01`
**Drafted by:** Claude Code (documentation only — no geometry, render, material or Blender action taken)
**Origin:** [ZENITH_BLADE_LINEAGE_AUDIT_01.md](ZENITH_BLADE_LINEAGE_AUDIT_01.md) §5e and §6.1, open item 2

Corrects the scope of one clause in `design_system/mikage-cine-color-contract.md`.

> **The original contract is NOT edited.** It remains byte-frozen at
> sha256 `5c2b73a35890df0a92a8e72a0b4257d71be41ca0092e9b9d4e0075b82a18ab2b`
> as the signed operator record. This errata is the correction of record and
> the two documents are read together — exactly the pattern established by
> [ZENITH_BLADE_CANON_LOCK_V1_ERRATA_01.md](ZENITH_BLADE_CANON_LOCK_V1_ERRATA_01.md).

> **THIS ERRATA IS IN FORCE.** Ruled by the Operator (BOOS BỚP) on 2026-08-06 (Cowork session); signed 2026-08-07. It is the
> correction of record; the contract and this errata are read together. The conflict recorded
> in §4 is CLOSED by scope. §6 is retained as the historical record of the declined alternative.

---

## 1. Document corrected

| Field | Value |
|---|---|
| Document | `design_system/mikage-cine-color-contract.md` |
| Status of original | `OPERATOR_COLOR_CONTRACT_LOCKED` · locked 2026-06-04 by Operator (BOOS BỚP) |
| Frozen reference (sha256, verified on disk 2026-08-07) | `5c2b73a35890df0a92a8e72a0b4257d71be41ca0092e9b9d4e0075b82a18ab2b` |
| Git provenance of the lock | commit `1a8cb8b`, 2026-06-04, author BOOS BỚP |
| Section corrected | `## REQUIRED ANCHORS (every frame must contain)`, lines 24–30 |
| Bytes changed in the original | **0** |

---

## 2. Correction

**Reads (original, unchanged on disk — lines 24–30):**

```
## REQUIRED ANCHORS (every frame must contain)

DARKEST VOLUME -> Sumi-iro  #252321
HIGHLIGHT      -> Angora White (Gofun) #F6F5F6
ANY SEAM/BREAK -> a Bengala crimson seam (repair-as-beauty)
```

**Should read:**

```
## REQUIRED ANCHORS (every frame must contain)

DARKEST VOLUME -> Sumi-iro  #252321
HIGHLIGHT      -> Angora White (Gofun) #F6F5F6
ANY SEAM/BREAK -> a Bengala crimson seam (repair-as-beauty)

EXCEPTION — ZENITH BLADE (asset-scoped, added by ERRATA 01):
  The crimson-seam anchor does NOT apply to the Zenith Blade. Red/crimson is
  BANNED on that weapon at every phase; its sole sanctioned signal is electric
  violet #8F00FF, P3 only, exactly one recessed core, no wash/halo/ambient/fill.
  The anchor remains in force for every other cine-layer subject, including the
  Mikage entity shell, covers, and world art.
```

---

## 3. Basis — the superseding authority

| # | Source | Date | What it establishes |
|---|---|---|---|
| 1 | `docs/handoff/MIKAGE_ZENITH_BLADE_SPEC_V1.md:5–14` — header banner recording operator visual rulings **#54 → #58** | **2026-07-06/07** | "the Zenith Blade core/seam signal is **electric violet, `#8F00FF` family** (rendered core-body median gate: hue 268–280°, R/B 0.45–0.65). **Red/crimson is BANNED on this weapon at every phase.**" |
| 2 | `MIKAGE_ZENITH_BLADE_SPEC_V1.md:114` — operator ruling "V0.15 SHELL FORM", item 7 | 2026-07-24 | "Weapon không dùng red/crimson ở mọi phase." |
| 3 | `ZENITH_BLADE_FINAL_DESIGN_OPERATOR_RULING.md` — operator decision **D7** | 2026-08-06 | "`#8F00FF` electric violet is authoritative for the Zenith Blade core/seam signal — P3-only, exactly one core, no wash/halo/ambient/fill; **red banned on the weapon at every phase**. … **Entity crimson canon (quantum blood, kintsugi seams, Ensō ring) remains valid and unchanged.**" |
| 4 | `ZENITH_BLADE_MATERIAL_CANON_V1.md` §1 (APPROVED, Operator BOOS BỚP) | 2026-08-06 | The Blade's five sanctioned hue anchors contain **no crimson**: porcelain `#F2EEEA`, Z-Blue `#4B5866`, sumi `#252321`, violet-black `#120A18`, core violet `#8F00FF`. |
| 5 | Measurement, `ZENITH_BLADE_CODEX_LINEAGE_AUDIT_01`, read-only | 2026-08-07 | `renders/board_v1_evidence/OUT1_HERO_P3_85MM.png` (unannotated CE15 hero): **0** pixels satisfying `R>G+40 ∧ R>B+40 ∧ R>60`. |

Item 3 is decisive on scope: the same ruling that bans crimson on the weapon **explicitly preserves
entity crimson canon**. This errata carries that distinction into the contract rather than
generalising the ban.

---

## 4. The conflict this closes

Recorded by the lineage audit as an **open, unamended contradiction**:

> The cine colour contract's REQUIRED ANCHORS block states "ANY SEAM/BREAK → a Bengala crimson seam"
> as a per-frame requirement. CE15 — an operator-designated FILM / RENDER-ONLY asset (handoff
> decision, 2026-07-30), therefore inside the cine layer — contains zero crimson. The operator
> rulings supersede the contract **in effect**; the contract has never been amended to say so.
> — `ZENITH_BLADE_LINEAGE_AUDIT_01.md` §5e, §6.1, open item 2

This errata closes that conflict **by scope**, not by weakening the anchor: the anchor keeps
full force everywhere except one named asset.

---

## 5. Scope of this errata

- **Wording and scope only.** No colour value, no palette entry, no asset, no geometry, no material
  and no hash changes.
- The contract's other clauses are **unaffected**: the 70/30 shadow budget, ≤65 % saturation ceiling,
  ≥4 % noise floor, the `#F6F5F6` / `#252321` anchors, the FORBIDDEN list, the §VIOLET exception, the
  Z-Blue `#4B5866` lock, the kintsugi gold `#C39A52` clause, and the LAYER SEPARATION rule all stand
  exactly as written.
- **Kintsugi gold is not touched by this errata.** The gold question is separate and is drafted in
  [ZENITH_BLADE_WARM_COLOUR_RULING_V1.md](ZENITH_BLADE_WARM_COLOUR_RULING_V1.md), APPROVED (ruled 2026-08-06, signed 2026-08-07).
- **Entity crimson canon is unchanged.** Crimson `#E60000` for damage/dissolve on character renders
  and covers, and kintsugi gold as entity seams, remain canon per
  `docs/character/MIKAGE_PUBLIC_LORE_STANDARD_V1.md` §ART canon.
- This errata grants no asset lock, no production-ready status, and no canon authority.

---

## 6. If the operator declines to sign — HISTORICAL (superseded by the 2026-08-06 ruling)

The contract's crimson anchor stands as an unqualified per-frame requirement, and the Zenith Blade
as built is **non-compliant with a locked operator contract**. That state is not resolved by
declining — it is left recorded as an open conflict in
`ZENITH_BLADE_LINEAGE_AUDIT_01.md` §6.1. No asset change is implied either way; the operator rulings
of 2026-07-06/07 and D7 continue to govern the built weapon in practice.

---

## 7. Signature block

```
ERRATA:            MIKAGE_CINE_COLOR_CONTRACT_ERRATA_01
CORRECTS:          design_system/mikage-cine-color-contract.md  (byte-frozen, 0 bytes changed)
FROZEN SHA256:     5c2b73a35890df0a92a8e72a0b4257d71be41ca0092e9b9d4e0075b82a18ab2b
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
