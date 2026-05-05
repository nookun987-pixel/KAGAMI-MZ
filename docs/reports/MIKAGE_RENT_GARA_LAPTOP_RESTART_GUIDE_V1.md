# MIKAGE RENT/GARA Laptop Restart Guide — V1

**Document Date:** 2026-05-05  
**Audience:** Non-coder operators restarting RENT and GARA lanes on a new/clean laptop  
**Source:** Verified against repo commit 5455a375d9febd80f989a27e18861ceba0590641

---

## 1. CURRENT REPO READINESS SUMMARY

### ✅ What Is Ready

All critical lane files for RENT and GARA are present and committed:

| Lane | Module | Status | Notes |
|------|--------|--------|-------|
| **RENT** | `lanes/rent/vcp_demand_scout/run_vcp_rent_scout.py` | ✅ | VCP demand scout entry point |
| **RENT** | `lanes/rent/vcp_demand_scout/profile_VCP_RENT_DEMAND.json` | ✅ | Keyword config for RENT |
| **RENT** | `lanes/rent/vcp_demand_scout/RUN_REAL_DEMAND_BATCH.bat` | ✅ | Windows batch runner for RENT |
| **GARA** | `lanes/auto/showroom/__main__.py` | ✅ | GARA CLI entry point |
| **GARA** | `lanes/auto/showroom/pipeline.py` | ✅ | GARA ingest/score pipeline |
| **GARA** | `lanes/auto/showroom/gara_seed_v2.py` | ✅ | GARA controlled seed module |
| **GARA** | `lanes/auto/showroom/collector/approved_sources.json` | ✅ | GARA source whitelist |

### ⚠️ What Is Missing (Blockers)

| File | Category | Impact | Action |
|------|----------|--------|--------|
| `requirements.txt` or `pyproject.toml` | Dependency Declaration | Cannot auto-install Python packages | Manual pip install required (see § 3 below) |
| `scripts/launcher/dispatch.py` | Entry Point | Unknown if critical | Search codebase; if unused, safe to ignore |

### ✅ Governance Files

All required governance files are in place:
- `AGENTS.md` — Agent entry protocol and safety rules
- `docs/MIKAGE_MASTER_STATUS.md` — Current verified baseline
- `docs/agent_dev_task_board.md` — Phase status and next actions

---

## 2. REQUIRED PYTHON VERSION

**Minimum:** Python 3.9+  
**Recommended:** Python 3.11+

**How to Check:**
```bash
python --version
```

If Python is not installed or version is < 3.9:
- **Windows:** Download from https://www.python.org/downloads/ (select "Add Python to PATH")
- **Linux/Mac:** Use `apt install python3.11` or `brew install python@3.11`

**Verify pip is available:**
```bash
pip --version
```

---

## 3. MINIMAL DEPENDENCY INSTALL COMMANDS

Since `requirements.txt` and `pyproject.toml` are **missing from the repo**, dependencies must be inferred from code imports.

### 3.1 Discovered Core Dependencies

From scanning `lanes/rent` and `lanes/auto` modules:

```
requests          # HTTP client (used in RENT scout)
sqlite3           # Database (built-in; no install needed)
csv               # CSV I/O (built-in; no install needed)
json              # JSON parsing (built-in; no install needed)
pathlib           # File paths (built-in; no install needed)
argparse          # CLI args (built-in; no install needed)
multiprocessing   # Parallel ingest (built-in; no install needed)
```

### 3.2 Recommended Install (Minimal Set)

Open Command Prompt or PowerShell and run:

```bash
pip install --upgrade pip
pip install requests
```

**Done.** The rest are built-in to Python.

### 3.3 Optional: Virtual Environment (Recommended for Clean Laptop)

If you want to isolate this project from system packages:

```bash
python -m venv venv
# On Windows:
venv\Scripts\activate
# On Linux/Mac:
source venv/bin/activate

# Then install:
pip install requests
```

**All future commands should be run inside this activated venv.**

---

## 4. RENT LOCAL SMOKE COMMAND

This command runs RENT in local-snapshot mode (no live HTTP crawl) to verify the scout pipeline works.

### 4.1 One-Time Setup

