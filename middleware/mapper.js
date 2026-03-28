/**
 * MIKAGE — /middleware/mapper.js
 * Fixed mapping table: artistic language → structured render parameters.
 *
 * mood     → lighting
 * material → texture
 * style    → composition_rules
 *
 * Deterministic. No randomness. No creativity.
 * Every input keyword has a predetermined output.
 * Unknown keywords pass through a Canon-safe fallback.
 */

"use strict";

const {
  HARD_CONSTRAINTS,
  TEXTURE_REQUIREMENTS,
  MICRO_HUMANITY_MOTIFS,
  NEGATIVE_PROMPT_CORE,
  compileNegativePrompt,
  validateArtDirection,
} = require("./constraints");

// ===================================================================
// LOCKED SUBJECT IDENTITY — never generated, always static
// ===================================================================

const LOCKED_SUBJECT = "Mikage Zenith, fully mechanical humanoid, strict hard-surface " +
  "anatomy, zero organic influence, full porcelain faceless cybernetic helmet with " +
  "subtle fox-like silhouette and void black optical sensors, narrow straight eye " +
  "slits 0.7 inch, no emotion, no human features, completely flat chest rigid armor " +
  "planes, straight structural waist, hips aligned with torso width, legs engineered " +
  "load-bearing mechanical systems, long straight heavy black hair flowing naturally, " +
  "Zenith Blade visible — massive heavy industrial straight sword, dark rusty titanium " +
  "scrap metal over ferro-calcium core, thick spine ultra-thin edge, perfectly straight, " +
  "no curvature no ornament, crimson heated core, matte porcelain-white ceramic surface, " +
  "uneven finish with micro-crack detail, material-honest rendering, no artificial coating";

// ===================================================================
// MOOD → LIGHTING MAP
// ===================================================================

const MOOD_TO_LIGHTING = Object.freeze({
  // --- Primary Canon moods ---
  melancholic: [
    "low-key directional light from above 45 degrees",
    "chiaroscuro contrast ratio 4:1",
    "deep shadow falloff into graphite black",
    "minimal fill — protect Ma negative space",
    "thin rim light only — accent Shinogi edges",
    "subject-centered lighting hierarchy — main focus on porcelain armor",
    "no clipping on ceramic highlights — preserve detail",
  ],
  restrained: [
    "single motivated light source",
    "soft 45-degree key light on porcelain curves",
    "restrained highlights — no hot spots",
    "shadow preserves volume without losing form",
    "subsurface scattering on B4C for bone-depth translucency",
    "subject as visual anchor — strongest focal point in frame",
    "exposure calibrated for ceramic surface detail",
  ],
  sacred: [
    "overhead directional beam — single ceiling slit source",
    "volumetric light through atmospheric particles",
    "deep chiaroscuro 4:1 ratio",
    "kintsugi gold seams catch rim light",
    "environment bathed in motivated darkness",
  ],
  stillness: [
    "static single light source — no movement",
    "even shadow distribution suggesting frozen time",
    "minimal rim light — thin edge separation only",
    "low intensity fill — near zero",
    "darkness as architectural element",
  ],
  silent: [
    "single overhead directional light",
    "absence of secondary light sources",
    "deep unbroken shadow fields",
    "porcelain catches faint key light only",
    "negative space dominated by darkness",
  ],
  cold: [
    "desaturated cool-temperature key light",
    "sharp high-contrast chiaroscuro 4:1",
    "thin cyan-tinted rim light from environment",
    "no warm fill — temperature reads frigid",
    "ice-crystalline quality on porcelain highlight",
  ],
  tragic: [
    "low-key dramatic single source",
    "Kumoru angle — mask tilted into shadow",
    "crimson internal glow from kintsugi seams",
    "backlight silhouette emphasis",
    "darkness envelops majority of frame",
  ],
  oppressive: [
    "overhead crushing light — narrow beam",
    "extreme shadow density in periphery",
    "chiaroscuro pushed beyond 4:1",
    "no fill light — environment is threat",
    "subject isolated by light geometry",
  ],
  somber: [
    "low-key soft directional from 45 degrees",
    "muted highlights — no brilliance",
    "shadow falloff gradual and heavy",
    "rim light barely visible — separation minimal",
    "overall frame reads dark",
  ],
  controlled: [
    "precise single key light — geometric placement",
    "clinical shadow edges — sharp and disciplined",
    "rim light accents mechanical joint lines",
    "chiaroscuro 4:1 maintained exactly",
    "subsurface scattering calibrated for B4C ceramic",
  ],
  // --- Color mode lighting overrides ---
  "fallen ivory": [
    "cold cinematic key light from 45 degrees",
    "porcelain white dominant in highlights",
    "kintsugi gold catches thin rim light",
    "internal crimson glow from seam fractures",
    "silent aftermath atmosphere — low intensity overall",
  ],
  "neon wound": [
    "electric violet rim light through kintsugi channels",
    "rain-soaked night ambient — reflected neon on wet porcelain",
    "internal crimson competing with violet edge glow",
    "high contrast — dark base with chromatic accents",
    "85mm editorial portrait depth of field",
  ],
  "cathedral halo": [
    "sacred blue volumetric light beams from above",
    "infinite AI cathedral architecture light scatter",
    "porcelain reads as sanctified in blue wash",
    "kintsugi gold glows against blue atmosphere",
    "machine sanctum feeling — cold divine light",
  ],
  "void regent": [
    "dominant graphite black — near total darkness",
    "razor-thin cyan illumination edge only",
    "silhouette-first composition",
    "no fill — power expressed through absence",
    "orbital throne hall scale lighting",
  ],
  "crimson overclock": [
    "intense internal crimson energy bleeding through shell",
    "burnt amber secondary light from reactor breach",
    "high urgency — rapid light pulse suggestion",
    "chiaroscuro inverted — light from within subject",
    "environment reads as heat-distorted",
  ],
  "royal machine": [
    "imperial gold kintsugi architecture glow",
    "restrained royal violet atmosphere wash",
    "sovereign stance — centered key light",
    "chrome reflections in secondary highlights",
    "collectible energy — precious and contained",
  ],
});

