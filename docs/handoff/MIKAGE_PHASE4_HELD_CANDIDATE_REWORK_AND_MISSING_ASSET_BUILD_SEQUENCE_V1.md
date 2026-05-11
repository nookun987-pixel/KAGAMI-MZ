# MIKAGE_PHASE4_HELD_CANDIDATE_REWORK_AND_MISSING_ASSET_BUILD_SEQUENCE_V1

## 1. Executive Decision

TRUE_CURRENT_PHASE: Phase 4 - Component Integration

PHASE5_ALLOWED: NO

This document defines the no-render rework and build sequence required to resolve Phase 4 held candidates and missing asset requirements before Phase 5 can be proposed. It is a planning document only. It does not approve canon, create asset locks, call candidates production-ready, start Phase 5, render, use ComfyUI runtime, use Blender, or create film/video/short/shotlist tasks.

## 2. Source Files Reviewed

- `docs/handoff/MIKAGE_PHASE4_STACK_MANIFEST_V1.md`
- `docs/handoff/MIKAGE_PHASE4_STACK_MANIFEST_PHASE5_READINESS_REVIEW_V1.md`
- `docs/handoff/ASSET-RESET-09_REVIEW_PHASE4_STACK_MANIFEST_FOR_PHASE5_READINESS_NO_RENDER_V1_REPORT.md`
- `docs/handoff/MIKAGE_PHASE4_TO_PHASE5_GO_NO_GO_CHECKLIST_V1.md`
- `docs/handoff/MIKAGE_PHASE4_COMPONENT_GATE_DECISIONS_V1.md`
- `docs/handoff/MIKAGE_MISSING_BODY_BUST_ENVIRONMENT_ASSET_REQUESTS_V1.md`

## 3. Held Candidates Summary

These three items remain held from the Phase 4 gate decisions. Each requires a documented human review decision (PASS / HOLD / REJECT) before Phase 5 can be considered.

| Held item | Stack slot | Canon risk | Current hold reason | Human decision required |
|---|---|---|---|---|
| Hair + mask identity continuity | Character identity | MEDIUM | Identity continuity against locked anchors not verified | PASS / HOLD / REJECT |
| Halo / orbital UI system | Event / UI system | MEDIUM | Event and system language not ready for stack inclusion | PASS / HOLD / REJECT |
| Helmet bust alternate | Bust / alternate form | HIGH | Anime/fashion drift; only technical negative-space reference acceptable | PASS / HOLD / REJECT (likely REJECT) |

Human decision required means: the user or ChatGPT must provide an explicit documented decision for each held candidate before any new task can proceed past step A2 below.

## 4. Held Candidate Rework Sequence

### Step A1 — Prepare Held Candidate Human Review Summary (no-render, Claude task)

Task ID: ASSET-RESET-11_PREPARE_HELD_CANDIDATE_HUMAN_REVIEW_SUMMARY_NO_RENDER_V1

Output: A structured review summary document listing each held candidate with:
- Candidate path
- Hold reason
- Canon risk rating
- Decision options available (PASS / HOLD / REJECT) and consequences of each
- Required evidence standard for PASS (if applicable)

This output is preparation material for the human decision step. Claude produces it. The user or ChatGPT makes the actual decisions.

### Step A2 — Record Human Review Decisions For Held Candidates (human-input required, pointer task)

Task ID: ASSET-RESET-12_RECORD_HUMAN_REVIEW_DECISIONS_FOR_HELD_CANDIDATES_NO_RENDER_V1

Input: Human decision for each held candidate (PASS / HOLD / REJECT) from user or ChatGPT.

Output: A decision record document with each held candidate's final disposition. Claude writes the record from stated human decisions only. Claude does not make or infer the decisions.

Gate: This step cannot proceed until Step A1 output exists and human decisions are stated explicitly.

### Step A3 — Update Phase 4 Stack Manifest With Held Candidate Decisions (no-render, Claude task)

Task ID: ASSET-RESET-13_UPDATE_PHASE4_STACK_MANIFEST_WITH_HELD_CANDIDATE_DECISIONS_NO_RENDER_V1

Input: Decision record from Step A2.

Output: Updated `MIKAGE_PHASE4_STACK_MANIFEST_V1.md` or a V2 manifest reflecting each held candidate's final disposition. Decisions recorded, no new canon approvals or asset locks introduced.

Gate: Requires Step A2 to be complete with explicit human decisions on record.

## 5. Missing Asset Build Sequence

These requirements remain missing or requirement-only. A build sequence below defines what documentation steps are needed. Actual asset generation is out of scope for Claude and remains blocked.

