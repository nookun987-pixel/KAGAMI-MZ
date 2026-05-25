# MIKAGE SHORT VISUAL-FIRST + ANTI-TEMPLATE-DRIFT RULE V1

STATUS = ACTIVE
SCOPE = ALL_MIKAGE_SHORT_VIDEO_TASKS
REASON = Prevent repeated rework where operator has to remind that each track needs a distinct visual identity before render.

## HARD ORDER

For every Mikage short task, the required order is:

1. LOCK_TIMELINE
2. LOCK_TEXT
3. DESIGN_AND_LOCK_VISUAL_IDENTITY
4. CREATE_PREVIEW_FRAME_OR_CONTACT_SHEET
5. OPERATOR_REVIEW
6. ONLY_AFTER_OPERATOR_APPROVAL_RENDER_MP4
7. INSERT_COVER_CARD_INTO_MP4_FOR_FILE_RECOGNITION
8. VERIFY_OUTPUT

Do not skip step 3.
Do not render MP4 before visual identity is approved.
Do not patch cover card before visual identity is correct, unless the operator explicitly requests a cover-card-only patch.

## REQUIRED ANTI-TEMPLATE-DRIFT CHECK

Before giving Codex any short render task, the assistant/agent must write:

ANTI_TEMPLATE_DRIFT_CHECK = PASS

This means:
- compare the new short against the most recent similar Mikage short;
- define what the new track must look like;
- define what it must NOT look like;
- reject generic black centered lyric-card reuse;
- reject accidental reuse of another track's emotional/visual identity.

If this check is missing, the task is NOT READY.

## COVER CARD RULE

Cover card must be inserted into the final MP4 for file/folder recognition.
Default placement:
- front cover card: 3 seconds, when operator needs thumbnail/folder recognition;
- end cover card: 3 seconds, when operator requests end-card identity.

Do not leave the cover card only as a separate PNG if the task says it must identify the MP4.

## THE ROOT ARCHITECT LOCKED VISUAL IDENTITY

THE ROOT ARCHITECT must NOT look like REAL NAME.

THE ROOT ARCHITECT visual identity:
- ROOT ACCESS tower
- command spine
- violet dependency graph
- code grid / circuit map
- node tree / system hierarchy
- terminal execution pulse on text transition
- violet root-network growing upward from bottom
- cold authoritarian system-control mood

Avoid:
- REAL NAME-style emotional identity card
- soft anime / fragile identity mood
- dreamy particles as the main visual
- generic black + centered lyric card
- rain-only background

## THE ROOT ARCHITECT SHORT 1 CURRENT LOCK

TRACK = THE ROOT ARCHITECT
SHORT = SHORT_01
TIMELINE = 0:48 -> 1:10
MAIN_LANGUAGE = English
SUB_LANGUAGE = Japanese small subtitle
COVER_CARD_DATE = Out May 26th 2026

Current required next step:
DESIGN_VISUAL_FIRST_CONTACT_SHEET_BEFORE_MP4_RENDER

Do not render/publish final MP4 until the visual identity contact sheet is reviewed and approved by operator.

## FINAL RULE

For Mikage shorts, technical render settings are not enough.
Each short must pass visual identity lock first.
