# MIKAGE SYSTEM LEDGER

## 1. CURRENT IDENTITY
- System: MIKAGE_BRAIN
- Role: Control Plane
- Deployment: Cloud Run
- Mode: CONTROL_PLANE_ONLY

## 2. CURRENT PHASE
- Phase: PHASE 5 VERIFIED PASS
- Name: Real Render Adapter V1 (Fooocus local)
- Previous: PHASE 4 (dry_run execution lane), PHASE 3 (patched_job_spec generator)

## 3. VERIFIED COMPLETED
- Training loop V1 scaffold complete
- Training loop hooked into orchestrator reject path
- Live REJECT job test passed
- training_loop_result.json artifact verified
- training_cases.json memory append verified
- Dedupe active (job_id level)
- finalDecision protected
- No-image gate enforced
- Validator executed gate enforced
- Real image existence check enforced
- Command Layer V1 verified
- POST /command active
- Command Safety Protocol V1 verified
- command_id active
- single intent registry active
- route validation active
- phase safety active
- command state machine active
- command result contract active
- command_history.json active
- Telegram Safety Gate applied
- Telegram limited to read-only / status commands only
- Telegram mutating/execution commands BLOCKED
- PHASE 3 patched_job_spec generator verified
- POST /command generate_patched_job_spec active
- patched_job_spec_generator.js operational
- Inline failure analysis derivation from post_validation + final_decision
- PROMPT_INJECTIONS action-to-prompt mapping active
- Signal enrichment from final_decision (color_fail_tokens, wrong_reads)
- Historical pattern lookup from training_cases.json active
- Prompt diff with provenance output verified
- patched_job_spec.json written to source run directory
- PHASE 4 execution lane scaffold verified (dry_run)
- Execution result contract active (EXECUTED/REJECTED/EXECUTION_UNAVAILABLE/FAILED)
- Adapter interface + registry pattern active
- Async dispatcher with adapter priority resolution
- handleCommand is async (supports real render adapters)
- PHASE 5 Fooocus real render adapter built
- fooocus_adapter.js calls http://127.0.0.1:7865/generate
- Patched job spec → Fooocus render payload conversion active
- fooocus_render_payload.json audit artifact written
- execution_result.json written to run directory
- Fail closed on missing output.png verified
- Fooocus health check with async resolution active
- Fallback to dry_run adapter when Fooocus unavailable

## 4. NOT BUILT YET
- auto retry on failed render
- second patch loop after failed render
- cloud render execution (Colab / Vertex / Imagen)
- canon promotion from learning loop
- Telegram execution command unlock
- production render adapters beyond local Fooocus

## 5. HARD ARCHITECTURE LOCK
- Brain (Control Plane) != Execution Lane
- Control plane makes all decisions
- Execution lane only executes jobs
- No validator/judge inside execution lane
- No learning loop inside execution lane
- No cloud execution logic inside brain
- Telegram is remote control only, not controller
- All commands must pass through MIKAGE_BRAIN

## 6. CURRENT LIVE ENDPOINT
- mikage-brain-417250859924.northamerica-northeast1.run.app
- status: ONLINE
- mode: CONTROL_PLANE_ONLY

## 7. CURRENT COMMAND STATUS
- Command Layer V1: VERIFIED PASS
- Command Safety Protocol V1: VERIFIED PASS
- command_map.json is single source of truth
- command_history.json is active
- blocked intents include:
  - deploy
  - promote_canon
  - execute_colab
  - execute_vertex
  - execute_imagen
  - rerender
  - auto_retry

## 8. TELEGRAM STATUS
- Safety Gate: ACTIVE
- Safe commands (read-only): /status, /latest, /queue, /system, /project, /cost, /artifacts, /help, /proof, /master_status, /image_status, /image_last, /image_fail, /image_artifacts
- Blocked commands: /run, /task, /restart, /approve, /reject, /boot, /heal, /start_all, /stop_all, /restart_all, /image_test
- Gate location: telegram_bot/router.js (SAFE_COMMANDS + BLOCKED_COMMANDS sets)

## 9. NEXT STEP ONLY
- Save state. PHASE 5 complete.
- Next: decide PHASE 6 scope from saved state
- Execution lane proven end-to-end
- Real render proven when Fooocus bridge is live
- NO auto retry
- NO second patch loop
- NO Colab / Vertex / Imagen yet

## 10. DO NOT DO
- Do not implement auto retry
- Do not implement second patch loop
- Do not integrate Colab / Vertex / Imagen yet
- Do not promote canon from training loop
- Do not open Telegram to execution commands
- Do not add validator/judge inside execution lane

## 11. LAST VERIFIED DATE
- 2026-04-05T20:50:00+07:00
