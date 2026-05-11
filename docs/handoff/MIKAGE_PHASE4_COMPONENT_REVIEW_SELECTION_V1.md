# MIKAGE_PHASE4_COMPONENT_REVIEW_SELECTION_V1

## 1. Executive Decision

TRUE_CURRENT_PHASE: Phase 4 - Component Integration

SELECTION_PURPOSE: Select existing Mikage Phase 4 component candidates for evidence-based review.

This selection does not approve canon, create asset locks, authorize production use, authorize rendering, or call any candidate production-ready.

## 2. Source Evidence

- `D:\KAGAMI-MZ_SYNC_PUSH_V2\docs\handoff\00_LATEST_CODEX_HANDOFF.md`
- `D:\KAGAMI-MZ_SYNC_PUSH_V2\docs\handoff\MIKAGE_MINIMUM_PRODUCTION_ASSET_STACK_PLAN_V1.md`
- `D:\KAGAMI-MZ_SYNC_PUSH_V2\docs\handoff\ASSET-RESET-02_CREATE_MIKAGE_MINIMUM_PRODUCTION_ASSET_STACK_PLAN_V1_REPORT.md`
- `D:\KAGAMI-MZ_SYNC_PUSH_V2\docs\handoff\MIKAGE_USABLE_ASSET_INVENTORY_V1.md`
- `D:\KAGAMI-MZ_SYNC_PUSH_V2\docs\handoff\MIKAGE_MASTER_PIPELINE_CURRENT_STATE_AUDIT_V1.md`
- `D:\workspace\ComfyUI\MIKAGE_CANON\10_COMPONENT_CANDIDATE_SET_V1\MIKAGE_COMPONENT_CANDIDATE_SET_V1_REVIEW_REPORT.md`
- `D:\workspace\ComfyUI\MIKAGE_CANON\10_COMPONENT_CANDIDATE_SET_V1\MIKAGE_COMPONENT_CANDIDATE_SET_V1_MANIFEST.md`
- `D:\workspace\ComfyUI\MIKAGE_CANON\03_COMPONENT_REFERENCE_ATLAS_V1\COMPONENT_USAGE_MAP_V1.md`

## 3. Global Constraints From Evidence

- CANON_APPROVED: NO
- ASSET_LOCK: NO
- FULL_BODY_READY: NO
- COMPOSITE_READY: NO
- FILM_VIDEO_ALLOWED: NO
- RENDER_ALLOWED: NO
- COMFYUI_RUNTIME_ALLOWED: NO
- BLENDER_ALLOWED: NO

The component set is usable only as review evidence. It must not be treated as final canon or a locked production stack.

## 4. Read-Only Reference Anchors

These anchors should be used to judge component candidates. They are not being changed, approved, or re-locked by this task.

| Anchor | Path | Role in review | Forbidden use |
|---|---|---|---|
| Unified key visual V4 | `D:\workspace\ComfyUI\MIKAGE_CANON\08_CHARACTER_REVIEW_CANDIDATES\MIKAGE_UNIFIED_KEY_VISUAL_V4_FROM_CLEAN_SOURCES_00001_.png` | Identity and style reference | Full character proof, film plate, or new approval |
| Helmet front 3D source V1 | `D:\workspace\ComfyUI\MIKAGE_CANON\08_CHARACTER_REVIEW_CANDIDATES\MIKAGE_HELMET_FRONT_VIEW_3D_SOURCE_V1_ORTHO.png` | Front helmet geometry reference | Render input or new asset lock |
| Helmet side 3D source V1 | `D:\workspace\ComfyUI\MIKAGE_CANON\08_CHARACTER_REVIEW_CANDIDATES\MIKAGE_VOLUME_FIRST_3D_HELMET_SIDE_V1_ORTHO.png` | Side silhouette and volume reference | Render input or full-character claim |
| Zenith blade V2 | `D:\workspace\ComfyUI\MIKAGE_CANON\08_CHARACTER_REVIEW_CANDIDATES\MIKAGE_ZENITH_BLADE_V2_POLISH_ONE_SHOT_00001_.png` | Locked blade identity reference | Replaced by candidate without review |
| Component usage map V1 | `D:\workspace\ComfyUI\MIKAGE_CANON\03_COMPONENT_REFERENCE_ATLAS_V1\COMPONENT_USAGE_MAP_V1.md` | Review rules for helmet, blade, armor, and failure conditions | Production approval by itself |

## 5. Primary Review Selection

These candidates are selected first because the evidence report marks them PASS with low canon risk or direct Phase 4 usefulness. Selection means review priority only.

