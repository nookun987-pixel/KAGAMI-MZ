"""
MIKAGE PIPELINE — claude_spec.py v3
Hex-anchored prompt builder.
FIX: Embed specific hex codes, Keshiki texture breakers,
     emphasis weighting for crimson seam and In'ei background.
Model: RealVisXL v5.0 (better photorealism than JuggernautXL for material accuracy).
"""

import logging
from .canon_rules import detect_lane, LANES

log = logging.getLogger("mikage.claude_spec")

# ──────────────────────────────────────────────
# BACKGROUND ANCHORS (hex-specific, texture-breaking)
# ──────────────────────────────────────────────
BG_OBSIDIAN = (
    "(dark background:1.4), (ink black background color #252321:1.3), "
    "Sumi ink darkness with subtle warm undertone, "
    "soot residue texture on background, charcoal grain noise, "
    "Yakisugi burnt cedar depth, NOT pure black NOT #000000, "
    "background has mineral grain and carbon density"
)

BG_GOFUN = (
    "(warm off-white background:1.4), (shell white background color #EEE7D7:1.3), "
    "Gofun calcium-carbonate matte warmth, "
    "subtle plaster texture on background, fine mineral grain, "
    "Shikkui lime plaster surface, NOT pure white NOT #FFFFFF, "
    "background has oyster-shell warmth and micro-pinholes"
)

# ──────────────────────────────────────────────
# CRIMSON ANCHOR (hex-specific, material-grounded)
# ──────────────────────────────────────────────
CRIMSON_MASK = (
    "(thin dark red line at mask seam:1.3), (crimson accent color #8E050F:1.2), "
    "Bengala iron oxide pigment at crack lines, "
    "oxidized blood-red at structural joints only, "
    "Urushi lacquer red ground showing through wear, "
    "NOT bright red NOT pink NOT magenta NOT glowing"
)

CRIMSON_WEAPON = (
    "(deep crimson heated core glowing #8E050F to #9D2933:1.3), "
    "Bengala iron oxide energy veins along blade spine, "
    "ferro-calcium bone core emitting dark red heat, "
    "directional steam rising from crimson core, "
    "NOT bright neon red NOT orange NOT magenta"
)

CRIMSON_CHARACTER = (
    "(crimson synthetic blood #8E050F leaking from armor seams:1.3), "
    "Bengala red at kintsugi fracture lines, "
    "faint internal crimson glow beneath porcelain shell, "
    "NOT bright red NOT pink NOT magenta"
)

# ──────────────────────────────────────────────
# KESHIKI TEXTURE BREAKERS (anti-flat surface)
# ──────────────────────────────────────────────
KESHIKI_CERAMIC = (
    "Keshiki surface landscape, mineral grain texture, "
    "Shino glaze crawling and pinholes, carbon trapping spots, "
    "micro-fractures in ceramic surface, orange-peel specularity, "
    "subsurface scattering through porcelain, "
    "NOT smooth NOT uniform NOT flat NOT plastic"
)

KESHIKI_METAL = (
    "Keshiki surface landscape, oxidized rust patina, "
    "forge scale texture, hammer marks, pitting corrosion, "
    "mineral grain in metal surface, soot residue deposit, "
    "NOT clean NOT polished NOT chrome NOT smooth"
)

# ──────────────────────────────────────────────
# SHADOW ANCHOR (In'ei Reisan)
# ──────────────────────────────────────────────
INEI_SHADOW = (
    "(dramatic deep shadows:1.4), (tenebrism chiaroscuro 4:1 ratio:1.3), "
    "(70 percent of image is shadow:1.2), "
    "Sumi ink shadow with Gosai temperature shift, "
    "shadows are wet and dense with humidity, "
    "Ao-zumi cool shadow on metal and Cha-boku warm shadow on ceramic, "
    "single dominant light source from 45 degrees"
)

