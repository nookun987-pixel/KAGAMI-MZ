@echo off
REM Build MIKAGE build-log entry: STANDING HERO V0_7 — FULL 0->final arc (operator request 2026-07-02,
REM corrections 2026-07-03 x5): blockout -> match-to-master -> helmet V0.3-0.7 -> lookdev V0.8 -> lookdev
REM V0.8.1 hue fix -> body V0.9-0.11 -> assembly V0.12 -> polish V0.13 -> ASSET-LOCK V0.14 ->
REM Canvas MOTION V0.2 (UNGRADED, slit-violet hue-safe).
REM V0_3 = rostrum-camera pans across the multi-panel review sheets + caption text.
REM V0_4 = fixed missing-glyph arrow (tofu boxes) + added the V0.8.1 hue-fix milestone.
REM V0_5 = cropped each sheet to one panel + held it, still with a caption overlay - operator
REM reported the crop kept cutting off the head/helmet and picking the wrong panel.
REM V0_6 = operator instruction "bo het text di chi gom anh truoc" - dropped ALL caption text,
REM showed the FULL source image every time (no crop), letterboxed and held. Operator confirmed
REM clean, then asked for the technical caption back, read like a lyric line.
REM V0_7 = caption restored WITHOUT touching the image: image is contain-fit into the area ABOVE
REM a fixed bottom caption band (230px), so text can never overlap the render again. Version
REM chip is always on screen now too, so "which version is this" can't be ambiguous.
REM V0_1..V0_6 scripts kept for history; this runs V0_7.
REM Needs Python 3 + pillow + numpy, ffmpeg/ffprobe on PATH. Output = PROTOTYPE / local only.
cd /d "%~dp0"
python build_buildlog_standing_hero_v0_7.py
echo.
echo Done. Press any key to close.
pause >nul
