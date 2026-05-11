# MIKAGE_FILM_REQUIRED_ASSET_BLUEPRINT_V1

## 1. Executive Decision

The current Mikage system is not film-production-ready.

Existing mask, key visual, and blade stills are useful reference material, but they do not form a film-ready asset set. FILM-02 must not proceed from the current FILM-01B source pack because it lacks a real environment/world beat, a body/silhouette or staged character-presence beat, a motion plan, audio decision, and storyboard-ready shot plates.

## 2. Corrected Current State

- MIKAGE_FILM_READY_ASSET_SET: NO
- FILM_READY_CHARACTER_ASSETS: NO
- FILM_READY_ENVIRONMENT_ASSETS: NO
- FILM_READY_SHOT_LIBRARY: NO
- FILM_READY_AUDIO_PIPELINE: NO
- FILM_READY_STORYBOARD: NO
- CURRENT_MASK_KEY_VISUAL_BLADE_SET: REFERENCE_ONLY
- IMMEDIATE_FILM_02_ALLOWED: NO

## 3. Definitions

- reference asset: a file that can inform design, mood, identity, or constraints, but is not approved as direct film source.
- key visual: a high-quality identity still for branding or planning. A key visual is not automatically a film shot plate.
- film-ready asset: a source file with known role, usage permission, visual quality, shot purpose, and QA status sufficient for film proof construction.
- shot plate: a still or layered source intended to become one shot in a proof, with framing, subject role, and motion limits defined.
- character presence plate: a shot plate that shows Mikage through body, silhouette, staged posture, or cinematic composition beyond a mask close-up.
- environment plate: a shot plate that establishes world, chamber, void architecture, floor, depth, or physical context.
- event/system plate: a shot plate that communicates a change, activation, signal, weapon/detail event, title beat, or system state.
- motion proof: a short test proving timing, motion language, and source suitability without claiming full narrative film readiness.
- cinematic proof: a bounded sequence with environment, character presence, event/change, rhythm, motion language, and sound decision.
- short film: a complete narrative or teaser film with approved source pack, shot library, sound/music, edit plan, QA checklist, and release/public decision.

## 4. Minimum Real Mikage Cinematic Proof Requirements

- environment/world beat: one film-ready plate establishing where the scene exists or what void/system space surrounds Mikage.
- character presence beyond mask-only: one plate that gives staged presence through body, silhouette, scale, posture, or a wider cinematic composition.
- event/change beat: one plate that creates progression, such as signal activation, blade reveal, title/system wake, interface anomaly, or consequence.
- rhythm/timing: a 15-25 second beat map with shot durations, holds, transitions, and silence/audio timing.
- motion language: limited, non-destructive motion rules such as slow push, parallax, subtle light pulse, signal shimmer, and controlled title/event reveal.
- sound decision: explicit silent proof or rights-cleared audio cue with timing notes.

## 5. Required Asset Categories

- character assets: film-ready Mikage presence plates, not only helmet/mask close-ups.
- environment/world assets: void, chamber, floor, depth, architecture, or system-space plates.
- event/system assets: signal, interface, blade/detail, title, or activation plates.
- motion assets: shot-specific motion instructions, hold durations, transition rules, and no-drift constraints.
- audio assets: rights-cleared cue, silence decision, or placeholder timing spec.
- text/story assets: proof premise, 3-beat progression, title language, and end-state.
- QA assets: pass/fail checklist for source readiness, canon drift, mask-only failure, motion drift, and release blockers.

## 6. Asset Readiness Table

| category | required for first proof YES/NO | current status | evidence/path if known | next build action |
|---|---|---|---|---|
| canon identity refs | YES | EXISTS_AS_REFERENCE | `MIKAGE_ZENITH_CANON_V2.md`; `canon/MIKAGE_VISUAL_CONTRACT_V1.json`; `docs/mikage_character_visual_spec.md` | Keep as validation refs; do not treat as shot plates. |
| key visual / mask refs | YES | EXISTS_AS_REFERENCE | `film_proofs/MIKAGE_FILM_PROOF_01/source_pack_v1/comfyui_canon_candidates/SHOT_02_MIKAGE_PRESENCE__02_UNIFIED_KEY_VISUAL_V4_LOCKED__APPROVED_FOR_FILM_PROOF_SOURCE.png` | Retain as identity reference; human must decide if any mask/key visual can be support-only. |
| blade/detail refs | NO | EXISTS_AS_REFERENCE | `film_proofs/MIKAGE_FILM_PROOF_01/source_pack_v1/comfyui_canon_candidates/SHOT_03_TITLE_OR_ICONIC_HERO__03_ZENITH_BLADE_V2_LOCKED__APPROVED_FOR_FILM_PROOF_SOURCE.png` | Keep as event/detail candidate, not enough alone. |
| environment/world plate | YES | MISSING | FILM-01C found no selected environment/world establishing shot. | Build or select one environment plate before shotlist. |
| character presence plate | YES | MISSING | FILM-01C found selected presence is still helmet/mask close-up. | Build or select one body/silhouette/staged presence plate. |
| event/system plate | YES | NEEDS_HUMAN_REVIEW | Blade/detail exists as reference; system/event plate not proven film-ready. | Human select or define event plate role. |
| motion language spec | YES | MISSING | No current proof-level motion spec exists for the corrected asset set. | Create a no-render motion-language spec after source roles are chosen. |
| audio decision | YES | MISSING | FILM-00 and FILM-01 report no repo-local rights-cleared audio. | Decide silent proof or collect rights-cleared cue. |
| 3-beat proof premise | YES | MISSING | Current reports contain source-pack and validation findings, not a story beat. | Define one 3-beat premise after minimum assets are selected. |
| storyboard/animatic board | YES | MISSING | No storyboard-ready board exists. | Create text storyboard only after asset set is selected. |
| QA checklist | YES | EXISTS_AS_REFERENCE | `docs/handoff/FILM-01C_VALIDATE_FILM_SOURCE_PACK_NOT_MASK_ONLY_V1_REPORT.md`; `MIKAGE_PASS_FAIL_CHECKLIST.md` | Convert into film-proof go/no-go checklist before render/video tasks. |
| public/release package | NO | MISSING | Public deployment remains prohibited. | Do not create until proof passes private review. |

