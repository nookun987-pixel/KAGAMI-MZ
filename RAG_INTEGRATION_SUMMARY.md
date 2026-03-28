# Mikage RAG Integration

## Overview
Added Vertex AI Search integration to enable Mikage to query its own cloud brain for relevant context.

## Files Created/Modified

### 1. `/rag/vertex_retriever.js` (NEW)
- Google Vertex AI Search client
- `queryMikageBrain(query)` function
- `getMikageMemoryContext(query)` for prompt injection
- Fallback handling on connection errors

### 2. `orchestrator.js` (MODIFIED)
- Added RAG import: `const { getMikageMemoryContext } = require("./rag/vertex_retriever");`
- Added RAG query before Gemini intake (line 3045-3053)
- Injects memory context into intake request

### 3. `package.json` (MODIFIED)
- Added dependency: `@google-cloud/discoveryengine`

## Configuration
- Project ID: `gen-lang-client-0440215253`
- Location: `global`
- Data Store ID: `mikage-brain_1774647243976`

## Integration Flow
1. Job intake → normalize request
2. Query Mikage Brain with: `{shot_type} {generation_mode} {user_idea}`
3. Retrieve top 5 relevant documents
4. Inject context into intake request
5. Pass to Gemini intake with memory context
6. Continue normal pipeline

## Prompt Format
```
=== MIKAGE MEMORY CONTEXT ===
Query: WEAPON_MACRO reproduction sword study
Found 3 relevant memories:

[MEMORY 1]
Source: final_decision.json (weapon-macro-002)
Relevance: 0.92
Content: Weapon macro reproduction failed due to preservation issues...

[MEMORY 2]
Source: STRUCTURED_RULES.json (canon)
Relevance: 0.87
Content: Weapon identity rules: sharp edges, forged metal read...

============================
```

## Fallback Behavior
- If RAG fails → continue normal pipeline
- If no results → continue without memory context
- Errors logged but don't block execution

## Usage
The integration is now active. Mikage will automatically query its cloud brain for relevant past experiences, rules, and failures to inform current decisions.
