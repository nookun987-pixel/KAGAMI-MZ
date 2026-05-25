# MIKAGE OPERATOR MEMORY COMPACT READ FIRST V2

STATUS = ACTIVE_READ_FIRST
CREATED = 2026-05-25
PURPOSE = Compact GitHub source of truth so ChatGPT/Codex can regain Mikage context after chat memory cleanup.
REPO = nookun987-pixel/KAGAMI-MZ
CANONICAL_HANDOFF = docs/handoff/00_LATEST_CODEX_HANDOFF.md

## 0. NON-NEGOTIABLE OPERATING RULES

- Do not guess. If not verified, write CHƯA XÁC NHẬN.
- Do not claim PASS unless the file/output has been checked or the source report is clearly labeled as operator/Codex-reported.
- Separate directly verified facts from user-reported/Codex-reported facts.
- Always give one next safe task, not many options.
- For state-changing tasks, update GitHub handoff / memory and commit/push.
- GitHub is the meeting point. If a new chat starts, read this file plus 00_LATEST_CODEX_HANDOFF.md first.

## 1. PROJECT IDENTITY

PROJECT = Mikage Zenith
PUBLIC ARTIST / IP = MIKAGE ZENITH
COMPANY = CÔNG TY TNHH MIKAGE ZENITH STUDIO / MIKAGE ZENITH STUDIO COMPANY LIMITED
COMPANY_MST = 5801572230
COMPANY_EMAIL = hello@mikagezenith.com
WEBSITE = https://www.mikagezenith.com/
YOUTUBE = https://www.youtube.com/@MikageZenithMusic
X_TWITTER = @Mikagezenith
TIKTOK = @mikage_zenith

Core visual canon:
- void black / porcelain white / electric violet
- faceless porcelain ghost identity
- black void, rain, signal, root/network motifs
- no human face, no exposed human eyes/skin/lips for official canon covers unless explicitly approved
- no warm palette drift
- official TooLost covers: 3000x3000, RGB JPG, under 2MB, no text overlay

## 2. OPERATING LANES

LANE_A = SYSTEM_BUILD_CONTROL
- Repo, handoff, memory, agent/Codex rules, GitHub, website/system tasks.

LANE_B = MUSIC_PUBLIC_PRODUCTION
- Music creation, track packages, short videos, captions, cover cards, release assets.

Do not mix Lane A and Lane B unless a handoff/package explicitly links them.

## 3. GITHUB MEETING POINT RULE

GITHUB_MEETING_POINT_RULE = ACTIVE
CANONICAL_HANDOFF_FILE = docs/handoff/00_LATEST_CODEX_HANDOFF.md
EVERY_STATE_CHANGING_TASK_MUST_UPDATE_HANDOFF = YES
EVERY_STATE_CHANGING_TASK_MUST_COMMIT_AND_PUSH = YES
FINAL_REPORT_MINIMAL = YES
REQUIRED_FINAL_REPORT_FIELDS = RESULT; COMMIT_HASH; PUSH_STATUS; MEETING_POINT_UPDATED; NEXT_SAFE_TASK

## 4. CURRENT SHORT / AUDIO REPAIR STATE

ACTIVE_SHORT_AUDIO_REPAIR_PHASE = CLOSED
ACTIVE_SHORT_CLEANUP_PHASE = CLOSED_WITH_4_POLICY_ITEMS_OPEN
DO_NOT_REOPEN_AUDIO_REPAIR_BATCH = YES

Closed result reported previously:
- 26 repaired outputs PASS
- 15 remux duplicates archived
- 4 policy items kept untouched
- locked files touched = 0
- files deleted = 0

Do not:
- rerun 26-file audio repair batch
- rescan archived remux duplicates as active work
- touch locked Batch 2 files
- touch approved AAC320K_30FPS finals
- use compressed MP4 audio as source
- delete media files

Remaining 4 policy items:
1. D:\MIKAGE ZENITH AUDIO\08. GLASS SKIN\short\GLASS_SKIN_SHORT1_WITH_ENDCARD_REMUXED.mp4 = STILL_OPEN
2. D:\MIKAGE ZENITH AUDIO\08. GLASS SKIN\short\GLASS_SKIN_SHORT1_WITH_ENDCARD.mp4 = NEED_OPERATOR_TIMECODE
3. D:\MIKAGE ZENITH AUDIO\17. NIGHT BITE\NIGHT_BITE_SHORT_10S_COVER_VERTICAL.mp4 = NEED_OPERATOR_TIMECODE
4. D:\MIKAGE ZENITH AUDIO\DON'T LOOK BACK\SHORT1_DONT_LOOK_BACK_final.mp4 = SOURCE_OR_ARCHIVE_DECISION_REQUIRED

