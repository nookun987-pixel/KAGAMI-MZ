# 03_ASSET_BUILD_ORDER

## 1. Purpose

Defines the ordered build sequence for all Mikage asset slots. Earlier slots must be
filled and accepted before later slots may begin generation. This order is not arbitrary —
it reflects dependency chains: later assets use earlier assets as conditioning inputs.

---

## 2. Build Dependency Graph

```
Phase 2 — Identity Anchors (COMPLETE)
  └─ A-01 Unified Key Visual V4 [LOCKED_CANON]
        │
        ▼
Phase 3 — 3D Source Build (COMPLETE)
  └─ A-02 Helmet Front 3D Source V1 [LOCKED_CANON]
  └─ A-03 Helmet Side (Volume First) 3D Source V1 [LOCKED_CANON]
        │
        ▼
Phase 4 — Component Integration (IN PROGRESS)
  ├─ B-01 Helmet Faceplate Clean Pass [TEMP_REFERENCE] ✓
  ├─ B-02 Sensor Slit Faceplate Pass [TEMP_REFERENCE] ✓
  ├─ B-03 B4C Porcelain Panel Gap Pass [TEMP_REFERENCE] ✓
  ├─ B-04 Graphene Underlayer Hex Gap Pass [TEMP_REFERENCE] ✓
  ├─ B-05 Zenith Blade Comparison Candidate [TEMP_REFERENCE] ✓
  ├─ C-01 Hair + Mask Portrait (05B) [HOLD] — blocked pending future review
  ├─ C-02 Halo / Orbital UI (06C) [HOLD] — blocked pending future review
  └─ E-01 Bust / Upper-Body Bridge [MISSING_REQUIRED] ← CURRENT BLOCKER
        │
        ▼ (when E-01 filled)
Phase 5 — Upper-Body Consistency Review
  └─ Upper-body reference set review (all Phase 4 slots filled)
        │
        ▼
Phase 6 — Storyboard / Animatic (blocked on Phase 5)
  └─ Storyboard panels created
  └─ Animatic assembled and reviewed
        │
        ▼
Phase 7 — Cinematic Production (blocked on Phase 6)
  └─ All cinematic readiness gates pass
```

---

## 3. Phase 4 Slot Table — Current State

| # | Slot | Asset | Status | Blocking |
|---|---|---|---|---|
| 4-01 | Helmet faceplate | MIKAGE_COMP_01A | TEMP_REFERENCE | No |
| 4-02 | Sensor slit detail | MIKAGE_COMP_02B | TEMP_REFERENCE | No |
| 4-03 | B4C porcelain material | MIKAGE_COMP_03A | TEMP_REFERENCE | No |
| 4-04 | Graphene underlayer | MIKAGE_COMP_04A | TEMP_REFERENCE | No |
| 4-05 | Zenith blade comparison | MIKAGE_COMP_07B | TEMP_REFERENCE | No |
| 4-06 | Hair + mask (05B) | — | HOLD (excluded) | Deferred |
| 4-07 | Halo / orbital UI (06C) | — | HOLD (excluded) | Deferred |
| 4-08 | **Bust / upper-body bridge** | **MISSING** | **MISSING_REQUIRED** | **YES — blocks Phase 5** |

5 of 8 slots filled. 2 on hold (deferred). **1 missing and blocking.**

---

## 4. Build Order Rules

### Rule B-01 — No Downstream Generation Without Upstream Acceptance

A slot that depends on a prior slot for conditioning must not begin generation until the
prior slot has status TEMP_REFERENCE or LOCKED_CANON.

Current application:
- Bust bridge (E-01) depends on: A-02, A-03 (anchors), B-01, B-03, B-04 (material refs)
- All upstream slots are LOCKED_CANON or TEMP_REFERENCE ✓
- Bust bridge generation may proceed

### Rule B-02 — Phase Advancement Requires All Required Slots Filled

A phase cannot be declared complete until all MISSING_REQUIRED slots in that phase
have status TEMP_REFERENCE or LOCKED_CANON. HOLD slots do not block phase advancement
if explicitly deferred by human decision.

Current application:
- Phase 4 requires E-01 (bust bridge) to be filled before Phase 5 may begin.
- Phase 5 CANNOT begin until E-01 is TEMP_REFERENCE or LOCKED_CANON.

### Rule B-03 — Held Slots Do Not Block Phase Advancement

HOLD slots (05B, 06C) are explicitly deferred by human decision and do not block Phase 5.
However, they must not be introduced into bust bridge conditioning or any new generation
without a separate PASS decision.

### Rule B-04 — New Slots Must Have Specs Before Build

Any new slot introduced into the build order must have:
1. A written spec document (equivalent to MIKAGE_BUST_UPPER_BODY_BRIDGE_ASSET_REQUEST_SPEC_V1.md)
2. A render/build plan document
3. An execution packet document

No generation may begin without all three documents existing and being current.

### Rule B-05 — Repair Before Re-Run

If a BUILD task produces FAILED_DO_NOT_USE outputs, a repair task must complete before
the same slot may attempt generation again. The repair task produces a corrected
execution packet which becomes the authoritative source for the next run.

---

## 5. Current Next Build Action

```
Slot:    E-01 — Bust / Upper-Body Bridge
Task:    ASSET-BUILD-05_GENERATE_BUST_BRIDGE_CANDIDATES_V2
Script:  D:\workspace\ComfyUI\MIKAGE_BUST_BRIDGE_EXECUTE_V2.py
Gate:    Set SUBMIT=True, run script, apply Quick-Pass Gate
Blocker: None (workflow validated, SUBMIT=False gate in place)
```

---

## 6. Future Build Order (Post Phase 4)

These slots are not yet specced. They are listed as forward reference only.
No action may be taken on them until Phase 4 is complete.

| Future slot | Phase | Dependency |
|---|---|---|
| Upper-body consistency reference set | Phase 5 | E-01 accepted |
| Body continuity constraint spec (ASSET-RESET-15) | Phase 5 | E-01 accepted |
| Storyboard panels (all character + env anchors) | Phase 6 | Phase 5 complete |
| Animatic assembly | Phase 6 | Storyboard panels complete |
| Environment anchor set | Phase 6/7 | Storyboard complete |
| Cinematic scene USD stage | Phase 7 | All Phase 6 gates PASS |
