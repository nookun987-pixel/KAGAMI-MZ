# 01_CANON_ASSET_REGISTRY

## Registry Authority

This is the authoritative registry of all Mikage canon and candidate assets as of 2026-05-12.
Status changes require evidence and must be reflected here.

Statuses:
- **LOCKED_CANON** — human-approved, locked; may be used as reference; cannot be modified
- **TEMP_REFERENCE** — accepted for workflow use but not locked; no downstream production use
- **REVIEW_CANDIDATE** — generated, under review; no use until gate result
- **FAILED_DO_NOT_USE** — failed review or wrong run; permanently excluded unless explicitly overridden
- **MISSING_REQUIRED** — required slot not yet filled; blocks downstream phase
- **DEPRECATED** — superseded by newer version; retain for history only
- **UNKNOWN_NEEDS_REVIEW** — status unclear; must be resolved before any use

---

## Section A — Identity Anchors (LOCKED_CANON)

### A-01 Unified Key Visual V4

| Field | Value |
|---|---|
| Asset name | MIKAGE_UNIFIED_KEY_VISUAL_V4_FROM_CLEAN_SOURCES |
| Path | `D:\workspace\ComfyUI\MIKAGE_CANON\08_CHARACTER_REVIEW_CANDIDATES\MIKAGE_UNIFIED_KEY_VISUAL_V4_FROM_CLEAN_SOURCES_00001_.png` |
| Status | **LOCKED_CANON** |
| Evidence / report | `D:\workspace\ComfyUI\MIKAGE_CANON\08_CHARACTER_REVIEW_CANDIDATES\MIKAGE_UNIFIED_KEY_VISUAL_V4_ASSET_LOCK.md` |
| Allowed use | Identity / style language anchor; IP-Adapter style check (TERTIARY, weight ≤ 0.4) |
| Forbidden use | Primary IP-Adapter conditioning; film plate; production stack completion by itself; Phase 5 entry source; public output without explicit approval |
| Can be used as source | YES — style check / tertiary conditioning only |
| Can be used for public material | NO — not without separate approval |
| Can be used for cinematic production | NO — Phase 6+ gate required |

### A-02 Helmet Front 3D Source V1 (Ortho)

| Field | Value |
|---|---|
| Asset name | MIKAGE_HELMET_FRONT_VIEW_3D_SOURCE_V1_ORTHO |
| Path | `D:\workspace\ComfyUI\MIKAGE_CANON\08_CHARACTER_REVIEW_CANDIDATES\MIKAGE_HELMET_FRONT_VIEW_3D_SOURCE_V1_ORTHO.png` |
| Status | **LOCKED_CANON** |
| Evidence / report | `D:\workspace\ComfyUI\MIKAGE_CANON\08_CHARACTER_REVIEW_CANDIDATES\MIKAGE_HELMET_FRONT_VIEW_3D_SOURCE_V1_ASSET_LOCK.md` |
| Allowed use | Helmet front geometry anchor; IP-Adapter PRIMARY conditioning (weight 0.7–0.9); ControlNet canny source; img2img base for bust bridge generation |
| Forbidden use | New asset lock derived from this alone; production render input; film plate |
| Can be used as source | YES — conditioning and img2img base for approved workflows |
| Can be used for public material | NO |
| Can be used for cinematic production | NO |

### A-03 Helmet Side (Volume First) 3D Source V1 (Ortho)

| Field | Value |
|---|---|
| Asset name | MIKAGE_VOLUME_FIRST_3D_HELMET_SIDE_V1_ORTHO |
| Path | `D:\workspace\ComfyUI\MIKAGE_CANON\08_CHARACTER_REVIEW_CANDIDATES\MIKAGE_VOLUME_FIRST_3D_HELMET_SIDE_V1_ORTHO.png` |
| Status | **LOCKED_CANON** |
| Evidence / report | `D:\workspace\ComfyUI\MIKAGE_CANON\08_CHARACTER_REVIEW_CANDIDATES\MIKAGE_VOLUME_FIRST_3D_HELMET_SIDE_V1_ASSET_LOCK.md` |
| Allowed use | Helmet side silhouette / volume anchor; IP-Adapter PRIMARY conditioning (weight 0.5–0.7) |
| Forbidden use | Full-character claim; production render input; film plate |
| Can be used as source | YES — conditioning only |
| Can be used for public material | NO |
| Can be used for cinematic production | NO |

