# MIKAGE WEBSITE UPDATE TASK — T05 PORCELAIN ASCENSION LIVE

STATUS = CREATED_FROM_GPT_WEB_CHECK
DATE = 2026-05-25
TARGET = Cloudflare Pages website / official music transmission site
WEBSITE_URL = https://www.mikagezenith.com/

## 1. Problem

The public website is still showing the T04 state as the current transmission while T05 PORCELAIN ASCENSION has been live-confirmed on Spotify by operator screenshot.

Current public website check shows:

- Hero copy still says: `Fourth transmission is live now.`
- Hero copy still says: `Listen to SINGULAR HEART now.`
- T05 PORCELAIN ASCENSION still uses `Pre-save` wording in the Launch Arc archive.

## 2. Confirmed Inputs

T05_TITLE = PORCELAIN ASCENSION
T05_ARTIST = Mikage Zenith
T05_RELEASE_DATE = 2026-05-25
T05_TOOLOST_LINK = https://too.fm/ddq2yma
T05_SPOTIFY_ALBUM_URL = https://open.spotify.com/album/23NwDTXesEuSRdEfvTRdYf
T05_PUBLIC_STATUS = LIVE_CONFIRMED_SPOTIFY
T05_CTA_WORDING = Listen now

## 3. Required Website Changes

Update the website source so the public site becomes T05-current:

```text
Fourth transmission is live now.
```

must become:

```text
Fifth transmission is live now.
```

```text
Listen to SINGULAR HEART now. THE BREACH, DIGITAL ASH, and THE LANDAUER PARADOX remain in the archive.
```

must become:

```text
Listen to PORCELAIN ASCENSION now. SINGULAR HEART, THE BREACH, DIGITAL ASH, and THE LANDAUER PARADOX remain in the archive.
```

Current transmission card must become:

```text
Current Transmission
PORCELAIN ASCENSION
Listen now
https://too.fm/ddq2yma
```

Launch Arc archive must update T05:

```text
05 / Launch Arc
PORCELAIN ASCENSION
Release: 25.05.2026
A white shell rises from the void.
Listen now
https://too.fm/ddq2yma
```

Do not change T06 and T07 yet:

```text
T06 THE THEOREM = Pre-save
T07 THE ROOT ARCHITECT = Pre-save
```

## 4. CTA Rule

Use exactly:

```text
Listen now
```

for T01–T05 if currently live-confirmed.

Use exactly:

```text
Pre-save
```

for future/unreleased tracks.

Never use:

```text
Pre-save / Listen
```

## 5. Verification Required After Deploy

After updating the site and deploying Cloudflare Pages, verify the public URL directly:

```text
https://www.mikagezenith.com/
```

Required PASS checks:

- Hero says `Fifth transmission is live now.`
- Hero CTA/current card points to T05 PORCELAIN ASCENSION.
- T05 archive card says `Listen now`, not `Pre-save`.
- T06 and T07 remain `Pre-save`.
- No stale `Fourth transmission is live now` text remains.
- No stale `Current Transmission SINGULAR HEART` remains.
- No `Pre-save / Listen` wording appears.

## 6. Final Report Format

```text
RESULT:
WEBSITE_SOURCE_UPDATED:
CLOUDFLARE_DEPLOY_STATUS:
PUBLIC_URL_CHECKED:
PUBLIC_HERO_STATUS:
T05_ARCHIVE_CTA_STATUS:
T06_T07_STATUS:
COMMIT_HASH:
PUSH_STATUS:
BLOCKERS:
NEXT_SAFE_TASK:
```

## 7. Next Safe Task

NEXT_SAFE_TASK = UPDATE_CLOUDFLARE_WEBSITE_T05_PORCELAIN_ASCENSION_LIVE_AND_VERIFY_PUBLIC_PAGE
