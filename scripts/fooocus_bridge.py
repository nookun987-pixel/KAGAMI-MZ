"""
MIKAGE — Fooocus Direct Bridge (No Gradio)
Calls Fooocus internal pipeline directly via AsyncTask.

Start:
  cd D:/KAGAMI-MZ && python scripts/fooocus_bridge.py

Fooocus engine loads in-process — no separate Fooocus UI needed.
"""

import base64
import os
import sys
import time
import threading
import traceback
import struct
import numpy as np
from PIL import Image

# ---------------------------------------------------------------------------
# Bootstrap Fooocus — must happen BEFORE importing Fooocus modules
# ---------------------------------------------------------------------------

FOOOCUS_ROOT = os.environ.get("FOOOCUS_ROOT", "D:/Fooocus-main")
BRIDGE_PORT = int(os.environ.get("FOOOCUS_BRIDGE_PORT", "7865"))

# Inject Fooocus into sys.path
if FOOOCUS_ROOT not in sys.path:
    sys.path.insert(0, FOOOCUS_ROOT)

# Fooocus resolves config.txt relative to CWD — point it to the real location
os.environ.setdefault("config_path", os.path.join(FOOOCUS_ROOT, "config.txt"))
os.environ.setdefault("config_example_path", os.path.join(FOOOCUS_ROOT, "config_modification_tutorial.txt"))

# Override sys.argv so args_manager.parse_args() doesn't choke on uvicorn args
_original_argv = sys.argv[:]
sys.argv = [
    "fooocus_bridge",
    "--disable-in-browser",
    "--disable-analytics",
]

# Now import Fooocus internals (this triggers model config loading + worker thread)
print(f"[BRIDGE] Loading Fooocus engine from {FOOOCUS_ROOT} ...")
_load_start = time.time()

import modules.async_worker as async_worker
import modules.config as fooocus_config
import modules.flags as fooocus_flags

_load_elapsed = time.time() - _load_start
print(f"[BRIDGE] Fooocus engine loaded in {_load_elapsed:.1f}s")
print(f"[BRIDGE] Output dir: {fooocus_config.path_outputs}")

# Restore argv for uvicorn
sys.argv = _original_argv

# ---------------------------------------------------------------------------
# FastAPI REST layer
# ---------------------------------------------------------------------------

import uvicorn
from fastapi import FastAPI, HTTPException
from fastapi.responses import JSONResponse
from pydantic import BaseModel, Field
from typing import List

app = FastAPI(title="MIKAGE Fooocus Direct Bridge")


class TextToImgRequest(BaseModel):
    prompt: str = ""
    negative_prompt: str = ""
    seed: int = -1
    width: int = 1024
    height: int = 384
    performance_selection: str = "Quality"
    style_selections: List[str] = Field(default_factory=list)
    image_number: int = 1
    guidance_scale: float = 7.0
    steps: int = -1  # -1 = use performance default
    disable_refiner: bool = False
    async_process: bool = False
    sampler: str | None = None
    scheduler: str | None = None
    sharpness: float = 2.0
    generation_mode: str = "exploration"
    reference_master: dict | None = None
    reproduction_constraints: dict | None = None
    reproduction_anchor_mode: str | None = None
    anchor_image_path: str | None = None
    anchor_strength: float | None = None
    denoise_strength: float | None = None
    composition_lock_strength: float | None = None
    silhouette_lock_strength: float | None = None
    anchor_method_used: str | None = None
    image_anchor_success_expected: bool = False
    preservation_mode: str | None = None
    reconstruction_priority: str | None = None
    prompt_weight_reduction_when_anchor_present: float | None = None
    dry_run: bool = False


@app.get("/")
async def root():
    return {
        "status": "ok",
        "service": "mikage-fooocus-direct-bridge",
        "mode": "internal-pipeline",
        "output_dir": fooocus_config.path_outputs,
    }


# ---------------------------------------------------------------------------
# Aspect ratio mapping (reused from original bridge)
# ---------------------------------------------------------------------------

_ASPECT_PRESETS = [
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
    (1472, 704, "1472\u00d7704"), (1536, 640, "1536\u00d7640"),
    (1600, 640, "1600\u00d7640"), (1664, 576, "1664\u00d7576"),
    (1728, 576, "1728\u00d7576"),
]


