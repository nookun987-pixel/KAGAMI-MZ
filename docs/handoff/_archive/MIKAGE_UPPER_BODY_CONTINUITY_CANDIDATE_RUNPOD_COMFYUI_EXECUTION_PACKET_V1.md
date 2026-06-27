# MIKAGE_UPPER_BODY_CONTINUITY_CANDIDATE_RUNPOD_COMFYUI_EXECUTION_PACKET_V1

## ── PACKET STATUS ──────────────────────────────────────────────

PACKET_TYPE: RUNPOD / CLOUD COMFYUI EXECUTION PACKET — NO RENDER BY CLAUDE
RENDER_ALLOWED_BY_CLAUDE: NO
EXECUTED_BY: Operator on a RunPod RTX 4090 instance (or equivalent cloud GPU)
PHASE5_SCOPE: INTERNAL_NO_RENDER (this packet is the brief; the operator runs it)
CANON_APPROVED: NO · ASSET_LOCKED: NO · PRODUCTION_READY: NO
DATE: 2026-06-01

Open this top to bottom and run exactly as written. Claude produced this packet. Claude does NOT execute it. It reuses the proven bust-bridge stack (ASSET-BUILD-06 EXECUTION PACKET V2), re-pointed to extend the **accepted bust 09A** into an upper-body crop, governed by the upper-body render-request spec.

---

## 0. AUTHORITATIVE SOURCES

| Document | Purpose |
|---|---|
| `docs/handoff/MIKAGE_UPPER_BODY_CONTINUITY_CANDIDATE_RENDER_REQUEST_SPEC_V1.md` | Constraint source — what to depict / forbid / score |
| `docs/handoff/MIKAGE_PHASE5_UPPER_BODY_CONSISTENCY_PLANNING_V1.md` | UB-1…UB-10 scoring criteria |
| `docs/handoff/MIKAGE_BODY_CONTINUITY_CONSTRAINT_SPEC_V1.md` | AR-15 continuity + hard stops |
| `docs/handoff/ASSET-BUILD-06_EXTERNAL_GPU_API_EXECUTION_PACKET_V2.md` | Proven bust-bridge node map + settings (the technical base reused here) |

---

## 1. WHY RUNPOD (HARDWARE NOTE)

This stack is SDXL + IP-Adapter + ControlNet. It needs roughly 12–16 GB VRAM in practice.

- Operator local GPU = **GTX 1660, 6 GB VRAM → NOT sufficient.** Do not attempt locally.
- Use **RunPod RTX 4090 (24 GB)** — same class used for the bust bridge. RTX A5000 / 3090 (24 GB) also fine.
- Pod disk: allow ~25–30 GB for the 4 models (~13 GB) + ComfyUI + outputs.

---

## 2. POD SETUP (RUNPOD)

1. Rent a RunPod GPU pod, RTX 4090, with a **ComfyUI template** (e.g. a "ComfyUI" community/official template) so ComfyUI + a Python env are preinstalled. If using a bare PyTorch template, `git clone https://github.com/comfyanonymous/ComfyUI` and `pip install -r requirements.txt`.
2. Install the IP-Adapter custom node:
   ```
   cd ComfyUI/custom_nodes
   git clone https://github.com/cubiq/ComfyUI_IPAdapter_plus
   ```
   Restart ComfyUI. Confirm node type `IPAdapterAdvanced` is available.
3. Expose the ComfyUI port (RunPod "Connect" → HTTP 8188) or use the API endpoint.

---

## 3. MODELS TO DOWNLOAD (4 files, ~13 GB)

Place each in the listed ComfyUI subfolder. These are the exact files proven on the bust bridge.

| Model | File | Put in |
|---|---|---|
| SDXL checkpoint | `juggernautXL_v8Rundiffusion.safetensors` | `ComfyUI/models/checkpoints/` |
| IP-Adapter (SDXL) | `ip-adapter_sdxl.safetensors` | `ComfyUI/models/ipadapter/` |
| CLIP Vision | `clip_vision_g.safetensors` | `ComfyUI/models/clip_vision/` |
| ControlNet canny (SDXL) | `diffusers_xl_canny_mid.safetensors` | `ComfyUI/models/controlnet/` |

