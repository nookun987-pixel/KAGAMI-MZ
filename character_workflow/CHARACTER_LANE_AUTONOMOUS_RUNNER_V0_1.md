# CHARACTER_LANE_AUTONOMOUS_RUNNER_V0_1

Status: ACTIVE_CONTRACT
Created: 2026-05-29
Version: V0.1
Lane: CHARACTER_CAST_LANE
Authority: READ-ONLY default. Mutation only when the runner sees `OPERATOR_APPROVED = YES` in a decision board it just read.
Asset lock: NO
Canon lock: NO

---

## 0. WHY THIS FILE EXISTS

Stop requiring the operator to copy/paste every small task. The runner reads the latest character_workflow reports and decides the next safe action automatically — within hard limits that match `CLAUDE.md`.

The runner is NOT an autonomous designer. It is a deterministic safety wrapper that picks the next safe text-only action from a finite list, or produces a decision board when input is needed.

---

## 1. AUTHORITY (what the runner may do, what it must NOT do)

The runner MAY:
- Read any of the files listed in §2 in the order given.
- Read any other file referenced by those files (read-only).
- Run filename / content grep across the 8 mounted Mikage folders (read-only).
- Create exactly ONE new report file per run, in `character_workflow/`, with a versioned name (V0_1, V0_2, ...).
- Update its own pointer line at the bottom of this runner file with `LATEST_RUN_OUTPUT = <relative-path>` — this is a single-line edit, no other edits to this file allowed during run.

The runner MUST NOT (unless an operator decision says `OPERATOR_APPROVED = YES` in the latest decision board the runner just read):
- Edit `MIKAGE_ZENITH_CANON_V2.md`, `MIKAGE_WORLD_CORE.json`, or anything in `mikage_full_body_canon_v1/01_CANON_LOCK/`.
- Edit any brief, visual spec, or entity record.
- Edit `CHARACTER_PACKAGE_REGISTRY_2026-05-23.md`.
- Edit, move, rename, copy, or delete any asset, image, ZIP, JSON, audio, video, or 3D file.
- Open / extract any ZIP.
- Open / decode / render / re-render any PNG, JPG, WAV, MP3, MP4.
- Create `commander_lyre.json` or any other `*.json` referenced by canon but missing on disk.
- Cross-link the LORA character to `THE ROOT ARCHITECT` track.
- Approve canon. Approve asset. Lock anything.
- Render. Batch generate. Touch ComfyUI / Blender / external GPU.
- `git commit` or `git push`.
- Touch lanes other than CHARACTER_CAST_LANE.

If a desired action would require any of the above, the runner STOPS and writes a `BLOCKED_BY_OPERATOR_DECISION` report (see §5).

---

## 2. READ ORDER (every run starts here)

The runner reads, in this order, and only the latest version of each:

1. `character_workflow/CHARACTER_BRIEF_FIELD_GAP_V0_1.md`
2. `character_workflow/CHARACTER_LYRE_LORA_IMAGE_CROSS_REPO_GREP_V0_1.md`
3. `character_workflow/CHARACTER_PACKAGE_REGISTRY_2026-05-23.md`
4. `character_workflow/COMMANDER_LYRE_CHARACTER_BRIEF_V0_1.md`
5. `character_workflow/COMMANDER_LYRE_VISUAL_SPEC_CLEAN_V0_1.md`
6. `character_workflow/LORA_VISUAL_BRIEF_V0_1.md`
7. `character_workflow/LORA_VISUAL_SPEC_CLEAN_V0_1.md`
8. `MIKAGE_ZENITH_CANON_V2.md`
9. `CLAUDE.md`

If any file is missing, the runner notes it in its run output as CHUA_XAC_NHAN and continues. The runner does NOT recreate missing files.

In addition, the runner ALWAYS reads the most recent file matching:
- `character_workflow/CHARACTER_OPERATOR_DECISION_BOARD_V*.md`
- `character_workflow/CHARACTER_LANE_RUNNER_REPORT_V*.md`

…to know which decisions the operator has already answered.

---

## 3. DECISION TREE

Run order each invocation:

```
1. Read all files in §2.
2. Read latest CHARACTER_OPERATOR_DECISION_BOARD_V*.md if any.
3. Classify the current lane state into one of:
   - STATE_READ_ONLY_NEXT          → §3.A
   - STATE_NEEDS_OPERATOR_DECISION → §3.B
   - STATE_BLOCKED                 → §3.C
4. Emit exactly one output file accordingly.
5. Update LATEST_RUN_OUTPUT pointer in this runner file (single line).
6. Stop.
```

