# AGENT TASK GATE

Before any edit, the agent must:

1. Read `system/source_of_truth_registry.json`
2. Determine the exact domain
3. Fill `system/templates/pre_edit_plan.md`
4. Read the matching domain playbook
5. Edit only allowed files
6. Run invariant tests
7. Sync docs only after code is correct
8. Output:
   - changed files
   - why these files only
   - invariant result
   - docs synced or not

## HARD RULES
- Never use README or docs as source of truth
- Never update docs before canonical code files
- Stop immediately if domain is unclear
- Stop immediately if requested change breaks canonical contract