CHUA_XAC_NHAN: download URLs are not pinned here. Use the same sources you used for the bust render (Civitai for Juggernaut XL v8 Rundiffusion; HuggingFace `h94/IP-Adapter` for `ip-adapter_sdxl.safetensors` + `clip_vision_g`; `diffusers/controlnet-canny-sdxl-1.0` or the `diffusers_xl_canny_mid` mirror you already used). Verify filenames match exactly.

---

## 4. INPUT IMAGES TO UPLOAD (to pod `ComfyUI/input/`)

Upload these 5 approved sources only. **Primary continuity base = accepted bust 09A** (this is the new img2img + canny base, replacing the faceplate the bust render used — because now we extend the real accepted bust).

| # | File (upload to `input/`) | Role | IPA weight |
|---|---|---|---|
| 1 | `MIKAGE_COMP_09A_BUST_UPPER_BODY_BRIDGE_REVIEW_CANDIDATE.png` | img2img/outpaint base + ControlNet canny + IPA anchor (primary continuity) | **0.85** |
| 2 | `MIKAGE_COMP_01A_HELMET_FACEPLATE_CLEAN_PASS.png` | Faceplate cleanness standard | 0.6 |
| 3 | `MIKAGE_COMP_03A_B4C_PORCELAIN_PANEL_GAP_PASS.png` | Matte B4C porcelain material | 0.5 |
| 4 | `MIKAGE_COMP_04A_GRAPHENE_UNDERLAYER_HEX_GAP_PASS.png` | Graphene underlayer (OPTIONAL, gaps only) | 0.35 |
| 5 | `MIKAGE_UNIFIED_KEY_VISUAL_V4_FROM_CLEAN_SOURCES_00001_.png` | Identity / style check | 0.3 |

Local source paths (copy these up to the pod):
```
D:\workspace\ComfyUI\MIKAGE_CANON\10_COMPONENT_CANDIDATE_SET_V1\09\09_BUST_UPPER_BODY_BRIDGE\MIKAGE_COMP_09A_BUST_UPPER_BODY_BRIDGE_REVIEW_CANDIDATE.png
D:\workspace\ComfyUI\MIKAGE_CANON\10_COMPONENT_CANDIDATE_SET_V1\01_HELMET_FACEPLATE\MIKAGE_COMP_01A_HELMET_FACEPLATE_CLEAN_PASS.png
D:\workspace\ComfyUI\MIKAGE_CANON\10_COMPONENT_CANDIDATE_SET_V1\03_B4C_PORCELAIN_MATERIAL\MIKAGE_COMP_03A_B4C_PORCELAIN_PANEL_GAP_PASS.png
D:\workspace\ComfyUI\MIKAGE_CANON\10_COMPONENT_CANDIDATE_SET_V1\04_GRAPHENE_UNDERLAYER\MIKAGE_COMP_04A_GRAPHENE_UNDERLAYER_HEX_GAP_PASS.png
D:\workspace\ComfyUI\MIKAGE_CANON\08_CHARACTER_REVIEW_CANDIDATES\MIKAGE_UNIFIED_KEY_VISUAL_V4_FROM_CLEAN_SOURCES_00001_.png
```

### DO NOT UPLOAD / NEVER LOAD
```
MIKAGE_COMP_08B_HELMET_BUST_NEGATIVE_SPACE_ALT_PASS_TECHNICAL.png   (REJECT)
MIKAGE_HELMET_FRONT_VIEW_3D_SOURCE_V1_ORTHO.png   (retired — near-zero contrast)
MIKAGE_VOLUME_FIRST_3D_HELMET_SIDE_V1_ORTHO.png   (retired — wrong angle)
Full-body candidate 001 / Controlled front canon repair V1 / Corrected full-body front V2
05B hair-mask · 06C halo-orbital-UI (both HOLD)
Any video / loop / archived film frame
```

