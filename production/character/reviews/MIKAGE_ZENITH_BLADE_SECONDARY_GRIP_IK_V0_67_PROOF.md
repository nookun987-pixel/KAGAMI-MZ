# Zenith Blade V0.67 — Secondary Grip IK Candidate

## Result

```text
V0.67_BUILD_AND_REOPEN: PASS
V0.67_POSE_VALIDATION: FAIL
SECONDARY_GRIP_IK: PARTIAL_ONLY
ASSET_PROMOTION: NO
BEST_ACCEPTED_TECHNICAL_BASELINE: V0.65
INTEGRATION_READY: NO
```

The candidate preserved docking ownership and added a two-bone IK constraint
on `forearm.R`, with a target following the registered handle. Neutral
registration was preserved, but the solver did not converge consistently
across the pose matrix.

## Marker/handle world delta

| Pose | Delta (m) |
|---|---:|
| neutral | 0.000000278 |
| hand hold | 0.000000184 |
| torso left | 0.124916782 |
| torso right | 0.000042814 |
| wide stance | 0.000000278 |
| crouch | 0.000000278 |
| shoulder/elbow limit | 0.003869762 |
| cloak left | 0.000000278 |
| cloak right | 0.000000278 |

The result is better than V0.66 for torso-right and shoulder/elbow-limit, but
torso-left remains far outside the `0.00001 m` gate. P2 overlap records also
increase relative to the V0.65 validation. The no-pole two-bone IK candidate
is therefore rejected.

- Source V0.65 SHA-256:
  `AF2E8B129069E511478DD7A989BF69B16D6EC48B2982DB9A187551C5BF8D94E1`
- Candidate output:
  `production/character/production_actor/rig_derivatives/MIKAGE_ZENITH_BLADE_SECONDARY_GRIP_IK_V0_67.blend`
- Candidate SHA-256:
  `81C70D77D33916BCCC01400ECAC4049E378DB29B822B9817B45B7A4DC168DA4D`
- Build report:
  `production/character/reviews/MIKAGE_ZENITH_BLADE_SECONDARY_GRIP_IK_V0_67_REPORT.json`
- Validation report:
  `production/character/reviews/MIKAGE_ZENITH_BLADE_SECONDARY_GRIP_IK_V0_67_VALIDATION_REPORT.json`

Next safe action is a bounded rig-control design with a pole target and
operator-authored valid pose limits, starting again from V0.65. No Blade,
actor-mesh, material or phase edit is justified.
