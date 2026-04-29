@echo off
setlocal
cd /d "%~dp0"

REM Primary business path: pasted renter text -> real-demand sale-ready CSV
set PYTHONIOENCODING=utf-8
python run_vcp_rent_scout.py --real-demand-only
set EC=%ERRORLEVEL%

if %EC% neq 0 (
  echo.
  echo [FAIL] real-demand batch exit code %EC%
  echo Check: Python on PATH, profile_VCP_RENT_DEMAND.json, input_real_demand\*.txt
  pause
  exit /b %EC%
)

echo.
echo [OK] Output: %CD%\output_vcp_real_demand_sale_ready.csv
echo       Notes:  %CD%\REAL_DEMAND_HANDOFF.md
echo.
pause
endlocal