---

## 5. FRAMING DECISION (the one choice point)

The bust 09A is a bust crop. To get an **upper-body** crop you must extend the frame downward. Pick ONE approach:

**Approach A — Outpaint down (recommended for tightest continuity).**
Pad 09A onto a 768×1152 canvas anchored at the TOP, leaving empty space below. Mask the empty lower region. Run img2img/inpaint so the model paints chest + shoulders + upper arms continuing the bust. Denoise on the masked region ~0.8–1.0; keep the bust region near-locked (low/zero denoise via the mask).

**Approach B — Identity-anchored regenerate.**
Use 09A as IP-Adapter identity anchor (weight 0.85) + ControlNet canny from 09A, and generate a fresh 768×1152 upper-body composition (denoise 1.0 from empty latent). Faster to set up; relies on IP-Adapter to hold identity. Higher drift risk → check UB-1/UB-3/UB-7 carefully.

Start with **Approach A**. If outpaint seams look wrong, fall back to B and tune weights.

---

## 6. POSITIVE PROMPT (copy exactly)

```
faceless armored helmet, sealed faceplate, no visor opening, no eyes, no nose, no mouth,
smooth monocoque matte B4C porcelain armor, black graphene underlayer faintly visible through micro seams only,
upper body crop, head to mid torso, armored shoulders, structural chest plate, upper arm plating,
continuous helmet-to-shoulder-to-chest armor, smooth primary surface, micro seam detail only,
structural plating not costume, no gloss, no chrome, no reflections,
neutral static front-facing pose, slight three-quarter angle acceptable,
dark neutral near-black background, flat diffuse lighting,
consistency review framing, no scene, no environment, no action staging
```

---

## 7. NEGATIVE PROMPT (copy exactly)

```
eyes, nose, mouth, lips, teeth, tongue, face, skin, face reveal,
open visor, cracked faceplate, visor glow, eye glow, eye slit, expressive helmet,
anime, manga, cartoon, stylized face, bishonen, bishojo, moe, chibi,
fashion portrait, glamour shot, beauty lighting, softcore, pinup,
feminine drift, masculine drift, gender coded, ornamental armor, decorative engraving, large panels, insignia,
glossy armor, chrome armor, metallic sheen, reflective surface, shiny plating,
transparent armor, holographic, energy emitting, glowing panels, neon,
full body, lower body, waist, hips, legs, feet,
action pose, combat stance, weapon brandishing, dynamic angle,
cinematic shot, film plate, environmental background, scene staging,
dramatic lighting, rim light, spotlight, god rays, vignette, lens flare,
production ready, canon approved, final, locked, official, complete,
grass, outdoor, nature, green, trees, sky, landscape, ground, floor,
blurry, blur, motion blur, out of focus, low quality, jpeg artifact
```

---

## 8. GENERATION SETTINGS (proven base — adjust only denoise/resolution per framing)

```
Model:               juggernautXL_v8Rundiffusion.safetensors  (SDXL)
IP-Adapter model:    ip-adapter_sdxl.safetensors
CLIP Vision:         clip_vision_g.safetensors
ControlNet:          diffusers_xl_canny_mid.safetensors
ControlNet strength: 0.55   (start 0.0, end 0.85)
Sampler:             dpmpp_2m
Scheduler:           karras
Steps:               25
CFG scale:           7.0
Denoise:             Approach A → 0.8–1.0 on masked lower region; Approach B → 1.0 from empty latent
Resolution:          768 x 1152   (taller than the 768x1024 bust to fit upper body)
Batch per run:       1
Runs:                4 (different seeds = 4 candidates)
Primary base:        MIKAGE_COMP_09A_BUST_UPPER_BODY_BRIDGE_REVIEW_CANDIDATE.png
```

