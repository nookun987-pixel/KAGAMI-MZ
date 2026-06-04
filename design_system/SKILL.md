---
name: mikage-zenith-design
description: Use this skill to generate well-branded interfaces and assets for Mikage Zenith — an independent AI-assisted music & visual-IP studio with a dark "signal" identity (void black, porcelain white, electric violet). Use for public website pages, release/archive ("Launch Arc") pages, character/IP pages, music-visual pages, short-form visual task pages, proof/canon documentation, decks, prototypes, or any production/throwaway artifact in the brand. Contains the color & type system, fonts, canon assets, and two UI kits.
user-invocable: true
---

# Mikage Zenith — design skill

Read **`README.md`** first — it carries the full canon: the two-layer model (brand UI vs.
film/art canon), CONTENT FUNDAMENTALS (the two voices + locked CTA grammar), VISUAL
FOUNDATIONS, and ICONOGRAPHY. Then explore the other files as needed.

## Where things are
- **`colors_and_type.css`** — import this in every artifact. CSS variables for color, type,
  space, radius, motion, glow + primitive classes (`.mz-wordmark`, `.mz-h1`, `.mz-label`,
  `.mz-grain`, `.mz-frame`, `.mz-halo`).
- **`assets/brand/`** — logo direction reference (UNCONFIRMED — style only), `signal_line.svg`.
- **`assets/character/`** — `mikage_helmet.svg` (canon-locked character mark).
- **`preview/`** — design-system cards (color, type, spacing, components) to copy from.
- **`ui_kits/website/`** — public-site components (hero, transmission archive, character,
  music-visual). React + the primitives in `primitives.jsx` / `components.jsx`.
- **`ui_kits/canon_console/`** — internal proof/canon + short-form task console.

## Non-negotiable canon
- Background is **void black `#050508`**; identity is **porcelain `#f2eeea`**; the only
  accent is **electric violet `#8F00FF`**, used as a *signal* (halo, focus, dot, one trace)
  — **never a fill or full-screen wash**.
- Type: **Cinzel** wordmark · **Shippori Mincho** headlines/CJK · **Space Mono** labels.
  Wide tracking, high negative space, near-zero radius, hairlines, fine grain, slow motion.
- Character = **faceless porcelain helmet, exactly two thin sensor slits, graphene
  underlayer**. No human face/eyes, no anime, no neon, no gaming HUD, no fantasy/samurai,
  no mascot, no generic AI-startup UI, no emoji.
- Copy: outward voice is calm/mysterious/minimal; releases are "transmissions"; archive is
  "the Launch Arc"; CTA is exactly `Listen now` (live) or `Pre-save` (unreleased), never
  mixed. Internal voice is direct, decision-first; mark unknowns **UNCONFIRMED**, never guess.

## Data safety (hard rule)
Never mark any task, asset, proof gate, release status, seed, prompt spec, or canon item as
**PASS / verified** unless it is confirmed by source files or explicit operator approval.
Mock and demo data must always remain clearly labelled **SAMPLE / MOCK** and read
**UNCONFIRMED**. When real data is missing, use an explicit placeholder (e.g.
`SAMPLE PROMPT SPEC — NOT PROVIDED`, `Tagline — UNCONFIRMED`) — never fabricate a plausible
value, a verified status, or a passing result.

## How to work
If creating visual artifacts (slides, mocks, throwaway prototypes), copy assets out and
produce static HTML files the user can view. For production code, copy assets and apply the
rules here to design as a brand expert. If invoked with no other guidance, ask what the user
wants to build, ask a few focused questions, then act as an expert designer outputting HTML
artifacts or production code. Do not invent or redesign the Mikage canon.

## See also
See also: mikage-taste-module.md (brand anti-slop) and mikage-cine-color-contract.md
(cine color, LOCKED). Load both and run their pre-flight checks before any color output.
Never blend brand and cine palettes — one layer per asset.
