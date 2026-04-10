# EXECUTION LANE PLAYBOOK

## READ IN ORDER
1. `system/source_of_truth_registry.json`
2. `core/execution_lane_router.js`
3. `core/orchestration/orchestrator.js`
4. executor file related to the target lane
5. docs flow files only after code changes are complete

## CHECKLIST
- new lane is recognized in lane resolution
- executor dispatch exists
- blocked path returns a stable result shape
- pass path returns artifacts and metadata
- DONE / PASS / REJECT semantics are consistent
- downstream normalization exists if needed

## COMMON FAILURES
- lane added but not routed
- router updated but orchestrator cannot consume result shape
- docs claim lane exists but code path is disabled
- blocked result throws instead of returning controlled status

## ACCEPTANCE
- lane logic is reachable
- result contract is stable
- no unrelated lane behavior is modified
- docs sync happens after code only
