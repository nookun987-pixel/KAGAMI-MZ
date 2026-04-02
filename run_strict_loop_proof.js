"use strict";

const path = require("path");
const fs = require("fs");
const { runStrictImageLoop } = require("./strict_image_loop");
const { verifyBootstrap } = require("./bootstrap_verify");

async function runProof() {
  console.log("=".repeat(80));
  console.log("STRICT IMAGE LOOP PROOF EXECUTION");
  console.log("=".repeat(80));
  console.log();

  const bootstrapResult = await verifyBootstrap();
  if (!bootstrapResult.ready) {
    console.error("\n[PROOF] BOOTSTRAP FAILED - Cannot proceed");
    console.error("[PROOF] Blockers:");
    bootstrapResult.blockers.forEach((b, i) => {
      console.error(`  ${i + 1}. ${b}`);
    });
    console.error("\n[PROOF] Please resolve blockers and re-run.");
    process.exit(1);
  }

  console.log("[PROOF] Bootstrap verification PASSED\n");

  const timestamp = Date.now();
  const proofDir = path.resolve(__dirname, "runs", `STRICT_LOOP_PROOF_${timestamp}`);
  fs.mkdirSync(proofDir, { recursive: true });

  const job = {
    job_id: `strict_loop_proof_${timestamp}`,
    render: {
      width: 1024,
      height: 1024,
      performance: "Quality",
      seed: -1,
    },
  };

  const intakeRequest = {
    user_idea: "white ceramic cube",
    phase: "material_study",
    shot_type: "MATERIAL_MACRO",
    priority_target: "matte ceramic material readability with clear manufactured object",
    fail_signal: [],
  };

  const geminiIntake = {
    creative_intent: "Manufactured object study with locked material identity and immediate readability",
    subject: {
      type: "manufactured_object",
      identity: "white ceramic cube",
      must_have: [
        "exactly one manufactured object as the clear subject",
        "visible contour evidence such as edge, rim, bevel, seam, or curvature",
        "material visibly attached to the object, not floating as texture",
      ],
      must_not_have: [
        "texture-only crop",
        "atmosphere-first framing",
        "abstract-first composition",
        "subject dissolved into background",
      ],
    },
    material: {
      primary: "matte B4C technical ceramic",
      surface: "porcelain-white eggshell microtexture",
      finish: "dry matte engineered finish",
      forbidden_reads: [
        "plaster",
        "gypsum",
        "chalk",
        "concrete",
        "carved stone",
        "mineral banding",
        "rough rock",
        "glossy plastic",
        "PVC sheen",
        "toy-like finish",
      ],
    },
    composition: {
      shot_type: "macro product study",
      framing: "single dominant object, centered or compositionally dominant",
      camera: "macro close-up with readable contour evidence",
      background: "controlled minimal background",
    },
    lighting: {
      style: "controlled low-key product lighting",
      constraints: [
        "no ambient color wash",
        "no neon spill",
        "no glossy hotspots",
      ],
    },
    core_risks: [
      "abstract drift",
      "texture-only drift",
      "material misread as plaster, stone, or glossy plastic",
    ],
    anti_drift_rules: [
      "always preserve one clearly readable manufactured object",
      "do not let texture or atmosphere become the subject",
      "keep material identity locked and explicit",
    ],
    success_criteria: [
      "manufactured object read is immediate",
      "matte ceramic read is immediate",
      "image does not collapse into abstract texture or atmosphere",
    ],
  };

  const config = {
    job,
    intakeRequest,
    geminiIntake,
    validatorPromptPath: path.resolve(__dirname, "prompts", "gemini_validator_rubric.txt"),
    outputDir: proofDir,
    fooocusUrl: process.env.FOOOCUS_API || process.env.FOOOCUS_API_URL || "http://127.0.0.1:7865",
  };

  console.log("[PROOF] Configuration:");
  console.log(`  - Job ID: ${job.job_id}`);
  console.log(`  - Output Dir: ${proofDir}`);
  console.log(`  - Fooocus URL: ${config.fooocusUrl}`);
  console.log(`  - Validator Rubric: ${config.validatorPromptPath}`);
  console.log();

  const consoleLogPath = path.join(proofDir, "console_log.txt");
  const originalLog = console.log;
  const originalError = console.error;
  const logLines = [];

  console.log = (...args) => {
    const line = args.join(" ");
    logLines.push(line);
    originalLog(...args);
  };
  console.error = (...args) => {
    const line = "[ERROR] " + args.join(" ");
    logLines.push(line);
    originalError(...args);
  };

  try {
    console.log("[PROOF] Starting strict image loop...");
    console.log();

    const report = await runStrictImageLoop(config);

    console.log();
    console.log("=".repeat(80));
    console.log("PROOF EXECUTION COMPLETE");
    console.log("=".repeat(80));
    console.log();
    console.log(`Final Status: ${report.final_status}`);
    console.log(`Total Iterations: ${report.total_iterations}`);
    console.log(`Last Render: ${report.last_render_path || "N/A"}`);
    console.log();

    fs.writeFileSync(consoleLogPath, logLines.join("\n"), "utf-8");

    const finalVerdictPath = path.join(proofDir, "final_verdict.json");
    const runSummaryPath = path.join(proofDir, "run_summary.json");

    console.log("ARTIFACTS:");
    console.log(`  - Run folder: ${proofDir}`);
    console.log(`  - Final verdict: ${finalVerdictPath}`);
    console.log(`  - Run summary: ${runSummaryPath}`);
    console.log(`  - Console log: ${consoleLogPath}`);
    console.log();

    if (fs.existsSync(finalVerdictPath)) {
      const verdict = JSON.parse(fs.readFileSync(finalVerdictPath, "utf-8"));
      console.log("FINAL VERDICT:");
      console.log(`  - Verdict: ${verdict.verdict}`);
      console.log(`  - Reason: ${verdict.reason}`);
      console.log(`  - Loop Executed: ${verdict.loop_executed}`);
      console.log(`  - Real Render: ${verdict.real_render_executed}`);
      console.log(`  - Gemini Validation: ${verdict.gemini_validation_executed}`);
      console.log(`  - First Iteration Failed: ${verdict.first_iteration_failed}`);
      console.log(`  - Feedback Generated: ${verdict.feedback_generated}`);
      console.log(`  - Intake Mutated: ${verdict.intake_mutated_after_fail}`);
      console.log(`  - Rerender Executed: ${verdict.rerender_executed}`);
      console.log(`  - Pass Achieved: ${verdict.pass_achieved}`);
      console.log();

      if (verdict.verdict === "REAL_LOOP_CONFIRMED") {
        console.log("✓ PROOF SUCCESS: Loop is REAL");
      } else {
        console.log("✗ PROOF INCOMPLETE: Loop executed but not fully proven");
      }
    }

    console.log = originalLog;
    console.error = originalError;

    return report;
  } catch (error) {
    console.log = originalLog;
    console.error = originalError;

    console.error("\n[PROOF] EXECUTION FAILED");
    console.error(`[PROOF] Error: ${error.message}`);
    console.error(`[PROOF] Stack: ${error.stack}`);

    fs.writeFileSync(consoleLogPath, logLines.join("\n"), "utf-8");
    fs.writeFileSync(
      path.join(proofDir, "error.txt"),
      `${error.message}\n\n${error.stack}`,
      "utf-8"
    );

    throw error;
  }
}

if (require.main === module) {
  runProof()
    .then(() => {
      console.log("\n[PROOF] Execution complete");
      process.exit(0);
    })
    .catch((error) => {
      console.error("\n[PROOF] Execution failed:", error.message);
      process.exit(1);
    });
}

module.exports = { runProof };
