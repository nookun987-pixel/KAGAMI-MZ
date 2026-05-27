# MIKAGE SOUND IDENTITY PILOT DRY-RUN PLAN V1

Status: PLANNED
Mode: INTERNAL_DRY_RUN
Purpose: Test the Sound Identity pilot workflow before accepting real market briefs.
Created: 2026-05-28

---

## 1. Objective

Run one internal dry-run before accepting real briefs.

Test this full path:

```text
Landing page -> Request Pilot Slot -> Intake form -> Brief received -> Sample package -> Delivery folder -> Communication templates -> Go/No-Go decision
```

Final decision required:

```text
READY_TO_SOFT_LAUNCH = YES / NO
```

---

## 2. Verified baseline for this dry-run

```text
Offer: Zenith Void Sound Identity Package
Pilot price: $49
Target test buyer: dark VTuber / streamer / cyberpunk creator
Sound Identity page: https://www.mikagezenith.com/sound-identity
Spotify artist proof: https://open.spotify.com/artist/0q0DXtP2XFsQLmbbviwixQ
Label proof: https://www.mikagezenith.com/label-verification
Track 30 pre-save: https://too.fm/pdvxoew
```

---

## 3. CHUA_XAC_NHAN before dry-run

```text
Payment flow live status
Request Pilot Slot CTA target
Intake form completeness
Email / inbox notification reliability
Google Drive / ZIP delivery flow
Client message templates readiness
Sample package readiness
```

---

## 4. Tomorrow dry-run schedule

### 09:00-10:00 — Landing page check

Check:

```text
[ ] Desktop page loads
[ ] Mobile page loads
[ ] $49 pilot offer visible
[ ] Package scope visible
[ ] 3-5 day delivery visible
[ ] Request Pilot Slot CTA visible
[ ] No wrong links, old text, or overclaims
```

Allowed landing text:

```text
Pilot Program: 3 Slots Open at $49
Includes: 60s loopable BGM + 1 transition stinger + 2 stream alerts
Delivery: 3-5 days after brief confirmation
Usage: non-exclusive digital streaming/content usage
```

Forbidden claims:

```text
100% copyright safe
full copyright transfer
guaranteed viral
Spotify-ready release
```

---

### 10:00-11:00 — Proof link check

Check:

```text
SPOTIFY_LINK_STATUS = PASS / FAIL
LABEL_VERIFICATION_STATUS = PASS / FAIL
SOUND_IDENTITY_PAGE_STATUS = PASS / FAIL
```

Do not require Spotify embeds yet. Correct proof links are enough for dry-run.

---

### 11:00-12:00 — Intake form setup/check

Required 8 fields:

```text
1. Creator / Project name
2. Contact email or X handle
3. Visual reference link
4. Main use case: Stream BGM / Intro / Alerts / Game prototype
5. Desired mood: dark / cyberpunk / gothic / horror / other
6. 3 music reference links
7. Special notes, max 200 words
8. Deadline / preferred delivery date
```

If payment is not live, CTA must say:

```text
Request Pilot Slot
```

Do not use:

```text
Buy Now
```

until payment is verified.

---

### 12:00-13:00 — Submit one fake brief

Test brief:

```text
PROJECT_NAME = Test VTuber Dark Overlay
USE_CASE = Stream BGM + stinger + alerts
MOOD = dark cyberpunk / cold / technical
REFERENCE_LINKS = 3 test links
DELIVERY_EXPECTATION = 3-5 days
```

Check:

```text
[ ] Form submits successfully
[ ] Notification received
[ ] No field is missing
[ ] Brief can be copied into a production task
[ ] No excessive follow-up questions required
```

---

### 14:00-16:00 — Sample package dry-run

Create a mini proof package only:

```text
1 x 20-30s BGM loop demo
1 x 3-5s stinger demo
1 x alert demo
```

Check:

```text
[ ] File creation is fast enough
[ ] File names are clean
[ ] MP3 export works
[ ] WAV export works if needed
[ ] ZIP or Drive delivery works
```

Suggested folder:

```text
MIKAGE_PILOT_TEST_001_DARK_VTUBER_SOUND_IDENTITY
```

Suggested files:

```text
01_BGM_LOOP_DEMO.mp3
02_TRANSITION_STINGER_DEMO.mp3
03_STREAM_ALERT_DEMO.mp3
README_USAGE_TERMS.txt
```

---

### 16:00-17:00 — Delivery package check

Check:

```text
[ ] Folder opens
[ ] Share link has correct access
[ ] Files can be played/downloaded
[ ] File names are clear
[ ] README_USAGE_TERMS.txt exists
[ ] No source/project junk files included
```

Minimum usage terms:

```text
Usage:
This package is provided for digital content, livestream, and creator media use.

License:
Non-exclusive usage license.

Credit:
Mikage Zenith STUDIO

Not included:
Copyright buyout, resale rights, stems, vocal recording, video editing.
```

---

### 17:00-18:00 — Communication template check

Required templates:

```text
[ ] Brief received message
[ ] Pilot package confirmed message
[ ] Demo delivery message
```

Do not publish or send cold outreach until dry-run passes.

---

### 20:00 — Go / No-Go report

Use this report format:

```text
MIKAGE SOUND IDENTITY PILOT DRY-RUN REPORT

DATE:
TEST_MODE: INTERNAL_DRY_RUN

1. Landing page:
STATUS = PASS / FAIL
ISSUES =

2. Proof links:
SPOTIFY = PASS / FAIL
LABEL_VERIFICATION = PASS / FAIL
SOUND_IDENTITY = PASS / FAIL

3. Intake form:
STATUS = PASS / FAIL
ISSUES =

4. Sample production:
STATUS = PASS / FAIL
ISSUES =

5. Delivery package:
STATUS = PASS / FAIL
ISSUES =

6. Communication templates:
STATUS = PASS / FAIL
ISSUES =

7. Payment:
STATUS = PASS / CHUA_XAC_NHAN
ISSUES =

FINAL_DECISION:
READY_TO_SOFT_LAUNCH = YES / NO

NEXT_SAFE_ACTION:
```

---

## 5. PASS rule

Only mark PASS if the item was checked.

If all core checks pass:

```text
READY_TO_SOFT_LAUNCH = YES
ACTION = publish 1 X post and send 5 manual lead messages only
```

Do not spam. Do not scale before first response data.

---

## 6. FAIL rule

If any blocker appears:

```text
READY_TO_SOFT_LAUNCH = NO
ACTION = fix only the blocker before accepting real briefs
```

Priority repair order:

```text
1. Landing / CTA
2. Intake form
3. Payment wording
4. Delivery folder
5. Message templates
6. Sample package
```

Do not reopen unrelated lanes:

```text
No MV work
No short video repair
No new music workflow
No new pipeline
```

---

## 7. Next safe action

```text
Open /sound-identity on desktop and mobile.
Check CTA, $49 offer, package scope, delivery time, and proof links.
Do not post on X yet.
Do not accept real briefs yet.
```
