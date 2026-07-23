# MIKAGE ZENITH BLADE 3PHASE REBUILD V0.9 — GATE TABLE

STATUS: PASS_FOR_DRIVER_REPAIR_CANDIDATE_ONLY
CANON_LOCK: NO
ASSET_LOCK: NO
PRODUCTION_READY: NO
PUSH_DONE: NO

## Phase visibility

| Phase | blade_phase | P2 seam target / actual | P3 seam target / actual | Result |
|---|---:|---|---|---|
| P1 Compact-Idle | 0 | hidden / hidden | hidden / hidden | PASS |
| P2 Mid | 1 | visible / visible | hidden / hidden | PASS |
| P3 Max | 2 | hidden / hidden | visible / visible | PASS |

Both seam objects now drive both `hide_render` and `hide_viewport` from
`ZB3_PHASE_CONTROL["blade_phase"]`. The saved V0.9 file was reopened before
the phase table was accepted.

## Visual and signal checks

| Check | P2 | P3 | Result |
|---|---:|---:|---|
| Display violet pixels | 8,270 | 9,692 | PASS |
| Display in-band body samples | 3,531 | 4,217 | PASS |
| Median hue | 272.48° | 273.25° | PASS |
| Median R/B | 0.569 | 0.565 | PASS |
| Red hits | 0 | 0 | PASS |
| EXR violet-mask pixels | 8,114 | 9,233 | PASS |
| EXR luminance sum | 7,375.94 | 8,159.95 | PASS |

P3/P2 EXR luminance-sum ratio is approximately `1.106`. No emission, glare,
exposure, material, or color tuning was performed in V0.9.

P1 Blade seam was visually inspected in the actual render and is absent.
Remaining P1 violet belongs to the locked helmet sensor slits.

## Locked non-regression

- Mesh hash: `9FA979B33653122D7B6A2889011B4B420C5B3ACBFA7B2DB43E217BDC91C22A60`
- Blade attachment: `(1.08, -0.02, 1.75)` unchanged.
- Object transforms, camera, armature, bones, exposure, and view look: unchanged.
- Source V0.8 SHA-256: `3DCA1F09C42D841303CBDC0E688032CA9E0BB09DF3F367EE79489B34DEA0D8B6`
- Output V0.9 SHA-256: `B29567DC955F14F99DF93D45A5CD5CE2A29BE5B92A038E63756B71CD066DCBA7`

RULING: V0.9 passes the bounded phase-visibility driver repair. This is a
review candidate only and does not promote any asset gate.
