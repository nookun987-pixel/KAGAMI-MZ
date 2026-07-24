# ZENITH BLADE STANDALONE ASSET V0.22 — PROOF

TASK_ID: `ZENITH_BLADE_STANDALONE_ASSET_V0_22`  
TASK_RESULT: `PASS_FOR_OPERATOR_VISUAL_REVIEW`  
OUTPUT_STATUS: `STANDALONE_REVIEW_CANDIDATE_ONLY`  
ASSET_LOCK: `NO`  
INTEGRATION_READY: `NO`  
PRODUCTION_READY: `NO`  
PUSH_DONE: `NO`

## Source protection

- Source:
  `production/character/MIKAGE_ZENITH_BLADE_CONTROLLED_GEOMETRY_FINISH_V0_21.blend`
- SHA-256 before/after:
  `531B4A6A42A07FDF79A8AD54F0EE1933F2A2C93D85AABDB4C054E38FFFE3BC0E`
- Source mutation: `NO`

## Outputs

- Standalone blend:
  `production/character/MIKAGE_ZENITH_BLADE_STANDALONE_ASSET_V0_22.blend`
  - SHA-256:
    `9D998E0D2A75C93E08CCF3D38B8B01FC5DD9A96F6EC394372C8A8066BD40D0B3`
- Contact sheet:
  `production/character/reviews/MIKAGE_ZENITH_BLADE_STANDALONE_ASSET_V0_22_CONTACT_SHEET.png`
  - SHA-256:
    `7B510843F7F57062C147A22119AADB24F70E8919CA4BA24EB799573A38B4CCB8`
  - Exact dimensions: `3600 x 2400`
- Clean review crop:
  `production/character/reviews/MIKAGE_ZENITH_BLADE_STANDALONE_ASSET_V0_22_REVIEW_CROP.png`
  - SHA-256:
    `8FD2735144E9FA4C44DB240B97DE53162D1131C8024A7E2FBA3EC7805F8C613C`
  - Exact dimensions: `1800 x 2400`
  - Labels/overlay: `NONE`

## Five controlled steps

1. Ownership extraction: copied only the weapon-owned shell, core, spine,
   rails, collars, drive hub and Flux-Pinning base connector.
2. Origin/phase assembly: parented all weapon components to one standalone root
   and applied one shared world translation.
3. Standalone presentation: added a clean void world, dedicated orthographic
   camera and cool key/fill/edge lights.
4. Multi-angle render inspection: opened the actual six-panel sheet and clean
   crop; no character/mount geometry or silhouette-critical crop was observed.
5. Reopen/package QA: exact ownership, origin, phase-relevant transforms,
   dimensions and output specs pass.

## Extracted object ownership

Weapon-owned objects:

- `ZB13_L_LOW_SHELL`
- `ZB13_L_UP_SHELL`
- `ZB13_R_LOW_SHELL`
- `ZB13_R_UP_SHELL`
- `ZB13_P3_SINGLE_VIOLET_CORE`
- `ZB15_CENTRAL_LOAD_SPINE`
- `ZB15_RECESSED_RAIL_L`
- `ZB15_RECESSED_RAIL_R`
- `ZB15_UPPER_JOINT_COLLAR`
- `ZB15_LOWER_JOINT_COLLAR`
- `ZB15_GUARD_LOAD_BRIDGE`
- `ZB15_DOCKING_LOAD_TONGUE`

Allowed standalone support:

- `ZB13_PHASE_CONTROL`
- `ZB22_STANDALONE_ROOT`
- `ZB22_STANDALONE_CAMERA`
- `ZB22_STANDALONE_KEY`
- `ZB22_STANDALONE_FILL`
- `ZB22_STANDALONE_EDGE`

Scene ownership matches this exact set: `PASS`.

## Explicit exclusions

- `ZB16_*` integration fixtures: `ABSENT`
- Rider/character geometry: `ABSENT`
- Steed/mount geometry: `ABSENT`
- Gauntlet/holster: `ABSENT`
- Character/mount rig: `ABSENT`
- Legacy Blade proxy: `ABSENT`
- Prior integration camera/light objects: `ABSENT`

The complete excluded source-object list is recorded in
`_tmp/mikage_zenith_blade_standalone_v0_22_gate/ownership_origin_evidence.json`.

## Origin and transform evidence

- Shared root translation:
  `[1.2424645, 0.50125, -1.6085858]`
- Settled visible P1 center after translation:
  `[0.0, 0.0, -0.0]`
- Individual component re-seating: `NONE`
- Phase-relevant pairwise offsets after removing the shared translation:
  `MATCH`
- Core-driver note:
  the core is hidden in P1/P2 and compared only when active at P3; its P3
  relative position matches V0.21.
- All weapon-owned objects parented to `ZB22_STANDALONE_ROOT`: `PASS`
- Frame range: `1–90`, unchanged

## Phase and color validation

- P1: closed monolithic shared contour, core off: `PASS`
- P2: symmetric industrial split, core off: `PASS`
- P3: wider split, exactly one central violet core: `PASS`
- Red/crimson: `NOT OBSERVED`
- Violet fill/wash/ambient/halo/seam emission: `NOT OBSERVED`
- Additional core or decorative emission: `NONE`

## Direct visual inspection

The actual final contact sheet and clean crop were opened and inspected.

- P1 front complete standalone Blade: `PASS`
- P1 side thickness read: `PASS`
- P1 three-quarter mass/chamfer read: `PASS`
- P2 full industrial split: `PASS`
- P3 single-core front: `PASS`
- P3 single-core three-quarter: `PASS`
- Character/mount geometry visible: `NO`
- Silhouette-critical cropping: `NONE`
- Thin sword/fantasy ornament drift: `NOT OBSERVED`
- Final visual approval remains with the operator.

## Reopen and filesystem QA

- Standalone blend reopened: `PASS`
- Exact scene ownership: `PASS`
- Forbidden-object scan: `PASS`
- P1 visible center at world origin: `PASS`
- Phase-relevant relative transform comparison: `PASS`
- Single core object: `PASS`
- `.blend1` after cleanup: `0`
- V0.21 or earlier source modified: `NO`
- Film/SSOT/audio/website modified: `NO`
- Push/deploy/release action: `NO`

Evidence:

- `_tmp/mikage_zenith_blade_standalone_v0_22_gate/ownership_origin_evidence.json`
- `_tmp/mikage_zenith_blade_standalone_v0_22_gate/reopen_qa.json`
- actual contact sheet and clean crop

## Commands and scope

- Git baseline/status/branch/log verification.
- V0.21 hash and metadata checks before/after.
- Blender background ownership extraction, shared-root assembly and Eevee
  standalone renders.
- Pillow exact contact-sheet/crop composition.
- Direct image inspection.
- Blender background reopen ownership/origin/phase QA.
- Exact-target `.blend1` validation and removal.
- Git whitelist audit and local commit.

Files changed are limited to the whitelisted standalone V0.22 blend, contact
sheet, clean crop and proof. Build/snapshot/render/QA evidence remains under the
ignored whitelisted V0.22 gate directory.

## Result

- PASS/FAIL: `PASS_FOR_OPERATOR_VISUAL_REVIEW`
- Blocker: `NONE`
- Candidate commit status/hash:
  `COMMITTED — 901f03f blade: create standalone Zenith Blade V0.22`
- Proof-finalization commit: recorded by the following local documentation
  commit so this report can name the immutable candidate commit.
- Push status: `NOT PUSHED`
- Next safe action: operator reviews the standalone V0.22 form independently
  and requests any weapon-only correction before a separate integration task.
