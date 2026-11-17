import asyncio, glob
from playwright.async_api import async_playwright
JS="""()=>{const out=[];const name=e=>(e.getAttribute('aria-label')||e.textContent||e.getAttribute('title')||'').trim();
document.querySelectorAll('a[href],button,[role=button],[role=radio],[role=tab]').forEach(e=>{if(!name(e)&&!e.querySelector('img[alt]:not([alt=""])'))out.push('sem nome: '+e.outerHTML.slice(0,80))});
document.querySelectorAll('input:not([type=hidden]),select,textarea').forEach(e=>{if(!e.labels.length&&!e.getAttribute('aria-label'))out.push('sem label: '+e.name)});
const lm=['header','nav','main','footer'].filter(t=>!document.querySelector(t));if(lm.length)out.push('faltam landmarks '+lm);
if(document.querySelectorAll('main').length!=1)out.push('main!=1');
document.querySelectorAll('.btn,.nav a,.choice,.menu-btn').forEach(e=>{const r=e.getBoundingClientRect();if(r.width&&r.height&&r.height<40)out.push('alvo pequeno '+name(e).slice(0,20)+' '+Math.round(r.height))});
return out}"""
async def main():
    async with async_playwright() as p:
        br=await p.chromium.launch(); ctx=await br.new_context(viewport={'width':390,'height':844}); await ctx.add_init_script("localStorage.setItem('efs-consent-v1',JSON.stringify({analytics:false}))")
        pg=await ctx.new_page(); bad=0
        for f in sorted(glob.glob('site/**/*.html',recursive=True)):
            await pg.goto('http://localhost:8099/'+f[5:].replace('index.html','')); 
            r=await pg.evaluate(JS); 
            if r: bad+=1; print(f,r[:4])
        # teclado: tab até primeiro foco visível
        await pg.goto('http://localhost:8099/'); await pg.keyboard.press('Tab'); print('1º foco:',await pg.evaluate("document.activeElement.className||document.activeElement.tagName"))
        print('páginas com achados:',bad); await br.close()
asyncio.run(main())