def _match_aspect(width: int, height: int) -> str:
    target = width / height
    best, best_diff = "1024\u00d71024", float("inf")
    for w, h, label in _ASPECT_PRESETS:
        diff = abs((w / h) - target)
        if diff < best_diff:
            best_diff = diff
            best = label
    return best


def _load_anchor_image(anchor_image_path: str | None):
    if not anchor_image_path:
        return None, None
    normalized = os.path.abspath(anchor_image_path)
    if not os.path.isfile(normalized):
        raise FileNotFoundError(f"Anchor image not found: {normalized}")
    image = Image.open(normalized).convert("RGB")
    return np.array(image), normalized


def _is_image_anchored_reproduction(req: TextToImgRequest) -> bool:
    return (
        str(req.generation_mode or "").strip().lower() == "reproduction"
        and str(req.reproduction_anchor_mode or "").strip().lower() == "image_anchored"
        and bool(req.anchor_image_path)
    )


def _is_strong_preservation(req: TextToImgRequest) -> bool:
    return (
        _is_image_anchored_reproduction(req)
        and str(req.preservation_mode or "").strip().lower() == "strong_preservation"
    )


def _effective_denoise(req: TextToImgRequest, strong: bool) -> float:
    if req.denoise_strength is not None:
        return req.denoise_strength
    return 0.08 if strong else 0.18


def _effective_anchor_strength(req: TextToImgRequest, strong: bool) -> float:
    if req.anchor_strength is not None:
        return req.anchor_strength
    return 0.95 if strong else 0.85


def _effective_composition_lock(req: TextToImgRequest, strong: bool) -> float:
    if req.composition_lock_strength is not None:
        return req.composition_lock_strength
    return 0.95 if strong else 0.9


def _effective_silhouette_lock(req: TextToImgRequest, strong: bool) -> float:
    if req.silhouette_lock_strength is not None:
        return req.silhouette_lock_strength
    return 0.98 if strong else 0.95


def _effective_prompt_reduction(req: TextToImgRequest, strong: bool) -> float:
    if req.prompt_weight_reduction_when_anchor_present is not None:
        return req.prompt_weight_reduction_when_anchor_present
    return 0.4 if strong else 1.0


def _apply_prompt_reduction(prompt: str, reduction_factor: float) -> str:
    """When reduction_factor < 1.0, strip non-essential prompt sections to reduce
    prompt over-control and let the anchor image dominate reconstruction."""
    if reduction_factor >= 1.0:
        return prompt
    # Keep only SUBJECT, GEOMETRY, and MATERIAL sections — strip verbose
    # aesthetic/composition/lighting prose that causes re-interpretation drift
    lines = prompt.split("\n")
    keep_sections = {"SUBJECT", "GEOMETRY", "MATERIAL", "REPRODUCTION ANCHOR"}
    current_section_keep = True
    kept = []
    for line in lines:
        stripped = line.strip()
        # Detect section headers (all-caps single word or two-word labels)
        if stripped and stripped == stripped.upper() and len(stripped.split()) <= 3 and not stripped.startswith("`"):
            current_section_keep = stripped in keep_sections
        if current_section_keep:
            kept.append(line)
    reduced = "\n".join(kept).strip()
    return reduced if reduced else prompt


