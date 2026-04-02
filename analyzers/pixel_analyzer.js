/**
 * MIKAGE — Pixel Analyzer
 * Real image analysis for Mikage rule engine signals.
 * Uses sharp for image loading + raw pixel math.
 */

"use strict";

const sharp = require("sharp");

// ===================================================================
// HELPERS
// ===================================================================

/**
 * Load image as raw pixel buffer { data, width, height, channels }.
 */
async function loadRaw(imagePath) {
  const img = sharp(imagePath).removeAlpha().toColorspace("srgb");
  const { data, info } = await img.raw().toBuffer({ resolveWithObject: true });
  return { data, width: info.width, height: info.height, channels: info.channels };
}

/**
 * Compute luminance from RGB. ITU-R BT.709
 */
function luminance(r, g, b) {
  return 0.2126 * r + 0.7152 * g + 0.0722 * b;
}

/**
 * CIE76 Delta E approximation using sRGB (good enough for screening).
 */
function deltaE_sRGB(r1, g1, b1, r2, g2, b2) {
  return Math.sqrt((r1 - r2) ** 2 + (g1 - g2) ** 2 + (b1 - b2) ** 2);
}

/**
 * Convert RGB to HSV.
 * Returns h in degrees, s/v in 0..1
 */
function rgbToHsv(r, g, b) {
  r /= 255; g /= 255; b /= 255;
  const max = Math.max(r, g, b), min = Math.min(r, g, b);
  const d = max - min;
  let h = 0;
  if (d !== 0) {
    if (max === r) h = ((g - b) / d) % 6;
    else if (max === g) h = (b - r) / d + 2;
    else h = (r - g) / d + 4;
    h = (h * 60 + 360) % 360;
  }
  const s = max === 0 ? 0 : d / max;
  return { h, s, v: max };
}

function isCrimsonHue(h) {
  return h <= 18 || h >= 338;
}

function clamp01(v) {
  return Math.max(0, Math.min(1, v));
}

// ===================================================================
// 1. EDGE SHARPNESS (Laplacian-based)
// ===================================================================

/**
 * Measure edge sharpness using Laplacian kernel on luminance.
 * Returns gradient magnitude mean — higher = sharper.
 */
async function measureEdgeSharpness(imagePath) {
  const { data, width, height, channels } = await loadRaw(imagePath);

  const lum = new Float32Array(width * height);
  for (let i = 0; i < width * height; i++) {
    const off = i * channels;
    lum[i] = luminance(data[off], data[off + 1], data[off + 2]);
  }

  let sum = 0, count = 0;
  for (let y = 1; y < height - 1; y++) {
    for (let x = 1; x < width - 1; x++) {
      const c = y * width + x;
      const lap = 4 * lum[c]
        - lum[c - 1] - lum[c + 1]
        - lum[c - width] - lum[c + width];
      sum += Math.abs(lap);
      count++;
    }
  }

  const meanGradient = count > 0 ? sum / count : 0;
  const normalized = Math.min(meanGradient / 30, 1.0);

  return {
    edge_sharpness_gradient: normalized,
    edge_blur_radius: normalized < 0.15 ? 1 : 0,
    raw_gradient: meanGradient,
  };
}

// ===================================================================
// 2. HIGH-FREQUENCY PIXEL DENSITY (texture richness)
// ===================================================================

/**
 * Measure high-frequency content as proxy for texture detail.
 * Uses local variance in sliding window.
 */
