# ZENITH BLADE INTEGRATION AUDIT V0.1

RESULT: PASS_AUDIT / FAIL_DIRECT_TRANSFER
BLEND_EDIT: NO

## Sources

- V0.12 geometry baseline SHA-256:
  `38780C45F96F31D540B9C98707FC426ACE6CB3FBEAED9F1FAFB1706CDEDE944F`
- Lookdev candidate SHA-256:
  `4504B58B1BDA9843D25673FE1AB9115ECA8F17E95EFBC5E369EB2D7D355D9700`

## Baseline integration anchors

- Slab location `(-1.27, -0.48, 1.62)`, dimensions `(0.18, 0.085, 1.24)`.
- Handle location `(-1.13, -0.48, 2.14)`, dimensions `(0.10, 0.075, 0.38)`.
- Gauntlet clamp location `(-1.04, -0.43, 2.21)`.
- Holster foot location `(-1.18, -0.43, 1.03)`.

## Candidate mismatch

- Candidate core location `(1.08, -0.02, 1.75)`.
- Candidate P3 core dimensions approximately `(0.4925, 0.1944, 2.70)`.
- Candidate grip ring diameter approximately `0.8806`.

The candidate is approximately `2.18x` the baseline length and uses a grip
ring far larger than the V0.12 registered guard/grip relationship. It is also
on the opposite side and a different depth plane.

## Ruling

Do not copy or append V0.12-lookdev geometry into the hero-mount baseline.
Transfer only the verified logic:

- P1 shell contracted; no Blade violet.
- P2 shell split; no Blade violet.
- P3 wider split; exactly one violet core.
- Matte porcelain shell / dark internal frame as candidate material language.

Next safe action: create a fresh derivative of the hero-mount V0.12 baseline
and rebuild small shell panels natively around its registered slab, handle,
gauntlet, and holster. The original baseline remains untouched.
