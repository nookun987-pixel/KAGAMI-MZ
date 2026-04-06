#!/usr/bin/env python3
"""
scripts/gradio_bridge.py
Thin bridge: accepts simple /generate JSON on port 7866,
calls Fooocus Gradio UI on port 7865 via gradio_client,
returns image file path.

Does NOT load Fooocus engine — delegates to the running Gradio UI.
"""

import os
import sys
import json
import time
import shutil
import traceback
from http.server import HTTPServer, BaseHTTPRequestHandler
from gradio_client import Client

FOOOCUS_URL = os.environ.get("FOOOCUS_URL", "http://127.0.0.1:7865")
BRIDGE_PORT = int(os.environ.get("GRADIO_BRIDGE_PORT", "7866"))
FN_INDEX = 67  # Fooocus generation trigger

# Aspect ratio presets
ASPECT_PRESETS = [
    (704, 1408, "704\u00d71408"), (704, 1344, "704\u00d71344"),
    (768, 1344, "768\u00d71344"), (768, 1280, "768\u00d71280"),
    (832, 1216, "832\u00d71216"), (832, 1152, "832\u00d71152"),
    (896, 1152, "896\u00d71152"), (896, 1088, "896\u00d71088"),
    (960, 1088, "960\u00d71088"), (960, 1024, "960\u00d71024"),
    (1024, 1024, "1024\u00d71024"),
    (1024, 960, "1024\u00d7960"), (1088, 960, "1088\u00d7960"),
    (1088, 896, "1088\u00d7896"), (1152, 896, "1152\u00d7896"),
    (1152, 832, "1152\u00d7832"), (1216, 832, "1216\u00d7832"),
    (1280, 768, "1280\u00d7768"), (1344, 768, "1344\u00d7768"),
    (1344, 704, "1344\u00d7704"), (1408, 704, "1408\u00d7704"),
]


def match_aspect(width, height):
    target = width / height
    best, best_diff = "1024\u00d71024", float("inf")
    for w, h, label in ASPECT_PRESETS:
        diff = abs((w / h) - target)
        if diff < best_diff:
            best_diff = diff
            best = label
    return best


