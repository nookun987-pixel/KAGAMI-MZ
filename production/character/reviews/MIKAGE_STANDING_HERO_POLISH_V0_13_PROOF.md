# MIKAGE STANDING HERO POLISH V0.13 — Proof

## Governance

- TASK_ID: `MIKAGE_STANDING_HERO_POLISH_V0_13`
- AUTHORIZATION: `AGENTS.md` controlled exception #30; handoff dispatch #21; `.mikage/tasks/active_task.yaml`
- SOURCE_COMMIT: `fdb8de2 ledger: V0.12 PASS + V0.13 hero polish stage`
- OUTPUT_STATUS: CANDIDATE / NOT CANON-LOCKED
- CANON_LOCK: NO
- ASSET_LOCK: NO
- PUBLIC_READY_CLAIM: NO
- COMMIT: NO
- PUSH: NO

## Sources and outputs

- BASE_SELECTED: `production/character/production_actor/rig_derivatives/MIKAGE_STANDING_CHARACTER_CANDIDATE_V0_12.blend`
- BASE_SHA256: `81D47C8AB587AECCCED07FD24394D4FFC0D08460CE7C6342E525B261D37B93A7`
- MASTER_REFERENCE_SHA256: `B86F6817CBC4F7D6A861B8E9F111F78096CA173F5BF5C5966A378069C0E06429`
- OUTPUT_BLEND_SHA256: `5E09F536C3A57B7A23265F72DDCD58A160EC3F74B7008375E8F28EF920556B89`
- HERO_SHA256: `D89F841460D81C6C3BD6BB899489ACDEA4F40A4B722EC853A2296967EDFE0B6B`
- CONTACT_SHEET_SHA256: `6E2B7D72CFA41679459D1DA8D6F6947A204B0E30369764026802124574B4C9E5`
- HERO_DIMENSIONS: `1440 x 1800`
- CONTACT_SHEET_DIMENSIONS: `2700 x 1245`

## Locked-state evidence

- BODY_HASH_BEFORE: `F0AF5DE49FA678C51983A469CCC29AB0906811475CEFDCA85C7EE3CDB102E18A`
- BODY_HASH_AFTER: `F0AF5DE49FA678C51983A469CCC29AB0906811475CEFDCA85C7EE3CDB102E18A`
- BODY_HASH_UNCHANGED: YES
- MESH_STATE_HASH_BEFORE: `36864DA2229BBA73E8DC8F32628B7ED9FF4F2A84116E0AD41CE11770D8D5F47A`
- MESH_STATE_HASH_AFTER: `36864DA2229BBA73E8DC8F32628B7ED9FF4F2A84116E0AD41CE11770D8D5F47A`
- MESH_STATE_HASH_UNCHANGED: YES
- ALL_MATERIAL_HASH_BEFORE: `72895C809F6673115704B66D1BD6BD311B48EB668ADB5AB0B4D55E805CAE3387`
- ALL_MATERIAL_HASH_AFTER: `72895C809F6673115704B66D1BD6BD311B48EB668ADB5AB0B4D55E805CAE3387`
- ALL_MATERIAL_HASHES_UNCHANGED: YES
- OBJECT_TRANSFORM_HASH_BEFORE: `3BF76C1B7E58E0AEC0190CF4C6C851F0ABA5CA556F9380C2144858085F180B34`
- OBJECT_TRANSFORM_HASH_AFTER: `3BF76C1B7E58E0AEC0190CF4C6C851F0ABA5CA556F9380C2144858085F180B34`
- OBJECT_TRANSFORMS_UNCHANGED: YES (all non-camera/light objects, including blade)
- DERIVATIVE_REOPEN: PASS

## Camera and lighting polish

- Hero camera: orthographic full-body three-quarter at `(4.75, -6.0, 2.62)`, `ortho_scale 5.05`; the blade was not moved.
- Key: directional upper-left neutral Rembrandt area, energy `1540`, size `2.65`.
- Rim: restrained cold Z-Blue-family silhouette area, energy `455`, size `3.0`; edge separation only, not fill.
- Existing non-task lights were disabled for rendering. No world, material, mesh, or non-camera/light transform was changed.
- Deterministic fine monochrome grain was applied to the delivered PNGs without reshaping or recoloring the asset.

## Visual inspection

- Full body remains visible from helmet crown/halo through cloak hem.
- Compared with the base render, the cloak edge separates more clearly from the void and the key has a deeper shadow side.
- The new three-quarter composition brings the blade alongside the shoulder and into the character's vertical silhouette flow.
- Faceless porcelain helmet, graphite cloak, white halo, cold blade, and exactly two violet slits remain intact.
- No warm lighting, neon, ambient violet, color wash, typography poster, or publicity-ready claim was introduced.
- Final visual ruling belongs to the operator.

## RESULT

RESULT = PASS
TASK_ID = MIKAGE_STANDING_HERO_POLISH_V0_13
PASS_FAIL = PASS
BLOCKER = NONE
HERO_POLISH_DRIFT = NO
BODY_HASH_UNCHANGED = YES
MESH_STATE_HASH_UNCHANGED = YES
ALL_MATERIAL_HASHES_UNCHANGED = YES
OBJECT_TRANSFORMS_UNCHANGED = YES
FULL_BODY_FRAMING = PASS
BODY_VOID_SEPARATION = PASS
KEY_DEPTH = PASS
BLADE_COMPOSITION = PASS
SINGLE_KEY_VOID_MOOD = PASS
VIOLET_ONLY_TWO_SLITS = PASS
OUTPUT_STATUS = CANDIDATE
CANON_LOCK = NO
ASSET_LOCK = NO
COMMIT = NO
PUSH = NO
NEXT_SAFE_TASK = Lane B drift-check and operator visual ruling on the V0.13 hero polish candidate
