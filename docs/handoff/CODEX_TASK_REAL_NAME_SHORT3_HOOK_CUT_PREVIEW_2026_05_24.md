# CODEX TASK - REAL NAME SHORT 3 HOOK CUT PREVIEW - 2026-05-24

TASK_STATUS = READY_FOR_CODEX
TRACK = 本当の名前 (REAL NAME)
ARTIST = Mikage Zenith
TASK_TYPE = SHORT_HOOK_CUT_GATE
PRIORITY = SHORT_3_FIRST

## 0. Read First

Before doing anything, Codex must read:

```text
docs/handoff/MIKAGE_AGENT_READ_FIRST_PROMPT.txt
docs/handoff/MIKAGE_SINGLE_OPERATOR_MEMORY.md
docs/handoff/00_LATEST_CODEX_HANDOFF.md
docs/handoff/MIKAGE_REAL_NAME_SHORT_HANDOFF_2026_05_24.md
docs/handoff/MIKAGE_REAL_NAME_SHORT_TEXT_UNIT_TIMING_PROPOSAL_2026_05_24.md
MIKAGE_SKILLS_V1/00_READ_FIRST/SKILL.md
MIKAGE_SKILLS_V1/02_SHORT_VIDEO_FORMAT/SKILL.md
MIKAGE_SKILLS_V1/03_AUDIO_EXPORT_STANDARD/SKILL.md
```

## 1. Mission

Create the next safe hook-cut gate for `本当の名前 (REAL NAME)` using the locked SHORT 3 hook.

Do not ask the operator for hook or cover. They are already locked in the handoff.

Do not render all three shorts yet.

## 2. Locked Source of Truth

```text
SHORT_ID = SHORT_3
SOURCE_TIMELINE = 3:42.00 -> 4:22.00
ROLE = final chorus / strongest identity reveal
PRIORITY = MAIN_POST_CANDIDATE
PREVIEW_TARGET = 3:42.00 -> 3:47.00
PREFERRED_COVER = REAL_NAME_COVER_CARD_AESTHETIC_LOCK_1080x1920.png
BANNED_PREFERRED_POST_COVER = REAL_NAME_COVER_CARD_FINAL_1080x1920.png
RELEASE_LINE = Out July 24th 2026
LANGUAGE_DISPLAY = Japanese main / English subtitle small
```

## 3. Required Local Source Confirmation

First, locate and confirm the real local paths for:

```text
AUDIO_SOURCE = original WAV/master for 本当の名前 (REAL NAME)
COVER_SOURCE = REAL_NAME_COVER_CARD_AESTHETIC_LOCK_1080x1920.png
```

Expected likely search roots:

```text
D:\MIKAGE ZENITH AUDIO
D:\KAGAMI-MZ_SYNC_PUSH_V2
```

Do not invent paths. If a file is not found, stop and report:

```text
FAIL_LOCAL_SOURCE_PATH_CHUA_XAC_NHAN
```

## 4. Absolute Audio Rule

```text
Use original WAV/master audio only.
Never use MP4 audio as source.
Never use old compressed preview audio.
Do not accept ~192k AAC in final/preview export.
```

Preview export target:

```text
VIDEO_CODEC = h264
RESOLUTION = 1080x1920
FPS = 30
AUDIO_CODEC = aac
AUDIO_BITRATE_TARGET = 384k or 512k if possible
SAMPLE_RATE = 48000
CHANNELS = stereo
```

Verify preview with ffprobe before reporting technical PASS.

## 5. Visual Rule

Use the existing preferred aesthetic cover as base / visual anchor unless local visual system already has a matching no-text base.

Required visual mood:

```text
void black background
cracked porcelain shell motif
violet rain/static
thin signal line
premium dark Mikage look
```

Forbidden:

```text
visible SHORT label
CTA/link inside video body
anime face
character added
full lyric screen
karaoke style
five subtitles at once
debug/path text
using REAL_NAME_COVER_CARD_FINAL_1080x1920.png as preferred post cover
```

## 6. SHORT 3 Text Timing

Use this exact text-unit plan from the proposal:

| Unit | Time In | Time Out | Japanese Main | English Small Subtitle |
|---|---:|---:|---|---|
| S3-01 | 3:42.00 | 3:46.00 | 本当の名前を | Now I can hold my true name |
| S3-02 | 3:46.00 | 3:50.00 | 今なら抱きしめる | in my arms, at last |
| S3-03 | 3:50.00 | 3:54.50 | 壊れた私が | The broken me |
| S3-04 | 3:54.50 | 3:59.00 | 私になるために | becomes myself |
| S3-05 | 3:59.00 | 4:03.50 | 白い殻を裂いて | Tearing open the white shell |
| S3-06 | 4:03.50 | 4:08.00 | 夜明けの奥へ行く | into the depth of dawn |
| S3-07 | 4:08.00 | 4:12.50 | 冷たい光でも | Even if the light is cold |
| S3-08 | 4:12.50 | 4:17.00 | この手で選んでいく | I choose it with my own hands |
| S3-09 | 4:17.00 | 4:19.00 | 私だけの証 | the proof that belongs only to me |
| S3-END | 4:19.00 | 4:22.00 | 本当の名前 / REAL NAME | MIKAGE ZENITH - Out July 24th 2026 |

