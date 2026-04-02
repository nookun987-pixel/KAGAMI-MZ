#!/usr/bin/env bash
# ============================================================================
# MIKAGE — RunPod Start Script (BRIDGE-ONLY MODE)
# Starts Mikage services in tmux sessions with logging.
# NO PROXY. Python pipeline must point directly to Bridge on :7865.
# Usage: bash /workspace/KAGAMI-MZ/deploy/runpod_start.sh
# ============================================================================
set -euo pipefail

WORKSPACE="/workspace"
PROJECT_DIR="${WORKSPACE}/KAGAMI-MZ"
FOOOCUS_DIR="${WORKSPACE}/Fooocus"
VENV_DIR="${WORKSPACE}/venv"
LOGS_DIR="${WORKSPACE}/logs"
ENV_FILE="${PROJECT_DIR}/.env"

RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
CYAN='\033[0;36m'
NC='\033[0m'

log()  { echo -e "${GREEN}[START]${NC} $*"; }
warn() { echo -e "${YELLOW}[START WARN]${NC} $*"; }
fail() { echo -e "${RED}[START FAIL]${NC} $*"; exit 1; }

require_file() {
    local p="$1"
    [ -f "$p" ] || fail "Required file not found: $p"
}

require_dir() {
    local p="$1"
    [ -d "$p" ] || fail "Required directory not found: $p"
}

# ── Pre-flight ──
require_dir "$PROJECT_DIR"
require_dir "$VENV_DIR"
require_dir "$FOOOCUS_DIR"
require_file "$ENV_FILE"
command -v tmux >/dev/null 2>&1 || fail "tmux not installed. Run bootstrap first."
command -v curl >/dev/null 2>&1 || fail "curl not installed. Run bootstrap first."

mkdir -p "$LOGS_DIR"

# ── Load .env ──
set -a
source "$ENV_FILE"
set +a

# ── Force Linux-safe runtime env ──
export FOOOCUS_ROOT="${FOOOCUS_ROOT:-$FOOOCUS_DIR}"
export FOOOCUS_BRIDGE_PORT="${FOOOCUS_BRIDGE_PORT:-7865}"
export FOOOCUS_API="http://127.0.0.1:${FOOOCUS_BRIDGE_PORT}"
export FOOOCUS_API_URL="http://127.0.0.1:${FOOOCUS_BRIDGE_PORT}"
export FOOOCUS_OUTPUT_DIR="${FOOOCUS_OUTPUT_DIR:-${FOOOCUS_ROOT}/outputs}"
export FOOOCUS_ALWAYS_HIGH_VRAM="${FOOOCUS_ALWAYS_HIGH_VRAM:-true}"
export PORT="${PORT:-3000}"

mkdir -p "$FOOOCUS_OUTPUT_DIR"

# ── Cleanup old tmux sessions ──
log "Cleaning up existing tmux sessions..."
for s in mikage-bridge mikage-server mikage-worker; do
    tmux kill-session -t "$s" 2>/dev/null || true
done
sleep 1

# ── 1. Start Fooocus Bridge ──
log "Starting Fooocus Bridge on port ${FOOOCUS_BRIDGE_PORT}..."
tmux new-session -d -s mikage-bridge \
  "source '${VENV_DIR}/bin/activate' && \
   export FOOOCUS_ROOT='${FOOOCUS_ROOT}' && \
   export FOOOCUS_BRIDGE_PORT='${FOOOCUS_BRIDGE_PORT}' && \
   export FOOOCUS_OUTPUT_DIR='${FOOOCUS_OUTPUT_DIR}' && \
   export FOOOCUS_ALWAYS_HIGH_VRAM='${FOOOCUS_ALWAYS_HIGH_VRAM}' && \
   cd '${PROJECT_DIR}' && \
   python scripts/fooocus_bridge.py 2>&1 | tee '${LOGS_DIR}/fooocus_bridge.log'"

# ── 2. Wait for Bridge ──
log "Waiting for Fooocus Bridge to initialize (first run may take 5-15 min if models download)..."
BRIDGE_URL="http://127.0.0.1:${FOOOCUS_BRIDGE_PORT}/"
BRIDGE_READY=false

for i in $(seq 1 300); do
    if curl -sf "$BRIDGE_URL" >/dev/null 2>&1; then
        BRIDGE_READY=true
        break
    fi
    if [ $((i % 15)) -eq 0 ]; then
        log "Still waiting for bridge... (${i}s elapsed)"
    fi
    sleep 2
done

if [ "$BRIDGE_READY" = true ]; then
    log "Fooocus Bridge is UP on ${BRIDGE_URL}"
