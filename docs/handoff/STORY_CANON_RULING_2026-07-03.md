# STORY CANON RULING — 2026-07-03

STATUS: **OPERATOR-LOCKED CANON RULING.** Not asset-locked, not a production-ready claim — these are
narrative/canon decisions, enforced going forward for all story, MV, caption, and pitch material.
Written by Cowork at operator's explicit instruction; the rulings themselves are the operator's, not
proposed or inferred by Cowork.

SOURCE: operator review 2026-07-03 of four documents produced in a separate session (`claude.ai` web,
per operator) and handed off for consolidation: `MIKAGE_CANON_CONSISTENCY_CHECK_V1_0.html`,
`MIKAGE_STORY_BIBLE_V0_1.html`, `MIKAGE_PITCH_DECK_V0_1.html`, `MIKAGE_PIPELINE_PLAN_V0_1.html`.
Cowork (Lane B) presented the open decision points from all four; operator ruled on each below.

---

## RULING 1 — Launch Arc is non-linear with story chronology

**Release order (transmissions) is explicitly NOT story chronology.** The catalog is a "signal archive"
— tracks may release in any order relative to the 15-beat story spine. Example: THE ROOT ARCHITECT
released #7 (very early) but maps to B-10 (The Convergence, near the Act II floor). This is intentional
and approved, not an error to fix.

- Applies to: all track↔beat mapping (see `MIKAGE_CANON_CONSISTENCY_CHECK_V1_0.html` §04, 55/55 tracks
  assigned), all future MV/visual sequencing, the pitch deck's narrative framing.
- Do NOT resequence releases to match story order. Do NOT present the catalog externally as if release
  date = story timeline.

## RULING 2 — Mikage's pre-Vessel name = HANA

**LOCKED: the name is "Hana."** Operator decided directly (2026-07-03), not via the previously-planned
community vote. The Rin/Koharu/Hana shortlist is closed; Hana is canon.

- Supersedes: `MIKAGE_STORY_BIBLE_V0_1.html` §06 CHUA_XAC_NHAN-01 (marks it RESOLVED, not open).
- **OPEN QUESTION, not yet ruled:** the prior T-01 constraint ("no MV/caption/lyric-video for CALL MY
  REAL NAME or REAL NAME may state or imply a specific name until vote closes") assumed a public vote
  that no longer needs to happen. It is NOT yet decided whether "Hana" should now (a) be revealed
  publicly as part of the fan-facing story push, or (b) stay withheld internally as a reveal moment for
  later (e.g. mid-campaign lore drop, tied to a beat/MV). Flagged for a follow-up operator decision —
  Cowork will ask before any public asset references the name.

## RULING 3 — "Hana" stays withheld; reserved for a later reveal moment

**LOCKED: do NOT reveal the name "Hana" publicly yet.** Operator confirmed (2026-07-03) the name is
canon-locked internally (Ruling 2) but held back for a deliberate future reveal beat, not stated in any
public asset now.

- Applies to: website, social captions, MV/lyric-video text, pitch deck external copy, the new visual
  archive (Ruling 4) — none of these may print, caption, or imply "Hana" until operator explicitly lifts
  this hold.
- Internal/production files (Story Bible, this ruling doc, task briefs) may keep using "Hana" as the
  working name — the hold is on public-facing surfaces only.

## RULING 4 — "Kho ảnh" (visual archive) = public character/world art gallery

**LOCKED: scope of the new priority is a public gallery of character and world art** (not a lore text
page, not a social drip-feed campaign — operator picked the gallery option explicitly). Purpose: give
fans a visual entry point into the IP to build interest ahead of the release peak.

- In scope: character art (Mikage renders, turnarounds, Zenith Blade, helmet/halo lookdev stills),
  world/environment art (e.g. the hallway set once frames are approved), any other approved-for-public
  2D/3D still.
- Must respect Ruling 3 — no "Hana" text/caption anywhere in the gallery.
- Must respect existing brand canon (palette lock, no fake "3D" labeling per
  [[mikage-render-ops-and-honesty]], no un-ruled/un-approved candidate art presented as final).
- Not yet scoped: where it lives (new page on the existing site vs. a new section), which specific
  assets are cleared for public use vs. still CANDIDATE/unapproved, and whether this is a Lane B task
  dispatched to Codex or built directly. Cowork to propose a concrete plan before building anything.

## Ruling status of remaining open items (NOT yet decided — carried forward, unchanged)

These were presented alongside Rulings 1–2 but not yet addressed by the operator; they stay open:

- T-02 (KINTSUGI motif: violet-signal repair, not gold) — proposed, not yet explicitly confirmed.
- T-03 (Nightcore lane = derivative, not core visual voice) — proposed, not yet explicitly confirmed.
- Story Bible CHUA_XAC_NHAN-02 (ending tone: Lyra-∞ singularity reached or not) — open.
- Story Bible CHUA_XAC_NHAN-03 (Lyre ↔ Lyra-0 relationship) — open.
- Canon Consistency Check F-03/F-04/F-05/F-06 (label casing, title format, Track Version field, 3
  genre mismatches) — open, non-blocking hygiene items, carried to a TooLost ticket.

## Operational decisions confirmed same session (not canon, logged here for continuity)

- Registry regeneration (4 new smartlinks: PHANTOM/FUSE/WAKE/FREEFALL) — **approved by operator**, but
  execution is BLOCKED: `docs/handoff/MIKAGE_RELEASE_REGISTRY.md` (32 rows, sourced 2026-06-02) and
  `docs/handoff/MIKAGE_TRACK_CATALOG_DATABASE_V1.csv` in this repo do not contain PHANTOM, FUSE, WAKE,
  or FREEFALL at all, and the Canon Consistency Check's 55-row source CSV is not present in this repo.
  Cannot fabricate ISRC/UPC/release-date/smartlink fields for tracks not in any local source — needs the
  actual current TooLost export from the operator before the registry can be regenerated correctly.
- Front-load sprint schedule (`MIKAGE_PIPELINE_PLAN_V0_1.html` §03) — **approved**, proceed as proposed.
  Operator noted all short-hook music tracks are already finished, so the asset-production risk in the
  plan is lower than drafted; visual/caption/canvas production remains the active constraint.
- New priority stated by operator (2026-07-03): build a visual archive ("kho ảnh") and begin publicizing
  the story to build fan interest — this is a new initiative not yet scoped in the Pipeline Plan's
  phases; Cowork to clarify scope with operator before dispatching any task.
- Revenue = 0 to date; ads account blocked on phone-verification error, operator resolving next day.
  Financial data in the Pitch Deck (S08) and Pipeline Plan budget (§06) stay UNCONFIRMED until then.

---

## Files this ruling affects (extend, don't delete — no source file edited by this ruling itself)

- `MIKAGE_STORY_BIBLE_V0_1.html` (uploaded, not yet in repo) — §06 open thread 01 should be marked
  RESOLVED = Hana on next revision; ruling 1 (Launch Arc) affects §04 framing.
- `MIKAGE_CANON_CONSISTENCY_CHECK_V1_0.html` (uploaded, not yet in repo) — §03 "Ruling đề xuất" is now
  CONFIRMED, not proposed.
- `docs/handoff/MIKAGE_RELEASE_REGISTRY.md`, `docs/handoff/MIKAGE_TRACK_CATALOG_DATABASE_V1.csv` —
  regeneration blocked pending real source data (see above).

— MIKAGE ZENITH / Studio OS
