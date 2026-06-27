# ASSET-BUILD-06_EXTERNAL_GPU_API_EXECUTION_PACKET_V2

## Packet Header

```
PACKET_TYPE:       EXTERNAL_GPU_API_EXECUTION_PACKET
PACKET_VERSION:    V2
SUPERSEDES:        ASSET-BUILD-06_EXTERNAL_GPU_API_EXECUTION_PACKET_V1.md
TASK_ID:           ASSET-BUILD-06C_AMEND_EXECUTION_PACKET_WITH_REPAIRED_ANCHORS_NO_RENDER
AUDIT_SOURCE:      ASSET-BUILD-06B_AUDIT_BUST_BRIDGE_SOURCE_IMAGES_NO_RENDER_REPORT.md
DATE:              2026-05-12
STATUS:            READY_FOR_ASSET-BUILD-07_HUMAN_AUTHORISATION
CLOUD_PROVIDER:    RunPod / Vast.ai (operator choice)
EXTERNAL_API_CALLED: NO
API_KEY_COMMITTED:   NO
RENDER_EXECUTED:     NO
```

### V2 Changes vs V1 — Summary

| Node | V1 | V2 | Reason |
|---|---|---|---|
| Node 4 — img2img base | MIKAGE_HELMET_FRONT_VIEW_3D_SOURCE_V1_ORTHO.png | **MIKAGE_COMP_01A_HELMET_FACEPLATE_CLEAN_PASS.png** | V1 was near-zero contrast 3D blockout; ControlNet canny extracted ~zero edges |
| Node 10 — IPA anchor 0, weight 0.8 | MIKAGE_HELMET_FRONT_VIEW_3D_SOURCE_V1_ORTHO.png | **MIKAGE_COMP_01A_HELMET_FACEPLATE_CLEAN_PASS.png** | Same file, same reason |
| Node 11 — IPA anchor 1, weight 0.6 | MIKAGE_VOLUME_FIRST_3D_HELMET_SIDE_V1_ORTHO.png | **DROPPED** | Top-down camera angle, not a side profile; no acceptable side ortho exists |
| Node 21 — IPAdapterAdvanced (helmet side) | Connected to [20,0] | **DROPPED** | Node 11 dropped; Node 22 now connects to [20,0] |
| Node 22 — IPAdapterAdvanced (faceplate) | model: [21,0] | **model: [20,0]** | Chain repair after Node 21 drop |
| Node 40 — ImageScale resolution comment | "resize 2048×2048 → 768×1024" | **"resize input → 768×1024"** | COMP_01A is not 2048×2048; node parameters unchanged |
| IPA total active anchors | 6 | **5** | Dropped helmet side ortho anchor |

No other changes. All prompts, sampler settings, output spec, naming convention, cost cap,
and review gate are unchanged from V1.

---

## 1. Output Specification

```
OUTPUT_DIR_LOCAL:    D:\workspace\ComfyUI\MIKAGE_CANON\11_BUST_BRIDGE_CANDIDATES_V1\
OUTPUT_DIR_CLOUD:    [operator-provisioned cloud storage volume or S3 bucket]
FILENAME_PREFIX:     MIKAGE_BUST_BRIDGE_CAND_01_REVIEW_CANDIDATE_20260512
FILENAME_CONVENTION: MIKAGE_BUST_BRIDGE_CAND_[XX]_REVIEW_CANDIDATE_[DATE].png
RESOLUTION:          768 x 1024
BATCH_PER_RUN:       1 (four runs with different seeds = 4 candidates total)
```

**Forbidden tokens in filename:** `PASS · CANON · LOCKED · APPROVED · PRODUCTION · FINAL`

