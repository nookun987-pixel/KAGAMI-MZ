# MIKAGE_BODY_CONTINUITY_CONSTRAINT_SPEC_V1

## 1. Executive Decision

TRUE_CURRENT_PHASE: Phase 4 - Component Integration (complete)

PHASE5_ALLOWED: NO (PHASE5_ALLOWED_TO_BE_PROPOSED: YES — internal upper-body consistency + motion-readiness review only)

SPEC_STATUS: REQUIREMENT_DEFINED

TASK_ID: ASSET-RESET-15_DEFINE_BODY_CONTINUITY_CONSTRAINT_SPEC_NO_RENDER_V1

This document defines the body continuity constraint specification for any future Mikage body / upper-body asset that must remain consistent with the accepted bust / upper-body bridge reference. It is a no-render planning and constraint specification only. It does not render, generate, approve canon, create asset locks, call any candidate production-ready, start Phase 5, use ComfyUI runtime, use Blender, or create film / video / short / shotlist tasks. Asset generation, when later authorized, must be performed by Codex or a local ComfyUI workflow — not by this planning task.

---

## 2. Source Files Reviewed

- `docs/handoff/00_LATEST_CODEX_HANDOFF.md` (CURRENT_NEXT_TASK pointer + ASSET-RESET chain state)
- `SESSION_RESUME_NOTE_20260531.md` (binding design decisions, 2026-05-31)
- `docs/handoff/MIKAGE_BUST_UPPER_BODY_BRIDGE_ASSET_REQUEST_SPEC_V1.md` (ASSET-RESET-14 — parent spec, B1)
- `docs/handoff/MIKAGE_PHASE4_STACK_MANIFEST_V2.md` (ASSET-RESET-13 — active manifest)
- `CLAUDE.md` (operating rules, render governance, status limits)

---

## 3. Why This Spec Exists

### 3.1 Position In The Chain

ASSET-RESET-14 defined the bust / upper-body bridge (helmet-to-upper-chest). A candidate was accepted as `INCLUDE_AS_PHASE4_REFERENCE` (smooth monocoque porcelain bust, V4 REFINE "Ảnh 1", 2026-05-31). That bridge establishes the helmet-body junction but stops at the upper chest / collar region. There is no constraint document governing how the body continues below that crop while staying continuous with the accepted bust.

### 3.2 Gap This Closes

Without a body continuity constraint spec, any future upper-body or full-character candidate could drift in proportion, material, or silhouette away from the accepted bust. This spec fixes the continuity rules in advance so that future work (when authorized) can be checked against an explicit standard rather than re-derived each time.

### 3.3 What This Spec Does NOT Do

This spec does not commission a render, does not select a body candidate, does not open Phase 5, and does not promote the bust bridge beyond `INCLUDE_AS_PHASE4_REFERENCE`. It is a constraint definition only.

---

## 4. Continuity Anchor — The Accepted Bust Bridge

All body continuity constraints in this spec are anchored to the accepted bust / upper-body bridge reference.

| Field | Value |
|---|---|
| Accepted bust file | `D:\workspace\ComfyUI\MIKAGE_CANON\10_COMPONENT_CANDIDATE_SET_V1\09\09_BUST_UPPER_BODY_BRIDGE\MIKAGE_COMP_09A_BUST_UPPER_BODY_BRIDGE_REVIEW_CANDIDATE.png` |
| Bust status | INCLUDED_AS_PHASE4_REFERENCE (NOT canon-locked, NOT Phase 5 entry) |
| Acceptance review | `docs/handoff/ASSET-BRIDGE-DECISION_AND_AR14_S9_REVIEW_BUST_UPPER_BODY_V1.md` |
| Material standard | Smooth monocoque porcelain (panel-gap + graphene = OPTIONAL, not required) |
| Refine policy | Smooth primary, detail secondary — micro-seam only; no large panels, no prominent graphene, no visor slit |

CHUA_XAC_NHAN: the nested `09\09` folder path is unflattened; the bust file path above reflects the handoff record and was not re-verified on disk by this no-render task.

---

## 5. Body Continuity Requirements (What Future Body Work MUST Preserve)

