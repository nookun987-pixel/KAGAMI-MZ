"""
MIKAGE PIPELINE — render_handler.py
Calls Fooocus Direct Bridge (port 7865) and saves rendered image to job directory.
"""

import logging
import shutil
import requests
from pathlib import Path

from .config import FOOOCUS_BRIDGE_URL

log = logging.getLogger("mikage.render")


def _extract_images_from_bridge_result(result):
    """
    Bridge returns a LIST of image objects, not proxy-style:
      [
        {
          "base64": "...",              # optional
          "url": "/abs/or/rel/path",    # optional
          "file_path": "/abs/path",     # optional
          "path": "/abs/path",          # optional
          ...
        }
      ]
    """
    if isinstance(result, list):
        return result
    if isinstance(result, dict):
        if isinstance(result.get("images"), list):
            return result["images"]
        if isinstance(result.get("results"), list):
            return result["results"]
        if isinstance(result.get("data"), list):
            return result["data"]
    return []


def _extract_first_image_ref(image_item):
    if not isinstance(image_item, dict):
        return None, None

    if image_item.get("base64"):
        return "base64", image_item["base64"]

    for key in ("file_path", "path", "url", "filename", "file_name", "output_file"):
        value = image_item.get(key)
        if value:
            return "path", value

    return None, None


def render(prompt: str, negative_prompt: str, params: dict, job_dir: Path) -> dict:
    """
    Call Fooocus Direct Bridge to generate image.

    Args:
        prompt: Positive prompt
        negative_prompt: Negative prompt
        params: Render params
        job_dir: Path to save output

    Returns:
        {"status": "success"/"fail", "output_path": str, ...}
    """
    job_dir.mkdir(parents=True, exist_ok=True)

    payload = {
        "prompt": prompt,
        "negative_prompt": negative_prompt,
        "image_number": params.get("image_number", 1),
        "seed": params.get("seed", -1),
        "guidance_scale": params.get("guidance_scale", 4.0),
        "sharpness": params.get("sharpness", 2.0),
        "style_selections": params.get("styles", ["Fooocus V2", "Fooocus Enhance", "Fooocus Sharp"]),
        "performance_selection": params.get("performance", "Quality"),
        "width": params.get("width", 1152),
        "height": params.get("height", 896),
        "steps": params.get("steps", -1),
        "sampler": params.get("sampler"),
        "scheduler": params.get("scheduler"),
        "disable_refiner": params.get("disable_refiner", False),
        "base_model": params.get("base_model", "juggernautXL_v8Rundiffusion.safetensors"),
    }

    url = f"{FOOOCUS_BRIDGE_URL}/generate"
    log.info(f"Render: POST {url}")
    log.info(f"  prompt: {prompt[:100]}...")

    try:
        resp = requests.post(url, json=payload, timeout=900)

        if resp.status_code != 200:
            error_detail = resp.text[:500]
            log.error(f"Bridge returned {resp.status_code}: {error_detail}")
            return {
                "status": "fail",
                "error": f"Bridge HTTP {resp.status_code}",
                "detail": error_detail,
            }

        result = resp.json()
        images = _extract_images_from_bridge_result(result)

        if not images:
            log.error("Bridge returned no image results")
            return {
                "status": "fail",
                "error": "No images in bridge response",
                "detail": str(result)[:500],
            }

        first = images[0]
        ref_type, ref_value = _extract_first_image_ref(first)
        output_path = job_dir / "output.png"

        if ref_type == "base64":
            import base64
            output_path.write_bytes(base64.b64decode(ref_value))
            log.info(f"  Saved from base64: {output_path}")

        elif ref_type == "path":
            src = Path(ref_value)
            if src.exists():
                shutil.copy2(src, output_path)
                log.info(f"  Copied: {src} -> {output_path}")
            else:
                log.warning(f"  Source file not found locally: {ref_value}")
                return {
                    "status": "fail",
                    "error": f"Bridge returned non-local path: {ref_value}",
                    "all_images": images,
                }

        else:
            return {
                "status": "fail",
                "error": "Bridge returned image result without usable file/base64 reference",
                "all_images": images,
            }

        if output_path.exists():
            return {
                "status": "success",
                "output_path": str(output_path),
                "all_images": images,
                "duration": 0,
            }

        return {
            "status": "fail",
            "error": f"Output image not saved to job directory",
            "all_images": images,
        }

    except requests.Timeout:
        return {"status": "fail", "error": "Render timeout (15 min)"}
    except requests.ConnectionError:
        return {"status": "fail", "error": f"Cannot connect to bridge at {FOOOCUS_BRIDGE_URL}. Is it running?"}
    except Exception as e:
        log.error(f"Render exception: {e}")
        return {"status": "fail", "error": str(e)}