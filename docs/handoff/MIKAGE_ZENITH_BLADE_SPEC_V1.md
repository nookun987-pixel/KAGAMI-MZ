# MIKAGE_ZENITH_BLADE_SPEC_V1

STATUS: STRUCTURE DESIGN OPERATOR-APPROVED 2026-06-02 (synced 3-phase model + B4C/Titan two-layer + Compact-Idle block — formally approved 🔒 by operator). Structural/2D design canon is operator-approved; a repo ASSET-LOCK entry awaits the operator's explicit lock press. Rendered / 3D assets remain REVIEW-CANDIDATE until they pass their render gate (NOT production-ready).
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

### 0.4 ENTITY PHASES → dedicated spec (figure lane) — MASK CONFLICT RESOLVED
The 03 entity appearance phases (Imperial Clean / Fallen-Exile / Execution) live in **`docs/handoff/MIKAGE_ZENITH_ENTITY_PHASE_SPEC_V1.md`** (V2.5). The Kitsune-vs-faceless conflict is **RESOLVED 2026-06-02 (option c)**: keep the Kitsune **planar-geometry** mask silhouette, but **seal the 0.7" eye slits** (Clean Code) with Graphene + Side-Channel BMF beneath the shell. Faceless work is compatible if it keeps the Kitsune form. Out of scope for this blade spec beyond the cross-reference.

## 0b. OPERATOR-APPROVED SYNCED 3-PHASE MODEL — 2026-06-02 (supersedes the 2-state model)

The operator formally approved (🔒) one synchronized 3-phase progression: the weapon's activation state and the entity's appearance are the SAME phase, driven together by the energy Driver + Landauer heat limit. The blade is "Thanh Đại Đao 3 Pha" — the 3 Pha ARE the weapon's 3 activation stages, synced to the entity.

| Phase | Weapon (Zenith Blade) | Entity | Material read |
|---|---|---|---|
| **P1** | `Compact-Idle` — closed brutal B4C block, plates contracted, flux-pinned to back, core dim 43°C | `Imperial Clean` | smooth white B4C shell, sterile, sealed |
| **P2** | `Brutal Industrial Activation` — B4C shell splits (Kintsugi), near threshold, industrial wear | `Fallen / Exile` | shell opening → black Ti frame + core begin to show |
| **P3** | `Tri-Phase Final / Overdrive` — full release: core #E60000 max, Orbital-Logic UI 3° wrap, acid pH1.2 vapor, thermal mirage >43°C | `Execution` | shell fully split, Ti frame floating, core blazing |

**Two-layer material (operator-approved §0.6):** outer = **B4C porcelain shell (deterministic)**; inner = **black rusty Titanium load-bearing frame**, exposed only when the geometry expands. Resolves the white/dark contradiction.

**Phom REST reversed (đảo F2):** REST is NO LONGER the slender/ornate MJ form — it is now a **closed, square, smooth B4C brutal block** (Imperial Clean). The earlier "ornate MJ = non-combat" ruling (old F2) is **SUPERSEDED**. The MJ ornate images are repurposed as reference for the **internal mechanism detail revealed in P2/P3** (circular drive / telescoping frame), not for the closed REST form.

NOTE: the §1 "forbidden drift" (curve/thin/elegant/fantasy) applies to ALL phases — even the internal frame stays brutal industrial, never slender katana.

## 1. Identity & DEVICE SPEC (operator master, 2026-06-01c)

