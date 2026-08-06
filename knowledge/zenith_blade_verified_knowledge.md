# Zenith Blade — Verified Technical Knowledge Base

> Purpose: an evidence-backed reconstruction of the Zenith Blade project state, built by
> reading primary sources and attaching exact evidence to every statement. This file
> creates no canon and locks nothing. It is a READ artifact.
>
> Build context (evidence for the whole document):
> - Repo root: `D:/KAGAMI-MZ_SYNC_PUSH_V2` (`git rev-parse --show-toplevel`).
> - Built at HEAD `f233bca59ac26f05d2084d68d14f6f69d6689c41` (`git rev-parse HEAD`), branch `main`, working tree clean (`git status --porcelain=v1` → empty).
> - Author of this file: automated audit. No source file, `.blend`, or commit was modified to produce it.
>
> STATUS LEGEND (applied per statement/section):
> - **VERIFIED** — concrete evidence identified: exact path + command output, and hash where applicable.
> - **NOT VERIFIED** — could not be confirmed within the read-only, no-Blender constraint (reason given).
> - **CONTRADICTED** — two or more sources disagree; every version is recorded, none resolved here.
> - **UNKNOWN** — no evidence located either way.
>
> Hard limits of this audit (they bound every "VERIFIED" below):
> - No `.blend` file was opened in Blender. All geometry/material facts come from scripts, JSON reports, and hashes — never from the live scene.
> - No PNG/MP4 was visually inspected. Every "visual" verdict cited is a *documented* verdict from a report or operator ruling, not an independent observation.

---

## 1. Project architecture — VERIFIED (governance) / partially NOT VERIFIED (scene internals)

- The Zenith Blade is a Blender-built hero weapon asset with a three-state phase mechanism P1/P2/P3, attached to a character actor's right hand via a porcelain mitten.
  - Evidence: object roster and phase frames in `_tmp/zenith_blade_hero_e1_ce05/architecture02/run_arch02.py:9-11,11` — `PHASES={'P1':1,'P2':31,'P3':61}`; mitten object `A2_right_porcelain_mitten_hand_attached_read`. VERIFIED.
- Governance model: every task is dispatched through **`AGENTS.md`** as append-only "controlled exception" blocks. The 5 most recent commits each modify only `AGENTS.md`.
  - Evidence: `git show --stat f233bca 46dda9d 9408d2f eebb177 9ecb2d3` → each is `AGENTS.md | N ++++` only. VERIFIED.
- The blade line is declared **FILM / RENDER-ONLY** (MV and film first); pipeline stages 5 (retopo/low-poly) and 6 (UV+bake) are LOCKED.
  - Evidence: `docs/handoff/00_LATEST_CODEX_HANDOFF.md:40-42`. VERIFIED (as a documented operator decision dated 2026-07-30).
- Full internal scene architecture (modifier stacks, drivers, node graphs) — **NOT VERIFIED** (requires opening the `.blend`, which this audit does not do).

---

## 2. Folder structure — VERIFIED

Commands: `git ls-files | grep -iE 'blade|zenith'` (483 tracked paths), `ls -la`, `ls -R _tmp/...`.

- `production/character/` — tracked Blender sources and outputs.
  - `production/character/production_actor/rig_derivatives/` — 79 `.blend` files (`ls …/*.blend | wc -l` → 79); the main derivative chain including `MIKAGE_ZENITH_BLADE_HERO_E1_CORRECTION_CE01.blend`.
  - `production/character/reviews/` — 567 entries (`ls | wc -l` → 567); PROOF `.md`, REPORT `.json`, contact-sheet `.png`, some `.mp4`.
  - `production/character/build_log/` — task briefs and the build-log standard.
  - `production/character/shots/` — e.g. `MIKAGE_ZENITH_BLADE_DIAGNOSTIC_SHOT_V0_35.blend`.
- `tools/zenith_blade_render/` — ComfyUI/RunPod render script + `inputs/` control PNGs + `RUNPOD_OPERATOR_RUNBOOK.md`.
- `.mikage/tools/` — `validate_task.py`, `verify_output.py`; `.mikage/tasks/` — `active_task.yaml` + dated backups.
- `_tmp/` — **git-ignored** working area (`.gitignore` line `_tmp/`). Contains all live Architecture/Form working data:
  - `_tmp/zenith_blade_hero_e1_ce01/` … `…ce05/` — the current working generations (see §6).
