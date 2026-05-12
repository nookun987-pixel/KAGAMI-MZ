# MIKAGE_PHASE4_STACK_MANIFEST_V2

## 1. Executive Decision

TRUE_CURRENT_PHASE: Phase 4 - Component Integration

PHASE5_ALLOWED: NO

MANIFEST_VERSION: V2

This manifest is the updated Phase 4 stack reflecting all held candidate decisions from ASSET-RESET-12 and the bust / upper-body bridge spec from ASSET-RESET-14. It supersedes `MIKAGE_PHASE4_STACK_MANIFEST_V1.md` for active use. V1 remains as historical record. This document is a no-render manifest only. It does not approve canon, create asset locks, call candidates production-ready, start Phase 5, render, use ComfyUI runtime, use Blender, or create film / video / short / shotlist tasks.

---

## 2. Manifest Status

| Field | Value |
|---|---|
| MANIFEST_STATUS | UPDATED_FROM_HELD_CANDIDATE_DECISIONS |
| SUPERSEDES | `docs/handoff/MIKAGE_PHASE4_STACK_MANIFEST_V1.md` |
| SOURCE_DECISIONS | `docs/handoff/MIKAGE_PHASE4_COMPONENT_GATE_DECISIONS_V1.md` |
| HELD_CANDIDATE_DECISIONS | `docs/handoff/MIKAGE_PHASE4_HELD_CANDIDATE_DECISION_RECORD_V1.md` (ASSET-RESET-12) |
| BUST_BRIDGE_SPEC | `docs/handoff/MIKAGE_BUST_UPPER_BODY_BRIDGE_ASSET_REQUEST_SPEC_V1.md` (ASSET-RESET-14) |
| CANON_APPROVED | NO |
| ASSET_LOCKED | NO |
| PRODUCTION_READY | NO |
| PHASE5_ALLOWED | NO |
| RENDER_READY | NO |
| FILM_VIDEO_ALLOWED | NO |

---

## 3. Included Phase 4 References

These items are included as Phase 4 references only. They are not canon approvals, asset locks, production assets, render inputs, or Phase 5 entry permission. Unchanged from V1.

| Stack slot | Included reference | Path | Evidence | Allowed use | Forbidden use |
|---|---|---|---|---|---|
| Helmet faceplate | MIKAGE_COMP_01A_HELMET_FACEPLATE_CLEAN_PASS | `D:\workspace\ComfyUI\MIKAGE_CANON\10_COMPONENT_CANDIDATE_SET_V1\01_HELMET_FACEPLATE\MIKAGE_COMP_01A_HELMET_FACEPLATE_CLEAN_PASS.png` | `docs/handoff/MIKAGE_PHASE4_COMPONENT_GATE_DECISIONS_V1.md`; `D:\workspace\ComfyUI\MIKAGE_CANON\10_COMPONENT_CANDIDATE_SET_V1\MIKAGE_COMPONENT_CANDIDATE_SET_V1_REVIEW_REPORT.md` | Faceless clean helmet/faceplate geometry reference | Canon approval, asset lock, production-ready claim, render input |
| Sensor slit detail | MIKAGE_COMP_02B_SENSOR_SLIT_CLOSEUP_PASS | `D:\workspace\ComfyUI\MIKAGE_CANON\10_COMPONENT_CANDIDATE_SET_V1\02_SENSOR_SLIT_FACEPLATE\MIKAGE_COMP_02B_SENSOR_SLIT_CLOSEUP_PASS.png` | `docs/handoff/MIKAGE_PHASE4_COMPONENT_GATE_DECISIONS_V1.md`; component candidate review report | Strict faceless sensor-slit closeup reference | Eye/facial-expression source, canon approval, asset lock, production-ready claim |
| B4C porcelain material | MIKAGE_COMP_03A_B4C_PORCELAIN_PANEL_GAP_PASS | `D:\workspace\ComfyUI\MIKAGE_CANON\10_COMPONENT_CANDIDATE_SET_V1\03_B4C_PORCELAIN_MATERIAL\MIKAGE_COMP_03A_B4C_PORCELAIN_PANEL_GAP_PASS.png` | `docs/handoff/MIKAGE_PHASE4_COMPONENT_GATE_DECISIONS_V1.md`; component candidate review report | Matte B4C porcelain armor plate and black gap material reference | Final material approval, asset lock, production-ready material, render input |
| Graphene underlayer | MIKAGE_COMP_04A_GRAPHENE_UNDERLAYER_HEX_GAP_PASS | `D:\workspace\ComfyUI\MIKAGE_CANON\10_COMPONENT_CANDIDATE_SET_V1\04_GRAPHENE_UNDERLAYER\MIKAGE_COMP_04A_GRAPHENE_UNDERLAYER_HEX_GAP_PASS.png` | `docs/handoff/MIKAGE_PHASE4_COMPONENT_GATE_DECISIONS_V1.md`; component candidate review report | Black graphene underlayer reference visible only through armor gaps | Final material approval, asset lock, production-ready material, render input |
| Zenith blade comparison | MIKAGE_COMP_07B_ZENITH_BLADE_CLEAN_MONOLITH_REVIEW_CANDIDATE | `D:\workspace\ComfyUI\MIKAGE_CANON\10_COMPONENT_CANDIDATE_SET_V1\07_ZENITH_BLADE\MIKAGE_COMP_07B_ZENITH_BLADE_CLEAN_MONOLITH_REVIEW_CANDIDATE.png` | `docs/handoff/MIKAGE_PHASE4_COMPONENT_GATE_DECISIONS_V1.md`; component candidate review report | Comparison reference against locked Zenith blade V2 | Replacing locked blade, canon approval, asset lock, production-ready prop |

