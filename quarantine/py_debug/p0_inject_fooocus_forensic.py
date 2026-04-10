"""
P0 FORENSIC INJECTOR for Fooocus
This script adds mandatory logging to Fooocus image processing functions.
Run this before starting Fooocus to capture forensic data.
"""
import os
import sys

FOOOCUS_ROOT = os.environ.get("FOOOCUS_ROOT", "D:/Fooocus-main")

# Path to inject forensic logging
TARGET_FILES = [
    # Common locations where gradio image handling occurs
    os.path.join(FOOOCUS_ROOT, "modules", "webui.py"),
    os.path.join(FOOOCUS_ROOT, "webui.py"),
    os.path.join(FOOOCUS_ROOT, "modules", "async_worker.py"),
]

def inject_forensic_logging(file_path):
    """Add forensic logging to a Python file if it contains image processing."""
    if not os.path.isfile(file_path):
        print(f"[FORENSIC INJECTOR] File not found: {file_path}")
        return False

    with open(file_path, 'r', encoding='utf-8', errors='ignore') as f:
        content = f.read()

    # Check if already injected
    if 'FORENSIC_LOG' in content:
        print(f"[FORENSIC INJECTOR] Already injected: {file_path}")
        return True

    # Look for decode_base64_to_image or similar image processing
    if 'decode_base64_to_image' not in content and 'Image.open' not in content and 'gradio' not in content.lower():
        print(f"[FORENSIC INJECTOR] No image processing found: {file_path}")
        return False

    # Add forensic logging at the beginning of the file
    forensic_header = '''
# === P0 FORENSIC LOGGING INJECTION ===
import os as _forensic_os
FORENSIC_LOG_FILE = _forensic_os.environ.get("FORENSIC_LOG_PATH", "D:/KAGAMI-MZ/p0_fooocus_forensic.log")

def _forensic_log(label, value):
    """Log forensic data about image inputs."""
    try:
        with open(FORENSIC_LOG_FILE, "a", encoding="utf-8") as f:
            val_type = type(value).__name__ if value is not None else "None"
            val_str = str(value)[:300] if value is not None else "None"
            is_none = value is None
            is_data_uri = isinstance(value, str) and value.startswith("data:image")
            has_file = isinstance(value, str) and ("/file=" in value or "/upload" in value)
            is_local_path = isinstance(value, str) and _forensic_os.path.isfile(value)
            f.write(f"[FOOOCUS FORENSIC] {label}\\n")
            f.write(f"  type={val_type}, is_none={is_none}, data_uri={is_data_uri}, file_path={has_file}, local_exists={is_local_path}\\n")
            f.write(f"  repr={repr(value)[:300]}\\n")
            f.write(f"  str_start={val_str[:200]}\\n")
            f.write("---\\n")
    except Exception as e:
        pass  # Never crash the main flow
# === END FORENSIC INJECTION ===

'''

    # Inject after any existing imports
    lines = content.split('\n')
    import_idx = 0
    for i, line in enumerate(lines):
        if line.startswith('import ') or line.startswith('from '):
            import_idx = i + 1

    lines.insert(import_idx, forensic_header)

    # Also wrap decode_base64_to_image if it exists
    new_lines = []
    for line in lines:
        if 'def decode_base64_to_image' in line and 'forensic' not in line:
            new_lines.append(line)
            new_lines.append('    _forensic_log("decode_base64_to_image called with", input_data)')
        else:
            new_lines.append(line)

    new_content = '\n'.join(new_lines)

    with open(file_path, 'w', encoding='utf-8') as f:
        f.write(new_content)

    print(f"[FORENSIC INJECTOR] Injected logging into: {file_path}")
    return True

def main():
    print("[FORENSIC INJECTOR] Starting injection into Fooocus...")
    injected = 0
    for target in TARGET_FILES:
        if inject_forensic_logging(target):
            injected += 1

    print(f"[FORENSIC INJECTOR] Injected {injected} files")

    # Also create a standalone forensic interceptor module
    interceptor_path = os.path.join(FOOOCUS_ROOT, "forensic_interceptor.py")
    with open(interceptor_path, 'w', encoding='utf-8') as f:
        f.write('''
"""
Standalone forensic interceptor for Fooocus.
Import this at the top of webui.py or entry point to capture all image inputs.
"""
import os
import sys
import json

FORENSIC_LOG_FILE = os.environ.get("FORENSIC_LOG_PATH", "D:/KAGAMI-MZ/p0_fooocus_forensic.log")

def forensic_log_image_input(arg_index, value, context="unknown"):
    """Log exact image input data before any processing."""
    try:
        with open(FORENSIC_LOG_FILE, "a", encoding="utf-8") as f:
            val_type = type(value).__name__ if value is not None else "None"
            is_none = value is None
            is_data_uri = isinstance(value, str) and value.startswith("data:image") if value else False
            has_upload = isinstance(value, str) and "/upload" in value if value else False
            has_file = isinstance(value, str) and "/file=" in value if value else False
            is_local_path = isinstance(value, str) and os.path.isfile(value) if value else False

            f.write(f"[FOOOCUS FORENSIC] context={context}, arg_index={arg_index}\\n")
            f.write(f"  type={val_type}\\n")
            f.write(f"  is_none={is_none}\\n")
            f.write(f"  startswith_data_image={is_data_uri}\\n")
            f.write(f"  contains_upload={has_upload}\\n")
            f.write(f"  contains_file={has_file}\\n")
            f.write(f"  is_local_path_exists={is_local_path}\\n")
            f.write(f"  repr_300={repr(value)[:300]}\\n")
            if isinstance(value, str) and len(value) > 0:
                f.write(f"  first_200_chars={value[:200]}\\n")
            f.write("="*50 + "\\n")
    except Exception as e:
        pass  # Never crash

# Patch gradio Image component if available
try:
    import gradio as gr
    original_image_init = gr.Image.__init__ if hasattr(gr.Image, '__init__') else None

    if original_image_init:
        def patched_image_init(self, *args, **kwargs):
            forensic_log_image_input(-1, kwargs.get('value'), "Image.__init__")
            return original_image_init(self, *args, **kwargs)
        gr.Image.__init__ = patched_image_init
        forensic_log_image_input(-1, "gradio.Image patched", "init")
except ImportError:
    forensic_log_image_input(-1, "gradio not available for patching", "init")
''')
    print(f"[FORENSIC INJECTOR] Created interceptor: {interceptor_path}")

if __name__ == "__main__":
    main()
