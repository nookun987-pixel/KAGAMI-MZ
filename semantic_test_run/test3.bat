@echo off
set USE_VISION_VALIDATOR=true
set VLM_ENDPOINT=
set NODE_ENV=production
cd /d D:\KAGAMI-MZ
node orchestrator.js "D:\KAGAMI-MZ\semantic_test_run\job_vlm_dependency.json" > "D:\KAGAMI-MZ\semantic_test_run\console3.log" 2>&1
echo %ERRORLEVEL%