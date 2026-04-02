# Mikage System Review Package

**Package:** `D:\KAGAMI-MZ\exports\grapuco_system_review\`  
**Purpose:** External review package for Grapuco  
**Date:** 2026-03-31

---

## What This Package Is

This is a curated export of the Mikage Zenith image generation pipeline for external review. It contains:

- **Architecture files** - Core orchestration and render flow
- **Canon documents** - Visual rules and specifications
- **Validation code** - Gate and analyzer implementations
- **Sample runs** - Representative success/failure cases
- **Status summaries** - Current system state and known issues

---

## Folder Map

| Folder | Contents |
|--------|----------|
| `00_OVERVIEW/` | One-page executive brief |
| `01_ARCHITECTURE/` | Orchestrator, render executor, bridge files |
| `02_CANON_AND_RULES/` | Canon V2, structured rules, pass/fail checklist |
| `03_RENDER_FLOW/` | Prompt build, payload build, canon control |
| `04_VALIDATION_AND_GATE/` | Pixel analyzer, rule engine, VLM, Gemini gate |
| `05_SAMPLE_RUNS/` | 4 representative runs with artifacts |
| `06_KNOWN_WEAKNESSES/` | (Reserved for weakness analysis) |
| `07_NEXT_BUILD_DIRECTION/` | (Reserved for build planning) |

---

## Where to Start Reading

**For quick orientation:**
1. Start with `00_OVERVIEW/ONE_PAGE_BRIEF.md`
2. Read `SYSTEM_STATUS_SUMMARY.md`
3. Review `CHECKED_VS_UNSTABLE.md`

**For technical deep dive:**
1. `01_ARCHITECTURE/orchestrator.js` - Main entry point
2. `02_CANON_AND_RULES/MIKAGE_ZENITH_CANON_V2.md` - Visual specification
3. `05_SAMPLE_RUNS/` - Real outputs with decision trails

---

## Quick Reading Order

**5-minute overview:**
1. `ONE_PAGE_BRIEF.md`
2. `CHECKED_VS_UNSTABLE.md`

**15-minute technical review:**
1. `SYSTEM_STATUS_SUMMARY.md`
2. `KNOWN_FAILURE_POINTS.md`
3. Sample runs in `05_SAMPLE_RUNS/`

**Deep architecture review:**
1. `orchestrator.js` (lines 1-200 for overview)
2. `render_executor.js` (lines 1-100 for flow)
3. `gemini_gate.py` or validation layer
4. Canon documents in `02_CANON_AND_RULES/`

---

## Key Files at Root

| File | Purpose |
|------|---------|
| `INDEX.md` | This navigation file |
| `SYSTEM_STATUS_SUMMARY.md` | Executive summary of current state |
| `CHECKED_VS_UNSTABLE.md` | Hardened vs unhardened components |
| `KNOWN_FAILURE_POINTS.md` | Recurring failures with evidence |
| `RECOMMENDED_NEXT_STEPS.md` | What to build next |

---

## Understanding Sample Runs

Each sample run folder contains decision trails:

- `final_decision.json` - Gate decision and reasoning
- `job_summary.json` - Full run trace
- `validator_report.json` - Automated validation results
- `gemini_gate_report.json` - Final gate evaluation
- `output.png` - Generated image (when present)

**Run Selection Criteria:**
- **run1_transport_error/** - VRAM/transport layer failure
- **run2_validator_pass_gemini_fail/** - Validator OK but Gemini gate rejected
- **run3_mask_drift/** - Mask macro with material/color drift
- **run4_closest_to_correct/** - Best current output (still imperfect)

---

## Important Note

**This is NOT an empty system.** It is a working pipeline with:
- Real intake → render → validation flow
- Actual canon enforcement (imperfect)
- Documented failure patterns
- Production artifacts

The weakness is in **render compliance** to canon, not in missing infrastructure.

---

*End of INDEX.md*