async function measureHighFrequencyDensity(imagePath) {
  const { data, width, height, channels } = await loadRaw(imagePath);
  const lum = new Float32Array(width * height);
  for (let i = 0; i < width * height; i++) {
    const off = i * channels;
    lum[i] = luminance(data[off], data[off + 1], data[off + 2]);
  }

  const winSize = 2;
  let totalVariance = 0, count = 0;
  const step = 4;
  for (let y = winSize; y < height - winSize; y += step) {
    for (let x = winSize; x < width - winSize; x += step) {
      let mean = 0, n = 0;
      for (let dy = -winSize; dy <= winSize; dy++) {
        for (let dx = -winSize; dx <= winSize; dx++) {
          mean += lum[(y + dy) * width + (x + dx)];
          n++;
        }
      }
      mean /= n;
      let variance = 0;
      for (let dy = -winSize; dy <= winSize; dy++) {
        for (let dx = -winSize; dx <= winSize; dx++) {
          const diff = lum[(y + dy) * width + (x + dx)] - mean;
          variance += diff * diff;
        }
      }
      variance /= n;
      totalVariance += variance;
      count++;
    }
  }

  const avgVariance = count > 0 ? totalVariance / count : 0;
  const density = Math.min(avgVariance / 800, 1.0);

  return {
    high_frequency_pixel_density: density,
    high_frequency_pixel_density_delta: density - 0.3,
    edge_halo_detection: density < 0.1 ? 1 : 0,
    raw_variance: avgVariance,
  };
}

// ===================================================================
// 3. HISTOGRAM ANALYSIS (clipping + exposure)
// ===================================================================

/**
 * Analyze luminance histogram for exposure and clipping.
 */
async function measureHistogram(imagePath) {
  const { data, width, height, channels } = await loadRaw(imagePath);

  const histogram = new Uint32Array(256);
  let totalLum = 0;
  const pixCount = width * height;

  for (let i = 0; i < pixCount; i++) {
    const off = i * channels;
    const l = luminance(data[off], data[off + 1], data[off + 2]);
    const bin = Math.min(255, Math.max(0, Math.round(l)));
    histogram[bin]++;
    totalLum += l;
  }

  const meanLum = totalLum / pixCount;
  const exposureDelta = (meanLum - 128) / 128;

  let clippedDark = 0, clippedBright = 0;
  for (let i = 0; i <= 5; i++) clippedDark += histogram[i];
  for (let i = 250; i <= 255; i++) clippedBright += histogram[i];
  const clippingRatio = (clippedDark + clippedBright) / pixCount;

  return {
    exposure_value_delta: exposureDelta,
    histogram_clipping: clippingRatio > 0.05 ? 1 : 0,
    clipping_ratio: clippingRatio,
    mean_luminance: meanLum,
  };
}

// ===================================================================
// 4. PIXEL BLEED / EDGE CONTAMINATION
// ===================================================================

/**
 * Detect edge contamination by measuring color variance at strong edges.
 */
async function measurePixelBleed(imagePath) {
  const { data, width, height, channels } = await loadRaw(imagePath);
  const lum = new Float32Array(width * height);
  for (let i = 0; i < width * height; i++) {
    const off = i * channels;
    lum[i] = luminance(data[off], data[off + 1], data[off + 2]);
  }

  let edgePixels = 0, bleedPixels = 0;
  const step = 2;
  for (let y = 1; y < height - 1; y += step) {
    for (let x = 1; x < width - 1; x += step) {
      const c = y * width + x;
      const gx = Math.abs(lum[c + 1] - lum[c - 1]);
      const gy = Math.abs(lum[c + width] - lum[c - width]);
      const grad = gx + gy;

      if (grad > 30) {
        edgePixels++;
        const off1 = (y * width + (x - 1)) * channels;
        const off2 = (y * width + (x + 1)) * channels;
        const rDiff = Math.abs(data[off1] - data[off2]);
        const gDiff = Math.abs(data[off1 + 1] - data[off2 + 1]);
        const bDiff = Math.abs(data[off1 + 2] - data[off2 + 2]);
        if (Math.max(rDiff, gDiff, bDiff) - Math.min(rDiff, gDiff, bDiff) > 60) {
          bleedPixels++;
        }
      }
    }
  }

  const bleedPct = edgePixels > 0 ? (bleedPixels / edgePixels) * 100 : 0;

  return {
    pixel_bleed_percentage: bleedPct,
    edge_pixels_sampled: edgePixels,
    bleed_pixels_found: bleedPixels,
  };
}

// ===================================================================
// 5. DISTORTION RATIO (chromatic aberration + noise patterns)
// ===================================================================

/**
 * Estimate distorted pixel ratio by detecting RGB channel misalignment
 * and noise patterns.
 */
