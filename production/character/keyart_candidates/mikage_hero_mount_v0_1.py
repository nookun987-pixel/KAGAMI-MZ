import math, numpy as np
from PIL import Image, ImageDraw, ImageFilter
W,H=2400,1350
VOID=(5,5,8); STEEL=(150,150,158); STEEL_D=(94,94,102); BODY=(17,17,23); HUMP=(24,24,32)
POR=(236,232,228); VIOLET=(143,0,255)
rng=np.random.default_rng(808)
gy=int(H*0.80); cx=W*0.50
def render():
    grad=np.zeros((H,W,3),np.uint8)
    for y in range(H): t=y/H; grad[y,:]=(5+int(7*t),5+int(7*t),9+int(11*t))
    img=Image.fromarray(grad); d=ImageDraw.Draw(img,"RGBA")
    fog=Image.new("L",(W,H),0); ImageDraw.Draw(fog).rectangle([0,gy-240,W,gy+60],fill=130); fog=fog.filter(ImageFilter.GaussianBlur(90))
    img=Image.composite(Image.new("RGB",(W,H),(16,16,22)),img,fog); d=ImageDraw.Draw(img,"RGBA")
    d.rectangle([0,gy,W,H],fill=(7,7,11,255)); d.line([(0,gy),(W,gy)],fill=(30,30,40,140),width=2)
    SH=[]; VGL=[]
    def seg(p0,p1,w,c): d.line([p0,p1],fill=c+(255,),width=w)
    def joint(x,y,r,c=STEEL): d.ellipse([x-r,y-r,x+r,y+r],fill=c+(255,)); d.ellipse([x-r*0.4,y-r*0.4,x+r*0.4,y+r*0.4],fill=(34,34,44,255))
    def hoof(fx,big=1.0,near=True,vio=False):
        s=Image.new("RGBA",(W,H),(0,0,0,0)); ImageDraw.Draw(s).ellipse([fx-60*big,gy-6,fx+60*big,gy+22],fill=(0,0,0,165 if near else 110)); s=s.filter(ImageFilter.GaussianBlur(13)); SH.append(s)
        w=20*big; d.polygon([(fx-w,gy-42),(fx+w,gy-42),(fx+w*0.62,gy+6),(fx-w*0.62,gy+6)],fill=(20,20,26,255)); d.line([(fx-w,gy-42),(fx-w*0.62,gy+6)],fill=STEEL_D+(200,),width=3)
        if vio:
            g=Image.new("RGBA",(W,H),(0,0,0,0)); ImageDraw.Draw(g).ellipse([fx-16,gy-4,fx+16,gy+8],fill=(143,0,255,150)); VGL.append(g.filter(ImageFilter.GaussianBlur(5)))
    def legF(x,col,ec,near,bend=0):
        kx,ky=x-6+bend,878; seg((x,706),(kx,ky),26 if near else 18,col); joint(kx,ky,16 if near else 11,ec); seg((kx,ky),(x-2+bend,gy-42),17 if near else 12,col); d.line([(kx-10,ky+8),(kx-14+bend,gy-52)],fill=STEEL_D+(150,),width=4)
    def legH(x,col,ec,near):
        sx,sy=x+44,852; hx,hy=x-2,956; seg((x,712),(sx,sy),24 if near else 18,col); joint(sx,sy,15 if near else 11,ec); seg((sx,sy),(hx,hy),18 if near else 13,col); joint(hx,hy,13 if near else 10,ec); seg((hx,hy),(hx+20,gy-42),15 if near else 11,col); d.line([(hx+6,hy+6),(hx+24,gy-52)],fill=STEEL_D+(150,),width=4)
    # far legs
    legF(cx-90,(28,28,36),STEEL_D,False,bend=14); legH(cx+250,(28,28,36),STEEL_D,False); hoof(cx-90,1.0,False); hoof(cx+270,1.0,False)
    # body
    top=[(cx-486,616),(cx-380,496),(cx-250,470),(cx-110,500),(cx+50,516),(cx+200,498),(cx+340,492),(cx+430,540)]
    bot=[(cx+430,540),(cx+420,700),(cx+300,756),(cx+120,776),(cx-120,770),(cx-330,742),(cx-400,672)]
    d.polygon(top+bot,fill=BODY)
    d.polygon([(cx-300,496),(cx-150,440),(cx-10,470),(cx-20,576),(cx-280,572)],fill=HUMP); d.line([(cx-300,496),(cx-150,440),(cx-10,470)],fill=STEEL_D+(160,),width=3)
    d.polygon([(cx-400,650),(cx-300,690),(cx-250,768),(cx-380,748)],fill=(20,20,28,255)); d.line([(cx-400,650),(cx-300,690),(cx-250,768)],fill=STEEL_D+(140,),width=3)
    d.polygon([(cx+150,470),(cx+280,452),(cx+380,498),(cx+360,580),(cx+150,576)],fill=HUMP); d.line([(cx+150,470),(cx+280,452),(cx+380,498)],fill=STEEL_D+(150,),width=3)
    seg((cx-300,742),(cx+300,748),9,STEEL_D)
    for x in range(int(cx-220),int(cx+240),62): d.line([(x,540),(x,720)],fill=(40,40,52,120),width=3)
    seg((cx-300,512),(cx-300,500),40,BODY); seg((cx-300,512),(cx-440,486),38,BODY); seg((cx-440,486),(cx-548,524),28,BODY); joint(cx-440,486,14,STEEL_D); joint(cx-548,524,13,STEEL_D); seg((cx-548,524),(cx-606,606),22,BODY)
    hx,hyy=cx-628,640; sc=1.44
    head=[(hx+40*sc,hyy-58*sc),(hx-30*sc,hyy-46*sc),(hx-104*sc,hyy-6*sc),(hx-118*sc,hyy+34*sc),(hx-78*sc,hyy+58*sc),(hx-6*sc,hyy+52*sc),(hx+34*sc,hyy+6*sc)]
    d.polygon(head,fill=(26,26,34,255)); d.polygon([(hx+40*sc,hyy-58*sc),(hx-30*sc,hyy-46*sc),(hx-58*sc,hyy-2*sc),(hx+16*sc,hyy-12*sc)],fill=STEEL_D+(255,))
    d.line([(hx-104*sc,hyy-6*sc),(hx-118*sc,hyy+34*sc)],fill=STEEL_D+(190,),width=4); d.line([(hx-30*sc,hyy+42*sc),(hx-86*sc,hyy+58*sc)],fill=(54,54,66,220),width=4)
    seg((hx-6*sc,hyy-52*sc),(hx-22*sc,hyy-110*sc),6,STEEL_D); seg((hx+20*sc,hyy-46*sc),(hx+36*sc,hyy-104*sc),6,STEEL_D)
    d.line([(hx-98*sc,hyy+12*sc),(hx-44*sc,hyy+2*sc)],fill=(40,40,50,255),width=9)
    # steed head sensor = small violet signal
    ghd=Image.new("RGBA",(W,H),(0,0,0,0)); ImageDraw.Draw(ghd).line([(hx-94*sc,hyy+11*sc),(hx-48*sc,hyy+2*sc)],fill=(143,0,255,230),width=6); VGL.append(ghd.filter(ImageFilter.GaussianBlur(5)))
    # near legs
    legF(cx-170,BODY,STEEL,True,bend=0); legH(cx+330,BODY,STEEL,True); hoof(cx-170,1.5,True,vio=True); hoof(cx+350,1.4,True,vio=True)
    # ===== RIDER +8% (anchor scale) =====
    ax,ay=cx+40,440; RS=1.08
    def r(x,y): return (ax+(x-ax)*RS, ay+(y-ay)*RS)
    rx=cx+40
    d.polygon([r(rx+10,330),r(rx+70,360),r(rx+120,520),r(rx+70,560),r(rx+30,470)],fill=(9,9,13,255))      # hair
    d.polygon([r(rx-6,360),r(rx+96,372),r(rx+70,520),r(rx-2,500)],fill=(13,13,19,235))                    # mantle
    d.polygon([r(rx-6,486),r(rx+34,492),r(rx-70,548),r(rx-96,536)],fill=POR)                              # thigh
    d.polygon([r(rx-96,536),r(rx-70,548),r(rx-58,640),r(rx-90,640)],fill=(150,148,150,255))               # shin
    d.ellipse([*r(rx-100,632),*r(rx-58,664)],fill=(20,20,26,255))                                         # foot
    d.polygon([r(rx-40,372),r(rx+44,360),r(rx+54,500),r(rx-34,500)],fill=(15,15,20,255))                  # torso underlayer
    d.polygon([r(rx-30,384),r(rx+34,374),r(rx+40,486),r(rx-26,488)],fill=POR)                             # chest plate
    d.line([r(rx-26,488),r(rx+40,486)],fill=(15,15,20,255),width=4)
    d.polygon([r(rx-34,372),r(rx+18,360),r(rx+8,418),r(rx-44,420)],fill=POR); d.polygon([r(rx+18,360),r(rx+8,418),r(rx-12,410),r(rx-2,366)],fill=(15,15,20,255))  # pauldron
    seg(r(rx-30,400),r(rx-86,470),18,(150,148,150)); d.ellipse([*r(rx-104,456),*r(rx-66,492)],fill=POR)   # arm+gauntlet
    hcx,hcy=r(rx+2,316); hs=2.0*RS
    helmP=[(-8,-52),(10,-50),(26,-34),(34,-16),(40,2),(34,18),(20,34),(6,46),(-8,48),(-24,34),(-36,10),(-40,-16),(-30,-42)]
    d.polygon([(hcx+x*hs,hcy+y*hs) for (x,y) in helmP],fill=POR)
    # blade upright
    btl=r(rx-92,150); bbl=r(rx-92,540); bw=24*RS; bx=btl[0]
    d.polygon([(bx-bw,btl[1]),(bx+bw,btl[1]),(bx+bw,bbl[1]),(bx-bw,bbl[1])],fill=(30,30,38,255)); d.polygon([(bx-bw,btl[1]),(bx-bw+8,btl[1]),(bx-bw+8,bbl[1]),(bx-bw,bbl[1])],fill=POR)
    d.line([(bx+bw,btl[1]),(bx+bw,bbl[1])],fill=STEEL_D+(220,),width=3)
    d.polygon([r(rx-60,500),r(rx+108,496),r(rx+98,534),r(rx-70,538)],fill=(34,34,44,255))                 # docking plate
    slity=[hcy-12*RS,hcy+16*RS]
    for sy in slity:
        g=Image.new("RGBA",(W,H),(0,0,0,0)); ImageDraw.Draw(g).rounded_rectangle([hcx-40,sy-6,hcx+40,sy+6],radius=6,fill=(143,0,255,255)); VGL.append(g.filter(ImageFilter.GaussianBlur(5)))
    for s in SH: img=Image.alpha_composite(img.convert("RGBA"),s).convert("RGB")
    # ===== LIGHTING PASS (low-key cool directional) =====
    arr=np.asarray(img).astype(np.float32); yy,xx=np.mgrid[0:H,0:W]
    Lx=1.0-(xx/W-0.32)*0.40-(yy/H-0.20)*0.16; Lx=np.clip(Lx,0.64,1.16)[...,None]; arr=arr*Lx
    sh=np.clip(1.0-arr.mean(2,keepdims=True)/120,0,1); arr[...,2]+=sh[...,0]*7; arr[...,0]-=sh[...,0]*3
    img=Image.fromarray(np.clip(arr,0,255).astype(np.uint8)); d=ImageDraw.Draw(img,"RGBA")
    # rim light (cool) on right/back contours
    rl=(150,160,192)
    d.line([(cx+340,492),(cx+430,540)],fill=rl+(150,),width=3)           # croup rim
    d.line([(cx+430,540),(cx+420,700)],fill=rl+(120,),width=3)           # haunch rim
    d.line([r(rx+34,374),r(rx+40,486)],fill=rl+(150,),width=2)           # rider chest right rim
    d.line([(hcx+40*hs*0.0+ (hcx+ -8*hs), hcy-52*hs)],fill=rl+(0,),width=1) if False else None
    # ===== violet accents on top =====
    for g in VGL: img=Image.alpha_composite(img.convert("RGBA"),g).convert("RGB")
    d=ImageDraw.Draw(img,"RGBA")
    for sy in slity:
        d.rounded_rectangle([hcx-38,sy-4,hcx+38,sy+4],radius=4,fill=(150,0,255,255)); d.rounded_rectangle([hcx-38,sy-2,hcx+38,sy+2],radius=2,fill=(225,185,255,255))
    d.line([(hx-92*sc,hyy+11*sc),(hx-48*sc,hyy+2*sc)],fill=(210,170,255,255),width=2)  # steed sensor core
    # ash, vignette, grain, frame
    for _ in range(110):
        x=rng.uniform(0,W); y=rng.uniform(H*0.30,gy+90); s=rng.uniform(1,3.0); d.ellipse([x-s,y-s,x+s,y+s],fill=(220,218,222,int(rng.uniform(20,68))))
    vig=Image.new("L",(W,H),0); ImageDraw.Draw(vig).ellipse([-W*0.18,-H*0.18,W*1.18,H*1.18],fill=255); vig=vig.filter(ImageFilter.GaussianBlur(240))
    img=Image.composite(img,Image.new("RGB",(W,H),VOID),vig)
    arr=np.asarray(img).astype(np.int16); g=rng.normal(0,4.4,(H,W,1)).repeat(3,axis=2).astype(np.int16)
    img=Image.fromarray(np.clip(arr+g,0,255).astype(np.uint8))
    ImageDraw.Draw(img,"RGBA").rectangle([22,22,W-22,H-22],outline=(80,78,86,140),width=2)
    return img
render().save("/sessions/exciting-eloquent-dijkstra/mnt/outputs/MIKAGE_HERO_MOUNT_V0_1.png")
Image.open("/sessions/exciting-eloquent-dijkstra/mnt/outputs/MIKAGE_HERO_MOUNT_V0_1.png").resize((1600,900),Image.LANCZOS).save("/sessions/exciting-eloquent-dijkstra/mnt/outputs/HM_prev.png")
print("done")
