from __future__ import annotations

from pathlib import Path


# .../KAGAMI-MZ/MIKAGE/lanes/rent/rent_scout_runner.py -> repo root
REPO_ROOT = Path(__file__).resolve().parents[3]
VCP_LANE_DIR = REPO_ROOT / "lanes" / "rent" / "vcp_demand_scout"
VCP_SCOUT_SCRIPT = VCP_LANE_DIR / "run_vcp_rent_scout.py"
VCP_OUTPUT_DIR = VCP_LANE_DIR / "output"


def gsheet_sync_input_paths() -> dict[str, Path]:
    return {
        "supply_priority_live": VCP_OUTPUT_DIR / "output_vcp_supply_priority_live.csv",
        "demand_sale_ready": VCP_OUTPUT_DIR / "output_vcp_demand_sale_ready.csv",
        "batch_overview": VCP_OUTPUT_DIR / "output_vcp_batch_overview.txt",
    }

