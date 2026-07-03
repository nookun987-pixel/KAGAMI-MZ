# MIKAGE BUILD LOG — STANDARD & INDEX (single source of truth)

> Why this file exists: the public build-log kept getting remade a different way each time
> (EPISODE slides, FORMATION_REEL, GATHER_REEL film, an ad-hoc MIKAGE_FORMATION_LOG) → a dump.
> This LOCKS one process, built around what is ACTUALLY PUBLISHED. Read before making any
> build-log asset. No new folder names, no new music, no new location. Extend; don't reinvent.

## 0. THE PUBLISHED CANONICAL (this is what is live — match it)
Root: `production/character/build_log/`
- **FLAGSHIP = `GATHER_REEL_V0_1/MIKAGE_BUILDLOG_FILM_FULL_V0_N.mp4`** — the cinematic build-log
  FILM. 1080×1920 · 30fps · AAC. Currently published: **V0_3 (~101s)**. Opens on a hero-motion
  hook (porcelain mount on void), editorial chapter titles (THE BLUEPRINT, THE ONLY LIGHT, …),
  ends on signature.
- **HOOK CUT = `GATHER_REEL_V0_1/MIKAGE_BUILDLOG_GATHER_PORCELAIN_V0_1.mp4`** — ~29s short for
  TikTok/Shorts (first-second hero motion, no on-screen text).
- **CAROUSEL companion = `EPISODE_NN/`** — 8 slides, 1080×1350, for Instagram carousels.

## 1. LOCKED CHOICES (do not change without operator)
- **Music = PORCELAIN ASCENSION (LIVE).** Use from **0:00**. CTA = `Listen now`. Smartlink = https://too.fm/ddq2yma
- Aspect: film + hook = **1080×1920**; carousel slides = **1080×1350**.
- Brand: void `#050508`, porcelain `#f2eeea`, violet `#8F00FF` as SIGNAL only (one seam/dot/trace).
  Cinzel (titles) · Shippori (CJK) · Space Mono (labels). Grain. No on-screen text on the film hook.
- Voice: calm, minimal, mysterious. Sign off `— MIKAGE ZENITH`. Label everything PROTOTYPE / NOT CANON-LOCKED.

## 2. CAPTION format (locked — see GATHER_REEL_V0_1/CAPTION.txt)
Three variants per post: **A** main (Reels/TikTok/Shorts) · **B** short hook (TikTok) · **C** Facebook (one beat longer).
Always: track credit + `Listen now` + smartlink + hashtag base
`#MikageZenith #AImusic #CharacterDesign #ConceptArt #3DArt #Porcelain #Violet #DarkArt #BuildLog`.

## 3. Chapter / episode INDEX (the story order)
The FILM and the EPISODE carousels tell the SAME arc. Keep them in sync.
| # | Chapter | Covers | Status |
|---|---------|--------|--------|
| 01 | Finding the silhouette | 2D origin → silhouette lock | DONE (EP01) |
| 02 | Into the world | first landmark / layout | DONE (EP02) |
| 03 | The design code | design rules / model sheet | DONE (EP03) |
| 04 | Off the page | drawing → geometry | DONE (EP04) |
| 05 | (set title from slides) | UNCONFIRMED | EP05 in progress |
| 06 | The transmissions | music / the voice | DONE (EP06) |
| — | THE FIRST FORM (film) | full reveal, 2D→form | PUBLISHED as FILM_FULL_V0_3 |
| 07 | It Learns to Walk | V0.8 rider · V1.4 gait · V1.5 continuous | BUILT (MIKAGE_BUILDLOG_LOCOMOTION_V0_1, publish status UNCONFIRMED) |
| **08** | **It Stands** | **FULL 0→final arc: blockout → match-to-master → helmet V0.3–0.7 → lookdev V0.8 → lookdev V0.8.1 hue fix → body V0.9–0.11 → assembly V0.12 → LOCK V0.14 → Canvas MOTION V0.2** | **NEXT — operator runs RUN_BUILDLOG_STANDINGHERO.bat (= v0_7 script, ~105s + hook). Operator rulings 2026-07-02: (1) build-log shows the PROCESS, not only finals; (2) review sheets are multi-panel — never paste a sheet whole [superseded, see v0_6/v0_7]. 2026-07-03 fix history: v0_3→v0_4 fixed a missing-glyph bug (Space Mono has no "→", rendered as tofu boxes) and added the V0.8.1 slit-hue-fix milestone. v0_4→v0_5 tried cropping each sheet to one panel + holding it with a caption on top — operator reported the crop kept cutting off the head/helmet and picking the wrong panel. v0_5→v0_6: operator asked to drop ALL text off the images and just gather them clean first — v0_6 showed the FULL source image every time (no crop, no overlay), letterboxed and held; confirmed clean by operator. v0_6→v0_7: operator asked for the technical caption back, read like a lyric line, and flagged that a bare image makes the version ambiguous — v0_7 restores the caption in a FIXED bottom band (230px) reserved below the image area, so the image is contain-fit above the band and text can never overlap the render again; each beat's version chip (e.g. "LOOKDEV V0.8.1 · HUE FIX") is now always visible.** |

