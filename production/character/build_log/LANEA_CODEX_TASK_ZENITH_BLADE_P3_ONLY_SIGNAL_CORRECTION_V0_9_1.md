# LANE A TASK — ZENITH BLADE P3-ONLY SIGNAL CORRECTION V0.9.1

TASK_STATUS: AUTHORIZED
OUTPUT_STATUS: CANDIDATE_ONLY

## Canon mapping

- P1 `Compact-Idle`: Blade violet OFF.
- P2 `Brutal Industrial Activation`: Blade violet OFF.
- P3 `Tri-Phase Final / Overdrive`: one violet core signal ON.

This mapping is authorized by
`design_system/mikage-cine-color-contract.md`. V0.9 is draft implementation
evidence only and does not override the SSOT.

## Bounded implementation

Use V0.9 as the source. Change only the visibility-driver expressions/wiring
of the two existing Blade seam objects. Do not change geometry, transforms,
rig, camera, pose, attachment, materials, emission strengths, glare, exposure,
helmet slits, or unrelated objects.

Required driver result:

| Phase | P2 seam | P3 seam |
|---|---|---|
| P1 | hidden | hidden |
| P2 | hidden | hidden |
| P3 | hidden | visible |

Render one three-panel contact sheet, reopen and audit the derivative, verify
all locked data against V0.9, and write a candidate-only proof. Do not push.
