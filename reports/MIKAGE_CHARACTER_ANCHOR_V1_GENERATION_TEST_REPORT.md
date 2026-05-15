# MIKAGE_CHARACTER_ANCHOR_V1_GENERATION_TEST_REPORT

**Status:** FAIL — GENERATION_BLOCKER  
**Date:** 2026-05-15  
**Task:** MIKAGE_CHARACTER_ANCHOR_V1_GENERATION_TEST  
**Result:** No qualifying full-body character image found. Agent cannot generate. Human execution required.

---

## 1. WHAT WAS ATTEMPTED

Agent-side execution of P3-A (sword planted full-body) was blocked by standing rules (no render, no ComfyUI runtime). Sandbox cannot reach Windows localhost:8188. As fallback, all existing image assets accessible from `D:\KAGAMI-MZ_SYNC_PUSH_V2` were scanned and scored against the Anchor V1 review checklist.

**Images found:** 649 PNG files across the repo.  
**Full-body character candidates identified:** 0 qualifying.  
**Candidates inspected:** 5 distinct image types evaluated below.

---

## 2. CANDIDATE-BY-CANDIDATE GATE RESULTS

### Candidate EX-01 — GOOGLE_LANE_E2E_001 / SHOT_02_MIKAGE_PRESENCE

**Paths:**
- `MIKAGE_COMMANDER_PACKAGE_V1/runs/GOOGLE_LANE_E2E_001/GOOGLE_LANE_E2E_001.png`
- `film_proofs/MIKAGE_FILM_PROOF_01/source_pack_v1/visual_candidates/SHOT_02_MIKAGE_PRESENCE__GOOGLE_LANE_E2E_001__CANDIDATE_REQUIRES_HUMAN_REVIEW.png`

**What it shows:** Low-polygon abstract face mask. White faceted geometric form on dark background. Dark oval eye socket cutouts. Low-poly triangulated face geometry. Nose area, mouth/chin area visible as low-poly surface planes.

**Gate results:**

| Check | Result | Reason |
|---|---|---|
| IR-01 — Human eye shape | **FAIL** | Dark oval eye sockets present — read as human eye region shape, not sensor slits |
| IR-02 — Sensor slits absent | **FAIL** | No ultra-narrow horizontal parallel slits — eye sockets are circular/oval, not thin horizontal lines |
| IR-06 — Face visible | **FAIL** | Nose facet, mouth region, chin jaw plane visible in low-poly face geometry |

**Verdict: INSTANT REJECT — 3 simultaneous IR failures.**  
Do not score. Do not advance.

**Context:** This image was passed by the Google Lane E2E validator (`final_decision.json`: `"decision": "ALLOW"`, `canon_adherence: 0.95`) under a prior canon that did not include the sensor slit requirement or the sealed-face rule. That validation is superseded by Character V1 canon (2026-05-15 patch). The Gemini validation labeled this a "MASK_MACRO shot type" — correct categorization but wrong spec gate.

---

### Candidate EX-02 — UNIFIED_KEY_VISUAL_V4 (LOCKED)

**Path:** `film_proofs/MIKAGE_FILM_PROOF_01/source_pack_v1/comfyui_canon_candidates/SHOT_02_MIKAGE_PRESENCE__02_UNIFIED_KEY_VISUAL_V4_LOCKED__APPROVED_FOR_FILM_PROOF_SOURCE.png`

**Also referenced as:** SP-001 source / `docs/character/references/mask_body_silhouette/REF_SP001_UNIFIED_KEY_VISUAL_V4__MASK_BODY_SILHOUETTE.png`

**What it shows:** White elongated helmet close-up on void black background. Good portrait ovoid shape. Electric violet/blue ambient halo ring. Angular slit-like design lines on helmet face (V/Y pattern, not two horizontal parallel lines). Sealed helmet — no face, no nose, no chin visible. Cinematic framing.

**Gate results:**

| Check | Result | Reason |
|---|---|---|
| IR-01 — Human eye shape | PASS | No human eye shape visible |
| IR-02 — Sensor slits absent | **BORDERLINE FAIL** | Angular V/Y-shaped design lines present, but NOT two ultra-narrow horizontal parallel slits as required by spec |
| IR-06 — Face visible | PASS | Fully sealed — no face features |
| LOCKED status | **DISQUALIFIED** | File labeled APPROVED_FOR_FILM_PROOF_SOURCE and LOCKED. Task rule: do not overwrite locked references. Cannot designate as anchor. |
| Full-body required | **DISQUALIFIED** | Helmet close-up only. No body, no sword, no hair. Fails entire Silhouette Gate (SG-04, SG-05, SG-06). |

**Verdict: DISQUALIFIED — two independent grounds (LOCKED + not full-body).**  
IR-02 borderline fail also noted: this helmet's slit design is a pre-spec angular form, not the two-horizontal-slit pattern.

**Positive notes:** Helmet shape (portrait oval ratio approximately 1.35:1 — within spec range), violet halo, sealed face, void black background all demonstrate the model CAN produce correct helmet-level elements. This image is useful as a Phase 2 material reference (Section 7.3 of Anchor Plan: compare against helmet during P2-A test). Do not use as anchor. Do not use as full-body baseline.

