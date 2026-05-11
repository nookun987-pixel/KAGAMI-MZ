# MIKAGE_PHASE4_COMPONENT_INTEGRATION_ACCEPTANCE_GATES_V1

## 1. Executive Decision

TRUE_CURRENT_PHASE: Phase 4 - Component Integration

GATE_PURPOSE: Define no-render acceptance gates for evidence-based Phase 4 component integration review.

These gates do not approve canon, create asset locks, authorize production use, authorize rendering, or call any candidate production-ready.

## 2. Allowed Gate Outcomes

Only these outcomes are allowed:

- INCLUDE_AS_PHASE4_REFERENCE
- HOLD_FOR_REWORK
- REJECT_DO_NOT_USE

Forbidden outcomes:

- CANON_APPROVED
- ASSET_LOCKED
- PRODUCTION_READY
- FILM_READY
- VIDEO_READY
- RENDER_READY
- PUBLIC_READY

## 3. Global Stop Gates

Any reviewed component must immediately fail or hold if it triggers one of these conditions.

| Gate | Stop condition | Required outcome |
|---|---|---|
| No human face drift | Human eyes, nose, mouth, expressive face, or exposed face appears where helmet identity must remain faceless | REJECT_DO_NOT_USE |
| No anime/fashion drift | Candidate reads as generic anime/fashion character, glossy costume, or stylized mask identity instead of Mikage component language | HOLD_FOR_REWORK or REJECT_DO_NOT_USE |
| No body shortcut | Candidate is used to imply full-body, bust, torso, or Phase 5/6 readiness | HOLD_FOR_REWORK |
| No downstream shortcut | Candidate is used to justify film, video, shotlist, motion, public deploy, render, ComfyUI runtime, or Blender work | REJECT_DO_NOT_USE for that use |
| No approval shortcut | Candidate is labeled canon-approved, asset-locked, production-ready, render-ready, film-ready, or public-ready | REJECT_DO_NOT_USE for that claim |
| Evidence required | Candidate has no evidence path, no source report, or no relation to locked/reference anchors | HOLD_FOR_REWORK |

## 4. Evidence Requirements

Each component review must cite:

1. Candidate file path.
2. Evidence report path.
3. Reference anchor path used for comparison.
4. Current status from evidence: PASS, REVIEW_CANDIDATE, HOLD, or FAIL.
5. Human review decision using only allowed gate outcomes.
6. Forbidden uses preserved in the review result.

Missing evidence means the component cannot be included as a Phase 4 reference.

## 5. Component-Specific Acceptance Gates

### 5.1 Helmet Faceplate Gate

Candidate:
`D:\workspace\ComfyUI\MIKAGE_CANON\10_COMPONENT_CANDIDATE_SET_V1\01_HELMET_FACEPLATE\MIKAGE_COMP_01A_HELMET_FACEPLATE_CLEAN_PASS.png`

Reference anchors:
- `D:\workspace\ComfyUI\MIKAGE_CANON\08_CHARACTER_REVIEW_CANDIDATES\MIKAGE_HELMET_FRONT_VIEW_3D_SOURCE_V1_ORTHO.png`
- `D:\workspace\ComfyUI\MIKAGE_CANON\08_CHARACTER_REVIEW_CANDIDATES\MIKAGE_VOLUME_FIRST_3D_HELMET_SIDE_V1_ORTHO.png`
- `D:\workspace\ComfyUI\MIKAGE_CANON\08_CHARACTER_REVIEW_CANDIDATES\MIKAGE_UNIFIED_KEY_VISUAL_V4_FROM_CLEAN_SOURCES_00001_.png`

Include only if:
- Faceless helmet read is preserved.
- Faceplate remains clean, hard-surface, and non-human.
- No nose, mouth, human eyes, animal ears, or kitsune-mask drift appears.
- Geometry supports front/side helmet references.

Hold if:
- It is directionally useful but needs clearer relation to locked helmet references.

Reject if:
- It introduces human facial anatomy or generic mask identity.

## 5.2 Sensor Slit Gate

Candidate:
`D:\workspace\ComfyUI\MIKAGE_CANON\10_COMPONENT_CANDIDATE_SET_V1\02_SENSOR_SLIT_FACEPLATE\MIKAGE_COMP_02B_SENSOR_SLIT_CLOSEUP_PASS.png`

