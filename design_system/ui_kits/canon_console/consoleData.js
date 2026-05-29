/* MIKAGE ZENITH — Canon Console DEMO DATA

   ⚠ SAMPLE / MOCK ONLY. Nothing here is canon or verified.
   - Task ids/titles/seeds/prompt specs are placeholders, not real studio jobs.
   - Every gate verdict is UNCONFIRMED. PASS / HOLD / HARD FAIL are NEVER asserted.
   - The gate library codes/descriptions are drawn from the source canon drift-check table
     (definitions only); per-task RESULTS are withheld as UNCONFIRMED. */
window.MZ_CONSOLE = {
  mode: "SAMPLE",
  banner: "SAMPLE / MOCK — illustrative only, not canon.",
  stages: ["GEMINI_INTAKE","PRECHECK","CLAUDE_SPEC","RENDER","VALIDATOR","JUDGE"],

  /* Faithful canon checklist (definitions only — no results). */
  gateLibrary: {
    "D-01": "Helmet sensor slits — exactly two ultra-thin void-black horizontal slits",
    "D-03": "No human face — no eyes / nose / mouth / skin",
    "D-09": "Violet usage — accent only (halo, glyph, trace). Never a fill",
    "D-12": "Aesthetic axis — sacred-tech, not anime / mech / fantasy / samurai",
    "Z-01": "Void dominance — black-dominant frame, no full-screen wash",
    "H-04": "Negative space — high negative space preserved",
    "M-02": "Material stack — porcelain + graphene only, no warm drift"
  },

  /* All sample tasks: name = "SAMPLE TASK — UNCONFIRMED", state VOID, placeholders. */
  tasks: [
    { id:"SAMPLE / MOCK 01", title:"SAMPLE TASK — UNCONFIRMED", lane:"SAMPLE_LANE", stage:"VALIDATOR",
      state:"VOID", created:"—", seed:"SAMPLE", prompt:"SAMPLE PROMPT SPEC — NOT PROVIDED",
      gates:["D-01","D-09","D-12","Z-01","H-04"] },
    { id:"SAMPLE / MOCK 02", title:"SAMPLE TASK — UNCONFIRMED", lane:"SAMPLE_LANE", stage:"PRECHECK",
      state:"VOID", created:"—", seed:"SAMPLE", prompt:"SAMPLE PROMPT SPEC — NOT PROVIDED",
      gates:["D-01","D-09","Z-01","H-04"] },
    { id:"SAMPLE / MOCK 03", title:"SAMPLE TASK — UNCONFIRMED", lane:"SAMPLE_LANE", stage:"CLAUDE_SPEC",
      state:"VOID", created:"—", seed:"SAMPLE", prompt:"SAMPLE PROMPT SPEC — NOT PROVIDED",
      gates:["D-01","D-03","D-12","Z-01","M-02"] },
    { id:"SAMPLE / MOCK 04", title:"SAMPLE TASK — UNCONFIRMED", lane:"SAMPLE_LANE", stage:"GEMINI_INTAKE",
      state:"VOID", created:"—", seed:"SAMPLE", prompt:"SAMPLE PROMPT SPEC — NOT PROVIDED",
      gates:["D-09","Z-01"] }
  ]
};
