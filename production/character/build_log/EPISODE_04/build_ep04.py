#!/usr/bin/env python3
# MIKAGE ZENITH — BUILD LOG EPISODE 04 : OFF THE PAGE (blueprint -> first 3D render)
import os
from PIL import Image, ImageDraw, ImageFont, ImageFilter, ImageChops

W,H=1080,1350
VOID=(5,5,8); VOID2=(12,12,18); PORC=(242,238,234)
SILVER=(160,160,176); SILVER2=(120,120,138)
VIOLET=(143,0,255); VIOLET2=(123,47,255); DIMV=(70,40,110)

FD="/sessions/nifty-elegant-sagan/mnt/outputs/ep02/fonts"
SRC="/sessions/nifty-elegant-sagan/mnt/KAGAMI-MZ_SYNC_PUSH_V2/production/character"
KC=SRC+"/keyart_candidates"
OUT=os.path.join(os.path.dirname(__file__),"out"); os.makedirs(OUT,exist_ok=True)

def serif(s): return ImageFont.truetype(os.path.join(FD,"cinzel700.ttf"),s)
def serifr(s):return ImageFont.truetype(os.path.join(FD,"cinzel400.ttf"),s)
def body(s):  return ImageFont.truetype(os.path.join(FD,"shippori500.ttf"),s)
def mono(s):  return ImageFont.truetype(os.path.join(FD,"spacemono400.ttf"),s)

EP="04"; FOOTER="OFF THE PAGE"; TOTAL=8

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

def fit(im, iw, ih):
    sr,br=im.width/im.height, iw/ih
    if sr>br: nw,nh=iw,int(iw/sr)
    else:     nh,nw=ih,int(ih*sr)
    return im.resize((nw,nh),Image.LANCZOS)

