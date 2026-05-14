# MIKAGE_CHARACTER_SOURCE_PACK_V1_REJECTS

**TASK_ID:** MIKAGE_CHARACTER_SOURCE_PACK_V1
**Date:** 2026-05-15

---

## FILES EXCLUDED FROM SOURCE PACK — NOT COPIED TO docs/character/references/

The following files exist in the repo but were excluded from the active source pack.

---

### EXCLUDED — REQUIRE HUMAN REVIEW BEFORE USE

| File | Location | Reason excluded |
|---|---|---|
| SHOT_01_SIGNAL_VOID__img_2__CANDIDATE_REQUIRES_HUMAN_REVIEW.png | `film_proofs/.../visual_candidates/` | Not verified against locked identity — review required before use as reference |
| SHOT_02_MIKAGE_PRESENCE__GOOGLE_LANE_E2E_001__CANDIDATE_REQUIRES_HUMAN_REVIEW.png | `film_proofs/.../visual_candidates/` | Not verified — may contain drift vs locked key visual |
| SHOT_03_TITLE_OR_SYSTEM_WAKE__base_anchor__CANDIDATE_REQUIRES_HUMAN_REVIEW.png | `film_proofs/.../visual_candidates/` | Not verified — may conflict with locked blade reference |

**If human reviews these and confirms they match locked identity → can be added to source pack.**

---

### EXCLUDED — ARCHIVE ONLY, DO NOT USE AS REFERENCE

| File | Location | Drift type | Reason excluded |
|---|---|---|---|
| GOLDEN_MASK_001__ARCHIVE_ONLY_DO_NOT_USE_DIRECTLY.png | `film_proofs/.../rejected_or_archive_only/` | Warm-tone mask drift | Copied to reject_examples/ as NEGATIVE reference only — NOT a positive reference |
| golden_mask_batch_001__ARCHIVE_ONLY_DO_NOT_USE_DIRECTLY.png | same | Warm-tone mask drift | Redundant with GOLDEN_MASK_001 — excluded entirely |
| img_1__ARCHIVE_ONLY_DO_NOT_USE_DIRECTLY.png | same | Unknown — unverified | ARCHIVE_ONLY tag — no verification source — excluded |
| img_3__ARCHIVE_ONLY_DO_NOT_USE_DIRECTLY.png | same | Unknown — unverified | ARCHIVE_ONLY tag — excluded |
| img_4__ARCHIVE_ONLY_DO_NOT_USE_DIRECTLY.png | same | Unknown — unverified | ARCHIVE_ONLY tag — excluded |

---

### EXCLUDED — DISCRIMINATION BATCH (REMAINING 10 GOOD CERAMIC)

| Folder | Reason |
|---|---|
| good_ceramic_05 through good_ceramic_14 | 5 samples (00–04) sufficient for material reference — remaining 10 not needed unless material scoring is contested |

**If material scoring requires more reference variety → add good_ceramic_05–09.**

---

### NOT ACCESSIBLE — ComfyUI paths not mounted

| Asset | Path | Why needed | Resolution |
|---|---|---|---|
| MIKAGE_HELMET_FRONT_VIEW_3D_SOURCE_V1_ORTHO.png | `D:\workspace\ComfyUI\MIKAGE_CANON\08_CHARACTER_REVIEW_CANDIDATES\` | Isolated helmet front reference — critical for Step 1 and 5 scoring | Mount ComfyUI in Cowork OR manually copy to docs/character/references/helmet/ |
| MIKAGE_VOLUME_FIRST_3D_HELMET_SIDE_V1_ORTHO.png | same | Isolated helmet side reference — sensor slit geometry check | Same resolution |
| MIKAGE_COMP_07B_ZENITH_BLADE_CLEAN_MONOLITH.png | `D:\workspace\ComfyUI\MIKAGE_CANON\10_COMPONENT_CANDIDATE_SET_V1\07_ZENITH_BLADE\` | Additional blade candidate for comparison | Mount ComfyUI |
| Component atlas (03_COMPONENT_REFERENCE_ATLAS_V1) | `D:\workspace\ComfyUI\MIKAGE_CANON\` | Full material and component reference set | Mount ComfyUI |

---

### EXCLUDED — GENERATION/TESTING OUTPUTS (not reference material)

| Folder | Count | Reason |
|---|---|---|
| `calibration_batch_images/`, `calibration_jobs/` | ~30 jobs | Pipeline calibration outputs — not character reference material |
| `post_anchor_images/`, `post_anchor_jobs/` | 50 jobs | img2img anchor tests — not approved reference material |
| `test_stability_*`, `test_no_fake_pass_*`, `test_hard_reject_images/` | 100+ jobs | Pipeline testing outputs — not character reference material |
| `fake_pass_test_images/`, `fake_pass_test_jobs/` | 10 jobs | Synthetic failure tests — kept as pipeline validation only |
| `runs/` | 1 | GOOGLE_LANE_E2E_001 output — requires human review |

---

*MIKAGE_CHARACTER_SOURCE_PACK_V1_REJECTS — exclusion log — no canon approved — no assets locked*
