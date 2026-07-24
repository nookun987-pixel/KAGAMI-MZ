# ZENITH BLADE CANON MECHANICAL DEFINITION V0.25 — PROOF

TASK_RESULT: `PASS_FOR_OPERATOR_VISUAL_REVIEW`  
OUTPUT_STATUS: `REVIEW_CANDIDATE_ONLY`  
ASSET_LOCK / PRODUCTION_READY / PUSH: `NO`

## Source and authority

- Source: `production/character/MIKAGE_ZENITH_BLADE_CANON_CONVERGENCE_V0_24.blend`
- Source SHA-256 before/after:
  `D0C6EFCD264493B6316AE18BADBFC74ED1EFEADF02F7FFE62D91413866B268D2`
- Source mutation: `NO`
- Canon: Blade SSOT, synced entity-phase SSOT and cine color contract.

## Ten controlled passes

1. Source, ownership, phase, material and modifier baseline: PASS.
2. Protected silhouette and mechanical hierarchy plan: PASS.
3. Four-shell connected-seam definition: PASS.
4. Central spine and paired recessed-rail depth definition: PASS.
5. Upper hydraulic drive-hub definition: PASS.
6. Lower Flux-Pinning base definition: PASS.
7. Joint-collar/load-transition definition: PASS.
8. Four required review renders: PASS.
9. Direct inspection, two rejected dark-detail gates, accepted correction and reopen regression: PASS.
10. Hashes, whitelist, `.blend1`, proof and local commit: PASS.

## Permitted differences

- `ZB21_CONTROLLED_CHAMFER` widths:
  - four shell plates: `0.009 → 0.0075`, three segments;
  - central spine: `0.0042 → 0.005`, `2 → 3` segments;
  - paired rails: `0.0026691 → 0.0022`, `2 → 3` segments;
  - upper/lower collars: `0.005 → 0.006`, three segments;
  - upper hub/lower base: `0.006 → 0.0075`, three segments.
- Small local Y-depth adjustments:
  - spine `+0.0015`;
  - hub/base `+0.0025`;
  - collars `+0.0020`;
  - rails `+0.0035`.
- Review lighting/exposure and camera framing were refined.

No vertex/polygon topology, front X/Z silhouette, shell phase X spacing,
object ownership or component family changed.

## Canon and regression results

- Four connected shell plates and flat-cut monolithic mass: PASS.
- P1 closed; P2 split; P3 wider split: PASS.
- P1/P2 core hidden; P3 exactly one core: PASS.
- Electric violet remains P3-core-only; no red, secondary core, wash, halo or ambient violet.
- No pointed tip, cutting edge, crossguard ring, ornament or V0.9 import.
- No rider, gauntlet, holster, steed, mount, ZB16 fixture or rig.
- Reopen: PASS.
- Exact ownership: PASS.
- Topology digest: MATCH.
- Front X/Z envelope: MATCH.
- Phase X values: MATCH.
- Forbidden objects: none.
- `.blend1`: none remains.

## Render evidence

- Silhouette gate: `3000 x 1200`, SHA-256
  `AB00D55ED505CC505FF76BD6089A293A698C2FC16F247B7AD7EDB8EC5F45E1F3`.
- Mechanical gate: `3000 x 1200`, SHA-256
  `8BF4DC6E3F021EE04136516B1BA1DC5077E62561D59175249DDEF47F10917D1D`.
- Phase gate: `3000 x 1200`, SHA-256
  `5A8C319E75A14D2044A58232BC8400A005C2056D1ED939443EBC00CF539EA8F0`.
- Clean crop: `1800 x 2400`, SHA-256
  `8F174D655BBA0F651201D15576EB3E71F1C32520C8DFC02A305A3BE01B733E69`.
- All actual final PNGs were opened and inspected. Complete Blade framing and
  phase readability pass. Two earlier mechanical-detail exposures were rejected
  because hub/base readability was insufficient.

## Output and repository

- Blend: `production/character/MIKAGE_ZENITH_BLADE_CANON_MECHANICAL_DEFINITION_V0_25.blend`
- SHA-256: `479ADE2507102FEB9EED220DBCC27053AE857D6AE2145EA4EAA75D9640887760`
- Evidence: PowerShell, Blender build/reopen stdout, hashes, metadata and direct image inspection.
- Governance commit: `503bf66 governance: open Zenith Blade mechanical definition V0.25`.
- Candidate commit: `PENDING`.
- Proof-finalization commit: `PENDING`.
- Blocker: none.
- Next safe action: V0.26 material-fidelity candidate from V0.25 under a new exception.
- Final visual approval remains with the operator. No push/deploy performed.
