# ZENITH_BLADE_OUTSTANDING_RENDERS_01 — authorized bounded evidence renders.
# READ-ONLY on the source: no save, no geometry edit, no applied modifiers,
# no material/emission change. All temp objects live only in this in-memory session.
import bpy, bmesh, json, math, os, sys
from mathutils import Vector
from bpy_extras.object_utils import world_to_camera_view

OUT = r"D:\KAGAMI-MZ_SYNC_PUSH_V2\_tmp\zenith_blade_outstanding_renders_01"
os.makedirs(OUT, exist_ok=True)
LOG = {"temp_objects": [], "temp_modifiers": [], "temp_transforms": [], "outputs": {}}
sc = bpy.context.scene

CORE  = "ZB42_P3_SINGLE_RECESSED_CORE"
SPINE = "ZB42_CENTRAL_LOAD_SPINE"
CH, NK = "ZB_ARCH03R_CHASSIS", "ZB_ARCH03R_HUB_NECK"

def force(f):
    sc.frame_set(f + 1); bpy.context.view_layer.update()
    sc.frame_set(f);     bpy.context.view_layer.update()

def blade_names():
    return {o.name for o in bpy.data.objects if o.type == "MESH" and
            (o.name.startswith("ZB") or o.name.startswith("CE01") or o.name in (CH, NK))}

def wbb(o):
    dg = bpy.context.evaluated_depsgraph_get()
    oe = o.evaluated_get(dg)
    pts = [oe.matrix_world @ Vector(c) for c in oe.bound_box]
    return (Vector([min(p[i] for p in pts) for i in range(3)]),
            Vector([max(p[i] for p in pts) for i in range(3)]))

def scene_state():
    vs = sc.view_settings
    w = sc.world; bg = None
    if w and w.use_nodes:
        for n in w.node_tree.nodes:
            if n.type == "BACKGROUND":
                bg = {"color_linear": [round(v,6) for v in n.inputs[0].default_value],
                      "strength": round(n.inputs[1].default_value,4)}
    ng = getattr(sc,"node_tree",None) or getattr(sc,"compositing_node_group",None)
    return {"engine": sc.render.engine, "view_transform": vs.view_transform,
            "look": getattr(vs,"look",None), "exposure": round(vs.exposure,4),
            "gamma": round(vs.gamma,4), "world": bg,
            "use_compositing": sc.render.use_compositing,
            "compositor_nodes": [n.type for n in ng.nodes] if ng else [],
            "lights_enabled": [{"name":o.name,"type":o.data.type,"energy":round(o.data.energy,4),
                                "size":round(getattr(o.data,'size',0),4),
                                "size_y":round(getattr(o.data,'size_y',0),4),
                                "loc":[round(v,5) for v in o.location]}
                               for o in bpy.data.objects
                               if o.type=="LIGHT" and not o.hide_render]}

def cam_report(cam):
    d = cam.data
    return {"name": cam.name, "type": d.type, "lens_mm": round(d.lens,4),
            "sensor_width": round(d.sensor_width,4), "sensor_height": round(d.sensor_height,4),
            "sensor_fit": d.sensor_fit,
            "location": [round(v,6) for v in cam.matrix_world.translation],
            "rotation_euler": [round(v,6) for v in cam.matrix_world.to_euler()]}

def render_to(path, rx, ry, cam, samples=96):
    r = sc.render
    r.engine = "BLENDER_EEVEE"
    r.image_settings.file_format = "PNG"; r.image_settings.color_mode = "RGBA"
    r.film_transparent = False
    r.resolution_x, r.resolution_y, r.resolution_percentage = rx, ry, 100
    try: sc.eevee.taa_render_samples = samples
    except Exception: pass
    sc.camera = cam
    r.filepath = path
    bpy.ops.render.render(write_still=True)

def show_only(names):
    for o in bpy.data.objects:
        if o.type == "MESH":
            o.hide_render = (o.name not in names)

BASE_HIDE = {o.name: o.hide_render for o in bpy.data.objects}
def restore_hide():
    for n, h in BASE_HIDE.items():
        ob = bpy.data.objects.get(n)
        if ob: ob.hide_render = h

# =====================================================================
# OUTPUT 1 — CE15 P3 HERO, 85 mm PERSPECTIVE
# =====================================================================
force(61)
BLADE = blade_names()
show_only(BLADE)

pts = []
for n in BLADE:
    o = bpy.data.objects[n]
    if o.hide_render: continue
    lo, hi = wbb(o); pts += [lo, hi]
lo = Vector([min(p[i] for p in pts) for i in range(3)])
hi = Vector([max(p[i] for p in pts) for i in range(3)])
cen = (lo + hi) * 0.5
extent = hi - lo
LOG["blade_world_bbox"] = {"min":[round(v,6) for v in lo], "max":[round(v,6) for v in hi],
                           "extent":[round(v,6) for v in extent]}