## 4. SCOPE RULE (the one that was missing — read it)
A build-log entry covers **ONLY the NEW milestones produced in that session/day.**
- **NEVER re-bundle already-published chapters.** The 2D→form story is already published
  (`FILM_FULL_V0_3`) — leave it. Do not append to it or retell it.
- Each session's PASSed work = its OWN new build-log entry, in the SAME editorial format
  (void black, Cinzel chapter titles, framed render, Space Mono caption, PORCELAIN ASCENSION
  from 0:00 for the reel, PROTOTYPE / NOT CANON-LOCKED).
- Naming: `MIKAGE_BUILDLOG_<TOPIC>_V0_N` (new file per session), not a re-edit of the published film.

### Queued now (today's NEW milestones only — 2026-07-02)
- STANDING HERO: body V0.9–V0.11 build · V0.12 candidate · **V0.14 ASSET-LOCKED official
  standing hero** · **MOTION V0.2 approved Canvas** (operator rulings 2026-07-02).
→ entry `MIKAGE_BUILDLOG_STANDING_HERO_V0_1` — script `build_buildlog_standing_hero.py` +
`RUN_BUILDLOG_STANDINGHERO.bat` + `BUILDLOG_STANDING_HERO_CAPTION.txt` ready in
`GATHER_REEL_V0_1/`; operator runs the .bat locally (needs the audio root for music + fonts).
HUE-SAFETY: MOTION V0.2 goes in UNGRADED. Do NOT re-include published chapters.
(Previous queue — rider V0.8 + gait V1.4/V1.5 — was built as MIKAGE_BUILDLOG_LOCOMOTION_V0_1.)

## 5. CLEANUP of the dump (do this, then stop scattering)
- The ad-hoc `MIKAGE_FORMATION_LOG` folder in the external audio root (see CLAUDE.md "Local folder
  truth") is **WRONG / to be removed by the operator.** It used the wrong track (ROOT ARCHITECT,
  not the locked PORCELAIN ASCENSION) and the wrong location. Do not extend it. (Operator deletes
  it manually on the local machine — not a repo action.)
- `FORMATION_REEL_V0_1/` — earlier video attempts, SUPERSEDED by GATHER_REEL film. Keep as archive, don't extend.
- All future build-log output goes ONLY to `GATHER_REEL_V0_1/` (film/hook) or `EPISODE_NN/` (carousel).

## 6. Workflow to extend the FILM (follow every time)
1. Confirm the new module PASSed (Lane A report + verify).
2. Build the new chapter slide(s)/footage from confirmed `reviews/` + `renders/` milestones (gated on PASS).
3. Append the chapter to the film → new `MIKAGE_BUILDLOG_FILM_FULL_V0_(N+1).mp4`. Music PORCELAIN ASCENSION from 0:00.
4. Cut the ~29s hook version if posting to Shorts/TikTok.
5. Update `GATHER_REEL_V0_1/CAPTION.txt` (A/B/C) and this index (§3).
6. Optional: matching EPISODE_NN carousel.
7. Local commit only. No push unless operator authorizes. Everything stays PROTOTYPE / NOT CANON-LOCKED.
