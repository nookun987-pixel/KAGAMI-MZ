# -*- coding: utf-8 -*-
r"""
MIKAGE BUILD LOG — build TODAY's locomotion entry (NEW milestones only).
Covers: V0.8 Rider detail · V1.4 first gait · V1.5 continuous gait. Does NOT re-bundle the
already-published 2D->form film. Editorial format, music = PORCELAIN ASCENSION from 0:00.

Run on the operator's machine:  python build_buildlog_locomotion.py
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
RIDER = os.path.join(REV, "MIKAGE_HERO_MOUNT_EEVEE_V0_8_RIDER_CONTACT_SHEET.png")
GAIT  = os.path.join(REV, "MIKAGE_HERO_MOUNT_V1_4_GAIT_PROOF.mp4")
CONT  = os.path.join(REV, "MIKAGE_HERO_MOUNT_V1_5_CONTINUOUS_GAIT_PROOF.mp4")
MUSIC = os.path.join(AUDIO, "LIVE", "06. PORCELAIN ASCENSION", "1_MASTER", "PORCELAIN ASCENSION.wav")
OUT   = os.path.join(HERE, "MIKAGE_BUILDLOG_LOCOMOTION_V0_1.mp4")
OUT_HOOK = os.path.join(HERE, "MIKAGE_BUILDLOG_LOCOMOTION_V0_1_HOOK.mp4")

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

def label_overlay(path, label):
    img=Image.new("RGBA",(W,H),(0,0,0,0)); d=ImageDraw.Draw(img)
    trk(d,150,label,CIN4(40),PORC,8)
    trk(d,1740,"PROTOTYPE  //  NOT CANON-LOCKED",SP(22),(150,122,180),3)
    img.save(path)

def clip_image(src, label, secs, w, out):
    """framed still chapter: image scaled to width 980 on void + label."""
    ov=os.path.join(w,"ov.png"); label_overlay(ov,label)
    im=Image.open(src).convert("RGB"); r=980/im.width; im=im.resize((980,int(im.height*r)),Image.LANCZOS)
    cv=base(); cv.paste(im,((W-980)//2,(H-im.height)//2))
    d=ImageDraw.Draw(cv); x0,y0=(W-980)//2-6,(H-im.height)//2-6; x1,y1=x0+992,y0+im.height+12
    for cx,cy in [(x0,y0),(x1,y0),(x0,y1),(x1,y1)]:
        d.line([cx-18,cy,cx+18,cy],fill=(130,126,140),width=1); d.line([cx,cy-18,cx,cy+18],fill=(130,126,140),width=1)
    base_png=os.path.join(w,"img.png"); grain(cv,3).save(base_png)
    sh(["ffmpeg","-y","-v","error","-loop","1","-t",str(secs),"-i",base_png,"-i",ov,
        "-filter_complex","[0:v][1:v]overlay=0:0:shortest=1,format=yuv420p","-r",str(FR),
        "-c:v","libx264","-preset","medium","-crf","19",out])

def clip_footage(src, label, slow, w, out):
    """graded landscape footage centered on void + label."""
    ov=os.path.join(w,"ov.png"); label_overlay(ov,label)
    sh(["ffmpeg","-y","-v","error","-i",src,"-loop","1","-i",ov,"-filter_complex",
        "[0:v]eq=brightness=-0.13:contrast=1.26:gamma=0.9,colorbalance=bs=0.06:bm=0.03,"
        "scale=1080:-2,setpts=%s*PTS,format=yuv420p,pad=1080:1920:0:(1920-ih)/2:color=0x050508[v];"
        "[v][1:v]overlay=0:0:shortest=1,format=yuv420p[o]"%slow,
        "-map","[o]","-r",str(FR),"-c:v","libx264","-preset","medium","-crf","19",out])

def main():
    for p in (RIDER,GAIT,CONT,MUSIC):
        if not os.path.exists(p): print("!! MISSING:",p); return
    w=tempfile.mkdtemp(); seg=[]
    try:
        # open card
        c0=os.path.join(w,"c0.png"); card(c0,"BUILD LOG  //  LOCOMOTION","THIS WEEK IT MOVED","V0.8 RIDER  ·  V1.4 GAIT  ·  V1.5 CONTINUOUS")
        s=os.path.join(w,"s_open.mp4"); sh(["ffmpeg","-y","-v","error","-loop","1","-t","2.8","-i",c0,"-vf","scale=1080:1920,format=yuv420p","-r",str(FR),"-c:v","libx264","-preset","medium","-crf","19",s]); seg.append(s)
        # ch1 rider
        t1=os.path.join(w,"t1.png"); card(t1,"01  ·  THE RIDER","RIDER DETAIL","porcelain seat · two slits · one violet trace")
        st1=os.path.join(w,"st1.mp4"); sh(["ffmpeg","-y","-v","error","-loop","1","-t","2.4","-i",t1,"-vf","scale=1080:1920,format=yuv420p","-r",str(FR),"-c:v","libx264","-preset","medium","-crf","19",st1]); seg.append(st1)
        sc1=os.path.join(w,"sc1.mp4"); clip_image(RIDER,"RIDER DETAIL",4.0,w,sc1); seg.append(sc1)
        # ch2 first gait (V1.4)
        t2=os.path.join(w,"t2.png"); card(t2,"02  ·  FIRST STEPS","IT LEARNS TO WALK","four steps · the ground held")
        st2=os.path.join(w,"st2.mp4"); sh(["ffmpeg","-y","-v","error","-loop","1","-t","2.4","-i",t2,"-vf","scale=1080:1920,format=yuv420p","-r",str(FR),"-c:v","libx264","-preset","medium","-crf","19",st2]); seg.append(st2)
        sc2=os.path.join(w,"sc2.mp4"); clip_footage(GAIT,"IT LEARNS TO WALK","2.6",w,sc2); seg.append(sc2)
        # ch3 continuous gait (V1.5) — climax
        t3=os.path.join(w,"t3.png"); card(t3,"03  ·  IT KEEPS WALKING","CONTINUOUS GAIT","two cycles · zero slide · it keeps moving")
        st3=os.path.join(w,"st3.mp4"); sh(["ffmpeg","-y","-v","error","-loop","1","-t","2.4","-i",t3,"-vf","scale=1080:1920,format=yuv420p","-r",str(FR),"-c:v","libx264","-preset","medium","-crf","19",st3]); seg.append(st3)
        sc3=os.path.join(w,"sc3.mp4"); clip_footage(CONT,"CONTINUOUS GAIT","1.6",w,sc3); seg.append(sc3)
        # end card
        e=os.path.join(w,"e.png"); card(e,"MIKAGE ZENITH","FORMATION","Listen now  —  PORCELAIN ASCENSION")
        se=os.path.join(w,"se.mp4"); sh(["ffmpeg","-y","-v","error","-loop","1","-t","3.0","-i",e,"-vf","scale=1080:1920,format=yuv420p","-r",str(FR),"-c:v","libx264","-preset","medium","-crf","19",se]); seg.append(se)
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
        # hook = the V1.5 continuous chapter tail (last ~18s) for Shorts
        start=max(0,dur-18); th=OUT_HOOK+".tmp.mp4"
        sh(["ffmpeg","-y","-v","error","-ss","%.2f"%start,"-i",OUT,"-t","18","-c","copy",th]); os.replace(th,OUT_HOOK)
        print("HOOK saved:",OUT_HOOK)
    finally:
        shutil.rmtree(w, ignore_errors=True)

if __name__=="__main__":
    main()
