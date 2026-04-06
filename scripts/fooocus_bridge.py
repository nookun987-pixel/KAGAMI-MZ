"""

MIKAGE — Fooocus Direct Bridge (No Gradio)

Calls Fooocus internal pipeline directly via AsyncTask.



Start:

  cd /workspace/KAGAMI-MZ && python scripts/fooocus_bridge.py



Fooocus engine loads in-process — no separate Fooocus UI needed.

"""



import base64

import io

import os

import sys

import time

import threading

import traceback

import struct

import faulthandler

import numpy as np

from PIL import Image



# --- CRASH CAPTURE: enable faulthandler for segfault tracebacks ---

_CRASH_LOG = os.path.join(os.path.dirname(os.path.abspath(__file__)), "..", "runs", "bridge_crash.log")

os.makedirs(os.path.dirname(_CRASH_LOG), exist_ok=True)

_crash_fh = open(_CRASH_LOG, "w")

faulthandler.enable(file=_crash_fh)

print(f"[BRIDGE] Crash log enabled: {os.path.abspath(_CRASH_LOG)}")



def _log_crash(msg):

    """Write crash info to file before process dies."""

    try:

        with open(_CRASH_LOG, "a") as f:

            f.write(f"[{time.strftime('%Y-%m-%d %H:%M:%S')}] {msg}\n")

    except:

        pass



def _global_excepthook(exc_type, exc_value, exc_tb):

    tb_str = "".join(traceback.format_exception(exc_type, exc_value, exc_tb))

    _log_crash(f"UNHANDLED EXCEPTION:\n{tb_str}")

    print(f"[BRIDGE] FATAL UNHANDLED EXCEPTION:\n{tb_str}", file=sys.stderr)

    sys.__excepthook__(exc_type, exc_value, exc_tb)



sys.excepthook = _global_excepthook



def _thread_excepthook(args):

    tb_str = "".join(traceback.format_exception(args.exc_type, args.exc_value, args.exc_traceback))

    _log_crash(f"THREAD CRASH ({args.thread}):\n{tb_str}")

    print(f"[BRIDGE] THREAD CRASH ({args.thread}):\n{tb_str}", file=sys.stderr)



threading.excepthook = _thread_excepthook



# ---------------------------------------------------------------------------

# Bootstrap Fooocus — must happen BEFORE importing Fooocus modules

# ---------------------------------------------------------------------------



FOOOCUS_ROOT = os.environ.get("FOOOCUS_ROOT", "/workspace/Fooocus")

BRIDGE_PORT = int(os.environ.get("FOOOCUS_BRIDGE_PORT", "7865"))

FOOOCUS_MODEL = os.environ.get("FOOOCUS_MODEL", "realvisxlV50_v40Bakedvae.safetensors")



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

# Worker thread management — capture ref so we can check alive / restart

# ---------------------------------------------------------------------------



def _find_worker_thread():

    """Find the Fooocus worker daemon thread by scanning all threads."""

    for t in threading.enumerate():

        if t.daemon and t.is_alive() and 'worker' in t.name.lower():

            return t

    # Fallback: any alive daemon thread that isn't MainThread

    for t in threading.enumerate():

        if t.daemon and t.is_alive() and t.name != 'MainThread':

            return t

    return None



_worker_thread = _find_worker_thread()

if _worker_thread:

    print(f"[BRIDGE] Worker thread captured: {_worker_thread.name}, alive={_worker_thread.is_alive()}")

else:

    print(f"[BRIDGE] WARNING: Could not find worker thread after Fooocus import")





