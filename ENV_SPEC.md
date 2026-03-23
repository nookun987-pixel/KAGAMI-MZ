# ENV_SPEC.md

Locked: 2026-03-23
Source: `.env.example` + `grep -rn "process.env" across codebase`

## Variables Consumed By Code At Runtime

These are read by `process.env.*` in the codebase. If missing, defaults are used.

```
MIKAGE_NOTION_DB=abc123def456ghi789
```
- **Purpose:** Notion database ID for audit log storage
- **Consumed by:** `memory/notion_logger.js` line 25
- **Default if missing:** `""` (empty string — Notion writes will target no database)
- **Format:** 32-character alphanumeric Notion database ID

```
TRANSLATOR_MODE=LOCAL
```
- **Purpose:** Controls how structured prompts are converted to flat render strings
- **Consumed by:** `orchestrator.js` line 113
- **Default if missing:** `"LOCAL"`
- **Valid values:** `LOCAL` (deterministic string assembly, zero drift, recommended) or `OLLAMA` (LLM translation, requires Ollama running)
- **Format:** Plain string

```
RENDER_WIDTH=1024
```
- **Purpose:** Image width in pixels sent to Fooocus
- **Consumed by:** `orchestrator.js` line 260
- **Default if missing:** `1024`
- **Format:** Integer

```
RENDER_HEIGHT=384
```
- **Purpose:** Image height in pixels sent to Fooocus (384 = 2.76:1 aspect at 1024 wide)
- **Consumed by:** `orchestrator.js` line 261
- **Default if missing:** `384`
- **Format:** Integer

```
RENDER_PERFORMANCE=Quality
```
- **Purpose:** Fooocus rendering quality preset
- **Consumed by:** `orchestrator.js` line 262
- **Default if missing:** `"Quality"`
- **Format:** String matching Fooocus performance modes

## Variables Consumed By External Services

These are documented in `.env.example` and expected by Ollama/Fooocus/Notion SDK, but are NOT read by Mikage code via `process.env`. They are consumed by their respective services independently.

```
NOTION_API_KEY=ntn_xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx
```
- **Purpose:** Notion integration token for API authentication
- **Consumed by:** Notion SDK / HTTP client (external to Mikage modules)
- **Format:** `ntn_` prefix + 40+ character token

```
OLLAMA_HOST=http://localhost:11434
```
- **Purpose:** Ollama server base URL
- **Consumed by:** Ollama service configuration
- **Note:** Mikage hardcodes `http://localhost:11434/api/generate` in `translator/ollama_translate.js` line 25 and `render/vram_manager.js` line 262. Changing this env var alone does NOT change where Mikage connects.
- **Format:** URL with protocol and port

```
OLLAMA_MODEL=llama3
```
- **Purpose:** Default Ollama model name
- **Consumed by:** Ollama service configuration
- **Note:** Mikage hardcodes `"llama3"` in `translator/ollama_translate.js` line 26. Changing model requires editing code.
- **Format:** Ollama model identifier string

```
OLLAMA_KEEP_ALIVE=0
```
- **Purpose:** Forces Ollama to unload model from VRAM immediately after response
- **Consumed by:** Ollama server (environment variable)
- **Note:** Also hardcoded in `render/vram_manager.js` line 262 as a curl parameter
- **Format:** Integer seconds (0 = immediate unload, -1 = persistent)

```
FOOOCUS_API_URL=http://localhost:7865
```
- **Purpose:** Fooocus API endpoint for render submission
- **Consumed by:** Fooocus client (injectable in `render/render_executor.js`)
- **Note:** The default `_fooocusClient` in render_executor.js is a simulated stub. Production client must be injected with actual HTTP calls to this URL.
- **Format:** URL with protocol and port

```
FOOOCUS_ALWAYS_HIGH_VRAM=false
```
- **Purpose:** Fooocus `--always-high-vram` flag to keep model in VRAM
- **Consumed by:** Fooocus server launch configuration
- **Format:** `true` or `false`

```
MAX_RENDER_ATTEMPTS=3
```
- **Purpose:** Maximum render loop iterations
- **Consumed by:** Not directly read. Job schema `render.max_iteration` field is used. Documented for operator awareness.
- **Format:** Integer

```
LOG_LEVEL=info
```
- **Purpose:** Logging verbosity
- **Consumed by:** Not yet wired. Reserved for future use.
- **Format:** `debug`, `info`, `warn`, `error`

## Variables Reserved For Future Use

```
VLM_ENDPOINT=http://localhost:8080/v1/chat/completions
VLM_MODEL=qwen2-vl
```
- **Purpose:** Vision-Language Model endpoint for production vision critic
- **Currently:** Commented out in `.env.example`. Vision critic uses injectable stub by default.
- **Format:** Standard OpenAI-compatible API URL + model name

## Hardcoded Values That Behave Like Config

These are not env vars but are hardcoded constants that operators may want to change. Changing them requires editing the source file.

| Value | Location | Current |
|---|---|---|
| Ollama endpoint URL | `translator/ollama_translate.js:25` | `http://localhost:11434/api/generate` |
| Ollama model name | `translator/ollama_translate.js:26` | `llama3` |
| Ollama timeout | `translator/ollama_translate.js:27` | `60000` ms |
| Max re-translate attempts | `translator/ollama_translate.js:28` | `2` |
| Control token TTL | `control/precheck.js` `issueToken()` | `300` seconds |
| Notion max retries | `memory/notion_logger.js:27` | `5` |
| Notion base backoff delay | `memory/notion_logger.js:28` | `1000` ms |
| Notion max backoff delay | `memory/notion_logger.js:29` | `60000` ms |
| Notion rate limit | `memory/notion_logger.js:30` | `3` req/sec |
| Render default dimensions | `render/render_executor.js:147-148` | `1024 × 384` |
