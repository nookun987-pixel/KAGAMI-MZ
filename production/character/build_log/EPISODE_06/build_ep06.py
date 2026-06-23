#!/usr/bin/env python3
# MIKAGE ZENITH — BUILD LOG EPISODE 06 : THE TRANSMISSIONS
# Release tie-in. 16 live (T01-16, tool-verified). 1080x1350, brand-locked.
import os
from PIL import Image, ImageDraw, ImageFont, ImageFilter, ImageChops

W, H = 1080, 1350
VOID=(5,5,8); VOID2=(12,12,18); PORC=(242,238,234)
SILVER=(160,160,176); SILVER2=(120,120,138)
VIOLET=(143,0,255); VIOLET2=(123,47,255); DIMV=(70,40,110)

FD = "/sessions/nifty-elegant-sagan/mnt/outputs/ep02/fonts"
OUT = os.path.join(os.path.dirname(__file__), "out")
os.makedirs(OUT, exist_ok=True)

def serif(sz):  return ImageFont.truetype(os.path.join(FD,"cinzel700.ttf"), sz)
def serifr(sz): return ImageFont.truetype(os.path.join(FD,"cinzel400.ttf"), sz)
def body(sz):   return ImageFont.truetype(os.path.join(FD,"shippori500.ttf"), sz)
def mono(sz):   return ImageFont.truetype(os.path.join(FD,"spacemono400.ttf"), sz)

EP="06"; FOOTER="THE TRANSMISSIONS"; TOTAL=8

def tracked(d, xy, text, font, fill, track=0, anchor="la"):
    x,y=xy
    if anchor=="ma":
        total=sum((font.getbbox(c)[2]-font.getbbox(c)[0])+track for c in text)-track
        x=xy[0]-total/2
    for c in text:
        d.text((x,y),c,font=font,fill=fill)
        x+=(font.getbbox(c)[2]-font.getbbox(c)[0])+track

def wrap(d, text, font, maxw):
    words,lines,cur=text.split(),[],""
    for w in words:
        t=(cur+" "+w).strip()
        if d.textlength(t,font=font)<=maxw: cur=t
        else:
            if cur: lines.append(cur)
            cur=w
    if cur: lines.append(cur)
    return lines

def base():
    img=Image.new("RGB",(W,H),VOID)
    g=Image.new("L",(W,H),0)
    ImageDraw.Draw(g).ellipse((W*0.1,H*0.05,W*0.9,H*0.7),fill=28)
    g=g.filter(ImageFilter.GaussianBlur(220))
    return Image.composite(Image.new("RGB",(W,H),VOID2),img,g)

def chrome(img, idx):
    d=ImageDraw.Draw(img); m=30
    d.rectangle((m,m,W-m,H-m),outline=(40,36,52),width=2)
    ty=52
    tracked(d,(m+24,ty),"MIKAGE ZENITH",mono(17),SILVER,track=3)
    rt=f"BUILD LOG // {EP}"
    rw=sum((mono(17).getbbox(c)[2]-mono(17).getbbox(c)[0])+3 for c in rt)-3
    tracked(d,(W-m-24-rw,ty),rt,mono(17),SILVER,track=3)
    d.line((m+24,ty+34,W-m-24,ty+34),fill=(46,40,60),width=1)
    by=H-66
    d.line((m+24,by-14,W-m-24,by-14),fill=(46,40,60),width=1)
    tracked(d,(m+24,by),FOOTER,mono(14),DIMV,track=3)
    pg=f"{idx:02d} / {TOTAL:02d}"
    pw=sum((mono(14).getbbox(c)[2]-mono(14).getbbox(c)[0])+3 for c in pg)-3
    tracked(d,(W-m-24-pw,by),pg,mono(14),SILVER2,track=3)
    return img

def halo(img, cx, cy, r=120):
    layer=Image.new("RGB",(W,H),(0,0,0))
    ImageDraw.Draw(layer).ellipse((cx-r,cy-r,cx+r,cy+r),fill=(60,12,120))
    layer=layer.filter(ImageFilter.GaussianBlur(60))
    img=ImageChops.screen(img,layer)
    d=ImageDraw.Draw(img)
    d.ellipse((cx-r*0.42,cy-r*0.42,cx+r*0.42,cy+r*0.42),outline=VIOLET2,width=2)
    d.ellipse((cx-12,cy-12,cx+12,cy+12),fill=VIOLET)
    return img

def paras(img, x, y, blocks, font, fill, maxw, lh=44, pgap=24):
    d=ImageDraw.Draw(img)
    for blk in blocks:
        for ln in wrap(d,blk,font,maxw):
            d.text((x,y),ln,font=font,fill=fill); y+=lh
        y+=pgap
    return y

def track_list(img, x, y, items, step=84):
    d=ImageDraw.Draw(img)
    for no,title in items:
        tracked(d,(x,y),no,mono(22),VIOLET2,track=2)
        d.text((x+78,y),title,font=mono(22),fill=PORC)
        d.line((x,y+44,W-60,y+44),fill=(34,30,46),width=1)
        y+=step
    return img

MAY=[("01","THE LANDAUER PARADOX"),("02","DIGITAL ASH"),("03","THE BREACH"),
     ("04","SINGULAR HEART"),("05","PORCELAIN ASCENSION"),("06","THE THEOREM"),
     ("07","THE ROOT ARCHITECT")]
