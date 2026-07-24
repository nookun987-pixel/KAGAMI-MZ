# ZENITH BLADE CONTROLLED GEOMETRY FINISH V0.21 — PROOF

TASK_ID: `ZENITH_BLADE_CONTROLLED_GEOMETRY_FINISH_V0_21`  
TASK_RESULT: `PASS_FOR_OPERATOR_VISUAL_REVIEW`  
OUTPUT_STATUS: `REVIEW_CANDIDATE_ONLY`  
ASSET_LOCK: `NO`  
PRODUCTION_READY: `NO`  
PUSH_DONE: `NO`

## Source protection

- Source:
  `production/character/MIKAGE_ZENITH_BLADE_HERO_READ_REFINEMENT_V0_20.blend`
- SHA-256 before/after:
  `56660B2661FEA3AD965F30FF67F5B5AAB1304A483DA22C1BFAF356294E207DED`
- Size before/after: `378665` bytes
- Source mutation: `NO`

## Outputs

- Blend:
  `production/character/MIKAGE_ZENITH_BLADE_CONTROLLED_GEOMETRY_FINISH_V0_21.blend`
  - SHA-256:
    `531B4A6A42A07FDF79A8AD54F0EE1933F2A2C93D85AABDB4C054E38FFFE3BC0E`
- Contact sheet:
  `production/character/reviews/MIKAGE_ZENITH_BLADE_CONTROLLED_GEOMETRY_FINISH_V0_21_CONTACT_SHEET.png`
  - SHA-256:
    `456246560076997FDEADA6424C7C95268BC5178845F2AA6628433AA916050804`
  - Exact dimensions: `3600 x 1800`
- Clean crop:
  `production/character/reviews/MIKAGE_ZENITH_BLADE_CONTROLLED_GEOMETRY_FINISH_V0_21_REVIEW_CROP.png`
  - SHA-256:
    `21CFE0B8BEA0A4445ACA6B380A9C4250359428E474FDDDBE47C587EE5ED965CC`
  - Exact dimensions: `1800 x 1800`
  - Labels/overlay: `NONE`

## Controlled correction rounds

### Round 1 — baseline and protected snapshot

- Opened V0.20 read-only.
- Recorded transforms, dimensions, mesh counts, parent relationships and
  settled phase samples at frames `1`, `24`, `31`, `54`, `61`, and `90`.
- Result: baseline captured; no source mutation.

### Round 2 — first controlled chamfer pass

- Added non-destructive angle-limited bevel modifiers to the four shell objects
  and thirteen existing spine/rail/joint/guard/docking objects.
- Shell width: `0.0065`, three segments.
- Functional load-path widths: capped at `0.0042`, two segments; narrow rails
  use `0.0026691`.
- Visual result: load path and joints read less like raw stacked primitives.
- Issue found: review panels occupied only half the required vertical canvas;
  P3 core appeared in guard/dock detail views.

### Round 3 — review correction and shell edge continuity

- Corrected all six panels to use the full `600 x 1800` panel area.
- Moved upper/lower detail evidence to P2 so the Blade core is off.
- Increased the four corresponding shell chamfers uniformly to `0.009`, three
  segments, improving edge continuity and three-quarter plane readability.
- Result: retained as the final candidate.

### Round 4 — shallow shell-face inset experiment

- Tested a shallow front-face inset within the existing shell AABB.
- Direct render inspection showed broken highlights and a detached-fragment read
  at the P1 plate seams.
- Result: `REJECTED AND FULLY ROLLED BACK`.
- The final blend contains no V0.21 shell inset and retains V0.20 base topology.

## Final implementation changes

- Objects receiving `ZB21_CONTROLLED_CHAMFER`:
  - Four `ZB13_*_SHELL` objects.
  - `ZB15_CENTRAL_LOAD_SPINE`.
  - `ZB15_RECESSED_RAIL_L/R`.
  - `ZB15_UPPER_JOINT_COLLAR` and `ZB15_LOWER_JOINT_COLLAR`.
  - `ZB15_GUARD_LOAD_BRIDGE` and `ZB15_DOCKING_LOAD_TONGUE`.
  - `ZB16_GUARD_CLAMP_L/R`, `ZB16_GUARD_CROSSPIN`.
  - `ZB16_DOCK_CRADLE_L/R`, `ZB16_DOCK_BASE_PAD`.
