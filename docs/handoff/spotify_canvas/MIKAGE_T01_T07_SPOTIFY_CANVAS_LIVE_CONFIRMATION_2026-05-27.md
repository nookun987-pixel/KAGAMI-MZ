# MIKAGE T01–T07 SPOTIFY CANVAS LIVE CONFIRMATION — 2026-05-27

## SOURCE OF TRUTH

This file records the operator-confirmed Spotify Canvas status for Mikage Zenith launch arc tracks T01–T07.

Evidence basis:
- Operator-provided Spotify mobile screenshots showing Canvas visible on mobile playback.
- Local/Codex-generated Canvas verify reports for rendered MP4s where provided.
- Spotify for Artists upload flow evidence for THE ROOT ARCHITECT and subsequent mobile visibility checks.

Do not infer Canvas analytics/views from this file. Canvas view counts remain unverified unless checked directly in Spotify for Artists analytics.

---

## OVERALL STATUS

```text
MIKAGE_T01_T07_SPOTIFY_CANVAS_ROLLOUT = LIVE_CONFIRMED_BY_OPERATOR_SCREENSHOTS
CANVAS_TRACK_COUNT = 7
CANVAS_LIVE_CONFIRMED_COUNT = 7
STATUS_DATE = 2026-05-27
```

---

## TRACK STATUS TABLE

| Track ID | Track Title | Canvas Status | Evidence State | Notes |
|---|---|---|---|---|
| T01 | THE LANDAUER PARADOX | LIVE_CONFIRMED | Operator mobile screenshot | Official cover/source visual Canvas. Binary digits are source artwork identity, not added lyrics/CTA. |
| T02 | DIGITAL ASH | LIVE_CONFIRMED | Operator mobile screenshot | Ratio-fixed version used after Spotify rejected initial file ratio. Final file required SAR 1:1 / DAR 9:16. |
| T03 | THE BREACH | LIVE_CONFIRMED | Operator mobile screenshot | Official cover/source visual Canvas visible on Spotify mobile. |
| T04 | SINGULAR HEART | LIVE_CONFIRMED | Operator mobile screenshot | V2 from official cover / Option A used. Previous procedural V1/V1B/V1C rejected visually. Canon exception applies to T04 official-cover Canvas only. |
| T05 | PORCELAIN ASCENSION | LIVE_CONFIRMED | Operator mobile screenshot | Official cover/source visual Canvas visible on Spotify mobile. Do not modify. |
| T06 | THE THEOREM | LIVE_CONFIRMED | Operator mobile screenshot | Official cover/source visual Canvas visible on Spotify mobile. |
| T07 | THE ROOT ARCHITECT | LIVE_CONFIRMED | Spotify For Artists posted confirmation + operator mobile screenshot | First approved Canvas template / root tower command-spine version. Do not modify. |

---

## LOCKED STATUS

```text
T01_THE_LANDAUER_PARADOX_CANVAS_STATUS = LIVE_CONFIRMED
T02_DIGITAL_ASH_CANVAS_STATUS = LIVE_CONFIRMED
T03_THE_BREACH_CANVAS_STATUS = LIVE_CONFIRMED
T04_SINGULAR_HEART_CANVAS_STATUS = LIVE_CONFIRMED
T05_PORCELAIN_ASCENSION_CANVAS_STATUS = LIVE_CONFIRMED
T06_THE_THEOREM_CANVAS_STATUS = LIVE_CONFIRMED
T07_THE_ROOT_ARCHITECT_CANVAS_STATUS = LIVE_CONFIRMED
```

---

## TECHNICAL RULES LEARNED

1. Spotify Canvas can be prepared/added from Spotify for Artists even when a track does not appear in the Songs analytics list, as long as the release/track is visible through Releases / Video & Visuals / Canvas.
2. Do not depend on Songs tab visibility or stream count to decide whether Canvas can be added.
3. Spotify can reject a file even if a local report says `1080x1920`; verify these exact metadata fields before upload:
   - `width = 1080`
   - `height = 1920`
   - `sample_aspect_ratio = 1:1`
   - `display_aspect_ratio = 9:16`
   - `duration ≈ 6.000s`
   - `fps = 30`
   - `codec = h264`
   - `pix_fmt = yuv420p`
   - `audio streams = 0`
4. When Spotify reports wrong ratio, re-export with a safe filter equivalent to:

```text
scale=1080:1920:force_original_aspect_ratio=increase,crop=1080:1920,setsar=1
```

---

## CREATIVE RULES LEARNED

1. Official cover/source visual is the preferred Canvas source for released tracks.
2. Avoid procedural-only geometry unless there is no usable official source visual.
3. T04 SINGULAR HEART proved that procedural core/ring builds can pass technical checks while failing visually; official cover identity solved the issue.
4. Track-specific official cover identity may override earlier no-face/no-portrait constraints only when the operator explicitly authorizes it for that track.
5. Do not generalize T04 exception to other tracks.
6. Do not modify Canvas files already live-confirmed unless the operator explicitly requests a new version.

---

## CURRENT LOCK

```text
DO_NOT_MODIFY_CANVAS_WITHOUT_OPERATOR_REQUEST = YES
DO_NOT_BATCH_REBUILD_T01_T07 = YES
DO_NOT_REOPEN_T07_TEMPLATE = YES
T01_T07_CANVAS_PHASE = CLOSED_AS_LIVE_CONFIRMED
NEXT_SAFE_TASK = WAIT_FOR_OPERATOR_NEXT_TRACK_OR_PLATFORM_TASK
```

---

## NOT YET VERIFIED

```text
CANVAS_VIEW_ANALYTICS = CHUA_XAC_NHAN
ALL_MARKET_PROPAGATION = CHUA_XAC_NHAN
SPOTIFY_FOR_ARTISTS_CANVAS_VIEWS_SYNC = CHUA_XAC_NHAN
```
