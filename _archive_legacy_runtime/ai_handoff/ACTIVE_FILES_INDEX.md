# ACTIVE FILES INDEX

## HUB FILES

- path: `MIKAGE/index.js`
  role: Single orchestration hub for module-controlled runtime flow.
  status: active
  confidence: proven_from_repo
- path: `start_mikage.bat`
  role: Batch entrypoint that verifies Drive queue folders before launching the hub.
  status: active
  confidence: proven_from_repo

## MODULE FILES

- path: `MIKAGE/modules/intake/index.js`
  role: Normalize input and inject canon and variation context.
  status: active
  confidence: proven_from_repo
- path: `MIKAGE/modules/generation/index.js`
  role: Dispatch live lane and return raw generation result.
  status: active
  confidence: proven_from_repo
- path: `MIKAGE/modules/validation/index.js`
  role: Finalize run monitor and shape validation outputs.
  status: active
  confidence: proven_from_repo
- path: `MIKAGE/modules/decision/index.js`
  role: Build effective decision, retry decision, and repair action.
  status: active
  confidence: proven_from_repo
- path: `MIKAGE/modules/memory/index.js`
  role: Expose memory runtime interface and current placeholder persistence hook.
  status: active
  confidence: proven_from_repo

## LANE FILES

- path: `MIKAGE/lanes/image/image_intake.js`
  role: Image-lane prompt and payload preparation.
  status: active
  confidence: proven_from_repo
- path: `MIKAGE/lanes/image/image_executor.js`
  role: Image-lane Drive queue adapter and result collector.
  status: active
  confidence: proven_from_repo
- path: `MIKAGE/lanes/image/image_validator.js`
  role: Image-lane artifact and live judge validation.
  status: active
  confidence: proven_from_repo
- path: `MIKAGE/lanes/cine/cine_executor.js`
  role: Additional lane placeholder only.
  status: placeholder
  confidence: unverified_runtime
- path: `MIKAGE/lanes/game/game_executor.js`
  role: Additional lane placeholder only.
  status: placeholder
  confidence: unverified_runtime
- path: `MIKAGE/lanes/content/content_executor.js`
  role: Additional lane placeholder only.
  status: placeholder
  confidence: unverified_runtime
- path: `MIKAGE/lanes/ops/ops_executor.js`
  role: Additional lane placeholder only.
  status: placeholder
  confidence: unverified_runtime

## VALIDATOR FILES

- path: `MIKAGE/control_plane/run_monitor.js`
  role: Lane-agnostic monitor finalization and issue detection.
  status: active
  confidence: proven_from_repo
- path: `MIKAGE/control_plane/final_judge.js`
  role: Lane-policy-based final judge with no image-less allow path.
  status: active
  confidence: proven_from_repo
- path: `evaluation/quality_failure_extractor.js`
  role: Build structured quality failure packet from live judge output.
  status: active
  confidence: proven_from_repo
- path: `evaluation/variant_judge.js`
  role: Deterministic variant judge with cache and consistency controls.
  status: active
  confidence: proven_from_repo

## JUDGE FILES

- path: `critic/vision_critic.js`
  role: Live-or-unavailable vision critic path. Not the source of final allow by itself.
  status: active
  confidence: proven_from_repo
- path: `critic/rule_critic.js`
  role: Rule critic that must return unavailable rather than fabricate.
  status: active
  confidence: proven_from_repo
- path: `critic/critic_merge.js`
  role: Merge judge signals into stable schema.
  status: active
  confidence: proven_from_repo
- path: `memory/judge_cache.json`
  role: Persistent deterministic verdict cache keyed by normalized judge input and image hash.
  status: active
  confidence: proven_from_repo

## MEMORY FILES

- path: `MIKAGE/control_plane/control_memory.js`
  role: Primary active control-memory implementation.
  status: active
  confidence: proven_from_repo
- path: `MIKAGE/shared/memory/run_history.json`
  role: Active run history backing file.
  status: active
  confidence: proven_from_repo
- path: `MIKAGE/shared/memory/lane_registry.json`
  role: Active lane registry backing file.
  status: active
  confidence: proven_from_repo
- path: `MIKAGE/shared/memory/canon_memory.json`
  role: Active canon memory backing file.
  status: active
  confidence: proven_from_repo
- path: `memory/approved_variant_registry.json`
  role: Approved-variant memory registry used by controlled evolution.
  status: active
  confidence: proven_from_repo

## TRACE FILES

- path: `execution/raw_trace_store.js`
  role: Writes per-attempt trace artifacts including final_decision.json.
  status: active
  confidence: proven_from_repo
- path: `execution/quality_delta_reporter.js`
  role: Writes quality delta report for retries and comparisons.
  status: active
  confidence: proven_from_repo
- path: `traces/batch_variant_summary.json`
  role: Latest known batch summary artifact, present when controlled-evolution batch ran.
  status: artifact
  confidence: repo_artifact
- path: `traces/batch_variant_report.md`
  role: Latest known batch report artifact, present when controlled-evolution batch ran.
  status: artifact
  confidence: repo_artifact

## RUNTIME FILES

- path: `runtime/drive_queue/runtime.js`
  role: Single active Drive queue runtime contract.
  status: active
  confidence: proven_from_repo
- path: `runtime/colab_worker/colab_one_click_worker.ipynb`
  role: Live worker notebook path when Colab worker is in use.
  status: active
  confidence: proven_from_repo
