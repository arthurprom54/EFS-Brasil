import asyncio,sys
from playwright.async_api import async_playwright
async def main():
    async with async_playwright() as p:
        br=await p.chromium.launch()
        for tag,vp in [('d',{'width':1366,'height':800}),('m',{'width':390,'height':844})]:
            pg=await br.new_page(viewport=vp)
            errs=[]; pg.on('pageerror',lambda e:errs.append(str(e)))
            await pg.add_init_script("localStorage.setItem('efs-consent-v1',JSON.stringify({v:1,analytics:false,t:Date.now()}))")
            await pg.goto('http://localhost:8099/'); await pg.wait_for_timeout(1800)
            await pg.click('.menu-btn'); await pg.wait_for_timeout(1500); await pg.screenshot(path=f'tests/out/w-menu-{tag}.png'); await pg.keyboard.press('Escape')
            for sel,name in [('.hs','hs'),('.vote-band','vote'),('.faq-sec','faq'),('.site-footer','foot')]:
                y=await pg.evaluate(f"document.querySelector('{sel}').getBoundingClientRect().top+scrollY")
                off={'hs':400 if tag=='d' else 0,'vote':0,'faq':0,'foot':0}[name]
                for k in range(0,5):
                    await pg.evaluate(f"scrollTo(0,{y-200+k*200})"); await pg.wait_for_timeout(120)
                await pg.evaluate(f"scrollTo(0,{y+off})"); await pg.wait_for_timeout(1200)
                if name=='faq': await pg.click('.faq details:nth-child(2) summary'); await pg.wait_for_timeout(500)
                await pg.screenshot(path=f'tests/out/w-{name}-{tag}.png')
            sw=await pg.evaluate('document.documentElement.scrollWidth'); print(tag,'scrollW',sw,'errors',errs)
            await pg.close()
        await br.close()
asyncio.run(main())
