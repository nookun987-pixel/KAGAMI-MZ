# MIKAGE ZENITH BLADE — LIGHT_D3 PROOF

## Status

- Final lighting-stage background-only candidate.
- No visual PASS is self-declared.
- `INTEGRATION_READY = NO_OPERATOR_REVIEW_REQUIRED`.

## Single change

- Visible rendered background is canonical void `#050508`.
- Scene-linear World input was calibrated to `(0.008, 0.008, 0.011)` at strength `1.0` because the locked AgX / `-0.35 EV` transform crushed the direct sRGB-linear value to `#000000`.
- Measured rendered PNG pixel at `(100,100)`: exactly `#050508`.
- No gradient, fog, halo, local tip light, exposure adjustment, or shader change.

## D2 locks

- Complete object fingerprint including geometry, transforms, pose, cameras and every light: unchanged.
- MAT_C3 and violet material: unchanged.
- Fill: `133.828873 W`; rim: `430 W`.
- Exposure, gamma, AgX view transform and look: unchanged.
- D1/D2 physical audit remains applicable: P1/P2/P3 each `0` records and `0` triangle overlaps.

## Validation

- Final renders were opened and inspected.
- Saved derivative reopened with locked settings.
- `.blend1`: absent.

## Stop

Stopped for final operator visual approval. No LIGHT_D4 and no later stage opened.
