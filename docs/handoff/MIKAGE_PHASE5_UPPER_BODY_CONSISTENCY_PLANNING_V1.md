# MIKAGE_PHASE5_UPPER_BODY_CONSISTENCY_PLANNING_V1

## 1. Executive Decision

TRUE_CURRENT_PHASE: Phase 4 — Component Integration (complete)

PHASE5_ALLOWED: NO (PHASE5_ALLOWED_TO_BE_PROPOSED: YES — internal upper-body consistency + motion-READINESS review only)

PLAN_STATUS: PLANNING_DEFINED

TASK_ID: PHASE5_UPPER_BODY_CONSISTENCY_PLANNING_NO_RENDER_V1

This document is the no-render Phase 5 upper-body consistency planning task named in `CURRENT_NEXT_TASK`. It defines, on paper only, the upper-body / bust consistency criteria and the motion-READINESS constraints that a future Phase 5 internal review would apply. It does NOT render, generate assets, approve canon, create asset locks, call any candidate production-ready, start Phase 5, use the ComfyUI runtime, use Blender, change lanes, or create any film / video / short / shotlist task. Asset generation and any motion render, when later authorized, must be performed by Codex or a local ComfyUI / Blender workflow under separate authorization — not by this planning task.

---

## 2. Source Files Reviewed

- `docs/handoff/00_LATEST_CODEX_HANDOFF.md` (CURRENT_NEXT_TASK pointer + ASSET-RESET chain state)
- `SESSION_RESUME_NOTE_20260531.md` (binding design decisions, 2026-05-31)
- `docs/handoff/MIKAGE_BODY_CONTINUITY_CONSTRAINT_SPEC_V1.md` (ASSET-RESET-15 — body continuity constraint spec)
- `docs/handoff/ASSET-RESET-16_PHASE5_READINESS_RE_REVIEW_GATE_NO_RENDER_V1_REPORT.md` (Phase 5 readiness gate, PASS conditional)
- `docs/handoff/MIKAGE_PHASE4_STACK_MANIFEST_V2.md` (ASSET-RESET-13 — active manifest)
- `CLAUDE.md` (operating rules, render governance, status limits)

---

## 3. Why This Plan Exists

### 3.1 Position In The Chain

ASSET-RESET-16 returned a conditional PASS: Phase 5 (internal upper-body consistency + motion-readiness review only) MAY be proposed. ASSET-RESET-15 then defined the body continuity *constraints* a future body asset must preserve. What is still missing is the *plan* for how a Phase 5 internal consistency review would actually be run — the criteria, the inputs, the pass/hold/reject mechanics, and the paper-only motion-readiness boundary. This document supplies that plan so the review can be executed consistently when authorized.

### 3.2 Gap This Closes

AR-15 says what continuity must be preserved; AR-16 says Phase 5 may be proposed and lists caveats. Neither lays out the *operating procedure* for the consistency review: which references are compared, in what order, against which thresholds, and what a reviewer is and is not allowed to conclude. This plan turns the constraint spec into a runnable internal-review procedure without performing it.

### 3.3 What This Plan Does NOT Do

It does not run the review, does not score a candidate, does not commission a render, does not open Phase 5, and does not promote the bust bridge beyond `INCLUDE_AS_PHASE4_REFERENCE`. It is a planning document only.

---

## 4. Consistency Base — Inputs This Plan Uses

All Phase 5 upper-body consistency review activity is anchored to the accepted bust bridge plus the read-only canon anchors. No new source is introduced.

