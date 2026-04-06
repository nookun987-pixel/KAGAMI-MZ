#!/bin/bash
# ============================================================================
# MIKAGE — One-Shot Pod Setup & Start
# Usage: unzip KAGAMI-MZ-CLEAN.zip && cd KAGAMI-MZ && bash run.sh
# Tested on: RunPod GPU pods (RTX 4090, A100, etc.)
# ============================================================================
set -euo pipefail

RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
NC='\033[0m'

log()  { echo -e "${GREEN}[RUN]${NC} $*"; }
warn() { echo -e "${YELLOW}[RUN WARN]${NC} $*"; }
fail() { echo -e "${RED}[RUN FAIL]${NC} $*"; exit 1; }

WORKSPACE="/workspace"
PROJECT_DIR="${WORKSPACE}/KAGAMI-MZ"
FOOOCUS_DIR="${WORKSPACE}/Fooocus"
VENV_DIR="${WORKSPACE}/venv"
LOGS_DIR="${WORKSPACE}/logs"
CHECKPOINT_DIR="${FOOOCUS_DIR}/models/checkpoints"
PREFERRED_MODEL="realvisxlV50_v40Bakedvae.safetensors"

# Ensure we are in the right place
if [ ! -f "${PROJECT_DIR}/run.sh" ]; then
    # Maybe user ran from inside the folder already
    if [ -f "./run.sh" ] && [ -f "./package.json" ]; then
        PROJECT_DIR="$(pwd)"
    else
        fail "Cannot find project. Run from /workspace/KAGAMI-MZ or ensure files are there."
    fi
fi

mkdir -p "$LOGS_DIR"

# ============================================================================
# PHASE 1: System packages
# ============================================================================
log "=== PHASE 1: System packages ==="
apt-get update -qq
apt-get install -y -qq \
    git curl wget tmux htop lsof \
    python3 python3-pip python3-venv \
    libgl1-mesa-glx libglib2.0-0 libsm6 libxrender1 libxext6 \
    build-essential \
    2>/dev/null
log "System packages OK"

# ============================================================================
# PHASE 2: Python venv + deps
# ============================================================================
log "=== PHASE 2: Python venv ==="

if [ -d "$VENV_DIR" ] && [ -f "${VENV_DIR}/bin/python" ]; then
    log "Venv already exists at $VENV_DIR, reusing"
else
    python3 -m venv "$VENV_DIR"
    log "Venv created"
fi

VENV_PIP="${VENV_DIR}/bin/pip"
VENV_PYTHON="${VENV_DIR}/bin/python"

$VENV_PIP install --upgrade pip -q

# Core Mikage Python deps
log "Installing Mikage Python deps..."
$VENV_PIP install -q \
    requests python-dotenv fastapi uvicorn pydantic \
    Pillow numpy psutil opencv-python-headless \
    google-cloud-discoveryengine google-api-core
log "Mikage Python deps OK"

# ============================================================================
# PHASE 3: Clone Fooocus
# ============================================================================
log "=== PHASE 3: Fooocus ==="

if [ -d "$FOOOCUS_DIR" ] && [ -f "${FOOOCUS_DIR}/requirements_versions.txt" ]; then
    log "Fooocus already exists at $FOOOCUS_DIR, skipping clone"
else
    rm -rf "$FOOOCUS_DIR"
    git clone https://github.com/lllyasviel/Fooocus.git "$FOOOCUS_DIR"
    log "Fooocus cloned"
fi

# Install Fooocus requirements
log "Installing Fooocus requirements..."
$VENV_PIP install -q -r "${FOOOCUS_DIR}/requirements_versions.txt"
log "Fooocus requirements OK"

# Re-pin CUDA torch AFTER Fooocus (prevents CPU-only override)
log "Ensuring CUDA PyTorch..."
$VENV_PIP install -q torch torchvision torchaudio --index-url https://download.pytorch.org/whl/cu121
log "CUDA PyTorch OK"

# Verify
CUDA_OK=$($VENV_PYTHON -c "import torch; print(torch.cuda.is_available())" 2>/dev/null || echo "FAIL")
if [ "$CUDA_OK" = "True" ]; then
    log "PyTorch CUDA: OK"
else
    warn "PyTorch CUDA not detected. GPU rendering may fail."
fi

# ============================================================================
# PHASE 4: Node.js
# ============================================================================
log "=== PHASE 4: Node.js ==="

if ! command -v node &>/dev/null; then
    log "Installing Node 20 LTS..."
    curl -fsSL https://deb.nodesource.com/setup_20.x | bash -
    apt-get install -y -qq nodejs 2>/dev/null