Reference anchors:
- `D:\workspace\ComfyUI\MIKAGE_CANON\08_CHARACTER_REVIEW_CANDIDATES\MIKAGE_HELMET_FRONT_VIEW_3D_SOURCE_V1_ORTHO.png`
- `D:\workspace\ComfyUI\MIKAGE_CANON\03_COMPONENT_REFERENCE_ATLAS_V1\COMPONENT_USAGE_MAP_V1.md`

Include only if:
- Sensor slit reads as void-black technical aperture, not human eyes.
- Slit remains restrained and ultra-narrow.
- Porcelain surface discipline remains intact.

Hold if:
- Sensor read is useful but too close to eye expression.

Reject if:
- It reads as human eyes, anime eyes, or facial expression.

## 5.3 B4C Porcelain Material Gate

Candidate:
`D:\workspace\ComfyUI\MIKAGE_CANON\10_COMPONENT_CANDIDATE_SET_V1\03_B4C_PORCELAIN_MATERIAL\MIKAGE_COMP_03A_B4C_PORCELAIN_PANEL_GAP_PASS.png`

Reference anchors:
- `D:\workspace\ComfyUI\MIKAGE_CANON\03_COMPONENT_REFERENCE_ATLAS_V1\COMPONENT_USAGE_MAP_V1.md`
- `D:\workspace\ComfyUI\MIKAGE_CANON\10_COMPONENT_CANDIDATE_SET_V1\MIKAGE_COMPONENT_CANDIDATE_SET_V1_REVIEW_REPORT.md`

Include only if:
- Material reads as matte B4C porcelain armor.
- Black separation gaps remain narrow and controlled.
- Surface avoids glossy plastic, leather, fabric, or ornamental costume drift.

Hold if:
- Material direction is correct but needs cleaner surface discipline.

Reject if:
- It reads as glossy plastic, fashion armor, or unrelated sci-fi paneling.

## 5.4 Graphene Underlayer Gate

Candidate:
`D:\workspace\ComfyUI\MIKAGE_CANON\10_COMPONENT_CANDIDATE_SET_V1\04_GRAPHENE_UNDERLAYER\MIKAGE_COMP_04A_GRAPHENE_UNDERLAYER_HEX_GAP_PASS.png`

Reference anchors:
- `D:\workspace\ComfyUI\MIKAGE_CANON\03_COMPONENT_REFERENCE_ATLAS_V1\COMPONENT_USAGE_MAP_V1.md`
- `D:\workspace\ComfyUI\MIKAGE_CANON\10_COMPONENT_CANDIDATE_SET_V1\MIKAGE_COMPONENT_CANDIDATE_SET_V1_REVIEW_REPORT.md`

Include only if:
- Graphene appears as restrained black underlayer visible through armor gaps.
- It does not dominate helmet or armor identity.
- Texture remains technical and non-decorative.

Hold if:
- Texture is useful but too visually dominant.

Reject if:
- It becomes costume pattern, fabric, or decorative noise.

## 5.5 Zenith Blade Candidate Gate

Candidate:
`D:\workspace\ComfyUI\MIKAGE_CANON\10_COMPONENT_CANDIDATE_SET_V1\07_ZENITH_BLADE\MIKAGE_COMP_07B_ZENITH_BLADE_CLEAN_MONOLITH_REVIEW_CANDIDATE.png`

Reference anchors:
- `D:\workspace\ComfyUI\MIKAGE_CANON\08_CHARACTER_REVIEW_CANDIDATES\MIKAGE_ZENITH_BLADE_V2_POLISH_ONE_SHOT_00001_.png`
- `D:\workspace\ComfyUI\MIKAGE_CANON\03_COMPONENT_REFERENCE_ATLAS_V1\COMPONENT_USAGE_MAP_V1.md`

Include only if:
- Candidate clarifies the existing locked blade reference.
- Geometry remains massive, straight, monolithic, and industrial.
- It does not replace the locked blade reference.

Hold if:
- It is useful as comparison but diverges from locked blade details.

Reject if:
- It becomes curved, katana-like, fantasy sword-like, or ornamental.

