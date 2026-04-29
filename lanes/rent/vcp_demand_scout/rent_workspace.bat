@echo off
cd /d D:\KAGAMI-MZ\lanes\rent\vcp_demand_scout

set "REAL_DEMAND_OUTPUT=D:\KAGAMI-MZ\lanes\rent\vcp_demand_scout\output_vcp_real_demand_sale_ready.csv"
set "MAIN_OUTPUT=D:\KAGAMI-MZ\lanes\rent\vcp_demand_scout\output_vcp_demand_sale_ready.csv"
set "FALLBACK_OUTPUT=D:\KAGAMI-MZ\lanes\rent\vcp_demand_scout\output_vcp_demand_leads.csv"

:menu
cls
echo ===============================
echo  RENT SCANNER - CAN HO
echo ===============================
echo 1. RUN FULL (URL + real-demand folder^)
echo 2. RUN REAL-DEMAND BATCH ONLY (paste vao input_real_demand^)
echo 3. OPEN REAL-DEMAND CSV (primary^)
echo 4. OPEN LISTING SALE-READY CSV (legacy^)
echo 0. BACK / EXIT
echo ===============================
set /p choice=Chon: 

if "%choice%"=="1" goto runscan
if "%choice%"=="2" goto runreal
if "%choice%"=="3" goto openreal
if "%choice%"=="4" goto openlisting
if "%choice%"=="0" exit
goto menu

:runscan
cls
echo STATUS: RENT SCANNER RUNNING (full^)
set PYTHONIOENCODING=utf-8
python "D:\KAGAMI-MZ\lanes\rent\vcp_demand_scout\run_vcp_rent_scout.py"
if errorlevel 1 goto scanner_fail
goto openreal

:runreal
cls
echo STATUS: REAL-DEMAND BATCH ONLY
set PYTHONIOENCODING=utf-8
python "D:\KAGAMI-MZ\lanes\rent\vcp_demand_scout\run_vcp_rent_scout.py" --real-demand-only
if errorlevel 1 goto scanner_fail
goto openreal

:openreal
cls
if exist "%REAL_DEMAND_OUTPUT%" (
    start "" "%REAL_DEMAND_OUTPUT%"
    goto menu
)
echo REAL-DEMAND CSV chua co. Chay option 1 hoac 2.
pause
goto menu

:openlisting
cls
if exist "%MAIN_OUTPUT%" (
    start "" "%MAIN_OUTPUT%"
    goto menu
)
if exist "%FALLBACK_OUTPUT%" (
    start "" "%FALLBACK_OUTPUT%"
    goto menu
)
echo STATUS: FAIL
echo ERROR_REASON: OUTPUT FILE NOT FOUND
echo NEXT_ACTION: CHECK RENT SCAN OUTPUT CSV
pause
goto menu

:scanner_fail
echo STATUS: FAIL
echo ERROR_REASON: PYTHON OR SCANNER FAILED
echo NEXT_ACTION: CHECK PYTHON PATH OR run_vcp_rent_scout.py
pause
goto menu
