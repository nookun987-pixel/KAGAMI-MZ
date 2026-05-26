# MIKAGE SINGLE OPERATOR MEMORY

Last updated: 2026-05-27
Purpose: one-person operating memory for Mikage Zenith IP. Every ChatGPT / Codex / Claude / local agent job should read this file before doing Mikage work.

---

## 0. HARD RULE

Do not ask again for information already present in this file unless the field says `CHUA_XAC_NHAN`.

Required workflow:

```text
READ docs/handoff/MIKAGE_AGENT_READ_FIRST_PROMPT.txt
READ docs/handoff/MIKAGE_SINGLE_OPERATOR_MEMORY.md
DO THE TASK
UPDATE THIS FILE AFTER STATUS CHANGES
DO NOT CLAIM SUCCESS WITHOUT CHECKING OUTPUT
```

Read-first source remains:

```text
docs/handoff/MIKAGE_AGENT_READ_FIRST_PROMPT.txt
docs/handoff/MIKAGE_SINGLE_OPERATOR_MEMORY.md
```

---

## 1. CURRENT OPERATING BASELINE

Current operator baseline date: **2026-05-27**

Catalog status:

```text
Catalog total: 30 tracks
TooLost delivered: 29
TooLost pending: 1
```

Live confirmed tracks:

```text
THE LANDAUER PARADOX
DIGITAL ASH
THE BREACH
```

Do not claim unverified links live. A track can be `Delivered` in TooLost without a confirmed public/listenable platform link.

Terminology:

| Term | Meaning |
|---|---|
| Delivered | TooLost has delivered the release to stores/services |
| Pending | TooLost setup/delivery is not complete or not confirmed complete |
| Public / Live / Searchable | Users can see/listen to the track on a platform |
| Pre-save | Correct wording before release date or before live confirmation |
| Listen now | Only after release date and platform link is confirmed live |
| CHUA_XAC_NHAN | Not confirmed; do not infer |

Caption/link rule:

```text
Before release date: Pre-save:
After confirmed live: Listen now:
Uncertain status: Link:
Never write: Pre-save / listen
```

---

## 2. CATALOG BASELINE

Current catalog total is **30 tracks**.

TooLost summary:

```text
Delivered: 29
Pending: 1
```

Track 29 current record:

| # | Title | TooLost | UPC | Link | Notes |
|---:|---|---|---|---|---|
| 29 | 夜瓷回声 (PORCELAIN ECHO) | Pending | CHUA_XAC_NHAN | CHUA_XAC_NHAN | Do not claim UPC or public/pre-save link until confirmed |

Track 30 current record:

| # | Title | TooLost | UPC | Link | Release date | Notes |
|---:|---|---|---|---|---|---|
| 30 | 本当の名前 (REAL NAME) | Delivered | 0672896424194 | https://too.fm/pdvxoew | July 24th 2026 | Use `Pre-save:` until release/live confirmation. Direct Spotify/Apple/YouTube platform live status remains `CHUA_XAC_NHAN`. |

Track 30 TooLost metadata confirmed from operator screenshots on 2026-05-27:

```text
Title: 本当の名前 (REAL NAME)
Artist: Mikage Zenith
Status: Delivered
UPC: 0672896424194
Release date: July 24th 2026
Pre-order date: Not set
Catalog number: TOOLOST3001121021
Release format: Single
Language: Japanese
Genre: Pop
Secondary genre: Pop/J-Pop
Label: Mikage Zenith STUDIO
C-Line: Mikage Zenith Studio © 2026
P-Line: Mikage Zenith Studio © 2026
Release / smart link: https://too.fm/pdvxoew
Public/live platform links: CHUA_XAC_NHAN
Correct CTA before live confirmation: Pre-save:
```

Known live confirmations as of 2026-05-23:

| Title | Live status |
|---|---|
| THE LANDAUER PARADOX | Confirmed live |
| DIGITAL ASH | Confirmed live |
| THE BREACH | Confirmed live |

Important:

```text
Delivered count is distributor/store delivery state.
Live confirmed count is public availability state.
Do not convert pending, UPC, link, store log, or platform live fields to confirmed without direct evidence.
```

---

## 3. SPOTIFY OPERATING STATUS

Spotify for Artists:

```text
Access granted: YES
```

Spotify profile setup completed:

```text
Banner: DONE
Bio: DONE
Social links: DONE
Artist Pick: DONE
```

Spotify account security:

```text
2FA enabled: YES
2FA method: authenticator app
```

Do not publish or store authenticator backup codes, passwords, or account secrets in this repo.

---

## 4. CODEGRAPH STATUS

CodeGraph test status:

```text
Finalized: YES
Pushed: YES
Report: docs/handoff/CODEGRAPH_MIKAGE_TEST_REPORT_V0.md
```

CodeGraph role:

```text
Use CodeGraph for code navigation only.
Do not rely on CodeGraph alone for Mikage operating truth, catalog truth, release truth, public/live status, or handoff memory.
For operating memory, read this file and docs/handoff/MIKAGE_AGENT_READ_FIRST_PROMPT.txt first.
```

Observed limitation:

```text
CodeGraph is useful for JS/Python/YAML symbol discovery.
It did not reliably answer Markdown operating-doc questions during the V0 test.
```

---

## 5. TOOLOST FORMAT RULES

Do not recreate TooLost setup from scratch every time.

Required metadata fields to track per release:

```text
Track title
Artist
Language
Release date
Genre
Secondary genre
Label
UPC
Catalog number
Release link
Explicit/clean status
Lyrics status
Cover file status
Audio file status
AI rights proof pack status
Store delivery log status
Public/live status
```