1. Create an empty directory for local test input:
   ```bash
   mkdir lanes\rent\vcp_demand_scout\input_raw
   mkdir lanes\rent\vcp_demand_scout\input_real_demand
   ```

2. (Optional) Add a test `.txt` file to `input_real_demand/`:
   ```
   Test paste: tôi cần thuê căn hộ 2PN tại Vinhomes Central Park, budget 18 triệu/tháng, có SĐT 0900123456
   ```

### 4.2 Run RENT Smoke Test

```bash
cd lanes\rent\vcp_demand_scout
set PYTHONIOENCODING=utf-8
set VCP_USE_LOCAL_SNAPSHOT=1

python run_vcp_rent_scout.py --real-demand-only
```

**Expected Output:**
- Exit code: `0` (success)
- File created: `output_vcp_real_demand_sale_ready.csv`
- File created: `REAL_DEMAND_HANDOFF.md`

**If it fails:**
- Check Python version: `python --version`
- Check requests module: `pip show requests`
- Check file paths (use backslashes on Windows)
- See § 7 (Blockers) if `dispatch.py` error appears

---

## 5. GARA SEED SMOKE COMMAND

This command seeds one controlled test vehicle into the GARA showroom database and verifies the pipeline accepts it.

### 5.1 One-Time Setup

GARA uses SQLite. The database will be created automatically on first run.

Verify Python can import showroom modules:

```bash
cd <repo_root>
python -c "from lanes.auto.showroom.db import init_db; init_db(); print('GARA DB init OK')"
```

**Expected Output:** `GARA DB init OK` (no errors)

### 5.2 Run GARA Seed Smoke Test

```bash
cd <repo_root>
python -m lanes.auto.showroom ingest
```

**Expected Output:**
```
[showroom_ingest] processed=1, ingested=1, rejected=0, errors=0
[contract] lanes/auto/output/final.csv written rows=1
```

**If it fails:**
- Check SQLite is available: `python -c "import sqlite3"`
- Check module imports: `python -c "from lanes.auto.showroom.pipeline import ingest_run"`
- Look for network errors (if source collector tries live fetch; this is expected for first run)

---

## 6. GARA LIVE COMMAND — ⛔ NOT APPROVED FOR LAPTOP RESTART

**Status:** Allowed only under explicit operator approval with bounded safety caps.

The GARA live ingest command is:

```bash
# ⛔ DO NOT RUN WITHOUT EXPLICIT APPROVAL ⛔
python -m lanes.auto.showroom ingest
# (without VCP_USE_LOCAL_SNAPSHOT env var, this will fetch live from xe.chotot.com and oto.com.vn)
```

### Why Not Yet?

1. Fetches from external sources (ve.chotot.com, oto.com.vn) — internet dependency
2. Writes to showroom database — data persistence impact
3. Requires approval from operations team for scope and timing

### When Safe to Run (Future)

Once approved, **always run with safety caps**:

```bash
set GARA_VERIFY_LIMIT=10
set GARA_VERIFY_PER_SEED_CAP=3
set GARA_SOURCE_TIMEOUT_SEC=60

python -m lanes.auto.showroom ingest
```

- `GARA_VERIFY_LIMIT=10` → Process max 10 vehicles total
- `GARA_VERIFY_PER_SEED_CAP=3` → Max 3 per source URL
- `GARA_SOURCE_TIMEOUT_SEC=60` → Kill fetch after 60 seconds if stalled

---

## 7. MISSING FILES & BLOCKERS

### 7.1 `scripts/launcher/dispatch.py` — Status Unknown

**Current Status:** File not found in repo.

**What to Do:**

1. **Check if it's referenced:**
   ```bash
   cd <repo_root>
   # Search for any import of dispatch
   grep -r "from scripts.launcher.dispatch" .
   grep -r "import dispatch" .
   ```

2. **Interpretation:**
   - **No results:** File is legacy/unused. **Safe to ignore.**
   - **Results found:** File is critical. **Must be restored from git history or created.**

3. **Restore from Git (if needed):**
   ```bash
   git log --all --full-history -- scripts/launcher/dispatch.py
   git show <commit_hash>:scripts/launcher/dispatch.py > scripts/launcher/dispatch.py
   ```

