"""
MIKAGE PIPELINE — rag_retriever.py
Python RAG retriever for Vertex AI / Mikage Brain
"""

import os
import json
import logging
from pathlib import Path
from typing import Optional, Dict, List

try:
    from google.cloud import discoveryengine_v1 as discoveryengine
    from google.api_core.client_options import ClientOptions
    VERTEX_AVAILABLE = True
except ImportError:
    VERTEX_AVAILABLE = False

log = logging.getLogger("mikage.rag")

# Configuration (from JS vertex_retriever_real.js)
PROJECT_ID = "gen-lang-client-0440215253"
LOCATION = "global"
DATA_STORE_ID = "mikage-brain_1774647243976"


def get_credential_status() -> Dict:
    """Check if Vertex AI credentials are available."""
    google_application_credentials = (os.getenv("GOOGLE_APPLICATION_CREDENTIALS") or "").strip()
    mikage_google_application_credentials = (os.getenv("MIKAGE_GOOGLE_APPLICATION_CREDENTIALS") or "").strip()
    google_application_credentials_json = (os.getenv("GOOGLE_APPLICATION_CREDENTIALS_JSON") or "").strip()
    repo_credentials_file = Path("repo_credentials") / "gsheet_key.json"

    credential_sources = [
        ("GOOGLE_APPLICATION_CREDENTIALS", Path(google_application_credentials) if google_application_credentials else None),
        ("MIKAGE_GOOGLE_APPLICATION_CREDENTIALS", Path(mikage_google_application_credentials) if mikage_google_application_credentials else None),
        ("GOOGLE_APPLICATION_CREDENTIALS_JSON", google_application_credentials_json if google_application_credentials_json else None),
        ("repo_credentials/gsheet_key.json", repo_credentials_file if repo_credentials_file.exists() else None),
    ]

    resolved_source = None
    resolved_path = None
    resolved_json = None

    for source_name, candidate in credential_sources:
        if candidate is None:
            continue
        if source_name == "GOOGLE_APPLICATION_CREDENTIALS_JSON":
            resolved_source = source_name
            resolved_json = candidate
            break
        if isinstance(candidate, Path) and candidate.exists():
            resolved_source = source_name
            resolved_path = candidate
            break

    status = {
        "credentials_file_present": bool(resolved_path),
        "credentials_env_present": bool(
            google_application_credentials
            or mikage_google_application_credentials
            or google_application_credentials_json
        ),
        "credentials_file_readable": False,
        "service_account_json_parse_ok": False,
        "credential_lookup_source": resolved_source,
        "credential_lookup_path": str(resolved_path) if resolved_path else "",
        "credential_lookup_json_present": bool(resolved_json),
        "project_id_present": bool(PROJECT_ID),
        "datastore_config_present": bool(DATA_STORE_ID),
    }
    
    if resolved_json:
        try:
            json.loads(resolved_json)
            status["credentials_file_readable"] = True
            status["service_account_json_parse_ok"] = True
        except Exception as e:
            log.warning(f"Credential JSON parse error: {e}")
    elif resolved_path:
        try:
            with open(resolved_path) as f:
                json.load(f)
            status["credentials_file_readable"] = True
            status["service_account_json_parse_ok"] = True
        except Exception as e:
            log.warning(f"Credential file read/parse error: {e}")
    
    return status


