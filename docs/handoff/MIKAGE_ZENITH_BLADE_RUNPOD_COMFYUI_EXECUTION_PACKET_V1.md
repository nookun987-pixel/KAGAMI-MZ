# MIKAGE_ZENITH_BLADE_RUNPOD_COMFYUI_EXECUTION_PACKET_V1

## ── PACKET STATUS ──────────────────────────────────────────────

PACKET_TYPE: RUNPOD / CLOUD COMFYUI EXECUTION PACKET — NO RENDER BY CLAUDE
RENDER_ALLOWED_BY_CLAUDE: NO
EXECUTED_BY: Operator on a RunPod 24 GB GPU (RTX 4090 / A5000 / 3090)
SCOPE: SEPARATE WEAPON ASSET (Zenith Blade), MULTI-STAGE — NOT prompt-injected into the figure
CANON_APPROVED: NO · ASSET_LOCKED: NO · PRODUCTION_READY: NO · LANE_CHANGED: NO
DATE: 2026-06-01 (revised 2026-06-01b for operator ruling — multi-stage)

Open this top to bottom and run exactly as written. Claude produced this packet; Claude does NOT execute it. Governed by `MIKAGE_ZENITH_BLADE_SPEC_V1.md` (incl. operator ruling §0). Reuses the proven RunPod SDXL + IP-Adapter + canny ControlNet stack, re-pointed to render the Zenith Blade as an isolated object/prop across its multi-stage forms.

---

## 0. AUTHORITATIVE SOURCES

| Document | Purpose |
|---|---|
| `docs/handoff/MIKAGE_ZENITH_BLADE_SPEC_V1.md` §0 + §1–§3 | Operator ruling, identity, geometry, material, states, forbidden drift (scoped) |
| `docs/handoff/SESSION_RESUME_NOTE_20260601.md` §2–§3 | RunPod / ControlNet recipe + pod setup block |
| Operator MidJourney refs: Google Drive `MIKAGE/zenith`, `MIKAGE/zenith V2` | ST1 non-combat ornate form source images + technical blueprint |

---

## 0b. OPEN FLAGS — RESOLVED (ruling 2026-06-01b + Drive master audit 2026-06-01c)

| # | Flag | Ruling |
|---|---|---|
| F1 | Tri-phase = Zenith? | **SAME weapon** = "Thanh Đại Đao 3 Pha" (audit §0.1). "Tri-phase" = the 3 combat phases. |
| F2 | Ornate MJ design on-canon or drift? | **ON-CANON** as the non-combat appearance. NOT drift. |
| F3 | Compact-idle / mini? | **DEPRECATED — NOT CANON** (in no source file; audit §0.3). Rest = Flux-Pinning carry on the back (full ornate blade, NOT a mini module). |

Phase wording (Pha 1/2/3 = Silent/Pulse/Overload) is **PROVISIONAL** (audit §0.2) — anchored to the LOCKED Side-Channel Combat + Landauer invariants but not yet operator-coded. Outputs remain REVIEW_CANDIDATE only — no canon/asset-lock. Still to supply: exact MJ PNG(s) from Drive `zenith`/`zenith V2`.

---

## 1. STATES TO RENDER (multi-stage — each a separate render group)

Render every state as an **isolated object on a neutral near-black/grey background** (product/turnaround framing), no hand, no wielder, no scene.

| State | Form | Geometry / source | Glow |
|---|---|---|---|
| ST1 | **Non-combat ornate** (MJ design; rest = flux-pinned to back) | canny + IPA from operator MJ ref (Drive `zenith` / `zenith V2`) | none / subtle core indicator |
| ST2 | **Combat — Pha 1 Silent** (350 kg) | canny geometry-lock from locked combat ref | NONE — swallows light |
| ST3 | **Combat — Pha 2 Side-channel Pulse** | canny from combat ref | thin RED fracture pulses |
| ST4 | **Combat — Pha 3 Thermal Overload** | canny from combat ref | crimson **#E60000** core + heat |

(ST0 "mini / compact-idle" REMOVED — deprecated per audit §0.3; not canon.)

Default run plan: **2 candidates per state, 4 states = 8 outputs** (REVIEW_CANDIDATEs only). If you only want the transformation pair first, run ST1 + ST2 and review before the rest.

