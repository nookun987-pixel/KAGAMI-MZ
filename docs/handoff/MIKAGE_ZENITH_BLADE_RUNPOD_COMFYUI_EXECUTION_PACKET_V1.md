# MIKAGE_ZENITH_BLADE_RUNPOD_COMFYUI_EXECUTION_PACKET_V1

## ── PACKET STATUS ──────────────────────────────────────────────

PACKET_TYPE: RUNPOD / CLOUD COMFYUI EXECUTION PACKET — NO RENDER BY CLAUDE
RENDER_ALLOWED_BY_CLAUDE: NO
EXECUTED_BY: Operator on a RunPod 24 GB GPU (RTX 4090 / A5000 / 3090)
SCOPE: SEPARATE WEAPON ASSET — Zenith Blade / PrimeTool. NOT prompt-injected into the figure.
CANON_APPROVED: NO · ASSET_LOCKED: NO · PRODUCTION_READY: NO · LANE_CHANGED: NO
DATE: 2026-06-01 (revised 2026-06-01c — operator master device spec; blade = REST + COMBAT-ACTIVE; "3 Pha" are ENTITY-level, not blade modes)

Governed by `MIKAGE_ZENITH_BLADE_SPEC_V1.md` (device spec §1) + `MIKAGE_ZENITH_ENTITY_PHASE_SPEC_V1.md` (the 3 entity phases). Claude produced this packet; Claude does NOT execute it. Reuses the proven RunPod SDXL + IP-Adapter + canny ControlNet stack.

---

## 0. AUTHORITATIVE SOURCES

| Document | Purpose |
|---|---|
| `docs/handoff/MIKAGE_ZENITH_BLADE_SPEC_V1.md` §1 | Device spec: floating Ti plates around red Ferro-calcium core, flux-pinning 0.5mm, Orbital-Logic UI, pH1.2 acid-vapor |
| `docs/handoff/MIKAGE_ZENITH_ENTITY_PHASE_SPEC_V1.md` | Entity 3 phases (Imperial Clean / Fallen-Exile / Execution) — character-side; blade core glow intensifies with phase |
| `docs/handoff/SESSION_RESUME_NOTE_20260601.md` §2–§3 | RunPod / ControlNet recipe + pod setup block |
| Drive `MIKAGE/zenith`, `MIKAGE/zenith V2` | Operator MidJourney refs — non-combat ornate form + technical blueprint |

---

## 0b. KEY CORRECTION (2026-06-01c)
The "3 Pha" are the ENTITY's appearance phases, NOT blade thermal modes. The earlier ST2/ST3/ST4 Silent/Pulse/Overload blade states are RETIRED. The blade has **2 states**: REST (ornate, flux-pinned to back) and COMBAT-ACTIVE (PrimeTool fully lit). Compact-idle/mini = deprecated (not canon). Outputs = REVIEW_CANDIDATE only.

---

## 1. STATES TO RENDER (2 blade states — each a separate render group)

Render as an **isolated object on a neutral background** (product/turnaround), no hand, no wielder, no scene.

| State | Form | Geometry / source | Signature |
|---|---|---|---|
| ST1 | **Non-combat ornate** (rest, flux-pinned to back) | canny + IPA from operator MJ ref (Drive `zenith` / `zenith V2`) | mechanical ornate sword; no UI; core dim |
| ST2 | **Combat-active PrimeTool** | canny from locked blade ref + MJ blueprint structure | floating black-Ti plates around glowing **#E60000** Ferro-calcium core; **red Orbital-Logic monospaced UI text wrapping the blade, 3° offset**; pH1.2 acid-vapor on edge; thermal mirage (Execution-tier max) |

Default run plan: **2–3 candidates per state, 2 states = 4–6 outputs**. Run ST1 + ST2 and review the transformation pair first.

---

## 2. POD SETUP

Use the one-shot setup block from `SESSION_RESUME_NOTE_20260601.md` §3 verbatim. Confirm `PORT=200`, `IPADAPTER_COUNT>0`. Use a **Network Volume** so models persist. UI = `https://<podid>-8188.proxy.runpod.net/`.

## 3. MODELS (resume-note §3 set, ~13 GB)
`realvisxlV50.safetensors` → checkpoints/ · `ip-adapter_sdxl.safetensors` → ipadapter/ · `clip_vision_g.safetensors` → clip_vision/ · `diffusers_xl_canny_mid.safetensors` → controlnet/

---

## 4. INPUT IMAGES (to pod `input/`) — weapon prop only, NO character/body/helmet asset

**ST1 (non-combat ornate):** operator MJ PNG(s) from Drive `MIKAGE/zenith` / `MIKAGE/zenith V2` (clearest full-sword view as canny + IPA ~0.7; hilt close-up as 2nd IPA ~0.4; blueprint as low-weight style ref).

**ST2 (combat-active):** `MIKAGE_ZENITH_BLADE_V2_POLISH_ONE_SHOT_00001_.png` (canny + IPA ~0.7) + `MIKAGE_COMP_07B_ZENITH_BLADE_CLEAN_MONOLITH_REVIEW_CANDIDATE.png` (IPA ~0.4) + optionally the MJ blueprint for the floating-plate / circular-mechanism structure.

Paths (CHUA_XAC_NHAN — verify before upload):
```
Google Drive: MIKAGE/zenith , MIKAGE/zenith V2   (operator selects exact files)
D:\workspace\ComfyUI\MIKAGE_CANON\08_CHARACTER_REVIEW_CANDIDATES\MIKAGE_ZENITH_BLADE_V2_POLISH_ONE_SHOT_00001_.png
D:\workspace\ComfyUI\MIKAGE_CANON\...\MIKAGE_COMP_07B_ZENITH_BLADE_CLEAN_MONOLITH_REVIEW_CANDIDATE.png
```
DO NOT load: any character/body/helmet asset; CLAUDE.md excluded sources (08B/05B/06C); any video/film frame.

