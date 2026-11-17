import asyncio, json
from playwright.async_api import async_playwright
B='http://localhost:8099/'
JS="""()=>new Promise(r=>{let lcp=0,cls=0;new PerformanceObserver(l=>{for(const e of l.getEntries())lcp=e.startTime}).observe({type:'largest-contentful-paint',buffered:true});new PerformanceObserver(l=>{for(const e of l.getEntries())if(!e.hadRecentInput)cls+=e.value}).observe({type:'layout-shift',buffered:true});setTimeout(()=>{const n=performance.getEntriesByType('navigation')[0];const fcp=performance.getEntriesByName('first-contentful-paint')[0];r({lcp:Math.round(lcp),cls:+cls.toFixed(3),fcp:Math.round(fcp?fcp.startTime:0),dcl:Math.round(n.domContentLoadedEventEnd),load:Math.round(n.loadEventEnd)})},2500)})"""
async def main():
    async with async_playwright() as p:
        br=await p.chromium.launch()
        for path in ['','estatuto/capitulo-7/','texto-integral/','enquete/','impacto/']:
            ctx=await br.new_context(viewport={'width':390,'height':844},is_mobile=True,has_touch=True,device_scale_factor=2)
            await ctx.add_init_script("localStorage.setItem('efs-consent-v1',JSON.stringify({analytics:false}))")
            pg=await ctx.new_page(); cdp=await ctx.new_cdp_session(pg)
            await cdp.send('Network.enable'); await cdp.send('Network.emulateNetworkConditions',{'offline':False,'latency':150,'downloadThroughput':1.6e6/8,'uploadThroughput':750e3/8})
            await cdp.send('Emulation.setCPUThrottlingRate',{'rate':4})
            tot=[0]; cdp.on('Network.loadingFinished',lambda e: tot.__setitem__(0,tot[0]+e['encodedDataLength']))
            await pg.goto(B+path,wait_until='load'); m=await pg.evaluate(JS)
            # horizontal overflow
            ov=await pg.evaluate("document.documentElement.scrollWidth-innerWidth")
            print(f"/{path:24} FCP {m['fcp']}ms LCP {m['lcp']}ms CLS {m['cls']} load {m['load']}ms transfer {tot[0]//1024}KB overflowX {ov}")
            await ctx.close()
        await br.close()
asyncio.run(main())
