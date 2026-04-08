# FAILURE TRIAGE

## no claim

- verify DRIVE_ROOT contract
- verify worker queue root
- verify claim path creation

## no output

- if claim exists but no result/output, inspect worker log and runtime observation

## image missing

- no image means no pass
- inspect image validator and worker result payload

## bridge unreachable

- active path should not depend on bridge runtime
- treat bridge references as wrong path unless re-proven

## wrong endpoint

- trust only active Drive queue + Colab worker path
- unproven HTTP endpoint = UNKNOWN_NOT_PROVEN

## validator fail

- inspect analyzer_full.json and image_validator.js

## gemini fail

- inspect judge_output.json
- unavailable judge cannot support quality-proof claims

## incomplete artifacts

- require result.json + output.png + final_decision.json
