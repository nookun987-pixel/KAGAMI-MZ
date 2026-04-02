"""
MIKAGE ZENITH - Fooocus Proxy v3.1-fix
========================================
Proxy cho Fooocus GOC (Gradio 3.41.2, enable_queue=True)

Dung WebSocket ws://host:port/queue/join (Gradio 3.x queue protocol).
Goi fn_index=67 (generate) roi fn_index=68 (get images).

FIX: aspect_ratios dung ky tu × (Unicode multiply \u00d7) thay vi * (asterisk)
     vi Fooocus parse bang .replace('×', ' ').split(' ')

Cach chay:
    pip install fastapi uvicorn requests websocket-client
    python fooocus_proxy.py
"""

import os
import json
import time
import logging
import hashlib
from typing import Optional

import requests
from fastapi import FastAPI, HTTPException
from pydantic import BaseModel, Field
import uvicorn

# ──────────────────────────────────────────────
# CAU HINH
# ──────────────────────────────────────────────
FOOOCUS_HOST = os.getenv("FOOOCUS_HOST", "127.0.0.1")
FOOOCUS_PORT = int(os.getenv("FOOOCUS_PORT", "7865"))
FOOOCUS_URL  = f"http://{FOOOCUS_HOST}:{FOOOCUS_PORT}"
FOOOCUS_WS   = f"ws://{FOOOCUS_HOST}:{FOOOCUS_PORT}"
PROXY_PORT   = int(os.getenv("PROXY_PORT", "7866"))

logging.basicConfig(
    level=logging.INFO,
    format="[%(asctime)s] %(levelname)s - %(message)s",
    datefmt="%H:%M:%S",
)
log = logging.getLogger("mikage")

# ──────────────────────────────────────────────
# ASPECT RATIO MAP
# Format chinh xac tu Gradio config cua Fooocus
# Fooocus parse: .replace('\u00d7', ' ').split(' ')[:2]
# ──────────────────────────────────────────────
ASPECT_RATIOS = {
    "1:2":   "704\u00d71408",
    "1:1":   "1024\u00d71024",
    "9:7":   "1152\u00d7896",
    "3:2":   "1152\u00d7832",   # approx
    "16:9":  "1344\u00d7768",   # approx
    "2:1":   "1408\u00d7704",
    "3:1":   "1728\u00d7576",
    "5:3":   "1280\u00d7768",
    "7:4":   "1344\u00d7768",
    "4:7":   "768\u00d71344",
    "3:5":   "768\u00d71280",
    "7:9":   "896\u00d71152",
}

# Default: 1152x896 (9:7 landscape)
DEFAULT_ASPECT = "1152\u00d7896"


def normalize_aspect_ratio(user_input: str) -> str:
    """Chuyen doi input cua user thanh format Fooocus can"""
    s = user_input.strip()

    # Neu da dung format chuan (co ×)
    if "\u00d7" in s:
        return s

    # Neu la ratio nhu "16:9", "1:1"
    if s in ASPECT_RATIOS:
        return ASPECT_RATIOS[s]

    # Neu dung * hoac x
    for sep in ["*", "x", "X"]:
        if sep in s:
            parts = s.split(sep)
            if len(parts) == 2:
                return f"{parts[0].strip()}\u00d7{parts[1].strip()}"

    return DEFAULT_ASPECT


# ──────────────────────────────────────────────
# BUILD DATA cho fn_index=67 (153 inputs)
# ──────────────────────────────────────────────

