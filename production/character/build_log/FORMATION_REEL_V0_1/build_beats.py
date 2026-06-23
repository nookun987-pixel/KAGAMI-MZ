import os
from PIL import Image, ImageDraw, ImageFont, ImageFilter, ImageChops
W,H=1080,1920
VOID=(5,5,8); VOID2=(13,13,20); PORC=(242,238,234); SILVER=(165,165,182); SILVER2=(120,120,138)
VIOLET=(143,0,255); VIOLET2=(123,47,255); DIMV=(70,40,110)
FD="/sessions/nifty-elegant-sagan/mnt/outputs/ep02/fonts"
KC="/sessions/nifty-elegant-sagan/mnt/KAGAMI-MZ_SYNC_PUSH_V2/production/character/keyart_candidates"
RV="/sessions/nifty-elegant-sagan/mnt/KAGAMI-MZ_SYNC_PUSH_V2/production/character/reviews"
REVEAL="/sessions/nifty-elegant-sagan/mnt/outputs/reveal"
OUT="/sessions/nifty-elegant-sagan/mnt/outputs/process/beats"; os.makedirs(OUT,exist_ok=True)
def serif(s):return ImageFont.truetype(os.path.join(FD,"cinzel700.ttf"),s)
def serifr(s):return ImageFont.truetype(os.path.join(FD,"cinzel400.ttf"),s)
def mono(s):return ImageFont.truetype(os.path.join(FD,"spacemono400.ttf"),s)
def body(s):return ImageFont.truetype(os.path.join(FD,"shippori500.ttf"),s)
def tr(d,xy,t,f,fill,trk,anchor="la"):
    x,y=xy
    if anchor=="ma":
        tot=sum((f.getbbox(c)[2]-f.getbbox(c)[0])+trk for c in t)-trk; x=xy[0]-tot/2
    for c in t:
        d.text((x,y),c,font=f,fill=fill); x+=(f.getbbox(c)[2]-f.getbbox(c)[0])+trk
def base():
    img=Image.new("RGB",(W,H),VOID); g=Image.new("L",(W,H),0)
    ImageDraw.Draw(g).ellipse((W*0.08,H*0.04,W*0.92,H*0.6),fill=30); g=g.filter(ImageFilter.GaussianBlur(230))
    return Image.composite(Image.new("RGB",(W,H),VOID2),img,g)
def chrome(img,foot):
    d=ImageDraw.Draw(img); m=30
    d.rectangle((m,m,W-m,H-m),outline=(40,36,52),width=2)
    tr(d,(m+24,52),"MIKAGE ZENITH",mono(17),SILVER,3)
    rt="FORMATION"; rw=sum((mono(17).getbbox(c)[2]-mono(17).getbbox(c)[0])+3 for c in rt)-3
    tr(d,(W-m-24-rw,52),rt,mono(17),SILVER,3)
    d.line((m+24,86,W-m-24,86),fill=(46,40,60),width=1)
    by=H-64; d.line((m+24,by-14,W-m-24,by-14),fill=(46,40,60),width=1)
    tr(d,(m+24,by),"FORMATION OF MIKAGE",mono(14),DIMV,3)
    tr(d,(W-m-110,by),foot,mono(14),SILVER2,3)
    return img