def _ensure_worker_alive() -> bool:

    """Check if the Fooocus worker thread is alive. If dead, attempt restart."""

    global _worker_thread

    if _worker_thread and _worker_thread.is_alive():

        return True

    # Try to find it again (maybe it started late)

    _worker_thread = _find_worker_thread()

    if _worker_thread and _worker_thread.is_alive():

        print(f"[BRIDGE] Worker thread re-found: {_worker_thread.name}")

        return True

    # Worker is dead — attempt restart

    print(f"[BRIDGE] Worker thread DEAD. Attempting restart...")

    _log_crash("WORKER_DEAD: attempting restart")

    try:

        import importlib

        importlib.reload(async_worker)

        time.sleep(2)

        _worker_thread = _find_worker_thread()

        if _worker_thread and _worker_thread.is_alive():

            print(f"[BRIDGE] Worker thread RESTARTED: {_worker_thread.name}")

            return True

        else:

            print(f"[BRIDGE] Worker restart FAILED — no alive thread found")

            return False

    except Exception as e:

        print(f"[BRIDGE] Worker restart EXCEPTION: {e}")

        traceback.print_exc()

        return False



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

    base_model: str = FOOOCUS_MODEL

    generation_mode: str = "exploration"

    reference_master: dict | None = None

    reproduction_constraints: dict | None = None

    reproduction_anchor_mode: str | None = None

    anchor_image_path: str | None = None

    anchor_image_base64: str | None = None

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

    # LoRA support

    lora_name: str | None = None

    lora_weight: float = 0.7





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





