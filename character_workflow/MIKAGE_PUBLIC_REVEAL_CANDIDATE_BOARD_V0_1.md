# MIKAGE PUBLIC REVEAL CANDIDATE BOARD — V0.1

Date: 2026-05-28
Status: OPERATOR_REVIEW_PENDING
Asset lock: NO
Canon lock: NO

---

## PURPOSE

This board consolidates all known existing Mikage IP visual assets and assigns each a public reveal status.

No asset is approved for public reveal by this document alone.
Every asset marked PENDING_OPERATOR_REVIEW requires explicit operator sign-off before it may be released publicly.

```text
FILM_PROOF_APPROVED ≠ PUBLIC_REVEAL_APPROVED
PRESENTATION_ONLY ≠ PUBLIC_REVEAL_APPROVED
CANON_LOCKED ≠ PUBLIC_REVEAL_APPROVED
```

---

## APPROVAL KEY

```text
APPROVED_FOR_PUBLIC     = Operator has explicitly cleared this asset for public release
PENDING_OPERATOR_REVIEW = Asset exists and may be a candidate — awaiting operator decision
NOT_FOR_PUBLIC          = Internal use only — do not release
DOES_NOT_EXIST          = No asset present — cannot be reviewed
```

---

## 1. MIKAGE ZENITH — CORE CANON IMAGES

| # | Asset | Path | Lock Status | Public Reveal Status |
|---|---|---|---|---|
| 1 | PRIMARY_V2 (primary full-body) | `character_workflow/mikage_full_body_canon_v1/03_CORE_ASSETS/PRIMARY_V2/a_highly_detailed_ultra_clean_concept_art_chara.png` | CORE_CANON — CANON_LOCKED_REFERENCE_V1 | PENDING_OPERATOR_REVIEW |
| 2 | POSE_TEST_01 | `character_workflow/mikage_full_body_canon_v1/03_CORE_ASSETS/POSE_TEST_01/chiến_binh_máy_trong_bóng_tối.png` | CORE_CANON — STABLE_POSE_PASS | PENDING_OPERATOR_REVIEW |
| 3 | POSE_TEST_03 | `character_workflow/mikage_full_body_canon_v1/03_CORE_ASSETS/POSE_TEST_03/a_dramatic_high_detail_sci_fi_character_portrait.png` | CORE_CANON — PASS_AS_CORE_POSE_CANDIDATE | PENDING_OPERATOR_REVIEW |
| 4 | POSE_TEST_02 | `character_workflow/mikage_full_body_canon_v1/04_VARIANT_ONLY/POSE_TEST_02/a_dark_studio_character_concept_art_scene_a_full.png` | VARIANT_ONLY — CONDITIONAL_PASS | PENDING_OPERATOR_REVIEW — variant only; must not replace core canon reference |

---

## 2. MIKAGE ZENITH — PRESENTATION OUTPUTS

These are pre-formatted presentation derivatives, not source images.

