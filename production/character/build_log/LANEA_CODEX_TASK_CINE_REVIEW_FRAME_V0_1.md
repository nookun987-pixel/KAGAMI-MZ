# LANE A CODEX TASK — MIKAGE_CINE_REVIEW_FRAME_V0_1

STATUS = DISPATCH (governed by AGENTS.md Fifty-first controlled exception)
TASK_ID = MIKAGE_CINE_REVIEW_FRAME_V0_1
DATE = 2026-07-04
AUTHORITY = OPERATOR RULING (BOOS), via Lane B (Cowork) coordination
SCOPE = Phase 1 of the Cine Presentation System roadmap ONLY. Phase 2 (lighting) is a separate,
        not-yet-dispatched future exception — do not begin that work here even if it looks like a
        natural continuation.

## What this is

A reusable "studio asset-review" chrome overlay — the frame that will sit on top of every future
Mikage cine render (wireframe, albedo, full shader, cine-lit), so every publish looks like output
from a real studio review pipeline instead of a bare render. Template only. Does not touch the
character, rig, or any geometry.

## Why patched before dispatch (2 rounds)

Round 1 (Cowork, on the original upload): found one real internal contradiction plus two
clarifications needed before this could safely dispatch:

1. The mockup's STAGE-block accent tick used crimson (`#9d2933`) — but the roadmap's own Canon
   Guard reserves crimson strictly for on-model seam/sacred use and explicitly bans it from
   general decoration. A crimson tick in UI chrome is exactly the thing that rule prohibits.
   Fixed: accent tick is now silver `#a0a0b0`.
2. The frame is fixed at 1920x1080 (16:9). Roadmap Phase 4 later calls for a portrait Canvas
   export. To avoid this chrome silently getting stretched/cropped into portrait later, the format
   is now explicitly labeled REVIEW-MASTER (16:9) — any portrait/Canvas chrome would be a separate
   layout variant, not a derivative of this one.
3. (Not part of this task, flagged for the record) SPEC B — the Phase 2 lighting brief, not
   dispatched here — used "P3 core" as a naming shorthand that could be confused with roadmap
   Phase 3. Renamed to `ZENITH_BLADE_CORE` for whenever Phase 2 is dispatched.

Round 2 (operator, re-uploaded the mockup independently before Cowork's crimson/format patch was
merged in): replaced the placeholder codename/metadata with Mikage-native values — corner stamp
`鏡` (kanji, Shippori Mincho), STAGE-block studio stamp `MZ`, project tag `PROJECT ZENITH`, and
fake HUD readouts that reference REAL canon instead of meaningless numbers: `STATE S1 · AWARE`
(the lighting state machine, SPEC B) and `PHASE P2 · LANDAUER` (the ENTITY's 3-phase structural
model — verified against `docs/handoff/MIKAGE_ZENITH_ENTITY_PHASE_SPEC_V1.md`, section 0.5: P1
Compact-Idle/Imperial Clean, P2/P3 driven by dramatic-error and Landauer heat debt — this is real,
operator-approved canon, not invented). One naming-collision flag on this round: "PHASE P2" reads
ambiguously next to the roadmap's own "Phase 1-5" — same category of clash already fixed for "P3
core" above — so it's relabeled `ENT-PHASE P2` in the merge below to disambiguate; flagged to
operator, not unilaterally decided.

The two rounds were merged (round 2's re-upload did not yet include round 1's crimson/format
fixes) into one file, which is now the SOLE authoritative reference for this task:

- `production/character/build_log/MZ-P1-CINE-REVIEW-FRAME_V3.html` — pixel target (SVG,
  1920x1080) + full coordinate/color/type build brief. Read this file's embedded `<pre id="brief">`
  block for the exact numbers. Supersedes the V2 file and the originally uploaded file entirely.
- `production/character/build_log/MZ-ROADMAP-CINE-PRESENTATION-SYSTEM_V2.html` — for context only
  (Phase 0 ruling, full roadmap); not itself a build target.

## Required build

Two layers, matching the V3 build brief exactly:

1. **CHROME** (static, identical across every shot): top menu bar (fake "File Edit View Launch
   Errors Code Help" + Mikage-native readout strips — state/BPM/entity-phase on the left, render%/
   slit-lock/halo on the right — + `PROJECT ZENITH` tag + `鏡` corner stamp + hairline), STAGE
   label block (silver accent tick — NOT crimson — + STAGE text + asset line + date + `MZ` studio
   stamp), 4 corner L-shaped hairline ticks, right-mid reticle, bottom timecode readouts + scrub
   bar.
