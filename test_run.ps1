$body = Get-Content 'test_job_for_server.json' -Raw
$response = Invoke-RestMethod -Uri 'http://localhost:3000/run' -Method POST -ContentType 'application/json' -Body $body
$response | ConvertTo-Json -Depth 10
