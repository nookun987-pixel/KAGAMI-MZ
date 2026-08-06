# ZENITH_BLADE_OUTSTANDING_RENDERS_01 — pass 2 (camera/framing corrections + OUT4).
# READ-ONLY on source: no save, no geometry edit, no applied modifiers, no material/emission change.
import bpy, bmesh, json, math, os
from mathutils import Vector
from bpy_extras.object_utils import world_to_camera_view

OUT = r"D:\KAGAMI-MZ_SYNC_PUSH_V2\_tmp\zenith_blade_outstanding_renders_01"
LOG = {"temp_objects": [], "temp_modifiers": [], "temp_transforms": [], "outputs": {}}
sc = bpy.context.scene
CORE, SPINE = "ZB42_P3_SINGLE_RECESSED_CORE", "ZB42_CENTRAL_LOAD_SPINE"
CH, NK = "ZB_ARCH03R_CHASSIS", "ZB_ARCH03R_HUB_NECK"

def force(f):
    sc.frame_set(f+1); bpy.context.view_layer.update()
    sc.frame_set(f);    bpy.context.view_layer.update()
def blade_names():
    return {o.name for o in bpy.data.objects if o.type=="MESH" and
            (o.name.startswith("ZB") or o.name.startswith("CE01") or o.name in (CH,NK))}
def wbb(o):
    dg=bpy.context.evaluated_depsgraph_get(); oe=o.evaluated_get(dg)
    pts=[oe.matrix_world @ Vector(c) for c in oe.bound_box]
    return (Vector([min(p[i] for p in pts) for i in range(3)]),
            Vector([max(p[i] for p in pts) for i in range(3)]))
def scene_state():
    vs=sc.view_settings; w=sc.world; bg=None
    if w and w.use_nodes:
        for n in w.node_tree.nodes:
            if n.type=="BACKGROUND":
                bg={"color_linear":[round(v,6) for v in n.inputs[0].default_value],
                    "strength":round(n.inputs[1].default_value,4)}
    ng=getattr(sc,"node_tree",None) or getattr(sc,"compositing_node_group",None)
    return {"engine":sc.render.engine,"view_transform":vs.view_transform,"look":getattr(vs,"look",None),
            "exposure":round(vs.exposure,4),"gamma":round(vs.gamma,4),"world":bg,
            "compositor_nodes":[n.type for n in ng.nodes] if ng else []}
def cam_report(c):
    d=c.data
    return {"name":c.name,"type":d.type,"lens_mm":round(d.lens,4),
            "sensor_width":round(d.sensor_width,4),"sensor_height":round(d.sensor_height,4),
            "sensor_fit":d.sensor_fit,
            "location":[round(v,6) for v in c.matrix_world.translation],
            "rotation_euler":[round(v,6) for v in c.matrix_world.to_euler()]}
def render_to(path,rx,ry,cam,samples=128):
    r=sc.render; r.engine="BLENDER_EEVEE"
    r.image_settings.file_format="PNG"; r.image_settings.color_mode="RGBA"
    r.film_transparent=False; r.resolution_x,r.resolution_y,r.resolution_percentage=rx,ry,100
    try: sc.eevee.taa_render_samples=samples
    except Exception: pass
    sc.camera=cam; r.filepath=path; bpy.ops.render.render(write_still=True)
def mkcam(name,lens,loc,target,ctype="PERSP"):
    d=bpy.data.cameras.new(name); d.type=ctype; d.lens=lens
    c=bpy.data.objects.new(name,d); sc.collection.objects.link(c)
    c.location=Vector(loc)
    c.rotation_euler=(Vector(target)-Vector(loc)).to_track_quat('-Z','Y').to_euler()
    LOG["temp_objects"].append(f"{name} (camera)")
    bpy.context.view_layer.update(); return c
def fit_dist(size, lens, rx, ry, sensor=36.0, margin=1.18):
    fov_v = 2*math.atan((sensor*(ry/rx))/(2*lens))
    return (size*margin/2)/math.tan(fov_v/2)

BASE_HIDE={o.name:o.hide_render for o in bpy.data.objects}
def show_only(names):
    for o in bpy.data.objects:
        if o.type=="MESH": o.hide_render=(o.name not in names)
def restore_hide():
    for n,h in BASE_HIDE.items():
        ob=bpy.data.objects.get(n)
        if ob: ob.hide_render=h

