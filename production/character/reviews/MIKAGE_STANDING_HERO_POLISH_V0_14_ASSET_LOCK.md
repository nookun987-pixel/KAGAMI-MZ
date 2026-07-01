# ASSET LOCK — MIKAGE STANDING HERO (V0.14)
Record type: ASSET-LOCK · Authority: OPERATOR RULING (BOOS BỚP / Phi Hùng) · Date: 2026-07-02
Recorded by: Lane B (Cowork). This record documents an OPERATOR-authorized lock; it is not a self-approval by the agent.

## OWNER RULING (verbatim intent)
APPROVE AND LOCK `MIKAGE_STANDING_HERO_POLISH_V0_14` AS THE OFFICIAL STANDING HERO.
- Canon visual review: PASS (operator)
- Slit hue: PASS — violet, not magenta
- Zenith Blade legibility: PASS
- Cloak separation: PASS
- Geometry / material / transform drift: NONE
- Candidate approved for asset lock → create asset-lock record and commit
- NO push until separate push authorization
- After lock, proceed to build-log video using V0.14 as the final money-shot
- Do not reopen emission polish unless downstream export visibly shifts the hue

## WHAT IS LOCKED
This lock covers the V0.14 standing-hero presentation derivative and its money-shot frame.
It does NOT re-open or re-lock the underlying geometry line (helmet geometry remains at its own
V0.7 confirmed base; body geometry FREEZE at V0.10). Only camera + lighting + the two-slit
emission hue changed from V0.13 to V0.14.

| Asset | Path | sha256 |
|---|---|---|
| Standing hero blend (LOCKED) | production/character/production_actor/rig_derivatives/MIKAGE_STANDING_HERO_POLISH_V0_14.blend | c0d8a9785c794683004561ceffa59f378f629ec83b2a498c1f42e20b9394239a |
| Hero money-shot PNG (LOCKED, 1440×1800) | production/character/reviews/MIKAGE_STANDING_HERO_POLISH_V0_14_HERO.png | a8db09d3a48d6e9a275f5c92e7f4387896c7cae3973e675ded4c60e1d258450e |
| Contact sheet (2700×1500) | production/character/reviews/MIKAGE_STANDING_HERO_POLISH_V0_14_CONTACT_SHEET.png | 82ce7be07825e97f8c0e48ba08372cbb58230113c1b3b23cfed98cac5adb3e58 |
| Codex proof | production/character/reviews/MIKAGE_STANDING_HERO_POLISH_V0_14_PROOF.md | 98c38292f458595caf2253d462cebb9b29f26cd74402fa1f3c24ea2a72558063 |

## VERIFICATION ON RECORD
- Codex gate: validator PASS · gate folder exactly 2 files · `.blend1 = 0`.
- Geometry / body / object transforms UNCHANGED vs V0.13. Non-slit materials UNCHANGED; only `V0_8_TWO_SLITS_ONLY` emission changed.
- Slit hue pixel-sample (Codex): hero core `#870BEE`, contact core `#9009F6` — violet, not red-dominant magenta.
- Slit hue pixel-sample (Lane B independent, on the hero PNG): mean `#8220DF` (131,33,223), bright core `#9F22FF` — blue-dominant, violet. Confirms Codex.
- Target reference `#8F00FF`; exact per-pixel match is NOT a lock condition (emission + bloom + color management + anti-aliasing legitimately shift the rendered hex). Lock condition = hue stays in the violet band and does NOT drift to magenta.

## LOCK SCOPE + GUARDRAILS
- Status: ASSET-LOCKED as the official standing hero. Committed locally. NOT pushed (awaiting separate push authorization).
- This is a BRAND/interface-usable hero asset (per two-layer canon). It is NOT a claim of "final/production-ready" beyond the operator's standing-hero lock.
- Do NOT reopen the slit-emission polish unless a downstream export (build-log video / social / web) VISIBLY shifts the hue toward pink. In that case: fix at the EXPORT / color-management stage, do NOT edit or re-lock the asset, then re-verify pixel hue on the output file.

## NEXT
Proceed to the build-log video (step A) per `production/character/build_log/00_BUILD_LOG_STANDARD.md`,
using the V0.14 hero as the final money-shot. Separate dispatch.
