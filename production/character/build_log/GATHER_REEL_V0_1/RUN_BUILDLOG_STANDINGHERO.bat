@echo off
REM Build MIKAGE build-log entry: STANDING HERO V0_5 — FULL 0->final arc (operator request 2026-07-02,
REM corrections 2026-07-03 x3): blockout -> match-to-master -> helmet V0.3-0.7 -> lookdev V0.8 -> lookdev
REM V0.8.1 hue fix -> body V0.9-0.11 -> assembly V0.12 -> polish V0.13 -> ASSET-LOCK V0.14 ->
REM Canvas MOTION V0.2 (UNGRADED, slit-violet hue-safe).
REM V0_3 = rostrum-camera pans across the multi-panel review sheets + REAL per-round FLAG/RULING notes.
REM V0_4 = fixed missing-glyph arrow (tofu boxes) + added the V0.8.1 hue-fix milestone.
REM V0_5 = the pan showed the WHOLE proof sheet incl. that sheet's OWN baked labels, clashing with our
REM caption ("text te le tua lua"). Fixed: crop each sheet to ONE clean panel (hero_crop, skips the
REM baked label strip) and HOLD it still (no pan/sweep) - calm, one readable caption at a time, like
REM a lyric line, matching "buoc di that cham nhung chac" (operator correction 2026-07-03).
REM V0_1/V0_2/V0_3/V0_4 scripts kept for history; this runs V0_5.
REM Needs Python 3 + pillow + numpy, ffmpeg/ffprobe on PATH. Output = PROTOTYPE / local only.
cd /d "%~dp0"
python build_buildlog_standing_hero_v0_5.py
echo.
echo Done. Press any key to close.
pause >nul