force(61)
BLADE=blade_names(); show_only(BLADE)
pts=[]
for n in BLADE:
    l,h=wbb(bpy.data.objects[n]); pts+=[l,h]
lo=Vector([min(p[i] for p in pts) for i in range(3)])
hi=Vector([max(p[i] for p in pts) for i in range(3)])
cen=(lo+hi)*0.5; ext=hi-lo
BW=ext.x   # blade width reference (world X extent)

# ---------------- OUT1 — hero 85 mm, frontal-biased 3/4 so the core reads ----------------
RX,RY=1800,2400
DIRV=Vector((0.57,-0.81,0.11)).normalized()   # documented CE15 authored-hero direction
dist=fit_dist(max(ext.z,ext.x), 85.0, RX, RY)
hero=mkcam("TMP_HERO_85",85.0, cen+DIRV*dist, cen)
LOG["outputs"]["OUT1"]={
 "path":os.path.join(OUT,"OUT1_HERO_P3_85MM.png"),"resolution":[RX,RY],
 "camera":cam_report(hero),"scene":scene_state(),"frame":61,
 "lighting":"historical LIGHT_D rig reused (present & verified in source; energies/sizes unchanged) — NOT recovered",
 "direction_note":("hero 3/4 direction matched to the CE15 authored-hero camera vector (0.57,-0.81,0.11). "
                   "The historical LIGHT_D1_HERO_34 direction was tested first and OCCLUDES the P3 core behind the "
                   "chassis for CE15 geometry (it was framed for the pre-CE15 form) — reported, not concealed. "
                   "No material, emission or glare change was made.")}
render_to(LOG["outputs"]["OUT1"]["path"],RX,RY,hero)
dg=bpy.context.evaluated_depsgraph_get(); core=bpy.data.objects[CORE].evaluated_get(dg)
xs,ys=[],[]
for c in core.bound_box:
    v=world_to_camera_view(sc,hero,core.matrix_world@Vector(c)); xs.append(v.x); ys.append(v.y)
LOG["outputs"]["OUT1"]["core_roi_px"]=[max(0,int(min(xs)*RX-0.05*RX)),max(0,int((1-max(ys))*RY-0.05*RY)),
                                       min(RX,int(max(xs)*RX+0.05*RX)),min(RY,int((1-min(ys))*RY+0.05*RY))]

# ---------------- OUT2 — core/spine true section (boolean on duplicates, NOT applied) ------------
core_lo,core_hi=wbb(bpy.data.objects[CORE]); cz=(core_lo.z+core_hi.z)/2
dups=[]
for n in BLADE:
    s=bpy.data.objects[n]; d2=s.copy(); d2.data=s.data.copy(); d2.name="TMPSECT_"+n
    sc.collection.objects.link(d2); dups.append(d2)
LOG["temp_objects"]+= [d.name for d in dups]
pad=2.0
cmin=Vector((lo.x-pad,lo.y-pad,cz)); cmax=Vector((hi.x+pad,hi.y+pad,hi.z+pad))
me=bpy.data.meshes.new("TMPSECT_CUTTER_MESH"); bm=bmesh.new()
bmesh.ops.create_cube(bm,size=1.0); bm.to_mesh(me); bm.free()
cut=bpy.data.objects.new("TMPSECT_CUTTER",me); sc.collection.objects.link(cut)
cut.scale=(cmax.x-cmin.x,cmax.y-cmin.y,cmax.z-cmin.z); cut.location=(cmin+cmax)/2
cut.hide_render=True; LOG["temp_objects"].append("TMPSECT_CUTTER")
bpy.context.view_layer.update()
for d2 in dups:
    m=d2.modifiers.new("TMPSECT_BOOL","BOOLEAN"); m.operation="DIFFERENCE"; m.object=cut
    try: m.solver="EXACT"
    except Exception: pass
    LOG["temp_modifiers"].append(f"{d2.name}: BOOLEAN DIFFERENCE -> TMPSECT_CUTTER (NOT applied)")
for n in BLADE: bpy.data.objects[n].hide_render=True
for d2 in dups: d2.hide_render=False
bpy.context.view_layer.update()
# frame the CUT REGION (not the whole blade) but wide enough for orientation
spts=[]
for d2 in dups:
    try:
        l,h=wbb(d2); spts+=[l,h]
    except Exception: pass