// ===================================================================
// MATERIAL → TEXTURE MAP
// ===================================================================

const MATERIAL_TO_TEXTURE = Object.freeze({
  // --- Canon subject materials ---
  porcelain: [
    "matte porcelain-white B4C ceramic surface",
    "subsurface scattering creating bone-depth translucency",
    "micro-fractures with gold kintsugi repair seams",
    "faint internal crimson glow through cracks (#E60000)",
    "soft diffusion under key light — rim highlight on edges",
    "sharp edge definition — zero blur on armor boundaries",
    "high-frequency surface texture — visible grain at close range",
  ],
  "boron carbide": [
    "matte porcelain-white B4C ceramic surface 33 GPa hardness",
    "clean fracture lines — no deformation, only crack and repair",
    "subsurface scattering like biological bone structure",
    "micro-crack network filled with kintsugi gold",
    "crisp edge boundaries — no pixel bleed or softening",
    "surface micro-detail preserved at high resolution",
  ],
  b4c: [
    "matte porcelain-white B4C ceramic surface",
    "subsurface scattering creating bone-depth translucency",
    "micro-fractures with gold kintsugi repair seams",
  ],
  ceramic: [
    "matte ceramic surface with uneven wear patterns",
    "micro-cracks across load-bearing plates",
    "gold kintsugi repair at stress points",
    "no gloss — diffuse light interaction only",
  ],
  "weathered ceramic": [
    "worn matte ceramic with accumulated micro-damage",
    "uneven surface density from impact history",
    "kintsugi gold repair lines tracing fracture memory",
    "heat-stress micro-scarring visible under rim light",
  ],
  "carbon fiber": [
    "matte black hexagonal carbon fiber weave (#0A0A0A)",
    "full light absorption — void black appearance",
    "visible at joint gaps beneath porcelain shell",
    "graphene hex-grid pattern under direct light only",
  ],
  "heat-warped carbon fiber": [
    "matte black carbon fiber with thermal stress deformation",
    "hex-grid pattern distorted by Landauer entropy heat",
    "warped surface topology visible at joint exposure",
    "full light absorption except at warp ridges",
  ],
  graphene: [
    "matte black graphene hex-grid undersuit texture",
    "full light absorption — creates void-black shadow",
    "visible between armor plate gaps",
  ],
  titanium: [
    "dark titanium satin finish on joint mechanisms",
    "dull satin reflection — no mirror shine",
    "mechanical precision visible in surface machining",
  ],
  "dark titanium": [
    "dark titanium satin finish joint material",
    "dull reflection — absorbs most light",
    "precision-machined surface with tool marks",
  ],
  kintsugi: [
    "gold conductive resin filling ceramic fracture lines",
    "faint crimson energy glow beneath gold surface",
    "internal glow — no bloom, no external light spill",
    "fracture lines follow Shinogi geometry of armor",
  ],
  "ferro-calcium": [
    "ferro-calcium bone core glowing crimson hot (>43C)",
    "industrial metal segments held by magnetic flux pinning",
    "0.5mm micro-vibration at magnetic junction points",
    "steam emission from heat interaction with acid rain",
  ],
  // --- Canon environment materials ---
  concrete: [
    "raw brutalist concrete with heavy shadow definition",
    "rough surface catching caustic water reflections",
    "massive architectural scale visible through shadow",
  ],
  "brutalist concrete": [
    "brutalist concrete wall with pour-line texture",
    "heavy volume shadow defining architectural mass",
    "caustic light patterns from water reflections",
  ],
  "charred wood": [
    "charred grain variation on environmental wood elements",
    "carbon-black surface with cracked thermal patterns",
    "industrial decay texture in background detail",
  ],
  "burnt wood": [
    "burnt wood grain with char patterns",
    "thermal damage texture on environmental surfaces",
  ],
  "acid rain": [
    "acid rain droplets on porcelain creating micro-reflections",
    "wet surface sheen on ceramic and concrete",
    "atmospheric haze from evaporating acid moisture",
  ],
  "corroded metal": [
    "oxidized industrial metal in environment",
    "patina and corrosion texture on infrastructure",
    "NOT on subject porcelain — environment only",
  ],
});