def place(img, src_or_im, box, label=None, crop=None):
    x0,y0,x1,y1=box; d=ImageDraw.Draw(img)
    d.rectangle(box,outline=(54,48,68),width=2)
    pad=14; iw,ih=x1-x0-2*pad,y1-y0-2*pad
    im=src_or_im if isinstance(src_or_im,Image.Image) else Image.open(src_or_im).convert("RGB")
    if crop:
        w,h=im.size; im=im.crop((int(w*crop[0]),int(h*crop[1]),int(w*crop[2]),int(h*crop[3])))
    im=fit(im,iw,ih)
    img.paste(im,(x0+pad+(iw-im.width)//2,y0+pad+(ih-im.height)//2))
    if label: tracked(d,(x0+6,y1+12),label,mono(13),SILVER2,track=2)
    return img

def coded(img,x,y,items,gap=110,bw=900,ok=True):
    d=ImageDraw.Draw(img)
    for it in items:
        cx,cy=x+8,y+10
        if ok:
            d.line((cx-7,cy,cx-1,cy+7),fill=VIOLET,width=3); d.line((cx-1,cy+7,cx+9,cy-6),fill=VIOLET,width=3)
        else:
            d.line((cx-7,cy-7,cx+7,cy+7),fill=(120,120,138),width=3); d.line((cx-7,cy+7,cx+7,cy-7),fill=(120,120,138),width=3)
        ly=y
        for ln in wrap(d,it,mono(21),bw):
            d.text((x+34,ly),ln,font=mono(21),fill=PORC if ok else SILVER); ly+=31
        y+=max(gap,(ly-y)+28)
    return img

EEVEE=SRC+"/reviews/MIKAGE_HERO_MOUNT_EEVEE_V0_1_CONTACT_SHEET.png"
BP=KC+"/MIKAGE_HERO_MOUNT_V0_2.png"

def s_title():
    img=base(); d=ImageDraw.Draw(img)
    tracked(d,(W/2,250),"BUILD LOG",mono(22),VIOLET2,track=14,anchor="ma")
    ty=360
    for ln in ["OFF THE","PAGE"]:
        tracked(d,(W/2,ty),ln,serif(82),PORC,track=4,anchor="ma"); ty+=100
    tracked(d,(W/2,620),"The drawing becomes dimensional.",mono(20),SILVER,track=1,anchor="ma")
    img=halo(img,W//2,900,r=150); return chrome(img,1)

def s_problem():
    img=base(); d=ImageDraw.Draw(img)
    d.text((54,150),"A FLAT THING CAN'T BE FILMED",font=serif(36),fill=PORC)
    paras(img,56,270,[
        "We had a locked shape and a design code. But a drawing is flat — you cannot light it, orbit it, or move it.",
        "To reach the screen, Mikage had to leave the page and become geometry: a real 3D body inside Blender.",
        "This log is the first time that happened.",
    ],body(27),SILVER,940,lh=44,pgap=26)
    img=halo(img,W//2,1080,r=120); return chrome(img,2)

def s_blueprint():
    img=base(); d=ImageDraw.Draw(img)
    d.text((54,150),"THE BLUEPRINT",font=serif(46),fill=PORC)
    img=place(img,BP,(54,250,1026,800),"HERO MOUNT V0.2 — 2D LAYOUT")
    paras(img,56,850,[
        "The plan: rider on the armored steed, drawn flat. Locked proportions, seat, blade, stance — a map, not a body.",
    ],body(25),SILVER,960,lh=40,pgap=18)
    return chrome(img,3)

def s_render():
    img=base(); d=ImageDraw.Draw(img)
    d.text((54,150),"THE FIRST RENDER",font=serif(44),fill=PORC)
    img=place(img,EEVEE,(54,250,1026,760),"BLENDER / EEVEE — FIRST 3D BLOCKOUT")
    paras(img,56,810,[
        "The same design, now dimensional — three angles from one Blender scene. Clay grayscale, violet kept to the two slits.",
        "It can finally be lit and turned.",
    ],body(25),SILVER,960,lh=40,pgap=18)
    return chrome(img,4)

def s_beforeafter():
    img=base(); d=ImageDraw.Draw(img)
    d.text((54,150),"BEFORE / AFTER",font=serif(46),fill=PORC)
    place(img,BP,(54,250,530,780),"2D BLUEPRINT")
    place(img,EEVEE,(550,250,1026,780),"3D RENDER",crop=(0.50,0.28,0.92,0.66))
    # arrow
    d.text((512,495),">",font=serif(40),fill=VIOLET2)
    paras(img,56,830,[
        "Left: the flat plan. Right: the same entity, standing in three dimensions for the first time. The map became a model.",
    ],body(25),SILVER,960,lh=40,pgap=18)
    return chrome(img,5)

def s_proves():
    img=base(); d=ImageDraw.Draw(img)
    d.text((54,150),"WHAT IT PROVES",font=serif(46),fill=PORC)
    img=coded(img,60,270,[
        "The pipeline runs end to end: design to Blender to render.",
        "The locked silhouette survives in 3D — helmet, two slits.",
        "It is a CLAY BLOCKOUT — rough: boxy head, thin legs, proxy rider.",
        "This is a win of PIPELINE, not of beauty. Not yet.",
        "Candidate only. NOT canon, NOT final, NOT asset-locked.",
    ],gap=124,bw=900,ok=True)
    return chrome(img,6)

def s_road():
    img=base(); d=ImageDraw.Draw(img)
    d.text((54,150),"THE ROAD IN 3D",font=serif(46),fill=PORC)
    tracked(d,(56,232),"ALREADY MOVING — V0.2 IN PROGRESS",mono(15),SILVER2,track=2)
    img=coded(img,60,310,[
        "Shape-correction: equine head, jointed legs, real armor.",
        "Material: porcelain vs graphite vs cold steel.",
        "Violet signal pass — slit, core, restrained.",
        "Motion: breathing camera, light-sweep, the ride.",
    ],gap=128,bw=900,ok=True)
    return chrome(img,7)

def s_next():
    img=base(); d=ImageDraw.Draw(img)
    d.text((54,150),"NEXT TRANSMISSION",font=serif(44),fill=PORC)
    paras(img,56,280,[
        "Off the page, into the engine. Next, the blockout gets corrected, then lit — clay becomes porcelain.",
        "The entity is no longer a drawing. It is a thing that can be filmed.",
    ],body(26),SILVER,960,lh=42,pgap=22)
    img=halo(img,W//2,760,r=130); d=ImageDraw.Draw(img)
    tracked(d,(W/2,1120),"MIKAGE ZENITH",serifr(34),PORC,track=8,anchor="ma")
    tracked(d,(W/2,1185),"FROM THE VOID, IT LEARNED A SHAPE",mono(15),VIOLET2,track=4,anchor="ma")
    d.ellipse((W//2-5,1240,W//2+5,1250),fill=VIOLET)
    d.line((W//2-60,1245,W//2-12,1245),fill=DIMV,width=1); d.line((W//2+12,1245,W//2+60,1245),fill=DIMV,width=1)
    return chrome(img,8)

slides=[s_title,s_problem,s_blueprint,s_render,s_beforeafter,s_proves,s_road,s_next]
for i,fn in enumerate(slides,1):
    fn().save(os.path.join(OUT,f"slide_{i}.png")); print("saved",i)
print("DONE")