async function measureDistortion(imagePath) {
  const { data, width, height, channels } = await loadRaw(imagePath);

  let distortedCount = 0;
  const step = 3;

  for (let y = 1; y < height - 1; y += step) {
    for (let x = 1; x < width - 1; x += step) {
      const off = (y * width + x) * channels;

      const offL = (y * width + (x - 1)) * channels;
      const offR = (y * width + (x + 1)) * channels;
      const rShift = Math.abs(data[offL] - data[offR]);
      const gShift = Math.abs(data[offL + 1] - data[offR + 1]);
      const bShift = Math.abs(data[offL + 2] - data[offR + 2]);

      const maxShift = Math.max(rShift, gShift, bShift);
      const minShift = Math.min(rShift, gShift, bShift);
      if (maxShift - minShift > 80) {
        distortedCount++;
        continue;
      }

      const offU = ((y - 1) * width + x) * channels;
      const offD = ((y + 1) * width + x) * channels;
      const rVar = Math.abs(data[offU] - data[off]) + Math.abs(data[offD] - data[off]);
      const gVar = Math.abs(data[offU + 1] - data[off + 1]) + Math.abs(data[offD + 1] - data[off + 1]);
      const bVar = Math.abs(data[offU + 2] - data[off + 2]) + Math.abs(data[offD + 2] - data[off + 2]);
      if (Math.max(rVar, gVar, bVar) > 100 && Math.min(rVar, gVar, bVar) < 20) {
        distortedCount++;
      }
    }
  }

  const sampledCount = Math.ceil(((height - 2) / step)) * Math.ceil(((width - 2) / step));
  const ratio = sampledCount > 0 ? distortedCount / sampledCount : 0;

  return {
    distorted_pixel_ratio: ratio,
    rgb_chromatic_split_noise: ratio > 0.05 ? 1 : 0,
    vhs_noise_pattern: ratio > 0.10 ? 1 : 0,
    distorted_pixel_count: distortedCount,
    sampled_count: sampledCount,
  };
}

// ===================================================================
// 6. CRIMSON / RED SEAM DETECTION
// ===================================================================

/**
 * Detect restrained crimson accents, including very thin dark red hairlines.
 * Designed for Mikage seam/core reds, not broad red-painted surfaces.
 */