def _build_payload_debug(req: TextToImgRequest, image_anchor_active: bool, anchor_image, anchor_image_path: str | None):
    strong = _is_strong_preservation(req)
    eff_anchor = _effective_anchor_strength(req, strong)
    eff_comp = _effective_composition_lock(req, strong)
    eff_sil = _effective_silhouette_lock(req, strong)
    eff_denoise = _effective_denoise(req, strong)
    eff_prompt_red = _effective_prompt_reduction(req, strong)

    control_summary = []
    if image_anchor_active and anchor_image is not None:
        control_summary = [
            {
                "type": fooocus_flags.cn_ip,
                "stop": fooocus_flags.default_parameters[fooocus_flags.cn_ip][0],
                "weight": eff_anchor,
            },
            {
                "type": fooocus_flags.cn_cpds,
                "stop": fooocus_flags.default_parameters[fooocus_flags.cn_cpds][0],
                "weight": eff_comp,
            },
            {
                "type": fooocus_flags.cn_canny,
                "stop": fooocus_flags.default_parameters[fooocus_flags.cn_canny][0],
                "weight": eff_sil,
            },
        ]

    backend_method = "fooocus_strong_preservation_vary_ip_cpds_canny" if (image_anchor_active and strong) else \
                     "fooocus_ip_plus_vary_cpds_canny" if image_anchor_active else None

    return {
        "generation_mode": req.generation_mode,
        "reproduction_anchor_mode": req.reproduction_anchor_mode,
        "anchor_image_path": anchor_image_path,
        "anchor_image_loaded": image_anchor_active,
        "uov_input_image": {
            "present": image_anchor_active,
            "shape": list(anchor_image.shape) if image_anchor_active and anchor_image is not None else None,
        },
        "uov_method": fooocus_flags.subtle_variation if image_anchor_active else fooocus_flags.disabled,
        "uov_method_normalized": fooocus_flags.subtle_variation.casefold() if image_anchor_active else fooocus_flags.disabled.casefold(),
        "current_tab": "ip" if image_anchor_active else "uov",
        "mixing_image_prompt_and_vary_upscale": image_anchor_active,
        "overwrite_vary_strength": eff_denoise if image_anchor_active else -1.0,
        "control_stack": control_summary,
        "anchor_method_used": backend_method,
        "image_anchor_success_expected": bool(image_anchor_active),
        # --- preservation audit fields ---
        "preservation_mode_used": "strong_preservation" if strong else ("standard" if image_anchor_active else None),
        "anchor_image_used": anchor_image_path,
        "backend_method_used": backend_method,
        "effective_denoise_strength": eff_denoise if image_anchor_active else None,
        "effective_preservation_strength": eff_anchor if image_anchor_active else None,
        "composition_lock_strength": eff_comp if image_anchor_active else None,
        "silhouette_lock_strength": eff_sil if image_anchor_active else None,
        "reconstruction_priority": req.reconstruction_priority if strong else None,
        "prompt_reduction_applied": eff_prompt_red < 1.0 if image_anchor_active else False,
        "prompt_reduction_factor": eff_prompt_red if image_anchor_active else None,
    }


# ---------------------------------------------------------------------------
# Core: build 152-arg list and push to async_tasks
# ---------------------------------------------------------------------------

