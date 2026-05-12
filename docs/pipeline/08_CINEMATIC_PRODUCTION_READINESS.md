# 08_CINEMATIC_PRODUCTION_READINESS

## 1. Purpose

Defines all gates that must pass before Mikage cinematic production may begin.
Cinematic production is Phase 7. It requires completion of Phases 1–6.

**Current phase: Phase 4. Cinematic production is NOT ACTIVE and NOT PERMITTED.**

---

## 2. Definition of Cinematic Production

For the purposes of this pipeline, cinematic production means any of the following:

- Creating a film plate intended for a final edit
- Creating a video sequence intended for public or private release
- Rendering a shot with production-grade lighting, environment, and character
- Assembling a cinematic edit from rendered shots
- Producing audio-visual content attributed to the Mikage IP

This does NOT include:
- Storyboard panels (Phase 6)
- Animatic scratch sequences (Phase 6)
- Candidate review renders (Phase 4, no production claim)
- QA review outputs (Phase 4, no production claim)

---

## 3. Cinematic Production Readiness Gates

All of the following must be TRUE before cinematic production may begin:

### Gate C-01 — Phase 4 Complete

All required Phase 4 asset slots filled and accepted:

| Slot | Required status |
|---|---|
| Helmet faceplate (4-01) | TEMP_REFERENCE or LOCKED_CANON |
| Sensor slit (4-02) | TEMP_REFERENCE or LOCKED_CANON |
| B4C porcelain (4-03) | TEMP_REFERENCE or LOCKED_CANON |
| Graphene underlayer (4-04) | TEMP_REFERENCE or LOCKED_CANON |
| Zenith blade comparison (4-05) | TEMP_REFERENCE or LOCKED_CANON |
| Bust / upper-body bridge (4-08) | TEMP_REFERENCE or LOCKED_CANON |

Current: Gate C-01 NOT MET (bust bridge slot MISSING_REQUIRED)

### Gate C-02 — Phase 5 Complete (Upper-Body Consistency Review)

- Upper-body reference set review: PASS
- Body continuity constraint spec (ASSET-RESET-15): complete
- Phase 5 readiness re-review: PASS (human gate)

Current: Gate C-02 NOT MET (Phase 5 not started)

### Gate C-03 — Phase 6 Complete (Storyboard + Animatic)

- Storyboard review: PASS (human gate)
- Animatic review: PASS (human gate)
- Shotlist derived from reviewed storyboard: complete

Current: Gate C-03 NOT MET (Phase 6 not started)

### Gate C-04 — Environment Asset Set Complete

All environment anchor assets required by the approved shotlist must exist at status
TEMP_REFERENCE or LOCKED_CANON. No shot may be produced referencing an environment
that does not have an approved asset.

Current: Gate C-04 NOT MET (environment asset set not specced)

### Gate C-05 — Canon Asset Lock for All Production Assets

Every asset that appears in a cinematic production shot must be at status LOCKED_CANON.
TEMP_REFERENCE assets may appear in Phase 4–6 review but not in cinematic production.

Current: Gate C-05 NOT MET (only identity anchors are LOCKED_CANON)

### Gate C-06 — Production Render Plan Approved

A production render plan must exist and be approved by a human. The plan must define:
- Shot-by-shot render settings
- Lighting approach per shot
- Model resolution requirements
- Delivery format (codec, resolution, frame rate)
- Output storage path

Current: Gate C-06 NOT MET (no production render plan)

### Gate C-07 — Character Visual Spec Locked

The Mikage character visual spec (`docs/mikage_character_visual_spec.md`) must be
reviewed and confirmed current for the production phase.

Current: Gate C-07 STATUS UNKNOWN — spec exists but must be reviewed against Phase 4–5 outputs before production.

---

## 4. Cinematic Production Forbidden Actions

Regardless of phase, the following are NEVER permitted in the Mikage pipeline without
explicit human approval at each instance:

- Creating a film plate from a TEMP_REFERENCE asset
- Creating a film plate from a REVIEW_CANDIDATE asset
- Creating a film plate from any FAILED_DO_NOT_USE asset
- Using a Browser Run output as a film plate
- Presenting any review candidate as a production-ready cinematic output
- Submitting any Mikage output for public release without human approval
- Starting a new animated sequence without storyboard + animatic gate PASS

---

## 5. Production Readiness Summary

| Gate | Status | Unblocked by |
|---|---|---|
| C-01 Phase 4 complete | NOT MET | E-01 bust bridge accepted |
| C-02 Phase 5 complete | NOT MET | C-01 + Phase 5 review PASS |
| C-03 Phase 6 complete | NOT MET | C-02 + storyboard + animatic PASS |
| C-04 Environment assets | NOT MET | Phase 6 shotlist + asset build |
| C-05 Canon locks | NOT MET | Human canon approval all production assets |
| C-06 Production render plan | NOT MET | C-03 complete |
| C-07 Character spec locked | UNKNOWN | Review vs Phase 4–5 outputs |

**CINEMATIC_PRODUCTION_ALLOWED: NO — 0 of 7 gates met**

---

## 6. Path to Cinematic Production

```
NOW: Phase 4 — fill bust bridge slot (E-01)
  ↓
Phase 5 — upper-body consistency review
  ↓
Phase 6 — storyboard + animatic (human-approved)
  ↓
Asset spec + build for all environment slots
  ↓
Canon lock all production assets (human gate)
  ↓
Production render plan approved (human gate)
  ↓
Cinematic production begins
```

Estimated pipeline stages remaining from current position: 3 phases minimum.
No timeline predictions. Focus on next safe task only.
