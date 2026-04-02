#!/usr/bin/env bash
# ============================================================================
# MIKAGE — RunPod Bootstrap Script
# Run ONCE on a fresh RunPod GPU pod to set up the full environment.
# Usage: bash /workspace/KAGAMI-MZ/deploy/runpod_bootstrap.sh
# ============================================================================
set -euo pipefail

WORKSPACE="/workspace"
PROJECT_DIR="${WORKSPACE}/KAGAMI-MZ"
FOOOCUS_DIR="${WORKSPACE}/Fooocus"
LOGS_DIR="${WORKSPACE}/logs"
VENV_DIR="${WORKSPACE}/venv"
ENV_FILE="${PROJECT_DIR}/.env"

RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
NC='\033[0m'

log()  { echo -e "${GREEN}[BOOTSTRAP]${NC} $*"; }
warn() { echo -e "${YELLOW}[BOOTSTRAP WARN]${NC} $*"; }
fail() { echo -e "${RED}[BOOTSTRAP FAIL]${NC} $*"; exit 1; }

# ── 0. Pre-flight checks ──
log "=== MIKAGE RunPod Bootstrap ==="
log "Timestamp: $(date -u +%Y-%m-%dT%H:%M:%SZ)"

if [ ! -d "$PROJECT_DIR" ]; then
    fail "Project not found at $PROJECT_DIR. Upload or clone the repo first."
fi

# Verify GPU is present
if ! command -v nvidia-smi &>/dev/null; then
    warn "nvidia-smi not found. GPU may not be available."
else
    log "GPU detected:"
    nvidia-smi --query-gpu=name,memory.total --format=csv,noheader 2>/dev/null || warn "Could not query GPU info"
fi

# ── 1. System packages ──
log "Installing system packages..."
apt-get update -qq
apt-get install -y -qq \
    git curl wget tmux htop \
    python3 python3-pip python3-venv \
    libgl1-mesa-glx libglib2.0-0 libsm6 libxrender1 libxext6 \
    build-essential \
    2>/dev/null
log "System packages OK"

# ── 2. Verify Python ──
PYTHON_VERSION=$(python3 --version 2>&1 | awk '{print $2}')
PYTHON_MAJOR=$(echo "$PYTHON_VERSION" | cut -d. -f1)
PYTHON_MINOR=$(echo "$PYTHON_VERSION" | cut -d. -f2)
if [ "$PYTHON_MAJOR" -lt 3 ] || [ "$PYTHON_MINOR" -lt 10 ]; then
    fail "Python 3.10+ required, found $PYTHON_VERSION"
fi
log "Python $PYTHON_VERSION OK"

# ── 3. Verify Node.js ──
if ! command -v node &>/dev/null; then
    log "Node.js not found. Installing Node 20 LTS..."
    curl -fsSL https://deb.nodesource.com/setup_20.x | bash -
    apt-get install -y -qq nodejs 2>/dev/null
fi
NODE_VERSION=$(node --version 2>&1)
log "Node $NODE_VERSION OK"

# ── 4. Create Python venv & install Python deps ──
log "Creating Python virtual environment at $VENV_DIR..."
python3 -m venv "$VENV_DIR"
source "${VENV_DIR}/bin/activate"

log "Installing Python dependencies..."
pip install --upgrade pip -q

# Core Mikage deps (non-conflicting with Fooocus)
pip install -q \
    requests \
    python-dotenv \
    fastapi \
    uvicorn \
    pydantic \
    Pillow \
    numpy \
    google-cloud-discoveryengine \
    google-api-core \
    psutil \
    opencv-python-headless
log "Core Mikage deps OK"

# ── 5. Clone Fooocus (fresh on pod) ──
if [ -d "$FOOOCUS_DIR" ]; then
    log "Fooocus already exists at $FOOOCUS_DIR, skipping clone"
else
    log "Cloning Fooocus into $FOOOCUS_DIR..."
    git clone https://github.com/lllyasviel/Fooocus.git "$FOOOCUS_DIR"
    log "Fooocus cloned OK"
