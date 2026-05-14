# MIKAGE_CHARACTER_SOURCE_PACK_V1_MANIFEST

**TASK_ID:** MIKAGE_CHARACTER_SOURCE_PACK_V1
**Date:** 2026-05-15
**Executor:** Claude Cowork / Local Agent
**RESULT:** PARTIAL_PASS — pack built with all accessible material; one required category missing (see blocker)

---

## PACK LOCATION

`docs/character/references/`

---

## CATEGORY COVERAGE

| Category | Status | Files in pack |
|---|---|---|
| MASK / BODY / SILHOUETTE | ✓ PRESENT | 1 — full character (helmet + body + blade in frame) |
| BLADE | ✓ PRESENT | 1 — isolated blade reference |
| ENVIRONMENT | ✓ PRESENT | 1 — void atmosphere reference |
| MATERIAL | ✓ PRESENT | 5 — good ceramic surface references |
| REJECT_EXAMPLE | ✓ PRESENT | 5 — drift failure examples |
| **HELMET ISOLATED** | **⚠ MISSING** | **0 — not accessible without mounting D:\workspace\ComfyUI** |

---

## REFERENCE FILES

### MASK / BODY / SILHOUETTE

| File | `docs/character/references/mask_body_silhouette/REF_SP001_UNIFIED_KEY_VISUAL_V4__MASK_BODY_SILHOUETTE.png` |
|---|---|
| Source | `film_proofs/MIKAGE_FILM_PROOF_01/source_pack_v1/comfyui_canon_candidates/` |
| Original | MIKAGE_UNIFIED_KEY_VISUAL_V4 (copy) |
| Status | LOCKED_APPROVED_FOR_FILM_PROOF_SOURCE |
| Size | 1.3MB |
| Use for | Primary identity anchor · full character silhouette check · helmet form reference (embedded in full-body) · pauldron width check · cloak hierarchy check |
| Do NOT use for | Isolated helmet comparison · canon approval · asset lock |
| Why included | Strongest accessible identity reference in the repo. Contains helmet, pauldrons, sword, cloak in one frame. Closest thing to a full character canon reference available without mounting ComfyUI. |

---

### BLADE

| File | `docs/character/references/blade/REF_SP002_ZENITH_BLADE_V2__BLADE.png` |
|---|---|
| Source | `film_proofs/MIKAGE_FILM_PROOF_01/source_pack_v1/comfyui_canon_candidates/` |
| Original | ZENITH_BLADE_V2 (copy) |
| Status | LOCKED_APPROVED_FOR_FILM_PROOF_SOURCE |
| Size | 1.0MB |
| Use for | Sword form verification · rectangular slab check · no-taper check · matte black surface check · Step 2 output comparison |
| Do NOT use for | Canon approval · production-ready claim |
| Why included | Only accessible locked blade reference. Use to score D-03 (sword form) and D-04 (sword material) in test set review. |

---

### ENVIRONMENT

| File | `docs/character/references/environment/REF_SP003_AUDIO_SHORT_VISUAL_CANON_V4__ENVIRONMENT.png` |
|---|---|
| Source | `film_proofs/MIKAGE_FILM_PROOF_01/source_pack_v1/comfyui_canon_candidates/` |
| Original | AUDIO_SHORT_VISUAL_CANON_V4 (copy) |
| Status | LOCKED_APPROVED_FOR_FILM_PROOF_SOURCE |
| Size | 147KB |
| Use for | Void black environment standard · atmosphere quality check · Step 7 output comparison · D-14 background drift check |
| Do NOT use for | Canon approval · film source pack |
| Why included | Best accessible example of correct void environment. Use to judge whether generated backgrounds drift warm or busy. |

---

### MATERIAL (Ceramic Surface)

