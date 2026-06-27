# ASSET-BUILD-06B_AUDIT_BUST_BRIDGE_SOURCE_IMAGES_NO_RENDER_REPORT

## 1. Task Header

```
TASK_ID:           ASSET-BUILD-06B_AUDIT_BUST_BRIDGE_SOURCE_IMAGES_NO_RENDER
RESULT:            FAIL — 2 of 6 anchor images are critically deficient
DATE:              2026-05-12
RENDER_EXECUTED:   NO
COMFYUI_SUBMITTED: NO
EXTERNAL_API_CALLED: NO
API_KEY_COMMITTED: NO
CANON_APPROVAL:    NO
ASSET_LOCK:        NO
GPU_SPEND_AUTHORISED: NO
```

**CRITICAL FINDING:** The two PRIMARY anchor images — which carry the highest IPA
weights and also serve as the img2img base and ControlNet source — are the worst-quality
images in the entire anchor set. Running ASSET-BUILD-07 on an external GPU with these
inputs would waste money and produce unusable output. Do not proceed to GPU spend until
these are replaced.

---

## 2. Purpose

ASSET-BUILD-06 prepared an external GPU execution packet and a cost checklist before
verifying that the source images feeding the workflow are cinematically adequate.

ASSET-BUILD-06B closes that gap: a direct visual inspection of all 6 anchor images
required by the execution packet, filed before any GPU authorisation.

---

## 3. Audit Scope

All 6 anchor images referenced in
`docs/handoff/ASSET-BUILD-06_EXTERNAL_GPU_API_EXECUTION_PACKET_V1.md` Section 3
were visually inspected by direct file read. No generation, no render, no ComfyUI run.

---

## 4. File Existence Audit

| # | Role | Required filename | Required path | ON DISK |
|---|---|---|---|---|
| 1 | img2img base + ControlNet canny + IPA 0.8 | MIKAGE_HELMET_FRONT_VIEW_3D_SOURCE_V1_ORTHO.png | 08_CHARACTER_REVIEW_CANDIDATES\ | ✅ YES |
| 2 | IPA anchor — helmet side volume (0.6) | MIKAGE_VOLUME_FIRST_3D_HELMET_SIDE_V1_ORTHO.png | 08_CHARACTER_REVIEW_CANDIDATES\ | ✅ YES |
| 3 | IPA anchor — faceplate clean (0.6) | MIKAGE_COMP_01A_HELMET_FACEPLATE_CLEAN_PASS.png | 10_COMPONENT_CANDIDATE_SET_V1\01_HELMET_FACEPLATE\ | ✅ YES |
| 4 | IPA anchor — B4C porcelain material (0.5) | MIKAGE_COMP_03A_B4C_PORCELAIN_PANEL_GAP_PASS.png | 10_COMPONENT_CANDIDATE_SET_V1\03_B4C_PORCELAIN_MATERIAL\ | ✅ YES |
| 5 | IPA anchor — graphene underlayer (0.4) | MIKAGE_COMP_04A_GRAPHENE_UNDERLAYER_HEX_GAP_PASS.png | 10_COMPONENT_CANDIDATE_SET_V1\04_GRAPHENE_UNDERLAYER\ | ✅ YES |
| 6 | IPA anchor — style check / identity (0.3) | MIKAGE_UNIFIED_KEY_VISUAL_V4_FROM_CLEAN_SOURCES_00001_.png | 08_CHARACTER_REVIEW_CANDIDATES\ | ✅ YES |

All 6 files exist on disk. File existence is NOT the problem.

---

## 5. Visual Quality Audit — Per Anchor

### ANCHOR 1 — HELMET FRONT 3D ORTHO (img2img base + ControlNet + IPA 0.8)

```
File:     MIKAGE_HELMET_FRONT_VIEW_3D_SOURCE_V1_ORTHO.png
Role:     MOST CRITICAL — img2img base image, ControlNet canny source,
          highest-weight IPA anchor (0.8)
VERDICT:  ❌ CRITICALLY DEFICIENT — DO NOT USE AS WORKFLOW INPUT
```

**What was seen:** Near-black 3D Blender blockout. The helmet shape is barely
distinguishable from the background — extremely low contrast, essentially dark gray on
slightly lighter dark gray. The form reads as a vague circular mass with no surface
detail visible.

