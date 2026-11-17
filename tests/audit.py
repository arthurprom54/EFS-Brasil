import re, os, glob, html, json, collections
from html.parser import HTMLParser
ROOT='site'; files=sorted(glob.glob(ROOT+'/**/*.html',recursive=True)); issues=[]
titles={}; descs={}
class P(HTMLParser):
    def __init__(s): super().__init__(); s.d=collections.defaultdict(list); s.ids=[]; s.links=[]; s.imgs=[]; s.inputs=[]; s.labels=set(); s.h=[]; s._t=None; s.title=''; s.meta={}; s.cur=None; s.btn=None; s.btntxt={}
    def handle_starttag(s,t,a):
        a=dict(a)
        if 'id' in a: s.ids.append(a['id'])
        if t=='a' and 'href' in a: s.links.append(a['href'])
        if t=='img': s.imgs.append(a)
        if t in('input','select','textarea') and a.get('type') not in('hidden',): s.inputs.append(a)
        if t=='label' and 'for' in a: s.labels.add(a['for'])
        if t=='meta': s.meta[a.get('name') or a.get('property') or 'charset']=a.get('content','')
        if t=='link' and a.get('rel')=='canonical': s.meta['canonical']=a['href']
        if t in('h1','h2','h3','title'): s._t=t; s.cur=''
        if t=='html': s.meta['lang']=a.get('lang')
        if t=='button': s.btn=a
    def handle_data(s,x):
        if s._t: s.cur+=x
    def handle_endtag(s,t):
        if t==s._t:
            if t=='title': s.title=s.cur
            else: s.h.append((t,s.cur.strip()))
            s._t=None
for f in files:
    src=open(f,encoding='utf-8').read(); p=P(); p.feed(src); rel=os.path.relpath(f,ROOT)
    if not (30<=len(p.title)<=75): issues.append((rel,'título fora de 30–75',len(p.title)))
    d=p.meta.get('description',''); 
    if not (70<=len(d)<=175): issues.append((rel,'description fora de 70–175',len(d)))
    titles.setdefault(p.title,[]).append(rel); descs.setdefault(d,[]).append(rel)
    for k in ('canonical','og:title','og:description','og:image','twitter:card','viewport','lang'):
        if not p.meta.get(k): issues.append((rel,'falta meta',k))
    if [h for h in p.h if h[0]=='h1'].__len__()!=1: issues.append((rel,'h1 != 1',len([h for h in p.h if h[0]=='h1'])))
    for im in p.imgs:
        if 'alt' not in im: issues.append((rel,'img sem alt',im.get('src')))
        if not im.get('width'): issues.append((rel,'img sem width/height (CLS)',im.get('src')))
    dup=[k for k,v in collections.Counter(p.ids).items() if v>1]
    if dup: issues.append((rel,'ids duplicados',dup))
    for i in p.inputs:
        if i.get('type') in('submit','button'): continue
        if i.get('id') not in p.labels and not i.get('aria-label') and i.get('type')!='checkbox': 
            if i.get('id') not in p.labels: issues.append((rel,'input sem label',i.get('id') or i.get('name')))
        if i.get('type')=='checkbox' and i.get('id') not in p.labels and not i.get('disabled') is not None: pass
    # levels
    lv=[int(h[0][1]) for h in p.h]
    for a,b in zip(lv,lv[1:]):
        if b>a+1: issues.append((rel,'salto de heading',f'h{a}→h{b}')); break
    # links
    for l in p.links:
        if re.match(r'(https?:|mailto:|tel:)',l): continue
        pathpart,_,frag=l.partition('#')
        tgt=(os.path.normpath(ROOT+pathpart) if pathpart.startswith('/') else os.path.normpath(os.path.join(os.path.dirname(f),pathpart))) if pathpart else f
        if os.path.isdir(tgt): tgt=os.path.join(tgt,'index.html')
        if not os.path.exists(tgt): issues.append((rel,'link quebrado',l)); continue
        if frag and tgt.endswith('.html'):
            ids=set(re.findall(r'\bid="([^"]+)"',open(tgt,encoding='utf-8').read()))
            if frag not in ids: issues.append((rel,'âncora inexistente',l))
    for m in re.findall(r'(?:src|href)="([^"#?]+\.(?:css|js|png|jpg|webp|ico|woff|webmanifest))"',src):
        if not re.match(r'https?:',m) and not os.path.exists((os.path.normpath(ROOT+m) if m.startswith('/') else os.path.normpath(os.path.join(os.path.dirname(f),m)))): issues.append((rel,'asset ausente',m))
    ph=len(re.findall(r'\[PREENCHER',src)); 
    if ph: print(f'  info: {rel} tem {ph} campos [PREENCHER]')
for k,v in titles.items():
    if len(v)>1: issues.append((v,'título duplicado',k))
for k,v in descs.items():
    if len(v)>1: issues.append((v,'description duplicada',k[:40]))
for f in ('robots.txt','sitemap.xml','site.webmanifest','assets/og-image.png','assets/favicon.ico','404.html'):
    if not os.path.exists(f'{ROOT}/{f}'): issues.append((f,'ausente',''))
sm=open(ROOT+'/sitemap.xml').read(); print('sitemap URLs:',sm.count('<loc>'))
# contraste
def lum(h):
    h=h.lstrip('#'); r,g,b=[int(h[i:i+2],16)/255 for i in(0,2,4)]
    f=lambda c: c/12.92 if c<=.03928 else ((c+.055)/1.055)**2.4
    return .2126*f(r)+.7152*f(g)+.0722*f(b)
def cr(a,b): la,lb=sorted([lum(a),lum(b)],reverse=True); return (la+.05)/(lb+.05)
pairs={'texto/bg':('#eef5ef','#06100b'),'muted/bg':('#a9bdb0','#06100b'),'azul claro/bg':('#63cdf5','#06100b'),'btn texto/azul':('#00131c','#00a4e4'),'paper texto':('#122019','#f3f7f2'),'paper muted':('#41524a','#f3f7f2'),'azul paper/paper':('#005f94','#f3f7f2'),'leaf/bg':('#8cc63f','#06100b'),'statusbar':('#ffffff','#2d312e'),'badge':('#2a1d00','#ffd166'),'sim-out leaf':('#b5e07a','#0f3d26'),'warn paper':('#7a5400','#fff8e6'),'err/bg':('#ff8a80','#06100b')}
for k,(a,b) in pairs.items():
    r=cr(a,b); print(f'  contraste {k}: {r:.1f}:1','' if r>=4.5 else '<-- ABAIXO de 4.5')
    if r<4.5: issues.append(('css','contraste baixo',k))
print('páginas:',len(files)); print('PROBLEMAS:',len(issues))
for i in issues: print(' -',i)
