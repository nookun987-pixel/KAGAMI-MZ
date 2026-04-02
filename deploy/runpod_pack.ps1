# ============================================================================
# MIKAGE — RunPod Pack Script (Windows)
# Packages the project for upload to RunPod.
# Usage: powershell -ExecutionPolicy Bypass -File deploy\runpod_pack.ps1
# ============================================================================

$ErrorActionPreference = "Stop"

$ProjectRoot = Split-Path -Parent (Split-Path -Parent $PSCommandPath)
$OutputZip = Join-Path $ProjectRoot "mikage_runpod_pack.zip"
$TempStaging = Join-Path $env:TEMP "mikage_runpod_staging"

Write-Host "[PACK] MIKAGE RunPod Pack Builder" -ForegroundColor Green
Write-Host "[PACK] Source: $ProjectRoot" -ForegroundColor Green
Write-Host "[PACK] Output: $OutputZip" -ForegroundColor Green

# Clean previous staging
if (Test-Path $TempStaging) {
    Remove-Item -Recurse -Force $TempStaging
}
New-Item -ItemType Directory -Path $TempStaging -Force | Out-Null

# Directories to EXCLUDE (not needed on pod or too large)
$ExcludeDirs = @(
    "node_modules",
    ".git",
    ".claude",
    ".vercel",
    ".grapuco",
    ".cache",
    "__pycache__",
    "output",
    "outputs",
    "archive",
    "dlq",
    "runtime_logs",
    "runs",
    "semantic_test_run",
    "KAGAMI-MZ",
    "-p",
    ".vscode",
    ".idea"
)

# File patterns to EXCLUDE
$ExcludeFilePatterns = @(
    "*.log",
    "*.pyc",
    "*.pyo",
    "Thumbs.db",
    ".DS_Store",
    "recovery_scan_results.json",
    "tmp_gradio_config.json",
    "package-lock.json",
    "files.zip",
    "mikage_runpod_pack.zip",
    "service-account-key.json",
    ".command_center_state.json"
)

# Files to EXCLUDE by exact name
$ExcludeExactFiles = @(
    ".env",
    ".env.local"
)

Write-Host "[PACK] Copying files to staging..." -ForegroundColor Cyan

# Get all items recursively
$AllItems = Get-ChildItem -Path $ProjectRoot -Recurse -Force -ErrorAction SilentlyContinue

$CopiedCount = 0
$SkippedCount = 0

foreach ($Item in $AllItems) {
    $RelativePath = $Item.FullName.Substring($ProjectRoot.Length + 1)
    $TargetPath = Join-Path $TempStaging $RelativePath

    # Check if any parent directory is excluded
    $Skip = $false
    foreach ($ExDir in $ExcludeDirs) {
        if ($RelativePath -like "$ExDir\*" -or $RelativePath -like "*\$ExDir\*" -or $RelativePath -eq $ExDir) {
            $Skip = $true
            break
        }
    }
    if ($Skip) { $SkippedCount++; continue }

    # Check file exclusion patterns
    if (-not $Item.PSIsContainer) {
        foreach ($Pattern in $ExcludeFilePatterns) {
            if ($Item.Name -like $Pattern) {
                $Skip = $true
                break
            }
        }
        if ($Skip) { $SkippedCount++; continue }

        # Check exact file name exclusion
        foreach ($ExactFile in $ExcludeExactFiles) {
            if ($Item.Name -eq $ExactFile) {
                $Skip = $true
                break
            }
        }
        if ($Skip) { $SkippedCount++; continue }
    }

    if ($Item.PSIsContainer) {
        if (-not (Test-Path $TargetPath)) {
            New-Item -ItemType Directory -Path $TargetPath -Force | Out-Null
        }
    } else {
        $ParentDir = Split-Path -Parent $TargetPath
        if (-not (Test-Path $ParentDir)) {
            New-Item -ItemType Directory -Path $ParentDir -Force | Out-Null
        }
        Copy-Item -Path $Item.FullName -Destination $TargetPath -Force
        $CopiedCount++
    }
}

Write-Host "[PACK] Copied $CopiedCount files, skipped $SkippedCount" -ForegroundColor Cyan

# Ensure deploy scripts are included
$DeployDir = Join-Path $TempStaging "deploy"
if (-not (Test-Path $DeployDir)) {
    Write-Host "[PACK] WARNING: deploy/ dir missing from staging!" -ForegroundColor Yellow
}

# Create the zip
Write-Host "[PACK] Creating zip archive..." -ForegroundColor Cyan
if (Test-Path $OutputZip) {
    Remove-Item -Force $OutputZip
}

# Use Compress-Archive with the staging directory contents
Compress-Archive -Path "$TempStaging\*" -DestinationPath $OutputZip -CompressionLevel Optimal

# Clean up staging
Remove-Item -Recurse -Force $TempStaging

$ZipSize = (Get-Item $OutputZip).Length
$ZipSizeMB = [math]::Round($ZipSize / 1MB, 2)

Write-Host ""
Write-Host "============================================" -ForegroundColor Green
Write-Host "  PACK COMPLETE" -ForegroundColor Green
Write-Host "============================================" -ForegroundColor Green
Write-Host "  Output: $OutputZip" -ForegroundColor White
Write-Host "  Size:   $ZipSizeMB MB" -ForegroundColor White
Write-Host "  Files:  $CopiedCount" -ForegroundColor White
Write-Host ""
Write-Host "  NEXT STEPS:" -ForegroundColor Yellow
Write-Host "  1. Upload $OutputZip to RunPod pod" -ForegroundColor White
Write-Host "  2. On pod: cd /workspace && unzip mikage_runpod_pack.zip -d KAGAMI-MZ" -ForegroundColor White
Write-Host "  3. On pod: bash /workspace/KAGAMI-MZ/deploy/runpod_bootstrap.sh" -ForegroundColor White
Write-Host "  4. On pod: Edit /workspace/KAGAMI-MZ/.env (add GEMINI_API_KEY)" -ForegroundColor White
Write-Host "  5. On pod: bash /workspace/KAGAMI-MZ/deploy/runpod_start.sh" -ForegroundColor White
Write-Host "============================================" -ForegroundColor Green
