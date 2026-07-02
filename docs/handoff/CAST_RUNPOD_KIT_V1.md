# CAST_RUNPOD_KIT_V1

**SUPERSEDED 2026-07-03 — halo ring CHỐT TRẮNG (white), not violet; violet = 2 slits only. See `docs/handoff/HALO_RING_RULING_2026-07-03.md`. The "D4 ... halo = violet orbital ring only" line below (2026-06-02) is overridden — kept for history, do not follow.**

STATUS LIMITS: REFERENCE / PROMPT-KIT only. NOT canon-locked · NOT asset-locked · NOT production-ready. NO render / NO ComfyUI runtime / NO Blender by Claude. Outputs from this kit are REVIEW CANDIDATES; nothing here promotes, locks, or declares any asset final. LANE = CHARACTER_CAST_LANE (unchanged).
DATE: 2026-06-02
SOURCE OF TRUTH (exact values pulled, not invented):
- `docs/handoff/MIKAGE_ZENITH_ENTITY_PHASE_SPEC_V1.md` (🔒 LOCKED) — entity 3 phases + mask ruling.
- `docs/handoff/MIKAGE_ZENITH_BLADE_SPEC_V1.md` (🔒 LOCKED) — Zenith Blade per-phase.
OPERATOR DIVERGENCE RULING 2026-06-02: defer ALL to LOCKED canon (D1 crimson #E60000 film-only; D2 kintsugi P2/P3 only; D3 shell #FAFAFA / Canvas token #f2eeea; D4 Kitsune = mask's own planar geometry, halo = violet orbital ring only; U1 helmet-only no face; U2 name deferred). The withdrawn gold / #f2eeea-as-shell / kitsune-overlay lines are NOT used here.

---

## 1. CORE PRINCIPLE

Mikage = **Vessel** — an ordered porcelain shell containing an ancient consciousness the Empire purged. Every cell must read: **ordered shell outside, living / entropy leaking from inside.** Phase = how much the inside has broken through.

---

## 2. GLOBAL IDENTITY — APPLIES TO ALL 12 CELLS

- **Faceless porcelain helmet**, **Kitsune planar-geometry** mask form (the geometry IS the mask — not an overlay).
- Exactly **2 SEALED 0.7" sensor slits** — sealed monocoque, **no open aperture, no eye holes**; vision routes through a graphene + Side-Channel BMF sensor beneath the shell. **Violet `#8F00FF` = emitted signal light over the sealed slits**, never an opening.
- **Graphene underlayer** (dark woven) exposed at **neck and joints**.
- **High-collar executor coat** — long lines, hard near-zero-radius edges, tall frame.
- Cinematic halo (optional, film-layer) = **violet orbital ring only**.
- **NO human face, eyes, skin** anywhere. The helmet IS the face.

---

## 3. PER-PHASE PALETTE LOCK

| Phase | Shell | Pattern | Kintsugi / crimson | Violet signal | Other |
|---|---|---|---|---|---|
| **P1 Imperial Clean** | B4C matte white **#FAFAFA**, sterility 100% | deep/dark red, **absolutely symmetric** | **NONE** — no cracks, no kintsugi, no crimson, no warm cast | slit + orbital only | sterile, sealed, light-swallowing |
| **P2 Fallen / Exile** | **#FAFAFA** base, fracturing | symmetric pattern degrading | **Kintsugi cracks ON** = conductive resin + quantum blood **#E60000**; Ensō ring in "ashes / ember" state | slit + orbital | black rusty Ti frame begins to show through splits |
| **P3 Execution** | **#FAFAFA** scarred | pattern **glows like blood vessels** | **#E60000** at max; heat-scorch scars (Erythema ab igne); mechanical Ensō ring **glows red behind the nape** | slit + orbital | **thermal mirage** (air distortion) as flux exceeds **43°C** |

Crimson `#E60000` is **film-layer only — FORBIDDEN in Canvas/UI**. Violet is **accent only, never a full wash**. Z-Blue `#4B5866` is film-layer Empire-side only (not used in these character cells).

---

## 4. ZENITH BLADE PER PHASE (from BLADE_SPEC)

- **P1 `Compact-Idle`** — closed brutal **B4C #FAFAFA monolith block**, Titanium plates contracted tight, smooth square brutal block, **flux-pinned to the back** (0.5mm hover), core dim **43°C**, only a faint blurred **#E60000** imprisoned deep beneath the white ceramic, **no LED, silent**. Monolithic obelisk / brutalist beam, flat-cut top, **no pointed tip, no crossguard, no wrapped grip.**
- **P2 `Brutal Industrial Activation`** — B4C shell **splits (Kintsugi line)**, near threshold; **black rusty Titanium load-bearing frame + #E60000 core begin to show**; industrial wear.
- **P3 `Tri-Phase Final / Overdrive`** — shell **fully split, Ti frame floating**, core **#E60000 blazing max**, **red Monospaced "Orbital-Logic" UI text wrapping the weapon on a 3D axis, offset 3°**, **acid pH1.2 vapor**, thermal mirage >43°C.
- Forbidden for the blade in ALL phases: curved katana, thin/elegant blade, laser look, fantasy ornament, decorative scimitar, tiny/light proportions. Even the exposed internal frame stays brutal industrial.

---

## 5. SHARED NEGATIVE PROMPT (EVERY CELL)

```
human face, facial features, eyes, eyeballs, open eye slits, visible eye aperture, mouth, nose, skin, bare skin,
anime, moe, cute, chibi, kawaii, idol, fashion model,
neon clutter, glowing neon signs, game HUD, UI overlay (except P3 Orbital-Logic), heads-up display,
violet wash, violet fill, full violet flood, purple gradient background,
warm cast, golden light, amber, sepia, cozy lighting,
curved katana, thin elegant blade, fantasy ornament, decorative sword, lightweight weapon,
lowres, blurry, deformed, extra limbs, watermark, text caption
```

**P1 cells ADD to the negative (sterile lock):** `cracks, kintsugi, crimson, red glow, fracture lines, scorch marks, wear, rust, thermal distortion, ember`

---

## 6. PROMPT MATRIX — 12 CELLS (Phase × Angle)

Angles: **front · three-quarter · side · full-body.** Each positive prompt below already folds in §2 global identity; apply the §3 palette lock and §5 shared negative for that phase.

### P1 — IMPERIAL CLEAN

**Cell P1-front**
```
Mikage, faceless porcelain Kitsune-geometry helmet, exactly two sealed 0.7-inch horizontal sensor slits emitting faint violet #8F00FF signal (sealed, no aperture), dark woven graphene exposed at neck, high-collar executor coat, front view portrait, sterile matte-white B4C shell #FAFAFA sterility 100 percent, deep dark-red absolutely symmetric pattern, cold luxurious Imperial sterility, light-swallowing ceramic, closed B4C monolith blade flux-pinned to the back (faint #E60000 imprisoned deep beneath white ceramic, no LED), void #050508 background, violet as accent only, slow heavy monumental presence
```
**Cell P1-three-quarter** — as P1-front, framing = **three-quarter (45°) view**, same sealed head, blade monolith visible flux-pinned on back.
**Cell P1-side** — as P1-front, framing = **side / profile view**, high-collar coat silhouette, monolith block on back in profile.
**Cell P1-full-body** — as P1-front, framing = **full-body**, tall hard-edged executor-coat silhouette, brutal B4C monolith blade flux-pinned to back, negative space around figure, planted heavy stance.

### P2 — FALLEN / EXILE

**Cell P2-front**
```
Mikage, faceless porcelain Kitsune-geometry helmet, two sealed 0.7-inch sensor slits emitting violet #8F00FF signal (sealed, no aperture), graphene exposed at neck and joints, high-collar executor coat, front view portrait, B4C shell #FAFAFA fracturing at K_Ic limit, Kintsugi cracks ON filled with conductive resin and quantum blood #E60000 crimson, degrading symmetric dark-red pattern, Ensō ring in ashes-ember state, Zenith Blade in Brutal Industrial Activation with B4C shell splitting along a kintsugi line exposing black rusty titanium frame and #E60000 core, void #050508 background, crimson film-layer only, violet accent only, heavy ominous
```
**Cell P2-three-quarter** — as P2-front, framing = **three-quarter view**, crimson kintsugi cracks catching the turn, splitting blade visible.
**Cell P2-side** — as P2-front, framing = **side / profile view**, Ensō ring ember behind, coat profile.
**Cell P2-full-body** — as P2-front, framing = **full-body**, kintsugi crimson cracks tracing the shell, blade mid-split held heavy, negative space.

### P3 — EXECUTION

**Cell P3-front**
```
Mikage, faceless porcelain Kitsune-geometry helmet, two sealed 0.7-inch sensor slits emitting violet #8F00FF signal (sealed, no aperture), graphene exposed at neck and joints, high-collar executor coat, front view portrait, B4C shell #FAFAFA heat-scorch scars Erythema ab igne, dark-red pattern glowing like blood vessels, mechanical Ensō ring glowing red behind the nape, thermal mirage air distortion above 43C, Zenith Blade in Tri-Phase Overdrive fully split with floating titanium plates and blazing #E60000 core, red monospaced Orbital-Logic UI text wrapping the blade on a 3D axis offset 3 degrees, acid pH1.2 vapor, void #050508 background, crimson film-layer only, violet accent only, maximum visual violence yet controlled and heavy
```
**Cell P3-three-quarter** — as P3-front, framing = **three-quarter view**, blood-vessel glow + thermal mirage on the turn, overdrive blade beside.
**Cell P3-side** — as P3-front, framing = **side / profile view**, Ensō ring red behind nape clearly visible in profile, heat haze.
**Cell P3-full-body** — as P3-front, framing = **full-body**, full overdrive blade with floating Ti plates and Orbital-Logic text, scorched glowing shell, thermal mirage, planted execution stance, negative space.

---

## 7. COMFYUI GEN-PARAMS (RECOMMENDED — operator confirms)

- **MODEL = UNCONFIRMED** (operator picks the checkpoint; kit defaults elsewhere have used RealVisXL V5.0). `CHUA_XAC_NHAN`.
- **Identity anchoring (critical, no head-drift across angles):** lock **one seed per identity**, and drive a **ControlNet / IP-Adapter off a single helmet reference image** so all 4 angles render the **same head** (front/three-quarter/side/full-body must be one consistent mask, not 4 different faces). Without this the 4 angles drift.
- **Per-phase palette enforced** exactly per §3 (P1 has NO crimson/cracks; crimson only P2/P3; crimson film-layer only).
- **Resolution:** portrait for the cast-sheet cells (e.g. ~832×1216 / 896×1152); full-body cells taller. Avoid square (square framing was a prior failure cause).
- **Sampler/steps:** kit-default range (~30–34 steps, cfg ~4.5, dpmpp_2m_sde / karras) — operator may tune per model.
- **2 seeds per cell** recommended → ~24 review candidates; Cowork verifies after (no PASS / no anchor / no asset-lock without operator agreement).
- Shared negative (§5) on every cell; P1 cells add the sterile-lock negatives.

---

## 8. STATUS LIMITS (repeat)
Prompt-kit / reference only. NOT canon-locked · NOT asset-locked · NOT production-ready · NO render / no ComfyUI / no Blender by Claude · NO film/video/short/shotlist. Outputs = REVIEW CANDIDATES. LANE unchanged.