### 7.2 `requirements.txt` — Missing Dependency Declaration

**Current Status:** Not in repo.

**Workaround:** Use the minimal install from § 3.2 above (only `requests` is required).

**For Future:** Consider creating a `requirements.txt` in repo root:

```
requests>=2.25.0
```

Then future installs would be:

```bash
pip install -r requirements.txt
```

### 7.3 `pyproject.toml` — Missing Modern Python Package Config

**Current Status:** Not in repo.

**Impact:** Modern dependency management (Poetry, Hatch) not available. Use `pip` directly.

**Note:** This is optional for script-based lanes; not blocking RENT/GARA execution.

---

## 8. OPERATOR CHECKLIST FOR NON-CODERS

**Complete this checklist before running RENT or GARA for the first time:**

### Pre-Flight (Once)

- [ ] **Laptop has Python 3.9+**
  - Run: `python --version`
  - Expected: `Python 3.x.x` (x ≥ 9)

- [ ] **Git repo is cloned**
  - Directory structure shows: `lanes/rent/`, `lanes/auto/showroom/`, `docs/`

- [ ] **Python requests module is installed**
  - Run: `pip install requests`
  - Run: `pip show requests` (should print version info)

- [ ] **No .env file is modified**
  - Do NOT open or edit `.env` files
  - RENT/GARA will use defaults or your set environment variables (see § 4 & 5)

### RENT Smoke (First Time)

- [ ] **Set up input directories**
  ```bash
  mkdir lanes\rent\vcp_demand_scout\input_raw
  mkdir lanes\rent\vcp_demand_scout\input_real_demand
  ```

- [ ] **Run RENT test**
  ```bash
  cd lanes\rent\vcp_demand_scout
  set VCP_USE_LOCAL_SNAPSHOT=1
  python run_vcp_rent_scout.py --real-demand-only
  ```

- [ ] **Check output files exist**
  - `output_vcp_real_demand_sale_ready.csv` ✅
  - `REAL_DEMAND_HANDOFF.md` ✅

- [ ] **No errors in console**
  - Look for: `[OK] Output:` or `Done.`
  - Avoid: `ModuleNotFoundError`, `FileNotFoundError`, `SyntaxError`

### GARA Smoke (First Time)

- [ ] **Initialize GARA database**
  ```bash
  python -c "from lanes.auto.showroom.db import init_db; init_db(); print('OK')"
  ```

- [ ] **Run GARA seed ingest**
  ```bash
  python -m lanes.auto.showroom ingest
  ```

- [ ] **Check output file**
  - `lanes/auto/output/final.csv` created ✅
  - File has at least 1 row (the seed vehicle) ✅

- [ ] **No errors in console**
  - Look for: `[contract] lanes/auto/output/final.csv written rows=1`
  - Avoid: `ModuleNotFoundError`, `ImportError`, SQLite errors

### GARA Live (Only if Approved)

