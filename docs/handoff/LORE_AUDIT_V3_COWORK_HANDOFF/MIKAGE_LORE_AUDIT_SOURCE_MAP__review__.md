# MIKAGE LORE AUDIT — SOURCE MAP (REVIEW)

> **Status:** `REGISTRY_AUTHORITY = UNCONFIRMED`  
> **Purpose:** Phase 0 fallback gate for Lore Audit V3. This document maps evidence; it does not merge registries, choose a winner, or promote any source to canon.  
> **Audit date:** 2026-07-21  
> **Repo root:** `D:\KAGAMI-MZ_SYNC_PUSH_V2`  
> **Operator ruling required before Phase 1–3.**

## 1. Registry candidates

Neither candidate declares itself `LOCKED`, `VERIFIED`, or `CURRENT`. Their SHA-256 hashes differ, their row counts differ, and shared rows contain field conflicts. Source precedence therefore does not resolve authority automatically.

| Candidate | Path | SHA-256 | Bytes | LastWriteTime (local evidence) | Header/status basis | Table rows | Stated totals |
|---|---|---|---:|---|---|---:|---|
| A — repo handoff | `D:\KAGAMI-MZ_SYNC_PUSH_V2\docs\handoff\MIKAGE_RELEASE_REGISTRY.md` | `B3A9C009E7A61CDCDE494B807131788B3A54A2E8752C368D86529B62F904B75B` | 11,453 | `2026-07-03 23:27:19` | TooLost export `2026-06-29-Catalog_Overview` (53) + 2 manual adds; status computed 2026-07-03 | 55 | 55 singles; LIVE 26; PRE-SAVE 29; EN 35 / ZH 8 / JA 6 / KO 4 / VI 2; window 2026-05-21 → 2026-08-14 |
| B — audio root | `D:\MIKAGE ZENITH AUDIO\MIKAGE_RELEASE_REGISTRY.md` | `EBE4CE119D7A4D71FE583E425DA25D40BE1B3F0A5A065EA65C9E03A83BAAB1C1` | 14,507 | `2026-07-10 15:09:58` | v10 + delivery backfill for rows 56–57; status computed 2026-07-10 | 57 | 57 singles; LIVE 26; PRE-SAVE 31; EN 35 / ZH 8 / JA 6 / KO 6 / VI 2; window 2026-05-21 → 2026-08-28 |

### Track-count comparison

| Measure | Candidate A | Candidate B | Difference |
|---|---:|---:|---:|
| Parsed Markdown table rows | 55 | 57 | B has 2 additional rows |
| LIVE (stated) | 26 | 26 | 0 |
| PRE-SAVE (stated) | 29 | 31 | B has 2 additional rows |
| Total catalogued (stated) | 55 | 57 | B has 2 additional rows |

Rows present only in Candidate B:

| # | Title | Lang | Release date | ISRC | UPC | Link |
|---:|---|---|---|---|---|---|
| 56 | 얼룩 (STAIN) | ko | 2026-08-21 | `QT62V2626539` | `0682286060406` | `https://too.fm/91d2ene` |
| 57 | 종은 울려 (I RING YOUR NAME) | ko | 2026-08-28 | `QT62V2626572` | `0682286060444` | `https://too.fm/o3kdk3b` |

Observation only: B contains A's numbered range plus rows 56–57, but it is **not a clean field-level superset** because four shared smartlink fields conflict (§4). File recency and larger row count are evidence, not an authority ruling.

## 2. Additional catalog-source candidates / authority risks

| Source | Path | Review state | Relevance |
|---|---|---|---|
| Locked-name workbook | `D:\KAGAMI-MZ_SYNC_PUSH_V2\MIKAGE_TRACK_CATALOG_DATABASE_V1_LOCKED_21.xlsx` | Not inspected in this gate: spreadsheet runtime dependency loader was unavailable. The filename alone is not authority evidence. | May be an older or third catalog data point; must be checked after tooling is available or by operator evidence. |
| Repo catalog CSV | `D:\KAGAMI-MZ_SYNC_PUSH_V2\docs\handoff\MIKAGE_TRACK_CATALOG_DATABASE_V1.csv` | Located, not used to resolve authority in this gate. | Possible older catalog snapshot. |
| Reconciled CSV | `D:\KAGAMI-MZ_SYNC_PUSH_V2\docs\handoff\MIKAGE_CATALOG_SSOT_RECONCILED_2026-06-23.csv` | Located, not used to resolve authority in this gate. | Predates both registry status dates by filename. |
| Fresh TooLost export | Not present in the reviewed handoff | Operator/business decision required. | Either Markdown registry may be stale relative to current distributor state. |

