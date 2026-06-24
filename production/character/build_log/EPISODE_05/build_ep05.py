#!/usr/bin/env python3
# MIKAGE ZENITH — BUILD LOG EP05 : SKIN & SIGNAL (clay -> material + violet)
import os
from PIL import Image, ImageDraw, ImageFont, ImageFilter, ImageChops
W,H=1080,1350
VOID=(5,5,8); VOID2=(12,12,18); PORC=(242,238,234)
SILVER=(160,160,176); SILVER2=(120,120,138)
VIOLET=(143,0,255); VIOLET2=(123,47,255); DIMV=(70,40,110)
FD="/sessions/tender-loving-planck/mnt/MIKAGE ZENITH AUDIO/tools/mikage_short_toolkit"
SRC="/sessions/tender-loving-planck/mnt/KAGAMI-MZ_SYNC_PUSH_V2/production/character"
RV=SRC+"/reviews"
OUT=os.path.dirname(__file__)
def serif(s): return ImageFont.truetype(os.path.join(FD,"cinzel700.ttf"),s)
def serifr(s):return ImageFont.truetype(os.path.join(FD,"cinzel400.ttf"),s)
def body(s):  return ImageFont.truetype(os.path.join(FD,"shippori500.ttf"),s)
def mono(s):  return ImageFont.truetype(os.path.join(FD,"spacemono400.ttf"),s)
EP="05"; FOOTER="SKIN & SIGNAL"; TOTAL=8
def tracked(d,xy,text,font,fill,track=0,anchor="la"):
    x,y=xy
    if anchor=="ma":
        tot=sum((font.getbbox(c)[2]-font.getbbox(c)[0])+track for c in text)-track; x=xy[0]-tot/2
    for c in text:
        d.text((x,y),c,font=font,fill=fill); x+=(font.getbbox(c)[2]-font.getbbox(c)[0])+track
def wrap(d,text,font,maxw):
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
    img=Image.new("RGB",(W,H),VOID); g=Image.new("L",(W,H),0)
    ImageDraw.Draw(g).ellipse((W*0.1,H*0.05,W*0.9,H*0.7),fill=28)
    g=g.filter(ImageFilter.GaussianBlur(220))
    return Image.composite(Image.new("RGB",(W,H),VOID2),img,g)
def chrome(img,idx):
    d=ImageDraw.Draw(img); m=30
    d.rectangle((m,m,W-m,H-m),outline=(40,36,52),width=2)
    ty=52; tracked(d,(m+24,ty),"MIKAGE ZENITH",mono(17),SILVER,track=3)
    rt=f"BUILD LOG // {EP}"; rw=sum((mono(17).getbbox(c)[2]-mono(17).getbbox(c)[0])+3 for c in rt)-3
    tracked(d,(W-m-24-rw,ty),rt,mono(17),SILVER,track=3)
    d.line((m+24,ty+34,W-m-24,ty+34),fill=(46,40,60),width=1)
    by=H-66; d.line((m+24,by-14,W-m-24,by-14),fill=(46,40,60),width=1)
    tracked(d,(m+24,by),FOOTER,mono(14),DIMV,track=3)
    pg=f"{idx:02d} / {TOTAL:02d}"; pw=sum((mono(14).getbbox(c)[2]-mono(14).getbbox(c)[0])+3 for c in pg)-3
    tracked(d,(W-m-24-pw,by),pg,mono(14),SILVER2,track=3)
    return img
def halo(img,cx,cy,r=120):
    layer=Image.new("RGB",(W,H),(0,0,0))
    ImageDraw.Draw(layer).ellipse((cx-r,cy-r,cx+r,cy+r),fill=(60,12,120))
    layer=layer.filter(ImageFilter.GaussianBlur(60)); img=ImageChops.screen(img,layer)
    d=ImageDraw.Draw(img)
    d.ellipse((cx-r*0.42,cy-r*0.42,cx+r*0.42,cy+r*0.42),outline=VIOLET2,width=2)
    d.ellipse((cx-12,cy-12,cx+12,cy+12),fill=VIOLET)
    return img
