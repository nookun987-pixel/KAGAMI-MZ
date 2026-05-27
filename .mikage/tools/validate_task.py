from __future__ import annotations

import sys
from pathlib import Path

try:
    import yaml
except ImportError:  # pragma: no cover - dependency guard
    print("FAIL: PyYAML is required to read active_task.yaml")
    sys.exit(1)


REPO_ROOT = Path(__file__).resolve().parents[2]
TASK_FILE = REPO_ROOT / ".mikage" / "tasks" / "active_task.yaml"

REQUIRED_FIELDS = [
    "task_id",
    "track_id",
    "task_type",
    "current_step",
    "input_files_allowed",
    "output_folder_allowed",
    "output_files_allowed",
    "read_only_files",
    "allowed_actions",
    "forbidden_actions",
    "pass_conditions",
    "stop_conditions",
    "verify_command",
    "next_step_if_pass",
    "next_step_if_fail",
]

LIST_FIELDS = [
    "input_files_allowed",
    "output_files_allowed",
    "read_only_files",
    "allowed_actions",
    "forbidden_actions",
    "pass_conditions",
    "stop_conditions",
]

LOCKED_TASK_TYPES = {
    "SUNO_SETUP_ONLY",
    "AUDIO_REVIEW_ONLY",
    "TRACK_LOCK_ONLY",
    "RELEASE_PACKAGE_ONLY",
    "TOOLOST_STATUS_RECORD_ONLY",
    "PLATFORM_LIVE_CHECK_ONLY",
    "CONTACT_SHEET_ONLY",
    "MP4_RENDER_ONLY",
    "VERIFY_REPORT_ONLY",
    "CATALOG_UPDATE_ONLY",
}

VERIFY_COMMAND = r"python .mikage\tools\verify_output.py"


def fail(message: str) -> None:
    print(f"FAIL: {message}")
    sys.exit(1)


def is_empty(value: object) -> bool:
    if value is None:
        return True
    if isinstance(value, str):
        return value.strip() == ""
    if isinstance(value, (list, dict, tuple, set)):
        return len(value) == 0
    return False


def load_task() -> dict:
    if not TASK_FILE.exists():
        fail(f"missing task file: {TASK_FILE}")
    with TASK_FILE.open("r", encoding="utf-8") as file:
        data = yaml.safe_load(file)
    if not isinstance(data, dict):
        fail("active task must be a YAML mapping")
    return data


def resolve_repo_path(raw_path: str) -> Path:
    path = Path(raw_path)
    if path.is_absolute():
        fail("output_folder_allowed must be repo-relative")
    resolved = (REPO_ROOT / path).resolve()
    try:
        resolved.relative_to(REPO_ROOT)
    except ValueError:
        fail(f"output_folder_allowed resolves outside repo: {resolved}")
    return resolved


def main() -> int:
    task = load_task()

    for field in REQUIRED_FIELDS:
        if field not in task or is_empty(task[field]):
            fail(f"missing or empty required field: {field}")

    for field in LIST_FIELDS:
        if not isinstance(task[field], list) or not task[field]:
            fail(f"{field} must be a non-empty list")

    if task["task_type"] not in LOCKED_TASK_TYPES:
        fail(f"task_type is not locked: {task['task_type']}")

    if task["verify_command"] != VERIFY_COMMAND:
        fail(f"verify_command must equal exactly: {VERIFY_COMMAND}")

    output_folder = resolve_repo_path(str(task["output_folder_allowed"]))
    if not output_folder.exists() or not output_folder.is_dir():
        fail(f"output_folder_allowed does not exist: {output_folder}")

    print("PASS")
    return 0


if __name__ == "__main__":
    raise SystemExit(main())
