# WORKSTATION BLEND BASELINE — METHOD OF RECORD

**Recovered:** 2026-08-06 · task `ZENITH_BLADE_BOARD_V1_HARDENING_01` (addendum)
**Status:** **REPRODUCIBLE_VERIFIED** — previously recorded as
`LEGACY_BASELINE_UNREPRODUCIBLE`; that status is now **withdrawn**.

---

## Current expected value — **BASELINE V2**

```
3a62ac63849609a37ee3282bcb10259061039db76133ee3623d2ed279bcc44c9
```
**Expected count: 79.**

> **Baseline v2 — post CE15 durable copy, 2026-08-06. Supersedes v1.**
> **Reason: durability relocation, NOT a Blender write.**
> `renders/board_v1_evidence/ZENITH_BLADE_CE15_SOURCE.blend` was added as a durable
> copy of the CE15 source blend. Its filename matches the baseline scope
> (`zenith|blade`), so the tripwire count moved 78 → 79 and the hash changed. This
> was **a known, deliberate effect captured immediately after the copy** — it is not
> evidence of a Blender write. The copy is byte-identical to the original
> (`465b212ef4…c3129`, verified pre/post); no `.blend` was opened or re-saved.

### Historical — baseline v1 (superseded 2026-08-06)

```
cfbda51002397b39dafc1aff52d98d357826c9af1877cd4e0e478bf4dfa8895e
```
**Count: 78.** Valid from the original audit session until the CE15 durable copy.
Verified matching immediately **before** that copy (see verification log).

## Method (verbatim — run from repo root, Git Bash / GNU stat)

```bash
find . -name "*.blend" 2>/dev/null | grep -vi node_modules \
  | grep -i "zenith\|blade" | sort \
  | xargs -I{} stat -c "%Y %n" {} 2>/dev/null | sha256sum
# v2 (current): 3a62ac63849609a37ee3282bcb10259061039db76133ee3623d2ed279bcc44c9 *-
# v1 (historical, pre CE15 durable copy): cfbda51002397b39dafc1aff52d98d357826c9af1877cd4e0e478bf4dfa8895e *-
```

## Companion count (must return 79 — was 78 under v1)

```bash
find . -name "*.blend" 2>/dev/null | grep -vi node_modules \
  | grep -i "zenith\|blade" | sort | wc -l
```

## Semantics

> mtime+path tripwire over 78 filename-matched blade `.blend` files — detects any
> Blender write (even byte-identical re-save); does **NOT** detect content changes
> that preserve mtime; pair with direct sha256 of specific assets for content
> integrity.

## Preconditions

> repo root CWD; GNU `stat -c`; scope = filenames matching `zenith|blade` excluding
> `node_modules`; count must equal 79 (78 under v1); includes `.blend` files under
> `_tmp/` — cleaning `_tmp` changes the baseline.

**Additional precondition introduced by v2:** the scope now also includes the durable
copy `renders/board_v1_evidence/ZENITH_BLADE_CE15_SOURCE.blend`. Adding or removing
any file whose name matches `zenith|blade` — including future durable copies — moves
the count and the hash. **Rebaseline deliberately and record why**, as done here;
never silently update the expected value to make a check pass.

---

## Diagnostic order on mismatch

**Check the count first.** It separates the two failure modes:

| Count | Meaning |
|---|---|
| ≠ 79 | a `.blend` was **added, removed or renamed** — the file set changed |
| = 79 but hash differs | a `.blend` was **written/re-saved** — same set, changed mtime |

Do **not** guess which file. Diff the `stat -c "%Y %n"` line list against a prior
capture to identify the specific path.

---

## Verification log

| Date | Baseline | Count | Hash | Result |
|---|---|---|---|---|
| 2026-08-06 (`ZENITH_BLADE_BOARD_V1_HARDENING_01` addendum) | v1 | 78 | `cfbda510…8895e` | **MATCH** — no Blender write since the render task |
| 2026-08-06 (`ZENITH_BLADE_BOARD_V1_CLOSEOUT_01`, before Step 2) | v1 | 78 | `cfbda510…8895e` | **MATCH** — final v1 confirmation |
| 2026-08-06 (`ZENITH_BLADE_BOARD_V1_CLOSEOUT_01`, after CE15 durable copy) | **v2** | 79 | `3a62ac63…44c9` | **REBASELINED BY DESIGN** — durability relocation, not a Blender write |

---

## Relationship to the content-integrity anchor

This baseline is a **tripwire, not a content hash.** The content-integrity anchor for
the CE15 candidate is the direct SHA-256 of the source blend:

```
465b212ef49a4b8ad3eacd682757d9fe0512fa5d242c1b09611439b9c76c3129

durable : renders/board_v1_evidence/ZENITH_BLADE_CE15_SOURCE.blend
original: _tmp/zenith_blade_hero_e1_ce15/hero_cohesion_correction01/MIKAGE_ZENITH_BLADE_HERO_COHESION_CORRECTION_01_FIRST_PASSING_CANDIDATE.blend
```
Both copies are **byte-identical** (verified pre/post copy, 2026-08-06). The original
was **not** deleted. The content hash is unaffected by the v1 → v2 rebaseline — the
tripwire scope changed, the asset did not.

Both are recorded in
[ZENITH_BLADE_FINAL_DESIGN_BOARD_V1_MANIFEST.json](../../ZENITH_BLADE_FINAL_DESIGN_BOARD_V1_MANIFEST.json).
The two checks are complementary: the tripwire catches writes the content hash would
miss across the wider file set, and the content hash catches mtime-preserving edits
the tripwire would miss.
