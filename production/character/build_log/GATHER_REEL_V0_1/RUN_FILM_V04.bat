@echo off
REM Build MIKAGE BUILD LOG FILM_FULL_V0_4 (appends the V1.4 "IT LEARNS TO WALK" gait chapter).
REM Needs: Python 3 + pillow + numpy, ffmpeg/ffprobe on PATH. Output stays PROTOTYPE / local only.
cd /d "%~dp0"
python build_film_v04.py
echo.
echo Done. Press any key to close.
pause >nul