2. **DATA** (varies per shot, chrome does not move/restyle when this changes): `STAGE` (one of
   LOW-POLY / WIREFRAME / ALBEDO / FULL SHADER / CINE), `ASSET_ID`, `ASSET_NAME`, `DATE`,
   `STUDIO_STAMP` (fixed "MZ"), `PROJECT_TAG` (fixed "PROJECT ZENITH"), `CORNER_STAMP` (fixed "鏡"),
   `META_L` (templated: `TC hh:mm:ss · STATE S# · <NAME> · BPM <track> · ENT-PHASE P# · LANDAUER`),
   `META_R` (templated: `RENDER <zoom>% · SLIT-LOCK ◍ VIOLET · HALO WHITE`). The META fields must
   read the shot's REAL state/stage values, not placeholder text — see the V3 brief's field list.

Build option A (Blender compositor node-group with driven text) is preferred over option B (flat
PNG overlay + separately-rendered text, composited after) — use A unless genuinely impractical,
and report which was used and why either way.

## Locked (do not deviate without asking)

- Space Mono only inside the chrome — no serif, no sans.
- Zero crimson anywhere in the chrome. The one accent tick is silver `#a0a0b0`.
- Zero violet anywhere in the chrome — violet only ever exists in the render layer itself
  (the character's two slits), never in the overlay.
- Radius 0 everywhere in the chrome.
- No pure `#000` / `#fff` in the chrome.
- Chrome must not cover or crowd the subject — keep it low-density, generous negative space in
  the center.
- Do not modify, open-and-resave, or otherwise touch any character/rig `.blend` file. This task
  produces an overlay/template only.

## Required proof

Take the finished chrome template and overlay it on ONE existing, already-approved flat/plain
render of the character (any state, your choice — pick something already in
`production/character/reviews/` that is clearly a PASS, not a new render). Produce a labeled
before/after comparison: before = the render alone, after = render + chrome. This is the actual
gate test — does the after image read like a studio asset-review screen, not a gaming HUD.

Also demonstrate the DATA layer changing independently of the CHROME: show at least 2 different
`STAGE` values (e.g. WIREFRAME and CINE) with the exact same chrome position/style in both, proving
this is one reusable template, not a one-off.

## Deliverables

- `production/character/production_actor/rig_derivatives/MIKAGE_CINE_REVIEW_FRAME_V0_1.blend`
  (if built as a compositor node-group, option A) and/or
  `production/character/reference/MIKAGE_CINE_REVIEW_FRAME_V0_1_CHROME.png` (if option B)
- `production/character/reviews/MIKAGE_CINE_REVIEW_FRAME_V0_1_OVERLAY_TEST.png` (before/after,
  plus the 2-STAGE-value demonstration)
- `production/character/reviews/MIKAGE_CINE_REVIEW_FRAME_V0_1_PROOF.md`

Gate folder `_tmp/mikage_cine_review_frame_v0_1_gate/` (already created, empty) holds ONLY
`contact_sheet.png` + `contact_sheet_review_report.md`.

## Pass conditions

- Chrome matches the V3 build brief's coordinates/colors/type.
- Silver accent tick present; zero crimson found anywhere in the chrome.
- Zero violet found anywhere in the chrome.
- At least 2 different STAGE values demonstrated without the chrome moving or restyling.
- Before/after overlay-on-render comparison reads as studio review-chrome, not a game HUD.
- Radius 0 confirmed throughout.
- Gate folder holds exactly the 2 allowed files, `python .mikage/tools/verify_output.py` prints
  PASS, no `.blend1` remains.
- No character/rig/geometry file modified.

## Fail / blocker codes

- `CRIMSON_IN_CHROME` — any crimson pixel found anywhere in the chrome
- `VIOLET_IN_CHROME` — any violet pixel found anywhere in the chrome
- `SPEC_DEVIATION` — coordinates/type/colors deviate from the V3 build brief without asking first
- `TEMPLATE_NOT_REUSABLE` — chrome moves/restyles when the data fields change
- `STYLE_VIOLATION` — overlay proof reads as gaming HUD (neon/glow/rounded corners/icons/emoji)
  instead of studio review-chrome
- `SCOPE_VIOLATION` — any character/rig/geometry file touched
- `VALIDATOR_SCHEMA_MISMATCH` — gate folder mis-schema'd

## Explicitly out of scope for this task

No canon-lock. No asset-lock. No production-ready/final claim — label CANDIDATE only. No push. No
deploy. Do not start Phase 2 (SPEC B, cinematic lighting pass) — that is a separate future
exception the operator will dispatch only after reviewing this one's result.

## On conflict or ambiguity

If any coordinate, color, or field in the V3 build brief is ambiguous or cannot be matched exactly
for a specific technical reason, stop and report the exact issue — do not approximate silently or
invent a chrome element that isn't in the brief.
