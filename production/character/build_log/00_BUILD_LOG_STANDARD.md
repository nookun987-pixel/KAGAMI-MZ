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

### Queued now (today's NEW milestones only — 2026-07-04)
- CINE STAGING + AI-ENHANCE THRESHOLD: the render pipeline moved from a flat lookdev "sample"
  toward an actual cinematic frame. Arc this session: exception #46 (robe locomotion cleanup,
  PASS) → exception #47 (3-state S0/S1/S2 ignition lighting pass, PASS, independently verified —
  halo neutral-white/no-violet, void ≥70%) → exception #48 (`MIKAGE_ROBE_HERO_CINE_STAGING_V0_1`,
  staged environment: reflective floor, monoliths, Z-Blue depth layers, haze; hero clip with a
  genuine push-in/crane camera move, ignition landing on S2; PASS, independently verified — void
  80.85–89.19% across all 96 hero frames, halo pixel-sampled neutral at every state) → same day,
  operator installed the full local AI-enhance stack (ComfyUI + Flux.1-dev fp8 + ControlNet
  Union-Pro [Depth+Canny] + Redux + SigLIP vision encoder, `D:\workspace\ComfyUI\models`) →
  exception #49 (`MIKAGE_AI_ENHANCE_S2_DIALIN_V0_1`, ComfyUI img2img dial-in on the #48 S2 still,
  canon-gated, still-frame only) dispatched, **awaiting Codex run — no AI-enhanced candidate
  exists yet.**
- Operator framing (2026-07-04): this is the step "trước khi có da có thịt" — before the
  character reads as a real cinematic frame instead of a model/sample. NOT a canon change: the
  character stays faceless / two-slit / white-halo / draped-robe exactly per the 5 Immutable
  Identity Marks; this arc only upgrades staging, lighting, camera, and (once #49 passes) surface
  material read.
- Operator also holds his own reference/compare exports from today for this arc (`HERO_cine`,
  `HERO_compare`, `S2_cine`, `S2_compare`, a contact sheet, and `MZ-ANIMATIC-THIRDAXIS-S2-TIMINGPROOF`)
  in his own Downloads — these are operator-side reference material, not yet reviewed/verified by
  Cowork and not part of the governed `reviews/` deliverable set.
→ entry `MIKAGE_BUILDLOG_CINE_THRESHOLD_V0_1` — **BUILT 2026-07-04** (36.2s + `_HOOK.mp4` 18.0s),
per operator's explicit go-ahead. Script `build_buildlog_cine_threshold.py` in `GATHER_REEL_V0_1/`
(stage-based: setup/ch1/ch2/ch34/final/cleanup, `MIKAGE_AUDIO_ROOT` env override for portability).
4 chapters: 01 THE LIGHT (#47 S0/S1/S2) · 02 THE STAGE (#48 restaged S0/S1/S2) · 03 THE APPROACH
(#48 hero camera-move clip) · 04 WHAT'S NEXT (the #48 S2 still, captioned "AI-enhance dial-in
queued — not yet run", honest about #49 still being unrun). Title "IT ENTERS THE FRAME" is a
Cowork draft, easy to swap — not operator-confirmed copy. Music PORCELAIN ASCENSION from 0:00.
1080x1920/24fps/h264+aac, verified via ffprobe + frame extraction. NOT yet appended to
`MIKAGE_BUILDLOG_FILM_FULL_V0_3` (that's a separate operator call — see workflow §6 step 3). Not
canon-locked, not asset-locked, not final, no push.

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
