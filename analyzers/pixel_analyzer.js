/**
 * MIKAGE — Pixel Analyzer
 * Real image analysis for Mikage rule engine signals.
 * Uses sharp for image loading + raw pixel math.
 */

"use strict";

const sharp = require("sharp");
const path = require("path");

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

// ===================================================================
// 1. EDGE SHARPNESS (Laplacian-based)
// ===================================================================

/**
 * Measure edge sharpness using Laplacian kernel on luminance.
 * Returns gradient magnitude mean — higher = sharper.
 */
async function measureEdgeSharpness(imagePath) {
  const { data, width, height, channels } = await loadRaw(imagePath);

  // Build luminance array
  const lum = new Float32Array(width * height);
  for (let i = 0; i < width * height; i++) {
    const off = i * channels;
    lum[i] = luminance(data[off], data[off + 1], data[off + 2]);
  }

  // 3x3 Laplacian kernel: [0,-1,0 / -1,4,-1 / 0,-1,0]
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
  // Normalize to 0-1 range (typical values: 0-50 for 8-bit images)
  const normalized = Math.min(meanGradient / 30, 1.0);

  return {
    edge_sharpness_gradient: normalized,
    edge_blur_radius: normalized < 0.15 ? 1 : 0, // blur detected if very low sharpness
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

  // 5x5 local variance
  const winSize = 2;
  let totalVariance = 0, count = 0;
  const step = 4; // sample every 4th pixel for speed
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
  // Normalize: typical range 0-2000 for 8-bit
  const density = Math.min(avgVariance / 800, 1.0);

  return {
    high_frequency_pixel_density: density,
    high_frequency_pixel_density_delta: density - 0.3, // delta from baseline
    edge_halo_detection: density < 0.1 ? 1 : 0, // dead texture = possible halo
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
  // Ideal mid-tone exposure ~128
  const exposureDelta = (meanLum - 128) / 128; // -1.0 to +1.0

  // Clipping: % pixels at extremes (0-5 or 250-255)
  let clippedDark = 0, clippedBright = 0;
  for (let i = 0; i <= 5; i++) clippedDark += histogram[i];
  for (let i = 250; i <= 255; i++) clippedBright += histogram[i];
  const clippingRatio = (clippedDark + clippedBright) / pixCount;

  return {
    exposure_value_delta: exposureDelta,
    histogram_clipping: clippingRatio > 0.05 ? 1 : 0, // >5% pixels clipped
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

  // Find strong edges (Sobel-like) and measure color variance at those points
  let edgePixels = 0, bleedPixels = 0;
  const step = 2;
  for (let y = 1; y < height - 1; y += step) {
    for (let x = 1; x < width - 1; x += step) {
      const c = y * width + x;
      const gx = Math.abs(lum[c + 1] - lum[c - 1]);
      const gy = Math.abs(lum[c + width] - lum[c - width]);
      const grad = gx + gy;

      if (grad > 30) { // strong edge
        edgePixels++;
        // Check if RGB values around edge have unusual variance (bleed)
        const off1 = ((y) * width + (x - 1)) * channels;
        const off2 = ((y) * width + (x + 1)) * channels;
        const rDiff = Math.abs(data[off1] - data[off2]);
        const gDiff = Math.abs(data[off1 + 1] - data[off2 + 1]);
        const bDiff = Math.abs(data[off1 + 2] - data[off2 + 2]);
        // High color divergence at edge = potential bleed
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
  const pixCount = width * height;
  const step = 3;

  for (let y = 1; y < height - 1; y += step) {
    for (let x = 1; x < width - 1; x += step) {
      const off = (y * width + x) * channels;
      const r = data[off], g = data[off + 1], b = data[off + 2];

      // Check for RGB channel separation (chromatic aberration)
      const offL = (y * width + (x - 1)) * channels;
      const offR = (y * width + (x + 1)) * channels;
      const rShift = Math.abs(data[offL] - data[offR]);
      const gShift = Math.abs(data[offL + 1] - data[offR + 1]);
      const bShift = Math.abs(data[offL + 2] - data[offR + 2]);

      // Large difference between channel shifts = chromatic split
      const maxShift = Math.max(rShift, gShift, bShift);
      const minShift = Math.min(rShift, gShift, bShift);
      if (maxShift - minShift > 80) {
        distortedCount++;
        continue;
      }

      // Check for VHS-style noise: high local variance in single channel
      const offU = ((y - 1) * width + x) * channels;
      const offD = ((y + 1) * width + x) * channels;
      const rVar = Math.abs(data[offU] - data[off]) + Math.abs(data[offD] - data[off]);
      const gVar = Math.abs(data[offU + 1] - data[off + 1]) + Math.abs(data[offD + 1] - data[off + 1]);
      const bVar = Math.abs(data[offU + 2] - data[off + 2]) + Math.abs(data[offD + 2] - data[off + 2]);
      // One channel highly variable while others stable = noise pattern
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
// MASTER FUNCTION — run all pixel analyses
// ===================================================================

async function analyzePixels(imagePath) {
  const [edges, hfDensity, histogram, bleed, distortion] = await Promise.all([
    measureEdgeSharpness(imagePath),
    measureHighFrequencyDensity(imagePath),
    measureHistogram(imagePath),
    measurePixelBleed(imagePath),
    measureDistortion(imagePath),
  ]);

  return {
    ...edges,
    ...hfDensity,
    ...histogram,
    ...bleed,
    ...distortion,
  };
}

module.exports = {
  analyzePixels,
  measureEdgeSharpness,
  measureHighFrequencyDensity,
  measureHistogram,
  measurePixelBleed,
  measureDistortion,
  // Helpers exposed for testing
  loadRaw,
  luminance,
  deltaE_sRGB,
  rgbToHsv,
};
