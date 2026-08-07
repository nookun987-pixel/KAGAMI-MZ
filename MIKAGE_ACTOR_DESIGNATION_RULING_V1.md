# MIKAGE — ACTOR DESIGNATION RULING V1

**STATUS: APPROVED — Operator (BOOS BỚP) · Ruled & Signed 2026-08-07**

**Issued:** 2026-08-07 by task `MIKAGE_ACTOR_STAGE_BUILD_01`
**Origin:** [MIKAGE_ACTOR_REFERENCE_AUDIT_01.md](MIKAGE_ACTOR_REFERENCE_AUDIT_01.md) §4a, which
recorded the designation as convergent inference and referred it for ruling rather than asserting it.

> **ASSET LOCK: NOT ISSUED · PRODUCTION READY: NOT ISSUED · CANON LOCK: unchanged.**
> This ruling designates a reference actor for collision staging. It grants nothing else.

---

## 1. THE RULING

> ### D-a — `A2_` IS THE PRODUCTION ACTOR
>
> The `A2_`-prefixed object group is **designated the production actor** for the Mikage Zenith
> character. It is the actor of record for collision staging, integration measurement, and any
> future actor-side proof.
>
> ### D-b — Isolation method
>
> Isolation follows **audit option O1**: library-link `A2_` from the V0.89 blend into a new working
> file and apply the canon scale there. **Source blends remain read-only and byte-unchanged.**
>
> ### D-c — Rigid attachment is the standard; the soft rig is backlogged
>
> Collision testing uses **RIGID ATTACHMENT ONLY** — the same method as the historical V0.89 proof,
> making the re-proof a like-for-like comparison against a known-good result.
>
> The absent soft-deformation rig (audit finding **F6**) moves to the **production backlog**. It is
> **not a blocker for asset lock** and does not gate the collision re-proof. It remains a real
> limitation on pose authoring beyond rigid attachment, and that limitation is recorded, not waived.

---

## 2. PROVENANCE CHAIN — five converging sources

The audit found no document that *names* `A2_` as the production actor. This ruling supplies that
designation. The five sources below are what it is grounded on; each was verified on disk.

| # | Source | What it establishes |
|---|---|---|
| 1 | `production/character/reviews/MIKAGE_ZENITH_BLADE_MITTEN_INTERFACE_CORRECTION_V0_89_PROOF.md:17` | The V0.89 bounded correction targeted **`A2_right_porcelain_mitten_hand_attached_read` only** — the actor-side geometry the whole proof was built around |
| 2 | `…_V0_89_REPORT.json` → `pose_validation`, `scale_audit` | The 0-overlap, 8-pose result and the actor measurement (`actor_total_height_m` 7.149999842) were computed against the `A2_`-dominated render set |
| 3 | Measured, `MIKAGE_ACTOR_REFERENCE_AUDIT_01` §3 F1 | In the V0.89 scene `A2_` is the render-enabled variant that **sets actor height**: 25 of 26 meshes render-enabled, Z-extent **7.1500 m** |
| 4 | `production/character/reviews/MIKAGE_MESH_PREP_OPERATOR_REVIEW_V0_1.md:36` (2026-06-06) | **25 tagged deform-candidate objects** — matching `A2_`'s 25 render-enabled meshes; `A2_` carries the `MESH_PREP_deform_candidate_groups` tag |
| 5 | `ZENITH_BLADE_FORM_RIG_HANDOFF_CONTRACT.md` + operator decision **D4** (2026-08-06) | V0.89 is the **actor-integration authority**; `A2_` is its actor |

**Independent corroboration.** `A2_`'s measured height reproduces canon exactly through the EDGE_B1
scale factor: `7.1500 × 0.2452706705 = 1.753685` versus `ACTOR_HEIGHT_M: 1.753685243`
(`MIKAGE_ZENITH_BLADE_EDGE_B1_PROOF.md:8`). Armature rest height and blade length reproduce to the
same precision — three independent quantities, six decimal places.

---

## 3. SCOPE — what this ruling does NOT do

- It does **not** grant asset lock or production-ready status to the actor, the blade, or the stage.
- It does **not** approve any collision result. No collision has been run.
- It does **not** resolve audit items **U1–U7** (0.19 m scaffold figure, proxy hide date, 98-mesh
  figure, `MASTER_*` variant, the hidden `A2_` mesh, CE15-lineage in-scene actor height). Those
  remain **UNCONFIRMED**.
- It does **not** claim the soft-deformation rig exists or is unnecessary — only that it does not
  gate this line of work. Audit finding **F6** stands unchanged.
- It does **not** designate any variant for *rendering* or *public* use. `PUBLIC_BLOCK_` and
  `PUBLIC_BLOCK_V03_` variants keep whatever status they already hold; this ruling is silent on them.

---

## 4. CONSEQUENCES

| Item | Before | After |
|---|---|---|
| Production actor | inferred, unnamed | **`A2_`, designated** |
| Actor isolation method | four options open | **O1 — link + scale in a new working file** |
| Collision method | undecided | **RIGID ATTACHMENT ONLY**, like-for-like with V0.89 |
| Soft-deformation rig | treated as a blocker | **production backlog — not an asset-lock blocker** |
| Collision staging file | none | `production/character/staging/MIKAGE_COLLISION_STAGE_01.blend` |

---

```
RULING:            MIKAGE_ACTOR_DESIGNATION_RULING_V1
DESIGNATES:        A2_ = production actor (D-a)
METHOD:            O1 link + canon scale in a new working file (D-b)
COLLISION STANDARD: RIGID ATTACHMENT ONLY; soft rig backlogged (D-c)
ISSUED:            2026-08-07  ·  MIKAGE_ACTOR_STAGE_BUILD_01
STATUS:            APPROVED — Operator (BOOS BỚP) · Ruled & Signed 2026-08-07
SIGNED BY:         Operator (BOOS BỚP / Phi Hùng)
SIGNATURE DATE:    Ruled & Signed 2026-08-07 (Cowork session)
ASSET LOCK:        NOT ISSUED
PRODUCTION READY:  NOT ISSUED
COLLISION TESTED:  NO
```

---

**STATUS: APPROVED — Operator (BOOS BỚP) · Ruled & Signed 2026-08-07.** In force as the actor
designation of record. Grants no asset lock and no production-ready status. No commit, no push.
