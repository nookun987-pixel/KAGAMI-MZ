# 07_STORYBOARD_ANIMATIC_RULES

## 1. Purpose

Defines the rules governing storyboard and animatic work. Adapted from the Storyboarder
principle that a visual story structure must exist before production begins.

No cinematic sequence, no shot list, no film plate, no video output may be created
without a storyboard and animatic that have passed review. This gate exists at Phase 6.

**Current phase: Phase 4. Storyboard and animatic are NOT ACTIVE and NOT PERMITTED.**

---

## 2. Core Rule

A shotlist, film plate, animated sequence, or cinematic render may not be created
until a storyboard and animatic have been:

1. Created in accordance with Section 3 (storyboard requirements)
2. Created in accordance with Section 4 (animatic requirements)
3. Reviewed and marked as approved by a human decision

This rule has no exceptions. A "quick concept" that skips storyboard is not permitted
in the Mikage production pipeline.

---

## 3. Storyboard Requirements

A valid Mikage storyboard must contain:

### 3.1 Panel Content Requirements

Each storyboard panel must define:

| Element | Requirement |
|---|---|
| Shot number | Sequential, referenced in shotlist |
| Character anchor | Which canon character asset(s) appear |
| Framing | Bust / wide / closeup / etc. |
| Camera angle | Front / side / three-quarter / etc. |
| Action / beat | What is happening in the shot (description only) |
| Environment note | What environment or background context applies |
| Duration estimate | Approximate seconds for animatic timing |

### 3.2 Panel Constraints

- Panels are descriptive documents, not render outputs.
- Panels may include rough sketches, placeholder images from the canon asset set, or text descriptions.
- Panels must not use FAILED_DO_NOT_USE or UNKNOWN_NEEDS_REVIEW assets as visual references.
- Panels must not depict facial anatomy on Mikage (sealed faceplate rule applies to storyboard).

### 3.3 Minimum Panel Count

- A storyboard covering a cinematic sequence must have at minimum one panel per major story beat.
- A sequence of less than 30 seconds requires at minimum 5 panels.
- A sequence of 30–90 seconds requires at minimum 15 panels.

### 3.4 Storyboard Review Gate

A storyboard must be reviewed by a human before animatic begins. Review must confirm:
- All required beats are covered
- No panel violates character identity constraints
- Panel framing is achievable with available canon assets
- Shot list derived from panels is coherent

---

## 4. Animatic Requirements

An animatic is a timed sequence of storyboard panels (or simple posed renders) assembled
to approximate the final edit timing.

### 4.1 Animatic Content Requirements

| Element | Requirement |
|---|---|
| Timing | Each panel held for its estimated duration |
| Audio scratch track | Optional but recommended for rhythm |
| Shot transitions | Cut, fade, or dissolve — marked explicitly |
| Total duration | Must match story beat target |

### 4.2 Animatic Asset Constraints

- Animatic visuals may use: canon-locked assets (A-01 through A-04), accepted TEMP_REFERENCE assets
- Animatic visuals must NOT use: FAILED_DO_NOT_USE assets, UNKNOWN_NEEDS_REVIEW assets, assets from wrong runs
- Animatic is a planning tool — it is not a production render
- Animatic is not a film plate and must not be presented as one

### 4.3 Animatic Review Gate

An animatic must be reviewed and approved before Phase 7 (Cinematic Production) begins.
Review must confirm:
- Timing is coherent
- All planned shots are achievable with planned assets
- No new asset slots are introduced that haven't gone through the pipeline build order

---

## 5. Shotlist Rules

A shotlist is derived from a reviewed storyboard. It may not be created before the
storyboard review gate passes.

A shotlist entry must include:

| Field | Description |
|---|---|
| Shot ID | Unique alphanumeric identifier |
| Panel reference | Storyboard panel number it derives from |
| Duration | Seconds |
| Framing | Bust / wide / closeup |
| Camera angle | Front / side / three-quarter / other |
| Character(s) | Named canon character(s) in frame |
| Environment | Named environment reference (must be a specced asset slot) |
| Asset dependencies | List of asset registry entries required for this shot |

---

## 6. Current Block

STORYBOARD_ALLOWED: NO
ANIMATIC_ALLOWED: NO
SHOTLIST_ALLOWED: NO
CINEMATIC_PRODUCTION_ALLOWED: NO

Reason: Pipeline is in Phase 4. Phase 6 (Storyboard / Animatic) requires Phase 5 to
complete first, which requires Phase 4 bust bridge slot to be filled and accepted.

Earliest possible Phase 6 start:
1. E-01 bust bridge accepted (TEMP_REFERENCE) → Phase 4 complete
2. Phase 5 readiness re-review PASS → Phase 5 entry permitted
3. Phase 5 upper-body consistency review PASS → Phase 5 complete
4. Phase 6 start authorised by human decision
