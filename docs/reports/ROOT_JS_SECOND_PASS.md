# ROOT_JS_SECOND_PASS

## Moved to tests/e2e

- `rag_ab_impact_test.js` -> `tests/e2e/rag_ab_impact_test.js`
- `rag_vertex_e2e_test.js` -> `tests/e2e/rag_vertex_e2e_test.js`
- `google_lane_e2e_test.js` -> `tests/e2e/google_lane_e2e_test.js`
- `isolated_img2img_test.js` -> `tests/e2e/isolated_img2img_test.js`
- `run_enforcement_test.js` -> `tests/e2e/run_enforcement_test.js`
- `run_test.js` -> `tests/e2e/run_test.js`
- `simple_test.js` -> `tests/e2e/simple_test.js`
- `test-server.js` -> `tests/e2e/test-server.js`

## Moved to tests/helpers

- `minimal_test_runner.js` -> `tests/helpers/minimal_test_runner.js`

## Moved to quarantine/js_debug

- `live_verify.js` -> `quarantine/js_debug/live_verify.js`
- `bootstrap_verify.js` -> `quarantine/js_debug/bootstrap_verify.js`
- `check_audit.js` -> `quarantine/js_debug/check_audit.js`
- `check_enforcement.js` -> `quarantine/js_debug/check_enforcement.js`
- `check_vertex_readiness.js` -> `quarantine/js_debug/check_vertex_readiness.js`
- `vertex_credential_check.js` -> `quarantine/js_debug/vertex_credential_check.js`
- `final_vertex_verification.js` -> `quarantine/js_debug/final_vertex_verification.js`
- `cleanup_api.js` -> `quarantine/js_debug/cleanup_api.js`
- `cleanup_final_vertex.js` -> `quarantine/js_debug/cleanup_final_vertex.js`
- `cleanup_vertex_tests.js` -> `quarantine/js_debug/cleanup_vertex_tests.js`

## Moved to quarantine/js_patched_dupes

- `mikage_local_bridge_fixed.js` -> `quarantine/js_patched_dupes/mikage_local_bridge_fixed.js`
- `job_worker_locked.js` -> `quarantine/js_patched_dupes/job_worker_locked.js`
- `queue_manager_locked.js` -> `quarantine/js_patched_dupes/queue_manager_locked.js`
- `server_runtime_patch.js` -> `quarantine/js_patched_dupes/server_runtime_patch.js`

## Kept in root

- `claude_correction_bridge.js`
- `claude_spec_bridge.js`
- `color_rules.js`
- `command_center_server.js`
- `find_final_decision.js`
- `find_final_objects.js`
- `find_object_declarations.js`
- `fix_brief_builder.js`
- `gemini_connector.js`
- `gemini_env.js`
- `gemini_intake.js`
- `gemini_precheck.js`
- `gemini_validator.js`
- `idea_intake.js`
- `job_worker.js`
- `lane_rules.js`
- `mcp-notion-server.js`
- `mikage_local_bridge.js`
- `notion_create_task.js`
- `notion_poller.js`
- `orchestrator.js`
- `orchestrator_runtime.js`
- `queue_manager.js`
- `rescue_mask_render.js`
- `retest_mask_macro.js`
- `run_and_proof.js`
- `run_rag_tests.js`
- `run_real_vertex_validation.js`
- `run_strict_loop_proof.js`
- `runtime_adapters.js`
- `seam_pass.js`
- `server.js`
- `service_manager.js`
- `strict_image_loop.js`
- `telegram_bot_config.js`
- `worker.js`

## Unresolved js_review list

- `auto.js` -> `quarantine/js_review/auto.js`
- `p1_0_e2e_test_img2img_comparison.js` -> `quarantine/js_review/p1_0_e2e_test_img2img_comparison.js`
- `wait_and_proof.js` -> `quarantine/js_review/wait_and_proof.js`
