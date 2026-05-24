# MIKAGE REAL NAME SHORT HANDOFF - 2026-05-24

STATUS = ACTIVE_HANDOFF
TRACK = 本当の名前 (REAL NAME)
RELEASE_LINE = Out July 24th 2026
LANGUAGE_DISPLAY = Japanese main / English subtitle small

## Source Files

- Lyric source uploaded in ChatGPT: lyric(8).txt
- Audio source uploaded in ChatGPT: 本当の名前 (REAL NAME)(6).wav
- Local/repo source path still must be confirmed by Codex before rendering.

## Operator Selected Hook Timelines

Use these timelines as operator-selected source of truth unless the operator changes them.

1. SHORT 1
   - Timeline: 2:18 -> 3:00
   - Role: emotional chorus / identity pain
   - Status: OPERATOR_SELECTED

2. SHORT 2
   - Timeline: 3:15 -> 3:42
   - Role: bridge / intimate confession
   - Status: OPERATOR_SELECTED

3. SHORT 3
   - Timeline: 3:42 -> 4:22
   - Role: final chorus / strongest identity reveal
   - Status: OPERATOR_SELECTED
   - Priority: MAIN POST CANDIDATE

Post priority:
1. SHORT 3
2. SHORT 2
3. SHORT 1

## Cover Card Decision

Approved visual direction:
- void black background
- cracked porcelain shell motif
- violet rain/static
- signal line
- no character
- no anime face
- no SHORT label
- no lyrics
- no link

Important design decision:
- The deterministic overlay attempt looked worse because it darkened/covered the base image and made text feel pasted on.
- Do not use the visually worse overlay file as the post cover.

Preferred current post-ready aesthetic file from ChatGPT session:
- REAL_NAME_COVER_CARD_AESTHETIC_LOCK_1080x1920.png
- Status: AESTHETIC_LOCK_PREFERRED
- Resolution: 1080x1920 reported by ChatGPT verify
- Text mode: AI-integrated aesthetic text, not deterministic text layer

Do not use as preferred cover:
- REAL_NAME_COVER_CARD_FINAL_1080x1920.png
- Reason: technically more deterministic, but visually worse / too dark / text looks pasted on

If true deterministic text is required later:
1. Generate or create a no-text base visual first.
2. Then overlay deterministic text layers.
3. Do not cover existing AI text on a finished image.

Required cover text:
- 本当の名前
- REAL NAME
- MIKAGE ZENITH
- Out July 24th 2026

## Short Display Rules

- one Japanese main line at a time
- one small English subtitle underneath
- no full lyric screen
- no karaoke
- no five subtitles at once
- no CTA/link inside video body
- no visible SHORT label
- no anime face
- final end card allowed

## Audio / Export Rules

- use original WAV/master audio only
- do not use MP4 audio as source
- final MP4 target: H.264, 1080x1920, 30fps
- audio: AAC 384k or 512k if possible, 48kHz, stereo
- reject low audio around 192k
- verify with ffprobe before claiming PASS

## Next Safe Task

NEXT_SAFE_TASK = Create text-unit timing proposal for the 3 operator-selected shorts, then create contact sheet / 3-5s preview before full render.

## Tab Handoff Note

In a new ChatGPT tab, read this file plus:
- docs/handoff/00_LATEST_CODEX_HANDOFF.md
- docs/handoff/MIKAGE_AGENT_READ_FIRST_PROMPT.txt
- MIKAGE_SKILLS_V1/00_READ_FIRST/SKILL.md
- MIKAGE_SKILLS_V1/02_SHORT_VIDEO_FORMAT/SKILL.md
- MIKAGE_SKILLS_V1/03_AUDIO_EXPORT_STANDARD/SKILL.md