- Documentation/governance at repo root and `docs/`: `AGENTS.md`, `CLAUDE.md`, `docs/handoff/`, `docs/architecture/`, SSOT files (see §4).
- `.gitignore` excludes (relevant): `_tmp/`, `*.blend1`, `output/`, `outputs/`, `archive/`, `__pycache__/`.
  - Evidence: `.gitignore` (read in full). VERIFIED.

Consequence — VERIFIED: the current source-of-truth working blends live under `_tmp/` and are therefore **untracked**; git history does not back them up.

---

## 3. Pipeline — VERIFIED (as scripted)

Two distinct pipelines exist and are NOT the same line:

**(A) Current Blender line (active).** Per-pass Python scripts drive `bpy` (Blender Python) to: duplicate/inherit from an immutable source `.blend`, build/derive geometry, force phase frames, run BVH collision checks, render EEVEE/ortho review PNGs, hash-verify protected components, and write a per-pass JSON report; save a candidate `.blend` ONLY if the technical gate passes and `--save` is set.
  - Evidence: `_tmp/zenith_blade_hero_e1_ce05/architecture02/run_arch02.py` (read in full; see §10, §12, §13). VERIFIED.

**(B) Legacy ComfyUI/RunPod film-render line.** `tools/zenith_blade_render/render_zenith_blade_p1p2p3.py` queues a ComfyUI graph (RealVisXL checkpoint + canny ControlNet) against locked control PNGs to generate P1/P2/P3 image candidates. Explicitly operator-run on a pod, not by the agent.
  - Evidence: `tools/zenith_blade_render/render_zenith_blade_p1p2p3.py:1-12,16-19,28-49`. VERIFIED.
  - Dated `DATE="20260602"` (line 19). This is older than the current Blender line (2026-08-04).

Manual steps owned by operator: file placement, `git commit`, `git push`.
  - Evidence: `CLAUDE.md` "Repo conventions". VERIFIED (documented rule).

---

## 4. Source-of-Truth hierarchy — VERIFIED (existence) / process CONTRADICTED (which pointer is current)

Declared SSOT (canon) files, per `AGENTS.md:78-84` — all confirmed to EXIST (`test -f`):
- `docs/handoff/MIKAGE_ZENITH_ENTITY_PHASE_SPEC_V1.md` — EXISTS (phase P1/P2/P3 + mask ruling).
- `design_system/mikage-cine-color-contract.md` — EXISTS (cine color).
- `docs/mikage_character_visual_spec.md` — EXISTS (character form).
- `docs/mikage_universe_visual_system.md` — EXISTS (world/universe visual).
- `mikage-zenith-design` skill — BRAND/UI canon (skill, not a repo file).
- Also required-before-canon: `docs/architecture/MIKAGE_CANON_CONTROL_MAP.md` — EXISTS.
  - Evidence: existence loop over the five paths → all `EXISTS`. VERIFIED.

Live task authority hierarchy (as evidenced by commit behaviour):
1. `AGENTS.md` = authoritative live dispatch (only file the recent governance commits touch). VERIFIED.
2. `docs/handoff/00_LATEST_CODEX_HANDOFF.md` and `.mikage/tasks/active_task.yaml` are **secondary pointers and are currently STALE** (see §14, contradiction C1).

CONTRADICTION C-SOT: `CLAUDE.md` "Start here" instructs reading the handoff FIRST as the current-task source, but the handoff's current task (`V0.89`, 2026-07-30) is superseded by `AGENTS.md` (Architecture02, 2026-08-04). Both versions recorded; not resolved here.

---

## 5. Git history summary — VERIFIED

Commands: `git rev-list --count HEAD`, `git log --oneline`, `git status -sb`, `git remote -v`.

- Total commits reachable from HEAD: **995**.
- Commits with `blade` in subject (all refs): **169** (`git log --oneline --all | grep -iE 'blade' | wc -l`).
- First blade commit: `83e5137 Add Zenith Blade spec (3 modes + compact-idle); log full-body in-progress`.
- HEAD / latest blade commit: `f233bca chore(governance): open Zenith Blade Architecture02` (2026-08-04 11:43 +07).
- Branch `main` is **ahead of `origin/main` by 151 commits**, never pushed (`git status -sb` → `## main...origin/main [ahead 151]`).
- Remote: `origin = https://github.com/nookun987-pixel/KAGAMI-MZ.git`.
- Worktree: this repo is a **linked worktree**; git dir = `D:/KAGAMI-MZ/.git/worktrees/KAGAMI-MZ_SYNC_PUSH_V2` (`git rev-parse --git-dir`). The object store physically lives in `D:\KAGAMI-MZ`.