def _load_anchor_image_from_base64(base64_string: str | None, original_path: str | None):

    """Load anchor image from base64 string. Returns (numpy_array, path_or_identifier)."""

    if not base64_string:

        return None, None

    try:

        # Handle data URI format (data:image/png;base64,...)

        if base64_string.startswith('data:'):

            base64_string = base64_string.split(',')[1]

        

        image_bytes = base64.b64decode(base64_string)

        image = Image.open(io.BytesIO(image_bytes)).convert("RGB")

        print(f"[BRIDGE] REAL IMAGE LOADED FROM BASE64: shape={image.size}, path_ref={original_path}")

        return np.array(image), (original_path or "base64_embedded")

    except Exception as e:

        print(f"[BRIDGE] BASE64 LOAD FAILED: {e}")

        return None, None





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



    # --- FORCE IMG2IMG if base64 payload exists ---

    has_base64 = bool(req.anchor_image_base64 and len(req.anchor_image_base64 or "") > 100)

    has_local_file = bool(req.anchor_image_path) and os.path.isfile(os.path.abspath(req.anchor_image_path))

    image_anchor_active = has_base64 or (has_local_file and _is_image_anchored_reproduction(req))

    strong = _is_strong_preservation(req) if image_anchor_active else False



    print(f"[BRIDGE] IMG2IMG ACTIVE: {image_anchor_active}")

    print(f"[BRIDGE] has_base64: {has_base64}, has_local_file: {has_local_file}")

    print(f"[BRIDGE] anchor_image_path: {req.anchor_image_path}")



    # --- LOAD IMAGE: Prefer base64, fallback to local file ---

    anchor_image = None

    normalized_anchor_path = None



    if image_anchor_active and has_base64:

        anchor_image, normalized_anchor_path = _load_anchor_image_from_base64(

            req.anchor_image_base64, req.anchor_image_path

        )

        if anchor_image is not None:

            print(f"[BRIDGE] IMG2IMG loaded from base64: shape={anchor_image.shape}")



    if image_anchor_active and anchor_image is None and has_local_file:

        anchor_image, normalized_anchor_path = _load_anchor_image(req.anchor_image_path)

        if anchor_image is not None:

            print(f"[BRIDGE] IMG2IMG loaded from file: {normalized_anchor_path}")



    if image_anchor_active and anchor_image is None:

        raise ValueError("IMG2IMG BRIDGE FAIL: no usable input image from base64 or file path")



    print(f"[BRIDGE] ARGS_HAS_IMAGE: {anchor_image is not None}")



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



    # current_tab: "uov" for simple img2img (vary), "ip" only when strong preservation needs ControlNet

    use_ip_tab = image_anchor_active and strong



    print(f"[BRIDGE] IMG2IMG ACTIVE: {image_anchor_active}")

    print(f"[BRIDGE] ARGS_HAS_IMAGE: {anchor_image is not None}")

    print(f"[BRIDGE] current_tab: {'ip' if use_ip_tab else 'uov'}")

    print(f"[BRIDGE] uov_method: {fooocus_flags.subtle_variation if image_anchor_active else fooocus_flags.disabled}")

    print(f"[BRIDGE] eff_denoise: {eff_denoise}")

    print(f"[BRIDGE] mixing_ip_vary: {use_ip_tab}")

    print(f"[BRIDGE] strong: {strong}")



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

        req.base_model,                         # [12] Base Model

        "None" if req.disable_refiner else "None",  # [13] Refiner

        0.5,                                # [14] Refiner Switch At

    ]



    # LoRA slots (enabled, name, weight) × n_loras

    # First slot uses request lora_name/lora_weight if provided

    lora_configs = []

    if req.lora_name:

        lora_configs.append([True, req.lora_name, req.lora_weight])

    # Fill remaining slots with disabled

    for _ in range(n_loras - len(lora_configs)):

        lora_configs.append([False, "None", 1.0])

    for enabled, name, weight in lora_configs[:n_loras]:

        args.extend([enabled, name, weight])



    # Image input block

    args.extend([

        image_anchor_active,          # Input Image checkbox

        "ip" if use_ip_tab else "uov",  # current_tab

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

        use_ip_tab,                   # Mixing Image Prompt and Vary/Upscale (only when IP tab)

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

    _log_crash(f"_run_task ENTER: prompt={req.prompt[:80]}")

    print(f"[BRIDGE] entering _run_task")

    print(f"[BRIDGE] img2img: {req.anchor_image_base64 is not None and len(req.anchor_image_base64 or '') > 100}")

    print(f"[BRIDGE] anchor_image_path: {req.anchor_image_path}")

    print(f"[BRIDGE] generation_mode: {req.generation_mode}")

    print(f"[BRIDGE] denoise_strength: {req.denoise_strength}")



    # --- Preflight: fail-fast if strong preservation is requested but anchor is invalid ---

    if _is_strong_preservation(req):

        anchor_path = req.anchor_image_path

        if not anchor_path:

            print(f"[BRIDGE] PREFLIGHT_FAIL: anchor_image_path missing for strong_preservation")

            return {

                "success": False,

                "error": "STRONG_PRESERVATION_REQUIRES_ANCHOR_IMAGE",

            }

        normalized = os.path.abspath(anchor_path)

        if not os.path.isfile(normalized):

            print(f"[BRIDGE] PREFLIGHT_FAIL: anchor not found on disk: {normalized}")

            return {

                "success": False,

                "error": f"STRONG_PRESERVATION_ANCHOR_NOT_FOUND: {normalized}",

            }



    print(f"[BRIDGE] building args...")

    try:

        args, debug_payload = _build_args(req)

    except Exception as build_err:

        print(f"[BRIDGE] _build_args CRASHED: {build_err}")

        traceback.print_exc()

        return {"success": False, "error": f"BUILD_ARGS_FAILED: {build_err}"}

    print(f"[BRIDGE] args built: {len(args)} elements")



    if req.dry_run:

        return {

            "status": "dry_run_ok",

            "bridge_payload_debug": debug_payload,

        }



    print(f"[BRIDGE] TASK CREATING...")

    try:

        task = async_worker.AsyncTask(args)

    except Exception as task_err:

        print(f"[BRIDGE] AsyncTask() CRASHED: {task_err}")

        traceback.print_exc()

        return {"success": False, "error": f"ASYNC_TASK_INIT_FAILED: {task_err}"}

    print(f"[BRIDGE] TASK CREATED: type={type(task).__name__}, "

          f"has_yields={hasattr(task, 'yields')}, "

          f"has_results={hasattr(task, 'results')}")



    # --- WORKER ALIVE CHECK (fail-fast) ---

    worker_ok = _ensure_worker_alive()

    print(f"[BRIDGE] WORKER STATUS: alive={worker_ok}, thread={_worker_thread}")

    if not worker_ok:

        msg = "WORKER_THREAD_DEAD: Fooocus worker not running. Cannot process render."

        print(f"[BRIDGE] FATAL: {msg}")

        _log_crash(msg)

        return {"success": False, "error": msg}



    start_t = time.time()

    queue_len_before = len(async_worker.async_tasks)

    async_worker.async_tasks.append(task)

    queue_len_after = len(async_worker.async_tasks)

    print(f"[BRIDGE] TASK QUEUED: queue {queue_len_before} -> {queue_len_after}, "

          f"queue id={id(async_worker.async_tasks)}")

    _log_crash(f"TASK QUEUED: queue {queue_len_before} -> {queue_len_after}")



    # --- FAIL-FAST: if worker doesn't pop within 30s, hard error ---

    WORKER_POP_TIMEOUT = 30

    pop_deadline = time.time() + WORKER_POP_TIMEOUT

    while time.time() < pop_deadline:

        if len(task.yields) > 0:

            break  # Worker started processing (produced a yield)

        if task not in async_worker.async_tasks:

            break  # Worker popped it from queue

        time.sleep(0.5)

    else:

        # Check if task is still in queue (never popped)

        still_queued = task in async_worker.async_tasks

        _wref2 = getattr(async_worker, '_worker_thread_ref', None)

        alive2 = _wref2.is_alive() if _wref2 else False

        msg = (f"WORKER_POP_TIMEOUT: task not picked up in {WORKER_POP_TIMEOUT}s. "

               f"still_in_queue={still_queued}, queue_len={len(async_worker.async_tasks)}, "

               f"worker_alive={alive2}")

        print(f"[BRIDGE] FATAL: {msg}")

        _log_crash(msg)

        # Remove stale task

        if still_queued:

            try: async_worker.async_tasks.remove(task)

            except: pass

        return {"success": False, "error": msg}



    print(f"[BRIDGE] Worker picked up task in {time.time()-start_t:.1f}s")



    # Wait for task completion (yields ends with ['finish', results])

    timeout = 900  # 15 min max

    deadline = time.time() + timeout

    poll_count = 0

    while time.time() < deadline:

        if len(task.yields) > 0:

            last = task.yields[-1]

            if isinstance(last, (list, tuple)) and len(last) >= 1 and last[0] == "finish":

                print(f"[BRIDGE] FINISH DETECTED at poll {poll_count}, elapsed={time.time()-start_t:.1f}s")

                break

            poll_count += 1

            if poll_count % 20 == 0:

                elapsed_so_far = time.time() - start_t

                print(f"[BRIDGE] WAIT LOOP poll={poll_count}, yields={len(task.yields)}, "

                      f"last_type={type(last).__name__}, "

                      f"last_preview={str(last)[:120]}, "

                      f"elapsed={elapsed_so_far:.0f}s")

        else:

            poll_count += 1

            if poll_count % 20 == 0:

                print(f"[BRIDGE] WAIT LOOP poll={poll_count}, yields=0, "

                      f"queue_len={len(async_worker.async_tasks)}, elapsed={time.time()-start_t:.0f}s")

        time.sleep(0.5)

    else:

        print(f"[BRIDGE] TIMEOUT after {timeout}s, yields={len(task.yields)}")

        for i, y in enumerate(task.yields[-10:]):

            print(f"[BRIDGE] TIMEOUT yield[{i}]: {str(y)[:200]}")

        return {"success": False, "error": f"RENDER_TIMEOUT_{timeout}s"}



    elapsed = time.time() - start_t

    print(f"[BRIDGE] render done: {elapsed:.1f}s, total_yields={len(task.yields)}")

    _log_crash(f"RENDER DONE: {elapsed:.1f}s, yields={len(task.yields)}")



    # Extract results

    finish_yield = task.yields[-1]

    finish_results = finish_yield[1] if isinstance(finish_yield, (list, tuple)) and len(finish_yield) > 1 else []

    print(f"[BRIDGE] FINISHED YIELD: type={type(finish_yield).__name__}, "

          f"len={len(finish_yield) if isinstance(finish_yield, (list, tuple)) else 'N/A'}, "

          f"results_count={len(finish_results)}")



    # Also check task.results directly (worker sets this before yielding finish)

    task_results = getattr(task, 'results', None)

    print(f"[BRIDGE] task.results: type={type(task_results).__name__ if task_results is not None else 'None'}, "

          f"len={len(task_results) if task_results else 0}, "

          f"value={[str(r)[:100] for r in (task_results or [])[:3]]}")



    result_paths = finish_results if finish_results else (task_results or [])

    print(f"[BRIDGE] RESULT_PATHS: {[str(p) for p in result_paths]}")

    _log_crash(f"RESULT_PATHS: {[str(p) for p in result_paths]}")



    if not result_paths:

        # Dump ALL yields for full diagnosis

        print(f"[BRIDGE] TASK_NOT_EXECUTED — dumping all {len(task.yields)} yields:")

        for i, y in enumerate(task.yields):

            if isinstance(y, (list, tuple)):

                tag = y[0] if y else "empty"

                detail = str(y[1])[:150] if len(y) > 1 else "no-detail"

                print(f"[BRIDGE]   yield[{i}]: tag={tag}, detail={detail}")

            else:

                print(f"[BRIDGE]   yield[{i}]: {str(y)[:200]}")

        return {"success": False, "error": "TASK_NOT_EXECUTED"}



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

        _log_crash("FAIL: All result files missing from disk")

        raise RuntimeError("All result files missing from disk")



    _log_crash(f"SUCCESS: returning {len(images)} image(s)")

    return images





# ---------------------------------------------------------------------------

# REST endpoints

# ---------------------------------------------------------------------------



@app.post("/v1/generation/text-to-img")

async def text_to_img(req: TextToImgRequest):

    """Direct pipeline call — no Gradio."""

    import asyncio

    img2img_active = _is_image_anchored_reproduction(req)

    print(f"[BRIDGE] REQUEST RECEIVED: generation_mode={req.generation_mode}, "

          f"img2img={img2img_active}, "

          f"anchor_path={req.anchor_image_path}, "

          f"base64_present={bool(req.anchor_image_base64)}, "

          f"base64_len={len(req.anchor_image_base64) if req.anchor_image_base64 else 0}")

    try:

        result = await asyncio.get_event_loop().run_in_executor(None, lambda: _run_task(req))

        # Ensure response always has image_base64 at top level for executor compatibility

        if isinstance(result, list) and len(result) > 0 and "base64" in result[0]:

            print(f"[BRIDGE] GENERATION DONE: {len(result)} image(s), "

                  f"base64_len={len(result[0]['base64'])}")

        else:

            print(f"[BRIDGE] GENERATION DONE: result_type={type(result).__name__}, "

                  f"keys={list(result.keys()) if isinstance(result, dict) else 'N/A'}")

        return JSONResponse(content=result)

    except Exception as e:

        traceback.print_exc()

        error_detail = f"Fooocus pipeline error: {str(e)}"

        _log_crash(f"GENERATION EXCEPTION: {error_detail}\n{traceback.format_exc()}")

        print(f"[BRIDGE] GENERATION FAILED: {error_detail}")

        return JSONResponse(

            status_code=500,

            content={"success": False, "error": error_detail},

        )





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





@app.get("/worker-status")

async def worker_status():

    """Diagnostic endpoint: check if Fooocus worker thread is alive."""

    alive = _worker_thread.is_alive() if _worker_thread else False

    thread_name = _worker_thread.name if _worker_thread else None

    daemon_threads = [

        {"name": t.name, "alive": t.is_alive(), "daemon": t.daemon}

        for t in threading.enumerate() if t.daemon

    ]

    return {

        "worker_alive": alive,

        "worker_thread": thread_name,

        "queue_length": len(async_worker.async_tasks),

        "daemon_threads": daemon_threads,

        "model": FOOOCUS_MODEL,

        "output_dir": fooocus_config.path_outputs,

    }





# ---------------------------------------------------------------------------

# Main

# ---------------------------------------------------------------------------



if __name__ == "__main__":

    print(f"[BRIDGE] Starting Fooocus Direct Bridge on :{BRIDGE_PORT}")

    print(f"[BRIDGE] Mode: internal pipeline (no Gradio)")

    print(f"[BRIDGE] Base model: {FOOOCUS_MODEL}")

    print(f"[BRIDGE] Output dir: {fooocus_config.path_outputs}")

    uvicorn.run(app, host="0.0.0.0", port=BRIDGE_PORT, log_level="info")

