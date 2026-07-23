# ZENITH BLADE — CONTROLLED FINALIZATION V0.17 PROOF

TASK_ID: `ZENITH_BLADE_CONTROLLED_FINALIZATION_V0_17`
TASK_RESULT: `PASS_FOR_FINAL_RENDER_CANDIDATE_REVIEW`
OUTPUT_STATUS: `FINALIZATION_CANDIDATE_ONLY`
CANON_FORM_AUTHORITY: `OPERATOR_PROMOTED_COMMIT_1343308`
ASSET_LOCK: `NO`
PRODUCTION_READY: `NO`
PUSH_DONE: `NO`

## Source protection

- Source:
  `production/character/MIKAGE_ZENITH_BLADE_PRODUCTION_SURFACE_LOADPATH_V0_16_1.blend`
- Source SHA-256 before/after:
  `8BE34EA1B9988260628228D58C8B956065E9E155AC9AE49D6F40DAA8D8835661`
- Source size before/after: `376387` bytes
- Source UTC timestamp before/after: `2026-07-23T22:07:40.4537440Z`
- Source mutation: `NO`

## Outputs

| Artifact | SHA-256 | Size |
|---|---|---:|
| `production/character/MIKAGE_ZENITH_BLADE_FINALIZATION_V0_17.blend` | `502479163F11F397D4A9730B0F33D6825797B3487C74E88E93D12F1187CDA9C2` | 381658 |
| `production/character/reviews/MIKAGE_ZENITH_BLADE_FINALIZATION_V0_17_MOTION.mp4` | `4A6A79CBEA79A23ED29B611E3DC9AE3906F537EDC7C23FFED5343CB910D6CFBD` | 966450 |
| `production/character/reviews/MIKAGE_ZENITH_BLADE_FINALIZATION_V0_17_KEYFRAMES.png` | `16504FC97F3431C3FF35F4DCC598825FCFA65CC86E6BDE9DD68009B53CCDCD7C` | 1908323 |

## Ten controlled checkpoints

1. **Repository/source baseline — PASS.** Clean `main`; source hash, size, and
   timestamp recorded.
2. **Derivative protection — PASS.** V0.17 saved as a new file; V0.16.1 was not
   overwritten.
3. **Shell transition polish — PASS.** Only the four approved shell-panel X
   values animate. P1→P2 occurs during frames 25–31; P2→P3 during 55–61.
4. **Attachment/collision regression — PASS.** Guard contact remains `3/3`;
   docking tongue contact remains `2/3`; no approved attachment transform
   changed.
5. **Material/color lock — PASS.** No mesh or material differences from
   V0.16.1. P1/P2 core off; P3 exactly one core. No weapon red/crimson or
   secondary violet.
6. **Light choreography — PASS.** Two new review-only cool/neutral Blade lights
   animate energy without modifying existing lights or materials.
7. **Camera choreography — PASS.** One new orthographic portrait review camera
   performs a restrained lateral drift while keeping the full Blade and
   attachment context readable.
8. **Keyframes/motion render — PASS.** Six evidence frames and 90 full-resolution
   motion frames rendered successfully.
9. **Reopen/media QA — PASS.** Blender reopen, source/output diff, attachment
   regression, phase values, keyframe sheet inspection, and ffprobe all pass.
10. **Proof/package — PASS.** Finalization evidence, hashes, media metadata, gate
    limits, and remaining decisions are recorded here.

## Phase-motion evidence

| Frame | State | Blade core | Shell X read |
|---:|---|---|---|
| 1 | P1 | off | closed |
| 24 | P1 hold | off | closed |
| 25 | transition start | off | closed |
| 28 | P1→P2 transition | off | intermediate symmetric split |
| 31 | P2 settled | off | approved P2 split |
| 54 | P2 hold | off | approved P2 split |
| 55 | transition start | off | P2 split |
| 58 | P2→P3 transition | off | intermediate symmetric split |
| 61 | P3 settled | on | approved P3 split |
| 90 | P3 hold | on | approved P3 split |

Panel-pair symmetry remains exact throughout the sampled transition frames.

## Source/output regression

The V0.16.1 source and V0.17 output were compared for every pre-existing object.
The audit permits only four panel X animation tracks and new `ZB17_` review
camera/light/target objects.

```text
UNEXPECTED_DIFFS: []
GUARD_CONTACTS: [True, True, True]
DOCK_CONTACTS: [True, True, False]
```

All pre-existing meshes, materials, dimensions, rotations, scales, non-panel
locations, rider, steed, rig, surface treatment, and load-path details match.

## Media validation

```text
codec: h264
resolution: 1080 x 1920
pixel_format: yuv420p
frame_rate: 30/1
duration: 3.000000 seconds
audio_streams: none
```

The keyframe sheet is `3240 x 960`. It was opened and inspected. It shows the
full Blade from P1 through P3, attachment context, and exactly one P3 violet
core.

## Cleanup and status limits

- Blender motion frames rendered: `90 / 90`.
- V0.17 `.blend1`: removed.
- Temporary render frames/scripts/logs: removed after gate packaging.
- SSOT edited: `NO`.
- Push/deploy/audio/website/release action: `NO`.

This pass does not self-issue asset-lock or production-ready status. The next
action is operator review of the finalization candidate followed by separate
gate decisions.
