# ASSET-BRIDGE-GENERATE_BUST_UPPER_BODY_CANDIDATE_FOR_CODEX_V1

## 0. Document Role

OPERATOR / CODEX GENERATION BRIEF — bust / upper-body bridge candidate.

This is a generation brief only. It was written by Claude (spec author role). Claude did not render, did not run ComfyUI, did not modify any asset, did not modify canon, did not asset-lock, and did not start Phase 5. Generation must be performed by Codex or a user-operated local ComfyUI runtime.

Authority basis: `docs/handoff/MIKAGE_BUST_UPPER_BODY_BRIDGE_ASSET_REQUEST_SPEC_V1.md` (AR-14). Where this brief and the AR-14 spec disagree, the AR-14 spec wins.

TRUE_CURRENT_PHASE: Phase 4 — Component Integration
PHASE5_ALLOWED: NO
OUTPUT_CLASS: REVIEW_CANDIDATE_ONLY

---

## 1. Objective

Generate EXACTLY ONE bust / upper-body bridge candidate that connects the locked Mikage helmet to the upper torso with correct material, silhouette, and faceless-identity constraints, suitable for Phase 4 reference review only.

Generate one image (one candidate). Do not batch. Do not produce a set. If multiple seeds are run for internal selection, the operator must submit only ONE file as the candidate for review and discard the rest from stack consideration.

---

## 2. Required Source Anchors (read / load before generating)

All anchors are READ-ONLY. Use as visual conditioning / comparison reference only. Do not overwrite, move, or modify.

| Anchor | Path | Enforces |
|---|---|---|
| Unified key visual V4 | `D:\workspace\ComfyUI\MIKAGE_CANON\08_CHARACTER_REVIEW_CANDIDATES\MIKAGE_UNIFIED_KEY_VISUAL_V4_FROM_CLEAN_SOURCES_00001_.png` | Identity, silhouette, style language |
| Helmet front 3D source V1 | `D:\workspace\ComfyUI\MIKAGE_CANON\08_CHARACTER_REVIEW_CANDIDATES\MIKAGE_HELMET_FRONT_VIEW_3D_SOURCE_V1_ORTHO.png` | Faceplate geometry, proportion, front silhouette |
| Helmet side 3D source V1 | `D:\workspace\ComfyUI\MIKAGE_CANON\08_CHARACTER_REVIEW_CANDIDATES\MIKAGE_VOLUME_FIRST_3D_HELMET_SIDE_V1_ORTHO.png` | Helmet volume, depth, side silhouette |
| Helmet faceplate Phase 4 ref | `D:\workspace\ComfyUI\MIKAGE_CANON\10_COMPONENT_CANDIDATE_SET_V1\01_HELMET_FACEPLATE\MIKAGE_COMP_01A_HELMET_FACEPLATE_CLEAN_PASS.png` | Faceplate cleanness / no-drift standard |
| B4C porcelain material ref | `D:\workspace\ComfyUI\MIKAGE_CANON\10_COMPONENT_CANDIDATE_SET_V1\03_B4C_PORCELAIN_MATERIAL\MIKAGE_COMP_03A_B4C_PORCELAIN_PANEL_GAP_PASS.png` | Matte porcelain plate, panel-gap geometry |
| Graphene underlayer ref | `D:\workspace\ComfyUI\MIKAGE_CANON\10_COMPONENT_CANDIDATE_SET_V1\04_GRAPHENE_UNDERLAYER\MIKAGE_COMP_04A_GRAPHENE_UNDERLAYER_HEX_GAP_PASS.png` | Black underlayer, visible only through gaps |
| Zenith blade V2 (only if blade in frame) | `D:\workspace\ComfyUI\MIKAGE_CANON\08_CHARACTER_REVIEW_CANDIDATES\MIKAGE_ZENITH_BLADE_V2_POLISH_ONE_SHOT_00001_.png` | Blade identity anchor |

