# ASSET-BUILD-04_REPAIR_BUST_BRIDGE_GENERATION_WORKFLOW_NO_RENDER_V1

## 1. Status

TASK: ASSET-BUILD-04_REPAIR_BUST_BRIDGE_GENERATION_WORKFLOW_NO_RENDER_V1
RESULT: COMPLETE
RENDER_EXECUTED: NO
COMFYUI_SUBMITTED: NO
CANON_APPROVED: NO
ASSET_LOCKED: NO
PRODUCTION_READY: NO
PHASE5_STARTED: NO
VALIDATION: PASS

---

## 2. What This Task Did

Audited the failed ASSET-BUILD-03 workflow, identified all root causes, wrote a corrected
generation script (`MIKAGE_BUST_BRIDGE_EXECUTE_V2.py`), and ran static validation
confirming the corrected workflow is structurally valid. No generation was performed.

---

## 3. Root Cause Audit — ASSET-BUILD-03 Failures

| # | Root Cause | Evidence |
|---|---|---|
| 1 | `IPAdapterUnifiedLoader` VIT-G preset regex does not match `clip_vision_g.safetensors` filename | Regex: `ViT.bigG.14.*39B.b160k\|ipadapter.*sdxl\|sdxl.*model` — filename `clip_vision_g` matches none; exception "ClipVision model not found" raised at runtime |
| 2 | Full txt2img (denoise = 1.0) with no img2img base — subject not anchored to Mikage geometry | EmptyLatentImage used; no Mikage source image in latent path; model generated from prompt only |
| 3 | No ControlNet conditioning — no structural edge enforcement | Workflow had zero ControlNet nodes |
| 4 | Negative prompt missing outdoor/nature/grass suppressors | Outputs drifted to green grass environment |
| 5 | Multi-image IPAdapterAdvanced chain wiring not end-to-end tested before submit | First submit returned 400; second attempt was interrupted before ComfyUI validation |

---

## 4. Repairs Applied in V2 Script

### 4.1 Fix 1 — Explicit CLIPVisionLoader (replaces UnifiedLoader)

```
OLD: IPAdapterUnifiedLoader preset="VIT-G (medium strength)"
     → fails: clip_vision_g.safetensors not matched by preset regex

NEW: IPAdapterModelLoader  ipadapter_file="ip-adapter_sdxl.safetensors"   (node 6)
     CLIPVisionLoader       clip_name="clip_vision_g.safetensors"           (node 7)
     → explicit load, no regex dependency, confirmed by object_info query
```

### 4.2 Fix 2 — img2img Base via VAEEncode

```
OLD: EmptyLatentImage (denoise 1.0) → no subject anchor

NEW: LoadImage  MIKAGE_HELMET_FRONT_VIEW_3D_SOURCE_V1_ORTHO.png  (node 4)
     VAEEncode  pixels←[4,0]  vae←[1,2]                          (node 5)
     KSampler   latent_image←[5,0]  denoise=0.65
     → helmet geometry anchored in latent space; img2img preserves structural form
```

Base image rationale: `MIKAGE_HELMET_FRONT_VIEW_3D_SOURCE_V1_ORTHO.png` is a locked,
canon-approved 3D ortho render with clean helmet geometry. It is not an excluded asset.
Denoise 0.65 retains structure while allowing SDXL aesthetic to apply.

### 4.3 Fix 3 — ControlNet Canny on Helmet Front Ortho

```
NEW: ControlNetLoader       diffusers_xl_canny_mid.safetensors    (node 8)
     ControlNetApplyAdvanced
       positive←[2,0]  negative←[3,0]  control_net←[8,0]
       image←[4,0]  strength=0.55  start=0.0  end=0.85            (node 9)
     KSampler  positive←[9,0]  negative←[9,1]
     → edge structure of helmet enforced independently of IP-Adapter
```

Only ControlNet model available: `diffusers_xl_canny_mid.safetensors`. No depth model
present. Canny on the 3D ortho is acceptable — high-contrast clean render produces clean
canny edges without a separate preprocessor node.