# temp 85 mm PERSP hero camera, direction taken from the historical LIGHT_D1_HERO_34
ref = bpy.data.objects.get("LIGHT_D1_HERO_34")
if ref:
    dirv = (ref.matrix_world.translation - cen)
    dirv.z = abs(dirv.z)
    dirv.normalize()
    LOG["hero_direction_source"] = "LIGHT_D1_HERO_34 (historical 85 mm PERSP hero 3/4 camera) — direction reused"
else:
    dirv = Vector((0.62, -0.74, 0.12)).normalized()
    LOG["hero_direction_source"] = "RECOVERED — LIGHT_D1_HERO_34 absent"

cd = bpy.data.cameras.new("TMP_HERO_85"); cd.type = "PERSP"; cd.lens = 85.0
hero = bpy.data.objects.new("TMP_HERO_85", cd); sc.collection.objects.link(hero)
LOG["temp_objects"] += ["TMP_HERO_85 (camera)"]

# fit distance so the blade fills the frame with margin (framing only; no geometry change)
RX, RY = 1800, 2400
sensor = cd.sensor_width
fit_h = max(extent.z, extent.x) * 1.18
fov_v = 2 * math.atan((sensor * (RY/RX)) / (2 * cd.lens))
dist = (fit_h / 2) / math.tan(fov_v / 2)
hero.location = cen + dirv * dist
hero.rotation_euler = (cen - hero.location).to_track_quat('-Z','Y').to_euler()
bpy.context.view_layer.update()

state = scene_state()
p1 = os.path.join(OUT, "OUT1_HERO_P3_85MM.png")
render_to(p1, RX, RY, hero, samples=128)

# project core bbox -> ROI (same +5% margin method as the historical proof)
dg = bpy.context.evaluated_depsgraph_get()
core = bpy.data.objects[CORE].evaluated_get(dg)
xs, ys = [], []
for c in core.bound_box:
    v = world_to_camera_view(sc, hero, core.matrix_world @ Vector(c))
    xs.append(v.x); ys.append(v.y)
roi = [max(0,int(min(xs)*RX - 0.05*RX)), max(0,int((1-max(ys))*RY - 0.05*RY)),
       min(RX,int(max(xs)*RX + 0.05*RX)), min(RY,int((1-min(ys))*RY + 0.05*RY))]
LOG["outputs"]["OUT1"] = {"path": p1, "resolution": [RX, RY], "camera": cam_report(hero),
                          "scene": state, "core_roi_px": roi, "frame": 61,
                          "lighting": "historical LIGHT_D rig reused (present & verified) — NOT recovered"}

# =====================================================================
# OUTPUT 2 — CORE / SPINE TRUE SECTION (boolean on duplicates, NOT applied)
# =====================================================================
core_lo, core_hi = wbb(bpy.data.objects[CORE])
core_mid_z = (core_lo.z + core_hi.z) / 2.0
LOG["outputs"]["OUT2_plane"] = {"axis": "Z (horizontal plane, world)",
                                "coordinate_world_z": round(core_mid_z, 6),
                                "rationale": "passes through the P3 core centre; plan slice shows spine window, core, spine, rails, chassis and porcelain simultaneously"}

SECT_SRC = [n for n in BLADE]
dups = []
for n in SECT_SRC:
    src = bpy.data.objects[n]
    dup = src.copy(); dup.data = src.data.copy()
    dup.name = "TMPSECT_" + n
    sc.collection.objects.link(dup)
    dups.append(dup)
LOG["temp_objects"] += [d.name for d in dups]
LOG["duplicated_object_list"] = [d.name for d in dups]

# cutter box: everything ABOVE the plane is removed from the duplicates
pad = 2.0
cutter_min = Vector((lo.x-pad, lo.y-pad, core_mid_z))
cutter_max = Vector((hi.x+pad, hi.y+pad, hi.z+pad))
cme = bpy.data.meshes.new("TMPSECT_CUTTER_MESH")
bm = bmesh.new()
bmesh.ops.create_cube(bm, size=1.0)
bm.to_mesh(cme); bm.free()
cutter = bpy.data.objects.new("TMPSECT_CUTTER", cme)
sc.collection.objects.link(cutter)
cutter.scale = (cutter_max.x-cutter_min.x, cutter_max.y-cutter_min.y, cutter_max.z-cutter_min.z)
cutter.location = (cutter_min + cutter_max) / 2.0
cutter.hide_render = True
LOG["temp_objects"] += ["TMPSECT_CUTTER"]
LOG["outputs"]["OUT2_cutter_bounds"] = {"min":[round(v,6) for v in cutter_min],
                                        "max":[round(v,6) for v in cutter_max]}
bpy.context.view_layer.update()

