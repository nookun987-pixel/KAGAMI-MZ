# SESSION_RESUME_NOTE_20260601

Purpose: resume context in a NEW chat without re-deriving. Read this + `docs/handoff/00_LATEST_CODEX_HANDOFF.md` (pointer at bottom) first.

LANE: CHARACTER_CAST_LANE / Mikage. All work this session = REFERENCE ONLY (no canon-lock, no asset-lock, no film/video/short/shotlist). Renders were operator-run on RunPod (NOT Claude/Cowork).

## 1. What got done today (2026-06-01)

Started from "only helmet/bust existed". Built, in order:
1. Phase 5 planning + initiation (no-render): `MIKAGE_PHASE5_UPPER_BODY_CONSISTENCY_PLANNING_V1.md`, `MIKAGE_PHASE5_INITIATION_INTERNAL_NO_RENDER_V1.md` (PHASE5_STARTED = internal no-render scope only).
2. Render-request spec + RunPod ComfyUI execution packet: `MIKAGE_UPPER_BODY_CONTINUITY_CANDIDATE_RENDER_REQUEST_SPEC_V1.md`, `..._RUNPOD_COMFYUI_EXECUTION_PACKET_V1.md`.
3. **Upper-body 4-view faceless reference set** (color-normalized) — eval: `PHASE5_UPPER_BODY_CONTINUITY_CANDIDATE_V2_EVALUATION_V1.md` §12. Files in canon: V6SET_FRONT_NORM, V6SET_THREEQ_NORM, V5CN_SIDE_76_NORM, V5CN_BACK_82_NORM.
4. **Full-body faceless candidate**: `MIKAGE_FULLBODY_V3CN_401_00001_.png` = INCLUDE_AS_PHASE4_REFERENCE — eval: `PHASE5_MIKAGE_FULLBODY_CONTINUITY_CANDIDATE_V1_EVALUATION.md`.
5. **Zenith Blade spec**: `MIKAGE_ZENITH_BLADE_SPEC_V1.md` (3 modes + operator-clarified compact-idle mini form + open flags).

All committed/pushed to origin/main (last commits: d6f51a2, 83e5137, 107a6a9).