No source in this section is promoted or selected by this review.

## 3. Relevant folder tree

```text
D:\KAGAMI-MZ_SYNC_PUSH_V2\
├─ MIKAGE_TRACK_CATALOG_DATABASE_V1_LOCKED_21.xlsx
└─ docs\handoff\
   ├─ MIKAGE_RELEASE_REGISTRY.md                         [Candidate A]
   ├─ MIKAGE_TRACK_CATALOG_DATABASE_V1.csv              [additional source]
   ├─ MIKAGE_CATALOG_SSOT_RECONCILED_2026-06-23.csv     [additional source]
   └─ LORE_AUDIT_V3_COWORK_HANDOFF\
      ├─ claude_TASK_BRIEF_LORE_AUDIT_v3.md
      ├─ CODEX_TASK_LORE_AUDIT_V3_CONTINUATION.md
      ├─ EXTRACTED_LORE_FRAGMENTS_v1.json
      ├─ DUPLICATE_SOURCE_HASH_GROUPS_v1.json
      └─ MIKAGE_LORE_AUDIT_SOURCE_MAP__review__.md      [this review]

D:\MIKAGE ZENITH AUDIO\
├─ MIKAGE_RELEASE_REGISTRY.md                            [Candidate B]
├─ LIVE\                                                  [33 immediate subdirectories]
├─ UPCOMING\                                              [30 immediate subdirectories]
├─ _ARCHIVE_DUP\
├─ SYNC\
├─ MIKAGE_SYNC\
└─ other production/support directories
```

The 33 `LIVE` and 30 `UPCOMING` directory counts are filesystem inventory counts, not unique-track counts and not authority evidence. Folder names may include variants, unnumbered folders, teasers, or held material.

## 4. Conflict groups

### 4.1 `CONFLICT_RELEASE_STATUS` / registry authority

- Candidate A reports 55 rows with status basis 2026-07-03.
- Candidate B reports 57 rows with status basis 2026-07-10.
- Neither file self-declares the required authority marker.
- Candidate B's header says `55/55 confirmed` while the same document states and contains 57 catalog rows. This is an internal count-text inconsistency and is not silently repaired here.

### 4.2 Shared-row smartlink conflicts

The identifiers and release dates match across the four shared rows below, but the link field differs.

| Row/title | Candidate A | Candidate B | Tag |
|---|---|---|---|
| 40 — PHANTOM | `https://too.fm/jbyjbpv` | `PENDING` | `CONFLICT_RELEASE_STATUS` |
| 49 — FUSE | `https://too.fm/ajmav3k` | `PENDING` | `CONFLICT_RELEASE_STATUS` |
| 50 — WAKE | `https://too.fm/1wapnlr` | `PENDING` | `CONFLICT_RELEASE_STATUS` |
| 53 — FREEFALL | `https://too.fm/mbvbdqz` | `PENDING` | `CONFLICT_RELEASE_STATUS` |

This prevents treating Candidate B as an unqualified superset of Candidate A.

### 4.3 `CONFLICT_TITLE` in track-local metadata

Cowork's byte-identical duplicate register places these files in the same hash group (`913fccc8afaf76e1` prefix):

- `D:\MIKAGE ZENITH AUDIO\LIVE\28. SOFT IN THE WIRE\4_PROOF_SETUP\metadata.txt`
- `D:\MIKAGE ZENITH AUDIO\LIVE\29. AFTER THE SIGNAL\4_PROOF_SETUP\metadata.txt`

The handoff reports that both contain `Track Title: AFTER THE SIGNAL`; therefore the path/title pairing for SOFT IN THE WIRE is recorded as `CONFLICT_TITLE`. This review does not edit either metadata file.

## 5. Duplicate-source groups

Source: `DUPLICATE_SOURCE_HASH_GROUPS_v1.json`. The JSON stores 16-character SHA-256 prefixes, not full hashes. These seven groups cover Cowork's staged audio-root hash pass (141 files); they do not establish registry authority.

