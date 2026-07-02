# -*- coding: utf-8 -*-
r"""
MIKAGE BUILD LOG — STANDING HERO V0_2: the FULL 0 -> final evolution arc (operator request
2026-07-02: "quá trình từ 0 -> final", not only the final money-shots).
Arc: blockout -> match-to-master -> helmet geometry passes -> porcelain lookdev ->
body build -> assembly -> polish -> ASSET-LOCK V0.14 -> first Canvas (MOTION V0.2).
Supersedes build_buildlog_standing_hero.py (V0_1, kept for history — do not run).
Editorial format, music = PORCELAIN ASCENSION from 0:00.

HUE-SAFETY: MOTION V0.2 goes in UNGRADED (no eq/colorbalance) — slit violet is operator-approved.

Run on the operator's machine:  python build_buildlog_standing_hero_v0_2.py
Needs: Python 3 + pillow + numpy, ffmpeg/ffprobe on PATH. Output = PROTOTYPE / NOT CANON-LOCKED, local only.
Paths are computed relative to this file (no machine-specific absolute paths).
"""
import os, subprocess, tempfile, shutil
from PIL import Image, ImageDraw, ImageFont, ImageFilter
import numpy as np

HERE  = os.path.dirname(os.path.abspath(__file__))
REPO  = os.path.abspath(os.path.join(HERE, "..", "..", "..", ".."))          # ...\KAGAMI-MZ_SYNC_PUSH_V2
AUDIO = os.path.join(os.path.dirname(REPO), "MIKAGE ZENITH AUDIO")            # sibling audio root
FONTS = os.path.join(AUDIO, "tools", "mikage_short_toolkit")
REV   = os.path.join(REPO, "production", "character", "reviews")
P     = lambda n: os.path.join(REV, n)

MOT   = P("MIKAGE_STANDING_HERO_MOTION_V0_2.mp4")
MUSIC = os.path.join(AUDIO, "LIVE", "06. PORCELAIN ASCENSION", "1_MASTER", "PORCELAIN ASCENSION.wav")
OUT   = os.path.join(HERE, "MIKAGE_BUILDLOG_STANDING_HERO_V0_2.mp4")
OUT_HOOK = os.path.join(HERE, "MIKAGE_BUILDLOG_STANDING_HERO_V0_2_HOOK.mp4")

