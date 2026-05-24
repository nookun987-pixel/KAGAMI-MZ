# MIKAGE REAL NAME SHORT TEXT-UNIT TIMING PROPOSAL - 2026-05-24

STATUS = TEXT_UNIT_TIMING_PROPOSAL_CREATED
TRACK = 本当の名前 (REAL NAME)
ARTIST = Mikage Zenith
RELEASE_LINE = Out July 24th 2026
LANGUAGE_DISPLAY = Japanese main / English subtitle small
TASK_SOURCE = docs/handoff/MIKAGE_REAL_NAME_SHORT_HANDOFF_2026_05_24.md

## 1. Scope

This file completes the first part of the recorded NEXT_SAFE_TASK:

```text
Create text-unit timing proposal for the 3 operator-selected shorts.
```

This file does not claim that a contact sheet, preview MP4, or final MP4 has been rendered.

```text
CONTACT_SHEET_STATUS = NOT_RENDERED_IN_THIS_STEP
PREVIEW_STATUS = NOT_RENDERED_IN_THIS_STEP
FINAL_RENDER_STATUS = NOT_STARTED
PASS_CLAIM = NO
```

## 2. Evidence Read

Read sources:

- `docs/handoff/MIKAGE_REAL_NAME_SHORT_HANDOFF_2026_05_24.md`
- `docs/handoff/00_LATEST_CODEX_HANDOFF.md`
- `docs/handoff/MIKAGE_AGENT_READ_FIRST_PROMPT.txt`
- `docs/handoff/MIKAGE_SINGLE_OPERATOR_MEMORY.md`
- `MIKAGE_SKILLS_V1/00_READ_FIRST/SKILL.md`
- `MIKAGE_SKILLS_V1/02_SHORT_VIDEO_FORMAT/SKILL.md`
- `MIKAGE_SKILLS_V1/03_AUDIO_EXPORT_STANDARD/SKILL.md`
- File Library source lyric: `02_SOURCE_LYRIC_WITH_SECTIONS.txt`
- File Library preferred cover verification: `REAL_NAME_COVER_CARD_AESTHETIC_LOCK_1080x1920_VERIFY.txt`

## 3. Hard Locks From Handoff

```text
SHORT_1_TIMELINE = 2:18 -> 3:00
SHORT_2_TIMELINE = 3:15 -> 3:42
SHORT_3_TIMELINE = 3:42 -> 4:22
POST_PRIORITY = SHORT_3, SHORT_2, SHORT_1
PREFERRED_COVER = REAL_NAME_COVER_CARD_AESTHETIC_LOCK_1080x1920.png
DO_NOT_USE_PREFERRED_POST_COVER = REAL_NAME_COVER_CARD_FINAL_1080x1920.png
```

Visual lock:

```text
void black background
cracked porcelain shell motif
violet rain/static
signal line
no character
no anime face
no SHORT label
no lyrics as full screen
no CTA/link inside body
```

Audio lock:

```text
Use original WAV/master audio only.
Do not use MP4 audio source.
Verify final MP4 with ffprobe before claiming PASS.
```

## 4. CHUA_XAC_NHAN / Not Verified In This Step

```text
LOCAL_AUDIO_PATH = CHUA_XAC_NHAN
LOCAL_PREFERRED_COVER_PATH = CHUA_XAC_NHAN
FFPROBE_VERIFY = NOT_RUN
CONTACT_SHEET_FILE = NOT_CREATED_IN_THIS_STEP
PREVIEW_MP4_FILE = NOT_CREATED_IN_THIS_STEP
FINAL_MP4_FILE = NOT_CREATED_IN_THIS_STEP
EXACT_BEAT_SYNC = CHUA_XAC_NHAN_UNTIL_AUDIO_TIMELINE_REVIEW
```

Reason:

```text
The GitHub handoff says the local/repo source path still must be confirmed by Codex before rendering.
This step therefore prepares the timing plan and render gate, but does not claim media output.
```