Recent blade dispatch commits (subjects, `git log --oneline`):
- `f233bca` open Zenith Blade Architecture02
- `46dda9d` open Zenith Blade architecture rebuild (= Architecture01)
- `9408d2f` open Zenith Blade Form 03 silhouette cycle
- `eebb177` unblock Zenith Blade Form 02 interface scope
- `9ecb2d3` open Zenith Blade Form 02 gate
- `eca1fa2` record Zenith Blade CE01 correction candidate
- earlier: `HERO_E1`, `LIGHT_D1..D3`, `MAT_C1..C3`, `EDGE_B1`, `FORM_A1..A3`, `V0.89` chain.
  All VERIFIED from `git log --oneline`.

---

## 6. Blend file lineage — VERIFIED (hashes)

Two layers: the **git-tracked** chain, and the **untracked `_tmp/` working generations**. Hashes below via `sha256sum` (uppercased); prefixes shown for `_tmp` set, full hashes for the key sources.

Git-tracked current root:
- `production/character/production_actor/rig_derivatives/MIKAGE_ZENITH_BLADE_HERO_E1_CORRECTION_CE01.blend`
  - SHA-256 `DEE257CDA947F1DB2D2BC6A893619DBECAB5A0178F6F930A6F6F6F87DBDCB762` (independently hashed; matches `FORM02_PROOF.md:14` "immutable source"). Tracked (`git ls-files --error-unmatch` → TRACKED), clean. VERIFIED.

Untracked `_tmp` generation chain (`find _tmp -name '*.blend' | sha256sum`):
| Generation | File | SHA-256 prefix | Disposition |
|---|---|---|---|
| CE01 atomic | `…/ce01/atomic_replay/CE01_ATOMIC_WORK.blend` | `79289503EC7F0636` | equals HERO_E1 baseline snapshot (same prefix) |
| CE01 baseline snap | `…/ce01/baseline_reconciliation/eb30157/…/MIKAGE_ZENITH_BLADE_HERO_E1.blend` | `79289503EC7F0636` | git snapshot of commit `eb30157` |
| Form01 work | `…/ce01/form01/MIKAGE_ZENITH_BLADE_FORM_01_WORK.blend` | `5E4FA170111E9D17` | equals CE01_REPLAY02 (same prefix) |
| CE01 replay02 | `…/ce01/clean_replay02/MIKAGE_ZENITH_BLADE_HERO_E1_CORRECTION_CE01_REPLAY02.blend` | `5E4FA170111E9D17` | replay artifact |
| **Form02 (current immutable source)** | `…/ce02/form02/MIKAGE_ZENITH_BLADE_FORM_02_FIRST_PASSING_CANDIDATE.blend` | `250352AB89C72AB2` | **immutable source for Arch01 & Arch02** |
| Form03 | `…/ce03/form03/` | (no `.blend`) | CLOSED EXHAUSTED, **no candidate blend saved** |
| Architecture01 | `…/ce04/architecture01/MIKAGE_ZENITH_BLADE_ARCHITECTURE_01_FIRST_PASSING_CANDIDATE.blend` | `364A966FB4A5F119` | candidate SAVED; operator ruled VISUAL FAIL (see C2) |
| Architecture02 | `…/ce05/architecture02/` | (no `.blend`) | CLOSED EXHAUSTED, **no candidate blend saved** |

Full hashes verified for the two governance-cited sources:
- Form02 immutable source = `250352AB89C72AB2716E8E9CA595B1E86557F7720A1F0156C42519BF539FAE29` — matches `AGENTS.md` (Architecture02 block) and `_tmp/…/architecture02/ARCHITECTURE_02_RESULT.md:17`. VERIFIED.
- Architecture01 Pass-09 candidate = `364A966FB4A5F11988CEC8432A90E41B4694C53BF18BF91C55B07B12DDB5461B` — matches `AGENTS.md` and `ARCHITECTURE01_RESULT.json:candidate_sha256`. VERIFIED.

Lineage relationship — VERIFIED: Form02 and Arch01 both cite Form02 (`250352AB…`) as their `EXPECTED`/source (`run_arch02.py:7`, `ARCHITECTURE01_RESULT.json:source_sha256`). The tracked `HERO_E1_CORRECTION_CE01` (`DEE257…`) is the named immutable source of the Form02 cycle (`FORM02_PROOF.md:12-15`).

NOTE — NOT VERIFIED: the exact geometric delta between generations (what changed inside each blend) is not established; only file identity via hash is.

---

## 7. Asset dependency graph — VERIFIED (object names & roles from script)