def build_data_67(
    prompt: str,
    negative_prompt: str = "",
    styles: list = None,
    performance: str = "Speed",
    aspect_ratios: str = None,
    image_number: int = 1,
    output_format: str = "png",
    seed: str = "-1",
    sharpness: float = 2.0,
    guidance_scale: float = 4.0,
    base_model: str = "juggernautXL_v8Rundiffusion.safetensors",
) -> list:
    if styles is None:
        styles = ["Fooocus V2", "Fooocus Enhance", "Fooocus Sharp"]
    if aspect_ratios is None:
        aspect_ratios = DEFAULT_ASPECT
    else:
        aspect_ratios = normalize_aspect_ratio(aspect_ratios)

    data = [
        None,                   # [0]  state
        False,                  # [1]  Generate Image Grid for Each Batch
        prompt,                 # [2]  Prompt
        negative_prompt,        # [3]  Negative Prompt
        styles,                 # [4]  Selected Styles
        performance,            # [5]  Performance
        aspect_ratios,          # [6]  Aspect Ratios  ← MUST use × not *
        image_number,           # [7]  Image Number
        output_format,          # [8]  Output Format
        seed,                   # [9]  Seed
        False,                  # [10] Read wildcards in order
        sharpness,              # [11] Image Sharpness
        guidance_scale,         # [12] Guidance Scale
        base_model,             # [13] Base Model
        "None",                 # [14] Refiner
        0.5,                    # [15] Refiner Switch At
        True, "sd_xl_offset_example-lora_1.0.safetensors", 0.1,  # [16-18] LoRA 1
        True, "None", 1.0,     # [19-21] LoRA 2
        True, "None", 1.0,     # [22-24] LoRA 3
        True, "None", 1.0,     # [25-27] LoRA 4
        True, "None", 1.0,     # [28-30] LoRA 5
        False,                  # [31] Input Image
        "uov",                  # [32] current_tab
        "Disabled",             # [33] Upscale or Variation
        None,                   # [34] Image (uov)
        [],                     # [35] Outpaint Direction
        None,                   # [36] Image (inpaint)
        "",                     # [37] Inpaint Additional Prompt
        None,                   # [38] Mask Upload
        False,                  # [39] Disable Preview
        False,                  # [40] Disable Intermediate Results
        False,                  # [41] Disable seed increment
        False,                  # [42] Black Out NSFW
        1.5,                    # [43] Positive ADM Guidance Scaler
        0.8,                    # [44] Negative ADM Guidance Scaler
        0.3,                    # [45] ADM Guidance End At Step
        7.0,                    # [46] CFG Mimicking from TSNR
        2,                      # [47] CLIP Skip
        "dpmpp_2m_sde_gpu",     # [48] Sampler
        "karras",               # [49] Scheduler
        "Default (model)",      # [50] VAE
        -1, -1, -1, -1, -1, -1,  # [51-56] Forced Overwrite params
        False,                  # [57] Mixing Image Prompt and Vary/Upscale
        False,                  # [58] Mixing Image Prompt and Inpaint
        False,                  # [59] Debug Preprocessors
        False,                  # [60] Skip Preprocessors
        64,                     # [61] Canny Low Threshold
        128,                    # [62] Canny High Threshold
        "joint",                # [63] Refiner swap method
        0.25,                   # [64] Softness of ControlNet
        False, 1.01, 1.02, 0.99, 0.95,  # [65-69] FreeU
        False,                  # [70] Debug Inpaint Preprocessing
        False,                  # [71] Disable initial latent in inpaint
        "v2.6",                 # [72] Inpaint Engine
        1.0,                    # [73] Inpaint Denoising Strength
        0.618,                  # [74] Inpaint Respective Field
        False,                  # [75] Enable Advanced Masking
        False,                  # [76] Invert Mask
        0,                      # [77] Mask Erode or Dilate
        False,                  # [78] Save only final enhanced
        False,                  # [79] Save Metadata
        "fooocus",              # [80] Metadata Scheme
        None, 0.5, 0.6, "ImagePrompt",  # [81-84] Image Prompt 1
        None, 0.5, 0.6, "ImagePrompt",  # [85-88] Image Prompt 2
        None, 0.5, 0.6, "ImagePrompt",  # [89-92] Image Prompt 3
        None, 0.5, 0.6, "ImagePrompt",  # [93-96] Image Prompt 4
        False, 0, False,        # [97-99] GroundingDINO / Debug Enhance
        None,                   # [100] Use with Enhance image
        False,                  # [101] Enhance
        "Disabled",             # [102] Enhance Upscale
        "Before First Enhancement",  # [103]
        "Original Prompts",     # [104]
        # Enhance block 1 [105-120]
        False, "", "", "", "sam", "full", "vit_b", 0.25, 0.3, 0, False, "v2.6", 1.0, 0.618, 0, False,
        # Enhance block 2 [121-136]
        False, "", "", "", "sam", "full", "vit_b", 0.25, 0.3, 0, False, "v2.6", 1.0, 0.618, 0, False,
        # Enhance block 3 [137-152]
        False, "", "", "", "sam", "full", "vit_b", 0.25, 0.3, 0, False, "v2.6", 1.0, 0.618, 0, False,
    ]

    assert len(data) == 153, f"Expected 153 inputs, got {len(data)}"
    return data


