#!/bin/bash
set -e

echo "=== [1/4] FIXING DNS & NETWORK ==="
# Force Google DNS to prevent "Name or service not known" errors on fresh pods
echo "nameserver 8.8.8.8" > /etc/resolv.conf
echo "nameserver 1.1.1.1" >> /etc/resolv.conf

echo "=== [2/4] SYSTEM UPDATE ==="
apt update && apt install -y python3-pip git wget curl libgl1-mesa-glx libglib2.0-0

echo "=== [3/4] CLONING FOOOCUS ==="
cd /workspace
if [ ! -d "Fooocus" ]; then
    git clone https://github.com/lllyasviel/Fooocus.git
fi

echo "=== [4/4] INSTALLING CRITICAL DEPS ==="
# Core Fooocus requirements
pip install -r /workspace/Fooocus/requirements.txt

# Mikage-specific deps (rembg, SAM, GroundingDINO support, FastAPI bridge)
pip install rembg[gpu] onnxruntime-gpu einops torchsde uvicorn fastapi \
            safetensors supervision pydantic gdown \
            git+https://github.com/facebookresearch/segment-anything.git

# Fix GroundingDINO import error if present
sed -i 's/from extras.GroundingDINO.util.inference import default_groundingdino/try:\n    from extras.GroundingDINO.util.inference import default_groundingdino\nexcept:\n    default_groundingdino=None/g' /workspace/Fooocus/extras/inpaint_mask.py

echo "=== BOOTSTRAP COMPLETED SUCCESSFULLY ==="
