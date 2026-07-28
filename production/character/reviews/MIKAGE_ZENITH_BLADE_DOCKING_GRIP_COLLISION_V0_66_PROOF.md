# Zenith Blade V0.66 — Docking/Grip/Collision Validation

## Result

```text
V0.66_VALIDATION: FAIL_FOR_SECONDARY_GRIP
PRIMARY_DOCKING_LOAD_PATH: CONFIRMED
CLOAK_LEFT_RIGHT_NOVEL_COLLISIONS: 0
SECONDARY_HAND_GRIP: FAIL
TORSO_TWIST_CLEARANCE: PARTIAL
SOURCE_V0.65_UNCHANGED: PASS
```

The docking-based architecture substantially improves the collision result,
but the actor arm currently has no secondary grip solver.

## Independent marker/handle delta

| Pose | World delta (m) |
|---|---:|
| neutral | ~0.00000002 |
| hand hold | ~0.00000009 |
| torso left | 0.16466744 |
| torso right | 0.16466744 |
| wide stance | ~0.00000002 |
| crouch | ~0.00000002 |
| shoulder/elbow limit | 0.15855726 |
| cloak left | ~0.00000002 |
| cloak right | ~0.00000002 |

## Novel overlaps relative to neutral

| Pose | Novel object-pair overlaps |
|---|---:|
| hand hold | 0 |
| torso left | 2 |
| torso right | 5 |
| wide stance | 0 |
| crouch | 0 |
| shoulder/elbow limit | 0 |
| cloak left | 0 |
| cloak right | 0 |

Compared with V0.63, cloak-left/right improve from `1/5` novel overlaps to
`0/0`, and torso left/right improve from `13/7` to `2/5`.

## Ruling

The Blade should remain docking-owned. The next bounded candidate should add
a secondary arm/hand IK target that follows the registered handle. It must
move the actor arm to the grip, not move the Blade to the hand.

No geometry, material or phase repair is justified by this result.

- Source:
  `production/character/production_actor/rig_derivatives/MIKAGE_ZENITH_BLADE_DOCKING_LOAD_PATH_V0_65.blend`
- Machine report:
  `production/character/reviews/MIKAGE_ZENITH_BLADE_DOCKING_GRIP_COLLISION_V0_66_REPORT.json`