| Hash prefix | Byte-identical paths (relative to `D:\MIKAGE ZENITH AUDIO`) | Review note |
|---|---|---|
| `5d9a95bf9c6a2ef7` | `UPCOMING/32. 白瓷夜行 (PORCELAIN NIGHT WALK)/3_LYRICS/白瓷夜行__PORCELAIN_NIGHT_WALK_CLEAN_LYRIC_TOOLOST.txt`<br>`UPCOMING/32. 白瓷夜行 (PORCELAIN NIGHT WALK)/3_LYRICS/BAI_CI_YE_XING_PORCELAIN_NIGHT_WALK_CLEAN_LYRIC_TOOLOST.txt` | `DUPLICATE_SOURCE` |
| `c53b03219a46a4b7` | `UPCOMING/teaser/lyrics_final.txt`<br>`LIVE/02. DIGITAL ASH/3_LYRICS/lyrics_final.txt` | `DUPLICATE_SOURCE` |
| `b9c9566f40c8c3c0` | `UPCOMING/teaser/DIGITAL_ASH_CLEAN_LYRIC_TOOLOST.txt`<br>`LIVE/02. DIGITAL ASH/3_LYRICS/DIGITAL_ASH_CLEAN_LYRIC_TOOLOST.txt` | `DUPLICATE_SOURCE` |
| `e7d0dec8bbc94291` | `UPCOMING/검은 유리 (BLACK GLASS) [Nightcore Version]/3_LYRICS/lyric final.txt`<br>`LIVE/24. 검은 유리 (BLACK GLASS)/3_LYRICS/lyric final.txt` | `DUPLICATE_SOURCE`; distinct version labels must remain separate records in later phases |
| `aad202c87adcd873` | `UPCOMING/검은 유리 (BLACK GLASS) [Nightcore Version]/3_LYRICS/검은_유리__BLACK_GLASS_CLEAN_LYRIC_TOOLOST.txt`<br>`LIVE/24. 검은 유리 (BLACK GLASS)/3_LYRICS/검은_유리__BLACK_GLASS_CLEAN_LYRIC_TOOLOST.txt` | `DUPLICATE_SOURCE`; distinct version labels must remain separate records in later phases |
| `8ac1eaca6267bd69` | `UPCOMING/33. 네온이 꺼져도 (EVEN WHEN THE NEON DIES)/3_LYRICS/NEON_DIES_EVEN_WHEN_THE_NEON_DIES_CLEAN_LYRIC_TOOLOST.txt`<br>`UPCOMING/33. 네온이 꺼져도 (EVEN WHEN THE NEON DIES)/3_LYRICS/네온이_꺼져도__EVEN_WHEN_THE_NEON_DIES_CLEAN_LYRIC_TOOLOST.txt` | `DUPLICATE_SOURCE` |
| `913fccc8afaf76e1` | `LIVE/28. SOFT IN THE WIRE/4_PROOF_SETUP/metadata.txt`<br>`LIVE/29. AFTER THE SIGNAL/4_PROOF_SETUP/metadata.txt` | `DUPLICATE_SOURCE` + `CONFLICT_TITLE` (§4.3) |

Known coverage limit: this duplicate register covers the staged audio-root set only. Repo-wide hashing was not part of this resumed Phase 0 evidence request and remains a later audit-inventory item.

## 6. Operator review gate

`REGISTRY_AUTHORITY = UNCONFIRMED`

Phase 1–3 and `MIKAGE_LORE_MASTER__audit__.md` must not proceed until the operator explicitly rules one of the following:

1. Candidate A is authoritative;
2. Candidate B is authoritative;
3. a fresh TooLost export (or another explicitly named source) must replace both;
4. another explicit reconciliation instruction, including how to resolve the four smartlink conflicts and whether rows 56–57 belong in the frozen catalog.

No registry was selected, merged, normalized, or modified. No canon-lock, asset-lock, completeness, or production-ready claim is made.

## 7. Evidence and scope record

- Repo-state evidence at start: clean `git status --porcelain=v1`; branch `main`; HEAD `f0b9cf2 Add original v3 lore-audit brief (was only in Cowork chat upload, never on disk)`.
- Registry evidence: direct local reads; SHA-256 via `Get-FileHash`; file metadata via `Get-Item`; Markdown table row counts and exact row comparison via read-only PowerShell.
- Folder evidence: direct `Get-ChildItem` inventory of audio-root top level and immediate `LIVE`/`UPCOMING` directories.
- Duplicate evidence: committed Cowork handoff JSON, explicitly treated as DRAFT audit evidence and not canon.
- Spreadsheet limitation: workbook content not inspected because the required spreadsheet runtime dependency loader was unavailable.
- Files modified by this task: `docs/handoff/LORE_AUDIT_V3_COWORK_HANDOFF/MIKAGE_LORE_AUDIT_SOURCE_MAP__review__.md` only.

**GATE RESULT: STOP — AWAITING OPERATOR REGISTRY RULING.**
