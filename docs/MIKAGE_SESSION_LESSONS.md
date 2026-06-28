# MIKAGE — SESSION LESSONS LOG (append-only; read at session start)

> One entry per session. Capture mistakes made + the rule to avoid repeating them, and any
> upgrade discovered. Newest on top. Keep entries short and actionable.

## 2026-06-28 (cont.) — Lane B: World Signal key art V0.2 + a canon-check correction

### Mistake I made (do not repeat)
- Flagged the PHANTOM cover/promo's dissolving-arm **crimson + kintsugi gold as a "warm-color BAN
  violation." WRONG.** Per `character/MIKAGE_PUBLIC_LORE_STANDARD_V1.md` (LOCKED 2026-06-28, §ART
  canon, lines ~97/105): on **character renders / covers / film**, crimson `#E60000` is canon for
  damage/dissolve effects (≤15% frame) and **kintsugi gold = seams** is part of the design. The
  "no warm" ban applies to **interface chrome + Spotify Canvas + the world-keyart draft spec ONLY**,
  not character covers. → Before calling any cover/render off-brand, READ the §ART-canon block of the
  lore standard first. Never conflate the two canon layers (brand-UI vs. ART/film).

### What worked (apply next time)
- **World key art via blockout → spec → prompt → one re-roll → lock.** Flat-SVG blockout (proportion
  only) got operator sign-off on composition BEFORE any render, so the GPT pass nailed it in 2 rolls.
