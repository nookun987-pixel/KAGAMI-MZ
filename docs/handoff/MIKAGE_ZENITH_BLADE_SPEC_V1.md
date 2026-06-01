# MIKAGE_ZENITH_BLADE_SPEC_V1

STATUS: DRAFT_SPEC + OPERATOR_RULING_RECORDED + DRIVE_MASTER_AUDIT_RECONCILED (NOT yet formally canon-lock / asset-lock — awaiting explicit operator "lock" command)
DATE: 2026-06-01 (ruling §0b added 2026-06-01b; Drive master audit §0 added 2026-06-01c)
SOURCES: operator Drive master files — `Mikage Copywriter`, `Mikage Zenith Core`, `BÁCH KHOA TOÀN THƯ MASTER BIBLE V2.0`, `TÀI LIỆU HUẤN LUYỆN VẬN HÀNH STUDIO` (operator audit 2026-06-01c — AUTHORITATIVE); `character_workflow/proposals/zenith_blade.json` (DRAFT_PROPOSAL_NOT_CANON); `docs/canon_proposals/MIKAGE_V2_5_vs_V1_LOCK_CONFLICT_REPORT.md` §1.6/§3; `docs/automation/render_briefs/GOOGLE_DRIVE_MIKAGE_AUDIT_V0_1.md`; operator MidJourney reference set in Drive `MIKAGE/zenith` and `MIKAGE/zenith V2`.

This is a no-render consolidation so the Zenith Blade design lives in one place. It does not lock canon or assets.

## 0. DRIVE MASTER AUDIT 2026-06-01c (AUTHORITATIVE — operator-verified against source master files)

Operator cross-checked the master Drive files. This corrects two earlier confusions: (a) the earlier asset audit only read the published `.docx`, which never received the per-phase technical definitions; (b) a sub-agent translated the Vietnamese term **"Thanh Đại Đao 3 Pha"** into the code token `TRI_PHASE` but never wrote the per-phase definitions — so the upstream AI saw "TRI_PHASE" with no body and refused to lock it. The "3 phases" are real and ON-CANON; only the per-phase *technical wording* is provisional.

### 0.1 LOCKED — Absolute Invariants (from Master Bible V2.0 source)
- **Name:** "Thanh Đại Đao 3 Pha" = **Zenith Blade** (same weapon). Wielded ONLY by Mikage.
- **Mass 350 kg.** Bone/core = **Ferro-calcium**, red-hot; carries the **Lõi Lương tâm (Conscience Core)**.
- **Landauer Law:** erasing data generates heat **>43°C → spiderweb burn scars (sẹo bỏng mạng nhện)** on Mikage's arm.
- **Side-Channel Combat:** the sole interface — reads micro-muscle-contraction under the ~**350 kg** load.
- **Rest / non-combat carry:** weapon clings to the **back via Flux Pinning (Ghim từ thông)**. (This is the ONLY canon rest state.)
- **3-Phase ("3 Pha") existence = ON-CANON.**

### 0.2 NOW SUPPLIED by operator 2026-06-01c — and RE-SCOPED
- The operator supplied the full per-phase definitions. **Key correction:** the "3 Pha" are the **ENTITY Mikage Zenith's 3 appearance phases** (Imperial Clean / Fallen-Exile / Execution), NOT the blade's mode set. They are recorded in **`docs/handoff/MIKAGE_ZENITH_ENTITY_PHASE_SPEC_V1.md`**.
- The earlier Silent / Side-channel Pulse / Thermal Overload blade-mode mapping was a WRONG fill and is **retired** (see §2). The blade itself has REST vs COMBAT-ACTIVE; its combat appearance keys to the entity phase (e.g. Execution → red core / heat mirage).

### 0.3 NOT IN ANY SOURCE FILE — deprecate
- **`COMPACT_IDLE` / "mini stored module" (the old ST0): NOT CANON.** It appears in no Drive file; it was inferred in recent chats to brief the image-gen AI. **Removed.** The canon rest state is Flux-Pinning carry on the back (§0.1), not a shrunk module.

### 0.4 ENTITY PHASES → moved to dedicated spec (figure lane)
The 03 entity appearance phases (Imperial Clean / Fallen-Exile / Execution), now fully specified by the operator, live in **`docs/handoff/MIKAGE_ZENITH_ENTITY_PHASE_SPEC_V1.md`**. ⚠ That spec defines a **Kitsune mask WITH eye slits (khe mắt)** + B4C #FAFAFA shell, which CONFLICTS with the recent "faceless sealed monocoque, no eye slits" figure work — operator must reconcile in the figure lane (flag carried there). Out of scope for this blade spec.

## 0b. OPERATOR FORM RULING 2026-06-01b (refined by §0 above)

One weapon, two visual forms + the locked phases:

- **F1 (naming) → SAME WEAPON.** Confirmed by §0.1.
- **F2 (ornate MJ design) → ON-CANON, NOT drift.** The slender/ornate mechanical design (circular mechanism hilt, telescoping segments) the operator prompted in MidJourney is the **non-combat appearance** of the blade (carried on the back via Flux Pinning per §0.1).
- **F3 → corrected by §0.3:** there is NO mini/compact-idle. Rest = ornate blade flux-pinned to the back (full weapon), not a shrunk module.