- Shell modifier: width `0.009`, three segments, angle-limited.
- Functional objects: width up to `0.0042`, two segments, angle-limited.
- Base mesh topology changed: `NO`.
- New decorative geometry: `NO`.
- Round-4 inset present in final asset: `NO`.

## Protected-value and AABB QA

- Protected transforms: `MATCH`
- Settled phase samples: `MATCH`
- Object dimensions: `MATCH`
- Parent relationships: `MATCH`
- Base topology and mesh datablocks: `MATCH`
- Evaluated AABBs at frames `1`, `31`, and `61`: `WITHIN V0.20 ENVELOPE`
- Non-Blade scene snapshot: `MATCH`
- Rider/steed/rig/animation change: `NONE`
- Frame range: `1–90`, unchanged
- Reopen QA: `PASS`
- Evidence:
  - `_tmp/mikage_zenith_blade_geometry_finish_v0_21_gate/round1_protected_before.json`
  - `_tmp/mikage_zenith_blade_geometry_finish_v0_21_gate/round2_protected_after.json`
  - `_tmp/mikage_zenith_blade_geometry_finish_v0_21_gate/round2_changes.json`
  - `_tmp/mikage_zenith_blade_geometry_finish_v0_21_gate/reopen_qa.json`

## Phase and color QA

- P1 closed shared outer silhouette: `PASS`
- P2 symmetric industrial split: `PASS`
- P3 symmetric wider split: `PASS`
- P1/P2 Blade violet off: `PASS`
- P3 single existing central core: `PASS`
- Additional core/emission: `NONE`
- Red/crimson: `NOT OBSERVED`
- Violet fill/wash/ambient/halo/seam lighting: `NOT OBSERVED`

## Direct visual inspection

The actual final contact sheet and clean crop were opened and inspected.

- Full Blade visible in P1 front, P1 three-quarter, P2 and P3: `PASS`
- Shell bevel/chamfer continuity: `PASS`
- Load-path spine/rail separation: `PASS`
- Upper guard joint readability: `PASS`
- Lower docking joint readability: `PASS`
- Silhouette-critical crop: `NONE`
- Fantasy ornament or thin sword drift: `NOT OBSERVED`
- Final visual approval remains with the operator.

## Filesystem and scope

- V0.21 `.blend1` after cleanup: `0`
- V0.20 or earlier asset modified: `NO`
- Film/SSOT/audio modified: `NO`
- Push/deploy/release/website action: `NO`
- Files changed: only the whitelisted V0.21 blend, contact sheet, clean crop and
  proof. Build/snapshot/render/QA evidence remains in the ignored whitelisted
  V0.21 gate directory.

## Commands/evidence summary

- Git baseline/status/branch/log checks.
- Source SHA-256/size/time checks before and after.
- Blender 5.1 background build and four correction-round render runs.
- Direct visual inspection after rounds 2, 3 and 4.
- Pillow contact-sheet/crop composition and exact-dimension checks.
- Blender background reopen and modifier/AABB/non-Blade regression QA.
- Exact-target `.blend1` validation and removal.
- Git scope audit and local commit.

## Result

- PASS/FAIL: `PASS_FOR_OPERATOR_VISUAL_REVIEW`
- Blocker: `NONE`
- Candidate commit status/hash:
  `COMMITTED — 39fed4e blade: finish controlled Zenith Blade geometry V0.21`
- Proof-finalization commit: recorded by the following local documentation
  commit so this report can name the immutable candidate commit.
- Push status: `NOT PUSHED`
- Next safe action: operator reviews the final V0.21 contact sheet and clean
  crop and rules whether this controlled geometry finish should be accepted or
  receive one narrowly scoped correction.