---

## 2. POD SETUP (RUNPOD)

Use the one-shot setup block from `SESSION_RESUME_NOTE_20260601.md` §3 verbatim (kills autostarted comfy, installs `ComfyUI_IPAdapter_plus`, downloads the 4 models, starts ComfyUI on :8188). Confirm `PORT=200` and `IPADAPTER_COUNT>0`. **Use a Network Volume** so models persist. ComfyUI UI = `https://<podid>-8188.proxy.runpod.net/`.

---

## 3. MODELS (4 files, ~13 GB — resume-note §3 set)

| Model | File | Put in |
|---|---|---|
| SDXL checkpoint | `realvisxlV50.safetensors` (RealVisXL V5.0 fp16) | `models/checkpoints/` |
| IP-Adapter (SDXL) | `ip-adapter_sdxl.safetensors` | `models/ipadapter/` |
| CLIP Vision | `clip_vision_g.safetensors` | `models/clip_vision/` |
| ControlNet canny (SDXL) | `diffusers_xl_canny_mid.safetensors` | `models/controlnet/` |

---

## 4. INPUT IMAGES TO UPLOAD (to pod `input/`)

This is a weapon prop — do NOT upload any character/body/helmet asset.

**For ST1 (non-combat ornate):**
- Operator MJ reference PNG(s) from Drive `MIKAGE/zenith` / `MIKAGE/zenith V2` — pick the clearest full-sword view as canny + IPA source (weight ~0.7), optionally a hilt close-up as a second IPA ref (~0.4). The technical blueprint can be a third low-weight style ref.

**For ST2–ST4 (combat slab):**
- `MIKAGE_ZENITH_BLADE_V2_POLISH_ONE_SHOT_00001_.png` — locked slab identity ref (canny geometry-lock + IPA ~0.7)
- `MIKAGE_COMP_07B_ZENITH_BLADE_CLEAN_MONOLITH_REVIEW_CANDIDATE.png` — clean monolith material/proportion ref (IPA ~0.4)

Local/Drive paths (CHUA_XAC_NHAN — verify before upload):
```
Google Drive: MIKAGE/zenith , MIKAGE/zenith V2   (ST1 ornate MJ refs — operator selects exact files)
D:\workspace\ComfyUI\MIKAGE_CANON\08_CHARACTER_REVIEW_CANDIDATES\MIKAGE_ZENITH_BLADE_V2_POLISH_ONE_SHOT_00001_.png
D:\workspace\ComfyUI\MIKAGE_CANON\...\MIKAGE_COMP_07B_ZENITH_BLADE_CLEAN_MONOLITH_REVIEW_CANDIDATE.png
```

### DO NOT UPLOAD / NEVER LOAD
```
Any character / body / helmet / full-body asset (blade is a separate object)
Any rejected/retired source in CLAUDE.md RENDER SOURCE EXCLUSIONS (08B, 05B, 06C, etc.)
Any video / loop / archived film frame
```

---

## 5. CANON GEOMETRY & MATERIAL (per form)

### ST1 — Non-combat ornate (from MJ ruling §0)
```
Slender straight sword with an elaborate MECHANICAL hilt: central CIRCULAR mechanism / drive unit,
telescoping segmented column above and below the hilt, machined precision panels, bolt/seam detail,
pointed convex-taper blade with engraved data-lines, dark machined gunmetal / brushed steel,
ferro-calcium core indicator at the hilt. Reads "ready / idle", not glowing, not slab.
This ornate detail is ALLOWED here (it is the canon non-combat form).
```

### ST2–ST4 — Combat slab (spec §1 — straight slab; drift rules apply here)
```
Massive oversized RECTANGULAR SLAB blade, perfectly straight ZERO curvature, thick spine, ultra-thin edge,
Appleseed convex distal taper, monolithic block, dark rusty titanium scrap plates,
thin 0.5mm flux-pinning gaps between plates, ferro-calcium heated core seam.
FORBIDDEN here: curve, katana, thin/elegant, scimitar, fantasy ornament, circular ornate mechanism, tiny/light.
```

(ST0 mini block removed — deprecated per audit §0.3. Canon rest = ornate blade flux-pinned to the back, i.e. ST1.)