// ===================================================================
// STYLE → COMPOSITION RULES MAP
// ===================================================================

const STYLE_TO_COMPOSITION = Object.freeze({
  "wabi-sabi": [
    "negative space >= 40% of frame",
    "broken symmetry required — off-center subject",
    "imperfection required — no flawless surfaces",
    "texture variation across all visible materials",
    "depth through layered silence",
    "three-axis rule — no surface curves beyond two axes",
    "70/30 ratio — 70% empty to 30% detail",
    "mask geometry perfectly symmetrical — eye voids aligned",
    "subject silhouette dominant in frame — immediate recognition",
  ],
  "ukiyo-e restraint": [
    "flowing compositional lines — wave-like movement",
    "layered depth with foreground atmospheric element",
    "subject movement suggests ukiyo-e woodblock grace",
    "color restraint — Canon palette only",
    "negative space as compositional anchor",
  ],
  "editorial cinematic": [
    "ARRI ALEXA 65 simulation — Panavision Ultra Vista Anamorphic",
    "aspect ratio 2.76:1",
    "85mm T1.2 for portrait/close, 35mm for environmental wide",
    "film grain present — analog texture layer",
    "foreground depth required — mist, rain, or sparks",
    "photorealistic hard sci-fi rendering",
    "subject as primary visual anchor — strongest contrast point",
    "thumbnail hierarchy — subject remains dominant when scaled down",
  ],
  "porcelain minimalism": [
    "maximum negative space to enforce isolation",
    "subject silhouette as primary compositional element",
    "material honesty — porcelain reads as porcelain",
    "no decorative elements — Kanso simplicity",
    "every visible detail must have mechanical function",
  ],
  "quiet luxury": [
    "restrained composition — no visual noise",
    "dark luxury aesthetic — cold and expensive",
    "precise geometric framing — symmetry or extreme thirds",
    "atmospheric depth through haze or frozen mist",
    "quality of silence in visual weight distribution",
  ],
  brutalism: [
    "massive architectural environment dwarfing subject",
    "concrete and industrial materials dominate background",
    "deep volume shadows on architecture",
    "foreground-background separation through atmospheric haze",
    "physical consequences visible — cracked concrete, steam",
  ],
  "emotional porcelain": [
    "at least 1 micro-humanity motif required",
    "pain expressed through material, not expression",
    "kintsugi fractures tell combat history",
    "crimson internal glow signals contained suffering",
    "mask remains neutral — emotion lives in damage",
  ],
  cinematic: [
    "chiaroscuro 4:1 contrast ratio",
    "5-point lighting setup canonical",
    "anamorphic lens characteristics — 2.39:1 or 2.76:1",
    "film grain layer present",
    "motivated lighting from within scene logic",
  ],
});

