# MIKAGE ZENITH BLADE 3PHASE REBUILD V0.6 GATE TABLE

| Gate | P2 | P3 | Result |
|---|---:|---:|---|
| PNG median RGB | (119, 35, 230) | (113, 23, 221) | measured |
| PNG median hue | 265.85 deg | 267.27 deg | FAIL |
| PNG R/B | 0.5174 | 0.5113 | FAIL |
| P2 core-line clipped fraction | 0.6937 | n/a | FAIL |
| EXR median luminance | 0.19558896 | 0.11759684 | ratio 0.6012 = FAIL |
| Glow envelope area | 3944 px | 4748 px | ratio 1.2039 = FAIL |
| Envelope threshold | b>0.20 and b>1.45*r and b>3.0*g | b>0.20 and b>1.45*r and b>3.0*g | same threshold |
| Solid core sample count | 592 | 948 | measured |

P1 zero-emissive violet-pixel count: 0
Zero-red scan hits: {"P1.png": 0, "P2.png": 0, "P3.png": 0}
Overall measured status: FAIL
Blocker: HUE_VIOLATION, P2_CLIP_VIOLATION, PHASE_SEPARATION_VIOLATION
