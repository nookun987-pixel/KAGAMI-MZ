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

---

## 2026-07-02 — Build-log entry: STANDING HERO (Lane B, step A)

**Built**
- `MIKAGE_BUILDLOG_STANDING_HERO_V0_1` build kit in `GATHER_REEL_V0_1/`: `build_buildlog_standing_hero.py` + `RUN_BUILDLOG_STANDINGHERO.bat` + `BUILDLOG_STANDING_HERO_CAPTION.txt` (A/B/C). Covers ONLY the new milestones: body V0.9–V0.11 → candidate V0.12 → ASSET-LOCK V0.14 → Canvas MOTION V0.2. Film ~46s + tail-18s hook. Operator runs the .bat locally (music + fonts live in the audio root).
- `00_BUILD_LOG_STANDARD.md` index updated: ch07 (locomotion) marked BUILT/publish UNCONFIRMED, ch08 "It Stands" = NEXT; §4 queue refreshed.

**Lessons (technical)**
- MOTION V0.2 goes into the film **UNGRADED** — the eq/colorbalance grade used on older footage would shift the operator-approved slit violet (fix-at-export rule from the V0.14 lock). Any future build-log reusing approved Canvas clips: overlay label only, no color filters.
- `clip_image` now fits sources inside 980×1500 (older version assumed wide sources; 1440×1800 hero stills would have overflowed 1920 height).
- Smoke-test scripts in the sandbox with DejaVu substitutes for Cinzel/Space Mono — catches PIL/ffmpeg bugs without the operator's font kit.

**State / pending**
- Film NOT rendered yet (operator runs .bat). After render: verify hook, post per caption pack, update §3 publish status. Commit/push = operator (em-dash path → PowerShell wildcard).
**Correction (same session, operator flag)**
- V0_1 entry showed mostly finals → operator: build-log must show the PROCESS 0→final. Rebuilt as `build_buildlog_standing_hero_v0_2.py` (18 beats: blockout V0.1–0.3 → match-to-master → helmet V0.3–0.7 → lookdev V0.8 clay+porcelain → body V0.9–0.11 → assembly V0.12 → polish V0.13 → LOCK V0.14 → Canvas V0.2, ~78s). RULE going forward: a build-log entry = evolution arc with the rough early passes visible; "new milestones only" limits WHICH arc, not how much of its history to show. .bat now runs v0_2; V0_1 script kept, do not run.
**Correction 2 (same session, operator flag)**
- V0_2 still pasted contact sheets WHOLE into the vertical frame → panels unreadable ("đè 1 ảnh chèn nhạc"). LOOK AT the source images before designing a cut: they are multi-panel review boards (up to 2880×1920 / 3600×900) with printed per-panel labels. V0_3 = rostrum camera: sheet scaled near frame height (upscale cap 1.5×), eased horizontal pan across the panels, version chip top + bottom scrim carrying the REAL per-round notes (what the pass did / FLAG / RULING, transcribed from dispatch records — no invented status). ffmpeg gotcha: commas inside crop-x expressions (min(t,D)) must be escaped `\,` or the filtergraph parser splits on them.
- Mount-sync gotcha again: a just-written file can appear TRUNCATED on the sandbox mount while the Windows original is complete — verify via the file tool, don't "fix" the original based on the stale mount copy.

## 2026-07-02 — Session: push motion V0.1/V0.2 + dispatch #25 turnaround
- Đọc `git status` thật trước khi soạn lệnh add: motion V0.1/V0.2 hóa ra ĐÃ commit (44 commit ahead), dirty thật = lessons + buildlog standard + GATHER_REEL untracked. Đừng suy từ handoff ("to be committed") — handoff có thể trễ hơn repo.
- Build-log = HOLD nhưng file GATHER_REEL vẫn phải commit để sạch repo cho clean-repo gate của Codex; commit ≠ mở lại lane.
- Dispatch #25 (TURNAROUND V0.1) mở kèm rule mới: lỗi mesh lộ ở góc mới = FLAG trong proof, KHÔNG tự sửa — mọi review trước chỉ soi 3/4-front.

## 2026-07-06 — Session: dispatch #54 FAIL ruling → revision #55 (Zenith Blade)
- Exception #54 (`MIKAGE_ZENITH_BLADE_3PHASE_REBUILD_V0_1`) passed both technical validators but operator ruled FAIL VISUAL/CANON: reads as armor/shield/energy-module, not a blade. Lesson repeated from the #52/#53 pink-drift catch — technical validator PASS is necessary but not sufficient; visual/silhouette read is a separate gate the operator must do himself, Cowork/Codex cannot self-certify it.
- Operator ruling also REVERSED the core-color premise #54 itself was built on (red `#E60000` → violet `#8F00FF`), directly contradicting the two locked spec files (`MIKAGE_ZENITH_BLADE_SPEC_V1.md` + `MIKAGE_ZENITH_ENTITY_PHASE_SPEC_V1.md` §0.5, locked 2026-06-02) that #54 itself cited as ground truth. RULE going forward: when an operator visual ruling conflicts with an already-locked spec doc, do NOT silently edit the locked doc and do NOT quietly ignore the conflict — write it explicitly into the new brief/exception/handoff entry (which files are now stale, on which specific question, pending what) so a future session doesn't re-trigger the exact #52/#53 mistake (a brief silently drifting from a locked doc nobody cross-checked).
- Revision #55 reused #54's rig/attachment/phase-driver system as the base (not a from-scratch rebuild) and reused exception #52's already-vetted slab geometry reference (`ZENITH_BLADE_SLAB_REFERENCE.svg`) for SHAPE only, discarding only its color — a rejected candidate can still contain reusable, previously-validated sub-parts (geometry survived, only hue was ever wrong across #52/#53/#54).

