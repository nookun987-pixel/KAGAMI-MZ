@echo off
setlocal
cd /d "%~dp0\.."
python tools\mikage_github_agent_bridge.py pull --repo nookun987-pixel/KAGAMI-MZ --label mikage-task --out "%TEMP%\mikage_agent_queue"
endlocal
