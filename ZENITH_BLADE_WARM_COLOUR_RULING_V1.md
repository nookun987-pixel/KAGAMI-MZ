# ZENITH BLADE — WARM COLOUR RULING V1

**STATUS: APPROVED — Operator (BOOS BỚP) · Ruled 2026-08-06 (Cowork session) · Signed 2026-08-07**

**Drafted:** 2026-08-07 by task `ZENITH_BLADE_PAPERWORK_CLOSEOUT_01`
**Drafted by:** Claude Code (documentation only — no geometry, render, material or Blender action taken)
**Origin:** the single true DRIFT identified by
[ZENITH_BLADE_LINEAGE_AUDIT_01.md](ZENITH_BLADE_LINEAGE_AUDIT_01.md) §5d3 and
[ZENITH_BLADE_DELTA_TABLE_01.md](ZENITH_BLADE_DELTA_TABLE_01.md) row **d3**

> **THIS RULING IS IN FORCE.** Ruled by the Operator (BOOS BỚP) on 2026-08-06 (Cowork session); signed 2026-08-07.
> The warm/gold ban on the Zenith Blade is now ruled, and the `AGENTS.md` gate lines at
> ≈3033 and ≈3320 are authorized for the Blade as set out in §4.4. §6 is retained as the
> historical record of the declined alternative.

> **ASSET LOCK: NOT ISSUED · PRODUCTION READY: NOT ISSUED · CANON AUTHORITY: NOT GRANTED.**
> This document rules on **one colour question** for **one asset**. It confers no asset
> lock, no production-ready status, and no authority over any other document.

---

## 1. THE QUESTION

Is warm colour — specifically kintsugi gold `#C39A52` and the warm/amber/ochre family — permitted
on the **Zenith Blade** as an asset?

The question exists because a prohibition has been **enforced in practice since 2026-07-24** without
ever being ruled.

---

## 2. WHAT THE AUDIT FOUND (the DRIFT)

| Fact | Evidence |
|---|---|
| A prohibition on "warm/gold weapon colour" has been gating every Blade build since 2026-07-24. | First artifact: `production/character/reviews/MIKAGE_ZENITH_BLADE_STANDALONE_FORM_REFINEMENT_V0_23_PROOF.md:39` — "Violet is confined to the P3 core; no ambient violet, halo, wash, red, **gold**, or warm fill was added." Restated at `…MATERIAL_FIDELITY_V0_26_PROOF.md:42` ("Red/crimson, **warm/gold signal**… none") and `…MATERIAL_FINALING_V0_29_PROOF.md:81`. |
| Its source is a gate line inside agent-authored dispatch briefs, not a ruling. | `AGENTS.md`, V0.26 dispatch block ≈ line 3033 and V0.29 dispatch block ≈ line 3320: "No … red/crimson, **warm/gold weapon color**, P2 violet, ambient violet, wash, halo, secondary core…" |
| **Lane that introduced it:** Lane A dispatch-brief authorship. | Same. |
| **No operator ruling authorising it exists.** | None of the operator rulings of 2026-07-24 (V0.15 SHELL FORM), 2026-07-28 (ORIGINAL FORM · BRUTALIST CONVERGENCE · V0.44/V0.45/V0.46), or 2026-08-06 (D1–D7) mentions gold or warm colour. Verified by full-corpus search. |
| The locked contract it silently narrowed is **permissive**, not prohibitive. | `design_system/mikage-cine-color-contract.md:69–74` (LOCKED 2026-06-04): kintsugi gold `#C39A52` — "**Only on** Kintsugi seams." That restricts *where* gold may appear; it does not require gold, and it does not forbid gold on the blade. |

**Classification: DRIFT.** A dispatch brief tightened an operator-locked contract without a ruling,
and the tightening then propagated through every downstream proof as if it were canon.

---

## 3. WHAT THE BUILT ASSET ACTUALLY SHOWS

Measured read-only during the lineage audit. No Blender was opened.

| Measurement | Result |
|---|---|
| Warm pixels (`R > B+15 ∧ G > B ∧ R > 50`) across the 39 PNGs of the `MAT_C1/C2/C3 + EDGE_B1 + LIGHT_D1/D2/D3` sets | **0 in every file**, except the two `*_MATERIAL_ID.png` false-colour diagnostics (index maps, not renders) |
| Warm pixels in `renders/board_v1_evidence/OUT1_HERO_P3_85MM.png` (unannotated CE15 hero) | **0** |
| Gold materials in `MAT_C1/C2/C3_REPORT.json` `material_system` | **none** — exactly four materials (porcelain / graphite / sumi / inset), `all_mesh_objects_classified: true`, `unclassified: []` |
| Gold materials in `ZENITH_BLADE_MATERIAL_CANON_V1.md` (APPROVED 2026-08-06) §1 hue anchors | **none** — porcelain `#F2EEEA`, Z-Blue `#4B5866`, sumi `#252321`, violet-black `#120A18`, core violet `#8F00FF` |
| Gold in any built candidate, at any version, back to the first built blade (2026-07-06) | **never present.** `LANEA_CODEX_TASK_ZENITH_BLADE_3PHASE_REBUILD_V0_1.md:94`; `…3PHASE_REBUILD_V0_1_PROOF.md:41` — "No weapon material uses violet `#8F00FF`, orange, **gold**, or magenta." |

**Consequence:** gold was never dropped from the Blade. It never entered it. The prohibition and the
built state have never disagreed — only the prohibition's *authority* was missing.

