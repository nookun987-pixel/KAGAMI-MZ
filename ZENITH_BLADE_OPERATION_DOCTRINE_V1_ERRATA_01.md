# ZENITH BLADE — OPERATION DOCTRINE V1 · ERRATA 01

**STATUS: APPROVED — Operator (BOOS BỚP) · Ruled & Signed 2026-08-07**

**Issued:** 2026-08-07 by task `CE15_ACTOR_COLLISION_REPROOF_02`
**Authority:** operator ruling **R2**, 2026-08-07 (Cowork session)

Corrects the combat pose & collision matrix in
[ZENITH_BLADE_OPERATION_DOCTRINE_V1.md](ZENITH_BLADE_OPERATION_DOCTRINE_V1.md) §4.1.

> **The doctrine is NOT edited.** It remains byte-frozen at
> sha256 `963e70108c329cc6fd4d7c15d47044a6c87b9e04f4478f2d47deb1dc7adc36e1`.
> This errata is the correction of record; the two are read together.

> **ASSET LOCK: NOT ISSUED · PRODUCTION READY: NOT ISSUED · COLLISION TESTED: NO.**

---

## 1. Document corrected

| Field | Value |
|---|---|
| Document | `ZENITH_BLADE_OPERATION_DOCTRINE_V1.md` |
| Frozen sha256 | `963e70108c329cc6fd4d7c15d47044a6c87b9e04f4478f2d47deb1dc7adc36e1` |
| Section corrected | §4.1 COMBINED COLLISION MATRIX |
| Bytes changed in the original | **0** |

---

## 2. Correction

**Reads (original):** a 13-row matrix — `neutral` + 8 historical V0.89 poses
(`hand_hold`, `torso_left`, `torso_right`, `wide_stance`, `crouch`, `shoulder_elbow_limit`,
`cloak_left`, `cloak_right`) + `POSE_01`–`POSE_04`, each marked *"must be re-proven on CE15"*,
with the rule *"Coverage must never shrink below the historical bar."*

**Should read:**

```
| # | Pose                        | Origin         | Status                        |
|---|-----------------------------|----------------|-------------------------------|
| 0 | neutral                     | V0.89 baseline | must be re-proven on CE15     |
| 1 | POSE_01 CHASSIS_GUARD       | this doctrine  | PROPOSED — never tested       |
| 2 | POSE_02 CUTTING_MASS_SLAM   | this doctrine  | PROPOSED — never tested       |
| 3 | POSE_03 DUAL_ANCHOR_PIN     | this doctrine  | PROPOSED — never tested       |
| 4 | POSE_04 P3_SIGNAL_DISCHARGE | this doctrine  | PROPOSED — static geometry    |

TRUE MATRIX = 5 rows x P1/P2/P3 = 15 state-checks.

The 8 historical V0.89 poses are RETIRED AS FICTION (operator ruling R2, 2026-08-07).
They were never defined and never applied. The historical 0-overlap result remains
valid for NEUTRAL ONLY.

The "coverage must never shrink below the historical bar" rule is satisfied: the
historical bar was always one row (neutral). Retiring the other eight removes
labels, not coverage.
```

---

## 3. Basis — why the eight are retired

From `MIKAGE_CE15_COLLISION_REPROOF_01.md` (2026-08-07), three independent, converging findings:

| # | Finding | Evidence |
|---|---|---|
| 1 | **No pose definition exists anywhere.** | V0.89 probe: 0 actions matching any pose name, 0 pose assets, 0 NLA tracks, armature `action = None`, 0 non-identity pose bones, 0 timeline markers, 0 text datablocks, 0 datablocks whose name contains any of the eight pose names |
| 2 | **The recorded results do not differ between poses.** | `MIKAGE_ZENITH_BLADE_POSE_CLEARANCE_V0_61_REPORT.json`: all seven recorded poses share collision-hit md5 `243b8e1cb2`, `hand_center_distance` 1.76015645, and `hand_distance_drift_from_neutral` **0.0** |
| 3 | **The actor was never bound to the armature**, so no pose could have been applied. | 26 `A2_` meshes: 0 armature modifiers, 0 vertex groups, 19 parented to *unparented* intent-empties, 6 unbound, 1 bone-parented |

A crouch that moves the hand zero millimetres from neutral is not a crouch. The eight rows were the
neutral rest state evaluated under eight extra labels.

---

## 4. Scope

- **Matrix rows only.** §1, §2, §3, §5, §6, §7 and §8 of the doctrine are unaffected.
- The four doctrine poses `POSE_01`–`POSE_04` keep their §4 kinematic descriptions and their
  **PROPOSED** status unchanged.
- The collision-check zones per pose are unchanged.
- **This errata does not certify any pose.** It corrects the matrix's size and removes a false
  historical baseline. Zero collision results are asserted by it.
- Grants no asset lock, no production-ready status.

---

## 5. Related

- Method now permanently recorded: [MIKAGE_COLLISION_METHOD_V1.md](MIKAGE_COLLISION_METHOD_V1.md) (ruling R4)
- Gate outcome: [MIKAGE_CE15_COLLISION_REPROOF_02.md](MIKAGE_CE15_COLLISION_REPROOF_02.md)

---

```
ERRATA:            ZENITH_BLADE_OPERATION_DOCTRINE_V1_ERRATA_01
CORRECTS:          ZENITH_BLADE_OPERATION_DOCTRINE_V1.md §4.1 (byte-frozen, 0 bytes changed)
FROZEN SHA256:     963e70108c329cc6fd4d7c15d47044a6c87b9e04f4478f2d47deb1dc7adc36e1
AUTHORITY:         operator ruling R2, 2026-08-07 (Cowork session)
ISSUED:            2026-08-07  ·  CE15_ACTOR_COLLISION_REPROOF_02
STATUS:            APPROVED — Operator (BOOS BỚP) · Ruled & Signed 2026-08-07
SIGNED BY:         Operator (BOOS BỚP / Phi Hùng)
ASSET LOCK:        NOT ISSUED
PRODUCTION READY:  NOT ISSUED
```

---

**STATUS: APPROVED — Operator (BOOS BỚP) · Ruled & Signed 2026-08-07.** In force. The corrected
document was not modified. No commit, no push.
