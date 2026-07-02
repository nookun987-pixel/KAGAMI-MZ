# -*- coding: utf-8 -*-
r"""
MIKAGE BUILD LOG — build TODAY's standing-hero entry (NEW milestones only).
Covers: V0.9–V0.11 body build · V0.12 standing candidate · V0.14 ASSET-LOCKED official
standing hero · MOTION V0.2 approved Canvas. Does NOT re-bundle the published 2D->form film
or the locomotion entry. Editorial format, music = PORCELAIN ASCENSION from 0:00.

HUE-SAFETY: the MOTION V0.2 clip is used UNGRADED (no eq/colorbalance) — the two-slit violet
is operator-approved; any grade here could shift it (fix-at-export rule).

Run on the operator's machine:  python build_buildlog_standing_hero.py
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
B09   = os.path.join(REV, "MIKAGE_BODY_FORM_DEBLOCKOUT_V0_9_CONTACT_SHEET.png")
B10   = os.path.join(REV, "MIKAGE_BODY_CLOAK_STRUCTURE_V0_10_CONTACT_SHEET.png")
B11   = os.path.join(REV, "MIKAGE_BODY_LOOKDEV_MATTE_V0_11_CONTACT_SHEET.png")
H12   = os.path.join(REV, "MIKAGE_STANDING_CHARACTER_CANDIDATE_V0_12_HERO.png")
H14   = os.path.join(REV, "MIKAGE_STANDING_HERO_POLISH_V0_14_HERO.png")
MOT   = os.path.join(REV, "MIKAGE_STANDING_HERO_MOTION_V0_2.mp4")
MUSIC = os.path.join(AUDIO, "LIVE", "06. PORCELAIN ASCENSION", "1_MASTER", "PORCELAIN ASCENSION.wav")
OUT   = os.path.join(HERE, "MIKAGE_BUILDLOG_STANDING_HERO_V0_1.mp4")
OUT_HOOK = os.path.join(HERE, "MIKAGE_BUILDLOG_STANDING_HERO_V0_1_HOOK.mp4")

W,H,FR = 1080,1920,30   # MOTION V0.2 is 30fps — match it 1:1 (no frame-dup judder)
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
    for p in (B09,B10,B11,H12,H14,MOT,MUSIC):
        if not os.path.exists(p): print("!! MISSING:",p); return
    w=tempfile.mkdtemp(); seg=[]
    def title_card(name, header, title, sub, secs=2.4):
        c=os.path.join(w,name+".png"); card(c,header,title,sub)
        s=os.path.join(w,"s_"+name+".mp4"); still(c,secs,s); seg.append(s)
    try:
        # open card
        title_card("c0","BUILD LOG  //  STANDING HERO","IT STANDS","BODY V0.9-0.11  ·  LOCK V0.14  ·  CANVAS V0.2",2.8)
        # ch1 — the body build
        title_card("t1","01  ·  THE BODY","FROM BLOCK TO CLOAK","de-blockout · heavy folds · matte graphite")
        sc=os.path.join(w,"sc1a.mp4"); clip_image(B09,"BODY V0.9 · DE-BLOCKOUT",3.2,w,sc); seg.append(sc)
        sc=os.path.join(w,"sc1b.mp4"); clip_image(B10,"BODY V0.10 · CLOAK STRUCTURE",3.2,w,sc); seg.append(sc)
        sc=os.path.join(w,"sc1c.mp4"); clip_image(B11,"BODY V0.11 · MATTE LOOKDEV",3.2,w,sc); seg.append(sc)
        # ch2 — assembly
        title_card("t2","02  ·  THE ASSEMBLY","FULL FIGURE","head · cloak · blade · halo — one body")
        sc=os.path.join(w,"sc2.mp4"); clip_image(H12,"STANDING CANDIDATE V0.12",4.0,w,sc); seg.append(sc)
        # ch3 — the lock (money-shot, hold longer)
        title_card("t3","03  ·  THE LOCK","THE STANDING HERO","slit violet · blade integrated · asset-locked")
        sc=os.path.join(w,"sc3.mp4"); clip_image(H14,"OFFICIAL STANDING HERO · V0.14",5.0,w,sc); seg.append(sc)
        # ch4 — it wakes (climax): MOTION V0.2 x2, UNGRADED (hue-safe)
        title_card("t4","04  ·  IT WAKES","FIRST CANVAS","dormant → ignition → dormant")
        sc=os.path.join(w,"sc4.mp4"); clip_motion_ungraded(MOT,"CANVAS V0.2 · APPROVED",1,w,sc); seg.append(sc)
        # end card
        title_card("e","MIKAGE ZENITH","IT STANDS","Listen now  —  PORCELAIN ASCENSION",3.0)
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