---

### Candidate EX-03 — base_anchor / img2img input (test placeholder)

**Paths:**
- `film_proofs/MIKAGE_FILM_PROOF_01/source_pack_v1/visual_candidates/SHOT_03_TITLE_OR_SYSTEM_WAKE__base_anchor__CANDIDATE_REQUIRES_HUMAN_REVIEW.png`
- `img2img_anchor_fix_test/main_job/input_image.png`

**What it shows:** Flat gray rectangle on dark background. Two small square dark cutouts (eyes placeholder). Clearly a synthetic test/pipeline-validation placeholder. Not a character render. Not AI-generated character art.

**Gate results:** ALL gates fail simultaneously. Not scored.

**Verdict: INSTANT REJECT — pipeline test placeholder, not a character image.**

---

### Candidate EX-04 — Archive legacy imgs (img_1 through img_4)

**Path:** `docs/archive/root_legacy_artifacts_20260430/img_1.png` through `img_4.png`

**What they show:** Purple and blue noise pattern images. Randomized color noise on black. No character content whatsoever.

**Gate results:** ALL gates fail. Not scored.

**Verdict: INSTANT REJECT — noise calibration images, not character renders.**

---

### Candidate EX-05 — Golden Mask archive

**Paths:**
- `docs/archive/root_legacy_artifacts_20260430/GOLDEN_MASK_001.png`
- `film_proofs/MIKAGE_FILM_PROOF_01/source_pack_v1/rejected_or_archive_only/`

**Status:** ARCHIVE ONLY label on all copies. Previously established as reject example (warm tone mask drift). Not inspected visually — pre-classified as REJECT.

**Verdict: INSTANT REJECT — warm tone drift, pre-classified. Archive only.**

---

## 3. GENERATION BLOCKER

**Root cause:** Agent cannot execute image generation. Standing rules: no render, no ComfyUI runtime agent-side. Linux sandbox cannot reach Windows localhost:8188 (connection refused, exit code 7, confirmed in prior session).

**Secondary finding:** No full-body character generation output exists anywhere in the accessible repo (`D:\KAGAMI-MZ_SYNC_PUSH_V2`). The closest image is the LOCKED helmet close-up (EX-02) which passes some helmet-level checks but is disqualified by LOCKED status and by being helmet-only, not full-body.

**Generation has not yet been run** for any P3-A, P3-B, or P3-C full-body prompt. The prompt library and anchor plan are ready — no generation has been attempted since the sensor slit canon was patched.

---

## 4. EXACT FAILING GATE

**Gate:** SECTION 1 — INSTANT REJECTS  
**Failing check:** IR-02 (sensor slits absent in all candidates) + IR-01/IR-06 on EX-01  
**Root blocker:** No full-body generation output exists. Cannot proceed past Stage 1 without a human-generated image.

---

## 5. NEXT CORRECTION

**Action required:** Human runs P3-A prompt from `reports/MIKAGE_CHARACTER_ANCHOR_V1_PLAN.md` Section 6.

**Exact steps:**
1. Open Fooocus (or ComfyUI txt2img — NOT the 09E inpainting workflow)
2. Load model: `juggernautXL_v8Rundiffusion.safetensors`
3. Paste P3-A positive prompt from Plan Section 6
4. Paste Universal Negative from Plan Section 6
5. Settings: Steps=35, CFG=7.5, Sampler=dpmpp_2m karras, Aspect=2:3 portrait
6. Run 5–8 seeds
7. Save any outputs to: `docs/character/anchor_v1_candidates/`
8. Return filenames to agent for scoring

**If P3-A produces no passing candidates after 8 seeds:** Run P3-B (three-quarter view) with same settings.

**Known drift risk to watch for (from EX-01 failure):** Model defaults toward face mask / low-poly face shapes when prompted for "helmet." Must include `sealed porcelain ovoid, no face, no nose, no mouth, no jaw, no chin, two ultra-narrow horizontal void-black sensor slits only` explicitly in positive prompt. Universal negative must include `face mask, polygon face, low-poly mask, open face visor, face structure`.

---

## 6. ADDITIONAL PROMPT HARDENING RECOMMENDED

Based on EX-01 failure mode (low-poly face mask drift), add these strings to P3-A before running:

**Add to positive:** `sealed matte white porcelain helmet no facial features, two ultra-narrow horizontal void-black sensor slits at eye level only, no face shape no nose no mouth no chin no jaw`

**Add to negative (not yet in plan):** `face mask, polygon face, low poly face, faceted face, geometric face, open face, visor face, human face shape, face topology, iron man, helmet with face, face plate`

These additions are based on observed drift (EX-01) and do not modify any locked reference or canon doc — they are prompt-level corrections only.

---

*Generated: 2026-05-15 | Task: MIKAGE_CHARACTER_ANCHOR_V1_GENERATION_TEST | Result: FAIL — GENERATION_BLOCKER*
