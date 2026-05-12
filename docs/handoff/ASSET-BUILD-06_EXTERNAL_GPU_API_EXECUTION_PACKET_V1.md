# ASSET-BUILD-06_EXTERNAL_GPU_API_EXECUTION_PACKET_V1

## Packet Header

```
PACKET_TYPE:       EXTERNAL_GPU_API_EXECUTION_PACKET
PACKET_VERSION:    V1
TASK_ID:           ASSET-BUILD-06_PREPARE_EXTERNAL_GPU_API_BUST_BRIDGE_HANDOFF_NO_RENDER
LOCAL_PACKET_REF:  docs/handoff/ASSET-BUILD-02_BUST_BRIDGE_LOCAL_COMFYUI_EXECUTION_PACKET_V1.md
DATE:              2026-05-12
STATUS:            PREPARED_NOT_EXECUTED — requires human authorisation before ASSET-BUILD-07 submit
CLOUD_PROVIDER:    RunPod / Vast.ai (operator choice)
EXTERNAL_API_CALLED: NO
API_KEY_COMMITTED:   NO
RENDER_EXECUTED:     NO
```

This packet is a complete, self-contained execution specification for running the Mikage
bust bridge candidate generation on an external GPU API instance. It incorporates all
patches from the dirty V2 script and resets them into a clean, formally specified workflow.

No generation may occur from this packet until ASSET-BUILD-07 is authorised by a human.

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

Output from a Browser Run or any non-packet-compliant source is automatically
FAILED_DO_NOT_USE regardless of content.

---

## 2. Candidate Naming — Four Seeds

Run the workflow four times with these four seed slots. Record actual seed used per run.

| Run | Filename | Seed slot |
|---|---|---|
| 1 | `MIKAGE_BUST_BRIDGE_CAND_01_REVIEW_CANDIDATE_20260512.png` | SEED_A (operator-chosen or random) |
| 2 | `MIKAGE_BUST_BRIDGE_CAND_02_REVIEW_CANDIDATE_20260512.png` | SEED_B |
| 3 | `MIKAGE_BUST_BRIDGE_CAND_03_REVIEW_CANDIDATE_20260512.png` | SEED_C |
| 4 | `MIKAGE_BUST_BRIDGE_CAND_04_REVIEW_CANDIDATE_20260512.png` | SEED_D |

Record all four seeds in the review report (template in
`ASSET-BUILD-06_EXTERNAL_GPU_API_OUTPUT_REVIEW_GATE_V1.md`).

---

## 3. Anchor Images — Required Uploads

All six anchor images must be uploaded to the external ComfyUI instance input folder
before workflow submission. Paths are absolute local references; operator must upload
each to the cloud instance.

### PRIMARY (load first, highest weight)

| # | Local path | Role | IP-Adapter weight |
|---|---|---|---|
| 1 | `D:\workspace\ComfyUI\MIKAGE_CANON\08_CHARACTER_REVIEW_CANDIDATES\MIKAGE_HELMET_FRONT_VIEW_3D_SOURCE_V1_ORTHO.png` | img2img base + ControlNet canny + IPA anchor — helmet front geometry | 0.8 |
| 2 | `D:\workspace\ComfyUI\MIKAGE_CANON\08_CHARACTER_REVIEW_CANDIDATES\MIKAGE_VOLUME_FIRST_3D_HELMET_SIDE_V1_ORTHO.png` | Helmet volume / side silhouette | 0.6 |

### SECONDARY

| # | Local path | Role | IP-Adapter weight |
|---|---|---|---|
| 3 | `D:\workspace\ComfyUI\MIKAGE_CANON\10_COMPONENT_CANDIDATE_SET_V1\01_HELMET_FACEPLATE\MIKAGE_COMP_01A_HELMET_FACEPLATE_CLEAN_PASS.png` | Faceplate cleanness standard | 0.6 |
| 4 | `D:\workspace\ComfyUI\MIKAGE_CANON\10_COMPONENT_CANDIDATE_SET_V1\03_B4C_PORCELAIN_MATERIAL\MIKAGE_COMP_03A_B4C_PORCELAIN_PANEL_GAP_PASS.png` | Matte B4C porcelain armor material | 0.5 |
| 5 | `D:\workspace\ComfyUI\MIKAGE_CANON\10_COMPONENT_CANDIDATE_SET_V1\04_GRAPHENE_UNDERLAYER\MIKAGE_COMP_04A_GRAPHENE_UNDERLAYER_HEX_GAP_PASS.png` | Black graphene underlayer through gaps | 0.4 |