From `run_arch02.py:9-11` (object names are literal string constants) and collision report JSON keys. Roles are as labelled in code/reports; internal correctness NOT VERIFIED (blend not opened).

Blade internal objects:
- `ZB42_CENTRAL_LOAD_SPINE` — central spine (PROTECTED, locked).
- `ZB42_P3_SINGLE_RECESSED_CORE` — the single recessed P3 core (PROTECTED).
- `ZB46_DRIVE_HUB` — drive hub body (PROTECTED). Also referenced: `ZB46_FLUX_BASE` (`run_arch02.py:120`).
- `ZB48_HANDLE_REGISTERED_TO_HAND_MARKER` — handle registered to the hand marker (PROTECTED).
- `ZB45_SHELL_LL`, `ZB45_SHELL_LR`, `ZB45_SHELL_UL`, `ZB45_SHELL_UR` — the four shells/plates (EDITABLE in Arch02).
- Arch02-introduced: `ZB_ARCH02_HIERARCHICAL_CHASSIS` (carrier), `ZB_ARCH02_HUB_NECK` (neck), `ZB_ARCH02_P1_CLOSURE_SKIN` (declared `run_arch02.py:11`), `ZB_ARCH02_MONOLITH_PREVIEW` (derivation source, `run_arch02.py:102`).

Actor coupling:
- `A2_right_porcelain_mitten_hand_attached_read` — actor porcelain mitten (PROTECTED; the V0.89 correction target).
- `hand_right_sword_hold_marker` — hand marker included in the transform-lock set (`run_arch02.py:99`).

Dependency direction (VERIFIED from code): shells are DERIVED from `ZB_ARCH02_MONOLITH_PREVIEW` by boolean-style polygon clipping (`derive()`, `run_arch02.py:104-108`); new carrier/neck inherit materials from `ZB42_CENTRAL_LOAD_SPINE` (`newobj(..., 'ZB42_CENTRAL_LOAD_SPINE')`, lines 111-112); shells inherit materials from `ZB45_SHELL_UL` for the preview (line 102).

---

## 8. Material system — CONTRADICTED (two color canons) / internals NOT VERIFIED

Materials are **not defined numerically in the current scripts**; they are inherited from source objects (`setmesh`/`newobj` copy `obj.data.materials`, `run_arch02.py:58-59,82-83`). Therefore material node values were NOT read (blend not opened) → **NOT VERIFIED**.

Documented color specifications (recorded, conflicting):

- **CONTRADICTION C-MAT (P3 core color):**
  - Legacy ComfyUI film line: red-hot ferro-calcium core `#E60000`.
    - Evidence: `tools/zenith_blade_render/render_zenith_blade_p1p2p3.py:6,34,46` ("blazing red-hot ferro-calcium core #E60000").
  - Brand / current Blender line: electric violet, emission base LOCKED at linear `(0.33, 0.0, 1.0)` (≈ `#8F00FF`), core state OFF/OFF/ON.
    - Evidence: `docs/handoff/00_LATEST_CODEX_HANDOFF.md:114` ("EMISSION BASE COLOR LOCKED at linear (0.33,0,1.0)"); `CLAUDE.md` palette LOCK (`electric violet #8F00FF`); Architecture02 core contract (`run_arch02.py:138`).
  - Both recorded; not resolved. Context: `CLAUDE.md` two-layer canon says FILM canon (crimson cores) is REFERENCE ONLY and BRAND canon (violet) wins for UI — but this is a *rule*, not proof of which the current `.blend` uses.

- Documented shell/frame materials (film line, `render_zenith_blade_p1p2p3.py:6,32-34`): white Boron Carbide (B4C) `#FAFAFA` outer shell; black titanium inner frame. Applicability to the current Blender blend — NOT VERIFIED.

---

## 9. Geometry system — VERIFIED (construction method from script)

From `run_arch02.py` (read in full):
- Construction is **monolithic-first**: one closed polygon `MONO` (8 points, `run_arch02.py:101`) is built, then the four shells are DERIVED from it by X-clipping + seam-clipping (`clip_x`, `clip_seam`, `derive`, lines 38-48,104-108). VERIFIED. This matches the operator ruling in `AGENTS.md` (Architecture02 block): "Build and approve one complete blade body before cutting it into four complementary plates."
- Shell cross-section built by `wedge()` (lines 49-56) → 3D wedge with front/back depth taper; `setmesh_fb()` (lines 62-79) seats the armored shell forward of the spine at `shell_y=-.46` and leaves the central seam open near the spine (`|x|<.15`) to avoid cutting the spine.
- Per-pass config `CFG` (10 rows, line 13) parameterizes (cutting reach, lower belly, spine width, depth, seam slope).
- Plate vertex counts recorded per pass (e.g. Pass 09: LL=12, LR=8, UL=12, UR=8 — `ARCH02_PASS09_REPORT.json`). VERIFIED.
- Protected geometry is fingerprinted by a per-object mesh hash `mh()` = SHA-256 over packed vertex coords + polygon vertex indices (lines 20-25). Locked objects' hashes compared before/after (`h0`,`h1`, lines 99,113,138). VERIFIED (method).