### 3.A — STATE_READ_ONLY_NEXT

Triggered when the latest report says `NEXT_SAFE_TASK = <something read-only>` AND there are no unresolved operator decisions.

Allowed read-only actions the runner may pick from (deterministic priority):

| Priority | Action | Output filename |
|---|---|---|
| 1 | Re-grep cross-repo for newly added Lyre / LORA assets if last grep is > 7 days old | `CHARACTER_LYRE_LORA_IMAGE_CROSS_REPO_GREP_V0_<n+1>.md` |
| 2 | Audit cross-link between Mikage Bible vs Canon V2 §8.2 vs character_workflow/ — text-only | `CHARACTER_MIKAGE_CROSS_DOC_AUDIT_V0_<n+1>.md` |
| 3 | Audit `mikage_full_body_canon_v1/99_AUDIT/MIKAGE_CHARACTER_CANON_SYNC_FILE_MANIFEST_V1.json` vs disk (read-only) | `CHARACTER_CANON_MANIFEST_VS_DISK_AUDIT_V0_<n+1>.md` |
| 4 | Audit `CHARACTER_PACKAGE_REGISTRY` vs `character_workflow/packages/` directory | `CHARACTER_PACKAGE_REGISTRY_VS_DISK_AUDIT_V0_<n+1>.md` |
| 5 | Read-only field gap re-audit for any new brief file | `CHARACTER_BRIEF_FIELD_GAP_V0_<n+1>.md` |

The runner picks the highest-priority action whose output file does NOT already exist for the current week.

### 3.B — STATE_NEEDS_OPERATOR_DECISION

Triggered when any unresolved decision item exists in the latest decision board, OR when a known unresolved blocker is recorded in any §2 file (e.g., LORA `ANTHROPOMORPHIC_FORM = CHUA_XAC_NHAN`).

The runner writes exactly one file:
`CHARACTER_OPERATOR_DECISION_BOARD_V0_<n+1>.md`

This board:
- Lists each unresolved decision with: question, sources, options, runner's `RECOMMENDED_BY_DEFAULT` (always the most conservative option), and blocker impact.
- Asks ONE consolidated question at the end.
- Does NOT edit any source file.

### 3.C — STATE_BLOCKED

Triggered when a task in the most recent decision board has `OPERATOR_APPROVED = YES` but executing it would still require violating §1 (e.g., operator approved render but render is forbidden by `CLAUDE.md` lane rules).

The runner writes:
`CHARACTER_LANE_BLOCKED_BY_OPERATOR_DECISION_V0_<n+1>.md`

This file:
- Names the conflicting rule.
- Quotes the exact line from `CLAUDE.md` that blocks.
- Suggests text-only alternatives (no new strategy).
- Stops.

---

## 4. HARD RULES (mirror of operator directive)

1. If latest report says `NEXT_SAFE_TASK` is read-only → execute that read-only audit and create exactly 1 report.
2. If latest report says operator decision required → do NOT ask for a new task. Create exactly 1 decision board.
3. If a task would require editing canon, registry, brief, package, ZIP, PNG, JSON, render, or asset movement → STOP and create a `BLOCKED_BY_OPERATOR_DECISION` report.
4. Never open ZIP unless operator explicitly says `OPEN ZIP`.
5. Never import/copy PNG unless operator explicitly says `IMPORT PNG`.
6. Never render character image unless operator explicitly says `RENDER`.
7. Never create `commander_lyre.json` until Lyre visual direction is locked.
8. Never cross-link LORA with `THE ROOT ARCHITECT` track until operator confirms name collision is intentional.
9. Anything not directly verified must be marked `CHUA_XAC_NHAN`.
10. Do not commit or push unless operator explicitly says `COMMIT`.

---

## 5. OPERATOR APPROVAL TOKENS (case-sensitive)

The runner recognises ONLY these tokens, in the latest decision board or in a runner-targeted instruction:

| Token | What it unlocks |
|---|---|
| `OPERATOR_APPROVED = YES` (alongside a specific decision ID) | Allows the runner to write the change described in that decision item — and only that one. |
| `OPEN ZIP <full-path>` | Allows the runner to extract one named ZIP, read manifest only, then leave files in place. |
| `IMPORT PNG <full-path> TO <relative-target>` | Allows the runner to copy one named PNG into character_workflow with a versioned name. |
| `RENDER <character> <prompt-id>` | (Currently blocked by `CLAUDE.md` hard rule — runner will refuse and write a BLOCKED report.) |
| `COMMIT <commit-message>` | Allows the runner to stage runner-produced files and commit. Push still requires `PUSH = YES` on the same line. |

Unknown tokens are ignored. Partial / lower-case / paraphrased forms are ignored. Approval applies only to the single decision item it is attached to.

---

## 6. CURRENTLY KNOWN STATE (2026-05-29 snapshot)

| Item | State | Source |
|---|---|---|
| Task A (field-gap audit) | PASS | `CHARACTER_BRIEF_FIELD_GAP_V0_1.md` exists, 15,556 B |
| Task B (cross-repo grep) | PASS | `CHARACTER_LYRE_LORA_IMAGE_CROSS_REPO_GREP_V0_1.md` exists, 24,622 B |
| Lyre visual direction | DRIFT (May 28 spec vs May 23 handoff) | grep report §10 |
| Lyre PNG candidate (AUDIO/COMPANNY LIMITED/02. COMMANDER LYRE/) | CHUA_XAC_NHAN | grep report §3 row 1 |
| LORA `ANTHROPOMORPHIC_FORM` | CHUA_XAC_NHAN | brief §8 + spec §3 |
| LORA `FACTION` | CHUA_XAC_NHAN | brief §1 + spec §1 |
| THE ROOT ARCHITECT name collision | CHUA_XAC_NHAN | grep report §9 |
| Registry ZIP mismatch (5 ZIP đăng ký, 0 trên đĩa) | CONFIRMED | grep report §6 + §7 |
| `commander_lyre.json` reference vs disk | CONFIRMED MISSING | grep report §7 |
| `character_workflow/packages/` | EXISTS, EMPTY | grep report §6 |
| Lane (per `CLAUDE.md`) | `CHARACTER_CAST_LANE` ACTIVE; priority Lyre → LORA → supporting cast | `CLAUDE.md` |

→ Classification this run: **STATE_NEEDS_OPERATOR_DECISION**

→ Immediate output this run: `CHARACTER_OPERATOR_DECISION_BOARD_V0_1.md`

---

## 7. RUN LOG