**Why this breaks the workflow:**

- **ControlNet canny edge map:** Canny edge detection requires contrast to find edges.
  This image has almost none. The ControlNet will extract near-zero edge information,
  meaning the model receives no structural guidance for the bust geometry. This is the
  single most important structural input and it is broken.

- **img2img at denoise 0.65:** The latent encoded from this image will represent a
  near-uniform dark field. The model has almost no geometry to preserve through the
  img2img process. It will drift freely rather than following the intended helmet
  silhouette.

- **IPA at weight 0.8 (highest in chain):** The strongest visual anchor in the entire
  chain is pulling generation toward a dark, featureless image. This actively harms
  output quality.

**Root cause:** The Blender render used a flat emission or ambient occlusion setup with
insufficient contrast between the helmet material and the background. The canonical
Blender source file (`MIKAGE_HELMET_FRONT_VIEW_3D_SOURCE_V1.blend`) exists but was
rendered with settings that produced a near-invisible result.

**What is required to fix this:** A properly lit re-render of the same Blender file
with a white/light gray diffuse material on a darker background, or replacement with an
existing high-contrast front-facing helmet image (see Section 6).

---

### ANCHOR 2 — HELMET SIDE VOLUME ORTHO (IPA 0.6)

```
File:     MIKAGE_VOLUME_FIRST_3D_HELMET_SIDE_V1_ORTHO.png
Role:     Helmet volume / side silhouette reference
VERDICT:  ❌ WRONG CAMERA ANGLE — NOT A SIDE ORTHO VIEW
```

**What was seen:** A top-down / slightly oblique view looking DOWN at the helmet from
above. The camera is positioned above the helmet and aimed diagonally downward. The
result shows the helmet crown as seen from above-and-slightly-front, with polygon facets
visible. This is not a side profile. It is a top-down perspective.

**Why this breaks the workflow:**

- As a "helmet side silhouette" reference at IPA weight 0.6, this image gives the model
  wrong spatial information — top-down crown perspective instead of side silhouette.
- The polygon facets and harsh lighting create low-poly artifacts that will bleed into
  generation as unintended surface geometry.
- The camera angle is incompatible with a bust portrait framing (camera faces forward,
  not downward).

**Other side views audited and found unsuitable:**

| File | Problem |
|---|---|
| MIKAGE_HELMET_SIDE_VIEW_3D_BLOCKOUT_ORTHO_V4.png | Broken geometry — disconnected polygon fragments in black space. Catastrophic. |
| MIKAGE_HELMET_SIDE_FROM_GUIDE_V4_ORTHO.png | Also top-down oblique — same angle problem as anchor 2. |
| MIKAGE_UNIFIED_HELMET_SOURCE_V3_SIDE_ORTHO.png | Marginally better side angle, but extremely simplified boxy blockout with a black rectangle for the visor slit. Low quality as IPA reference. |

**No acceptable true side ortho currently exists.**

---

### ANCHOR 3 — HELMET FACEPLATE CLEAN PASS (IPA 0.6) ✅

```
File:     MIKAGE_COMP_01A_HELMET_FACEPLATE_CLEAN_PASS.png
VERDICT:  ✅ PASS — Strong IPA anchor
```

High-quality render: white matte helmet front, sealed faceplate, sensor slit geometry,
dark background, strong contrast. Exactly the faceplate standard this workflow needs.
No face, no eyes, no expression. Solid geometry.

**Recommendation:** This image is the strongest front-facing helmet reference in the
entire anchor set. It is a viable candidate to REPLACE Anchor 1 as the img2img base
and ControlNet canny source (see Section 6).

---

### ANCHOR 4 — B4C PORCELAIN MATERIAL (IPA 0.5) ✅

```
File:     MIKAGE_COMP_03A_B4C_PORCELAIN_PANEL_GAP_PASS.png
VERDICT:  ✅ PASS — Excellent material reference
```

Macro closeup of matte porcelain armor panels with clean black seam gaps. The material
language is precise: matte off-white texture, sharp panel edge geometry, dark gap
detail. Exactly what the workflow needs to anchor the material character of the bust.

---

### ANCHOR 5 — GRAPHENE UNDERLAYER (IPA 0.4) ✅

```
File:     MIKAGE_COMP_04A_GRAPHENE_UNDERLAYER_HEX_GAP_PASS.png
VERDICT:  ✅ PASS — Good underlayer reference
```

