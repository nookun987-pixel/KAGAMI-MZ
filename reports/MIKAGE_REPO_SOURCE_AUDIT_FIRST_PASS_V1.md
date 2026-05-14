# MIKAGE_REPO_SOURCE_AUDIT_FIRST_PASS_V1

**TASK_ID:** MIKAGE_REPO_SOURCE_AUDIT_FIRST_PASS_V1
**Date:** 2026-05-15
**Executor:** Claude Cowork / Local Agent
**RESULT:** PASS — with path redirect and inaccessible mount warnings

---

## PATH_REDIRECT_WARNING

Requested output path `D:\KAGAMI-MZ\reports\` is NOT mounted in agent sandbox.
Output written to `D:\KAGAMI-MZ_SYNC_PUSH_V2\reports\` (accessible worktree).
The following requested source paths were NOT accessible:

| Path | Status |
|---|---|
| `D:\KAGAMI-MZ\canon\rules\` | NOT MOUNTED |
| `D:\KAGAMI-MZ\reference_review\` | NOT MOUNTED |
| `D:\KAGAMI-MZ\reference_review\artstation_pull\` | NOT MOUNTED |
| `D:\KAGAMI-MZ\canon\` | NOT MOUNTED |
| `D:\workspace\ComfyUI\MIKAGE_CANON\` | NOT MOUNTED |

Canon rule files were found at SYNC_PUSH_V2 root (mirrored copies):
- `D:\KAGAMI-MZ_SYNC_PUSH_V2\mikage_color_canon.json` ✓ READ
- `D:\KAGAMI-MZ_SYNC_PUSH_V2\MIKAGE_STRUCTURED_RULES.json` ✓ READ
- `D:\KAGAMI-MZ_SYNC_PUSH_V2\MIKAGE_WORLD_CORE.json` ✓ READ

ComfyUI canon assets (UNIFIED_KEY_VISUAL_V4, ZENITH_BLADE_V2, helmet sources, component set V1) — documented in MIKAGE_USABLE_ASSET_INVENTORY_V1.md but files physically at `D:\workspace\ComfyUI\MIKAGE_CANON\` which is NOT mounted. Copies of 3 locked assets exist in film_proofs/source_pack_v1/ (accessible).

---

## 1. CANON RULES — VERIFIED FROM FILE

### 1.1 mikage_color_canon.json (MIKAGE_COLOR_CANON_V1)

| Role | Anchors | Rule |
|---|---|---|
| Ceramic off-white | #EEE7D7, #F6F5F6, #E2C4BE, #D6D6D6, #CE9F6F | warm_off_white_only — #FFFFFF forbidden |
| Charcoal black | #252321, #111415, #0C0602, #424246, #5F5F5E | temperature_variation_required — #000000 forbidden |
| Restrained crimson | #8E050F, #8F1D21, #351E1C, #9D2933, #D11033 | only_in_seams_and_cores |
| Muted earth | #C8AD87, #3C2812, #BE7F51, #8695A2, #9F5233 | low_saturation_material_support |

**Tonal rules:** 70-shadow/30-light contrast · diffuse highlight (no specular) · bokashi non-linear gradient
**Forbidden globally:** neon_rgb · oversaturation · pure_white · pure_black · flat_color_no_texture

### 1.2 MIKAGE_STRUCTURED_RULES.json (Canon v2.0 — LOCKED)

| Area | Rule |
|---|---|
| Head | Faceless white cybernetic helmet, smooth aerodynamic, subtle fox-like silhouette |
| Eyes | **Void black optical sensors, no pupils, no direct light** — static, emotionless |
| Hair | Long, straight, heavy black hair flowing naturally |
| Armor | Boron Carbide (B4C) porcelain, ultra-hard, pristine white outer shell |
| Under-layer | Matte black graphene hex-grid |
| Seams | Kintsugi: fine conductive gold resin filling cracks |
| Energy | Deep crimson synthetic blood and thermal glow leaking from seams |
| Weapon | 350kg heavy industrial rectangular slab, dark rusty titanium, crimson heated core, steam |
| Colors | Primary: #FAFAFA/#0A0A0A · Accent: #E60000 (crimson) · Gold (kintsugi lines only) |
| Forbidden | Green, Orange, Yellow, Cyan on suit, Rainbow |

### 1.3 MIKAGE_WORLD_CORE.json (Canon v1)

| Rule | Value |
|---|---|
| Mask | Symmetrical faceless, void-black eye regions — any human read is canon-breaking |
| Silhouette | Hard-surface, iconic, readable under 1 second |
| Crimson | Contained and internal, never chaotic or neon-spilled |
| Z-Blue | Protected brand color #0000C8 (provisional — exact lock pending Art Director) |
| Frame logic | 30 (context) / 40 (product safe zone) / 30 (distortion) |
| Environment | Neon grid slums · white monolith sterile halls · acid rain alleys |
| Geometry | Flat concrete · glass reflection · metal grid · corridor line |

---

## 2. CRITICAL CANON DISCREPANCY — MUST RESOLVE BEFORE GENERATION

**DISCREPANCY D-001: Helmet eye region**

| Source | Helmet eye rule |
|---|---|
| MIKAGE_STRUCTURED_RULES.json v2.0 LOCKED | "Void black optical sensors, no pupils, no direct light" — eye regions PRESENT |
| MIKAGE_WORLD_CORE.json v1 | "void-black eye regions" — eye regions PRESENT |
| MIKAGE_CHARACTER_PROMPT_LIBRARY_v0.1 | "no eye slit, no visor, no mouth, no facial opening of any kind" — helmet FULLY SEALED |

The locked canon rules (v2.0) describe a helmet with **void-black eye sensor zones** — not a fully featureless sealed ovoid. The prompt library v0.1 treats the helmet as a completely blank surface. These are **contradictory generation targets**.

**DISCREPANCY D-002: Palette — accent color**

| Source | Accent color |
|---|---|
| MIKAGE_STRUCTURED_RULES.json v2.0 | Accent: #E60000 crimson |
| MIKAGE_COLOR_CANON_V1 | Restrained crimson in seams/cores · Muted earth support |
| MIKAGE_CHARACTER_PROMPT_LIBRARY_v0.1 | Electric violet #7b5ea7 / #9d7fd0 as primary accent |

The prompt library v0.1 uses violet as accent. The locked color canon and structured rules use crimson. No violet appears in any canon rule JSON.

**DISCREPANCY D-003: Hair**

| Source | Hair rule |
|---|---|
| MIKAGE_STRUCTURED_RULES.json v2.0 | Long, straight, heavy black hair — PRESENT |
| MIKAGE_CHARACTER_PROMPT_LIBRARY_v0.1 | No hair mentioned in any prompt |

**VERDICT:** MIKAGE_CHARACTER_PROMPT_LIBRARY_v0.1 does not align with locked canon rules (v2.0). Before running the test set, the prompt library requires reconciliation against MIKAGE_STRUCTURED_RULES.json v2.0.

---

## 3. IMAGE ASSET INVENTORY — ACCESSIBLE IN SYNC_PUSH_V2

### 3.1 Locked / Approved Source Pack Candidates (accessible copies)

| File | Location | Status | Use |
|---|---|---|---|
| SHOT_01 — AUDIO_SHORT_VISUAL_CANON_V4 | `film_proofs/.../comfyui_canon_candidates/` | LOCKED/APPROVED_FOR_FILM_PROOF_SOURCE | Style/environment reference |
| SHOT_02 — UNIFIED_KEY_VISUAL_V4 | `film_proofs/.../comfyui_canon_candidates/` | LOCKED/APPROVED_FOR_FILM_PROOF_SOURCE | Identity anchor |
| SHOT_03 — ZENITH_BLADE_V2 | `film_proofs/.../comfyui_canon_candidates/` | LOCKED/APPROVED_FOR_FILM_PROOF_SOURCE | Weapon reference |

### 3.2 Archive / Rejected (do not use as source)

| File | Location | Status |
|---|---|---|
| GOLDEN_MASK_001 | `film_proofs/.../rejected_or_archive_only/` | ARCHIVE_ONLY — do not use directly |
| golden_mask_batch_001 | same | ARCHIVE_ONLY |
| img_1, img_3, img_4 | same | ARCHIVE_ONLY |

### 3.3 Visual Candidates (require human review)

| File | Status |
|---|---|
| SHOT_01_SIGNAL_VOID__img_2 | CANDIDATE_REQUIRES_HUMAN_REVIEW |
| SHOT_02_MIKAGE_PRESENCE__GOOGLE_LANE_E2E_001 | CANDIDATE_REQUIRES_HUMAN_REVIEW |
| SHOT_03_TITLE_OR_SYSTEM_WAKE__base_anchor | CANDIDATE_REQUIRES_HUMAN_REVIEW |

### 3.4 Discrimination / Training Batches (accessible)

| Folder | Count | Type |
|---|---|---|
| `discrimination_batch/good_ceramic_*` | 15 images | POSITIVE material reference — good ceramic surface |
| `discrimination_batch/bad_flat_*` | 10 images | NEGATIVE — flat, no texture |
| `discrimination_batch/bad_multishape_*` | 10 images | NEGATIVE — multiple shapes / silhouette confusion |
| `discrimination_batch/bad_noise_*` | 10 images | NEGATIVE — noise drift |
| `discrimination_batch/bad_plastic_*` | 10 images | NEGATIVE — plastic surface read |
| `calibration_batch_images/`, `calibration_images/` | ~30+ | Calibration reference — sorted by job |
| `post_anchor_images/`, `post_anchor_jobs/` | 50+ jobs | img2img post-anchor tests |
| `test_stability_*`, `test_no_fake_pass_*`, `test_hard_reject_images/` | 50+ jobs | Testing pipeline outputs — not production assets |

### 3.5 NOT ACCESSIBLE — Canon Assets at D:\workspace\ComfyUI\MIKAGE_CANON\

| Asset | Status per inventory | Physical location |
|---|---|---|
| MIKAGE_UNIFIED_KEY_VISUAL_V4 | LOCKED_OR_CANON_REFERENCE | NOT MOUNTED |
| ZENITH_BLADE_V2 | LOCKED_OR_CANON_REFERENCE | NOT MOUNTED |
| MIKAGE_VOLUME_FIRST_3D_HELMET_SIDE_V1 | LOCKED_OR_CANON_REFERENCE | NOT MOUNTED |
| MIKAGE_HELMET_FRONT_VIEW_3D_SOURCE_V1 | LOCKED_OR_CANON_REFERENCE | NOT MOUNTED |
| Component Candidate Set V1 (10 components) | PRODUCTION_CANDIDATE_NEEDS_REVIEW | NOT MOUNTED |
| Component Reference Atlas V1 | USABLE_FOR_PRIVATE_REFERENCE_ONLY | NOT MOUNTED |
| FULL_BODY_CANDIDATE_001 | FAILED_DO_NOT_USE | NOT MOUNTED |

---

## 4. REFERENCE TYPE COVERAGE — GAPS

| Reference Type | Status | Notes |
|---|---|---|
| Helmet / mask — locked reference | DOCUMENTED, NOT MOUNTED | HELMET_SIDE + HELMET_FRONT locked, copies not in SYNC_PUSH_V2 |
| Helmet / mask — accessible copy | MISSING | Only locked full-character key visual accessible (SHOT_02) |
| Full-body character — locked | MISSING | No locked full-body exists yet (bust bridge pending) |
| Sword / blade — locked reference | ACCESSIBLE COPY | SHOT_03 (Zenith Blade V2) in film_proofs/ |
| Material — porcelain/ceramic | ACCESSIBLE | good_ceramic discrimination batch (15 images) |
| Material — graphene underlayer | DOCUMENTED, NOT MOUNTED | Component candidate at ComfyUI path |
| Material — kintsugi gold seam | MISSING from accessible files | Only described in rules |
| Environment — void black | ACCESSIBLE (SHOT_01, SHOT_02) | In film_proofs/ |
| Environment — neon grid / acid rain | MISSING | No accessible environment plate |
| Style reference — artstation pull | NOT MOUNTED | D:\KAGAMI-MZ\reference_review\artstation_pull\ inaccessible |
| Silhouette / shape read test | ACCESSIBLE | Discrimination batch negative examples |
| Rejected / drift-prone assets | ACCESSIBLE | discrimination_batch/bad_* + rejected_or_archive_only/ |

---

## 5. REJECTED / DRIFT-PRONE ASSETS (identified)

| Asset | Failure mode | Location |
|---|---|---|
| FULL_BODY_CANDIDATE_001 | Failed canon gate | ComfyUI (NOT MOUNTED) |
| CONTROLLED_FRONT_CANON_REPAIR_V1 | Failed canon gate | ComfyUI (NOT MOUNTED) |
| BRUTALIST_VOID_CONSEQUENCE_CHAMBER_V3 | Environment/character hierarchy fail | ComfyUI (NOT MOUNTED) |
| golden_mask / GOLDEN_MASK_001 | Archive only — likely warm-tone/mask drift | film_proofs/rejected_or_archive_only/ |
| discrimination_batch/bad_flat_* (10) | Flat color, no material texture | SYNC_PUSH_V2/discrimination_batch/ |
| discrimination_batch/bad_plastic_* (10) | Plastic surface read | SYNC_PUSH_V2/discrimination_batch/ |
| discrimination_batch/bad_noise_* (10) | Noise drift | SYNC_PUSH_V2/discrimination_batch/ |
| discrimination_batch/bad_multishape_* (10) | Silhouette confusion | SYNC_PUSH_V2/discrimination_batch/ |

---

## 6. WORKFLOW / PIPELINE ASSETS

| File | Type | Status |
|---|---|---|
| `docs/handoff/ASSET-BUILD-09E_COMFYUI_WORKFLOW.json` | ComfyUI inpainting workflow | INPAINTING ONLY — not txt2img |
| `docs/handoff/ASSET-BUILD-07_COMFYUI_WORKFLOW_V2_SEED_A.json` | ComfyUI workflow | Needs inspection |
| Model: `juggernautXL_v8Rundiffusion.safetensors` | SDXL checkpoint | Used in 09E workflow |
| No txt2img workflow found in repo | MISSING | Required for character test set Step 1–8 |

---

## 7. BLOCKERS IDENTIFIED

| # | Blocker | Impact |
|---|---|---|
| B-01 | **Prompt library palette vs canon rules discrepancy** — violet vs crimson | HIGH — test set Step 1–8 may generate off-canon accent color |
| B-02 | **Prompt library helmet vs canon rules discrepancy** — sealed ovoid vs void-black sensor zones | HIGH — test set Step 1 prompt target conflicts with locked canon |
| B-03 | D:\KAGAMI-MZ\ and D:\workspace\ComfyUI\MIKAGE_CANON\ NOT MOUNTED | MEDIUM — locked canon assets not directly accessible for reference |
| B-04 | No txt2img ComfyUI workflow in repo | MEDIUM — Step 1–8 cannot use 09E workflow |
| B-05 | No accessible helmet isolated reference image | MEDIUM — cannot verify Step 1 output against locked helmet source |
| B-06 | Artstation pull reference not mounted | LOW — style reference missing |

---

*MIKAGE_REPO_SOURCE_AUDIT_FIRST_PASS_V1 — audit only — no canon approved — no assets locked*
