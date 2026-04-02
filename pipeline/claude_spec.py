"""
MIKAGE PIPELINE — claude_spec.py v4
FIXES:
1. WHITE PORCELAIN is FIRST priority — model sees it before crimson
2. Crimson restricted with "ONLY at thin crack seam, nowhere else"
3. Matte B4C micro-texture enforced, anti-gloss
4. Negative ép "full red mask, glossy surface" cực mạnh

Prompt hierarchy (order matters for SDXL attention):
  [1] MATERIAL (white porcelain, matte, texture) ← HIGHEST WEIGHT
  [2] SUBJECT (kitsune mask, geometry)
  [3] BACKGROUND (Sumi black)
  [4] LIGHTING (chiaroscuro, shadows)
  [5] CRIMSON (thin seam ONLY) ← LOWEST WEIGHT, most restricted
"""

import logging
from .canon_rules import detect_lane, LANES

log = logging.getLogger("mikage.claude_spec")

# ──────────────────────────────────────────────
# MATERIAL FIRST (highest attention priority)
# ──────────────────────────────────────────────
MATERIAL_CERAMIC = (
    "(matte white porcelain ceramic:1.5), (boron carbide B4C ceramic surface:1.4), "
    "(micro-pitted matte surface with sub-micron grain:1.3), "
    "anisotropic micro-shadowing on ceramic, light-absorbing matte finish, "
    "Shino glaze crawling texture, carbon trapping spots, fine pinholes, "
    "orange-peel specularity, subsurface scattering, "
    "Gofun calcium-carbonate warm off-white (#EEE7D7), "
    "Keshiki surface landscape with mineral grain variation, "
    "(NOT glossy:1.3), (NOT smooth:1.3), (NOT polished:1.3), (NOT reflective:1.3)"
)

MATERIAL_METAL = (
    "(dark rusty oxidized titanium:1.4), (industrial scrap metal surface:1.3), "
    "forge scale texture, hammer marks, pitting corrosion, "
    "soot residue deposit, mineral grain on metal, "
    "Keshiki surface with rust patina variation, "
    "(NOT clean:1.3), (NOT polished:1.3), (NOT chrome:1.3)"
)

# ──────────────────────────────────────────────
# BACKGROUND (Sumi/Gofun hex-anchored)
# ──────────────────────────────────────────────
BG_OBSIDIAN = (
    "(dark background:1.4), (ink black background #252321:1.3), "
    "Sumi ink darkness with warm undertone, "
    "soot residue texture, charcoal grain noise, Yakisugi burnt cedar depth"
)

BG_GOFUN = (
    "(warm off-white background #EEE7D7:1.3), "
    "Gofun calcium-carbonate matte warmth, plaster texture, mineral grain"
)

# ──────────────────────────────────────────────
# SHADOW (In'ei Reisan)
# ──────────────────────────────────────────────
INEI_SHADOW = (
    "(dramatic deep shadows:1.4), (tenebrism chiaroscuro 4:1:1.3), "
    "(70 percent shadow volume:1.2), "
    "single dominant light from 45 degrees, "
    "Sumi ink shadow with Gosai temperature shift"
)

# ──────────────────────────────────────────────
# CRIMSON — LOWEST PRIORITY, MOST RESTRICTED
# ──────────────────────────────────────────────
CRIMSON_SEAM_MASK = (
    "(crimson seams ONLY at panel joints:1.4), (NOT on face surface:1.5), "
    "(structural crack lines between armor plates:1.3), "
    "(very thin dark red hairline at mask crack seam only:1.1), "
    "Bengala iron oxide #8E050F pigment visible only at structural fracture lines, "
    "crimson emission strictly localized to micro-fracture seams and nowhere else on the mask surface, "
    "the mask body is white porcelain not red"
)

CRIMSON_SEAM_WEAPON = (
    "(deep crimson heated core #8E050F to #9D2933:1.3), "
    "Bengala iron oxide energy veins along blade spine only, "
    "ferro-calcium bone core emitting dark red heat, "
    "directional steam rising from crimson core"
)

CRIMSON_SEAM_CHARACTER = (
    "(crimson synthetic blood #8E050F at armor seams only:1.2), "
    "Bengala red at kintsugi fracture lines only, "
    "faint internal glow beneath porcelain, "
    "armor body remains white porcelain not red"
)

