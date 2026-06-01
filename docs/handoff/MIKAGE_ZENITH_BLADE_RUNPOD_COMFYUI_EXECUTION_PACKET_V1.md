# MIKAGE_ZENITH_BLADE_RUNPOD_COMFYUI_EXECUTION_PACKET_V1

## ── PACKET STATUS ──────────────────────────────────────────────

PACKET_TYPE: RUNPOD / CLOUD COMFYUI EXECUTION PACKET — NO RENDER BY CLAUDE
RENDER_ALLOWED_BY_CLAUDE: NO
EXECUTED_BY: Operator on a RunPod 24 GB GPU (RTX 4090 / A5000 / 3090) — same class as the bust/full-body work
SCOPE: SEPARATE WEAPON ASSET (Zenith Blade) — NOT prompt-injected into the figure
CANON_APPROVED: NO · ASSET_LOCKED: NO · PRODUCTION_READY: NO · LANE_CHANGED: NO
DATE: 2026-06-01

Open this top to bottom and run exactly as written. Claude produced this packet; Claude does NOT execute it. It reuses the proven RunPod SDXL + IP-Adapter + canny ControlNet stack (same as the upper-body / full-body work), re-pointed to render the **Zenith Blade as an isolated object/prop**, governed by `MIKAGE_ZENITH_BLADE_SPEC_V1.md`.

---

## 0. AUTHORITATIVE SOURCES

| Document | Purpose |
|---|---|
| `docs/handoff/MIKAGE_ZENITH_BLADE_SPEC_V1.md` | Constraint source — identity, geometry, material, 3 modes, compact-idle, forbidden drift, open flags |
| `docs/handoff/SESSION_RESUME_NOTE_20260601.md` §2–§3 | Reusable RunPod / ControlNet recipe + pod setup block |
| `docs/handoff/MIKAGE_UPPER_BODY_CONTINUITY_CANDIDATE_RUNPOD_COMFYUI_EXECUTION_PACKET_V1.md` | Format + proven node map reused here |

---

## ⚠ 0b. DECISION REQUIRED BEFORE RUN (3 open flags — from spec §4)

These are NOT yet confirmed by the operator. This packet runs on **conservative defaults**; change them only on an explicit operator ruling.

| # | Open flag | Conservative default used here | If operator overrides |
|---|---|---|---|
| F1 | Is **"Tri-phase Blade"** the same weapon as **"Zenith Blade"**? | Treated as SAME ("Tri-phase" = the 3 modes of the Zenith Blade). | If different, this packet renders the Zenith Blade only; Tri-phase needs its own brief. |
| F2 | Uploaded blueprint is **slimmer / more ornate (circular mechanism)** than canon "massive rectangular slab, no ornament". On-canon or drift? | Blueprint treated as **DRIFT — DO NOT USE as render source**. Geometry comes from the canon slab spec + locked blade reference only. | If operator declares it on-canon, supply it as an additional canny/IPA source and relax the "no circular mechanism" negative. |
| F3 | Add **compact-idle (mini) State 0** to canon + supply geometry? | Rendered as a **PROPOSAL candidate only**; geometry is CHUA_XAC_NHAN (no existing asset). | If operator supplies the Drive `Technical_blueprint_drawing_of_the_Tri-phase_Blade` or a geometry note, use it as the canny source for State 0. |

DO NOT canon-lock or asset-lock any output regardless of how these resolve. Outputs are REVIEW_CANDIDATE only.

---

## 1. HARDWARE NOTE

SDXL + IP-Adapter + ControlNet ≈ 12–16 GB VRAM in practice.
- Operator local GPU = GTX 1660 6 GB → NOT sufficient. Do not attempt locally.
- Use a RunPod 24 GB pod (RTX 4090 / A5000 / 3090). **Use a Network Volume** so the ~13 GB models persist across terminate (per resume note §3).
- Pod disk: ~25–30 GB for models + ComfyUI + outputs.

---

## 2. POD SETUP (RUNPOD)

Use the one-shot setup block from `SESSION_RESUME_NOTE_20260601.md` §3 verbatim (it kills the autostarted comfy, installs `ComfyUI_IPAdapter_plus`, downloads the 4 models, starts ComfyUI on :8188). Confirm `PORT=200` and `IPADAPTER_COUNT>0`. ComfyUI UI = `https://<podid>-8188.proxy.runpod.net/`.

Note: the resume-note recipe uses **RealVisXL_V5.0** (the checkpoint proven on the full-body pass). This packet uses the same checkpoint for material consistency with the adopted figure.

