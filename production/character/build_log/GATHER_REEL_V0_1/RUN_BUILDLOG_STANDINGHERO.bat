@echo off
REM Build MIKAGE build-log entry: STANDING HERO V0_2 — FULL 0->final arc (operator request 2026-07-02):
REM blockout -> match-to-master -> helmet V0.3-0.7 -> lookdev V0.8 -> body V0.9-0.11 -> assembly V0.12
REM -> polish V0.13 -> ASSET-LOCK V0.14 -> Canvas MOTION V0.2 (UNGRADED, slit-violet hue-safe).
REM V0_3 = rostrum-camera pans across the multi-panel review sheets + REAL per-round FLAG/RULING
REM notes on a bottom scrim (operator correction: don't paste sheets whole).
REM V0_1/V0_2 scripts kept for history; this runs V0_3.
REM Needs Python 3 + pillow + numpy, ffmpeg/ffprobe on PATH. Output = PROTOTYPE / local only.
cd /d "%~dp0"
python build_buildlog_standing_hero_v0_3.py
echo.
echo Done. Press any key to close.
pause >nul
