# CURRENT RUNTIME PATH

## Live Entrypoint

- `start_mikage.bat`
- `MIKAGE/index.js`

## Ordered Runtime Path

1. `MIKAGE/modules/intake/index.js`
2. `MIKAGE/modules/generation/index.js`
3. `MIKAGE/modules/validation/index.js`
4. `MIKAGE/modules/decision/index.js`
5. `MIKAGE/modules/memory/index.js`

## Live Render Path

- Queue runtime: `runtime/drive_queue/runtime.js`
- Worker path: `runtime/colab_worker/colab_one_click_worker.ipynb`
- Render endpoint: `UNKNOWN_NOT_PROVEN`
- Output root: `G:/My Drive/mikage_runner/outputs/<job_id>`

## Fail Conditions

- no claim
- no result.json
- missing output.png
- malformed result.json
- validator fail
- Gemini unavailable on a quality-proof path

## Forbidden Endpoint

- raw Gradio as live endpoint -> UNTRUSTED
- any unproven HTTP endpoint -> UNKNOWN_NOT_PROVEN
