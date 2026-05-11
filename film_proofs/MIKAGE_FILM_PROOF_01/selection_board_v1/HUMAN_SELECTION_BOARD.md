# HUMAN_SELECTION_BOARD

## Task

Human selection board for `FILM-RESET-03_HUMAN_SELECT_OR_REJECT_ENVIRONMENT_CHARACTER_EVENT_PLATES_V1`.

Choose one decision for each required role:

- APPROVE
- REJECT
- NEED_NEW_ASSET

Do not approve any candidate as film-ready unless the candidate satisfies the role and its risk is acceptable for a private 20s 3-plate silent motion proof readiness pack.

## 1. ENVIRONMENT_WORLD_PLATE

Required purpose: establish world, chamber, void architecture, floor, depth, system-space, or physical context.

| candidate_id | original_path | copied_or_referenced_path | role_fit | status | risk | human_decision |
|---|---|---|---|---|---|---|
| ENV-REF-001 | `D:\workspace\ComfyUI\MIKAGE_CANON\08_CHARACTER_REVIEW_CANDIDATES\CINEMATIC_TESTS\BRUTALIST_VOID_THE_CONSEQUENCE_CHAMBER_V3_BALANCED_SUBJECT_ENV\MIKAGE_BRUTALIST_VOID_THE_CONSEQUENCE_CHAMBER_TEST_V3_BALANCED_SUBJECT_ENV.png` | referenced only | Attempted cinematic environment, but human review says it repeated helmet-only/close-up portrait failure and did not show chamber/floor/consequence. | REJECTED_DO_NOT_USE | High: failed human visual review; not an environment plate. | PENDING |
| ENV-MISSING-001 | `MISSING` | `MISSING` | Need one real environment/world plate with readable space, floor/depth or system-world context. | MISSING | Current repo/candidate set does not provide a usable film plate for this role. | PENDING |

Recommended human decision: `NEED_NEW_ASSET` unless the user identifies a different existing environment plate.

## 2. CHARACTER_PRESENCE_BEYOND_MASK_PLATE

Required purpose: show Mikage as a presence beyond mask-only through body, silhouette, staged posture, scale, or wider cinematic composition.

| candidate_id | original_path | copied_or_referenced_path | role_fit | status | risk | human_decision |
|---|---|---|---|---|---|---|
| CHAR-REF-001 | `D:\workspace\ComfyUI\MIKAGE_CANON\08_CHARACTER_REVIEW_CANDIDATES\FULL_BODY_FRONT_VIEW_ONE_SHOT_V2_ORIENTATION_CONTROL\MIKAGE_FULL_BODY_FRONT_VIEW_ONE_SHOT_V2_ORIENTATION_CONTROL_00001_.png` | referenced only | Full body is visible and useful for planning review. Existing review forbids video source, public-ready use, final full-body canon, and public hero use. | REFERENCE_ONLY | High: review candidate only; missing strict sensor slit; hands/detail artifacts; not film-ready. | PENDING |
| CHAR-REF-002 | `film_proofs/MIKAGE_FILM_PROOF_01/source_pack_v1/comfyui_canon_candidates/SHOT_02_MIKAGE_PRESENCE__02_UNIFIED_KEY_VISUAL_V4_LOCKED__APPROVED_FOR_FILM_PROOF_SOURCE.png` | existing repo reference | Strong Mikage identity key visual, but mask/helmet close-up only. It cannot satisfy the beyond-mask role by itself. | REFERENCE_ONLY | High: mask-only pseudo-film risk if approved for this role. | PENDING |
| CHAR-MISSING-001 | `MISSING` | `MISSING` | Need one film-appropriate body/silhouette/staged presence plate, not only a mask or helmet close-up. | MISSING | Current candidates do not satisfy role without violating review limitations. | PENDING |

Recommended human decision: `NEED_NEW_ASSET` unless the user intentionally accepts a review-only planning reference for a non-render readiness pack.

## 3. EVENT_SYSTEM_PLATE

Required purpose: communicate a change, activation, signal, weapon/detail event, title beat, interface anomaly, or system state.

| candidate_id | original_path | copied_or_referenced_path | role_fit | status | risk | human_decision |
|---|---|---|---|---|---|---|
| EVENT-CAND-001 | `film_proofs/MIKAGE_FILM_PROOF_01/source_pack_v1/comfyui_canon_candidates/SHOT_03_TITLE_OR_ICONIC_HERO__03_ZENITH_BLADE_V2_LOCKED__APPROVED_FOR_FILM_PROOF_SOURCE.png` | existing repo reference | Strong blade/detail insert candidate for event/title support. | CANDIDATE_REQUIRES_HUMAN_REVIEW | Medium: detail insert only; does not solve environment or character-presence roles. | PENDING |
| EVENT-CAND-002 | `D:\workspace\ComfyUI\MIKAGE_CANON\10_COMPONENT_CANDIDATE_SET_V1\06_HALO_ORBITAL_UI\MIKAGE_COMP_06C_ORBITAL_UI_LOW_CLUTTER_REVIEW_CANDIDATE.png` | referenced only | Low-clutter orbital UI/system visual candidate. | CANDIDATE_REQUIRES_HUMAN_REVIEW | Medium: component review candidate only; not canon-approved or asset-locked. | PENDING |
| EVENT-REF-003 | `film_proofs/MIKAGE_FILM_PROOF_01/source_pack_v1/comfyui_canon_candidates/SHOT_01_SIGNAL_VOID_OR_SYSTEM_WAKE__01_AUDIO_SHORT_VISUAL_CANON_V4_LOCKED__APPROVED_FOR_FILM_PROOF_SOURCE.png` | existing repo reference | Minimal opening/system-wake reference. | REFERENCE_ONLY | Medium: small mask in black void; can reintroduce mask-only pacing if overused. | PENDING |

Recommended human decision: choose one event/system candidate only after deciding whether the first proof needs blade/detail, UI/system activation, or minimal title wake.

## Human Output Needed

For each role, return:

- role
- selected candidate_id or `NEED_NEW_ASSET`
- decision: APPROVE / REJECT / NEED_NEW_ASSET
- reason
- any constraints

FILM-02 remains blocked until these three roles are resolved.
