# Mikage Hard Gate V1

This is a non-LLM task gate for Mikage work. It uses one active task file and two local Python checks.

## Files

- `.mikage/tasks/active_task.yaml` defines the current locked task scope.
- `.mikage/tools/validate_task.py` validates required task fields and locked task type.
- `.mikage/tools/verify_output.py` validates that outputs stay inside the declared output allowlist.

## Gate Rules

- The active task must include every required schema field.
- `task_type` must be one of the locked task types in `validate_task.py`.
- `output_folder_allowed` must exist.
- `output_files_allowed` must be non-empty.
- `verify_output.py` scans only `output_folder_allowed`.
- Any file in the output folder that is not listed in `output_files_allowed` fails verification.
- `CONTACT_SHEET_ONLY` allows only `contact_sheet.png` and `contact_sheet_review_report.md`.
- `CONTACT_SHEET_ONLY` fails if any `.mp4` exists in the output folder.

## Commands

```powershell
python .mikage\tools\validate_task.py
python .mikage\tools\verify_output.py
```

Only `verify_output.py` is allowed to print the final gate `PASS`.
