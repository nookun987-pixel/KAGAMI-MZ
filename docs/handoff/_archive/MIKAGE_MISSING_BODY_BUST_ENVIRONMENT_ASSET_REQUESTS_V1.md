# MIKAGE_MISSING_BODY_BUST_ENVIRONMENT_ASSET_REQUESTS_V1

## 1. Executive Decision

TRUE_CURRENT_PHASE: Phase 4 - Component Integration

REQUEST_PURPOSE: Define missing Mikage body, bust/upper-body, and environment asset requirements without rendering, generating, approving canon, or locking assets.

These requests are planning/spec definitions only. They do not create image, video, short, shotlist, render, ComfyUI runtime, Blender, public deployment, canon approval, asset lock, or production-ready claims.

## 2. Current Evidence Summary

The repo has usable locked/reference anchors for helmet, identity, blade, and component review. It does not have production-ready body, bust/upper-body, or environment assets.

Relevant evidence:

- Phase 4 component gates exist and allow only `INCLUDE_AS_PHASE4_REFERENCE`, `HOLD_FOR_REWORK`, or `REJECT_DO_NOT_USE`.
- Phase 5 bust/upper-body consistency is not started.
- Phase 6 full-character/whole-body consistency has failed or review-only outputs.
- Environment/world plates are missing or failed.
- Film/video/shotlist/render remain prohibited.

## 3. Missing Asset Request: Bust / Upper-Body Bridge

REQUEST_ID: MIKAGE_BUST_UPPER_BODY_BRIDGE_REQUIREMENT_V1

Purpose:
Define the minimum upper-body bridge needed after Phase 4 component review before Phase 5 can safely begin.

Required qualities:

- Helmet identity must remain faceless and consistent with locked front/side helmet references.
- Shoulders, upper torso, collar, and neck/helmet connection must support Mikage component language.
- B4C porcelain and graphene underlayer materials must follow the Phase 4 gates.
- Hair/mask cues may appear only if they pass review without human-face, anime/fashion, or identity drift.
- Composition must be suitable for consistency review, not public use or film use.

Forbidden qualities:

- Human eyes, nose, mouth, exposed face, face reveal, or expressive facial anatomy.
- Generic anime portrait, fashion bust, glossy costume, or ornamental sci-fi drift.
- Full-body implication, Phase 5 pass claim, canon approval, asset lock, production-ready label, render-ready label, film-ready label.

Required evidence before acceptance:

1. Source path.
2. Review report path.
3. Comparison against locked identity, helmet front, helmet side, material, and blade references where relevant.
4. Phase 4 gate outcome.
5. Forbidden-use notes.

Allowed interim state:

- MISSING_REQUIRED_ASSET
- REQUIREMENT_DEFINED
- HOLD_FOR_REWORK

Not allowed:

- CANON_APPROVED
- ASSET_LOCKED
- PRODUCTION_READY
- PHASE_5_READY

## 4. Missing Asset Request: Body Continuity / Full-Character Constraint

REQUEST_ID: MIKAGE_BODY_CONTINUITY_REQUIREMENT_V1

Purpose:
Define body continuity constraints so future Phase 6 work does not reuse failed full-body outputs or drift from Phase 4 component evidence.

Required qualities:

- Body proportions must be subordinate to Mikage helmet, material, and blade identity.
- Full-character silhouette must not override component references.
- Armor material must remain matte B4C porcelain with restrained black underlayer and controlled seams.
- Blade geometry must remain massive, straight, monolithic, and non-fantasy.
- Body pose must be neutral enough for consistency review, not action, combat, or film staging.

Forbidden qualities:

- Reuse of full-body candidate 001 as positive source.
- Reuse of controlled front canon repair V1.
- Calling corrected full-body front candidate V2 final, public-ready, video-source approved, or production-ready.
- Sexualized/fashion body, generic anime body, glamour pose, combat pose, cinematic shot, or narrative staging.
- Any claim of Phase 6 readiness before Phase 4/5 gates pass.

