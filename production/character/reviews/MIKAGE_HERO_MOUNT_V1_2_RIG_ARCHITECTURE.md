# MIKAGE_HERO_MOUNT_V1_2_RIG_ARCHITECTURE

## Control Hierarchy
- `ctrl_master_mount_all`
- `ctrl_chassis_lean_pitch_weight_shift` parented to master
- `ctrl_seat_rider_attachment_follow_chassis` parented to chassis
- `ctrl_leg_front_left_rigid_swing` parented to chassis
- `ctrl_ankle_front_left_planted_foot` parented to `ctrl_leg_front_left_rigid_swing`
- `pivot_leg_front_left_shoulder_socket` and `pivot_ankle_front_left_ground_contact` authored as visible pivot markers
- `ctrl_leg_front_right_rigid_swing` parented to chassis
- `ctrl_ankle_front_right_planted_foot` parented to `ctrl_leg_front_right_rigid_swing`
- `pivot_leg_front_right_shoulder_socket` and `pivot_ankle_front_right_ground_contact` authored as visible pivot markers
- `ctrl_leg_rear_left_rigid_swing` parented to chassis
- `ctrl_ankle_rear_left_planted_foot` parented to `ctrl_leg_rear_left_rigid_swing`
- `pivot_leg_rear_left_shoulder_socket` and `pivot_ankle_rear_left_ground_contact` authored as visible pivot markers
- `ctrl_leg_rear_right_rigid_swing` parented to chassis
- `ctrl_ankle_rear_right_planted_foot` parented to `ctrl_leg_rear_right_rigid_swing`
- `pivot_leg_rear_right_shoulder_socket` and `pivot_ankle_rear_right_ground_contact` authored as visible pivot markers

## Parent Hierarchy
- Master -> chassis -> seat/rider attachment.
- Chassis -> independent front-left, front-right, rear-left, rear-right leg controls.
- Leg control -> ankle/foot planted-foot support control.
- Original visual meshes remain unmodified; linked rigid pose sets demonstrate intended parent behavior without baking geometry changes.

## Pivot List
- Chassis pivot: `(-0.55, 0.0, 0.84)`, purpose = lean/pitch/weight-shift around lower center spine.
- Seat/rider attach pivot: `(-0.34, -0.78, 1.72)`, purpose = keep rider and seat following chassis.
- front_left shoulder/socket pivot: `(-2.0, -0.3, 0.96)`, purpose = rigid leg swing from chassis socket.
- front_left ankle/ground pivot: `(-2.0, -0.3, 0.08)`, purpose = planted-foot support and ankle roll limit.
- front_right shoulder/socket pivot: `(-2.0, 0.3, 0.96)`, purpose = rigid leg swing from chassis socket.
- front_right ankle/ground pivot: `(-2.0, 0.3, 0.08)`, purpose = planted-foot support and ankle roll limit.
- rear_left shoulder/socket pivot: `(0.98, -0.3, 0.96)`, purpose = rigid leg swing from chassis socket.
- rear_left ankle/ground pivot: `(0.98, -0.3, 0.08)`, purpose = planted-foot support and ankle roll limit.
- rear_right shoulder/socket pivot: `(0.98, 0.3, 0.96)`, purpose = rigid leg swing from chassis socket.
- rear_right ankle/ground pivot: `(0.98, 0.3, 0.08)`, purpose = planted-foot support and ankle roll limit.

## Constraint List
- Limit Rotation on chassis control.
- Limit Rotation on seat/rider attachment control.
- Limit Rotation on `ctrl_leg_front_left_rigid_swing`.
- Limit Rotation on `ctrl_ankle_front_left_planted_foot`.
- Limit Rotation on `ctrl_leg_front_right_rigid_swing`.
- Limit Rotation on `ctrl_ankle_front_right_planted_foot`.
- Limit Rotation on `ctrl_leg_rear_left_rigid_swing`.
- Limit Rotation on `ctrl_ankle_rear_left_planted_foot`.
- Limit Rotation on `ctrl_leg_rear_right_rigid_swing`.
- Limit Rotation on `ctrl_ankle_rear_right_planted_foot`.
- Constraints are intentionally limited to repeatable mechanical limits; no unclear IK or deformation constraints were added.

## Rotation Limits
- Chassis: X +/-5 deg, Y +/-5 deg, Z +/-3 deg.
- Seat/rider attachment: X/Y/Z +/-2 deg micro-adjust only.
- Leg swing controls: X +/-4 deg, Y -14 to +10 deg, Z +/-3 deg.
- Ankle/foot controls: X +/-5 deg, Y +/-6 deg, Z +/-2 deg.

## Test Poses
- A Neutral: original V1.1 visual objects, rest/default pose.
- B Front-left leg lift: linked duplicate set count `160`.
- C Front-right leg lift: linked duplicate set count `160`.
- D Chassis lean left/right: linked duplicate set count `160`.
- E Forward brace: linked duplicate set count `160`.
- F Rider/seat attachment: rider/seat/chassis are moved as attached upper rigid assembly in pose sets.

