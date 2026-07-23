# ZENITH BLADE V0.15 — AUTHORITY PROMOTION PROPOSAL

STATUS: `OPERATOR_VISUAL_APPROVAL_RECORDED_AWAITING_SSOT_PROMOTION`
SOURCE_ASSET: `MIKAGE_ZENITH_BLADE_SHELL_COHESION_V0_15`
SOURCE_ASSET_STATUS: `CANDIDATE_ONLY`
SSOT_EDITED: `NO`
CANON_CONTROL_MAP_EDITED: `NO`
CANON_LOCK: `NO`
ASSET_LOCK: `NO`
PRODUCTION_READY: `NO`
PUSH_DONE: `NO`

## Operator visual ruling — 2026-07-24

The operator accepted the recommended V0.15 direction and instructed the agent
to continue autonomously.

```text
DETAILED_PANEL_VISUAL_APPROVAL: YES
V0_15_SHELL_FORM: OPERATOR_VISUALLY_APPROVED
SHELL_COHESION_OBJECTIVE: PASS
P1_CLOSED_SHELL_FORM: APPROVED
P2_INDUSTRIAL_SPLIT_FORM: APPROVED
P3_OVERDRIVE_SPLIT_FORM: APPROVED
P3_SINGLE_VIOLET_CORE: APPROVED
GRIP_HOLSTER_BASELINE_REGISTRATION: APPROVED_AT_VISUAL_LEVEL

OUTPUT_STATUS: CANDIDATE_ONLY
CANON_LOCK: NO
ASSET_LOCK: NO
PRODUCTION_READY: NO
PUSH_DONE: NO
```

This visual ruling does not select an SSOT destination and does not authorize
an agent to edit an SSOT. Rules 1–8 below remain a promotion proposal until the
operator hand-writes the accepted subset into an SSOT with a changelog entry.

## Purpose

This packet separates the V0.15 design decisions that may be suitable for
operator promotion from Blender-specific implementation details that should
remain outside canon.

It does not itself promote, lock, or supersede any SSOT.

## Verified evidence

- V0.15 blend SHA-256:
  `3AE75210C78B3DEFAA64B7E41CD0FBF5D39ACADA325E5B201995905226D82BB1`
- Source V0.14 SHA-256 remains:
  `78F9481809AB5465D264A48A4CE9A2C396BCBBF5FE7D3D4242145812DF1F0C07`
- Reopened phase boundaries:
  - frames 1 and 30: P1, closed, Blade violet off;
  - frames 31 and 60: P2, split, Blade violet off;
  - frame 61: P3, wider split, exactly one violet core.
- Protected pre-existing scene digest matched across `344 / 344` objects.
- Contact sheet is `6400 x 1800`, with eight required review panels.
- Local repository was clean on `main` at commit `d7527bd`.
- No push was performed by this task. The local `origin/main` tracking ref was
  behind local HEAD; no external fetch was performed.

## Visual ruling supported by the evidence

The following ruling is technically and visually supported for operator use:

```text
SHELL_COHESION_OBJECTIVE: PASS
P1_CLOSED_SHELL_FORM: APPROVE
P2_INDUSTRIAL_SPLIT_FORM: APPROVE
P3_OVERDRIVE_SPLIT_FORM: APPROVE
P3_SINGLE_VIOLET_CORE: APPROVE
GRIP_HOLSTER_BASELINE_REGISTRATION: APPROVE_AT_VISUAL_LEVEL

GRIP_GUARD_LOAD_PATH_FINAL_DETAIL: PENDING_PRODUCTION_REFINEMENT
HOLSTER_DOCKING_LOAD_PATH_FINAL_DETAIL: PENDING_PRODUCTION_REFINEMENT

OUTPUT_STATUS: CANDIDATE_ONLY
CANON_LOCK: NO
ASSET_LOCK: NO
PRODUCTION_READY: NO
```

The operator has now explicitly adopted
`DETAILED_PANEL_VISUAL_APPROVAL: YES`. Evidence and operator ruling remain
separate from canon promotion and asset lock.

## Candidate rules suitable for operator promotion

These are design-level rules, not numeric Blender instructions:

1. Zenith Blade uses four mechanically related outer shell plates: upper/lower
   on the left and upper/lower on the right.
2. In P1 the four plates close into one continuous full-size outer-shell
   silhouette. Panel seams may remain visible, but the weapon must not read as
   four independent bars.
3. In P2 the shell divides laterally around a shared central load-bearing
   structure. The Blade has no violet emission in this phase.
4. In P3 the same mechanism opens farther and reveals exactly one central
   electric-violet weapon core.
5. The shell mechanism uses one dark central spine, paired recessed functional
   rails, and minimal upper/lower structural joints. These elements must read as
   load paths, not decoration.
6. The Blade remains vertically registered close to Mikage's hip, with the
   gauntlet gripping the handle and the lower holster/docking assembly carrying
   the base.
7. The weapon uses no red or crimson in any phase. Violet remains forbidden as
   fill, wash, ambient light, halo, secondary core, or decorative lighting.
8. Form language is monolithic and brutalist: shared contour, controlled
   chamfers, minimal functional segmentation, no wasted ornament.

Rules 3, 4, and 7 overlap existing phase/color SSOT and should be reconciled,
not duplicated with conflicting wording.

## Implementation details that must not become canon

Keep the following in asset documentation, rig documentation, or tests:

- exact lateral offsets `0.055` and `0.095`;
- keyframes `1/30/31/60/61`;
- Blender object and material names beginning with `ZB13_` or `ZB15_`;
- driver expressions and custom-property implementation;
- bevel widths, vertex topology, rail thickness, local transforms, emission
  strength, render exposure, camera coordinates, and contact-sheet resolution;
- file hashes, commit hashes, Blender version, and protected-object digest.

These values prove the candidate and reproduce the implementation. They are
not story, identity, or design authority.

## Recommended SSOT route

`docs/architecture/MIKAGE_CANON_CONTROL_MAP.md` currently does not list a
detailed Zenith Blade mechanics/material SSOT.

The operator should choose one of these routes:

1. Promote a dedicated Zenith Blade mechanics/form specification into the SSOT
   list, then hand-write the accepted rules and one dated changelog entry; or
2. Add only the approved high-level weapon-form rules to an existing appropriate
   SSOT and update the Canon Control Map description accordingly.

Do not treat `docs/handoff/MIKAGE_ZENITH_BLADE_SPEC_V1.md` as canon merely
because it self-declares a locked status. It requires explicit operator
promotion into the Canon Control Map.

The Cine Color Contract already authorizes violet only at a P3 weapon core.
That rule should remain owned by the color SSOT.

## Gates after operator action

An explicit operator visual approval would establish:

```text
V0_15_SHELL_FORM: OPERATOR_VISUALLY_APPROVED
OUTPUT_STATUS: CANDIDATE_ONLY
```

It would not automatically establish:

```text
CANON_LOCK: NO
ASSET_LOCK: NO
PRODUCTION_READY: NO
```

After operator SSOT promotion, the next safe production task is a bounded
surface/load-path refinement derived from V0.15:

- preserve the approved shell contour and phase behavior;
- improve guard and docking readability;
- develop authorized surface/material detail;
- perform collision and attachment testing;
- submit a separate final-render gate.

## Operator decision requested

```text
DETAILED_PANEL_VISUAL_APPROVAL: YES / NO
PROMOTE_RULES: [operator-selected rule numbers]
SSOT_DESTINATION: [operator-selected SSOT]
CANON_LOCK: separate later decision
ASSET_LOCK: separate later decision
```