Required evidence before acceptance:

1. Body asset source path.
2. Review report path.
3. Explicit exclusion of known failed/review-only body outputs.
4. Comparison against Phase 4 component gates and locked identity anchors.
5. Human review outcome using allowed labels only.

Allowed interim state:

- MISSING_REQUIRED_ASSET
- REQUIREMENT_DEFINED
- HOLD_FOR_REWORK

Not allowed:

- CANON_APPROVED
- ASSET_LOCKED
- PRODUCTION_READY
- PHASE_6_READY

## 5. Missing Asset Request: Environment / World Plate Requirement

REQUEST_ID: MIKAGE_ENVIRONMENT_WORLD_PLATE_REQUIREMENT_V1

Purpose:
Define the minimum non-film environment/world requirement needed as future downstream support, without creating a shotlist or render task.

Required qualities:

- Environment must support Mikage identity without becoming a cinematic proof or narrative video plan.
- World language should be restrained, dark, architectural, and compatible with faceless helmet/material identity.
- Environment must leave room for future component/body review rather than forcing a shot composition.
- It must be usable as a reference requirement or static world-plate requirement only after later gates.

Forbidden qualities:

- Film proof, video proof, short, shotlist, render, or public deployment framing.
- Reuse of failed brutalist void/consequence chamber test as positive production source.
- Overly cinematic framing that bypasses Phase 4/5/6/7.
- Combat, action animation, camera movement, or narrative sequence assumptions.

Required evidence before acceptance:

1. Environment source path.
2. Review report path.
3. Explicit distinction between world reference, environment plate, and film shot.
4. Phase status proving it does not bypass Phase 4-7.
5. Forbidden-use notes.

Allowed interim state:

- MISSING_REQUIRED_ASSET
- REQUIREMENT_DEFINED
- HOLD_FOR_REWORK

Not allowed:

- FILM_READY
- VIDEO_READY
- SHOTLIST_READY
- RENDER_READY
- PUBLIC_READY

## 6. Shared Acceptance Criteria

Any future candidate for these requests must pass all shared criteria:

1. Evidence path exists.
2. Review report exists.
3. Candidate is compared against Phase 4 component gates.
4. Candidate does not contradict known failed/review-only outputs.
5. Candidate receives only an allowed review label.
6. Candidate keeps forbidden uses visible.
7. Candidate does not start Phase 5, Phase 6, Phase 7, Phase 8, or Phase 9.

Allowed labels:

- REQUIREMENT_DEFINED
- INCLUDE_AS_PHASE4_REFERENCE
- HOLD_FOR_REWORK
- REJECT_DO_NOT_USE

Forbidden labels:

- CANON_APPROVED
- ASSET_LOCKED
- PRODUCTION_READY
- PHASE_5_READY
- PHASE_6_READY
- MOTION_READY
- FILM_READY
- VIDEO_READY
- RENDER_READY

## 7. Known Exclusions

The following items must not be used as positive source material for these requests:

- Full-body candidate 001.
- Corrected full-body front candidate V2, except as review-only reference evidence.
- Controlled front canon repair V1.
- Brutalist void consequence chamber V3.
- Video tests and loop tests.
- Archived film source packs.

## 8. Build Order After This Spec

1. Create Phase 4 to Phase 5 go/no-go checklist.
2. Apply Phase 4 component acceptance gates to selected components.
3. Create a Phase 4 stack manifest from included, held, rejected, and missing items.
4. Only after Phase 4 manifest is reviewed, decide whether a Phase 5 bust/upper-body request task is safe.
5. Do not start body, environment, motion, film, video, shotlist, render, canon approval, or asset-lock work from this spec alone.

## 9. Next Safe Task

ASSET-RESET-06_CREATE_PHASE4_TO_PHASE5_GO_NO_GO_CHECKLIST_V1