### Canonical state model (corrected 2026-06-01c)
```
The blade itself has TWO states (the 3 "Pha" belong to the ENTITY, not the blade — see entity spec):
  REST / non-combat   — ornate mechanical blade (MJ design) flux-pinned to Mikage's back (full weapon, NOT mini)
  COMBAT-ACTIVE       — 350 kg PrimeTool: red Orbital-Logic monospaced UI text wrapping the blade (3° offset),
                        ferro-calcium core #E60000 glowing, pH 1.2 acid-rain flash-vaporizing on the edge.
The blade's combat appearance tracks the entity phase (esp. Execution → strongest core glow / heat mirage).
```
Reference for the non-combat ornate appearance: operator MidJourney images in Drive `MIKAGE/zenith` and `MIKAGE/zenith V2`. Operator to supply the specific PNG(s) as render sources.

NOTE: the §1 "forbidden drift" list (curved/thin/ornate/circular mechanism) applies to the **combat 350 kg form ONLY**. It does NOT forbid the non-combat ornate appearance, which is canon.

## 1. Identity & DEVICE SPEC (operator master, 2026-06-01c)

- Canonical name: **Zenith Blade**, identifier **PrimeTool**; class = **industrial đại đao for executing `execute()` commands**. Wielded ONLY by Mikage.
- Mass: **350 kg**.
- Material/structure: **black rusty Titanium plates assembled FLOATING around a Ferro-calcium core skeleton that is red-hot (#E60000)**. (Not a single solid slab — suspended plate assembly around a glowing core.)
- Linkage: **Flux Pinning (Ghim từ thông)** protocol, maintaining a **0.5 mm micro-vibration** at the magnetic joint points.
- Thermodynamic consequence: released entropy heat **instantly vaporizes acid rain (pH 1.2)** on contact with the blade surface.
- Control UI: a band of **red Monospaced "Orbital Logic" text wrapping around the weapon along a 3D coordinate axis, offset 3°** to optimize combat-data display.
- Idle core temp **43°C**; thermal overload crosses **43°C** threshold (Landauer). Carries the **Lõi Lương tâm (Conscience Core)**.
- Forbidden drift (COMBAT form only): curved katana, thin elegant blade, clean laser look, fantasy ornament, decorative scimitar, tiny/light proportions. (The non-combat ornate appearance is exempt — §0b.)

## 2. "3 Pha" belong to the ENTITY — not the blade (CORRECTED 2026-06-01c)

The earlier Silent / Side-channel Pulse / Thermal Overload **blade-mode** table was a WRONG fill and is RETIRED. The operator's master spec defines the "3 Pha" as the **entity Mikage Zenith's 3 appearance phases** — Imperial Clean / Fallen-Exile / Execution — recorded in `docs/handoff/MIKAGE_ZENITH_ENTITY_PHASE_SPEC_V1.md`.

How it ties to the blade (this device): the blade has REST vs COMBAT-ACTIVE (§0b). Its combat appearance intensifies with the entity phase — most extreme in **Execution** (Landauer overload): core #E60000 at full glow, surrounding thermal mirage, pattern "blood-vessel" glow. The blade's own locked traits (350 kg, floating Ti plates around red Ferro-calcium core, flux-pinning 0.5 mm, Orbital-Logic red UI, pH 1.2 acid-vapor) hold across all phases — see §1.

## 3. Rest / non-combat carry — CORRECTED by §0.3 audit

SUPERSEDED: the earlier "compact / shrunk (mini) stored form" idea (`COMPACT_IDLE`). The Drive master audit (§0.3) confirms this keyword is in NO source file — it was a recent chat inference. **Deprecated.**

CANON rest state (§0.1): the weapon clings to **Mikage's back via Flux Pinning (Ghim từ thông)** — the full ornate non-combat blade, not a shrunk module. No retract-to-mini stage exists in canon.

## 4. Open Flags — RESOLVED (§0b ruling + §0 audit)

1. ~~Naming~~ → SAME weapon (Zenith Blade = Thanh Đại Đao 3 Pha).
2. ~~Drift check~~ → ornate MJ design = ON-CANON non-combat appearance.
3. ~~Compact-idle~~ → DEPRECATED (not in any source; §0.3). Rest = Flux-Pinning back-carry.

Remaining to supply / decide (not blocking render): (a) ✅ DONE — per-phase wording supplied 2026-06-01c (entity-level; in entity spec); (b) the specific MJ reference PNG(s) from Drive `zenith` / `zenith V2` for the non-combat appearance; (c) figure-lane reconciliation of the Kitsune-mask-with-eye-slits vs faceless work (see entity spec §2 — operator ruling needed).

## 5. Asset Status

- Locked identity reference: `MIKAGE_ZENITH_BLADE_V2_POLISH_ONE_SHOT_00001_.png` (08_CHARACTER_REVIEW_CANDIDATES) — full deployed blade.
- Comparison ref: `MIKAGE_COMP_07B_ZENITH_BLADE_CLEAN_MONOLITH_REVIEW_CANDIDATE.png` (INCLUDE_AS_PHASE4_REFERENCE).
- Missing: operator-selected MJ non-combat ornate PNG(s) from Drive; standalone isolated blade prompt seed; confirmed standalone 3D. (Compact-idle asset is NO LONGER a gap — deprecated per §0.3.)

## 6. Prohibited Actions Confirmed

CANON_LOCK_CREATED: NO · ASSET_LOCK_CREATED: NO · PRODUCTION_READY: NO · RENDER_DONE_BY_CLAUDE: NO · LANE_CHANGED: NO
