# MIKAGE ZENITH — Design System

> Void black. Porcelain white. One thread of electric violet.
> A dark signal identity for an independent AI-assisted music & visual IP studio.

Mikage Zenith Studio is an independent, AI-assisted **music and visual-IP studio**. It
publishes a steady stream of releases ("**transmissions**") across English, Japanese,
Chinese, Korean and Vietnamese, anchored by a single proprietary character — **Mikage,
the sealed one (鏡)** — and a strict, protected visual canon. The brand is not a SaaS
product and not generic anime cyberpunk; it is **premium cinematic minimalism with a
cold, sacred-tech mood**.

This design system is the production toolkit for everything the studio puts in front of
the public and uses internally:

- **Public website** — `https://www.mikagezenith.com/`
- **Release / archive pages** — the "Launch Arc" of numbered transmissions
- **Character / IP pages** — Mikage canon, silhouette, material doctrine
- **Music-visual pages** — per-track visual fields, Spotify-canvas-style loops
- **Short-form visual task pages** — the internal render/queue surfaces
- **Proof / canon documentation** — the gate console that protects the canon

---

## Two layers, one studio (read this first)

The source repository contains **two distinct visual layers**. Keep them separate.

1. **Brand / interface canon — THIS design system.**
   Void black, porcelain white, **electric violet** signal accent. Cinzel + Shippori
   Mincho + Space Mono. High negative space, hairlines, grain, controlled glow. This is
   what every website, release page and console uses. It is authoritative here.

2. **Film / image-generation canon — the studio's *art* pipeline (reference only).**
   The repo's older art-direction docs describe a cinematic film universe with a kitsune
   mask, a 350 kg "Zenith Blade", crimson energy cores, kintsugi gold, cold cyan and
   "Z-Blue". **None of that drives the brand UI.** The locked character identity used by
   the brand is the **faceless porcelain helmet with exactly two sensor slits** — no
   samurai styling, no crimson, no neon, no HUD. When the two layers conflict, the brand
   canon (this system) wins for interface work.

> **Canon guardrails (do not violate):** no human faces or eyes; no anime/chibi/cute
> drift; no colorful cyberpunk or cheap neon; no gaming HUD; no fantasy/samurai styling;
> no mascot style; no generic AI-startup UI; violet is a *signal*, never a fill.

---

## Sources

This system was reverse-engineered from materials the studio provided. You may not have
access, but they are recorded here so you can go deeper if you do.

- **Codebase:** `KAGAMI-MZ_SYNC_PUSH_V2/` (local working copy of the studio OS).
  Priority files read for this system:
  - `MIKAGE_WORLD_CORE_READABLE.md` — world doctrine, color/language doctrine
  - `docs/mikage_universe_visual_system.md` — frame logic, hierarchy
  - `docs/canon_imports/2026-05-28/mikage-visual-director-export.docx.md` — film art canon (reference layer)
  - `docs/character/MIKAGE_CHARACTER_PROMPT_LIBRARY_v0.1.md` — **palette lock** `#050508 / #f2eeea / #8F00FF / #7B2FFF`
  - `character_workflow/MIKAGE_CHARACTER_PRODUCTION_BIBLE_V0_1.md` — helmet / sensor-slit / material rules
  - `docs/character/mikage_character_reveal_v02.html` — the studio's own token set & helmet SVG (copied to `reference/`)
  - `docs/handoff/MIKAGE_WEBSITE_UPDATE_T05_*.md` — live website copy, IA & CTA rules
  - `docs/handoff/MIKAGE_TRACK_CATALOG_DATABASE_V1.csv` — the 30-track transmission catalog
- **GitHub:** primary repo **https://github.com/nookun987-pixel/KAGAMI-MZ**
  (related: `mikage-studio-os`, `MIKAGE-DATA-OPERATOR`). Explore these to build more
  accurately against the studio's real data and pipeline.
- **Uploaded:** `uploads/MIKAGE_LOGO_DIRECTION_REFERENCE_V1.png` — logo *direction* only
  (copied to `assets/brand/`). **LOGO_ASSET_STATUS = UNCONFIRMED** — see Brand below.