| Run | Date | State | Output | Notes |
|---|---|---|---|---|
| 1 | 2026-05-29 | STATE_NEEDS_OPERATOR_DECISION | `CHARACTER_OPERATOR_DECISION_BOARD_V0_1.md` | First runner activation. 7 unresolved decisions. |
| 2 | 2026-05-29 | STATE_NEEDS_OPERATOR_DECISION | `CHARACTER_OPERATOR_DECISION_BOARD_V0_2.md` | Operator answered Q1=1 in V0_1. Focused board on Decision 1 (Lyre direction drift) with side-by-side evidence from May 23 handoff. |
| 3 | 2026-05-29 | OPERATOR_APPROVED_MUTATION (text-only record) | `CHARACTER_LYRE_DIRECTION_LOCK_2026-05-29_A_REPORT.md` | Operator answered DECISION_1_OPTION=1A with OPERATOR_APPROVED=YES in V0_2. Lock report records May 28 Porcelain Minimalism direction; annotates May 23 handoff as SUPERSEDED (no source edits). 6 decisions remain. |
| 4 | 2026-05-29 | STATE_NEEDS_OPERATOR_DECISION | `CHARACTER_OPERATOR_DECISION_BOARD_V0_3.md` | Operator answered Q_NEXT=3 in Lyre lock report. Focused board on Decision 3 (LORA anthropomorphic form) with verbatim evidence from 5 LORA sources. |
| 5 | 2026-05-29 | OPERATOR_APPROVED_MUTATION (text-only record) | `CHARACTER_LORA_FORM_LOCK_2026-05-29_A_REPORT.md` | Operator answered DECISION_3_OPTION=3A with OPERATOR_APPROVED=YES in V0_3. Lock report records SYSTEM_PRESENCE_ONLY rule as permanent; annotates the soft caveat across 7 source clauses as CLOSED (no source edits). 5 decisions remain. |
| 6 | 2026-05-29 | STATE_NEEDS_OPERATOR_DECISION | `CHARACTER_OPERATOR_DECISION_BOARD_V0_4.md` | Operator answered Q_NEXT=4 in LORA form lock. Focused board on Decision 4 (LORA faction). New: read Canon V2 §7.1 (Three Ideologies LOCKED) + §8 (Entity System LOCKED). Surfaced new option 4F (META_SUBSTRATE_BELOW). Recommended 4E if conservative, 4A/4D/4F if locking. |
| 7 | 2026-05-29 | OPERATOR_APPROVED_MUTATION (text-only record) | `CHARACTER_LORA_FACTION_LOCK_2026-05-29_F_REPORT.md` | Operator answered DECISION_4_OPTION=4F with OPERATOR_APPROVED=YES in V0_4. Lock report records META_SUBSTRATE_BELOW; resolves CHUA_XAC_NHAN faction fields across 4 LORA source clauses (no source edits). Creates known canon V2 §7 update task (deferred). 4 decisions remain. |
| 8 | 2026-05-29 | STATE_NEEDS_OPERATOR_DECISION | `CHARACTER_OPERATOR_DECISION_BOARD_V0_5.md` | Operator answered Q_NEXT=7 in LORA faction lock. Focused board on Decision 7. New: read Canon V2 §15 directory layout — found ENTITIES/ folder + 4 entity JSONs are entirely aspirational; only workspace/ComfyUI mikage_zenith.json exists. Expanded options to 7A_MIN / 7A_PAIR / 7A_FULL / 7D_DRAFT_ONLY. |
| 9 | 2026-05-29 | OPERATOR_APPROVED_MUTATION (text-only record + 2 draft JSONs) | `CHARACTER_ENTITY_JSON_DRAFT_2026-05-29_7A_PAIR_REPORT.md` + `proposals/commander_lyre.json` + `proposals/lora.json` | Operator answered DECISION_7_OPTION=7A_PAIR with OPERATOR_APPROVED=YES in V0_5. Drafted 2 entity JSONs with $source traceability into new `character_workflow/proposals/` folder. D7 soft-resolved (canonical placement still pending). 3 decisions remain. |
| 10 | 2026-05-29 | AUDIT_WORKSPACE (read-only) | `CHARACTER_WORKSPACE_MIKAGE_ZENITH_JSON_AUDIT_V0_1.md` | Operator Q_NEXT=AUDIT_WORKSPACE. Read workspace ComfyUI mikage_zenith.json (1,472 B, 7 keys, valid JSON). Determined it is a VALIDATOR RUBRIC (weights/thresholds/calibration), NOT an entity record — complementary not equivalent. Flagged 3 drift items vs Mikage Bible (slit count, fox motif, fox-ears forbidden). Surfaced new options MIKAGE_JSON / DRIFT_FIX / VERIFY_CAL. |
| 11 | 2026-05-29 | OPERATOR_APPROVED_MUTATION (text-only record + 1 draft JSON) | `CHARACTER_MIKAGE_JSON_DRAFT_2026-05-29_REPORT.md` + `proposals/mikage_zenith.json` | Operator Q_NEXT=MIKAGE_JSON. Drafted `proposals/mikage_zenith.json` from Canon V2 §1+§2+§3+§7.1+§8.1+§9+§10+§11 + Bible + Reference Sheet (CANON_LOCKED, NOT opened ZIP). New schema keys: `$companion_records`, `drift_items_known_not_fixed_this_pass`. Production prompt seed marked MISSING (operator forbade drift fix). 3-entity drafted set complete. |
| 12 | 2026-05-29 | OPERATOR_APPROVED_MUTATION (text-only record + 2 draft JSONs) | `CHARACTER_WEAPONS_JSON_DRAFT_2026-05-29_REPORT.md` + `proposals/zenith_blade.json` + `proposals/unbreakable_shield.json` | Operator Q_NEXT=WEAPONS. Drafted 2 weapon JSONs from Canon V2 §2.4 + §8.2 + §11 item 4 + §15 + Lyre brief/spec. New schema keys: `$entity_kind`, `$interpretive_tension`. WEAPON_DRIFT_001_SHIELD_PHYSICALITY recorded but NOT resolved. Canon V2 §15 entity list fully drafted. |
| 13 | 2026-05-29 | PROMOTE_PLAN (text-only) | `CHARACTER_ENTITY_JSON_PROMOTION_PLAN_V0_1.md` | Operator Q_NEXT=PROMOTE with all "do not" constraints. Drafted 13-section promotion plan: preconditions (P1–P10, 4 unmet), 6-step execution sequence, required approval token bundle, rollback plan, side effects, recommended sequencing per §9 (resolve D6 → CANON → DRIFT_FIX → BACKFILL → EXECUTE_PROMOTE). No moves, copies, folder creation, status changes, locks, commits. |
| 14 | 2026-05-29 | STATE_NEEDS_OPERATOR_DECISION | `CHARACTER_OPERATOR_DECISION_BOARD_V0_6.md` | Operator Q_NEXT=6. Focused board on Decision 6 (registry ZIP mismatch). Surfaced May 23 handoff §5 7-ZIP list (2 unregistered ZIPs exist in AUDIO Downloads). Critical new finding: locks 1A/3A/4F SUPERSEDE most ZIP content — recovery yields mostly redundant data. Added options 6E (acknowledge superseded) and 6F (registry rewrite V0_2). |
| 15 | 2026-05-29 | OUT_OF_LANE_INTEGRATION (operator-authorized one-off) | `design_system/AUDIT_REPORT_2026-05-29.md` + `design_system/` folder (40 files copied from operator-uploaded ZIP) | Operator directed Design System ZIP audit + integration. Lane stays CHARACTER_CAST_LANE; integration is one-off, not a lane change. All 6 operator-required audit checks PASS. design_system/ at repo root. No redesign, no visual direction change. Commit blocked: git worktree unreachable from sandbox — operator must commit manually. |
| 16 | 2026-05-29 | OPERATOR_APPROVED_MUTATION (text-only — new files only, V0.1 untouched) | `CHARACTER_PACKAGE_REGISTRY_V0_2_2026-05-29.md` + `CHARACTER_REGISTRY_REWRITE_2026-05-29_F_REPORT.md` | Operator DECISION_6_OPTION=6F with OPERATOR_APPROVED=YES in V0_6. Created V0.2 registry as new file capturing post-lock truth: 5 V0.1 entries individually superseded with pointers to lock reports + current source-of-truth files; 3 unregistered AUDIO ZIPs documented for provenance; 5 entity drafts + 3 locks + design_system + 5 drift items + pending canon tasks all recorded. D6 SOFT-RESOLVED via rewrite. 2 decisions remain (D2, D5). |
| 17 | 2026-05-29 | CANON_PATCH_PROPOSAL (text-only proposal; canon V2 unchanged) | `CHARACTER_CANON_V2_LORA_SUBSTRATE_PATCH_PROPOSAL_V0_1.md` | Operator Q_NEXT=CANON. Drafted §7.0 LORA substrate patch proposal with 2 levels: LEVEL_A minimal (+10 lines, §7.0 only) or LEVEL_B full (+28 lines across 5 insertions in §7.0/§8.2/§8.6/§11/§15). Approval token bundle defined. Diff-file gate before any canon byte change. Canon V2 mtime unchanged at this pass. |
| 18 | 2026-05-29 | CANON_PATCH_DIFF (HALT — canon V2 unchanged) | `CHARACTER_CANON_V2_LORA_SUBSTRATE_PATCH_DIFF_V0_1.md` | Operator CANON_PATCH_OPTION=LEVEL_B with OPERATOR_APPROVED=YES. Pre-flight confirmed §7.1=343, §8.2=401, §8.5 ends 429, §15 ENTITIES=585-589. CONFLICT FOUND in §11: header reads "(10 Required Details)" + item 10 already exists ("Mechanical tick"). Diff file surfaces sub-decisions for Change 4 (4-OPT-X/Y/Z) and Change 5 (5-OPT-P/Q/R). Runner-recommended path: 1+2+3+4-OPT-X+5-OPT-Q = +27 lines pure addition. HALTED for second-gate approval. |
| 19 | 2026-05-29 | CANON_PATCH_APPLIED (4 surgical edits to canon V2) | `MIKAGE_ZENITH_CANON_V2.md` updated in-place | Operator DIFF_APPROVED=YES, CHANGE_4=4-OPT-X (skip), CHANGE_5=5-OPT-Q (after Lyre), BUMP_LAST_VERIFIED=NO. Applied Change 1 (§7.0 at line 343), Change 2 (§8.2 substrate alignment at line 415), Change 3 (§8.6 LORA at line 442), Change 5-OPT-Q (lora.json at line 614). §11 micro-moment list unchanged. §16 Last Verified stays at 2026-03-19. Net +27 lines, no deletions. Post-flight verified all 4 insertions at expected positions; END OF CANON at line 643. Sandbox bash stat shows stale cached size (18495) but Read tool confirms new content. |
| 20 | 2026-05-29 | PHASE_CLOSEOUT (STOP — operator paused) | `CHARACTER_LANE_PHASE_CLOSEOUT_2026-05-29.md` | 19-run summary + canonical state inventory + 5 unresolved items + 5 deferred drift items + operator action items (commit-everything + choose next Q_NEXT) + invariants check + resume greeting. State preserved for resume. |

