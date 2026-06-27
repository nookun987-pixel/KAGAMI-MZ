# MIKAGE PHASE 2 LOCK

## PHASE NAME
Training Loop Hook Into Reject Path

## STATUS
VERIFIED PASS — CLOSED

## GOAL
Hook training loop V1 vào luồng REJECT thật của orchestrator.

## PASS CRITERIA
- 1 job REJECT thật chạy thành công
- training loop auto trigger
- tạo file runs/<job_id>/training_loop_result.json
- append vào memory/training_cases.json
- có log:
  - triggered
  - failure_class
  - patch actions
  - case written
- orchestrator không crash
- finalDecision không bị thay đổi bởi training loop

## VERIFIED TRUE
- Live reject job test PASS
- training loop trigger verified
- artifact verified
- memory write verified
- pipeline safety verified
- Command Layer V1 verified
- Command Safety Protocol V1 verified
- Telegram Safety Gate applied (read-only commands only)

## NOT ALLOWED
- patched rerender
- auto second pass
- execution lane integration
- Colab / Vertex / Imagen execution
- canon promotion từ training loop
- thay đổi logic render hiện tại

## EXIT CONDITION
- SATISFIED

## NEXT PHASE (LOCKED)
PHASE 3 — Generate patched_job_spec (NO execution)

## PHASE 3 SCOPE (COMPLETED)
- Read training_loop_result.json from a REJECT run
- Read training_cases.json memory
- Generate a patched job spec JSON with corrected prompt/params
- Write patched_job_spec.json to run directory
- NO rerender, NO execution, NO Colab, NO Vertex, NO Imagen
- Output is a JSON file only — not executed

## PHASE 3 STATUS
VERIFIED PASS

## PHASE 3 VERIFIED TRUE
- patched_job_spec_generator.js built and operational
- POST /command generate_patched_job_spec active
- Inline failure derivation from post_validation + final_decision
- PROMPT_INJECTIONS action-to-prompt mapping active
- Signal enrichment from final_decision rich data
- Historical pattern lookup from training_cases.json
- Prompt diff with full provenance output
- patched_job_spec.json written to MASK_MACRO_RETEST_2026-03-31T16-09-45

## PHASE 4 SCOPE (COMPLETED)
- Execution result contract (EXECUTED/REJECTED/EXECUTION_UNAVAILABLE/FAILED)
- Execution dispatcher with adapter registry
- Adapter interface (BaseAdapter pattern)
- First adapter: dry_run (validates contract, simulates execution)
- Artifact logging (execution_result.json to run directory)
- POST /command execute_patched_job_spec active

## PHASE 4 STATUS
VERIFIED PASS

## PHASE 5 SCOPE (COMPLETED)
- Real Fooocus render adapter (fooocus_adapter.js)
- Calls http://127.0.0.1:7865/generate
- Patched job spec → Fooocus render payload conversion
- Output.png existence verification (fail closed)
- fooocus_render_payload.json audit artifact
- Async dispatcher + async handleCommand
- Fooocus adapter priority over dry_run fallback

## PHASE 5 STATUS
VERIFIED PASS

## PHASE 5 VERIFIED TRUE
- fooocus_adapter.js built and operational
- Fooocus health check with async resolution
- Real HTTP call to /generate proven
- Fail closed on missing output.png verified
- Fallback to dry_run when Fooocus unavailable
- execution_result.json + fooocus_render_payload.json artifacts written
- Full state machine traced end-to-end

## NEXT PHASE (PHASE 6)
NOT DEFINED — decide scope from saved state
