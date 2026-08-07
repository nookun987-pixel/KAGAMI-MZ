# OPERATOR RULING — COLLISION FIXTURE NEUTRAL

```
STATUS:     APPROVED — HUMAN SIGNED
ASSET:      Zenith Blade CE15
FIXTURE:    Actor V0.89 collision harness
DATE:       2026-08-07
ISSUED VIA: CE15_ACTOR_COLLISION_REPROOF_05 (PRE-D0)
```

> **ASSET LOCK: NOT ISSUED · PRODUCTION READY: NOT ISSUED.**
> This document is **SIGNED** and in force as the collision-fixture neutral definition.
> It defines a measurement fixture. It certifies no asset.

---

## Ruling

For the Zenith Blade collision campaign, the actor neutral state is defined as the **evaluated
constrained-neutral state of the untouched V0.89 actor**, not the armature rest pose.

The neutral state must be produced by the following procedure:

1. Load the untouched staging, V0.89 and CE15 sources.
2. Resolve all objects using **library-aware identity** (name + library; abort on anything other than exactly one hit).
3. Capture actor mesh **baseline world matrices**.
4. **With all original constraints active**, capture the evaluated armature-space matrices of every pose bone.
5. Mute all 15 constraints.
6. Reconstruct the captured neutral using `pose_bone.matrix_basis`, applying **parent bones before child bones**.
7. Verify bone and mesh fidelity.
8. **Only after** the neutral verification passes, rigid-bind the 26 actor meshes.
9. Apply only doctrine poses that have received a **separate human operator ruling**.
10. Run collision measurements only after articulation, isolation and reset gates pass.

> **Step 4 precedes step 5 and that ordering is load-bearing.** Once the constraints are muted the
> neutral no longer exists to be captured. The shorthand "mute → neutral" is **forbidden** in every
> future brief, report and script comment, because it inverts this order.

---

## Scope

This ruling defines a **collision-fixture neutral only**. It does **not**:

- redefine the armature rest pose;
- repair or approve the existing control rig;
- modify V0.89, CE15 or the staging source;
- define an animation neutral;
- constitute a soft-rig or production-rig approval.

---

## Required thresholds

| Gate | Threshold |
|---|---|
| Neutral bone error | ≤ `0.00001 m` |
| Baseline mesh drift | ≤ `0.00001 m` |
| Bind drift | ≤ `0.00001 m` |
| Reset drift | ≤ `0.00001 m` |
| Driven render-enabled mesh displacement | ≥ `0.005 m` |
| Unrelated mesh displacement | ≤ `0.00001 m` |

Meshes marked `hide_render = True` are excluded in accordance with `MIKAGE_COLLISION_METHOD_V1` §2.1.
The exclusion applies to **every statistic**, including minima and maxima — not only to the collision count.

---

## Evidence disposition

- **PRE-D0** using armature rest as neutral is **REJECTED**.
- **PRE-D0b** using baked constrained-neutral is **ACCEPTED as the technical basis** for REPROOF_05,
  subject to attachment and independent verification of its generated scripts, reports, stdout,
  integrity evidence and hashes.

```
STATUS OF THE PRE-D0b FIGURES: TECHNICALLY APPROVED — EVIDENCE ATTACHMENT PENDING
NOT "independently verified" until a new bundle is compared.
```

Figures awaiting independent verification (measured locally, attachment pending):

| Figure | Value |
|---|---|
| Rest-reset mitten displacement | `0.492471337 m` |
| Neutral bone reproduction error | `5.67e-07 m` |
| Bind drift | `4.85e-07 m` |
| Reset drift | `4.87e-07 m` |
| Isolation (unrelated max) | `3.58e-07 m` |
| Rejected step order displacement | `2.285531 m` |
| Anchor / tripwire / validator evidence | `_tmp/ce15_actor_collision_reproof_04/INTEGRITY_EVIDENCE.txt` |

**No collision matrix may run until five doctrine poses are separately defined and signed by the
human operator.** Current matrix state: **0 / 15**.

---

## Documentation authorization

Updating `docs/MIKAGE_SESSION_LESSONS.md` is authorized to record:

1. Rest pose must never be assumed to equal the actor's visual neutral.
2. Pre-existing asymmetric bone parenting can make canon geometry dependent on constrained evaluation.
3. Render-disabled meshes must not participate in articulation minimum calculations.
4. Neutral capture must occur before constraints are muted.
5. Binding must occur only after the collision neutral has been reconstructed and verified.

**Status: DONE** — appended 2026-08-07 under this authorization, append-only, as the third
authorized append to that file.

---

## Signature

```
Operator name:       Phi Hùng
Operator signature:  Phi Hùng
Signed date:         2026-08-07
```

**How this signature was recorded.** The operator (BOOS BỚP / Phi Hùng) gave the signature and the
`PENDING HUMAN SIGNATURE` → `APPROVED — HUMAN SIGNED` status change as an explicit written
instruction in the session of 2026-08-07, and it was transcribed verbatim by Claude Code. **The
decision is the operator's; the typing is not the decision.** No technical content of this ruling
was altered during signing — verified by diff against the pre-signature baseline
(`fb0e05137dcc661c…`): the only changes are the status line, the signature block, and the two
closing lines below.

This ruling is now **in force**. REPROOF_05 may proceed past PRE-D0. The next valid task is
**defining the five doctrine poses** — **not** running the matrix. Matrix state remains **0 / 15**
until a separate signed pose ruling exists.

`EVIDENCE ATTACHMENT PENDING INDEPENDENT VERIFICATION` remains in force for every PRE-D0 / PRE-D0b
figure; signing this ruling does **not** convert those measurements into independently verified ones.

---

*End of OPERATOR RULING — COLLISION FIXTURE NEUTRAL. Signed 2026-08-07. No asset lock, no
production claim.*
