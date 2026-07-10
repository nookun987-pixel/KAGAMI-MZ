# MIKAGE ZENITH BLADE 3PHASE REBUILD V0.8 GATE TABLE

| Gate | P2 | P3 | Result |
|---|---:|---:|---|
| DISPLAY body median RGB | (115, 12, 223) | (107, 5, 213) | measured on PNG/display unclipped in-band body |
| DISPLAY body hue | 269.171271 deg | 269.423077 deg | PASS |
| DISPLAY body R/B | 0.512605 | 0.500000 | PASS |
| In-band body px count | 1245 | 1604 | PASS |
| Every sampled cross-section has >=1 in-band px | True | True | PASS |
| Clip fraction INFO | 0.558629 | 0.572503 | info only |
| Source emitter radiance RGB | (0.0066, 0.0, 0.02) | (0.029700002, 0.0, 0.090000004) | source ratio B 4.500000 |
| Driver swap confirmation | P2 seam visible in requested P2 = False | P3 seam visible in requested P3 = True; P3 visible in requested P1 = True | FAIL: driver does not swap |
| Glare clamp check | not reached | not reached | PHASE_WIRING_BLOCKER before glare tuning |
| EXR energy median luminance | 0.72492456 | 0.72589482 | ratio 1.001338; diagnostic only under failed phase wiring |
| EXR energy mask | EXR violet core: b>0.001 and b>2.2*r and b>20*g | EXR violet core: b>0.001 and b>2.2*r and b>20*g | diagnostic only |
| PNG glow envelope area | 6507 px | 7448 px | ratio 1.144613; diagnostic only |

P1 zero-emissive result: True; P1 envelope px: 0
Zero-red scan hits: P1=0, P2=0, P3=0
Geometry equal vs V0_7: True; attachment_equal: True; changed geometry objects: []
Emission base color locked: True
Overall measured status: FAIL
Blocker: PHASE_WIRING_BLOCKER