// ===================================================================
// FALLBACK — Canon-safe defaults for unknown inputs
// ===================================================================

const FALLBACK_LIGHTING = Object.freeze([
  "single dominant light source from above 45 degrees",
  "chiaroscuro contrast ratio 4:1",
  "minimal fill — protect negative space",
  "thin rim light for edge separation",
  "subsurface scattering on B4C ceramic",
]);

const FALLBACK_TEXTURE = Object.freeze([
  "matte porcelain-white ceramic surface",
  "uneven finish with micro-crack detail",
  "material-honest rendering — no artificial coating",
]);

const FALLBACK_COMPOSITION = Object.freeze([
  "negative space >= 40%",
  "off-center subject placement",
  "broken symmetry required",
  "foreground depth element required",
]);

// ===================================================================
// MAPPING FUNCTIONS
// ===================================================================

/**
 * Normalize a keyword for lookup: lowercase, trim, collapse whitespace.
 */
function norm(str) {
  return String(str || "").toLowerCase().trim().replace(/\s+/g, " ");
}

/**
 * Map mood array → lighting specifications.
 * Each mood keyword is looked up. Unknown keywords use Canon-safe fallback.
 * Results are deduplicated.
 *
 * @param {string[]} moods
 * @returns {string[]}
 */
function mapMoodToLighting(moods) {
  if (!Array.isArray(moods) || moods.length === 0) {
    return [...FALLBACK_LIGHTING];
  }

  const result = [];
  const seen = new Set();
  let matched = false;

  for (const mood of moods) {
    const key = norm(mood);
    // Try exact match first
    let specs = MOOD_TO_LIGHTING[key];
    // Try partial match if no exact
    if (!specs) {
      for (const [mapKey, mapVal] of Object.entries(MOOD_TO_LIGHTING)) {
        if (key.includes(mapKey) || mapKey.includes(key)) {
          specs = mapVal;
          break;
        }
      }
    }
    if (specs) {
      matched = true;
      for (const s of specs) {
        if (!seen.has(s)) {
          seen.add(s);
          result.push(s);
        }
      }
    }
  }

  // If nothing matched at all, use fallback
  if (!matched) {
    return [...FALLBACK_LIGHTING];
  }

  return result;
}

/**
 * Map material array → texture specifications.
 * Each material keyword is looked up. Unknown materials use Canon-safe fallback.
 * Results are deduplicated.
 *
 * @param {string[]} materials
 * @returns {string[]}
 */
function mapMaterialToTexture(materials) {
  if (!Array.isArray(materials) || materials.length === 0) {
    return [...FALLBACK_TEXTURE];
  }

  const result = [];
  const seen = new Set();
  let matched = false;

  for (const mat of materials) {
    const key = norm(mat);
    let specs = MATERIAL_TO_TEXTURE[key];
    if (!specs) {
      for (const [mapKey, mapVal] of Object.entries(MATERIAL_TO_TEXTURE)) {
        if (key.includes(mapKey) || mapKey.includes(key)) {
          specs = mapVal;
          break;
        }
      }
    }
    if (specs) {
      matched = true;
      for (const s of specs) {
        if (!seen.has(s)) {
          seen.add(s);
          result.push(s);
        }
      }
    }
  }

  if (!matched) {
    return [...FALLBACK_TEXTURE];
  }

  return result;
}

