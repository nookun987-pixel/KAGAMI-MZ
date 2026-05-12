# ASSET-BUILD-09C_RENDER_SESSION_WFA_WFB_RESULTS

## 1. Task Header

```
TASK_CODE:              ASSET-BUILD-09C_RENDER_SESSION_WFA_WFB_RESULTS
RESULT:                 FAIL — Q-5 gate not cleared by any render
INPUT_FOUND:            YES
OUTPUT_CREATED:         YES — 14 render outputs (7 Workflow A + 7 Workflow B)
FILES_CREATED:          1 repo report (this file)
FILES_MODIFIED:         00_LATEST_CODEX_HANDOFF.md
FORBIDDEN_ACTIONS_TRIGGERED: NO
LOCKED_ASSETS_MODIFIED: NO
APPROVAL_USED:          NO
ERRORS:                 Q-5 graphene underlayer — FAIL across all 14 renders
NEXT_SHORT_TASK:        Run Workflow C batch (visor suppress variant) while pod is live
DATE:                   2026-05-12
```

---

## 2. Purpose

Session report for the live RunPod render batch covering Workflow A (7 renders) and Workflow B (7 renders) across all 7 bust bridge repair candidates. Pod was successfully deployed and all models loaded after resolving a cascade of ComfyUI/IPAdapter compatibility issues.

---

## 3. Infrastructure Setup — Resolved Issues

| Issue | Fix Applied |
|---|---|
| Wrong RunPod template (PyTorch 2.4.0) | Changed to Runpod SD ComfyUI template |
| No storage configured | Volume Disk 80 GB selected |
| ComfyUI running on port 8188 | Restarted with `--port 3000` |
| IPAdapter/ControlNet missing | Cloned via git, ControlNet pip-installed |
| node_helpers.py missing (IPAdapter_plus) | Created stub at `/workspace/ComfyUI/node_helpers.py` |
| git pull broke ComfyUI (sqlalchemy/torch) | Rolled back with `git reset --hard HEAD@{1}` |
| SDXL_instructpix2pix missing (lines 596, 784) | Patched via Python replace script |
| get_model_object missing on ModelPatcher | Root cause: IPAdapter_plus too new for ComfyUI r1958. Fixed with `git checkout 971585a` (parent of 53813b2) |
| Wrong IPAdapter model (sd15 not sdxl) | Downloaded correct SDXL set |

ComfyUI endpoint active at: `na9lebjxsvvl0y-3000.proxy.runpod.net`

---

## 4. Workflow A Batch — 7 Renders

```
WORKFLOW:       ASSET-BUILD-09_REPAIR_CAND00002_A_SAFE_FIRST.json
RENDER_COUNT:   7 (all candidates)
Q-5 RESULT:     FAIL — all 7 renders
```

**Observation:** All 7 renders show uniformly white matte helmet surface. Panel seam geometry partially visible (V-shape indentations in lower half on some candidates) but zero dark underlayer visible through any gap. Surface reads as white ceramic/porcelain with no graphene showing.

---

## 5. Workflow B Batch — 7 Renders

```
WORKFLOW:       ASSET-BUILD-09_REPAIR_CAND00002_B_STRONGER_ANCHOR.json
RENDER_COUNT:   7 (all candidates)
Q-5 RESULT:     FAIL — all 7 renders
```

**Observation:** Same failure pattern as Workflow A. Uniformly white surface, no black underlayer visible through panel lines. Stronger anchor weights did not break through to surface color. Panel geometry slightly more defined in some candidates but Q-5 still not met.

---

## 6. Q-5 Gate Assessment

```
Q-5 CRITERION:  Black/near-black graphene underlayer must be visible through panel gaps
STATUS:         NOT MET — 14/14 renders fail
ROOT_CAUSE:     IPAdapter reference weight insufficient to override base model white surface
                bias; graphene anchor images not driving color through panel seams at
                current weight settings
```

Workflow A and B are both IPAdapter-weight variants. The shared failure mode suggests the graphene anchor signal is not strong enough to compete with the base model's surface color tendency at these workflow configurations.

---

## 7. Workflow C — Next Authorized Run

```
WORKFLOW:       ASSET-BUILD-09_REPAIR_CAND00002_C_VISOR_SUPPRESS_STANDBY.json
STATUS:         STANDBY — authorized to run while pod is live
RATIONALE:      Visor suppress variant may redirect model attention differently,
                potentially allowing underlayer color to express through gaps
AUTHORIZED_COUNT: Up to 7 renders (all candidates, match prior batches)
POD_STATUS:     RUNNING — maximize session before shutdown
```

---

## 8. Next Safe Task

```
TASK:           Run Workflow C batch (all 7 candidates) while pod is live
ACTION:         Drag ASSET-BUILD-09_REPAIR_CAND00002_C_VISOR_SUPPRESS_STANDBY.json
                into ComfyUI, queue renders
EVALUATE:       Q-5 gate — dark underlayer must be visible through panel gaps
IF_FAIL:        Escalate — graphene anchor approach insufficient; require redesign of
                workflow prompt strategy or CompositeNode/manual layer approach
CODEX_NEXT:     ASSET-BUILD-09D_WORKFLOW_C_RESULTS (after Workflow C renders complete)
```
