# BACKLOG — `REPO_HYGIENE_LEGACY_TMP_TRACKED_01`

```
STATUS:   OPEN — DEFERRED UNTIL AFTER ZENITH BLADE PRODUCTION ASSET LOCK
OPENED:   2026-08-07
DECISION: operator, 2026-08-07 — do NOT clean during the Zenith Blade campaign
```

## Finding

`.gitignore:62` ignores `_tmp/`, but git does not untrack files that were already committed.
**Six `_tmp/` paths remain tracked**, all committed 2026-07-02/03, all gate contact sheets:

| Path | Introduced by |
|---|---|
| `_tmp/mikage_standing_hero_turnaround_v0_1_gate/contact_sheet.png` | `bf16ffa` 2026-07-02 |
| `_tmp/mikage_standing_hero_turnaround_v0_1_gate/contact_sheet_review_report.md` | `bf16ffa` 2026-07-02 |
| `_tmp/mikage_standing_hero_turnaround_v0_2_gate/contact_sheet.png` | `c02c5fc` 2026-07-02 |
| `_tmp/mikage_standing_hero_turnaround_v0_2_gate/contact_sheet_review_report.md` | `c02c5fc` 2026-07-02 |
| `_tmp/mikage_hero_lookdev_premium_v0_8_1_gate/contact_sheet.png` | `5b4d7c4` 2026-07-03 |
| `_tmp/mikage_hero_lookdev_premium_v0_8_1_gate/contact_sheet_review_report.md` | `5b4d7c4` 2026-07-03 |

Found by CHECK 5 of the CE15 evidence-bundle verification, 2026-08-07.

## Not caused by the collision campaign

Commit `d7dfffb` introduces **0** `_tmp/` paths. This is pre-existing state, surfaced — not created.

## Why it is deferred, not fixed

`git rm --cached` on these would remove committed gate evidence from the tracked tree. Repo hygiene
produces no value for the Asset Lock and carries a real risk of dropping proof artifacts mid-campaign.
**Operator decision 2026-08-07: leave them until after Production Asset Lock.**

## When it is picked up

Decide per file whether the contact sheet is still cited by a live gate or proof document. Anything
still cited should be **relocated to a durable non-ignored path** (the pattern already used for
`renders/board_v1_evidence/`, `BASELINE_METHOD.md` v1 → v2), with sha256 verified identical pre/post
copy — not deleted. Only then untrack the `_tmp/` copies.

Note the tripwire interaction: the tripwire globs `*.blend` matching `zenith|blade`. None of these
six is a `.blend`, so untracking them does **not** move the tripwire. Re-verify count 79 / hash
`3a62ac63…` afterwards regardless.

---

*Backlog item. No action taken. Not a blocker for the Zenith Blade collision campaign.*