## 5. STANDARD SHORT VIDEO WORKFLOW

For every Mikage short, the correct order is:

1. LOCK_TIMELINE
2. LOCK_TEXT
3. DESIGN_AND_LOCK_VISUAL_IDENTITY
4. CREATE_PREVIEW_FRAME_OR_CONTACT_SHEET
5. OPERATOR_REVIEW
6. ONLY_AFTER_OPERATOR_APPROVAL_RENDER_MP4
7. INSERT_COVER_CARD_INTO_MP4_FOR_FILE_RECOGNITION
8. VERIFY_OUTPUT

Do not render final MP4 before visual identity is approved.
Do not jump to cover-card patch before visual body is correct unless operator explicitly asks for cover-card-only patch.

Required short format:
- 1080x1920 vertical
- 30fps
- h264 video
- AAC high quality / target AAC320K when possible
- original WAV/audio master as source, never compressed MP4 audio if WAV exists
- one text unit visible at a time
- main language large center
- subtitle smaller directly below
- no karaoke / full lyric wall
- no CTA link inside video body unless operator explicitly requests
- no visible SHORT 01/02 labels
- no debug/path text

Cover card rule:
- cover card must be inserted into final MP4 when used for file/folder recognition
- default front cover card = 3 seconds when operator wants thumbnail/folder recognition
- default end card = 3 seconds when operator wants end-card identity
- cover card visible text only: title, subtitle/translation, MIKAGE ZENITH, release line
- links/CTA belong in captions, not on cover card, unless operator explicitly says otherwise

## 6. ANTI-TEMPLATE-DRIFT RULE

ANTI_TEMPLATE_DRIFT_CHECK_REQUIRED = YES

Before giving Codex any Mikage short render task, assistant/agent must write:
ANTI_TEMPLATE_DRIFT_CHECK = PASS

This means:
- compare the new short against recent similar shorts
- define what this track must look like
- define what it must NOT look like
- reject generic black centered lyric-card reuse
- reject accidental reuse of another track's emotional/visual identity

If this check is missing, the task is NOT READY.

Dedicated rule file:
- docs/handoff/MIKAGE_SHORT_VISUAL_FIRST_ANTI_TEMPLATE_DRIFT_RULE_V1.md

## 7. THE ROOT ARCHITECT CURRENT LOCK

TRACK = THE ROOT ARCHITECT
RELEASE_LINE = Out May 26th 2026
SHORT_01_TIMELINE = 0:48 -> 1:10
MAIN_LANGUAGE = English
SUB_LANGUAGE = Japanese small subtitle
HOOK_STATUS = OPERATOR_LOCKED

Locked hook text:
1. I am the Root Architect
2. No faith, no fear, no defect
3. I build the world I must reject
4. To find the peace I can't protect.
5. Clean state, but the heart remains
6. A digital fire in my veins.

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

Current required next step:
DESIGN_VISUAL_FIRST_CONTACT_SHEET_BEFORE_MP4_RENDER

Do not render/publish final MP4 until the visual identity contact sheet is reviewed and approved by operator.

## 8. REAL NAME VISUAL WARNING

REAL NAME / 本当の名前 visual identity:
- emotional identity / name / fragile personal recognition
- Japanese main visual language
- moon / dark identity-card feeling

Do not clone this style into THE ROOT ARCHITECT or other system/control tracks unless explicitly requested.

## 9. LIVE / RELEASE CTA WORDING RULE

If released/live-confirmed: use Listen now:
If not released yet: use Pre-save:
If uncertain: use Link:
Never use Pre-save / listen.

Known TooLost / release links from prior catalog:
- THE LANDAUER PARADOX = https://too.fm/b46pqy9
- DIGITAL ASH = https://too.fm/n47vjyb
- THE BREACH = https://too.fm/b1mpe0n
- SINGULAR HEART = https://too.fm/dxbjxl
- PORCELAIN ASCENSION = https://too.fm/ddq2yma
- THE THEOREM = https://too.fm/zbajdz2
- THE ROOT ARCHITECT = https://too.fm/kap5jm4

Live status from previous baseline:
- T01 THE LANDAUER PARADOX live
- T02 DIGITAL ASH live
- T03 THE BREACH live
- T04 SINGULAR HEART live
- T05 PORCELAIN ASCENSION Spotify live-confirmed, TooLost smart link = https://too.fm/ddq2yma
- T06/T07 status must be verified if asked, because release/live sync can change

