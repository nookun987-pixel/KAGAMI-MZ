# HARD GATE TEST REPORT V1.1

## Dirty Baseline Approval

- DIRTY_BASELINE_APPROVED: YES
- APPROVED_DIRTY_PATH: `.mikage/`
- APPROVAL_SCOPE: `PATCH_MIKAGE_HARD_GATE_SCRIPTS_V1_1`
- REASON: V1 hard-gate files were intentionally left uncommitted pending this V1.1 safety patch.

## Files Patched

- `.mikage/tools/validate_task.py`
- `.mikage/tools/verify_output.py`

## Commands Run

- `Get-Content -Raw AGENTS.md`
- `Get-Content -Raw docs\agent_dev_task_board.md`
- `Get-Content -Raw docs\architecture\MIKAGE_AUTOPILOT_GUARD_V0.md`
- `Get-Content -Raw docs\architecture\MIKAGE_REPO_BUTLER_MAP.md`
- `Get-Content -Raw .mikage\tasks\active_task.yaml`
- `Get-Content -Raw .mikage\tools\validate_task.py`
- `Get-Content -Raw .mikage\tools\verify_output.py`
- `Get-Content -Raw .mikage\README_HARD_GATE_V1.md`
- `Get-Content -Raw .mikage\HARD_GATE_TEST_REPORT_V1.md`
- `python .mikage\tools\validate_task.py` -> `PASS`
- `python .mikage\tools\verify_output.py` with allowed files only -> `PASS`
- `python .mikage\tools\verify_output.py` with direct `bad_render.mp4` -> `FAIL: CONTACT_SHEET_ONLY forbids mp4 output: bad_render.mp4`
- `Remove-Item -LiteralPath .mikage\test_output\GLASS_SKIN_JP\short_review\bad_render.mp4`
- `New-Item -ItemType Directory -Force .mikage\test_output\GLASS_SKIN_JP\short_review\nested_bad | Select-Object FullName`
- `python .mikage\tools\verify_output.py` with nested `nested_bad\bad_render.mp4` -> `FAIL: CONTACT_SHEET_ONLY forbids mp4 output: nested_bad/bad_render.mp4`
- `Remove-Item -LiteralPath .mikage\test_output\GLASS_SKIN_JP\short_review\nested_bad -Recurse`
- `python .mikage\tools\verify_output.py` after cleanup -> `PASS`
- `git status --porcelain=v1` -> `?? .mikage/`

## Direct MP4 Rejection Result

```text
FAIL: CONTACT_SHEET_ONLY forbids mp4 output: bad_render.mp4
```

## Nested MP4 Rejection Result

```text
FAIL: CONTACT_SHEET_ONLY forbids mp4 output: nested_bad/bad_render.mp4
```

## Final Verification Result

```text
PASS
```

## Git Status

```text
?? .mikage/
```
