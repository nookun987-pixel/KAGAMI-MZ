# MIKAGE_AGENT_GOVERNANCE_LAYER_V1

STATUS: ACTIVE
VERSION: V1
SCOPE: GPT / Codex / local-agent / GitHub handoff operations for Mikage.

## 1. Purpose

This file defines the operational governance layer for all Mikage agent work.

Goal: prevent uncontrolled agent behavior, destructive mutations, false PASS claims, wrong media source usage, wrong public-link wording, and format drift.

Core rule:

```txt
Agent work must be permission-scoped, evidence-verified, and rollback-safe.
```

## 2. Scope

This governance layer applies to:

- GPT tab tasks
- Codex tasks
- local filesystem agents
- GitHub handoff updates
- media audit / repair tasks
- website / public deployment tasks
- catalog / memory / release-status tasks
- short-video and audio-production tasks

This layer does not replace the current memory, catalog, handoff, public-engine standard, or track packages. It sits above them as the safety gate.

## 3. Mandatory Task Declaration

Every mutation task must declare:

```txt
TASK_ID:
INPUT_FILES:
ALLOWED_PATHS:
FORBIDDEN_PATHS:
ALLOWED_ACTIONS:
FORBIDDEN_ACTIONS:
VERIFY_REQUIRED:
OUTPUT_REPORT:
```

If any mandatory field is missing, the agent must stop and return:

```txt
STATUS = BLOCKED_TASK_DECLARATION_INCOMPLETE
```

## 4. Agent Permission Model

Default permission is read-only.

The agent may mutate files only when the task explicitly grants write permission.

Permission levels:

```txt
READ_ONLY       = inspect and report only
CREATE_ONLY     = create new files only
PATCH_ONLY      = modify explicitly listed files only
MUTATION_BATCH  = modify listed files inside allowed paths only
PUBLIC_DEPLOY   = public-facing deployment; requires strict link/status verification
```

If permission level is not declared, default to:

```txt
READ_ONLY
```

## 5. Allowed Actions

Allowed only when explicitly included in the task:

- read specified source files
- create a new report file
- create a new governance / handoff / checklist file
- patch an explicitly listed file
- create derivative media output from verified source media
- run deterministic verification such as ffprobe/contact sheet/hash/log checks
- update GitHub handoff with a short status registration
- produce a final report with evidence

## 6. Forbidden Actions

Always forbidden unless the operator explicitly overrides in writing:

- delete files
- overwrite approved finals
- mutate locked files or locked folders
- modify archived evidence as active work
- move files without explicit task permission
- rewrite the whole handoff when only a short update is needed
- change release metadata without source evidence
- change public links without source evidence
- change short-video format without explicit approval
- use compressed MP4 audio as final audio source
- claim PASS without direct verification evidence
- treat user-reported PASS as directly verified PASS
- invent missing UPC, ISRC, release link, live status, delivery status, or proof status

## 7. Path Safety Rules

Every task must define allowed and forbidden paths.

If a task references local paths that are not visible to the current agent, mark them:

```txt
CHUA_XAC_NHAN
```

If file/path mapping is ambiguous, stop and return:

```txt
STATUS = BLOCKED_MAPPING_RISK
```

If a mutation may be destructive, stop and return:

```txt
STATUS = BLOCKED_DESTRUCTIVE_RISK
```

## 8. File Mutation Rules

Before mutating any file, the agent must know:

- exact path
- intended change
- rollback-safe behavior
- whether the file is locked, approved, archived, or active

Approved final files are immutable by default.

Existing files should be patched narrowly. Do not rewrite large files unless required.

## 9. Audio / Video Safety Rules

For Mikage media work:

- use original WAV/audio master when available
- never use compressed MP4 audio as final source
- final MP4 must be H.264, 1080x1920 vertical, 30fps unless task says otherwise
- final audio must be AAC, 48kHz, stereo
- final audio bitrate must not be accepted below 317000 bps
- visual rebuild requires contact sheet before final MP4 approval
- black/freeze detector results must be manually interpreted when Mikage minimal black background is expected
- wrong-visual files must be quarantined, not posted

If audio/video verification is missing, return:

```txt
STATUS = PARTIAL_VERIFY_MISSING
```

## 10. Website / Public Deployment Safety Rules

Public copy/link rules:

- Use `Listen now:` only when live status is confirmed.
- Use `Pre-save:` only when track is not released yet and pre-save link is confirmed.
- Use `Link:` when status is uncertain.
- Never use `Pre-save / listen`.
- Unknown status must be marked `CHUA_XAC_NHAN`.
- TooLost smart link can be used as multi-platform landing link when confirmed active.
- Do not claim all-platform sync unless each platform is checked or evidence is provided.

## 11. PASS / FAIL / PARTIAL Definition

```txt
PASS:
- requested mutation completed
- output file(s) exist or GitHub commit exists
- required verification was performed
- no forbidden path/action touched
- report includes evidence

PARTIAL:
- some work completed
- at least one required item missing or unverified
- no destructive action occurred

FAIL:
- requested mutation not completed
- verification failed
- output unsafe or wrong
- task must stop
```

Direct verification must be separated from user-reported status:

```txt
USER_REPORTED_PASS != DIRECTLY_VERIFIED_PASS
```

## 12. Required Verify Report Format

Every mutation task must output:

```txt
RESULT:
PASS / FAIL / PARTIAL

TASK_ID:

CREATED:
- paths or none

UPDATED:
- paths or none

NOT_TOUCHED:
- locked / approved / forbidden paths confirmed untouched

DIRECTLY_VERIFIED:
YES / NO

VERIFY_EVIDENCE:
- exact evidence checked

BLOCKERS:
- none or exact blocker

NEXT_SAFE_TASK:
- one concrete next action only
```

## 13. Batch Task Rules

For batch work:

- run audit-only first when risk is unclear
- separate safe auto-fixes from uncertain cases
- do not touch `CHUA_XAC_NHAN` items
- do not touch locked/approved finals
- do not delete anything
- create a manifest of every planned mutation before execution
- execute only the approved mutation class
- stop on destructive ambiguity

## 14. Stop Conditions

The agent must stop when:

- source file is missing
- required input is missing
- path mapping is ambiguous
- mutation would touch a locked/approved final
- live/pre-save status is uncertain
- verification cannot be performed
- file content is too large to safely patch without full read
- task asks for multiple risky changes without scoped permission

Return the exact stop reason, not a guessed solution.

## 15. Next Safe Task Rule

Every report must end with one next safe task only.

Do not provide many options unless the operator explicitly asks for options.

Default next task format:

```txt
NEXT_SAFE_TASK:
<one concrete task>
```

## 16. Minimal Operator Checklist

Before giving any agent a mutation task, operator should confirm:

```txt
1. TASK_ID exists
2. source files are listed
3. allowed paths are narrow
4. forbidden paths are explicit
5. write permission is declared
6. verify method is declared
7. PASS definition is clear
8. rollback/destructive risk is controlled
9. public link wording is status-safe
10. next safe task is one concrete action
```

## 17. Active Use Rule

All future Codex/local-agent mutation tasks must read this file before mutation.

If this file conflicts with a task instruction, choose the safer rule unless the operator explicitly overrides it.
