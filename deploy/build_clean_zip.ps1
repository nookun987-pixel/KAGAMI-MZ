# ============================================================================
# MIKAGE — Build Clean ZIP for Pod Deployment
# Usage: powershell -ExecutionPolicy Bypass -File deploy\build_clean_zip.ps1
# Output: D:\KAGAMI-MZ-CLEAN.zip
# ============================================================================

$SrcDir = "D:\KAGAMI-MZ"
$OutZip = "D:\KAGAMI-MZ-CLEAN.zip"
$TempDir = "$env:TEMP\KAGAMI-MZ-CLEAN-BUILD"

# Exclusion patterns
$ExcludeDirs = @("node_modules", ".git", "venv", "__pycache__", ".cache", "runs", ".next", ".nuxt")
$ExcludeExt = @(".log")

Write-Host "[BUILD] Cleaning temp dir..." -ForegroundColor Cyan
if (Test-Path $TempDir) { Remove-Item $TempDir -Recurse -Force }
if (Test-Path $OutZip) { Remove-Item $OutZip -Force }

Write-Host "[BUILD] Copying files..." -ForegroundColor Cyan
$DestDir = Join-Path $TempDir "KAGAMI-MZ"
New-Item -ItemType Directory -Path $DestDir -Force | Out-Null

# Get all items, filter out excluded dirs and extensions
$items = Get-ChildItem -Path $SrcDir -Recurse -Force -ErrorAction SilentlyContinue | Where-Object {
    $fullPath = $_.FullName
    $relPath = $fullPath.Substring($SrcDir.Length)
    
    # Check if any parent folder is in exclusion list
    $excluded = $false
    foreach ($exc in $ExcludeDirs) {
        if ($relPath -match "(\\|/)$exc(\\|/|$)") {
            $excluded = $true
            break
        }
    }
    
    # Check file extension exclusion
    if (-not $excluded -and -not $_.PSIsContainer) {
        foreach ($ext in $ExcludeExt) {
            if ($_.Extension -eq $ext) {
                $excluded = $true
                break
            }
        }
    }
    
    -not $excluded
}

# Copy files preserving structure
$fileCount = 0
$items | Where-Object { -not $_.PSIsContainer } | ForEach-Object {
    $relPath = $_.FullName.Substring($SrcDir.Length + 1)
    $destPath = Join-Path $DestDir $relPath
    $destParent = Split-Path $destPath -Parent
    if (-not (Test-Path $destParent)) {
        New-Item -ItemType Directory -Path $destParent -Force | Out-Null
    }
    Copy-Item $_.FullName -Destination $destPath -Force
    $fileCount++
}

Write-Host "[BUILD] Copied $fileCount files" -ForegroundColor Green

# Verify critical files exist
$criticalFiles = @(
    "run.sh",
    "package.json",
    "server.js",
    "worker.js",
    "deploy\runpod_start.sh",
    "deploy\runpod_bootstrap.sh",
    "deploy\runpod_env.example",
    "deploy\test_e2e_render.py",
    "scripts\fooocus_bridge.py",
    "pipeline\config.py",
    "pipeline\render_handler.py"
)

$missing = @()
foreach ($f in $criticalFiles) {
    $check = Join-Path $DestDir $f
    if (-not (Test-Path $check)) {
        $missing += $f
    }
}

if ($missing.Count -gt 0) {
    Write-Host "[BUILD] WARNING: Missing critical files:" -ForegroundColor Red
    $missing | ForEach-Object { Write-Host "  - $_" -ForegroundColor Red }
} else {
    Write-Host "[BUILD] All critical files present" -ForegroundColor Green
}

# Create ZIP
Write-Host "[BUILD] Creating ZIP..." -ForegroundColor Cyan
Compress-Archive -Path "$TempDir\*" -DestinationPath $OutZip -Force

# Report
$zipSize = (Get-Item $OutZip).Length / 1MB
Write-Host "[BUILD] ============================================" -ForegroundColor Green
Write-Host "[BUILD]   OUTPUT: $OutZip" -ForegroundColor Green
Write-Host "[BUILD]   SIZE:   $([math]::Round($zipSize, 1)) MB" -ForegroundColor Green
Write-Host "[BUILD]   FILES:  $fileCount" -ForegroundColor Green
Write-Host "[BUILD] ============================================" -ForegroundColor Green
Write-Host "[BUILD] Next: Upload to GitHub Release v1.1" -ForegroundColor Yellow

# Cleanup temp
Remove-Item $TempDir -Recurse -Force
