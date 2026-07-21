# Task Brief — Lore Master Audit v3 (gather-only, machine-ingestible schema, do NOT invent)

> Hand-off brief for the Cowork session (file ops on the PC repo). Cowork locates the files
> itself — the web session does NOT have the real file tree or paths. This is a
> **collection/extraction** task, not a writing task: no plot construction, no arc design, no
> filling gaps. Output feeds the operator's canon ruling later.
>
> v3 supersedes v2. Change from v2: the output is restructured into a **5-table entity model +
> bible buckets** that mirrors a validated long-form-consistency architecture
> (webnovel-writer: entities / aliases / state_changes / relationships / appearances, plus
> separate bible files). Goal: gather ONCE into a shape that is both human-readable and directly
> ingestible into a consistency engine later — so we never have to re-gather.
>
> **All v2 hard rules still apply** (catalog freeze, source precedence, version/duplicate
> handling, verbatim preservation, PUBLIC/HELD evidence, GAP/CONFLICT tagging, coverage report,
> source-map gate, privacy). They are restated below.

## Objective

Consolidate every piece of Mikage lore scattered across the catalog (track lyrics, MV/keyframe
specs, lesson logs, canon files) into ONE auditable, source-traceable master — structured so it
maps 1:1 onto a machine-readable entity model. This does NOT design a storyline and does NOT
author canon. It only surfaces what already exists, verbatim, with source and release status.

---

## PHASE 0 — Catalog freeze (do this FIRST, before extracting anything)

Identify the authoritative catalog/registry. Write this header at the top of the master:

- AUDIT_DATE · REPO_ROOT · AUTHORITATIVE_REGISTRY_PATH · REGISTRY_VERSION_OR_MODIFIED_DATE
- TOTAL_TRACK_ROWS · TOTAL_UNIQUE_TRACKS · TOTAL_VARIANTS · REGISTRY_SELECTION_REASON

If no registry is clearly authoritative → set `REGISTRY_AUTHORITY = UNCONFIRMED`, list
candidates, and **STOP — go to the Source-map fallback gate at the bottom.** Do not merge by
assumption.

### Source precedence (mandatory when files conflict/duplicate)

1. Registry marked LOCKED / VERIFIED / CURRENT → 2. track-local metadata/lyric in the track's
active production folder → 3. public release proof / distributor metadata / published MV-page →
4. canon/context files → 5. MV/keyframe specs → 6. handoff files → 7. archived/duplicate/draft/
backup/numbered-copy/exported.

Never silently pick between conflicts: quote both values, list both paths, mark `CONFLICT`,
do not resolve unless one file declares itself authoritative.

### Version + duplicate handling

- Treat as separate entries when files do: language versions · reprise · cinematic · anime ·
  instrumental · remaster · alternate mix · explicit/clean · renamed release. Do not merge just
  because lyrics are similar.
- Record a content hash per lyric file. Byte-identical → extract once, list all paths, label
  `DUPLICATE_SOURCE`. Same title/different text → separate records, label `CONFLICTING_VERSIONS`.

---

## PHASE 1 — Per-track extraction

For EVERY track: title (as stored) · alternate titles · language · version label · registry #
· catalog/ISRC/UPC (if present) · **source file path** · full lyric (verbatim) · verbatim lore
fragments (each tagged with source track/section).

- Instrumental → Full lyric: `NOT APPLICABLE — INSTRUMENTAL`; pull lore only from metadata / MV
  specs / title cards.
- Vocal track, no lyric file → `GAP — LYRIC FILE NOT FOUND`.
- **Do NOT reconstruct or transcribe lyrics from audio.** No listening-and-guessing.

### Verbatim preservation

Preserve original language, capitalization, punctuation, line breaks, section labels
(`[Verse]`, `[Bridge]`, `[Outro]`), unusual spellings, CJK exactly as stored. Do NOT translate,
romanize, correct grammar, normalize names, swap quotes, or repair encoding silently. Broken
encoding → quote as found, mark `ENCODING_GAP`.

### What counts as a lore fragment

A verbatim passage that explicitly names/describes: a character · faction · location · event ·
artifact · technology · transformation · identity · relationship · command/system state ·
date/timeline marker · recurring numeric or symbolic motif. Exclude generic emotional lines
unless they carry an explicit world/identity/event/object/relationship claim.

---

## PHASE 2 — Entity model (5 tables) — the core of v3

Build these five tables from the extracted fragments. **Populate ONLY from what files state
verbatim. Do NOT infer.** These tables mirror a consistency-engine schema so they can be
ingested later without rework.

**ID convention:** stable lowercase slug per entity (e.g. `mikage`, `hana`, `lyra-0`,
`archon-ix`, `white-monolith`, `zenith-blade`). Cowork assigns the slug and MUST list its alias
mapping so the operator can verify. If unsure whether two names are the same entity → do NOT
merge; create separate entries and mark `CONFLICT_IDENTITY`.

### 2.1 `entities`
| id | type | canonical_name | tier | desc (verbatim/sourced) | first_appearance (track) | last_appearance (track) | status | source_files |

- `type`: character · faction · location · artifact · technology · motif · event.
- `tier`: only if a file states importance; else `UNSPECIFIED` (do NOT rank by guess).
- `desc`: quote or tightly-sourced from files; no invented characterization.
- `status`: PUBLIC / HELD / UNCONFIRMED (evidence rules below).

### 2.2 `aliases`  (one entity → many aliases)
| alias | entity_id | source_track/file | notes |

