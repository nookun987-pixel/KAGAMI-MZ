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
CONTACT_SHEET_OUTPUTS = {
    "contact_sheet.png",
    "contact_sheet_review_report.md",
}


def fail(message: str) -> None:
    print(f"FAIL: {message}")
    sys.exit(1)


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
    output_folder_raw = task.get("output_folder_allowed")
    output_files_allowed = task.get("output_files_allowed")

    if not output_folder_raw:
        fail("missing output_folder_allowed")
    if not isinstance(output_files_allowed, list) or not output_files_allowed:
        fail("output_files_allowed must be a non-empty list")

    output_folder = resolve_repo_path(str(output_folder_raw))
    if not output_folder.exists() or not output_folder.is_dir():
        fail(f"output_folder_allowed does not exist: {output_folder}")

    allowed_names = {str(name).replace("\\", "/") for name in output_files_allowed}
    task_type = str(task.get("task_type", ""))

    if task_type == "CONTACT_SHEET_ONLY" and allowed_names != CONTACT_SHEET_OUTPUTS:
        fail("CONTACT_SHEET_ONLY output_files_allowed must be contact_sheet.png and contact_sheet_review_report.md")

    paths = sorted(output_folder.rglob("*"))

    if task_type == "CONTACT_SHEET_ONLY":
        for path in paths:
            if path.is_file() and path.suffix.lower() == ".mp4":
                relative_path = path.relative_to(output_folder).as_posix()
                fail(f"CONTACT_SHEET_ONLY forbids mp4 output: {relative_path}")

    for path in paths:
        relative_path = path.relative_to(output_folder).as_posix()
        if path.is_dir():
            fail(f"unexpected output directory: {relative_path}")
        if path.is_file() and relative_path not in allowed_names:
            fail(f"unexpected output file: {relative_path}")

    print("PASS")
    return 0


if __name__ == "__main__":
    raise SystemExit(main())