| # | Asset | Path | Format | Public Reveal Status |
|---|---|---|---|---|
| 5 | Full body 9x16 | `character_workflow/mikage_full_body_canon_v1/05_PRESENTATION_ONLY/01_FULL_BODY_9x16.jpg` | PRESENTATION_ONLY | PENDING_OPERATOR_REVIEW |
| 6 | Upper body 1x1 | `character_workflow/mikage_full_body_canon_v1/05_PRESENTATION_ONLY/02_UPPER_BODY_1x1.jpg` | PRESENTATION_ONLY | PENDING_OPERATOR_REVIEW |
| 7 | Thumbnail 100x175 upscaled | `character_workflow/mikage_full_body_canon_v1/05_PRESENTATION_ONLY/03_THUMBNAIL_100x175_UPSCALED.jpg` | PRESENTATION_ONLY | PENDING_OPERATOR_REVIEW |
| 8 | Icon 300x300 upscaled | `character_workflow/mikage_full_body_canon_v1/05_PRESENTATION_ONLY/04_ICON_300x300_UPSCALED.jpg` | PRESENTATION_ONLY | PENDING_OPERATOR_REVIEW |
| 9 | ChatGPT Image 22:10:33 2026-05-26 | `character_workflow/mikage_full_body_canon_v1/05_PRESENTATION_ONLY/ChatGPT Image 22_10_33 26 thg 5, 2026.png` | PRESENTATION_ONLY | PENDING_OPERATOR_REVIEW |
| 10 | ChatGPT Image 00:26:27 2026-05-27 | `character_workflow/mikage_full_body_canon_v1/05_PRESENTATION_ONLY/ChatGPT Image 00_26_27 27 thg 5, 2026.png` | PRESENTATION_ONLY | PENDING_OPERATOR_REVIEW |
| 11 | ChatGPT Image 00:26:39 2026-05-27 | `character_workflow/mikage_full_body_canon_v1/05_PRESENTATION_ONLY/ChatGPT Image 00_26_39 27 thg 5, 2026.png` | PRESENTATION_ONLY | PENDING_OPERATOR_REVIEW |
| 12 | ChatGPT Image 00:26:44 2026-05-27 | `character_workflow/mikage_full_body_canon_v1/05_PRESENTATION_ONLY/ChatGPT Image 00_26_44 27 thg 5, 2026.png` | PRESENTATION_ONLY | PENDING_OPERATOR_REVIEW |
| 13 | ChatGPT Image 00:26:51 2026-05-27 | `character_workflow/mikage_full_body_canon_v1/05_PRESENTATION_ONLY/ChatGPT Image 00_26_51 27 thg 5, 2026.png` | PRESENTATION_ONLY | PENDING_OPERATOR_REVIEW |
| 14 | ChatGPT Image 00:26:56 2026-05-27 | `character_workflow/mikage_full_body_canon_v1/05_PRESENTATION_ONLY/ChatGPT Image 00_26_56 27 thg 5, 2026.png` | PRESENTATION_ONLY | PENDING_OPERATOR_REVIEW |
| 15 | ChatGPT Image 00:27:05 2026-05-27 | `character_workflow/mikage_full_body_canon_v1/05_PRESENTATION_ONLY/ChatGPT Image 00_27_05 27 thg 5, 2026.png` | PRESENTATION_ONLY | PENDING_OPERATOR_REVIEW |
| 16 | ChatGPT Image 00:27:14 2026-05-27 | `character_workflow/mikage_full_body_canon_v1/05_PRESENTATION_ONLY/ChatGPT Image 00_27_14 27 thg 5, 2026.png` | PRESENTATION_ONLY | PENDING_OPERATOR_REVIEW |

---

## 3. MIKAGE ZENITH — REFERENCE SHEET

| # | Asset | Path | Lock Status | Public Reveal Status |
|---|---|---|---|---|
| 17 | Character Reference Sheet V1 Draft | `character_workflow/mikage_full_body_canon_v1/02_REFERENCE_SHEET/MIKAGE_CHARACTER_REFERENCE_SHEET_V1_DRAFT.jpg` | DRAFT — operator-passed, canon lock basis | PENDING_OPERATOR_REVIEW |

---

## 4. KEY VISUAL / FILM PROOF ASSETS

These assets are LOCKED and APPROVED_FOR_FILM_PROOF_SOURCE. That approval does NOT extend to public reveal.