---

## 3. MODELS TO DOWNLOAD (4 files, ~13 GB)

Exactly the resume-note §3 set (already in the setup block):

| Model | File | Put in |
|---|---|---|
| SDXL checkpoint | `realvisxlV50.safetensors` (RealVisXL V5.0 fp16) | `models/checkpoints/` |
| IP-Adapter (SDXL) | `ip-adapter_sdxl.safetensors` | `models/ipadapter/` |
| CLIP Vision | `clip_vision_g.safetensors` | `models/clip_vision/` |
| ControlNet canny (SDXL) | `diffusers_xl_canny_mid.safetensors` | `models/controlnet/` |

URLs are pinned in the resume-note §3 block.

---

## 4. INPUT IMAGES TO UPLOAD (to pod `input/`)

This is a **weapon prop**, not a character. Upload the existing locked blade references as the geometry + material anchors. **Do NOT upload any character/body/helmet asset** — the blade is a standalone object and must not pull in the figure.

| # | File (upload to `input/`) | Role | IPA weight |
|---|---|---|---|
| 1 | `MIKAGE_ZENITH_BLADE_V2_POLISH_ONE_SHOT_00001_.png` | Locked identity ref (full deployed blade) — ControlNet canny geometry-lock + IPA anchor | **0.7** |
| 2 | `MIKAGE_COMP_07B_ZENITH_BLADE_CLEAN_MONOLITH_REVIEW_CANDIDATE.png` | Clean monolith material/proportion ref (INCLUDE_AS_PHASE4_REFERENCE) | 0.4 |

Local source paths (CHUA_XAC_NHAN — verify exact paths on disk before upload):
```
D:\workspace\ComfyUI\MIKAGE_CANON\08_CHARACTER_REVIEW_CANDIDATES\MIKAGE_ZENITH_BLADE_V2_POLISH_ONE_SHOT_00001_.png
D:\workspace\ComfyUI\MIKAGE_CANON\...\MIKAGE_COMP_07B_ZENITH_BLADE_CLEAN_MONOLITH_REVIEW_CANDIDATE.png
```

### DO NOT UPLOAD / NEVER LOAD
```
The slimmer/ornate uploaded blueprint (F2 = DRIFT until operator rules otherwise)
Any character / body / helmet / full-body asset (blade is a separate object)
Any rejected/retired source listed in CLAUDE.md RENDER SOURCE EXCLUSIONS (08B, 05B, 06C, etc.)
Any video / loop / archived film frame
```

---

## 5. WHAT TO RENDER — 4 STATES (each a separate render group)

Render as an **isolated object on a neutral near-black background** (product/turnaround framing), no hand, no wielder, no scene. One state per render group; pick the prompt block in §7.

| State | Mode | Geometry source | Glow |
|---|---|---|---|
| S0 | **Compact-idle (mini)** — PROPOSAL only (F3) | NO locked geometry → freer; canny OFF or low. CHUA_XAC_NHAN. | none / ~43°C, no glow |
| S1 | **Silent Blade** (deployed) | canny geometry-lock from ref #1 (strength ~0.5) | NONE — "swallows light", matte dark |
| S2 | **Side-channel Pulse** | canny geometry-lock from ref #1 | thin RED pulses through nano-fractures only |
| S3 | **Thermal Overload** | canny geometry-lock from ref #1 | crimson **#E60000** heated core + heat distortion + steam |

Default run plan: **2 candidates per state, 4 states = 8 outputs.** (More than the usual single-output default — this is an explicit multi-state weapon brief, but still REVIEW_CANDIDATEs only; operator approves the batch by running it.)

---

## 6. CANON GEOMETRY & MATERIAL (must hold in every state — spec §1)

```
Class:     350 kg heavy industrial straight sword ("brute consequence")
Geometry:  massive oversized rectangular SLAB block; thick spine, ultra-thin edge;
           ABSOLUTELY STRAIGHT (zero curvature); Appleseed convex distal taper; monolithic; dark body
Material:  dark rusty titanium scrap plates + ferro-calcium heated core +
           flux-pinning assembly (plates hover ~0.5 mm apart, visible thin gaps between plates)
FORBIDDEN: curved katana, thin elegant blade, clean laser look, fantasy ornament,
           decorative scimitar, over-ornamented guard, tiny/light proportions, circular ornate mechanism (F2)
```

---

## 7. PROMPTS (copy exactly — pick the block per state)