slo=Vector([min(p[i] for p in spts) for i in range(3)])
shi=Vector([max(p[i] for p in spts) for i in range(3)])
scen=Vector((cen.x, cen.y, cz-0.10))
sspan=max(shi.x-slo.x, ext.y*2.2)*1.15
sdist=fit_dist(sspan,85.0,2000,1500)
sect=mkcam("TMP_SECT_CAM",85.0, scen+Vector((0.30,-0.72,0.62)).normalized()*sdist, scen)
LOG["outputs"]["OUT2"]={
 "path":os.path.join(OUT,"OUT2_CORE_SPINE_SECTION.png"),"resolution":[2000,1500],
 "camera":cam_report(sect),"scene":scene_state(),
 "plane":{"axis":"Z (horizontal, world)","coordinate_world_z":round(cz,6),
          "rationale":"passes through the P3 core centre; the plan slice exposes the corrected spine window, core, central spine, adjacent rails/chassis and porcelain shell together"},
 "cutter_bounds":{"min":[round(v,6) for v in cmin],"max":[round(v,6) for v in cmax]},
 "duplicated_object_list":[d.name for d in dups],
 "method":"non-destructive BOOLEAN DIFFERENCE on duplicates; modifier NOT applied; originals untouched and hidden from this render",
 "viewport_clipping_used":False}
render_to(LOG["outputs"]["OUT2"]["path"],2000,1500,sect)
for d2 in dups: bpy.data.objects.remove(d2,do_unlink=True)
bpy.data.objects.remove(cut,do_unlink=True)
restore_hide(); show_only(BLADE); bpy.context.view_layer.update()

# ---------------- OUT3 — exploded load-path (translation only, viewed across the axis) ----------
force(61)
def grp(names): return [n for n in names if bpy.data.objects.get(n)]
PORC=grp(["ZB45_SHELL_LL","ZB45_SHELL_UL"]); TABS=grp(["ZB45_SHELL_LR","ZB45_SHELL_UR"])
CHAN=grp(["ZB_LP_CHANNEL_L","ZB_LP_CHANNEL_R"])
RAILS=[n for n in bpy.data.objects.keys() if "RAIL" in n and n in BLADE]
CHASSISG=grp([CH,NK]); SPINEG=grp([SPINE])
HUB=grp(["ZB46_DRIVE_HUB","ZB48_HANDLE_REGISTERED_TO_HAND_MARKER","ZB46_HUB_SHOULDER_L",
         "ZB46_HUB_SHOULDER_R","ZB46_HUB_SPINE_KEY"])
def cy(ns):
    v=[]
    for n in ns:
        o=bpy.data.objects.get(n)
        if o: l,h=wbb(o); v.append((l.y+h.y)/2)
    return round(sum(v)/len(v),6) if v else None
STEP=0.12*BW                      # within the 0.08-0.12 blade-width band
LAYERS=[("porcelain cutting mass",PORC,4),
        ("root transitions / bearing roots",TABS,3),
        ("wedge followers",CHAN,2),
        ("keyed channels / rails",RAILS,1),
        ("chassis / spine  (ANCHOR - stays)",CHASSISG+SPINEG,0),
        ("hub / handle axis",HUB,0)]
edups=[]
for label,names,mult in LAYERS:
    for n in names:
        s=bpy.data.objects.get(n)
        if not s: continue
        d2=s.copy(); d2.data=s.data.copy(); d2.name="TMPEXP_"+n
        sc.collection.objects.link(d2)
        if mult:
            d2.location=d2.location+Vector((0.0,-STEP*mult,0.0))   # translation ONLY
            LOG["temp_transforms"].append(f"{d2.name}: translate (0,{round(-STEP*mult,6)},0)  layer='{label}'")
        edups.append(d2)
LOG["temp_objects"]+=[d.name for d in edups]
LOG["outputs"]["OUT3_axis_mapping"]={
 "measured_layer_centroids_world_Y_BEFORE_transform":{"porcelain":cy(PORC),"spine":cy(SPINEG),"chassis":cy(CHASSISG)},
 "chosen_primary_axis":"world -Y  (lateral assembly axis: layers stack front-to-back along Y — porcelain in front of the spine, chassis behind)",
 "blade_width_reference_world_X_extent_m":round(BW,6)}