Node map: reuse the ASSET-BUILD-06 V2 node graph (Section 7 of that packet) verbatim, with two substitutions — Node 4 (img2img base) and Node 10 (IPA anchor 0) load `MIKAGE_COMP_09A_...png` instead of the faceplate, and ImageScale targets 768×1152. For Approach A also add a LoadImageMask + pad/inpaint latent for the lower region.

---

## 9. OUTPUT SPEC + NAMING

```
OUTPUT_DIR (download target):
  D:\workspace\ComfyUI\MIKAGE_CANON\12_UPPER_BODY_CONTINUITY_CANDIDATES_V1\

FILENAME_CONVENTION:
  MIKAGE_UPPER_BODY_CONT_CAND_[XX]_REVIEW_CANDIDATE_[YYYYMMDD].png
  e.g. MIKAGE_UPPER_BODY_CONT_CAND_01_REVIEW_CANDIDATE_20260601.png
```
Forbidden filename tokens: `PASS · CANON · LOCKED · APPROVED · PRODUCTION · FINAL`. Keep generator-native numbered outputs as provenance.

---

## 10. PRE-RUN CHECKLIST

```
[ ] Pod = RTX 4090 (24GB); local 1660 NOT used
[ ] 4 models present in correct ComfyUI subfolders
[ ] ComfyUI_IPAdapter_plus installed; IPAdapterAdvanced available
[ ] 5 approved inputs uploaded to input/ (09A is primary base)
[ ] NO excluded/retired asset uploaded (08B, 3D orthos, 05B, 06C, full-body, video frames)
[ ] Node 4 + Node 10 load 09A; ImageScale = 768x1152
[ ] Positive prompt = Section 6 verbatim; Negative = Section 7 verbatim
[ ] Framing approach chosen (A outpaint preferred)
[ ] Output dir 12_UPPER_BODY_CONTINUITY_CANDIDATES_V1\ ready; naming per Section 9
```

---

## 11. QUICK-PASS GATE (per selected output, before submitting for scoring)

All must be true:
```
[ ] Faceplate fully sealed — no eyes/nose/mouth/skin, no visor opening
[ ] Helmet identity continuous with bust 09A (no re-styled head)
[ ] Material reads smooth monocoque matte B4C porcelain — no gloss/chrome
[ ] Panel-gap/graphene stays micro-seam secondary, not dominant
[ ] Shoulder/chest proportions extend the bust without re-styling
[ ] Helmet-to-body seam continuous and unbroken
[ ] Upper-body crop only — no full body, no legs, no scene
[ ] No anime/fashion/glamour/sexualized drift
```
Any fail on faceless or anime/fashion drift → mark DISCARD, do not submit.

---

## 12. AFTER RENDER — RETURN FOR SCORING

1. Download the selected candidate PNG(s) to the Section 9 folder; record seed, steps, CFG, denoise, resolution, date.
2. Bring the candidate path back into Cowork. Claude will score it against UB-1…UB-10 (planning doc §5) + AR-15 §9 + AR-14 §9 and assign one of: `INCLUDE_AS_PHASE4_REFERENCE` / `HOLD_FOR_REWORK` / `REJECT_DO_NOT_USE`.
3. No `PASS/CANON/LOCKED/PRODUCTION/FINAL` label is applied by this render. A pass = consistency reference only; not canon, not asset lock, not Phase 5 completion.

---

## 13. STOP RULES

```
STOP — Facial anatomy visible (eyes/nose/mouth/skin/open visor)
STOP — Anime/fashion/glamour drift not eliminable by prompt
STOP — Any excluded/retired asset loaded (08B, 3D orthos, 05B, 06C, full-body, video frames)
STOP — Output saved to wrong directory or with a forbidden token
STOP — Full body / legs / scene / action staging appears
STOP — Output submitted as production-ready, canon, or Phase 5 entry
STOP — Phase 5 declared started from this output
STOP — Film / video / short / shotlist task created from this output
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
- BUST_PROMOTED_BEYOND_PHASE4_REFERENCE: NO
- PHASE5_STARTED: NO (internal scope only; this is a render brief)
- ASSET_GENERATED_BY_CLAUDE: NO
