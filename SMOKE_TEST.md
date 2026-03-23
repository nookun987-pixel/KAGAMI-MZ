# SMOKE_TEST.md

Locked: 2026-03-23
Purpose: Minimal checklist to confirm system is still alive after any change.
Time to complete: ~3 minutes

## Step 1: Run Test Suite

```bash
cd D:\KAGAMI-MZ
node scripts/run_all_tests.js
```

**Expected output:**
```
✓ core/state_machine           90 passed
✓ control/precheck             72 passed
✓ middleware                   169 passed
✓ translator/guard             70 passed
✓ translator/ollama            136 passed
✓ render                       98 passed
✓ critic                       106 passed
✓ drift                        104 passed
✓ memory                       135 passed
✓ orchestrator (e2e)           35 passed

TOTAL: 1015 passed, 0 failed
```

**If any test fails: STOP. Do not proceed. Fix the failing test first.**

## Step 2: Verify External Services Are Running

```bash
# Ollama
curl -s http://localhost:11434/api/tags | head -20
# Expected: JSON with "models" array

# Fooocus
curl -s http://localhost:7865/ | head -5
# Expected: HTML or API response (not connection refused)

# Notion (test auth)
# Verify .env has valid MIKAGE_NOTION_DB and NOTION_API_KEY
```

## Step 3: Run E2E Pipeline

```bash
node orchestrator.js examples/job_sample.json
```

**Expected output (key lines):**
```
[INFO] Job mikage_20260322_0001 — attempt 1/3
[DONE] Job mikage_20260322_0001 completed — decision: PASS, attempts: 1

FINAL STATE:
{
  "job_id": "mikage_20260322_0001",
  "status": "DONE",
  "decision": "PASS",
  "attempt_count": 1,
  ...
}
```

## Step 4: Verify Notion Record

Open Notion database and confirm:
- New row exists with Job ID `mikage_20260322_0001`
- Status = `DONE`
- Decision = `PASS` or `ALLOW`
- Identity Score, Critic Score, Narrative Score, Risk Score all populated
- Audit Trace field contains serialized JSON

## Step 5: Verify Rendered Image

Check the output file path reported in FINAL STATE `output_files` array. Confirm:
- File exists
- Image is visible (not corrupted)
- Image shows a mechanical humanoid with porcelain armor (not anime, not organic, not plastic)

## What Success Looks Like

| Check | Pass Condition |
|---|---|
| Test suite | 1015/1015, 0 failures |
| Ollama | Responds to `/api/tags` |
| Fooocus | Responds on port 7865 |
| Orchestrator | Exits with `status: "DONE"` |
| Decision | `PASS` or `ALLOW` (not REJECT/REVIEW/FAILED) |
| Notion | Row created with all scores populated |
| Image | File exists, renders correctly, identity intact |
| Audit trace | Contains entries for all 12+ pipeline steps |

## What Failure Signals Look Like

| Signal | Likely Cause | Where To Look |
|---|---|---|
| `StateTransitionError: Transition denied` | State machine skip — orchestrator calling transitions out of order | `orchestrator.js` transition sequence |
| `RenderTokenError: Token invalid or expired` | Precheck not issuing token, or token TTL expired before render starts | `control/precheck.js` issueToken, `render/render_executor.js` enforceToken |
| `VRAMConflictError: Cannot load Fooocus while Ollama is active` | Ollama not unloaded before render phase | `render/vram_manager.js` phase transitions |
| `decision: "REJECT"` at PRE_CONTROL | Job input has forbidden elements, non-Canon materials, or engagement-drift strategy | `control/precheck.js` CANON object, job.json art_direction |
| `decision: "REVIEW"` at PRE_CONTROL | Identity score 0.60–0.75, ambiguous narrative, unknown material | Same as above — check which score is in review band |
| `status: "FAILED"` | Middleware constraint violation, translator guard rejection, or Fooocus crash | Check `rejected_reason` in output JSON |
| Notion write failure (warning in console) | API key invalid, database ID wrong, rate limit, network down | `.env` config, Notion integration permissions |
| `TRANSLATION_FAILED` | Translator guard caught creative injection from Ollama | Switch to `TRANSLATOR_MODE=LOCAL` (deterministic, zero drift) |
| Image looks plastic / smooth / anime | Negative prompt not strong enough, or Fooocus model bias overriding | Check negative_prompt in output, consider model swap in Fooocus |
| `identity_erosion` drift flag | 3+ Canon identity dimensions failed — render is fundamentally not Mikage | Not refineable. Job must be re-submitted with corrected art_direction. |

## Quick Smoke (30 seconds)

If you just need a fast sanity check:

```bash
cd D:\KAGAMI-MZ
node -e "const {precheck}=require('./control/precheck');const r=precheck({identity:{character_id:'mikage_core'},narrative:{arc_id:'a',chapter:'f'},strategy:{objective:'identity_consistency'},art_direction:{mood:['melancholic'],material:['porcelain'],style:['wabi-sabi'],composition:{negative_space_min:0.4,broken_symmetry_required:true,imperfection_required:true,texture_variation_required:true}}});console.log(r.decision,r.identity_check,r.control_token?'TOKEN_OK':'NO_TOKEN')"
```

**Expected:** `ALLOW 1 TOKEN_OK`

If this prints `ALLOW` with a score and `TOKEN_OK`, the core control layer is intact.
