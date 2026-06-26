# MIKAGE — SESSION LESSONS LOG (append-only; read at session start)

> One entry per session. Capture mistakes made + the rule to avoid repeating them, and any
> upgrade discovered. Newest on top. Keep entries short and actionable.

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

## Session 2026-06-26 — Character HERO lookdev (helmet V2): winning recipe + crawl lessons
→ **Recipe locked in `production/character/MIKAGE_HERO_LOOKDEV_RECIPE_V1.md`. Start every new hero from there, not from scratch.**

### What worked (the quality nut)
- The jump draft→hero is the **20% craft**: lighting, light/dark contrast, clean silhouette, slit/violet, bg cleanup. The lever was a **real Blender RELIGHT on a LOCKED form** (void black `#050508` + single Rembrandt key + thin rim + glazed porcelain), NOT more research and NOT 2D filters.
- Order that works: **Blender form → Blender relight/material → 2D finish (slit signal + cleanup) → production.**
- Slit rule that reads "alive": dormant = black recess; awakened = thin violet core (~38% slit height, ~-30% brightness), composited onto the SAME dormant master so the pair is pixel-identical (no morph on animation).

### Mistakes that cost the day (do NOT repeat)
1. **txt2img to invent a character that was already canon-locked** -> wrong. Start from the locked canon asset; never regenerate an owned character from a prompt.
2. **Didn't inventory existing assets first** -> burned hours on AI before finding the canon library (helmet sources, keyart, the MARK render). ALWAYS open + inventory existing refs first.
3. **Served the wrong/old mask** (smooth faceplate) when operator pointed at THE MARK (blocky violet "="). Confirm the EXACT source file before working (it was `keyart_candidates/MIKAGE_SOLO_VIOLET_V0_4.png`, via `build_ep03.py` helmet_crop).
4. **AI free-paint (fal Kontext, higher strength) DRIFTS a locked form** -> invented a 3rd bar, gold halo, round silhouette, even faces. For a locked form do NOT free-AI-relight; relight in Blender (respects facets). AI = concept/exploration only.
5. **Composite/cleanup created NEW errors**: violet leaked past silhouette; an edge-trim walked through a slit and ate the helmet into black bars; grey-square seam on the Canvas. Always **clip to the silhouette mask + ZOOM-verify edges**; never full-remask; **revert** if cleanup damages the form.
6. **Declared "same form / done" without pixel-checking** -> dormant & awakened were two different AI generations (would morph). For state pairs, composite the change onto ONE master; never generate states separately.

### Process rule going forward
- New hero = **start from V2 base**, **one error-group per round**, no full rebuild. Review must name the EXACT error + which layer fixes it: geometry->Blender, light/material->Blender relight, signal+bg->2D composite. No vague "make it better".

### Governance gotchas (Lane A)
- New `task_type` MUST be in `validate_task.py` `LOCKED_TASK_TYPES` — use an existing one (e.g. `CONTACT_SHEET_ONLY`) instead of inventing.
- Gate `output_folder_allowed` must EXIST before Codex runs -> create `_tmp/<gate>/.gitkeep`.
- **Write-overwriting a file on the Windows mount pads trailing NULL bytes** -> breaks YAML/parsers. Strip with `tr -d '\000'`, or append via Edit instead of overwrite.
