# CLAUDE_PRO_FAST_WORKER_PROTOCOL_V1

## 1. Purpose

Use Claude Pro as a secondary fast worker for Mikage documentation tasks when Codex is limited.

Claude is not the main local inspector. Claude is used for fast markdown/report/checklist/manifest/pointer tasks inside the GitHub handoff loop.

## 2. Correct Role Split

- ChatGPT: coordinator, GitHub reviewer, task writer, QA gate.
- Codex: main local inspector for tasks requiring deep local filesystem inspection or execution.
- Claude Pro: fast secondary documentation worker for repo-local markdown tasks.
- User: triggers worker and approves high-level decisions.
- GitHub: source of truth and handoff point.

## 3. When To Use Claude Pro

Use Claude Pro for:

- markdown reports
- checklists
- manifests
- readiness reviews
- task drafts
- pointer updates
- no-render planning documents
- summarizing and normalizing handoff state

Do not use Claude Pro for:

- rendering
- ComfyUI runtime
- Blender
- image generation
- video generation
- canon approval
- asset lock
- public deploy
- deep local asset inspection unless Claude is running with proper local file access

## 4. Fast Operating Mode

Claude should always start from:

```txt
docs/handoff/00_LATEST_CODEX_HANDOFF.md
```

Then read the latest report path and execute only the CURRENT_NEXT_TASK.

Claude must not invent tasks or change lanes.

## 5. Claude Prompt

Paste this into Claude when Codex is limited:

```txt
You are the Claude Pro secondary fast worker for Mikage.

Work inside the Mikage GitHub handoff system only.

Primary repo:
D:\KAGAMI-MZ_SYNC_PUSH_V2

First read:
docs/handoff/00_LATEST_CODEX_HANDOFF.md

Then read the latest report listed inside the pointer.

Execute only CURRENT_NEXT_TASK if it is a markdown/report/checklist/manifest/readiness-review/pointer task.

If the task requires rendering, ComfyUI runtime, Blender, image generation, video generation, asset generation, deep inspection of D:\workspace\ComfyUI, canon approval, or asset lock, stop and return:
BLOCKED_NEEDS_CODEX_OR_LOCAL_INSPECTION

Rules:
- Do not create film/video/short/shotlist tasks.
- Do not render.
- Do not use ComfyUI runtime.
- Do not use Blender.
- Do not approve canon.
- Do not asset-lock anything.
- Do not call candidates production-ready.
- Do not change lanes.
- Do not ask the user for clarification if the answer is in the repo handoff files.

When done:
1. Create the required markdown file(s).
2. Create the required report.
3. Update docs/handoff/00_LATEST_CODEX_HANDOFF.md.
4. Commit and push if local git access is available.

Final response format:
RESULT:
CREATED:
MODIFIED:
POINTER_UPDATED:
COMMIT_HASH:
PUSH_SUCCEEDED:
NEXT_SAFE_TASK:
BLOCKERS:
```

## 6. If Claude Has No File/Git Access

Claude must output only file contents, separated by filename.

User or ChatGPT then writes the files to GitHub.

Claude must not claim commit/push success if it did not actually commit/push.

## 7. Current Use Case

Use Claude for ASSET-RESET style doc tasks:

- Phase 4 readiness review
- held candidate rework sequence
- missing asset request normalization
- go/no-go checklist
- manifest cleanup

Codex remains reserved for local deep inspection and execution tasks.

## 8. Stop Rules

If Claude proposes film/video/render before the current roadmap permits it, stop.

If Claude labels a candidate as production-ready without evidence, stop.

If Claude tries to start Phase 5 while PHASE5_ALLOWED is NO, stop.

## 9. Success Standard

A Claude task is successful only if:

- required document exists
- required report exists
- pointer is updated
- next task is explicit
- prohibited lanes remain closed
- no unsupported success claim is made
