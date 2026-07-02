# MIKAGE_ASSET_ANCHOR_INDEX_V1

**SUPERSEDED 2026-07-03 (halo color only) — halo ring CHỐT TRẮNG (white), not violet; violet = 2 slits only. See `docs/handoff/HALO_RING_RULING_2026-07-03.md`. Any "violet halo ring" line below is overridden — kept for history, do not follow. Rest of this index (anchor KEEP/DROP status) is unaffected.**

STATUS: LIVING INDEX — the **single grab-and-go sheet** for "which assets to reuse, which to ignore." Records existing/derived status only. NOT canon-lock · NOT asset-lock · NOT production-ready · NO render by Claude. Items not directly verified this pass = `CHUA_XAC_NHAN`. DROP = *ignore / do not start from it* — **NOT delete** (no file is moved/renamed/deleted by this index).
DATE: 2026-06-02
SUPERSEDES (for anchor-selection purposes): `docs/automation/render_briefs/CAST_VISUAL_LEDGER_V0_1.md` (2026-05-31, now stale — predates V4 LOCKED, faceplate sources, bust-bridge candidates, blade ortho). That ledger stays as history; THIS file is the one to read first.
PURPOSE: stop the per-session reset. Every cast/render session reads THIS file first and starts from the KEEP anchors instead of re-deriving.

---

## 0. WHY THINGS KEPT "RESETTING" (root cause)

1. **The best canon assets live OUTSIDE the synced repo** (`D:\MIKAGE ZENITH AUDIO\…`, D: root), which the agent/git cannot reach. So they could not be "pulled in and reused" — they were never in reach. → fixed structurally in §6.
2. **Cataloging was fragmented** across ~40 `ASSET-BUILD-01…10` files + a stale V0.1 ledger. No single KEEP/DROP sheet. → this file is that sheet.

---

## 1. THE RULE (read this every session)

- Start from §2 KEEP anchors. Do **not** re-render identity from scratch.
- For any Mikage render, wire the **identity anchors** (A1 helmet + A2 full body) as IP-Adapter / ControlNet reference so the head never drifts.
- Never start from a §5 DROP file.
- Update this index by version bump (`_V2`) when an anchor changes; don't silently edit.

---

## 2. KEEP — CANON ANCHORS, **IN-REPO & REACHABLE NOW**

These are inside `KAGAMI-MZ_SYNC_PUSH_V2` and load directly. Highest value first.

| ID | File (repo-relative path) | What it is | Use for | Verified |
|---|---|---|---|---|
| **A1** | `film_proofs/MIKAGE_FILM_PROOF_01/source_pack_v1/comfyui_canon_candidates/SHOT_02_MIKAGE_PRESENCE__02_UNIFIED_KEY_VISUAL_V4_LOCKED__APPROVED_FOR_FILM_PROOF_SOURCE.png` | Helmet hero shot — faceless porcelain, **exactly 2 sealed sensor slits + violet halo ring**, void bg | **PRIMARY IDENTITY / FACE anchor** (IP-Adapter ref). Fixes the FLUX "no slits / no violet" miss. | ✅ VIEWED 2026-06-02 |
| **A2** | `docs/character/anchor_v1_candidates/P3A_R4_HELMET_INPAINT_001.png` | Anchor V1 full Vessel — porcelain monocoque, long black hair, Zenith Blade, violet accents; **score 100/100 PASS** | **FULL-BODY / SILHOUETTE identity anchor** (IP-Adapter ref) | ✅ VIEWED 2026-06-02 |
| A2-mask | `docs/character/anchor_v1_candidates/P3A_R4_HELMET_INPAINT_001_MASK.png` | Inpaint mask for A2's faceplate | helmet-region inpaint/control | ✅ exists |
| A3 | `film_proofs/MIKAGE_FILM_PROOF_01/source_pack_v1/comfyui_canon_candidates/SHOT_03_TITLE_OR_ICONIC_HERO__03_ZENITH_BLADE_V2_LOCKED__APPROVED_FOR_FILM_PROOF_SOURCE.png` | Zenith Blade hero — V2 **LOCKED + film-proof approved** | **BLADE anchor** (P1 monolith / blade cells) | path confirmed |
| A4 | `docs/character/references/blade/REF_SP002_ZENITH_BLADE_V2__BLADE.png` | Zenith Blade clean reference | blade secondary ref | path confirmed |
| A5 | `film_proofs/MIKAGE_FILM_PROOF_01/source_pack_v1/comfyui_canon_candidates/SHOT_01_SIGNAL_VOID_OR_SYSTEM_WAKE__01_AUDIO_SHORT_VISUAL_CANON_V4_LOCKED__APPROVED_FOR_FILM_PROOF_SOURCE.png` | Audio-short canon V4 **LOCKED + approved** | mood / signal-void key frame | path confirmed |
| A6 | `docs/character/references/mask_body_silhouette/REF_SP001_UNIFIED_KEY_VISUAL_V4__MASK_BODY_SILHOUETTE.png` | V4 unified mask+body silhouette ref | silhouette/proportion ref | path confirmed |

→ For the 12-cell CAST_RUNPOD_KIT_V1: **A1 = head/slit IP-Adapter ref, A2 = body/silhouette ref, A3 = blade ref.** This alone should fix the slit + violet drift seen in the FLUX P1-front test.

