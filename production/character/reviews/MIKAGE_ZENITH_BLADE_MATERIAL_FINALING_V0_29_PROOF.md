# ZENITH BLADE V0.29 — MATERIAL FINALING PROOF

TASK_RESULT: `PASS_FOR_OPERATOR_MATERIAL_REVIEW`  
OUTPUT_STATUS: `MATERIAL_FINALING_CANDIDATE_ONLY`  
ASSET_LOCK / INTEGRATION_READY / PRODUCTION_READY / VISUAL_APPROVAL: `NO`

## Source and output

- Accepted source:
  `production/character/MIKAGE_ZENITH_BLADE_INTERFACE_REGISTRATION_V0_28.blend`
- Source SHA-256:
  `EBBA442D8BA2FE0F5DB96A99D41A7D45C89A0BCBA5E6ECC4F5551742C5FE09D0`
- Output:
  `production/character/MIKAGE_ZENITH_BLADE_MATERIAL_FINALING_V0_29.blend`
- Output SHA-256:
  `317678F6173D1FED3789DCA68FEC7B880D8E7955A45E2495BC7EC2D08C863BE5`
- V0.28 remained unchanged.

## Ten controlled passes

1. PASS — clean repo, source hash, material assignments and protected
   fingerprints recorded.
2. PASS — separate V0.29 derivative created.
3. PASS — existing B4C refined to matte mineral ceramic.
4. PASS — existing dark Titanium refined to restrained load-bearing metal.
5. PASS — existing cold-steel rails refined for cool specular separation.
6. PASS — existing single P3-core emission reduced for unclipped, non-bloom
   depth/read; hue and geometry preserved.
7. PASS — neutral white/cool-grey review lighting established without dramatic
   rim or colored environment.
8. PASS — material, phase and clean neutral review evidence rendered.
9. PASS — all PNGs directly inspected; derivative reopened and fingerprinted.
10. PASS — proof, `.blend1` check, whitelist audit and local commit prepared;
    no push.

## Material values

### B4C porcelain

- Base color: `(0.72, 0.69, 0.65)`.
- Metallic: `0.00`.
- Roughness: `0.68`.
- Coat weight: `0.06`.
- Coat roughness: `0.32`.
- Result: retained seam/bevel detail without blown-white loss; matte mineral
  ceramic read under neutral exposure.

### Dark Titanium

- Base color: `(0.035, 0.045, 0.065)`.
- Metallic: `0.82`.
- Roughness: `0.40`.
- Result: dark load-bearing frame with restrained edge response.

### Cold steel rails

- Base color: `(0.12, 0.16, 0.22)`.
- Metallic: `0.95`.
- Roughness: `0.20`.
- Result: cooler/lighter specular separation from dark Titanium without mirror
  gloss.

### P3 core

- Existing color preserved: `(0.278, 0.0, 1.0)`.
- Existing emission strength changed from `1.25` to `0.90`.
- Geometry, transform and signal area unchanged.
- Result: exactly one controlled core with no halo, wash or bloom dependence.

## Protected regression

- Protected fingerprint difference count: `0`.
- Compared for every non-review-light/camera object:
  type, location, rotation, scale, dimensions, modifiers, vertex/polygon count
  and drivers.
- Material assignment difference count: `0`.
- Geometry, topology, modifiers, registration, attachment transforms, bridge,
  docking, root placement, shell spacing and phase drivers are unchanged.
- Actor rig, mesh, pose and visibility are unchanged.
- P1/P2 signal off; P3 exactly one electric-violet core.
- No red/crimson, warm/gold weapon color, ambient violet, wash, halo or
  secondary core.

## Neutral evidence

- Material gate: `3600 x 1800`, directly inspected.
  - B4C full and close material reads.
  - Dark-Titanium and cold-steel inspection.
  - P3-core inspection.
  - True grayscale conversion panel for value separation.
- Phase gate: `3000 x 1200`, directly inspected at identical camera/scale.
- Neutral review crop: `1800 x 2400`, directly inspected; complete P3 Blade,
  no overlay and no critical crop.
- Lighting uses three broad neutral area sources and exposure `-0.55`; no
  dramatic rim or colored environment was used to simulate material quality.

## Repository and safety

- Evidence source: Blender 5.1.2 material audit, derivative reopen, protected
  fingerprint comparison, SHA-256, exact image-dimension checks and direct PNG
  inspection.
- Initial HEAD:
  `0f037c6 governance: accept Blade V0.28 and open V0.29`.
- Changed repository files are restricted to `AGENTS.md` and the five approved
  V0.29 outputs.
- V0.29 `.blend1`: `NONE`.
- Commit status: `LOCAL_COMMIT_PREPARED`; final commit hash is reported in the
  task final response to avoid a self-referential field.
- Push status: `NOT_PUSHED`.
- Blocker: `NONE`.

## Next safe action

Operator reviews the V0.29 material gate, phase gate and neutral crop. This
candidate does not self-issue material acceptance, asset-lock, integration-ready
or production-ready status.