---

## 4. Read-Only Locked / Canon Reference Anchors

These anchors remain read-only references used to interpret the stack. This manifest does not alter their status. Unchanged from V1.

| Anchor | Path | Manifest role | Forbidden use |
|---|---|---|---|
| Unified key visual V4 | `D:\workspace\ComfyUI\MIKAGE_CANON\08_CHARACTER_REVIEW_CANDIDATES\MIKAGE_UNIFIED_KEY_VISUAL_V4_FROM_CLEAN_SOURCES_00001_.png` | Identity / style anchor | Full character proof, film plate, new approval, or production stack completion by itself |
| Helmet front 3D source V1 | `D:\workspace\ComfyUI\MIKAGE_CANON\08_CHARACTER_REVIEW_CANDIDATES\MIKAGE_HELMET_FRONT_VIEW_3D_SOURCE_V1_ORTHO.png` | Helmet front geometry anchor | Render input or new asset lock from this manifest |
| Helmet side 3D source V1 | `D:\workspace\ComfyUI\MIKAGE_CANON\08_CHARACTER_REVIEW_CANDIDATES\MIKAGE_VOLUME_FIRST_3D_HELMET_SIDE_V1_ORTHO.png` | Helmet side silhouette and volume anchor | Render input or full-character claim |
| Zenith blade V2 | `D:\workspace\ComfyUI\MIKAGE_CANON\08_CHARACTER_REVIEW_CANDIDATES\MIKAGE_ZENITH_BLADE_V2_POLISH_ONE_SHOT_00001_.png` | Locked blade identity anchor | Replacement by candidate without separate review |

---

## 5. Held Candidates — Post ASSET-RESET-12 Decisions

These items remain outside the included stack. Decisions recorded in `docs/handoff/MIKAGE_PHASE4_HELD_CANDIDATE_DECISION_RECORD_V1.md`.

### V2 Change: 08B removed from this section (moved to Section 6 — REJECT_DO_NOT_USE)

| Held item | Candidate path | ASSET-RESET-12 decision | Current status | Revisitable | Forbidden use |
|---|---|---|---|---|---|
| Hair + mask identity continuity (05B) | `D:\workspace\ComfyUI\MIKAGE_CANON\10_COMPONENT_CANDIDATE_SET_V1\05_HAIR_MASK_PORTRAIT\MIKAGE_COMP_05B_HAIR_MASK_PORTRAIT_REVIEW_CANDIDATE.png` | **HOLD** | EXCLUDED — may be reconsidered in a future review cycle | YES — requires full evidence standard from review summary | Production character asset, canon approval, face reveal, film plate, Phase 5 source, hair/mask cues in new bust candidate |
| Halo / orbital UI system (06C) | `D:\workspace\ComfyUI\MIKAGE_CANON\10_COMPONENT_CANDIDATE_SET_V1\06_HALO_ORBITAL_UI\MIKAGE_COMP_06C_ORBITAL_UI_LOW_CLUTTER_REVIEW_CANDIDATE.png` | **HOLD** | EXCLUDED — recommended to revisit after core character stack (05B, new bust) is more settled | YES — requires full evidence standard and core stack settled | Final UI lock, shot/event plate, render input, production-ready system asset, halo/orbital UI in new bust candidate |

---

## 6. Rejected Or Excluded Groups

### V2 Change: 08B added as REJECT_DO_NOT_USE (human decision from ASSET-RESET-12)

| Group | Manifest decision | Reason | Decision source |
|---|---|---|---|
| Helmet bust alternate (08B) | REJECT_DO_NOT_USE | HIGH canon risk; confirmed anime/fashion drift; human REJECT decision in ASSET-RESET-12; permanently excluded from this phase cycle | `docs/handoff/MIKAGE_PHASE4_HELD_CANDIDATE_DECISION_RECORD_V1.md` |
| Full-body candidate 001 | REJECT_DO_NOT_USE | Failed/do-not-use for canon and production | `docs/handoff/MIKAGE_PHASE4_COMPONENT_GATE_DECISIONS_V1.md` |
| Controlled front canon repair V1 | REJECT_DO_NOT_USE | Existing evidence marks it FAIL_DO_NOT_USE | `docs/handoff/MIKAGE_PHASE4_COMPONENT_GATE_DECISIONS_V1.md` |
| Brutalist void / consequence chamber test | REJECT_DO_NOT_USE | Failed/downstream; unsuitable as positive environment source | `docs/handoff/MIKAGE_PHASE4_COMPONENT_GATE_DECISIONS_V1.md` |
| Video tests and loop tests | REJECT_DO_NOT_USE for Phase 4 stack use | Downstream references only; cannot bypass Phase 4–7 | `docs/handoff/MIKAGE_PHASE4_COMPONENT_GATE_DECISIONS_V1.md` |
| Archived film source packs | REJECT_DO_NOT_USE for Phase 4 stack use | Archive-only; not current production stack evidence | `docs/handoff/MIKAGE_PHASE4_COMPONENT_GATE_DECISIONS_V1.md` |
| Corrected full-body front candidate V2 | EXCLUDED_FROM_POSITIVE_STACK | Review-only/private evidence; not final/public/video-source/production-ready | `docs/handoff/MIKAGE_PHASE4_COMPONENT_GATE_DECISIONS_V1.md` |

