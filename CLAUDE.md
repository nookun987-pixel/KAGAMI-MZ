# CLAUDE.md — Mikage Zenith Studio (KAGAMI-MZ repo)

> Persistent instructions for Claude Code working in this repository.
> You (the operator) wrote this; Claude reads it at the start of every session.
> Keep it to DURABLE rules. Do NOT put transient status here (release counts,
> "currently rendering X", today's task) — that lives in the handoff and the
> release registry, which change. (Principle: only long-term-value facts belong here.)

## Project
- Entity: CÔNG TY TNHH MIKAGE ZENITH STUDIO. Solo operator: BOOS BỚP (Phi Hùng).
- This repo (`KAGAMI-MZ_SYNC_PUSH_V2`): production assets + render pipeline for an
  AI-assisted music / visual-IP studio (Spotify Canvas, release pages, MV keyframe direction).
- Operator communicates in Vietnamese + English. Internal voice: direct, decision-first.

## Start here — every session
1. Read `docs/handoff/00_LATEST_CODEX_HANDOFF.md` FIRST.
2. Do ONLY the `CURRENT_NEXT_TASK` in that handoff. Nothing else.
3. If the handoff is missing or ambiguous, STOP and ask the operator. Do not guess a task.

## Two active operator lanes
- Lane A = system / build / control / character rig pipeline.
  - Owns repo/system/control files, character production pipeline, Blender / rig /
    deformation / motion-test work, source-of-truth audits, and build/control tasks.
- Lane B = music / public / short / website / public engine.
  - Owns music/public production, short-hook videos, captions/release/public engine,
    website/public pages, and public launch packages.

## Local folder truth
- `D:\KAGAMI-MZ_SYNC_PUSH_V2` = active working repo.
- `D:\KAGAMI-MZ` = original repo, not clean, HOLD only, do not use as main.
- `D:\MIKAGE ZENITH AUDIO` = external audio / short-hook root, currently unstructured.
- `D:\workspace` = experiments only.

## Lane discipline (hard rules — never violate)
- Follow `CURRENT_NEXT_TASK` only. Never change lanes without explicit operator authorization.
- Claude must not invent film / video / short / shotlist tasks.
- Claude may assist Lane B only when the operator explicitly requests a specific
  short-hook audit, mapping, package, verification, or render-prep task.
- Do not let Lane B handoff files redirect into Lane A unless the task explicitly
  says character rig / Blender / deformation.
- Do not let Lane A tasks touch Lane B short/audio/release/website files unless
  explicitly instructed.
- Character page public/reference belongs to Lane B.
- Character rig/mesh/Blender belongs to Lane A.
- Claude must not render unless the operator explicitly authorizes the exact render task.
- Claude must not use ComfyUI, Blender, Seedance, FAL, or any video/image runtime
  unless explicitly approved for the exact task.
- Claude must not modify `D:\MIKAGE ZENITH AUDIO` unless the operator explicitly
  targets that folder.
- Do NOT approve canon. Do NOT asset-lock anything.
- Do NOT call any candidate "production-ready", "final", "PASS", or "verified".

## Data-safety rule
Never mark a task, asset, proof gate, release status, seed, or canon item as
PASS / verified / approved without source-file confirmation or explicit operator
approval. Mock/demo data stays labelled SAMPLE / MOCK / UNCONFIRMED. When a fact is
unknown, write `UNCONFIRMED` — never guess or infer.

## Repo conventions
- Render pipeline (operator-run, NOT you): Python / PIL / FFmpeg batch render.
- Manual steps owned by the operator: file placement, `git commit`, `git push`.
  You prepare files and reports; the operator places and pushes them.
- Markdown files: one topic per file, headers + bullets, concise.

## Two-layer canon (do not blur)
1. BRAND / interface canon — AUTHORITATIVE for website, release pages, consoles, UI.
   - Palette LOCK: void black `#050508`, porcelain `#f2eeea`, electric violet `#8F00FF`
     (secondary `#7B2FFF`). Violet is a SIGNAL (halo / focus / single trace) —
     never a fill or full-screen wash.
   - Type: Cinzel (wordmark) · Shippori Mincho (headlines / CJK) · Space Mono (labels).
     Wide tracking, high negative space, near-zero radius, hairlines, fine grain, slow motion.
   - Character mark: faceless porcelain helmet, exactly two thin sensor slits, graphene
     underlayer. No human face/eyes, no anime, no neon-as-fill, no gaming HUD,
     no fantasy/samurai, no mascot, no generic AI-startup UI, no emoji.
   - Copy: outward = calm, minimal, mysterious. Releases = "transmissions".
     Archive = "the Launch Arc". CTA is exactly `Listen now` (LIVE) or `Pre-save`
     (unreleased) — never mixed.
   - Authoritative source for interface work: the `mikage-zenith-design` skill. It wins.
2. FILM / image-gen canon — REFERENCE ONLY. Does NOT drive brand UI. (kitsune mask,
   Zenith Blade, crimson cores, kintsugi gold, Z-Blue, older character notes.)
   On any conflict, the BRAND canon above wins.

## Spotify Canvas spec (technical baseline, all tracks)
- 1080 × 1920 · H.264 / yuv420p · 30 fps · no audio · ~6–8 s.
- Motion: breathing zoom 100 → 104 → 100 %, cosine/smoothstep pulse, staggered ring resonance.
- HARD VISUAL BANS: no text/lyrics/logo/watermark · no human faces or skin
  (scoped exception: T04 only) · no warm colors (exception: DÙ BẦU TRỜI TẮT NẮNG only) ·
  no anime characters · no fake UI clutter.

## Where transient facts live (do NOT copy them into this file)
- Current task → `docs/handoff/00_LATEST_CODEX_HANDOFF.md`
- Release list + LIVE / PRE-SAVE status → the release registry (re-exported from TooLost)
- Time-sensitive status snapshot → keep it in the handoff, not here.

## RESULT block — mandatory close for every repo task
The sandbox cannot mount the Windows repo path, so when you cannot commit/push,
report `NO` / `NONE` honestly. End every repo task with exactly:

```
RESULT:
CREATED:
MODIFIED:
POINTER_UPDATED:
COMMIT_HASH:
PUSH_SUCCEEDED:
NEXT_SAFE_TASK:
BLOCKERS:
```
