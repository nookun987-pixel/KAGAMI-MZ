# MEMORY LAYER

## Purpose

The memory layer stores verified visual truth from successful runs without changing generation, validation, or judge behavior.

## What Memory Reads From

- shared-drive output artifacts for the same verified run
- trace `final_decision.json`
- trace `gemini_validation.json`
- trace `variant_judge_output.json`
- trace `dna_lock_packet.json`
- trace `variant_spec.json`

## What Memory Never Reads From

- chat logs
- raw prompt dumps as direct memory
- debug logs
- stack traces
- rejected runs
- no-image runs
- temporary or ad hoc JSON files outside trusted artifact flow

## Plug-In Position

The current hub stays unchanged:

- intake
- generation
- validation
- decision
- memory placeholder

Phase 1 memory runs beside the hub through post-run refresh tooling. It does not alter generator behavior, validator behavior, judge logic, or `/generate`.
