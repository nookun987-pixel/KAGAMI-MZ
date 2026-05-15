# MIKAGE_CHARACTER_PRODUCTION_SOURCE_PACK_FROM_ANCHOR_V1

**Date:** 2026-05-15  
**Task:** `BUILD_CHARACTER_PRODUCTION_SOURCE_PACK_FROM_ANCHOR_V1`  
**Confirmed HEAD:** `a44737e`  
**Current route:** `CHARACTER_PRODUCTION_FROM_ANCHOR_V1`  

---

## Source Pack Status

| Field | Value |
|---|---|
| CHARACTER_PRODUCTION_SOURCE_PACK_STATUS | PREPARED |
| SOURCE_ANCHOR | `docs/character/anchor_v1_candidates/P3A_R4_HELMET_INPAINT_001.png` |
| NEXT_SAFE_TASK | `DEFINE_FULL_BODY_PRODUCTION_CONSTRAINTS_FROM_ANCHOR_V1` |
| ASSET_LOCK_STATUS | `NOT_LOCKED` |
| 3D_ACTOR_STATUS | `NOT_STARTED` |
| RIG_STATUS | `NOT_STARTED` |
| CINEMATIC_PROOF_SHOT_STATUS | `NOT_STARTED` |

---

## Required Source Paths

| Role | Path |
|---|---|
| Source anchor | `docs/character/anchor_v1_candidates/P3A_R4_HELMET_INPAINT_001.png` |
| Source base | `docs/character/anchor_v1_candidates/P3A_R4_001_STRONG_CANDIDATE.png` |
| Helmet inpaint mask | `docs/character/anchor_v1_candidates/P3A_R4_HELMET_INPAINT_001_MASK.png` |
| Score report | `reports/SCORE_P3A_R4_HELMET_INPAINT_ANCHOR_CANDIDATE.md` |
| Lock decision report | `reports/MIKAGE_CHARACTER_ANCHOR_V1_LOCK_DECISION.md` |
| Registry entry | `docs/character/MIKAGE_CHARACTER_ANCHOR_V1_ASSET_REGISTRY_ENTRY.md` |
| Final handoff | `reports/MIKAGE_CHARACTER_ANCHOR_V1_FINAL_HANDOFF.md` |
| Route open report | `reports/MIKAGE_CHARACTER_PRODUCTION_ROUTE_FROM_ANCHOR_V1_OPEN.md` |

---

## Existing Locked Canon Source References

Authoritative registry:

```text
docs/pipeline/01_CANON_ASSET_REGISTRY.md
```

Locked canon entries listed there:

- `MIKAGE_UNIFIED_KEY_VISUAL_V4_FROM_CLEAN_SOURCES`
- `MIKAGE_HELMET_FRONT_VIEW_3D_SOURCE_V1_ORTHO`
- `MIKAGE_VOLUME_FIRST_3D_HELMET_SIDE_V1_ORTHO`
- `MIKAGE_ZENITH_BLADE_V2_POLISH_ONE_SHOT`

Accessible character reference copies:

- `docs/character/references/mask_body_silhouette/REF_SP001_UNIFIED_KEY_VISUAL_V4__MASK_BODY_SILHOUETTE.png`
- `docs/character/references/blade/REF_SP002_ZENITH_BLADE_V2__BLADE.png`
- `docs/character/references/environment/REF_SP003_AUDIO_SHORT_VISUAL_CANON_V4__ENVIRONMENT.png`
- `docs/character/references/material/REF_GOOD_CERAMIC_00__MATERIAL.png`
- `docs/character/references/material/REF_GOOD_CERAMIC_01__MATERIAL.png`
- `docs/character/references/material/REF_GOOD_CERAMIC_02__MATERIAL.png`
- `docs/character/references/material/REF_GOOD_CERAMIC_03__MATERIAL.png`
- `docs/character/references/material/REF_GOOD_CERAMIC_04__MATERIAL.png`

Existing source-pack documentation:

- `reports/MIKAGE_CHARACTER_SOURCE_PACK_V1_MANIFEST.md`
- `reports/MIKAGE_CHARACTER_SOURCE_PACK_V1_REJECTS.md`
- `reports/MIKAGE_SILHOUETTE_CANON_V1_LOCK_SPEC.md`

---

## Approved Visual Traits

Carry these traits forward from Anchor V1:

- elongated cool white porcelain helmet
- exactly two separate ultra-thin horizontal void-black sensor slits
- visible white porcelain gap between helmet slits
- sealed faceless helmet with no eyes, mouth, nose, visor, or logo
- massive wide pauldrons / shoulders preserved from R4
- fully covered white armor with dark panel gaps
- rectangular matte void-black Zenith Blade on the right side
- long heavy black hair mass on the left side
- asymmetric silhouette: hair mass left, sword mass right
- cool white / void black / violet accent palette
- void black background standard
- sacred-tech, sealed, ceremonial character presence

---

## Forbidden Drift List

Reject or block production candidates that introduce any of the following:

- replacing the source anchor with R5 or any R5-derived base
- full-body R6 continuation inside the closed Anchor V1 route
- blank helmet
- one slit only
- merged visor
- mouth-like mark
- logo-like mark
- human eyes, face, nose, mouth, expression, or exposed face
- warm gold/orange/crimson helmet drift
- plastic or flat material drift
- sword taper, curve, katana read, or non-rectangular blade
- shoulder or pauldron narrowing from Anchor V1
- hair shortening, color shift, or loss of left-side mass
- exposed skin
- body proportions that break the Anchor V1 silhouette read
- background becoming busy, warm, scenic, or non-void
- claim of final asset lock without separate approval
- claim of 3D actor, rig, or cinematic readiness before those gates exist

---

## Production-Use Boundaries

This source pack prepares the next production stage only.

Allowed use:

- audit Anchor V1 against existing locked canon sources
- build production constraints from Anchor V1
- prepare downstream planning for source pack, full-body constraints, proxy actor, rig/motion, and cinematic proof shot

Not allowed:

- no new image rendering
- no full-body R6
- no R5 replacement
- no final asset lock claim
- no 3D actor claim
- no rig claim
- no cinematic-ready claim
- no changing Anchor V1 locked reference

`ASSET_LOCK_STATUS` remains `NOT_LOCKED`.

---

## Next Required Gate

```text
DEFINE_FULL_BODY_PRODUCTION_CONSTRAINTS_FROM_ANCHOR_V1
```

Before any production execution, define full-body constraints from the locked Anchor V1 source and review them against:

- `docs/character/anchor_v1_candidates/P3A_R4_HELMET_INPAINT_001.png`
- `docs/character/MIKAGE_CHARACTER_ANCHOR_V1_ASSET_REGISTRY_ENTRY.md`
- `reports/SCORE_P3A_R4_HELMET_INPAINT_ANCHOR_CANDIDATE.md`
- `reports/MIKAGE_SILHOUETTE_CANON_V1_LOCK_SPEC.md`
- `docs/pipeline/01_CANON_ASSET_REGISTRY.md`