| Continuity axis | Requirement |
|---|---|
| Material continuity | Body surface must read as the SAME smooth monocoque porcelain as the accepted bust. No new material identity introduced below the crop. |
| Surface-detail policy | Smooth primary, detail secondary. Micro-seam only. Panel-gap and graphene underlayer remain OPTIONAL and must not become the dominant body read. |
| Faceless standard | Helmet remains fully faceless and sealed — inherited from bust. No body element may reintroduce facial anatomy, visor opening, or eye-implying glow. |
| Proportion continuity | Shoulder width, neck-to-shoulder ratio, and chest taper must extend the bust's existing proportions without re-styling them. |
| Silhouette continuity | Structural plating silhouette only. The body must continue the armored, non-costume read of the bust. |
| Neck / collar junction | The helmet-to-body seam established in the bust must remain structurally visible and unbroken where the body extends it. |
| Lighting / framing parity | Neutral pose, dark non-environmental background, flat/minimal directional lighting — consistent with bust review framing. |
| Identity continuity | No drift from unified key visual V4 or the locked helmet 3D sources (Section 7 anchors). |

---

## 6. Body Continuity Violations (Hard Stops)

### 6.1 Identity Violations

- Any human eyes, nose, mouth, or exposed facial anatomy
- Open visor, cracked faceplate, or visor glow implying eyes
- Anime-style proportions, portrait softening, or fashion-magazine body language
- Sexualized silhouette, gender-coded glamour, or ornamental sci-fi styling

### 6.2 Material / Surface Violations

- Material identity below the crop that differs from the accepted smooth monocoque porcelain bust
- Glossy, chrome, metallic-sheen, or reflective armor inconsistent with the matte porcelain read
- Large decorative panels, engraving, insignia, or pattern overlays
- Promoting OPTIONAL panel-gap / graphene into a required or dominant body feature
- Transparent, holographic, or energy-emitting surfaces (unless part of a separately reviewed halo/orbital UI component that has PASSED — currently 06C is HOLD, so not permitted)

### 6.3 Proportion / Silhouette Violations

- Body proportions that contradict or re-style the accepted bust
- Skin-tight or form-fitted "costume" reading rather than structural plating
- Full-body action pose, combat stance, or narrative staging
- Environmental background, scene staging, or world plate
- Cinematic framing or shot-composition intent

### 6.4 Status Violations

- Phase 5 readiness claim
- Canon approval claim
- Asset lock
- Production-ready / render-ready / film-ready / video-ready / public-ready label
- Treating this spec as permission to render, open Phase 5, or start any film/video/short/shotlist work

---

## 7. Canon Constraint Reference Anchors

Future body continuity candidates must be checked against ALL of the following, in addition to the bust anchor in Section 4.

| Anchor | Path | Constraint enforced |
|---|---|---|
| Unified key visual V4 | `D:\workspace\ComfyUI\MIKAGE_CANON\08_CHARACTER_REVIEW_CANDIDATES\MIKAGE_UNIFIED_KEY_VISUAL_V4_FROM_CLEAN_SOURCES_00001_.png` | Overall identity, silhouette, style language |
| Helmet front 3D source V1 | `D:\workspace\ComfyUI\MIKAGE_CANON\08_CHARACTER_REVIEW_CANDIDATES\MIKAGE_HELMET_FRONT_VIEW_3D_SOURCE_V1_ORTHO.png` | Helmet front geometry / proportion inherited at the neck junction |
| Helmet side 3D source V1 | `D:\workspace\ComfyUI\MIKAGE_CANON\08_CHARACTER_REVIEW_CANDIDATES\MIKAGE_VOLUME_FIRST_3D_HELMET_SIDE_V1_ORTHO.png` | Helmet volume / depth at the neck junction |
| B4C porcelain material reference | `D:\workspace\ComfyUI\MIKAGE_CANON\10_COMPONENT_CANDIDATE_SET_V1\03_B4C_PORCELAIN_MATERIAL\MIKAGE_COMP_03A_B4C_PORCELAIN_PANEL_GAP_PASS.png` | Matte porcelain material language (panel-gap OPTIONAL only) |
| Accepted bust bridge (09A) | See Section 4 path | Primary continuity anchor — body must extend this exact bust |

