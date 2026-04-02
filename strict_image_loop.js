"use strict";

const fs = require("fs");
const path = require("path");
const { runGeminiValidator } = require("./gemini_validator");
const { buildPromptPackageFromIntake } = require("./claude_spec_bridge");
const { executeRender } = require("./render/render_executor");
const { issueToken } = require("./control/precheck");

const MAX_LOOP_ITERATIONS = 10;

function extractFailType(validatorOutput) {
  if (!validatorOutput || validatorOutput.pass_fail === "PASS") {
    return null;
  }

  const failRules = validatorOutput.fail_rules || [];
  const wrongReads = validatorOutput.wrong_reads || [];
  const allSignals = [...failRules, ...wrongReads].map(s => String(s).toLowerCase());

  const failTypes = [];
  if (allSignals.some(s => s.includes("plaster") || s.includes("gypsum") || s.includes("chalk") || s.includes("concrete"))) {
    failTypes.push("material_fail");
  }
  if (allSignals.some(s => s.includes("silhouette") || s.includes("contour") || s.includes("shape"))) {
    failTypes.push("silhouette_fail");
  }
  if (allSignals.some(s => s.includes("human") || s.includes("face") || s.includes("eyes"))) {
    failTypes.push("human_face_detected");
  }
  if (allSignals.some(s => s.includes("abstract") || s.includes("texture-only") || s.includes("atmosphere-first"))) {
    failTypes.push("abstract_render");
  }
  if (allSignals.some(s => s.includes("seam") || s.includes("edge placement"))) {
    failTypes.push("seam_placement_fail");
  }
  if (allSignals.some(s => s.includes("canon") || s.includes("drift"))) {
    failTypes.push("canon_drift");
  }
  if (allSignals.some(s => s.includes("unreadable") || s.includes("not readable") || s.includes("unclear object"))) {
    failTypes.push("unreadable_object");
  }
  if (failTypes.length === 0) {
    failTypes.push("other_explicit");
  }

  return {
    fail_types: failTypes,
    raw_fail_rules: failRules,
    raw_wrong_reads: wrongReads,
  };
}

function generateIntakeDiff(before, after) {
  const lines = [];
  lines.push("=== INTAKE DIFF ===");
  lines.push("");

  if (before.priority_target !== after.priority_target) {
    lines.push("[priority_target]");
    lines.push(`- BEFORE: ${before.priority_target || "(empty)"}`);
    lines.push(`+ AFTER:  ${after.priority_target || "(empty)"}`);
    lines.push("");
  }

  const beforeFailSignal = Array.isArray(before.fail_signal) ? before.fail_signal : [];
  const afterFailSignal = Array.isArray(after.fail_signal) ? after.fail_signal : [];
  if (JSON.stringify(beforeFailSignal) !== JSON.stringify(afterFailSignal)) {
    lines.push("[fail_signal]");
    lines.push(`- BEFORE: ${beforeFailSignal.length} items`);
    lines.push(`+ AFTER:  ${afterFailSignal.length} items`);
    const added = afterFailSignal.filter(s => !beforeFailSignal.includes(s));
    if (added.length > 0) {
      lines.push(`  ADDED: ${added.join(", ")}`);
    }
    lines.push("");
  }

  if (after.correction_context && !before.correction_context) {
    lines.push("[correction_context]");
    lines.push("+ ADDED: correction_context object");
    lines.push("");
  }

  if (lines.length === 2) {
    lines.push("(no changes detected)");
  }

  return lines.join("\n");
}

function convertValidatorToStructuredFeedback(validatorOutput) {
  if (!validatorOutput || validatorOutput.pass_fail === "PASS") {
    return null;
  }

  const feedback = {
    iteration_type: "correction",
    fail_rules: validatorOutput.fail_rules || [],
    wrong_reads: validatorOutput.wrong_reads || [],
    fix_direction: validatorOutput.fix_direction || [],
    severity: validatorOutput.severity || "HIGH",
    summary: validatorOutput.summary || "Validation failed",
    material_read: validatorOutput.material_read || "unknown",
    correct_reads: validatorOutput.correct_reads || [],
  };

  return feedback;
}

function injectFeedbackIntoIntake(intakeRequest, structuredFeedback) {
  if (!structuredFeedback) {
    return intakeRequest;
  }

  const correctedIntake = {
    ...intakeRequest,
    correction_context: {
      fail_rules: structuredFeedback.fail_rules,
      wrong_reads: structuredFeedback.wrong_reads,
      fix_direction: structuredFeedback.fix_direction,
      severity: structuredFeedback.severity,
    },
    priority_target: [
      intakeRequest.priority_target || "",
      ...structuredFeedback.fix_direction,
    ].filter(Boolean).join(". "),
    fail_signal: [
      ...(Array.isArray(intakeRequest.fail_signal) ? intakeRequest.fail_signal : []),
      ...structuredFeedback.wrong_reads,
      ...structuredFeedback.fail_rules,
    ],
  };

  return correctedIntake;
}