Actual mesh topology of any saved blend — NOT VERIFIED (blend not opened).

---

## 10. Collision system — VERIFIED (method + results from reports)

Method (from `run_arch02.py:27-29,130-135`):
- Evaluated-mesh BVH: `ebvh(name)` builds a `BVHTree.FromPolygons` from the depsgraph-evaluated object in world space; `ov(a,b)=len(ebvh(a).overlap(ebvh(b)))` counts overlapping triangle pairs.
- Checked at all three phases by forcing frames P1=1/P2=31/P3=61 (`force()` double-sets frame to flush drivers, line 26).
- Target set: the four shells + carrier + neck, each tested against the rest plus all PROTECTED objects (lines 132-135).

Results (VERIFIED from JSON):
- Architecture02 Pass 06: `technical_pass=false`, `collision_zero=false`; specifically `ZB45_SHELL_LL|ZB42_CENTRAL_LOAD_SPINE = 7` at P1.
  - Evidence: `_tmp/…/architecture02/pass_06/ARCH02_PASS06_REPORT.json`.
- Architecture02 Pass 09: `technical_pass=true`, `collision_zero=true`; all listed P1 pairs `0`.
  - Evidence: `_tmp/…/architecture02/pass_09/ARCH02_PASS09_REPORT.json`.
- Architecture01: `collision_result = ZERO_AT_P1_P2_P3` at the selected pass.
  - Evidence: `ARCHITECTURE01_RESULT.json`.
- Historical driver of this whole line: V0.88 measured 216 blade-to-mitten triangle overlaps (9 phase records) → the V0.89 mitten-interface correction.
  - Evidence: `docs/handoff/00_LATEST_CODEX_HANDOFF.md:17-21`. VERIFIED (as documented).

---

## 11. Naming convention — VERIFIED (observed pattern)

Observed from `git ls-files` and `_tmp` listings:
- Asset files: `MIKAGE_ZENITH_BLADE_<STAGE>_<VERSION>.blend`, e.g. `…_HERO_E1_CORRECTION_CE01.blend`, `…_MITTEN_INTERFACE_CORRECTION_V0_89.blend`.
- Two versioning epochs (VERIFIED sequence from git log):
  - Numeric `V0_1 … V0_89` (early → mid pipeline).
  - Lettered candidate series `FORM_A[1-3]` → `EDGE_B1` → `MAT_C[1-3]` → `LIGHT_D[1-3]` → `HERO_E1` → `HERO_E1_CORRECTION_CE01`. (A=form, B=edge, C=material, D=light, E=hero — letter = stage, number = iteration.)
  - Controlled-exception cycles: `CE_ZENITH_BLADE_FORM_02`, `…_FORM_03`, `…_ARCHITECTURE_01`, `…_ARCHITECTURE_02`; working dirs `_tmp/zenith_blade_hero_e1_ce0[1-5]/`.
- Review outputs paired per candidate: `*_PROOF.md`, `*_REPORT.json`, `*_CONTACT_SHEET.png`.
- Blade internal objects: `ZB##_<ROLE>` (e.g. `ZB42_CENTRAL_LOAD_SPINE`, `ZB45_SHELL_UL`, `ZB46_DRIVE_HUB`, `ZB48_HANDLE_…`); Arch02 additions prefixed `ZB_ARCH02_`.
  - Evidence: file listings + `run_arch02.py:9-11`. VERIFIED.

---

## 12. Render pipeline — VERIFIED (two pipelines, as scripted)

**(A) Current Blender review render** (`run_arch02.py:96-127`):
- Engine: uses the blend's configured engine (not set in script). NOT VERIFIED which (EEVEE assumed from the EEVEE-named source blends, but not proven here).
- Cameras: 3 ORTHO cameras built at runtime (front `(0,-7,0)`, side `(7,0,0)`, hero `(4.6,-5.4,.7)`), `ortho_scale = height*1.15` (lines 121-122).
- Resolution: `900 × 900`, `resolution_percentage=100`, PNG (lines 123). VERIFIED.
- Outputs per pass: `monolith_front/side/hero.png` + `p1/p2/p3.png` (7 PNGs/pass observed via `ls`). VERIFIED.