## Known Collision Zones
- Front leg lift can approach the underside crossmember if beyond tested limits.
- Chassis lean can bring side slabs close to lower socket fairings if beyond +/-5 degrees.
- Forward brace creates tight clearance between lower rails and front foot units at higher pitch.
- Existing geometry is suitable for small mechanical tests but not yet proven for broad locomotion cycles.

## Parts Still Unsuitable For Production Motion
- No authored mesh origins/hinge axes inside the visual objects.
- No real IK solver or planted-foot solver yet; planted support is represented by explicit ankle controls and linked test poses.
- No collision volumes or limit-stop geometry.
- Violet signal meshes are not duplicated in linked pose sets to avoid creating new violet objects; production rig should constrain original signal meshes to their corresponding rider/hoof controls.

## Geometry Rebuild Requirement
- GEOMETRY_REBUILD_REQUIRED = `False` for the approved V1.2 small-amplitude mechanical tests.
- A wider locomotion range may require clearance review, but V1.2 did not require geometry changes.

## Validation Fields
- ORIGINAL_GEOMETRY_UNCHANGED = pending final validation after save/reopen
- CONTROL_HIERARCHY_CREATED = `True`
- PIVOTS_AUTHORED = `True`
- ROTATION_LIMITS_CREATED = `True`
- GEOMETRY_REBUILD_REQUIRED = `False`
- PUSH_DONE = no

## Final Validation

FILES_CHANGED =
- `production/character/MIKAGE_HERO_MOUNT_EEVEE_V1_2_MECH_RIG.blend`
- `production/character/reviews/MIKAGE_HERO_MOUNT_V1_2_RIG_ARCHITECTURE.md`
- `production/character/reviews/MIKAGE_HERO_MOUNT_V1_2_RIG_CONTACT_SHEET.png`

COMMANDS_RUN =
- `git status --porcelain=v1`
- `git branch --show-current`
- `git log -1 --oneline`
- Read canon-control, character visual spec, cine color contract, V1.1 proof, and V1.1 smoke-test report
- Blender V1.2 rig architecture build/save/reopen/render
- Contact-sheet composition with Windows System.Drawing
- Contact-sheet visual inspection with Codex image viewer
- Reopen/fingerprint validation against source V1.1
- PNG dimension/panel evidence check
- `.blend1` cleanup/check
- Scratch cleanup

EVIDENCE_SOURCE =
- PowerShell stdout
- Blender stdout
- Codex image viewer inspection
- Windows System.Drawing PNG inspection
- Git stdout

ORIGINAL_GEOMETRY_UNCHANGED = `True`
CONTROL_HIERARCHY_CREATED = `True`
PIVOTS_AUTHORED = `8`
ROTATION_LIMITS_CREATED = `10`
LEFT_LEG_TEST = `PASS`
RIGHT_LEG_TEST = `PASS`
CHASSIS_LEAN_TEST = `PASS`
FORWARD_BRACE_TEST = `PASS`
RIDER_SEAT_CONNECTION = `PASS`
GROUND_CONTACT = `PASS at approved test amplitudes; full planted-foot solver not yet authored`
MAJOR_INTERSECTIONS = `none observed at approved test amplitudes`
GEOMETRY_REBUILD_REQUIRED = `False`
CONTACT_SHEET_SIZE = `3600 x 1800`
BLEND_REOPEN = `True`
BLEND1_REMAINING = `False` after cleanup
REPO_STATUS = final clean status to be verified after commit
PASS_FAIL = `PASS_RIG_ARCHITECTURE_CANDIDATE_CREATED_FOR_OPERATOR_REVIEW`
BLOCKER = `none for V1.2 architecture and approved test amplitudes`
NEXT_SAFE_ACTION = create an animation-ready mechanical rig pass that binds original visual objects to the authored controls with explicit parent constraints and tests a short non-combat locomotion cycle
COMMIT_DONE = pending at report update time; final hash reported in chat
PUSH_DONE = no

## Final Validation Details

- BLEND_REOPEN = yes
- ORIGINAL_GEOMETRY_UNCHANGED = `True` comparing source V1.1 mesh fingerprints against all non-rig/non-pose original visual objects inside the V1.2 rig blend.
- CONTROL_COUNT = `11`
- PIVOT_COUNT = `8`
- ROTATION_LIMIT_COUNT = `10`
- NEW_VIOLET_MESH_OBJECTS = `0`
- NEW_VIOLET_MATERIALS = `0`
- PNG_SAMPLE_NONVOID = `30026`
- PNG_SAMPLE_PANEL_NONVOID = `3641,4711,5191,5203,4259,7021`
- Contact sheet was opened and visually inspected. Overview panel shows the mount with blue control markers and green pivot markers; neutral front preserves the V1.1 rest pose; left/right front leg lift tests show independent front leg motion; chassis lean and forward brace preserve rider/seat attachment at the tested amplitude.