---

## CONTENT FUNDAMENTALS

How Mikage writes. The studio runs **two voices** and they never bleed.

### Outward voice (public site, release pages, captions)
Calm · mysterious · elegant · minimal · thoughtful. Every line is short and weighted, like
a single inscription. Releases are framed as cosmic, quiet events.

- **Releases are "transmissions," numbered.** "Fifth transmission is live now."
- **A track may carry one short poetic line — only when source-confirmed.** A per-track
  line is used *only* when confirmed by source files or explicit operator approval;
  otherwise display **`Tagline — UNCONFIRMED`**. **Never invent poetic lines for tracks.**
  The one confirmed example: PORCELAIN ASCENSION → *"A white shell rises from the void."*
  Titles like THE ROOT ARCHITECT, GLASS SKIN, SLOW ORBIT, SIGNAL THIEF are elemental nouns,
  never hype — and have **no confirmed line** unless source-confirmed.
- **The archive is "the Launch Arc."** Past transmissions "remain in the archive."
- **Person:** third-person and impersonal ("Listen now"), occasionally collective. Almost
  never "I"; the studio speaks as a presence, not a person.
- **Casing:** release TITLES in ALL CAPS; sentences in normal case; mono labels in
  UPPERCASE with wide tracking (`CURRENT TRANSMISSION`, `05 / LAUNCH ARC`).
- **CTA grammar is locked:** exactly **`Listen now`** for live-confirmed tracks, exactly
  **`Pre-save`** for unreleased. **Never** `Pre-save / Listen`. Never mix.
- **No emoji. Ever.** No exclamation marks, no influencer/sales/meme tone.

Example hero, verbatim from the live site:
> **Fifth transmission is live now.**
> Listen to PORCELAIN ASCENSION now. SINGULAR HEART, THE BREACH, DIGITAL ASH, and THE
> LANDAUER PARADOX remain in the archive.

### Internal voice (canon console, proof packs, task pages)
Direct · concise · decision-first · truth-first. Reads like a control plane:
`Truth > Logic > Aesthetic`. States are flat tokens — `LIVE_CONFIRMED`, `PENDING_REVIEW`,
`HARD_FAIL`, `CHUA_XAC_NHAN` (unconfirmed). Gate codes like `D-01 · HELMET SENSOR SLITS`.
When a fact is not verified, it is marked **UNCONFIRMED**, never guessed.

---

## VISUAL FOUNDATIONS

### Color
- **Void black `#050508`** is the canvas — always. Surfaces ascend through `#0d0d14` →
  `#1a1a28`; dividers at `#242436`.
- **Porcelain `#f2eeea`** is identity/foreground; `#c8c4be` secondary; **silver `#a0a0b0`**
  for mono labels & structure; `#6b6b78` for faint metadata.
- **Electric violet** is the *only* chromatic accent: `#8F00FF` primary signal, `#7B2FFF`
  interactive/video, `#9d7fd0` glow/halo, `#3d2e55` hairline accent. It appears as a
  *signal* — halo, focus underline, status dot, one trace — **never as a fill or a
  gradient wash across a screen**. If you can't justify it as a signal, remove it.
- No warm colors. No green/red status semantics — status is communicated as light
  intensity (a violet dot glows when live), with restrained amber/crimson reserved only
  for the internal proof console.

### Type
- **Cinzel** — the wordmark voice. Engraved roman capitals, `0.42em` tracking, uppercase
  only. Used for "MIKAGE ZENITH" and rare display moments.
- **Shippori Mincho** — headlines, release titles, poetic lines, and full CJK (鏡 / 镜 /
  거울). Editorial, weighted, `0.08–0.14em` tracking.
- **Space Mono** — the signal voice. Labels, metadata, catalog numbers, UI chrome.
  UPPERCASE, `0.2–0.34em` tracking for labels.
- These are Google Fonts; the studio's own pages use these exact families, so no
  substitution was needed. If a bespoke wordmark face is licensed later, swap
  `--font-wordmark` only.

### Space, shape, elevation
- **8pt spacing**, but the defining trait is **high negative space** — let the void
  breathe. Density is allowed only in console rows.