**(B) Legacy ComfyUI/RunPod film render** (`tools/zenith_blade_render/render_zenith_blade_p1p2p3.py`):
- Server ComfyUI API `http://127.0.0.1:8188`; checkpoint `realvisxlV50.safetensors`; ControlNet `diffusers_xl_canny_mid.safetensors`; latent `832 × 1216`; sampler `dpmpp_2m`/`karras`, steps 34, cfg 7.0; seeds `[3101,3102,3103]`; ControlNet strengths P1 0.74 / P2 0.6 / P3 0.55.
- Control inputs: `tools/zenith_blade_render/inputs/ZBLADE_CTRL_P1.png` (closed), `ZBLADE_CTRL_OPEN.png` (P2/P3).
- Operator-run only (header lines 2-3). VERIFIED. Older line (dated 20260602) — not the current active render path.

`HERO_E1` line also produced a tracked `…_HERO_E1_TURNTABLE_1080P.mp4` and 4K QA stills.
  - Evidence: `git ls-files` (reviews). VERIFIED (files exist; content NOT inspected).

---

## 13. Validation pipeline — VERIFIED (tooling) / STALE input CONTRADICTED

Two governance validators (`.mikage/tools/`, both read in full):
- `validate_task.py` — asserts `active_task.yaml` has all REQUIRED_FIELDS non-empty, list fields non-empty, `task_type` ∈ LOCKED_TASK_TYPES, and `verify_command == "python .mikage\tools\verify_output.py"`. Depends on PyYAML.
- `verify_output.py` — asserts the task's `output_folder_allowed` contains ONLY files in `output_files_allowed`; for `CONTACT_SHEET_ONLY`, forbids `.mp4` and requires the allow-set be exactly `{contact_sheet.png, contact_sheet_review_report.md}`.
- Both operate on `.mikage/tasks/active_task.yaml`.

Per-pass technical validation (from `run_arch02.py:138`): `technical = all([source_hash unchanged, transforms unchanged (t0==t1), protected mesh hashes unchanged (h0==h1), collision_zero, core=={P1:False,P2:False,P3:True}, carrier=={P1:False,P2:True,P3:True}])`. VERIFIED (method).

