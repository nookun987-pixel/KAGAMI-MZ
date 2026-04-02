"use strict";

const path = require("path");

function loadModule(modulePath) {
  return require(path.resolve(__dirname, modulePath));
}

function pickFunction(moduleObj, names, label) {
  for (const name of names) {
    if (moduleObj && typeof moduleObj[name] === "function") {
      return moduleObj[name].bind(moduleObj);
    }
  }
  throw new Error(`[RUNTIME_ADAPTERS] Missing export for ${label}. Tried: ${names.join(", ")}`);
}

const ideaIntakeModule = loadModule("./idea_intake");
const geminiIntakeModule = loadModule("./gemini_intake");
const specBridgeModule = loadModule("./claude_spec_bridge");
const correctionBridgeModule = loadModule("./claude_correction_bridge");
const canonModule = loadModule("./control/canon_v2_control");
const geminiValidatorModule = loadModule("./gemini_validator");
const geminiConnectorModule = loadModule("./gemini_connector");
const renderModule = loadModule("./render/render_executor");
const fixBriefModule = loadModule("./fix_brief_builder");
const notionModule = loadModule("./memory/notion_logger");
const orchestratorModule = loadModule("./orchestrator");

const mappedExports = {
  normalizeIdeaRequest: pickFunction(ideaIntakeModule, ["normalizeIdeaRequest"], "idea intake"),
  runGeminiIntake: pickFunction(geminiIntakeModule, ["runGeminiIntake"], "gemini intake"),
  buildPromptPackageFromIntake: pickFunction(specBridgeModule, ["buildPromptPackageFromIntake"], "spec bridge"),
  buildCorrectedPromptPackage: pickFunction(correctionBridgeModule, ["buildCorrectedPromptPackage"], "correction bridge"),
  loadCanonV2: pickFunction(canonModule, ["loadCanonV2"], "canon loader"),
  applyCanonV2ToSpec: pickFunction(canonModule, ["applyCanonV2ToSpec"], "canon apply"),
  validateCanonJob: pickFunction(canonModule, ["validateCanonJob"], "canon job validation"),
  validateCanonPromptPackage: pickFunction(canonModule, ["validateCanonPromptPackage"], "canon prompt validation"),
  runGeminiValidator: pickFunction(geminiValidatorModule, ["runGeminiValidator"], "gemini validator"),
  judgeRenderedImage: pickFunction(geminiConnectorModule, ["judgeRenderedImage"], "gemini connector"),
  validateGeminiRuntime: pickFunction(geminiConnectorModule, ["validateGeminiRuntime"], "gemini runtime probe"),
  executeRender: pickFunction(renderModule, ["executeRender"], "render executor"),
  buildRenderPacket: pickFunction(renderModule, ["buildRenderPacket"], "render packet"),
  abortRender: pickFunction(renderModule, ["abortRender"], "abort render"),
  buildFixBrief: pickFunction(fixBriefModule, ["buildFixBrief"], "fix brief"),
  createJobEntry: pickFunction(notionModule, ["createJobEntry"], "notion create"),
  updateJobState: pickFunction(notionModule, ["updateJobState"], "notion update"),
  writeAuditRecord: pickFunction(notionModule, ["writeAuditRecord"], "notion audit"),
  orchestrate: pickFunction(orchestratorModule, ["orchestrate"], "orchestrator"),
  runHealthCheck: pickFunction(orchestratorModule, ["runHealthCheck"], "orchestrator health"),
};

function wrapJson(fn) {
  return async (input) => {
    const result = await fn(input);
    return JSON.parse(JSON.stringify(result));
  };
}

module.exports = {
  mapped_export_names: {
    normalizeIdeaRequest: "normalizeIdeaRequest",
    runGeminiIntake: "runGeminiIntake",
    buildPromptPackageFromIntake: "buildPromptPackageFromIntake",
    buildCorrectedPromptPackage: "buildCorrectedPromptPackage",
    loadCanonV2: "loadCanonV2",
    applyCanonV2ToSpec: "applyCanonV2ToSpec",
    validateCanonJob: "validateCanonJob",
    validateCanonPromptPackage: "validateCanonPromptPackage",
    runGeminiValidator: "runGeminiValidator",
    judgeRenderedImage: "judgeRenderedImage",
    validateGeminiRuntime: "validateGeminiRuntime",
    executeRender: "executeRender",
    buildRenderPacket: "buildRenderPacket",
    abortRender: "abortRender",
    buildFixBrief: "buildFixBrief",
    createJobEntry: "createJobEntry",
    updateJobState: "updateJobState",
    writeAuditRecord: "writeAuditRecord",
    orchestrate: "orchestrate",
    runHealthCheck: "runHealthCheck",
  },
  normalizeIdeaRequest: wrapJson(mappedExports.normalizeIdeaRequest),
  runGeminiIntake: wrapJson((input) => mappedExports.runGeminiIntake(input.intakeRequest, input.promptPath)),
  buildPromptPackageFromIntake: wrapJson((input) =>
    mappedExports.buildPromptPackageFromIntake(input.job, input.intakeRequest, input.geminiIntake)
  ),
  buildCorrectedPromptPackage: wrapJson((input) =>
    mappedExports.buildCorrectedPromptPackage(input.promptPackage, input.fixBrief)
  ),
  loadCanonV2: async (input) => mappedExports.loadCanonV2(input && input.paths ? input.paths : undefined),
  applyCanonV2ToSpec: async (input) => mappedExports.applyCanonV2ToSpec(input.spec, input.canon),
  validateCanonJob: async (input) => mappedExports.validateCanonJob(input.job, input.canon),
  validateCanonPromptPackage: async (input) =>
    mappedExports.validateCanonPromptPackage(input.spec, input.positivePrompt, input.negativePrompt, input.canon, input.shotType || null),
  runGeminiValidator: wrapJson((input) => mappedExports.runGeminiValidator(input.imagePath, input.promptPath)),
  judgeRenderedImage: wrapJson((input) => mappedExports.judgeRenderedImage(input.imagePath, input.context || {})),
  validateGeminiRuntime: wrapJson(() => mappedExports.validateGeminiRuntime()),
  executeRender: wrapJson((input) =>
    mappedExports.executeRender(input.job, input.controlToken, input.normalizedSpec, input.renderOpts)
  ),
  buildRenderPacket: wrapJson((input) => mappedExports.buildRenderPacket(input.translationResult, input.renderOpts)),
  abortRender: wrapJson((input) => mappedExports.abortRender(input.jobId, input.reason)),
  buildFixBrief: wrapJson((input) =>
    mappedExports.buildFixBrief(
      input.job,
      input.localValidation,
      input.geminiValidation,
      input.promptPackage,
      input.phaseContext
    )
  ),
  notion: {
    createJobEntry: wrapJson((input) => mappedExports.createJobEntry(input.job)),
    updateJobState: wrapJson((input) => mappedExports.updateJobState(input.notionId, input.updates)),
    writeAuditRecord: wrapJson((input) => mappedExports.writeAuditRecord(input.notionId, input.job, input.results)),
  },
  orchestrate: wrapJson((input) => mappedExports.orchestrate(input.job)),
  runHealthCheck: wrapJson(() => mappedExports.runHealthCheck()),
};