def query_mikage_brain(query: str, top_k: int = 5) -> Dict:
    """
    Query Mikage Brain via Vertex AI Discovery Engine.
    Falls back to mock if credentials not available.
    """
    cred_status = get_credential_status()
    
    # Check if we can use real Vertex
    if not VERTEX_AVAILABLE:
        log.warning("[RAG] Vertex AI SDK not installed, using mock")
        return _mock_query(query, cred_status, "vertex_sdk_not_installed")
    
    if not (
        cred_status["credentials_file_present"]
        or cred_status["credentials_env_present"]
        or cred_status["credential_lookup_json_present"]
    ):
        log.warning("[RAG] No credentials found, using mock")
        return _mock_query(query, cred_status, "no_credentials")
    
    try:
        log.info(f"[RAG] Querying real Vertex AI: {query}")
        
        # Set credentials path if a file-based credential was resolved.
        if cred_status["credential_lookup_path"]:
            os.environ["GOOGLE_APPLICATION_CREDENTIALS"] = cred_status["credential_lookup_path"]
        
        # Initialize client
        client_options = ClientOptions(api_endpoint=f"{LOCATION}-discoveryengine.googleapis.com")
        client = discoveryengine.SearchServiceClient(client_options=client_options)
        
        # Build serving config
        serving_config = client.serving_config_path(
            project=PROJECT_ID,
            location=LOCATION,
            data_store=DATA_STORE_ID,
            serving_config="default_config",
        )
        
        # Build request
        request = discoveryengine.SearchRequest(
            serving_config=serving_config,
            query=query,
            page_size=top_k,
            query_expansion_spec=discoveryengine.SearchRequest.QueryExpansionSpec(
                condition=discoveryengine.SearchRequest.QueryExpansionSpec.Condition.AUTO,
            ),
            spell_correction_spec=discoveryengine.SearchRequest.SpellCorrectionSpec(
                mode=discoveryengine.SearchRequest.SpellCorrectionSpec.Mode.AUTO,
            ),
        )
        
        # Execute search
        response = client.search(request)
        
        # Parse results
        chunks = []
        sources = []
        
        for result in response.results:
            chunk = result.chunk
            if chunk:
                chunk_data = {
                    "id": chunk.id,
                    "content": chunk.content,
                    "score": getattr(result, 'relevance_score', 0.85),
                    "metadata": {
                        "title": getattr(chunk.document, 'name', 'unknown'),
                        "uri": getattr(chunk.document, 'uri', ''),
                        "source": "vertex_ai_search"
                    }
                }
                chunks.append(chunk_data)
                sources.append({
                    "id": chunk.id,
                    "title": chunk_data["metadata"]["title"],
                    "uri": chunk_data["metadata"]["uri"],
                    "score": chunk_data["score"]
                })
        
        log.info(f"[RAG] Retrieved {len(chunks)} chunks from Vertex AI")
        
        return {
            "chunks": chunks,
            "sources": sources,
            "query": query,
            "totalResults": len(chunks),
            "retriever_mode": "vertex",
            "real_vertex_verified": True,
            "fallback_used": False,
            "error": None,
            "credential_status": cred_status
        }
        
    except Exception as e:
        log.error(f"[RAG] Vertex AI query failed: {e}")
        return _mock_query(query, cred_status, f"vertex_error: {str(e)}")


def _mock_query(query: str, cred_status: Dict, error_reason: str) -> Dict:
    """Generate mock results when Vertex AI unavailable."""
    log.info(f"[RAG] Using mock retriever (reason: {error_reason})")
    
    mock_chunks = [
        {
            "id": "mock_chunk_1",
            "content": f"Previous {query.split()[0] if query else 'mask'} run failed due to abstract composition issues. Need stronger subject presence and clearer manufactured object read.",
            "score": 0.92,
            "metadata": {
                "title": "final_decision.json",
                "uri": "runs/previous_run/final_decision.json",
                "source": "validation_failure"
            }
        },
        {
            "id": "mock_chunk_2",
            "content": f"{query.split()[0] if query else 'mask'} canon rules require: 1) Clear subject silhouette 2) Manufactured object readability 3) No abstract atmosphere 4) Material-first composition",
            "score": 0.87,
            "metadata": {
                "title": "STRUCTURED_RULES.json",
                "uri": "canon/STRUCTURED_RULES.json",
                "source": "canon_rules"
            }
        }
    ]
    
    sources = [{
        "id": c["id"],
        "title": c["metadata"]["title"],
        "uri": c["metadata"]["uri"],
        "score": c["score"]
    } for c in mock_chunks]
    
    return {
        "chunks": mock_chunks,
        "sources": sources,
        "query": query,
        "totalResults": len(mock_chunks),
        "retriever_mode": "mock",
        "real_vertex_verified": False,
        "fallback_used": True,
        "error": error_reason,
        "credential_status": cred_status
    }


def format_rag_context(query_result: Dict) -> str:
    """Format RAG results into prompt context string."""
    chunks = query_result.get("chunks", [])
    if not chunks:
        return ""
    
    context = "=== MIKAGE MEMORY CONTEXT ===\n"
    context += f"Query: {query_result.get('query', '')}\n"
    context += f"Found {len(chunks)} relevant memories:\n\n"
    
    for i, chunk in enumerate(chunks, 1):
        context += f"[MEMORY {i}]\n"
        context += f"Source: {chunk['metadata']['title']} ({chunk['metadata']['source']})\n"
        context += f"Relevance: {chunk['score']}\n"
        context += f"Content: {chunk['content']}\n\n"
    
    context += "============================\n"
    return context


def get_mikage_memory_context(query: str, top_k: int = 5) -> tuple:
    """
    Main entry point: query and format context.
    Returns: (context_string, raw_result_dict)
    """
    result = query_mikage_brain(query, top_k)
    context = format_rag_context(result)
    return context, result
