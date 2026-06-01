# MIKAGE_ZENITH_BLADE_RUNPOD_COMFYUI_EXECUTION_PACKET_V1

## ── PACKET STATUS ──────────────────────────────────────────────
PACKET_TYPE: RUNPOD / CLOUD COMFYUI EXECUTION PACKET — NO RENDER BY CLAUDE
EXECUTED_BY: Operator on a RunPod 24 GB GPU
SCOPE: SEPARATE WEAPON ASSET — Zenith Blade / PrimeTool, rendered across the LOCKED 3 phases
ALIGNED TO: 🔒 STRUCTURE CANON LOCKED 2026-06-02 (synced P1/P2/P3; B4C outer / Ti inner)
CANON_APPROVED (structure): YES (operator-locked) · RENDER/3D PRODUCTION_READY: NO (review-candidate) · DATE: 2026-06-02

Governed by `MIKAGE_ZENITH_BLADE_SPEC_V1.md` (🔒 locked) + `MIKAGE_ZENITH_ENTITY_PHASE_SPEC_V1.md` §0.5. Claude produced this packet; Claude does NOT execute it.

---

## 0. AUTHORITATIVE SOURCES
| Document | Purpose |
|---|---|
| `MIKAGE_ZENITH_BLADE_SPEC_V1.md` (locked) | Device spec, materials, phase definitions |
| `design/zenith_blade_clean_v1/MIKAGE_ZENITH_BLADE_REST_CLEAN_V1.svg` | **ControlNet source for P1** (clean line art) |
| `design/zenith_blade_clean_v1/MIKAGE_ZENITH_BLADE_COMBAT_ACTIVE_CLEAN_V1.svg` | **ControlNet source for P2/P3** |
| `SESSION_RESUME_NOTE_20260601.md` §3 | RunPod / ComfyUI setup block |

**ControlNet prep:** rasterize each locked blueprint SVG → PNG at 832×1216 (e.g. open in browser / Inkscape / `cairosvg` export). Use the PNG as the ControlNet canny/lineart input — these are deterministic line drawings, ideal control images.

---

## 1. THE 3 PHASES TO RENDER (locked synced model)
| Phase | Weapon state | ControlNet source | Core / UI |
|---|---|---|---|
| **P1** | `Compact-Idle` — closed B4C white block, plates contracted, flux-pinned | REST blueprint | core dim 43°C · no UI |
| **P2** | `Brutal Industrial Activation` — B4C shell splitting (Kintsugi), Ti frame begins to show | COMBAT blueprint (reduce glow) | core warming · no UI yet |
| **P3** | `Tri-Phase Final / Overdrive` — shell fully split, Ti frame + core #E60000 max | COMBAT blueprint | core max · Orbital-Logic UI 3° · acid vapor · mirage |

Render each as an isolated object on neutral background, no hand/wielder/scene. Default: 2–3 seeds/phase = 6–9 candidates.

---

## 2. POD + MODELS
Run `SESSION_RESUME_NOTE_20260601.md` §3 setup (RealVisXL V5.0 + ip-adapter_sdxl + clip_vision_g + diffusers_xl_canny_mid; Network Volume). Confirm PORT=200, IPADAPTER_COUNT>0.

---

## 3. MATERIAL DOCTRINE (locked — hold every phase)
```
OUTER  = Boron Carbide (B4C) porcelain shell, matte white #FAFAFA — the only visible surface in P1
INNER  = black rusty Titanium load-bearing frame + Ferro-calcium core (#E60000), exposed when shell splits (P2/P3)
LINK   = Flux Pinning, 0.5 mm micro-vibration at magnetic joints
350 KG · industrial đại đao · brutal block, NEVER slender/katana/fantasy/ornate-thin
```

---

## 4. PROMPTS (copy per phase)

### NEGATIVE (all phases)
```
character, person, hand, arm, wielder, body, face, scene, environment, floor, props,
katana curve, curved scimitar, thin elegant blade, slender, fantasy ornament, glowing runes,
laser sword, lightsaber, plasma, chrome glossy mirror, anime, cartoon,
low quality, blurry, jpeg artifact, production ready, final, watermark
```

### P1 — Compact-Idle (POSITIVE)
```
isolated heavy industrial greatsword in a CLOSED COMPACT BLOCK form, massive 350kg,
smooth matte white Boron Carbide porcelain shell (#FAFAFA), square brutal monolithic block,
chamfered edges, sealed seams, sterile clean surface, dim hidden core, no glow, no text,
single object centered vertical, neutral dark background, flat diffuse product lighting, clean turnaround
```

### P2 — Brutal Industrial Activation (POSITIVE)
```
isolated heavy industrial greatsword, 350kg, white B4C porcelain SHELL SPLITTING OPEN along Kintsugi cracks,
black rusty titanium internal frame beginning to show through the gaps, ferro-calcium core warming faint red,
0.5mm flux-pinning gaps between plates, brutal industrial geometry, no UI text yet,
single object centered vertical, neutral dark background, flat diffuse lighting
```

### P3 — Tri-Phase Final / Overdrive (POSITIVE)
```
isolated heavy industrial greatsword, 350kg, B4C porcelain shell FULLY SPLIT and floating outward,
exposed black rusty titanium frame assembled around a blazing red-hot ferro-calcium core (#E60000),
a band of RED MONOSPACED code text ("orbital logic" data) wrapping helically around the blade, slight 3 degree offset,
thermal-mirage heat distortion in the air, acidic steam vapor flashing off the edge, max overload,
single object centered vertical, neutral dark background, flat diffuse lighting
```

---

## 5. SETTINGS
```
Model realvisxlV50 · IP-Adapter ip-adapter_sdxl · CLIP clip_vision_g · ControlNet diffusers_xl_canny_mid
ControlNet strength 0.55 (canny from the phase's blueprint PNG) · IPA 0.6 from prior-phase render for continuity
dpmpp_2m / karras · 34 steps · CFG 7 · denoise 1.0 from empty latent · 832×1216 · 2–3 seeds/phase
```

---

## 6. OUTPUT + GATE
```
DIR: D:\workspace\ComfyUI\MIKAGE_CANON\13_ZENITH_BLADE_CANDIDATES_V1\
NAME: MIKAGE_ZENITH_BLADE_[P1|P2|P3]_REVIEW_CANDIDATE_[YYYYMMDD]_[NN].png
```
Quick-pass: P1 = closed white B4C brutal block (no curve/slender); P2 = shell splitting + Ti frame partial; P3 = full split + red core + Orbital-Logic UI + mirage; all = isolated object, brutal industrial, no character/scene. Fail → DISCARD.

---

## 7. STOP RULES
```
STOP — any phase renders slender / curved / katana / fantasy-ornate / laser
STOP — P1 not a closed block; P3 missing core glow or Orbital-Logic UI
STOP — hand / wielder / character / face / scene appears
STOP — output labeled production-ready / final / canon (renders = review-candidate only)
STOP — film / video / short / shotlist task created · API key committed
```

---

## 8. PROHIBITED ACTIONS CONFIRMED
RENDER_BY_CLAUDE: NO · COMFYUI/BLENDER_BY_CLAUDE: NO · IMAGE_GENERATED_BY_CLAUDE: NO · RENDER_PRODUCTION_READY: NO (review-candidate) · STRUCTURE_CANON: LOCKED (operator) · LANE_CHANGED: NO