### A-04 Zenith Blade V2

| Field | Value |
|---|---|
| Asset name | MIKAGE_ZENITH_BLADE_V2_POLISH_ONE_SHOT |
| Path | `D:\workspace\ComfyUI\MIKAGE_CANON\08_CHARACTER_REVIEW_CANDIDATES\MIKAGE_ZENITH_BLADE_V2_POLISH_ONE_SHOT_00001_.png` |
| Status | **LOCKED_CANON** |
| Evidence / report | `docs/handoff/MIKAGE_PHASE4_STACK_MANIFEST_V2.md` Section 4 |
| Allowed use | Blade identity anchor; comparison reference if blade appears in frame |
| Forbidden use | Replacement by new candidate without separate review; render input by itself |
| Can be used as source | YES — identity check only |
| Can be used for public material | NO |
| Can be used for cinematic production | NO |

---

## Section B — Phase 4 Included References (TEMP_REFERENCE)

### B-01 Helmet Faceplate Clean Pass

| Field | Value |
|---|---|
| Asset name | MIKAGE_COMP_01A_HELMET_FACEPLATE_CLEAN_PASS |
| Path | `D:\workspace\ComfyUI\MIKAGE_CANON\10_COMPONENT_CANDIDATE_SET_V1\01_HELMET_FACEPLATE\MIKAGE_COMP_01A_HELMET_FACEPLATE_CLEAN_PASS.png` |
| Status | **TEMP_REFERENCE** |
| Evidence / report | `docs/handoff/MIKAGE_PHASE4_COMPONENT_GATE_DECISIONS_V1.md` |
| Allowed use | Faceless clean helmet / faceplate geometry reference; IP-Adapter SECONDARY conditioning (weight 0.5–0.7) |
| Forbidden use | Canon approval; asset lock; production-ready claim; render input |
| Can be used as source | YES — Phase 4 workflow conditioning only |
| Can be used for public material | NO |
| Can be used for cinematic production | NO |

### B-02 Sensor Slit Faceplate Pass

| Field | Value |
|---|---|
| Asset name | MIKAGE_COMP_02B_SENSOR_SLIT_CLOSEUP_PASS |
| Path | `D:\workspace\ComfyUI\MIKAGE_CANON\10_COMPONENT_CANDIDATE_SET_V1\02_SENSOR_SLIT_FACEPLATE\MIKAGE_COMP_02B_SENSOR_SLIT_CLOSEUP_PASS.png` |
| Status | **TEMP_REFERENCE** |
| Evidence / report | `docs/handoff/MIKAGE_PHASE4_COMPONENT_GATE_DECISIONS_V1.md` |
| Allowed use | Strict faceless sensor-slit closeup reference |
| Forbidden use | Eye / facial-expression source; canon approval; asset lock; production-ready claim |
| Can be used as source | YES — reference only |
| Can be used for public material | NO |
| Can be used for cinematic production | NO |

### B-03 B4C Porcelain Panel Gap Pass

| Field | Value |
|---|---|
| Asset name | MIKAGE_COMP_03A_B4C_PORCELAIN_PANEL_GAP_PASS |
| Path | `D:\workspace\ComfyUI\MIKAGE_CANON\10_COMPONENT_CANDIDATE_SET_V1\03_B4C_PORCELAIN_MATERIAL\MIKAGE_COMP_03A_B4C_PORCELAIN_PANEL_GAP_PASS.png` |
| Status | **TEMP_REFERENCE** |
| Evidence / report | `docs/handoff/MIKAGE_PHASE4_COMPONENT_GATE_DECISIONS_V1.md` |
| Allowed use | Matte B4C porcelain armor plate / panel gap material reference; IP-Adapter SECONDARY conditioning (weight 0.4–0.6) |
| Forbidden use | Final material approval; asset lock; production-ready material; render input |
| Can be used as source | YES — Phase 4 workflow conditioning only |
| Can be used for public material | NO |
| Can be used for cinematic production | NO |