| Input | Path | Role in the consistency review |
|---|---|---|
| Accepted bust bridge (09A) | `D:\workspace\ComfyUI\MIKAGE_CANON\10_COMPONENT_CANDIDATE_SET_V1\09\09_BUST_UPPER_BODY_BRIDGE\MIKAGE_COMP_09A_BUST_UPPER_BODY_BRIDGE_REVIEW_CANDIDATE.png` | Primary consistency base — every upper-body check extends this exact bust |
| Unified key visual V4 | `D:\workspace\ComfyUI\MIKAGE_CANON\08_CHARACTER_REVIEW_CANDIDATES\MIKAGE_UNIFIED_KEY_VISUAL_V4_FROM_CLEAN_SOURCES_00001_.png` | Identity / style anchor |
| Helmet front 3D source V1 | `D:\workspace\ComfyUI\MIKAGE_CANON\08_CHARACTER_REVIEW_CANDIDATES\MIKAGE_HELMET_FRONT_VIEW_3D_SOURCE_V1_ORTHO.png` | Helmet front geometry at the neck junction |
| Helmet side 3D source V1 | `D:\workspace\ComfyUI\MIKAGE_CANON\08_CHARACTER_REVIEW_CANDIDATES\MIKAGE_VOLUME_FIRST_3D_HELMET_SIDE_V1_ORTHO.png` | Helmet volume / depth at the neck junction |
| B4C porcelain material ref | `D:\workspace\ComfyUI\MIKAGE_CANON\10_COMPONENT_CANDIDATE_SET_V1\03_B4C_PORCELAIN_MATERIAL\MIKAGE_COMP_03A_B4C_PORCELAIN_PANEL_GAP_PASS.png` | Matte porcelain material language (panel-gap OPTIONAL only) |
| Zenith blade V2 (locked) | `D:\workspace\ComfyUI\MIKAGE_CANON\08_CHARACTER_REVIEW_CANDIDATES\MIKAGE_ZENITH_BLADE_V2_POLISH_ONE_SHOT_00001_.png` | Prop identity anchor if the upper body carries / implies the blade |
| Body continuity constraints | `docs/handoff/MIKAGE_BODY_CONTINUITY_CONSTRAINT_SPEC_V1.md` | Constraint source the criteria below are derived from |

CHUA_XAC_NHAN: the nested `09\09` folder path is unflattened; the bust file path above reflects the handoff record and was not re-verified on disk by this no-render task.

---

## 5. Upper-Body Consistency Criteria (Phase 5 Internal Review)

These are the criteria a future Phase 5 internal review would apply to an upper-body candidate. They extend Section 5 of AR-15 into a scored review grid. No candidate is scored here.

| # | Criterion | What is compared | Pass condition |
|---|---|---|---|
| UB-1 | Material continuity | Candidate body surface vs accepted bust | Reads as the SAME smooth monocoque porcelain; no new material identity below the crop |
| UB-2 | Surface-detail policy | Candidate detailing vs "smooth primary, detail secondary" | Micro-seam only; panel-gap / graphene remain OPTIONAL and non-dominant |
| UB-3 | Faceless standard | Helmet / collar region | Fully faceless, sealed faceplate; no facial anatomy, visor opening, or eye-implying glow |
| UB-4 | Proportion continuity | Shoulder width, neck-to-shoulder ratio, chest taper vs bust | Extends bust proportions without re-styling |
| UB-5 | Silhouette continuity | Overall upper-body read vs bust | Structural armored plating, non-costume |
| UB-6 | Neck / collar seam | Helmet-to-body junction | Seam preserved, structurally visible, unbroken where body extends it |
| UB-7 | Identity continuity | Candidate vs unified key visual V4 + helmet 3D sources | No identity drift from the locked anchors |
| UB-8 | Lighting / framing parity | Pose, background, lighting | Neutral pose, dark non-environmental background, flat/minimal directional lighting |
| UB-9 | Material cleanness | Gloss / chrome / reflectivity | Matte porcelain; no gloss, chrome, or metallic-sheen drift |
| UB-10 | Anime / fashion drift | Whole candidate | ABSENT (hard stop if present) |

A future review records each criterion as PASS / NOTE / FAIL with one line of evidence. Any UB-3 or UB-10 FAIL is an automatic hard stop (see Section 7).

---

## 6. Motion-READINESS Constraints (Paper Only — No Motion Render)

Phase 5 scope per AR-16 §6 includes defining motion-READINESS constraints "on paper" — what may move and what must stay static — with NO actual motion render. The following is that paper definition only.

| Region | Motion-readiness intent | Constraint |
|---|---|---|
| Helmet shell | Static | Rigid sealed shell; no facial deformation, no visor articulation, no jaw / mouth motion ever |
| Neck / collar junction | Limited articulation candidate | Junction must remain structurally continuous through any future articulation; seam may not break or expose a face |
| Shoulders / upper arms | Articulation candidate | May be flagged as future motion regions, but only as plating that slides over plating — no soft-body / cloth read |
| Chest plate | Mostly static | Structural plate; no breathing deformation, no costume flex |
| Material behavior | Static read | Porcelain reads rigid under any future motion; no rubbery, fabric, or organic deformation |

Status of this section: DEFINITION_ONLY. It does not authorize a rig, a Blender file, a motion test, or any render. Actual motion validation requires its own separate gate (consistent with AR-16 §7 and the character rig pipeline gates already recorded in the handoff).

