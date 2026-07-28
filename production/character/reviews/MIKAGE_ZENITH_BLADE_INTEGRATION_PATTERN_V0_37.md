# Zenith Blade Integration Pattern V0.37

```text
MILESTONE: ZENITH_BLADE_INTEGRATION_PATTERN_V0_37
STATUS: TECHNICAL_PATTERN_LOCKED
TECHNICAL_INTEGRATION_PATTERN_LOCK: YES
SHOT_APPROVAL: NO
PUBLIC_RELEASE: NO
```

## Validated lineage

- Locked parent:
  `production/character/MIKAGE_ZENITH_BLADE_MATERIAL_FINALING_V0_29.blend`
- Parent SHA-256:
  `317678F6173D1FED3789DCA68FEC7B880D8E7955A45E2495BC7EC2D08C863BE5`
- Diagnostic implementation:
  `production/character/shots/MIKAGE_ZENITH_BLADE_DIAGNOSTIC_SHOT_V0_35.blend`
- Diagnostic SHA-256:
  `268F5248A95A3411E413F72594370ED9614B41042AE0F89AA29820BF695819A9`
- V0.35 integration: `PASS`.
- V0.36 frames 1–61 motion/stress validation: `PASS`.

The diagnostic `.blend` is evidence of the integration pattern, not a source
to overwrite and not an approved cinematic shot.

## Reusable pattern

Every real shot derivative must:

1. Start from the locked V0.29 parent and record its SHA-256.
2. Use a new shot-specific filename and version.
3. Keep all Blade mesh, material, driver, phase and registration fingerprints
   unchanged.
4. Put shot-only cameras, lights, constraints and helpers in a shot namespace:
   `<SHOT_ID>_SHOT_*`.
5. Keep shot-only objects outside the protected Blade hierarchy.
6. Preserve `ZB13_PHASE_CONTROL["blade_phase"]`.
7. Preserve P1/P2 signal off and P3 exactly one central violet core.
8. Run evaluated world-space cloak/body collision checks over the complete shot
   range.
9. Verify full-frame camera containment at every rendered frame.
10. Reopen the derivative, compare fingerprints and obtain operator shot
    approval before rendering public output.

## Naming

```text
production/character/shots/
MIKAGE_<SHOT_ID>_ZENITH_BLADE_INTEGRATION_V0_1.blend
```

Required metadata:

```text
PARENT_ASSET
PARENT_SHA256
SHOT_ID
SHOT_PURPOSE
PHASE_RANGE
OPERATOR_SHOT_APPROVAL
```

## Locked exclusions

- No overwrite of V0.29 or V0.35.
- No asset repair inside a shot file.
- No violet wash, halo, ambient fill or secondary core.
- No shot approval inferred from technical validation.
- No push, deploy, website or public release without separate authority.

## Shot-entry gate

A real shot may begin only when its brief identifies:

- shot ID and intended duration;
- aspect ratio, resolution and frame rate;
- actor/pose or animation source;
- required P1/P2/P3 timing;
- camera intent;
- delivery type;
- operator approval boundary.
