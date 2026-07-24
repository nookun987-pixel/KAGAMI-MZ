# ZENITH BLADE MATERIAL FIDELITY V0.26 — PROOF

TASK_RESULT: `PASS_FOR_OPERATOR_VISUAL_REVIEW`  
OUTPUT_STATUS: `REVIEW_CANDIDATE_ONLY`  
ASSET_LOCK / PRODUCTION_READY / PUSH: `NO`

## Source protection

- Source: `production/character/MIKAGE_ZENITH_BLADE_CANON_MECHANICAL_DEFINITION_V0_25.blend`
- Source SHA-256 before/after:
  `479ADE2507102FEB9EED220DBCC27053AE857D6AE2145EA4EAA75D9640887760`
- Source mutation: `NO`
- Output SHA-256:
  `741023E6F3A220128E5D11BE222EB45D2AEA814DCA5A3A97D5EAED5B1D4B9123`

## Material work

- B4C shell: matte mineral ceramic, restrained off-white value, roughness
  `0.78`, procedural high-frequency micro-bump only.
- Dark Titanium load path: cool graphite-black metal, metallic `0.76`,
  roughness `0.34`; edges remain readable without decorative gloss.
- Paired cold-steel rails: cool neutral steel, metallic `0.92`, roughness
  `0.22`; non-emissive.
- P3 core: existing core only, electric-violet family, emission reduced to
  `1.25` to avoid clipping.
- Review world and cool neutral lights were refined for evidence only.

No geometry, modifier, transform, driver, phase spacing, object ownership or
component family changed.

## Validation

- Reopened V0.26 in Blender 5.1.2: PASS.
- Source hash unchanged: PASS.
- Exact object ownership: MATCH.
- Meshes, transforms and modifiers: MATCH.
- Phase samples: MATCH.
- P1 core: off.
- P2 core: off.
- P3 core: exactly one visible.
- Forbidden Blade-adjacent integration objects: none.
- Red/crimson, warm/gold signal, violet wash/halo/ambient or secondary core: none.
- `.blend1`: none remains.

The first material-detail gate was rejected because the load path and rails
were too dark. The accepted gate raises exposure only for evidence detail
panels; the saved asset material values remain unchanged.

## Render evidence

- Material gate: `3600 x 1800`, SHA-256
  `4FEA4D22AF0C8D014C7C356FB8F3139DE5C24ADA30D763605E67856BCE9DC4E1`.
- Phase gate: `3000 x 1200`, SHA-256
  `80342242A02ADEDED256B60CAAE8224E6DB67FBC471BE704E55A4562990B8D23`.
- Clean crop: `1800 x 2400`, SHA-256
  `127EE1CE2000F8BAB34289AF2CA066DCE60C0A59A69ADFE0F5158F4A7D4E8937`.
- All final PNGs were opened and inspected directly; complete Blade framing,
  material separation and phase behavior pass.

## Repository

- Governance commit:
  `695d2d9 governance: open Zenith Blade material fidelity V0.26`.
- Candidate commit: `PENDING`.
- Proof/build-log finalization commit: `PENDING`.
- Evidence source: PowerShell, Blender build/reopen stdout, SHA-256, image
  metadata and direct visual inspection.
- Blocker: none.
- Next safe action: operator visual ruling on the standalone V0.26 milestone.
- No push or deploy performed.
