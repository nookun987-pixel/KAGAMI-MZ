# LANE A — CODEX TASK BRIEF: HERO MOUNT BINDING V1.3A

STATUS = AUTHORIZED (retroactive, operator BOOS re-dispatch #9, 2026-06-25, via Lane B coordination)
TASK_ID = MIKAGE_HERO_MOUNT_BINDING_V1_3A
TRACK = LANE_A_IP_TO_SCREEN_RENDER_LINE
SUPERSEDES = parked V0.20 STEED CHASSIS gate (not executed; remains parked)

## Why this brief exists
The V1.3A binding-isolation + world-space locomotion test was executed by Codex and
committed locally (9208ab2, PUSH=no) before a matching gate/brief existed. Operator
explicitly chose to legitimize V1.3A. This brief + the updated `active_task.yaml`
bring governance in line with what was built. This does NOT declare the rig PASS —
operator review of the world-space evidence is still required.

## Input (locked base)
- production/character/MIKAGE_HERO_MOUNT_EEVEE_V1_3_BOUND_RIG.blend

## Scope
1. Binding scope isolation:
   - Review-environment objects (void architecture bands, floor measure lines, ground
     plane, markers) must be WORLD_STATIC — unparented and unconstrained from the mount.
   - Rider/helmet/blade objects bound to the rider seat chassis-follow control.
   - Leg/foot objects on their rigid swing / planted-foot controls.
2. World-space locomotion smoke test: foot-plant / no-slide check at smoke-test amplitude.
3. Documentation + proof: binding audit (with world-space validation summary),
   world-space contact sheet, world-space locomotion test mp4.

## Outputs (allowed)
- production/character/MIKAGE_HERO_MOUNT_EEVEE_V1_3A_BINDING_FIXED.blend
- production/character/reviews/MIKAGE_HERO_MOUNT_V1_3A_BINDING_AUDIT.md
- production/character/reviews/MIKAGE_HERO_MOUNT_V1_3A_WORLDSPACE_CONTACT_SHEET.png   (3600x1800)
- production/character/reviews/MIKAGE_HERO_MOUNT_V1_3A_WORLDSPACE_LOCOMOTION_TEST.mp4  (1920x1080, 24fps, 48f, H.264, yuv420p, no audio)

## Hard guards
- Do NOT modify original rider/blade/helmet/steed meshes or material hex values.
- Do NOT change stance, rider seating, composition, scale.
- Do NOT claim canon lock / asset lock / final pass / production-ready / public-ready.
- Do NOT push. Commit local only.
- Output stays CANDIDATE / ACCEPTED_FOR_OPERATOR_REVIEW.

## Lane B coordination verification (2026-06-25)
- All 4 deliverables exist on disk.
- MP4 = 1920x1080 · 24fps · 48 frames · H.264 · yuv420p · 0 audio streams — matches report.
- Contact sheet = 3600x1800 — matches report.
- Git commit / repo-clean status: NOT verifiable from sandbox (worktree .git lives on the
  Windows drive, not mounted). Operator must confirm `9208ab2` and clean status locally.
- Rig quality (foot-plant correctness, no drift, no intersection): NOT independently
  confirmed by coordinator — reserved for operator review. NOT marked PASS.

## Next
Operator reviews world-space foot-plant evidence → decides PASS/HOLD and whether to authorize push.
