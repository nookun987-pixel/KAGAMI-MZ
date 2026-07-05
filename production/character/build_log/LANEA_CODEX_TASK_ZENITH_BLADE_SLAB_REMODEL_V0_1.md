# LANEA_CODEX_TASK_ZENITH_BLADE_SLAB_REMODEL_V0_1
### Drop this file at `production/character/build_log/LANEA_CODEX_TASK_ZENITH_BLADE_SLAB_REMODEL_V0_1.md` in KAGAMI (paired with `ZENITH_BLADE_SLAB_REFERENCE.svg` in the same folder).

*Content below is BOOS's original locked brief, carried as-is — Cowork did not change the spec, only the file location/naming to match the Lane A convention.*

---

Target: rebuild the blade mesh to canon slab proportions. Current mesh = WRONG (narrow, tapers to a needle / katana profile). This is a GEOMETRY fix — regrade/relight cannot correct it.
Reference: ZENITH_BLADE_SLAB_REFERENCE.svg (wrong vs right + callouts).

## 0. UNITS
Work in a normalized blade LENGTH L = 1.0 (scale to scene after). All numbers below are fractions of L.

## 1. SLAB BODY (the blade)
- Shape: a BROAD RECTANGULAR SLAB. Long parallel edges. NOT tapered along its length.
- Length (blade portion, excl. grip): L = 1.0
- Width: W = 0.24 * L (acceptable range 0.22–0.26). CONSTANT for the first ~0.87 of length (parallel edges, no taper).
- Thickness: T = 0.06 * L (heavy flat plate; reads as a slab from the side, not a thin sheet).
- Edges: hard/near-hard long edges (small 1–2mm bevel for shading only). Faces flat.

## 2. TIP
- Only the LAST 0.13 * L chisels toward the point.
- Chisel = short symmetric bevel from full width down to a BLUNT narrow flat (tip width ~0.02 * L), not a sharp needle.
- Point DOWN is the resting orientation. Set object pivot at the grip (top), so it hangs point-down by default.

## 3. CORE SEAM
- A single channel running dead-center down the full length of the slab, both faces.
- Modeled as a shallow recessed groove (depth ~0.01 * L, width ~0.03 * L) filled with an EMISSIVE strip.
- Material: emissive Electric Violet #8F00FF. This is the ONLY emissive part of the weapon.
- Emission drives the state: OFF/dark = S0 rest, lit = S1/S2. Expose emission strength as a driver/param.

## 4. GRIP RING
- A metal ring at MID-SHAFT: center at 0.50 * L along the blade.
- Ring outer diameter ~0.42 * W, sits flush around the slab (encircles the seam channel).
- Material: matte titanium/platinum #D6D6D6, non-emissive. Slight raking-light spec only.

## 5. GRIP (handle above the slab)
- Short wrapped handle above the blade top, length ~0.14 * L, width ~0.30 * W.
- Matte dark, non-emissive.

## 6. MATERIALS SUMMARY
- Body slab: matte structural black / graphite (#252321 / #424246), heavy mineral texture, low spec. NO glossy plastic.
- Core seam: emissive #8F00FF only.
- Ring + grip fittings: matte metal, non-emissive.
- BAN: chrome/plastic gloss on the slab body, colored rim light, any violet outside the seam.

## 7. HARD BANS (silhouette)
needle taper · katana curvature · longsword/greatsword profile · crossguard/tsuba · fuller · narrow blade · double-edge taper along the whole length · any curve (blade is dead straight).

## 8. DELIVER + RE-SHOOT
After re-model, re-shoot the three build cards from the SAME corrected mesh:
1. 2D→3D BUILD LOG (extrude/wireframe) — must show the wide slab wireframe, parallel edges.
2. TURNTABLE 360° — slab reads broad from every angle; thin only when edge-on.
3. KEY ART / POSTER — hero slab, seam lit violet.
Pull the current 3 wrong cards from the deck/site until replaced.

## 9. CROSS-CHECK (must pass before lock)
- Silhouette must match the slab in comic KF05 (already locked). 3D and 2D layers may not diverge.
- Width-to-length ratio measured on the render must land 0.22–0.26.
- Edge-on turntable frame is the only place the blade may look thin; front/45° must read broad.
- Seam is one centered line; ring at exact mid. No taper except the last ~13%.

STATUS: geometry spec LOCKED. Codex executes in Blender. Not production-ready until §9 cross-check passes and operator approves.

---

## Lane A scope note (added by Cowork, not part of the original locked spec)
Base file for this task = `MIKAGE_STANDING_HERO_POLISH_V0_14.blend` (current ASSET-LOCKED standing
hero, commit `64cd46f`). You have geometry/transform/material rights on the **blade mesh only**.
Helmet geometry, body/cloak geometry, camera, lighting, and the slit emission hue (#8F00FF) must
hash-match the base exactly when you're done — do not touch them. This continues the deferred
V0.13/V0.14 blade flag ("blade reads as a detached panel... operator opens a composition round
with transform rights") — you now have those transform rights, scoped to the blade only.