def paras(img,x,y,blocks,font,fill,maxw,lh=40,pgap=22):
    d=ImageDraw.Draw(img)
    for blk in blocks:
        for ln in wrap(d,blk,font,maxw):
            d.text((x,y),ln,font=font,fill=fill); y+=lh
        y+=pgap
    return y
def fit(im,iw,ih):
    sr,br=im.width/im.height, iw/ih
    if sr>br: nw,nh=iw,int(iw/sr)
    else:     nh,nw=ih,int(ih*sr)
    return im.resize((nw,nh),Image.LANCZOS)
def place(img,src,box,label=None,crop=None):
    x0,y0,x1,y1=box; d=ImageDraw.Draw(img)
    d.rectangle(box,outline=(54,48,68),width=2)
    pad=14; iw,ih=x1-x0-2*pad,y1-y0-2*pad
    im=src if isinstance(src,Image.Image) else Image.open(src).convert("RGB")
    if crop:
        w,h=im.size; im=im.crop((int(w*crop[0]),int(h*crop[1]),int(w*crop[2]),int(h*crop[3])))
    im=fit(im,iw,ih)
    img.paste(im,(x0+pad+(iw-im.width)//2,y0+pad+(ih-im.height)//2))
    if label: tracked(d,(x0+6,y1+12),label,mono(13),SILVER2,track=2)
    return img
def coded(img,x,y,items,gap=110,bw=900):
    d=ImageDraw.Draw(img)
    for ok,it in items:
        cx,cy=x+8,y+10
        if ok:
            d.line((cx-7,cy,cx-1,cy+7),fill=VIOLET,width=3); d.line((cx-1,cy+7,cx+9,cy-6),fill=VIOLET,width=3)
        else:
            d.line((cx-7,cy-7,cx+7,cy+7),fill=(150,120,90),width=3); d.line((cx-7,cy+7,cx+7,cy-7),fill=(150,120,90),width=3)
        ly=y
        for ln in wrap(d,it,mono(21),bw):
            d.text((x+34,ly),ln,font=mono(21),fill=PORC if ok else (190,168,120)); ly+=31
        y+=max(gap,(ly-y)+28)
    return img
CLAY=RV+"/MIKAGE_HERO_MOUNT_EEVEE_V0_1_CONTACT_SHEET.png"
MAT =RV+"/MIKAGE_HERO_MOUNT_MATERIAL_EEVEE_V0_13_CONTACT_SHEET.png"
SIG =RV+"/MIKAGE_HERO_MOUNT_VIOLET_GRAIN_EEVEE_V0_14_CONTACT_SHEET.png"

def s_title():
    img=base(); d=ImageDraw.Draw(img)
    tracked(d,(W/2,250),"BUILD LOG",mono(22),VIOLET2,track=14,anchor="ma")
    ty=360
    for ln in ["SKIN &","SIGNAL"]:
        tracked(d,(W/2,ty),ln,serif(82),PORC,track=4,anchor="ma"); ty+=100
    tracked(d,(W/2,620),"The clay learns a surface.",mono(20),SILVER,track=1,anchor="ma")
    img=halo(img,W//2,900,r=150); return chrome(img,1)
def s_problem():
    img=base(); d=ImageDraw.Draw(img)
    d.text((54,150),"CLAY ISN'T A BODY YET",font=serif(40),fill=PORC)
    paras(img,56,280,[
        "The blockout was honest grey — a shape you could light and turn, but not yet a thing you'd believe.",
        "To read as Mikage it needs material: porcelain, graphite, cold steel. And the one detail that says it's alive —",
        "the signal.",
    ],body(27),SILVER,940,lh=44,pgap=26)
    img=halo(img,W//2,1080,r=120); return chrome(img,2)
def s_material():
    img=base(); d=ImageDraw.Draw(img)
    d.text((54,150),"FIRST MATERIAL PASS",font=serif(42),fill=PORC)
    img=place(img,MAT,(54,250,1026,720),"EEVEE V0.13 — PORCELAIN / GRAPHITE / COLD STEEL",crop=(0.0,0.0,0.5,1.0))
    paras(img,56,800,[
        "Three materials, one rule: porcelain shell, graphite underlayer, cold steel. Palette holds — no warm, no flood.",
        "The first time it stops looking like raw clay.",
    ],body(25),SILVER,960,lh=40,pgap=18)
    return chrome(img,3)
def s_signal():
    img=base(); d=ImageDraw.Draw(img)
    d.text((54,150),"THE FIRST LIGHT",font=serif(44),fill=PORC)
    img=place(img,SIG,(54,250,1026,720),"EEVEE V0.14 — VIOLET, SLIT ONLY",crop=(0.25,0.0,0.5,1.0))
    paras(img,56,800,[
        "Two sensor slits lit electric violet (#8F00FF). Kept to the slit, the core and a single seam.",
        "Violet is a signal — never a wash, never a fill.",
    ],body(25),SILVER,960,lh=40,pgap=18)
    return chrome(img,4)
def s_beforeafter():
    img=base(); d=ImageDraw.Draw(img)
    d.text((54,150),"BEFORE / AFTER",font=serif(46),fill=PORC)
    place(img,CLAY,(54,250,530,780),"CLAY BLOCKOUT",crop=(0.0,0.0,0.5,1.0))
    place(img,MAT,(550,250,1026,780),"MATERIAL + SIGNAL",crop=(0.25,0.0,0.5,1.0))
    d.text((512,495),">",font=serif(40),fill=VIOLET2)
    paras(img,56,830,[
        "Left: grey clay. Right: the same body with a porcelain surface and a lit slit. Skin, and a signal.",
    ],body(25),SILVER,960,lh=40,pgap=18)
    return chrome(img,5)
def s_proves():
    img=base(); d=ImageDraw.Draw(img)
    d.text((54,150),"WHAT IT PROVES",font=serif(46),fill=PORC)
    img=coded(img,60,270,[
        (True ,"Palette holds: void, porcelain, violet — no warm, no flood."),
        (True ,"Violet restrained to slit, core and one seam. Signal, not skin."),
        (True ,"Geometry, pose and silhouette unchanged from the blockout."),
        (False,"Surface still reads a little clay / model-kit. Anti-toy is WIP."),
        (True ,"Candidate only. NOT canon, NOT final, NOT asset-locked."),
    ],gap=120,bw=900)
    return chrome(img,6)
def s_road():
    img=base(); d=ImageDraw.Draw(img)
    d.text((54,150),"THE ROAD",font=serif(46),fill=PORC)
    tracked(d,(56,232),"NEXT MICRO-PASSES",mono(15),SILVER2,track=2)
    img=coded(img,60,310,[
        (True,"Kill the toy look: lower albedo, porcelain sheen, real grain."),
        (True,"Light it like an object, not a studio mannequin."),
        (True,"Then motion V0.15 — breathing camera, light-sweep, the ride."),
    ],gap=128,bw=900)
    return chrome(img,7)
def s_next():
    img=base(); d=ImageDraw.Draw(img)
    d.text((54,150),"NEXT TRANSMISSION",font=serif(44),fill=PORC)
    paras(img,56,280,[
        "Clay became porcelain; a slit became a signal. Next it moves — and the music it carries is already live.",
        "From the void, it learned a shape. Now it learns to glow.",
    ],body(26),SILVER,960,lh=42,pgap=22)
    img=halo(img,W//2,760,r=130); d=ImageDraw.Draw(img)
    tracked(d,(W/2,1120),"MIKAGE ZENITH",serifr(34),PORC,track=8,anchor="ma")
    tracked(d,(W/2,1185),"FROM THE VOID, IT LEARNED A SHAPE",mono(15),VIOLET2,track=4,anchor="ma")
    d.ellipse((W//2-5,1240,W//2+5,1250),fill=VIOLET)
    d.line((W//2-60,1245,W//2-12,1245),fill=DIMV,width=1); d.line((W//2+12,1245,W//2+60,1245),fill=DIMV,width=1)
    return chrome(img,8)
slides=[s_title,s_problem,s_material,s_signal,s_beforeafter,s_proves,s_road,s_next]
for i,fn in enumerate(slides,1):
    fn().save(os.path.join(OUT,f"slide_{i}.png")); print("saved",i)
print("DONE EP05")
