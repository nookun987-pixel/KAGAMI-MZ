# BOOS VISUAL RULING — MIKAGE_ZENITH_BLADE_3PHASE_REBUILD_V0_4 (2026-07-07)

```text
BOOS VISUAL RULING — V0.4
RESULT = FAIL_VISUAL
TECHNICAL_STATUS = CANDIDATE_PASS
FINAL_APPROVAL = NO
```

## Reasons

**Reason 1 — hue.** The core body reads cobalt/indigo, not Mikage electric violet.
Peak bloom values `#B9B2FF` / `#C0BAFF` are not valid proof of the core body hue —
they are near-white clipped highlight samples. Independent measurement of the core
body (contact sheet, median of solid inner pixels): P2 `(48,33,255)` hue `243.9°`
R/B `0.19`; P3 `(38,19,255)` hue `245.1°` R/B `0.15`. Brand violet `#8F00FF` =
hue `273.6°`, R/B `0.56`. Core is ~29–30° too blue.

**Reason 2 — phase separation.** P2 and P3 differ in pixels but not enough to read
as two phases. P3 is ~1px wider and more blue-saturated, but per-pixel brightness is
~12% LOWER than P2; total visual energy only ~3–4% higher. At contact-sheet scale
P2 ≈ P3; MID → MAX is not readable.

## Validation-method finding

The `B-R >= 40` gate only proves "not red / not white" — it does not prove violet.
Measuring the peak pixel measures bloom clipping, not the core body. From V0.5 on,
the color gate measures the MEDIAN of solid core-body pixels in the final PNG,
excluding bloom, clipped highlights, and edge pixels.

## Disposition

- V0.4 blend + proof artifacts are KEPT as technical candidate / audit trail.
- Proceed to `MIKAGE_ZENITH_BLADE_3PHASE_REBUILD_V0_5` — one combined correction
  pass (hue + phase separation). Exception #58.
- If V0.5 still measures peak instead of core body, or P3 is only bluer than P2:
  `RESULT = FAIL_VALIDATION_METHOD`. No further eyeball color adjustment until the
  validator measures the correct core-body region.
