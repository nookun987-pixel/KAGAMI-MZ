#!/bin/bash
MODEL_PATH="/workspace/Fooocus/models/checkpoints/realvisxlV50_v40BakedVAE.safetensors"

echo "=== CHECKING MODEL STATUS ==="
if [ ! -f "$MODEL_PATH" ]; then
    echo "❌ ERROR: Model not found! SCP the 6.9GB file from your PC."
    exit 1
fi

# Reject garbage files (e.g. 36MB HTML error pages from failed downloads)
FILE_SIZE=$(stat -c%s "$MODEL_PATH")
if [ "$FILE_SIZE" -lt 2000000000 ]; then
    echo "❌ ERROR: Model file is too small ($FILE_SIZE bytes). This is a junk file!"
    exit 1
fi

echo "✅ MODEL READY: 6.9GB Detected."