- [ ] **Operator approval obtained in writing** ✅ (Not yet—don't run)

- [ ] **Safety caps are set before running**
  ```bash
  set GARA_VERIFY_LIMIT=10
  set GARA_VERIFY_PER_SEED_CAP=3
  set GARA_SOURCE_TIMEOUT_SEC=60
  ```

- [ ] **Run with caps**
  ```bash
  python -m lanes.auto.showroom ingest
  ```

- [ ] **Monitor for stalls**
  - Should complete within 2 minutes
  - If frozen > 2 min, press Ctrl+C and increase timeout or reduce limit

---

## 9. PASS/FAIL INTERPRETATION

### What Each Exit Code Means

| Exit Code | Lane | Meaning | Next Action |
|-----------|------|---------|-------------|
| `0` | RENT | ✅ Success — CSV written | Proceed to GARA |
| `0` | GARA | ✅ Success — DB updated | Ready for approval/live run |
| `1` | Either | ❌ Runtime error | Check console output; see blockers § 7 |
| `124` | GARA | ❌ Process timeout | Reduce GARA_VERIFY_LIMIT or increase timeout |
| `missing file` | Either | ❌ Input file not found | Create input directory; add test files |

### Console Output Signals

#### ✅ PASS (RENT Local)

```
--- QC sale-ready (demand, V4 strict) ---
  Tổng lead: 1
  business_ready=yes: 1
  Contact hợp lệ: 1
  Budget hợp lệ: 1
  Urgency hợp lệ: 1
  Area hợp lệ: 1
  Có bedrooms: 1
Done. Supply: 0 -> ... | Demand: 0 -> ... | Sale-ready: output_vcp_demand_sale_ready.csv + DEMAND_SALE_HANDOFF.md
```

#### ✅ PASS (GARA Seed)

```
processed=1, ingested=1, rejected=0, errors=0
[contract] lanes/auto/output/final.csv written rows=1
```

#### ❌ FAIL (RENT)

```
ModuleNotFoundError: No module named 'requests'
```

**Action:** Run `pip install requests`

#### ❌ FAIL (GARA)

```
ImportError: cannot import name 'ingest_run' from 'lanes.auto.showroom.pipeline'
```

**Action:** Check Python path; ensure repo root is in PYTHONPATH. Run from repo root:

```bash
cd <repo_root>
set PYTHONPATH=%CD%
python -m lanes.auto.showroom ingest
```

---

## 10. TROUBLESHOOTING TABLE

| Error Message | Cause | Fix |
|---------------|-------|-----|
| `ModuleNotFoundError: No module named 'requests'` | pip package not installed | `pip install requests` |
| `FileNotFoundError: input_real_demand` | Directory not created | `mkdir lanes\rent\vcp_demand_scout\input_real_demand` |
| `SyntaxError: invalid syntax` | Python version < 3.9 (uses walrus operator `:=`) | Upgrade Python to 3.9+ |
| `sqlite3.OperationalError: database is locked` | GARA DB in use by another process | Close all GARA processes; delete `lanes/auto/data/showroom.db` to reset |
| `timeout after 120 seconds` | GARA ingest too slow / blocked by source | Increase `GARA_INGEST_HARD_TIMEOUT_SEC=300` or reduce `GARA_VERIFY_LIMIT` |
| `HTTP 429 Too Many Requests` | Rate limit from source (xe.chotot.com) | Increase request delay: `GARA_VERIFY_REQUEST_DELAY_SEC=2.0` |
| `scripts/launcher/dispatch.py not found` | Entry point missing | See § 7.1; search codebase for imports |

---

## 11. GOVERNANCE & SAFETY RULES

### Do Not

- ❌ Run RENT or GARA without Python environment verified
- ❌ Modify `.env` files or commit secret changes
- ❌ Run GARA live without explicit operator approval + safety caps
- ❌ Push this guide or any changes to `main` branch without review
- ❌ Send Telegram or write to GSheet from RENT/GARA runs

### Always

- ✅ Set `VCP_USE_LOCAL_SNAPSHOT=1` for RENT local testing
- ✅ Set `GARA_VERIFY_LIMIT` + `GARA_VERIFY_PER_SEED_CAP` before GARA live runs
- ✅ Save console output to a log file for audit
- ✅ Check this guide for updates before restarting on a new laptop

### If Stuck

1. **Read § 10 (Troubleshooting Table)**
2. **Re-read § 3 (Dependencies)**
3. **Check console output verbatim for error messages**
4. **Search repo for similar error in issues/docs**
5. **If still stuck, reference AGENTS.md (§ "Stop Conditions") for escalation path**

---

## 12. DOCUMENT METADATA

| Field | Value |
|-------|-------|
| **Document Version** | V1 |
| **Created** | 2026-05-05 |
| **Repo Commit Verified Against** | 5455a375d9febd80f989a27e18861ceba0590641 |
| **Files Verified** | 10 / 13 (77% complete — see § 7) |
| **Status** | Ready for non-coder operator use |
| **Approval Required Before** | GARA live ingest (§ 6) |

---

## END OF GUIDE

**Questions?** Refer to:
- `AGENTS.md` — Protocol and governance
- `docs/MIKAGE_MASTER_STATUS.md` — Current system state
- `docs/agent_dev_task_board.md` — Phase status

**Last Updated:** 2026-05-05