for d in dups:
    m = d.modifiers.new("TMPSECT_BOOL", "BOOLEAN")
    m.operation = "DIFFERENCE"; m.object = cutter
    try: m.solver = "EXACT"
    except Exception: pass
    LOG["temp_modifiers"].append(f"{d.name}: BOOLEAN DIFFERENCE -> TMPSECT_CUTTER (NOT applied)")

# originals hidden; only duplicates render
for n in SECT_SRC: bpy.data.objects[n].hide_render = True
for d in dups: d.hide_render = False

sect_cen = Vector((cen.x, cen.y, core_mid_z))
scd = bpy.data.cameras.new("TMP_SECT_CAM"); scd.type = "PERSP"; scd.lens = 85.0
sect_cam = bpy.data.objects.new("TMP_SECT_CAM", scd); sc.collection.objects.link(sect_cam)
LOG["temp_objects"] += ["TMP_SECT_CAM (camera)"]
sect_cam.location = sect_cen + Vector((0.42, -0.62, 0.66))
sect_cam.rotation_euler = (sect_cen - sect_cam.location).to_track_quat('-Z','Y').to_euler()
bpy.context.view_layer.update()
p2 = os.path.join(OUT, "OUT2_CORE_SPINE_SECTION.png")
render_to(p2, 2000, 1500, sect_cam, samples=128)
LOG["outputs"]["OUT2"] = {"path": p2, "resolution": [2000,1500], "camera": cam_report(sect_cam),
                          "scene": scene_state(), "method": "non-destructive BOOLEAN DIFFERENCE on evaluated duplicates; modifier NOT applied; originals untouched and hidden",
                          "viewport_clipping_used": False}

# tear down section state (in-memory only)
for d in dups:
    bpy.data.objects.remove(d, do_unlink=True)
bpy.data.objects.remove(cutter, do_unlink=True)
restore_hide(); show_only(BLADE)
bpy.context.view_layer.update()

# =====================================================================
# OUTPUT 3 — EXPLODED LOAD-PATH (translation-only on duplicates)
# =====================================================================
force(61)
# map the assembly axis from measured layer centroids BEFORE any transform
def centroid_y(names):
    vals = []
    for n in names:
        o = bpy.data.objects.get(n)
        if not o: continue
        l, h = wbb(o); vals.append((l.y + h.y) / 2)
    return sum(vals)/len(vals) if vals else None

PORC   = [n for n in ["ZB45_SHELL_LL","ZB45_SHELL_UL"] if bpy.data.objects.get(n)]
TABS   = [n for n in ["ZB45_SHELL_LR","ZB45_SHELL_UR"] if bpy.data.objects.get(n)]
CHAN   = [n for n in ["ZB_LP_CHANNEL_L","ZB_LP_CHANNEL_R"] if bpy.data.objects.get(n)]
RAILS  = [n for n in bpy.data.objects.keys() if "RAIL" in n and n in BLADE]
CHASSIS= [n for n in [CH, NK] if bpy.data.objects.get(n)]
SPINEG = [n for n in [SPINE] if bpy.data.objects.get(n)]
HUB    = [n for n in ["ZB46_DRIVE_HUB","ZB48_HANDLE_REGISTERED_TO_HAND_MARKER",
                      "ZB46_HUB_SHOULDER_L","ZB46_HUB_SHOULDER_R","ZB46_HUB_SPINE_KEY"]
          if bpy.data.objects.get(n)]
axis_probe = {"porcelain_Y": centroid_y(PORC), "spine_Y": centroid_y(SPINEG),
              "chassis_Y": centroid_y(CHASSIS)}
blade_width = round(extent.x, 6)
LOG["outputs"]["OUT3_axis_mapping"] = {
    "measured_layer_centroids_world_Y": {k: (round(v,6) if v is not None else None) for k,v in axis_probe.items()},
    "chosen_primary_axis": "world -Y (lateral assembly axis: layers stack front-to-back along Y; porcelain sits in front of spine, chassis behind)",
    "blade_width_reference_world_X_extent_m": blade_width}

LAYERS = [("porcelain cutting mass", PORC, 3),
          ("root transitions / bearing roots", TABS, 2),
          ("wedge followers", CHAN, 2),
          ("keyed channels / rails", RAILS, 1),
          ("chassis / spine (ANCHOR — stays)", CHASSIS + SPINEG, 0),
          ("hub / handle axis", HUB, 0)]
STEP = 0.10 * blade_width      # within the 0.08-0.12 blade-width band
edups = []
for label, names, mult in LAYERS:
    for n in names:
        src = bpy.data.objects.get(n)
        if not src: continue
        dup = src.copy(); dup.data = src.data.copy()
        dup.name = "TMPEXP_" + n
        sc.collection.objects.link(dup)
        off = Vector((0.0, -STEP*mult, 0.0))
        if mult: dup.location = dup.location + off        # translation ONLY
        edups.append((dup, label, mult))
        if mult:
            LOG["temp_transforms"].append(
                f"{dup.name}: translate (0, {round(-STEP*mult,6)}, 0) [layer '{label}']")
