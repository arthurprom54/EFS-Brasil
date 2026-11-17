import asyncio, sys
from playwright.async_api import async_playwright
B='http://localhost:8099/'
async def main():
    async with async_playwright() as p:
        br=await p.chromium.launch()
        errs=[]
        for name,vp,mob in [('d',{'width':1366,'height':800},False),('m',{'width':390,'height':844},True)]:
            ctx=await br.new_context(viewport=vp,is_mobile=mob,device_scale_factor=1,has_touch=mob)
            pg=await ctx.new_page()
            pg.on('console',lambda m: errs.append((name,m.type,m.text)) if m.type in('error','warning') else None)
            pg.on('pageerror',lambda e: errs.append((name,'pageerror',str(e))))
            await pg.goto(B); await pg.wait_for_timeout(1800)
            await pg.screenshot(path=f'tests/out/home-{name}-top.png')
            await pg.evaluate("document.getElementById('consent')?.classList.remove('open')")
            for y,t in [(1500,'story'),(3300,'story2'),(6000,'mid')]:
                await pg.evaluate(f'window.scrollTo(0,{y})'); await pg.wait_for_timeout(900); await pg.screenshot(path=f'tests/out/home-{name}-{t}.png')
            await ctx.close()
        print(errs)
        await br.close()
asyncio.run(main())
