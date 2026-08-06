# MIKAGE BUILD LOG — THE ZENITH BLADE · STORYBOARD V0.1

**Status:** v0.1 **DRAFT for operator review** — not published, **NOT canon**, not asset-locked.
**Built:** 2026-08-06 · task `MIKAGE_BUILDLOG_ZENITH_BLADE_V0_1`
**Governed by:** [`00_BUILD_LOG_STANDARD.md`](../00_BUILD_LOG_STANDARD.md) — extended, not reinvented.

---

## Scope decision (read first)

A blade build-log entry **already exists**: `MIKAGE_BUILDLOG_BLADE_V0_2.mp4` (101.2 s, built
2026-07-25), covering **V0.13 → V0.26**. Standard §4 SCOPE RULE: *never re-bundle already-published
chapters; each session's work gets its own entry.*

This entry therefore covers the **NEXT arc only — the CE candidate cycle CE01 → CE15, the evidence
campaign, the design board, and the canon lock (2026-08-04 → 2026-08-06).** The V0.13–V0.26 story is
**not retold**. One single origins beat is used as a bridge and is explicitly labelled prior arc.

**Publish status of `MIKAGE_BUILDLOG_BLADE_V0_2.mp4` is UNCONFIRMED** — its caption file is still
blocked on an unresolved CTA (`[Pre-save / Listen now — CONFIRM]`). This storyboard does not depend
on that resolution.

---

## Conventions inherited from the precedent

Precedent studied: `FORGING_THE_MARK_V0_1/` (1080×1920, 30 fps, 32.2 s + 16.0 s hook, AAC, track
THE LANDAUER PARADOX, CAPTION.txt in A/B/C variants) and — closer — the blade entry
`build_buildlog_blade.py` → `MIKAGE_BUILDLOG_BLADE_V0_2.mp4`.

| Convention | Value | Source |
|---|---|---|
| Resolution | **1080 × 1920** (vertical) | standard §1 "Aspect: film + hook = 1080×1920" |
| Frame rate | **24 fps** | blade precedent `build_buildlog_blade.py` (`W,H,FR = 1080,1920,24`) |
| Codec | H.264 / yuv420p + AAC | both precedents |
| Palette | void `#050508` · porcelain `#F2EEEA` · violet `#8F00FF` **signal only** | standard §1 |
| Type | Cinzel 700/400 titles · Space Mono captions | standard §1 |
| Card layout | wordmark y150 · header y214 · title y870 · violet divider y1010 · sub y1052 · stamp y H−130 | blade precedent |
| Still treatment | corner-bracket framed, contain-fit, never cropped into the subject | blade precedent `clip_image()` |
| Stamp | `PROTOTYPE // NOT CANON-LOCKED` on every card | standard §1 |
| Sign-off | `— MIKAGE ZENITH` | standard §1 |
| Glyphs | **ASCII only** — Space Mono has no `→`, renders as tofu | standard §3 (v0_3→v0_4 bug) |
| Caption | three variants A / B / C | standard §2 |

**Deviation from the dispatch defaults, deliberate:** the dispatch offered 1920×1080 / 30 fps *"if
precedent is unclear"*. Precedent is **not** unclear — it is locked at 1080×1920, and the blade
entry runs 24 fps. The standard wins.

**Music:** `LIVE/06. PORCELAIN ASCENSION/1_MASTER/PORCELAIN ASCENSION_INSTRUMENTAL.wav`. This is the
standard's §1 locked track *and* satisfies the dispatch's "pick an instrumental". It also avoids the
CTA problem blocking the existing blade caption: PORCELAIN ASCENSION is **LIVE**, so the CTA is
unambiguously `Listen now` (smartlink `https://too.fm/ddq2yma`, standard §1).

---

## Chronology (dates from file mtime — file evidence, never guessed)

| Date | Arc |
|---|---|
| 2026-06-28 | prior-arc origins material (operator folder) — **provenance UNCONFIRMED** |
| 2026-07-24/25 | V0.13 → V0.26 — **already covered by `MIKAGE_BUILDLOG_BLADE_V0_2`, not retold here** |
| 2026-08-04 | CE01 interface · CE02 Form 02 · CE04 Architecture 01 · CE05 Architecture 02 |
| 2026-08-05 | CE06 Architecture 03 |
| 2026-08-06 | CE09 rebuild · CE12 · CE13 · CE14 · CE15 · evidence campaign · Board V0/V1 · canon lock |

> **UNCONFIRMED:** file mtime is the only retained date evidence for the operator-folder material.
> Whether 2026-06-28 is the authoring date or a copy date is not recorded anywhere on disk.

---

## Shot list

Total ≈ 95 s. Every frame is an existing file — crop/scale/fade/typography only.