def imgbox(img,path,box,label):
    x0,y0,x1,y1=box; d=ImageDraw.Draw(img); d.rectangle(box,outline=(54,48,68),width=2)
    pad=16; iw,ih=x1-x0-2*pad,y1-y0-2*pad
    im=Image.open(path).convert("RGB"); sr,br=im.width/im.height,iw/ih
    if sr>br: nw,nh=iw,int(iw/sr)
    else: nh,nw=ih,int(ih*sr)
    im=im.resize((nw,nh),Image.LANCZOS); img.paste(im,(x0+pad+(iw-nw)//2,y0+pad+(ih-nh)//2))
    tr(d,(x0+6,y1+14),label,mono(14),SILVER2,2)
    return img
def beat_img(fn,kick,title,cap,path,label,num):
    img=base(); d=ImageDraw.Draw(img)
    tr(d,(W/2,220),kick,mono(20),VIOLET2,10,anchor="ma")
    tr(d,(W/2,290),title,serif(60),PORC,4,anchor="ma")
    img=imgbox(img,path,(70,440,1010,1240),label)
    tr(d,(W/2,1320),cap,mono(20),SILVER,1,anchor="ma")
    chrome(img,num)
    img.save(os.path.join(OUT,fn))
# 0 HOOK
img=base(); d=ImageDraw.Draw(img)
tr(d,(W/2,560),"FORMATION OF",mono(24),VIOLET2,12,anchor="ma")
tr(d,(W/2,640),"MIKAGE",serif(120),PORC,8,anchor="ma")
tr(d,(W/2,820),"From the void, a shape.",mono(22),SILVER,2,anchor="ma")
# halo
layer=Image.new("RGB",(W,H),(0,0,0)); ImageDraw.Draw(layer).ellipse((W//2-150,1050,W//2+150,1350),fill=(60,12,120))
layer=layer.filter(ImageFilter.GaussianBlur(70)); img=ImageChops.screen(img,layer)
d=ImageDraw.Draw(img); d.ellipse((W//2-50,1170,W//2+50,1270),outline=VIOLET2,width=2); d.ellipse((W//2-12,1208,W//2+12,1232),fill=VIOLET)
chrome(img,"00"); img.save(os.path.join(OUT,"beat_00.png"))
# image beats
beat_img("beat_01.png","01  ·  THE BLUEPRINT","THE BLUEPRINT","A faceless signal, drawn flat.",f"{KC}/MIKAGE_SOLO_VIOLET_V0_4.png","2D KEY-ART V0.4","01")
beat_img("beat_02.png","02  ·  INTO 3D","INTO 3D","The drawing becomes geometry.",f"{RV}/MIKAGE_HERO_MOUNT_EEVEE_V0_1_CONTACT_SHEET.png","EEVEE V0.1 — CLAY BLOCKOUT","02")
beat_img("beat_03.png","03  ·  THE MOUNT","THE MOUNT","From platform to armored steed.",f"{RV}/MIKAGE_HERO_MOUNT_EEVEE_V0_5_CONTACT_SHEET.png","EEVEE V0.5 — STEED LOCKED","03")
beat_img("beat_04.png","04  ·  THE SKIN","THE SKIN","Porcelain, graphite, cold steel.",f"{RV}/MIKAGE_HERO_MOUNT_EEVEE_V0_6_CONTACT_SHEET.png","EEVEE V0.6 — MATERIAL","04")
beat_img("beat_05.png","05  ·  THE RIDER","THE RIDER","The character takes form.",f"{RV}/MIKAGE_RIDER_SOLO_EEVEE_V0_1_CONTACT_SHEET.png","RIDER SOLO — FIRST BLOCKOUT","05")
# 6 FIRST FORM payoff (figure big + text)
img=base(); d=ImageDraw.Draw(img)
tr(d,(W/2,150),"06  ·  THE FIRST FORM",mono(20),VIOLET2,8,anchor="ma")
fig=Image.open(f"{REVEAL}/v3_regraded.png").convert("RGB"); fw=1000; fh=int(fig.height*fw/fig.width); fig=fig.resize((fw,fh),Image.LANCZOS)
layer=Image.new("RGB",(W,H),(0,0,0)); layer.paste(fig,((W-fw)//2,230)); img=ImageChops.screen(img,layer)
d=ImageDraw.Draw(img)
tr(d,(W/2,1230),"MIKAGE",serif(104),PORC,8,anchor="ma")
for i,ln in enumerate(["An entity from the void, awakened by","one human hand and many machine minds."]):
    tr(d,(W/2,1380+i*40),ln,body(25),SILVER,0,anchor="ma")
tr(d,(W/2,1500),"FROM THE VOID, IT LEARNED A SHAPE",mono(15),VIOLET2,4,anchor="ma")
chrome(img,"06"); img.save(os.path.join(OUT,"beat_06.png"))
print("BEATS DONE", len(os.listdir(OUT)))
