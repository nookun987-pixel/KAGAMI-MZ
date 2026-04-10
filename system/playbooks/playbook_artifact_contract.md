# ARTIFACT CONTRACT PLAYBOOK

## READ IN ORDER
1. `system/source_of_truth_registry.json`
2. `core/runtime/artifact_metadata_normalizer.js`
3. `integrations/google/gcs_artifact_store.js`
4. `integrations/google/gcs_path_builder.js`
5. downstream consumers of artifact metadata

## CHECKLIST
- `artifact_type` exists
- `local_path` exists for local artifacts
- `gcs_uri` exists for uploaded cloud artifacts
- `bucket` and `object_path` are present when cloud upload is used
- `content_type` is valid
- `created_at` exists and uses stable format
- metadata shape does not silently change

## COMMON FAILURES
- metadata shape changed without updating consumers
- cloud artifact exists but GCS metadata is incomplete
- local artifact is emitted without normalized metadata
- docs describe a contract different from code

## ACCEPTANCE
- canonical metadata shape remains stable
- downstream consumers still read the same keys
- docs sync happens only after code contract is correct
