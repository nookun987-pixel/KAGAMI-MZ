#!/usr/bin/env python3
# MIKAGE ZENITH — BUILD LOG EPISODE 03 : THE DESIGN CODE
import os
from PIL import Image, ImageDraw, ImageFont, ImageFilter, ImageChops

W, H = 1080, 1350
VOID=(5,5,8); VOID2=(12,12,18); PORC=(242,238,234)
SILVER=(160,160,176); SILVER2=(120,120,138)
VIOLET=(143,0,255); VIOLET2=(123,47,255); DIMV=(70,40,110)

FD  = "/sessions/nifty-elegant-sagan/mnt/outputs/ep02/fonts"
SRC = "/sessions/nifty-elegant-sagan/mnt/KAGAMI-MZ_SYNC_PUSH_V2/production/character/keyart_candidates"
OUT = os.path.join(os.path.dirname(__file__), "out")
os.makedirs(OUT, exist_ok=True)

def serif(sz):  return ImageFont.truetype(os.path.join(FD,"cinzel700.ttf"), sz)
def serifr(sz): return ImageFont.truetype(os.path.join(FD,"cinzel400.ttf"), sz)
def body(sz):   return ImageFont.truetype(os.path.join(FD,"shippori500.ttf"), sz)
def mono(sz):   return ImageFont.truetype(os.path.join(FD,"spacemono400.ttf"), sz)

EP="03"; FOOTER="THE DESIGN CODE"; TOTAL=8

def tracked(d, xy, text, font, fill, track=0, anchor="la"):
    x,y = xy
    if anchor=="ma":
        total = sum((font.getbbox(c)[2]-font.getbbox(c)[0])+track for c in text)-track
        x = xy[0]-total/2
    for c in text:
        d.text((x,y), c, font=font, fill=fill)
        x += (font.getbbox(c)[2]-font.getbbox(c)[0])+track

def wrap(d, text, font, maxw):
    words, lines, cur = text.split(), [], ""
    for w in words:
        t=(cur+" "+w).strip()
        if d.textlength(t, font=font)<=maxw: cur=t
        else:
            if cur: lines.append(cur)
            cur=w
    if cur: lines.append(cur)
    return lines

def base():
    img=Image.new("RGB",(W,H),VOID)
    g=Image.new("L",(W,H),0)
    ImageDraw.Draw(g).ellipse((W*0.1,H*0.05,W*0.9,H*0.7), fill=28)
    g=g.filter(ImageFilter.GaussianBlur(220))
    return Image.composite(Image.new("RGB",(W,H),VOID2), img, g)

def chrome(img, idx):
    d=ImageDraw.Draw(img); m=30
    d.rectangle((m,m,W-m,H-m), outline=(40,36,52), width=2)
    ty=52
    tracked(d,(m+24,ty),"MIKAGE ZENITH",mono(17),SILVER,track=3)
    rt=f"BUILD LOG // {EP}"
    rw=sum((mono(17).getbbox(c)[2]-mono(17).getbbox(c)[0])+3 for c in rt)-3
    tracked(d,(W-m-24-rw,ty),rt,mono(17),SILVER,track=3)
    d.line((m+24,ty+34,W-m-24,ty+34), fill=(46,40,60), width=1)
    by=H-66
    d.line((m+24,by-14,W-m-24,by-14), fill=(46,40,60), width=1)
    tracked(d,(m+24,by),FOOTER,mono(14),DIMV,track=3)
    pg=f"{idx:02d} / {TOTAL:02d}"
    pw=sum((mono(14).getbbox(c)[2]-mono(14).getbbox(c)[0])+3 for c in pg)-3
    tracked(d,(W-m-24-pw,by),pg,mono(14),SILVER2,track=3)
    return img

def halo(img, cx, cy, r=120):
    layer=Image.new("RGB",(W,H),(0,0,0))
    ImageDraw.Draw(layer).ellipse((cx-r,cy-r,cx+r,cy+r), fill=(60,12,120))
    layer=layer.filter(ImageFilter.GaussianBlur(60))
    img=ImageChops.screen(img,layer)
    d=ImageDraw.Draw(img)
    d.ellipse((cx-r*0.42,cy-r*0.42,cx+r*0.42,cy+r*0.42), outline=VIOLET2, width=2)
    d.ellipse((cx-12,cy-12,cx+12,cy+12), fill=VIOLET)
    return img

