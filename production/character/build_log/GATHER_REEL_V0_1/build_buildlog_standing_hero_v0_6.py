# -*- coding: utf-8 -*-
r"""
MIKAGE BUILD LOG — STANDING HERO V0_6 (operator correction 2026-07-03 x3):
v0_5 still put a caption on top of every image and the auto-crop heuristic kept guessing wrong
panels (cutting off the head, showing the reference image instead of the actual pass, etc.).

Operator instruction: DROP ALL TEXT OVERLAY ON IMAGES. Just gather the images, clean, as-is.
This version: each beat = the FULL source image (whole contact sheet or whole hero shot),
letterboxed to fit 1080x1920 on the void background, held static for the beat's duration.
NO caption drawn on top of any image. Chapter title cards (full black text card, no image
underneath) are kept as the only text, since they never sit on top of a render.

Still: FULL 0 -> final arc, same chapters/order as v0_4/v0_5 (incl. the V0.8.1 hue-fix milestone).

Supersedes v0_1..v0_5 scripts (kept for history — do not run).
Editorial format, music = PORCELAIN ASCENSION from 0:00.
HUE-SAFETY: MOTION V0.2 goes in UNGRADED — slit violet is operator-approved.

Run on the operator's machine:  python build_buildlog_standing_hero_v0_6.py
Needs: Python 3 + pillow + numpy, ffmpeg/ffprobe on PATH. Output = PROTOTYPE / NOT CANON-LOCKED, local only.
"""
import os, subprocess, tempfile, shutil
from PIL import Image, ImageDraw, ImageFont, ImageFilter
import numpy as np

HERE  = os.path.dirname(os.path.abspath(__file__))
REPO  = os.path.abspath(os.path.join(HERE, "..", "..", "..", ".."))
AUDIO = os.path.join(os.path.dirname(REPO), "MIKAGE ZENITH AUDIO")
FONTS = os.path.join(AUDIO, "tools", "mikage_short_toolkit")
REV   = os.path.join(REPO, "production", "character", "reviews")
P     = lambda n: os.path.join(REV, n)

MOT   = P("MIKAGE_STANDING_HERO_MOTION_V0_2.mp4")
MUSIC = os.path.join(AUDIO, "LIVE", "06. PORCELAIN ASCENSION", "1_MASTER", "PORCELAIN ASCENSION.wav")
OUT   = os.path.join(HERE, "MIKAGE_BUILDLOG_STANDING_HERO_V0_6.mp4")
OUT_HOOK = os.path.join(HERE, "MIKAGE_BUILDLOG_STANDING_HERO_V0_6_HOOK.mp4")

# ---- the arc: (chapter card, [(file, secs), ...]) — NO caption text drawn on images.
ARC = [
 ("01  ·  THE BLOCK", "IT BEGAN AS A BLOCK", "three blocking passes · silhouette only", [
  ("LANE_A_PUBLIC_TARGET_BLOCKING_PROOF_V0_1_CONTACT_SHEET.png", 3.2),
  ("LANE_A_PUBLIC_TARGET_BLOCKING_V0_2_REFINEMENT_PROOF_CONTACT_SHEET.png", 3.0),
  ("LANE_A_PUBLIC_TARGET_BLOCKING_V0_3_SHAPE_POLISH_PROOF_CONTACT_SHEET.png", 3.0),
 ]),
 ("02  ·  THE MASTER", "MATCHED TO THE DRAWING", "the 2D master sheet stays the law", [
  ("MIKAGE_MATCH_3D_TO_MASTER_V0_1_CONTACT_SHEET.png", 3.2),
  ("MIKAGE_MICRO_GEOMETRY_CORRECTION_V0_2_CONTACT_SHEET.png", 3.0),
 ]),
 ("03  ·  THE HELMET", "FIVE PASSES OF PORCELAIN", "rebuilt until the crown ran clean", [
  ("MIKAGE_HELMET_ONLY_GEOMETRY_PASS_V0_3_CONTACT_SHEET.png", 3.0),
  ("MIKAGE_HELMET_REBUILD_FROM_BLOCKING_V0_4_CONTACT_SHEET.png", 3.0),
  ("MIKAGE_HELMET_PROPORTION_REFINE_V0_5_CONTACT_SHEET.png", 3.0),
  ("MIKAGE_HELMET_CONTROLLED_SUBDIV_V0_6_CONTACT_SHEET.png", 3.0),
  ("MIKAGE_HELMET_SURFACE_CONTROL_V0_7_CONTACT_SHEET.png", 3.4),
 ]),
 ("04  ·  THE ONLY LIGHT", "PORCELAIN LOOKDEV", "clay first · then the finish", [
  ("MIKAGE_HERO_LOOKDEV_PREMIUM_V0_8_CLAY_VALIDATION.png", 3.0),
  ("MIKAGE_HERO_LOOKDEV_PREMIUM_V0_8_CONTACT_SHEET.png", 3.4),
  ("MIKAGE_HERO_LOOKDEV_PREMIUM_V0_8_1_CONTACT_SHEET.png", 3.4),
 ]),
 ("05  ·  THE BODY", "FROM BLOCK TO CLOAK", "three rounds against the latex read", [
  ("MIKAGE_BODY_FORM_DEBLOCKOUT_V0_9_CONTACT_SHEET.png", 3.0),
  ("MIKAGE_BODY_CLOAK_STRUCTURE_V0_10_CONTACT_SHEET.png", 3.0),
  ("MIKAGE_BODY_LOOKDEV_MATTE_V0_11_CONTACT_SHEET.png", 3.0),
 ]),
 ("06  ·  THE ASSEMBLY", "ONE FIGURE", "head · cloak · blade · halo", [
  ("MIKAGE_STANDING_CHARACTER_CANDIDATE_V0_12_CONTACT_SHEET.png", 3.4),
 ]),
 ("07  ·  THE LOCK", "THE STANDING HERO", "two polish rounds · then the ruling", [
  ("MIKAGE_STANDING_HERO_POLISH_V0_13_CONTACT_SHEET.png", 3.2),
  ("MIKAGE_STANDING_HERO_POLISH_V0_14_CONTACT_SHEET.png", 3.4),
  ("MIKAGE_STANDING_HERO_POLISH_V0_14_HERO.png", 3.6),
 ]),
]