---

## 8. Excluded Sources — Must Not Be Reused

| Asset | Reason |
|---|---|
| `MIKAGE_COMP_08B_HELMET_BUST_NEGATIVE_SPACE_ALT_PASS_TECHNICAL.png` | REJECT_DO_NOT_USE — HIGH canon risk, confirmed anime/fashion drift (ASSET-RESET-12) |
| Full-body candidate 001 | REJECT_DO_NOT_USE (Phase 4 gate decisions) |
| Controlled front canon repair V1 | FAIL_DO_NOT_USE |
| Corrected full-body front candidate V2 | Review-only / private evidence; not a positive source |
| 05B hair / mask | HOLD — not a permitted identity source unless PASSED in a future review cycle |
| 06C halo / orbital UI | HOLD — not a permitted required element unless PASSED in a future review cycle |
| Video / loop tests, archived film source packs | REJECT_DO_NOT_USE for stack use |

---

## 9. Candidate Evaluation Process (When A Body Candidate Later Exists)

This process applies only if and when a body continuity candidate is later commissioned under separate authorization. This spec does not authorize that generation.

### Step 1 — Evidence Package

1. Source file path (absolute)
2. Review report path (absolute)
3. Generation method and date

### Step 2 — Continuity Checklist

| Check | Pass condition |
|---|---|
| Bust material continuity | Same smooth monocoque porcelain as accepted bust (Section 4) |
| Surface-detail policy | Smooth primary; micro-seam only; no dominant panel/graphene |
| Proportion continuity | Extends bust proportions without re-styling |
| Silhouette continuity | Structural plating, non-costume |
| Neck / collar seam continuity | Helmet-body seam preserved and unbroken |
| Faceless standard | No facial anatomy; sealed faceplate |
| Identity continuity | No drift from unified key visual V4 / helmet 3D sources |
| Anime / fashion drift | ABSENT |
| Material cleanness | No gloss, chrome, or costume drift |

### Step 3 — Allowed Outcome Labels

| Label | Meaning |
|---|---|
| `INCLUDE_AS_PHASE4_REFERENCE` | Meets all continuity checks; may be added as the body continuity reference slot |
| `HOLD_FOR_REWORK` | Addressable issues; deferred; excluded from stack |
| `REJECT_DO_NOT_USE` | Fails constraints; permanently excluded from this slot |

### Step 4 — Forbidden Labels

`CANON_APPROVED`, `ASSET_LOCKED`, `PRODUCTION_READY`, `PHASE_5_READY`, `RENDER_READY`, `FILM_READY`, `VIDEO_READY`, `PUBLIC_READY`.

Receiving `INCLUDE_AS_PHASE4_REFERENCE` does not constitute canon approval, asset lock, or Phase 5 entry. Phase 5 requires its own separate readiness re-review gate.

---

## 10. Interim Status After This Spec

| Field | Value |
|---|---|
| Body continuity constraint slot | REQUIREMENT_DEFINED |
| Body candidate exists | NO |
| Body candidate accepted | NO |
| Bust bridge promoted beyond Phase 4 reference | NO |
| Phase 5 started | NO |
| Next action | Optional: a no-render Phase 5 upper-body consistency planning task; OR commission a body candidate under separate authorization and evaluate via Section 9 |

---

## 11. Prohibited Actions Confirmed

- FILM_TASK_CREATED: NO
- SHORT_VIDEO_TASK_CREATED: NO
- SHOTLIST_CREATED: NO
- VIDEO_CREATED: NO
- RENDER_STARTED: NO
- COMFYUI_RUNTIME_USED: NO
- BLENDER_USED: NO
- CANON_APPROVAL_CREATED: NO
- ASSET_LOCK_CREATED: NO
- CANDIDATES_CALLED_PRODUCTION_READY: NO
- PHASE5_STARTED: NO
- LANE_CHANGED: NO (stays CHARACTER_CAST_LANE / ASSET-RESET chain)
- ASSET_GENERATED_BY_CLAUDE: NO
