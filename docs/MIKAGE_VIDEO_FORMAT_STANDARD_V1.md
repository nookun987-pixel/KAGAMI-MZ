# MIKAGE ZENITH — PUBLIC VIDEO FORMAT STANDARD (V1)

> One studio, one look. Every public video (teaser, reveal, lyric, turntable, promo)
> follows this. No "today this style, tomorrow another font." If a choice isn't covered
> here, default to the `mikage-zenith-design` system, never improvise.
>
> Source of truth for type/colour: the **mikage-zenith-design** skill. Audited against the
> studio's own videos: `MIKAGE_FUSE_TEASE_30s_JP` (1080×1350) and `MIKAGE_PHANTOM_PROMO_v3`.

---

## 1. CANVAS & FORMAT

- **Primary (feed):** 1080 × 1350 (4:5). This is the default for reveals/lyric/teasers.
- **Square:** 1080 × 1080 (1:1) — promo/announce cards (PHANTOM style).
- **Vertical:** 1080 × 1920 (9:16) — Reels / TikTok / Stories / Shorts.
- **Hero / web:** 1920 × 1080 (16:9) — YouTube / banner only.
- **FPS:** 24 (cinematic) or 30. Pick one per piece; never mix.
- **Codec:** H.264, yuv420p, `+faststart`. CRF 18–21. AAC 160–192 kbps.
- **Safe margin:** keep all text & key marks within a 26 px frame inset; nothing critical in the outer 6%.

## 2. COLOUR (brand layer)

- **Void black `#050508`** — the canvas, always. Never pure `#000`.
- **Porcelain `#f2eeea`** — primary text / marks. `#c8c4be` secondary, **silver `#a0a0b0`** mono labels, `#6b6b78` faint metadata.
- **Electric violet `#8F00FF`** — the ONLY accent, and only as a **signal**: halo, slit glow, one trace, a core node, a status dot. **NEVER a full-frame wash, tint, or gradient bath.** If violet covers large flat area, it's wrong.
- No warm colours, no neon, no green/red status. (Cine/film pieces use the separate `mikage-cine-color-contract` palette — that is a different layer, not this one.)
- Grain ≈ 4% overlay. Vignette allowed (darken edges, never tint).

## 3. TYPOGRAPHY — LOCKED (this is the part that must never drift)

| Role | Font | Case / tracking | Use |
|---|---|---|---|
| **Wordmark / track name / display** | **Cinzel** (Bold) | UPPER, wide track (~0.18–0.34em) | "MIKAGE ZENITH", big track titles (FUSE, PHANTOM, WAKE) |
| **Headlines / poetic lines / all CJK** | **Shippori Mincho** (SemiBold) | sentence case, ~0.08–0.14em | hero lines, lyrics, JP/ZH/KR text (鏡 / 镜 / 거울) |
| **Labels / metadata / chrome** | **Space Mono** | UPPER, ~0.2–0.34em | top bar, dates, "SINGLE", catalog no., mikagezenith.com |

- **Never** substitute these three. No Arial/Helvetica/system fonts, no decorative fonts.
- Font files live in the design skill / `BLADE_V0.1` build assets (`Cinzel-Bold.ttf`, `ShipporiMincho-SemiBold.ttf`, `SpaceMono-Regular.ttf`). Use the SAME files every time.
- Latin body in a Shippori piece is fine (Shippori has Latin). Track names stay Cinzel.

## 4. STANDARD LAYOUT

**Top bar (every frame, optional on lyric body):**
- Left: `MIKAGE ZENITH` — Cinzel, small (~22–26px @1080w), porcelain.
- Right: descriptor — Space Mono, silver. EN: `THE SIGNAL`. JP adds `· 信号`.
- Thin hairline `rgba(160,160,176,0.12)` under the bar. Corner registration ticks optional.

**Hero / poetic lines:** centred, Shippori, porcelain, generous line spacing, one thought per beat.

**Secondary / lyric text:** **left column**, left-aligned, x≈60px, wrapped short so it **never crosses the subject** (helmet/figure/blade sit centre — text stays in the left void). Fade in/out 0.4s.

**Bottom / url:** `mikagezenith.com` — Space Mono, silver, lower-right or centred.

## 5. STRUCTURE (per video type)

