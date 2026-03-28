@echo off
set USE_VISION_VALIDATOR=true
set VLM_ENDPOINT=http://localhost:11434/v1/chat/completions
set NODE_ENV=production
cd /d D:\KAGAMI-MZ
node orchestrator.js "D:\KAGAMI-MZ\semantic_test_run\job_auto_retry.json" > "D:\KAGAMI-MZ\semantic_test_run\console2.log" 2>&1
echo %ERRORLEVEL%