### TERTIARY (style check only — lowest weight)

| # | Local path | Role | IP-Adapter weight |
|---|---|---|---|
| 6 | `D:\workspace\ComfyUI\MIKAGE_CANON\08_CHARACTER_REVIEW_CANDIDATES\MIKAGE_UNIFIED_KEY_VISUAL_V4_FROM_CLEAN_SOURCES_00001_.png` | Overall identity and aesthetic check | 0.3 |

### EXCLUDED — MUST NOT BE UPLOADED OR LOADED

```
NEVER LOAD:
  08B  — MIKAGE_COMP_08B_HELMET_BUST_NEGATIVE_SPACE_ALT_PASS_TECHNICAL.png
  Full-body candidate 001 (any variant)
  Controlled front canon repair V1
  Corrected full-body front V2
  Brutalist void V3
  Video / loop test frames
  Archived film source pack frames
  test_minimal_00001_.png (wrong Browser Run output)
```

---

## 4. Positive Prompt

Copy exactly. Do not omit any line.

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

Copy exactly. Do not omit any line.

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

```
Model:             juggernautXL_v8Rundiffusion.safetensors  (SDXL)
IP-Adapter model:  ip-adapter_sdxl.safetensors              (explicit load)
CLIP Vision:       clip_vision_g.safetensors                (explicit load)
ControlNet:        diffusers_xl_canny_mid.safetensors
ControlNet strength: 0.55  (start 0.0, end 0.85)
Sampler:           dpmpp_2m
Scheduler:         karras
Steps:             25
CFG scale:         7.0
Denoise:           0.65  (img2img — preserves helmet geometry)
Resolution:        768 x 1024
Batch per run:     1
Runs:              4 (one per seed)
img2img base:      MIKAGE_HELMET_FRONT_VIEW_3D_SOURCE_V1_ORTHO.png (resized to 768x1024)
```

---

## 7. ComfyUI API Workflow — Node Map

This workflow is structurally validated by inspection against the ComfyUI node schema
documented in ASSET-BUILD-04. The external GPU instance must confirm all node types
are available before submitting (Section 8 pre-job checklist).

```
Node  1 — CheckpointLoaderSimple
            ckpt_name: juggernautXL_v8Rundiffusion.safetensors
            outputs: [0]=MODEL [1]=CLIP [2]=VAE

Node  2 — CLIPTextEncode  (positive)
            text: <Section 4 positive prompt>
            clip: [1,1]
            outputs: [0]=CONDITIONING

Node  3 — CLIPTextEncode  (negative)
            text: <Section 5 negative prompt>
            clip: [1,1]
            outputs: [0]=CONDITIONING

Node  4 — LoadImage  (img2img base — helmet front 3D ortho)
            image: MIKAGE_HELMET_FRONT_VIEW_3D_SOURCE_V1_ORTHO.png
            outputs: [0]=IMAGE

Node 40 — ImageScale  (resize 2048x2048 → 768x1024)
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
            outputs: [0]=IPADAPTER

Node  7 — CLIPVisionLoader
            clip_name: clip_vision_g.safetensors
            outputs: [0]=CLIP_VISION

Node  8 — ControlNetLoader
            control_net_name: diffusers_xl_canny_mid.safetensors
            outputs: [0]=CONTROL_NET

Node  9 — ControlNetApplyAdvanced
            positive:      [2,0]
            negative:      [3,0]
            control_net:   [8,0]
            image:         [40,0]   ← resized helmet front
            strength:      0.55
            start_percent: 0.0
            end_percent:   0.85
            outputs: [0]=CONDITIONING(+) [1]=CONDITIONING(-)

Node 10 — LoadImage  (IPA anchor 0 — helmet front, weight 0.8)
            image: MIKAGE_HELMET_FRONT_VIEW_3D_SOURCE_V1_ORTHO.png

Node 11 — LoadImage  (IPA anchor 1 — helmet side, weight 0.6)
            image: MIKAGE_VOLUME_FIRST_3D_HELMET_SIDE_V1_ORTHO.png

Node 12 — LoadImage  (IPA anchor 2 — faceplate, weight 0.6)
            image: MIKAGE_COMP_01A_HELMET_FACEPLATE_CLEAN_PASS.png

Node 13 — LoadImage  (IPA anchor 3 — B4C porcelain, weight 0.5)
            image: MIKAGE_COMP_03A_B4C_PORCELAIN_PANEL_GAP_PASS.png

Node 14 — LoadImage  (IPA anchor 4 — graphene, weight 0.4)
            image: MIKAGE_COMP_04A_GRAPHENE_UNDERLAYER_HEX_GAP_PASS.png

Node 15 — LoadImage  (IPA anchor 5 — style check, weight 0.3)
            image: MIKAGE_UNIFIED_KEY_VISUAL_V4_FROM_CLEAN_SOURCES_00001_.png

Node 20 — IPAdapterAdvanced  (helmet front, weight 0.8)
            model:          [1,0]    ← base checkpoint MODEL
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

Node 21 — IPAdapterAdvanced  (helmet side, weight 0.6)
            model:      [20,0]
            (ipadapter/clip_vision/weight_type same as above)
            image:  [11,0]
            weight: 0.6

Node 22 — IPAdapterAdvanced  (faceplate, weight 0.6)
            model: [21,0]  image: [12,0]  weight: 0.6

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
            outputs: [0]=LATENT

Node 31 — VAEDecode
            samples: [30,0]
            vae:     [1,2]
            outputs: [0]=IMAGE

Node 32 — SaveImage
            images:          [31,0]
            filename_prefix: MIKAGE_BUST_BRIDGE_CAND_01_REVIEW_CANDIDATE_20260512
```