---

## 6. PROMPTS (copy exactly — pick block per state)

### Shared NEGATIVE — COMBAT SLAB (ST2/ST3/ST4)
```
katana, curved blade, curvature, scimitar, saber, thin elegant blade, slim blade,
fantasy ornament, decorative engraving, filigree, jewels, runes, glowing runes,
circular mechanism, gears, clockwork, ornate crossguard, laser sword, lightsaber, plasma blade, holographic,
chrome, glossy, mirror polish, reflective, shiny clean metal, two blades,
character, person, hand, arm, wielder, glove, background scene, environment, room, landscape, floor, props,
text, watermark, logo, anime weapon, cartoon, stylized, low quality, blurry, jpeg artifact,
production ready, canon, final, locked
```

### Shared NEGATIVE — ORNATE non-combat (ST1) — note: circular mechanism is ALLOWED, keep it out of negatives
```
katana, curved scimitar, fantasy magic blade, glowing runes, jewels, gemstone,
laser sword, lightsaber, plasma, holographic, chrome glossy mirror polish,
character, person, hand, arm, wielder, glove, background scene, environment, room, floor, props,
text, watermark, logo, anime, cartoon, low quality, blurry, jpeg artifact, production ready, canon, final, locked
```

### ST1 — Non-combat ornate (POSITIVE)
```
isolated futuristic mechanical straight sword, slender pointed blade with fine engraved data-lines,
elaborate hilt with a central CIRCULAR drive mechanism, telescoping segmented metal column,
machined precision panels, bolt and seam detail, dark brushed gunmetal and steel,
ferro-calcium core indicator at the hilt, ready idle state, no glow,
single object centered vertical, neutral grey product background, flat diffuse studio lighting, clean turnaround
```

### ST2 — Combat Silent slab (POSITIVE)
```
isolated heavy industrial straight greatsword, massive oversized rectangular SLAB blade,
perfectly straight zero curvature, thick spine ultra-thin convex edge, monolithic block,
dark rusty titanium scrap plate construction, thin 0.5mm flux-pinning gaps between plates,
ferro-calcium core seam along the spine, matte non-reflective dark metal that swallows light, NO glow,
brutalist weapon prop, single object centered vertical, neutral near-black background, flat diffuse lighting
```

### ST3 — Combat Side-channel Pulse (POSITIVE)
```
[ST2 prompt] + thin RED light pulses glowing through hairline nano-fracture lines along the slab,
faint red #FF0000 crack-lines, blade otherwise dark and matte, tense pre-overload state
```

### ST4 — Combat Thermal Overload (POSITIVE)
```
[ST2 base slab] with a CRIMSON #E60000 heated glowing core along the spine, red-hot thermal bloom,
heat-distortion shimmer in the air, faint steam venting, overload state
```

(ST0 mini prompt removed — deprecated per audit §0.3.)

---

## 7. GENERATION SETTINGS

```
Model:               realvisxlV50.safetensors  (SDXL — RealVisXL V5.0)
IP-Adapter:          ip-adapter_sdxl.safetensors    CLIP Vision: clip_vision_g.safetensors
ControlNet:          diffusers_xl_canny_mid.safetensors
ControlNet strength: ST1 → 0.5 (canny from MJ ornate ref) ; ST2/3/4 → 0.5 (canny from combat ref)
IPA anchor:          ST1 → MJ ornate ref 0.7 (+ hilt 0.4) ; ST2–4 → combat ref 0.7 (+ 07B 0.4)
Sampler:             dpmpp_2m     Scheduler: karras     Steps: 34     CFG: 7.0
Denoise:             1.0 from empty latent (canny holds geometry)
Resolution:          832 x 1216  (tall vertical)
Batch:               2 seeds/state ; 4 states (ST1,ST2,ST3,ST4) = 8 outputs
```
Node map: Load Checkpoint → CLIP encode pos/neg → IPAdapterAdvanced (refs per state) → `Canny` on the state's geometry ref → `ControlNetApplyAdvanced` → KSampler → VAEDecode → SaveImage.

---

## 8. OUTPUT SPEC + NAMING