JUNE=[("08","GLASS SKIN"),("09","GLASS SKIN (JAPANESE)"),("10","SLOW ORBIT"),
      ("11","NO TOUCHDOWN"),("12","HUSH / SAY LESS"),("13","GLASS SKIN (ANIME)"),
      ("14","SIGNAL THIEF"),("15","BLACK SAND FEVER"),("16","NIGHT BITE")]

def slide_title():
    img=base(); d=ImageDraw.Draw(img)
    tracked(d,(W/2,250),"BUILD LOG",mono(22),VIOLET2,track=14,anchor="ma")
    ty=360
    for ln in ["THE","TRANSMISSIONS"]:
        sz=82 if ln=="THE" else 60
        tracked(d,(W/2,ty),ln,serif(sz),PORC,track=4,anchor="ma"); ty+=104
    tracked(d,(W/2,640),"The signal has a sound.",mono(20),SILVER,track=1,anchor="ma")
    img=halo(img,W//2,920,r=150)
    return chrome(img,1)

def slide_why():
    img=base(); d=ImageDraw.Draw(img)
    d.text((54,150),"FACE, AND VOICE",font=serif(46),fill=PORC)
    paras(img,56,280,[
        "The first logs built a face: a shape, a world, a code.",
        "But Mikage was never only an image. Behind the silhouette is a body of music — already out, already playing.",
        "This is the voice the signal was given.",
    ],body(27),SILVER,940,lh=44,pgap=26)
    img=halo(img,W//2,1080,r=120)
    return chrome(img,2)

def slide_count():
    img=base(); d=ImageDraw.Draw(img)
    d.text((54,150),"THE COUNT",font=serif(46),fill=PORC)
    tracked(d,(W/2,360),"16",serif(220),PORC,track=0,anchor="ma")
    tracked(d,(W/2,700),"TRANSMISSIONS, LIVE ACROSS STORES",mono(18),VIOLET2,track=4,anchor="ma")
    paras(img,56,800,[
        "Sixteen singles, live now on Spotify, Apple Music, YouTube, Amazon, Tidal and more. One arc, released day after day.",
    ],body(25),SILVER,960,lh=40,pgap=18)
    tracked(d,(W/2,1090),"LISTEN NOW",mono(20),PORC,track=8,anchor="ma")
    d.line((W//2-150,1130,W//2+150,1130),fill=VIOLET,width=2)
    return chrome(img,3)

def slide_may():
    img=base(); d=ImageDraw.Draw(img)
    d.text((54,150),"THE MAY ARC",font=serif(46),fill=PORC)
    tracked(d,(56,232),"T01 - T07 — LIVE",mono(15),SILVER2,track=2)
    img=track_list(img,60,310,MAY,step=86)
    return chrome(img,4)

def slide_june():
    img=base(); d=ImageDraw.Draw(img)
    d.text((54,150),"THE JUNE ARC",font=serif(46),fill=PORC)
    tracked(d,(56,232),"T08 - T16 — LIVE",mono(15),SILVER2,track=2)
    img=track_list(img,60,300,JUNE,step=74)
    return chrome(img,5)

def slide_tongues():
    img=base(); d=ImageDraw.Draw(img)
    d.text((54,150),"MANY TONGUES",font=serif(46),fill=PORC)
    paras(img,56,280,[
        "The signal does not speak one language. The live arc runs in English and Japanese — a porcelain ballad reshaped for another tongue.",
        "More are inbound: Chinese, Korean, Vietnamese versions are queued — pre-save, not yet live.",
        "One voice, refracted. The same signal, heard differently.",
    ],body(26),SILVER,940,lh=42,pgap=22)
    img=halo(img,W//2,1090,r=110)
    return chrome(img,6)

def slide_one():
    img=base(); d=ImageDraw.Draw(img)
    d.text((54,150),"ONE SIGNAL",font=serif(46),fill=PORC)
    paras(img,56,280,[
        "The build log is the face. The transmissions are the voice. Neither is the whole.",
        "Mikage is the place where they meet: an entity from the void, given a shape by one hand, and a sound by many machines.",
    ],body(27),SILVER,940,lh=44,pgap=26)
    img=halo(img,W//2,1010,r=130)
    return chrome(img,7)

def slide_next():
    img=base(); d=ImageDraw.Draw(img)
    d.text((54,150),"NEXT TRANSMISSION",font=serif(44),fill=PORC)
    paras(img,56,280,[
        "Sixteen are live. More are queued behind them. The arc keeps moving — a new transmission, then the next.",
        "Find the signal. Follow it.",
    ],body(26),SILVER,960,lh=42,pgap=22)
    img=halo(img,W//2,740,r=130)
    d=ImageDraw.Draw(img)
    tracked(d,(W/2,1040),"LISTEN NOW",mono(20),PORC,track=8,anchor="ma")
    d.line((W//2-150,1080,W//2+150,1080),fill=VIOLET,width=2)
    tracked(d,(W/2,1140),"MIKAGE ZENITH",serifr(34),PORC,track=8,anchor="ma")
    tracked(d,(W/2,1200),"THE SIGNAL HAS A SOUND",mono(14),VIOLET2,track=4,anchor="ma")
    return chrome(img,8)

slides=[slide_title,slide_why,slide_count,slide_may,slide_june,slide_tongues,slide_one,slide_next]
for i,fn in enumerate(slides,1):
    fn().save(os.path.join(OUT,f"slide_{i}.png")); print("saved",i)
print("DONE")