## 5. Global Display Rule

For all 3 shorts:

```text
Canvas: 1080x1920 vertical
FPS: 30
Text layout: one Japanese main line/pair visible at a time
Subtitle: one small English subtitle directly underneath
Text density: max one emotional unit per screen
CTA/link in video body: forbidden
Visible SHORT label: forbidden
Karaoke: forbidden
Full lyric screen: forbidden
End card: allowed, 3 seconds
```

English subtitle note:

```text
English subtitle text below is a compact meaning subtitle for short-video readability.
It is not locked as official distributor translation.
OFFICIAL_TRANSLATION_STATUS = CHUA_XAC_NHAN
```

---

# SHORT 3 - MAIN POST CANDIDATE

```text
SOURCE_TIMELINE = 3:42 -> 4:22
ROLE = final chorus / strongest identity reveal
PRIORITY = MAIN_POST_CANDIDATE
TOTAL_DURATION = 40s
BODY_TEXT_DURATION = 37s
END_CARD_DURATION = 3s
```

## SHORT 3 Text Units

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

## SHORT 3 Contact Sheet Frames

```text
S3_FRAME_01 = 3:42.00 / S3-01
S3_FRAME_02 = 3:50.00 / S3-03
S3_FRAME_03 = 3:59.00 / S3-05
S3_FRAME_04 = 4:08.00 / S3-07
S3_FRAME_05 = 4:19.00 / S3-END
```

## SHORT 3 First Preview Gate

```text
PREVIEW_TARGET = 3:42.00 -> 3:47.00
PURPOSE = confirm visual style + text readability + subtitle hierarchy before full render
PREVIEW_RENDER_ALLOWED_AFTER = local audio path and preferred cover path confirmed
```

---

# SHORT 2 - BRIDGE / INTIMATE CONFESSION

```text
SOURCE_TIMELINE = 3:15 -> 3:42
ROLE = bridge / intimate confession
PRIORITY = SECOND_POST_CANDIDATE
TOTAL_DURATION = 27s
BODY_TEXT_DURATION = 24s
END_CARD_DURATION = 3s
```

## SHORT 2 Text Units

| Unit | Time In | Time Out | Japanese Main | English Small Subtitle |
|---|---:|---:|---|---|
| S2-01 | 3:15.00 | 3:18.00 | 誰にも見せない | There is a wound |
| S2-02 | 3:18.00 | 3:21.00 | 傷がある | I show to no one |
| S2-03 | 3:21.00 | 3:24.00 | 誰にも渡さない | There is a morning |
| S2-04 | 3:24.00 | 3:27.00 | 朝がある | I surrender to no one |
| S2-05 | 3:27.00 | 3:30.50 | もしも君が | If you come this far |
| S2-06 | 3:30.50 | 3:34.00 | 嘘の名前で | do not call me |
| S2-07 | 3:34.00 | 3:37.50 | 私を呼ばないで | by a false name |
| S2-08 | 3:37.50 | 3:39.00 | ただこの闇ごと | See all of this darkness |
| S2-END | 3:39.00 | 3:42.00 | 本当の名前 / REAL NAME | MIKAGE ZENITH - Out July 24th 2026 |

## SHORT 2 Contact Sheet Frames

```text
S2_FRAME_01 = 3:15.00 / S2-01
S2_FRAME_02 = 3:21.00 / S2-03
S2_FRAME_03 = 3:27.00 / S2-05
S2_FRAME_04 = 3:34.00 / S2-07
S2_FRAME_05 = 3:39.00 / S2-END
```

## SHORT 2 Preview Gate

```text
PREVIEW_TARGET = 3:27.00 -> 3:32.00
PURPOSE = confirm confession line readability and dark-bridge pacing
PREVIEW_RENDER_ALLOWED_AFTER = SHORT_3 preview/contact sheet approved or operator explicitly prioritizes SHORT_2
```

---

# SHORT 1 - EMOTIONAL CHORUS / IDENTITY PAIN