| Review order | Component slot | Selected file | Evidence status | Review question | Allowed review use | Forbidden use |
|---:|---|---|---|---|---|---|
| 1 | Helmet faceplate | `D:\workspace\ComfyUI\MIKAGE_CANON\10_COMPONENT_CANDIDATE_SET_V1\01_HELMET_FACEPLATE\MIKAGE_COMP_01A_HELMET_FACEPLATE_CLEAN_PASS.png` | DECISION: PASS; CANON_RISK: LOW | Does this preserve the faceless helmet and clean faceplate geometry against locked helmet references? | Include in Phase 4 review board | Canon approval, asset lock, production-ready claim |
| 2 | Sensor slit detail | `D:\workspace\ComfyUI\MIKAGE_CANON\10_COMPONENT_CANDIDATE_SET_V1\02_SENSOR_SLIT_FACEPLATE\MIKAGE_COMP_02B_SENSOR_SLIT_CLOSEUP_PASS.png` | DECISION: PASS; CANON_RISK: LOW | Does this keep strict faceless sensor-slit identity without human eyes, nose, or mouth? | Include in Phase 4 review board | Canon approval, asset lock, production-ready claim |
| 3 | B4C porcelain material | `D:\workspace\ComfyUI\MIKAGE_CANON\10_COMPONENT_CANDIDATE_SET_V1\03_B4C_PORCELAIN_MATERIAL\MIKAGE_COMP_03A_B4C_PORCELAIN_PANEL_GAP_PASS.png` | DECISION: PASS; CANON_RISK: LOW | Does this define matte B4C porcelain plates and black separation gaps consistently? | Include in Phase 4 review board | Final material approval, render input, asset lock |
| 4 | Graphene underlayer | `D:\workspace\ComfyUI\MIKAGE_CANON\10_COMPONENT_CANDIDATE_SET_V1\04_GRAPHENE_UNDERLAYER\MIKAGE_COMP_04A_GRAPHENE_UNDERLAYER_HEX_GAP_PASS.png` | DECISION: PASS; CANON_RISK: LOW | Does this work only as restrained black underlayer visible through armor gaps? | Include in Phase 4 review board | Final material approval, render input, asset lock |
| 5 | Zenith blade candidate comparison | `D:\workspace\ComfyUI\MIKAGE_CANON\10_COMPONENT_CANDIDATE_SET_V1\07_ZENITH_BLADE\MIKAGE_COMP_07B_ZENITH_BLADE_CLEAN_MONOLITH_REVIEW_CANDIDATE.png` | DECISION: REVIEW_CANDIDATE; CANON_RISK: LOW | Does this support or clarify the locked Zenith blade V2 without replacing it? | Compare against locked blade reference | Replacing locked blade, canon approval, asset lock |

## 6. Secondary Human Review Selection

These candidates are selected for human review after primary helmet/material/blade slots because the evidence marks medium risk or system-language uncertainty.

| Review order | Component slot | Selected file | Evidence status | Review question | Allowed review use | Forbidden use |
|---:|---|---|---|---|---|---|
| 6 | Hair + mask identity continuity | `D:\workspace\ComfyUI\MIKAGE_CANON\10_COMPONENT_CANDIDATE_SET_V1\05_HAIR_MASK_PORTRAIT\MIKAGE_COMP_05B_HAIR_MASK_PORTRAIT_REVIEW_CANDIDATE.png` | DECISION: REVIEW_CANDIDATE; CANON_RISK: MEDIUM | Does hair/mask identity support Mikage without drifting into human/anime/fashion identity? | Human review against locked identity anchors | Production character asset, canon approval, film plate |
| 7 | Halo/orbital UI system | `D:\workspace\ComfyUI\MIKAGE_CANON\10_COMPONENT_CANDIDATE_SET_V1\06_HALO_ORBITAL_UI\MIKAGE_COMP_06C_ORBITAL_UI_LOW_CLUTTER_REVIEW_CANDIDATE.png` | DECISION: REVIEW_CANDIDATE; CANON_RISK: MEDIUM | Does the low-clutter orbital UI support system/event language without visual clutter? | Human review after core component slots | Final UI lock, shot/event plate, render input |

## 7. Hold / High-Risk Review Selection

This candidate is not selected for primary inclusion. It is held for a narrow technical review only.

| Component slot | Held file | Evidence status | Hold reason | Allowed review use | Forbidden use |
|---|---|---|---|---|---|
| Helmet bust alternate | `D:\workspace\ComfyUI\MIKAGE_CANON\10_COMPONENT_CANDIDATE_SET_V1\08_HELMET_BUST_ALT\MIKAGE_COMP_08B_HELMET_BUST_NEGATIVE_SPACE_ALT_PASS_TECHNICAL.png` | DECISION: REVIEW_CANDIDATE; CANON_RISK: HIGH; ANIME_OR_FASHION_DRIFT: YES | Useful as negative-space technical reference, but too risky for identity or Phase 5 handoff | Technical composition review only | Canon identity, bust approval, Phase 5 start, film plate, public output |

## 8. Explicitly Excluded From Phase 4 Component Selection

| Excluded item | Reason |
|---|---|
| Full-body candidate 001 | Existing review marks it failed/do-not-use for canon and production. |
| Corrected full-body front candidate V2 | Review-only/private reference; not final canon, public-ready, or video-source approved. |
| Controlled front canon repair V1 | Existing review marks it FAIL_DO_NOT_USE. |
| Cinematic chamber/environment tests | Failed or downstream tests; not Phase 4 component integration evidence. |
| Video tests and loop tests | Downstream references only; cannot bypass Phase 4-7 gates. |
| Archived film source packs | Archive-only; not a current production stack. |

## 9. Review Decision Labels For Next Task

The next task should apply only these labels:

- INCLUDE_AS_PHASE4_REFERENCE
- HOLD_FOR_REWORK
- REJECT_DO_NOT_USE

Forbidden labels:

- CANON_APPROVED
- ASSET_LOCKED
- PRODUCTION_READY
- FILM_READY
- RENDER_READY

## 10. Next Safe Task

ASSET-RESET-04_CREATE_COMPONENT_INTEGRATION_ACCEPTANCE_GATES_NO_RENDER_V1
