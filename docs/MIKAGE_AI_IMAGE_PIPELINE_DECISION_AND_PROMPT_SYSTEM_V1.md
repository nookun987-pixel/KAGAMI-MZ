# MIKAGE — AI IMAGE PIPELINE: DECISION + PROMPT SYSTEM V1

**Status:** `RESEARCH-BACKED RECOMMENDATION` · 2026-06-28 · sources at end.
**Goal:** break the image bottleneck — produce professional, on-canon Mikage art FROM ZERO, for a non-technical solo operator, without Blender/Codex. Three needs: hero portrait · full-body keyart · world/atmosphere.

---

## 0. THE VERDICT (chốt)

- **Primary tool: Midjourney v7** — best first-draft mood/lighting for dark-cinematic-premium. Plan **Basic $10/mo** to start (Standard $30 = unlimited "relax" when you scale). Paid plans include commercial rights.
- **Hold the character:** Midjourney **Omni Reference** (`--oref`) to keep Mikage looking the same; then, when you have a locked set, **train ONE custom LoRA on a hosted service (fal.ai, ~$2.40 one-time, no GPU)** for production-grade consistency.
- **Cheapest training-free alternative to taste first:** **Google "Nano Banana Pro"** — upload reference images, near-LoRA consistency, easiest possible, ~$0.13/image. Good for getting your first reference set fast.
- **The single make-or-break trick:** **affirmative prompting** (describe what IS there, never "no face / no eyes"). See §3 — this is what stops the model adding a face under the helmet.
- **Finish:** upscale the keepers (Topaz / Magnific at LOW creativity / free Upscayl) → hand to the CapCut 2.5D-motion + card pipeline you already have.

Realistic cost: **~$10/mo + ~$2.40 one-time** for a character LoRA. No GPU, no Blender, no Codex.

---

## 1. WHY THIS, NOT THE OTHERS (short)

| Tool | For your case | Verdict |
|---|---|---|
| **Midjourney v7** | Best dark/cinematic mood out of the box; Omni Reference holds character | **PICK (look)** |
| **Nano Banana Pro (Google)** | Easiest consistency, no training, cheap per image | **PICK (fast start / reference set)** |
| **fal.ai LoRA training** | $2.40 to bake the exact helmet into a reusable model, hosted (no GPU) | **PICK (production lock)** |
| Flux 2 / Kontext | Great control + editing; slightly more "plastic"; more technical | backup/control |
| Leonardo / Krea | Easy studios, character tools | fine alternative |
| Adobe Firefly | Only if legal indemnity is the priority; look is conservative | niche |
| Local ComfyUI (GTX 1660) | Free but slow/technical on a weak GPU | not for non-technical |

---

## 2. THE CONSISTENCY PLAN (the hard part)

A specific invented character with exact features (two slits, slab blade) drifts if you rely on prompts alone. Lock it in three rising tiers:

1. **Anchor image** — generate ONE perfect hero, save it. Reuse as `--oref` (Midjourney) or reference (Nano Banana) for everything. Gets you ~85% consistency, zero cost.
2. **Reference set** — make 10–20 clean angle-varied shots of the locked character (front, 3/4, side, full-body, close).
3. **Custom LoRA** — feed that set to **fal.ai Flux LoRA trainer (~$2.40, hosted, ~25 min)**. Now the helmet/slits/blade live in the model weights → reproducible across portrait + full-body + scene at >90%. This is the pro lock.

> Rule: **lock the look as STILLS first, animate later.** Never ask one tool to both invent and move the character — that's what makes "a different person every shot."

---

## 3. THE PROMPT SYSTEM (canon-locked, paste-ready)

### 3.1 The two rules that fix 90% of problems
1. **Affirmative framing.** Never write "no face, no eyes." Negation makes the model summon a face. Write the surface that IS there: *"smooth unbroken porcelain where a face would be, exactly two thin recessed sensor slits."* (In tests this took success 0% → 100%.)
2. **Kill the plastic look.** Drop "8K / masterpiece / ultra-HD." Use photographic + matte words: *"matte porcelain, fine grain, soft directional light, unretouched, subtle surface imperfection."* Generate large, then upscale.

### 3.2 Slit colour — LOCKED
The two slits glow **electric-violet `#8F00FF`** (the live signal) on EVERY surface, renders included (LOCKED 2026-06-28). Kintsugi gold = seams only. Crimson `#E60000` = damage / internal-energy effects only (≤15%). Violet stays the slit signal — never a full fill.

### 3.3 HERO PORTRAIT (close)
```
A sealed faceless porcelain helmet, smooth unbroken matte ceramic surface where a
face would be, exactly two thin horizontal recessed sensor slits, subtle fox-like
silhouette, long heavy straight black hair framing the helmet, fine kintsugi gold
repair seams across the porcelain, a faint electric-violet glow within the slits,
close bust portrait centered, vast void-black background, high negative space,
single soft directional rim light upper-left, matte finish, fine film grain,
cinematic, sacred-tech, monumental, restrained --ar 4:5 --style raw --v 7
```