Total nodes: 26. All node types confirmed present in ComfyUI 0.19.0.

---

## 8. Pre-Job Verification Checklist

Before submitting the workflow on the external GPU instance:

```
[ ] ComfyUI running and reachable on external instance
[ ] All 6 anchor images uploaded to external instance input folder
[ ] Checkpoint juggernautXL_v8Rundiffusion.safetensors present
[ ] ip-adapter_sdxl.safetensors present in models/ipadapter/
[ ] clip_vision_g.safetensors present in models/clip_vision/
[ ] diffusers_xl_canny_mid.safetensors present in models/controlnet/
[ ] ComfyUI_IPAdapter_plus custom node installed and loaded
[ ] IPAdapterAdvanced node type confirmed available in object_info
[ ] CLIPVisionLoader node type confirmed available
[ ] IPAdapterModelLoader node type confirmed available
[ ] ImageScale node type confirmed available
[ ] ControlNetApplyAdvanced node type confirmed available
[ ] Output folder exists and is writable on external instance
[ ] Filename prefix confirmed: MIKAGE_BUST_BRIDGE_CAND_0[N]_REVIEW_CANDIDATE_20260512
[ ] No excluded assets uploaded or loaded (Section 3 exclusion list)
[ ] Positive prompt matches Section 4 verbatim
[ ] Negative prompt matches Section 5 verbatim
[ ] Browser Run NOT used — workflow submitted via script or API only
```

---

## 9. Post-Job Protocol

After each of the four runs:

```
[ ] Download output PNG from cloud instance to local:
    D:\workspace\ComfyUI\MIKAGE_CANON\11_BUST_BRIDGE_CANDIDATES_V1\
[ ] Rename file to match naming convention if cloud instance appended extra tokens
[ ] Record seed used
[ ] Verify resolution is 768x1024
[ ] Apply Quick-Pass Gate (7 checks — see review gate document)
[ ] If PASS: retain as REVIEW_CANDIDATE; prepare evidence package
[ ] If FAIL: mark FAILED_DO_NOT_USE; do not retry without repair task
```

---

## 10. Stop Rules

Stop immediately if any of the following occurs:

```
STOP — Facial anatomy visible in any output (eyes, nose, mouth, skin)
STOP — Anime / fashion / glamour drift present and not eliminable by prompt
STOP — Any excluded asset was loaded in the workflow
STOP — Output saved to wrong directory
STOP — Output filename contains: PASS, CANON, APPROVED, LOCKED, PRODUCTION, FINAL
STOP — Output submitted as production-ready or Phase 5 entry
STOP — Phase 5 declared started
STOP — Film, video, short, or shotlist task created from any output
STOP — External API called without human authorisation
STOP — API key committed to repository
```

---

## 11. Status Flags

```
PACKET_STATUS:           PREPARED_NOT_EXECUTED
EXTERNAL_API_CALLED:     NO
API_KEY_COMMITTED:       NO
CANON_APPROVAL_CREATED:  NO
ASSET_LOCK_CREATED:      NO
PRODUCTION_READY_CLAIMED: NO
PHASE5_STARTED:          NO
```