**Note:** `11_BUST_BRIDGE_CANDIDATES_V1\` already exists on disk. It contains one file
`test_minimal_00001_.png` which is a known FAILED_DO_NOT_USE Browser Run output
(documented in `04_EXECUTION_GATE_RULES.md` Section 2.1). Do not treat this as a
valid candidate. New outputs from this packet go into the same folder with correct
naming convention.

---

## 2. Candidate Naming — Four Seeds

| Run | Filename | Seed slot |
|---|---|---|
| 1 | `MIKAGE_BUST_BRIDGE_CAND_01_REVIEW_CANDIDATE_20260512.png` | SEED_A |
| 2 | `MIKAGE_BUST_BRIDGE_CAND_02_REVIEW_CANDIDATE_20260512.png` | SEED_B |
| 3 | `MIKAGE_BUST_BRIDGE_CAND_03_REVIEW_CANDIDATE_20260512.png` | SEED_C |
| 4 | `MIKAGE_BUST_BRIDGE_CAND_04_REVIEW_CANDIDATE_20260512.png` | SEED_D |

---

## 3. Anchor Images — V2 (REPAIRED)

### PRIMARY

| # | Local path | Role | IPA weight |
|---|---|---|---|
| 1 | `D:\workspace\ComfyUI\MIKAGE_CANON\10_COMPONENT_CANDIDATE_SET_V1\01_HELMET_FACEPLATE\MIKAGE_COMP_01A_HELMET_FACEPLATE_CLEAN_PASS.png` | img2img base + ControlNet canny + IPA anchor — clean faceplate front geometry | **0.8** |

**V2 change:** Replaces the near-black `MIKAGE_HELMET_FRONT_VIEW_3D_SOURCE_V1_ORTHO.png`.
The faceplate image provides the high-contrast front geometry the workflow needs.

### SECONDARY

| # | Local path | Role | IPA weight |
|---|---|---|---|
| 2 | `D:\workspace\ComfyUI\MIKAGE_CANON\10_COMPONENT_CANDIDATE_SET_V1\01_HELMET_FACEPLATE\MIKAGE_COMP_01A_HELMET_FACEPLATE_CLEAN_PASS.png` | Faceplate cleanness standard | **0.6** |
| 3 | `D:\workspace\ComfyUI\MIKAGE_CANON\10_COMPONENT_CANDIDATE_SET_V1\03_B4C_PORCELAIN_MATERIAL\MIKAGE_COMP_03A_B4C_PORCELAIN_PANEL_GAP_PASS.png` | Matte B4C porcelain armor material | 0.5 |
| 4 | `D:\workspace\ComfyUI\MIKAGE_CANON\10_COMPONENT_CANDIDATE_SET_V1\04_GRAPHENE_UNDERLAYER\MIKAGE_COMP_04A_GRAPHENE_UNDERLAYER_HEX_GAP_PASS.png` | Black graphene underlayer through gaps | 0.4 |

**V2 change:** Helmet side ortho (V1 anchor #2, weight 0.6) dropped. No acceptable true
side ortho exists on disk. All manual blockout and 3D ortho side views were audited and
rejected (top-down angle, broken geometry, or insufficient quality). The faceplate image
now runs at both 0.8 and 0.6 positions in the chain.

### TERTIARY

| # | Local path | Role | IPA weight |
|---|---|---|---|
| 5 | `D:\workspace\ComfyUI\MIKAGE_CANON\08_CHARACTER_REVIEW_CANDIDATES\MIKAGE_UNIFIED_KEY_VISUAL_V4_FROM_CLEAN_SOURCES_00001_.png` | Overall identity and aesthetic check | 0.3 |

### EXCLUDED — MUST NOT BE UPLOADED OR LOADED

```
NEVER LOAD:
  MIKAGE_HELMET_FRONT_VIEW_3D_SOURCE_V1_ORTHO.png    ← V1 primary, retired — near-zero contrast
  MIKAGE_VOLUME_FIRST_3D_HELMET_SIDE_V1_ORTHO.png    ← V1 side anchor, retired — wrong angle
  08B  — MIKAGE_COMP_08B_HELMET_BUST_NEGATIVE_SPACE_ALT_PASS_TECHNICAL.png
  Full-body candidate 001 (any variant)
  Controlled front canon repair V1
  Corrected full-body front V2
  Brutalist void V3
  Video / loop test frames
  Archived film source pack frames
  test_minimal_00001_.png (FAILED_DO_NOT_USE — wrong Browser Run output in output dir)
```

---

## 4. Positive Prompt

*(Unchanged from V1 — copy exactly)*

```
faceless armored helmet, sealed faceplate, no visor opening, no eyes, no nose, no mouth,
matte B4C porcelain armor plating, black graphene underlayer visible through panel gaps,
bust portrait, upper body crop, armored shoulders, structural neck collar,
helmet-to-shoulder armor plate continuity, panel gap seams,
matte armor surface, restrained surface detail, controlled panel geometry,
dark underlayer through gaps, no gloss, no chrome, no reflections,
neutral front-facing pose, slight three-quarter angle acceptable,
dark neutral background, near-black background, flat diffuse lighting,
consistency review framing, no scene, no environment, no action staging
```

---

## 5. Negative Prompt

*(Unchanged from V1 — copy exactly)*

```
eyes, nose, mouth, lips, teeth, tongue, face, skin, face reveal,
open visor, cracked faceplate, visor glow, eye glow, eye slit, expressive helmet,
anime, manga, cartoon, stylized face, bishonen, bishojo, moe, chibi,
fashion portrait, glamour shot, beauty lighting, softcore, pinup,
feminine drift, masculine drift, gender coded, ornamental armor, decorative engraving,
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

