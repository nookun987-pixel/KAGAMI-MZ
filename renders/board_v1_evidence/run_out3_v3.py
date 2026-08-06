# OUT3 only — exploded load-path, corrected viewing axis + permitted secondary Z clearance.
# READ-ONLY on source: duplicates only, translation only, no save.
import bpy, json, math, os
from mathutils import Vector
OUT=r"D:\KAGAMI-MZ_SYNC_PUSH_V2\_tmp\zenith_blade_outstanding_renders_01"
sc=bpy.context.scene; LOG={"temp_objects":[],"temp_transforms":[]}
CH,NK,SPINE="ZB_ARCH03R_CHASSIS","ZB_ARCH03R_HUB_NECK","ZB42_CENTRAL_LOAD_SPINE"
def force(f):
    sc.frame_set(f+1); bpy.context.view_layer.update(); sc.frame_set(f); bpy.context.view_layer.update()
def wbb(o):
    dg=bpy.context.evaluated_depsgraph_get(); oe=o.evaluated_get(dg)
    p=[oe.matrix_world@Vector(c) for c in oe.bound_box]
    return (Vector([min(q[i] for q in p) for i in range(3)]),Vector([max(q[i] for q in p) for i in range(3)]))
force(61)
BLADE={o.name for o in bpy.data.objects if o.type=="MESH" and
       (o.name.startswith("ZB") or o.name.startswith("CE01") or o.name in (CH,NK))}
pts=[]
for n in BLADE:
    l,h=wbb(bpy.data.objects[n]); pts+=[l,h]
lo=Vector([min(p[i] for p in pts) for i in range(3)]); hi=Vector([max(p[i] for p in pts) for i in range(3)])
cen=(lo+hi)*0.5; ext=hi-lo; BW=ext.x
def grp(ns): return [n for n in ns if bpy.data.objects.get(n)]
PORC=grp(["ZB45_SHELL_LL","ZB45_SHELL_UL"]); TABS=grp(["ZB45_SHELL_LR","ZB45_SHELL_UR"])
CHAN=grp(["ZB_LP_CHANNEL_L","ZB_LP_CHANNEL_R"])
RAILS=[n for n in bpy.data.objects.keys() if "RAIL" in n and n in BLADE]
CHASSISG=grp([CH,NK]); SPINEG=grp([SPINE])
HUB=grp(["ZB46_DRIVE_HUB","ZB48_HANDLE_REGISTERED_TO_HAND_MARKER","ZB46_HUB_SHOULDER_L","ZB46_HUB_SHOULDER_R","ZB46_HUB_SPINE_KEY"])
STEP=0.12*BW; ZSTEP=0.035*BW      # secondary longitudinal offset for occlusion clearance only
COREG=grp(["ZB42_P3_SINGLE_RECESSED_CORE"])
LAYERS=[("porcelain cutting mass",PORC,4),("root transitions / bearing roots",TABS,3),
        ("wedge followers",CHAN,2),("keyed channels / rails",RAILS,1),
        ("chassis / spine  (ANCHOR - stays)",CHASSISG+SPINEG,0),("hub / handle axis",HUB,0),
        ("P3 SIGNAL - NOT PRIMARY LOAD-BEARING MEMBER (stays at spine)",COREG,0)]
dups=[]
for label,names,m in LAYERS:
    for n in names:
        s=bpy.data.objects.get(n)
        if not s: continue
        d=s.copy(); d.data=s.data.copy(); d.name="TMPEXP_"+n; sc.collection.objects.link(d)
        if m:
            d.location=d.location+Vector((0.0,-STEP*m, ZSTEP*m))
            LOG["temp_transforms"].append(f"{d.name}: translate (0,{round(-STEP*m,6)},{round(ZSTEP*m,6)}) layer='{label}'")
        dups.append(d)
LOG["temp_objects"]=[d.name for d in dups]
for n in BLADE: bpy.data.objects[n].hide_render=True
for o in bpy.data.objects:
    if o.type=="MESH" and o.name not in BLADE and not o.name.startswith("TMPEXP_"): o.hide_render=True
for d in dups: d.hide_render=False
bpy.context.view_layer.update()
ep=[]
for d in dups:
    l,h=wbb(d); ep+=[l,h]
elo=Vector([min(p[i] for p in ep) for i in range(3)]); ehi=Vector([max(p[i] for p in ep) for i in range(3)])
ecen=(elo+ehi)*0.5; eext=ehi-elo
RX,RY=2400,1800
EDIR=Vector((-0.86,-0.36,0.36)).normalized()   # from the cutting-edge side: porcelain nearest, chassis behind
fov_v=2*math.atan((36.0*(RY/RX))/(2*85.0))
dist=(max(eext.z,eext.y*2.0,eext.x*1.6)*1.20/2)/math.tan(fov_v/2)
cd=bpy.data.cameras.new("TMP_EXP_CAM3"); cd.type="PERSP"; cd.lens=85.0
cam=bpy.data.objects.new("TMP_EXP_CAM3",cd); sc.collection.objects.link(cam)
cam.location=ecen+EDIR*dist
cam.rotation_euler=(ecen-cam.location).to_track_quat('-Z','Y').to_euler()
LOG["temp_objects"].append("TMP_EXP_CAM3 (camera)")
bpy.context.view_layer.update()
r=sc.render; r.engine="BLENDER_EEVEE"; r.image_settings.file_format="PNG"
r.image_settings.color_mode="RGBA"; r.film_transparent=False
r.resolution_x,r.resolution_y,r.resolution_percentage=RX,RY,100
try: sc.eevee.taa_render_samples=96
except Exception: pass
sc.camera=cam; r.filepath=os.path.join(OUT,"OUT3_EXPLODED_LOADPATH.png")
bpy.ops.render.render(write_still=True)
LOG["camera"]={"name":cam.name,"type":cd.type,"lens_mm":cd.lens,"sensor_width":cd.sensor_width,
               "location":[round(v,6) for v in cam.matrix_world.translation],
               "rotation_euler":[round(v,6) for v in cam.matrix_world.to_euler()]}
LOG["offsets"]={"primary_axis":"world -Y (lateral assembly axis)","step_m":round(STEP,6),
                "step_as_blade_width":0.12,"max_total_m":round(STEP*4,6),
                "max_total_as_blade_width":round(STEP*4/BW,4),"budget":0.55,
                "secondary_axis":"world +Z (occlusion clearance only)","z_step_m":round(ZSTEP,6)}
LOG["view_note"]=("viewed from the cutting-edge side (-X) so the -Y explode spreads across frame and the "
                  "chassis (which spans the full width and sits at the highest X) does not occlude the "
                  "separated layers. A +X view was rendered first and rejected for exactly that occlusion.")
LOG["layers"]=[{"label":l,"objects":ns,"offset_multiplier":m} for l,ns,m in LAYERS]
for d in dups: bpy.data.objects.remove(d,do_unlink=True)
print("###LOG###"); print(json.dumps(LOG,indent=1,default=str)); print("###ENDLOG###")
print("IS_DIRTY:",bpy.data.is_dirty)
