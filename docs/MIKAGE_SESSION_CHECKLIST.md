# MIKAGE — SESSION CHECKLIST (READ AT START OF EVERY SESSION)

> Purpose: stop re-improvising. Before doing ANY task, find the standard that already governs
> it and the source that already exists. One system per output. Extend; never reinvent.
> Pair with `docs/MIKAGE_SESSION_LESSONS.md` (mistakes already learned — do not repeat).

## 0. START-OF-SESSION ROUTINE (do in order)
1. Read `D:\KAGAMI-MZ_SYNC_PUSH_V2\CLAUDE.md` (durable rules).
2. Read `docs/handoff/00_LATEST_CODEX_HANDOFF.md` — the CURRENT_NEXT_TASK + dispatch.
3. Read this checklist + `docs/MIKAGE_SESSION_LESSONS.md`.
4. Identify the lane (A = character/rig/KAGAMI · B = music/short/public/MIKAGE AUDIO).
5. For the task at hand: open its governing STANDARD (table below) and CHECK what already exists
   before building anything new.

## 1. RULE BEFORE BUILDING ANYTHING PUBLIC
CHECK FIRST → then extend the existing system. Never make a new folder/name/track for an output
type that already has one. The repeated "dump" came from skipping this.
- Build-log / making-of? → `production/character/build_log/00_BUILD_LOG_STANDARD.md` is the index.
  Published flagship = GATHER_REEL film (PORCELAIN ASCENSION, Listen now). Do NOT make new
  "FORMATION_LOG / REEL" folders or pick a new track.
- Short / hook for a track? → `D:\MIKAGE ZENITH AUDIO\MIKAGE_SHORT_HOOK_SYSTEM\00_STANDARD\MIKAGE_SHORT_STANDARD.md`.
- Anything "public" → mikage-zenith-design skill is authoritative (void/porcelain/violet-signal, Cinzel/Shippori/Space Mono).

## 2. LANE A — character / rig (repo: D:\KAGAMI-MZ_SYNC_PUSH_V2)
| Task | Standard / source of truth | Notes |
|---|---|---|
| Do the next rig milestone | handoff `CURRENT_NEXT_TASK` + `.mikage/tasks/active_task.yaml` | Only this task. Codex runs Blender, not me. |
| Set/relay a Codex task | update active_task.yaml (locked task_type) + brief + handoff dispatch | See LESSONS §gate. validate_task.py must PASS first. |
| Verify a Codex result | physically: files exist + ffprobe mp4 + PNG dims | Can't verify git commit from sandbox (worktree .git on Windows). NEVER mark PASS/canon. |
| Build-log film / episode | `production/character/build_log/00_BUILD_LOG_STANDARD.md` | Flagship FILM = GATHER_REEL. Music PORCELAIN ASCENSION from 0:00. Local-script build. |

## 3. LANE B — music / short / public (root: D:\MIKAGE ZENITH AUDIO)
| Task | Standard / source of truth | Notes |
|---|---|---|
| Hook audio cut | MIKAGE_SHORT_STANDARD §D | 3-4 segs ~28s from WAV master, 24-bit/48k. |
| Short video (vertical) | MIKAGE_SHORT_STANDARD §A-C + per-track engine | 1080x1920, 30fps, AAC ≥317k, endcard 3s, thumbnail. |
| Batch render shorts | `tools/short_batch/build_shorts.py` (+ RUN_SHORTS.bat) | Run LOCAL. Audio 448k for quiet tracks. check_shorts.py to verify. |
| Audio below spec fix | re-mux from WAV master (not re-encode lossy) | 320k target undershoots on quiet audio → use 448k. |
| Release status / dates | `MIKAGE_RELEASE_REGISTRY.md` (re-export from TooLost) | CSV export is newer → reconcile when given one. |
| CTA grammar | LOCKED: `Listen now` (LIVE) / `Pre-save` (unreleased) | Never mixed. |

## 4. ENVIRONMENT GOTCHAS (sandbox) — always
- Sandbox mount of D: gives STALE/ inconsistent reads (folders show 0 files, old versions) and
  BLOCKS deletes and is SLOW writing big (>~60MB) files (times out → corrupts the target).
- Mitigations: (a) build in /tmp, then staged write (temp name → ffprobe verify → os.replace);
  (b) verify my own file edits with the Read tool (reads D: directly), not bash;
  (c) for big/batch renders → hand the operator a LOCAL script (build_shorts / build_film pattern).
- Engines hardcode a session path → make portable (FD = script dir) before shipping a local script.

## 5. ALWAYS
- Data-safety: never PASS / verified / canon-lock / final / production-ready without source or
  operator approval. Mock = SAMPLE/MOCK. Unknown = UNCONFIRMED. Public dev = PROTOTYPE / NOT CANON-LOCKED.
- Local commit only; push only on explicit operator authorization.
- End repo tasks with the RESULT block (CLAUDE.md).
