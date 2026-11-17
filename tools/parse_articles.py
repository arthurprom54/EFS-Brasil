import re, json, sys
src = sys.argv[1]; out = sys.argv[2]
lines = open(src, encoding='utf-8').read().split('\n')
start = next(i for i,l in enumerate(lines) if l.startswith('CAPÍTULO I — DISPOSIÇÕES PRELIMINARES'))
end = next(i for i,l in enumerate(lines) if l.startswith('APÊNDICE B'))
noise = re.compile(r'LIVRO DE REFERÊNCIA|EFS BRASIL \| ESTATUTO')
body = [l.strip() for l in lines[start:end] if l.strip() and not noise.search(l)]
chapters=[]; cur=None; art=None
roman = re.compile(r'^CAPÍTULO ([IVX]+) — (.+)$')
artre = re.compile(r'^Art\. (\d+)º? — ')
i=0
while i < len(body):
    l = body[i]
    m = roman.match(l)
    if m:
        title = m.group(2)
        # title may wrap onto next line (all caps, not starting with Art.)
        if i+1 < len(body) and body[i+1].isupper() and not artre.match(body[i+1]):
            title += ' ' + body[i+1]; i += 1
        cur = {'roman': m.group(1), 'title': title, 'articles': []}
        chapters.append(cur); art=None
    elif artre.match(l):
        art = {'text': l}; cur['articles'].append(art)
    elif art is not None and not l.startswith('PROJETO DE LEI'):
        art['text'] += ' ' + l
    i += 1
n=0
for c in chapters:
    for a in c['articles']:
        m = re.match(r'^Art\. (\d+)º? — ([^.]+)\. (.*)$', a['text'])
        a['n'] = int(m.group(1)); a['title']=m.group(2).strip(); a['body']=m.group(3).strip()
        del a['text']; n+=1
nums=[a['n'] for c in chapters for a in c['articles']]
assert nums==list(range(1,91)), nums
print(len(chapters),'chapters', n,'articles')
for c in chapters: print(c['roman'], c['title'], c['articles'][0]['n'], c['articles'][-1]['n'])
json.dump(chapters, open(out,'w',encoding='utf-8'), ensure_ascii=False, indent=1)
