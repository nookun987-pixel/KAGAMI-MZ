# MIKAGE HERO MOUNT V1.4 GAIT REPORT

STATUS = CANDIDATE_FOR_OPERATOR_REVIEW

FILES_CHANGED =
- production/character/MIKAGE_HERO_MOUNT_EEVEE_V1_4_GAIT_PROOF.blend
- production/character/reviews/MIKAGE_HERO_MOUNT_V1_4_GAIT_REPORT.md
- production/character/reviews/MIKAGE_HERO_MOUNT_V1_4_GAIT_CONTACT_SHEET.png
- production/character/reviews/MIKAGE_HERO_MOUNT_V1_4_GAIT_PROOF.mp4

COMMANDS_RUN =
- Get-Content docs/handoff/00_LATEST_CODEX_HANDOFF.md
- Get-Content .mikage/tasks/active_task.yaml
- Get-Content production/character/build_log/LANEA_CODEX_TASK_HERO_MOUNT_GAIT_V1_4.md
- Get-Content docs/handoff/MIKAGE_AGENT_GOVERNANCE_LAYER_V1.md
- python .mikage/tools/validate_task.py
- Blender 5.1 --background --python _tmp_build_v14_gait.py
- PowerShell System.Drawing contact sheet composition
- Blender 5.1 --background --python _tmp_validate_v14_gait.py
- ffprobe video/audio stream validation
- python .mikage/tools/verify_output.py

EVIDENCE_SOURCE = BLENDER_REOPEN_VALIDATION, WORLD_TRANSFORM_SAMPLING, MESH_FINGERPRINT_COMPARISON, FFPROBE, CONTACT_SHEET_VISUAL_INSPECTION, VERIFY_OUTPUT_PASS
ORIGINAL_GEOMETRY_UNCHANGED = True
ENVIRONMENT_OBJECTS_BOUND_TO_MOUNT = 0
WORLD_STATIC_REFERENCE_TRANSFORMS_UNCHANGED = True
FRONT_LEFT_STEP = complete, clears and replants forward
REAR_RIGHT_STEP = complete, clears and replants forward
FRONT_RIGHT_STEP = complete, clears and replants forward
REAR_LEFT_STEP = complete, clears and replants forward
PLANTED_FOOT_WORLD_SLIDE = front_left_phase: 0.0; rear_right_phase: 0.0; front_right_phase: 0.0; rear_left_phase: 0.0
FOOT_CLEARANCE_VALUES = front_left: 0.3372; rear_right: 0.3372; front_right: 0.3390; rear_left: 0.3366
FOOT_PLANT_DELTAS = front_left: +0.72 X; rear_right: +0.70 X; front_right: +0.72 X; rear_left: +0.70 X
TOTAL_CHASSIS_WORLD_ADVANCE = 1.2201
RIDER_SEAT_DRIFT = none observed
WEAPON_DRIFT = none observed
MAJOR_INTERSECTIONS = none observed at V1.4 gait amplitude
ROTATION_LIMITS_RESPECTED = True
NEW_CONTROLS_CREATED = none
VIDEO_SPEC = 1920x1080, 24 fps, 96 frames, H.264 MP4, yuv420p, no audio
CONTACT_SHEET_SIZE = 3600x1800
BLEND_REOPEN = True
PLAYBACK_AFTER_REOPEN = True, frames 1-96 evaluated
BLEND1_REMAINING = False after cleanup
REPO_STATUS = clean after local commit
PASS_FAIL = PASS
BLOCKER = NONE
NEXT_SAFE_ACTION = Lane B drift-check + operator review of V1.4 gait evidence.
COMMIT_DONE = yes, local only
PUSH_DONE = no
