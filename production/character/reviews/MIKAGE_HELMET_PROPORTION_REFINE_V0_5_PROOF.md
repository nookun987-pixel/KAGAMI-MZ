# MIKAGE HELMET PROPORTION REFINE V0.5 — CANDIDATE PROOF

- Task: `MIKAGE_HELMET_PROPORTION_REFINE_V0_5`
- Governance: `AGENTS.md` controlled exception #21
- Timestamp: `2026-06-30T23:58:14+07:00`
- Source: `production/character/production_actor/rig_derivatives/MIKAGE_HELMET_REBUILD_FROM_BLOCKING_V0_4.blend`
- Source SHA-256: `B9FD428B23342AABB0450D2EC98EC3B3AAA4C7290F2EF06F82B3BA67C92DDA7A`
- Output: `production/character/production_actor/rig_derivatives/MIKAGE_HELMET_PROPORTION_REFINE_V0_5.blend`
- Output SHA-256: `AEBAD77205FA86B7F5B1000802F6EBCBE74282C4024448ADC1A1A6DBBF326FC1`
- Contact sheet SHA-256: `68F27B6275985905BD9D06574DBF01315DA317A2273BEE3C586F520A4D20FB87`
- Starting commit: `84b2c0c 3d: helmet rebuild V0.4 evidence + Lane B driftcheck PASS`

## Executed helmet-only refinement

- Increased helmet presence while retaining the existing neck seat: width `+13.3265%`, depth `+13.7975%`, height `+15.4524%`.
- Widened the upper mass while keeping the lower jaw narrow.
- Replaced the flat crown read with a shallow crown arc; no egg profile.
- Softened the crown-to-temple and temple-to-jaw transitions while retaining a broad, controlled front face-plane.
- Reduced the box/mechanical read by applying the required fallback correction in the order `crown -> temple -> jaw` after the first visual inspection.
- Rebuilt the two slit recess openings as thin, shallow recesses; exactly two existing violet slit objects remain visible.
- Kept the jaw seated on the existing neck: helmet bottom `Z=3.500000`, neck top `Z=3.525000`.
- No final subdivision, lookdev, material assignment change, rigging, lock, commit, or push.

## Geometry evidence

- `BODY_HASH_BEFORE = 8ECC4390491674A56800F51B19ECBE2E74143659D3572F334B5BFDCB2D9D70B3`
- `BODY_HASH_AFTER = AEB4C14F4F6128286026BC3D8079A85EE19D4C64D025BE00EEE61C7FF8D1BEB2`
- `HELMET_HASH_BEFORE = 1AB765BEDEEC8060F8E81FD79E45A3160EE7CA42E7855A555A427A3E57EA1C94`
- `HELMET_HASH_AFTER = CFB299D8EA3910AC3B114EB0FD0C024E8DC662B4302825E71D3D7F0B72994373`
- `NON_HELMET_MESH_HASH_BEFORE = E4F2DDE40F734CD474BC5B2B5B71A317EE4212D83A4084AACFC616F4BF75F2D0`
- `NON_HELMET_MESH_HASH_AFTER = E4F2DDE40F734CD474BC5B2B5B71A317EE4212D83A4084AACFC616F4BF75F2D0`
- `CAMERA_STATE_HASH_BEFORE = 728C66AAFAFDC4C834EC9ECD924E8C97510C38D3CCE9D96A9842D4E6A99E9882`
- `CAMERA_STATE_HASH_AFTER = 728C66AAFAFDC4C834EC9ECD924E8C97510C38D3CCE9D96A9842D4E6A99E9882`
- Dimensions before: `(0.713589, 0.548936, 0.800000)`
- Dimensions after/reopened: `(0.808685, 0.624676, 0.923619)`
- Helmet topology after/reopened: `138 vertices / 125 polygons`
- Mesh datablock count after/reopened: `101`
- Helmet material after/reopened: `HERO_FINISH_glazed_sacred_porcelain` (unchanged assignment)
- Subsurf after/reopened: `False`
- Visible slit objects after/reopened: `2`

`BODY_HASH_AFTER` changes only because the approved helmet mesh changes. The dedicated non-helmet aggregate hash is byte-identical, proving robe, neck, halo, blade, and all other mesh datablocks were preserved. Camera state is also byte-identical.

## Review evidence

- Contact sheet dimensions: `2880 x 1920`.
- Top row: V0.5 front, strict side, three-quarter, and slit-recess close view.
- Bottom row: V0.4 baseline plus V0.5 no-slit/unlit front, three-quarter, and side silhouettes.
- The actual saved PNG was opened and visually inspected after rendering.
- No-slit silhouette remains readable without relying on violet, materials, or lighting.
- Candidate judgment: the helmet reads broader, less box-like, and less mechanically chamfered than V0.4 while preserving the faceless two-slit identity.
- Final visual approval remains with the operator.

## Validation

- Saved V0.5 `.blend` reopened successfully in Blender `5.1.2`.
- Reopened hashes match the post-edit hashes above.
- Non-helmet mesh hash: unchanged.
- Camera hash: unchanged.
- Robe / neck / halo / blade / body: preserved through the unchanged non-helmet aggregate hash.
- `.blend1` count after cleanup: `0`.
- Output status: candidate only; no asset/canon/public-render-ready lock.

## RESULT

```text
TASK = MIKAGE_HELMET_PROPORTION_REFINE_V0_5
BASE_SELECTED = production/character/production_actor/rig_derivatives/MIKAGE_HELMET_REBUILD_FROM_BLOCKING_V0_4.blend
OUTPUT_STATUS = CANDIDATE
PASS_FAIL = PASS
BLOCKER = NONE
HELMET_SCOPE_DRIFT = NO
NO_SLIT_SILHOUETTE = PASS
NON_HELMET_HASH_PRESERVED = PASS
CAMERA_HASH_PRESERVED = PASS
MATERIAL_ASSIGNMENT_PRESERVED = PASS
SUBDIV_FINAL = NO
LOOKDEV = NO
LOCK = NO
COMMIT = NO
PUSH = NO
```