| File | Folder: `docs/character/references/material/` |
|---|---|
| Files | REF_GOOD_CERAMIC_00 through REF_GOOD_CERAMIC_04 (5 files) |
| Source | `discrimination_batch/good_ceramic_00–04/output.png` |
| Status | POSITIVE_DISCRIMINATION_REFERENCE (ALLOW verdict, Gemini validated) |
| Size | ~126KB each |
| Use for | Porcelain/ceramic surface quality benchmark · D-02 helmet palette check · D-05 armor palette check · Step 1 and 5 material scoring |
| Do NOT use for | Identity reference · body/silhouette scoring |
| Why included | 5 algorithmically-validated good ceramic examples. Use as a visual benchmark: generated helmet surface should read at this material quality level or better. |

---

### REJECT EXAMPLES

| File | Drift Type | Use |
|---|---|---|
| `reject_examples/REJECT_BAD_PLASTIC_00__DRIFT_PLASTIC_SURFACE.png` | Plastic surface — shiny, synthetic, no material depth | Compare against Step 1 helmet — if it looks like this, D-02 FAIL |
| `reject_examples/REJECT_BAD_FLAT_00__DRIFT_FLAT_NO_TEXTURE.png` | Flat color — no surface variation, no tonal depth | Compare against material outputs — if surface is this flat, score 0 on material |
| `reject_examples/REJECT_BAD_NOISE_00__DRIFT_NOISE.png` | Noise drift — random grain defeating form read | Flag if output silhouette is unreadable due to noise texture |
| `reject_examples/REJECT_BAD_MULTISHAPE_00__DRIFT_SILHOUETTE_CONFUSION.png` | Multiple shapes — silhouette ambiguous, hierarchy lost | Compare against Step 3 silhouette — if shape is this confused, D-08 FAIL |
| `reject_examples/REJECT_GOLDEN_MASK_001__ARCHIVE_WARM_TONE_MASK_DRIFT.png` | Warm-tone mask — gold/orange/cream mask coloring | Compare against Step 1 — if helmet reads this warm, D-02 FAIL |

---

## MISSING CATEGORY — BLOCKER REPORTED

### HELMET_ISOLATED — NOT PRESENT

**Required for:** Steps 1 and 5 (Helmet Standard, Helmet Close-Up) — cannot perform direct helmet form comparison without an isolated helmet reference.

**Why missing:** The locked helmet references are at:
- `D:\workspace\ComfyUI\MIKAGE_CANON\08_CHARACTER_REVIEW_CANDIDATES\MIKAGE_HELMET_FRONT_VIEW_3D_SOURCE_V1_ORTHO.png`
- `D:\workspace\ComfyUI\MIKAGE_CANON\08_CHARACTER_REVIEW_CANDIDATES\MIKAGE_VOLUME_FIRST_3D_HELMET_SIDE_V1_ORTHO.png`

These paths are NOT mounted in the agent sandbox. The only helmet reference accessible is embedded in SP-001 (full character frame).

**Workaround available:** SP-001 (UNIFIED_KEY_VISUAL_V4 copy) shows the helmet in a full-body frame. Reviewer can crop or inspect helmet area from that image. Not ideal but functional for D-01 (sensor slit), D-02 (palette), and basic helmet form checks.

**Resolution path:**
- Mount `D:\workspace\ComfyUI` in Cowork → agent can copy ortho files into `docs/character/references/helmet/`
- OR manually copy the two ortho files into `docs/character/references/helmet/` from Windows Explorer

**Decision on blocker:** Pack is usable without isolated helmet reference (workaround via SP-001 crop). Proceeding is allowed with this documented gap. Isolated helmet refs should be added before Step 5 (helmet close-up) review.

---

## PACK SUMMARY

| Item | Count | Status |
|---|---|---|
| Total files copied | 13 | Verified on disk |
| Locked approved references | 3 | SP-001, SP-002, SP-003 |
| Material references | 5 | good_ceramic_00–04 |
| Reject examples | 5 | plastic / flat / noise / multishape / warm mask |
| Missing: HELMET_ISOLATED | 0 | NOT MOUNTED — workaround via SP-001 |

---

*MIKAGE_CHARACTER_SOURCE_PACK_V1_MANIFEST — not canon-locked — not asset-locked — not public-ready*