---

## 8. POINTER

```text
LATEST_RUN_OUTPUT = character_workflow/CHARACTER_LANE_PHASE_CLOSEOUT_2026-05-29.md
LATEST_RUN_DATE   = 2026-05-29
LATEST_RUN_STATE  = PHASE_PAUSED — operator paused; resume any time with Q_NEXT
NEXT_INVOCATION_PRECONDITION = operator issues Q_NEXT (CANON_FOLLOWUP / EXECUTE_PROMOTE / 2 / 5 / DRIFT_FIX / MORE_ENTITIES recommended) OR a fresh directive
ACTIVE_REGISTRY       = character_workflow/CHARACTER_PACKAGE_REGISTRY_V0_2_2026-05-29.md (V0.2)
HISTORICAL_REGISTRY   = character_workflow/CHARACTER_PACKAGE_REGISTRY_2026-05-23.md (V0.1)
LYRE_DIRECTION_LOCKED = OPTION_1A_PORCELAIN_MINIMALISM_2026-05-29
LORA_FORM_LOCKED      = OPTION_3A_SYSTEM_PRESENCE_ONLY_2026-05-29
LORA_FACTION_LOCKED   = OPTION_4F_META_SUBSTRATE_BELOW_2026-05-29
REGISTRY_STATE        = LOCKED to V0.2
CANON_V2_UPDATE_TASKS = LORA_SUBSTRATE_§7_PATCH (APPLIED 2026-05-29 — §7.0 + §8.2 + §8.6 + §15 lora.json) + ENTITIES_FOLDER_§15_RECONCILE (pending — flat-layout deviation still informal) + ENTITY_JSON_PROMOTION (PLAN DRAFTED, EXECUTION BLOCKED) + CANON_FOLLOWUP (side-effect file updates pending: V0.2 registry §5, proposals/lora.json $canon_v2_alignment, proposals/commander_lyre.json substrate_alignment)
ENTITY_JSONS_DRAFTED  = 5 JSONs in proposals/ (all DRAFT_PROPOSAL_NOT_CANON)
CANON_V2_§15_COVERAGE = COMPLETE (drafts only)
DESIGN_SYSTEM_DRAFT_INTEGRATED = design_system/ (40 files, audit PASS, NOT committed)
DESIGN_SYSTEM_COMMIT_PENDING = YES (operator action required)
DRIFT_ITEMS_DEFERRED  = 5 total (3 Mikage + 1 weapon + 1 design system)
PROMOTION_PLAN_STATE  = DRAFTED — pending PROMOTE_* token bundle
LYRE_DIRECTION_LOCKED = OPTION_1A_PORCELAIN_MINIMALISM_2026-05-29
LORA_FORM_LOCKED      = OPTION_3A_SYSTEM_PRESENCE_ONLY_2026-05-29
LORA_FACTION_LOCKED   = OPTION_4F_META_SUBSTRATE_BELOW_2026-05-29
REGISTRY_STATE        = (pending Decision 6)
CANON_V2_UPDATE_TASKS = LORA_SUBSTRATE_§7_PATCH_PROPOSAL (pending) + ENTITIES_FOLDER_§15_RECONCILE (pending) + ENTITY_JSON_PROMOTION (PLAN DRAFTED, EXECUTION BLOCKED)
ENTITY_JSONS_DRAFTED  = 5 JSONs in proposals/ (all DRAFT_PROPOSAL_NOT_CANON)
CANON_V2_§15_COVERAGE = COMPLETE (drafts only; ENTITIES/ folder DOES NOT EXIST)
WORKSPACE_AUDIT_STATE = COMPLETE
DRIFT_ITEMS_DEFERRED  = 4 total (3 Mikage + 1 weapon)
PROMOTION_PLAN_STATE  = DRAFTED — pending PROMOTE_* token bundle
```

— END OF RUNNER V0.1 —