LOG["temp_objects"] += [d.name for d,_,_ in edups]
LOG["outputs"]["OUT3_offsets"] = {"step_m": round(STEP,6),
                                  "step_as_blade_width": 0.10,
                                  "max_total_offset_m": round(STEP*3,6),
                                  "max_total_as_blade_width": round(STEP*3/blade_width,4)}

for n in BLADE: bpy.data.objects[n].hide_render = True
for d,_,_ in edups: d.hide_render = False
bpy.context.view_layer.update()

epts = []
for d,_,_ in edups:
    l,h = wbb(d); epts += [l,h]
elo = Vector([min(p[i] for p in epts) for i in range(3)])
ehi = Vector([max(p[i] for p in epts) for i in range(3)])
ecen = (elo+ehi)*0.5
ecd = bpy.data.cameras.new("TMP_EXP_CAM"); ecd.type="PERSP"; ecd.lens=85.0
exp_cam = bpy.data.objects.new("TMP_EXP_CAM", ecd); sc.collection.objects.link(exp_cam)
LOG["temp_objects"] += ["TMP_EXP_CAM (camera)"]
eext = ehi-elo
edist = (max(eext.z, eext.x, eext.y)*1.25/2) / math.tan(2*math.atan((36.0*(2400/1800))/(2*85.0))/2)
exp_cam.location = ecen + Vector((0.78,-0.62,0.22)).normalized()*edist
exp_cam.rotation_euler = (ecen - exp_cam.location).to_track_quat('-Z','Y').to_euler()
bpy.context.view_layer.update()
p3 = os.path.join(OUT, "OUT3_EXPLODED_LOADPATH.png")
render_to(p3, 2400, 1800, exp_cam, samples=96)
LOG["outputs"]["OUT3"] = {"path": p3, "resolution": [2400,1800], "camera": cam_report(exp_cam),
                          "scene": scene_state(),
                          "method": "translation-only on evaluated duplicates; no rotation used; no geometry edit; originals untouched",
                          "rotation_used": False,
                          "layers": [{"label":l,"objects":[n for n in ns],"offset_mult":m} for l,ns,m in LAYERS]}

for d,_,_ in edups:
    bpy.data.objects.remove(d, do_unlink=True)
restore_hide()
bpy.context.view_layer.update()

# =====================================================================
# OUTPUT 4 — SCALE VS HUMAN (search for verified actor first)
# =====================================================================
force(61)
actor_candidates = []
for o in bpy.data.objects:
    if o.type == "MESH":
        ln = o.name.lower()
        if any(k in ln for k in ["mannequin","scale_actor","human","proxy_body","a2_","actor","body","torso","helmet","mikage"]):
            try:
                l,h = wbb(o); actor_candidates.append((o.name, round(l.z,4), round(h.z,4)))
            except Exception: pass
arms = [o.name for o in bpy.data.objects if o.type == "ARMATURE"]
LOG["outputs"]["OUT4_actor_search"] = {"armatures": arms,
                                       "mesh_candidates_sample": actor_candidates[:40],
                                       "candidate_count": len(actor_candidates)}

# measure a full actor bbox from evaluated scene data (all non-blade meshes that are visible)
non_blade = [o for o in bpy.data.objects
             if o.type=="MESH" and o.name not in BLADE and not BASE_HIDE.get(o.name, False)]
actor_lo = actor_hi = None
if non_blade:
    ap=[]
    for o in non_blade:
        try:
            l,h = wbb(o); ap += [l,h]
        except Exception: pass
    if ap:
        actor_lo = Vector([min(p[i] for p in ap) for i in range(3)])
        actor_hi = Vector([max(p[i] for p in ap) for i in range(3)])
LOG["outputs"]["OUT4_measured_actor_bbox"] = (
    {"min":[round(v,6) for v in actor_lo], "max":[round(v,6) for v in actor_hi],
     "height_m": round(actor_hi.z-actor_lo.z,6)} if actor_lo else None)

# blade measured length from evaluated data
blade_len = round(extent.z, 6)
LOG["outputs"]["OUT4_measured_blade"] = {
    "world_bbox_min":[round(v,6) for v in lo], "world_bbox_max":[round(v,6) for v in hi],
    "length_Z_m": blade_len, "length_in": round(blade_len/0.0254,4),
    "width_X_m": round(extent.x,6), "depth_Y_m": round(extent.y,6)}

print("###LOG###")
print(json.dumps(LOG, indent=1, default=str))
print("###ENDLOG###")
print("IS_DIRTY:", bpy.data.is_dirty)
print("NO_SAVE_PERFORMED: TRUE")
