import asyncio
from playwright.async_api import async_playwright
B='http://localhost:8099/'
async def main():
    async with async_playwright() as p:
        br=await p.chromium.launch()
        ctx=await br.new_context(viewport={'width':390,'height':844},is_mobile=True,has_touch=True)
        await ctx.add_init_script("localStorage.setItem('efs-consent-v1',JSON.stringify({analytics:false}))")
        pg=await ctx.new_page()
        for path,name in [('enquete/','enq'),('estatuto/capitulo-7/','cap7'),('impacto/#sim-restauracao','sim'),('contato/','contato')]:
            await pg.goto(B+path); await pg.wait_for_timeout(1500)
            if name=='sim': await pg.evaluate("document.getElementById('simulador').scrollIntoView()"); await pg.wait_for_timeout(500)
            await pg.screenshot(path=f'tests/out/{name}.png',full_page=(name in('enq',)))
        await br.close()
asyncio.run(main())