# ──────────────────────────────────────────────
# LANE SUBJECTS
# ──────────────────────────────────────────────
LANE_CONFIG = {
    "mask": {
        "subject": (
            "(porcelain kitsune mask:1.3), "
            "(NO human face:1.5), (NO nose:1.4), (NO lips:1.4), (NO cheeks:1.3), "
            "(engineered helmet geometry:1.4), (planar faceless mask:1.5), "
            "faceless, planar geometry, "
            "narrow horizontal eye slits, perfect bilateral symmetry, "
            "no mouth, no expression"
        ),
        "material": MATERIAL_CERAMIC,
        "crimson": CRIMSON_SEAM_MASK,
        "model": "juggernautXL_v8Rundiffusion.safetensors",
    },
    "weapon": {
        "subject": (
            "(Zenith Blade massive industrial straight sword:1.3), "
            "350kg heavy oversized thick rectangular block, "
            "strictly straight zero curvature"
        ),
        "material": MATERIAL_METAL,
        "crimson": CRIMSON_SEAM_WEAPON,
        "model": "juggernautXL_v8Rundiffusion.safetensors",
    },
    "character": {
        "subject": (
            "(Mikage Zenith mechanical cyborg:1.3), "
            "porcelain white armor shell, faceless kitsune helmet, "
            "void black optical sensors, long straight heavy black hair"
        ),
        "material": MATERIAL_CERAMIC,
        "crimson": CRIMSON_SEAM_CHARACTER,
        "model": "juggernautXL_v8Rundiffusion.safetensors",
    },
    "environment": {
        "subject": (
            "industrial brutalist interior, atmospheric haze, "
            "physical consequences visible (steam, concrete, acid rain)"
        ),
        "material": MATERIAL_METAL,
        "crimson": "(minimal crimson on active infrastructure seams only:1.0)",
        "model": "juggernautXL_v8Rundiffusion.safetensors",
    },
}

BASE_QUALITY = (
    "masterpiece, best quality, ultra detailed, photorealistic, "
    "8k uhd, RAW photo, studio photography, professional lighting, "
    "museum quality, negative space, clean composition, minimal, "
    "product photography, centered subject, sharp focus"
)

# ──────────────────────────────────────────────
# NEGATIVE — ANTI-CRIMSON-BLEED + ANTI-GLOSS
# ──────────────────────────────────────────────
BASE_NEGATIVE = (
    # Anti crimson bleed (HIGHEST priority in negative)
    "(full red mask:1.5), (red colored mask:1.5), (crimson mask:1.4), "
    "(red surface:1.4), (mask painted red:1.4), (red porcelain:1.3), "
    "(glowing red:1.3), (emissive red:1.3), (red body:1.3), "
    # Anti gloss
    "(glossy surface:1.4), (polished surface:1.4), (reflective coating:1.3), "
    "(shiny ceramic:1.3), (wet look:1.2), (resin:1.2), (lacquered:1.2), "
    "(smooth CG surface:1.3), "
    # Standard negative
    "human eyes, iris, pupil, sclera, facial expression, smile, frown, "
    "plastic, PVC, plaster, CGI, "
    "toon shading, cel shading, anime, cartoon, illustration, drawing, "
    "neon, RGB glow, cyberpunk, glitch, chromatic aberration, "
    "abstract, unrecognizable, blurry, noise, artifacts, "
    "watermark, logo, text, signature, "
    "bloom, lens flare, neon glow, "
    "low quality, worst quality, jpeg artifacts, "
    "deformed, distorted, asymmetric, "
    "sunny nature, bright background, "
    "(grey background:1.3), (mid-tone background:1.3), "
    "(pure white background:1.3), (pure black #000000:1.3), "
    "(flat uniform surface:1.3)"
)


def build_fooocus_spec(intake_spec: dict) -> dict:
    brief = intake_spec.get("prompt_seed", intake_spec.get("subject", ""))
    lane = detect_lane(brief)
    lc = LANE_CONFIG.get(lane, LANE_CONFIG["mask"])

    log.info(f"Lane detected: {lane}")

    # Background
    bg_raw = intake_spec.get("background", "obsidian")
    if "obsidian" in bg_raw.lower() or "dark" in bg_raw.lower() or "black" in bg_raw.lower():
        bg = BG_OBSIDIAN
    else:
        bg = BG_GOFUN

    # PROMPT ORDER MATTERS FOR SDXL:
    # Material FIRST (what the mask IS) → Subject → Background → Shadow → Quality → Crimson LAST
    full_prompt = ", ".join([
        lc["material"],      # [1] MATERIAL — highest attention
        lc["subject"],       # [2] SUBJECT
        bg,                  # [3] BACKGROUND
        INEI_SHADOW,         # [4] LIGHTING
        BASE_QUALITY,        # [5] QUALITY
        lc["crimson"],       # [6] CRIMSON — lowest, most restricted
    ])

    # Negative
    neg_hints = intake_spec.get("negative_hints", "")
    full_negative = f"{neg_hints}, {BASE_NEGATIVE}" if neg_hints else BASE_NEGATIVE

    params = {
        "image_number": 1,
        "guidance_scale": 7.0,
        "sharpness": 2.0,
        "performance": "Quality",
        "aspect_ratios": "1152\u00d7896",
        "styles": ["Fooocus V2", "Fooocus Enhance", "Fooocus Sharp"],
        "base_model": lc["model"],
        "seed": -1,
    }

    log.info(f"Spec: lane={lane}, model={params['base_model']}, CFG={params['guidance_scale']}")
    log.info(f"  Prompt order: MATERIAL > SUBJECT > BG > SHADOW > QUALITY > CRIMSON")
    log.info(f"  Prompt length: {len(full_prompt)}, Negative length: {len(full_negative)}")

    return {
        "prompt": full_prompt,
        "negative_prompt": full_negative,
        "params": params,
        "lane": lane,
    }