### B-04 Graphene Underlayer Hex Gap Pass

| Field | Value |
|---|---|
| Asset name | MIKAGE_COMP_04A_GRAPHENE_UNDERLAYER_HEX_GAP_PASS |
| Path | `D:\workspace\ComfyUI\MIKAGE_CANON\10_COMPONENT_CANDIDATE_SET_V1\04_GRAPHENE_UNDERLAYER\MIKAGE_COMP_04A_GRAPHENE_UNDERLAYER_HEX_GAP_PASS.png` |
| Status | **TEMP_REFERENCE** |
| Evidence / report | `docs/handoff/MIKAGE_PHASE4_COMPONENT_GATE_DECISIONS_V1.md` |
| Allowed use | Black graphene underlayer reference (visible only through armor gaps); IP-Adapter SECONDARY conditioning (weight 0.3–0.5) |
| Forbidden use | Final material approval; asset lock; production-ready material; render input |
| Can be used as source | YES — Phase 4 workflow conditioning only |
| Can be used for public material | NO |
| Can be used for cinematic production | NO |

### B-05 Zenith Blade Comparison Candidate

| Field | Value |
|---|---|
| Asset name | MIKAGE_COMP_07B_ZENITH_BLADE_CLEAN_MONOLITH_REVIEW_CANDIDATE |
| Path | `D:\workspace\ComfyUI\MIKAGE_CANON\10_COMPONENT_CANDIDATE_SET_V1\07_ZENITH_BLADE\MIKAGE_COMP_07B_ZENITH_BLADE_CLEAN_MONOLITH_REVIEW_CANDIDATE.png` |
| Status | **TEMP_REFERENCE** |
| Evidence / report | `docs/handoff/MIKAGE_PHASE4_COMPONENT_GATE_DECISIONS_V1.md` |
| Allowed use | Comparison reference against locked Zenith blade V2 only |
| Forbidden use | Replacing locked blade; canon approval; asset lock; production-ready prop |
| Can be used as source | YES — comparison only |
| Can be used for public material | NO |
| Can be used for cinematic production | NO |

---

## Section C — Held Candidates (TEMP_REFERENCE — EXCLUDED FROM STACK)

### C-01 Hair + Mask Portrait (05B) — HOLD

| Field | Value |
|---|---|
| Asset name | MIKAGE_COMP_05B_HAIR_MASK_PORTRAIT_REVIEW_CANDIDATE |
| Path | `D:\workspace\ComfyUI\MIKAGE_CANON\10_COMPONENT_CANDIDATE_SET_V1\05_HAIR_MASK_PORTRAIT\MIKAGE_COMP_05B_HAIR_MASK_PORTRAIT_REVIEW_CANDIDATE.png` |
| Status | **TEMP_REFERENCE** (HOLD — excluded from active stack) |
| Evidence / report | `docs/handoff/MIKAGE_PHASE4_HELD_CANDIDATE_DECISION_RECORD_V1.md` |
| Allowed use | Held for future review cycle only |
| Forbidden use | Production character asset; canon approval; face reveal; film plate; Phase 5 source; hair/mask cues in bust bridge candidate |
| Can be used as source | NO — excluded until PASS decision in a future review |
| Can be used for public material | NO |
| Can be used for cinematic production | NO |

### C-02 Halo / Orbital UI (06C) — HOLD

