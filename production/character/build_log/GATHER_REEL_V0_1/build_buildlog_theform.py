# -*- coding: utf-8 -*-
r"""
MIKAGE BUILD LOG - build THE FORM entry (NEW milestones only).
Covers the character refinement arc built 2026-06-30..07-01:
  V0.7 helmet surface control · V0.8 porcelain lookdev · V0.10 cloak structure ·
  V0.11 matte weight · V0.13 standing hero. Does NOT re-bundle the already-published
  2D->form film. Editorial format, music = PORCELAIN ASCENSION from 0:00.

Run on the operator's machine:  python build_buildlog_theform.py
Needs: Python 3 + pillow + numpy, ffmpeg/ffprobe on PATH, the sibling
"MIKAGE ZENITH AUDIO" root (fonts + PORCELAIN ASCENSION master). Output = PROTOTYPE /
NOT CANON-LOCKED, local only. Paths are computed relative to this file.
"""
import os, subprocess, tempfile, shutil
from PIL import Image, ImageDraw, ImageFont, ImageFilter
import numpy as np

HERE  = os.path.dirname(os.path.abspath(__file__))
REPO  = os.path.abspath(os.path.join(HERE, "..", "..", "..", ".."))          # ...\KAGAMI-MZ_SYNC_PUSH_V2
AUDIO = os.path.join(os.path.dirname(REPO), "MIKAGE ZENITH AUDIO")            # sibling audio root
FONTS = os.path.join(AUDIO, "tools", "mikage_short_toolkit")
REV   = os.path.join(REPO, "production", "character", "reviews")
MUSIC = os.path.join(AUDIO, "LIVE", "06. PORCELAIN ASCENSION", "1_MASTER", "PORCELAIN ASCENSION.wav")

# chapter stills (built + drift-checked + operator-ruled this session)
SURF  = os.path.join(REV, "MIKAGE_HELMET_SURFACE_CONTROL_V0_7_CONTACT_SHEET.png")
GLAZE = os.path.join(REV, "MIKAGE_HERO_LOOKDEV_PREMIUM_V0_8_CONTACT_SHEET.png")
CLOAK = os.path.join(REV, "MIKAGE_BODY_CLOAK_STRUCTURE_V0_10_CONTACT_SHEET.png")
WEIGHT= os.path.join(REV, "MIKAGE_BODY_LOOKDEV_MATTE_V0_11_CONTACT_SHEET.png")
HERO  = os.path.join(REV, "MIKAGE_STANDING_HERO_POLISH_V0_13_HERO.png")

OUT      = os.path.join(HERE, "MIKAGE_BUILDLOG_THE_FORM_V0_1.mp4")
OUT_HOOK = os.path.join(HERE, "MIKAGE_BUILDLOG_THE_FORM_V0_1_HOOK.mp4")

W,H,FR = 1080,1920,24
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

