@echo off
REM ============================================================
REM  MIKAGE ZENITH - SETUP.bat
REM  Double-click de chay. Tu xin quyen Admin roi goi setup_windows.ps1
REM ============================================================
net session >nul 2>&1
if %errorLevel% neq 0 (
  echo [SETUP] Dang xin quyen Administrator...
  powershell -Command "Start-Process -FilePath '%~f0' -Verb RunAs"
  exit /b
)
cd /d "%~dp0"
powershell -ExecutionPolicy Bypass -NoProfile -File "%~dp0setup_windows.ps1"
echo.
echo [SETUP] Xong. Nhan phim bat ky de dong.
pause >nul
