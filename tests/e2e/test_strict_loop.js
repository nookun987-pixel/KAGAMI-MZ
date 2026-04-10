"use strict";

const path = require("path");
const { runStrictImageLoop } = require("./strict_image_loop");

async function testStrictLoop() {
  const job = {
    job_id: "test_strict_loop_001",
    render: {
      width: 1024,
      height: 1024,
      performance: "Quality",
    },
  };

  const intakeRequest = {
    user_idea: "white ceramic cube",
    phase: "material_study",
    shot_type: "MATERIAL_MACRO",
    priority_target: "matte ceramic material readability",
    fail_signal: [],
  };

  const geminiIntake = {
    creative_intent: "Manufactured object study with locked material identity",
    subject: {
      type: "manufactured_object",
      identity: "white ceramic cube",
      must_have: [
        "exactly one manufactured object as the clear subject",
        "visible contour evidence such as edge, rim, bevel, seam, or curvature",
      ],
      must_not_have: [
        "texture-only crop",
        "abstract-first composition",
      ],
    },
    material: {
      primary: "matte B4C technical ceramic",
      surface: "porcelain-white eggshell microtexture",
      finish: "dry matte engineered finish",
      forbidden_reads: [
        "plaster",
        "gypsum",
        "glossy plastic",
      ],
    },
    composition: {
      shot_type: "macro product study",
      framing: "single dominant object, centered",
      camera: "macro close-up with readable contour evidence",
      background: "controlled minimal background",
    },
    lighting: {
      style: "controlled low-key product lighting",
      constraints: [
        "no ambient color wash",
        "no neon spill",
      ],
    },
  };

  const config = {
    job,
    intakeRequest,
    geminiIntake,
    validatorPromptPath: path.resolve(__dirname, "prompts/gemini_validator_rubric.txt"),
    outputDir: path.resolve(__dirname, "runs", `strict_loop_${Date.now()}`),
    fooocusUrl: process.env.FOOOCUS_API || "http://127.0.0.1:7865",
  };

  console.log("[TEST] Starting strict image loop test...");
  console.log(`[TEST] Output directory: ${config.outputDir}`);

  try {
    const report = await runStrictImageLoop(config);
    console.log("\n[TEST] Loop completed!");
    console.log(`[TEST] Final status: ${report.final_status}`);
    console.log(`[TEST] Total iterations: ${report.total_iterations}`);
    console.log(`[TEST] Last render: ${report.last_render_path}`);
    
    if (report.final_status === "SUCCESS") {
      console.log("\n✓ Test PASSED - Image validated successfully");
    } else {
      console.log(`\n✗ Test FAILED - ${report.final_status}`);
    }

    return report;
  } catch (error) {
    console.error("[TEST] Error during loop execution:", error);
    throw error;
  }
}

if (require.main === module) {
  testStrictLoop()
    .then(() => {
      console.log("\n[TEST] Test execution complete");
      process.exit(0);
    })
    .catch((error) => {
      console.error("\n[TEST] Test execution failed:", error);
      process.exit(1);
    });
}

module.exports = { testStrictLoop };
