"""
MIKAGE PIPELINE — render_handler.py
Calls Fooocus proxy (port 7866) and saves rendered image to job directory.
"""

import logging
import shutil
import requests
from pathlib import Path
from typing import Optional

from .config import FOOOCUS_PROXY_URL

log = logging.getLogger("mikage.render")


def render(prompt: str, negative_prompt: str, params: dict, job_dir: Path) -> dict:
    """
    Call Fooocus proxy to generate image.

    Args:
        prompt: Positive prompt
        negative_prompt: Negative prompt
        params: Render params (image_number, guidance_scale, etc.)
        job_dir: Path to save output (e.g. runs/job_123/)

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
        "styles": params.get("styles", ["Fooocus V2", "Fooocus Enhance", "Fooocus Sharp"]),
        "performance": params.get("performance", "Quality"),
        "aspect_ratios": params.get("aspect_ratios", "1152\u00d7896"),
        "base_model": params.get("base_model", "juggernautXL_v8Rundiffusion.safetensors"),
    }

    url = f"{FOOOCUS_PROXY_URL}/generate"
    log.info(f"Render: POST {url}")
    log.info(f"  prompt: {prompt[:100]}...")

    try:
        resp = requests.post(url, json=payload, timeout=900)  # 15 min max

        if resp.status_code != 200:
            error_detail = resp.text[:500]
            log.error(f"Proxy returned {resp.status_code}: {error_detail}")
            return {
                "status": "fail",
                "error": f"Proxy HTTP {resp.status_code}",
                "detail": error_detail,
            }

        result = resp.json()

        if result.get("status") != "success":
            log.error(f"Proxy returned fail: {result.get('error', 'unknown')}")
            return result

        # ── Extract and save image ──
        images = result.get("images", [])
        if not images:
            return {"status": "fail", "error": "No images in proxy response"}

        # First image is the hero frame
        src_path = images[0]
        output_path = job_dir / "output.png"

        if src_path.startswith("http"):
            # Download from URL
            img_resp = requests.get(src_path, timeout=60)
            if img_resp.status_code == 200:
                output_path.write_bytes(img_resp.content)
                log.info(f"  Saved from URL: {output_path}")
            else:
                return {"status": "fail", "error": f"Failed to download image from {src_path}"}
        else:
            # Local file path from Fooocus — might be on same machine
            src = Path(src_path)
            if src.exists():
                shutil.copy2(src, output_path)
                log.info(f"  Copied: {src} -> {output_path}")
            else:
                # Fooocus returns paths relative to its own filesystem
                # Try fetching via proxy's /file endpoint if available
                log.warning(f"  Source file not found locally: {src_path}")
                # Store the path reference anyway
                output_path = None

        if output_path and output_path.exists():
            return {
                "status": "success",
                "output_path": str(output_path),
                "all_images": images,
                "duration": result.get("total_seconds", 0),
            }
        else:
            return {
                "status": "success",
                "output_path": src_path,  # Return Fooocus path as fallback
                "all_images": images,
                "duration": result.get("total_seconds", 0),
                "note": "Image at Fooocus path, not copied to job dir",
            }

    except requests.Timeout:
        return {"status": "fail", "error": "Render timeout (15 min)"}
    except requests.ConnectionError:
        return {"status": "fail", "error": f"Cannot connect to proxy at {FOOOCUS_PROXY_URL}. Is it running?"}
    except Exception as e:
        log.error(f"Render exception: {e}")
        return {"status": "fail", "error": str(e)}