## 5.6 Hair + Mask Identity Gate

Candidate:
`D:\workspace\ComfyUI\MIKAGE_CANON\10_COMPONENT_CANDIDATE_SET_V1\05_HAIR_MASK_PORTRAIT\MIKAGE_COMP_05B_HAIR_MASK_PORTRAIT_REVIEW_CANDIDATE.png`

Reference anchors:
- `D:\workspace\ComfyUI\MIKAGE_CANON\08_CHARACTER_REVIEW_CANDIDATES\MIKAGE_UNIFIED_KEY_VISUAL_V4_FROM_CLEAN_SOURCES_00001_.png`
- `D:\workspace\ComfyUI\MIKAGE_CANON\08_CHARACTER_REVIEW_CANDIDATES\MIKAGE_HELMET_FRONT_VIEW_3D_SOURCE_V1_ORTHO.png`

Include only if:
- Hair/mask cue supports existing Mikage identity without exposing face anatomy.
- It does not turn into generic anime, fashion portrait, or character glamour.

Hold if:
- Identity continuity is promising but canon drift risk remains unresolved.

Reject if:
- It reads as human portrait, anime/fashion character, or face reveal.

## 5.7 Halo / Orbital UI Gate

Candidate:
`D:\workspace\ComfyUI\MIKAGE_CANON\10_COMPONENT_CANDIDATE_SET_V1\06_HALO_ORBITAL_UI\MIKAGE_COMP_06C_ORBITAL_UI_LOW_CLUTTER_REVIEW_CANDIDATE.png`

Reference anchors:
- `D:\workspace\ComfyUI\MIKAGE_CANON\03_COMPONENT_REFERENCE_ATLAS_V1\COMPONENT_USAGE_MAP_V1.md`
- `D:\workspace\ComfyUI\MIKAGE_CANON\10_COMPONENT_CANDIDATE_SET_V1\MIKAGE_COMPONENT_CANDIDATE_SET_V1_REVIEW_REPORT.md`

Include only if:
- UI remains low-clutter and system-like.
- It supports future event/system language without becoming ornate sacred-geometry decoration.

Hold if:
- It is useful but too dense or ornamental.

Reject if:
- It becomes decorative halo, religious iconography, or visual clutter.

## 5.8 Helmet Bust Alternate Gate

Candidate:
`D:\workspace\ComfyUI\MIKAGE_CANON\10_COMPONENT_CANDIDATE_SET_V1\08_HELMET_BUST_ALT\MIKAGE_COMP_08B_HELMET_BUST_NEGATIVE_SPACE_ALT_PASS_TECHNICAL.png`

Reference anchors:
- `D:\workspace\ComfyUI\MIKAGE_CANON\10_COMPONENT_CANDIDATE_SET_V1\MIKAGE_COMPONENT_CANDIDATE_SET_V1_REVIEW_REPORT.md`
- `D:\KAGAMI-MZ_SYNC_PUSH_V2\docs\handoff\MIKAGE_PHASE4_COMPONENT_REVIEW_SELECTION_V1.md`

Allowed outcome:
- HOLD_FOR_REWORK, unless human review explicitly rejects it.

Reason:
- Existing evidence marks this candidate high canon risk with anime/fashion drift. It may be used only as technical negative-space reference and must not start Phase 5.

## 6. Exclusion Gates

These items are excluded from Phase 4 component inclusion:

- Full-body candidate 001.
- Corrected full-body front candidate V2.
- Controlled front canon repair V1.
- Cinematic chamber/environment tests.
- Video tests and loop tests.
- Archived film source packs.

They may be cited only as failure, archive, or downstream-risk evidence.

## 7. Phase 4 Pass Condition

Phase 4 component integration can move to a stack manifest only after:

1. Every selected component has one allowed gate outcome.
2. Every included component has evidence path and reference anchor path.
3. Held and rejected components preserve forbidden-use notes.
4. No result claims canon approval, asset lock, production readiness, render readiness, film readiness, or video readiness.
5. Downstream missing slots remain explicitly blocked.

## 8. Next Safe Task

ASSET-RESET-05_DEFINE_MISSING_BODY_BUST_AND_ENVIRONMENT_ASSET_REQUESTS_NO_RENDER_V1
