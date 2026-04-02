// FILE: D:\KAGAMI-MZ\render_executor_test.js

const { executeRender } = require("./render/render_executor");

(async () => {
  try {
    const result = await executeRender(
      { job_id: "test_job" },   // job
      null,                     // token (đã bypass)
      {},                       // normalizedSpec (dummy)
      {
        prompt: "minimalist white ceramic mask, hard surface, industrial design, matte, no face, no eyes, black background",
        negative_prompt: "human, face, eyes, anime, plastic, toy, soft, blurry",
        performance: "Quality"
      }
    );

    console.log("=== RESULT ===");
    console.log(JSON.stringify(result, null, 2));

    const output = result?.render?.output_file;

    if (output) {
      console.log("PNG PATH:", output);
    } else {
      console.log("NO OUTPUT FILE FOUND");
    }

  } catch (err) {
    console.error("ERROR:", err);
  }
})();