# MIKAGE_UPPER_BODY_CONTINUITY_CANDIDATE_RENDER_REQUEST_SPEC_V1

## 1. Executive Decision

TASK_ID: PHASE5_UPPER_BODY_CONTINUITY_CANDIDATE_RENDER_REQUEST_SPEC_V1

DATE: 2026-06-01

SPEC_STATUS: RENDER_REQUEST_DEFINED (no-render)

PURPOSE: Define exactly what an upper-body / body-continuity candidate must be, so that ONE candidate can be generated under separate render authorization (Codex or local ComfyUI) and then scored against the Phase 5 UB-1…UB-10 consistency criteria. This document is the executable brief. It is NOT a render.

This spec does not render, generate, or modify any image; does not use the ComfyUI runtime or Blender; does not approve canon; does not asset-lock; does not call any candidate production-ready; does not open film / video / short / shotlist; and does not change lanes. Generation authority is explicitly NOT Claude / NOT Cowork (Section 8).

---

## 2. Source Files Reviewed

- `docs/handoff/MIKAGE_PHASE5_INITIATION_INTERNAL_NO_RENDER_V1.md` (Phase 5 internal scope opened, awaiting candidate)
- `docs/handoff/MIKAGE_PHASE5_UPPER_BODY_CONSISTENCY_PLANNING_V1.md` (UB-1…UB-10 criteria + paper motion-readiness)
- `docs/handoff/MIKAGE_BODY_CONTINUITY_CONSTRAINT_SPEC_V1.md` (AR-15 — continuity constraints, hard stops, exclusions)
- `docs/handoff/MIKAGE_BUST_UPPER_BODY_BRIDGE_ASSET_REQUEST_SPEC_V1.md` (AR-14 — parent request spec; §4 depiction, §9 gate)
- `docs/handoff/MIKAGE_PHASE4_STACK_MANIFEST_V2.md` (approved references)
- `CLAUDE.md` (render governance, status limits, source exclusions)

---

## 3. Relationship To The Bust Bridge

The accepted bust bridge (09A) establishes the helmet-to-upper-chest junction and stops at the collar / upper chest. This request extends the SAME figure downward into the upper body (chest plate + shoulders + upper arms), keeping every continuity axis from AR-15 intact. The bust 09A is the continuity base, not a separate identity — the upper body must read as the same figure continuing below the bust crop.

---

## 4. What The Upper-Body Candidate Must Depict

### 4.1 Required Depiction Scope

| Element | Requirement |
|---|---|
| Helmet / head | Fully helmeted; strictly faceless; consistent with locked helmet front + side 3D sources and the accepted bust |
| Faceplate | Sealed; no eye slits, no nose, no mouth, no exposed skin, no visor opening |
| Neck / collar junction | Helmet-to-body seam structurally visible and unbroken; continuous with bust 09A; no exposed neck skin |
| Shoulders | Upper shoulder armor plate in B4C porcelain, extending the bust's shoulder line without re-styling |
| Chest plate | Structural B4C porcelain chest plating; smooth monocoque primary read |
| Upper arms (partial) | Upper-arm plating may be shown as structural plate-over-plate; no soft/cloth read |
| Material (primary) | Smooth monocoque matte B4C porcelain — same identity as accepted bust 09A |
| Material (secondary, OPTIONAL) | Micro-seam / panel-gap + black graphene underlayer through gaps — OPTIONAL only, must not dominate |
| Composition framing | Upper-body crop (helmet to mid-torso / upper arms); neutral static pose; consistency review only |
| Background | Dark, neutral, non-environmental; no world plate, no scene staging |
| Lighting | Flat or minimal directional; must not obscure material or geometry reads |

### 4.2 Optional Elements (Permitted Only If Conditions Met)

| Optional element | Permission condition |
|---|---|
| Panel-gap / graphene detail | OPTIONAL; micro-seam only; must stay secondary to the smooth monocoque read |
| Zenith blade (partial) | Partial grip / shoulder-adjacent only; must not override material or geometry; no new blade geometry; anchor = Zenith blade V2 |
| Hair / mask cues | FORBIDDEN — 05B is HOLD. No hair / mask may appear. |
| Halo / orbital UI | FORBIDDEN — 06C is HOLD. No halo / orbital UI may appear. |