---

## 7. Missing Downstream Requirements

### V2 Change: Bust / upper-body bridge row updated — spec now exists at ASSET-RESET-14

| Requirement | Current state | Spec / path | Blocking effect |
|---|---|---|---|
| Bust / upper-body bridge | MISSING_REQUIRED_ASSET — spec defined; candidate not yet generated | `docs/handoff/MIKAGE_BUST_UPPER_BODY_BRIDGE_ASSET_REQUEST_SPEC_V1.md` | Phase 5 cannot start; generate via Codex / local ComfyUI |
| Body continuity / full-character constraint | Requirement defined only | `docs/handoff/MIKAGE_MISSING_BODY_BUST_ENVIRONMENT_ASSET_REQUESTS_V1.md` | Phase 6 cannot start; ASSET-RESET-15 blocked until bust bridge accepted |
| Environment / world plate | Requirement defined only | `docs/handoff/MIKAGE_MISSING_BODY_BUST_ENVIRONMENT_ASSET_REQUESTS_V1.md` | Film/video/shotlist/render remain blocked |
| Motion readiness manifest | Missing | — | Phase 7 cannot start |
| Audio pipeline / sound decision | Missing | — | Film/video remains blocked |
| Shot library / storyboard | Missing and prohibited now | — | Phase 8/9 cannot start |

---

## 8. Phase 4 Stack Snapshot — V2 Summary

| Category | Count | Notes |
|---|---|---|
| Included Phase 4 references | 5 | Unchanged from V1 |
| Read-only locked anchors | 4 | Unchanged from V1 |
| Held (confirmed HOLD) | 2 | 05B, 06C |
| Rejected / permanently excluded | 7 groups | Added 08B in V2 |
| Missing required assets | 1 critical | Bust / upper-body bridge (spec defined; candidate needed) |

---

## 9. Phase 5 Go / No-Go Status

PHASE5_ALLOWED: NO

### V2 Update — Reasons

| Blocking condition | Status |
|---|---|
| Held candidates have documented human decisions | MET — ASSET-RESET-12 complete; decisions on record |
| Phase 4 stack manifest updated with decisions | MET — this V2 manifest (ASSET-RESET-13 complete) |
| Bust / upper-body bridge spec exists | MET — ASSET-RESET-14 complete |
| Bust / upper-body bridge candidate accepted | NOT MET — candidate not yet generated |
| Phase 5 readiness re-review PASS | NOT MET — gate not yet reached |

PHASE5_ALLOWED remains NO until all five conditions above are met. Completing this manifest satisfies condition 2 of 5.

---

## 10. Required Review Before Any Phase 5 Task

Before Phase 5 can be proposed, the following must exist and be reviewed:

1. This manifest (`MIKAGE_PHASE4_STACK_MANIFEST_V2.md`) — available now
2. `docs/handoff/MIKAGE_PHASE4_COMPONENT_GATE_DECISIONS_V1.md` — available now
3. `docs/handoff/MIKAGE_PHASE4_TO_PHASE5_GO_NO_GO_CHECKLIST_V1.md` — available now
4. A new bust / upper-body bridge candidate evaluated under `MIKAGE_BUST_UPPER_BODY_BRIDGE_ASSET_REQUEST_SPEC_V1.md` and receiving `INCLUDE_AS_PHASE4_REFERENCE` — **NOT YET AVAILABLE**

Required review question (unchanged):

> Does the Phase 4 reference stack, with held candidate decisions recorded and the bust/upper-body bridge spec defined, satisfy the minimum evidence standard to proceed to a Phase 5 bust/upper-body planning task once a candidate is accepted?

---

## 11. Next Steps After This Manifest

| Step | Task | Party | Status |
|---|---|---|---|
| Generate bust/upper-body bridge candidate | Use spec at ASSET-RESET-14 | Codex / local ComfyUI | PENDING — not Claude |
| Review bust/upper-body bridge candidate | Apply 4-step evaluation from ASSET-RESET-14 spec | Human / Codex | PENDING — no candidate yet |
| ASSET-RESET-15 — Body continuity constraint spec | Claude no-render task | Claude | BLOCKED — requires bust bridge accepted |
| Phase 5 readiness re-review | Gate review | Claude + human | BLOCKED — requires A3 + bust bridge accepted |

---

## 12. Prohibited Actions Confirmed

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