## 7. Exact Build Order

1. Freeze current FILM-01B pack as reference-only.
2. Create a human-facing candidate selection board for exactly three required plate roles.
3. Human selects or rejects candidates for environment, character presence, and event/system roles.
4. If a required role has no acceptable existing asset, define an asset creation request without rendering.
5. Create a minimum asset manifest that labels each selected item as reference, candidate, or film-ready with evidence.
6. Create a 15-25 second motion-proof beat map only after the minimum manifest passes.
7. Create a no-render motion language and QA checklist.
8. Only then create a FILM-02 shotlist or motion-proof plan.

## 8. First Viable Target After Blueprint

20s 3-plate silent motion proof readiness pack

This is not a film, not a render, and not a video task. It is a readiness pack containing one selected environment plate, one selected character presence plate, one selected event/system plate, a silent/audio decision, and a go/no-go checklist.

## 9. Next 7 Concrete Tasks

1. FILM-RESET-02_CREATE_HUMAN_SELECTION_BOARD_FOR_REQUIRED_FILM_PLATES_V1
2. FILM-RESET-03_HUMAN_SELECT_OR_REJECT_ENVIRONMENT_CHARACTER_EVENT_PLATES_V1
3. FILM-RESET-04_CREATE_MINIMUM_FILM_ASSET_MANIFEST_FROM_HUMAN_SELECTION_V1
4. FILM-RESET-05_DEFINE_MISSING_ASSET_REQUESTS_NO_RENDER_V1
5. FILM-RESET-06_CREATE_20S_3_PLATE_MOTION_PROOF_BEAT_MAP_NO_RENDER_V1
6. FILM-RESET-07_CREATE_FILM_PROOF_GO_NO_GO_QA_CHECKLIST_V1
7. FILM-RESET-08_AUTHORIZE_OR_BLOCK_FILM_02_FROM_MINIMUM_ASSET_SET_V1

## 10. Role Split

- User: makes final human selection for plate candidates and approves whether missing assets should be created later.
- ChatGPT: reviews GitHub handoff files, issues next scoped tasks, and prevents drift back into mask-only or render-first routes.
- Codex: inspects repo/local files, writes manifests, reports, blueprints, checklists, and commits/pushes documentation changes.
- Gemini: may critique visual/story candidates from provided references if asked, but must not be treated as approving canon or creating assets.

## 11. Anti-Drift Rules

- No mask-only pseudo-film.
- No immediate FILM-02.
- No render/video before the minimum asset set exists.
- No calling candidates approved without evidence.
- No using locked key visuals as a film-ready shot library by default.
- No promoting failed or review-only full-body/environment attempts into film-ready assets.
- No ComfyUI runtime, Blender, image generation, video generation, public deployment, canon approval, or asset lock in reset tasks.

## 12. Go / No-Go Checklist

GO only if all are YES:

- ENVIRONMENT_WORLD_PLATE_SELECTED: YES
- CHARACTER_PRESENCE_BEYOND_MASK_SELECTED: YES
- EVENT_OR_SYSTEM_PLATE_SELECTED: YES
- EACH_PLATE_HAS_STATUS_AND_EVIDENCE: YES
- MASK_ONLY_FAILURE_AVOIDED: YES
- AUDIO_OR_SILENCE_DECISION_MADE: YES
- MOTION_LIMITS_DEFINED: YES
- QA_CHECKLIST_EXISTS: YES
- HUMAN_SELECTION_RECORDED: YES

NO-GO if any are true:

- selected set is only mask/key visual/blade stills
- no environment/world plate exists
- no character body/silhouette/staged presence exists
- audio decision is absent
- candidates are called approved without evidence
- any task requires render, video generation, ComfyUI runtime, Blender, canon approval, asset lock, or public deploy before the minimum asset set exists

## 13. Final Recommendation

Do not proceed to FILM-02. Reset the film lane around a minimum asset-readiness gate. The next safe task is to create a human selection board for required film plates so the user can choose or reject environment, character presence, and event/system candidates before any shotlist or motion plan is built.

NEXT_SAFE_TASK: FILM-RESET-02_CREATE_HUMAN_SELECTION_BOARD_FOR_REQUIRED_FILM_PLATES_V1
