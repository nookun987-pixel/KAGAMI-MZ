# Mikage Zenith - One Page Brief

**System:** Mikage Zenith Image Generation Pipeline  
**Status:** Functional, compliance-unstable  
**Date:** 2026-03-31

---

## What Mikage Is

An automated image generation pipeline for a specific character aesthetic: **Mikage Zenith** — a porcelain-armored cyborg with strict visual canon requirements (material, color, lighting, composition).

The system takes natural language requests, generates specifications, renders images via Fooocus (local SDXL backend), validates against canon, and makes final allow/reject decisions.

---

## Current Pipeline (One Paragraph)

**Intake → Spec → Prompt → Render → Validate → Gate → Record**

1. Accept request via API/local bridge
2. Gemini parses into structured spec
3. Build prompts from canon constraints
4. Submit to Fooocus backend
5. Retrieve output image
6. Pixel + semantic validation
7. Gemini final gate decision
8. Save artifacts (PNG + JSON reports)

---

## What Is Already Real

- **Working orchestration** - Jobs execute end-to-end
- **Real validation gates** - Pixel analyzer, rule engine, Gemini evaluation
- **Canon enforcement logic** - Structured rules, pass/fail criteria
- **Transport layer** - VRAM management, error recovery, output capture
- **Run artifacts** - Decision trails, reports, outputs per job

**This is NOT a concept.** It generates actual images and makes real decisions.

---

## What Is Still Failing

**Dominant Problem: Render Non-Compliance**

The backend (Fooocus) produces outputs that drift from specifications:

| Requirement | Actual Output |
|-------------|---------------|
| Matte B4C ceramic | Glossy plastic, PVC sheen |
| Gofun white (#EEE7D7) | Pure #FFFFFF |
| Sumi black background | Pure #000000, decorative blue circles |
| Crimson seams only | Full facial/neck coverage |

**Secondary Problem:** Validator/Gemini mismatch — automated checks pass while semantic gate rejects.

**Result:** High rejection rate on final gate despite correct pipeline execution.

---

## What Should Happen Next

**Priority 1: Fix Render Compliance**

Options (best to worst):
1. Train LoRA for Mikage-specific aesthetic (matte ceramic, color canon)
2. Enhance negative prompts with drift categories
3. Evaluate alternative base checkpoints

**Priority 2: Align Validator/Gemini**

- Add semantic surface/texture detection
- Calibrate against rejection patterns

**Priority 3: Build Operator V0**

**ONLY AFTER** compliance is improved. Operator layer handles final approval and feedback, but only when render quality is consistent enough to make human judgment meaningful.

---

## The Key Insight

**Architecture is sound. Backend obedience is not.**

Don't rebuild the pipeline. Fix the model's adherence to specification.

---

*End of ONE_PAGE_BRIEF.md*
