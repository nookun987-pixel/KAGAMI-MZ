# MIKAGE ARC 1 — BEAT↔TRACK MAPPING COVERAGE

> Companion to `MIKAGE_ARC1_BEAT_TRACK_MAPPING_v1.md`. Counts are row counts, not unique lyric hashes.

## Scope reconciliation

| Scope | Required | Accounted | Result |
|---|---:|---:|---|
| PRIMARY provisional registry union | 57 | 57 | PASS |
| SUPPLEMENTAL unregistered lore-bearing | 6 | 6 | PASS |
| EXCLUDED_DUPLICATE (`UPCOMING/teaser`) | 1 | 1 | PASS |
| SOURCE_GAP versions inside PRIMARY | 2 | 2 | PASS |
| Total track-level records | 64 = 57 + 6 + 1 | 64 | PASS |

The two source gaps are already part of the 57 PRIMARY rows and are not added again.

## Mapping disposition

| Measure | Count |
|---|---:|
| Rows with a B-01–B-16 primary beat | 53 |
| Rows with primary beat `UNMAPPED` | 10 |
| Rows labeled `MOTIF_ONLY` or `ATMOSPHERE_ONLY` | 17 |
| Rows requiring operator review (`YES`) | 30 |

`MOTIF_ONLY`/`ATMOSPHERE_ONLY` rows may still carry a beat when they support that beat's imagery without representing a literal event.

## Confidence counts

| Confidence | Count |
|---|---:|
| CONFIRMED | 3 |
| STRONG | 12 |
| PLAUSIBLE | 33 |
| OPEN | 13 |
| SOURCE_GAP | 2 |
| **Total mapped rows (PRIMARY + SUPPLEMENTAL)** | **63** |

## Beat coverage

| Beat | Primary-track rows | Supplemental rows | Strong/confirmed support? | Notes |
|---|---:|---:|---|---|
| B-01 | 2 | 0 | YES | DIGITAL ASH confirmed; HOLD strong |
| B-02 | 1 | 0 | YES | DIGITAL ASH supplies confirmed secondary support; STATIC primary is plausible |
| B-03 | 3 | 0 | YES | Landauer framing confirmed; Porcelain Ascension strong |
| B-04 | 2 | 0 | YES | KINTSUGI strong; STAIN open |
| B-05 | 1 | 0 | YES | THE BREACH strong; several secondary supports |
| B-06 | 0 | 0 | NO | No sourced track strongly/explicitly owns the safehouse/decision beat |
| B-07 | 8 | 2 | YES | Archive cluster is overloaded and requires operator selection |
| B-08 | 2 | 0 | YES | SINGULAR HEART strong; SOFT IN THE WIRE plausible |
| B-09 | 13 | 0 | YES | Body/name cluster is intentionally dense; reveal boundary must be enforced |
| B-10 | 1 | 0 | YES | THE THEOREM strong, but Vane ownership needs review |
| B-11 | 2 | 0 | YES | THE ROOT ARCHITECT confirmed; ALIGN plausible |
| B-12 | 7 | 1 | YES | THIRD AXIS strong; many motif supports |
| B-13 | 2 | 1 | NO | SHARD-513/UNWRITE/OVERWRITE are plausible, none strong/confirmed |
| B-14 | 0 | 2 | NO | Only supplemental plausible support; no PRIMARY strong/confirmed owner |
| B-15 | 1 | 0 | NO | FREEFALL is OPEN `BRANCH_FAILURE`; SINGULAR HEART is secondary `BRANCH_NEUTRAL` |
| B-16 | 2 | 0 | YES | SECONDHAND strong; all B-16 use remains provisional-on-branch |

## Beats without strong or confirmed track support

- B-06 — Safehouse / decision to trace.
- B-13 — Model Collapse Leverage.
- B-14 — Paying the Debt (no PRIMARY strong/confirmed owner).
- B-15 — Lyra-∞ Fork; outcome intentionally held open.

## Overloaded beats

- B-07: 10 primary/supplemental candidates compete across Commander Lyre archive and erased-name material.
- B-09: 13 candidates cluster around porcelain/body/name motifs; only a subset should carry episode-level narrative weight.
- B-12: 8 candidates include several motif-only signal/memory tracks.

Threshold used for this review: more than 6 primary/supplemental primary-beat rows is flagged as overloaded.

## Safety checks

- No old 15-beat ID was reused as authority.
- No independent teaser row was mapped.
- Supplemental rows remain separate from PRIMARY.
- No held pre-Vessel name appears.
- No LORA Ownership placement occurs before B-11.
- B-15 and B-16 remain unresolved/provisional as required.
