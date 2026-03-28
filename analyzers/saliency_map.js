/**
 * MIKAGE — Saliency Map Analyzer
 * Estimates visual saliency to determine where viewer attention falls.
 *
 * Method: Luminance-weighted center-surround contrast (Itti-Koch inspired).
 * Produces saliency heat map and determines if peak attention lands in product zone.
 */

"use strict";

const sharp = require("sharp");

/**
 * Compute a downscaled saliency map using center-surround luminance contrast.
 * Returns saliency metrics for the Mikage rule engine.
 */
async function analyzeSaliency(imagePath) {
  const img = sharp(imagePath).removeAlpha().toColorspace("srgb");
  const { data, info } = await img.raw().toBuffer({ resolveWithObject: true });
  const { width, height, channels } = info;

  // Build luminance
  const lum = new Float32Array(width * height);
  for (let i = 0; i < width * height; i++) {
    const off = i * channels;
    lum[i] = 0.2126 * data[off] + 0.7152 * data[off + 1] + 0.0722 * data[off + 2];
  }

  // Downsample for speed — work on ~200px wide version
  const scale = Math.max(1, Math.floor(width / 200));
  const sw = Math.floor(width / scale);
  const sh = Math.floor(height / scale);

  // Downsampled luminance
  const sLum = new Float32Array(sw * sh);
  for (let sy = 0; sy < sh; sy++) {
    for (let sx = 0; sx < sw; sx++) {
      sLum[sy * sw + sx] = lum[(sy * scale) * width + (sx * scale)];
    }
  }

  // Compute center-surround contrast at each point
  // Compare local mean (3x3) vs surround mean (9x9)
  const saliency = new Float32Array(sw * sh);
  const innerR = 1;
  const outerR = 4;

  for (let sy = outerR; sy < sh - outerR; sy++) {
    for (let sx = outerR; sx < sw - outerR; sx++) {
      let innerSum = 0, innerN = 0;
      for (let dy = -innerR; dy <= innerR; dy++) {
        for (let dx = -innerR; dx <= innerR; dx++) {
          innerSum += sLum[(sy + dy) * sw + (sx + dx)];
          innerN++;
        }
      }
      const innerMean = innerSum / innerN;

      let outerSum = 0, outerN = 0;
      for (let dy = -outerR; dy <= outerR; dy++) {
        for (let dx = -outerR; dx <= outerR; dx++) {
          if (Math.abs(dy) <= innerR && Math.abs(dx) <= innerR) continue;
          outerSum += sLum[(sy + dy) * sw + (sx + dx)];
          outerN++;
        }
      }
      const outerMean = outerN > 0 ? outerSum / outerN : innerMean;

      saliency[sy * sw + sx] = Math.abs(innerMean - outerMean);
    }
  }

  // Also factor in color saturation as saliency boost
  for (let sy = 0; sy < sh; sy++) {
    for (let sx = 0; sx < sw; sx++) {
      const off = ((sy * scale) * width + (sx * scale)) * channels;
      const r = data[off], g = data[off + 1], b = data[off + 2];
      const maxC = Math.max(r, g, b);
      const minC = Math.min(r, g, b);
      const sat = maxC > 0 ? (maxC - minC) / maxC : 0;
      saliency[sy * sw + sx] += sat * 30; // boost saturated regions
    }
  }

  // 30-40-30 zone boundaries
  const leftEnd = Math.floor(sw * 0.30);
  const rightStart = Math.floor(sw * 0.70);

  // Find peak saliency and zone distribution
  let maxSaliency = 0;
  let maxSx = 0, maxSy = 0;
  let centerSaliencySum = 0, centerCount = 0;
  let sideSaliencySum = 0, sideCount = 0;
  let totalSaliencySum = 0, totalCount = 0;

  for (let sy = 0; sy < sh; sy++) {
    for (let sx = 0; sx < sw; sx++) {
      const s = saliency[sy * sw + sx];
      totalSaliencySum += s;
      totalCount++;

      if (s > maxSaliency) {
        maxSaliency = s;
        maxSx = sx;
        maxSy = sy;
      }

      if (sx >= leftEnd && sx < rightStart) {
        centerSaliencySum += s;
        centerCount++;
      } else {
        sideSaliencySum += s;
        sideCount++;
      }
    }
  }

  const peakInCenter = maxSx >= leftEnd && maxSx < rightStart;
  const centerAvgSaliency = centerCount > 0 ? centerSaliencySum / centerCount : 0;
  const sideAvgSaliency = sideCount > 0 ? sideSaliencySum / sideCount : 0;
  const totalAvgSaliency = totalCount > 0 ? totalSaliencySum / totalCount : 0;

  // Center dominance ratio: how much more salient is center vs sides
  const centerDominance = sideAvgSaliency > 0 ? centerAvgSaliency / sideAvgSaliency : 1;

  // Thumbnail test: downsample further to ~50px and check if center still dominates
  const thumbScale = Math.max(1, Math.floor(sw / 50));
  const tw = Math.floor(sw / thumbScale);
  const th = Math.floor(sh / thumbScale);
  const thumbLeftEnd = Math.floor(tw * 0.30);
  const thumbRightStart = Math.floor(tw * 0.70);

  let thumbCenterMax = 0, thumbSideMax = 0;
  for (let ty = 0; ty < th; ty++) {
    for (let tx = 0; tx < tw; tx++) {
      const s = saliency[(ty * thumbScale) * sw + (tx * thumbScale)];
      if (tx >= thumbLeftEnd && tx < thumbRightStart) {
        if (s > thumbCenterMax) thumbCenterMax = s;
      } else {
        if (s > thumbSideMax) thumbSideMax = s;
      }
    }
  }
  const thumbnailSubjectRetention = thumbCenterMax >= thumbSideMax ? 1 : 0;
  const thumbnailSaliencyRank = thumbCenterMax >= thumbSideMax ? "subject" : "background";

  // Estimate "recognition time" heuristic:
  // If center dominance > 1.2, recognition is fast (~0.5s proxy).
  // If center dominance < 0.8, recognition is slow (~2.0s proxy).
  const recognitionTime = centerDominance >= 1.2 ? 0.5 :
                          centerDominance >= 1.0 ? 0.8 :
                          centerDominance >= 0.8 ? 1.2 : 2.0;

  // Primary subject confidence from saliency distribution
  const primarySubjectConfidence = Math.min(centerDominance / 2.0, 1.0);

  return {
    // T8: Visual anchor priority
    saliency_peak_zone: peakInCenter ? "product_safe_zone" : "side_zone",

    // C1: Commercial readability
    recognition_time_seconds: recognitionTime,
    primary_subject_confidence: primarySubjectConfidence,

    // C3: Thumbnail hierarchy
    thumbnail_saliency_rank: thumbnailSaliencyRank,
    thumbnail_subject_retention: thumbnailSubjectRetention,

    // Raw metrics
    center_avg_saliency: centerAvgSaliency,
    side_avg_saliency: sideAvgSaliency,
    center_dominance_ratio: centerDominance,
    max_saliency: maxSaliency,
    peak_position: { x: maxSx / sw, y: maxSy / sh },
  };
}

module.exports = { analyzeSaliency };
