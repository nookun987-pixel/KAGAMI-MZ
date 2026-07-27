# ZENITH BLADE V0.27 — HERO CONTEXT VALIDATION PROOF

TASK_RESULT: `HERO_CONTEXT_FAIL_GEOMETRY_CAUSE_CONFIRMED`  
OUTPUT_STATUS: `REVIEW_EVIDENCE_ONLY`  
ASSET_LOCK / INTEGRATION_READY / PRODUCTION_READY / VISUAL_APPROVAL: `NO`

## Sources and baseline ruling

- Blade source:
  `production/character/MIKAGE_ZENITH_BLADE_MATERIAL_FIDELITY_V0_26.blend`
- Blade SHA-256:
  `741023E6F3A220128E5D11BE222EB45D2AEA814DCA5A3A97D5EAED5B1D4B9123`
- Actor source:
  `production/character/production_actor/rig_derivatives/MIKAGE_ROBE_HERO_CINE_STAGING_V0_1.blend`
- Actor SHA-256:
  `72E9BE92C18027346F8B740C303A0F0BD1D64F33884D6ABD57C628CD3BE6D245`
- Actor selection evidence: `AGENTS.md` records this source as the PASS
  derivative immediately before the retired Blade remodel branches.
- V0.26 remains `REVIEW_CANDIDATE_ONLY`, `V0.26_BASELINE_FROZEN`,
  `ASSET_LOCK: NO`, `PRODUCTION_READY: NO`.

## Output

- Derivative:
  `production/character/MIKAGE_ZENITH_BLADE_HERO_CONTEXT_VALIDATION_V0_27.blend`
- Derivative SHA-256:
  `AD71627F4978DBF68DCAC88DAEF336A987676E1AB8B258563D31F7F979AC0374`
- The actor's historical Blade props were hidden in the derivative only.
- V0.26 was appended as a separate collection and moved/scaled only through
  `ZB22_STANDALONE_ROOT`.
- Context-only root transform:
  location `(4.3240380, 1.1037750, -2.4610353)`,
  scale `(2.45, 2.45, 2.45)`.
- No source was overwritten.

## Ten controlled passes

1. PASS — clean `main` at entry; source lineage recorded.
2. PASS — actor/Blade ownership, bounds and phase control inspected.
3. PASS — separate V0.27 derivative created.
4. PASS — actor and V0.26 assembled without mesh/material mutation.
5. PASS — context-only root registration tested against right-hand and docking
   locations.
6. FAIL EVIDENCE CAPTURED — P1/P2/P3 registration and clearance expose a
   bounded interface-geometry conflict.
7. PASS — front, side, back and three-quarter context sheet rendered.
8. PASS — P1/P2/P3 clearance and black/white thumbnail sheets rendered.
9. PASS — all final PNGs directly inspected; derivative reopened.
10. PASS — proof, whitelist and source-integrity audit completed; local commit
    prepared; no push.

## Source integrity

- Blade mesh topology differences after reopen: `0`.
- Actor mesh topology differences after reopen: `0`.
- No actor rig or deforming mesh was edited.
- No Blade mesh, topology, modifier, material or phase driver was edited.
- P1/P2 core remain off; P3 shows exactly one violet core.
- No red/crimson, violet wash, halo, ambient violet or secondary core.

## Quantified failure

- Right-hand hold-marker location:
  `(1.0549999, -0.0250000, 2.1199999)`.
- Upper guard/load-bridge world Z envelope:
  `2.5931406–2.7992887`.
- Minimum vertical separation from marker to bridge:
  approximately `0.473 m`.
- Lower docking tongue world Z envelope:
  `0.0696407–0.3247890`.

The current whole-asset scale/position cannot simultaneously register the
upper handle/load bridge to the right hand and preserve adequate lower docking
clearance. Raising or lowering the unmodified asset to close one relationship
breaks the other. P2/P3 shell opening also approaches the cloak/body envelope.

## Exact failure classification

- Failed angles: front, side and three-quarter; back confirms carry separation.
- Failed phases: P1 registration; P2/P3 registration plus opening clearance.
- Failed components: upper guard/load bridge, handle interface and lower
  docking/load tongue.
- Error classes: scale/interface registration, grip, docking and phase
  clearance.
- This is not a generic aesthetic rejection and does not authorize shell,
  material or overall-form redesign.

## Evidence

- Context sheet: `3600 x 1800`, directly inspected, complete hero and Blade.
- Clearance gate: `3000 x 1200`, directly inspected, P1/P2/P3.
- Silhouette gate: `2400 x 800`, directly inspected, four thumbnail views.
- No silhouette-critical crop.

## Minimum bounded next action

Open a V0.28 exception limited to:

1. handle/upper-load-bridge vertical registration;
2. lower docking/load-tongue ground and holster clearance;
3. minimum P2/P3 shell-to-cloak clearance required by those two corrections.

Preserve the V0.26 shell silhouette, four-plate mechanism, phase logic,
materials, single P3 violet core and all unrelated geometry.

## Repository and safety

- Evidence source: local Blender 5.1.2 metadata inspection, Eevee renders,
  derivative reopen, SHA-256 and direct PNG inspection.
- Initial repository: clean `main`, HEAD
  `9e7c58a feat(blade): add Zenith Blade build-log reel assets`.
- Changed repository files are restricted to `AGENTS.md` and the five approved
  V0.27 outputs.
- No V0.27 `.blend1` exists. A pre-existing V0.14 `.blend1` is outside this
  task and was not changed.
- An accidental external temp render was removed under explicit operator
  authorization before validation resumed.
- Commit status: `LOCAL_COMMIT_PREPARED`; final commit hash is reported in the
  task final status to avoid a self-referential commit-hash field.
- Push status: `NOT_PUSHED`.
- Blocker: `NONE_FOR_V0.27_EVIDENCE`; result itself is a bounded FAIL that
  requires a new V0.28 exception before geometry work.
