@echo off
REM Build TODAY's MIKAGE build-log entry: LOCOMOTION (V0.8 rider + V1.4 gait + V1.5 continuous gait).
REM Only new milestones — does NOT re-bundle the already-published 2D->form film.
REM Needs Python 3 + pillow + numpy, ffmpeg/ffprobe on PATH. Output = PROTOTYPE / local only.
cd /d "%~dp0"
python build_buildlog_locomotion.py
echo.
echo Done. Press any key to close.
pause >nul