- **Near-zero radius.** Sacred-tech is sharp; `r-0` is default, `r-2` max for inputs.
  Rounding (`pill`) is reserved for signal dots and waveform nodes.
- **Elevation is light, not shadow.** Cards are flatter/lighter void; the only "shadow"
  is a controlled violet emission (`--glow-violet`, `--glow-soft`).

### Backgrounds, texture & imagery
- Full-bleed void with a fine **film-grain** overlay (~4%), and occasional **violet
  radial halos** behind a subject. No photographic backgrounds by default; when imagery
  is used it is cold, high-contrast, near-monochrome with porcelain whites and a single
  violet accent. **Release artwork** (square covers from the catalog) is the main imagery.
- **Corner registration ticks** and thin hairlines frame canvases — a quiet
  instrument/console feel.

### Borders, cards & motion
- **Hairlines** (`rgba(160,160,176,0.14)`) divide; a 2px violet left-border marks console
  gate rows. Cards are sharp-edged void panels with a hairline, sometimes a single corner
  halo — **never** rounded cards with colored left-accent SaaS styling.
- **Hover:** porcelain elements invert to violet with a soft emission; ghost/links shift
  silver → porcelain and gain a violet hairline. **Press:** subtle, no bounce.
- **Motion is slow and controlled** — long fades (`0.6–1.4s`), signal pulses, draw-on
  strokes. Easing `cubic-bezier(0.22,0.61,0.36,1)`. No bounce, no playful spring, no
  parallax clutter. "Silence instead of spectacle."
- **Transparency/blur** used sparingly — faint violet haze, never frosted-glass UI.

---

## ICONOGRAPHY

Mikage's iconography is **deliberately minimal and non-illustrative** — the brand leans on
typography, hairlines, and a few signature marks rather than a busy icon set.

- **No icon font, no emoji, no decorative pictograms.** The source pages use none.
- **Signature marks (in `assets/`):**
  - `assets/character/mikage_helmet.svg` — the porcelain helmet, the studio's character
    mark (canon-locked: two sensor slits, graphene neck, violet halo).
  - `assets/brand/signal_line.svg` — the thin waveform / signal line with end nodes and a
    concentric core; the brand's recurring "transmission" motif.
  - `assets/brand/MIKAGE_LOGO_DIRECTION_REFERENCE_V1.png` — the full logo *direction*
    reference (sigil + wordmark + signal line). **UNCONFIRMED** — direction only.
- **Functional UI glyphs:** keep to thin, single-stroke essentials drawn inline (a `→`
  arrow on CTAs, the sigil "star", concentric circles, amplitude ticks, corner ticks).
  When a real icon set is genuinely required, use **Lucide** (CDN) at `1.25–1.5px`
  stroke to match the hairline weight, monochrome porcelain/silver, never filled.
  *(Substitution flagged: no native icon set exists in the source.)*
- **Status is a dot, not an icon** — a small circle whose glow/intensity carries meaning.

---

## Index / manifest

Root files:
- **`README.md`** — this file.
- **`colors_and_type.css`** — the token layer: CSS variables for color, type, space,
  radius, motion, glow + semantic primitive classes (`.mz-wordmark`, `.mz-h1`, `.mz-label`,
  `.mz-grain`, `.mz-frame`, `.mz-halo`, …). Import this in every artifact.
- **`SKILL.md`** — Agent-Skills-compatible entry point.

Folders:
- **`assets/brand/`** — logo direction reference, signal-line motif.
- **`assets/character/`** — porcelain helmet mark.
- **`preview/`** — 22 Design-System cards (Brand · Colors · Type · Spacing · Components),
  shown in the Design System tab.
- **`reference/`** — the studio's original character-reveal HTML (palette + helmet source).
- **`ui_kits/website/`** — public-site UI kit: hero, transmission archive, character page,
  music-visual page. `index.html` is an interactive click-through.
- **`ui_kits/canon_console/`** — internal proof/canon + short-form task console UI kit.

Each UI kit folder has its own `README.md` documenting components and screens.