def _build_args(req: TextToImgRequest) -> list:
    """Build the 152-element arg list that AsyncTask.__init__ expects."""
    seed_str = str(req.seed) if req.seed >= 0 else "-1"
    # Preserve an explicitly empty style list so callers can disable Fooocus V2
    # prompt expansion for canon-locked prompts.
    styles = [s for s in req.style_selections if s] if req.style_selections is not None else []
    aspect = _match_aspect(req.width, req.height)
    image_anchor_active = _is_image_anchored_reproduction(req)
    strong = _is_strong_preservation(req)
    anchor_image, normalized_anchor_path = _load_anchor_image(req.anchor_image_path) if image_anchor_active else (None, None)

    # Effective preservation values
    eff_denoise = _effective_denoise(req, strong)
    eff_anchor = _effective_anchor_strength(req, strong)
    eff_comp = _effective_composition_lock(req, strong)
    eff_sil = _effective_silhouette_lock(req, strong)
    eff_prompt_red = _effective_prompt_reduction(req, strong)

    # Apply prompt reduction when strong preservation is active
    effective_prompt = req.prompt
    if image_anchor_active and eff_prompt_red < 1.0:
        effective_prompt = _apply_prompt_reduction(req.prompt, eff_prompt_red)

    n_loras = fooocus_config.default_max_lora_number  # typically 5
    n_cn = fooocus_config.default_controlnet_image_count  # typically 4
    n_enhance = fooocus_config.default_enhance_tabs  # typically 3

    args = [
        False,                              # [0]  Generate Image Grid
        effective_prompt,                   # [1]  Prompt
        req.negative_prompt,                # [2]  Negative Prompt
        styles,                             # [3]  Selected Styles
        req.performance_selection,          # [4]  Performance
        aspect,                             # [5]  Aspect Ratios
        req.image_number,                   # [6]  Image Number
        "png",                              # [7]  Output Format
        seed_str,                           # [8]  Seed
        False,                              # [9]  Read wildcards in order
        req.sharpness,                      # [10] Image Sharpness
        req.guidance_scale,                 # [11] Guidance Scale
        "juggernautXL_v8Rundiffusion.safetensors",  # [12] Base Model
        "None" if req.disable_refiner else "None",  # [13] Refiner
        0.5,                                # [14] Refiner Switch At
    ]

    # LoRA slots (enabled, name, weight) × n_loras
    for _ in range(n_loras):
        args.extend([False, "None", 1.0])

    # Image input block
    args.extend([
        image_anchor_active,          # Input Image checkbox
        "ip" if image_anchor_active else "uov",          # current_tab
        fooocus_flags.subtle_variation if image_anchor_active else fooocus_flags.disabled,     # Upscale or Variation
        anchor_image if image_anchor_active else None,           # UoV Image
        [],             # Outpaint Direction
        None,           # Inpaint Image
        "",             # Inpaint Additional Prompt
        None,           # Mask Upload
    ])

    # Advanced settings
    args.extend([
        False,          # Disable Preview
        False,          # Disable Intermediate Results
        False,          # Disable seed increment
        False,          # Black Out NSFW
        1.5,            # Positive ADM Guidance Scaler
        0.8,            # Negative ADM Guidance Scaler
        0.3,            # ADM Guidance End At Step
        7.0,            # CFG Mimicking from TSNR
        -1,             # CLIP Skip
        req.sampler or "dpmpp_2m_sde_gpu",  # Sampler
        req.scheduler or "karras",       # Scheduler
        "Default (model)",   # VAE
        req.steps if req.steps > 0 else -1,             # Forced Overwrite Step
        -1,             # Forced Overwrite Refiner Switch
        -1,             # Forced Overwrite Width
        -1,             # Forced Overwrite Height
        eff_denoise if image_anchor_active else -1.0,           # Forced Vary Strength
        -1.0,           # Forced Upscale Strength
        image_anchor_active,          # Mixing Image Prompt and Vary/Upscale
        False,          # Mixing Image Prompt and Inpaint
        False,          # Debug Preprocessors
        False,          # Skip Preprocessors
        64,             # Canny Low Threshold
        128,            # Canny High Threshold
        "joint",        # Refiner swap method
        0.25,           # Softness of ControlNet
        False,          # FreeU Enabled
        1.01,           # FreeU B1
        1.02,           # FreeU B2
        0.99,           # FreeU S1
        0.95,           # FreeU S2
        False,          # Debug Inpaint Preprocessing
        False,          # Disable initial latent in inpaint
        "v2.6",         # Inpaint Engine
        1.0,            # Inpaint Denoising Strength
        0.618,          # Inpaint Respective Field
        False,          # Enable Advanced Masking
        False,          # Invert Mask
        0,              # Mask Erode or Dilate
        False,          # Save only final enhanced image
        False,          # Save Metadata to Images
        "fooocus",      # Metadata Scheme
    ])

    # IP Adapter slots (image, stop_at, weight, type) × n_cn
    control_slots = []
    if image_anchor_active:
        control_slots = [
            [
                anchor_image,
                fooocus_flags.default_parameters[fooocus_flags.cn_ip][0],
                eff_anchor,
                fooocus_flags.cn_ip,
            ],
            [
                anchor_image,
                fooocus_flags.default_parameters[fooocus_flags.cn_cpds][0],
                eff_comp,
                fooocus_flags.cn_cpds,
            ],
            [
                anchor_image,
                fooocus_flags.default_parameters[fooocus_flags.cn_canny][0],
                eff_sil,
                fooocus_flags.cn_canny,
            ],
        ]
    while len(control_slots) < n_cn:
        control_slots.append([None, fooocus_flags.default_parameters[fooocus_flags.cn_ip][0], 0.6, fooocus_flags.cn_ip])
    for cn_img, cn_stop, cn_weight, cn_type in control_slots[:n_cn]:
        args.extend([cn_img, cn_stop, cn_weight, cn_type])

    # GroundingDINO / Enhance header
    args.extend([
        False,          # Debug GroundingDINO
        0,              # GroundingDINO Box Erode or Dilate
        False,          # Debug Enhance Masks
        None,           # Use with Enhance image
        False,          # Enhance checkbox
        "Disabled",     # Enhance Upscale or Variation
        "Before First Enhancement",  # Order of Processing
        "original",     # Prompt type
    ])

    # Enhance slots × n_enhance (16 params each)
    enhance_slot = [
        False,                   # Enable
        "",                      # Detection prompt
        "",                      # Enhancement positive prompt
        "",                      # Enhancement negative prompt
        "isnet-general-use",     # Mask generation model
        "full",                  # Cloth category
        "vit_b",                 # SAM model
        0.25,                    # Text Threshold
        0.3,                     # Box Threshold
        10,                      # Maximum detections
        False,                   # Disable initial latent
        "v2.6",                  # Inpaint Engine
        1.0,                     # Inpaint Denoising
        0.618,                   # Inpaint Respective Field
        0,                       # Mask Erode or Dilate
        False,                   # Invert Mask
    ]
    for _ in range(n_enhance):
        args.extend(enhance_slot)

    return args, _build_payload_debug(req, image_anchor_active, anchor_image, normalized_anchor_path)