LOG["outputs"]["OUT3_offsets"]={"step_m":round(STEP,6),"step_as_blade_width":0.12,
 "max_total_offset_m":round(STEP*4,6),"max_total_as_blade_width":round(STEP*4/BW,4),
 "budget_blade_width":0.55}
for n in BLADE: bpy.data.objects[n].hide_render=True
for d2 in edups: d2.hide_render=False
bpy.context.view_layer.update()
ep=[]
for d2 in edups:
    l,h=wbb(d2); ep+=[l,h]
elo=Vector([min(p[i] for p in ep) for i in range(3)]); ehi=Vector([max(p[i] for p in ep) for i in range(3)])
ecen=(elo+ehi)*0.5; eext=ehi-elo
# view ACROSS the explode axis (mostly along +X) so Y-separation reads
EDIR=Vector((0.93,-0.22,0.30)).normalized()
edist=fit_dist(max(eext.z,eext.y*2.4),85.0,2400,1800)
ecam=mkcam("TMP_EXP_CAM",85.0, ecen+EDIR*edist, ecen)
LOG["outputs"]["OUT3"]={
 "path":os.path.join(OUT,"OUT3_EXPLODED_LOADPATH.png"),"resolution":[2400,1800],
 "camera":cam_report(ecam),"scene":scene_state(),
 "method":"translation-only on duplicates; NO rotation; no geometry edit; originals untouched",
 "rotation_used":False,
 "camera_note":"viewed across the explode axis (mostly +X) so the Y separation is legible; first attempt viewed near-parallel to the axis and was rejected",
 "layers":[{"label":l,"objects":ns,"offset_multiplier":m,"offset_m":round(-STEP*m,6)} for l,ns,m in LAYERS]}
render_to(LOG["outputs"]["OUT3"]["path"],2400,1800,ecam,samples=96)
for d2 in edups: bpy.data.objects.remove(d2,do_unlink=True)
restore_hide(); bpy.context.view_layer.update()

# ---------------- OUT4 — scale vs human ----------------
force(61)
# measure every non-blade mesh regardless of current render visibility
actor_meshes=[]
for o in bpy.data.objects:
    if o.type!="MESH" or o.name in BLADE: continue
    try:
        l,h=wbb(o)
        if (h-l).length>0: actor_meshes.append((o.name,l,h))
    except Exception: pass
if actor_meshes:
    alo=Vector([min(m[1][i] for m in actor_meshes) for i in range(3)])
    ahi=Vector([max(m[2][i] for m in actor_meshes) for i in range(3)])
else:
    alo=ahi=None
LOG["outputs"]["OUT4_actor_measurement"]={
 "non_blade_mesh_count":len(actor_meshes),
 "armatures":[o.name for o in bpy.data.objects if o.type=="ARMATURE"],
 "measured_bbox_min":[round(v,6) for v in alo] if alo else None,
 "measured_bbox_max":[round(v,6) for v in ahi] if ahi else None,
 "measured_height_m":round(ahi.z-alo.z,6) if alo else None,
 "tallest_meshes":sorted([(n,round(h.z-l.z,4)) for n,l,h in actor_meshes],key=lambda t:-t[1])[:12]}
blade_len=round(ext.z,6)
LOG["outputs"]["OUT4_blade_measurement"]={
 "length_Z_m":blade_len,"length_in":round(blade_len/0.0254,4),
 "width_X_m":round(ext.x,6),"depth_Y_m":round(ext.y,6),
 "canon_range_in":[35,58],"canon_range_m":[round(35*0.0254,4),round(58*0.0254,4)],
 "inside_canon_range":bool(35 <= blade_len/0.0254 <= 58)}

# use the in-scene actor if it measures a plausible human height, else a temp proxy
USE_ACTOR = bool(alo) and 1.5 <= (ahi.z-alo.z) <= 2.1
LOG["outputs"]["OUT4_reference_decision"]=("EXISTING_IN_SCENE_ACTOR" if USE_ACTOR
                                           else "TEMP_PRIMITIVE_PROXY (no in-scene reference of plausible human height)")
proxy_objs=[]
if USE_ACTOR:
    show=set(BLADE)|{n for n,_,_ in actor_meshes}
    show_only(show)
    ref_h=ahi.z-alo.z; ref_lo=alo; ref_hi=ahi
    ref_label="IN-SCENE ACTOR (measured)"
