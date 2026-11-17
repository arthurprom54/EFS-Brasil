import asyncio
from playwright.async_api import async_playwright
async def main():
    async with async_playwright() as p:
        br=await p.chromium.launch(); pg=await br.new_page(viewport={'width':1366,'height':800})
        await pg.add_init_script("localStorage.setItem('efs-consent-v1',JSON.stringify({v:1,analytics:false,t:Date.now()}))")
        await pg.goto('http://localhost:8099/'); await pg.wait_for_timeout(2000)
        H=await pg.evaluate('document.documentElement.scrollHeight')
        for name,y in [('a',0),('b',900),('c',2000)]:
            await pg.evaluate(f'scrollTo(0,{y})'); await pg.wait_for_timeout(900); await pg.screenshot(path=f'tests/out/v-{name}.png')
        # find sections
        for sel,name in [('.manifesto-sec','m'),('.bento-sec','bento'),('.net-sec','net'),('#participe','poll')]:
            await pg.evaluate(f"document.querySelector('{sel}').scrollIntoView()"); await pg.wait_for_timeout(500)
            await pg.evaluate("scrollBy(0,%d)"%(300 if name=='m' else 0)); await pg.wait_for_timeout(1400)
            await pg.screenshot(path=f'tests/out/v-{name}.png')
        await br.close()
asyncio.run(main())
