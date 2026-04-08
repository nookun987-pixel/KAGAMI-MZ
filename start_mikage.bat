@echo off
setlocal
if "%DRIVE_ROOT%"=="" (
  echo [MIKAGE] DRIVE_ROOT is required.
  exit /b 1
)

if not exist "%DRIVE_ROOT%\job_inbox" (
  echo [MIKAGE] Missing Drive contract folder: %DRIVE_ROOT%\job_inbox
  exit /b 1
)

if not exist "%DRIVE_ROOT%\claims" (
  echo [MIKAGE] Missing Drive contract folder: %DRIVE_ROOT%\claims
  exit /b 1
)

if not exist "%DRIVE_ROOT%\outputs" (
  echo [MIKAGE] Missing Drive contract folder: %DRIVE_ROOT%\outputs
  exit /b 1
)

node "%~dp0MIKAGE\index.js" %*