---

## 4. THE RULING (in force — ruled 2026-08-06, signed 2026-08-07)

> **Warm colour is BANNED on the Zenith Blade at every phase.**
>
> 1. The warm / amber / ochre / gold family, including kintsugi gold `#C39A52`, is **not permitted**
>    on any Zenith Blade surface, seam, core, emission, or material at P1, P2 or P3.
> 2. The Blade's sanctioned colour set is exactly the five anchors of
>    [ZENITH_BLADE_MATERIAL_CANON_V1.md](ZENITH_BLADE_MATERIAL_CANON_V1.md) §1 and their recorded
>    brightness tiers. No sixth hue may be introduced without a new operator ruling.
> 3. This ban is **asset-scoped to the Zenith Blade.** It does **not** touch kintsugi gold on the
>    Mikage entity shell, on covers, on world key art, or anywhere else the cine colour contract or
>    `MIKAGE_PUBLIC_LORE_STANDARD_V1.md` §ART canon permits it. Entity kintsugi canon is unchanged.
> 4. The `AGENTS.md` gate lines at ≈3033 and ≈3320 are **retroactively authorized** as of the date of
>    signature, for the Blade only. Their prior enforcement (2026-07-24 → 2026-08-06) is recorded as
>    having been unauthorized at the time; signing does not erase that record.
> 5. This ruling **narrows** the cine colour contract for one asset. It does not amend the contract's
>    text. The contract remains permissive on gold for every other cine-layer subject.

**Basis on which it was signed:**

| # | Basis |
|---|---|
| B1 | It matches every built candidate in the lineage — 0 warm pixels, at every version, measured. |
| B2 | It matches the operator's acceptance of the CE15 visual (D1=A) and the canon lock of 2026-08-06, both of which were made on a gold-free asset. |
| B3 | It matches the approved `ZENITH_BLADE_MATERIAL_CANON_V1.md`, whose five-anchor family contains no warm hue. |
| B4 | It is consistent with the neighbouring, already-ruled colour prohibition: red/crimson is banned on this weapon at every phase (operator rulings #54 → #58, 2026-07-06/07; reaffirmed D7, 2026-08-06). |

> **Honest sequencing note, per the audit's standing rule.** B2 is recorded as a *later, separate
> fact*. Operator acceptance of CE15 on 2026-08-06 does **not** retroactively convert the
> 2026-07-24 gate line into a ruling. That is precisely why this document exists: the ban is being
> ruled **now**, prospectively, not back-dated.

---

## 5. WHAT THIS RULING DOES NOT DO

- It does **not** amend `design_system/mikage-cine-color-contract.md`. That file is untouched.
- It does **not** affect kintsugi gold on the Mikage entity, covers, film frames, or world art.
- It does **not** grant asset lock, production-ready status, canon authority, or push/deploy rights.
- It does **not** alter the CE15 geometry, materials, or any hash.
- It does **not** address the crimson question — that is handled separately by
  [MIKAGE_CINE_COLOR_CONTRACT_ERRATA_01.md](MIKAGE_CINE_COLOR_CONTRACT_ERRATA_01.md) and
  [MIKAGE_ZENITH_CANON_V2_ERRATA_01.md](MIKAGE_ZENITH_CANON_V2_ERRATA_01.md).

---

## 6. IF THE OPERATOR DECLINES TO SIGN — HISTORICAL (superseded by the 2026-08-06 ruling)

Stated explicitly so the fallback is unambiguous:

1. `design_system/mikage-cine-color-contract.md:69–74` **stands as written**: kintsugi gold `#C39A52`
   is permitted on kintsugi seams in the cine layer, and the Zenith Blade — an operator-designated
   FILM / RENDER-ONLY asset (handoff decision, 2026-07-30) — sits inside that layer.
2. The `AGENTS.md` gate lines at ≈3033 and ≈3320 must be treated as **UNAUTHORIZED** and must not be
   carried into any future dispatch brief without a ruling.
3. Every proof that enforced them (`V0_23`, `V0_26`, `V0_29`, and the MAT_C / LIGHT_D / HERO_E1 /
   CE-series gates that inherited them) remains valid as a *record of what was built*, but its
   gold-exclusion gate carries **no canon authority**.
4. The audit verdict for delta **d3** remains **DRIFT**, unresolved.
5. No asset changes either way. Declining does not require adding gold to anything; it leaves the
   question open rather than closing it in the ban's favour.

---

## 7. SIGNATURE BLOCK

```
RULING:            WARM COLOUR BANNED ON THE ZENITH BLADE, ALL PHASES
SCOPE:             Zenith Blade asset only. Entity / cover / world-art gold unaffected.
DRAFTED:           2026-08-07  ·  ZENITH_BLADE_PAPERWORK_CLOSEOUT_01
STATUS:            APPROVED — Operator (BOOS BỚP) · Ruled 2026-08-06 (Cowork session) · Signed 2026-08-07
SIGNED BY:         Operator (BOOS BỚP / Phi Hùng)
SIGNATURE DATE:    Ruled 2026-08-06 (Cowork session) · Signed 2026-08-07
ASSET LOCK:        NOT ISSUED
PRODUCTION READY:  NOT ISSUED
```

---

**STATUS: APPROVED — Operator (BOOS BỚP) · Ruled 2026-08-06 (Cowork session) · Signed 2026-08-07.** In force. Grants no asset lock and no production-ready status — see the guard lines above.
No commit, no push.