else
    warn "Bridge not responding after 600s."
    warn "This is often first-run model load/download, not necessarily a crash."
    warn "Inspect logs:"
    warn "  tmux attach -t mikage-bridge"
    warn "  tail -f ${LOGS_DIR}/fooocus_bridge.log"
fi

# ── 3. Start Mikage Server ──
log "Starting Mikage Server on port ${PORT}..."
tmux new-session -d -s mikage-server \
  "cd '${PROJECT_DIR}' && \
   export PORT='${PORT}' && \
   export FOOOCUS_ROOT='${FOOOCUS_ROOT}' && \
   export FOOOCUS_BRIDGE_PORT='${FOOOCUS_BRIDGE_PORT}' && \
   export FOOOCUS_API='${FOOOCUS_API}' && \
   export FOOOCUS_API_URL='${FOOOCUS_API_URL}' && \
   export FOOOCUS_OUTPUT_DIR='${FOOOCUS_OUTPUT_DIR}' && \
   node server.js 2>&1 | tee '${LOGS_DIR}/server.log'"

sleep 2

# ── 4. Start Worker ──
log "Starting Mikage Worker..."
tmux new-session -d -s mikage-worker \
  "cd '${PROJECT_DIR}' && \
   export FOOOCUS_ROOT='${FOOOCUS_ROOT}' && \
   export FOOOCUS_BRIDGE_PORT='${FOOOCUS_BRIDGE_PORT}' && \
   export FOOOCUS_API='${FOOOCUS_API}' && \
   export FOOOCUS_API_URL='${FOOOCUS_API_URL}' && \
   export FOOOCUS_OUTPUT_DIR='${FOOOCUS_OUTPUT_DIR}' && \
   node worker.js 2>&1 | tee '${LOGS_DIR}/worker.log'"

sleep 2

# ── Health summary ──
echo ""
log "============================================"
log " MIKAGE SERVICES STARTED (BRIDGE-ONLY MODE)"
log "============================================"

check_http() {
    local name="$1"
    local url="$2"
    if curl -sf "$url" >/dev/null 2>&1; then
        echo -e "  ${GREEN}[UP]${NC}   ${name} → ${url}"
    else
        echo -e "  ${YELLOW}[WAIT]${NC} ${name} → ${url}"
    fi
}

check_http "Fooocus Bridge" "http://127.0.0.1:${FOOOCUS_BRIDGE_PORT}/"
check_http "Mikage Server" "http://127.0.0.1:${PORT}/"
check_http "Mikage Health" "http://127.0.0.1:${PORT}/health"

if tmux has-session -t mikage-worker 2>/dev/null; then
    echo -e "  ${GREEN}[UP]${NC}   Mikage Worker → polling queue"
else
    echo -e "  ${RED}[DOWN]${NC} Mikage Worker → session not found"
fi

echo ""
log "RUNTIME ENV"
echo "  FOOOCUS_ROOT=${FOOOCUS_ROOT}"
echo "  FOOOCUS_BRIDGE_PORT=${FOOOCUS_BRIDGE_PORT}"
echo "  FOOOCUS_API=${FOOOCUS_API}"
echo "  FOOOCUS_API_URL=${FOOOCUS_API_URL}"
echo "  FOOOCUS_OUTPUT_DIR=${FOOOCUS_OUTPUT_DIR}"
echo "  PORT=${PORT}"

echo ""
log "LOGS"
echo "  ${LOGS_DIR}/fooocus_bridge.log"
echo "  ${LOGS_DIR}/server.log"
echo "  ${LOGS_DIR}/worker.log"

echo ""
log "TMUX"
echo "  tmux list-sessions"
echo "  tmux attach -t mikage-bridge"
echo "  tmux attach -t mikage-server"
echo "  tmux attach -t mikage-worker"

echo ""
log "TEST RENDER"
echo "  source ${VENV_DIR}/bin/activate"
echo "  cd ${PROJECT_DIR}"
echo "  export FOOOCUS_ROOT='${FOOOCUS_ROOT}'"
echo "  export FOOOCUS_API='${FOOOCUS_API}'"
echo "  export FOOOCUS_OUTPUT_DIR='${FOOOCUS_OUTPUT_DIR}'"
echo "  python -m pipeline.orchestrator \"porcelain kitsune mask, thin crimson seam at jawline, obsidian void background, chiaroscuro dramatic shadow, industrial precision\""

echo ""
log "HEALTHCHECK"
echo "  bash ${PROJECT_DIR}/deploy/runpod_healthcheck.sh"

echo ""
log "ARCHITECTURE: ALL-IN-POD / BRIDGE-ONLY"
echo "  All render calls go directly to Bridge on :${FOOOCUS_BRIDGE_PORT}."
echo "  No proxy. No port 7866. No fooocus_proxy.py."

log "============================================"