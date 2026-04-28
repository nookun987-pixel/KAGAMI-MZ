# MIKAGE AGENT SKILLS INDEX

## CLAUDE_SKILL_DESIGN_PATTERNS_FOR_MIKAGE

### 1) MIKAGE_SKILL_DESCRIPTION_RULE
- Source idea: Skill cards must be explicit, bounded, and operator-readable.
- Purpose: Prevent vague execution and scope drift.
- When to use: Defining or updating a reusable skill pattern.
- When not to use: One-off ad hoc tasks with no reuse intent.
- Required reads: `AGENTS.md`, `docs/MIKAGE_AGENT_SKILL.md`, active task prompt.
- Allowed actions: Document-only skill definition, constraints mapping, examples.
- Forbidden actions: Runtime/code edits, lane runs, commits, pushes.
- Expected report: Skill name, scope, boundaries, pass/fail checks.
- Fail conditions: Missing boundaries, ambiguous trigger, no fail criteria.

### 2) MIKAGE_TRIGGER_BOUNDARY_TEST
- Source idea: Every skill must state exact trigger and hard stop conditions.
- Purpose: Ensure activation is deterministic and safe.
- When to use: Designing workflow start/stop logic.
- When not to use: Post-hoc narrative without operational decisions.
- Required reads: `AGENTS.md`, task lock/forbidden list.
- Allowed actions: Trigger matrix, stop-condition checklist.
- Forbidden actions: Broadening scope beyond requested files/phase.
- Expected report: Trigger matched, boundary checks passed/failed.
- Fail conditions: Trigger unclear, conflicting boundaries, unsafe continuation.

### 3) MIKAGE_ONE_HARD_TASK_ITERATION
- Source idea: Execute one hard task in one bounded iteration.
- Purpose: Reduce multi-goal risk and improve verifiability.
- When to use: Complex tasks with multiple possible branches.
- When not to use: Tiny read-only queries.
- Required reads: Active task objective and allowed file list.
- Allowed actions: Single-scope implementation and focused verification.
- Forbidden actions: Parallel unrelated refactors or broad rewrites.
- Expected report: Current state, blocker, next small task, result.
- Fail conditions: Multiple scopes mixed, unverifiable completion.

### 4) MIKAGE_FUNCTIONAL_OUTPUT_TEST
- Source idea: Outputs must be testable against explicit acceptance points.
- Purpose: Replace subjective “done” with measurable evidence.
- When to use: Any task requiring validation or handoff confidence.
- When not to use: Pure brainstorming with no deliverable.
- Required reads: Task VERIFY/OUTPUT REQUIRED section.
- Allowed actions: Minimal checks directly tied to requested outputs.
- Forbidden actions: Heavy/unrequested test suites or lane executions.
- Expected report: Command/evidence map to each acceptance item.
- Fail conditions: Claims without evidence, mismatched verification scope.

### 5) MIKAGE_SEQUENTIAL_WORKFLOW_ORCHESTRATION
- Source idea: Order-sensitive tasks must run in strict sequence.
- Purpose: Avoid state corruption from out-of-order operations.
- When to use: Multi-step tasks with dependencies (read -> approve -> edit).
- When not to use: Independent single-step actions.
- Required reads: Workflow constraints in prompt and repo rules.
- Allowed actions: Step gating, checkpointed progress updates.
- Forbidden actions: Skipping approvals or reordering guarded steps.
- Expected report: Completed steps, pending steps, gate status.
- Fail conditions: Ungated edits, skipped prerequisites.

### 6) MIKAGE_CONTEXT_AWARE_TOOL_SELECTION
- Source idea: Pick the safest smallest tool for the requested action.
- Purpose: Minimize accidental side effects.
- When to use: Any task requiring file/git/inspection operations.
- When not to use: No-tool conceptual Q&A.
- Required reads: Tooling rules and lock constraints in prompt.
- Allowed actions: Read tools for inspection, surgical edit tools for scoped files.
- Forbidden actions: Unnecessary runtime commands, destructive git ops.
- Expected report: Tool used, why chosen, result.
- Fail conditions: Overpowered tool usage, unauthorized side effects.

