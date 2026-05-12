# 04_EXECUTION_GATE_RULES

## 1. Purpose

Defines the rules that govern when and how ComfyUI generation may be submitted.
These rules exist because uncontrolled generation produces outputs that cannot be
reliably traced, reviewed, or accepted into the pipeline.

---

## 2. Core Rule: No Browser Run for Production Routes

**The ComfyUI web interface "Run" / "Queue Prompt" button is FORBIDDEN for all
production-route generation.**

Rationale: Browser-submitted runs cannot be traced to an approved execution packet.
They may use the wrong workflow, wrong parameters, wrong output directory, or wrong model.
They produce outputs with non-compliant filenames. They bypass all pre-run checklists.

Any output produced by a Browser Run that was not explicitly authorised by a named,
versioned execution packet is automatically FAILED_DO_NOT_USE.

### 2.1 Wrong Run Already Recorded

The following output is the result of an unauthorised Browser Run and is FAILED_DO_NOT_USE:

- Output: `test_minimal_00001_` (and siblings), 512×512, 2026-05-12
- Expected (ASSET-BUILD-05 packet): `MIKAGE_BUST_BRIDGE_CAND_01_REVIEW_CANDIDATE_20260512_*`, 768×1024
- Mismatch axes: filename prefix, resolution, output directory
- Status: FAILED_DO_NOT_USE — see registry entry D-04

---

## 3. Approved Generation Routes

Only these routes are permitted for production generation:

| Route | Description | Required prerequisite |
|---|---|---|
| Script-submitted (API) | Python script calls ComfyUI `/prompt` API | Approved execution packet; SUBMIT=True set explicitly |
| Operator-verified workflow | Human operator manually verifies all pre-run checklist items then submits | Same checklist as script; output dir, naming, resolution confirmed before run |

No other route is permitted. This includes:
- ComfyUI web UI "Run" button
- ComfyUI web UI drag-and-drop workflow
- Any third-party ComfyUI frontend
- Automated scripts not traceable to an approved execution packet

---

## 4. Pre-Submit Verification Checklist

Before any generation is submitted (script or operator), ALL of the following must be confirmed:

```
[ ] Execution packet exists and is current (not superseded)
[ ] Script path matches packet header
[ ] Script SUBMIT variable confirmed True (for script-submitted route)
[ ] Output directory exists and matches packet Section 1
[ ] Output filename prefix matches packet Section 2 naming convention
[ ] Resolution (W×H) matches packet Section 6
[ ] Batch size matches packet Section 6
[ ] All anchor images verified present at paths listed in packet Section 3
[ ] No excluded asset loaded in any node (packet Section 3 exclusion list)
[ ] Positive prompt matches packet Section 4 verbatim
[ ] Negative prompt matches packet Section 5 verbatim
[ ] ComfyUI running and reachable at expected port
[ ] Static workflow validation PASS (see ASSET-BUILD-04 validator)
[ ] No held component (05B, 06C) appears in workflow
[ ] No forbidden status token in output filename prefix
```

If any item is unchecked: STOP. Do not submit. Resolve the issue and re-verify.

---

## 5. Output Acceptance Criteria

After generation, before any output may advance to REVIEW_CANDIDATE status:

| Check | Required value | Fail action |
|---|---|---|
| Output directory | Matches packet Section 1 | FAILED_DO_NOT_USE all outputs |
| Filename prefix | Matches packet Section 2 | FAILED_DO_NOT_USE all outputs |
| Resolution | Matches packet Section 6 | FAILED_DO_NOT_USE all outputs |
| File count per batch | Matches packet batch size | Flag discrepancy; review individually |
| Seed recorded | Yes — written to run log | Record before advancing |
| No forbidden token in filename | PASS / CANON / LOCKED / APPROVED / PRODUCTION / FINAL absent | FAILED_DO_NOT_USE if present |

---

## 6. Mismatch Protocol — Wrong Run Report

When any output acceptance criterion fails:

1. Do not accept any output from the run.
2. Set all outputs to FAILED_DO_NOT_USE in the asset registry.
3. Create a wrong-run report with these fields:
   - Date and time of run
   - Filename(s) actually produced
   - Expected filename prefix (from packet)
   - Actual vs expected: directory, resolution, batch size
   - Root cause (Browser Run? Wrong script? Wrong SUBMIT=True?)
   - Action required before next attempt

4. Create a repair task. Do not re-run without repair.

---

## 7. Retry Rules

After any FAIL:

| Condition | Action |
|---|---|
| Quick-Pass Gate FAIL (spec violation) | Adjust prompt / weights / negative. Re-run after confirming pre-submit checklist. |
| Wrong run (filename / dir / resolution mismatch) | Create wrong-run report. Create repair task. Do not re-run until repair complete. |
| Workflow error (ComfyUI exception) | Create repair task (ASSET-BUILD-0N). Do not re-run same script. |
| Timeout / hardware failure | Investigate. May re-run same validated script after confirming hardware. |
| Multiple failures in same slot | Escalate to human review before next attempt. |

**No retry without repair after workflow error or wrong run. This rule has no exceptions.**

---

## 8. Execution Packet Versioning

Each time a workflow is repaired, a new execution packet is produced (V2, V3, etc.).
The previous version is DEPRECATED. The new version supersedes it.

| Version | Script | Status | Notes |
|---|---|---|---|
| V1 | `MIKAGE_BUST_BRIDGE_EXECUTE.py` | DEPRECATED | ASSET-BUILD-02 packet |
| V2 | `MIKAGE_BUST_BRIDGE_EXECUTE_V2.py` | CURRENT | ASSET-BUILD-04 repair; SUBMIT=False |

When ASSET-BUILD-05 is authorised:
- Set `SUBMIT = True` in V2 script
- Record the change in the run log / handoff
- Do not create a V3 unless V2 fails

---

## 9. Cloud GPU Execution Gate

Cloud GPU jobs are subject to all rules above plus additional gates defined in
`06_CLOUD_GPU_PACKET_STANDARD.md`. A cloud GPU job may only be submitted when:

1. A cloud GPU execution packet exists and is approved.
2. The packet has been dry-run validated locally.
3. The output storage path, filename convention, and credential scope are confirmed.
4. A human has explicitly authorised the cloud job submission.

No cloud GPU job may be submitted based on a local script alone without a separate
cloud packet document.