def build_gradio_args(payload):
    """Build the 152-element arg list for fn_index=67 (text-to-img, no img2img)."""
    prompt = payload.get("prompt", "")
    negative_prompt = payload.get("negative_prompt", "")
    seed = str(payload.get("seed", -1))
    width = payload.get("width", 1152)
    height = payload.get("height", 1152)
    performance = payload.get("performance_selection", "Quality")
    styles = payload.get("style_selections", [])
    image_number = payload.get("image_number", 1)
    guidance_scale = payload.get("guidance_scale", 7.0)
    sharpness = payload.get("sharpness", 2.0)
    aspect = match_aspect(width, height)

    args = [
        False,                  # [0]  Generate Image Grid
        prompt,                 # [1]  Prompt
        negative_prompt,        # [2]  Negative Prompt
        styles,                 # [3]  Selected Styles
        performance,            # [4]  Performance
        aspect,                 # [5]  Aspect Ratios
        image_number,           # [6]  Image Number
        "png",                  # [7]  Output Format
        seed,                   # [8]  Seed
        False,                  # [9]  Read wildcards in order
        sharpness,              # [10] Image Sharpness
        guidance_scale,         # [11] Guidance Scale
        "juggernautXL_v8Rundiffusion.safetensors",  # [12] Base Model
        "None",                 # [13] Refiner
        0.5,                    # [14] Refiner Switch At
    ]

    # LoRA slots: 5 × (enabled, name, weight)
    n_loras = 5
    args.extend([True, "sd_xl_offset_example-lora_1.0.safetensors", 1.0])
    for _ in range(n_loras - 1):
        args.extend([False, "None", 1.0])

    # Image input block (no img2img)
    args.extend([
        False,              # Input Image checkbox
        "uov",              # current_tab
        "Disabled",         # Upscale or Variation
        None,               # UoV Image
        [],                 # Outpaint Direction
        None,               # Inpaint Image
        "",                 # Inpaint Additional Prompt
        None,               # Mask Upload
    ])

    # Advanced settings
    args.extend([
        False,              # Disable Preview
        False,              # Disable Intermediate Results
        False,              # Disable seed increment
        False,              # Black Out NSFW
        1.5,                # Positive ADM Guidance Scaler
        0.8,                # Negative ADM Guidance Scaler
        0.3,                # ADM Guidance End At Step
        7.0,                # CFG Mimicking from TSNR
        -1,                 # CLIP Skip
        "dpmpp_2m_sde_gpu", # Sampler
        "karras",           # Scheduler
        "Default (model)",  # VAE
        -1,                 # Forced Overwrite Step
        -1,                 # Forced Overwrite Refiner Switch
        -1,                 # Forced Overwrite Width
        -1,                 # Forced Overwrite Height
        -1.0,               # Forced Vary Strength
        -1.0,               # Forced Upscale Strength
        False,              # Mixing Image Prompt and Vary/Upscale
        False,              # Mixing Image Prompt and Inpaint
        False,              # Debug Preprocessors
        False,              # Skip Preprocessors
        64,                 # Canny Low Threshold
        128,                # Canny High Threshold
        "joint",            # Refiner swap method
        0.25,               # Softness of ControlNet
        False,              # FreeU Enabled
        1.01,               # FreeU B1
        1.02,               # FreeU B2
        0.99,               # FreeU S1
        0.95,               # FreeU S2
        False,              # Debug Inpaint Preprocessing
        False,              # Disable initial latent in inpaint
        "v2.6",             # Inpaint Engine
        1.0,                # Inpaint Denoising Strength
        0.618,              # Inpaint Respective Field
        False,              # Enable Advanced Masking
        False,              # Invert Mask
        0,                  # Mask Erode or Dilate
        False,              # Save only final enhanced image
        False,              # Save Metadata to Images
        "fooocus",          # Metadata Scheme
    ])

    # IP Adapter / ControlNet slots: 4 × (image, stop_at, weight, type)
    n_cn = 4
    for _ in range(n_cn):
        args.extend([None, 0.5, 0.6, "ImagePrompt"])

    # GroundingDINO / Enhance header
    args.extend([
        False,              # Debug GroundingDINO
        0,                  # GroundingDINO Box Erode or Dilate
        False,              # Debug Enhance Masks
        None,               # Use with Enhance image
        False,              # Enhance checkbox
        "Disabled",         # Enhance Upscale or Variation
        "Before First Enhancement",  # Order of Processing
        "original",         # Prompt type
    ])

    # Enhance slots: 3 × 16 params each
    n_enhance = 3
    enhance_slot = [
        False,              # Enable
        "",                 # Detection prompt
        "",                 # Enhancement positive prompt
        "",                 # Enhancement negative prompt
        "isnet-general-use",  # Mask generation model
        "full",             # Cloth category
        "vit_b",            # SAM model
        0.25,               # Text Threshold
        0.3,                # Box Threshold
        10,                 # Maximum detections
        False,              # Disable initial latent
        "v2.6",             # Inpaint Engine
        1.0,                # Inpaint Denoising
        0.618,              # Inpaint Respective Field
        0,                  # Mask Erode or Dilate
        False,              # Invert Mask
    ]
    for _ in range(n_enhance):
        args.extend(enhance_slot)

    print(f"[GRADIO_BRIDGE] Built {len(args)} args for fn_index={FN_INDEX}")
    return args


# Global client (reused across requests)
_client = None


def get_client():
    global _client
    if _client is None:
        print(f"[GRADIO_BRIDGE] Connecting to Fooocus at {FOOOCUS_URL} ...")
        _client = Client(FOOOCUS_URL, verbose=False)
        print(f"[GRADIO_BRIDGE] Connected")
    return _client


