# Mikage Zenith — Canon Console UI Kit

A high-fidelity recreation of the studio's **internal control plane** — the proof/canon
documentation surface and short-form visual task pages. This is the "direct, decision-first"
voice of the brand (vs. the calm public voice of the website).

Open **`index.html`** and click queue items in the left rail. A persistent **SAMPLE · MOCK**
banner makes clear this is illustrative data, not canon. Each task shows:

- **Pipeline stepper** — `GEMINI_INTAKE → PRECHECK → CLAUDE_SPEC → RENDER → VALIDATOR →
  JUDGE`, with the current stage lit.
- **Candidate preview** — a generative void frame (helmet or signal) with a `SAMPLE`
  watermark; seed shows `SAMPLE`.
- **Prompt spec** — a `[ SAMPLE — prompt spec not provided ]` placeholder (no invented specs).
- **Canon proof gates** — the faithful canon checklist (`D-01`, `D-03`, `D-09`, `D-12`,
  `Z-01`, …) sourced from the drift-check table. Every result reads **UNCONFIRMED** —
  PASS / HOLD / HARD FAIL are never asserted without verification.
- **Verdict bar** — overall state **UNCONFIRMED**; Approve·lock is disabled (a verified PASS
  requires source evidence or operator approval).

## Files
- `consoleData.js` — `window.MZ_CONSOLE`: SAMPLE/MOCK tasks (all UNCONFIRMED) + a faithful
  `gateLibrary` (canon checklist definitions only — no results). Placeholder seeds/prompts.
- `ConsoleApp.jsx` — the full console (banner, queue, stepper, candidate, gates, verdict bar).
- `index.html` — loads `../../colors_and_type.css` + React/Babel + the scripts above.

## Data safety
- **Nothing here is verified canon.** Gate codes/descriptions come from the source
  drift-check table; per-task **results are withheld as UNCONFIRMED**. To show a real PASS,
  wire in source-file evidence or operator approval and set the verdict explicitly.
- The colour key in the header (PASS / HOLD / HARD FAIL / UNCONFIRMED) is a legend only.
- Cosmetic recreation focused on proof/canon/task review — not a real backend, not analytics.