### Shared NEGATIVE (all states)
```
katana, curved blade, curvature, scimitar, saber, thin elegant blade, slim blade,
fantasy ornament, decorative engraving, filigree, jewels, gems, runes, glowing runes,
ornate crossguard, over-ornamented guard, circular mechanism, gears, clockwork,
laser sword, lightsaber, pure energy blade, plasma blade, holographic,
chrome, glossy, mirror polish, reflective, shiny clean metal,
two blades, double edge fantasy, character, person, hand, arm, wielder, glove,
background scene, environment, room, landscape, sky, floor, props,
text, watermark, logo, signature, anime weapon, cartoon, stylized,
low quality, blurry, jpeg artifact, production ready, canon, final, locked
```

### S1 — Silent Blade (POSITIVE)
```
isolated heavy industrial straight greatsword, massive oversized rectangular slab blade,
perfectly straight zero curvature, thick spine ultra-thin convex distal taper, monolithic block,
dark rusty titanium scrap plate construction, layered plates with thin 0.5mm gaps between them (flux-pinning hover),
ferro-calcium core seam along the spine, matte non-reflective dark metal that swallows light,
NO glow, silent stable state, brutalist weapon prop, single object centered vertical,
neutral near-black background, flat diffuse product lighting, clean turnaround framing
```

### S2 — Side-channel Pulse (POSITIVE) — add red fracture pulses, otherwise dark
```
isolated heavy industrial straight greatsword, massive oversized rectangular slab blade,
perfectly straight zero curvature, thick spine ultra-thin convex distal taper, monolithic block,
dark rusty titanium scrap plate construction, thin 0.5mm flux-pinning gaps between plates,
thin RED light pulses glowing through hairline nano-fracture lines along the blade body,
faint red #FF0000 crack-lines, blade otherwise dark and matte, tense pre-overload state,
single object centered vertical, neutral near-black background, flat diffuse product lighting
```
(For S2, remove `glowing runes` only if the model suppresses the intended fracture glow; keep all other negatives.)

### S3 — Thermal Overload (POSITIVE) — crimson heated core
```
isolated heavy industrial straight greatsword, massive oversized rectangular slab blade,
perfectly straight zero curvature, thick spine ultra-thin convex distal taper, monolithic block,
dark titanium scrap plate body with a CRIMSON #E60000 heated glowing core along the spine,
red-hot thermal bloom radiating from the core, heat-distortion shimmer in the air, faint steam venting,
overload state, brutalist weapon prop, single object centered vertical,
neutral near-black background, flat diffuse product lighting
```

### S0 — Compact-idle / mini (POSITIVE) — PROPOSAL, geometry CHUA_XAC_NHAN
```
isolated compact stored weapon core module, small handheld dark industrial device,
retracted blade (NO large blade extended), palm-sized power-core unit with thin plate seams,
ferro-calcium core indicator, matte dark rusty titanium, ~43C cool idle, no glow,
single object centered, neutral near-black background, flat diffuse product lighting, concept proposal
```
S0 is a first proposal of an undefined form — expect to iterate after the operator supplies real compact-idle geometry.

---

## 8. GENERATION SETTINGS

```
Model:               realvisxlV50.safetensors  (SDXL — RealVisXL V5.0)
IP-Adapter model:    ip-adapter_sdxl.safetensors
CLIP Vision:         clip_vision_g.safetensors
ControlNet:          diffusers_xl_canny_mid.safetensors
ControlNet strength: S1/S2/S3 → 0.5  (start 0.0, end ~0.85), canny from blade ref #1
                     S0       → OFF or 0.2 (no locked geometry; let it explore)
IPA anchor:          ref #1 weight 0.7 (material/identity), ref #2 weight 0.4
Sampler:             dpmpp_2m
Scheduler:           karras
Steps:               34
CFG scale:           7.0
Denoise:             1.0 from empty latent (object generation), canny holds the slab geometry
Resolution:          832 x 1216  (tall vertical — fits the long straight slab)
Batch per state:     2 (different seeds)
States:              4 (S0, S1, S2, S3) → 8 outputs total
```

