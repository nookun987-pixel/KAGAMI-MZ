@echo off
cd /d %~dp0
node control_plane\local_control_agent\index.js
pause