| # | Beat | Duration | Evidence |
|---|---|---|---|
| — | **COLD OPEN** — CE15 85 mm hero, full-bleed, no text | 4.0 s | `OUT1_HERO_P3_85MM.png` |
| — | **TITLE** — BUILD LOG // THE ZENITH BLADE · "THE FORM THAT WON" · CE01 -> CE15 | 2.8 s | card |
| 00 | **PRIOR ARC** — where the blade already stood | 2.0 + 3.6 s | `MIKAGE_BLADE_BUILD_THUMBNAIL_4x5.png` (operator folder) — **substituted, see below** |
| 01 | **THE INTERFACE** — CE01, how it meets the hand | 2.0 + 4.2 s | `REPLAY02_PASS6_hero_34.png` |
| 02 | **FORM 02** — silhouette cycle | 2.0 + 4.2 s | `FORM02_PASS01_hero.png` |
| 03 | **ARCHITECTURE 01** — the cabinet problem | 2.0 + 4.2 s | `ARCH01_PASS01_p1_hero34.png` |
| 04 | **ARCHITECTURE 02** — the monolith attempt | 2.0 + 4.2 s | `ARCH02_PASS01_monolith_hero.png` |
| 05 | **ARCHITECTURE 03** — chassis owns the silhouette | 2.0 + 4.2 s | `ARCH03_PASS01_hero.png` |
| 06 | **THE REBUILD** — CE09 | 2.0 + 4.2 s | `MOTION_f61.png` |
| 07 | **SILHOUETTE FUSION** — CE12 | 2.0 + 4.2 s | `SF_hero_P3.png` |
| 08 | **FINAL FORM POLISH** — CE13 | 2.0 + 4.2 s | `FP_hero_P3.png` |
| 09 | **HERO DESIGN PASS** — CE14 | 2.0 + 4.2 s | `HP_hero_P3.png` |
| 10 | **CE15 · COHESION** — the form that won | 2.0 + 4.6 s | `HC_hero_P3.png` |
| 11 | **P3 OVERDRIVE** — one violet core | 3.8 s | `HC_authored_P3.png` |
| 12 | **THE EVIDENCE** — 85 mm hero | 2.0 + 3.4 s | `OUT1_HERO_P3_85MM_ANNOTATED.png` |
| 13 | true section | 3.4 s | `OUT2_CORE_SPINE_SECTION_ANNOTATED.png` |
| 14 | load path | 3.4 s | `OUT3_EXPLODED_LOADPATH_ANNOTATED.png` |
| 15 | scale vs human | 3.4 s | `OUT4_SCALE_VS_HUMAN_ANNOTATED.png` |
| 16 | **THE BOARD** — V0, four slots still open | 2.0 + 3.6 s | `ZENITH_BLADE_DESIGN_BOARD_V0.png` |
| 17 | V1, all thirteen panels built | 4.0 s | `ZENITH_BLADE_FINAL_DESIGN_BOARD_V1.png` |
| — | **END CARD** — canon lock, dates, sign-off | 3.4 s | card |

---

## Caption copy (brand voice — calm, minimal, factual)

Short, ASCII-only, dates on screen. No lyrics. No faces. No warm colour. No fake UI.

- 03: `the cabinet problem -- reads as a box, not a blade`
- 04: `one mass. still not a silhouette.`
- 05: `the chassis owns the silhouette`
- 10: `four plates - spine - rails - one core`
- 11: `P3 only - single recessed core - restrained signal`
- 13: `true section evidence -- not an engineering drawing`
- 14: `load-path evidence diagram -- not a manufacturing exploded view`
- 15: `1.200 m = 47.24 in -- inside canon 35-58 in`

The honest framing labels on 13/14 are carried **verbatim from the board**, so the film cannot
overstate what the section and load-path images are.

---

## End card — exact wording

```
CE15  ·  VISUAL FORM AUTHORITY
CANON LOCK  ·  APPROVED  2026-08-06
MATERIAL CANON  ·  RECONCILED  2026-08-06

ASSET LOCK  ·  NOT ISSUED
PRODUCTION READY  ·  NOT ISSUED
```

This matches the signed documents exactly. The film **claims no asset lock and no production-ready
status**, and states both negatives on screen.

---

## Hard-rule compliance

| Rule | Compliance |
|---|---|
| Every frame from existing evidence | 19/19 shots resolve to files on disk with recorded sha256 |
| No new render / no AI generation / no ComfyUI | none used; no Blender opened |
| Allowed transforms only | contain-fit scale, letterbox, fade, typography overlay, void plate |
| Read-only on sources | sources only opened for reading; tripwire + CE15 anchor checked pre/post |
| No lyrics | the operator folder's `*_LYRIC_*` videos are **deliberately excluded** |
| No faces | no helmet/actor imagery used; blade-only |
| No warm colours | void / porcelain / violet only |
| Not canon | `PROTOTYPE // NOT CANON-LOCKED` on every card + end-card negatives |

**Deliberately excluded:** `MIKAGE_BLADE_WAKE_LYRIC_EN_65s.mp4`, `..._JP_65s.mp4`,
`MIKAGE_WAKE_LYRIC_4x5_{EN,JP}.mp4`, `MIKAGE_WAKE_LYRIC_INSPECT_4x5_{EN,JP}.mp4` — all carry
on-screen lyrics, which the studio bans for this asset.

### Shot 00 substitution — warm-colour ban (found during assembly, v0.1)

The first build used `MIKAGE_ZENITH_BLADE_LOCKED_4x5.png` for the prior-arc beat. A frame check
measured it **warm**: average RGB `(29, 24, 21)`, red above blue, on a brown/olive plate. That
trips the studio's no-warm-colour ban.

It was **not colour-corrected** — grading an evidence image would alter its content, which the
hard rules forbid. It was **replaced** with `MIKAGE_BLADE_BUILD_THUMBNAIL_4x5.png` from the same
operator archive, measured **cool** at `(20, 16, 28)` (blue above red, violet core on void). The
rebuilt frame measures `(15, 11, 20)`, R−B = −5.0 — inside brand canon.

**Open point for the operator:** the substitute has **"V0.1 · LOCKED"** baked into the poster
art. The film captions it *"its 'V0.1 LOCKED' label is that arc's own, superseded"* and stamps
every card `PROTOTYPE // NOT CANON-LOCKED`, so the film makes no lock claim — but the word is
legible on screen, and the current signed docs say **ASSET LOCK: NOT ISSUED**. Cutting the beat
entirely costs the film 5.6 s and nothing structural. **Operator's call.**