- Capture every alternate name/pronoun a file uses for an entity (e.g. Mikage's antagonist
  pronoun, HANA's pre-Vessel naming). Alias only if a file actually uses it — no invented ones.

### 2.3 `state_changes`  (highest inference risk — hard-gated)
| entity_id | field | old_value | new_value | reason | source_track/file |

- Record a state change ONLY where a file explicitly states a transition (e.g. a stated shift in
  a character's state/status). Quote the reason verbatim/sourced.
- **Do NOT construct a state arc.** If the ordering or transition isn't stated in a file, leave
  it out and note `GAP_STATE_ORDER`. The operator builds the arc later — not this audit.

### 2.4 `relationships`  (also inference-gated)
| from_entity | to_entity | type | description (verbatim/sourced) | source_track/file |

- Only relationships a file states outright. Do NOT infer "ally/enemy/creator" from vibe.
  Unstated → omit, do not guess.

### 2.5 `appearances`  (this is what turns 58 tracks into one world)
| entity_id | track | evidence (lyric line / MV / metadata) | source_file |

- One row per entity-per-track where the entity actually appears in a sourced artifact.
- **Key on TRACK, not episode/timeline order.** Do NOT assign episode numbers or story order —
  that is the operator's spine ruling, post-audit.

---

## PHASE 3 — Bible buckets (sort, don't author)

Group the extracted fragments into these buckets (mirrors bible-file templates). This is
**sorting existing sourced fragments into folders**, NOT writing the bible. Each fragment keeps
its source tag. Empty bucket → write `GAP — no sourced material`, do not fill it.

- `worldview` — world-rule statements, the lore spine, hard constraints/laws
- `factions` — each faction + any stated hierarchy/relations
- `characters` — per-character sourced fragments (protagonist / antagonist / others)
- `power_system` — stated mechanics/rules of how the world's power/signal works
- `timeline_markers` — any dated or ordered marker a file states (do NOT sequence them yourself)
- `hard_locks` — any explicitly stated immutable rule (identity marks, color rules, etc.)

---

## Output file

One file: **`MIKAGE_LORE_MASTER__audit__.md`** (Cowork places it in the repo's normal
docs/output location). Structure:

```
# MIKAGE LORE MASTER — AUDIT
## 0. Audit metadata + catalog freeze + coverage
## 1. Per-track extraction
## 2. Entity model
   2.1 entities · 2.2 aliases · 2.3 state_changes · 2.4 relationships · 2.5 appearances
## 3. Bible buckets
## 4. Source conflicts
## 5. Duplicate-source register
## 6. GAP list
## 7. Scan inventory
## 8. Operator review gate
```

### Status evidence rules (do not get this wrong)

- **PUBLIC** only with explicit file evidence of public shipment: released/live status · public
  URL · distributor delivery/live confirmation · published MV/page record. A planned release
  date alone is NOT PUBLIC.
- **HELD** only when material exists internally AND a source explicitly shows it is
  internal-only / held / unreleased / draft / planned / pending.
- **UNCONFIRMED** when status is missing, files conflict, only a filename implies release, or a
  handoff mentions release without direct proof.

### §7 scan inventory (audit cannot claim "complete" without this)

Directories scanned · extensions included/skipped · files inspected/extracted · duplicates ·
unreadable files · encoding failures · conflicting sources · files excluded + reason ·
directories not accessible. Any expected directory inaccessible → `AUDIT_COMPLETENESS = PARTIAL`.

### GAP / CONFLICT taxonomy (use these exact tags)

`GAP_TRACK_NOT_IN_REGISTRY` · `GAP_LYRIC_NOT_FOUND` · `GAP_METADATA_NOT_FOUND` ·
`GAP_PUBLIC_STATUS` · `GAP_CHARACTER_SOURCE` · `GAP_MV_SOURCE` · `GAP_STATE_ORDER` ·
`GAP_UNREADABLE_FILE` · `GAP_ENCODING` · `CONFLICT_TITLE` · `CONFLICT_LYRIC` ·
`CONFLICT_RELEASE_STATUS` · `CONFLICT_IDENTITY`

## Hard rules (do not break)

- Extract only what is already written in a file. No inference, no connecting dots into a plot,
  no filling blanks, no invented characterization, roles, tiers, or state arcs.
- Quote verbatim, name the source for each fragment/row.
- Missing/ambiguous → `GAP`. Conflict → `CONFLICT`. Never invent to complete.
- Do NOT assign story order, episode numbers, or timeline sequence — that is operator ruling.
- Status by file evidence only; unclear → UNCONFIRMED.
- Not canon, not asset-locked. Operator reviews before any arc/spine work. Cowork does not
  self-approve canon.
- **Privacy:** do not copy private emails, tokens, passwords, API keys, personal addresses, or
  unpublished legal identifiers. Replace with `[REDACTED_PRIVATE_DATA]`, keep the source path.

---

## Source-map fallback gate (if authority is unclear — STOP here)

If Cowork cannot identify a single authoritative registry, or hits multiple conflicting lyric
versions, do NOT self-resolve. Output an intermediate file first:

**`MIKAGE_LORE_AUDIT_SOURCE_MAP__review__.md`** — registry candidates · relevant folder tree ·
duplicate groups · conflict groups · track count per source. Operator picks the winning source,
THEN the lore master runs.

## After this ships

Operator rules on the material → web session builds the STORY SPINE (arc order, episode slots,
storyline clock, public/held split) from the confirmed master, and the entity tables become the
seed for a consistency engine. Not before.