---

## 5. Approved Input Sources (Continuity + Anchors)

The render MUST be driven only by these approved sources. The accepted bust 09A is the primary continuity / init reference.

| Source | Path | Role |
|---|---|---|
| Accepted bust bridge 09A | `D:\workspace\ComfyUI\MIKAGE_CANON\10_COMPONENT_CANDIDATE_SET_V1\09\09_BUST_UPPER_BODY_BRIDGE\MIKAGE_COMP_09A_BUST_UPPER_BODY_BRIDGE_REVIEW_CANDIDATE.png` | Primary continuity base / init reference — body extends this exact bust |
| Unified key visual V4 | `D:\workspace\ComfyUI\MIKAGE_CANON\08_CHARACTER_REVIEW_CANDIDATES\MIKAGE_UNIFIED_KEY_VISUAL_V4_FROM_CLEAN_SOURCES_00001_.png` | Identity / silhouette / style |
| Helmet front 3D source V1 | `D:\workspace\ComfyUI\MIKAGE_CANON\08_CHARACTER_REVIEW_CANDIDATES\MIKAGE_HELMET_FRONT_VIEW_3D_SOURCE_V1_ORTHO.png` | Helmet front geometry at neck junction |
| Helmet side 3D source V1 | `D:\workspace\ComfyUI\MIKAGE_CANON\08_CHARACTER_REVIEW_CANDIDATES\MIKAGE_VOLUME_FIRST_3D_HELMET_SIDE_V1_ORTHO.png` | Helmet volume / depth at neck junction |
| B4C porcelain material ref | `D:\workspace\ComfyUI\MIKAGE_CANON\10_COMPONENT_CANDIDATE_SET_V1\03_B4C_PORCELAIN_MATERIAL\MIKAGE_COMP_03A_B4C_PORCELAIN_PANEL_GAP_PASS.png` | Matte porcelain material language |
| Graphene underlayer ref | `D:\workspace\ComfyUI\MIKAGE_CANON\10_COMPONENT_CANDIDATE_SET_V1\04_GRAPHENE_UNDERLAYER\MIKAGE_COMP_04A_GRAPHENE_UNDERLAYER_HEX_GAP_PASS.png` | OPTIONAL underlayer, gaps only |
| Zenith blade V2 | `D:\workspace\ComfyUI\MIKAGE_CANON\08_CHARACTER_REVIEW_CANDIDATES\MIKAGE_ZENITH_BLADE_V2_POLISH_ONE_SHOT_00001_.png` | Blade identity if implied |

CHUA_XAC_NHAN: bust 09A path is the nested `09\09` record path; verify on disk before use, flatten if desired.

---

## 6. Hard Stops — Must NOT Appear

Carried from AR-15 §6 and AR-14 §6 (any one of these = REJECT):

- Identity: human eyes / nose / mouth / exposed face; open visor or visor glow implying eyes; anime proportions; portrait softening; fashion / sexualized body language.
- Material: surface differing from smooth monocoque matte B4C porcelain; gloss / chrome / reflective sheen; large decorative panels, engraving, insignia; OPTIONAL panel-gap / graphene promoted to dominant; transparent / holographic / energy-emitting surfaces.
- Composition: full-body / action / combat pose; environmental background or scene; cinematic shot-composition; any film/video-plate intent.
- Status: any Phase 5-ready / canon / asset-lock / production / public-ready implication.

---

## 7. Forbidden Input Sources — Must Not Be Reused

| Asset | Reason |
|---|---|
| `MIKAGE_COMP_08B_HELMET_BUST_NEGATIVE_SPACE_ALT_PASS_TECHNICAL.png` | REJECT_DO_NOT_USE — anime/fashion drift |
| Full-body candidate 001 | REJECT_DO_NOT_USE |
| Controlled front canon repair V1 | FAIL_DO_NOT_USE |
| Corrected full-body front candidate V2 | Review-only; not a positive source |
| 05B hair / mask | HOLD — not permitted as source |
| 06C halo / orbital UI | HOLD — not permitted as element |
| Video / loop tests, archived film source packs | REJECT_DO_NOT_USE for stack use |