| # | Asset | Path (film proof primary) | Lock Status | Public Reveal Status |
|---|---|---|---|---|
| 18 | UNIFIED_KEY_VISUAL_V4 | `film_proofs/MIKAGE_FILM_PROOF_01/source_pack_v1/comfyui_canon_candidates/SHOT_02_MIKAGE_PRESENCE__02_UNIFIED_KEY_VISUAL_V4_LOCKED__APPROVED_FOR_FILM_PROOF_SOURCE.png` | LOCKED — APPROVED_FOR_FILM_PROOF_SOURCE | PENDING_OPERATOR_REVIEW |
| 19 | AUDIO_SHORT_VISUAL_CANON_V4 | `film_proofs/MIKAGE_FILM_PROOF_01/source_pack_v1/comfyui_canon_candidates/SHOT_01_SIGNAL_VOID_OR_SYSTEM_WAKE__01_AUDIO_SHORT_VISUAL_CANON_V4_LOCKED__APPROVED_FOR_FILM_PROOF_SOURCE.png` | LOCKED — APPROVED_FOR_FILM_PROOF_SOURCE | PENDING_OPERATOR_REVIEW |
| 20 | ZENITH_BLADE_V2 | `film_proofs/MIKAGE_FILM_PROOF_01/source_pack_v1/comfyui_canon_candidates/SHOT_03_TITLE_OR_ICONIC_HERO__03_ZENITH_BLADE_V2_LOCKED__APPROVED_FOR_FILM_PROOF_SOURCE.png` | LOCKED — APPROVED_FOR_FILM_PROOF_SOURCE | PENDING_OPERATOR_REVIEW |

---

## 5. INTERNAL REFERENCE COPIES — NOT FOR PUBLIC

These are internal reference copies only. They must not be used for public reveal.

| # | Asset | Path | Status |
|---|---|---|---|
| 21 | REF_SP001 — UNIFIED_KEY_VISUAL_V4 mask/body silhouette | `docs/character/references/mask_body_silhouette/REF_SP001_UNIFIED_KEY_VISUAL_V4__MASK_BODY_SILHOUETTE.png` | NOT_FOR_PUBLIC — internal reference copy |
| 22 | REF_SP002 — ZENITH_BLADE_V2 blade | `docs/character/references/blade/REF_SP002_ZENITH_BLADE_V2__BLADE.png` | NOT_FOR_PUBLIC — internal reference copy |
| 23 | REF_SP003 — AUDIO_SHORT_VISUAL_CANON_V4 environment | `docs/character/references/environment/REF_SP003_AUDIO_SHORT_VISUAL_CANON_V4__ENVIRONMENT.png` | NOT_FOR_PUBLIC — internal reference copy |

---

## 6. COMMANDER LYRE — NO VISUAL ASSETS

```text
STATUS = DOES_NOT_EXIST
VISUAL_ASSETS = ZERO
IMAGES = NONE
3D_MODEL = NONE
PUBLIC_REVEAL_STATUS = NOT_APPLICABLE — no asset to review
```

Brief and visual spec committed. Production prompt seed available in `COMMANDER_LYRE_VISUAL_SPEC_CLEAN_V0_1.md` §14.
No images may be generated without operator approval.

---

## 7. LORA — NO VISUAL ASSETS

```text
STATUS = DOES_NOT_EXIST
VISUAL_ASSETS = ZERO
IMAGES = NONE
3D_MODEL = NONE
PUBLIC_REVEAL_STATUS = NOT_APPLICABLE — no asset to review
```

Brief and visual spec committed. KEY_VISUAL_01 production prompt seed available in `LORA_VISUAL_SPEC_CLEAN_V0_1.md` §10.
No images may be generated without operator approval.

---

## 8. SUMMARY COUNTS

| Category | Count |
|---|---|
| Total assets inventoried | 23 |
| APPROVED_FOR_PUBLIC | 0 |
| PENDING_OPERATOR_REVIEW | 20 |
| NOT_FOR_PUBLIC | 3 |
| DOES_NOT_EXIST | Lyre + LORA (no images) |

---

## 9. OPERATOR REVIEW GATE

To approve any asset for public reveal, operator must explicitly update this board:

```text
Change: PENDING_OPERATOR_REVIEW → APPROVED_FOR_PUBLIC
Add: APPROVAL_DATE, APPROVED_BY, APPROVED_FOR (platform/context)
```

No automated approval. No batch approval. Each asset reviewed individually.

---

*End of MIKAGE_PUBLIC_REVEAL_CANDIDATE_BOARD_V0_1.md*
*Zero assets approved for public release as of 2026-05-28.*
*Operator review required before any asset exits this board as APPROVED_FOR_PUBLIC.*