## 2026-07-06 (cont.) — #55 shape PASS, color pink-drift caught again on peak pixel
- V0_2 (exception #55) fixed the silhouette read completely (operator confirmed blade at all 3 phases) but its own proof's hue-check sampled off-peak seam points and reported blue-dominant PASS while the actual brightest/bloom-clipped pixel measured `R==B==255` (pure magenta). RULE going forward: a hue-check proof must sample the SINGLE BRIGHTEST pixel of an emissive signal, not an arbitrary point along it — bloom/emission clipping concentrates at the peak, and that peak is what a viewer's eye reads first. Off-peak sampling can pass while the visually dominant point still drifts.
- V0_3 dispatch (#56) added a mandatory beauty-vs-no-bloom diagnostic pair specifically to separate "wrong base material hex" from "bloom clipping the highlight" — bake this pattern into any future emissive-color verification task rather than trusting a single beauty-render sample.

## 2026-08-07 — BACKLOG APPEND: Zenith Blade board / material / lineage-audit debt (5 sessions never logged)

> Appended by `ZENITH_BLADE_PAPERWORK_CLOSEOUT_01` under explicit operator authorization (append-only,
> that task only). Root lesson of the backlog itself: five consecutive Blade sessions each ended with
> "lessons entry not appended" and the debt compounded silently. **Append the entry in the same session
> that produced the work** — a backlog append is reconstructed from artifacts and loses everything that
> was never written down.

- **2026-08-06 · Board V1 assembly.** 13-panel Final Design Board built by PIL composite from EXISTING renders only (Blender never opened); sources fit-to-panel capped at 1:1 with no upscale, the one exception being the 64/128 px silhouettes pixel-scaled nearest-neighbour and labelled as such. RULE: a missing cited source must ABORT generation, never silently substitute similar imagery.
- **2026-08-06 · Board V1 hardening (`ZENITH_BLADE_BOARD_V1_HARDENING_01`).** All 15 cited sources relocated onto durable non-gitignored paths under `renders/board_v1_evidence/`; `_tmp` originals kept, sha256 verified identical pre/post copy. The archived `build_board_v1.py` was deliberately LEFT pointing at the old `_tmp` paths because that is the accurate record of how the PNG was actually produced. RULE: when documentation catches up to reality after the fact, write the honest sequencing note — do not retro-edit the build script to look consistent.
- **2026-08-06 · Board V1 closeout (`ZENITH_BLADE_BOARD_V1_CLOSEOUT_01`).** Workstation tripwire rebaselined v1 -> v2 (78 -> 79 files, `cfbda510…8895e` -> `3a62ac63…44c9`) because the new durable CE15 copy's filename matched the tripwire's `zenith|blade` scope — a durability relocation, NOT a Blender write. Captured immediately with the reason recorded in `BASELINE_METHOD.md`. RULE: never silently update an expected tripwire value to make a check pass; rebaseline deliberately, record why, and check COUNT first (count wrong = file set changed; count right + hash wrong = a file was written).
- **2026-08-06 · Material reconcile/verify + canon issue.** Blender read-only inspection showed the long-standing "MAT_C vs V0.29" material conflict was a brightness-tier and unit-rounding artifact, not a hue disagreement (`MAT_C3_ZBLUE_GRAPHITE_CALIBRATED` = `#4B5866` x 0.2568 at 0.00% channel deviation; core violet exact to 6 dp against `#8F00FF`). Same failure mode as the earlier scale "conflict" that dissolved once inches were converted to metres. RULE: convert units / normalise brightness BEFORE declaring two records in conflict. Second finding: shells LR/UR are Z-Blue graphite, not porcelain — the signed canon lock said "four porcelain plates" and was wrong; corrected by issuing ERRATA 01 rather than editing the byte-frozen signed document.
- **2026-08-07 · Codex lineage audit (`ZENITH_BLADE_CODEX_LINEAGE_AUDIT_01`).** Read-only forensics on the V0.1 -> CE15 history. The briefed premise "MAT_C2 renders carry a kintsugi-gold tip" was FALSE: the gold appears only in `*_MATERIAL_ID.png`, a false-colour index map, and a pixel sweep of 39 beauty renders measured 0 warm pixels everywhere. RULE: never read a MATERIAL_ID / index / AOV render as a beauty render — its colours are object IDs, not materials. Second finding: six of seven V0.1->CE15 deltas traced to dated operator rulings, but the warm/gold ban entered via an `AGENTS.md` dispatch gate line (~3033/3320) with no ruling behind it. RULE: a gate line in a dispatch brief is NOT a ruling, and it must never silently narrow an operator-locked contract. Third finding: `MIKAGE_ZENITH_BLADE_SPEC_V1.md` was STRUCTURE CANON LOCKED 2026-06-02, four weeks BEFORE the V0.1 cine mock — so V0.1 was the deviation from canon and CE15 was the return to it, the reverse of the assumed drift direction. RULE: date the lock before assuming which artifact drifted.