- Canonical name: **Zenith Blade**, identifier **PrimeTool**; class = **industrial đại đao for executing `execute()` commands**. Wielded ONLY by Mikage.
- Mass: **350 kg**.
- **Material (two-layer, operator-approved 2026-06-02 §0.6):** *"Gốm Boron Carbide (B4C) cấu thành hệ thống vỏ bọc ngoài tất định; Titan đen đóng vai trò khung chịu lực bên trong, lộ diện khi giãn nở cấu trúc hình học."* → outer = **B4C porcelain shell** (white #FAFAFA, sterile, the only visible surface in P1); inner = **black rusty Titanium load-bearing frame** around a **Ferro-calcium core (#E60000)**, exposed only when the shell splits in P2/P3.
- Linkage: **Flux Pinning (Ghim từ thông)** protocol, maintaining a **0.5 mm micro-vibration** at the magnetic joint points.
- Thermodynamic consequence: released entropy heat **instantly vaporizes acid rain (pH 1.2)** on contact (P3).
- Control UI: a band of **red Monospaced "Orbital Logic" text wrapping the weapon along a 3D axis, offset 3°** (activates in P3 Overdrive).
- Idle core temp **43°C**; thermal overload crosses **43°C** threshold (Landauer, P3). Carries the **Lõi Lương tâm (Conscience Core)**.
- Forbidden drift (ALL phases): curved katana, thin elegant blade, clean laser look, fantasy ornament, decorative scimitar, tiny/light proportions. The closed REST form is a brutal industrial block; the exposed internal frame stays brutal, never slender.

## 2. "3 Pha" = the weapon's 3 activation stages, SYNCED to the entity (OPERATOR-APPROVED 2026-06-02)

Final resolution: the 3 Pha are the **weapon's 3 activation stages** (P1 Compact-Idle → P2 Brutal Activation → P3 Overdrive), and they run **synchronized** with the entity's 3 appearance phases (Imperial Clean → Fallen/Exile → Execution). One progression, one driver (energy Driver + Landauer heat). Full table in §0b and in entity spec `MIKAGE_ZENITH_ENTITY_PHASE_SPEC_V1.md §0.5`.

(The old "Silent / Side-channel Pulse / Thermal Overload" blade-mode fill is RETIRED; this synced model replaces both it and the interim 2-state model.)

## 3. P1 rest state — `Compact-Idle` (term reinstated + redefined 2026-06-02)

`COMPACT_IDLE` is reinstated as the OFFICIAL P1 name, but REDEFINED: it means a **closed / compact BLOCK** — the B4C shell shut, Titanium plates contracted tight, smooth square brutal block, core dim (43°C), flux-pinned to Mikage's back. It is NOT the earlier-deprecated "shrunk mini module" (that interpretation stays dead). The weapon is full-size; "compact" = closed geometry, not miniaturized.

## 4. Open Flags — RESOLVED (§0b ruling + §0 audit)

1. ~~Naming~~ → SAME weapon (Zenith Blade = Thanh Đại Đao 3 Pha).
2. ~~Drift check~~ → ornate MJ design = ON-CANON non-combat appearance.
3. ~~Compact-idle~~ → DEPRECATED (not in any source; §0.3). Rest = Flux-Pinning back-carry.

Remaining to supply / decide: (a) ✅ DONE — synced 3-phase + materials operator-approved 2026-06-02; (b) operator presses the formal repo ASSET-LOCK when ready (structure design is approved); (c) MJ ornate PNG(s) now used as INTERNAL-mechanism reference for P2/P3 (not the closed REST form); (d) figure-lane Kitsune mask = resolved option (c), entity spec §2.

## 5. Asset Status

- Locked identity reference: `MIKAGE_ZENITH_BLADE_V2_POLISH_ONE_SHOT_00001_.png` (08_CHARACTER_REVIEW_CANDIDATES) — full deployed blade.
- Comparison ref: `MIKAGE_COMP_07B_ZENITH_BLADE_CLEAN_MONOLITH_REVIEW_CANDIDATE.png` (INCLUDE_AS_PHASE4_REFERENCE).
- Missing: operator-selected MJ non-combat ornate PNG(s) from Drive; standalone isolated blade prompt seed; confirmed standalone 3D. (Compact-idle asset is NO LONGER a gap — deprecated per §0.3.)

## 6. Prohibited Actions Confirmed

CANON_LOCK_CREATED: NO · ASSET_LOCK_CREATED: NO · PRODUCTION_READY: NO · RENDER_DONE_BY_CLAUDE: NO · LANE_CHANGED: NO