| Field | Value |
|---|---|
| Asset name | MIKAGE_COMP_06C_ORBITAL_UI_LOW_CLUTTER_REVIEW_CANDIDATE |
| Path | `D:\workspace\ComfyUI\MIKAGE_CANON\10_COMPONENT_CANDIDATE_SET_V1\06_HALO_ORBITAL_UI\MIKAGE_COMP_06C_ORBITAL_UI_LOW_CLUTTER_REVIEW_CANDIDATE.png` |
| Status | **TEMP_REFERENCE** (HOLD — excluded from active stack) |
| Evidence / report | `docs/handoff/MIKAGE_PHASE4_HELD_CANDIDATE_DECISION_RECORD_V1.md` |
| Allowed use | Held for future review after core character stack is settled |
| Forbidden use | Final UI lock; shot/event plate; render input; production-ready system asset; halo/orbital UI in bust bridge candidate |
| Can be used as source | NO — excluded until PASS decision |
| Can be used for public material | NO |
| Can be used for cinematic production | NO |

---

## Section D — Rejected / Excluded (FAILED_DO_NOT_USE)

### D-01 Helmet Bust Alt (08B) — REJECT

| Field | Value |
|---|---|
| Asset name | MIKAGE_COMP_08B_HELMET_BUST_NEGATIVE_SPACE_ALT_PASS_TECHNICAL |
| Path | `D:\workspace\ComfyUI\MIKAGE_CANON\10_COMPONENT_CANDIDATE_SET_V1\08_HELMET_BUST_ALT\MIKAGE_COMP_08B_HELMET_BUST_NEGATIVE_SPACE_ALT_PASS_TECHNICAL.png` |
| Status | **FAILED_DO_NOT_USE** |
| Evidence / report | `docs/handoff/MIKAGE_PHASE4_HELD_CANDIDATE_DECISION_RECORD_V1.md` — human REJECT in ASSET-RESET-12 |
| Allowed use | NONE |
| Forbidden use | All use; especially positive IP-Adapter conditioning; bust bridge source; stack entry |
| Can be used as source | NO |
| Can be used for public material | NO |
| Can be used for cinematic production | NO |

### D-02 Full-Body Candidate 001 — REJECT

| Field | Value |
|---|---|
| Asset name | Full-body candidate 001 (any variant) |
| Path | See `docs/handoff/MIKAGE_PHASE4_COMPONENT_GATE_DECISIONS_V1.md` |
| Status | **FAILED_DO_NOT_USE** |
| Evidence / report | `docs/handoff/MIKAGE_PHASE4_COMPONENT_GATE_DECISIONS_V1.md` |
| Allowed use | NONE |
| Forbidden use | All use |
| Can be used as source | NO |
| Can be used for public material | NO |
| Can be used for cinematic production | NO |

### D-03 Controlled Front Canon Repair V1 — FAIL

| Field | Value |
|---|---|
| Asset name | Controlled front canon repair V1 |
| Path | See `docs/handoff/MIKAGE_PHASE4_COMPONENT_GATE_DECISIONS_V1.md` |
| Status | **FAILED_DO_NOT_USE** |
| Evidence / report | Prior evidence in handoff chain |
| Allowed use | NONE |
| Forbidden use | All use |
| Can be used as source | NO |
| Can be used for public material | NO |
| Can be used for cinematic production | NO |

### D-04 Wrong ComfyUI Browser Run (test_minimal_00001_, 512×512)