## 6. Generation Settings

*(Unchanged from V1)*

```
Model:             juggernautXL_v8Rundiffusion.safetensors  (SDXL)
IP-Adapter model:  ip-adapter_sdxl.safetensors
CLIP Vision:       clip_vision_g.safetensors
ControlNet:        diffusers_xl_canny_mid.safetensors
ControlNet strength: 0.55  (start 0.0, end 0.85)
Sampler:           dpmpp_2m
Scheduler:         karras
Steps:             25
CFG scale:         7.0
Denoise:           0.65
Resolution:        768 x 1024
Batch per run:     1
Runs:              4
img2img base:      MIKAGE_COMP_01A_HELMET_FACEPLATE_CLEAN_PASS.png (resized to 768×1024)
```

---

## 7. ComfyUI API Workflow — Node Map V2

**V2 changes: Node 4 image, Node 10 image, Node 11 DROPPED, Node 21 DROPPED,
Node 22 model input updated, Node 40 comment updated.**

```
Node  1 — CheckpointLoaderSimple
            ckpt_name: juggernautXL_v8Rundiffusion.safetensors
            outputs: [0]=MODEL [1]=CLIP [2]=VAE

Node  2 — CLIPTextEncode  (positive)
            text: <Section 4>
            clip: [1,1]

Node  3 — CLIPTextEncode  (negative)
            text: <Section 5>
            clip: [1,1]

Node  4 — LoadImage  (img2img base — faceplate clean)          ← V2 CHANGED
            image: MIKAGE_COMP_01A_HELMET_FACEPLATE_CLEAN_PASS.png
            outputs: [0]=IMAGE

Node 40 — ImageScale  (resize input → 768×1024)               ← V2 comment updated
            image: [4,0]
            upscale_method: lanczos
            width: 768
            height: 1024
            crop: disabled
            outputs: [0]=IMAGE

Node  5 — VAEEncode
            pixels: [40,0]
            vae: [1,2]
            outputs: [0]=LATENT

Node  6 — IPAdapterModelLoader
            ipadapter_file: ip-adapter_sdxl.safetensors

Node  7 — CLIPVisionLoader
            clip_name: clip_vision_g.safetensors

Node  8 — ControlNetLoader
            control_net_name: diffusers_xl_canny_mid.safetensors

Node  9 — ControlNetApplyAdvanced
            positive:      [2,0]
            negative:      [3,0]
            control_net:   [8,0]
            image:         [40,0]   ← resized faceplate (V2)
            strength:      0.55
            start_percent: 0.0
            end_percent:   0.85

Node 10 — LoadImage  (IPA anchor 0 — faceplate, weight 0.8)   ← V2 CHANGED
            image: MIKAGE_COMP_01A_HELMET_FACEPLATE_CLEAN_PASS.png

Node 11 — DROPPED                                              ← V2 REMOVED (was: helmet side)

Node 12 — LoadImage  (IPA anchor 2 — faceplate, weight 0.6)
            image: MIKAGE_COMP_01A_HELMET_FACEPLATE_CLEAN_PASS.png

Node 13 — LoadImage  (IPA anchor 3 — B4C porcelain, weight 0.5)
            image: MIKAGE_COMP_03A_B4C_PORCELAIN_PANEL_GAP_PASS.png

Node 14 — LoadImage  (IPA anchor 4 — graphene, weight 0.4)
            image: MIKAGE_COMP_04A_GRAPHENE_UNDERLAYER_HEX_GAP_PASS.png

Node 15 — LoadImage  (IPA anchor 5 — style check, weight 0.3)
            image: MIKAGE_UNIFIED_KEY_VISUAL_V4_FROM_CLEAN_SOURCES_00001_.png

Node 20 — IPAdapterAdvanced  (faceplate primary, weight 0.8)
            model:          [1,0]
            ipadapter:      [6,0]
            clip_vision:    [7,0]
            image:          [10,0]
            weight:         0.8
            weight_type:    linear
            combine_embeds: concat
            start_at:       0.0
            end_at:         1.0
            embeds_scaling: V only
            outputs: [0]=MODEL

Node 21 — DROPPED                                              ← V2 REMOVED (was: side IPA)

Node 22 — IPAdapterAdvanced  (faceplate secondary, weight 0.6)
            model: [20,0]        ← V2 CHANGED from [21,0]
            image: [12,0]
            weight: 0.6

Node 23 — IPAdapterAdvanced  (B4C porcelain, weight 0.5)
            model: [22,0]  image: [13,0]  weight: 0.5

Node 24 — IPAdapterAdvanced  (graphene, weight 0.4)
            model: [23,0]  image: [14,0]  weight: 0.4

Node 25 — IPAdapterAdvanced  (style check, weight 0.3)
            model: [24,0]  image: [15,0]  weight: 0.3
            outputs: [0]=MODEL  ← feeds KSampler

Node 30 — KSampler
            model:        [25,0]
            positive:     [9,0]
            negative:     [9,1]
            latent_image: [5,0]
            seed:         <SEED_A / B / C / D per run>
            steps:        25
            cfg:          7.0
            sampler_name: dpmpp_2m
            scheduler:    karras
            denoise:      0.65

Node 31 — VAEDecode
            samples: [30,0]
            vae:     [1,2]

Node 32 — SaveImage
            images:          [31,0]
            filename_prefix: MIKAGE_BUST_BRIDGE_CAND_01_REVIEW_CANDIDATE_20260512
```