# ──────────────────────────────────────────────
# LANE PROMPTS
# ──────────────────────────────────────────────
LANE_PROMPTS = {
    "mask": {
        "subject": (
            "(porcelain kitsune mask:1.3), Boron Carbide B4C ceramic, "
            "faceless, planar geometry, narrow horizontal eye slits, "
            "perfect bilateral symmetry, no mouth, no expression"
        ),
        "material": KESHIKI_CERAMIC,
        "crimson": CRIMSON_MASK,
    },
    "weapon": {
        "subject": (
            "(Zenith Blade massive industrial straight sword:1.3), "
            "350kg heavy oversized thick rectangular block geometry, "
            "strictly straight zero curvature, dark rusty titanium scrap metal"
        ),
        "material": KESHIKI_METAL,
        "crimson": CRIMSON_WEAPON,
    },
    "character": {
        "subject": (
            "(Mikage Zenith mechanical cyborg:1.3), "
            "porcelain white armor shell, faceless kitsune helmet, "
            "void black optical sensors, long straight heavy black hair"
        ),
        "material": KESHIKI_CERAMIC,
        "crimson": CRIMSON_CHARACTER,
    },
    "environment": {
        "subject": (
            "industrial brutalist interior, atmospheric haze, "
            "physical consequences (steam, shattered concrete, acid rain)"
        ),
        "material": KESHIKI_METAL,
        "crimson": "(minimal crimson on active infrastructure seams only:1.1)",
    },
}

BASE_QUALITY = (
    "masterpiece, best quality, ultra detailed, photorealistic, "
    "8k uhd, RAW photo, studio photography, professional lighting, "
    "museum quality, negative space, clean composition, minimal, "
    "product photography, centered subject, sharp focus"
)

BASE_NEGATIVE = (
    "human eyes, iris, pupil, sclera, facial expression, smile, frown, "
    "plastic, PVC, glossy plastic, plaster, CGI, "
    "toon shading, cel shading, anime, cartoon, illustration, drawing, "
    "neon, RGB glow, cyberpunk, glitch, chromatic aberration, "
    "abstract, unrecognizable, blurry, noise, artifacts, "
    "watermark, logo, text, signature, "
    "bloom, lens flare, neon glow, "
    "low quality, worst quality, jpeg artifacts, "
    "deformed, distorted, asymmetric, "
    "curved katana, thin blade, clean laser, neon rainbow, "
    "sunny nature, bright background, grey background, mid-tone background, "
    "generic sci-fi, cluttered cyberpunk, "
    "(pure white background:1.3), (pure black background:1.3), "
    "(grey background:1.3), (flat uniform background:1.3), "
    "(smooth plastic surface:1.3), (no texture:1.2)"
)


def build_fooocus_spec(intake_spec: dict) -> dict:
    brief = intake_spec.get("prompt_seed", intake_spec.get("subject", ""))
    lane = detect_lane(brief)
    lp = LANE_PROMPTS.get(lane, LANE_PROMPTS["mask"])

    log.info(f"Lane detected: {lane}")

    # Background
    bg_raw = intake_spec.get("background", "obsidian")
    if "obsidian" in bg_raw.lower() or "dark" in bg_raw.lower() or "black" in bg_raw.lower():
        bg = BG_OBSIDIAN
    else:
        bg = BG_GOFUN

    # Assemble: subject -> crimson -> material -> background -> shadows -> quality
    full_prompt = ", ".join([
        lp["subject"],
        lp["crimson"],
        lp["material"],
        bg,
        INEI_SHADOW,
        BASE_QUALITY,
    ])

    # Negative
    neg_hints = intake_spec.get("negative_hints", "")
    full_negative = f"{neg_hints}, {BASE_NEGATIVE}" if neg_hints else BASE_NEGATIVE

    # Params — use RealVisXL for better material photorealism
    params = {
        "image_number": 1,
        "guidance_scale": 7.0,       # Higher CFG for stronger prompt adherence
        "sharpness": 2.0,
        "performance": "Quality",
        "aspect_ratios": "1152\u00d7896",
        "styles": ["Fooocus V2", "Fooocus Enhance", "Fooocus Sharp"],
        "base_model": "realvisxlV50_v50LightningBakedVAE.safetensors",
        "seed": -1,
    }

    log.info(f"Spec: lane={lane}, model={params['base_model']}, CFG={params['guidance_scale']}, prompt_len={len(full_prompt)}")

    return {
        "prompt": full_prompt,
        "negative_prompt": full_negative,
        "params": params,
        "lane": lane,
    }