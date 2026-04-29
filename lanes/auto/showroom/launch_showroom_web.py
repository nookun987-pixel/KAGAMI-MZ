"""
Launch mikage_auto_showroom web server from this lane directory.
Intended to be run with pythonw (no console) so hub/showroom bat does not leave spare CMD windows.
"""
from __future__ import annotations

import importlib.util
import os
import pathlib
import runpy
import sys
import types


def _bootstrap_mikage_auto_scout() -> None:
    """Register mikage_auto_scout from lanes/auto/scout (on-disk folder is `scout`, not mikage_auto_scout)."""
    package_name = "mikage_auto_scout"
    if package_name in sys.modules:
        return
    package_dir = pathlib.Path(__file__).resolve().parent.parent / "scout"
    init_py = package_dir / "__init__.py"
    spec = importlib.util.spec_from_file_location(
        package_name,
        init_py,
        submodule_search_locations=[str(package_dir)],
    )
    if spec is None or spec.loader is None:
        raise ImportError(f"Unable to bootstrap {package_name} from {package_dir}.")
    module = importlib.util.module_from_spec(spec)
    sys.modules[package_name] = module
    spec.loader.exec_module(module)


def main() -> None:
    _bootstrap_mikage_auto_scout()
    lane_dir = pathlib.Path(__file__).resolve().parent
    host = os.environ.get("SHOWROOM_HOST", "127.0.0.1")
    port = os.environ.get("SHOWROOM_PORT", "8899")
    pkg = types.ModuleType("mikage_auto_showroom")
    pkg.__path__ = [str(lane_dir)]
    sys.modules["mikage_auto_showroom"] = pkg
    sys.argv = ["mikage_auto_showroom", "web", "--host", host, "--port", port]
    runpy.run_module("mikage_auto_showroom.__main__", run_name="__main__")


if __name__ == "__main__":
    main()