---

## 7. Hard Stops Carried From AR-15

This plan inherits, without weakening, the hard stops in AR-15 Section 6. A Phase 5 review must reject on any of:

- Identity: human eyes / nose / mouth / exposed facial anatomy; open visor or visor glow implying eyes; anime proportions; portrait softening; fashion-magazine or sexualized body language.
- Material: surface below the crop differing from the accepted smooth monocoque porcelain; gloss / chrome / reflective drift; large decorative panels, engraving, or insignia; promoting OPTIONAL panel-gap / graphene into a dominant feature; transparent / holographic / energy-emitting surfaces (06C halo UI is HOLD — not permitted).
- Proportion / silhouette: proportions that re-style the bust; skin-tight costume read; full-body action / combat pose; environmental background; cinematic shot-composition intent.
- Status: any Phase 5 readiness claim, canon approval, asset lock, or production/render/film/video/public-ready label produced from this review.

---

## 8. Excluded Sources — Must Not Be Reused

Carried from AR-15 Section 8 and manifest V2 Sections 5–6.

| Asset | Reason |
|---|---|
| `MIKAGE_COMP_08B_HELMET_BUST_NEGATIVE_SPACE_ALT_PASS_TECHNICAL.png` | REJECT_DO_NOT_USE — confirmed anime/fashion drift (ASSET-RESET-12) |
| Full-body candidate 001 | REJECT_DO_NOT_USE |
| Controlled front canon repair V1 | FAIL_DO_NOT_USE |
| Corrected full-body front candidate V2 | Review-only / private evidence; not a positive source |
| 05B hair / mask | HOLD — not a permitted identity source unless PASSED in a future cycle |
| 06C halo / orbital UI | HOLD — not a permitted required element unless PASSED in a future cycle |
| Video / loop tests, archived film source packs | REJECT_DO_NOT_USE for stack use |

---

## 9. Phase 5 Internal Review Procedure (When Authorized)

Applies only if and when a Phase 5 internal upper-body consistency review is authorized. This plan does not authorize that review or any generation.

1. Confirm the consistency base inputs (Section 4) exist on disk; record CHUA_XAC_NHAN for any missing path.
2. If an upper-body candidate exists, assemble its evidence package: absolute source path, review report path, generation method and date.
3. Score the candidate against the UB-1…UB-10 criteria (Section 5), recording PASS / NOTE / FAIL with one-line evidence each.
4. Apply hard stops (Section 7); any UB-3 or UB-10 FAIL ends the review as REJECT_DO_NOT_USE.
5. Cross-check the paper motion-readiness constraints (Section 6) for contradictions — flag only; do not rig or render.
6. Assign one allowed outcome label (Section 10) and write a review report.

If no upper-body candidate exists yet, the review stops after Step 1 and records that the criteria are defined and awaiting a candidate under separate authorization.

---

## 10. Allowed And Forbidden Outcome Labels

| Allowed label | Meaning |
|---|---|
| `INCLUDE_AS_PHASE4_REFERENCE` | Meets all continuity / consistency checks; may be added as the upper-body consistency reference slot |
| `HOLD_FOR_REWORK` | Addressable issues; deferred; excluded from the stack |
| `REJECT_DO_NOT_USE` | Fails constraints; permanently excluded from this slot |

Forbidden labels: `CANON_APPROVED`, `ASSET_LOCKED`, `PRODUCTION_READY`, `PHASE_5_READY`, `RENDER_READY`, `FILM_READY`, `VIDEO_READY`, `PUBLIC_READY`. Receiving `INCLUDE_AS_PHASE4_REFERENCE` does not constitute canon approval, asset lock, or Phase 5 entry. Phase 5 still requires its own separate readiness re-review gate.

---

## 11. Interim Status After This Plan

| Field | Value |
|---|---|
| Phase 5 upper-body consistency criteria | DEFINED (UB-1…UB-10) |
| Motion-readiness constraints | DEFINED_ON_PAPER (no render) |
| Upper-body candidate exists | NO |
| Upper-body candidate scored | NO |
| Bust bridge promoted beyond Phase 4 reference | NO |
| Phase 5 started | NO |
| Next action | Operator review of this plan; then either commission an upper-body candidate under separate authorization and run Section 9, or hold |

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
- PHASE5_STARTED: NO
- LANE_CHANGED: NO (stays CHARACTER_CAST_LANE / ASSET-RESET chain)
- ASSET_GENERATED_BY_CLAUDE: NO
