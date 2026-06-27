# MIKAGE_BUST_UPPER_BODY_BRIDGE_ASSET_REQUEST_SPEC_V1

## 1. Executive Decision

TRUE_CURRENT_PHASE: Phase 4 - Component Integration

PHASE5_ALLOWED: NO

SPEC_STATUS: REQUIREMENT_DEFINED

This document defines the specification for the Mikage bust / upper-body bridge asset. It is a no-render planning and commissioning specification only. It does not render, generate, approve canon, create asset locks, call any candidate production-ready, start Phase 5, use ComfyUI runtime, use Blender, or create film / video / short / shotlist tasks. Asset generation must be performed by Codex or a local ComfyUI workflow — not Claude.

---

## 2. Source Files Reviewed

- `docs/handoff/MIKAGE_PHASE4_COMPONENT_GATE_DECISIONS_V1.md`
- `docs/handoff/MIKAGE_PHASE4_STACK_MANIFEST_V1.md`
- `docs/handoff/MIKAGE_MISSING_BODY_BUST_ENVIRONMENT_ASSET_REQUESTS_V1.md`
- `docs/handoff/MIKAGE_PHASE4_HELD_CANDIDATE_REWORK_AND_MISSING_ASSET_BUILD_SEQUENCE_V1.md`
- `docs/handoff/MIKAGE_PHASE4_HELD_CANDIDATE_HUMAN_REVIEW_SUMMARY_V1.md`

---

## 3. Why This Spec Exists

### 3.1 Gap In Current Stack

The Phase 4 component review established a reference stack covering helmet faceplate, sensor slit detail, material panels (B4C porcelain, graphene underlayer), and blade geometry. What the stack does not contain is a usable bust / upper-body bridge connecting the helmet to the torso region with correct material, silhouette, and identity constraints.

Candidate 08B (`MIKAGE_COMP_08B_HELMET_BUST_NEGATIVE_SPACE_ALT_PASS_TECHNICAL`) was the only bust-adjacent candidate reviewed. It received a HIGH canon-risk rating and a confirmed anime / fashion drift finding. It is excluded from positive stack use. The Phase 4 human review process (ASSET-RESET-12) is expected to REJECT or HOLD 08B permanently.

### 3.2 Phase 5 Blocking Effect

Without an accepted bust / upper-body bridge asset, Phase 5 (upper-body consistency review) cannot begin. This spec defines the exact target so that a correctly constrained new candidate can be commissioned or generated.

### 3.3 Relationship To 08B

This spec does not inherit the constraints of 08B. It is written from the locked identity anchors and Phase 4 component gates as the authoritative source. Any new candidate generated to this spec must be compared against the anchors listed in Section 5, not against 08B.

---

## 4. What The Bust / Upper-Body Bridge Must Depict

### 4.1 Required Depiction Scope

| Element | Requirement |
|---|---|
| Helmet / head | Fully helmeted; strictly faceless; consistent with locked helmet front and side 3D sources |
| Faceplate | Sealed; no eye slits, no nose, no mouth, no exposed skin, no visor opening |
| Neck / collar junction | Helmet-to-body seam must be structurally visible; no exposed neck skin |
| Shoulders | Present; upper shoulder armor plate in B4C porcelain material |
| Upper torso (partial) | Sufficient upper chest / collar area to establish helmet-body material continuity |
| Material (primary) | Matte B4C porcelain armor plate — consistent with `MIKAGE_COMP_03A_B4C_PORCELAIN_PANEL_GAP_PASS` |
| Material (secondary) | Black graphene underlayer visible through panel gaps — consistent with `MIKAGE_COMP_04A_GRAPHENE_UNDERLAYER_HEX_GAP_PASS` |
| Composition framing | Bust or upper-body crop; neutral pose; suitable for consistency review only |
| Background | Dark, neutral, non-environmental; no world plate, no scene staging |
| Lighting | Flat or minimal directional; must not obscure material or geometry reads |

### 4.2 Optional Elements (Permitted If Constraints Are Met)

| Optional element | Permission condition |
|---|---|
| Hair / mask cues | Only if candidate 05B (hair + mask) has received PASS from human review in ASSET-RESET-12. If 05B is HOLD or REJECT, no hair / mask must appear. |
| Zenith blade (partial) | May appear as a partial grip or shoulder-adjacent reference only if it does not override material or geometry reads. Must not introduce new blade geometry. |
| Halo / orbital UI element | Only after candidate 06C (orbital UI) receives PASS from human review in ASSET-RESET-12. Not permitted before that decision is recorded. |

---

## 5. Canon Constraint Reference Anchors