fi

# Install Fooocus's own requirements (these may pin specific torch/gradio versions)
if [ -f "${FOOOCUS_DIR}/requirements_versions.txt" ]; then
    log "Installing Fooocus requirements..."
    pip install -q -r "${FOOOCUS_DIR}/requirements_versions.txt"
    log "Fooocus requirements OK"
fi

# Re-pin CUDA torch AFTER Fooocus requirements to prevent CPU-only override
log "Ensuring CUDA PyTorch..."
pip install -q \
    torch torchvision torchaudio --index-url https://download.pytorch.org/whl/cu121
log "CUDA PyTorch ensured"

# Verify CUDA torch is active
PYTORCH_CUDA=$(python3 -c "import torch; print(torch.cuda.is_available())" 2>/dev/null || echo "IMPORT_FAILED")
if [ "$PYTORCH_CUDA" = "True" ]; then
    log "PyTorch CUDA: OK"
elif [ "$PYTORCH_CUDA" = "False" ]; then
    warn "PyTorch installed but CUDA not available — may be CPU-only build"
else
    warn "Could not import torch to verify CUDA"
fi

deactivate

# ── 6. Install Node.js dependencies ──
log "Installing Node.js dependencies..."
cd "$PROJECT_DIR"
npm install --production 2>&1 | tail -3
log "Node dependencies OK"

# ── 7. Create required directories ──
log "Creating directories..."
mkdir -p "${PROJECT_DIR}/runs"
mkdir -p "${PROJECT_DIR}/queue"
mkdir -p "${PROJECT_DIR}/output"
mkdir -p "${PROJECT_DIR}/data"
mkdir -p "${LOGS_DIR}"
mkdir -p "${WORKSPACE}/models"
log "Directories OK"

# ── 8. Generate .env if missing ──
if [ ! -f "$ENV_FILE" ]; then
    if [ -f "${PROJECT_DIR}/deploy/runpod_env.example" ]; then
        log "Creating .env from runpod_env.example..."
        cp "${PROJECT_DIR}/deploy/runpod_env.example" "$ENV_FILE"
        warn ".env created from template — YOU MUST edit it to add API keys!"
    else
        fail ".env not found and no template available. Create .env manually."
    fi
else
    log ".env already exists"
fi

# ── 9. Verify .env has required keys ──
MISSING_KEYS=()
for KEY in GEMINI_API_KEY; do
    if ! grep -q "^${KEY}=" "$ENV_FILE" 2>/dev/null; then
        MISSING_KEYS+=("$KEY")
    else
        VAL=$(grep "^${KEY}=" "$ENV_FILE" | cut -d= -f2-)
        if [ -z "$VAL" ] || [ "$VAL" = "YOUR_GEMINI_API_KEY_HERE" ]; then
            MISSING_KEYS+=("$KEY")
        fi
    fi
done

if [ ${#MISSING_KEYS[@]} -gt 0 ]; then
    warn "MISSING OR EMPTY required env vars: ${MISSING_KEYS[*]}"
    warn "Edit $ENV_FILE before running start script!"
fi

# ── 10. Make deploy scripts executable ──
chmod +x "${PROJECT_DIR}/deploy/"*.sh 2>/dev/null || true

# ── FINAL REPORT ──
echo ""
log "============================================"
log "  BOOTSTRAP COMPLETE"
log "============================================"
log "  Project:   $PROJECT_DIR"
log "  Fooocus:   $FOOOCUS_DIR"
log "  Venv:      $VENV_DIR"
log "  Logs:      $LOGS_DIR"
log "  Node:      $NODE_VERSION"
log "  Python:    $PYTHON_VERSION"
if [ ${#MISSING_KEYS[@]} -gt 0 ]; then
    warn "  ACTION REQUIRED: Set these in $ENV_FILE:"
    for K in "${MISSING_KEYS[@]}"; do
        warn "    - $K"
    done
fi
log ""
log "  NEXT: bash ${PROJECT_DIR}/deploy/runpod_start.sh"
log "============================================"
