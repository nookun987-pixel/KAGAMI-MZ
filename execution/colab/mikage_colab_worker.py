"""
MIKAGE COLAB WORKER V1 - Real Data Flow
Polls Mikage Brain server, renders mock images, posts results back
"""

import requests
import time
import base64
from PIL import Image, ImageDraw, ImageFont
from io import BytesIO

# CONFIG
SERVER_URL = "https://mikage-brain-417250859924.northamerica-northeast1.run.app"

print("=" * 60)
print("MIKAGE COLAB WORKER V1 - Real Data Flow")
print("=" * 60)
print(f"Server: {SERVER_URL}")
print("=" * 60)

def check_server():
    """Check server health"""
    try:
        resp = requests.get(f"{SERVER_URL}/health", timeout=10)
        if resp.status_code == 200:
            print(f"[TEST] Server online: {resp.json()}")
            return True
    except Exception as e:
        print(f"[ERROR] Server check failed: {e}")
    return False

def create_test_job():
    """Create ONE test job at startup"""
    payload = {
        "type": "render_request",
        "prompt": "test render",
        "requested_at": time.strftime("%Y-%m-%d %H:%M:%S")
    }
    try:
        resp = requests.post(f"{SERVER_URL}/create-job", json=payload, timeout=10)
        if resp.status_code == 200:
            data = resp.json()
            print(f"[INIT] Created test job: {data.get('job_id')}")
            return data.get('job_id')
    except Exception as e:
        print(f"[ERROR] Create job failed: {e}")
    return None

def render_mock_image(job_id):
    """Create mock image with PIL"""
    print(f"[RENDER] Creating mock image for: {job_id}")
    
    img = Image.new('RGB', (512, 512), color='white')
    draw = ImageDraw.Draw(img)
    
    text = f"JOB:\n{job_id}\n\nMOCK RENDER\n{time.strftime('%H:%M:%S')}"
    
    try:
        try:
            font = ImageFont.truetype("/usr/share/fonts/truetype/dejavu/DejaVuSans-Bold.ttf", 32)
        except:
            font = ImageFont.load_default()
        
        bbox = draw.textbbox((0, 0), text, font=font)
        text_width = bbox[2] - bbox[0]
        text_height = bbox[3] - bbox[1]
        
        x = (512 - text_width) // 2
        y = (512 - text_height) // 2
        
        draw.text((x, y), text, fill='black', font=font)
    except:
        draw.text((50, 200), f"JOB: {job_id}", fill='black')
        draw.text((50, 250), "MOCK RENDER", fill='black')
    
    buffer = BytesIO()
    img.save(buffer, format='PNG')
    img_base64 = base64.b64encode(buffer.getvalue()).decode('utf-8')
    
    print(f"[RENDER] Generated: {len(img_base64)} chars base64")
    return img_base64

def submit_result(job_id, image_base64):
    """POST result back to server - REAL DATA FLOW"""
    print(f"[SUBMIT] Sending result for: {job_id}")
    
    payload = {
        "job_id": job_id,
        "status": "DONE",
        "image_base64": image_base64,
        "worker": "colab_mock_v1",
        "rendered_at": time.strftime("%Y-%m-%d %H:%M:%S")
    }
    
    try:
        resp = requests.post(f"{SERVER_URL}/create-job", json=payload, timeout=15)
        print(f"[SUBMIT] Server response: {resp.status_code}")
        if resp.status_code == 200:
            print(f"[JOB] Complete: {job_id}")
            return True
        else:
            print(f"[ERROR] Submit failed: {resp.text}")
    except Exception as e:
        print(f"[ERROR] Submit exception: {e}")
    return False

def process_job(job_id):
    """Process ONE job with real server flow"""
    print(f"\n[JOB] Processing: {job_id}")
    
    # Render
    image_base64 = render_mock_image(job_id)
    
    # Submit back to server
    success = submit_result(job_id, image_base64)
    
    return success

# MAIN - Real Data Flow
if __name__ == "__main__":
    # Check server
    if not check_server():
        print("[FATAL] Cannot connect to server. Exiting.")
        exit(1)
    
    # Create ONE test job only
    job_id = create_test_job()
    if not job_id:
        print("[FATAL] Cannot create job. Exiting.")
        exit(1)
    
    # Process the job
    print("\n[WORKER] Starting job processing...")
    success = process_job(job_id)
    
    if success:
        print("\n" + "=" * 60)
        print("[SUCCESS] Data flow complete!")
        print("Flow: SERVER → JOB → WORKER → RESULT POST BACK ✓")
        print("=" * 60)
    else:
        print("\n[FATAL] Job processing failed.")
        exit(1)