else:
    mat=bpy.data.materials.new("TMP_PROXY_GREY"); mat.use_nodes=True
    for nnode in mat.node_tree.nodes:
        if nnode.type=="BSDF_PRINCIPLED":
            nnode.inputs["Base Color"].default_value=(0.18,0.18,0.19,1)
            try: nnode.inputs["Roughness"].default_value=0.7
            except Exception: pass
    LOG["temp_objects"].append("TMP_PROXY_GREY (material)")
    H=1.75
    ground_z=lo.z
    px=lo.x-0.75      # stand the proxy beside the blade, same ground plane
    py=cen.y
    def prim(kind,name,loc,**kw):
        if kind=="uv": bpy.ops.mesh.primitive_uv_sphere_add(location=loc,**kw)
        elif kind=="cyl": bpy.ops.mesh.primitive_cylinder_add(location=loc,**kw)
        ob=bpy.context.active_object; ob.name=name
        ob.data.materials.clear(); ob.data.materials.append(mat)
        proxy_objs.append(ob); LOG["temp_objects"].append(name); return ob
    prim("uv","TMP_PROXY_HEAD",(px,py,ground_z+H-0.115),radius=0.115,segments=24,ring_count=12)
    prim("cyl","TMP_PROXY_TORSO",(px,py,ground_z+H-0.53),radius=0.165,depth=0.62)
    prim("cyl","TMP_PROXY_HIPS",(px,py,ground_z+H-0.92),radius=0.145,depth=0.20)
    for sx,nm in ((-0.20,"L"),(0.20,"R")):
        prim("cyl",f"TMP_PROXY_ARM_{nm}",(px+sx,py,ground_z+H-0.55),radius=0.055,depth=0.66)
    for sx,nm in ((-0.085,"L"),(0.085,"R")):
        prim("cyl",f"TMP_PROXY_LEG_{nm}",(px+sx,py,ground_z+0.42),radius=0.075,depth=0.84)
    bpy.context.view_layer.update()
    pp=[]
    for ob in proxy_objs:
        l,h=wbb(ob); pp+=[l,h]
    ref_lo=Vector([min(p[i] for p in pp) for i in range(3)])
    ref_hi=Vector([max(p[i] for p in pp) for i in range(3)])
    ref_h=ref_hi.z-ref_lo.z
    show_only(set(BLADE)|{o.name for o in proxy_objs})
    ref_label="SCALE PROXY - NOT CHARACTER ASSET"

bpy.context.view_layer.update()
apts=[lo,hi,ref_lo,ref_hi]
glo=Vector([min(p[i] for p in apts) for i in range(3)])
ghi=Vector([max(p[i] for p in apts) for i in range(3)])
gcen=(glo+ghi)*0.5; gext=ghi-glo
gdist=fit_dist(max(gext.z,gext.x),85.0,1800,2200)
gcam=mkcam("TMP_SCALE_CAM",85.0, gcen+Vector((0.10,-0.985,0.02)).normalized()*gdist, gcen, "ORTHO")
gcam.data.type="ORTHO"; gcam.data.ortho_scale=max(gext.z,gext.x)*1.15
bpy.context.view_layer.update()
LOG["outputs"]["OUT4"]={
 "path":os.path.join(OUT,"OUT4_SCALE_VS_HUMAN.png"),"resolution":[1800,2200],
 "camera":cam_report(gcam),"scene":scene_state(),
 "reference_used":ref_label,
 "reference_height_m":round(ref_h,6),
 "reference_bbox_min":[round(v,6) for v in ref_lo],"reference_bbox_max":[round(v,6) for v in ref_hi],
 "blade_length_m":blade_len,"blade_length_in":round(blade_len/0.0254,4),
 "blade_to_reference_ratio":round(blade_len/ref_h,6),
 "same_ground_plane_z":round(min(lo.z,ref_lo.z),6),
 "blade_resized":False}
render_to(LOG["outputs"]["OUT4"]["path"],1800,2200,gcam,samples=96)
for ob in proxy_objs: bpy.data.objects.remove(ob,do_unlink=True)
restore_hide()

print("###LOG###"); print(json.dumps(LOG,indent=1,default=str)); print("###ENDLOG###")
print("IS_DIRTY:",bpy.data.is_dirty); print("NO_SAVE_PERFORMED: TRUE")