---

## 3. IMPORT — CANON-GRADE BUT **OFF-REPO** (must copy in to become reusable)

Seen on disk (operator screenshots / prior ledger) but NOT inside the synced repo, so unreachable until imported. Paths below = best-known location, `CHUA_XAC_NHAN` until confirmed.

| ID | File (name) | Likely location | Why import |
|---|---|---|---|
| I1 | `MIKAGE_FACEPLATE_SENSOR_SLIT_CLOSEUP_V1` / `05_FACEPLATE_SENSOR_SLIT_SOURCE` / `07_HELMET_FROM_FACEPLATE_SOURCE` | `D:\MIKAGE ZENITH AUDIO\…` (CHUA_XAC_NHAN) | dedicated 2-sealed-slit source plates — strongest slit refs |
| I2 | `_NORM` upper-body 4-view set (`V5CN_BACK`, `V5CN_SIDE`, `V6SET_FRONT`, `V6SET_THREEQ`) | off-repo (CHUA_XAC_NHAN) | canonical turnaround for consistent angles |
| I3 | `MIKAGE_FULLBODY_V3CN_401_00001` | off-repo (CHUA_XAC_NHAN) | full-body proportion reference |
| I4 | Zenith Blade **ortho sheet** (front / side / 3-quarter + detail) | off-repo (CHUA_XAC_NHAN) | blade turnaround / mechanism detail |
| I5 | `02_UNIFIED_KEY_VISUAL_V4_LOCKED`, `01_AUDIO_SHORT_VISUAL_CANON_V4_LOCKED` master PNGs | off-repo (the in-repo A1/A5 are the film-proof copies) | full-res masters |
| I6 | `APPROVED_IMG_MIKAGE_material-system_board-clean-4panel_v01`, `APPROVED_IMG_MIKAGE_environment_industrial-corridor-wet-floor_v01` | off-repo (CHUA_XAC_NHAN) | approved material + environment refs |

---

## 4. HOLD — REVIEW CANDIDATES (keep for review; do NOT treat as locked)

| ID | Item | Gate / reason |
|---|---|---|
| H1 | `MIKAGE_BUST_BRIDGE_CAND_01_REVIEW_CANDIDATE_20260512_00001…00007` | bust/upper-body bridge — must pass AR-14 §9 gate (`MIKAGE_BUST_UPPER_BODY_BRIDGE_ASSET_REQUEST_SPEC_V1.md`); currently **HOLD** |
| H2 | FLUX **P1-front v2** (today, seed 1051908761815282) | strong P1 candidate — slits + oxblood now present; PASS_WITH_NOTES; **proposed P1 anchor pending operator OK** |
| H3 | FLUX P1-front v1 (today) | superseded by v2 within the same test; keep only as before/after |
| H4 | cinematic candidates (`a_dark_cinematic_sci_fi_portrait`, `cybernetic_figure_in_neon_halo`, `futuristic_android_illuminated`) | mood/LYRA-adjacent review candidates; not Mikage canon |

---

## 5. DROP — SUPERSEDED / NOT FOR REUSE (ignore — do NOT delete)

| Item | Why |
|---|---|
| `MIKAGE_UNIFIED_KEY_VISUAL_V1 / V2 / V3` (incl. `_POLISH`, `_RETRY`) | superseded by **V4 LOCKED** (A1/A5/A6) |
| `MIKAGE_*_RETRY_*`, `MIKAGE_LAYOUT_PANEL_TEST_V1` | iteration scrap |
| `MIKAGE_GOOD_IMAGE_CONTACT_SHEET_V1`, `MIKAGE_VIDEO_LOOP_TEST_V1_VISUAL_CONTACT_SHEET` | curation/film-lane artifacts, not cast source |
| `calibration_*` (≈740 PNGs in `calibration_batch_images/` + `calibration_images/`) | scorer-calibration batches — **not character assets**; ignore for cast work |
| `MIKAGE_COMP_08B_HELMET_BUST_NEGATIVE_SPACE_ALT_PASS_TECHNICAL.png` | **REJECT_DO_NOT_USE** per CLAUDE.md render-source exclusions |

---

## 6. STRUCTURAL FIX (so this never resets again)

Recommended (operator runs the copy, or approves Codex to): create one in-repo folder and copy the true anchors in, so they **sync with the project and every future session can reach them**.

```
mkdir D:\KAGAMI-MZ_SYNC_PUSH_V2\canon_anchors
# copy the §3 IMPORT files (I1 faceplate-slit, I2 _NORM turnaround, I3 fullbody, I4 blade ortho) into it
```

After import, bump this file to `_V2` and move those rows from §3 IMPORT → §2 KEEP with real repo paths. The §2 anchors (A1–A6) are already in-repo and need no copy.

---

## 7. STATUS LIMITS
Index / triage only. NOT canon-lock · NOT asset-lock · NOT production-ready · NO render / no file move / no rename / no delete by Claude · NO film/video/short/shotlist · LANE = CHARACTER_CAST_LANE (unchanged). Off-repo paths and any file not opened this pass = `CHUA_XAC_NHAN`. Promoting H2 (P1-front v2) to a locked anchor requires explicit operator instruction.