### 4.4 Fix 4 — Negative Prompt Additions

Added to negative prompt:
```
grass, outdoor, nature, green, trees, sky, landscape, ground, floor,
blurry, blur, motion blur, out of focus, low quality, jpeg artifact
```

### 4.5 Fix 5 — Node Wiring Verified

IPAdapterAdvanced chain verified against ComfyUI object_info:
```
IPAdapterModelLoader  → slot 0 = IPADAPTER
CLIPVisionLoader      → slot 0 = CLIP_VISION
IPAdapterAdvanced     → slot 0 = MODEL  (sole output)
ControlNetApplyAdvanced → slot 0 = positive CONDITIONING, slot 1 = negative CONDITIONING
VAEEncode             → slot 0 = LATENT
```
All connections traced manually and confirmed by static validator.

---

## 5. Corrected Script

**Path:** `D:\workspace\ComfyUI\MIKAGE_BUST_BRIDGE_EXECUTE_V2.py`

**Submit gate:** `SUBMIT = False` — generation is blocked at the script level.
Set `SUBMIT = True` only when ASSET-BUILD-05 is authorised.

| Script parameter | Value |
|---|---|
| Model | juggernautXL_v8Rundiffusion.safetensors |
| IP-Adapter | ip-adapter_sdxl.safetensors (explicit) |
| CLIP Vision | clip_vision_g.safetensors (explicit) |
| ControlNet | diffusers_xl_canny_mid.safetensors |
| img2img base | MIKAGE_HELMET_FRONT_VIEW_3D_SOURCE_V1_ORTHO.png |
| ControlNet strength | 0.55 (start 0.0, end 0.85) |
| Sampler | dpmpp_2m / karras |
| Steps | 30 |
| CFG | 7.0 |
| Denoise | 0.65 (img2img) |
| Resolution | 768 × 1024 |
| Batch | 4 |
| Output dir | `D:\workspace\ComfyUI\MIKAGE_CANON\11_BUST_BRIDGE_CANDIDATES_V1\` |
| Workflow nodes | 24 |

---

## 6. Validation Result

```
[1] Source files:    ALL PRESENT (7 files)
[2] Uploads:         OK (ComfyUI input folder)
[3] Workflow build:  24 nodes
[4] Static validation:
      All node types confirmed present in ComfyUI object_info
      All node references resolve
      All required inputs present
      VALIDATION: PASS
[5] Submit gate:     SUBMIT=False — no generation
```

---

## 7. Known Remaining Limitation

No ControlNet depth model is installed. `diffusers_xl_canny_mid.safetensors` provides
edge structure but not volumetric depth cues. If canny alone is insufficient to suppress
environment drift after a generation attempt, the next repair would be to install an SDXL
depth ControlNet model.

---

## 8. Next Task

**ASSET-BUILD-05_GENERATE_BUST_BRIDGE_CANDIDATES_V2**

Steps for ASSET-BUILD-05:
1. Set `SUBMIT = True` in `MIKAGE_BUST_BRIDGE_EXECUTE_V2.py`
2. Run the script
3. Apply Quick-Pass Gate to all outputs (ASSET-BUILD-02 Section 8)
4. If outputs pass → prepare evidence package (ASSET-BUILD-02 Section 9)
5. If outputs fail → document violations, do not re-run without further repair

Rules for ASSET-BUILD-05:
- No canon approval
- No asset lock
- No production-ready claim
- No Phase 5
- No film / video / short / shotlist
- Outputs go to `D:\workspace\ComfyUI\MIKAGE_CANON\11_BUST_BRIDGE_CANDIDATES_V1\` only

---

## 9. Prohibited Actions Confirmed

- RENDER_EXECUTED: NO
- COMFYUI_SUBMITTED: NO
- CANON_APPROVED: NO
- ASSET_LOCKED: NO
- PRODUCTION_READY: NO
- PHASE5_STARTED: NO
- FILM_TASK_CREATED: NO
- SHOTLIST_CREATED: NO
