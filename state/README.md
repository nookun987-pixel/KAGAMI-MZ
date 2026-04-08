# State Directory

This directory stores machine-readable manifests used by the AI handoff pack.

Active handoff manifests:

- `module_registry.json`
- `runtime_status_snapshot.json`
- `active_files_manifest.json`
- `source_of_truth_manifest.json`
- `deprecated_paths_manifest.json`
- `lane_registry.json`
- `system_entrypoints.json`
- `memory_registry.json`
- `memory_ingest_queue.json`
- `memory_index_manifest.json`
- `memory_promotion_rules.json`
- `memory_decay_rules.json`

Rules:

- These files document current repo state only.
- They do not authorize runtime bypasses.
- If a fact is not proven from code or artifact contract, it must be marked `UNVERIFIED` or `UNKNOWN_NOT_PROVEN`.