fi
log "Node $(node --version) OK"

cd "$PROJECT_DIR"
if [ -f "package.json" ]; then
    npm install --production 2>&1 | tail -5
    log "npm install OK"
else
    warn "No package.json found, skipping npm install"
fi

# ============================================================================
# PHASE 5: SDXL Model
# ============================================================================
log "=== PHASE 5: SDXL Model ==="

mkdir -p "$CHECKPOINT_DIR"

if [ -f "${CHECKPOINT_DIR}/${PREFERRED_MODEL}" ]; then
    log "Model already exists: ${PREFERRED_MODEL}"
else
    log "Downloading SDXL model: ${PREFERRED_MODEL} (~6.5GB, may take 5-10 min)..."
    wget -q --show-progress -O "${CHECKPOINT_DIR}/${PREFERRED_MODEL}" \
        "https://huggingface.co/SG161222/RealVisXL_V5.0/resolve/main/RealVisXL_V5.0_fp16.safetensors" \
        || fail "Model download failed. Upload manually to ${CHECKPOINT_DIR}/${PREFERRED_MODEL}"
    log "Model downloaded"
fi

# Validate size (SDXL must be >2GB)
MODEL_SIZE=$(stat --format=%s "${CHECKPOINT_DIR}/${PREFERRED_MODEL}" 2>/dev/null || echo 0)
if [ "$MODEL_SIZE" -lt 2000000000 ]; then
    fail "Model is ${MODEL_SIZE} bytes — too small for SDXL. Re-download or upload correct file."
fi
log "Model validated: ${PREFERRED_MODEL} ($(( MODEL_SIZE / 1048576 )) MB)"

# ============================================================================
# PHASE 6: .env
# ============================================================================
log "=== PHASE 6: Environment ==="

ENV_FILE="${PROJECT_DIR}/.env"
if [ ! -f "$ENV_FILE" ]; then
    if [ -f "${PROJECT_DIR}/deploy/runpod_env.example" ]; then
        cp "${PROJECT_DIR}/deploy/runpod_env.example" "$ENV_FILE"
        log ".env created from template"
    else
        cat > "$ENV_FILE" <<'ENVEOF'
GEMINI_API_KEY=YOUR_GEMINI_API_KEY_HERE
FOOOCUS_ROOT=/workspace/Fooocus
FOOOCUS_BRIDGE_PORT=7865
FOOOCUS_API=http://127.0.0.1:7865
FOOOCUS_API_URL=http://127.0.0.1:7865
FOOOCUS_MODEL=realvisxlV50_v40Bakedvae.safetensors
FOOOCUS_OUTPUT_DIR=/workspace/Fooocus/outputs
PORT=3000
ENVEOF
        log ".env created with defaults"
    fi
    warn ">>> EDIT .env TO SET YOUR GEMINI_API_KEY <<<"
else
    log ".env already exists"
fi

# Ensure FOOOCUS_MODEL is in .env
if ! grep -q "^FOOOCUS_MODEL=" "$ENV_FILE" 2>/dev/null; then
    echo "FOOOCUS_MODEL=${PREFERRED_MODEL}" >> "$ENV_FILE"
fi

# Create required dirs
mkdir -p "${PROJECT_DIR}/runs" "${PROJECT_DIR}/queue" "${PROJECT_DIR}/output" "${PROJECT_DIR}/data"
chmod +x "${PROJECT_DIR}/deploy/"*.sh 2>/dev/null || true

# ============================================================================
# PHASE 7: Start services
# ============================================================================
log "=== PHASE 7: Start ==="

# Kill stale bridge process
STALE_PID=$(lsof -ti:7865 2>/dev/null || true)
if [ -n "$STALE_PID" ]; then
    log "Killing stale :7865 (PID: $STALE_PID)"
    kill -9 $STALE_PID 2>/dev/null || true
    sleep 1
fi

# Kill old tmux sessions
for s in mikage-bridge mikage-server mikage-worker; do
    tmux kill-session -t "$s" 2>/dev/null || true
done
sleep 1

# Find bridge script
BRIDGE_SCRIPT="${PROJECT_DIR}/scripts/fooocus_bridge.py"
if [ ! -f "$BRIDGE_SCRIPT" ]; then
    BRIDGE_SCRIPT="${PROJECT_DIR}/exports/grapuco_system_review/01_ARCHITECTURE/fooocus_bridge.py"
fi
if [ ! -f "$BRIDGE_SCRIPT" ]; then
    fail "Bridge script not found in scripts/ or exports/"
fi

