# REAL VERTEX CUTOVER CHECKLIST

## Preconditions
- Vertex credentials available
- Environment variables configured
- Real retriever module enabled
- Test query returns non-empty chunks

## Validation Steps
1. Enable USE_REAL_VERTEX_RAG=true
2. Run one live job
3. Confirm rag_context.json shows:
   - retriever_mode = vertex
   - rag_executed = true
   - real_vertex_verified = true
4. Confirm chunks are real, not mock
5. Confirm intake receives injected context
6. Confirm no fallback-only silent pass

## Pass Condition
Real Vertex retrieval executes successfully in live pipeline and artifacts prove it.
