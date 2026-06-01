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

### 0.2 PROVISIONAL — exists in concept, not yet coded into the published source
- The explicit per-phase definitions (what Pha 1 / Pha 2 / Pha 3 each look like / do). The Silent / Side-channel Pulse / Thermal Overload mapping in §2 is a **proposed fill** anchored to the locked invariants (Side-Channel + Landauer), NOT yet operator-locked wording. Treat §2 as PROVISIONAL until operator codes the per-phase text.

### 0.3 NOT IN ANY SOURCE FILE — deprecate
- **`COMPACT_IDLE` / "mini stored module" (the old ST0): NOT CANON.** It appears in no Drive file; it was inferred in recent chats to brief the image-gen AI. **Removed.** The canon rest state is Flux-Pinning carry on the back (§0.1), not a shrunk module.

### 0.4 CHARACTER NOTE (flag — figure lane, NOT this blade task)
Master source: Mikage = **white porcelain Kitsune mask (mặt nạ Kitsune sứ trắng)**, with **3 LOCKED appearance variants: Imperial Clean / Fallen-Exile / Execution** (storyline appearance variants — NOT "3 armor operating states"). ⚠ This may diverge from the recent "faceless sealed monocoque porcelain" figure work. FLAG for operator reconciliation in the figure/character lane; out of scope for this blade spec.

## 0b. OPERATOR FORM RULING 2026-06-01b (refined by §0 above)

One weapon, two visual forms + the locked phases:

- **F1 (naming) → SAME WEAPON.** Confirmed by §0.1.
- **F2 (ornate MJ design) → ON-CANON, NOT drift.** The slender/ornate mechanical design (circular mechanism hilt, telescoping segments) the operator prompted in MidJourney is the **non-combat appearance** of the blade (carried on the back via Flux Pinning per §0.1).
- **F3 → corrected by §0.3:** there is NO mini/compact-idle. Rest = ornate blade flux-pinned to the back (full weapon), not a shrunk module.

### Canonical state model (audit-reconciled)
```
REST / non-combat  — ornate mechanical blade (MJ design) flux-pinned to Mikage's back (full weapon, NOT mini)
COMBAT (350 kg Đại Đao, 3 Pha):
  Pha 1  Silent           — no glow, light-swallowing (PROVISIONAL wording)
  Pha 2  Side-channel Pulse — red fracture pulses; tied to LOCKED Side-Channel Combat reading (PROVISIONAL wording)
  Pha 3  Thermal Overload   — crimson #E60000 core + heat; tied to LOCKED Landauer >43°C scarring (PROVISIONAL wording)
```
Reference for the non-combat ornate appearance: operator MidJourney images in Drive `MIKAGE/zenith` and `MIKAGE/zenith V2`. Operator to supply the specific PNG(s) as render sources.

NOTE: the §1 "forbidden drift" list (curved/thin/ornate/circular mechanism) applies to the **combat 350 kg form ONLY**. It does NOT forbid the non-combat ornate appearance, which is canon.

## 1. Identity (from canon draft)

- Canonical name: **Zenith Blade**. Wielded ONLY by Mikage (never Lyre/LORA/others).
- Class: **350 kg heavy industrial straight sword** — "brute consequence" (vs Lyre's surgical Molecular Monowire).
- Geometry: massive oversized **rectangular slab block**, thick spine / ultra-thin edge, **absolutely straight (zero curvature)**, Appleseed convex distal taper, monolithic, dark body.
- Material: dark rusty titanium scrap plates · ferro-calcium heated core · **flux-pinning assembly (plates hover 0.5 mm apart)**.
- Dimensions (canon): mass 350 kg · length **35–58 inch (variable)** · idle core temp **43°C** · peak **800°C**.
- Forbidden drift: curved katana, thin elegant blade, clean laser look, fantasy ornament, decorative scimitar, over-ornamented guard, tiny/light proportions.

## 2. Three Phases ("3 Pha" / Tri-phase) — EXISTENCE ON-CANON; per-phase wording PROVISIONAL (see §0.2)

The 3-phase structure is canon (§0.1). The specific visual definition of each phase below is a PROPOSED fill anchored to the locked invariants (Side-Channel Combat, Landauer Law); it is NOT yet operator-coded into the source master, so do not canon-lock the wording.

| # | Phase | Visual (PROVISIONAL) | Locked anchor |
|---|---|---|---|
| Pha 1 | **Silent** | monolithic, "swallows light", flux-pinning stable, **no glow** | 350 kg form |
| Pha 2 | **Side-channel Pulse** | **red pulses** through nano-fractures on load/hesitation | LOCKED Side-Channel Combat (reads micro-muscle under ~350 kg) |
| Pha 3 | **Thermal Overload** | **crimson #E60000** core, heat distortion / steam, arm scars | LOCKED Landauer Law (>43°C → spiderweb burn scars) |

## 3. Rest / non-combat carry — CORRECTED by §0.3 audit

SUPERSEDED: the earlier "compact / shrunk (mini) stored form" idea (`COMPACT_IDLE`). The Drive master audit (§0.3) confirms this keyword is in NO source file — it was a recent chat inference. **Deprecated.**

CANON rest state (§0.1): the weapon clings to **Mikage's back via Flux Pinning (Ghim từ thông)** — the full ornate non-combat blade, not a shrunk module. No retract-to-mini stage exists in canon.

## 4. Open Flags — RESOLVED (§0b ruling + §0 audit)

1. ~~Naming~~ → SAME weapon (Zenith Blade = Thanh Đại Đao 3 Pha).
2. ~~Drift check~~ → ornate MJ design = ON-CANON non-combat appearance.
3. ~~Compact-idle~~ → DEPRECATED (not in any source; §0.3). Rest = Flux-Pinning back-carry.

Remaining to supply / decide (not blocking render): (a) operator codes the per-phase technical wording (§0.2) to move §2 from PROVISIONAL to locked; (b) the specific MJ reference PNG(s) from Drive `zenith` / `zenith V2` for the non-combat appearance; (c) figure-lane reconciliation of the Kitsune-mask + 3 appearance variants (§0.4).

## 5. Asset Status

- Locked identity reference: `MIKAGE_ZENITH_BLADE_V2_POLISH_ONE_SHOT_00001_.png` (08_CHARACTER_REVIEW_CANDIDATES) — full deployed blade.
- Comparison ref: `MIKAGE_COMP_07B_ZENITH_BLADE_CLEAN_MONOLITH_REVIEW_CANDIDATE.png` (INCLUDE_AS_PHASE4_REFERENCE).
- Missing: operator-selected MJ non-combat ornate PNG(s) from Drive; standalone isolated blade prompt seed; confirmed standalone 3D. (Compact-idle asset is NO LONGER a gap — deprecated per §0.3.)

## 6. Prohibited Actions Confirmed

CANON_LOCK_CREATED: NO · ASSET_LOCK_CREATED: NO · PRODUCTION_READY: NO · RENDER_DONE_BY_CLAUDE: NO · LANE_CHANGED: NO
