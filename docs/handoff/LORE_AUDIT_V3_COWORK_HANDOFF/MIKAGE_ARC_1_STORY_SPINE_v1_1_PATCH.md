# MIKAGE ARC 1 — STORY SPINE v1.1 PATCH

> Narrow continuity and provenance patch. Does **not** overwrite or modify
> `MIKAGE_ARC_1_STORY_SPINE_v1.md`, or any prior audit/ruling file. Read together with
> `MIKAGE_LORE_MASTER__ADDENDUM_2026-07-21.md` (source-authority backing for fix 1 and fix 2
> below). This is a patch note, not a story rewrite — v1's beats, world layers, and reject
> conditions stand except where explicitly amended here.

---

## 1. Fix — Lyre / LYRA-0 continuity error (B-07, B-08)

**The bug:** v1's B-07 wrote a direct present-time encounter with Lyre; B-08 introduced LYRA-0 as
what read like an unrelated separate character. The locked ruling states Lyre was erased by the
Empire and LYRA-0 is Lyre's post-erasure/re-coalesced state (`MIKAGE_ARC1_OPERATOR_RULING_v1__locked__.md`
§6; sourced further in the addendum §2.1, `LOCK_Q1`). A living pre-erasure Lyre and a present-time
LYRA-0 cannot both exist as two independently-living figures in the same present timeline — that's
a continuity error, not a kept twist. (Traced to source in the addendum §2.3/§3 #1: v1 inherited
this framing uncritically from the never-locked `MIKAGE_STORY_BIBLE_V0_1.html` character sheet,
which predates or never incorporated the 2026-06-14 lock.)

