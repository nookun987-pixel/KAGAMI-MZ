# MEMORY WRITE POLICY

## PASS-Only Rule

An entry may be ingested only when all of the following are true:

- `output.png` exists
- `final_decision.json` exists
- `gemini_validation.json` exists
- `validator_executed = true`
- final decision is `ALLOW`
- no canon hard fail is present

## Skip Rules

Do not ingest:

- `REJECT` runs
- unknown runs
- infra failures
- no-image runs
- raw prompt essays
- raw execution logs
- temporary or debug JSON

## Write Principle

Memory stores normalized reusable facts only:

- approved variant data
- canon-safe rule packets
- object trait packets

If a field is not proven from artifacts, omit it or mark it `UNVERIFIED`.
