#!/bin/bash
set -e

cd /workspace/KAGAMI-MZ

echo "=== KILLING OLD PROCESSES ==="
pkill -f fooocus_bridge.py || true
sleep 2

echo "=== EXPORTING PATHS ==="
# Append to PYTHONPATH (colon-delimited) — do NOT overwrite system paths
export PYTHONPATH=$PYTHONPATH:/workspace/Fooocus:/workspace/Fooocus/extras

echo "=== STARTING MIKAGE BRIDGE ==="
nohup python3 scripts/fooocus_bridge.py > /tmp/mikage_bridge.log 2>&1 &

sleep 10
echo "=== SYSTEM STATUS ==="
ss -ltnp | grep 7865 && echo "✅ PORT 7865 IS OPEN" || echo "❌ PORT 7865 CLOSED"
tail -n 20 /tmp/mikage_bridge.log
