# MIKAGE SPOTIFY CANVAS TASK FORMAT STANDARD V1

Status: ACTIVE
Created: 2026-05-27
Scope: Spotify Canvas task prompts for Mikage Zenith tracks.

---

## PURPOSE

This file locks the standard format for future Spotify Canvas tasks so agents do not improvise, over-expand scope, batch unrelated tracks, or create inconsistent outputs.

Use this document when preparing task prompts for Codex, Claude, Gemini, Windsurf, or any local/render agent.

---

## CORE RULE

```text
ONE TASK = ONE TRACK = ONE CANVAS TEST
```

Do not batch multiple tracks in one task unless the operator explicitly authorizes a batch.

Do not mention unrelated previous tracks inside a new task unless it is strictly required as a blocker or direct dependency.

Do not add long governance explanations inside the render task prompt.

---

## STANDARD TASK STRUCTURE

Every Spotify Canvas render task must use this order:

```text
TASK NAME
TARGET
SOURCE RULE
CANVAS TYPE
VISUAL GOAL
KEEP VISUAL FOCUS
CANVAS SPECS
MOTION
COLOR / SHARPNESS GATE
CROP RULE
OUTPUT REQUIRED
VERIFY WITH FFPROBE
VISUAL REPORT
PASS CONDITION
```

Do not add extra sections unless the operator specifically asks.

---

## CANVAS TYPES

```text
TYPE A — Official Cover Motion
Use when the official cover/source is already strong and should remain the main identity.
```

```text
TYPE B — World / Environment Loop
Use when the cover/source is a location, corridor, city, beach, system field, or world shot.
```

```text
TYPE C — Object / Relic Loop
Use when the source contains a strong object, shard, mask, relic, core, shell, machine, tower, orbit, or artifact.
```

```text
TYPE D — Gesture / Action Motif Loop
Use when the source contains a clear gesture or action motif, such as silence gesture, touch gesture, bite motif, hand near object, etc.
```

---

## TECHNICAL CANVAS SPECS

Every Spotify Canvas MP4 must be:

```text
- MP4
- 1080x1920
- 9:16 vertical
- 6 seconds
- 30 FPS
- H.264
- yuv420p
- no audio
- playable MP4
- sample_aspect_ratio = 1:1
- display_aspect_ratio = 9:16
```

If Spotify rejects ratio, re-export with a filter equivalent to:

```text
scale=1080:1920:force_original_aspect_ratio=increase,crop=1080:1920,setsar=1
```

---

## HARD BANS

Every Canvas task must ban:

```text
- added text
- lyrics
- subtitles
- CTA
- logo
- watermark
- random new character
- procedural-only replacement when official source is usable
- batch output unless operator authorizes
- fast flashing
- hard glitch spam
- scene cuts
- muddy blue-purple haze
- warm orange/gold drift unless the source/track identity explicitly requires it
```

---

## VISUAL GATE

Technical PASS is not enough.

A Canvas can only be called upload-ready if both checks pass:

```text
TECH_PASS = YES
VISUAL_PASS = YES
```

Visual pass requires:

```text
- main subject readable within 1 second
- source identity preserved
- crop is clean
- color is not muddy
- key object/face/gesture/world motif is sharp enough on mobile
- no forbidden visual drift
```

If unsure, mark:

```text
TECH_PASS_BUT_VISUAL_REVIEW_REQUIRED
```

Do not call it LOCKED unless operator confirms after preview/upload.

---

## MINIMAL SOURCE-AWARE TASK TEMPLATE

Use this as the base format and replace bracket fields only.

```text
TASK NAME:
[TRACK_ID_OR_NAME]_CANVAS_TEST_V1

TARGET:
[TRACK TITLE] only.

SOURCE RULE:
Use the official [TRACK TITLE] cover/source visual as PRIMARY.

The source visual contains:
- [visual element 1]
- [visual element 2]
- [visual element 3]
- [background/mood]

Do not generate a new image.
Do not invent a new character.
Do not use procedural-only geometry.
Do not add text, lyrics, subtitles, CTA, logo, or watermark.

CANVAS TYPE:
[TYPE A / TYPE B / TYPE C / TYPE D] — [short type name].

VISUAL GOAL:
The Canvas must read within 1 second as:

[one-line visual meaning]

KEEP VISUAL FOCUS:
- [main subject]
- [secondary subject]
- [track-specific signal/motif]
- [palette/mood]

CANVAS SPECS:
- MP4
- 1080x1920
- 9:16 vertical
- 6 seconds
- 30 FPS
- H.264
- yuv420p
- no audio
- playable MP4
- sample_aspect_ratio = 1:1
- display_aspect_ratio = 9:16

MOTION:
- slow breathing zoom 100% → 102.5% → 100%
- [track-specific pulse/motion]
- very light static/rain/particles only
- no heavy haze
- no fast flashing
- no hard glitch
- no scene cuts

COLOR / SHARPNESS GATE:
- clean void black
- controlled electric violet / cold white highlights
- main subject readable within 1 second
- no muddy blue-purple haze
- no warm orange/gold drift unless track/source requires it
- preserve sharpness on [specific edges]

CROP RULE:
Create a clean 9:16 vertical crop.
The crop must keep:
- [required element 1]
- [required element 2]
- [required element 3]

If the crop is bad, create one alternate crop only and report it.
If the official source is too soft/messy, STOP and report SOURCE_VISUAL_WEAK.

OUTPUT REQUIRED:
1. [TRACK_NAME]_CANVAS_TEST_V1.mp4
2. [TRACK_NAME]_CANVAS_TEST_V1_CONTACT_SHEET.png
3. [TRACK_NAME]_CANVAS_TEST_V1_VERIFY_REPORT.md

VERIFY WITH FFPROBE:
Report:
- width
- height
- sample_aspect_ratio
- display_aspect_ratio
- duration
- r_frame_rate
- codec_name
- pix_fmt
- number_of_audio_streams

VISUAL REPORT:
1. PASS / FAIL
2. Source visual used
3. Crop quality
4. Mobile readability
5. Color cleanliness
6. Main subject sharpness
7. Files created
8. Tech specs
9. Exact blocker if FAIL

PASS CONDITION:
- Spotify-safe 9:16 MP4
- official source identity preserved
- main subject readable within 1 second
- color not muddy
- no added text
```