| Missing requirement | Blocking effect | No-render action available |
|---|---|---|
| Bust / upper-body bridge | Phase 5 cannot start | Define asset request spec (Claude task) |
| Body continuity / full-character constraint | Phase 6 cannot start | Define constraint spec (Claude task, after bust bridge) |
| Environment / world plate | Film/video/render blocked | Defer to Phase 6+ (not Phase 5 critical) |
| Motion readiness manifest | Phase 7 cannot start | Defer to Phase 7 planning (not Phase 5 critical) |
| Audio pipeline / sound decision | Film/video blocked | Defer to Phase 8 (not Phase 5 critical) |
| Shot library / storyboard | Phase 8/9 blocked | Prohibited now; defer entirely |

### Step B1 — Define Bust / Upper-Body Bridge Asset Request Spec (no-render, Claude task)

Task ID: ASSET-RESET-14_DEFINE_BUST_UPPER_BODY_BRIDGE_ASSET_REQUEST_SPEC_NO_RENDER_V1

Output: A no-render specification document defining:
- What the bust/upper-body bridge must depict
- What canon constraints it must satisfy against locked anchors
- What it must NOT introduce (identity drift, face reveal, canon-breaking body proportions)
- How it will be evaluated when a candidate exists
- Who can generate it (Codex / local ComfyUI workflow; not Claude)

This spec enables the user or Codex to commission or generate the bust/upper-body bridge asset correctly. Claude writes the spec. Claude does not generate the asset.

Gate: Can begin after Step A1 in parallel. Recommended to start after A1 is accepted.

### Step B2 — Define Body Continuity Constraint Spec (no-render, Claude task)

Task ID: ASSET-RESET-15_DEFINE_BODY_CONTINUITY_CONSTRAINT_SPEC_NO_RENDER_V1

Output: A no-render constraint document for full-character body continuity.

Gate: Requires bust/upper-body bridge spec (Step B1) to exist. Defer until B1 is accepted.

## 6. Full Rework / Build Sequence Order Of Operations

```
A1: Prepare held candidate human review summary   [CLAUDE, no-render, next safe task]
  |
  +-- B1: Define bust/upper-body bridge spec      [CLAUDE, no-render, can run parallel with A1]
  |
A2: Record human review decisions                 [HUMAN-INPUT, depends on A1]
  |
A3: Update Phase 4 stack manifest                 [CLAUDE, no-render, depends on A2]
  |
  +-- B2: Define body continuity constraint spec  [CLAUDE, no-render, depends on B1]
  |
GATE: Phase 5 Readiness Re-Review                 [CLAUDE, depends on A3 + B1]
  |
  (If gate passes: Phase 5 can be proposed by ChatGPT/user)
```

## 7. Phase 5 Unblocking Conditions

Phase 5 CANNOT be started until ALL of the following are true:

| Condition | Current state | Unblocked by |
|---|---|---|
| Held candidates have documented human decisions | NOT MET | Step A2 |
| Phase 4 stack manifest updated with decisions | NOT MET | Step A3 |
| Bust/upper-body bridge spec exists | NOT MET | Step B1 |
| Phase 5 readiness re-review PASS | NOT MET | Gate after A3 + B1 |

PHASE5_ALLOWED: NO until all conditions above are confirmed PASS.

## 8. What Remains Permanently Deferred Or Prohibited

| Item | Status |
|---|---|
| Film / video / short / shotlist | PROHIBITED until Phase 8+ and all upstream requirements met |
| Environment / world plate asset | Deferred to Phase 6+ planning |
| Motion readiness manifest | Deferred to Phase 7 planning |
| Audio pipeline | Deferred to Phase 8 planning |
| ComfyUI runtime use | Codex/local only; not Claude |
| Blender | Codex/local only; not Claude |
| Canon approval | Human decision only |
| Asset lock | Human decision only |
| Candidates called production-ready | Prohibited until evidence standard is met |

## 9. Next Safe Task

ASSET-RESET-11_PREPARE_HELD_CANDIDATE_HUMAN_REVIEW_SUMMARY_NO_RENDER_V1

This is a Claude-executable no-render documentation task.

## 10. Prohibited Actions Confirmed

- FILM_TASK_CREATED: NO
- SHORT_VIDEO_TASK_CREATED: NO
- SHOTLIST_CREATED: NO
- VIDEO_CREATED: NO
- RENDER_STARTED: NO
- COMFYUI_RUNTIME_USED: NO
- BLENDER_USED: NO
- CANON_APPROVAL_CREATED: NO
- ASSET_LOCK_CREATED: NO
- CANDIDATES_CALLED_PRODUCTION_READY: NO
- PHASE5_STARTED: NO