# ---- the 0 -> final arc (chapter, [(file, label, secs), ...]) ----
ARC = [
 ("01  ·  THE BLOCK", "IT BEGAN AS A BLOCK", "three blocking passes · silhouette only", [
   ("LANE_A_PUBLIC_TARGET_BLOCKING_PROOF_V0_1_CONTACT_SHEET.png",           "BLOCKING V0.1", 2.0),
   ("LANE_A_PUBLIC_TARGET_BLOCKING_V0_2_REFINEMENT_PROOF_CONTACT_SHEET.png","BLOCKING V0.2 · REFINEMENT", 2.0),
   ("LANE_A_PUBLIC_TARGET_BLOCKING_V0_3_SHAPE_POLISH_PROOF_CONTACT_SHEET.png","BLOCKING V0.3 · SHAPE POLISH", 2.0),
 ]),
 ("02  ·  THE MASTER", "MATCHED TO THE DRAWING", "3D bent back to the 2D master", [
   ("MIKAGE_MATCH_3D_TO_MASTER_V0_1_CONTACT_SHEET.png",     "MATCH TO MASTER V0.1", 2.0),
   ("MIKAGE_MICRO_GEOMETRY_CORRECTION_V0_2_CONTACT_SHEET.png","MICRO CORRECTION V0.2", 2.0),
 ]),
 ("03  ·  THE HELMET", "FIVE PASSES OF PORCELAIN", "geometry rebuilt until the crown ran clean", [
   ("MIKAGE_HELMET_ONLY_GEOMETRY_PASS_V0_3_CONTACT_SHEET.png",  "HELMET V0.3 · GEOMETRY", 2.0),
   ("MIKAGE_HELMET_REBUILD_FROM_BLOCKING_V0_4_CONTACT_SHEET.png","HELMET V0.4 · REBUILD", 2.0),
   ("MIKAGE_HELMET_PROPORTION_REFINE_V0_5_CONTACT_SHEET.png",   "HELMET V0.5 · PROPORTION", 2.0),
   ("MIKAGE_HELMET_CONTROLLED_SUBDIV_V0_6_CONTACT_SHEET.png",   "HELMET V0.6 · SUBDIV", 2.0),
   ("MIKAGE_HELMET_SURFACE_CONTROL_V0_7_CONTACT_SHEET.png",     "HELMET V0.7 · SURFACE LOCK", 2.4),
 ]),
 ("04  ·  THE ONLY LIGHT", "PORCELAIN LOOKDEV", "clay first · then the finish", [
   ("MIKAGE_HERO_LOOKDEV_PREMIUM_V0_8_CLAY_VALIDATION.png","LOOKDEV V0.8 · CLAY", 2.0),
   ("MIKAGE_HERO_LOOKDEV_PREMIUM_V0_8_CONTACT_SHEET.png",  "LOOKDEV V0.8 · PORCELAIN", 2.4),
 ]),
 ("05  ·  THE BODY", "FROM BLOCK TO CLOAK", "de-blockout · heavy folds · matte graphite", [
   ("MIKAGE_BODY_FORM_DEBLOCKOUT_V0_9_CONTACT_SHEET.png", "BODY V0.9 · DE-BLOCKOUT", 2.0),
   ("MIKAGE_BODY_CLOAK_STRUCTURE_V0_10_CONTACT_SHEET.png","BODY V0.10 · CLOAK STRUCTURE", 2.0),
   ("MIKAGE_BODY_LOOKDEV_MATTE_V0_11_CONTACT_SHEET.png",  "BODY V0.11 · MATTE LOOKDEV", 2.0),
 ]),
 ("06  ·  THE ASSEMBLY", "FULL FIGURE", "head · cloak · blade · halo — one body", [
   ("MIKAGE_STANDING_CHARACTER_CANDIDATE_V0_12_HERO.png","STANDING CANDIDATE V0.12", 3.2),
 ]),
 ("07  ·  THE LOCK", "THE STANDING HERO", "polish · slit violet · asset-locked", [
   ("MIKAGE_STANDING_HERO_POLISH_V0_13_HERO.png","HERO POLISH V0.13", 2.0),
   ("MIKAGE_STANDING_HERO_POLISH_V0_14_HERO.png","OFFICIAL STANDING HERO · V0.14", 5.0),
 ]),
]

W,H,FR = 1080,1920,30   # MOTION V0.2 is 30fps — match it 1:1
VOID=(5,5,8); PORC=(242,238,234); SIL=(150,150,168); VIOLET=(143,0,255)
CIN7=lambda s:ImageFont.truetype(os.path.join(FONTS,"cinzel700.ttf"),s)
CIN4=lambda s:ImageFont.truetype(os.path.join(FONTS,"cinzel400.ttf"),s)
SP  =lambda s:ImageFont.truetype(os.path.join(FONTS,"spacemono400.ttf"),s)

