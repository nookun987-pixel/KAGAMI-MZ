# ZENITH BLADE — CANDIDATE MANIFEST V0.51

## Candidate

- Candidate asset:
  `production/character/MIKAGE_ZENITH_BLADE_ATTACHMENT_CLEARANCE_REPAIR_V0_48.blend`
- SHA-256:
  `C475E7797635E04D2DA0F9D85A86C73C4720CA72330305252668DC548C377CCB`
- Canon source:
  `docs/handoff/MIKAGE_ZENITH_BLADE_SPEC_V1.md`
- Status: `READY_FOR_OPERATOR_RULING`

## Controlled lineage

| Version | Purpose | Result | Commit |
|---|---|---|---|
| V0.44 | Record V0.42 canon-convergence rejection | RECORDED | `cddd485` |
| V0.45 | Restore four-plate brutalist form | CANDIDATE PASS | `cddd485` |
| V0.46 | Mechanical depth, hub/base, rails/joints | OPERATOR ACCEPTED | `3ec4289` |
| V0.47 | Phase and attachment validation | FAIL WITH EXACT CAUSES | `46ee7bc` |
| V0.48 | LL clearance + handle/bridge repair | FULL VALIDATION PASS | `1d21229` |
| V0.49 | V0.46→V0.48 change-scope audit | PASS | `8f6d034` |
| V0.50 | Consolidated interface evidence | PASS | current checkpoint |

## V0.47 failures and resolution

| Failure | V0.48 resolution | Revalidation |
|---|---|---|
| `ZB45_SHELL_LL` intersected cloak at frames 28–61 | Controlled Y clearance stroke completed before horizontal opening | 0 collision hits across frames 1–61 |
| No explicit handle geometry; marker registration failed | Added registered handle at exact marker center and minimal load bridge | Handle/marker and attachment transform PASS |

## Locked evidence

- V0.46 source SHA-256:
  `97630E228EEE6CCEDBE151470A5F8EBAA992D169BBBD779FE84DCCE2FB317DE6`
- V0.46 remained unchanged through repair.
- Common V0.46/V0.48 mesh geometry differences: `0`.
- Common material-slot differences: `0`.
- Common modifier differences: `0`.
- Unexpected transform differences: `0`.
- Added objects are exactly the approved handle and bridge.
- Signal, continuity, repeatability, collision, handle, docking, dependency
  and source checks: all `PASS`.
- V0.48 `.blend1`: `NONE`.
- Pre-existing unrelated
  `MIKAGE_ZENITH_BLADE_PHASE_TIMELINE_V0_14.blend1` was observed and excluded
  from this task; it was not created, modified, or deleted.

## Review packet

- V0.48 contact sheet:
  `production/character/reviews/MIKAGE_ZENITH_BLADE_ATTACHMENT_CLEARANCE_REPAIR_V0_48_CONTACT_SHEET.png`
- V0.48 proof:
  `production/character/reviews/MIKAGE_ZENITH_BLADE_ATTACHMENT_CLEARANCE_REPAIR_V0_48_PROOF.md`
- V0.48 machine report:
  `production/character/reviews/MIKAGE_ZENITH_BLADE_ATTACHMENT_CLEARANCE_REPAIR_V0_48_REPORT.json`
- V0.49 scope proof:
  `production/character/reviews/MIKAGE_ZENITH_BLADE_CHANGE_SCOPE_V0_49_PROOF.md`
- V0.50 interface sheet:
  `production/character/reviews/MIKAGE_ZENITH_BLADE_INTERFACE_EVIDENCE_V0_50.png`

## Final boundary

```text
FORM_DIRECTION: OPERATOR_ACCEPTED_AT_V0.46
TECHNICAL_REPAIR: PASS_AT_V0.48
CHANGE_SCOPE: PASS_AT_V0.49
INTERFACE_EVIDENCE: PASS_AT_V0.50

READY_FOR_OPERATOR_RULING: YES
ASSET_PROMOTION: NO
ASSET_LOCK: NO
INTEGRATION_READY: NO
PRODUCTION_READY: NO
PUSH_STATUS: NOT_PUSHED
DEPLOY_STATUS: NOT_DEPLOYED
```

No further technical repair is justified by the current evidence. Promotion
and any subsequent integration/production gate require an explicit operator
ruling.