```text
SOURCE_TIMELINE = 2:18 -> 3:00
ROLE = emotional chorus / identity pain
PRIORITY = THIRD_POST_CANDIDATE
TOTAL_DURATION = 42s
BODY_TEXT_DURATION = 39s
END_CARD_DURATION = 3s
```

## SHORT 1 Text Units

| Unit | Time In | Time Out | Japanese Main | English Small Subtitle |
|---|---:|---:|---|---|
| S1-01 | 2:18.00 | 2:22.00 | 本当の名前は | My true name |
| S1-02 | 2:22.00 | 2:26.00 | まだ誰にも渡さない | belongs to no one else |
| S1-03 | 2:26.00 | 2:30.00 | 君でも世界でも | not to you, not to the world |
| S1-04 | 2:30.00 | 2:34.00 | 奪えない場所にある | it lives where no one can take it |
| S1-05 | 2:34.00 | 2:38.00 | 白い殻の奥で | Inside the white shell |
| S1-06 | 2:38.00 | 2:42.00 | 消えない火が揺れる | an undying flame trembles |
| S1-07 | 2:42.00 | 2:46.00 | 壊れたままでも | Even broken |
| S1-08 | 2:46.00 | 2:50.00 | 私は私を選ぶ | I choose myself |
| S1-09 | 2:50.00 | 2:54.00 | 本当の名前は | My true name |
| S1-10 | 2:54.00 | 2:57.00 | 生きていたことを | carries proof that I lived |
| S1-END | 2:57.00 | 3:00.00 | 本当の名前 / REAL NAME | MIKAGE ZENITH - Out July 24th 2026 |

## SHORT 1 Contact Sheet Frames

```text
S1_FRAME_01 = 2:18.00 / S1-01
S1_FRAME_02 = 2:30.00 / S1-04
S1_FRAME_03 = 2:38.00 / S1-06
S1_FRAME_04 = 2:46.00 / S1-08
S1_FRAME_05 = 2:57.00 / S1-END
```

## SHORT 1 Preview Gate

```text
PREVIEW_TARGET = 2:18.00 -> 2:23.00
PURPOSE = confirm chorus hook readability and identity-pain tone
PREVIEW_RENDER_ALLOWED_AFTER = SHORT_3 preview/contact sheet approved or operator explicitly prioritizes SHORT_1
```

---

# 6. Recommended Next Safe Task

```text
NEXT_SAFE_TASK_AFTER_THIS = CONFIRM_LOCAL_SOURCE_PATHS_AND_CREATE_SHORT_3_CONTACT_SHEET_PLUS_3_TO_5S_PREVIEW
```

Exact next work unit:

```text
1. Codex confirms local/repo paths:
   - original WAV/master audio
   - REAL_NAME_COVER_CARD_AESTHETIC_LOCK_1080x1920.png

2. Create SHORT 3 contact sheet only:
   - include S3_FRAME_01..S3_FRAME_05
   - verify no SHORT label, no CTA, no anime face, readable Japanese + English hierarchy

3. Create SHORT 3 3-5s preview only:
   - source audio: original WAV/master
   - segment: 3:42.00 -> 3:47.00
   - video: H.264, 1080x1920, 30fps
   - audio: AAC target 384k or 512k if possible, 48kHz stereo
   - verify with ffprobe

4. Do not full-render any of the 3 shorts until contact sheet / preview is reviewed.
```

## 7. Fail Conditions

Mark FAIL and stop if any of these happen:

```text
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
FAIL_LOCAL_SOURCE_PATH_CHUA_XAC_NHAN
```

## 8. Operator Review Order

```text
REVIEW_ORDER = SHORT_3_CONTACT_SHEET -> SHORT_3_3_TO_5S_PREVIEW -> SHORT_3_FULL_RENDER -> SHORT_2_CONTACT_SHEET/PREVIEW -> SHORT_1_CONTACT_SHEET/PREVIEW
```

No full batch render until SHORT 3 style gate passes.
