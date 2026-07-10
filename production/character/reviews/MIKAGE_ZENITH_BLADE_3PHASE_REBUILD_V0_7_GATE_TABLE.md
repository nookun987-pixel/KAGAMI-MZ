# MIKAGE ZENITH BLADE 3PHASE REBUILD V0.7 GATE TABLE

| Gate | P2 | P3 | Result |
|---|---:|---:|---|
| PNG core-line clipped fraction | 0.581846 | 0.584609 | FAIL |
| EXR body median RGB float | (1.486145, 0.042909, 5.342641) | (1.493917, 0.017664, 5.401808) | measured pre-tonemap |
| EXR body median hue | 256.339345 deg | 256.451115 deg | FAIL |
| EXR body R/B | 0.278167 | 0.276559 | FAIL |
| PNG body hue cross-check | 267.812500 deg | 268.934010 deg | reported only |
| PNG body R/B cross-check | 0.497561 | 0.495050 | reported only |
| EXR energy median luminance | 0.73017678 | 0.71794534 | ratio 0.983249 = FAIL |
| Energy mask definition | EXR body/energy: b>0.001 and b>2.2*r and b>20*g | EXR body/energy: b>0.001 and b>2.2*r and b>20*g | phase-aware object render mask, excludes P3 gap/background |
| PNG glow envelope area | 6500 px | 7446 px | ratio 1.145538 = FAIL |
| PNG envelope threshold | b>0.18 and b>1.35*r and b>2.2*g | b>0.18 and b>1.35*r and b>2.2*g | same threshold |
| EXR body sample count | 7272 | 8434 | measured |

P1 zero-emissive violet-pixel count: 0
Zero-red scan hits: {"P1.png": 0, "P2.png": 0, "P3.png": 0}
Geometry equal vs V0_6: True; attachment_equal: True; changed geometry objects: []
Emission base color locked: True
Overall measured status: FAIL
Blocker: P2_CLIP_VIOLATION, HUE_VIOLATION, PHASE_SEPARATION_VIOLATION
