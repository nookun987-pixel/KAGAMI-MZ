/**
 * MIKAGE — Z-Blue Detector
 * Detects Z-Blue regions and measures color fidelity against master swatch.
 */

"use strict";

const sharp = require("sharp");
const path = require("path");
const fs = require("fs");

// Z-Blue locked cine swatch: #4B5866 Ao-zumi / Steel Oxide, muted and non-emissive.
const Z_BLUE_MASTER = { r: 75, g: 88, b: 102 }; // #4B5866
const Z_BLUE_HUE_CENTER = 211; // degrees
const Z_BLUE_HUE_TOLERANCE = 25; // +-25 degrees
const Z_BLUE_SAT_MIN = 0.18;
const Z_BLUE_VALUE_MIN = 0.22;

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

/**
 * CIE76 Delta E in sRGB space (approximation).
 */
function deltaE(r1, g1, b1, r2, g2, b2) {
  return Math.sqrt((r1 - r2) ** 2 + (g1 - g2) ** 2 + (b1 - b2) ** 2);
}

/**
 * Check if a pixel is in Z-Blue hue range.
 */
function isZBluePixel(r, g, b) {
  const hsv = rgbToHsv(r, g, b);
  const hueDist = Math.min(
    Math.abs(hsv.h - Z_BLUE_HUE_CENTER),
    360 - Math.abs(hsv.h - Z_BLUE_HUE_CENTER)
  );
  return hueDist <= Z_BLUE_HUE_TOLERANCE && hsv.s >= Z_BLUE_SAT_MIN && hsv.v >= Z_BLUE_VALUE_MIN;
}

/**
 * Detect Z-Blue regions and measure color fidelity.
 */
async function detectZBlue(imagePath) {
  const img = sharp(imagePath).removeAlpha().toColorspace("srgb");
  const { data, info } = await img.raw().toBuffer({ resolveWithObject: true });
  const { width, height, channels } = info;
  const pixCount = width * height;

  let zBluePixels = 0;
  let totalDeltaE = 0;
  let maxDeltaE = 0;
  let contaminatedPixels = 0;

  // Also track hue shifts
  let totalHueShift = 0;
  let totalSatShift = 0;

  const step = 2; // sample every 2nd pixel for speed
  let sampledZBlue = 0;

  for (let y = 0; y < height; y += step) {
    for (let x = 0; x < width; x += step) {
      const off = (y * width + x) * channels;
      const r = data[off], g = data[off + 1], b = data[off + 2];

      if (isZBluePixel(r, g, b)) {
        zBluePixels++;
        sampledZBlue++;

        const dE = deltaE(r, g, b, Z_BLUE_MASTER.r, Z_BLUE_MASTER.g, Z_BLUE_MASTER.b);
        totalDeltaE += dE;
        if (dE > maxDeltaE) maxDeltaE = dE;

        // Check for contamination: if deltaE > threshold, pixel is contaminated
        if (dE > 40) {
          contaminatedPixels++;
        }

        // Hue/sat shift from master
        const hsv = rgbToHsv(r, g, b);
        const hueShift = Math.min(
          Math.abs(hsv.h - Z_BLUE_HUE_CENTER),
          360 - Math.abs(hsv.h - Z_BLUE_HUE_CENTER)
        );
        totalHueShift += hueShift;

        const masterHsv = rgbToHsv(Z_BLUE_MASTER.r, Z_BLUE_MASTER.g, Z_BLUE_MASTER.b);
        totalSatShift += Math.abs(hsv.s - masterHsv.s);
      }
    }
  }

  const zBlueRatio = zBluePixels / (pixCount / (step * step));
  const avgDeltaE = sampledZBlue > 0 ? totalDeltaE / sampledZBlue : 0;
  const avgHueShift = sampledZBlue > 0 ? totalHueShift / sampledZBlue : 0;
  const avgSatShift = sampledZBlue > 0 ? totalSatShift / sampledZBlue : 0;
  const contaminationRatio = sampledZBlue > 0 ? contaminatedPixels / sampledZBlue : 0;

  return {
    z_blue_detected: zBluePixels > 0,
    z_blue_pixel_ratio: zBlueRatio,
    z_blue_delta_e: avgDeltaE > 30 ? 1 : 0,         // signal: 1 = failed
    z_blue_color_shift_detected: avgHueShift > 10 ? 1 : 0,  // signal: 1 = shift detected
    delta_e: avgDeltaE,
    color_shift_hsv: avgHueShift,
    max_delta_e: maxDeltaE,
    contamination_ratio: contaminationRatio,
    avg_saturation_shift: avgSatShift,
    z_blue_pixel_count: zBluePixels,
    product_color_delta_e: avgDeltaE > 30 ? 1 : 0,   // C4 signal
    regional_hsv_shift: avgHueShift > 10 ? 1 : 0,    // C4 signal
  };
}

module.exports = {
  detectZBlue,
  isZBluePixel,
  Z_BLUE_MASTER,
};
