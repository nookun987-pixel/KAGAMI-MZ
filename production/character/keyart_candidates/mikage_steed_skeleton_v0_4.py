import math, numpy as np
from PIL import Image, ImageDraw, ImageFilter
W,H=2400,1350
VOID=(5,5,8); STEEL=(146,146,154); STEEL_D=(92,92,100); BODY=(16,16,22); HUMP=(22,22,30)
rng=np.random.default_rng(808)
def render():
    gy=int(H*0.80)
    grad=np.zeros((H,W,3),np.uint8)
    for y in range(H): t=y/H; grad[y,:]=(5+int(7*t),5+int(7*t),9+int(11*t))
    img=Image.fromarray(grad); d=ImageDraw.Draw(img,"RGBA")
    fog=Image.new("L",(W,H),0); ImageDraw.Draw(fog).rectangle([0,gy-240,W,gy+60],fill=130); fog=fog.filter(ImageFilter.GaussianBlur(90))
    img=Image.composite(Image.new("RGB",(W,H),(16,16,22)),img,fog); d=ImageDraw.Draw(img,"RGBA")
    d.rectangle([0,gy,W,H],fill=(7,7,11,255)); d.line([(0,gy),(W,gy)],fill=(30,30,40,140),width=2)
    GL=[]
    def seg(p0,p1,w,c): d.line([p0,p1],fill=c+(255,),width=w)
    def joint(x,y,r,c=STEEL): d.ellipse([x-r,y-r,x+r,y+r],fill=c+(255,)); d.ellipse([x-r*0.4,y-r*0.4,x+r*0.4,y+r*0.4],fill=(34,34,44,255))
    def hoof(fx,big=1.0,near=True):
        s=Image.new("RGBA",(W,H),(0,0,0,0)); ImageDraw.Draw(s).ellipse([fx-58*big,gy-6,fx+58*big,gy+22],fill=(0,0,0,160 if near else 110)); s=s.filter(ImageFilter.GaussianBlur(13)); GL.append(s)
        w=20*big; d.polygon([(fx-w,gy-40),(fx+w,gy-40),(fx+w*0.6,gy+6),(fx-w*0.6,gy+6)],fill=(20,20,26,255))
        d.line([(fx-w,gy-40),(fx-w*0.6,gy+6)],fill=STEEL_D+(200,),width=3)
    def legF(x,col,ec,near):  # foreleg (fairly straight, knee)
        kx,ky=x-6,876
        seg((x,706),(kx,ky),24 if near else 19,col); joint(kx,ky,15 if near else 12,ec)
        seg((kx,ky),(x-2,gy-40),16 if near else 13,col)  # cannon
        d.line([(kx-10,ky+8),(kx-14,gy-50)],fill=STEEL_D+(150,),width=4)  # piston rod
    def legH(x,col,ec,near):  # hindleg zigzag (stifle, hock)
        sx,sy=x+44,852; hx,hy=x-2,956
        seg((x,712),(sx,sy),24 if near else 19,col); joint(sx,sy,15 if near else 12,ec)
        seg((sx,sy),(hx,hy),18 if near else 14,col); joint(hx,hy,13 if near else 11,ec)
        seg((hx,hy),(hx+20,gy-40),15 if near else 12,col)
        d.line([(hx+6,hy+6),(hx+24,gy-50)],fill=STEEL_D+(150,),width=4)
    cx=W*0.50
    # ===== FAR legs (lighter), with stride offset =====
    legF(cx-210, (28,28,36), STEEL_D, False)   # far fore set BACK (toward rear)
    legH(cx+250, (28,28,36), STEEL_D, False)   # far hind set FORWARD
    hoof(cx-210,1.0,False); hoof(cx+270,1.0,False)
    # ===== UNIFIED CHASSIS (one body, gentle arched spine, deep belly keel) =====
    top=[(cx-470,612),(cx-360,500),(cx-230,486),(cx-120,512),(cx+40,520),(cx+200,498),(cx+340,492),(cx+430,540)]  # head-base->withers->dip->croup->tail
    bot=[(cx+430,540),(cx+420,700),(cx+300,756),(cx+120,776),(cx-110,766),(cx-300,724),(cx-360,660)]
    d.polygon(top+bot,fill=BODY)
    # withers + croup engine humps (raised masses on top, inboard)
    d.polygon([(cx-260,492),(cx-150,452),(cx-30,470),(cx-40,560),(cx-230,560)],fill=HUMP)  # withers/shoulder mass
    d.line([(cx-260,492),(cx-150,452),(cx-30,470)],fill=STEEL_D+(150,),width=3)
    d.polygon([(cx+150,470),(cx+280,452),(cx+380,498),(cx+360,580),(cx+150,576)],fill=HUMP)  # croup/hip mass
    d.line([(cx+150,470),(cx+280,452),(cx+380,498)],fill=STEEL_D+(150,),width=3)
    # belly keel + ribcage struts (unify body)
    seg((cx-300,724),(cx+300,748),9,STEEL_D)
    for x in range(int(cx-200),int(cx+240),64): d.line([(x,540),(x,720)],fill=(40,40,52,120),width=3)
    # spine ridge line (gentle curve)
    d.line([(cx-360,500),(cx-120,512),(cx+40,520),(cx+200,498),(cx+340,492)],fill=STEEL_D+(140,),width=3)
    # ===== NECK (thick base, 3 joints) + HEAD (mechanical equine, +20%, dark metal) =====
    seg((cx-300,520),(cx-420,486),30,BODY)            # thick neck base
    seg((cx-420,486),(cx-520,520),24,BODY); joint(cx-420,486,13,STEEL_D)
    seg((cx-520,520),(cx-580,600),20,BODY); joint(cx-520,520,12,STEEL_D)
    hx,hyy=cx-600,634; sc=1.2
    head=[(hx+40*sc,hyy-58*sc),(hx-30*sc,hyy-46*sc),(hx-104*sc,hyy-6*sc),(hx-118*sc,hyy+34*sc),(hx-78*sc,hyy+58*sc),(hx-6*sc,hyy+52*sc),(hx+34*sc,hyy+6*sc)]
    d.polygon(head,fill=(26,26,34,255))                # dark metal head
    d.polygon([(hx+40*sc,hyy-58*sc),(hx-30*sc,hyy-46*sc),(hx-60*sc,hyy-2*sc),(hx+14*sc,hyy-12*sc)],fill=STEEL_D+(255,))  # forehead plane
    d.line([(hx-104*sc,hyy-6*sc),(hx-118*sc,hyy+34*sc)],fill=STEEL_D+(180,),width=3)  # muzzle edge
    d.line([(hx-30*sc,hyy+40*sc),(hx-78*sc,hyy+58*sc)],fill=(50,50,62,200),width=3)   # lower jaw
    seg((hx-6*sc,hyy-52*sc),(hx-20*sc,hyy-104*sc),6,STEEL_D); seg((hx+20*sc,hyy-46*sc),(hx+34*sc,hyy-100*sc),6,STEEL_D)  # ears
    d.line([(hx-96*sc,hyy+12*sc),(hx-44*sc,hyy+2*sc)],fill=(40,40,50,255),width=8)    # sensor slit inset
    d.line([(hx-92*sc,hyy+11*sc),(hx-48*sc,hyy+2*sc)],fill=(170,170,182,255),width=3)
    # ===== NEAR legs (darker), stride =====
    legF(cx-150, BODY, STEEL, True)    # near fore under shoulder
    legH(cx+330, BODY, STEEL, True)    # near hind weight-bearing under hip
    hoof(cx-150,1.35,True); hoof(cx+350,1.35,True)
    # docking plate (flat, low) on back dip
    d.polygon([(cx-30,512),(cx+130,508),(cx+120,546),(cx-40,550)],fill=(34,34,44,255))
    d.line([(cx-30,512),(cx+130,508)],fill=STEEL_D+(160,),width=2)
    # single structured cable-tail
    seg((cx+426,560),(cx+500,660),8,(46,46,58)); seg((cx+500,660),(cx+520,760),5,(40,40,50))
    for g in GL: img=Image.alpha_composite(img.convert("RGBA"),g).convert("RGB")
    d=ImageDraw.Draw(img,"RGBA")
    for _ in range(120):
        x=rng.uniform(0,W); y=rng.uniform(H*0.30,gy+90); s=rng.uniform(1,3.0)
        d.ellipse([x-s,y-s,x+s,y+s],fill=(220,218,222,int(rng.uniform(20,74))))
    vig=Image.new("L",(W,H),0); ImageDraw.Draw(vig).ellipse([-W*0.18,-H*0.18,W*1.18,H*1.18],fill=255); vig=vig.filter(ImageFilter.GaussianBlur(240))
    img=Image.composite(img,Image.new("RGB",(W,H),VOID),vig)
    arr=np.asarray(img).astype(np.int16); g=rng.normal(0,4.6,(H,W,1)).repeat(3,axis=2).astype(np.int16)
    img=Image.fromarray(np.clip(arr+g,0,255).astype(np.uint8))
    ImageDraw.Draw(img,"RGBA").rectangle([22,22,W-22,H-22],outline=(80,78,86,140),width=2)
    return img
render().save("/sessions/exciting-eloquent-dijkstra/mnt/outputs/MIKAGE_STEED_SKELETON_BW_V0_4.png")
Image.open("/sessions/exciting-eloquent-dijkstra/mnt/outputs/MIKAGE_STEED_SKELETON_BW_V0_4.png").resize((1600,900),Image.LANCZOS).save("/sessions/exciting-eloquent-dijkstra/mnt/outputs/ST4_prev.png")
print("done")
