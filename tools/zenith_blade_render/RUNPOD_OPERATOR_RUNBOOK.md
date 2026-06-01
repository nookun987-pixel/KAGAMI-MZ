# ZENITH BLADE — RUNPOD OPERATOR RUNBOOK (copy-paste, A→Z)

You only do 2 manual things: **rent the pod** and **push the repo to GitHub once**. Everything else is paste-and-go. The pod downloads the models, the control images, and the render script by itself.

Outputs = 9 review-candidate PNGs (P1/P2/P3 × 3 seeds). These are REVIEW-CANDIDATE only — bring them back to Cowork for scoring; nothing is auto-canon/locked.

Prepared for you (already in the repo):
- Control images: `tools/zenith_blade_render/inputs/ZBLADE_CTRL_P1.png` (closed block) + `ZBLADE_CTRL_OPEN.png` (shell open)
- Render script: `tools/zenith_blade_render/render_zenith_blade_p1p2p3.py`

---

## STEP 0 — Push the repo (on your Windows, once)
So the pod can pull the images + script:
```
git add tools/zenith_blade_render/ docs/handoff/ design/zenith_blade_clean_v1/
git commit -m "Zenith Blade render kit (P1/P2/P3) + locked specs/blueprints"
git push origin main
```

## STEP 1 — Rent the RunPod pod
- Template: **ComfyUI** (any "ComfyUI" community template). 
- GPU: **24 GB** — RTX 4090 / A5000 / 3090 (pick any "Low/Medium/High"; skip "Unavailable").
- Disk: Container 40 GB. **Add a Network Volume 20 GB** (so the 13 GB models survive a restart — saves re-downloading next time).
- Start the pod → open its **Web Terminal** (RunPod console → your pod → "Connect" → "Start Web Terminal" / "Connect to terminal").

## STEP 2 — Paste this ONE block (setup: models + node + start ComfyUI)
Paste the whole block into the web terminal and press Enter. Wait ~3–6 min (downloads ~13 GB). It prints `PORT=200` when ready.
```
COMFY=/workspace/runpod-slim/ComfyUI; [ -d "$COMFY" ] || COMFY=/workspace/ComfyUI
cd "$COMFY/custom_nodes" && (git clone https://github.com/cubiq/ComfyUI_IPAdapter_plus 2>/dev/null || echo node_ok)
mkdir -p "$COMFY/models/checkpoints" "$COMFY/models/ipadapter" "$COMFY/models/clip_vision" "$COMFY/models/controlnet"
wget -c -O "$COMFY/models/checkpoints/realvisxlV50.safetensors" "https://huggingface.co/SG161222/RealVisXL_V5.0/resolve/main/RealVisXL_V5.0_fp16.safetensors"
wget -c -O "$COMFY/models/ipadapter/ip-adapter_sdxl.safetensors" "https://huggingface.co/h94/IP-Adapter/resolve/main/sdxl_models/ip-adapter_sdxl.safetensors"
wget -c -O "$COMFY/models/clip_vision/clip_vision_g.safetensors" "https://huggingface.co/h94/IP-Adapter/resolve/main/sdxl_models/image_encoder/model.safetensors"
wget -c -O "$COMFY/models/controlnet/diffusers_xl_canny_mid.safetensors" "https://huggingface.co/lllyasviel/sd_control_collection/resolve/main/diffusers_xl_canny_mid.safetensors"
pkill -9 -f "main.py"; sleep 5
cd "$COMFY"; nohup python3 main.py --listen 0.0.0.0 --port 8188 --enable-cors-header > /workspace/comfy.log 2>&1 &
sleep 30
curl -s -o /dev/null -w "PORT=%{http_code}\n" http://127.0.0.1:8188/
```
Expect `PORT=200`. (If `PORT=000`, wait 20s and re-run just the last two lines.)

## STEP 3 — Paste this block (fetch control images + script from GitHub, then RUN)
Replace `main` with your branch if different. This pulls the 2 control images into ComfyUI `input/`, the script into `/workspace/`, then renders all 9 candidates.
```
COMFY=/workspace/runpod-slim/ComfyUI; [ -d "$COMFY" ] || COMFY=/workspace/ComfyUI
RAW=https://raw.githubusercontent.com/nookun987-pixel/KAGAMI-MZ/main/tools/zenith_blade_render
wget -O "$COMFY/input/ZBLADE_CTRL_P1.png"   "$RAW/inputs/ZBLADE_CTRL_P1.png"
wget -O "$COMFY/input/ZBLADE_CTRL_OPEN.png" "$RAW/inputs/ZBLADE_CTRL_OPEN.png"
wget -O /workspace/render_zenith_blade_p1p2p3.py "$RAW/render_zenith_blade_p1p2p3.py"
cd "$COMFY" && python3 /workspace/render_zenith_blade_p1p2p3.py
```
It prints `queued ...` then `SAVED ...` for each image, then `DONE`. Takes ~3–6 min total.

## STEP 4 — Get the images out
The 9 PNGs are in `$COMFY/output/` named `MIKAGE_ZENITH_BLADE_P1/P2/P3_REVIEW_CANDIDATE_20260602_*.png`.
- Easiest: open the ComfyUI UI at `https://<YOUR-POD-ID>-8188.proxy.runpod.net/` → the gallery shows outputs → right-click → save. (Pod ID is in the RunPod console.)
- Or zip + list paths to download via the RunPod file browser:
```
cd "$COMFY/output" && ls -1 MIKAGE_ZENITH_BLADE_P*_20260602_* && zip -j /workspace/zenith_out.zip MIKAGE_ZENITH_BLADE_P*_20260602_*.png && echo "ZIP: /workspace/zenith_out.zip"
```
Download `/workspace/zenith_out.zip` from the RunPod file manager, drop the PNGs into a folder, and tell me the path — I'll score them per phase.

## STEP 5 — Terminate the pod
RunPod console → your pod → **Terminate** (stop billing). With the Network Volume, models persist for next time.

---

## If something fails (quick fixes)
- `PORT=000` → ComfyUI still starting: `sleep 20; curl -s -o /dev/null -w "PORT=%{http_code}\n" http://127.0.0.1:8188/`
- Node missing / `ControlNetApplyAdvanced` error → it's a core node, should exist; restart: `cd "$COMFY"; pkill -9 -f main.py; sleep 4; nohup python3 main.py --listen 0.0.0.0 --port 8188 --enable-cors-header > /workspace/comfy.log 2>&1 &`
- `wget` 404 on the GitHub files → you haven't pushed STEP 0, or your branch isn't `main` (edit `RAW=...` to your branch).
- See errors → `tail -40 /workspace/comfy.log`

## Notes
- Renders are REVIEW-CANDIDATE only (structure canon is locked; the rendered images are not auto-approved).
- Control images are deterministic line-art of the locked P1/P2/P3 geometry; ControlNet (canny) holds the shape, the prompt holds the material (white B4C shell / black Ti frame / #E60000 core).
