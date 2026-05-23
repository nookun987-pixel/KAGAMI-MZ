# MIKAGE CHARACTER REFERENCE TOOLKIT V1

Status: ACTIVE_REFERENCE_WORKFLOW
Created: 2026-05-23
Owner: Mikage Zenith Studio
Scope: Character model sheet / visual production reference tools
Asset lock: NO

---

## 1. PURPOSE

This file registers the external reference tools identified from the operator's Reel screenshots.

The tools are NOT Mikage canon assets. They are workflow helpers for:

```text
layout reference
model sheet structure
height / body proportion planning
pose / motion / camera reference
secondary pattern / texture exploration
```

Do not use these tools to copy characters, outfits, scenes, copyrighted frames, or another artist's design language.

---

## 2. CURRENT MIKAGE WORK CONTEXT

Current visual work item:

```text
MIKAGE_ZENITH_MODEL_SHEET_V1_1_CLEAN_CANDIDATE
```

Current image direction:

```text
Approved direction: Mikage Zenith porcelain executor model sheet
Primary view: 3/4 view from the current model sheet
Support views: front / side / back / helmet close-up / helmet structure / logic ring / coat detail
Canon status: NOT ASSET-LOCKED
```

Immediate rule:

```text
Do not redesign the character.
Do not randomize the style.
Do not replace the current 3/4 identity.
Use these tools only to clean, standardize, and prepare next production steps.
```

---

## 3. TOOL REGISTRY

### TOOL 01 — Sakugabooru

URL:

```text
https://www.sakugabooru.com/
```

Use case:

```text
Animation frame reference
Pose reference
Camera / shot composition
Motion idea board for future shorts or visualizers
```

Allowed for Mikage:

```text
Study pose rhythm
Study frame composition
Study camera angle and movement logic
Study animation timing reference
```

Forbidden:

```text
Do not copy characters
Do not copy costumes
Do not copy exact scene composition
Do not copy copyrighted frame layouts as final art
Do not feed exact frames as Mikage visual identity source
```

Priority for current model sheet step:

```text
LOW_TO_MEDIUM
```

Reason:

```text
Useful later for motion / short-video / cinematic shot planning, not necessary for cleaning a static model sheet.
```

---

### TOOL 02 — Production Art / Reference Board Site

Exact URL:

```text
CHUA_XAC_NHAN
```

Known from screenshot:

```text
A site/page showing production drawings, character sketches, background layouts, storyboards, and reference sheets.
```

Use case:

```text
Model sheet layout reference
Turnaround board structure
Production art organization style
Reference board packaging
```

Allowed for Mikage:

```text
Study how concept sheets are arranged
Study how production references are grouped
Use as layout inspiration only
```

Forbidden:

```text
Do not copy specific drawings
Do not copy character designs
Do not use source images as Mikage art
```

Priority for current model sheet step:

```text
HIGH
```

Reason:

```text
This is the most relevant tool category for cleaning MIKAGE_ZENITH_MODEL_SHEET_V1_1_CLEAN_CANDIDATE.
```

---

### TOOL 03 — Hikaku Sitatter

URL:

```text
https://hikaku-sitatter.com/en/
```

Use case:

```text
Height comparison
Character scale lineup
Body proportion sanity check
Full-body turnaround planning
```

Known limits from site UI:

```text
Add a person: maximum 10
Add an item: maximum 3
```

Allowed for Mikage:

```text
Set Mikage Zenith full-body height
Compare Mikage / Commander Lyre / LORA / other entities
Check silhouette scale before full-body model sheet
Create height lineup screenshots for internal reference
```

Current required fields:

```text
MIKAGE_ZENITH_HEIGHT = CHUA_XAC_NHAN
COMMANDER_LYRE_HEIGHT = CHUA_XAC_NHAN
LORA_HEIGHT = CHUA_XAC_NHAN
BODY_RATIO_STANDARD = CHUA_XAC_NHAN
```