# ──────────────────────────────────────────────
# WEBSOCKET QUEUE PROTOCOL (Gradio 3.x)
# ──────────────────────────────────────────────

def call_ws_fn(session_hash: str, fn_index: int, data: list) -> dict:
    """
    Goi 1 fn_index qua Gradio 3.x WebSocket queue protocol:
    1. Connect ws://host:port/queue/join
    2. Receive send_hash -> send fn_index + session_hash
    3. Receive estimation -> queue position
    4. Receive send_data -> send data
    5. Receive process_starts -> generating
    6. Receive process_completed -> done
    """
    import websocket

    ws_url = f"{FOOOCUS_WS}/queue/join"
    log.info(f"  WS connect: {ws_url} (fn_index={fn_index})")

    try:
        ws = websocket.create_connection(ws_url, timeout=600)
    except Exception as e:
        return {"status": "fail", "error": f"WebSocket connect failed: {e}"}

    try:
        while True:
            raw = ws.recv()
            if not raw:
                continue

            msg = json.loads(raw)
            msg_type = msg.get("msg", "")

            if msg_type == "send_hash":
                ws.send(json.dumps({
                    "fn_index": fn_index,
                    "session_hash": session_hash,
                }))
                log.info(f"  WS: sent hash (fn_index={fn_index})")

            elif msg_type == "estimation":
                rank = msg.get("rank", 0)
                log.info(f"  WS: queue rank={rank}")

            elif msg_type == "send_data":
                ws.send(json.dumps({
                    "fn_index": fn_index,
                    "data": data,
                    "session_hash": session_hash,
                }))
                log.info(f"  WS: sent data ({len(data)} items)")

            elif msg_type == "process_starts":
                log.info("  >>> Fooocus generating...")

            elif msg_type == "process_generating":
                log.info("  >>> Progress update...")

            elif msg_type == "process_completed":
                output = msg.get("output", {})
                success = msg.get("success", False)
                log.info(f"  >>> Completed! success={success}")
                ws.close()

                if success:
                    return {"status": "success", "output": output}
                else:
                    error = output.get("error", "Fooocus error")
                    return {"status": "fail", "error": error, "output": output}

            elif msg_type == "queue_full":
                ws.close()
                return {"status": "fail", "error": "Queue full"}

            elif msg_type in ("close_stream", "error"):
                ws.close()
                return {"status": "fail", "error": f"WS {msg_type}: {msg}"}

    except Exception as e:
        try:
            ws.close()
        except:
            pass
        return {"status": "fail", "error": f"WS error: {e}"}


def generate_image(prompt: str, negative_prompt: str = "",
                   image_number: int = 1, seed: int = -1,
                   guidance_scale: float = 4.0, sharpness: float = 2.0,
                   styles: list = None, performance: str = "Speed",
                   aspect_ratios: str = None,
                   base_model: str = "juggernautXL_v8Rundiffusion.safetensors") -> dict:

    session_hash = hashlib.md5(f"mikage_{time.time()}".encode()).hexdigest()[:12]

    data_67 = build_data_67(
        prompt=prompt,
        negative_prompt=negative_prompt,
        styles=styles,
        performance=performance,
        aspect_ratios=aspect_ratios,
        image_number=image_number,
        seed=str(seed),
        sharpness=sharpness,
        guidance_scale=guidance_scale,
        base_model=base_model,
    )

    # Step 1: fn_index=67 (main generate)
    log.info(">>> Step 1: fn_index=67 (generate)")
    result_67 = call_ws_fn(session_hash, fn_index=67, data=data_67)

    if result_67["status"] != "success":
        return result_67

    # fn_index=67 tra ve state
    state_value = None
    output_67 = result_67.get("output", {})
    data_67_out = output_67.get("data", [])
    if data_67_out:
        state_value = data_67_out[0]
    log.info(f"  State type: {type(state_value).__name__}, preview: {str(state_value)[:200]}")

    # Step 2: fn_index=68 (get images from state)
    log.info(">>> Step 2: fn_index=68 (get images)")
    result_68 = call_ws_fn(session_hash, fn_index=68, data=[state_value])

    if result_68["status"] != "success":
        # Try extracting images from state directly
        if state_value:
            images = extract_all_images(state_value)
            if images:
                return {"status": "success", "images": images, "count": len(images)}
        return result_68

    # Parse images from fn_index=68 output
    output_68 = result_68.get("output", {})
    data_68_out = output_68.get("data", [])

    images = []
    for item in data_68_out:
        images.extend(extract_all_images(item))

    # Also check state
    if not images and state_value:
        images = extract_all_images(state_value)

    if images:
        return {"status": "success", "images": images, "count": len(images)}

    return {
        "status": "fail",
        "error": "No images found",
        "raw_67": str(data_67_out)[:500],
        "raw_68": str(data_68_out)[:500],
    }