These must not be used as init image, reference, ControlNet input, or starting point.

---

## 8. Generation Authority

| Field | Value |
|---|---|
| ASSET_GENERATED_BY_CLAUDE | NO |
| ASSET_GENERATED_BY_COWORK | NO |
| AUTHORIZED_GENERATOR | Codex or local ComfyUI workflow on the operator's machine |
| RENDER_ENVIRONMENT | Local (e.g. SDXL Juggernaut + IP-Adapter + ControlNet canny img2img refine, as used for the bust bridge) |
| RENDER_TRIGGER | Operator runs this spec under separate render authorization |
| MOTION_ALLOWED | NO — single still only; no video, no loop, no motion |
| OUTPUT_COUNT | 1 review candidate (plus generator-native provenance files); no batch |

Claude / Cowork prepares this brief only. It does not perform or trigger the render.

---

## 9. Output Specification

| Field | Requirement |
|---|---|
| Output type | Single still image (PNG) |
| Framing | Upper-body crop, neutral static pose, dark neutral background |
| Naming (suggested) | `MIKAGE_COMP_10_UPPER_BODY_CONTINUITY_REVIEW_CANDIDATE.png` |
| Suggested location | `D:\workspace\ComfyUI\MIKAGE_CANON\10_COMPONENT_CANDIDATE_SET_V1\10_UPPER_BODY_CONTINUITY\` |
| Provenance | Keep generator-native numbered outputs (e.g. _00001_) as provenance |
| Status on creation | REVIEW_CANDIDATE only — no positive label until the gate (Section 10) passes |

---

## 10. Evaluation Gate (After Candidate Exists)

The candidate must be scored back in Cowork (or by reviewer) against:

1. Phase 5 consistency criteria UB-1…UB-10 (`MIKAGE_PHASE5_UPPER_BODY_CONSISTENCY_PLANNING_V1.md` §5) — each PASS / NOTE / FAIL with one-line evidence.
2. AR-15 §9 continuity checklist (material, proportion, seam, faceless, identity, no drift, material cleanness).
3. AR-14 §9 faceless standard gate (sealed faceplate, no visor/eye slits).

Hard-stop FAIL (UB-3 faceless or UB-10 anime/fashion drift) ends the review as REJECT_DO_NOT_USE.

Allowed outcome labels: `INCLUDE_AS_PHASE4_REFERENCE`, `HOLD_FOR_REWORK`, `REJECT_DO_NOT_USE`.
Forbidden labels: `CANON_APPROVED`, `ASSET_LOCKED`, `PRODUCTION_READY`, `PHASE_5_READY`, `RENDER_READY`, `FILM_READY`, `VIDEO_READY`, `PUBLIC_READY`.

A pass = consistency reference only; it does NOT canon-lock, asset-lock, or complete the character.

---

## 11. Interim Status After This Spec

| Field | Value |
|---|---|
| Render request | DEFINED |
| Candidate generated | NO |
| Generation authority | Codex / local ComfyUI (NOT Claude / Cowork) |
| Phase 5 internal review | AWAITING_CANDIDATE (unchanged until candidate provided) |
| Next action | Operator runs this spec on local / Codex, then returns the candidate for UB scoring |

---

## 12. Prohibited Actions Confirmed

- FILM_TASK_CREATED: NO
- SHORT_VIDEO_TASK_CREATED: NO
- SHOTLIST_CREATED: NO
- VIDEO_CREATED: NO
- RENDER_STARTED: NO
- MOTION_RENDER_STARTED: NO
- COMFYUI_RUNTIME_USED: NO
- BLENDER_USED: NO
- CANON_APPROVAL_CREATED: NO
- ASSET_LOCK_CREATED: NO
- CANDIDATES_CALLED_PRODUCTION_READY: NO
- BUST_PROMOTED_BEYOND_PHASE4_REFERENCE: NO
- LANE_CHANGED: NO
- ASSET_GENERATED_BY_CLAUDE: NO
- ASSET_GENERATED_BY_COWORK: NO
