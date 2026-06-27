# STRICT IMAGE LOOP SPECIFICATION

## OBJECTIVE
Implement a strict validation loop that regenerates images until Gemini validator returns PASS, with maximum 10 iterations.

## ARCHITECTURE

### Core Module: `strict_image_loop.js`

**Function: `runStrictImageLoop(config)`**

**Input Config:**
```javascript
{
  job: {
    job_id: string,
    render: { width, height, performance }
  },
  intakeRequest: {
    user_idea: string,
    phase: string,
    shot_type: string,
    priority_target: string,
    fail_signal: string[]
  },
  geminiIntake: object,
  validatorPromptPath: string,
  outputDir: string,
  fooocusUrl: string
}
```

**Output:**
```javascript
{
  final_status: "SUCCESS" | "MAX_ITERATIONS_REACHED" | "FAILED",
  total_iterations: number,
  max_iterations: 10,
  last_render_path: string,
  last_validator_output: object,
  history: [
    {
      iteration: number,
      status: "PASS" | "FAIL" | "RENDER_FAILED",
      fail_rules: string[],
      severity: string,
      render_path: string
    }
  ],
  timestamp: ISO8601
}
```

## PROCESS FLOW

### Iteration Loop (max 10)

1. **Generate Prompt Package**
   - Call `buildPromptPackageFromIntake(job, currentIntake, currentGeminiIntake)`
   - Save to `iteration_N/prompt_package.json`

2. **Render Image**
   - Call `executeRender()` with prompt package
   - Save to `iteration_N/render.png`
   - If render fails → break loop

3. **Validate with Gemini**
   - Call `runGeminiValidator(imagePath, validatorPromptPath)`
   - Save to `iteration_N/validator_output.json`

4. **Check Result**
   - If `pass_fail === "PASS"`:
     - Copy to `last_render.png`
     - Copy to `validator_output.json`
     - Break loop with SUCCESS
   - If `pass_fail === "FAIL"`:
     - Save fail reason to `iteration_N/gemini_fail_reason.txt`
     - Continue to feedback injection

5. **Convert Validator → Structured Feedback**
   ```javascript
   {
     iteration_type: "correction",
     fail_rules: string[],
     wrong_reads: string[],
     fix_direction: string[],
     severity: "HIGH" | "MEDIUM" | "LOW",
     summary: string,
     material_read: string,
     correct_reads: string[]
   }
   ```
   - Save to `iteration_N/structured_feedback.json`

6. **Inject Feedback into Intake**
   - Merge `fix_direction` into `priority_target`
   - Merge `wrong_reads` and `fail_rules` into `fail_signal`
   - Add `correction_context` object
   - Save to `iteration_N/corrected_intake.json`

7. **Loop to Step 1** with corrected intake

### Loop Termination

- **SUCCESS**: Gemini returns PASS
- **MAX_ITERATIONS_REACHED**: 10 iterations completed without PASS
- **FAILED**: Render execution error

## OUTPUT STRUCTURE

```
outputDir/
├── iteration_1/
│   ├── prompt_package.json
│   ├── render.png
│   ├── validator_output.json
│   ├── gemini_fail_reason.txt (if FAIL)
│   ├── structured_feedback.json (if FAIL)
│   └── corrected_intake.json (if FAIL)
├── iteration_2/
│   └── ...
├── iteration_N/
│   └── ...
├── last_render.png (final PASS image)
├── validator_output.json (final PASS validation)
└── loop_report.json (complete history)
```

## RULES

### No History Accumulation
- Each iteration uses **only** the last iteration's feedback
- No cumulative history tracking in prompt generation
- Previous iteration context is discarded

### Feedback Injection Strategy
- `fail_rules` → append to `fail_signal`
- `wrong_reads` → append to `fail_signal`
- `fix_direction` → append to `priority_target`
- `correction_context` → metadata only, not used in prompt

### Max Loop = 10
- Hard limit to prevent infinite loops
- Status = "MAX_ITERATIONS_REACHED" if limit hit

## USAGE

### Standalone Test
```bash
node test_strict_loop.js
```

### Integration Example
```javascript
const { runStrictImageLoop } = require("./strict_image_loop");

const report = await runStrictImageLoop({
  job: { job_id: "test_001", render: { width: 1024, height: 1024 } },
  intakeRequest: { user_idea: "white ceramic cube", phase: "material_study" },
  geminiIntake: { /* structured intake */ },
  validatorPromptPath: "./prompts/gemini_validator_rubric.txt",
  outputDir: "./runs/loop_test",
  fooocusUrl: "http://127.0.0.1:7865",
});

if (report.final_status === "SUCCESS") {
  console.log("Image validated:", report.last_render_path);
}
```

## DEPENDENCIES

- `gemini_validator.js` - Gemini validation execution
- `claude_spec_bridge.js` - Prompt package generation
- `render/render_executor.js` - Image rendering
- Gemini API key in `.env`
- Fooocus API running

## STATUS

**IMPLEMENTATION: COMPLETE**
- Core loop module: `strict_image_loop.js`
- Test runner: `test_strict_loop.js`
- Documentation: `STRICT_IMAGE_LOOP_SPEC.md`

**READY FOR EXECUTION**
