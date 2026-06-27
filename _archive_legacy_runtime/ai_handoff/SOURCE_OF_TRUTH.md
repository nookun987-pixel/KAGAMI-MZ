# SOURCE OF TRUTH

## Rank 1: real_artifacts

- trust: highest
- status: active
- description: Real artifact files produced by the active runtime and traces are the primary source of truth.
- paths:
  - G:/My Drive/mikage_runner/job_inbox/<job_id>.json
  - G:/My Drive/mikage_runner/claims/<job_id>.claim.json
  - G:/My Drive/mikage_runner/outputs/<job_id>/output.png
  - G:/My Drive/mikage_runner/outputs/<job_id>/judge_output.json
  - G:/My Drive/mikage_runner/outputs/<job_id>/result.json
  - traces/<job_id>/attempt-XX/final_decision.json

## Rank 2: active_code

- trust: high
- status: active
- description: Active runtime logic lives in the hub, modules, image lane, drive queue runtime, and Colab worker notebook.
- paths:
  - MIKAGE/index.js
  - MIKAGE/modules
  - MIKAGE/lanes/image
  - runtime/drive_queue/runtime.js
  - runtime/colab_worker/colab_one_click_worker.ipynb

## Rank 3: approved_memory

- trust: medium
- status: active
- description: Approved memory and judge cache may guide future runs but do not override missing artifacts.
- paths:
  - MIKAGE/shared/memory
  - memory/approved_variant_registry.json
  - memory/judge_cache.json

## Rank 4: historical_notes

- trust: low
- status: untrusted
- description: Historical chats, ad hoc notes, and legacy docs are not trusted unless verified against active code or artifacts.
- paths:
  - old chats
  - stale notes
  - legacy docs outside docs/ai_handoff

## Rule

- real artifacts outrank active code
- active code outranks approved memory
- old chats and stale logs are untrusted unless re-proven from repo or artifacts
