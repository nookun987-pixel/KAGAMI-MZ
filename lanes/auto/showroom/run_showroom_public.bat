@echo off
setlocal
set "LANE_DIR=%~dp0"
cd /d "%LANE_DIR%"

if not exist "%LANE_DIR%input" mkdir "%LANE_DIR%input"
if not exist "%LANE_DIR%output" mkdir "%LANE_DIR%output"
if not exist "%LANE_DIR%logs" mkdir "%LANE_DIR%logs"

set "INPUT_JSON=%LANE_DIR%input\input.json"
set "HOST=127.0.0.1"
set "PORT=8899"
set "PUBLIC=true"

if exist "%INPUT_JSON%" (
  for /f "usebackq delims=" %%I in (`powershell -NoProfile -Command "$j = Get-Content -Raw '%INPUT_JSON%' | ConvertFrom-Json; if ($j.payload.host) { $j.payload.host } else { '127.0.0.1' }"`) do set "HOST=%%I"
  for /f "usebackq delims=" %%I in (`powershell -NoProfile -Command "$j = Get-Content -Raw '%INPUT_JSON%' | ConvertFrom-Json; if ($j.payload.port) { $j.payload.port } else { '8899' }"`) do set "PORT=%%I"
  for /f "usebackq delims=" %%I in (`powershell -NoProfile -Command "$j = Get-Content -Raw '%INPUT_JSON%' | ConvertFrom-Json; if ($null -ne $j.payload.public_tunnel) { [string]$j.payload.public_tunnel } else { 'true' }"`) do set "PUBLIC=%%I"
)

start "SHOWROOM_LOCAL" cmd /k "python -c \"import pathlib, runpy, sys, types; root = pathlib.Path(r'%LANE_DIR%'); pkg = types.ModuleType('mikage_auto_showroom'); pkg.__path__ = [str(root)]; sys.modules['mikage_auto_showroom'] = pkg; sys.argv = ['mikage_auto_showroom', 'web', '--host', r'%HOST%', '--port', r'%PORT%']; runpy.run_module('mikage_auto_showroom.__main__', run_name='__main__')\""
timeout /t 3 >nul
if /I "%PUBLIC%"=="true" start "SHOWROOM_PUBLIC" cmd /k "\"D:\tools\ngrok.exe\" http %PORT%"

powershell -NoProfile -Command "$out = @{ status = 'PASS'; result_summary = 'Auto showroom launch requested.'; artifacts = @() } | ConvertTo-Json -Depth 4; Set-Content -LiteralPath '%LANE_DIR%output\output.json' -Value $out -Encoding UTF8"