All new bust / upper-body bridge candidates must be checked against ALL of the following locked anchors:

| Anchor | Path | Constraint enforced |
|---|---|---|
| Unified key visual V4 | `D:\workspace\ComfyUI\MIKAGE_CANON\08_CHARACTER_REVIEW_CANDIDATES\MIKAGE_UNIFIED_KEY_VISUAL_V4_FROM_CLEAN_SOURCES_00001_.png` | Overall identity, silhouette, and style language |
| Helmet front 3D source V1 | `D:\workspace\ComfyUI\MIKAGE_CANON\08_CHARACTER_REVIEW_CANDIDATES\MIKAGE_HELMET_FRONT_VIEW_3D_SOURCE_V1_ORTHO.png` | Helmet faceplate geometry, proportion, and front silhouette |
| Helmet side 3D source V1 | `D:\workspace\ComfyUI\MIKAGE_CANON\08_CHARACTER_REVIEW_CANDIDATES\MIKAGE_VOLUME_FIRST_3D_HELMET_SIDE_V1_ORTHO.png` | Helmet volume, depth, and side silhouette |
| Helmet faceplate Phase 4 reference | `D:\workspace\ComfyUI\MIKAGE_CANON\10_COMPONENT_CANDIDATE_SET_V1\01_HELMET_FACEPLATE\MIKAGE_COMP_01A_HELMET_FACEPLATE_CLEAN_PASS.png` | Faceplate cleanness, no drift standard |
| B4C porcelain material reference | `D:\workspace\ComfyUI\MIKAGE_CANON\10_COMPONENT_CANDIDATE_SET_V1\03_B4C_PORCELAIN_MATERIAL\MIKAGE_COMP_03A_B4C_PORCELAIN_PANEL_GAP_PASS.png` | Armor plate material language, matte finish, panel gap geometry |
| Graphene underlayer reference | `D:\workspace\ComfyUI\MIKAGE_CANON\10_COMPONENT_CANDIDATE_SET_V1\04_GRAPHENE_UNDERLAYER\MIKAGE_GRAPHENE_UNDERLAYER_HEX_GAP_PASS.png` | Underlayer material, visible only through armor gaps |
| Zenith blade V2 | `D:\workspace\ComfyUI\MIKAGE_CANON\08_CHARACTER_REVIEW_CANDIDATES\MIKAGE_ZENITH_BLADE_V2_POLISH_ONE_SHOT_00001_.png` | Blade identity anchor if blade appears in frame |

---

## 6. What The Bust / Upper-Body Bridge Must NOT Introduce

### 6.1 Identity Violations (Hard Stop)

- Human eyes, nose, mouth, or any exposed facial anatomy
- Expressive facial geometry, open visor, cracked faceplate, or visor glow implying eyes
- Anime-style face proportions, softened portrait framing, or fashion-magazine body language
- Skin-tight or form-fitted armor that reads as costume rather than structural plating
- Gender-coded glamour, sexualized silhouette, or ornamental sci-fi styling

### 6.2 Material Violations

- Glossy, chrome, metallic-sheen, or reflective armor inconsistent with matte B4C porcelain
- Elaborate surface decoration, engraving, insignia, or pattern overlaid on armor plate
- Transparent, holographic, or energy-emitting armor surfaces (unless part of a reviewed halo/orbital UI component)

### 6.3 Compositional Violations

- Full-body pose, action pose, combat stance, or narrative staging
- Environmental background implying a scene, location, or world plate
- Cinematic framing, camera-movement implication, or shot-composition intent
- Film plate ready, video ready, or any output that implies downstream render use

### 6.4 Status Violations

- Phase 5 readiness claim
- Canon approval claim
- Asset lock
- Production-ready label
- Public output readiness
- Any label that bypasses the required review gate

---

## 7. Known Exclusions — Must Not Be Reused

The following existing assets must not be used as positive source or starting point for this request:

| Asset | Reason |
|---|---|
| `MIKAGE_COMP_08B_HELMET_BUST_NEGATIVE_SPACE_ALT_PASS_TECHNICAL.png` | HIGH canon risk; confirmed anime / fashion drift; held for expected REJECT in ASSET-RESET-12 |
| Full-body candidate 001 | REJECT_DO_NOT_USE from Phase 4 gate decisions |
| Controlled front canon repair V1 | FAIL_DO_NOT_USE from prior evidence |
| Corrected full-body front candidate V2 | Review-only / private evidence; not a positive phase-4 source |
| Brutalist void / consequence chamber V3 | Failed downstream environment; not an identity source |
| Video tests and loop tests | REJECT_DO_NOT_USE for stack use |
| Archived film source packs | Archive-only; not current production stack evidence |