async function runStrictImageLoop(config) {
  const {
    job,
    intakeRequest,
    geminiIntake,
    validatorPromptPath,
    outputDir,
    fooocusUrl,
  } = config;

  const loopState = {
    iteration: 0,
    lastRenderPath: null,
    lastValidatorOutput: null,
    lastPromptPackage: null,
    history: [],
  };

  let currentIntake = intakeRequest;
  let currentGeminiIntake = geminiIntake;

  while (loopState.iteration < MAX_LOOP_ITERATIONS) {
    loopState.iteration++;
    console.log(`[STRICT_LOOP] Iteration ${loopState.iteration}/${MAX_LOOP_ITERATIONS}`);

    const attemptNum = String(loopState.iteration).padStart(2, "0");
    const iterationDir = path.join(outputDir, `attempt-${attemptNum}`);
    fs.mkdirSync(iterationDir, { recursive: true });

    const intakeBefore = JSON.parse(JSON.stringify(currentIntake));
    fs.writeFileSync(
      path.join(iterationDir, "intake_before.json"),
      JSON.stringify(intakeBefore, null, 2),
      "utf-8"
    );

    const promptPackage = buildPromptPackageFromIntake(
      job,
      currentIntake,
      currentGeminiIntake
    );
    loopState.lastPromptPackage = promptPackage;

    fs.writeFileSync(
      path.join(iterationDir, "render_payload.json"),
      JSON.stringify(promptPackage, null, 2),
      "utf-8"
    );

    console.log(`[STRICT_LOOP] Rendering iteration ${loopState.iteration}...`);
    const renderJobId = `${job.job_id}_loop_${loopState.iteration}`;
    const controlToken = issueToken(renderJobId, 600);
    
    const renderJob = {
      job_id: renderJobId,
      render: {
        width: (promptPackage.render_spec && promptPackage.render_spec.width) || 1024,
        height: (promptPackage.render_spec && promptPackage.render_spec.height) || 1024,
        performance: (promptPackage.render_spec && promptPackage.render_spec.performance) || "Quality",
      },
    };
    
    const renderSpec = {};
    
    const renderOpts = {
      prompt: promptPackage.structured_prompt || promptPackage.prompt,
      negative_prompt: promptPackage.negative_prompt,
      fooocus_url: fooocusUrl,
      output_dir: iterationDir,
    };
    
    let renderResult;
    try {
      renderResult = await executeRender(renderJob, controlToken, renderSpec, renderOpts);
    } catch (error) {
      console.error(`[STRICT_LOOP] Render execution error at iteration ${loopState.iteration}:`, error.message);
      fs.writeFileSync(
        path.join(iterationDir, "render_error.txt"),
        `${error.message}\n\n${error.stack}`,
        "utf-8"
      );
      loopState.history.push({
        iteration: loopState.iteration,
        status: "RENDER_FAILED",
        error: error.message,
      });
      break;
    }

    const outputFile = renderResult && (renderResult.output_file || (renderResult.render && renderResult.render.output_file));
    if (!renderResult || !outputFile || !fs.existsSync(outputFile)) {
      const errorMsg = !renderResult ? "No render result returned" : !outputFile ? "No output_file in result" : "Output file does not exist";
      console.error(`[STRICT_LOOP] Render failed at iteration ${loopState.iteration}: ${errorMsg}`);
      fs.writeFileSync(
        path.join(iterationDir, "render_error.txt"),
        `${errorMsg}\nRender result: ${JSON.stringify(renderResult, null, 2)}`,
        "utf-8"
      );
      loopState.history.push({
        iteration: loopState.iteration,
        status: "RENDER_FAILED",
        error: errorMsg,
      });
      break;
    }

    loopState.lastRenderPath = outputFile;
    fs.copyFileSync(
      outputFile,
      path.join(iterationDir, "output.png")
    );

    console.log(`[STRICT_LOOP] Validating iteration ${loopState.iteration}...`);
    const validatorOutput = await runGeminiValidator(
      outputFile,
      validatorPromptPath
    );
    loopState.lastValidatorOutput = validatorOutput;

    fs.writeFileSync(
      path.join(iterationDir, "gemini_validation.json"),
      JSON.stringify(validatorOutput, null, 2),
      "utf-8"
    );

    const failTypeData = extractFailType(validatorOutput);
    if (failTypeData) {
      fs.writeFileSync(
        path.join(iterationDir, "fail_type.json"),
        JSON.stringify(failTypeData, null, 2),
        "utf-8"
      );
    }

    loopState.history.push({
      iteration: loopState.iteration,
      status: validatorOutput.pass_fail,
      fail_rules: validatorOutput.fail_rules || [],
      severity: validatorOutput.severity,
      render_path: outputFile,
    });

    if (validatorOutput.pass_fail === "PASS") {
      console.log(`[STRICT_LOOP] ✓ PASS at iteration ${loopState.iteration}`);
      fs.copyFileSync(
        outputFile,
        path.join(outputDir, "last_render.png")
      );
      fs.writeFileSync(
        path.join(outputDir, "validator_output.json"),
        JSON.stringify(validatorOutput, null, 2),
        "utf-8"
      );
      break;
    }

    console.log(`[STRICT_LOOP] ✗ FAIL at iteration ${loopState.iteration}: ${validatorOutput.summary}`);
    fs.writeFileSync(
      path.join(iterationDir, "gemini_fail_reason.txt"),
      validatorOutput.summary || "Unknown failure",
      "utf-8"
    );

    const structuredFeedback = convertValidatorToStructuredFeedback(validatorOutput);
    fs.writeFileSync(
      path.join(iterationDir, "structured_feedback.json"),
      JSON.stringify(structuredFeedback, null, 2),
      "utf-8"
    );

    currentIntake = injectFeedbackIntoIntake(intakeBefore, structuredFeedback);
    fs.writeFileSync(
      path.join(iterationDir, "intake_after.json"),
      JSON.stringify(currentIntake, null, 2),
      "utf-8"
    );

    const diffText = generateIntakeDiff(intakeBefore, currentIntake);
    fs.writeFileSync(
      path.join(iterationDir, "intake_diff.txt"),
      diffText,
      "utf-8"
    );
  }

  const finalStatus = loopState.lastValidatorOutput && loopState.lastValidatorOutput.pass_fail === "PASS"
    ? "SUCCESS"
    : loopState.iteration >= MAX_LOOP_ITERATIONS
      ? "MAX_ITERATIONS_REACHED"
      : "FAILED";

  const loopReport = {
    final_status: finalStatus,
    total_iterations: loopState.iteration,
    max_iterations: MAX_LOOP_ITERATIONS,
    last_render_path: loopState.lastRenderPath,
    last_validator_output: loopState.lastValidatorOutput,
    history: loopState.history,
    timestamp: new Date().toISOString(),
  };

  fs.writeFileSync(
    path.join(outputDir, "run_summary.json"),
    JSON.stringify(loopReport, null, 2),
    "utf-8"
  );

  const firstIterationFailed = loopState.history.length > 0 && loopState.history[0].status === "FAIL";
  const feedbackGenerated = loopState.history.some(h => h.status === "FAIL");
  const rerenderExecuted = loopState.iteration > 1;

  const finalVerdict = {
    loop_executed: loopState.iteration > 0,
    real_render_executed: loopState.history.some(h => h.render_path),
    gemini_validation_executed: loopState.lastValidatorOutput && loopState.lastValidatorOutput.gemini_validation_executed === true,
    first_iteration_failed: firstIterationFailed,
    feedback_generated: feedbackGenerated,
    intake_mutated_after_fail: feedbackGenerated && loopState.iteration > 1,
    rerender_executed: rerenderExecuted,
    pass_achieved: finalStatus === "SUCCESS",
    max_iterations_reached: finalStatus === "MAX_ITERATIONS_REACHED",
    total_iterations: loopState.iteration,
    verdict: (loopState.iteration >= 2 && firstIterationFailed && rerenderExecuted)
      ? "REAL_LOOP_CONFIRMED"
      : loopState.iteration > 0
        ? "LOOP_EXECUTED_BUT_NOT_PROVEN"
        : "FAILED_TO_EXECUTE",
    reason: finalStatus === "SUCCESS"
      ? `PASS achieved at iteration ${loopState.iteration}`
      : finalStatus === "MAX_ITERATIONS_REACHED"
        ? `Max iterations reached without PASS`
        : loopState.iteration === 0
          ? "Loop never started"
          : `Loop stopped at iteration ${loopState.iteration}`,
  };

  fs.writeFileSync(
    path.join(outputDir, "final_verdict.json"),
    JSON.stringify(finalVerdict, null, 2),
    "utf-8"
  );

  return loopReport;
}

module.exports = {
  runStrictImageLoop,
  convertValidatorToStructuredFeedback,
  injectFeedbackIntoIntake,
};
