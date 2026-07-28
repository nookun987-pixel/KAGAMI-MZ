# Zenith Blade V0.68–V0.77 — Ten-Pass Grip Solver Sweep

## Result

```text
PASS_COUNT: 10
SOURCE_UNCHANGED: PASS
BLENDER_SAVE_DURING_SWEEP: NO
WINNER: V0.76_IK3_POLE_POS_X
WINNER_MAX_DELTA: 0.104167878 m
REGISTRATION_GATE: NOT_MET
WINNER_BUILD_ELIGIBILITY: YES_FOR_CANDIDATE_ONLY
```

Ranking by worst-case marker/handle world delta:

| Rank | Pass | Configuration | Max delta (m) |
|---:|---|---|---:|
| 1 | V0.76 | IK chain 3, +X pole | 0.104167878 |
| 2 | V0.77 | IK chain 3, -X pole | 0.104167937 |
| 3 | V0.69 | IK chain 2, no pole | 0.124916785 |
| 4 | V0.75 | IK chain 2, -Z pole | 0.124917473 |
| 5 | V0.74 | IK chain 2, +Z pole | 0.124917512 |
| 6 | V0.73 | IK chain 2, -Y pole | 0.124917527 |
| 7 | V0.71 | IK chain 2, -X pole | 0.124917527 |
| 8 | V0.70 | IK chain 2, +X pole | 0.124917582 |
| 9 | V0.72 | IK chain 2, +Y pole | 0.124917582 |
| 10 | V0.68 | no solver baseline | 0.164667440 |

V0.76 improves worst-case grip error by about `36.7%` versus the V0.68
baseline, but remains far outside the `0.00001 m` registration gate.
Therefore it may be built only as a full-validation candidate; it is not
approved or integration-ready.

Machine report:
`production/character/reviews/MIKAGE_ZENITH_BLADE_GRIP_SOLVER_SWEEP_V0_68_TO_V0_77_REPORT.json`
