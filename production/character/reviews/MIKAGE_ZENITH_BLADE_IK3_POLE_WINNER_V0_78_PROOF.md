# Zenith Blade V0.78 — IK3 +X Pole Winner Candidate

## Result

```text
BUILD_AND_REOPEN: PASS
FULL_POSE_VALIDATION: FAIL
SWEEP_WINNER_REPRODUCED: PASS
ASSET_PROMOTION: NO
INTEGRATION_READY: NO
BEST_ACCEPTED_TECHNICAL_BASELINE: V0.65
```

V0.78 reproduces the V0.76 sweep winner while preserving docking ownership,
the independent hand marker and the V0.65 source.

## Grip registration

| Pose | Marker/handle delta (m) |
|---|---:|
| neutral | 0.00000014 |
| hand hold | 0.000000241 |
| torso left | 0.104167876 |
| torso right | 0.000022281 |
| wide stance | 0.00000014 |
| crouch | 0.00000014 |
| shoulder/elbow limit | 0.000001165 |
| cloak left | 0.00000014 |
| cloak right | 0.00000014 |

## Novel overlaps relative to neutral

| Pose | Novel object-pair overlaps |
|---|---:|
| hand hold | 0 |
| torso left | 3 |
| torso right | 1 |
| wide stance | 0 |
| crouch | 0 |
| shoulder/elbow limit | 0 |
| cloak left | 0 |
| cloak right | 0 |

The winner improves total torso-twist novel overlaps from V0.65's `2 + 5`
to `3 + 1`, and sharply improves torso-right/shoulder grip registration.
Torso-left remains approximately `10.4 cm` outside registration and therefore
blocks acceptance.

- Source V0.65 SHA-256:
  `AF2E8B129069E511478DD7A989BF69B16D6EC48B2982DB9A187551C5BF8D94E1`
- Candidate:
  `production/character/production_actor/rig_derivatives/MIKAGE_ZENITH_BLADE_IK3_POLE_WINNER_V0_78.blend`
- Candidate SHA-256:
  `544A4C663BC4BC63C7AE6652F6F7BBF9C7B469015636DFBA72128E542EA335D4`
- Build report:
  `production/character/reviews/MIKAGE_ZENITH_BLADE_IK3_POLE_WINNER_V0_78_REPORT.json`
- Validation report:
  `production/character/reviews/MIKAGE_ZENITH_BLADE_IK3_POLE_WINNER_V0_78_VALIDATION_REPORT.json`

Next safe investigation is torso-left-specific rig reach/pole-angle analysis
from V0.65. No Blade, actor mesh, material, docking or phase edit is justified.
