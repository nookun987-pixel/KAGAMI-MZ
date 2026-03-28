# IDENTITY LOCK STATUS

Date: 2026-03-27
Scope: `WEAPON_MACRO` reproduction lock for the approved master frame

## Current Status

Identity validation exists and is functioning.

Identity lock is still partial.

The current image-anchored Fooocus path can help camera alignment.

The current image-anchored Fooocus path cannot hold locked silhouette identity strongly enough.

Therefore the weapon lane is canonized but not manufacturable.

## Locked Findings

- Camera lock: partial success
- Silhouette lock: fail
- Composition lock: fail
- Object reconstruction: fail
- Current stack is not factory-reproducible for weapon identity

## Evidence Summary

- Prompt-only reproduction failed to retain the locked weapon master identity.
- Image-anchored reproduction was implemented and confirmed alive in the bridge payload.
- Real calibration runs `A / B / C` produced valid `output.png` files.
- The best configuration improved front-on alignment and preserved a faint central blade axis.
- None of the tested configurations preserved the locked master silhouette strongly enough to pass reproduction.
- The dominant failure pattern remains: silhouette drift, composition escape, and object reconstruction collapse into noise-texture instead of a reproduced greatsword.

## Ranked Next-Level Lock Strategies

### 1. Stronger img2img-style preservation path
Likelihood of success: highest

- Use the locked master image as the direct latent starting point.
- Push denoise lower than current image-anchored vary settings.
- Treat the render as preservation-first, not reinterpretation-first.
- This is the closest behavior to constrained reproduction in the current local stack.

### 2. Stricter structural conditioning path
Likelihood of success: medium

- Increase reliance on structural controls such as edge and composition guidance.
- Keep using anchor image + structural controls together.
- This can improve framing and contour obedience, but alone has already shown it is not enough.

### 3. Explicit silhouette extraction / edge-guided lock
Likelihood of success: medium-low

- Derive a dedicated silhouette or edge map from the locked master.
- Feed that as a hard structural guide during generation.
- This may improve outline retention, but it still depends on the model reconstructing the object rather than preserving it directly.

### 4. Asset-specific post-selection manufacturing strategy instead of true reproduction
Likelihood of success: fallback only

- Accept that the stack is good at selection but weak at exact reproduction.
- Use approved single masters as manufacturing endpoints instead of trying to regenerate them faithfully.
- This is operationally viable, but it does not solve true identity reproduction.

## Primary Recommendation

Use a stronger img2img-style preservation path as the next lock strategy.

Reason:

- It is the most realistic option inside the current local stack.
- It directly targets the actual gap: the system keeps re-generating instead of preserving.
- Camera alignment is already partially working, which means the anchor is influencing layout.
- The failure is at silhouette retention and object reconstruction, which are more likely to improve when the locked master remains the starting latent rather than only a weighted reference.

## Operational Rule

Do not run more render batches until the stronger img2img-style preservation path is chosen as the active next lock strategy and wired as the reproduction default for weapon identity tests.
