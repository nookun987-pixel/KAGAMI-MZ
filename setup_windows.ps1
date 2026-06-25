<#
=====================================================================
 MIKAGE ZENITH — setup_windows.ps1  (v2, dung Chocolatey)
 Khoi phuc moi truong sau khi cai lai Windows.
 Chay bang SETUP.bat (double-click).
 Script: cai Chocolatey -> Node/Python/Git/FFmpeg -> npm/pip install.
 KHONG render, KHONG commit, KHONG push.
=====================================================================
#>

$ErrorActionPreference = "Continue"
[Net.ServicePointManager]::SecurityProtocol = [Net.SecurityProtocolType]::Tls12
$repo = $PSScriptRoot
if (-not $repo) { $repo = (Get-Location).Path }

function Head($t) { Write-Host "`n=== $t ===" -ForegroundColor Cyan }
function Ok($t)   { Write-Host "[OK]  $t" -ForegroundColor Green }
function Warn($t) { Write-Host "[!!]  $t" -ForegroundColor Yellow }
function Have($c) { return [bool](Get-Command $c -ErrorAction SilentlyContinue) }

# ---------- 0. CAI CHOCOLATEY ----------
function Ensure-Choco {
  if (Have choco) { Ok "Chocolatey da co"; return $true }
  Warn "Chocolatey chua co - dang cai..."
  try {
    Set-ExecutionPolicy Bypass -Scope Process -Force
    Invoke-Expression ((New-Object System.Net.WebClient).DownloadString('https://community.chocolatey.org/install.ps1'))
    $env:Path = [Environment]::GetEnvironmentVariable("Path","Machine") + ";" + [Environment]::GetEnvironmentVariable("Path","User")
  } catch {
    Warn "Khong cai duoc Chocolatey: $_"
  }
  if (Have choco) { Ok "Chocolatey da san sang"; return $true }
  Warn "Van chua co Chocolatey. Tai installer thu cong (link cuoi script)."
  return $false
}
$haveChoco = Ensure-Choco

function ChocoInstall($pkg, $name) {
  if (-not $haveChoco) { Warn "Bo qua $name (khong co choco)."; return }
  Head "Cai $name"
  choco install $pkg -y --no-progress
}

# ---------- 1. RUNTIME BAT BUOC ----------
if (Have node)   { Ok ("Node da co: "   + (node -v)) }            else { ChocoInstall "nodejs-lts" "Node.js LTS" }
if (Have python) { Ok ("Python da co: " + (python --version 2>&1)) } else { ChocoInstall "python" "Python" }
if (Have git)    { Ok ("Git da co: "    + (git --version)) }       else { ChocoInstall "git" "Git" }
if (Have ffmpeg) { Ok "FFmpeg da co" }                            else { ChocoInstall "ffmpeg" "FFmpeg" }

# ---------- 2. TOOL TUY CHON ----------
$doOllama = Read-Host "`nCai Ollama (translator local)? [y/N]"
if ($doOllama -match '^[yY]') { if (Have ollama) { Ok "Ollama da co" } else { ChocoInstall "ollama" "Ollama" } }
$doBlender = Read-Host "Cai Blender (Lane A - rig/mesh)? [y/N]"
if ($doBlender -match '^[yY]') { ChocoInstall "blender" "Blender" }

# Nap lai PATH sau khi cai
$env:Path = [Environment]::GetEnvironmentVariable("Path","Machine") + ";" + [Environment]::GetEnvironmentVariable("Path","User")

# ---------- 3. NODE DEPENDENCIES ----------
if (Have npm) {
  foreach ($d in @(".","mikage-server","mikage-operator","telegram_bot")) {
    $p = Join-Path $repo $d
    if (Test-Path (Join-Path $p "package.json")) {
      Head "npm install -> $d"
      Push-Location $p; npm install; Pop-Location
    }
  }
  Head "Playwright browsers"
  Push-Location $repo; npx playwright install; Pop-Location
} else { Warn "Chua co npm - mo lai cua so roi chay lai script de cai Node deps." }

# ---------- 4. PYTHON DEPENDENCIES ----------
if (Have python) {
  Head "pip install thu vien Python"
  python -m pip install --upgrade pip
  python -m pip install python-dotenv Pillow numpy requests fastapi uvicorn gradio google-genai
} else { Warn "Chua co python - mo lai cua so roi chay lai script de cai pip deps." }

# ---------- 5. KIEM TRA .ENV ----------
Head "Kiem tra .env (bi gitignore - phai khoi phuc tu backup, script khong tao duoc)"
foreach ($e in @(".env","mikage-server\.env","mikage-operator\.env","telegram_bot\.env","pipeline\.env")) {
  $full = Join-Path $repo $e
  if (Test-Path $full) { Ok ".env co: $e" } else { Warn "THIEU: $e  (API key OpenAI/Notion/Telegram/Gemini)" }
}

Head "DONE - kiem tra cac dong [!!] mau vang o tren"
Write-Host @"

Neu Chocolatey khong cai duoc, tai installer thu cong:
  Node LTS   https://nodejs.org/en/download
  Python     https://www.python.org/downloads/  (TICH 'Add to PATH')
  Git        https://git-scm.com/download/win
  FFmpeg     https://www.gyan.dev/ffmpeg/builds/
"@ -ForegroundColor DarkGray
