# GEMINI-01_RESEARCH_MIKAGE_IP_FILM_PRODUCTION_PLAN_V1_TASK

## 1. TASK

GEMINI-01_RESEARCH_MIKAGE_IP_FILM_PRODUCTION_PLAN_V1

## 2. ROLE

You are Gemini acting as an external research and planning analyst for the Mikage IP film pipeline.

Your job is not to create images, video, animation, or assets. Your job is to produce a practical production plan for how one person with one PC can begin making an IP film/short-film pipeline for Mikage without confusing a mask-only motion poster with an actual film proof.

## 3. PRIMARY OBJECTIVE

Research and define what is actually required to make a Mikage IP film proof, starting from the current reality:

- solo creator
- one PC
- existing Mikage canon assets
- existing music/IP direction
- limited render capacity
- need for visible progress
- avoid endless canon perfection loops
- avoid pretending 1 mask/key visual is enough for a film

The output must explain the correct roadmap, required ingredients, minimum viable film proof, missing pieces, and staged execution plan.

## 4. CONTEXT

Current desired long-term goal:

```txt
Build the Mikage IP into a film/cinematic universe pipeline.
```

But the first practical target must be smaller:

```txt
MIKAGE_FILM_PROOF_01
A small proof that proves film language, not just a mask slideshow.
```

Previous mistake to avoid:

```txt
Using only a mask/key visual/blade still and calling it film-ready.
```

Gemini must explicitly distinguish:

- motion poster
- visualizer
- teaser
- cinematic proof
- short film
- episode
- full film

## 5. REQUIRED ANALYSIS QUESTIONS

Answer these questions clearly:

1. What does a solo creator actually need to make an IP film pipeline?
2. What is the minimum viable Mikage film proof that is not fake progress?
3. What visual ingredients are required beyond a helmet/mask close-up?
4. What source asset categories are needed?
5. What can be done with existing static canon assets?
6. What cannot be done yet without new assets or tools?
7. What is the correct first proof scope: motion poster, teaser, cinematic proof, or short film?
8. What should the first 3 proof levels be?
9. What does each level need before execution?
10. What should ChatGPT/Codex/Gemini/user each do?
11. What checks prevent the workflow from drifting into useless reports?
12. What checks prevent the workflow from drifting into mask-only pseudo-film?

## 6. REQUIRED OUTPUT FILE

Create this file:

```txt
docs/handoff/GEMINI-01_MIKAGE_IP_FILM_PRODUCTION_PLAN_V1.md
```

## 7. REQUIRED REPORT FILE

Create this file:

```txt
docs/handoff/GEMINI-01_RESEARCH_MIKAGE_IP_FILM_PRODUCTION_PLAN_V1_REPORT.md
```

## 8. REQUIRED CONTENT STRUCTURE FOR PLAN

The plan file must include:

```md
# GEMINI-01_MIKAGE_IP_FILM_PRODUCTION_PLAN_V1

## 1. Executive Conclusion
State whether one person with one PC can make a Mikage IP film pipeline and under what scope.

## 2. Definition Check
Define and distinguish:
- motion poster
- music visualizer
- teaser
- cinematic proof
- short film
- episode
- full film

## 3. Current Reality Assumption
Describe what the pipeline likely has now:
- canon docs
- static images
- music identity
- local workspace
- GitHub bridge
- Codex worker
- limited compute

Do not assume approved assets unless verified by local reports.

## 4. Minimum Viable Film Proof
Define the smallest valid proof that deserves to be called film/cinematic proof.

It must include at least:
- world/space establishing beat
- subject/presence beat
- event/change beat
- timing and rhythm
- camera/motion language
- sound or deliberate silent decision

## 5. Required Asset Categories
List required categories:
- world/environment plates
- character presence/body/silhouette shots
- mask/helmet close-ups
- blade/detail inserts
- UI/signal/system graphics
- title/text cards
- audio/music cue
- edit template
- QA checklist

## 6. What Existing Assets Can Support
Explain what static canon images can support:
- motion poster
- opening ident
- title sting
- 3-shot proof

Also explain what they cannot support yet:
- dialogue scene
- combat scene
- full episode
- complex character animation

## 7. Proposed 3-Level Roadmap
Define:

### Level 1: Motion Poster / Brand Ident
Duration, required assets, output, pass condition.

### Level 2: Cinematic Proof / 3-Beat Sequence
Duration, required assets, output, pass condition.

### Level 3: Short Film Prototype
Duration, required assets, output, pass condition.

## 8. Recommended First Target
Choose exactly one first target.
Do not give many options.
Explain why this is the correct first target.

## 9. Required Next Tasks
List the next 5 tasks in order.
Each task must produce a concrete output file or asset.
Avoid report-only tasks unless they unblock a decision.

## 10. Role Split
Define what each role does:
- User
- ChatGPT
- Codex/local worker
- Gemini

## 11. Anti-Drift Rules
Rules to stop:
- mask-only pseudo-film
- endless planning
- render/tool drift
- using archive/rejected assets
- calling unapproved assets canon

## 12. Go / No-Go Checklist
Provide a checklist to decide whether the system can start actual production.

## 13. Final Recommendation
State the next concrete task after this research plan.
```

## 9. REQUIRED REPORT STRUCTURE

The report must include:

```md
# GEMINI-01_RESEARCH_MIKAGE_IP_FILM_PRODUCTION_PLAN_V1_REPORT

## 1. RESULT
PASS / BLOCKED

## 2. FILES_CREATED
List created files.

## 3. KEY_DECISION
State the recommended first target.

## 4. NEXT_SAFE_TASK
Return exactly one next safe task.

## 5. BLOCKERS
List blockers if any.
```

## 10. CONSTRAINTS

Do not create images.
Do not create video.
Do not render.
Do not use ComfyUI.
Do not use Blender.
Do not approve canon.
Do not asset-lock anything.
Do not public-deploy anything.
Do not write vague strategy only.
Do not give ten possible routes.
Choose one practical route.

## 11. UPDATE POINTER

After completing the plan and report, update:

```txt
docs/handoff/00_LATEST_CODEX_HANDOFF.md
```

It must point to:

```txt
docs/handoff/GEMINI-01_RESEARCH_MIKAGE_IP_FILM_PRODUCTION_PLAN_V1_REPORT.md
```

## 12. GIT REQUIREMENT

Commit and push all created/modified files.

Commit message:

```txt
Add Gemini Mikage IP film production plan
```

## 13. FINAL RESPONSE TO USER

Return only:

```txt
RESULT:
PLAN_PATH:
REPORT_PATH:
POINTER_UPDATED:
COMMIT_HASH:
PUSH_SUCCEEDED:
KEY_DECISION:
NEXT_SAFE_TASK:
BLOCKERS:
```
