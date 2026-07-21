# Task Brief — Lore Master Audit v3, CONTINUATION (Cowork → Codex handoff)

> This is a continuation of the operator's brief `claude_TASK_BRIEF_LORE_AUDIT_v3.md`
> (gather-only, machine-ingestible 5-table entity model, do NOT invent). That brief's
> rules are still in force in full — this file only tells you what Cowork (cloud
> session, no direct D:\ access) already did, what it could NOT do, and exactly what
> to do next. Read the original v3 brief first if you have it on disk; if not, the
> rules are restated inline below wherever they matter for a decision.

## Why this handoff exists

Cowork ran Phase 0–1 extraction from a cloud sandbox that only sees files through a
device-bridge (staged copies, no live D:\ access, no git). It got through bulk
verbatim fragment extraction but hit a hard-rule STOP condition in Phase 0 and could
not finish Phase 1/2/3. You (Codex) run locally with direct D:\ access — use that
to verify, extend, and finish this.

---

## 1. STOP CONDITION — resolve this FIRST, before anything else

Two files both claim to be `MIKAGE_RELEASE_REGISTRY.md` and disagree. Per the v3
brief's Phase 0 rule: *"If no registry is clearly authoritative → set
REGISTRY_AUTHORITY = UNCONFIRMED, list candidates, and STOP — go to the Source-map
fallback gate. Do not merge by assumption."* Neither file below self-declares
LOCKED / VERIFIED / CURRENT, so this condition is met.

**Candidate A — repo copy:**
`D:\KAGAMI-MZ_SYNC_PUSH_V2\docs\handoff\MIKAGE_RELEASE_REGISTRY.md`
- Header: "Base: TooLost export `2026-06-29-Catalog_Overview` (53) + 2 manual adds
  ... STATUS computed against 2026-07-03."
- Total catalogued: **55 singles** · LIVE 26 · PRE-SAVE 29 · window 2026-05-21 →
  2026-08-14.

**Candidate B — audio-root copy:**
`D:\MIKAGE ZENITH AUDIO\MIKAGE_RELEASE_REGISTRY.md`
- Header: "Base: v10 + delivery backfill (얼룩 STAIN #56, 종은 울려 I RING YOUR NAME
  #57 — UPC/ISRC/smartlink assigned on TooLost delivery 2026-07-10). STATUS computed
  against 2026-07-10."
- Total catalogued: **57 singles** · LIVE 26 · PRE-SAVE 31 · window 2026-05-21 →
  2026-08-28.