Node map: reuse the proven node graph (Load Checkpoint → CLIP encode pos/neg → IPAdapterAdvanced from ref #1/#2 → `Canny` node on ref #1 → `ControlNetApplyAdvanced` → KSampler → VAEDecode → SaveImage). For S0, bypass the Canny/ControlNet branch.

---

## 9. OUTPUT SPEC + NAMING

```
OUTPUT_DIR (download target):
  D:\workspace\ComfyUI\MIKAGE_CANON\13_ZENITH_BLADE_CANDIDATES_V1\

FILENAME_CONVENTION:
  MIKAGE_ZENITH_BLADE_[STATE]_REVIEW_CANDIDATE_[YYYYMMDD]_[NN].png
  e.g. MIKAGE_ZENITH_BLADE_S1_SILENT_REVIEW_CANDIDATE_20260601_01.png
       MIKAGE_ZENITH_BLADE_S0_COMPACT_IDLE_PROPOSAL_20260601_01.png
```
Forbidden filename tokens: `PASS · CANON · LOCKED · APPROVED · PRODUCTION · FINAL`. Keep generator-native numbered outputs as provenance.

---

## 10. PRE-RUN CHECKLIST

```
[ ] 3 open flags reviewed (§0b); defaults accepted or operator overrides recorded
[ ] Pod = 24 GB GPU; Network Volume used; local 1660 NOT used
[ ] 4 models present (resume-note §3 setup ran; IPADAPTER_COUNT>0)
[ ] ONLY the 2 blade refs uploaded; NO character/body/helmet/blueprint-drift asset
[ ] canny source = blade ref #1 for S1/S2/S3; OFF for S0
[ ] Positive = correct per-state block (§7); Negative = shared block verbatim
[ ] Resolution 832x1216; 2 seeds per state
[ ] Output dir 13_ZENITH_BLADE_CANDIDATES_V1\ ready; naming per §9
```

---

## 11. QUICK-PASS GATE (per output, before returning for scoring)

All must be true:
```
[ ] Straight slab geometry — ZERO curvature, thick spine, thin edge, rectangular block
[ ] Massive/heavy proportions — NOT thin/elegant/light
[ ] Material reads dark rusty titanium scrap plates + visible thin flux-pinning gaps
[ ] NO fantasy ornament, no engraving, no circular ornate mechanism, no crossguard filigree
[ ] No curved katana / scimitar / laser-sword / chrome-glossy drift
[ ] Per-state glow correct: S1 none · S2 red fracture pulses only · S3 crimson #E60000 core + heat
[ ] Isolated object only — no hand, no wielder, no scene
[ ] (S0) reads as a compact retracted module, NOT a giant blade
```
Any fail on geometry (curvature / thin / ornate) or scene/wielder leak → mark DISCARD.

---

## 12. AFTER RENDER — RETURN FOR SCORING

1. Download selected candidate PNG(s) to the §9 folder; record seed, steps, CFG, denoise, resolution, state, date.
2. Bring the candidate path(s) back into Cowork. Claude scores against the spec §1 geometry/material + §2 mode visuals and assigns one of: `INCLUDE_AS_PHASE4_REFERENCE` / `HOLD_FOR_REWORK` / `REJECT_DO_NOT_USE`.
3. No `PASS/CANON/LOCKED/PRODUCTION/FINAL` label is applied by this render. A pass = reference candidate only; not canon, not asset-lock, not Phase 5, not film/video.
4. S0 (compact-idle) results stay PROPOSAL until the operator canon-locks the form and supplies real geometry (F3).

---

## 13. STOP RULES

```
STOP — Blade renders curved / thin / elegant / ornate / laser-sword (geometry violation)
STOP — Circular ornate mechanism or fantasy guard appears (F2 drift)
STOP — A hand / wielder / character / body / scene appears (blade must be isolated)
STOP — The slimmer/ornate drift blueprint is used as a source before operator rules it on-canon
STOP — Output saved to wrong directory or with a forbidden token
STOP — Any output labeled production-ready / canon / asset-locked / final
STOP — Film / video / short / shotlist / motion task created from this output
STOP — Phase 5 or any new lane declared started from this output
STOP — API key committed to the repository
```

---

## 14. PROHIBITED ACTIONS CONFIRMED

- RENDER_EXECUTED_BY_CLAUDE: NO
- COMFYUI_RUNTIME_USED_BY_CLAUDE: NO
- BLENDER_USED: NO
- IMAGE_GENERATED_BY_CLAUDE: NO
- VIDEO_GENERATED: NO
- FILM_TASK_CREATED: NO
- SHOTLIST_CREATED: NO
- CANON_APPROVAL_CREATED: NO
- ASSET_LOCK_CREATED: NO
- CANDIDATES_CALLED_PRODUCTION_READY: NO
- COMPACT_IDLE_CANON_LOCKED: NO (S0 = proposal only)
- LANE_CHANGED: NO
- ASSET_GENERATED_BY_CLAUDE: NO (operator runs on RunPod)