---

## 8. Generation Authority

| Party | Permission |
|---|---|
| Claude | NOT permitted to generate this asset. Claude writes specs only. |
| Codex (local) | Permitted — can run ComfyUI workflow locally to generate candidate |
| Local ComfyUI runtime (user-operated) | Permitted — user or Codex may operate ComfyUI |
| Blender | Not required for this asset; may be used for 3D helmet anchor reference only if needed |
| Public / external render service | Not permitted at this phase |

Generation must follow the constraints in Sections 4, 5, and 6 exactly. The output must be reviewed using the evaluation process in Section 9 before it can be assigned any stack status.

> GOVERNANCE PRECEDENCE NOTE (added later): `CLAUDE.md` → "RENDER GOVERNANCE PRECEDENCE" now overrides Section 8 (generation authority) and Section 13 (`ASSET_GENERATED_BY_CLAUDE: NO`) of this spec for the active bust / upper-body bridge render task ONLY, when the user explicitly requests render/generate. Under that override, Claude Code MAY generate this asset. All other constraints of this spec — Sections 4, 5, 6, 7, and 9 — remain fully in force and are NOT overridden. Any rendered output is a REVIEW_CANDIDATE only and must still pass the Section 9 evaluation gate before receiving any positive label.

---

## 9. Candidate Evaluation Process (When A Candidate Exists)

A future candidate submitted for this spec slot must pass all evaluation steps before receiving any positive status:

### Step 1 — Evidence Package

The candidate must be submitted with:

1. Source file path (absolute)
2. Review report path (absolute)
3. Generation method and date

### Step 2 — Anchor Comparison Checklist

The reviewer must confirm against each anchor in Section 5:

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

### Step 3 — Allowed Outcome Labels

The reviewer may assign only these labels:

| Label | Meaning |
|---|---|
| `INCLUDE_AS_PHASE4_REFERENCE` | Candidate meets all constraint checks and may be added to the Phase 4 stack as the bust / upper-body bridge reference slot |
| `HOLD_FOR_REWORK` | Candidate has addressable issues; deferred for rework; excluded from stack |
| `REJECT_DO_NOT_USE` | Candidate fails constraints; permanently excluded from this spec slot |

### Step 4 — Forbidden Labels

The reviewer must not assign:

- `CANON_APPROVED`
- `ASSET_LOCKED`
- `PRODUCTION_READY`
- `PHASE_5_READY`
- `RENDER_READY`
- `FILM_READY`
- `VIDEO_READY`
- `PUBLIC_READY`

Receiving `INCLUDE_AS_PHASE4_REFERENCE` does not constitute canon approval, asset lock, or Phase 5 entry permission. Phase 5 requires a separate Phase 5 readiness re-review gate to pass.

---

## 10. After Candidate Is Accepted

If and when a candidate receives `INCLUDE_AS_PHASE4_REFERENCE` under this spec, the following downstream tasks become available:

| Task | Dependency |
|---|---|
| ASSET-RESET-13 — Update Phase 4 stack manifest | Also requires ASSET-RESET-12 human decisions |
| ASSET-RESET-15 — Define body continuity constraint spec | Requires this bust bridge spec (B1) to exist and be accepted |
| Phase 5 readiness re-review | Requires A3 (updated manifest) + B1 accepted |

Phase 5 CANNOT start from this spec acceptance alone.

---

## 11. Phase 5 Unblocking Conditions (For Context Only)

This spec completion satisfies ONE of four conditions required before Phase 5 can be proposed:

| Condition | Unblocked by | Met by this task? |
|---|---|---|
| Held candidates have documented human decisions | ASSET-RESET-12 | NO — human input required |
| Phase 4 stack manifest updated with decisions | ASSET-RESET-13 | NO — depends on A2 |
| Bust / upper-body bridge spec exists | ASSET-RESET-14 (this task) | YES — spec defined |
| Phase 5 readiness re-review PASS | Separate gate review | NO |

PHASE5_ALLOWED: NO until all four conditions are confirmed PASS.

---

## 12. Interim Status After This Spec

| Field | Value |
|---|---|
| Bust / upper-body bridge slot | REQUIREMENT_DEFINED |
| Candidate exists | NO |
| Candidate accepted | NO |
| Phase 5 unblocked | NO |
| Next action | Commission or generate candidate using Codex / local ComfyUI per this spec, then evaluate using Section 9 |

---

## 13. Prohibited Actions Confirmed

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
- ASSET_GENERATED_BY_CLAUDE: NO