- This file carries its own internal version history (CHANGES vs v10 / v9 / prior),
  i.e. it is the one being actively iterated. Candidate B is a superset of Candidate
  A (same 55 rows + STAIN #56 + I RING YOUR NAME #57) as far as Cowork could tell by
  inspection — but do NOT treat that as resolution; it is an observation, not a
  ruling.

**What to do:** Per the v3 brief, produce
`MIKAGE_LORE_AUDIT_SOURCE_MAP__review__.md` first (registry candidates · relevant
folder tree · duplicate groups · conflict groups · track count per source — see
`DUPLICATE_SOURCE_HASH_GROUPS_v1.json` in this handoff for a head start on the
duplicate groups) and get the operator (BOOS) to pick the winning source before
building the lore master. Do not silently pick B just because it's newer/bigger —
that is Cowork's observation, not an operator ruling.

Also check for a THIRD possibility Cowork could not rule out: neither export may be
current anymore if TooLost has moved since 2026-07-10 — a fresh TooLost export may
be warranted before freezing the catalog. That's an operator/business call, not
yours to make.

---

## 2. What Cowork already completed (verified, reusable — do not redo)

### 2.1 Repo/folder survey
Full recursive listing of `D:\KAGAMI-MZ_SYNC_PUSH_V2` and `D:\MIKAGE ZENITH AUDIO`
(2000-entry-capped per call, done in chunks). `D:\KAGAMI-MZ` (the HOLD repo) is
confirmed **empty** at top level via listing — do not spend time re-scanning it
unless you have reason to think the bridge under-reported it; recommend a real `dir
/s` on it locally to be sure, since Cowork's listing tool has a 2000-entry cap per
call and HOLD wasn't deep-walked.

### 2.2 Verbatim fragment extraction — 207 source files, 1506 fragments
File: **`EXTRACTED_LORE_FRAGMENTS_v1.json`** (in this handoff folder).

Every fragment was extracted by a sub-agent instructed to quote verbatim only, then
independently re-verified: each `quote` was checked as an exact contiguous substring
of its source file, and each `entity_names` entry was checked to literally appear
inside its own quote. Failures were discarded/fixed before output, per fragment.
This does NOT mean the extraction is complete or that entity clustering/typing is
done — it only means every quote in the file is genuinely verbatim-and-sourced.

Schema (one entry per source file):
```json
{"files":[{"source_file":"<path under the uploads root Cowork used>",
  "fragments":[{"quote":"...","entity_names":["..."],
    "kind":"character|faction|location|event|artifact|technology|motif|identity|relationship|state_change|timeline|system_rule",
    "note":"optional","lock_status":"optional, e.g. LOCKED/SSOT/DRAFT/PROPOSAL_ONLY"}]}]}
```

**Important:** `source_file` paths are relative to Cowork's own upload mirror (e.g.
`MIKAGE ZENITH AUDIO/LIVE/02. DIGITAL ASH/3_LYRICS/lyric final.txt`), which maps
1:1 onto `D:\MIKAGE ZENITH AUDIO\LIVE\02. DIGITAL ASH\3_LYRICS\lyric final.txt` and
`D:\KAGAMI-MZ_SYNC_PUSH_V2\...` for the repo-rooted ones. Re-derive the real D:\
path by prefixing; don't assume the mirror is byte-identical to what's on disk now
— re-read the real file before treating any quote as final, since Cowork's copy is
a point-in-time snapshot from this session.

Coverage — files processed per batch:
| Batch | Scope | Files | Fragments |
|---|---|---|---|
| live_A | LIVE tracks 01–17 | 34 | 146 |
| live_B | LIVE tracks 18–37 + unnumbered (SECOND LAW, THIRD AXIS, UNWRITE, INK RAIN, GLASS SKIN Nightcore) | 36 | 145 |
| upcoming | All of `UPCOMING/` (lyrics, metadata, setup/style files) | 63 | 189 |
| canon_core | MIKAGE_ZENITH_CANON_V2, WORLD_CORE, LORE_WORLD_CANON_V0_6_SSOT, STORY_CANON_RULING, HALO_RING_RULING, STORY_TRACK_MAPPING, ZENITH_BLADE_SPEC, character docs, etc. | 21 | 265 |
| canon_imports | Google-Drive-sourced bible packs (CHARACTER STATE TRACKER, WORLD BIBLE DATABASE, CINEMATIC ADAPTATION LAYER, MASTER BIBLE V2.0, etc.) + canon_proposals DRAFTs + MV keyframe pack | 24 | 510 |
| remaining | Remaining handoff outlines, lore-drip schedule, T01–T07 track packages, MIKAGE_STRUCTURED_RULES.json | 29 | 251 |
| **Total** | | **207** | **1506** |

