import asyncio, base64
from playwright.async_api import async_playwright
def b(p): return base64.b64encode(open(p,'rb').read()).decode()
A='src/assets/'
html=f'''<html><body style="margin:0;width:1200px;height:630px;position:relative;overflow:hidden;background:#040a07;font-family:'Inter Display','Inter',sans-serif;color:#fff">
<style>img{{position:absolute;inset:0;width:1200px;height:630px;object-fit:cover;object-position:64% 60%}}</style>
<img src="data:image/jpeg;base64,{b(A+'photo-canopy.jpg')}">
<div style="position:absolute;inset:0;background:linear-gradient(90deg,rgba(4,10,7,.92) 0%,rgba(4,10,7,.55) 55%,rgba(4,10,7,.1))"></div>
<div style="position:absolute;left:64px;top:56px;display:flex;align-items:center;gap:16px"><img src="data:image/png;base64,{b(A+'logo-mark@2x.png')}" style="position:static;width:64px;height:64px"><b style="font-size:30px;letter-spacing:-.01em">EFS BRASIL</b></div>
<div style="position:absolute;left:64px;bottom:64px;width:760px"><div style="display:inline-block;background:#ffd166;color:#2a1d00;font:700 20px Inter;letter-spacing:.1em;padding:6px 16px;border-radius:99px;text-transform:uppercase">Projeto de lei · não é lei vigente</div>
<div style="font-weight:800;font-size:82px;line-height:.92;letter-spacing:-.035em;text-transform:uppercase;margin-top:22px">Estatuto da <span style="color:#c6ec72">Floresta</span> Sustentável</div>
<div style="font:400 26px Inter;margin-top:20px;color:#d6e4da">90 artigos · 15 capítulos · enquete apoio ou contra</div></div></body></html>'''
async def main():
    async with async_playwright() as p:
        br=await p.chromium.launch(); pg=await br.new_page(viewport={'width':1200,'height':630})
        await pg.set_content(html); await pg.wait_for_timeout(500); await pg.screenshot(path=A+'og-image.png'); await br.close()
asyncio.run(main())