| Field | Value |
|---|---|
| Asset name | test_minimal_00001_ (and any sibling outputs from same session) |
| Path | `D:\workspace\ComfyUI\output\test_minimal_00001_.png` (or similar) |
| Status | **FAILED_DO_NOT_USE** |
| Evidence / report | User report 2026-05-12: output filename `test_minimal_00001_`, 512×512 resolution — does not match ASSET-BUILD-05 packet (expected `MIKAGE_BUST_BRIDGE_CAND_01_REVIEW_CANDIDATE_20260512`, 768×1024, output to `11_BUST_BRIDGE_CANDIDATES_V1\`) |
| Allowed use | NONE — wrong run, unverified, non-compliant filename, wrong resolution, wrong output directory |
| Forbidden use | All use; must not be reviewed as a bust bridge candidate; must not be used as IP-Adapter source or img2img base |
| Can be used as source | NO |
| Can be used for public material | NO |
| Can be used for cinematic production | NO |

### D-05 ASSET-BUILD-03 Outputs (green/grass drift, wrong subject)

| Field | Value |
|---|---|
| Asset name | All outputs from ASSET-BUILD-03 generation attempt |
| Path | `D:\workspace\ComfyUI\MIKAGE_CANON\11_BUST_BRIDGE_CANDIDATES_V1\` (from ASSET-BUILD-03 run) |
| Status | **FAILED_DO_NOT_USE** |
| Evidence / report | `docs/handoff/ASSET-BUILD-03_BUST_BRIDGE_CANDIDATE_GENERATION_FAIL_REPORT_V1.md` |
| Allowed use | NONE |
| Forbidden use | All use; must not be used as img2img source or candidate for review |
| Can be used as source | NO |
| Can be used for public material | NO |
| Can be used for cinematic production | NO |

---

## Section E — Missing Required Slots (MISSING_REQUIRED)

### E-01 Bust / Upper-Body Bridge Asset

| Field | Value |
|---|---|
| Asset name | MIKAGE_BUST_BRIDGE (slot — no asset yet) |
| Path | `D:\workspace\ComfyUI\MIKAGE_CANON\11_BUST_BRIDGE_CANDIDATES_V1\` (target) |
| Status | **MISSING_REQUIRED** |
| Evidence / report | `docs/handoff/MIKAGE_BUST_UPPER_BODY_BRIDGE_ASSET_REQUEST_SPEC_V1.md` |
| Allowed use | N/A — slot unfilled |
| Forbidden use | All downstream use until a candidate passes formal evaluation |
| Can be used as source | NO |
| Can be used for public material | NO |
| Can be used for cinematic production | NO |
| Blocking | Phase 5 cannot begin until this slot is filled with an accepted candidate |
| Next action | Run ASSET-BUILD-05 with `MIKAGE_BUST_BRIDGE_EXECUTE_V2.py` (SUBMIT=True) |

---

## Section F — Deprecated

### F-01 Phase 4 Stack Manifest V1

| Field | Value |
|---|---|
| Asset name | MIKAGE_PHASE4_STACK_MANIFEST_V1 |
| Path | `docs/handoff/MIKAGE_PHASE4_STACK_MANIFEST_V1.md` |
| Status | **DEPRECATED** |
| Evidence / report | `docs/handoff/MIKAGE_PHASE4_STACK_MANIFEST_V2.md` Section 2 |
| Allowed use | Historical reference only |
| Forbidden use | Active production decisions |
| Can be used as source | NO |

### F-02 Bust Bridge Execute Script V1

| Field | Value |
|---|---|
| Asset name | MIKAGE_BUST_BRIDGE_EXECUTE.py (V1) |
| Path | `D:\workspace\ComfyUI\MIKAGE_BUST_BRIDGE_EXECUTE.py` |
| Status | **DEPRECATED** |
| Evidence / report | `docs/handoff/ASSET-BUILD-04_REPAIR_BUST_BRIDGE_GENERATION_WORKFLOW_NO_RENDER_V1.md` |
| Allowed use | Historical reference only |
| Forbidden use | All execution; superseded by V2 |
| Can be used as source | NO |

---

## Section G — Production Actor 3D Blockout Lock (LOCKED_REGISTERED)

### G-01 Production Actor V0.2 from Anchor V1 — LOCKED_REGISTERED

| Field | Value |
|---|---|
| Asset name | `MIKAGE_PRODUCTION_ACTOR_FROM_ANCHOR_V1_V0_2` |
| Asset type | `PRODUCTION_ACTOR_3D_BLOCKOUT_LOCK` |
| Path | `production/character/production_actor/MIKAGE_PRODUCTION_ACTOR_FROM_ANCHOR_V1_V0_2.blend` |
| Notes | `production/character/production_actor/MIKAGE_PRODUCTION_ACTOR_FROM_ANCHOR_V1_V0_2_NOTES.md` |
| Build report | `report