CONTRADICTION C-VAL: `validate_task.py`/`verify_output.py` validate `active_task.yaml`, which still points at `ZENITH_BLADE_V0_89` (2026-07-30), while the actual executed work is Architecture02 with outputs under `_tmp/…/ce05/architecture02/` (which is NOT the yaml's `output_folder_allowed`). The governance validators are therefore validating a stale task definition. Both recorded; not resolved.

Independent visual validation: `run_arch02.py` renders PNGs but performs **no automated visual gate**; the visual pass/fail is a human/operator judgement applied afterward (see C2). VERIFIED (absence of a visual-scoring routine in the script).

---

## 14. Known risks — VERIFIED (each with evidence)

- **R1 — Untracked source of truth.** The current immutable source (`Form02`, `250352AB…`) and all Arch01/Arch02 evidence live under git-ignored `_tmp/`. A `git clean -fdx` or `_tmp` purge would irrecoverably delete them; no git backstop. Evidence: `.gitignore` (`_tmp/`), `find _tmp -name '*.blend'`. VERIFIED.
- **R2 — Stale governance pointers.** `docs/handoff/00_LATEST_CODEX_HANDOFF.md` and `.mikage/tasks/active_task.yaml` both assert current task = `V0.89`; real current task = `Architecture02`. A resumer following `CLAUDE.md` "read handoff first" could restart abandoned work. Evidence: handoff:5-52, active_task.yaml, vs `git show f233bca`. VERIFIED (see C1).
- **R3 — 151 unpushed commits.** No off-machine backup of tracked history. Evidence: `git status -sb`. VERIFIED.
- **R4 — Shared `.git` with a HOLD repo.** Object store is in `D:\KAGAMI-MZ` (declared HOLD-only in `CLAUDE.md`). Destructive git ops here reach that store. Evidence: `git rev-parse --git-dir`. VERIFIED.
- **R5 — Automated "visual PASS" is unreliable.** Arch01 self-reported a visual PASS that the operator overturned (C2); scripts have no visual gate (§13). Trusting machine visual verdicts risks promoting a rejected asset. VERIFIED.
- **R6 — Color canon ambiguity.** Two P3-core colors (`#E60000` vs `#8F00FF`) exist across sources (C-MAT). Using the wrong one in a render would violate brand LOCK. VERIFIED (conflict exists).

---

## 15. Known unknowns — explicitly UNKNOWN / NOT VERIFIED

- Material node values inside any `.blend` (roughness, emission strength, actual core hue as rendered). NOT VERIFIED (blend not opened).
- Which render engine the current blends use (EEVEE vs Cycles) — inferred from filenames only. NOT VERIFIED.
- Real-world blade scale / actor-hand ratio / spine deviation metrics — the V0.89 `scale_audit` was a *pending* measurement; no confirmed numeric result located. UNKNOWN.
- Whether any Architecture02 pass's rendered image actually reads as "cabinet/door" — the verdict is documented (`ARCHITECTURE_02_RESULT.md`) but images were not inspected. NOT VERIFIED independently.
- Whether the operator has seen and ruled on Architecture02 (the RESULT says visual ruling remains with operator). UNKNOWN.
- Contents/validity of `docs/MIKAGE_SESSION_CHECKLIST.md` and `…_LESSONS.md` (not read this audit). UNKNOWN.

---

## 16. Verification Matrix

| # | Claim | Status | Primary evidence |
|---|---|---|---|
| M1 | Repo root = `D:/KAGAMI-MZ_SYNC_PUSH_V2`, linked worktree of `D:\KAGAMI-MZ/.git` | VERIFIED | `git rev-parse --show-toplevel`, `--git-dir` |
| M2 | HEAD = `f233bca`, branch main, tree clean, ahead 151 | VERIFIED | `git rev-parse HEAD`, `git status -sb` |
| M3 | 995 total commits, 169 blade commits | VERIFIED | `git rev-list --count`, `git log|grep|wc` |
| M4 | AGENTS.md is the live dispatch surface | VERIFIED | `git show --stat` last 5 commits |
| M5 | Current task = `CE_ZENITH_BLADE_ARCHITECTURE_02 = OPEN` | VERIFIED | `git show f233bca -- AGENTS.md` |
| M6 | Handoff + active_task.yaml stale at V0.89 | CONTRADICTED | handoff:51, active_task.yaml vs M5 |
| M7 | Form02 source hash `250352AB…FAE29` | VERIFIED | `sha256sum` = expected in ARCHITECTURE_02_RESULT.md:17 |
| M8 | CE01 tracked root hash `DEE257…B762` | VERIFIED | `sha256sum`, matches FORM02_PROOF.md:14 |
| M9 | Arch01 Pass09 candidate hash `364A966…5461B` | VERIFIED | `sha256sum` = ARCHITECTURE01_RESULT.json |
| M10 | Architecture02 = CLOSED_EXHAUSTED, no blend saved, source unchanged | VERIFIED | ARCHITECTURE_02_RESULT.md; `find _tmp/…/ce05 -name '*.blend*'` empty |
| M11 | Arch02 Pass06 collision fault shell↔spine=7; Pass09 collision zero | VERIFIED | pass_06 / pass_09 REPORT.json |
| M12 | Form03 closed, no candidate blend | VERIFIED | `ls _tmp/…/ce03/form03` (no .blend) |
| M13 | Arch01 self-reported visual PASS @ pass09 | CONTRADICTED | ARCHITECTURE01_RESULT.json vs AGENTS.md (C2) |
| M14 | P3-core color spec conflict `#E60000` vs `#8F00FF` | CONTRADICTED | render script vs handoff/CLAUDE.md (C-MAT) |
| M15 | Object roster (ZB42/45/46/48, mitten, chassis, neck) | VERIFIED | run_arch02.py:9-11 |
| M16 | Collision method = evaluated-mesh BVH triangle overlap | VERIFIED | run_arch02.py:27-29 |
| M17 | Phase frames P1=1/P2=31/P3=61; core OFF/OFF/ON; carrier OFF/ON/ON | VERIFIED | run_arch02.py:11,138 |
| M18 | Blender 5.1, Python 3.14.6, ffmpeg present; blender not on PATH | VERIFIED | `ls "/c/Program Files/Blender Foundation/"`, `python --version`, `which ffmpeg` |
| M19 | 5 SSOT files + canon control map exist | VERIFIED | `test -f` loop |
| M20 | Material node internals / render engine / scale metrics | NOT VERIFIED / UNKNOWN | blend not opened |

---

## 17. Open questions (for the operator)

1. Is Architecture02's "VISUAL FAIL, all passes" your own eyes-on ruling, or the run's self-assessment awaiting your review? (`ARCHITECTURE_02_RESULT.md` says the visual ruling "remains with the operator".)
2. Do you intend to open `Architecture03` under a new exception that unlocks phase transforms/actions? (`ARCHITECTURE_02_RESULT.md:50-60` states the next cycle requires it.)
3. Should the untracked `_tmp/…/form02` immutable source (and Arch01 evidence blend) be promoted into tracked/backed-up storage? (R1.)
4. Should the stale `handoff` + `active_task.yaml` pointers be reconciled to Architecture02? (R2 / C1.)
5. Which P3-core color is canon for the current Blender render line — violet `#8F00FF` (brand) or the legacy red `#E60000` (film)? (C-MAT.)
6. Confirm the render engine of the current blends (EEVEE vs Cycles) for accurate pipeline docs.

---

## 18. Evidence index

Commands used (all read-only):
- `git rev-parse --show-toplevel | --git-dir | HEAD`; `git branch --show-current`; `git status --porcelain=v1 | -sb`; `git log --oneline [--all]`; `git rev-list --count HEAD`; `git show [--stat] <sha> -- AGENTS.md`; `git ls-files | grep -iE 'blade|zenith'`; `git ls-files --error-unmatch <path>`.
- `sha256sum <file>` (uppercased) for all blend hashes.
- `ls -la`, `ls -R`, `find _tmp -name '*.blend'`, `test -f`, `wc -l`.
- `which blender/python/ffmpeg`, `python --version`.

Primary source files read (paths relative to repo root):
- `AGENTS.md` (lines 1-180 + full diff of `f233bca`, `46dda9d`).
- `CLAUDE.md` (project instructions, in context).
- `docs/handoff/00_LATEST_CODEX_HANDOFF.md` (lines 1-150).
- `.mikage/tasks/active_task.yaml` (full).
- `.mikage/tools/validate_task.py`, `.mikage/tools/verify_output.py` (full).
- `tools/zenith_blade_render/render_zenith_blade_p1p2p3.py` (full).
- `_tmp/zenith_blade_hero_e1_ce05/architecture02/run_arch02.py` (full).
- `_tmp/zenith_blade_hero_e1_ce05/architecture02/ARCHITECTURE_02_RESULT.md` (full).
- `_tmp/zenith_blade_hero_e1_ce02/form02/FORM02_PROOF.md` (full).
- `_tmp/zenith_blade_hero_e1_ce04/architecture01/ARCHITECTURE01_RESULT.json` (full).
- `_tmp/zenith_blade_hero_e1_ce05/architecture02/pass_06/ARCH02_PASS06_REPORT.json`, `…/pass_09/ARCH02_PASS09_REPORT.json` (partial, JSON).
- `.gitignore` (full).

Key hashes (SHA-256, uppercased):
- Form02 source: `250352AB89C72AB2716E8E9CA595B1E86557F7720A1F0156C42519BF539FAE29`
- CE01 tracked root: `DEE257CDA947F1DB2D2BC6A893619DBECAB5A0178F6F930A6F6F6F87DBDCB762`
- Architecture01 Pass09 candidate: `364A966FB4A5F11988CEC8432A90E41B4694C53BF18BF91C55B07B12DDB5461B`

Recorded conflicts (unresolved by design):
- **C1** — current-task pointer: AGENTS.md (Architecture02) vs handoff/active_task.yaml (V0.89).
- **C2** — Architecture01 disposition: `ARCHITECTURE01_RESULT.json` `PASS_ARCHITECTURE_CANDIDATE` vs `AGENTS.md` `CLOSED_VISUAL_FAIL_TECHNICAL_CHECKPOINT_RETAINED`.
- **C-MAT** — P3 core color: `#E60000` (render script) vs `#8F00FF` / linear (0.33,0,1.0) (handoff/CLAUDE.md).
- **C-SOT** — process: CLAUDE.md "read handoff first" vs handoff being stale.
- **C-VAL** — validators gate `active_task.yaml` (V0.89), not the executed Architecture02 outputs.

---

## Quality-gate note

This file was reviewed for unsupported statements after drafting. Statements that could not be tied to a command output, file path, or hash were either removed or explicitly downgraded to NOT VERIFIED / UNKNOWN (see §15, and the "NOT VERIFIED" rows in §16). Specifically flagged as not independently verified: all material node internals, the current render engine, real-world scale metrics, and every visual read of a PNG/MP4 (no image was opened). No conflict was resolved by the author; all are recorded in §18.

END OF KNOWLEDGE BASE — no source, blend, or git state modified.