**Total nodes: 24** (was 26 — two nodes dropped)

---

## 8. Pre-Job Verification Checklist V2

```
[ ] ComfyUI running and reachable on external instance
[ ] MIKAGE_COMP_01A_HELMET_FACEPLATE_CLEAN_PASS.png uploaded to external instance input/
[ ] MIKAGE_COMP_03A_B4C_PORCELAIN_PANEL_GAP_PASS.png uploaded
[ ] MIKAGE_COMP_04A_GRAPHENE_UNDERLAYER_HEX_GAP_PASS.png uploaded
[ ] MIKAGE_UNIFIED_KEY_VISUAL_V4_FROM_CLEAN_SOURCES_00001_.png uploaded
[ ] Total uploads: 4 files (NOT 6 — helmet side ortho dropped, dark front ortho retired)
[ ] Checkpoint juggernautXL_v8Rundiffusion.safetensors present
[ ] ip-adapter_sdxl.safetensors present in models/ipadapter/
[ ] clip_vision_g.safetensors present in models/clip_vision/
[ ] diffusers_xl_canny_mid.safetensors present in models/controlnet/
[ ] ComfyUI_IPAdapter_plus custom node installed
[ ] IPAdapterAdvanced node type confirmed available
[ ] Node 11 and Node 21 ABSENT from workflow (confirm no side anchor loaded)
[ ] Node 22 model input wired to [20,0] NOT [21,0]
[ ] Output folder exists: 11_BUST_BRIDGE_CANDIDATES_V1/
[ ] Filename prefix confirmed per Section 2
[ ] Excluded assets NOT uploaded (see Section 3 exclusion list — includes retired V1 anchors)
[ ] Positive prompt matches Section 4 verbatim
[ ] Negative prompt matches Section 5 verbatim
[ ] Browser Run NOT used — API submission only
```

---

## 9. Post-Job Protocol

*(Unchanged from V1)*

```
[ ] Download output PNG to: D:\workspace\ComfyUI\MIKAGE_CANON\11_BUST_BRIDGE_CANDIDATES_V1\
[ ] Rename to match naming convention if cloud appended extra tokens
[ ] Record seed used
[ ] Verify resolution is 768×1024
[ ] Apply Quick-Pass Gate (review gate document)
[ ] PASS: retain as REVIEW_CANDIDATE
[ ] FAIL: mark FAILED_DO_NOT_USE; do not retry without repair task
```

---

## 10. Stop Rules

*(Unchanged from V1)*

```
STOP — Facial anatomy visible
STOP — Anime / fashion / glamour drift not eliminable by prompt
STOP — Any excluded asset loaded
STOP — Output saved to wrong directory
STOP — Output filename contains forbidden token
STOP — Output submitted as production-ready or Phase 5 entry
STOP — Phase 5 declared started
STOP — Film, video, short, or shotlist task created from output
STOP — External API called without human authorisation
STOP — API key committed to repository
```

---

## 11. Status Flags

```
PACKET_STATUS:            READY_FOR_ASSET-BUILD-07_HUMAN_AUTHORISATION
EXTERNAL_API_CALLED:      NO
API_KEY_COMMITTED:        NO
CANON_APPROVAL_CREATED:   NO
ASSET_LOCK_CREATED:       NO
PRODUCTION_READY_CLAIMED: NO
PHASE5_STARTED:           NO
V1_STATUS:                SUPERSEDED — do not use V1 for job submission
```