def sh(a): subprocess.run(a, check=True)
def base():
    img=Image.new("RGB",(W,H),VOID); halo=Image.new("RGB",(W,H),VOID)
    ImageDraw.Draw(halo).ellipse([W//2-360,760,W//2+360,1240],fill=(20,5,32))
    return Image.blend(img,halo.filter(ImageFilter.GaussianBlur(200)),0.7)
def trk(d,y,t,f,fill,tr):
    x=W/2-(sum(d.textlength(c,font=f) for c in t)+tr*(len(t)-1))/2
    for c in t: d.text((x,y),c,font=f,fill=fill); x+=d.textlength(c,font=f)+tr
def fit(d,t,fn,hi,lo,tr,maxw):
    s=hi
    while s>lo:
        f=fn(s)
        if sum(d.textlength(c,font=f) for c in t)+tr*(len(t)-1)<=maxw: return f
        s-=2
    return fn(lo)
def vdiv(img,y):
    g=Image.new("RGB",(W,H),(0,0,0)); ImageDraw.Draw(g).line([(W//2-70,y),(W//2+70,y)],fill=VIOLET,width=3)
    return Image.composite(Image.new("RGB",(W,H),VIOLET),img,g.filter(ImageFilter.GaussianBlur(4)).convert("L").point(lambda v:min(255,v*2)))
def grain(img,seed):
    rng=np.random.default_rng(seed); n=rng.normal(0,4,(H,W,1)).repeat(3,2)
    return Image.fromarray(np.clip(np.asarray(img).astype(np.int16)+n.astype(np.int16),0,255).astype(np.uint8))

def card(path, header, title, sub):
    img=base(); d=ImageDraw.Draw(img)
    trk(d,150,"MIKAGE ZENITH",CIN4(38),SIL,13); trk(d,214,header,SP(24),(110,106,118),8)
    tf=fit(d,title,CIN7,108,46,6,W-150); trk(d,870,title,tf,PORC,6)
    img=vdiv(img,1010); d=ImageDraw.Draw(img)
    if sub: trk(d,1052,sub,SP(26),SIL,4)
    trk(d,H-130,"PROTOTYPE  //  NOT CANON-LOCKED",SP(22),(150,122,180),3)
    grain(img,7).save(path)

def label_overlay(path, label):
    img=Image.new("RGBA",(W,H),(0,0,0,0)); d=ImageDraw.Draw(img)
    trk(d,150,label,CIN4(40),PORC,8)
    trk(d,1740,"PROTOTYPE  //  NOT CANON-LOCKED",SP(22),(150,122,180),3)
    img.save(path)

def still(path, secs, out):
    sh(["ffmpeg","-y","-v","error","-loop","1","-t",str(secs),"-i",path,
        "-vf","scale=1080:1920,format=yuv420p","-r",str(FR),
        "-c:v","libx264","-preset","medium","-crf","19",out])

def clip_image(src, label, secs, w, out):
    """framed still chapter: image fit inside 980x1500 on void + corner ticks + label."""
    ov=os.path.join(w,"ov_%s.png"%os.path.basename(out)); label_overlay(ov,label)
    im=Image.open(src).convert("RGB")
    r=min(980/im.width, 1500/im.height); im=im.resize((int(im.width*r),int(im.height*r)),Image.LANCZOS)
    cv=base(); px,py=(W-im.width)//2,(H-im.height)//2; cv.paste(im,(px,py))
    d=ImageDraw.Draw(cv); x0,y0=px-6,py-6; x1,y1=px+im.width+6,py+im.height+6
    for cx,cy in [(x0,y0),(x1,y0),(x0,y1),(x1,y1)]:
        d.line([cx-18,cy,cx+18,cy],fill=(130,126,140),width=1); d.line([cx,cy-18,cx,cy+18],fill=(130,126,140),width=1)
    base_png=os.path.join(w,"img_%s.png"%os.path.basename(out)); grain(cv,3).save(base_png)
    sh(["ffmpeg","-y","-v","error","-loop","1","-t",str(secs),"-i",base_png,"-loop","1","-i",ov,
        "-filter_complex","[0:v][1:v]overlay=0:0:shortest=1,format=yuv420p","-t",str(secs),"-r",str(FR),
        "-c:v","libx264","-preset","medium","-crf","19",out])

def clip_motion_ungraded(src, label, loops, w, out):
    """MOTION V0.2, hue-safe: NO grading, already 1080x1920/30fps. Loop N extra times + label."""
    ov=os.path.join(w,"ov_mot.png"); label_overlay(ov,label)
    sh(["ffmpeg","-y","-v","error","-stream_loop",str(loops),"-i",src,"-loop","1","-i",ov,
        "-filter_complex","[0:v][1:v]overlay=0:0:shortest=1,format=yuv420p[o]",
        "-map","[o]","-r",str(FR),"-c:v","libx264","-preset","medium","-crf","19",out])

def main():
    need=[MOT,MUSIC]+[P(f) for _,_,_,items in ARC for f,_,_ in items]
    missing=[p for p in need if not os.path.exists(p)]
    if missing:
        for p in missing: print("!! MISSING:",p)
        return
    w=tempfile.mkdtemp(); seg=[]; n=[0]
    def title_card(header, title, sub, secs=2.4):
        n[0]+=1; c=os.path.join(w,"c%02d.png"%n[0]); card(c,header,title,sub)
        s=os.path.join(w,"s%02d.mp4"%n[0]); still(c,secs,s); seg.append(s)
    try:
        title_card("BUILD LOG  //  STANDING HERO","IT STANDS","from a block to the official hero",2.8)
        for header,title,sub,items in ARC:
            title_card(header,title,sub)
            for f,label,secs in items:
                n[0]+=1; sc=os.path.join(w,"m%02d.mp4"%n[0])
                clip_image(P(f),label,secs,w,sc); seg.append(sc)
        # climax: it wakes — MOTION V0.2 x2, UNGRADED
        title_card("08  ·  IT WAKES","FIRST CANVAS","dormant → ignition → dormant")
        sc=os.path.join(w,"m_mot.mp4"); clip_motion_ungraded(MOT,"CANVAS V0.2 · APPROVED",1,w,sc); seg.append(sc)
        # end card
        title_card("MIKAGE ZENITH","IT STANDS","Listen now  —  PORCELAIN ASCENSION",3.0)
        # concat
        cl=os.path.join(w,"cl.txt"); open(cl,"w").write("".join("file '%s'\n"%x for x in seg))
        vid=os.path.join(w,"vid.mp4")
        try: sh(["ffmpeg","-y","-v","error","-f","concat","-safe","0","-i",cl,"-c","copy",vid])
        except subprocess.CalledProcessError:
            sh(["ffmpeg","-y","-v","error","-f","concat","-safe","0","-i",cl,"-c:v","libx264","-preset","medium","-crf","19","-pix_fmt","yuv420p","-r",str(FR),vid])
        dur=float(subprocess.check_output(["ffprobe","-v","error","-show_entries","format=duration","-of","csv=p=0",vid]).decode().strip())
        # music PORCELAIN ASCENSION from 0:00
        au=os.path.join(w,"au.m4a"); fade=dur-2.0
        sh(["ffmpeg","-y","-v","error","-ss","0","-t","%.2f"%dur,"-i",MUSIC,"-af","afade=t=in:st=0:d=0.6,afade=t=out:st=%.2f:d=2.0"%fade,"-ar","48000","-ac","2","-c:a","aac","-b:a","320k",au])
        tmp=OUT+".tmp.mp4"; sh(["ffmpeg","-y","-v","error","-i",vid,"-i",au,"-map","0:v:0","-map","1:a:0","-c:v","copy","-c:a","copy","-shortest",tmp]); os.replace(tmp,OUT)
        print("BUILD LOG saved:",OUT,"dur=%.1fs"%dur)
        # hook = tail ~18s (IT WAKES motion + end card) for Shorts/TikTok
        start=max(0,dur-18); th=OUT_HOOK+".tmp.mp4"
        sh(["ffmpeg","-y","-v","error","-ss","%.2f"%start,"-i",OUT,"-t","18","-c","copy",th]); os.replace(th,OUT_HOOK)
        print("HOOK saved:",OUT_HOOK)
    finally:
        shutil.rmtree(w, ignore_errors=True)

if __name__=="__main__":
    main()