def extract_all_images(item) -> list:
    """De quy tim tat ca duong dan anh"""
    images = []
    if item is None:
        return images
    if isinstance(item, str):
        if any(item.endswith(ext) for ext in [".png", ".jpg", ".jpeg", ".webp"]):
            images.append(item)
        elif item.startswith(("/tmp", "/home", "http")):
            images.append(item)
    elif isinstance(item, dict):
        for key in ["name", "path", "url"]:
            if key in item and item[key] and isinstance(item[key], str):
                images.append(item[key])
                break
        for v in item.values():
            if isinstance(v, (list, dict)):
                images.extend(extract_all_images(v))
    elif isinstance(item, (list, tuple)):
        for sub in item:
            images.extend(extract_all_images(sub))
    return images


# ──────────────────────────────────────────────
# FASTAPI SERVER
# ──────────────────────────────────────────────

app = FastAPI(title="Mikage Zenith Proxy", version="3.1")


class GenerateRequest(BaseModel):
    prompt: str
    negative_prompt: str = ""
    image_number: int = Field(default=1, ge=1, le=16)
    seed: int = -1
    guidance_scale: float = Field(default=4.0, ge=1.0, le=30.0)
    sharpness: float = Field(default=2.0, ge=0.0, le=30.0)
    styles: list[str] = ["Fooocus V2", "Fooocus Enhance", "Fooocus Sharp"]
    performance: str = "Speed"
    aspect_ratios: str = "1152\u00d7896"
    base_model: str = "juggernautXL_v8Rundiffusion.safetensors"


@app.get("/health")
async def health():
    fooocus_ok = False
    try:
        r = requests.get(f"{FOOOCUS_URL}/config", timeout=5)
        fooocus_ok = r.status_code == 200
    except:
        pass

    ws_ok = False
    try:
        import websocket
        ws = websocket.create_connection(f"{FOOOCUS_WS}/queue/join", timeout=5)
        ws.close()
        ws_ok = True
    except:
        pass

    return {
        "proxy": "ok",
        "fooocus_http": "ok" if fooocus_ok else "unreachable",
        "fooocus_ws": "ok" if ws_ok else "unreachable",
        "fooocus_url": FOOOCUS_URL,
    }


@app.post("/generate")
async def generate(req: GenerateRequest):
    log.info(f"=== REQUEST: prompt='{req.prompt[:80]}', images={req.image_number} ===")

    start = time.time()
    result = generate_image(
        prompt=req.prompt,
        negative_prompt=req.negative_prompt,
        image_number=req.image_number,
        seed=req.seed,
        guidance_scale=req.guidance_scale,
        sharpness=req.sharpness,
        styles=req.styles,
        performance=req.performance,
        aspect_ratios=req.aspect_ratios,
        base_model=req.base_model,
    )
    elapsed = round(time.time() - start, 1)
    result["total_seconds"] = elapsed

    log.info(f"=== RESULT: {result['status']} in {elapsed}s ===")

    if result["status"] != "success":
        raise HTTPException(status_code=500, detail=result)

    return result


# ──────────────────────────────────────────────
# MAIN
# ──────────────────────────────────────────────

if __name__ == "__main__":
    ws_status = "OK"
    try:
        import websocket
    except ImportError:
        ws_status = "MISSING - run: pip install websocket-client"

    print(f"""
 ============================================
   MIKAGE ZENITH - FOOOCUS PROXY v3.1-fix
   (WebSocket Queue Protocol)

   Proxy:    http://0.0.0.0:{PROXY_PORT}
   Fooocus:  {FOOOCUS_URL}
   Gradio:   3.41.2 | queue=True
   WS lib:   {ws_status}

   POST /generate  - Tao anh
   GET  /health    - Kiem tra ket noi
 ============================================
""")

    if ws_status != "OK":
        print("  !!! Run: pip install websocket-client\n")

    uvicorn.run(app, host="0.0.0.0", port=PROXY_PORT, log_level="info")
