import numpy as np, random, math
from PIL import Image, ImageDraw, ImageFilter
from scipy.ndimage import gaussian_filter, shift as ndshift, distance_transform_edt
from scipy.spatial import cKDTree
N=np.random.default_rng(7)
W,H=2400,1350; S=2
OUT='src/assets/'
yy,xx=np.mgrid[0:H,0:W]
def grad(stops,h):
    ys=np.linspace(0,1,h); out=np.zeros((h,3))
    for c in range(3): out[:,c]=np.interp(ys,[s[0] for s in stops],[s[1][c] for s in stops])
    return out
def smooth_noise(h,w,sy,sx,seed):
    r=np.random.default_rng(seed); n=gaussian_filter(r.standard_normal((h//4+1,w//4+1)),(sy/4,sx/4))
    n=(n-n.min())/(n.max()-n.min()); return np.array(Image.fromarray((n*255).astype(np.uint8)).resize((w,h),Image.BICUBIC))/255.
# ---------------- SKY ----------------
sx_,sy_=W*.64,H*.50
sky=np.zeros((H,W,3)); sky[:]=grad([(0,(2,12,10)),(.25,(4,32,34)),(.45,(10,86,104)),(.56,(30,150,170)),(.64,(140,214,205)),(.70,(60,150,140)),(1,(6,30,26))],H)[:,None,:]
d=np.sqrt(((xx-sx_)/W)**2+((yy-sy_)/H*1.2)**2)
sky+=(np.exp(-(d/.06)**2)+np.exp(-(d/.2)**2)*.6+np.exp(-(d/.5)**2)*.25)[...,None]*np.array([210,240,190])*.5
sky+=np.exp(-(d/.016)**4)[...,None]*np.array([255,252,230])
sky+=np.exp(-((xx/W-.1)/.4)**2-((yy/H-.12)/.3)**2)[...,None]*np.array([0,80,140])*.4
cl=smooth_noise(H,W,60,260,1); band=np.exp(-((yy/H-.42)/.18)**2)
sky+=((cl-.5).clip(0,1)*band*2*110)[...,None]*np.array([.65,1,1])
cl2=smooth_noise(H,W,30,180,2); sky*= (1-.25*(cl2-.5).clip(0,1)*np.exp(-((yy/H-.3)/.25)**2))[...,None]
Image.fromarray(np.clip(sky,0,255).astype(np.uint8)).save(OUT+'hero-sky.jpg',quality=80,optimize=True,progressive=True)
# ---------------- tree layer machinery ----------------
def leafy_crown(dr,cx,cy,r,rr,flat=.5,n=260):
    for _ in range(n):
        a=rr.uniform(0,math.tau); u=rr.random()**.55
        # umbrella: wider at top half, flatter bottom
        px=cx+math.cos(a)*u*r; py=cy+math.sin(a)*u*r*flat*(1 if math.sin(a)<0 else .55)
        s=rr.uniform(.05,.13)*r
        dr.ellipse((px-s*1.2,py-s*.8,px+s*1.2,py+s*.8),fill=255)
def trunk(dr,x,y0,y1,w,rr,lean=0,branches=True):
    pts=[]
    n=14
    for i in range(n+1):
        t=i/n; pts.append((x+lean*t+math.sin(t*3+x)*w*.25, y0+(y1-y0)*t, w*(.55+.45*t)))
    L=[(px-pw/2,py) for px,py,pw in pts]; Rr=[(px+pw/2,py) for px,py,pw in pts][::-1]
    dr.polygon(L+Rr,fill=255)
    # branches
    for _ in range(rr.randint(2,4) if branches else 0):
        t=rr.uniform(.05,.35); bx,by,_w=pts[int(t*n)]; ang=rr.uniform(-1.2,-.4) if rr.random()<.5 else rr.uniform(-2.7,-1.95)
        ln=w*rr.uniform(6,12); dr.line([(bx,by),(bx+math.cos(ang)*ln,by+math.sin(ang)*ln)],fill=255,width=max(2,int(w*.28)))
def tree_mask(seed,y_ground,count,rmin,rmax,ytop,emergent=0,blur=0):
    rr=random.Random(seed); im=Image.new('L',(W*S,H*S),0); dr=ImageDraw.Draw(im)
    xs=sorted(rr.uniform(-.05,1.05)*W*S for _ in range(count))
    for x in xs:
        r=rr.uniform(rmin,rmax)*S; cy=rr.uniform(*ytop)*H*S
        trunk(dr,x,cy,y_ground*H*S+80*S,r*.07,rr,lean=rr.uniform(-12,12)*S,branches=False); leafy_crown(dr,x,cy,r,rr)
    for _ in range(emergent):
        x=rr.uniform(.08,.92)*W*S; r=rr.uniform(230,310)*S; cy=rr.uniform(.22,.34)*H*S
        trunk(dr,x,cy,y_ground*H*S+80*S,r*.06,rr,lean=rr.uniform(-14,14)*S,branches=False); leafy_crown(dr,x,cy,r,rr,flat=.5,n=420)
    dr.rectangle((0,y_ground*H*S,W*S,H*S),fill=255)
    im=im.resize((W,H),Image.LANCZOS)
    if blur: im=im.filter(ImageFilter.GaussianBlur(blur))
    return np.array(im)/255.
def shade(mask,base,rim,rim_k=7,rim_str=1.0,tex_seed=0,tex=.35,fog=None):
    # rim light facing the sun
    left=ndshift(mask,(-rim_k*.7,rim_k),order=1,mode='nearest')   # light from upper-right -> look at pixel up-right
    right=ndshift(mask,(-rim_k*.7,-rim_k),order=1,mode='nearest') # from upper-left
    use_left=(xx<sx_)[...]
    nb=np.where(use_left,left,right)
    edge=np.clip(mask-nb,0,1)
    edge=gaussian_filter(edge,1.4)
    tx=smooth_noise(H,W,3,3,tex_seed)-.5
    col=np.zeros((H,W,3)); col[:]=np.array(base)
    col+= (tx*tex*60)[...,None]*np.array([.3,1,.8])
    # vertical gradient inside the layer (lighter high up = sky bounce)
    vg=np.clip(1-yy/H*1.1,0,1)[...,None]*np.array([6,26,26])
    col+=vg
    col+= (edge*rim_str)[...,None]*np.array(rim)
    if fog is not None: col=col*(1-fog[...,None])+fog[...,None]*np.array([70,160,160])
    a=np.dstack([np.clip(col,0,255),np.clip(mask,0,1)*255]).astype(np.uint8)
    return Image.fromarray(a,'RGBA')
def save(img,name,q=72): img.save(OUT+name,quality=q,method=6)
# FAR
ridge=(.60+ (lambda f:f)(0)*0)*H
def fractal(n,oct=6,seed=0):
    r=np.random.default_rng(seed); x=np.zeros(n)
    for o in range(oct):
        k=max(2,int(3*2**o)); x+=np.interp(np.linspace(0,k,n),np.arange(k+1),r.standard_normal(k+1)/(1.9**o))
    return x
rg=(.61+fractal(W,6,4)*.05)*H
mask_far=np.zeros((H,W)); mask_far[yy>=rg[None,:]]=1
mask_far=np.maximum(mask_far,tree_mask(11,.70,95,38,80,(.585,.64),blur=0))
mask_far=gaussian_filter(mask_far,2.0)
fogf=np.clip((yy/H-.55)/.3,0,1)*.5+.25
save(shade(mask_far,(16,74,76),(130,215,205),rim_k=4,rim_str=.55,tex_seed=3,tex=.2,fog=fogf),'hero-far.webp',68)
# MID
mask_mid=tree_mask(21,.80,46,70,140,(.50,.70),emergent=3,blur=0)
mask_mid=gaussian_filter(mask_mid,.9)
fogm=np.clip(1-(yy/H-.35)/.5,0,1)*.15+np.exp(-((yy/H-.80)/.07)**2)*.62
save(shade(mask_mid,(5,40,34),(90,200,180),rim_k=6,rim_str=.65,tex_seed=5,tex=.3,fog=fogm),'hero-mid.webp',72)
# NEAR
rr=random.Random(33); im=Image.new('L',(W*S,H*S),0); dr=ImageDraw.Draw(im)
for x,w,lean in [(.035,.085,.012),(.14,.032,-.012),(.945,.095,-.014),(.855,.03,.01)]:
    trunk(dr,x*W*S,-20,H*S+20,w*W*S,rr,lean=lean*W*S,branches=False)
def frond(dr,x,y,ang,length):
    pts=[(x+math.cos(ang)*length*t, y+math.sin(ang)*length*t+(t**2)*length*.38) for t in [i/32 for i in range(33)]]
    dr.line(pts,fill=255,width=int(9*S))
    for i in range(3,31):
        px,py=pts[i]; t=i/32; ll=length*.2*(1-abs(t-.42)*1.2)
        for side in (-1,1):
            la=ang+side*(1.05-.5*t)+ (0.55 if side>0 else -0.55)*.0
            ex,ey=px+math.cos(la)*ll,py+math.sin(la)*ll+ll*.38
            dr.polygon([(px,py-5*S),(ex,ey),(px,py+5*S)],fill=255)
for (x,y,a,l) in [(-.01,1.03,-0.9,.36),(.03,1.03,-.45,.32),(.11,1.04,-1.3,.22),(.19,1.04,-.15,.3),(1.01,1.03,-math.pi+.9,.36),(.97,1.03,-math.pi+.45,.32),(.89,1.04,-math.pi+1.3,.22),(.8,1.04,-math.pi+.15,.28),(.5,1.08,-1.57,.18),(.63,1.07,-1.15,.22),(.37,1.07,-1.95,.22)]:
    frond(dr,x*W*S,y*H*S,a,l*W*S)
for _ in range(70):
    x=rr.uniform(0,W*S); y=H*S*rr.uniform(.97,1.05); r_=rr.uniform(50,120)*S
    dr.ellipse((x-r_*1.3,y-r_,x+r_*1.3,y+r_*.7),fill=255)
m=np.array(im.resize((W,H),Image.LANCZOS))/255.; m=gaussian_filter(m,1.2)
save(shade(m,(2,14,12),(70,170,160),rim_k=6,rim_str=.8,tex_seed=8,tex=.15),'hero-near.webp',74)
# RAYS
rays=np.zeros((H,W))
rr2=random.Random(4); th=np.arctan2(yy-sy_,xx-sx_); dist=np.sqrt((xx-sx_)**2+(yy-sy_)**2)
for k in range(14):
    target=math.radians(rr2.uniform(20,160)); wd=rr2.uniform(.012,.05)
    rays+=np.exp(-((th-target)/wd)**2)*rr2.uniform(.2,.7)
rays*=np.exp(-dist/(W*.9)); rays=gaussian_filter(rays,5)
a=np.zeros((H,W,4),np.uint8); a[...,0]=200;a[...,1]=245;a[...,2]=230; a[...,3]=(rays*255*.5).clip(0,255)
Image.fromarray(a,'RGBA').save(OUT+'hero-rays.webp',quality=60,method=6)
# ---------------- Voronoi canopy ----------------
def canopy(w,h,seed,sites=1100,dark=1.0):
    r=np.random.default_rng(seed); pts=np.column_stack([r.uniform(0,w,sites),r.uniform(0,h,sites)])
    gy,gx=np.mgrid[0:h,0:w]; tree=cKDTree(pts)
    d,idx=tree.query(np.column_stack([gx.ravel(),gy.ravel()]),k=2)
    d1=d[:,0].reshape(h,w); d2=d[:,1].reshape(h,w); i1=idx[:,0].reshape(h,w)
    dome=np.clip(1-d1/(d1+d2)*2,0,1)           # 1 at site center -> 0 at boundary
    edge=np.clip((d2-d1)/(w/55),0,1)           # boundary darkening
    hue=r.uniform(0,1,sites)[i1]; lum=r.uniform(.55,1.2,sites)[i1]
    tex=smooth_noise(h,w,1.2,1.2,seed+1)-.5; tex2=smooth_noise(h,w,4,4,seed+2)-.5
    L=(.45+.75*dome**.8)*edge**.5*lum*dark*1.7
    img=np.zeros((h,w,3))
    img[...,0]=(6+14*hue)*L*1.6+tex*20*L
    img[...,1]=(55+45*hue)*L*1.5+tex*70*L+tex2*30*L
    img[...,2]=(34+30*(1-hue))*L*1.4+tex*30*L
    return img
cw,ch=1600,1000
c=canopy(cw,ch,5)
v=np.clip(1-(((np.mgrid[0:ch,0:cw][1]/cw-.5)**2+(np.mgrid[0:ch,0:cw][0]/ch-.5)**2)*1.3),.3,1)[...,None]
c=c*v; c[...,2]+=np.clip(1-v[...,0],0,1)*16
Image.fromarray(c.clip(0,255).astype(np.uint8)).save(OUT+'scene-canopy.webp',quality=72,method=6)
# river
base=canopy(cw,ch,9,dark=.9)
t=np.linspace(0,1,1500); cx=cw*(.5+.27*np.sin(t*5.0+.5)+.05*np.sin(t*16)); cy=ch*(-.05+1.1*t)
rv=Image.new('L',(cw,ch),0); d2_=ImageDraw.Draw(rv); wid=(52+26*np.sin(t*7)**2)
for i in range(len(t)-1): d2_.ellipse((cx[i]-wid[i]/2,cy[i]-wid[i]/2,cx[i]+wid[i]/2,cy[i]+wid[i]/2),fill=255)
rv=rv.filter(ImageFilter.GaussianBlur(1.6)); rm=np.array(rv)/255.
dist_in=distance_transform_edt(rm>.5); dist_in=dist_in/dist_in.max()
gy,gx=np.mgrid[0:ch,0:cw]
water=np.zeros((ch,cw,3)); depth=np.clip(dist_in*3.2,0,1)
water[...,0]=6+10*(1-depth); water[...,1]=70+90*(1-depth)*.8+40*(gy/ch); water[...,2]=120+110*(1-depth)*.8+40*(gy/ch)
fl=gaussian_filter(np.random.default_rng(3).standard_normal((ch,cw)),(1,12)); fl=(fl-fl.min())/(fl.max()-fl.min())
water+=(fl[...,None]-.5)*90*np.array([0,.7,1])
water+=np.exp(-((gx/cw-.6)**2+(gy/ch-.3)**2)/.04)[...,None]*np.array([110,190,230])*.45
bank=gaussian_filter(rm,12)
out=base*(1-rm[...,None])+water*rm[...,None]
out*=(1-.45*np.clip(bank-rm,0,1)*2)[...,None]
out*=v
Image.fromarray(out.clip(0,255).astype(np.uint8)).save(OUT+'scene-water.webp',quality=72,method=6)
# preview
comp=Image.open(OUT+'hero-sky.jpg').convert('RGBA')
for n in ('far','mid','near'): comp=Image.alpha_composite(comp,Image.open(OUT+f'hero-{n}.webp').convert('RGBA'))
comp=Image.alpha_composite(comp,Image.open(OUT+'hero-rays.webp').convert('RGBA'))
comp.convert('RGB').resize((1200,675)).save('/tmp/hero-preview.jpg',quality=85)
a=Image.open(OUT+'scene-canopy.webp').resize((600,375)); b=Image.open(OUT+'scene-water.webp').resize((600,375))
s=Image.new('RGB',(1200,375)); s.paste(a,(0,0)); s.paste(b,(600,0)); s.save('/tmp/scenes2.jpg'); print('ok')