Known stable label:

```text
Mikage Zenith STUDIO
```

Do not infer:

```text
Proof pack complete
Website complete
Store live
Direct Spotify/Apple/YouTube links live
UPC for pending tracks
Release link for pending tracks
```

unless checked.

---

## 6. SHORT VIDEO RULES

Default Mikage short-video rules:

```text
Do not show full lyrics unless explicitly requested.
Do not bake 5 languages on screen at the same time.
5-sub means sequential timed subtitle/concept blocks or production manifest, not one static list.
Use user's selected timestamps, not NotebookLM timestamps unless explicitly asked.
If using text-only visual direction: void black, white text, electric violet accent, minimal technical UI.
If exact text matters, render text deterministically; do not rely on image generation for text accuracy.
```

Caption rule:

```text
Use Pre-save: only before release date or before live confirmation.
Use Listen now: only after the platform link is confirmed live.
Never use Pre-save / listen.
```

---

## CURRENT MIKAGE STATUS — SHORT AUDIO REPAIR LOCK — 2026-05-24

STATUS:
- ACTIVE_SHORT_AUDIO_REPAIR_PHASE = CLOSED
- ACTIVE_SHORT_CLEANUP_PHASE = CLOSED_WITH_4_POLICY_ITEMS_OPEN
- SHORT_AUDIO_REPAIR_FINAL_LOCK_REPORT = D:\MIKAGE ZENITH AUDIO\SHORT_AUDIO_REPAIR_FINAL_LOCK_REPORT.md

FINAL_LOCK_SUMMARY:
- 26 repaired outputs PASS
- 15 remux duplicates archived
- 4 policy items kept untouched
- locked files touched = 0
- files deleted = 0
- audio repair batch must not be reopened unless operator explicitly selects one of the 4 policy items

DO_NOT_REOPEN:
- Do not rerun the 26-file audio repair batch.
- Do not rescan archived remux duplicates as active work.
- Do not touch locked Batch 2 files.
- Do not touch approved AAC320K_30FPS finals.
- Do not use compressed MP4 audio as source.
- Do not delete any media file.

REMAINING_POLICY_BACKLOG:
1. D:\MIKAGE ZENITH AUDIO\08. GLASS SKIN\short\GLASS_SKIN_SHORT1_WITH_ENDCARD_REMUXED.mp4
   STATUS = STILL_OPEN

2. D:\MIKAGE ZENITH AUDIO\08. GLASS SKIN\short\GLASS_SKIN_SHORT1_WITH_ENDCARD.mp4
   STATUS = NEED_OPERATOR_TIMECODE

3. D:\MIKAGE ZENITH AUDIO\17. NIGHT BITE\NIGHT_BITE_SHORT_10S_COVER_VERTICAL.mp4
   STATUS = NEED_OPERATOR_TIMECODE

4. D:\MIKAGE ZENITH AUDIO\DON'T LOOK BACK\SHORT1_DONT_LOOK_BACK_final.mp4
   STATUS = SOURCE_OR_ARCHIVE_DECISION_REQUIRED

OPTIONAL_OPEN_TASK:
- SINGULAR_HEART_0201_0245 visual rebuild remains optional.
- Previous wrong visual file was quarantined.
- Contact sheet exists but Japanese subtitle font rendering was blocked.
- Do not render final MP4 until operator approves corrected contact sheet.

NEXT_SAFE_TASK:
Move to next production lane.
Do not reopen audio repair unless operator explicitly selects one of the 4 policy items.

---

## 7. MUSIC CREATION RULES

Language rule:

```text
One song/version = one language.
Do not mix several languages inside the same song unless explicitly requested.
```

Music quality rule:

```text
Do not output a full setup before the hook/melody direction is clear.
A track must be remembered by melody/hook, not just noise, screaming, lore, or battle atmosphere.
```

---

## 8. WEBSITE / PUBLICATION RULES

Publication rule:

```text
Only switch a public page, caption, or CTA to Listen now when the relevant live link is confirmed.
Do not claim future or pending tracks are live.
Do not replace current launch focus unless the user explicitly asks.
Do not modify website production files unless the task explicitly targets them.
```

Core platforms to check after release date:

```text
Spotify
Apple Music
YouTube Music
TikTok / CapCut
Instagram / Facebook Audio Library
Amazon Music
Deezer
Tidal
```

---

## 9. UNKNOWN / CHUA_XAC_NHAN ZONE

Keep these fields as `CHUA_XAC_NHAN` unless direct evidence is provided:

```text
Track 29 UPC
Track 29 release/pre-save/listen link
Track 30 direct Spotify link
Track 30 direct Apple Music link
Track 30 direct YouTube Music link
Track 30 public/live platform status
Unverified direct Spotify links
Unverified Apple Music links
Unverified YouTube Music links
Unverified store delivery logs
Unverified public/live status for tracks other than THE LANDAUER PARADOX, DIGITAL ASH, THE BREACH
Proof pack completion where not directly checked
Website completion where not directly checked
```

---

## 10. NEXT ACTIONS

Immediate single-operator rule:

```text
Every agent task must start by reading:
1. docs/handoff/MIKAGE_AGENT_READ_FIRST_PROMPT.txt
2. docs/handoff/MIKAGE_SINGLE_OPERATOR_MEMORY.md
```

Every status-changing task must end by updating:

```text
Affected track
Before status
After status
Evidence source
Next action
```

Do not let chat history be the only memory.
