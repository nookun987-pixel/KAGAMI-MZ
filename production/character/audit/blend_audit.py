import bpy
import sys
import json
import os
import math

def main():
    argv = sys.argv
    try:
        idx = argv.index("--") + 1
    except ValueError:
        print("ERROR: no -- separator")
        return

    args = argv[idx:]
    output_json = args[0]
    screenshot_dir = args[1]

    os.makedirs(screenshot_dir, exist_ok=True)

    blend_name = os.path.splitext(os.path.basename(bpy.data.filepath))[0]
    scene = bpy.context.scene
    all_objects = list(bpy.data.objects)

    obj_list = []
    armatures = []

    for obj in all_objects:
        obj_list.append({
            "name": obj.name,
            "type": obj.type,
            "hide_viewport": obj.hide_viewport,
            "hide_render": obj.hide_render
        })
        if obj.type == "ARMATURE":
            armatures.append(obj)

    armature_info = []
    for arm in armatures:
        bones = [{"name": b.name, "parent": b.parent.name if b.parent else None}
                 for b in arm.data.bones]
        armature_info.append({
            "name": arm.name,
            "bone_count": len(bones),
            "bones": bones
        })

    arm_candidates = []
    leg_candidates = []
    if armatures:
        for b in armatures[0].data.bones:
            n = b.name.lower()
            if any(k in n for k in ["arm", "forearm", "hand", "shoulder", "clavicle", "wrist", "upper_arm", "elbow"]):
                arm_candidates.append(b.name)
            elif any(k in n for k in ["leg", "thigh", "shin", "foot", "hip", "calf", "femur", "knee", "ankle", "toe"]):
                leg_candidates.append(b.name)

    result = {
        "blend_file": blend_name,
        "object_count": len(all_objects),
        "objects": obj_list,
        "armature_count": len(armatures),
        "armatures": armature_info,
        "arm_bone_candidates": arm_candidates,
        "leg_bone_candidates": leg_candidates,
        "arm_bone_rotated": None,
        "leg_bone_rotated": None,
        "pose_applied": False,
        "screenshot_neutral": None,
        "screenshot_pose": None,
        "classification": None,
        "errors": []
    }

    # Render settings — WORKBENCH for fast solid viewport-equivalent screenshot
    try:
        scene.render.engine = "BLENDER_WORKBENCH"
    except Exception as e:
        result["errors"].append(f"ENGINE_SET_FAIL: {e}")

    scene.render.resolution_x = 960
    scene.render.resolution_y = 540
    scene.render.image_settings.file_format = "PNG"

    # Ensure camera
    if scene.camera is None:
        cams = [o for o in all_objects if o.type == "CAMERA"]
        if cams:
            scene.camera = cams[0]
        else:
            result["errors"].append("NO_CAMERA")

    # Screenshot 1: neutral
    neutral_path = os.path.join(screenshot_dir, f"{blend_name}__NEUTRAL.png")
    scene.render.filepath = neutral_path
    try:
        bpy.ops.render.render(write_still=True)
        result["screenshot_neutral"] = os.path.basename(neutral_path)
    except Exception as e:
        result["errors"].append(f"NEUTRAL_RENDER_FAIL: {e}")

    # Pose test — directly modify pose bones (no mode_set needed in background)
    if armatures:
        arm_obj = armatures[0]

        if arm_candidates:
            try:
                pb = arm_obj.pose.bones.get(arm_candidates[0])
                if pb:
                    pb.rotation_mode = "XYZ"
                    pb.rotation_euler[2] = math.radians(25)
                    result["arm_bone_rotated"] = arm_candidates[0]
            except Exception as e:
                result["errors"].append(f"ARM_BONE_ROTATE_FAIL: {e}")

        if leg_candidates:
            try:
                pb = arm_obj.pose.bones.get(leg_candidates[0])
                if pb:
                    pb.rotation_mode = "XYZ"
                    pb.rotation_euler[0] = math.radians(15)
                    result["leg_bone_rotated"] = leg_candidates[0]
            except Exception as e:
                result["errors"].append(f"LEG_BONE_ROTATE_FAIL: {e}")

        if result["arm_bone_rotated"] or result["leg_bone_rotated"]:
            result["pose_applied"] = True
            try:
                bpy.context.view_layer.update()
            except Exception:
                pass

        # Screenshot 2: pose
        pose_path = os.path.join(screenshot_dir, f"{blend_name}__POSE.png")
        scene.render.filepath = pose_path
        try:
            bpy.ops.render.render(write_still=True)
            result["screenshot_pose"] = os.path.basename(pose_path)
        except Exception as e:
            result["errors"].append(f"POSE_RENDER_FAIL: {e}")
    else:
        result["errors"].append("POSE_SKIPPED_NO_ARMATURE")

    # Classification
    bone_count = armature_info[0]["bone_count"] if armature_info else 0
    if len(armatures) == 0:
        result["classification"] = "BLOCKOUT_ONLY"
    elif result["pose_applied"] and bone_count >= 50:
        result["classification"] = "PRODUCTION_RIG_USABLE"
    elif result["pose_applied"] and bone_count > 0:
        result["classification"] = "PROXY_RIG_USABLE"
    elif len(armatures) > 0 and not result["pose_applied"]:
        result["classification"] = "BROKEN_OR_HIDDEN"
    else:
        result["classification"] = "BROKEN_OR_HIDDEN"

    with open(output_json, "w", encoding="utf-8") as f:
        json.dump(result, f, indent=2, ensure_ascii=False)

    print(f"AUDIT_DONE | {blend_name} | {result['classification']} | bones={bone_count}")

main()