- **Ghosts = featureless SIGNAL-MIST, phrased affirmatively** ("forms only barely suggested,
  dissolving into void") — saying "no face" makes GPT draw a face. First roll gave human-faced
  ghosts; affirmative re-phrase fixed it.
- **Kintsugi gold on the world key art**: thin seams on the hairline cracks only, ≤15% frame, never a
  light/wash; halo stays the single cold-white focus. Locked as `MIKAGE_WORLD_SIGNAL_KEYART_V0_2`
  (commit ef445af) under `production/character/keyart_candidates/`.



### What worked — no-Blender promo video (FUSE teaser, EN + JP)
- **Tease/teaser video built fully by CODE (PIL overlays + ffmpeg), delivered finished mp4.** No
  CapCut hand-assembly (operator opened it; code path = no fragile clicks, every beat controllable).
- **Two-pass render is the reliable pattern:** PASS 1 = `zoompan` slow push on the single still →
  `bg.mp4`; PASS 2 = overlay text/glow/grain + audio onto bg.mp4. zoompan MUST take a single input
  image; mixing `-loop 1` + many looped overlays in one graph throws "reinitializing filters".
- **Localized JP version > bilingual subs.** Shippori Mincho (`tools/mikage_short_toolkit/shippori500.ttf`)
  renders kanji/kana clean. Keep brand chrome (wordmark/labels) Latin; localize body lines + date
  (配信 = release, 事前保存 = pre-save). Real fonts already on disk in that toolkit (cinzel400/700,
  spacemono400, shippori500, notoserif_sc500) — no download.
- **Pick the music bed by RMS-per-2s scan** (sparse intro vs chorus plateau), then loudnorm + afade.
- Media output lives in `D:\workspace` (not the repo), per convention.

### Gotchas — do not repeat
- **`geq` with a time expression (breathing-alpha halo) BREAKS the overlay chain** → "Failed to
  inject frame into filter network: Invalid argument". Drop geq; use static overlay alpha
  (`colorchannelmixer=aa=`) or a small looped glow PNG.
- **Force `-framerate 30` on every looped PNG input** so fps matches the bg video, else overlay
  frame injection fails mid-graph.
- **Long renders time out the 45s bash call.** ~720 frames + 8 overlays = killed mid-encode. Split the
  timeline into ≤~390-frame segments, encode each at `-preset ultrafast`, concat (demuxer, identical
  params), then mux audio in a final `-c copy` pass. Do NOT `-c copy` split a CFR mp4 with `-ss` — it
  gives wrong frame counts; re-encode each segment with `-ss/-t`.

### Content state (UNCONFIRMED)
- World-tease V0.2 motion → became a **FUSE single teaser** once operator added track name + date
  (endcard "FUSE · SINGLE · OUT 20.07.2026"). Date 20.07.2026 is **operator-provided**.
- **FUSE track itself: UPCOMING, no release date in its metadata, and a filename/version mismatch**
  (`FUSE.wav` present = 2:30 but metadata labels it the 3:03 ALT; locked 2:30 master `FUSE__1_.wav`
  not in folder). Operator to reconcile before any FUSE submit. Do not treat 20.07 as locked in the
  release registry without confirmation.

## 2026-06-28 — Lane B PUBLIC: SOT cleanup · violet slit LOCK · AI-image breakthrough · no-Blender card/motion/promo (PHANTOM single shipped its visuals)

### What worked / upgrades (apply next time)
- **One source of truth.** Repo had TWO contradicting "source of truth" systems (`docs/ai_handoff/`
  described a dead image-gen runtime AND mislabeled the live `docs/handoff` as legacy) → that's WHY
  every session re-explained context. Fix: created `00_START_HERE_SOURCE_OF_TRUTH.md` (the one
  entry file: read order + authoritative file per topic). Archived the dead runtime to
  `_archive_legacy_runtime/` and old asset-gen handoff chains to `docs/handoff/_archive/` (operator
  `git mv`, history kept). Audit: `docs/MIKAGE_REPO_AUDIT_AND_CLEANUP_REPORT_V0_1.md`.
- **SLIT COLOUR LOCKED = electric-violet `#8F00FF`** on EVERY surface incl. character renders
  (operator decision — resolved the long crimson/violet ambiguity). Crimson `#E60000` = damage /
  internal-energy only; kintsugi gold = seams. Updated in `MIKAGE_PUBLIC_LORE_STANDARD_V1.md`.
- **AI image: ChatGPT (GPT-image) >> Midjourney for STRICT-canon character.** MJ chases a
  pretty-face prior → kept rendering Noh masks WITH faces. GPT reasons + follows instructions, so
  "faceless" sticks. The unlocks: (1) **affirmative framing** — "smooth blank porcelain where a face
  would be, the only break is two slits"; never "no face/no eyes" (negation summons a face);
  (2) explicit **"NO fox ears / NO kitsune"** (kitsune ears = canon ban). Winning anchor =
  `cover_phantom.jpg` (faceless egg + violet slits + dissolving arm) → became the **PHANTOM** single
  cover (real release, out Jul 14 2026).
- **No-Blender public pipeline, proven end-to-end on a real release:**
  - **Cards = PIL composite over the anchor + REAL fonts.** Download Cinzel + Space Mono TTF from
    Google-Fonts github raw into /tmp and use in PIL. Serif fallback looks cheap (operator: "củ
    chuối"); the real Cinzel = pro. Put the wordmark in the artwork's negative space (poster style).
  - **Simple motion = CapCut via computer-use.** Grant by the exact process basename `capcut.exe`
    (the Start-menu name didn't resolve / screenshots masked it). Use **Animation › Combo › Cam
    Motion** preset (one click). **CapCut manual KEYFRAMES via pixel-driving kept COLLAPSING** (the
    value applied to the whole clip, no start kf) — avoid; presets are reliable.
  - **Kinetic promo (text reveals one-by-one + zoom in/out + END-on-poster + music) = build by CODE**
    (PIL frames + ffmpeg), NOT CapCut hand-assembly. Every beat is controllable; CapCut hand-build of
    this would be many fragile clicks. End frame == the announce poster exactly.
  - **Combine a CapCut clip + a code promo** with ffmpeg `xfade` (same res/fps), audio from the hook
    (operator picked 0:50). Result: `MIKAGE_PHANTOM_PROMO_v3_FINAL.mp4` (24s).

### Gotchas (do not repeat)
- **midjourney.com is BLOCKED for Claude-in-Chrome automation** (org policy) → I can't drive MJ.
  ChatGPT image-gen is also browser/operator-driven. My value on AI images = prompt-craft +
  post-processing (cards/motion), not driving the gen tool.
- **Sandbox render: PNG save is the bottleneck** (~0.5s/frame, timed out at 600 PNGs). Use **JPG
  (quality 90)** = ~10-20× faster. And **SPLIT render (frames) from encode (ffmpeg)** into separate
  bash calls to fit the 45s timeout.
- **Sandbox can't delete files in the mounted folder** (`rm` → "Operation not permitted"). Don't
  drop temp/check files into the user's folder if you can't clean them.
- **Honest IP caveat recorded** (`MIKAGE_AI_IMAGE_PIPELINE_DECISION_AND_PROMPT_SYSTEM_V1.md`):
  pure-AI output is NOT copyrightable (US 2026) + active music-AI backlash → for the CORE canonical
  hero, add human-refined input / train a LoRA on own art. Use AI for volume + nailing the look.

### Deliverables (operator commits repo docs; media lives in D:\workspace)
- Repo: `00_START_HERE_SOURCE_OF_TRUTH.md` · `MIKAGE_REPO_AUDIT_AND_CLEANUP_REPORT_V0_1.md` ·
  `character/MIKAGE_PUBLIC_LORE_STANDARD_V1.md` · `MIKAGE_AI_IMAGE_PIPELINE_DECISION_AND_PROMPT_SYSTEM_V1.md` ·
  `MIKAGE_2D_TO_FAKE_3D_MOTION_RESEARCH_V1.md` (+ violet-lock edits). Legacy archived.
- D:\workspace (PHANTOM single): `cover_phantom.jpg` (anchor) · `MIKAGE_PHANTOM_COVER_card.png` ·
  `MIKAGE_PHANTOM_ANNOUNCE_card.png` · `MIKAGE_PHANTOM_MOTION_v1.mp4` · `MIKAGE_PHANTOM_PROMO_v1.mp4` ·
  `MIKAGE_PHANTOM_PROMO_v3_FINAL.mp4` (24s, music from 0:50).

### Process rule going forward
- **Strict-canon character art → GPT-image + affirmative framing**, not pure-prompt MJ. Lock ONE
  anchor, reuse as reference; LoRA later for consistency.
- **Kinetic / text / music video → CODE (PIL+ffmpeg)**, not CapCut hand-assembly. CapCut only for
  quick one-click preset motion. Combine clips with ffmpeg `xfade`.

## 2026-06-25 (cont.) — build-log film, TỈNH onboarding, Codex V1.4/V1.5

### Mistakes I made (do not repeat)
1. **Built parallel/divergent systems instead of checking what's PUBLISHED.** Made a
   `MIKAGE_FORMATION_LOG` + chose the wrong track (ROOT ARCHITECT) when the live build-log is
   `GATHER_REEL/MIKAGE_BUILDLOG_FILM_FULL` on PORCELAIN ASCENSION. → CHECK the published source +
   `build_log/00_BUILD_LOG_STANDARD.md` FIRST. Extend; never reinvent.
2. **Re-bundled already-published content.** Tried to append the gait to the published 2D→form film.
   → A build-log covers ONLY that session's NEW milestones; never retell published chapters.
3. **Used the COVER photo as the video background for TỈNH.** Cover-as-backdrop is ONLY for
   ATMOSPHERIC scene-covers (rain/fog), NOT a face cover → looked like a static slideshow.
   → Each track's engine must DRAW its own animated motif (§B2), not paste the cover.
4. **Ran two deliverables in parallel** (Lane A film fix + TỈNH onboarding) → quality dropped
   ("càng làm càng ngáo"). → One deliverable at a time, finish it, then move on.
5. **Premature technical claim in public copy** ("zero slide"). → Use neutral wording
   (`TWO-CYCLE GAIT TEST`) until the V-report PASSes AND operator approves the claim.
6. **Left untracked outputs / absolute paths in the KAGAMI repo** → blocked Codex's gate twice
   (untracked film MP4s + a doc with `D:\...` paths + `rmdir`). → Repo files must be path-neutral
   (no machine paths/commands); never leave build outputs untracked in the rig repo; commit
   governance in one batch; do build-log work when Codex is idle, commit immediately.

### Upgrades / methods discovered (apply next time)
- **Self-QA the full output before handoff.** Building the whole film + inspecting one frame per
  chapter caught real breaks: a 1-frame clip (overlay input not looped → add `-loop 1` + `-t`),
  a 1.25× footage stretch (mixed fps in concat → keep ALL segments at the SAME fps, here 24),
  and a busy contact-sheet chapter (swap for a clean single render).
- **GPT public-cut review checklist** (Formation Log): ≤16–18s · motion in the FIRST second ·
  mount BIG (crop close, don't shrink landscape to a dot) · ONE hook · don't repeat titles ·
  bigger PROTOTYPE label · neutral claim. If a vertical crop loses feet/blade → re-render a
  vertical camera from the PASSed animation (Lane A), don't scale-down landscape.
- **Vietnamese / diacritic folder names**: match by NFC-normalized name (`_resolve_track_dir`),
  not the raw string — added to `build_shorts.py` and `check_shorts.py`.
- **Quiet audio ceiling**: even 448k AAC cannot push a near-silent INTRO section above 317k;
  louder sections clear it. For a genuinely quiet section, bump to 512k OR pick a louder window.
- **Don't interrupt RUN_SHORTS mid-run** — a partial run leaves shorts unrebuilt (looks like the
  fix "didn't work"). Let it reach `Finished. N/N`.
- **Sandbox mount is SEVERELY unreliable this session**: stale/inconsistent/mangled reads (grep,
  python file-read, and the Read tool can disagree on the SAME file; folders show 0 files; big
  writes corrupt). Verify my edits with the Read tool (reads D: directly). To test an engine,
  write it fresh to /tmp via heredoc (bypass the mount). Final QA = operator runs check_shorts.py /
  validators on their machine.
- **Lane A done this session (verified by files + ffprobe, NOT marked canon)**: V1.3A binding,
  V1.4 gait, V1.5 two-cycle continuous gait — all Codex PASS. Git commit not verifiable from sandbox.

### Open at session end (next session: do these)
- Operator to run `RUN_SHORTS.bat` to completion: rebuild SILENT 1/2 + CINEMATIC 1/2 at 448k
  (still ~280–300k, interrupted earlier) AND build the 3 TỈNH shorts (new smoke motif). If SILENT
  intro still <317k after a full run → bump to 512k.
- Formation Log public cut still `HOLD_FOR_FIX` (GPT): the tight gait-only re-cut was in progress.
- TỈNH: folder structured + hooks cut + new motif engine ready; shorts pending the run above; not in registry yet.

## 2026-06-25 (Lane B shorts + Lane A coordination + build-log)

### Mistakes I made (do not repeat)
1. **Improvised parallel systems instead of checking what's published.** Built a new
   `MIKAGE_FORMATION_LOG` (wrong location) with the wrong track (ROOT ARCHITECT) while the
   PUBLISHED build-log was already `GATHER_REEL/MIKAGE_BUILDLOG_FILM_FULL` using PORCELAIN
   ASCENSION. → RULE: before any public/build-log asset, FIND the published source + its
   standard first (now indexed in `build_log/00_BUILD_LOG_STANDARD.md`). Extend, don't reinvent.
2. **Set a Codex task with a made-up `task_type`** (`FOUR_STEP_MECHANICAL_GAIT_PROOF`) →
   validate_task.py FAILed. task_type must be one of the LOCKED set (e.g. MP4_RENDER_ONLY,
   VERIFY_REPORT_ONLY). Also `output_folder_allowed` must be a DEDICATED temp gate folder
   (`_tmp/<task>_gate`) containing only `gate_report.txt` (+ optional `.gitkeep`), NOT
   `production/character` (verify_output.py walks every file there → FAIL).
3. **Corrupted a file with an in-place big-file write** (UNWRITE_SHORT2) — mount write of a
   ~70MB mp4 timed out mid-write. → RULE: never write big files in place; build in /tmp, then
   cp to a temp name, ffprobe-verify, then os.replace/rename (atomic, same FS).
4. **Trusted the bash mount for verifying my own edits** → it served stale/empty views. → RULE:
   verify edits with the Read tool (D: direct). Treat bash mount reads as possibly stale.
5. **check_shorts.py size bug**: ffprobe `width,height -of csv=p=0` returns `1080,1920` (comma),
   not split on `x`. Compare the string directly.

### Upgrades discovered (apply next time)
- **Quiet-track audio**: ffmpeg native AAC undershoots the target on sparse/quiet audio. `320k`
  target → ~280k actual; use **`448k`** to clear the ≥317k spec (gives ~345-410k). The low number
  reflects content loudness, not bad quality.
- **Render speed in sandbox**: import the engine ONCE and call `frame()` in a loop (rbud_fast),
  don't subprocess per chunk (rebuilds base each time). Budget ≤ ~35s/bash call. Engines hardcode
  the prior session's mount path → sed FD to current session, or make portable (FD = script dir).
- **Big batch render → local script.** The build_shorts.py + RUN_*.bat pattern (portable engines +
  JOBS list + safe staged write + skip-if-already-spec) is the reliable way; sandbox render is too
  slow/risky for volume. Same pattern reused for the build-log film (build_film_v04.py).
- **Verifying Codex (Lane A)**: files exist + ffprobe specs match the report = good; git commit
  is NOT verifiable from sandbox (worktree `.git` lives on the Windows drive). Say so honestly.
- **Governance gate flow**: update `active_task.yaml` (locked task_type + temp gate folder) +
  brief + handoff dispatch BEFORE Codex runs, else Codex goes off-gate (happened with V1.3A).

### Net process change
- Added `docs/MIKAGE_SESSION_CHECKLIST.md` (read at session start) +
  `build_log/00_BUILD_LOG_STANDARD.md` (one build-log system). This log to be appended each session.

---

## Session 2026-06-26 (cont.) — build-log FILM "FORGING THE MARK"
### What worked
- Build-log VIDEO = REUSE the existing engine (`build_log/GATHER_REEL_V0_1/build_buildlog_locomotion.py`:
  Cinzel+Space Mono, void+violet-halo base, grain, editorial chapter cards, footage grade, music).
  New entries = copy that pattern into a SELF-CONTAINED folder (`FORGING_THE_MARK_V0_1/` = script +
  RUN.bat + src/ + caption). Never hand-glue a stills slideshow — operator called that "củ chúi".
- Quick 3D-iteration montage beat ("THE FORGING") = `clip_montage()` of the real Blender CONTROL
  renders (blockout -> wedge -> reshape -> relight), labelled RAW 3D, reads as intentional BTS.

### Mistakes not to repeat
1. Don't reinvent a build-log clip when an engine already exists — read build_log/ first.
2. `base()` runs GaussianBlur(200) PER frame; with ~16 frames it crawls and the bg process wedges.
   CACHE base() (compute once, return .copy()). Big speedup.
3. nohup python on the workspace VM gets ORPHANED/wedged when a bash call hits the 45s timeout
   (segments stop progressing). Robust pattern: render segments to a STABLE mount dir, verify each
   with ffprobe, rebuild only corrupt ones, then concat in a separate short foreground call.
4. Editing source files on the Windows mount via the Edit tool can TRUNCATE (lost tail / unterminated
   string). Write whole scripts via bash heredoc `cat > f <<'EOF'` and verify with `ast.parse`.
5. `pkill -f <name>` can kill your OWN bash (its cmdline contains the name) — and matched PID 1 once.
   Use `pgrep -x python3` and kill by real PID; never broad pkill -f on the script name.
6. Public cut: strip `PROTOTYPE // NOT CANON-LOCKED` from card()/label_overlay() before posting
   (operator decision). Keep narrative labels (RAW 3D). Repo canon status is unchanged by this.
7. Match the beat to the film's subject: a head/helmet build-log -> the "2D mark" beat must be the
   MASK/head crop, not the full-body figure.

### Deliverables (CANDIDATE, operator commits/pushes)
- `build_log/FORGING_THE_MARK_V0_1/` (mp4 32.2s + hook 16s + engine + src + caption), 2D mark=mask,
  FORGING montage, music THE LANDAUER PARADOX from 1:27. Stamp removed for public. Body = next session.
ange onto ONE master; never generate states separately.

### Process rule going forward
- New hero = **start from V2 base**, **one error-group per round**, no full rebuild. Review must name the EXACT error + which layer fixes it: geometry->Blender, light/material->Blender relight, signal+bg->2D composite. No vague "make it better".

### Governance gotchas (Lane A)
- New `task_type` MUST be in `validate_task.py` `LOCKED_TASK_TYPES` — use an existing one (e.g. `CONTACT_SHEET_ONLY`) instead of inventing.
- Gate `output_folder_allowed` must EXIST before Codex runs -> create `_tmp/<gate>/.gitkeep`.
- **Write-overwriting a file on the Windows mount pads trailing NULL bytes** -> breaks YAML/parsers. Strip with `tr -d '\000'`, or append via Edit instead of overwrite.

---

## 2026-06-29 — Zenith Blade IP, video format lock, site deploy V13b

**Built**
- **Zenith Blade** (new cine-layer IP, V0.1 locked): corrected from a wrong katana to canon — **straight monolithic slab, point-down, single violet P3 core, grip ring mid-shaft** (read from the operator's BUILD LOG "Foundation Lock" frame). Deliverables in `BLADE_V0.1/`: 2D poster, 360° turntable, 2D→3D build reveal, "3D INSPECT" showcase, interactive three.js viewer (HTML), and WAKE lyric videos (EN/JP) that concatenate build → lyric → inspect → end card on one continuous WAKE track.
- **Character figure V0.4** (flat-graphic reproduction of the GPT "Foundation Lock" figure) + **World key art V0.4** matrix.
- **Website deploy V13b** (`MIKAGEZENITH_SITE_DEPLOY_V13b_BLADE_WAKE.zip`): new `zenith-blade.html` (3D viewer + video gallery + poster), Universe "Cine Layer" section (World keyart + figure + Blade 2D tile linking to the 3D page), and **WAKE/FUSE/PHANTOM added to `releases.js`** (covers added; `fm` smartlinks left blank → backfill on TooLost assignment).

**Locked**
- `docs/MIKAGE_VIDEO_FORMAT_STANDARD_V1.md` — one consistent public-video standard (fonts Cinzel/Shippori/Space Mono; violet = signal never a wash; build slow enough to read; lyric text left column entering at vocal onset; fixed end card; Pre-save→Listen now). Stops the per-day style drift the operator flagged.

**Lessons (technical)**
- The Studio OS folder name has an **em dash (—)** → `cmd copy` fails ("cannot find path") and breaks `git add`. Fix: PowerShell + wildcard `*Studio OS`; `.bat` uses `%~dp0`.
- ffmpeg **blend/screen must run in RGB (`format=gbrp`)** — on YUV it magenta-washes the whole frame.
- Restricted sandbox network: fonts via `npm pack @fontsource/*` → woff2→ttf (fonttools). Noto Serif CJK ttc indices JP=0/KR=1/SC=2. Background ffmpeg does not survive across bash calls; keep encodes <45s or chunk.

**State / pending**
- WAKE lyric timing was hand-estimated (no .lrc) — vocals start 0:23; nudge if off. JP translations are UNCONFIRMED (native review before posting).
- WAKE/FUSE/PHANTOM smartlinks PENDING in releases.js.