---

## 5. PROMPTS (copy exactly)

### NEGATIVE — both states
```
character, person, hand, arm, wielder, glove, body, helmet, face,
background scene, environment, room, landscape, floor, props,
katana curve, curved scimitar, fantasy magic blade, glowing runes, jewels,
laser sword, lightsaber, plasma, chrome glossy mirror polish,
text watermark logo signature (except the intended red Orbital-Logic UI in ST2),
anime, cartoon, low quality, blurry, jpeg artifact, production ready, canon, final, locked
```

### ST1 — Non-combat ornate (POSITIVE)
```
isolated futuristic mechanical straight sword, slender pointed blade with fine engraved data-lines,
elaborate hilt with a central CIRCULAR drive mechanism, telescoping segmented metal column,
machined precision panels, bolt and seam detail, dark brushed gunmetal and steel,
ferro-calcium core indicator dim at the hilt, ready idle state, no glowing UI,
single object centered vertical, neutral grey product background, flat diffuse studio lighting, clean turnaround
```

### ST2 — Combat-active PrimeTool (POSITIVE)
```
isolated heavy industrial greatsword (di dao), massive 350kg, black rusty titanium armor plates
ASSEMBLED FLOATING around a glowing red-hot ferro-calcium core skeleton (#E60000) with thin 0.5mm flux-pinning gaps,
a band of RED MONOSPACED code text ("orbital logic" data) wrapping helically around the blade along its axis, slight 3 degree offset,
red-hot core bloom, faint thermal-mirage heat distortion in the surrounding air, acidic steam vapor flashing off the edge,
brutalist execution weapon, single object centered vertical, neutral dark background, flat diffuse lighting
```

---

## 6. GENERATION SETTINGS
```
Model: realvisxlV50.safetensors · IP-Adapter: ip-adapter_sdxl · CLIP: clip_vision_g · ControlNet: diffusers_xl_canny_mid
ControlNet strength: 0.5 (ST1 canny from MJ ornate ref; ST2 canny from blade ref)
IPA: ST1 → MJ ornate 0.7 (+hilt 0.4) ; ST2 → blade ref 0.7 (+07B 0.4)
Sampler dpmpp_2m · Scheduler karras · Steps 34 · CFG 7.0 · Denoise 1.0 from empty latent
Resolution 832 x 1216 · Batch 2–3 seeds/state · 2 states (ST1, ST2)
```
Node map: Load Checkpoint → CLIP encode pos/neg → IPAdapterAdvanced → `Canny` on the state's geometry ref → `ControlNetApplyAdvanced` → KSampler → VAEDecode → SaveImage.

---

## 7. OUTPUT SPEC + NAMING
```
OUTPUT_DIR: D:\workspace\ComfyUI\MIKAGE_CANON\13_ZENITH_BLADE_CANDIDATES_V1\
NAME: MIKAGE_ZENITH_BLADE_[ST1_ORNATE|ST2_COMBAT]_REVIEW_CANDIDATE_[YYYYMMDD]_[NN].png
```
Forbidden filename tokens: PASS · CANON · LOCKED · APPROVED · PRODUCTION · FINAL.

---

## 8. QUICK-PASS GATE (per output)
```
ST1: [ ] slender mechanical sword, circular hilt mechanism + telescoping segments; no glowing UI; reads "ready idle"
ST2: [ ] floating black-Ti plates around a glowing #E60000 ferro-calcium core (NOT a plain solid slab)
     [ ] red monospaced code-text wrapping the blade at a slight offset (Orbital-Logic UI present)
     [ ] thermal mirage / acidic vapor cue; reads heavy/industrial 350kg
ALL: [ ] isolated object, no hand/wielder/scene/face; no katana-curve / laser / chrome drift
```
Fail on wrong silhouette for the state, or character leak → DISCARD.

---

## 9. AFTER RENDER — RETURN FOR SCORING
1. Download to §7 folder; record seed/steps/CFG/denoise/resolution/state/date.
2. Bring path(s) into Cowork → Claude scores per state vs spec §1 + entity-phase tie-in → INCLUDE_AS_PHASE4_REFERENCE / HOLD / REJECT.
3. No PASS/CANON/LOCKED/PRODUCTION/FINAL label from this render. Reference candidate only — not canon, not asset-lock, not Phase 5, not film/video.

---

## 10. STOP RULES
```
STOP — Combat (ST2) renders as a plain solid slab with NO floating plates / NO visible red core / NO Orbital-Logic UI
STOP — A hand / wielder / character / body / face / scene appears (blade must be isolated)
STOP — Katana-curve / laser-sword / chrome-glossy drift not eliminable
STOP — Output to wrong dir or with a forbidden token
STOP — Any output labeled production-ready / canon / asset-locked / final
STOP — Film / video / short / shotlist / motion task created from this output
STOP — Phase 5 or any new lane declared started from this output
STOP — API key committed to the repository
```

---

## 11. PROHIBITED ACTIONS CONFIRMED
RENDER_BY_CLAUDE: NO · COMFYUI_RUNTIME_BY_CLAUDE: NO · BLENDER_USED: NO · IMAGE_GENERATED_BY_CLAUDE: NO · VIDEO_GENERATED: NO · FILM/SHOTLIST_CREATED: NO · CANON_APPROVAL: NO · ASSET_LOCK: NO · CALLED_PRODUCTION_READY: NO · COMPACT_IDLE_USED: NO (deprecated) · LANE_CHANGED: NO · ASSET_GENERATED_BY_CLAUDE: NO
