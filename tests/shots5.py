import asyncio
from playwright.async_api import async_playwright
pages=['estatuto/','estatuto/capitulo-5/','instrumentos/','impacto/','enquete/','texto-integral/','sobre/','contato/','privacidade/','nao-existe/']
async def main():
    async with async_playwright() as p:
        br=await p.chromium.launch()
        for tag,vp in [('d',{'width':1366,'height':800}),('m',{'width':390,'height':844})]:
            pg=await br.new_page(viewport=vp)
            await pg.add_init_script("localStorage.setItem('efs-consent-v1',JSON.stringify({v:1,analytics:false,t:Date.now()}))")
            for u in pages:
                await pg.goto('http://localhost:8099/'+u); await pg.wait_for_timeout(1300)
                await pg.mouse.wheel(0,500) if tag=='d' else None
                await pg.wait_for_timeout(700)
                await pg.screenshot(path=f"tests/out/i-{u.strip('/').replace('/','_')}-{tag}.png")
                sw=await pg.evaluate('document.documentElement.scrollWidth')
                if sw>vp['width']: print('OVERFLOW',tag,u,sw)
        await br.close()
asyncio.run(main())
