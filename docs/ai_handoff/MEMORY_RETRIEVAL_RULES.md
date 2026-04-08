# MEMORY RETRIEVAL RULES

## Query Order

Retrieve in this order:

1. lane
2. type
3. family_id if available
4. minimum trust score
5. recency
6. explicit limit

## Ranking

Entries are ranked by:

- `trust_score` descending
- `last_used` descending
- `created_at` descending

## Retrieval Guardrails

- return active entries only by default
- do not surface archived entries unless explicitly requested
- do not synthesize missing family ids
- do not return entries from unverified sources