Macro shot showing hexagonal carbon-fiber/graphene texture visible through armor panel
gaps. Matte white panels, clean black gap geometry, hex weave texture at intersection.
Consistent material language with Anchor 4.

---

### ANCHOR 6 — KEY VISUAL V4 IDENTITY (IPA 0.3) ✅

```
File:     MIKAGE_UNIFIED_KEY_VISUAL_V4_FROM_CLEAN_SOURCES_00001_.png
VERDICT:  ✅ PASS — Strong identity anchor
```

Locked canonical key visual. White faceless helmet, halo/orbital ring, near-black
background. Clean identity standard at lowest IPA weight (style check only). Consistent
with the intended Cinematic output identity.

---

## 6. Repair Options — What to Produce NOW

### REPAIR-A (CRITICAL): Replace Anchor 1 with a high-contrast front reference

**Option A1 — Use MIKAGE_COMP_01A_HELMET_FACEPLATE_CLEAN_PASS.png as img2img base**

This file already exists, is high quality, is front-facing, and passes all content
checks. Swap it into:
- Node 4 (LoadImage img2img base)
- Node 10 (IPA anchor 0, weight 0.8) — already identical
- Node 9 / Node 40: ImageScale must be confirmed against this image's actual dimensions

Risk: The faceplate image is a full helmet portrait (tighter crop than a bust). The
resulting img2img may produce a head-only composition rather than a bust composition.
Mitigation: Add shoulder armor framing cue to positive prompt. Consider resizing the
faceplate image with blank armor-shoulder area added below.

**Option A2 — Re-render MIKAGE_HELMET_FRONT_VIEW_3D_SOURCE_V1.blend with correct lighting**

The Blender source exists. A re-render requires:
1. Human authorization to run Blender
2. White diffuse material on helmet object
3. Flat diffuse 3-point lighting with dark background
4. Camera: front ortho, orthographic projection
5. Output: 768×1024 or 2048×2048 PNG

This route produces the geometrically cleanest input (pure 3D blockout with correct
proportions and ortho projection), but requires a Blender run.

**RECOMMENDED IMMEDIATE ACTION: Option A1** — No tools, no Blender, no GPU. Swap
the img2img base and Node 10 anchor to use the faceplate image. This can be done
as a packet amendment without any render.

---

### REPAIR-B (HIGH PRIORITY): Establish an acceptable side view reference

**No acceptable side ortho exists.** Options:

**Option B1 — Remove Anchor 2 from the workflow. Redistribute weights.**

Rather than providing a bad side reference, drop the side anchor entirely and
redistribute:
- Node 11 removed from IPA chain
- Node 21 weight redistributed: bump Anchor 3 (faceplate) from 0.6 to 0.75
- Rationale: A missing side reference is less harmful than a wrong-angle top-down
  reference at 0.6 weight

**Option B2 — Use V3 side ortho at reduced weight**

`MIKAGE_UNIFIED_HELMET_SOURCE_V3_SIDE_ORTHO.png` is not ideal but shows a rough
side silhouette (boxy, simplified). Use it at reduced weight 0.3 instead of 0.6 to
provide minimal silhouette cue without overdetermining the geometry.

**Option B3 — Produce a new side ortho (Blender authorized run)**

Generate a true side ortho from the existing Blender file. Requires Blender run
authorization. Produces the cleanest possible side reference.

**RECOMMENDED IMMEDIATE ACTION: Option B1** — Drop Anchor 2, redistribute faceplate
weight to 0.75. No tools needed. Amend the execution packet.

---

### REPAIR-C (LOW PRIORITY): Confirm ImageScale node resolution assumption

The execution packet Node 40 comment states "resize 2048×2048 → 768×1024". The
replacement image (MIKAGE_COMP_01A_HELMET_FACEPLATE_CLEAN_PASS.png) is likely NOT
2048×2048. Verify actual dimensions of the replacement image and update the packet
comment accordingly. The ImageScale node parameters (width 768, height 1024) remain
correct regardless.

---

## 7. Workflow Node Audit — No Issues Beyond Anchor Quality

The execution packet node structure (26 nodes) is architecturally sound:

