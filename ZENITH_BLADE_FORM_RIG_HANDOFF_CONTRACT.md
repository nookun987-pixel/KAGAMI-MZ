# ZENITH BLADE — FORM / RIG HANDOFF CONTRACT

**Effective:** 2026-08-06 · **Authority:** [ZENITH_BLADE_FINAL_DESIGN_OPERATOR_RULING.md](ZENITH_BLADE_FINAL_DESIGN_OPERATOR_RULING.md) — D4 = C
**Precedent followed:** `production/character/reviews/MIKAGE_ZENITH_BLADE_INTEGRATION_PATTERN_V0_37.md` — link-preferred consumption, never overwrite the parent.

---

## 1. The two assets

### 1.1 WEAPON-FORM ASSET (authority: CE15)
- **Path:** `_tmp/zenith_blade_hero_e1_ce15/hero_cohesion_correction01/MIKAGE_ZENITH_BLADE_HERO_COHESION_CORRECTION_01_FIRST_PASSING_CANDIDATE.blend`
- **SHA-256:** `465B212EF49A4B8AD3EACD682757D9FE0512FA5D242C1B09611439B9C76C3129`
- **Owns:** outer silhouette · four-shell plate geometry · seam hierarchy · chassis lobes / spine / rails · upper collar & lower termination form · porcelain, graphite, titanium materials · P3 core mesh, transform, material, emission · P1/P2/P3 core visibility logic · reveal timing.

### 1.2 ACTOR-INTEGRATION ASSET (authority: V0.89)
- **Path:** `production/character/production_actor/rig_derivatives/MIKAGE_ZENITH_BLADE_MITTEN_INTERFACE_CORRECTION_V0_89.blend`
- **Owns:** actor rig & armature · pelvis docking anchor (`ZB65_ACTOR_DOCKING_LOAD_ANCHOR`) · attachment root & hand-marker registration · secondary grip IK (chain-5) · collision ownership classification · actor mitten geometry & clearance · cloak coverage · pose-sample gates.
- **Does NOT own weapon form.** Its embedded weapon form is superseded by CE15.

---

## 2. Consumption rule

1. The integration asset consumes the weapon-form asset by **link / reference only**.
2. **Neither file may overwrite the other.** No merge, no append-that-flattens, no in-place edit of the counterpart.
3. Integration-side work may add **attachment / registration / constraint** objects. It may **not** edit weapon geometry or materials — those changes must be made in the weapon-form asset and re-linked.
4. Weapon-side work may **not** add rig, actor, cloak, mitten, holster, or mount objects — per the standing prohibition in `MIKAGE_ZENITH_BLADE_CANON_MECHANICAL_DEFINITION_V0_25_PROOF.md` ("No rider, gauntlet, holster, steed, mount, ZB16 fixture or rig").

---

## 3. Gate ownership

| Gate | Owner | Current status |
|---|---|---|
| Outer silhouette (64 / 128 px, 0 px beyond AA) | **CE15 / weapon** | ✅ PASS on CE15 (`HC_SILHOUETTE_VIOLET_REPORT.json`) |
| Core OFF/OFF/ON · violet ROI ≥ 2500 · global ≤ 5 % | **CE15 / weapon** | ✅ PASS on CE15 |
| Weapon-internal collisions (shell↔shell, shell↔spine/core/hub/handle) | **CE15 / weapon** | ✅ PASS on CE15 (all pairs 0, P1/P2/P3) |
| Spine / core mesh-hash integrity | **CE15 / weapon** | ✅ PASS on CE15 |
| Docking load path (pelvis anchor) | **V0.89 / integration** | ✅ PASS — but against the **previous** weapon form |
| Grip IK (chain-5, secondary grip follow) | **V0.89 / integration** | ✅ PASS — against previous form |
| Mitten clearance (0 overlaps, 8-pose gate) | **V0.89 / integration** | ✅ PASS — against previous form |
| Collision ownership classification | **V0.89 / integration** | ✅ PASS |
| **CE15 ↔ actor collision / clearance** | **integration (joint)** | ❌ **NOT VERIFIED — never run** |
| Physical volume / penetration exact value | — | ❌ **NOT VERIFIED** (BVH triangle-overlap evidence only) |

⚠ **Critical:** every integration-side ✅ above was proven against the weapon form that CE15 replaces. **None of those results transfers automatically to CE15.**

---

## 4. Required validation after ANY form change

Triggered by any change to the weapon-form asset (geometry, materials, core, seam, termination):

1. **Re-link** the updated weapon-form asset into the integration asset (never copy/flatten).
2. Re-run, in the integration context:
   - world-space collision: weapon ↔ actor mitten, cloak, arm, torso — across **P1 / P2 / P3**
   - the **8-pose** clearance gate
   - docking load-path continuity (pelvis anchor → attachment root)
   - grip-IK convergence / marker-to-handle delta
   - cloak coverage
3. Re-confirm, on the weapon side: silhouette 64/128 px, core OFF/OFF/ON, violet gates, weapon-internal collisions, spine/core hash integrity.
4. Record results in a new dated proof document. **Do not** reuse or cite a prior integration PASS as if it covered the new form.
5. No integrated candidate may be proposed until steps 1–4 complete.

---

## 5. Promotion criteria — integrated production candidate

All must hold simultaneously, with dated evidence:

1. Weapon-side gates PASS on the current CE15-lineage form.
2. Integration-side gates PASS **against that same form** (§4).
3. Physical-volume status explicitly stated (currently **NOT VERIFIED**).
4. Open conflicts closed or explicitly waived in writing: material-arc reconciliation (MAT_C vs V0.29 graphite/titanium/steel) · dimension reconciliation (canon inches vs built 1.2 m) · canon-authority promotion packet.
5. An explicit, dated **operator visual ruling** on the integrated result — per `PROJECT_MODEL.md` I12, never on a self-reported technical pass.
6. Only then may `ASSET_LOCK` / `PRODUCTION_READY` be considered — and those remain operator-only actions.

**Current standing:** CE15 is **visual-form authority only**. No asset lock, no production-ready status, no integration completion exists anywhere in the project today.

---

## 6. Change log

| Date | Event |
|---|---|
| 2026-08-06 | Contract established under operator ruling D4 = C. CE15 named weapon-form authority; V0.89 named actor-integration authority; link/reference handoff mandated; CE15 ↔ actor validation recorded as NOT VERIFIED. |
