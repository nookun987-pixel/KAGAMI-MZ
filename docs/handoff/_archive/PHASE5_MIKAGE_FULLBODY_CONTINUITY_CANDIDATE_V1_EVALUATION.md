# PHASE5_MIKAGE_FULLBODY_CONTINUITY_CANDIDATE_V1_EVALUATION

STATUS: REVIEW evaluation (no render by Claude). NOT canon, NOT asset-lock, NOT production-ready.
DATE: 2026-06-01
LANE: CHARACTER_CAST_LANE / Mikage (unchanged)

## 1. Result

Adopted full-body continuity candidate: **`MIKAGE_FULLBODY_V3CN_401_00001_.png`** — label **INCLUDE_AS_PHASE4_REFERENCE** (reference only).

First Mikage full-body (head-to-feet) candidate that holds faceless identity AND porcelain material. Operator-run on RunPod RealVisXL + IP-Adapter + canny ControlNet (NOT Claude/Cowork).

## 2. How it was produced

- Framing problem: anchoring IP-Adapter to an upper-body ref locked the crop to upper body (weight 0.8); lowering weight to 0.4 gave full body but lost identity → generic stormtrooper drift.
- Fix that worked: take a clean full-body standing render (`MIKAGE_FULLBODY_V2_301`) as a **canny pose-lock** (ControlNet canny, strength 0.45 — pose/proportion only, not panel copy) + **IP-Adapter weight 0.8** from the faceless upper-body reference → full body + Mikage faceless porcelain identity in one pass.
- Settings: RealVisXL V5.0, dpmpp_2m/karras, 34 steps, cfg 7, 832×1216.

## 3. Evaluation

| Check | Result |
|---|---|
| Full body head-to-feet (legs, boots) | PASS |
| Faceless sealed (no eye/visor) | PASS |
| Smooth monocoque matte porcelain | PASS |
| Black graphene underlayer in joints/torso | PASS (on-spec contrast on 401/404) |
| Anime/fashion drift | ABSENT |

Outcome: **INCLUDE_AS_PHASE4_REFERENCE** (reference only).

Batch: 401 INCLUDE (primary); 404 acceptable alt (similar black-torso contrast); 402/403 plainer (HOLD/alt).

## 4. Known limitations (fix in future pass)

- Proportions stocky / short-legged (inherited from canny source 301); reads slightly mannequin/figure.
- No weapon: the **Zenith Blade** is a SEPARATE asset (see `MIKAGE_ZENITH_BLADE_SPEC_V1.md` — 3 modes + compact-idle); not integrated here.
- This is a reference for the next clean construction pass, not a final/turnaround asset.

## 5. Status limits

NOT canon-approved · NOT asset-locked · NOT production/render/film/video/public-ready · does NOT start Phase 5 production or any film/video lane. Reference only.

## 6. Pending operator

1. Download `MIKAGE_FULLBODY_V3CN_401_00001_.png` from RunPod `output/` into canon (suggested `D:\workspace\ComfyUI\MIKAGE_CANON\10_COMPONENT_CANDIDATE_SET_V1\10_FULLBODY\`).
2. Terminate the RunPod pod (session done).

## 7. Prohibited actions confirmed

RENDER_BY_CLAUDE: NO · COMFYUI_RUNTIME_BY_CLAUDE: NO · BLENDER_USED: NO · CANON_APPROVAL: NO · ASSET_LOCK: NO · PRODUCTION_READY: NO · PHASE5_PRODUCTION_STARTED: NO · FILM_VIDEO_SHORT_SHOTLIST: NO · LANE_CHANGED: NO · ASSET_GENERATED_BY_CLAUDE: NO (operator on RunPod)