def paras(img, x, y, blocks, font, fill, maxw, lh=40, pgap=22):
    d=ImageDraw.Draw(img)
    for blk in blocks:
        for ln in wrap(d, blk, font, maxw):
            d.text((x,y), ln, font=font, fill=fill); y+=lh
        y+=pgap
    return y

def coded_list(img, x, y, items, gap=120, bw=900, ok=True):
    d=ImageDraw.Draw(img)
    for it in items:
        cx,cy=x+8,y+10
        if ok:
            d.line((cx-7,cy,cx-1,cy+7), fill=VIOLET, width=3)
            d.line((cx-1,cy+7,cx+9,cy-6), fill=VIOLET, width=3)
        else:
            d.line((cx-7,cy-7,cx+7,cy+7), fill=(120,120,138), width=3)
            d.line((cx-7,cy+7,cx+7,cy-7), fill=(120,120,138), width=3)
        ly=y
        for ln in wrap(d, it, mono(22), bw):
            d.text((x+34,ly), ln, font=mono(22), fill=PORC if ok else SILVER); ly+=32
        y+=max(gap,(ly-y)+30)
    return img

def helmet_crop(img, box):
    x0,y0,x1,y1=box
    src=Image.open(f"{SRC}/MIKAGE_SOLO_VIOLET_V0_4.png").convert("RGB")
    w,h=src.size
    c=src.crop((int(w*0.30),int(h*0.08),int(w*0.70),int(h*0.30)))
    iw,ih=x1-x0,y1-y0
    sr,br=c.width/c.height, iw/ih
    if sr>br: nw,nh=iw,int(iw/sr)
    else:     nh,nw=ih,int(ih*sr)
    c=c.resize((nw,nh), Image.LANCZOS)
    img.paste(c,(x0+(iw-nw)//2,y0+(ih-nh)//2))
    return img

def slide_title():
    img=base(); d=ImageDraw.Draw(img)
    tracked(d,(W/2,250),"BUILD LOG",mono(22),VIOLET2,track=14,anchor="ma")
    ty=360
    for ln in ["THE DESIGN","CODE"]:
        tracked(d,(W/2,ty),ln,serif(82),PORC,track=4,anchor="ma"); ty+=100
    tracked(d,(W/2,620),"What makes a signal recognizable.",mono(20),SILVER,track=1,anchor="ma")
    img=halo(img,W//2,900,r=150)
    return chrome(img,1)

def slide_why():
    img=base(); d=ImageDraw.Draw(img)
    d.text((54,150),"WHY A CODE",font=serif(46),fill=PORC)
    paras(img,56,280,[
        "We have a shape (01) and a world (02). What keeps every future frame on-model is a code — a short set of rules that don't bend.",
        "Lore can grow. Scenes can change. These do not. This is what makes Mikage Mikage, in one glance.",
    ],body(27),SILVER,940,lh=44,pgap=26)
    img=halo(img,W//2,1060,r=120)
    return chrome(img,2)

def slide_mark():
    img=base(); d=ImageDraw.Draw(img)
    d.text((54,150),"THE MARK",font=serif(46),fill=PORC)
    img=helmet_crop(img,(340,250,740,640))
    d=ImageDraw.Draw(img)
    tracked(d,(W/2,660),"FACELESS — EXACTLY TWO SENSOR SLITS",mono(15),SILVER2,track=2,anchor="ma")
    paras(img,56,740,[
        "A porcelain helmet over a graphene underlayer. No face. No eyes. No expression — ever.",
        "Two thin sensor slits, lit violet. Not one, not three. The mark is the silence.",
    ],body(25),SILVER,960,lh=40,pgap=20)
    return chrome(img,3)

def slide_palette():
    img=base(); d=ImageDraw.Draw(img)
    d.text((54,150),"THE PALETTE",font=serif(46),fill=PORC)
    sw=[("VOID","#050508",VOID),("PORCELAIN","#F2EEEA",PORC),("VIOLET","#8F00FF",VIOLET)]
    x=60; bw=300; gap=30; top=290
    for name,hexv,col in sw:
        d.rectangle((x,top,x+bw,top+300), fill=col, outline=(54,48,68), width=2)
        tracked(d,(x,top+330),name,mono(18),PORC,track=3)
        tracked(d,(x,top+362),hexv,mono(15),SILVER2,track=2)
        x+=bw+gap
    paras(img,56,760,[
        "Void black holds the frame. Porcelain carries the form.",
        "Violet is a signal — a halo, a slit, a single trace. Never a fill, never a full-screen wash. The dark must stay dark.",
    ],body(25),SILVER,960,lh=40,pgap=20)
    return chrome(img,4)

def slide_forms():
    img=base(); d=ImageDraw.Draw(img)
    d.text((54,150),"THE FORMS",font=serif(46),fill=PORC)
    img=coded_list(img,60,280,[
        "Monolithic, industrial, heavy, purposeful.",
        "No wasted ornament. Shape carries meaning.",
        "The Zenith Blade is a slab — never a katana.",
        "Wide tracking, high negative space, hairlines.",
        "Slow motion. Fine grain. Near-zero radius.",
    ],gap=120,bw=900,ok=True)
    return chrome(img,5)

def slide_bans():
    img=base(); d=ImageDraw.Draw(img)
    d.text((54,150),"THE BANS",font=serif(46),fill=PORC)
    tracked(d,(56,230),"NEVER, ON ANY PUBLIC SURFACE",mono(15),SILVER2,track=2)
    img=coded_list(img,60,320,[
        "No human face, eyes, or skin.",
        "No anime, no mascot, no fantasy samurai.",
        "No neon-as-fill. No warm color.",
        "No gaming HUD, no fake UI clutter, no emoji.",
        "No borrowed stock imagery passed as canon.",
    ],gap=120,bw=900,ok=False)
    return chrome(img,6)

def slide_voice():
    img=base(); d=ImageDraw.Draw(img)
    d.text((54,150),"THE VOICE",font=serif(46),fill=PORC)
    paras(img,56,280,[
        "Outward, the tone is calm, minimal, mysterious.",
        "Releases are transmissions. The archive is the Launch Arc.",
        "The call to action is exact: Listen now when live, Pre-save when not — never mixed.",
        "Nothing is called final or canon until the operator locks it. We build candidates; the hand decides.",
    ],body(26),SILVER,960,lh=42,pgap=20)
    return chrome(img,7)

def slide_next():
    img=base(); d=ImageDraw.Draw(img)
    d.text((54,150),"NEXT TRANSMISSION",font=serif(44),fill=PORC)
    paras(img,56,280,[
        "The code is set. Next, it gets tested under light — a real material pass on the locked shapes, then motion.",
        "Rules first, so the beauty has something true to obey.",
    ],body(26),SILVER,960,lh=42,pgap=22)
    img=halo(img,W//2,760,r=130)
    d=ImageDraw.Draw(img)
    tracked(d,(W/2,1120),"MIKAGE ZENITH",serifr(34),PORC,track=8,anchor="ma")
    tracked(d,(W/2,1185),"FROM THE VOID, IT LEARNED A SHAPE",mono(15),VIOLET2,track=4,anchor="ma")
    d.ellipse((W//2-5,1240,W//2+5,1250), fill=VIOLET)
    d.line((W//2-60,1245,W//2-12,1245), fill=DIMV, width=1)
    d.line((W//2+12,1245,W//2+60,1245), fill=DIMV, width=1)
    return chrome(img,8)

slides=[slide_title,slide_why,slide_mark,slide_palette,slide_forms,slide_bans,slide_voice,slide_next]
for i,fn in enumerate(slides,1):
    fn().save(os.path.join(OUT,f"slide_{i}.png")); print("saved",i)
print("DONE")