## 7. Outputs To Create Now

Create only these outputs now:

```text
OUTPUT_DIR = D:\MIKAGE ZENITH AUDIO\REAL NAME\short_reels_tasks\
```

If the exact folder does not exist, create a safe folder without moving/deleting existing files.

Required outputs:

```text
1. REAL_NAME_SHORT3_3m42_4m22_CONTACT_SHEET_V1.png
2. REAL_NAME_SHORT3_3m42_3m47_PREVIEW_1080P_REELS_V1.mp4
3. REAL_NAME_SHORT3_HOOK_CUT_PREVIEW_VERIFY_2026_05_24.json
4. REAL_NAME_SHORT3_HOOK_CUT_PREVIEW_REPORT_2026_05_24.md
```

Contact sheet frames:

```text
S3_FRAME_01 = 3:42.00 / S3-01
S3_FRAME_02 = 3:50.00 / S3-03
S3_FRAME_03 = 3:59.00 / S3-05
S3_FRAME_04 = 4:08.00 / S3-07
S3_FRAME_05 = 4:19.00 / S3-END
```

Preview:

```text
PREVIEW_SEGMENT = 3:42.00 -> 3:47.00
PURPOSE = confirm visual style + text readability + Japanese/English hierarchy before full render
```

## 8. Do Not Do Yet

```text
DO_NOT_RENDER_SHORT_1 = YES
DO_NOT_RENDER_SHORT_2 = YES
DO_NOT_RENDER_FULL_SHORT_3 = YES_UNTIL_OPERATOR_REVIEWS_CONTACT_SHEET_AND_PREVIEW
DO_NOT_REOPEN_AUDIO_REPAIR_BATCH = YES
DO_NOT_TOUCH_APPROVED_FINALS = YES
DO_NOT_DELETE_MEDIA = YES
```

## 9. Verify Before Reporting

Verify with ffprobe for preview MP4:

```text
width = 1080
height = 1920
fps = 30
video codec = h264
audio codec = aac
audio bitrate >= 317000 bps minimum, preferred 384k/512k target
audio sample rate = 48000
audio channels = 2
```

Manual/contact-sheet checks:

```text
no visible SHORT label
no CTA/link in body
no anime face
no debug/path text
Japanese main text readable
English subtitle smaller and directly under main text
not a full lyric screen
not karaoke
```

## 10. Failure Conditions

Stop and report FAIL if any condition appears:

```text
FAIL_LOCAL_SOURCE_PATH_CHUA_XAC_NHAN
FAIL_AUDIO_SOURCE_NOT_WAV
FAIL_AUDIO_BITRATE_LOW_AROUND_192K
FAIL_VISIBLE_SHORT_LABEL
FAIL_CTA_OR_LINK_IN_BODY
FAIL_ANIME_FACE_OR_CHARACTER_ADDED
FAIL_FULL_LYRIC_SCREEN
FAIL_KARAOKE_STYLE
FAIL_TEXT_TOO_SMALL
FAIL_SUBTITLE_STACKED_OR_TOO_MANY_LINES
FAIL_USING_REAL_NAME_COVER_CARD_FINAL_AS_PREFERRED_POST_COVER
FAIL_FFPROBE_NOT_RUN
```

## 11. Report Format Required From Codex

Codex final reply must be short and structured:

```text
RESULT = PASS / FAIL / PARTIAL

CREATED =
- <contact sheet path>
- <preview mp4 path>
- <verify json path>
- <report md path>

SOURCE_CONFIRMED =
AUDIO_SOURCE = <path or CHUA_XAC_NHAN>
COVER_SOURCE = <path or CHUA_XAC_NHAN>

FFPROBE =
width =
height =
fps =
video_codec =
audio_codec =
audio_bitrate =
sample_rate =
channels =

VISUAL_CHECK =
short_label = PASS/FAIL
cta_in_body = PASS/FAIL
anime_face = PASS/FAIL
text_readability = PASS/FAIL
subtitle_hierarchy = PASS/FAIL

NEXT_SAFE_TASK = Operator reviews contact sheet + preview. If approved, render FULL SHORT 3 only.
```