def _run_task(req: TextToImgRequest) -> dict:
    """Submit task to Fooocus worker and wait for results. No Gradio involved."""
    # --- Preflight: fail-fast if strong preservation is requested but anchor is invalid ---
    if _is_strong_preservation(req):
        anchor_path = req.anchor_image_path
        if not anchor_path:
            return {
                "status": "PREFLIGHT_FAIL",
                "error": "STRONG_PRESERVATION_REQUIRES_ANCHOR_IMAGE",
                "reason": "preservation_mode is strong_preservation but anchor_image_path is missing",
                "machine_code": "PREFLIGHT_ANCHOR_MISSING",
            }
        normalized = os.path.abspath(anchor_path)
        if not os.path.isfile(normalized):
            return {
                "status": "PREFLIGHT_FAIL",
                "error": "STRONG_PRESERVATION_ANCHOR_NOT_FOUND",
                "reason": f"preservation_mode is strong_preservation but anchor image not found on disk: {normalized}",
                "machine_code": "PREFLIGHT_ANCHOR_NOT_FOUND",
            }

    args, debug_payload = _build_args(req)
    if req.dry_run:
        return {
            "status": "dry_run_ok",
            "bridge_payload_debug": debug_payload,
        }
    task = async_worker.AsyncTask(args)

    start_t = time.time()
    print(f"[BRIDGE] Render start: prompt='{req.prompt[:80]}', seed={req.seed}, "
          f"aspect={_match_aspect(req.width, req.height)}")

    # Push task to worker queue
    async_worker.async_tasks.append(task)

    # Wait for task completion (yields ends with ['finish', results])
    timeout = 900  # 15 min max
    deadline = time.time() + timeout
    while time.time() < deadline:
        if len(task.yields) > 0:
            last = task.yields[-1]
            if isinstance(last, (list, tuple)) and len(last) >= 1 and last[0] == "finish":
                break
        time.sleep(0.5)
    else:
        raise RuntimeError(f"Render timeout after {timeout}s")

    elapsed = time.time() - start_t
    print(f"[BRIDGE] Render end: {elapsed:.1f}s")

    # Extract results — task.results contains image paths from save_and_log()
    # The last yield is ['finish', results_list]
    finish_yield = task.yields[-1]
    result_paths = finish_yield[1] if len(finish_yield) > 1 else []

    if not result_paths:
        raise RuntimeError("Fooocus produced no output images")

    # Build response: encode each image as base64
    images = []
    for img_path in result_paths:
        img_path = str(img_path)
        if not os.path.isfile(img_path):
            print(f"[BRIDGE] Warning: result path not found: {img_path}")
            continue
        actual_width = None
        actual_height = None
        try:
            with open(img_path, "rb") as img_reader:
                header = img_reader.read(24)
                if header[:8] == b"\x89PNG\r\n\x1a\n" and header[12:16] == b"IHDR":
                    actual_width, actual_height = struct.unpack(">II", header[16:24])
        except Exception as dim_err:
            print(f"[BRIDGE] Failed to read PNG size for {img_path}: {dim_err}")
        with open(img_path, "rb") as f:
            img_b64 = base64.b64encode(f.read()).decode()
        response_item = {
            "base64": img_b64,
            "url": img_path,
            "seed": task.seed if hasattr(task, "seed") else req.seed,
            "finish_reason": "SUCCESS",
            "steps": req.steps if req.steps > 0 else None,
            "meta": {
                "requested_width": req.width,
                "requested_height": req.height,
                "requested_steps": req.steps,
                "disable_refiner": req.disable_refiner,
                "performance_selection": req.performance_selection,
                "guidance_scale": req.guidance_scale,
                "sampler": req.sampler,
                "scheduler": req.scheduler,
                "sharpness": req.sharpness,
                "generation_mode": req.generation_mode,
                "reproduction_anchor_mode": req.reproduction_anchor_mode,
                "anchor_image_path": debug_payload["anchor_image_path"],
                "anchor_method_used": debug_payload["anchor_method_used"],
                "image_anchor_success_expected": debug_payload["image_anchor_success_expected"],
            },
            "advanced_params": {
                "steps": req.steps if req.steps > 0 else None,
                "sampler": req.sampler,
                "scheduler": req.scheduler,
                "uov_method": debug_payload["uov_method"],
                "mixing_image_prompt_and_vary_upscale": debug_payload["mixing_image_prompt_and_vary_upscale"],
                "overwrite_vary_strength": debug_payload["overwrite_vary_strength"],
            },
            "image_info": {
                "width": actual_width or req.width,
                "height": actual_height or req.height,
                "steps": req.steps if req.steps > 0 else None,
                "sampler": req.sampler,
                "scheduler": req.scheduler,
                "actual_file_width": actual_width,
                "actual_file_height": actual_height,
            },
            "bridge_payload_debug": debug_payload,
        }
        images.append(response_item)
        print(f"[BRIDGE] Output file: {img_path}")
        print(f"[BRIDGE] Response body: {str(response_item)[:1200]}")
        print(f"[BRIDGE] Metadata fields present: steps={'steps' in response_item}, meta={'meta' in response_item}, advanced_params={'advanced_params' in response_item}, image_info={'image_info' in response_item}")

    if not images:
        raise RuntimeError("All result files missing from disk")

    return images