def clip_image(src, label, secs, w, out, width=980):
    """framed still chapter: image scaled to given width on void + label."""
    ov=os.path.join(w,"ov_%s.png"%os.path.basename(out)); label_overlay(ov,label)
    im=Image.open(src).convert("RGB"); r=width/im.width; im=im.resize((width,int(im.height*r)),Image.LANCZOS)
    cv=base(); cv.paste(im,((W-width)//2,(H-im.height)//2))
    d=ImageDraw.Draw(cv); x0,y0=(W-width)//2-6,(H-im.height)//2-6; x1,y1=x0+width+12,y0+im.height+12
    for cx,cy in [(x0,y0),(x1,y0),(x0,y1),(x1,y1)]:
        d.line([cx-18,cy,cx+18,cy],fill=(130,126,140),width=1); d.line([cx,cy-18,cx,cy+18],fill=(130,126,140),width=1)
    base_png=os.path.join(w,"img_%s.png"%os.path.basename(out)); grain(cv,3).save(base_png)
    sh(["ffmpeg","-y","-v","error","-loop","1","-t",str(secs),"-i",base_png,"-loop","1","-i",ov,
        "-filter_complex","[0:v][1:v]overlay=0:0:shortest=1,format=yuv420p","-t",str(secs),"-r",str(FR),
        "-c:v","libx264","-preset","medium","-crf","19",out])

def title(w, seg, header, ttl, sub, secs=2.4):
    p=os.path.join(w,"t_%d.png"%len(seg)); card(p,header,ttl,sub)
    s=os.path.join(w,"st_%d.mp4"%len(seg))
    sh(["ffmpeg","-y","-v","error","-loop","1","-t",str(secs),"-i",p,"-vf","scale=1080:1920,format=yuv420p","-r",str(FR),"-c:v","libx264","-preset","medium","-crf","19",s]); seg.append(s)

def main():
    need=[SURF,GLAZE,CLOAK,WEIGHT,HERO,MUSIC]
    miss=[p for p in need if not os.path.exists(p)]
    if miss:
        for p in miss: print("!! MISSING:",p)
        print("Fix the missing paths (audio root / fonts / stills) then re-run."); return
    w=tempfile.mkdtemp(); seg=[]
    try:
        # open card
        p0=os.path.join(w,"c0.png"); card(p0,"BUILD LOG  //  THE FORM","IT TAKES SHAPE","SURFACE  ·  GLAZE  ·  CLOAK  ·  WEIGHT  ·  HERO")
        s0=os.path.join(w,"s0.mp4"); sh(["ffmpeg","-y","-v","error","-loop","1","-t","2.8","-i",p0,"-vf","scale=1080:1920,format=yuv420p","-r",str(FR),"-c:v","libx264","-preset","medium","-crf","19",s0]); seg.append(s0)
        # 01 the surface (helmet geometry locked)
        title(w,seg,"01  ·  THE SURFACE","THE MASK SETTLES","one shell · two slits · no visor")
        c=os.path.join(w,"c1.mp4"); clip_image(SURF,"HELMET · SURFACE CONTROL",4.0,w,c); seg.append(c)
        # 02 the glaze (porcelain lookdev)
        title(w,seg,"02  ·  THE GLAZE","POR CE LAIN","sacred glazed shell · one violet trace")
        c=os.path.join(w,"c2.mp4"); clip_image(GLAZE,"PORCELAIN · LOOKDEV",4.0,w,c); seg.append(c)
        # 03 the cloak (body structure)
        title(w,seg,"03  ·  THE CLOAK","IT GAINS A BODY","tall vertical fall · heavy folds")
        c=os.path.join(w,"c3.mp4"); clip_image(CLOAK,"CLOAK · STRUCTURE",4.0,w,c); seg.append(c)
        # 04 the weight (matte)
        title(w,seg,"04  ·  THE WEIGHT","HEAVY CLOTH","matte graphite · the gloss gone")
        c=os.path.join(w,"c4.mp4"); clip_image(WEIGHT,"CLOAK · MATTE WEIGHT",4.0,w,c); seg.append(c)
        # 05 it stands (climax = clean hero)
        title(w,seg,"05  ·  IT STANDS","IT STANDS","one figure · void · a single light",2.6)
        c=os.path.join(w,"c5.mp4"); clip_image(HERO,"MIKAGE · STANDING",5.0,w,c,width=760); seg.append(c)
        # end card
        pe=os.path.join(w,"e.png"); card(pe,"MIKAGE ZENITH","THE FORM","Listen now  —  PORCELAIN ASCENSION")
        se=os.path.join(w,"se.mp4"); sh(["ffmpeg","-y","-v","error","-loop","1","-t","3.0","-i",pe,"-vf","scale=1080:1920,format=yuv420p","-r",str(FR),"-c:v","libx264","-preset","medium","-crf","19",se]); seg.append(se)
        # concat
        cl=os.path.join(w,"cl.txt"); open(cl,"w").write("".join("file '%s'\n"%x for x in seg))
        vid=os.path.join(w,"vid.mp4")
        try: sh(["ffmpeg","-y","-v","error","-f","concat","-safe","0","-i",cl,"-c","copy",vid])
        except subprocess.CalledProcessError:
            sh(["ffmpeg","-y","-v","error","-f","concat","-safe","0","-i",cl,"-c:v","libx264","-preset","medium","-crf","19","-pix_fmt","yuv420p","-r",str(FR),vid])
        dur=float(subprocess.check_output(["ffprobe","-v","error","-show_entries","format=duration","-of","csv=p=0",vid]).decode().strip())
        # music PORCELAIN ASCENSION from 0:00
        au=os.path.join(w,"au.m4a"); fade=max(0.1,dur-2.0)
        sh(["ffmpeg","-y","-v","error","-ss","0","-t","%.2f"%dur,"-i",MUSIC,"-af","afade=t=in:st=0:d=0.6,afade=t=out:st=%.2f:d=2.0"%fade,"-ar","48000","-ac","2","-c:a","aac","-b:a","320k",au])
        tmp=OUT+".tmp.mp4"; sh(["ffmpeg","-y","-v","error","-i",vid,"-i",au,"-map","0:v:0","-map","1:a:0","-c:v","copy","-c:a","copy","-shortest",tmp]); os.replace(tmp,OUT)
        print("BUILD LOG saved:",OUT,"dur=%.1fs"%dur)
        # hook = last ~18s (the stands + end) for Shorts
        start=max(0,dur-18); th=OUT_HOOK+".tmp.mp4"
        sh(["ffmpeg","-y","-v","error","-ss","%.2f"%start,"-i",OUT,"-t","18","-c","copy",th]); os.replace(th,OUT_HOOK)
        print("HOOK saved:",OUT_HOOK)
    finally:
        shutil.rmtree(w, ignore_errors=True)

if __name__=="__main__":
    main()
