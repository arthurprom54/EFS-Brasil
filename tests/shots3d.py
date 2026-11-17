import asyncio
from playwright.async_api import async_playwright
async def main():
    async with async_playwright() as p:
        br=await p.chromium.launch(args=['--use-gl=swiftshader','--enable-unsafe-swiftshader','--ignore-gpu-blocklist'])
        for tag,vp in [('d',{'width':1366,'height':800}),('m',{'width':390,'height':844})]:
            pg=await br.new_page(viewport=vp); logs=[]
            pg.on('console',lambda m:logs.append(m.text) if m.type in('error','warning') else None); pg.on('pageerror',lambda e:logs.append('PAGEERR '+str(e)))
            pg.on('response',lambda r: logs.append(('HTTP',r.status,r.url)) if r.status>=400 and 'api/poll' not in r.url else None)
            await pg.add_init_script("localStorage.setItem('efs-consent-v1',JSON.stringify({v:1,analytics:false,t:Date.now()}))")
            await pg.goto('http://localhost:8099/'); await pg.wait_for_timeout(4500)
            print(tag,'3d on:',await pg.evaluate("document.querySelector('.hero-3d').classList.contains('on')"),'has-3d',await pg.evaluate("document.querySelector('.hero').classList.contains('has-3d')"))
            await pg.mouse.move(vp['width']*.6,vp['height']*.4); await pg.wait_for_timeout(1200)
            await pg.screenshot(path=f'tests/out/b-{tag}-0.png')
            await pg.evaluate("scrollTo(0,350)"); await pg.wait_for_timeout(1500); await pg.screenshot(path=f'tests/out/b-{tag}-1.png')
            print(tag,logs[:6]); await pg.close()
        await br.close()
asyncio.run(main())
