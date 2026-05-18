# MIKAGE PUBLIC ENGINE OPERATING STANDARD V1

## Purpose

This is the canonical operating standard for Mikage Zenith public engine work.

All future public engine work must follow this structure:

MARKET -> IP STANDARD -> TRACK PACKAGE -> RENDER PACKAGE -> PUBLISH PACKAGE -> VERIFY REPORT -> CONTROL BOARD UPDATE

Alternative formats are not approved by this standard.

## 1. MARKET SCOUT LAYER

The market scout layer records current market context only.

Allowed:

- Identify relevant market references.
- Record observed platform patterns.
- Record audience and positioning signals.
- Mark missing proof, missing link, or uncertain status as `CHUA_XAC_NHAN`.

Not allowed:

- Inventing live status.
- Inventing missing links.
- Treating unverified references as confirmed.
- Rewriting track creative.
- Changing hook timelines.

## 2. IP POSITIONING LAYER

The IP positioning layer converts market context into Mikage Zenith public positioning rules.

Allowed:

- Define approved IP stance.
- Define public-safe wording.
- Define what is internal-only.
- Define what must remain unconfirmed.

Not allowed:

- Claiming release status without platform confirmation.
- Claiming public readiness from internal-only evidence.
- Changing canon, track creative, or hook timing.

## 3. TRACK PACKAGE LAYER

The track package layer records the canonical track package for later packaging and render work.

Required:

- Canonical track reference.
- Canonical lyrics or timed text source if approved.
- Canonical hook timeline if already approved.
- Any missing proof or missing link marked as `CHUA_XAC_NHAN`.

Not allowed:

- Creative rewrite during render.
- Changing hook timelines.
- Treating draft track material as live release material.

## 4. RENDER PACKAGE LAYER

The render package layer prepares the canonical source package used by render agents.

Required:

- One render task equals one canonical ZIP.
- The manifest is the source of truth.
- Every render input must be included in or referenced by the canonical ZIP manifest.
- Missing proof, missing link, or uncertain status must be marked as `CHUA_XAC_NHAN`.

Role boundary:

- Local/Claude builds structured archive packages.
- Local/Claude stores canonical track metadata.
- Local/Claude stores hook timelines.
- Local/Claude stores captions / CTA state.
- Local/Claude stores GPT Web output records.
- Local/Claude stores verify reports after output exists.
- Local/Claude does not force local PC render for short-cut videos unless the operator explicitly requests PC/local rendering.
- GPT Web directly performs short-cut render/edit operation when the operator provides source/audio/output request.
- GPT Web returns output file and metadata.
- Local archive records the final GPT Web result after output exists.

Not allowed:

- Rendering from loose, competing, or alternative packages.
- Creating multiple package formats for the same render task.
- Inventing missing links or live status.

## 5. RENDER RULE

Render work must use the canonical ZIP only.

Rules:

- One render task = one canonical ZIP.
- Manifest is source of truth.
- Canonical ZIPs may be archive packages and are not mandatory for local render.
- Short-cut render execution mode defaults to GPT Web direct unless the operator explicitly requests PC/local rendering.
- `render-ready` does not mean MP4 rendered.
- MP4 output may only be called `MP4_RENDERED` after the MP4 exists.
- `5-sub` means sequential timed text blocks or production manifest, not five static lines on screen.
- No creative rewrite during render.
- Do not change hook timelines.

Banned render behavior:

- Rendering without canonical ZIP.
- Rendering from memory.
- Rendering from alternate package layouts.
- Treating `render-ready` as rendered output.
- Forcing local PC render for short-cut videos without explicit operator request.

## 6. PUBLISH PACKAGE LAYER

The publish package layer prepares verified publishing material.

Pre-release wording:

- Use `Pre-save:` only.

Live release wording:

- Use `Listen now:` only after platform confirmation.

Required:

- Confirm platform status before live wording.
- Mark missing proof, missing link, or uncertain status as `CHUA_XAC_NHAN`.
- Keep internal-only assets out of public packages.

Not allowed:

- Public output without approval.
- Website/social deployment without approval.
- Public readiness claims without proof.
- Live release claims before platform confirmation.

## 7. CONTROL BOARD UPDATE

Every completed package or verification step must update the control board.

Required:

- Record package name.
- Record manifest path.
- Record current status.
- Record proof links only when confirmed.
- Mark missing proof, missing link, or uncertain status as `CHUA_XAC_NHAN`.
- Record next safe task.

Not allowed:

- Inventing status.
- Skipping control board update.
- Using unsupported status wording.

## 8. BANNED WORDING / BANNED STATUS

Banned wording:

- `built`, unless the object is named exactly:
  - `SPEC_BUILT`
  - `PACKAGE_BUILT`
  - `MP4_RENDERED`
- `Listen now:` before platform confirmation.
- Any public-ready, final-ready, cinematic-ready, or live status without proof.

Clarifications:

- `render-ready` does not mean MP4 rendered.
- Missing proof/link/status = `CHUA_XAC_NHAN`.
- Pre-release uses `Pre-save:` only.
- Live release uses `Listen now:` only after platform confirmation.

## 9. REQUIRED OUTPUT FORMAT

Every public engine task must return this structure unless the task provides a stricter format:

```text
RESULT:
STANDARD_USED:
MARKET:
IP_STANDARD:
TRACK_PACKAGE:
RENDER_PACKAGE:
PUBLISH_PACKAGE:
VERIFY_REPORT:
CONTROL_BOARD_UPDATE:
NEXT_SAFE_TASK:
```

The canonical pipeline order is:

MARKET -> IP STANDARD -> TRACK PACKAGE -> RENDER PACKAGE -> PUBLISH PACKAGE -> VERIFY REPORT -> CONTROL BOARD UPDATE