### 7) MIKAGE_DOMAIN_GOVERNANCE_RULE
- Source idea: Respect lane/domain governance and operator locks.
- Purpose: Prevent cross-domain regressions and policy violations.
- When to use: Tasks touching RENT/GARA/CALL/process governance.
- When not to use: Isolated docs typo fixes with no governance impact.
- Required reads: `AGENTS.md`, `docs/MIKAGE_AGENT_SKILL.md`, lane locks.
- Allowed actions: Governance-aligned doc/process updates.
- Forbidden actions: Lane runs/sync/Telegram/GSheet without explicit approval.
- Expected report: Governance checks passed, prohibited actions not executed.
- Fail conditions: Any lock violation or unapproved lane action.

### 8) MIKAGE_REPO_CONTEXT_SEARCH
- Source idea: Gather only context needed for the current scope.
- Purpose: Avoid over-scanning and preserve operator intent.
- When to use: Locating files/sections required by task.
- When not to use: User explicitly limits to one file/diff/command.
- Required reads: Task scope boundaries and file allowlist.
- Allowed actions: Targeted reads/searches of explicitly relevant files.
- Forbidden actions: Repo-wide exploratory scans without need.
- Expected report: Files inspected and why each was necessary.
- Fail conditions: Irrelevant scanning, exceeding requested inspection scope.

### 9) MIKAGE_SKILL_TREE_COMPRESSION
- Source idea: Compress many micro-rules into actionable checklists.
- Purpose: Improve execution speed without losing safety.
- When to use: Repetitive operational tasks and handoff templates.
- When not to use: Novel deep design tasks requiring full exposition.
- Required reads: Current phase objective and output format requirements.
- Allowed actions: Concise structured checklists, compact decision trees.
- Forbidden actions: Dropping critical constraints for brevity.
- Expected report: Compact checklist + pass/fail outcomes.
- Fail conditions: Missing required fields, hidden assumptions.

### 10) MIKAGE_AGENT_HANDOFF_GUARDRAIL
- Source idea: Handoff must be executable by next operator/agent.
- Purpose: Preserve continuity and prevent state loss.
- When to use: End-of-phase, pause, or operator review points.
- When not to use: Early exploration without stable findings.
- Required reads: Task output contract and status file conventions.
- Allowed actions: Clear state/blocker/next-action summaries.
- Forbidden actions: “Done” claims without verification evidence.
- Expected report: Current state, changed files, real result, next safe action.
- Fail conditions: Ambiguous handoff, missing blockers, unverifiable claims.

### 11) MIKAGE_LOCAL_CONTROL_FIRST
- Source idea: Prefer local, reversible, low-risk control actions first.
- Purpose: Keep operations safe and auditable.
- When to use: Cleanup, verification, and constrained maintenance tasks.
- When not to use: Tasks explicitly requiring external/live execution.
- Required reads: Prompt locks and forbidden action list.
- Allowed actions: Local read-only checks, scoped file operations.
- Forbidden actions: External side effects (push, live sync, messaging).
- Expected report: What was changed locally and what was intentionally not run.
- Fail conditions: External-impact action without approval.

## COMPLETED_SKILL_DOCS

- `docs/agent_skills/MIKAGE_SCOPE_LOCK_RENT_GARA_ONLY.md`
- `docs/agent_skills/MIKAGE_DATA_ANALYST_V1.md`
- `docs/agent_skills/MIKAGE_DATA_REPORT_CONTRACT.md`
- `docs/agent_skills/MIKAGE_GSHEET_SYNC_SKILL.md`
- `docs/agent_skills/MIKAGE_TELEGRAM_NOTIFY_SKILL.md`
- `docs/agent_skills/MIKAGE_DEDUP_IDEMPOTENCY_SKILL.md`
- `docs/agent_skills/MIKAGE_FAILURE_REPORT_SCHEMA.md`

## PHASE_2D_CLOSEOUT_NOTE

- Phase 2D closeout workspace clean.
- Last commit anchor not confirmed due git HEAD commands returning no output.
