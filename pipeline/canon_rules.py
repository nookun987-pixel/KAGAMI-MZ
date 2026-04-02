"""
MIKAGE PIPELINE — canon_rules.py v2
Lane-aware visual canon + Mikage Color Canon (Material Determinism).
"""

COLOR_ANCHORS = {
    "gofun_white": {"hex": ["#EEE7D7", "#F6F5F6", "#E2C4BE", "#D6D6D6"], "forbidden": ["#FFFFFF"]},
    "sumi_black": {"hex": ["#252321", "#111415", "#0C0602", "#424246"], "forbidden": ["#000000"]},
    "bengala_crimson": {"hex": ["#8E050F", "#8F1D21", "#9D2933", "#D11033"], "forbidden": ["#FF0000", "#FF00FF"]},
    "earth_accent": {"hex": ["#C8AD87", "#3C2812", "#BE7F51", "#9F5233"]},
}

LANES = {
    "mask": {
        "material": ["ceramic", "porcelain", "boron_carbide"],
        "material_desc": "Porcelain B4C ceramic with Gofun/Shino surface",
        "color_accent": "crimson at seams only",
        "surface": "matte porcelain with Keshiki texture variation",
    },
    "weapon": {
        "material": ["titanium", "ferro_calcium", "scrap_metal", "industrial_metal"],
        "material_desc": "Dark rusty titanium scrap over ferro-calcium bone core",
        "color_accent": "deep crimson heated core, Bengala iron oxide seams",
        "surface": "oxidized metal with micro-texture, NOT smooth or clean",
    },
    "character": {
        "material": ["ceramic", "porcelain", "graphene", "titanium"],
        "material_desc": "B4C porcelain shell + matte black graphene undersuit",
        "color_accent": "crimson synthetic blood at armor seams, gold kintsugi",
        "surface": "porcelain outer + carbon fiber inner",
    },
    "environment": {
        "material": ["concrete", "steel", "rain", "mist"],
        "material_desc": "Industrial brutalist surfaces with atmospheric haze",
        "color_accent": "minimal crimson on active infrastructure only",
        "surface": "weathered concrete, wet steel, acid rain patina",
    },
}

CANON_RULES = {
    "T1": {"name": "ENGINEERED_ENTITY", "check_type": "semantic", "hard_fail": False,
           "description": "Subject must be engineered entity appropriate to its lane."},
    "T2": {"name": "NO_HUMAN_EYES", "check_type": "pixel", "hard_fail": True,
           "field": "human_eyes_detected", "threshold": 0,
           "description": "Zero human eyes detected."},
    "T3": {"name": "NO_EXPRESSION", "check_type": "semantic", "hard_fail": False,
           "description": "No facial expression on mask.", "lanes": ["mask", "character"]},
    "T4": {"name": "MATERIAL_CORRECT_FOR_LANE", "check_type": "semantic", "hard_fail": False,
           "description": "Material matches lane. MASK=ceramic/porcelain. WEAPON=dark rusty titanium/ferro-calcium. Must show Keshiki texture."},
    "T5": {"name": "NO_PVC_PLASTIC", "check_type": "pixel", "hard_fail": True,
           "field": "pvc_plastic_read", "threshold": 0,
           "description": "Zero PVC/plastic. Must feel mineral-heavy."},
    "T6": {"name": "NO_TOON_SHADING", "check_type": "pixel", "hard_fail": True,
           "field": "toon_shading", "threshold": 0,
           "description": "Zero toon shading. Photorealistic only."},
    "T7": {"name": "CRIMSON_BENGALA_ONLY", "check_type": "pixel", "hard_fail": False,
           "field": "crimson_ratio", "threshold_max": 0.08,
           "description": "Crimson (Bengala family) at seams/cores only, max 8%. Not safety-red, not magenta."},
    "T8": {"name": "BG_SUMI_OR_GOFUN", "check_type": "semantic", "hard_fail": False,
           "description": "Background = Sumi black (#252321/#111415/#0C0602) or Gofun white (#EEE7D7/#F6F5F6). NEVER #FFFFFF or #000000."},
    "T9": {"name": "INEI_SHADOW_70_30", "check_type": "pixel", "hard_fail": False,
           "field": "shadow_ratio",
           "description": "In'ei Reisan: 70%+ shadow volume. Shadows dense with Gosai temperature."},
    "T10": {"name": "NO_NEON_DRIFT", "check_type": "pixel", "hard_fail": False,
            "field": "magenta_neon_spill", "threshold": 0,
            "description": "No neon/emissive RGB. Subtractive mineral logic only."},
    "T11": {"name": "NO_ABSTRACT_FRAME", "check_type": "semantic", "hard_fail": True,
            "description": "Clear manufactured object, not abstract art."},
    "T12": {"name": "MATERIAL_PRESENT", "check_type": "semantic", "hard_fail": True,
            "description": "Material clearly readable with Keshiki texture. Never flat uniform."},
    "T13": {"name": "NEGATIVE_SPACE_MA", "check_type": "semantic", "hard_fail": False,
            "description": "Sacred Void (Ma): clear negative space, 70/30 shadow rule."},
    "T14": {"name": "GEOMETRY_CORRECT", "check_type": "semantic", "hard_fail": False,
            "description": "MASK=perfect symmetry. WEAPON=blade strictly straight. No distortion."},
    "T15": {"name": "NO_LOGO_OVERLAP", "check_type": "pixel", "hard_fail": False,
            "field": "logo_overlap_ratio", "threshold": 0, "description": "No watermark."},
    "T16": {"name": "WABI_SABI_TONE", "check_type": "pixel", "hard_fail": False,
            "field": "edge_activity",
            "description": "Wabi-Sabi restraint. Saturation decays from core. Low energy, high control."},
}