# ---------------------------------------------------------------------------
# REST endpoints
# ---------------------------------------------------------------------------

@app.post("/v1/generation/text-to-img")
async def text_to_img(req: TextToImgRequest):
    """Direct pipeline call — no Gradio."""
    import asyncio
    try:
        result = await asyncio.get_event_loop().run_in_executor(None, lambda: _run_task(req))
        return JSONResponse(content=result)
    except Exception as e:
        traceback.print_exc()
        raise HTTPException(status_code=502, detail=f"Fooocus pipeline error: {str(e)}")


@app.post("/generate")
async def generate(req: TextToImgRequest):
    """Alias endpoint for local orchestrator clients."""
    return await text_to_img(req)


@app.post("/v1/generation/stop")
async def stop_generation():
    """Signal current task to stop and clear the queue."""
    stopped = 0
    for task in async_worker.async_tasks:
        task.last_stop = True
        stopped += 1
    # Clear the deque to prevent queued tasks from running
    async_worker.async_tasks.clear()
    return {"status": "stopped", "tasks_stopped": stopped}


@app.get("/v1/generation/queue-status")
async def queue_status():
    """Return current queue status for diagnostics."""
    return {
        "queue_length": len(async_worker.async_tasks),
        "output_dir": fooocus_config.path_outputs,
    }


# ---------------------------------------------------------------------------
# Main
# ---------------------------------------------------------------------------

if __name__ == "__main__":
    print(f"[BRIDGE] Starting Fooocus Direct Bridge on :{BRIDGE_PORT}")
    print(f"[BRIDGE] Mode: internal pipeline (no Gradio)")
    print(f"[BRIDGE] Output dir: {fooocus_config.path_outputs}")
    uvicorn.run(app, host="0.0.0.0", port=BRIDGE_PORT, log_level="info")