Priority for current model sheet step:

```text
HIGH_IF_FULL_BODY_NEXT
MEDIUM_FOR_BUST_ONLY
```

Next action:

```text
Before full-body turnaround, operator must choose provisional height for Mikage Zenith or mark it CHUA_XAC_NHAN.
```

---

### TOOL 04 — Pattern / Tiling Generator

Exact URL:

```text
CHUA_XAC_NHAN
```

Known from screenshot:

```text
A pattern generator UI with Pattern / Effects / Export tabs and tiling modes such as Octagon and Arabesque.
```

Use case:

```text
Ceremonial texture exploration
Coat inner lining pattern
Logic ring motif iteration
Website texture background
Mikage UI/sigil pattern tests
```

Allowed for Mikage:

```text
Generate secondary pattern studies
Create low-opacity background texture ideas
Explore porcelain / violet / black motif repetition
```

Forbidden:

```text
Do not put busy patterns into the main character model sheet
Do not replace clean silhouette with decorative textile noise
Do not use as primary character identity
```

Priority for current model sheet step:

```text
LOW
```

Reason:

```text
Useful later for texture / branding, not necessary for character structure lock.
```

---

## 4. CURRENT DECISION

```text
THE REEL TOOLS ARE USEFUL, BUT ONLY AS SUPPORT TOOLS.
THE CURRENT MIKAGE MODEL SHEET REMAINS THE PRIMARY SOURCE.
```

Tool ranking for the current step:

```text
1. Production art/reference board layout — HIGH
2. Hikaku Sitatter scale planning — HIGH when full-body starts
3. Sakugabooru pose/motion reference — MEDIUM later
4. Pattern generator — LOW now, useful later for texture systems
```

---

## 5. NEXT SAFE TASK

```text
NEXT_SAFE_TASK = CREATE_MIKAGE_MODEL_SHEET_V1_1_CLEAN_REVIEW_PACKAGE
```

Required package contents:

```text
1. Current model sheet image candidate
2. Manual text spec separated from AI-generated image text
3. PASS/FAIL checklist
4. Height/proportion field set to CHUA_XAC_NHAN until operator confirms
5. Reference-tool registry linked in handoff
6. Asset-lock blocked until consistency review passes
```

---

## 6. CODEX / LOCAL AGENT TASK

```text
TASK: REGISTER_CHARACTER_REFERENCE_TOOLKIT_AND_PREPARE_MODEL_SHEET_CLEAN_PACKAGE

Read:
- docs/handoff/MIKAGE_CHARACTER_REFERENCE_TOOLKIT_V1_2026-05-23.md
- current Mikage character model sheet candidate files if present

Do:
1. Create a folder for character reference workflow if missing.
2. Copy/register this toolkit file into the character workflow index.
3. Prepare a review package for MIKAGE_ZENITH_MODEL_SHEET_V1_1_CLEAN_CANDIDATE.
4. Do not asset-lock.
5. Do not redesign Mikage.
6. Mark all unknown website names and heights as CHUA_XAC_NHAN.
7. Output a short verify report.

Expected output:
- REFERENCE_TOOLKIT_REGISTERED = YES
- MODEL_SHEET_CLEAN_PACKAGE_STATUS = PREPARED
- ASSET_LOCK_ALLOWED = NO
- NEXT_SAFE_TASK = REVIEW_MIKAGE_MODEL_SHEET_V1_1_CLEAN_PACKAGE
```

---

## 7. HARD RULE

```text
REFERENCE_ALLOWED = layout / proportion / workflow / motion study
REFERENCE_FORBIDDEN = copying character / costume / exact shot / copyrighted frame / another artist's design
```

```text
DO NOT CLAIM CANON LOCK FROM TOOLKIT REGISTRATION.
TOOLKIT REGISTRATION ONLY MEANS THE SUPPORT WORKFLOW HAS BEEN RECORDED.
```
