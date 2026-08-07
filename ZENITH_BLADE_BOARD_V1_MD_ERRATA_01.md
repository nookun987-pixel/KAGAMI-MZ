# ZENITH BLADE — FINAL DESIGN BOARD V1 (markdown index) · ERRATA 01

**STATUS: APPROVED — Operator (BOOS BỚP) · Ruled & Signed 2026-08-07**

**Issued:** 2026-08-07 by task `ZENITH_BLADE_DOCTRINE_ISSUE_01`
**Authority:** operator ruling **R3**, 2026-08-07 (Cowork session)

Corrects one line in `ZENITH_BLADE_FINAL_DESIGN_BOARD_V1.md` — the panel-8 method table's
plural use of "Anchors".

> **The board markdown is NOT edited.** It remains byte-frozen at
> sha256 `30471b4e61a70513e2cc64eb0149ddd7770c61b4236193d27159f77f8e273179`
> as the signed record cited by `ZENITH_BLADE_CANON_LOCK_V1.md`. This errata is the correction of
> record; the two documents are read together — the pattern established by
> [ZENITH_BLADE_CANON_LOCK_V1_ERRATA_01.md](ZENITH_BLADE_CANON_LOCK_V1_ERRATA_01.md).

> **Mechanical fact-alignment only.** No new design decision. No geometry, material, asset or hash
> changes. **`ASSET LOCK: NOT ISSUED · PRODUCTION READY: NOT ISSUED`.**

---

## 1. Document corrected

| Field | Value |
|---|---|
| Document | `ZENITH_BLADE_FINAL_DESIGN_BOARD_V1.md` |
| Frozen sha256 (verified on disk 2026-08-07) | `30471b4e61a70513e2cc64eb0149ddd7770c61b4236193d27159f77f8e273179` |
| Section corrected | `## Panel 8 — load-path diagram method`, table row **Anchors**, line **84** |
| Bytes changed in the original | **0** |
| Also cited by | `ZENITH_BLADE_CANON_LOCK_V1.md` evidence block; `ZENITH_BLADE_FINAL_DESIGN_BOARD_V1_MANIFEST.json` → `board_markdown` |

---

## 2. Correction

**Reads (original, unchanged on disk — line 84):**

```
| Anchors | chassis / spine and hub / handle axis **stay** (offset 0) |
```

**Should read:**

```
| ANCHOR            | chassis / spine — the sole layer the OUT3 legend tags as an anchor
|                   | ("chassis / spine  (ANCHOR - stays)")
| Held stationary   | chassis / spine · hub / handle axis · P3 core — three layers are held
|                   | stationary in the exploded diagram. Being held stationary is a property
|                   | of the DIAGRAM and does not confer anchor status.
| hub / handle axis | primary grip and load-path terminating member — NOT an anchor
|                   | (operator ruling R3, 2026-08-07)
```

---

## 3. Reason for the correction

The original wording conflates two different things: **being held stationary in the exploded
diagram** and **carrying the ANCHOR designation**. They are not the same, and the diagram's own data
distinguishes them.

| Evidence | Finding |
|---|---|
| `renders/board_v1_evidence/run_out3_v3.py:32` and `RUN_LOG_out3_v3.log` → `layers[4]` | The label is verbatim `"chassis / spine  (ANCHOR - stays)"`. **This is the only layer whose label contains "ANCHOR".** |
| `RUN_LOG_out3_v3.log` → `layers[5]` | `"hub / handle axis"` — held stationary, **no ANCHOR text**. |
| `RUN_LOG_out3_v3.log` → `layers[6]` | `"P3 SIGNAL - NOT PRIMARY LOAD-BEARING MEMBER (stays at spine)"` — also held stationary, **no ANCHOR text**. |

**The decisive argument.** *Three* layers stay put in the diagram, and one of them is the **isolated
P3 core**. If "stays put" implied "anchor", the core would be an anchor — which directly contradicts
its own legend label and `ZENITH_BLADE_OPERATION_DOCTRINE_V1.md` §2.4 (P3 is not a primary
load-bearing member). The plural reading is therefore untenable on the record.

**Operator ruling R3, 2026-08-07 (Cowork session):** the OUT3 legend governs over the board MD
description. **ANCHOR = chassis / spine only.** The hub / handle axis is the **primary grip and the
load-path terminating member**.

Discovery provenance: the divergence was found during citation verification in
`ZENITH_BLADE_OPERATION_DOCTRINE_DRAFT_VERIFY_01` (2026-08-07), recorded there as UNCONFIRMED and
referred for ruling rather than resolved unilaterally.

---

## 4. What is NOT changed

- **Every other row of the panel-8 method table** — primary explode axis, step, max total offset,
  method — is **unaffected and correct as written**.
- **No other panel, section or statement** in `ZENITH_BLADE_FINAL_DESIGN_BOARD_V1.md` is affected.
- **The board PNG is unaffected.** `ZENITH_BLADE_FINAL_DESIGN_BOARD_V1.png`
  (`62deec95df990893324ef376719c026ad14a8ce86b64fd213c58e439be9dd8d5`) is not regenerated and its
  printed panel-8 label — *"LOAD-PATH EVIDENCE DIAGRAM — not a manufacturing exploded view."* — is
  correct and unchanged.
- **The canon lock is unaffected.** `ZENITH_BLADE_CANON_LOCK_V1.md` cites the board markdown as
  evidence; that citation and its recorded hash remain valid. This errata does not alter the lock.
- **No geometry, material, asset or candidate hash changes.** CE15 anchor
  `465b212ef49a4b8ad3eacd682757d9fe0512fa5d242c1b09611439b9c76c3129` unaffected.

---

## 5. Downstream

| Document | Effect |
|---|---|
| [ZENITH_BLADE_OPERATION_DOCTRINE_V1.md](ZENITH_BLADE_OPERATION_DOCTRINE_V1.md) §2.2, §3 | Applies R3; ANCHOR = chassis/spine only; hub/handle = primary grip + terminating member |
| `ZENITH_BLADE_FINAL_DESIGN_BOARD_V1_MANIFEST.json` → `unresolved` | Hub-anchor question removed — resolved by R3 |

---

```
ERRATA:            ZENITH_BLADE_BOARD_V1_MD_ERRATA_01
CORRECTS:          ZENITH_BLADE_FINAL_DESIGN_BOARD_V1.md  (byte-frozen, 0 bytes changed)
                   scope: panel-8 method table, "Anchors" row (line 84) ONLY
FROZEN SHA256:     30471b4e61a70513e2cc64eb0149ddd7770c61b4236193d27159f77f8e273179
AUTHORITY:         operator ruling R3, 2026-08-07 (Cowork session)
ISSUED:            2026-08-07  ·  ZENITH_BLADE_DOCTRINE_ISSUE_01
STATUS:            APPROVED — Operator (BOOS BỚP) · Ruled & Signed 2026-08-07
SIGNED BY:         Operator (BOOS BỚP / Phi Hùng)
SIGNATURE DATE:    Ruled & Signed 2026-08-07 (Cowork session)
ASSET LOCK:        NOT ISSUED
PRODUCTION READY:  NOT ISSUED
```

---

**STATUS: APPROVED — Operator (BOOS BỚP) · Ruled & Signed 2026-08-07.** In force. Mechanical
fact-alignment only; no new design decision. The corrected document was not modified.
No commit, no push.
