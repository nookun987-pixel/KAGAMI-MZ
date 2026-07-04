# ADDENDUM — exception #49 now routes through fal.ai (cloud API), not local ComfyUI

Operator authorization 2026-07-04: after 2 hardware/performance BLOCKED reports on the local 6GB
GPU (see AGENTS.md exception #49 + handoff RESULT #46/#48), operator approved switching the EXECUTION
PATH from local ComfyUI to the **fal.ai hosted API**. Everything else in the original brief
(`LANEA_CODEX_TASK_AI_ENHANCE_S2_DIALIN_V0_1.md`) still applies unchanged: same base image, same
canon gate, same denoise range, same prompt, same gate/report requirements, same FAIL codes. ONLY
the execution mechanism changes (server-side API call instead of local GPU inference).

## Endpoint

`fal-ai/flux-general/image-to-image` — FLUX.1 [dev] image-to-image with ControlNet/LoRA/IP-Adapter
support. Docs: https://fal.ai/models/fal-ai/flux-general/image-to-image/api
Pricing: ~$0.075/megapixel with ControlNet extensions active (confirmed via fal.ai pricing docs,
2026-07-04). At the S2 still's ~3.7MP (1440x2560), each generated image costs roughly **$0.28**.
A dial-in pass of ~15-20 candidates across 3 denoise levels costs on the order of **$4-6 total** —
operator should confirm this is an acceptable spend before a large batch; start with a handful of
candidates first, not all at once.

## Auth

Operator creates the fal.ai account and API key HIMSELF (`FAL_KEY` env var) — Codex reads it from
the environment, never asks Cowork or anyone else to supply/enter it. This is a standing rule, not
just for this task: nobody but the operator handles the actual key value.

## Mapping from the original brief to this endpoint's schema

- `image_url` = the #48 S2 still (`production/character/reviews/MIKAGE_ROBE_HERO_CINE_STAGING_V0_1_S2_STILL.png`).
  Can be sent as a base64 data URI directly (no need to host it publicly) — see "Files" section of
  the API docs.
- `strength` = the denoise value (0.45 / 0.55 / 0.65 per the original brief's ladder). Note fal's
  `strength` semantics match: 1.0 = full repaint, 0.0 = preserve original — same direction as the
  brief's denoise ladder.
- `controlnet_unions` = use the SAME model already downloaded locally for reference
  (`Shakker-Labs/FLUX.1-dev-ControlNet-Union-Pro`) by HF path — fal fetches weights server-side.
  Feed it Depth (from the source .blend AOV, same as before) and Canny/Line (from the S2 still) as
  the two control inputs, per the `ControlNetUnion` / `ControlNetUnionInput` schema (check the live
  OpenAPI schema at the docs URL above for the exact `controls` sub-fields before wiring this — do
  not guess field names, read the schema JSON directly).
- Redux/identity-lock: this endpoint doesn't have a field literally named "Redux". Try the
  `ip_adapters` field (image_url = master character reference sheet, `image_encoder_path` per
  schema) or the `reference_image_url` / `reference_strength` field (reference-only guidance) as the
  closest equivalents — experiment and report which (if either) meaningfully helps identity-lock
  vs. just relying on ControlNet's hard geometric lock. If neither helps, ControlNet alone (which
  already locks silhouette + slits + halo shape) may be sufficient — report what you find, don't
  force a mismatch.
- `guidance_scale` = 3.5 (matches brief). `num_inference_steps` = 26-28 (endpoint default is 28,
  close enough to the brief's 24-30 range). `negative_prompt` = same negative prompt as the
  original brief, unmodified.
- Same canon gate applies to every image this endpoint returns: no face/eyes/mouth, exactly 2 slits
  correctly shaped/positioned, halo neutral/white (no violet tint), violet confined to slits, no
  armor/limb reveal, cinematic realism not anime. Self-screen exactly as before; do not hand
  fal-generated images to the gate/report without checking them first.

## What does NOT change

Gate folder, `contact_sheet.png` + `contact_sheet_review_report.md` requirements, the 4 required
report sections (CANON GATE CHECK / HALO COLOR CHECK / WORKFLOW RECORD / RECOMMENDATION), the
real-deliverables paths, `python .mikage/tools/verify_output.py` requirement, no `.blend`/video
touch, no canon-lock/asset-lock/final claim, no push. WORKFLOW RECORD should now also note the
fal.ai endpoint name + exact parameters used (strength/guidance/controlnet config/seed) instead of
local ComfyUI node settings, so the recipe can be reproduced or reapplied to S0/S1 later (Step 2,
still a separate future exception).

## If fal.ai itself doesn't work out

If the ControlNet/identity-lock mapping on this endpoint can't hold canon at any usable strength
after a reasonable number of tries, or costs run away unexpectedly: stop and report exactly what
was tried and spent so far — do not keep spending without checking in again.