Canon folder with adopted refs: `D:\workspace\ComfyUI\MIKAGE_CANON\10_COMPONENT_CANDIDATE_SET_V1\10\` (holds 401 full-body + 4 _NORM upper-body + old V2 00001/00002 superseded).

## 2. THE REUSABLE RECIPE (most important — this is what makes future characters fast)

Problem: RealVisXL has a strong human-face prior → free txt2img keeps adding faces/visors; high IPAdapter weight locks framing to the anchor's crop.

What WORKS:
- **Faceless control** = ControlNet **canny** locked from an already-clean sealed image (canny of a blank head has no eye edges → model can't paint a face). Front + 3/4 reliable; pure side/back profiles still leak faces (toolchain ceiling — would need 3D for perfect).
- **Full body without losing identity** = canny **pose-lock** from a clean full-body standing image (strength ~0.45, pose/proportion only) + **IPAdapter weight ~0.8** from a faceless reference (holds Mikage identity/material). This beat the framing-vs-identity trade-off.
- **Tone consistency across views** = PIL white-balance normalize (script: see below) — deterministic, free.
- Anchoring to a FACELESS image (not one with any face hint) reduces face leakage.

Stack: RealVisXL V5.0 + ip-adapter_sdxl + clip_vision_g + diffusers_xl_canny_mid; ComfyUI_IPAdapter_plus node; dpmpp_2m / karras, ~34 steps, cfg 7, 832×1216 (or 768×1344 for full body). Native `Canny` node + `ControlNetApplyAdvanced`.

Working render scripts saved: `tools/upper_body_inputs/render_v3_upper_body_4views.py` (+ the inline python in chat history).

## 3. RunPod setup recipe (so next session is fast)

POD: ComfyUI template `runpod/comfyui:latest`, GPU 24GB (RTX A5000 $0.27 / L4 / A40 / 4090 — pick any "Low/Medium/High", "Unavailable"=skip). Disk: Container 40GB + Volume 20GB.
**NEXT TIME USE A NETWORK VOLUME** (not Volume disk) so the 13GB models persist across terminate → no re-download.

ComfyUI path on this template: `/workspace/runpod-slim/ComfyUI`. Use `python3` (NOT `python`). `unzip` missing → use `python3 -c "import zipfile; ..."`.

One-shot setup block (kills template comfy that autostarts without our node, installs node, downloads 4 models, starts ComfyUI):
```
COMFY=/workspace/runpod-slim/ComfyUI
cd "$COMFY/custom_nodes" && (git clone https://github.com/cubiq/ComfyUI_IPAdapter_plus 2>/dev/null || echo node_exists)
mkdir -p "$COMFY/models/checkpoints" "$COMFY/models/ipadapter" "$COMFY/models/clip_vision" "$COMFY/models/controlnet"
wget -c -O "$COMFY/models/checkpoints/realvisxlV50.safetensors" "https://huggingface.co/SG161222/RealVisXL_V5.0/resolve/main/RealVisXL_V5.0_fp16.safetensors"
wget -c -O "$COMFY/models/ipadapter/ip-adapter_sdxl.safetensors" "https://huggingface.co/h94/IP-Adapter/resolve/main/sdxl_models/ip-adapter_sdxl.safetensors"
wget -c -O "$COMFY/models/clip_vision/clip_vision_g.safetensors" "https://huggingface.co/h94/IP-Adapter/resolve/main/sdxl_models/image_encoder/model.safetensors"
wget -c -O "$COMFY/models/controlnet/diffusers_xl_canny_mid.safetensors" "https://huggingface.co/lllyasviel/sd_control_collection/resolve/main/diffusers_xl_canny_mid.safetensors"
pkill -9 -f "main.py"; sleep 5
cd "$COMFY"; nohup python3 main.py --listen 0.0.0.0 --port 8188 --enable-cors-header > /workspace/comfy.log 2>&1 &
sleep 30
curl -s -o /dev/null -w "PORT=%{http_code}\n" http://127.0.0.1:8188/
python3 -c "import json,urllib.request; print('IPADAPTER_COUNT=',len([k for k in json.load(urllib.request.urlopen('http://127.0.0.1:8188/object_info')) if 'ipadapter' in k.lower()]))"
```
Expect PORT=200, IPADAPTER_COUNT>0. ComfyUI UI = `https://<podid>-8188.proxy.runpod.net/`. Optional speedup: `aria2c -x16` for downloads.

Color-normalize script (unify white balance across chosen images):
```
python3 - <<'PY'
from PIL import Image; import numpy as np, os
out="/workspace/runpod-slim/ComfyUI/output"
for f in ["<file1>.png","<file2>.png"]:
 p=os.path.join(out,f); im=np.asarray(Image.open(p).convert("RGB")).astype("float32")
 lum=im.mean(2); wp=im[lum>=np.percentile(lum,92)].mean(0)
 Image.fromarray(np.clip(im*(238.0/np.clip(wp,1,None)),0,255).astype("uint8")).save(p.replace(".png","_NORM.png"))
PY
```

## 4. OPEN ITEMS — next session (CURRENT_NEXT_TASK)

For "Mikage complete":
1. **Zenith Blade asset** — render per `MIKAGE_ZENITH_BLADE_SPEC_V1.md`: compact-idle (mini) form + deployed full 350kg slab + 3 modes (Silent / Side-channel Pulse red / Thermal Overload crimson). Make as a SEPARATE asset; don't prompt-inject into the figure.
2. **Operator must confirm 3 blade flags**: (a) "Tri-phase Blade" (Drive) = same as "Zenith Blade"? (b) uploaded blueprint slimmer/ornate = on-canon or drift? (c) lock compact-idle into canon + supply its geometry/blueprint.
3. **Optional**: full-body proportion refine (401 is stocky/short-legged); pixel-clean orthographic side/back would need a 3D/Blender pass (out of Cowork scope).
4. Then the cast lane priority continues: Commander Lyre, LORA, supporting cast (briefs already exist in `docs/automation/render_briefs/`).

## 5. Governance reminders (unchanged)

No canon-lock, no asset-lock, no production-ready label, no film/video/short/shotlist, no motion render, no ComfyUI/Blender BY Claude. Claude prepares briefs/scripts + scores; operator runs renders on RunPod. Everything to date = INCLUDE_AS_PHASE4_REFERENCE / REVIEW_CANDIDATE only.

POD STATUS: TERMINATED (Volume disk → models gone; re-run §3 setup next time, ideally with a Network Volume).