Note: AR-14 §5 lists the graphene anchor filename as `MIKAGE_GRAPHENE_UNDERLAYER_HEX_GAP_PASS.png`, while the V2 manifest §3 lists `MIKAGE_COMP_04A_GRAPHENE_UNDERLAYER_HEX_GAP_PASS.png`. Operator must confirm the actual on-disk filename in `10_COMPONENT_CANDIDATE_SET_V1\04_GRAPHENE_UNDERLAYER\` before loading. CHUA_XAC_NHAN until confirmed.

---

## 3. Forbidden Sources (must NOT be used as input, init image, or starting point)

| Forbidden source | Reason |
|---|---|
| `MIKAGE_COMP_08B_HELMET_BUST_NEGATIVE_SPACE_ALT_PASS_TECHNICAL.png` | REJECT_DO_NOT_USE — HIGH canon risk, confirmed anime/fashion drift (ASSET-RESET-12) |
| Full-body candidate 001 | REJECT_DO_NOT_USE (Phase 4 gate decisions) |
| Controlled front canon repair V1 | FAIL_DO_NOT_USE |
| Corrected full-body front candidate V2 | Review-only / private; not a positive source |
| Brutalist void / consequence chamber V3 | Failed downstream environment |
| Any video test / loop test | REJECT_DO_NOT_USE for stack use |
| Archived film source packs | Archive-only |

Hair / mask cues and halo / orbital UI elements are FORBIDDEN in this candidate: candidate 05B = HOLD and 06C = HOLD (neither received PASS in ASSET-RESET-12). Per AR-14 §4.2 these optional elements are permitted only after their respective candidate receives PASS. They have not. Therefore: no hair, no mask-portrait styling, no halo, no orbital UI.

---

## 4. Required Depiction (AR-14 §4.1)

- Fully helmeted; strictly FACELESS. Sealed faceplate. No eye slits, no nose, no mouth, no exposed skin, no visor opening, no visor glow.
- Neck / collar junction: helmet-to-body seam structurally visible; no exposed neck skin.
- Shoulders present; upper shoulder armor plate in matte B4C porcelain.
- Partial upper torso / upper chest / collar — enough to establish helmet-to-body material continuity.
- Primary material: matte B4C porcelain armor plate (per 03A).
- Secondary material: black graphene underlayer visible only through panel gaps (per 04A).
- Framing: bust / upper-body crop, neutral straight-on pose, consistency-review composition.
- Background: dark, neutral, non-environmental. No scene, no world plate, no staging.
- Lighting: flat or minimal directional; must not obscure material or geometry reads.

---

## 5. Prompt

Positive prompt (operator may adapt token syntax to the local model/sampler, but must preserve all constraints):

```
Mikage — bust / upper-body bridge reference, fully helmeted faceless armored figure,
sealed matte B4C porcelain faceplate, NO face, no eyes, no nose, no mouth, no visor opening,
helmet geometry consistent with locked front and side 3D ortho sources,
structurally visible helmet-to-collar seam, no exposed neck skin,
upper shoulder armor plates in matte white-grey B4C porcelain with clean panel gaps,
black graphene underlayer visible only through narrow panel gaps,
partial upper-chest / collar to show helmet-body material continuity,
neutral straight-on bust crop, symmetrical, calm static pose,
matte non-reflective surfaces, industrial structural plating,
dark neutral seamless studio background, flat even lighting,
orthographic-leaning reference clarity, high detail material reads
```

Negative prompt:

```
face, eyes, nose, mouth, lips, skin, exposed neck, visor opening, visor glow, eye slit glow,
facial expression, open visor, cracked faceplate,
anime face, anime proportions, chibi, manga, soft portrait, beauty lighting, fashion pose, glamour, sexualized, cleavage, form-fitting bodysuit, costume,
hair, mask portrait styling, halo, orbital UI, holographic UI, energy effects, glowing runes,
glossy, chrome, metallic sheen, reflective armor, polished metal, ornate engraving, insignia, decorative pattern, filigree,
full body, legs, hips, action pose, combat stance, dynamic angle,
environment, background scene, location, props, set dressing, world plate,
cinematic framing, lens flare, motion blur, film grain,
text, watermark, signature, logo,
multiple characters, duplicate, extra limbs, deformed, low quality, blurry
```

---

## 6. Suggested Generation Settings (operator-tunable)

These are starting suggestions only; operator/Codex selects the actual local model and may adjust. Settings must not change any constraint in §3–§4.

| Setting | Suggested value |
|---|---|
| Output resolution | Square or portrait, e.g. 1024×1024 or 896×1152 (reference clarity, not cinematic) |
| Aspect intent | Bust / upper-body crop — do not extend to full body |
| Conditioning | Use anchors in §2 as IP-adapter / reference / comparison conditioning if workflow supports it |
| Count submitted for review | 1 (exactly one) |
| Seed | Operator records the seed in the review evidence |

---

## 7. Output Path & Naming Convention

Save the single candidate to the existing candidate set area (review candidate, NOT a locked location):

```
D:\workspace\ComfyUI\MIKAGE_CANON\10_COMPONENT_CANDIDATE_SET_V1\09_BUST_UPPER_BODY_BRIDGE\
```

Filename:

```
MIKAGE_COMP_09A_BUST_UPPER_BODY_BRIDGE_REVIEW_CANDIDATE.png
```

Naming rules:
- Must contain `REVIEW_CANDIDATE`.
- Must NOT contain `PASS`, `FINAL`, `CANON`, `LOCKED`, `APPROVED`, `PRODUCTION`, `PHASE5`, or `PUBLIC`.
- If multiple seeds were generated, only the one submitted file uses this name; others must be moved out of the candidate folder or clearly suffixed `_DISCARD`.

Do not write into `01_CANON_LOCK`, any `*_ASSET_LOCK` location, the locked source `.blend` tree, or any public/publish folder.

---

## 8. Required Evidence Package (operator must record at generation time)

Per AR-14 §9 Step 1, the candidate is not reviewable without:

1. Absolute source file path (the saved PNG).
2. Generation method (model name + workflow + ComfyUI/Codex) and date.
3. Seed and key settings used.
4. Confirmation that no forbidden source from §3 was used as init/reference.

---

## 9. Review Requirements (AR-14 §9 — applied AFTER generation, by Claude or human)

The candidate is NOT PASS on generation. It carries no status until reviewed. Review applies the AR-14 §9 anchor-comparison checklist:

| Check | Pass condition |
|---|---|
| Helmet front geometry match | Consistent with `MIKAGE_HELMET_FRONT_VIEW_3D_SOURCE_V1_ORTHO` |
| Helmet side volume match | Consistent with `MIKAGE_VOLUME_FIRST_3D_HELMET_SIDE_V1_ORTHO` |
| Faceplate cleanness | No drift from `MIKAGE_COMP_01A_HELMET_FACEPLATE_CLEAN_PASS` |
| B4C porcelain material match | Consistent with `MIKAGE_COMP_03A_B4C_PORCELAIN_PANEL_GAP_PASS` |
| Graphene underlayer match | Consistent with `MIKAGE_COMP_04A_GRAPHENE_UNDERLAYER_HEX_GAP_PASS` |
| Identity continuity match | No drift from unified key visual V4 |
| Faceless standard met | No human facial anatomy visible |
| Anime / fashion drift | ABSENT |
| Material cleanness | No gloss, chrome, or costume drift |
| Forbidden optional elements | No hair, no mask styling, no halo, no orbital UI |

Allowed outcome labels (exactly one): `INCLUDE_AS_PHASE4_REFERENCE` / `HOLD_FOR_REWORK` / `REJECT_DO_NOT_USE`.

Forbidden labels: `CANON_APPROVED`, `ASSET_LOCKED`, `PRODUCTION_READY`, `PHASE_5_READY`, `RENDER_READY`, `FILM_READY`, `VIDEO_READY`, `PUBLIC_READY`.

`INCLUDE_AS_PHASE4_REFERENCE` does NOT equal canon approval, asset lock, or Phase 5 entry. Phase 5 still requires a separate readiness re-review.

---

## 10. Status / Stop Rules

- This candidate, once generated, is REVIEW_CANDIDATE_ONLY until the §9 review is recorded.
- Do not asset-lock, do not approve canon, do not call production-ready, do not start Phase 5, do not create public output.
- Do not create film / video / short / shotlist tasks from this candidate.
- Do not reuse rejected 08B or any §3 forbidden source.
- Generate one candidate only; no batch.

---

## 11. After Review

If the candidate receives `INCLUDE_AS_PHASE4_REFERENCE`:
- It fills the bust / upper-body bridge slot (currently MISSING_REQUIRED_ASSET in `MIKAGE_PHASE4_STACK_MANIFEST_V2.md`).
- This satisfies Phase 5 unblocking condition 4 of 5 ("bust / upper-body bridge candidate accepted").
- `ASSET-RESET-15` (body continuity constraint spec) and the Phase 5 readiness re-review then become available (Phase 5 still requires the re-review to pass).

If `HOLD_FOR_REWORK` or `REJECT_DO_NOT_USE`: regenerate under this brief with corrected constraints; the slot remains MISSING_REQUIRED_ASSET and Phase 5 remains blocked.

---

## 12. Prohibited Actions Confirmed (this brief)

- RENDERED_BY_CLAUDE: NO
- COMFYUI_RUN_BY_CLAUDE: NO
- ASSET_MODIFIED: NO
- CANON_MODIFIED: NO
- ASSET_LOCK_CREATED: NO
- PHASE5_STARTED: NO
- REJECTED_08B_USED: NO
- CANDIDATE_CALLED_PASS: NO (candidate is review-only until AR-14 §9 review)
- FILM_VIDEO_SHORT_SHOTLIST_TASK_CREATED: NO
```