- **Teaser / reveal:** cold void → subject fades in → 2–4 weighted lines (paced, not crowded) → **END CARD**.
- **Build / making-of:** stage reveal (blueprint → wireframe → solid → materials → core online → full) with stage labels → showcase spin → **END CARD**.
- **Lyric:** subject (spinning/figure) as backdrop → lyric lines enter **at the actual vocal onset** (not at t=0) → **END CARD**. Lyrics left column.
- **Turntable / loop:** seamless 360° (first frame = last), subtle camera "breathing" zoom; loopable to any length.

## 6. END CARD (COVER) — FIXED LOCKUP

Always the same, centred lower third:
```
MIKAGE ZENITH            ← Cinzel small, tracked
TRACK NAME               ← Cinzel large (display)
SINGLE · OUT DD.MM.YYYY  ← Space Mono  (EN)
mikagezenith.com         ← Space Mono, silver
```
- **JP variant:** `シングル ・ YYYY.MM.DD 配信` instead of the SINGLE line.
- Thin hairline divider above the track name. Hold 2.5–3s, slow fade.
- World/character pieces (not a track) omit the track/date and end on `MIKAGE ZENITH` + url only.

## 7. MOTION

- Slow, controlled. Fades 0.6–1.4s. Easing `cubic-bezier(0.22,0.61,0.36,1)`. **No bounce, no spring, no parallax clutter.** "Silence instead of spectacle."
- Violet pulse / glow may breathe gently. **FX (starfield, pulse rings) must stay subtle** — faint silver stars, thin dim rings. Compositing additive/screen must be done in **RGB (gbrp)**, never on YUV chroma (that magenta-washes the frame — a known bug, do not repeat).

## 8. CAPTIONS / VOICE / CTA

- Calm · minimal · mysterious. **No emoji, no exclamation, no hype.**
- **CTA grammar is LOCKED:** `Pre-save` for unreleased tracks, `Listen now` only once live. Never mix, never "Pre-save / Listen".
- Releases are "transmissions," numbered. Per-track poetic line only if source-confirmed.
- Provide EN + JP. JP / ZH / KR translations are **UNCONFIRMED** until a native review — label them so.
- Date format: EN `DD.MM.YYYY`, JP `YYYY.MM.DD … 配信`.

## 9. NAMING & OUTPUT

- File: `MIKAGE_{TRACK-or-SUBJECT}_{TYPE}_{RATIO}[_{lang}].mp4`
  e.g. `MIKAGE_WAKE_LYRIC_4x5_JP.mp4`, `MIKAGE_BLADE_TURNTABLE_4x5.mp4`.
- Public drop folder per release: `PUBLIC_POST/NN_SECTION/` each with the asset + `CAPTION.txt` (EN+JP).
- Thumbnail per video: `..._THUMBNAIL_4x5.png` (+16:9). Use the end-card frame.
- Ship to Desktop via the `SEND_to_Desktop.bat` (wipes old, rebuilds clean `MIKAGE_POST`).

## 10. AUDIO

- Always from `1_MASTER` .wav. State the in-point (e.g., "from 0:00" or a hook timestamp).
- Audio fade in 0.3s, fade out 1.5–2s at end. Lyric timing anchored to real vocal onsets.

---

## RELEASE REGISTER (keep current)

| Track | Status | Live date | CTA to use |
|---|---|---|---|
| **WAKE** | UPCOMING | **2026-07-23** | `Pre-save` until 23.07, then `Listen now` |
| FUSE | teaser cut | 2026.07.20 (per teaser) — UNCONFIRMED | `Pre-save` |
| PHANTOM | promo done | per source | `Pre-save` until live |

> WAKE is **unreleased until 2026-07-23** — every WAKE caption uses **Pre-save · mikagezenith.com** until that date.

---

## CHECKLIST (before any public video ships)

- [ ] Correct canvas + fps for the platform.
- [ ] Only the 3 locked fonts; same files as last time.
- [ ] Void black bg; violet only as a signal (no wash).
- [ ] Top bar + end-card lockup match this doc exactly.
- [ ] Secondary/lyric text left column, never over the subject; enters at vocal onset.
- [ ] End-card: MIKAGE ZENITH / TRACK / SINGLE·OUT DATE / url (JP: 配信).
- [ ] Caption EN+JP, correct CTA (Pre-save/Listen now), no emoji.
- [ ] FX subtle, composited in RGB.
- [ ] Named per convention; thumbnail exported; dropped to PUBLIC_POST.