async function measureCrimsonPresence(imagePath) {
  const { data, width, height, channels } = await loadRaw(imagePath);
  const pixCount = width * height;

  let crimsonPixels = 0;
  let strongCrimsonPixels = 0;
  let brightNeonRedPixels = 0;
  let seamCandidatePixels = 0;

  let bboxMinX = width, bboxMinY = height, bboxMaxX = -1, bboxMaxY = -1;
  let totalHueDistance = 0;
  let hueSamples = 0;

  const neighborOffsets = [
    [-1, 0], [1, 0], [0, -1], [0, 1],
  ];

  for (let y = 1; y < height - 1; y++) {
    for (let x = 1; x < width - 1; x++) {
      const off = (y * width + x) * channels;
      const r = data[off];
      const g = data[off + 1];
      const b = data[off + 2];
      const hsv = rgbToHsv(r, g, b);

      const redDominance = r - Math.max(g, b);
      const darkEnoughForSeam = hsv.v >= 0.10 && hsv.v <= 0.65;
      const saturatedEnough = hsv.s >= 0.35;
      const crimsonHue = isCrimsonHue(hsv.h);
      const baseCrimson = crimsonHue && saturatedEnough && redDominance >= 18 && r >= 40;

      if (!baseCrimson) continue;

      crimsonPixels++;
      const hueDistance = Math.min(Math.abs(hsv.h - 0), 360 - Math.abs(hsv.h - 0));
      totalHueDistance += hueDistance;
      hueSamples++;

      if (hsv.s >= 0.50 && redDominance >= 35 && r >= 60) {
        strongCrimsonPixels++;
      }

      if (hsv.v >= 0.78 && hsv.s >= 0.70 && redDominance >= 70) {
        brightNeonRedPixels++;
      }

      let neighborContrastHits = 0;
      const selfLum = luminance(r, g, b);
      for (const [dx, dy] of neighborOffsets) {
        const noff = ((y + dy) * width + (x + dx)) * channels;
        const nr = data[noff];
        const ng = data[noff + 1];
        const nb = data[noff + 2];
        const nLum = luminance(nr, ng, nb);
        const nRedDominance = nr - Math.max(ng, nb);
        const lumDelta = Math.abs(selfLum - nLum);

        if (lumDelta >= 10 || Math.abs(redDominance - nRedDominance) >= 20) {
          neighborContrastHits++;
        }
      }

      if (darkEnoughForSeam && neighborContrastHits >= 2) {
        seamCandidatePixels++;
      }

      if (x < bboxMinX) bboxMinX = x;
      if (y < bboxMinY) bboxMinY = y;
      if (x > bboxMaxX) bboxMaxX = x;
      if (y > bboxMaxY) bboxMaxY = y;
    }
  }

  const crimsonRatio = pixCount > 0 ? crimsonPixels / pixCount : 0;
  const seamRatio = pixCount > 0 ? seamCandidatePixels / pixCount : 0;
  const strongRatio = pixCount > 0 ? strongCrimsonPixels / pixCount : 0;
  const neonRatio = pixCount > 0 ? brightNeonRedPixels / pixCount : 0;

  const bboxArea =
    bboxMaxX >= bboxMinX && bboxMaxY >= bboxMinY
      ? ((bboxMaxX - bboxMinX + 1) * (bboxMaxY - bboxMinY + 1)) / pixCount
      : 0;

  const meanHueDistance = hueSamples > 0 ? totalHueDistance / hueSamples : 999;

  // Hairline seams are small, sparse, dark, saturated accents.
  const hairlinePresenceScore = clamp01(
    (seamCandidatePixels >= 8 ? 0.45 : seamCandidatePixels / 20) +
    (strongRatio > 0.00008 ? 0.25 : strongRatio / 0.00032) +
    (crimsonRatio > 0.00015 ? 0.20 : crimsonRatio / 0.00075) +
    (bboxArea > 0 && bboxArea < 0.22 ? 0.10 : 0)
  );

  // Fail only when red presence is broad / painted / neon-like.
  const broadRedMaskRisk =
    crimsonRatio > 0.08 ||
    strongRatio > 0.05 ||
    bboxArea > 0.35 ||
    neonRatio > 0.01;

  return {
    crimson_ratio: Number(crimsonRatio.toFixed(6)),
    crimson_seam_ratio: Number(seamRatio.toFixed(6)),
    crimson_strong_ratio: Number(strongRatio.toFixed(6)),
    crimson_neon_ratio: Number(neonRatio.toFixed(6)),
    crimson_hairline_presence_score: Number(hairlinePresenceScore.toFixed(4)),
    crimson_pixels: crimsonPixels,
    crimson_seam_pixels: seamCandidatePixels,
    crimson_bbox_area_ratio: Number(bboxArea.toFixed(6)),
    crimson_mean_hue_distance: Number((meanHueDistance === 999 ? 999 : meanHueDistance).toFixed(3)),
    crimson_detected: hairlinePresenceScore >= 0.20 ? 1 : 0,
    crimson_overuse_detected: broadRedMaskRisk ? 1 : 0,
    magenta_neon_spill: brightNeonRedPixels > 20 ? 1 : 0,
  };
}

// ===================================================================
// MASTER FUNCTION — run all pixel analyses
// ===================================================================

async function analyzePixels(imagePath) {
  const [edges, hfDensity, histogram, bleed, distortion, crimson] = await Promise.all([
    measureEdgeSharpness(imagePath),
    measureHighFrequencyDensity(imagePath),
    measureHistogram(imagePath),
    measurePixelBleed(imagePath),
    measureDistortion(imagePath),
    measureCrimsonPresence(imagePath),
  ]);

  return {
    ...edges,
    ...hfDensity,
    ...histogram,
    ...bleed,
    ...distortion,
    ...crimson,
  };
}

module.exports = {
  analyzePixels,
  measureEdgeSharpness,
  measureHighFrequencyDensity,
  measureHistogram,
  measurePixelBleed,
  measureDistortion,
  measureCrimsonPresence,
  loadRaw,
  luminance,
  deltaE_sRGB,
  rgbToHsv,
};