---

## HUSH / SAY LESS EXAMPLE

This is the approved focused format for HUSH / SAY LESS.

```text
TASK NAME:
HUSH_SAY_LESS_CANVAS_TEST_V1

TARGET:
HUSH / SAY LESS only.

SOURCE RULE:
Use the official HUSH / SAY LESS cover/source visual as PRIMARY.

The source visual contains:
- porcelain mask / face
- finger-to-mouth silence gesture
- violet horizontal waveform / signal line
- dark void background

Do not generate a new image.
Do not invent a new character.
Do not use procedural-only geometry.
Do not add text, lyrics, subtitles, CTA, logo, or watermark.

CANVAS TYPE:
TYPE D — Gesture / Silence Motif Loop.

VISUAL GOAL:
The Canvas must read within 1 second as:

quiet command / say less / silence pressure

KEEP VISUAL FOCUS:
- mask face
- finger silence gesture
- violet waveform / signal line
- clean black + controlled violet-white highlights

CANVAS SPECS:
- MP4
- 1080x1920
- 9:16 vertical
- 6 seconds
- 30 FPS
- H.264
- yuv420p
- no audio
- playable MP4
- sample_aspect_ratio = 1:1
- display_aspect_ratio = 9:16

MOTION:
- slow breathing zoom 100% → 102.5% → 100%
- subtle violet waveform pulse once per loop
- tiny shimmer on finger/mask edge
- very light static/rain only
- no heavy haze
- no fast flashing
- no hard glitch
- no scene cuts

COLOR / SHARPNESS GATE:
- clean void black
- controlled electric violet
- mask readable within 1 second
- finger gesture readable within 1 second
- waveform visible but not overpowering
- no muddy blue-purple haze
- no warm orange/gold drift
- preserve sharpness on mask edge, finger edge, eye slit, waveform line

CROP RULE:
Create a clean 9:16 vertical crop.
The crop must keep:
- mask face
- finger-to-mouth gesture
- waveform/signal identity

If the crop is bad, create one alternate crop only and report it.
If the official source is too soft/messy, STOP and report SOURCE_VISUAL_WEAK.

OUTPUT REQUIRED:
1. HUSH_SAY_LESS_CANVAS_TEST_V1.mp4
2. HUSH_SAY_LESS_CANVAS_TEST_V1_CONTACT_SHEET.png
3. HUSH_SAY_LESS_CANVAS_TEST_V1_VERIFY_REPORT.md

VERIFY WITH FFPROBE:
Report:
- width
- height
- sample_aspect_ratio
- display_aspect_ratio
- duration
- r_frame_rate
- codec_name
- pix_fmt
- number_of_audio_streams

VISUAL REPORT:
1. PASS / FAIL
2. Source visual used
3. Crop quality
4. Mobile readability
5. Color cleanliness
6. Mask/finger/waveform sharpness
7. Files created
8. Tech specs
9. Exact blocker if FAIL

PASS CONDITION:
- Spotify-safe 9:16 MP4
- official source identity preserved
- mask + finger gesture readable within 1 second
- waveform visible
- color not muddy
- no added text
```

---

## LOCKED OPERATING RULES

```text
DO_NOT_WRITE_GENERIC_CANVAS_TASKS = YES
DO_NOT_MENTION_UNRELATED_TRACKS_IN_SINGLE_TRACK_TASK = YES
DO_NOT_BATCH_BY_DEFAULT = YES
DO_NOT_CALL_TECH_PASS_VISUAL_PASS = YES
USE_SOURCE_AWARE_CANVAS_TYPE = YES
NEXT_SAFE_ACTION = USE_THIS_STANDARD_FOR_NEXT_CANVAS_TASK
```
