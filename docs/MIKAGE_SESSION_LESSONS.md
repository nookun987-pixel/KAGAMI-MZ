# MIKAGE — SESSION LESSONS LOG (append-only; read at session start)

> One entry per session. Capture mistakes made + the rule to avoid repeating them, and any
> upgrade discovered. Newest on top. Keep entries short and actionable.

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