/**
 * Map style array → composition rules.
 * Each style keyword is looked up. Unknown styles use Canon-safe fallback.
 * Results are deduplicated.
 *
 * @param {string[]} styles
 * @returns {string[]}
 */
function mapStyleToComposition(styles) {
  if (!Array.isArray(styles) || styles.length === 0) {
    return [...FALLBACK_COMPOSITION];
  }

  const result = [];
  const seen = new Set();
  let matched = false;

  for (const style of styles) {
    const key = norm(style);
    let specs = STYLE_TO_COMPOSITION[key];
    if (!specs) {
      for (const [mapKey, mapVal] of Object.entries(STYLE_TO_COMPOSITION)) {
        if (key.includes(mapKey) || mapKey.includes(key)) {
          specs = mapVal;
          break;
        }
      }
    }
    if (specs) {
      matched = true;
      for (const s of specs) {
        if (!seen.has(s)) {
          seen.add(s);
          result.push(s);
        }
      }
    }
  }

  if (!matched) {
    return [...FALLBACK_COMPOSITION];
  }

  return result;
}

// ===================================================================
// NORMALIZE — ASSEMBLE COMPLETE SPEC
// ===================================================================

/**
 * @typedef {Object} NormalizedPromptSpec
 * @property {string}   subject            Locked identity description
 * @property {string[]} lighting           Mapped from moods
 * @property {string[]} texture            Mapped from materials
 * @property {string[]} composition_rules  Mapped from styles
 * @property {string[]} negative_prompt    Compiled from constraints + forbidden
 */

/**
 * Execute the full middleware normalization pipeline.
 *
 * 1. Validate art_direction against constraints (reject if violated)
 * 2. Map mood → lighting
 * 3. Map material → texture
 * 4. Map style → composition_rules
 * 5. Inject locked identity
 * 6. Compile negative prompt
 *
 * @param {Object} art_direction  Job art_direction block
 * @returns {{ valid: boolean, violations: Object[], spec: NormalizedPromptSpec|null }}
 */
function normalize(art_direction) {
  const ad = art_direction || {};

  // --- 1. Validate constraints ---
  const validation = validateArtDirection(ad);
  const rejectViolations = validation.violations.filter((v) => v.severity === "REJECT");

  if (rejectViolations.length > 0) {
    return {
      valid: false,
      violations: validation.violations,
      spec: null,
    };
  }

  // --- 2-4. Map all dimensions ---
  const lighting = mapMoodToLighting(ad.mood);
  const texture = mapMaterialToTexture(ad.material);
  const composition_rules = mapStyleToComposition(ad.style);

  // --- 5. Always include micro-humanity motif requirement ---
  if (!composition_rules.some((r) => r.includes("micro-humanity"))) {
    composition_rules.push("at least 1 micro-humanity motif required");
  }

  // --- 6. Compile negative prompt ---
  const artForbidden = Array.isArray(ad.forbidden) ? ad.forbidden : [];
  const negative_prompt = compileNegativePrompt(artForbidden);

  return {
    valid: true,
    violations: validation.violations,  // warnings still included
    spec: {
      subject: LOCKED_SUBJECT,
      lighting,
      texture,
      composition_rules,
      negative_prompt,
    },
  };
}

// ===================================================================
// EXPORTS
// ===================================================================

module.exports = {
  // Core mapping functions
  mapMoodToLighting,
  mapMaterialToTexture,
  mapStyleToComposition,

  // Full normalization
  normalize,

  // Locked data (read-only)
  LOCKED_SUBJECT,
  MOOD_TO_LIGHTING,
  MATERIAL_TO_TEXTURE,
  STYLE_TO_COMPOSITION,

  // Fallbacks
  FALLBACK_LIGHTING,
  FALLBACK_TEXTURE,
  FALLBACK_COMPOSITION,
};
