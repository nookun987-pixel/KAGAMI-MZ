# MIKAGE LORE MASTER — unresolved conflicts

> Companion to `MIKAGE_LORE_MASTER__audit__.md` §4. Every conflict this audit found, in one place, with both source values quoted and nothing resolved. This audit does not pick a winner.

## CONFLICT_REGISTRY_AUTHORITY (1)

`REGISTRY_AUTHORITY = UNCONFIRMED`. Two release registries, neither self-declares authoritative:

| candidate | path | sha256 | bytes | last_write_time | row_count |
| --- | --- | --- | --- | --- | --- |
| A | KAGAMI-MZ_SYNC_PUSH_V2/docs/handoff/MIKAGE_RELEASE_REGISTRY.md | B3A9C009E7A61CDCDE494B807131788B3A54A2E8752C368D86529B62F904B75B | 11453 | 2026-07-03 23:27:19 | 55 |
| B | MIKAGE ZENITH AUDIO/MIKAGE_RELEASE_REGISTRY.md | EBE4CE119D7A4D71FE583E425DA25D40BE1B3F0A5A065EA65C9E03A83BAAB1C1 | 14507 | 2026-07-10 15:09:58 | 57 |

Operator ruling this session: proceed on a provisional union of both (57 rows) for lore-gathering purposes only. That ruling covers scope, not authority — `REGISTRY_AUTHORITY` is still open.

## CONFLICT_RELEASE_STATUS — smartlink field conflicts (4)

| title | field | value in A | value in B |
| --- | --- | --- | --- |
| PHANTOM | link | https://too.fm/jbyjbpv | PENDING |
| FUSE | link | https://too.fm/ajmav3k | PENDING |
| WAKE | link | https://too.fm/1wapnlr | PENDING |
| FREEFALL | link | https://too.fm/mbvbdqz | PENDING |

## CONFLICT — Candidate-B-only tracks (2)

| title | lang | consequence if A is ruled authoritative |
| --- | --- | --- |
| 얼룩 (STAIN) | ko | falls outside catalog; its gathered lore fragments would need operator disposition |
| 종은 울려 (I RING YOUR NAME) | ko | same |

## CONFLICT_TITLE — metadata disagrees with folder (1)

`LIVE/28. SOFT IN THE WIRE/4_PROOF_SETUP/metadata.txt` and `LIVE/29. AFTER THE SIGNAL/4_PROOF_SETUP/metadata.txt` are byte-identical (sha256 group `913fccc8afaf76e1`) and both declare `Track Title: AFTER THE SIGNAL`. The SOFT IN THE WIRE folder's own proof file does not name its own folder's track.

## CONFLICT_IDENTITY candidates (not merged — logged for operator review)

Per brief: "If unsure whether two names are the same entity → do NOT merge; create separate entries and mark CONFLICT_IDENTITY." These clusters share an obvious surface resemblance in spelling/context but were kept as separate entity rows because no source file states they are the same entity:

| entity_id | canonical_name | type | mentions |
| --- | --- | --- | --- |
| archon-ix | ARCHON-IX | character | 43 |
| lyra-0 | LYRA-0 | character | 51 |
| lyre | Lyre | character | 90 |
| lyra | LYRA | character | 20 |
| lora | LORA | character | 91 |
| lyra- | Lyra-∞ | character | 9 |
| archon | ARCHON | event | 34 |
| commander-lyre | Commander Lyre | character | 20 |
| force-field-lyre | Force-field Lyre | character | 2 |

Two sub-clusters worth operator attention specifically:

- **LYRA family:** `LYRA-0` / `Lyra-0` (51 mentions), `Lyre` (90 mentions), `LYRA` (20 mentions), `LORA` (91 mentions), `Lyra-∞` (9 mentions), `Commander Lyre` (20 mentions), `Force-field Lyre` (2 mentions) — plausibly the same recurring figure across name-drift/evolution, but this audit found no file that states the equivalence outright, so each stays its own row.
- **ARCHON family:** `ARCHON` (34 mentions, majority-classified as `event`-type by extraction `kind`, not `character`/`faction`) vs `ARCHON-IX` (43 mentions, `character`-type). Worth checking whether ARCHON is a faction/event name and ARCHON-IX a designated individual within it, or whether they're the same referent used inconsistently.

## Duplicate-source register (cross-reference — full detail in master §5)

7 byte-identical file groups found via SHA-256. Full paths and notes are in `MIKAGE_LORE_MASTER__audit__.md` §5. One of these (teaser/DIGITAL ASH) directly resolves one of the 7 `GAP_TRACK_NOT_IN_REGISTRY` folders as a duplicate rather than a new track — see master §6.2.