**NOT covered yet** (known gaps — extend, don't restart):
- Full recursive walk of `production/character/` (blend/png/mp4 heavy — lore-relevant
  .md files inside it, e.g. `MIKAGE_HERO_LOOKDEV_RECIPE_V1.md`, were NOT pulled).
- `handoff/character_application_sample_01/`, `handoff/world_visual_proof_v0_1/`,
  and most of `handoff/_archive/` (dozens of ASSET-BUILD/ASSET-RESET files) —
  skipped as build-process logs, but skim for stray lore fragments before calling
  Phase 1 complete, per the brief's "no filling blanks" but also no silent skipping
  without noting it in §7 scan inventory.
- `grapuco_system_review/02_CANON_AND_RULES/MIKAGE_ZENITH_CANON_V2.md` (369 bytes,
  looks like a stub/pointer copy, not re-extracted separately — check if it diverges
  from the root-level `MIKAGE_ZENITH_CANON_V2.md` Cowork did extract; if identical,
  log as DUPLICATE_SOURCE, if different, CONFLICT_LYRIC-style tag doesn't apply but
  flag as a content conflict).
- `MIKAGE_TRACK_CATALOG_DATABASE_V1_LOCKED_21.xlsx` was staged but not opened/parsed
  (binary; Cowork only listed it). Open it locally and check it against both
  registry candidates above — it may be a third, older data point relevant to the
  Phase 0 decision.
- Any track's `4_PROOF_SETUP` files beyond caption/metadata/ownership_note/
  release_metadata (e.g. style/negative-tag prompt files) were spot-included where
  they had a `.md`/`.txt` name matching those patterns, but not exhaustively for
  every track — re-glob `4_PROOF_SETUP/*` per track to confirm nothing lore-bearing
  was missed.

### 2.3 Duplicate-source register (byte-identical files)
File: **`DUPLICATE_SOURCE_HASH_GROUPS_v1.json`** (in this handoff folder) — 7 groups
found by SHA-256 over every staged file under `MIKAGE ZENITH AUDIO` (141 files
hashed). This only covers the audio root, not the repo docs — repo docs were not
hashed; do that pass too (repo has at least one likely duplicate: search for a
second copy of `mikage_character_visual_spec.md` under
`archive/MIKAGE_CONTEXT_EXPORT_V0_1/docs/` vs the root `docs/` copy — Cowork noticed
this by filename during listing but never hashed/compared the two).

One dup group is suspicious rather than benign — flag it as a real finding, not
just a DUPLICATE_SOURCE label:
`LIVE/28. SOFT IN THE WIRE/4_PROOF_SETUP/metadata.txt` is byte-identical to
`LIVE/29. AFTER THE SIGNAL/4_PROOF_SETUP/metadata.txt` (both literally contain
"Track Title: AFTER THE SIGNAL"). This looks like a copy-paste-without-edit bug in
SOFT IN THE WIRE's own metadata file, not two versions of the same content — note it
under §4 Source conflicts as `CONFLICT_TITLE` (metadata says AFTER THE SIGNAL, path
says SOFT IN THE WIRE) in addition to the duplicate-source entry.

### 2.4 Entity frequency (raw signal only — NOT the entities table)
Top recurring `entity_names` across all 1506 fragments (not deduplicated/aliased,
not typed, not sourced-per-row yet — this is just a frequency count to help you
scope Phase 2, do not copy it into the entities table as-is):
Mikage (155) · Lyre (86) · Empire (47) · Mikage Zenith (45) · ARCHON-IX (43) ·
LYRA-0 (39) · signal (36) · ARCHON (33) · Zenith Blade (31) · LYRA (20) ·
Commander Lyre (19) · Tai Vane (16) · B4C (15) · Vane (14) · Third Axis (14) ·
Kintsugi (14) · Root Architect (13) · Z-Blue (13) · Lyra-0 (12) · Black glass (12) ·
Landauer (11) · Order (10) · Dr. Aris (10) · Shard-513 (10) · Golden Patch (9) ·
Unbreakable Shield (9) · Lyra-∞ (9) · Imperial Clean (9) · Kitsune (9) ·
White Monolith (8) · Porcelain Minimalism (8) · Enso (8) · Forty-three (7) ·
Entropy Economy (7) · Flux Pinning (7) · Ghost (6) · Ao-zumi (6) ·
Steel Oxide (6) · Ferro-calcium (6) · Glitch Phantom (6) · Launch Arc (6).

Two things jump out that need `CONFLICT_IDENTITY` handling per the brief (do NOT
merge without file evidence): (a) `Lyre` / `Commander Lyre` / `LYRA` / `LYRA-0` /
`Lyra-0` / `Lyra-∞` look related but may be distinct entities or distinct states of
one entity — canon_core extraction already tagged some of this as explicit
`state_change` fragments (e.g. "Lyre↔LYRA-0 one-entity → two-character override"
per the canon_core sub-agent's own note), so check those fragments first before
deciding; (b) `ARCHON` vs `ARCHON-IX` — same question.

---

## 3. What's still open — do these in order

1. **Resolve or escalate the Phase 0 STOP** (§1 above) — produce the source-map
   review file, get an operator ruling, THEN proceed.
2. **Finish Phase 1** — per-track table with full verbatim lyric per track (not just
   fragments), alt titles, language, version label, registry #, ISRC/UPC, source
   path(s), content-hash + DUPLICATE_SOURCE/CONFLICTING_VERSIONS labeling. Use
   `EXTRACTED_LORE_FRAGMENTS_v1.json` for the lore-fragment column per track (filter
   by `source_file` matching that track's folder) but you still need to pull full
   lyric text yourself — Cowork extracted fragments, not full lyrics, into that
   file. Watch for tracks that exist as a folder but aren't in either registry
   candcandidate (e.g. `UPCOMING/teaser`, `UPCOMING/rap`, `UPCOMING/Electro`,
   `UPCOMING/IN the static`, `UPCOMING/REDLINE`, `UPCOMING/OVERDRIVE`,
   `UPCOMING/STAY` — Cowork did not cross-check every folder name against both
   registries row-by-row) — tag those `GAP_TRACK_NOT_IN_REGISTRY` rather than
   guessing they're drafts.
3. **Phase 2 — 5 entity-model tables.** Build `entities`, `aliases`, `state_changes`,
   `relationships`, `appearances` from the full fragment set (Cowork's 1506 +
   whatever you add finishing Phase 1/the gaps in §2.2). This is the part Cowork
   did not get to at all — no tables exist yet. Follow the brief's hard gating on
   `state_changes` and `relationships` (only explicit statements, no constructed
   arcs).
4. **Phase 3 — bible buckets** (worldview / factions / characters / power_system /
   timeline_markers / hard_locks) — sort, don't author.
5. **Assemble `MIKAGE_LORE_MASTER__audit__.md`** in the exact 8-section structure
   from the v3 brief, including §7 scan inventory (list everything in §2.2's "not
   covered yet" as explicitly scanned-and-skipped-with-reason, or scanned-and-
   included, so `AUDIT_COMPLETENESS` is honestly PARTIAL or FULL, not silently
   assumed).
6. Close with the CLAUDE.md `RESULT:` block. You have real git/file access, so fill
   in COMMIT_HASH / PUSH_SUCCEEDED honestly (operator still places/pushes per repo
   convention unless explicitly told otherwise).

---

## 4. Hard rules carried over (do not relax these)

- Quote verbatim, source every fragment/row. No inference, no plot construction, no
  filling gaps, no invented tiers/roles/state order.
- `GAP_*` / `CONFLICT_*` exact tag taxonomy from the v3 brief — reuse it as-is.
- PUBLIC status only with explicit shipment evidence; a planned date alone is not
  PUBLIC. HELD only with explicit internal/unreleased evidence. Else UNCONFIRMED.
- Never mark anything PASS / verified / canon-locked / production-ready without
  source or explicit operator approval (CLAUDE.md data-safety rule — applies beyond
  this task too).
- Privacy: redact private emails/tokens/passwords/personal addresses as
  `[REDACTED_PRIVATE_DATA]`, keep the source path.
- Not canon, not asset-locked. Operator reviews before any arc/spine work.
