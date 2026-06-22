import math, numpy as np, sys
from PIL import Image, ImageDraw, ImageFilter
W,H=2400,1350
VOID=(5,5,8); STEEL=(140,140,148); STEEL_D=(92,92,100); DARK=(16,16,22); MID=(30,30,38)
rng=np.random.default_rng(515)
def render():
    gy=int(H*0.80)
    grad=np.zeros((H,W,3),np.uint8)
    for y in range(H): t=y/H; grad[y,:]=(5+int(7*t),5+int(7*t),9+int(11*t))
    img=Image.fromarray(grad); d=ImageDraw.Draw(img,"RGBA")
    # ground + fog
    fog=Image.new("L",(W,H),0); ImageDraw.Draw(fog).rectangle([0,gy-260,W,gy+60],fill=130); fog=fog.filter(ImageFilter.GaussianBlur(90))
    img=Image.composite(Image.new("RGB",(W,H),(16,16,22)),img,fog); d=ImageDraw.Draw(img,"RGBA")
    d.rectangle([0,gy,W,H],fill=(7,7,11,255)); d.line([(0,gy),(W,gy)],fill=(30,30,40,140),width=2)
    cx=W*0.50
    def seg(p0,p1,w,col): d.line([p0,p1],fill=col+(255,),width=w)
    def joint(x,y,r,c=STEEL): d.ellipse([x-r,y-r,x+r,y+r],fill=c+(255,)); d.ellipse([x-r*0.4,y-r*0.4,x+r*0.4,y+r*0.4],fill=(36,36,46,255))
    def piston(p0,p1):  # cylinder + rod
        mx,my=( (p0[0]+p1[0])/2,(p0[1]+p1[1])/2 )
        seg(p0,(mx,my),11,STEEL_D); seg((mx,my),p1,6,STEEL)
    def hoof(fx,sh=True):
        if sh:
            s=Image.new("RGBA",(W,H),(0,0,0,0)); ImageDraw.Draw(s).ellipse([fx-46,gy-8,fx+46,gy+18],fill=(0,0,0,150)); s=s.filter(ImageFilter.GaussianBlur(12)); GLOWS.append(s)
        d.polygon([(fx-15,gy-34),(fx+15,gy-34),(fx+7,gy+4),(fx-7,gy+4)],fill=(18,18,24,255))
        d.line([(fx-15,gy-34),(fx-15,gy+2)],fill=STEEL_D+(180,),width=2)
    GLOWS=[]
    # ---- FAR legs (lighter) ----
    cf=(26,26,34)
    # far foreleg
    seg((cx-300,700),(cx-318,866),16,cf); joint(cx-318,866,12,STEEL_D); piston((cx-318,866),(cx-300,gy)); hoof(cx-300,False)
    # far hindleg (zigzag)
    seg((cx+330,712),(cx+372,852),16,cf); joint(cx+372,852,12,STEEL_D); seg((cx+372,852),(cx+330,946),12,cf); joint(cx+330,946,10,STEEL_D); piston((cx+330,946),(cx+356,gy)); hoof(cx+356,False)
    # ---- BODY: high inboard masses + spine truss ----
    # spine truss beam
    seg((cx-300,548),(cx+330,540),12,MID)
    for x in range(int(cx-280),int(cx+320),70): seg((x,540),(x+34,592),4,STEEL_D)  # truss diagonals
    # shoulder/chest engine mass (high)
    d.polygon([(cx-360,556),(cx-300,500),(cx-180,506),(cx-150,612),(cx-220,712),(cx-340,700)],fill=DARK)
    d.line([(cx-300,500),(cx-180,506)],fill=STEEL_D+(150,),width=3)
    # hindquarter engine mass (high, biggest)
    d.polygon([(cx+170,520),(cx+300,498),(cx+400,540),(cx+410,690),(cx+320,742),(cx+190,720)],fill=DARK)
    d.line([(cx+300,498),(cx+400,540)],fill=STEEL_D+(150,),width=3)
    d.line([(cx+360,560),(cx+372,700)],fill=(50,50,62,150),width=2)
    # underframe (light strut belly)
    seg((cx-200,700),(cx+200,706),7,STEEL_D)
    # exhaust stack hind
    for k in range(3): seg((cx+380,512+k*16),(cx+452,498+k*20),4,(60,60,72))
    # ---- NECK arch (segmented vertebrae) + HEAD equine mechanical ----
    neck=[(cx-300,540),(cx-360,486),(cx-452,512),(cx-520,604)]
    for i in range(len(neck)-1): seg(neck[i],neck[i+1],16,MID)
    for p in neck[1:]: joint(p[0],p[1],10,STEEL_D)
    # head: elongated wedge, mechanical, on neck end
    hx,hyy=cx-540,624
    d.polygon([(hx+24,hyy-44),(hx-30,hyy-34),(hx-92,hyy+6),(hx-104,hyy+40),(hx-70,hyy+56),(hx-6,hyy+44),(hx+24,hyy+6)],fill=(120,120,128,255))
    d.polygon([(hx+24,hyy-44),(hx-30,hyy-34),(hx-60,hyy+2),(hx+10,hyy-8)],fill=STEEL_D+(255,))  # cheek shade
    # ears / antennae
    seg((hx-6,hyy-40),(hx-18,hyy-92),5,STEEL_D); seg((hx+16,hyy-36),(hx+30,hyy-86),5,STEEL_D)
    # sensor slit eye (grayscale only)
    d.line([(hx-86,hyy+8),(hx-44,hyy+2)],fill=(40,40,50,255),width=6)
    d.line([(hx-86,hyy+8),(hx-44,hyy+2)],fill=(180,180,190,255),width=2)
    # ---- NEAR legs (darker, articulated) ----
    cn=(15,15,21)
    # near foreleg (stepping slightly forward)
    seg((cx-280,712),(cx-260,876),20,cn); joint(cx-260,876,14,STEEL); piston((cx-260,876),(cx-238,gy)); hoof(cx-238)
    seg((cx-280,712),(cx-260,876),20,cn)
    # knee cap + shank detail
    d.line([(cx-300,720),(cx-280,860)],fill=STEEL_D+(140,),width=3)
    # near hindleg (strong zigzag, weighted)
    seg((cx+300,720),(cx+352,858),20,cn); joint(cx+352,858,14,STEEL); seg((cx+352,858),(cx+300,952),16,cn); joint(cx+300,952,12,STEEL); piston((cx+300,952),(cx+330,gy)); hoof(cx+330)
    d.line([(cx+330,730),(cx+360,852)],fill=STEEL_D+(140,),width=3)
    # tail = cable bundle
    for k in range(4): seg((cx+400,600+k*8),(cx+470,720+k*30),3,(40,40,50))
    for g in GLOWS: img=Image.alpha_composite(img.convert("RGBA"),g).convert("RGB")
    d=ImageDraw.Draw(img,"RGBA")
    # rider seat hint (empty saddle block, NO full rider this pass)
    d.polygon([(cx-40,508),(cx+90,506),(cx+70,560),(cx-30,560)],fill=(20,20,28,255))
    # ash
    for _ in range(130):
        x=rng.uniform(0,W); y=rng.uniform(H*0.28,gy+90); s=rng.uniform(1,3.2)
        d.ellipse([x-s,y-s,x+s,y+s],fill=(220,218,222,int(rng.uniform(22,80))))
    vig=Image.new("L",(W,H),0); ImageDraw.Draw(vig).ellipse([-W*0.18,-H*0.18,W*1.18,H*1.18],fill=255); vig=vig.filter(ImageFilter.GaussianBlur(240))
    img=Image.composite(img,Image.new("RGB",(W,H),VOID),vig)
    arr=np.asarray(img).astype(np.int16); g=rng.normal(0,4.6,(H,W,1)).repeat(3,axis=2).astype(np.int16)
    img=Image.fromarray(np.clip(arr+g,0,255).astype(np.uint8))
    ImageDraw.Draw(img,"RGBA").rectangle([22,22,W-22,H-22],outline=(80,78,86,140),width=2)
    return img
render().save("/sessions/exciting-eloquent-dijkstra/mnt/outputs/MIKAGE_STEED_SKELETON_BW_V0_3.png")
Image.open("/sessions/exciting-eloquent-dijkstra/mnt/outputs/MIKAGE_STEED_SKELETON_BW_V0_3.png").resize((1600,900),Image.LANCZOS).save("/sessions/exciting-eloquent-dijkstra/mnt/outputs/ST3_prev.png")
print("done")