HARD_FAIL_CODES = [c for c, r in CANON_RULES.items() if r["hard_fail"]]
PIXEL_RULES = {c: r for c, r in CANON_RULES.items() if r["check_type"] == "pixel"}
SEMANTIC_RULES = {c: r for c, r in CANON_RULES.items() if r["check_type"] == "semantic"}


def detect_lane(brief: str) -> str:
    b = brief.lower()
    if any(w in b for w in ["blade", "sword", "weapon", "zenith blade", "nodachi", "dao"]):
        return "weapon"
    if any(w in b for w in ["mask", "kitsune", "helmet", "visor"]):
        return "mask"
    if any(w in b for w in ["mikage", "character", "cyborg", "full body", "portrait"]):
        return "character"
    if any(w in b for w in ["environment", "city", "tower", "alley"]):
        return "environment"
    return "mask"


def build_canon_checklist_prompt(lane: str = "mask") -> str:
    lane_info = LANES.get(lane, LANES["mask"])
    lines = [
        f"Check this image against MIKAGE ZENITH visual canon.",
        f"",
        f"LANE: {lane.upper()}",
        f"Expected material: {lane_info['material_desc']}",
        f"Expected accent: {lane_info['color_accent']}",
        f"Expected surface: {lane_info['surface']}",
        f"",
        f"COLOR CANON:",
        f"- Whites = Gofun (#EEE7D7, #F6F5F6), NEVER #FFFFFF",
        f"- Blacks = Sumi (#252321, #111415, #0C0602), NEVER #000000",
        f"- Crimsons = Bengala (#8E050F-#D11033), seams/cores ONLY",
        f"- All surfaces need Keshiki texture, never flat",
        f"",
        f"Rules:\n",
    ]
    for code, rule in CANON_RULES.items():
        if rule["check_type"] == "semantic":
            rule_lanes = rule.get("lanes", None)
            if rule_lanes and lane not in rule_lanes:
                continue
            lines.append(f"- {code} ({rule['name']}): {rule['description']}")
    lines.append(f"\nJSON: {{\"checks\": [{{\"code\":\"T1\",\"pass\":true,\"reason\":\"...\"}}], \"hard_fail_count\":0, \"pass_fail\":\"PASS\", \"final_decision\":\"ALLOW\", \"reasoning\":\"...\"}}")
    return "\n".join(lines)
