$blender  = "C:\Program Files\Blender Foundation\Blender 5.1\blender.exe"
$script   = "D:\KAGAMI-MZ_SYNC_PUSH_V2\production\character\audit\blend_audit.py"
$ss_dir   = "D:\KAGAMI-MZ_SYNC_PUSH_V2\production\character\audit\audit_screenshots"
$json_dir = "D:\KAGAMI-MZ_SYNC_PUSH_V2\production\character\audit"

$files = @(
    "D:\KAGAMI-MZ_SYNC_PUSH_V2\production\character\production_actor\rig_derivatives\MIKAGE_PRODUCTION_ACTOR_RIG_FROM_LOCKED_BLOCKOUT_V0_2_V0_1.blend",
    "D:\KAGAMI-MZ_SYNC_PUSH_V2\production\character\production_actor\rig_derivatives\MIKAGE_PRODUCTION_ACTOR_FIRST_MOTION_TEST_FROM_APPROVED_GATE_V0_1.blend",
    "D:\KAGAMI-MZ_SYNC_PUSH_V2\production\character\production_actor\rig_derivatives\MIKAGE_PRODUCTION_ACTOR_FIRST_DIAGNOSTIC_CINEMATIC_PROOF_SHOT_V0_1.blend",
    "D:\KAGAMI-MZ_SYNC_PUSH_V2\production\character\proxy_actor\motion_tests\MIKAGE_PROXY_POSE_MOTION_TEST_FROM_ANCHOR_V1.blend",
    "D:\KAGAMI-MZ_SYNC_PUSH_V2\production\character\proxy_actor\MIKAGE_PROXY_3D_ACTOR_FROM_ANCHOR_V1_BLOCKOUT.blend",
    "D:\KAGAMI-MZ_SYNC_PUSH_V2\production\character\proxy_actor\MIKAGE_PROXY_3D_ACTOR_FROM_ANCHOR_V1_RIG_PREP_BLOCKOUT.blend",
    "D:\KAGAMI-MZ_SYNC_PUSH_V2\production\character\production_actor\MIKAGE_PRODUCTION_ACTOR_FROM_ANCHOR_V1_V0_1.blend",
    "D:\KAGAMI-MZ_SYNC_PUSH_V2\production\character\production_actor\MIKAGE_PRODUCTION_ACTOR_FROM_ANCHOR_V1_V0_2.blend"
)

foreach ($blend in $files) {
    $name     = [System.IO.Path]::GetFileNameWithoutExtension($blend)
    $out_json = "$json_dir\$name.json"
    Write-Output "=== AUDITING: $name"
    & $blender --background $blend --python $script -- $out_json $ss_dir 2>&1 | Select-String "AUDIT_DONE|AUDIT_COMPLETE|classification|ERROR|WARNING"
    Write-Output "=== DONE: $name"
}

Write-Output "ALL_FILES_AUDITED"