**B-07 — revised text** (replaces v1 §6 B-07 in full; v1's B-07 heading "Confronting Lyre — the
Personal Mirror" is retired):

> **B-07 · The Archive — Commander Lyre**
> Mikage encounters an Empire archive: a combat record, a reconstructed memory, a simulation, or a
> preserved operational imprint of Commander Lyre — not Lyre in the present tense, in the flesh.
> The record shows an Empire champion who submitted completely to the algorithm to erase her own
> biological trauma: calm, empty, unhurt. The real temptation of the story surfaces here — not
> power, but the end of pain. Mikage, and the audience, may read this as a separate historical
> person the record simply preserved. **The connection to LYRA-0 is not confirmed at this beat.**

**B-08 — unchanged in substance**, restated for clarity of sequence: LYRA-0's present-time
appearance and approach to Mikage (v1's existing text stands — see `MIKAGE_ARC_1_STORY_SPINE_v1.md`
§6 B-08).

**The eventual reveal** (not placed at any specific beat by this patch — v1 already left this
open at B-15, and that stands): the archived Commander Lyre identity and the present LYRA-0 are two
states of the same continuity. **Do not reveal this at B-07 or B-08.** Whether it lands at B-15,
later than Arc 1, or not on-page at all in Arc 1, remains the operator's call — see v1 §10 and the
provisional item below.

---

## 2. Fix — source-authority provenance

Recorded in full in the companion file `MIKAGE_LORE_MASTER__ADDENDUM_2026-07-21.md` (§1):

| File | Authority |
|---|---|
| `MIKAGE_STORY_BIBLE_V0_1.html` | `CANON_DRAFT / PROPOSAL` |
| `MIKAGE_NARRATIVE_CORE_LOCK_V0_1.md` | `OPERATOR_LOCKED` |
| `STORY_CANON_RULING_2026-07-03.md` | `OPERATOR_LOCKED` |

That file also corrects one factual point in how this task was framed: all three files were
already inside the original 1,506-fragment extraction (40 fragments total came from them) — they
were not missing from the Lore Audit's source coverage. What was missing, and what the addendum
adds, is an authority tier distinguishing locked material from draft material. See addendum §0.

---

## 3. Fix — mark unruled spine material as `PROVISIONAL_SPINE`

The following items in `MIKAGE_ARC_1_STORY_SPINE_v1.md` are carried from the never-locked Story
Bible draft (or were proposed fresh while writing v1) and are **not** covered by any
operator-locked source. They remain in the spine — nothing is deleted — but are now explicitly
tagged `PROVISIONAL_SPINE`, not treated as ruled canon:

| Item | Spine location | Status |
|---|---|---|
| Three-layer world geography (White Monolith / Neon Grid / Earth) | §2 | `PROVISIONAL_SPINE` — carried from Story Bible draft, not covered by any operator lock |
| Neon Grid entropy-farm mechanics ("cultivated," not neglected) | §2 | `PROVISIONAL_SPINE` — same source, same status |
| LORA's Convergence / Hot-fix event as an Arc 1 beat | B-11 | `PROVISIONAL_SPINE` — the *concept* is locked (Narrative Core Lock §2.5 escalation mapping, addendum §2.1), but its placement as a specific Arc-1, Act-II-floor story beat is this spine's construction, not a direct operator ruling |
| B-09 Vessel-truth reveal timing (that this specific fact lands at the midpoint) | B-09 | `PROVISIONAL_SPINE` — the fact itself (Mikage is a Vessel) is locked lore; *that it's revealed here, at this beat* is spine construction |
| Lyra-∞ ending outcome | B-15 | `PROVISIONAL_SPINE` (already flagged open in v1 §10 / Narrative Core Lock §3.4 / Story Bible CHUA_XAC_NHAN-02 — restated here for the record, not newly discovered) |
| Hana reveal timing | throughout | `PROVISIONAL_SPINE` — the hold itself is locked (`STORY_CANON_RULING` Ruling 3); *when*, if ever, it lifts is not decided |

None of these are removed from the spine. They stay written exactly as v1 has them; this patch
only changes their status label from implied-canon to explicitly-provisional.

---

## 4. Fix — track-mapping scope correction

The next task after this patch is a beat↔track mapping. It must **not** be framed as a flat
64-track canon mapping — that would silently promote scratch/unregistered/duplicate folders to
the same standing as the confirmed catalog. Corrected scope, keyed to
`MIKAGE_LORE_MASTER__audit__.md` and `build/union_57_matched.json`:

```
PRIMARY_MAPPING_SCOPE: 57 tracks — the provisional registry-union catalog (audit §0/§1)
SUPPLEMENTAL_UNREGISTERED_SCOPE: 6 folders — on-disk, lore-bearing, in neither registry, NOT confirmed duplicates:
  IN the static · OVERDRIVE · REDLINE · STAY · 灯花 (LANTERN BLOOM) · 覆写 · OVERWRITE
  (audit §6.2; do not promote these into the official catalog — map them separately, if at all, as supplemental)
EXCLUDED_DUPLICATE: UPCOMING/teaser — confirmed byte-identical duplicate of LIVE/02. DIGITAL ASH
  (audit §5, hash groups c53b03219a46a4b7 / b9c9566f40c8c3c0). Not an independent track. Excluded
  from mapping entirely, not mapped as its own item.
SOURCE_GAP (no lyric text to map): SECOND LAW (Reprise) · 默雨 (SILENT RAIN) [Cinematic Version]
  — stay GAP_LYRIC_NOT_FOUND (audit §6.1) unless dedicated source evidence is supplied later.
```

64 = 57 + 6 supplemental + 1 excluded duplicate. The mapping task, when it runs, must keep these
three groups visibly separate in its output — not flatten them into one 64-row table with equal
status.

---

## 5. Blockers clarification

- **Ending tone** (Lyra-∞ singularity or not) does **not** block track mapping or early-episode
  planning. It **does** block final Act III scripting and the final episode lock — nothing past
  the climax/B-15 fork can be script-final until this is ruled.
- **Hana reveal timing** does not block Arc 1 as long as the name stays fully held throughout Arc
  1 (per `STORY_CANON_RULING` Ruling 3 + operator ruling §7 item 1). It would only become a
  blocker if some later task tried to reveal it inside Arc 1 material without a fresh operator
  decision.
- **ARCHON / ARCHON-IX ontology** remains unknown. This patch does not resolve it and the spine
  must not resolve it either — it stays an open item (v1 §10, operator ruling §6).

---

## RESULT

```
PATCH_STATUS: WRITTEN — does not modify MIKAGE_ARC_1_STORY_SPINE_v1.md or any prior file
LYRE_CONTINUITY_FIXED: YES — B-07 rewritten as an archive/record encounter; B-08 unchanged; reveal not placed at B-07 or B-08
NEW_SOURCE_ADDENDUM_CREATED: YES — MIKAGE_LORE_MASTER__ADDENDUM_2026-07-21.md (with one correction: the 3 files were already in the original 1506-fragment extraction, not previously missing — see addendum §0)
PROVISIONAL_SPINE_ITEMS: 6 — world geography, Neon Grid mechanics, Convergence-as-Arc-1-beat placement, B-09 reveal timing, Lyra-∞ ending, Hana reveal timing (§3 above)
PRIMARY_MAPPING_SCOPE: 57 (provisional registry-union catalog)
SUPPLEMENTAL_MAPPING_SCOPE: 6 (unregistered, lore-bearing, non-duplicate folders)
EXCLUDED_DUPLICATES: 1 (UPCOMING/teaser)
SPINE_READY_FOR_TRACK_MAPPING: YES — scope is now correctly bounded (§4); mapping may proceed against the 57 + 6 groups, kept separate
SPINE_READY_FOR_OPERATOR_LOCK: NO — REASON: 6 items remain PROVISIONAL_SPINE (§3), not covered by any operator-locked source; v1's own self-declared status (`DRAFT — AWAITING OPERATOR LOCK`) is unchanged by this patch and stays accurate until the operator rules on those 6 items or explicitly accepts them as-is
```