W,H,FR = 1080,1920,30
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

def image_fit(path, secs, out):
    """Whole image, letterboxed to fit 1080x1920 on the void background. No text, no crop."""
    sh(["ffmpeg","-y","-v","error","-loop","1","-t",str(secs),"-i",path,
        "-vf","scale=%d:%d:force_original_aspect_ratio=decrease,pad=%d:%d:(ow-iw)/2:(oh-ih)/2:color=0x050508,format=yuv420p"%(W,H,W,H),
        "-r",str(FR),"-c:v","libx264","-preset","medium","-crf","19",out])

def clip_motion_plain(src, loops, w, out):
    sh(["ffmpeg","-y","-v","error","-stream_loop",str(loops),"-i",src,
        "-vf","format=yuv420p","-r",str(FR),"-c:v","libx264","-preset","medium","-crf","19",out])

def still(path, secs, out):
    sh(["ffmpeg","-y","-v","error","-loop","1","-t",str(secs),"-i",path,
        "-vf","scale=1080:1920,format=yuv420p","-r",str(FR),
        "-c:v","libx264","-preset","medium","-crf","19",out])

def main():
    need=[MOT,MUSIC]+[P(f) for _,_,_,items in ARC for f,_ in items]
    missing=[p for p in need if not os.path.exists(p)]
    if missing:
        for p in missing: print("!! MISSING:",p)
        return
    w=tempfile.mkdtemp(); seg=[]; n=[0]
    def title_card(header, title, sub, secs=2.2):
        n[0]+=1; c=os.path.join(w,"c%02d.png"%n[0]); card(c,header,title,sub)
        s=os.path.join(w,"s%02d.mp4"%n[0]); still(c,secs,s); seg.append(s)
    try:
        title_card("BUILD LOG  //  STANDING HERO","IT STANDS","from a block to the official hero — every round on record",2.8)
        for header,title,sub,items in ARC:
            title_card(header,title,sub)
            for f,secs in items:
                n[0]+=1; sc=os.path.join(w,"m%02d.mp4"%n[0])
                image_fit(P(f),secs,sc); seg.append(sc)
        title_card("08  ·  IT WAKES","FIRST CANVAS","V0.1 refused - too soft · V0.2 re-curved · APPROVED")
        sc=os.path.join(w,"m_mot.mp4")
        clip_motion_plain(MOT,1,w,sc); seg.append(sc)
        title_card("MIKAGE ZENITH","IT STANDS","Listen now  —  PORCELAIN ASCENSION",3.0)
        cl=os.path.join(w,"cl.txt"); open(cl,"w").write("".join("file '%s'\n"%x for x in seg))
        vid=os.path.join(w,"vid.mp4")
        try: sh(["ffmpeg","-y","-v","error","-f","concat","-safe","0","-i",cl,"-c","copy",vid])
        except subprocess.CalledProcessError:
            sh(["ffmpeg","-y","-v","error","-f","concat","-safe","0","-i",cl,"-c:v","libx264","-preset","medium","-crf","19","-pix_fmt","yuv420p","-r",str(FR),vid])
        dur=float(subprocess.check_output(["ffprobe","-v","error","-show_entries","format=duration","-of","csv=p=0",vid]).decode().strip())
        au=os.path.join(w,"au.m4a"); fade=dur-2.0
        sh(["ffmpeg","-y","-v","error","-ss","0","-t","%.2f"%dur,"-i",MUSIC,"-af","afade=t=in:st=0:d=0.6,afade=t=out:st=%.2f:d=2.0"%fade,"-ar","48000","-ac","2","-c:a","aac","-b:a","320k",au])
        tmp=OUT+".tmp.mp4"; sh(["ffmpeg","-y","-v","error","-i",vid,"-i",au,"-map","0:v:0","-map","1:a:0","-c:v","copy","-c:a","copy","-shortest",tmp]); os.replace(tmp,OUT)
        print("BUILD LOG saved:",OUT,"dur=%.1fs"%dur)
        start=max(0,dur-18); th=OUT_HOOK+".tmp.mp4"
        sh(["ffmpeg","-y","-v","error","-ss","%.2f"%start,"-i",OUT,"-t","18","-c","copy",th]); os.replace(th,OUT_HOOK)
        print("HOOK saved:",OUT_HOOK)
    finally:
        shutil.rmtree(w, ignore_errors=True)

if __name__=="__main__":
    main()
