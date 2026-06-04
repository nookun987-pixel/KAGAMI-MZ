# MIKAGE TASTE MODULE — Anti-Slop Canon Enforcement

> Add-on for the `mikage-zenith-design` skill. Append to `SKILL.md` or keep as a
> referenced file. Purpose: stop any agent (Claude Code, Cowork, web, Sora/TopView
> prompts) from drifting off Mikage canon or producing generic AI "slop."
>
> **SCOPE: BRAND / INTERFACE LAYER ONLY** (web, release pages, consoles, UI, Canvas).
> The cinematic/film color contract is **UNCONFIRMED — pending the Drive doc
> "Mikage Zenith Color Canon Specification"** (timed out, not yet ingested).
>
> Values below restate existing canon. This module does NOT approve new canon or
> asset-lock anything. Dial defaults and checklist thresholds are operational
> scaffolding (adjustable), not canon.

---

## HOW TO USE

1. At the top of any build prompt, set the three dials (see §3).
2. Paste / load the COLOR CONTRACT (§1) + BAN-LIST (§2).
3. Before the agent outputs, it must run the PRE-FLIGHT CHECK (§4) and report PASS/FAIL per line.
4. Anything unknown → label `UNCONFIRMED`. Never guess, never mark PASS without source.

---

## 1. COLOR CONTRACT (brand/UI)

```
VOID      #050508 — background. ≥70% of frame. Default for all negative space.
PORCELAIN #F2EEEA — subject / text / hairline. ~25%. Clean, never yellow-tinted.
VIOLET    #8F00FF — SIGNAL. Max ~5% of frame.
            allowed: ONE light source / edge glow / ONE dot / ONE trace line.
            forbidden: area fill, background wash, gradient flood, tinting skin/sky,
                       appearing in 2+ separate loci.
VIOLET-2  #7B2FFF — secondary violet variant. Same rules as VIOLET.

BUDGET: 70 void / 25 porcelain / 5 violet — do not drift.
TONE:   desaturated; when unsure, pull toward void. Fine grain present.
HARD BANS: warm colors, multi-color neon, high saturation.
```

**Type tokens:** Cinzel (wordmark) · Shippori Mincho (headlines + CJK) · Space Mono (labels).
Wide tracking · high negative space · near-zero radius · hairlines · fine grain · slow motion.

---

## 2. BAN-LIST (kills the slop + protects canon)

**Canon-locked (do NOT modify / approximate):**
- Character mark = **faceless porcelain helmet, exactly TWO thin sensor slits, graphene underlayer.**
- No human face / eyes on the mark. (Track-scoped face exception: **T04 only**.)

**Hard visual bans:**
- No warm colors. (Palette exception: **DÙ BẦU TRỜI TẮT NẮNG** only.)
- No anime characters. No neon multicolor. No gaming HUD. No fantasy / samurai. No mascot.
- No generic AI-startup UI. No emoji.

**Anti-slop (the clichés to refuse):**
- No centered-hero + purple-gradient template. No three-equal-feature-cards.
- No default Inter-on-slate look. No em-dash-in-every-headline filler.
- Violet is never decoration — it is a signal with a reason.

**Voice:**
- Outward = calm, mysterious, minimal. Releases = "transmissions". Archive = "the Launch Arc".
- CTA grammar: `Listen now` (LIVE) **or** `Pre-save` (PRE-SAVE) — never mixed.
- Internal = direct, decision-first. Unknowns = `UNCONFIRMED`.

---

## 3. THREE DIALS (set per deliverable)

```
SIGNAL  = 0 silent · 1 single dot/trace (~1%) · 2 focus halo (~3%) · 3 max (~5%)
          [never above 5% coverage]
MOTION  = 0 static · 1 breathing zoom 100→104→100 · 2 + signal pulse · 3 + slow parallax/push
          [slow only — never fast / snappy / bouncy]
DENSITY = 0 void-heavy (max negative space) · 1 editorial · 2 structured
          [never cluttered / dashboard / HUD]
```

Suggested starting points: release page `SIGNAL 2 · MOTION 1 · DENSITY 1` ·
Canvas `SIGNAL 1–2 · MOTION 2 · DENSITY 0` · archive index `SIGNAL 1 · MOTION 0 · DENSITY 1`.

---

## 4. PRE-FLIGHT CHECK (agent self-verifies before shipping)

Report each as PASS / FAIL / N/A. Any FAIL → fix, do not ship.

- [ ] Palette budget ~70/25/5 (void / porcelain / violet)?
- [ ] Violet = signal only — ≤1 locus, ≤5%, no fill / wash / gradient / tint?
- [ ] No warm hues? (exception: DÙ BẦU TRỜI TẮT NẮNG)
- [ ] No human face / skin? (exception: T04)
- [ ] No anime character?
- [ ] Character mark = porcelain helmet, EXACTLY 2 slits, graphene underlayer — unmodified?
- [ ] Type = Cinzel wordmark / Shippori Mincho headline+CJK / Space Mono labels, wide tracking?
- [ ] Near-zero radius, hairlines, fine grain present?
- [ ] Motion (if any) = slow only?
- [ ] CTA correct for status — `Listen now` (LIVE) / `Pre-save` (PRE-SAVE), not mixed?
- [ ] Every unknown flagged `UNCONFIRMED`; nothing marked PASS/verified without source?

---

## 5. PENDING (do not fill until sourced)

- **Cinematic/film COLOR CONTRACT** — UNCONFIRMED. Build a parallel §1 once the Drive doc
  "Mikage Zenith Color Canon Specification" is ingested (kintsugi gold, Z-Blue cyan,
  crimson cores belong to the film/art reference layer, NOT this brand layer).
- Tagline / cover art per release — UNCONFIRMED until operator-supplied.

---
*End of Mikage Taste Module.*
