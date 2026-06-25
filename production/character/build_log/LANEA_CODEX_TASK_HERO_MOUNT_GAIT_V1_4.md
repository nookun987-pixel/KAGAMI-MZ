# LANE A — CODEX TASK BRIEF: HERO MOUNT V1.4 — FOUR-STEP MECHANICAL GAIT PROOF

STATUS = AUTHORIZED (operator BOOS, 2026-06-25, dispatch #10, via Lane B coordination)
TASK_ID = MIKAGE_HERO_MOUNT_GAIT_V1_4
TRACK = LANE_A_IP_TO_SCREEN_RENDER_LINE
WORKSPACE = D:\KAGAMI-MZ_SYNC_PUSH_V2
PROVENANCE = Issued by GPT review after V1.3A; validated for governance compliance by Lane B coordination.

## INPUT (locked)
- production/character/MIKAGE_HERO_MOUNT_EEVEE_V1_3A_BINDING_FIXED.blend
- production/character/reviews/MIKAGE_HERO_MOUNT_V1_3A_BINDING_AUDIT.md

## STATUS PREMISE
V1.3A binding (environment / rider / weapon) is accepted for continued rig testing.
This task does NOT itself declare any canon/PASS — output stays CANDIDATE for operator review.

## GOAL
Prove the current rig can perform ONE deliberate four-leg locomotion sequence with
NO geometry changes, NO accumulated foot slide, NO hierarchy drift, NO major intersections.

## ANIMATION
- 96 frames @ 24 fps (4 s).
- Static world-space camera, ground, and reference markers.
- Slow, heavy mechanical walk — NOT gallop, run, or combat.

## FRAME PLAN
- 1–8: neutral hold.
- 9–26: front-left leg lift, advance, plant.
- 27–44: rear-right leg lift, advance, plant.
- 45–62: front-right leg lift, advance, plant.
- 63–80: rear-left leg lift, advance, plant.
- 81–90: chassis completes forward weight transfer.
- 91–96: stable settled hold.

## MOTION RULES
1. At least three feet grounded during each individual leg step.
2. A planted foot stays fixed in world space until its own lift phase begins.
3. Every lifted foot visibly clears the ground.
4. Every moved foot lands forward of its previous world-space position.
5. Chassis progresses forward; background/ground/markers do NOT move.
6. Chassis height may shift slightly for weight transfer but must not bounce like a soft creature.
7. Rider, seat, and docked Zenith Blade stay attached with no drift.
8. All visible panels follow their assigned rigid assemblies.
9. Respect all existing rotation limits.
10. Preserve a heavy, controlled mechanical gait.

## PRESERVE EXACTLY
All visible geometry · V1.3A binding categories & control assignments · rider proportions,
helmet, exactly two violet slits · Zenith Blade docked binding · main chassis & lower-structure
design · palette & violet placement · world-static review environment · neutral frame-1 pose.

## DO NOT
Remodel geometry · add new controls EXCEPT solely for stable foot planting (document any addition) ·
add combat / weapon draw / enemy / VFX / camera motion · gallop or fast run · move ground/background/
world markers · hide slide via camera framing · add new violet objects/materials · push · leave .blend1 ·
modify unrelated files.

## OUTPUT FILES (only these)
1. production/character/MIKAGE_HERO_MOUNT_EEVEE_V1_4_GAIT_PROOF.blend
2. production/character/reviews/MIKAGE_HERO_MOUNT_V1_4_GAIT_REPORT.md
3. production/character/reviews/MIKAGE_HERO_MOUNT_V1_4_GAIT_CONTACT_SHEET.png
4. production/character/reviews/MIKAGE_HERO_MOUNT_V1_4_GAIT_PROOF.mp4

## VIDEO SPEC
1920x1080 · 24 fps · 96 frames / 4 s · H.264 · yuv420p · no audio · static review camera ·
no on-screen text · static world-space ground & references.

## CONTACT SHEET
Exactly 3600x1800. Six panels:
1. FRAME 1 — NEUTRAL
2. FRONT-LEFT PLANT
3. REAR-RIGHT PLANT
4. FRONT-RIGHT PLANT
5. REAR-LEFT PLANT
6. FRAME 96 — FINAL WORLD ADVANCE

## VALIDATION
Reopen V1.4 blend · evaluate frames 1–96 after reopen · confirm original visible mesh fingerprints
unchanged · environment objects bound to mount = 0 · world-static reference transforms unchanged ·
measure planted-foot world slide every support phase · measure clearance + forward plant delta for all
four moving feet · measure total chassis world advance · confirm rider/seat/weapon drift · confirm no
major intersections · confirm no new violet mesh/material · validate PNG & MP4 specs · confirm no .blend1 ·
local commit only, no push.

## PASS CHECK
All four feet complete their step · planted-foot world slide ~0 during each support phase · every foot
clears and replants forward · chassis advances vs static world refs · rider/seat/weapon stay attached ·
no major armor intersection · no geometry edits required · frame 96 ends mechanically stable.

## FAIL CONDITION (stop + report BLOCKER)
Any support foot must slide to make the sequence work · world-static refs must move · a leg cannot
complete its step within existing rotation limits · rider/weapon/visible panels drift · geometry changes
required.

## COMMIT
Local only. Message: `Add Mikage hero mount V1.4 four-step gait proof`. PUSH = NO.

## FINAL REPORT FORMAT (fill all fields)
FILES_CHANGED = · COMMANDS_RUN = · EVIDENCE_SOURCE = · ORIGINAL_GEOMETRY_UNCHANGED = ·
ENVIRONMENT_OBJECTS_BOUND_TO_MOUNT = · WORLD_STATIC_REFERENCE_TRANSFORMS_UNCHANGED = ·
FRONT_LEFT_STEP = · REAR_RIGHT_STEP = · FRONT_RIGHT_STEP = · REAR_LEFT_STEP = ·
PLANTED_FOOT_WORLD_SLIDE = · FOOT_CLEARANCE_VALUES = · FOOT_PLANT_DELTAS = ·
TOTAL_CHASSIS_WORLD_ADVANCE = · RIDER_SEAT_DRIFT = · WEAPON_DRIFT = · MAJOR_INTERSECTIONS = ·
ROTATION_LIMITS_RESPECTED = · NEW_CONTROLS_CREATED = · VIDEO_SPEC = · CONTACT_SHEET_SIZE = ·
BLEND_REOPEN = · PLAYBACK_AFTER_REOPEN = · BLEND1_REMAINING = · REPO_STATUS = · PASS_FAIL = ·
BLOCKER = · NEXT_SAFE_ACTION = · COMMIT_DONE = · PUSH_DONE =
