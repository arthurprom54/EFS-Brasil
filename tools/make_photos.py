"""Processa as fotos reais fornecidas em assets web (grade, vinheta, grão)."""
import numpy as np
from PIL import Image, ImageFilter, ImageEnhance
SRC='/tmp/p/'; OUT='src/assets/'
W,H=2000,1125
crops={ # nome: (arquivo, caixa 16:9 na foto original)
 'canopy':('canopy',(0,0,736,414)),
 'macaws':('macaws',(0,0,736,413)),
 'jaguar':('jaguar',(0,50,640,410)),
 'canoe':('canoe',(0,150,735,563)),
 'river':('river',(0,420,736,834)),
}
rng=np.random.default_rng(7)
for name,(f,box) in crops.items():
    im=Image.open(SRC+f+'.png').crop(box).resize((W,H),Image.LANCZOS)
    im=im.filter(ImageFilter.UnsharpMask(2,60,2))
    im=ImageEnhance.Contrast(im).enhance(1.08); im=ImageEnhance.Color(im).enhance(1.04)
    a=np.asarray(im).astype('float32')/255
    a=a*np.array([1.03,1.0,0.95])  # tom quente
    yy,xx=np.mgrid[0:H,0:W]; r=np.hypot((xx-W/2)/(W/2),(yy-H/2)/(H/2))
    a*= (1-0.38*np.clip(r-.45,0,1)**1.6)[...,None]
    a+= rng.normal(0,0.018,(H,W,1))
    out=Image.fromarray((np.clip(a,0,1)*255).astype('uint8'))
    out.save(f'{OUT}photo-{name}.webp',quality=72,method=6)
    if name=='canopy': out.save(f'{OUT}photo-canopy.jpg',quality=74,optimize=True,progressive=True)