```
OUTPUT_DIR (download target):
  D:\workspace\ComfyUI\MIKAGE_CANON\13_ZENITH_BLADE_CANDIDATES_V1\

FILENAME_CONVENTION:
  MIKAGE_ZENITH_BLADE_[STATE]_REVIEW_CANDIDATE_[YYYYMMDD]_[NN].png
  e.g. MIKAGE_ZENITH_BLADE_ST1_ORNATE_REVIEW_CANDIDATE_20260601_01.png
       MIKAGE_ZENITH_BLADE_ST2_SILENT_SLAB_REVIEW_CANDIDATE_20260601_01.png
```
Forbidden filename tokens: `PASS · CANON · LOCKED · APPROVED · PRODUCTION · FINAL`.

---

## 9. PRE-RUN CHECKLIST

```
[ ] Operator ruling §0b read; ST1 ornate refs selected from Drive zenith / zenith V2
[ ] Pod = 24 GB GPU; Network Volume; local 1660 NOT used
[ ] 4 models present (IPADAPTER_COUNT>0)
[ ] ONLY blade refs uploaded; NO character/body/helmet asset
[ ] canny source correct per state (ST1 ornate ref / ST2-4 combat ref)
[ ] Positive per-state block (§6); correct NEGATIVE variant (slab vs ornate)
[ ] Resolution 832x1216; 2 seeds/state
[ ] Output dir 13_ZENITH_BLADE_CANDIDATES_V1\ ready; naming per §8
```

---

## 10. QUICK-PASS GATE (per output)

```
ST1 ornate:  [ ] slender mechanical sword, circular hilt mechanism + telescoping segments present
             [ ] dark machined metal, no glow, reads "ready idle"
ST2–4 slab:  [ ] straight SLAB, ZERO curvature, thick spine/thin edge, massive/heavy
             [ ] dark titanium scrap plates + thin flux-pinning gaps; NO ornament/curve/circular mechanism
             [ ] glow correct: ST2 none · ST3 red fracture pulses · ST4 crimson #E60000 core + heat
ALL:         [ ] isolated object, no hand/wielder/scene
```
Fail on the wrong silhouette for the form (slab curved, or ornate rendered as slab) → DISCARD.

---

## 11. AFTER RENDER — RETURN FOR SCORING

1. Download selected PNG(s) to §8 folder; record seed, steps, CFG, denoise, resolution, state, date.
2. Bring path(s) into Cowork. Claude scores against spec §0–§3 per form and assigns `INCLUDE_AS_PHASE4_REFERENCE` / `HOLD_FOR_REWORK` / `REJECT_DO_NOT_USE`.
3. No `PASS/CANON/LOCKED/PRODUCTION/FINAL` label applied by this render. Reference candidate only — not canon, not asset-lock, not Phase 5, not film/video.
4. Per-phase wording (§2 of spec) stays PROVISIONAL until the operator codes it into the source master.

---

## 12. STOP RULES

```
STOP — Combat slab (ST2-4) renders curved / thin / elegant / ornate / laser-sword (geometry violation)
STOP — ST1 ornate rendered as a plain slab (wrong form) or vice versa
STOP — A hand / wielder / character / body / scene appears (blade must be isolated)
STOP — Output saved to wrong directory or with a forbidden token
STOP — Any output labeled production-ready / canon / asset-locked / final
STOP — Film / video / short / shotlist / motion task created from this output
STOP — Phase 5 or any new lane declared started from this output
STOP — API key committed to the repository
```

---

## 13. PROHIBITED ACTIONS CONFIRMED

- RENDER_EXECUTED_BY_CLAUDE: NO · COMFYUI_RUNTIME_USED_BY_CLAUDE: NO · BLENDER_USED: NO
- IMAGE_GENERATED_BY_CLAUDE: NO · VIDEO_GENERATED: NO · FILM_TASK_CREATED: NO · SHOTLIST_CREATED: NO
- CANON_APPROVAL_CREATED: NO · ASSET_LOCK_CREATED: NO · CANDIDATES_CALLED_PRODUCTION_READY: NO
- COMPACT_IDLE_USED: NO (deprecated, not canon) · PER_PHASE_WORDING_LOCKED: NO (provisional) · LANE_CHANGED: NO · ASSET_GENERATED_BY_CLAUDE: NO
