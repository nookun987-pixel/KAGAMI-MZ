# ARTIFACT CONTRACT

## Minimum Files For PASS

- `claims/<job_id>.claim.json`
- `outputs/<job_id>/result.json`
- `outputs/<job_id>/output.png`
- `traces/<job_id>/attempt-XX/final_decision.json`

## Additional File For Quality-Proof Paths

- `outputs/<job_id>/judge_output.json`

## ALLOW Conditions

- required artifacts exist
- validator passes
- lane completion policy is satisfied
- final decision is `ALLOW`

## AUTO REJECT Conditions

- no image
- no result.json
- malformed result
- validator fail
- timeout
- stale claim
- required lane artifacts missing

## What Counts As Real Proof

- shared-drive artifact path
- trace `final_decision.json`
- exact same job id across the proof chain