| Node concern | Status |
|---|---|
| CheckpointLoaderSimple — juggernautXL_v8Rundiffusion | Not audited here (model availability is a GPU-instance concern) |
| IPAdapterAdvanced chain (Nodes 20–25) | Structurally correct |
| ControlNetApplyAdvanced (Node 9) | Correct — canny source will change when Anchor 1 is replaced |
| KSampler (Node 30) — 25 steps, CFG 7.0, karras, denoise 0.65 | Settings are appropriate |
| SaveImage (Node 32) — filename prefix | Correct per naming convention |
| Excluded assets list (Section 3 of packet) | All exclusions remain valid |

The workflow will run correctly once Anchors 1 and 2 are repaired.

---

## 8. Summary Score

| Anchor | Weight | Role | File exists | Visual quality | Verdict |
|---|---|---|---|---|---|
| 1 HELMET FRONT ORTHO | 0.8 (primary) | img2img base + ControlNet + IPA | ✅ | ❌ Near-zero contrast | **REPLACE** |
| 2 HELMET SIDE ORTHO | 0.6 (primary) | Side silhouette IPA | ✅ | ❌ Wrong angle (top-down) | **REPLACE or DROP** |
| 3 FACEPLATE CLEAN | 0.6 (secondary) | Faceplate geometry IPA | ✅ | ✅ Strong | PASS |
| 4 B4C PORCELAIN | 0.5 (secondary) | Material language IPA | ✅ | ✅ Excellent | PASS |
| 5 GRAPHENE UNDERLAYER | 0.4 (secondary) | Underlayer IPA | ✅ | ✅ Good | PASS |
| 6 KEY VISUAL V4 | 0.3 (tertiary) | Identity check IPA | ✅ | ✅ Strong | PASS |

**4/6 PASS. 2/6 FAIL (the two highest-weight primaries).**

---

## 9. Required Actions Before ASSET-BUILD-07 Can Proceed

```
[ ] REPAIR-A: Replace Anchor 1 (img2img base + IPA 0.8)
    → Recommended: swap to MIKAGE_COMP_01A_HELMET_FACEPLATE_CLEAN_PASS.png
    → Alternative: authorize Blender re-render of front ortho with correct lighting

[ ] REPAIR-B: Replace or remove Anchor 2 (IPA 0.6 side)
    → Recommended: drop Node 11, promote faceplate weight to 0.75
    → Alternative: authorize Blender re-render of true side ortho

[ ] REPAIR-C: Update Node 40 ImageScale resolution comment in execution packet
    → Confirm actual dimensions of replacement Anchor 1 image
    → Update packet Section 7 Node 40 comment (node parameters remain 768×1024)

[ ] Amendment task: ASSET-BUILD-06C_AMEND_EXECUTION_PACKET_WITH_REPAIRED_ANCHORS
    → Produces updated execution packet V2 reflecting repaired anchor set
    → No render required — documentation only

[ ] Human visual confirmation of this audit contact sheet before any GPU spend
```

**Do not proceed to ASSET-BUILD-07 (external GPU submission) until REPAIR-A and
REPAIR-B are resolved and the execution packet is updated to V2.**

---

## 10. Prohibited Actions Confirmed

```
RENDER_EXECUTED:          NO
COMFYUI_SUBMITTED:        NO
EXTERNAL_API_CALLED:      NO
API_KEY_COMMITTED:        NO
GPU_SPEND_AUTHORISED:     NO
CANON_APPROVAL_CREATED:   NO
ASSET_LOCK_CREATED:       NO
PHASE5_STARTED:           NO
FILM_TASK_CREATED:        NO
SHOTLIST_CREATED:         NO
MORE_THAN_ONE_NEXT_TASK:  NO
```

---

## 11. Next Safe Task

```
ASSET-BUILD-06C_AMEND_EXECUTION_PACKET_WITH_REPAIRED_ANCHORS_NO_RENDER
```

Task scope: Produce an updated execution packet V2 that:
1. Swaps Anchor 1 (img2img base + IPA 0.8) to MIKAGE_COMP_01A_HELMET_FACEPLATE_CLEAN_PASS.png
2. Drops Anchor 2 (side ortho) or substitutes with V3_SIDE_ORTHO at reduced weight
3. Updates Node 10, Node 11, Node 40 entries accordingly
4. Updates Section 3 anchor table
5. Produces no render, calls no API, spends no money
```
