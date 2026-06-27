#!/usr/bin/env bash
# ============================================================================
# MIKAGE — RunPod Healthcheck Script (BRIDGE-ONLY MODE)
# Verifies all services are alive and paths are writable.
# Usage: bash /workspace/KAGAMI-MZ/deploy/runpod_healthcheck.sh
# ============================================================================
set -uo pipefail

WORKSPACE="/workspace"
PROJECT_DIR="${WORKSPACE}/KAGAMI-MZ"
LOGS_DIR="${WORKSPACE}/logs"
ENV_FILE="${PROJECT_DIR}/.env"

RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
NC='\033[0m'

PASS=0
FAIL=0
WARN=0

pass() { echo -e "  ${GREEN}[PASS]${NC} $*"; ((PASS++)); }
fail() { echo -e "  ${RED}[FAIL]${NC} $*"; ((FAIL++)); }
warn() { echo -e "  ${YELLOW}[WARN]${NC} $*"; ((WARN++)); }

if [ -f "$ENV_FILE" ]; then
    set -a
    source "$ENV_FILE"
    set +a
fi

FOOOCUS_BRIDGE_PORT="${FOOOCUS_BRIDGE_PORT:-7865}"
SERVER_PORT="${PORT:-3000}"
FOOOCUS_ROOT="${FOOOCUS_ROOT:-/workspace/Fooocus}"
FOOOCUS_OUTPUT_DIR="${FOOOCUS_OUTPUT_DIR:-${FOOOCUS_ROOT}/outputs}"

echo ""
echo "============================================"
echo "  MIKAGE HEALTHCHECK (BRIDGE-ONLY MODE)"
echo "  $(date -u +%Y-%m-%dT%H:%M:%SZ)"
echo "============================================"
echo ""

echo "── GPU ──"
if command -v nvidia-smi &>/dev/null; then
    GPU_NAME=$(nvidia-smi --query-gpu=name --format=csv,noheader 2>/dev/null || echo "unknown")
    GPU_MEM=$(nvidia-smi --query-gpu=memory.total --format=csv,noheader 2>/dev/null || echo "unknown")
    pass "GPU: $GPU_NAME ($GPU_MEM)"
else
    fail "nvidia-smi not found — no GPU detected"
fi

echo ""
echo "── Fooocus Bridge (port $FOOOCUS_BRIDGE_PORT) ──"
BRIDGE_RESP=$(curl -sf "http://127.0.0.1:${FOOOCUS_BRIDGE_PORT}/" 2>&1)
if [ $? -eq 0 ]; then
    pass "Fooocus Bridge responding on port $FOOOCUS_BRIDGE_PORT"
    if echo "$BRIDGE_RESP" | grep -qi '"status".*"ok"'; then
        pass "Bridge reports status: ok"
    else
        warn "Bridge responded but status unclear: ${BRIDGE_RESP:0:200}"
    fi
else
    fail "Fooocus Bridge NOT responding on port $FOOOCUS_BRIDGE_PORT"
fi

echo ""
echo "── Mikage Server (port $SERVER_PORT) ──"
SERVER_RESP=$(curl -sf "http://127.0.0.1:${SERVER_PORT}/health" 2>&1)
if [ $? -eq 0 ]; then
    pass "Mikage Server responding on port $SERVER_PORT"
    if echo "$SERVER_RESP" | grep -qi '"status".*"HEALTHY"'; then
        pass "Server health: HEALTHY"
    elif echo "$SERVER_RESP" | grep -qi '"status"'; then
        STATUS=$(echo "$SERVER_RESP" | grep -o '"status"[[:space:]]*:[[:space:]]*"[^"]*"' | head -1)
        warn "Server health: $STATUS"
    fi
else
    fail "Mikage Server NOT responding on port $SERVER_PORT"
fi

echo ""
echo "── Mikage Worker ──"
if tmux has-session -t mikage-worker 2>/dev/null; then
    pass "Worker tmux session alive"
else
    fail "Worker tmux session not found"
fi

echo ""
echo "── Writable Paths ──"
for DIR in "${PROJECT_DIR}/runs" "${PROJECT_DIR}/queue" "${PROJECT_DIR}/output" "${LOGS_DIR}" "${FOOOCUS_OUTPUT_DIR}"; do
    if [ -d "$DIR" ] && [ -w "$DIR" ]; then
        pass "$DIR writable"
    elif [ -d "$DIR" ]; then
        fail "$DIR exists but NOT writable"
    else
        fail "$DIR does not exist"
    fi
done

echo ""
echo "── Environment ──"
if [ -f "$ENV_FILE" ]; then
    pass ".env file exists"

    VAL=$(grep "^GEMINI_API_KEY=" "$ENV_FILE" 2>/dev/null | cut -d= -f2- || true)
    if [ -n "$VAL" ] && [ "$VAL" != "YOUR_GEMINI_API_KEY_HERE" ]; then
        pass "GEMINI_API_KEY is set"
    else
        fail "GEMINI_API_KEY is missing or placeholder"
    fi

    if grep -q "^FOOOCUS_API=http://127.0.0.1:7865" "$ENV_FILE" 2>/dev/null; then
        pass "FOOOCUS_API locked to bridge :7865"
    else
        fail "FOOOCUS_API is not locked to bridge :7865"
    fi

    if grep -q "7866" "$ENV_FILE" 2>/dev/null; then
        fail ".env still contains port 7866 reference (proxy leak)"
    else
        pass "No port 7866 references in .env"
    fi
else
    fail ".env file not found"
fi

echo ""
echo "── Python Venv ──"
if [ -f "${WORKSPACE}/venv/bin/activate" ]; then
    pass "Python venv exists at ${WORKSPACE}/venv"
else
    fail "Python venv not found at ${WORKSPACE}/venv"
fi

echo ""
echo "── Fooocus Installation ──"
if [ -d "${WORKSPACE}/Fooocus" ]; then
    pass "Fooocus dir exists at ${WORKSPACE}/Fooocus"
    if [ -f "${WORKSPACE}/Fooocus/entry_with_update.py" ]; then
        pass "Fooocus entry_with_update.py found"
    else
        warn "Fooocus entry_with_update.py not found (may be a different version)"
    fi
else
    fail "Fooocus not found at ${WORKSPACE}/Fooocus"
fi

echo ""
echo "── tmux Sessions ──"
for SESSION in mikage-bridge mikage-server mikage-worker; do
    if tmux has-session -t "$SESSION" 2>/dev/null; then
        pass "tmux session: $SESSION"
    else
        fail "tmux session missing: $SESSION"
    fi
done

echo ""
echo "============================================"
TOTAL=$((PASS + FAIL + WARN))
echo -e "  ${GREEN}PASS: $PASS${NC}  ${RED}FAIL: $FAIL${NC}  ${YELLOW}WARN: $WARN${NC}  TOTAL: $TOTAL"

if [ $FAIL -eq 0 ]; then
    echo -e "  ${GREEN}OVERALL: ALL SYSTEMS GO${NC}"
    echo ""
    echo "  Ready for test render:"
    echo "    source /workspace/venv/bin/activate"
    echo "    cd /workspace/KAGAMI-MZ"
    echo "    python -m pipeline.orchestrator \"test render\""
elif [ $FAIL -le 2 ]; then
    echo -e "  ${YELLOW}OVERALL: DEGRADED — $FAIL component(s) need attention${NC}"
else
    echo -e "  ${RED}OVERALL: NOT READY — $FAIL component(s) failed${NC}"
fi
echo "============================================"
echo ""

exit $FAIL