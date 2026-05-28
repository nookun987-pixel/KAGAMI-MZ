$audit_dir  = "D:\KAGAMI-MZ_SYNC_PUSH_V2\production\character\audit"
$ss_dir     = "$audit_dir\audit_screenshots"
$report_out = "$audit_dir\MIKAGE_BLEND_TRUTH_AUDIT_REPORT_V1.md"

$json_files = Get-ChildItem $audit_dir -Filter "*.json" | Where-Object { $_.Name -notlike "*.schema*" }
$screenshots = Get-ChildItem $ss_dir -Filter "*.png" -ErrorAction SilentlyContinue

$rows = @()
foreach ($jf in $json_files) {
    $d = Get-Content $jf.FullName | ConvertFrom-Json
    $err = if ($d.errors -and $d.errors.Count -gt 0) { $d.errors -join "; " } else { "none" }
    $rows += [PSCustomObject]@{
        blend_file       = $d.blend_file
        objects          = $d.object_count
        armatures        = $d.armature_count
        arm_bone_rotated = if ($d.arm_bone_rotated) { $d.arm_bone_rotated } else { "N/A" }
        leg_bone_rotated = if ($d.leg_bone_rotated) { $d.leg_bone_rotated } else { "N/A" }
        pose_applied     = $d.pose_applied
        classification   = $d.classification
        errors           = $err
    }
}

$lines = @()
$lines += "# MIKAGE BLEND TRUTH AUDIT REPORT V1"
$lines += ""
$lines += "Date: 2026-05-29"
$lines += "Blender: 5.1"
$lines += "Files audited: $($json_files.Count)"
$lines += "Screenshots captured: $($screenshots.Count)"
$lines += "Status: OPERATOR_REVIEW_PENDING"
$lines += "No commit. No push. Awaiting operator review."
$lines += ""
$lines += "---"
$lines += ""
$lines += "## AUDIT TABLE"
$lines += ""
$lines += "| blend_file | objects | armatures | arm_bone_rotated | leg_bone_rotated | pose_applied | classification | errors |"
$lines += "|---|---|---|---|---|---|---|---|"
foreach ($r in $rows) {
    $lines += "| $($r.blend_file) | $($r.objects) | $($r.armatures) | $($r.arm_bone_rotated) | $($r.leg_bone_rotated) | $($r.pose_applied) | $($r.classification) | $($r.errors) |"
}

$lines += ""
$lines += "---"
$lines += ""
$lines += "## CLASSIFICATION SUMMARY"
$lines += ""
$prod  = ($rows | Where-Object { $_.classification -eq "PRODUCTION_RIG_USABLE" }).Count
$proxy = ($rows | Where-Object { $_.classification -eq "PROXY_RIG_USABLE" }).Count
$block = ($rows | Where-Object { $_.classification -eq "BLOCKOUT_ONLY" }).Count
$broke = ($rows | Where-Object { $_.classification -eq "BROKEN_OR_HIDDEN" }).Count

$lines += "| Classification | Count |"
$lines += "|---|---|"
$lines += "| PRODUCTION_RIG_USABLE | $prod |"
$lines += "| PROXY_RIG_USABLE | $proxy |"
$lines += "| BLOCKOUT_ONLY | $block |"
$lines += "| BROKEN_OR_HIDDEN | $broke |"
$lines += ""
$lines += "---"
$lines += ""
$lines += "## SCREENSHOT INDEX"
$lines += ""
$lines += "| File | Size (bytes) |"
$lines += "|---|---|"
foreach ($s in $screenshots) {
    $lines += "| $($s.Name) | $($s.Length) |"
}
$lines += ""
$lines += "---"
$lines += ""
$lines += "## NEXT SAFE TASK"
$lines += ""
$lines += "Operator reviews this report and screenshots before any further action."
$lines += "No render. No commit. No push. No new files until operator approves."
$lines += ""
$lines += "*End of MIKAGE_BLEND_TRUTH_AUDIT_REPORT_V1.md*"

$lines | Out-File $report_out -Encoding utf8
Write-Output "REPORT_WRITTEN: $report_out"
Write-Output "ROWS: $($rows.Count)"
Write-Output "SCREENSHOTS: $($screenshots.Count)"