class BridgeHandler(BaseHTTPRequestHandler):
    def do_GET(self):
        if self.path == "/" or self.path == "/health":
            self.send_response(200)
            self.send_header("Content-Type", "application/json")
            self.end_headers()
            self.wfile.write(json.dumps({
                "status": "ok",
                "service": "mikage-gradio-bridge",
                "fooocus_url": FOOOCUS_URL,
                "fn_index": FN_INDEX,
            }).encode())
        else:
            self.send_response(404)
            self.send_header("Content-Type", "application/json")
            self.end_headers()
            self.wfile.write(json.dumps({"detail": "Not Found"}).encode())

    def do_POST(self):
        if self.path != "/generate":
            self.send_response(404)
            self.send_header("Content-Type", "application/json")
            self.end_headers()
            self.wfile.write(json.dumps({"detail": "Not Found"}).encode())
            return

        content_length = int(self.headers.get("Content-Length", 0))
        body = self.rfile.read(content_length)

        try:
            payload = json.loads(body) if body else {}
        except json.JSONDecodeError as e:
            self.send_response(400)
            self.send_header("Content-Type", "application/json")
            self.end_headers()
            self.wfile.write(json.dumps({"error": f"Invalid JSON: {e}"}).encode())
            return

        print(f"[GRADIO_BRIDGE] /generate called: prompt_len={len(payload.get('prompt',''))}")

        try:
            args = build_gradio_args(payload)
            client = get_client()

            start = time.time()
            print(f"[GRADIO_BRIDGE] Submitting to Fooocus fn_index={FN_INDEX} ...")
            job = client.submit(*args, fn_index=FN_INDEX)
            result = job.result()
            elapsed = time.time() - start
            print(f"[GRADIO_BRIDGE] Fooocus returned in {elapsed:.1f}s")
            print(f"[GRADIO_BRIDGE] Raw result type: {type(result)}")
            print(f"[GRADIO_BRIDGE] Raw result: {str(result)[:500]}")

            # Parse result — Fooocus returns various formats
            response = self._parse_fooocus_result(result, elapsed)

            self.send_response(200)
            self.send_header("Content-Type", "application/json")
            self.end_headers()
            self.wfile.write(json.dumps(response).encode())

        except Exception as e:
            traceback.print_exc()
            self.send_response(500)
            self.send_header("Content-Type", "application/json")
            self.end_headers()
            self.wfile.write(json.dumps({
                "error": str(e),
                "traceback": traceback.format_exc(),
            }).encode())

    def _parse_fooocus_result(self, result, elapsed):
        """Parse Fooocus Gradio result into our standard response format."""
        # Result could be:
        # - A list of file paths
        # - A dict with file info
        # - A tuple/list of gallery items

        if result is None:
            return {"error": "Fooocus returned None", "render_time_s": elapsed}

        # If result is a list of dicts (gallery format)
        if isinstance(result, list):
            images = []
            for item in result:
                if isinstance(item, dict) and "name" in item:
                    images.append(item["name"])
                elif isinstance(item, str) and os.path.isfile(item):
                    images.append(item)
                elif isinstance(item, (list, tuple)):
                    # Gallery item: [{"name": path, ...}, caption]
                    for sub in item:
                        if isinstance(sub, dict) and "name" in sub:
                            images.append(sub["name"])
                        elif isinstance(sub, str) and os.path.isfile(sub):
                            images.append(sub)
            if images:
                return [{"url": img, "render_time_s": elapsed} for img in images]

        # If result is a single file path string
        if isinstance(result, str) and os.path.isfile(result):
            return [{"url": result, "render_time_s": elapsed}]

        # If result is a dict
        if isinstance(result, dict):
            if "name" in result:
                return [{"url": result["name"], "render_time_s": elapsed}]

        # Fallback: return raw
        return {"raw_result": str(result)[:2000], "render_time_s": elapsed}

    def log_message(self, format, *args):
        print(f"[GRADIO_BRIDGE] {args[0]} {args[1]} {args[2]}")


def main():
    print(f"[GRADIO_BRIDGE] Starting on port {BRIDGE_PORT}")
    print(f"[GRADIO_BRIDGE] Target Fooocus: {FOOOCUS_URL}")
    print(f"[GRADIO_BRIDGE] fn_index: {FN_INDEX}")

    # Pre-connect to validate Fooocus is reachable
    try:
        get_client()
    except Exception as e:
        print(f"[GRADIO_BRIDGE] WARNING: Could not connect to Fooocus: {e}")
        print(f"[GRADIO_BRIDGE] Will retry on first request")

    server = HTTPServer(("127.0.0.1", BRIDGE_PORT), BridgeHandler)
    print(f"[GRADIO_BRIDGE] Listening on http://127.0.0.1:{BRIDGE_PORT}")
    try:
        server.serve_forever()
    except KeyboardInterrupt:
        print(f"\n[GRADIO_BRIDGE] Shutting down")
        server.server_close()


if __name__ == "__main__":
    main()