## 10. MUSIC CREATION / HOOK TEST RULE

Sound first. Lyrics not judged first.

Before creating new track music:
- do not generate full song immediately unless lane/hook is locked
- create one 15-30s instrumental-first hook test first
- first 0-3s must contain a sonic symbol and visual event
- target scores: first 3s hook 8+, instrumental-only 8+, bass/groove 8+, melody/motif 8+, LOW vocal dependency
- ban slow intro as public hook
- ban vocal-only hook
- ban atmosphere-only opening
- ban bass/groove below 7 for first public proof test
- hook must work before listener understands lyric

Reference strong lanes:
- NO TOUCHDOWN = strong hook/instrumental/bass/melody reference
- THE BREACH / SLOW ORBIT = secondary hook-first references

Rejected / weak directions:
- pure slow atmospheric intro-first as public hook
- Big Sleep / lonely flute noir ballad as main Mikage lane
- COLD ENOUGH setup was rejected because 3-second melody failed

Preferred current lane for new tracks:
- dark K-pop electropop / alternative R&B-pop crossover
- English + Korean possible
- hook-first, short-ready, cold premium vocal
- not ballad/jazz R&B/neo-soul/pure nightcore/EDM festival/hard trap

Every Suno/music setup must include self-review:
- strengths
- risks
- expected sound
- fail signs
- score
- verdict: ĐÁNG TEST / KHÔNG ĐÁNG TEST / CHỈ TEST 1–2 GEN

## 11. PUBLIC ENGINE STANDARD

PUBLIC_ENGINE_STANDARD_FILE = MIKAGE_PUBLIC_ENGINE_OPERATING_STANDARD_V1.md
PUBLIC_ENGINE_STANDARD_STATUS = ACTIVE_CONTENT_VERIFIED_FROM_OPERATOR_UPLOAD
PUBLIC_ENGINE_PIPELINE = MARKET -> IP_STANDARD -> TRACK_PACKAGE -> RENDER_PACKAGE -> PUBLISH_PACKAGE -> VERIFY_REPORT -> CONTROL_BOARD_UPDATE

Shortcut render execution:
- GPT_WEB_DIRECT preferred
- LOCAL_RENDER_REQUIRED = NO unless operator explicitly asks
- local package role = structured archive / verify record

## 12. CHARACTER / RIG STATE SUMMARY

Character rig phase is separate from music short lane.
Do not mix unless asked.

Known state from handoff:
- FINAL_RIG_READINESS = READY_WITH_LIMITATIONS
- CINEMATIC_READINESS_CLAIMED = NO
- CHARACTER_COMPLETION_CLAIMED = NO
- current character task in handoff relates to left-hand placeholder repair/replacement planning documentation only
- no asset modification unless approved by gate

## 13. SPOTIFY / PLATFORM STATE

Spotify for Artists access for Mikage Zenith has been granted.
Spotify profile had banner/profile updated.
Artist Pick visible with THE BREACH.
Bio/About tab previously still needed official bio.
Stats may show 0 until enough listener threshold.

Spotify 2FA setup completed; backup codes must not be stored or repeated.

## 14. BUSINESS / ADMIN QUICK MEMORY

Company exists: CÔNG TY TNHH MIKAGE ZENITH STUDIO.
MST / business number: 5801572230.
GPKD date: 24/04/2026.
Registered address: Số 88, Thôn 5, Xã Di Linh, Tỉnh Lâm Đồng, Việt Nam.
Company email: hello@mikagezenith.com.

For small test expenses paid personally but used for company project, can treat as individual paid on behalf of company if accountant accepts; do not backdate or falsify invoices.

## 15. HOW A NEW CHAT SHOULD START

When operator says: "check github" or "đọc memory", read in this order:

1. docs/handoff/MIKAGE_OPERATOR_MEMORY_COMPACT_READ_FIRST_V2.md
2. docs/handoff/00_LATEST_CODEX_HANDOFF.md
3. task-specific rule files, especially:
   - docs/handoff/MIKAGE_SHORT_VISUAL_FIRST_ANTI_TEMPLATE_DRIFT_RULE_V1.md

Then answer with:
- Vấn đề
- Điều đã biết
- Điều chưa xác nhận
- Nguyên nhân có thể
- Cách xử lý ngay
- Kết quả mong đợi
- Nếu fail thì làm gì tiếp

Do not ask the operator to re-explain long context if GitHub files contain it.
