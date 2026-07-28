# Zenith Blade V0.61 — Pose / Deformation Clearance Proof

## Result

```text
MILESTONE: ZENITH_BLADE_POSE_DEFORMATION_CLEARANCE_V0_61
VALIDATION_RESULT: FAIL
STATUS: HOLD_FOR_BOUNDED_REPAIR_RULING

SOURCE_PRESERVATION: PASS
READ_ONLY_EXECUTION: PASS
POSE_RESET: PASS
HANDLE_MARKER_DELTA: PASS
POSE_DEFORMATION_COVERAGE: FAIL
CLOAK_SPREAD_COVERAGE: FAIL
COLLISION_CLEARANCE: FAIL

INTEGRATION_READY: NO
ASSET_LOCK: NO
PRODUCTION_READY: NO
```

## Scope and source

- Source: `production/character/production_actor/rig_derivatives/MIKAGE_ZENITH_BLADE_NATIVE_ACTOR_INTEGRATION_V0_60.blend`
- Source SHA-256 before and after:
  `4B28DAD02A879FD9956E3D5F1B6BFB7B24BD2BD48B548A47847A1ABED454425E`
- The source was opened and evaluated in Blender 5.1.2 without saving.
- Blade geometry/material, actor meshes, rig structure, attachment root, and phase mechanism were not edited.
- All pose-bone `matrix_basis` values were restored after the audit.

## Pose and phase coverage attempted

The audit applied these read-only pose samples:

1. neutral
2. hand hold
3. torso twist left
4. torso twist right
5. wide stance
6. light crouch
7. shoulder/elbow limit

Each sample was machine-checked at P1/frame 1, P2/frame 31, and P3/frame 61.

## Findings

### 1. Pose/deformation coverage failed

All seven rendered pose samples are visually identical. The measured hand-to-handle
distance also remained exactly `1.76015645 m`, with maximum drift `0.0 m`.

This does **not** prove stable registration. It proves that the available actor
blockout did not produce observable evaluated mesh deformation from the pose-bone
samples. Therefore hand, wrist, shoulder, torso, and leg clearance under deformation
remain unvalidated.

The handle-marker delta stayed `[0, 0, 0]`, but that marker and the Blade attachment
remaining static is not equivalent to following a deforming hand.

### 2. Cloak-spread coverage failed

- Cloak object detected: `PUBLIC_BLOCK_cloak_vertical_black_mass`
- Rig bound: `false`
- Cloak-spread control available: `false`

No valid read-only cloak-spread pose could be produced. Cloak clearance outside the
static V0.60 state remains unvalidated.

### 3. Collision clearance failed

BVH overlap existed already at neutral and repeated unchanged in every attempted pose:

| Phase | Collision object-pair records per pose |
|---|---:|
| P1 | 9 |
| P2 | 9 |
| P3 | 11 |

Representative exact object pairs:

- `ZB45_SHELL_UR` ↔ `A2_right_porcelain_mitten_hand_attached_read`
- `ZB45_SHELL_UR` ↔ `A2_right_continuous_black_upper_arm_attached_plane`
- `ZB45_SHELL_UR` ↔ `A2_right_shoulder_to_arm_continuity_graphite_bridge`
- `ZB46_DRIVE_HUB` ↔ `A2_right_continuous_black_upper_arm_attached_plane`
- `ZB46_HUB_SHOULDER_R` ↔ `A2_right_shoulder_to_arm_continuity_graphite_bridge`
- `ZB46_RECESSED_RAIL_R` ↔ `A2_right_graphite_wrist_to_body_contact_shadow`
- P3 additionally: `ZB45_SHELL_UL` ↔
  `PUBLIC_BLOCK_V03_right_upper_sleeve_clean_vertical`

These overlaps are not repaired in this gate. The intended hand/handle contact was
excluded from collision targets, but the listed shell, rail, hub, arm, sleeve, and
wrist overlaps remain blockers.

## Evidence

- Machine report:
  `production/character/reviews/MIKAGE_ZENITH_BLADE_POSE_CLEARANCE_V0_61_REPORT.json`
- Visual sheet:
  `production/character/reviews/MIKAGE_ZENITH_BLADE_POSE_CLEARANCE_V0_61_CONTACT_SHEET.png`
- Evidence source: Blender 5.1.2 evaluated dependency graph, BVH overlap checks,
  source hash comparison, and direct inspection of the rendered contact sheet.

## Ruling boundary and next safe action

V0.61 cannot authorize `INTEGRATION_READY`.

The next safe action is an operator-authorized bounded repair/coverage gate that:

1. makes the actor's intended deforming meshes respond to the existing rig controls;
2. makes the Blade attachment intent follow the approved right-hand control while
   preserving the accepted V0.60 neutral transform;
3. provides a valid cloak-spread control or an operator-approved deterministic
   clearance proxy;
4. resolves only the exact collision pairs recorded above;
5. reruns the same seven poses across P1/P2/P3.

No Blade form redesign, actor mesh redesign, material change, or phase-mechanism
change is authorized by this report.