# Load .env
set -a; source "$ENV_FILE"; set +a
export FOOOCUS_ROOT="${FOOOCUS_ROOT:-$FOOOCUS_DIR}"
export FOOOCUS_BRIDGE_PORT="${FOOOCUS_BRIDGE_PORT:-7865}"
export FOOOCUS_MODEL="${FOOOCUS_MODEL:-$PREFERRED_MODEL}"
export FOOOCUS_API="http://127.0.0.1:${FOOOCUS_BRIDGE_PORT}"
export FOOOCUS_API_URL="http://127.0.0.1:${FOOOCUS_BRIDGE_PORT}"
export FOOOCUS_OUTPUT_DIR="${FOOOCUS_OUTPUT_DIR:-${FOOOCUS_ROOT}/outputs}"
export FOOOCUS_ALWAYS_HIGH_VRAM="${FOOOCUS_ALWAYS_HIGH_VRAM:-true}"
export PORT="${PORT:-3000}"
mkdir -p "$FOOOCUS_OUTPUT_DIR"

# Start bridge
log "Starting bridge: ${BRIDGE_SCRIPT} on :${FOOOCUS_BRIDGE_PORT} with ${FOOOCUS_MODEL}"
tmux new-session -d -s mikage-bridge \
  "export FOOOCUS_ROOT='${FOOOCUS_ROOT}' && \
   export FOOOCUS_BRIDGE_PORT='${FOOOCUS_BRIDGE_PORT}' && \
   export FOOOCUS_OUTPUT_DIR='${FOOOCUS_OUTPUT_DIR}' && \
   export FOOOCUS_ALWAYS_HIGH_VRAM='${FOOOCUS_ALWAYS_HIGH_VRAM}' && \
   export FOOOCUS_MODEL='${FOOOCUS_MODEL}' && \
   cd '${PROJECT_DIR}' && \
   '${VENV_PYTHON}' '${BRIDGE_SCRIPT}' 2>&1 | tee '${LOGS_DIR}/fooocus_bridge.log'"

# Wait for bridge
log "Waiting for bridge to start (model first-load may take 2-5 min)..."
BRIDGE_URL="http://127.0.0.1:${FOOOCUS_BRIDGE_PORT}/"
BRIDGE_READY=false
for i in $(seq 1 300); do
    if curl -sf "$BRIDGE_URL" >/dev/null 2>&1; then
        BRIDGE_READY=true
        break
    fi
    if [ $((i % 15)) -eq 0 ]; then
        log "Still waiting... (${i}s)"
    fi
    sleep 2
done

if [ "$BRIDGE_READY" = true ]; then
    log "Bridge UP on ${BRIDGE_URL}"
else
    warn "Bridge not responding after 600s. Check: tmux attach -t mikage-bridge"
fi

# Start server
if [ -f "${PROJECT_DIR}/server.js" ]; then
    tmux new-session -d -s mikage-server \
      "cd '${PROJECT_DIR}' && \
       export PORT='${PORT}' && \
       export FOOOCUS_API='${FOOOCUS_API}' && \
       export FOOOCUS_API_URL='${FOOOCUS_API_URL}' && \
       export FOOOCUS_OUTPUT_DIR='${FOOOCUS_OUTPUT_DIR}' && \
       node server.js 2>&1 | tee '${LOGS_DIR}/server.log'"
    log "Server started on :${PORT}"
fi

# Start worker
if [ -f "${PROJECT_DIR}/worker.js" ]; then
    tmux new-session -d -s mikage-worker \
      "cd '${PROJECT_DIR}' && \
       export FOOOCUS_API='${FOOOCUS_API}' && \
       export FOOOCUS_API_URL='${FOOOCUS_API_URL}' && \
       export FOOOCUS_OUTPUT_DIR='${FOOOCUS_OUTPUT_DIR}' && \
       node worker.js 2>&1 | tee '${LOGS_DIR}/worker.log'"
    log "Worker started"
fi

# ============================================================================
# DONE
# ============================================================================
echo ""
log "============================================"
log "  MIKAGE READY"
log "============================================"
log "  Bridge:  http://127.0.0.1:${FOOOCUS_BRIDGE_PORT}/"
log "  Server:  http://127.0.0.1:${PORT}/"
log "  Model:   ${FOOOCUS_MODEL}"
log "  Logs:    ${LOGS_DIR}/"
log ""
log "  tmux attach -t mikage-bridge"
log "  tmux attach -t mikage-server"
log "  tmux attach -t mikage-worker"
log ""
log "  SMOKE TEST:"
log "    source ${VENV_DIR}/bin/activate"
log "    cd ${PROJECT_DIR}"
log "    python deploy/test_e2e_render.py"
log "============================================"