### 3.4 FULL-BODY KEYART
```
Full-body sealed porcelain sentinel, faceless smooth porcelain helmet with exactly
two thin recessed sensor slits, long heavy black hair, wide flat-topped pauldrons,
holding a massive straight rectangular slab blade of matte void-black metal (no
taper, no curve, no ornament) diagonally with the tip near the ground, kintsugi
gold seams, matte porcelain plate armor, standing still and monumental,
three-quarter low hero angle, vast void-black void, single cold directional key
light plus thin rim light, deep negative space, matte, fine grain, cinematic,
sacred-tech --ar 4:5 --style raw --v 7
```

### 3.5 WORLD / ATMOSPHERE (no character)
```
A vast empty void-black space, a single monolithic black structure far in the
distance, faint vertical signal-rain of thin light traces, immense negative space,
minimal, cold cinematic atmosphere, matte, fine grain, architectural scale,
sacred-tech, restrained, no figures --ar 16:9 --style raw --v 7
```

### 3.6 Small backup negative (use sparingly, affirmative does the work)
`glossy plastic skin, waxy, busy cluttered background, ornate, neon, anime, cartoon, watermark, text`

---

## 4. THE FULL PIPELINE (start → post)

```
Midjourney/Nano Banana  →  lock ONE hero as anchor (--oref / reference)
        →  generate portrait + full-body + scene on canon (§3)
        →  [when ready] train $2.40 fal LoRA on the locked set
        →  upscale keepers (Topaz / Magnific low / Upscayl)
        →  CapCut: 2.5D parallax / breathing zoom  (your existing motion step)
        →  drop into the fanpage card kit  →  post
```

---

## 5. HONEST CAVEATS (read before betting the brand on it)

- **Pure AI output is NOT copyrightable** (US Supreme Court let this stand, March 2026). A competitor could legally copy a 100%-AI hero. → For the **one canonical Mikage**, add real human creative input (paintover / your own refinements) or train the LoRA on **your own refined art** so the asset is defensible and yours.
- **Trademark** the mark (as a brand identifier) is still possible — run a clearance check; it protects the mark, not the artwork.
- **Platform risk:** vendor TOS can change (Midjourney has an active Disney/Universal suit). Don't depend on a single tool's policy for your core IP.
- **"AI slop" + music backlash is real in 2026** (cancelled listening parties, fan blowback over AI album art). For audience-facing hero/cover art, authenticity matters — lean on your distinct canon and human touch so it never reads as generic AI.
- **Pro move = hybrid:** AI for ideation, volume, and exploration; human/own-trained-model + a human pass for the core, owned, brand-defining assets.

**Bottom line:** AI image gen is the right unlock for your image bottleneck *and* your no-Blender goal — use it for speed, volume, and nailing the look. But make the **one true Mikage hero** a defensible, partly-human, LoRA-on-your-own-art asset, then mass-produce everything else around it.

---

## 6. START HERE (this week)
1. Get **Midjourney Basic $10** (or try **Nano Banana** free first).
2. Paste the **HERO PORTRAIT** prompt (§3.3). Roll until one is *the* Mikage. Save it = your anchor.
3. Use it as `--oref` to make full-body + 2–3 scenes.
4. Upscale the best. Drop into CapCut motion + the card kit.
5. When happy with a set: spend **$2.40 on a fal LoRA** to lock it forever.

*I (Cowork) can write you tuned prompt variants per scene, run the card/motion step, and prep the LoRA training set whenever you're ready. The generation itself runs in the image tool — I can't render AI images here, but I build everything around it so each gen lands on-canon.*

---

## Sources
- Tools/quality/pricing: theklaystudio.com (MJ pricing) · bfl.ai (Flux) · krea.ai/pricing · leonardo.ai/pricing · press.farm (2026 roundup) · flowith.io (Flux2 vs MJ v7)
- Consistency: lovart.ai (6 best consistency tools 2026) · docs.midjourney.com (Omni Reference) · fal.ai (flux-lora trainer) · replicate.com (flux-dev-lora-trainer) · prompting.systems / segmind (Nano Banana)
- Faceless/minimalist/premium: dev.to/nadinev (affirmative framing) · selfielabstudio.com (negative space) · medium/@sophie_62065 (prop consistency) · vidhex.ai (anti-plastic) · curiousrefuge.com (upscalers)
- Pipeline/cost: neolemon.com · sider.ai · fal.ai (portrait trainer) · scenario.com/pricing · capcut.com (enhance) · fluxnote.io (Spotify Canvas)
- Caveats/IP: morganlewis.com + hklaw.com (Thaler/copyright 2026) · terms.law (MJ rights) · visualbest.co (custom vs AI) · wweek.com / loudwire.com (music AI backlash) · fiverr.com / animotionsstudio.com (artist cost)

*Research draft — not canon-lock. Prices/policies move fast; verify the tool's current page before paying.*
