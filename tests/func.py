import asyncio, json
from playwright.async_api import async_playwright
B='http://localhost:8099/'
async def main():
    async with async_playwright() as p:
        br=await p.chromium.launch(); ok=lambda c,m: print(('PASS ' if c else 'FAIL ')+m)
        ctx=await br.new_context(viewport={'width':1200,'height':900}); await ctx.add_init_script("localStorage.setItem('efs-consent-v1',JSON.stringify({analytics:false}))")
        pg=await ctx.new_page(); errs=[]; pg.on('console',lambda m: errs.append(m.text) if m.type=='error' else None); pg.on('pageerror',lambda e:errs.append(str(e)))
        # poll
        await pg.goto(B+'enquete/'); await pg.wait_for_timeout(1200)
        ok(await pg.locator('#votar [data-n=apoio]').inner_text()=='0','poll initial 0')
        ok(await pg.locator('#votar [data-mode]').is_hidden(),'api mode (no local warning)')
        await pg.click('#votar [data-v=apoio]'); await pg.click('#votar [data-submit]'); await pg.wait_for_timeout(1000)
        ok(await pg.locator('#votar [data-n=apoio]').inner_text()=='1','vote counted =1')
        ok(await pg.locator('#votar [data-v=contra]').is_disabled(),'choices locked after vote')
        # second context same cookie? new context = new voter
        c2=await br.new_context(); await c2.add_init_script("localStorage.setItem('efs-consent-v1',JSON.stringify({analytics:false}))"); p2=await c2.new_page()
        await p2.goto(B+'enquete/'); await p2.wait_for_timeout(1000); await p2.click('#votar [data-v=contra]'); await p2.click('#votar [data-submit]'); await p2.wait_for_timeout(900)
        ok(await p2.locator('#votar [data-total]').inner_text()=='2','second voter total=2')
        await pg.reload(); await pg.wait_for_timeout(1000); ok(await pg.locator('#votar [data-v=apoio]').is_disabled(),'vote remembered after reload')
        # petition slot
        ok(await pg.locator('[data-petition-link]').is_hidden(),'petition placeholder (no link)')
        # form validation
        await pg.goto(B+'contato/'); await pg.click('#contact-form [type=submit]'); await pg.wait_for_timeout(300)
        ok(await pg.locator('#form-summary').is_visible(),'form summary shows errors'); ok(await pg.get_attribute('#nome','aria-invalid')=='true','aria-invalid set')
        await pg.fill('#nome','Maria Souza'); await pg.fill('#email','maria@exemplo.com'); await pg.select_option('#assunto',index=1); await pg.fill('#mensagem','Sugestão sobre o artigo 34.'); await pg.check('#consentimento')
        await pg.click('#contact-form [type=submit]'); await pg.wait_for_url('**/obrigado/',timeout=5000); ok(True,'form submit → obrigado')
        # simulators
        await pg.goto(B+'impacto/'); await pg.wait_for_timeout(500)
        t=await pg.locator('[data-panel=restauracao] [data-out]').inner_text(); ok('21.000' in t,'restauração 20000→21.000 m²')
        await pg.click('[data-tab=residuos]'); t=await pg.locator('[data-panel=residuos] [data-out]').inner_text(); ok('cabe' in t,'resíduos: '+t.split('\n')[0])
        await pg.click('[data-tab=sancoes]'); await pg.fill('[data-panel=sancoes] #base','10000000'); await pg.fill('[data-panel=sancoes] #fator','10'); t=await pg.locator('[data-panel=sancoes] [data-out]').inner_text(); ok('50.000.000' in t,'multa agravada limitada a R$ 50 mi')
        await pg.click('[data-tab=cronograma]'); await pg.fill('[data-panel=cronograma] #pub','2027-01-01'); t=await pg.locator('[data-panel=cronograma] [data-out]').inner_text(); ok('30/06/2027' in t and '27/12/2027' in t,'cronograma 01/01/2027→vigência 30/06/2027, protocolo 27/12?')
        print(t[:300])
        await pg.click('[data-tab=iluminacao]'); t=await pg.locator('[data-panel=iluminacao] [data-out]').inner_text(); print(t.split('\n')[0])
        # reader
        await pg.goto(B+'texto-integral/'); await pg.fill('#q','pedágio'); await pg.wait_for_timeout(300); print(await pg.inner_text('#count-res'))
        # 404
        r=await pg.goto(B+'nada/'); ok(r.status==404,'404 status')
        # consent
        c3=await br.new_context(); p3=await c3.new_page(); await p3.goto(B); await p3.wait_for_timeout(1600); ok(await p3.locator('#consent').is_visible(),'cookie banner shown first visit')
        await p3.click('[data-consent=essential]'); ok(await p3.locator('#consent').is_hidden(),'banner dismissed')
        print('console errors:',errs)
        await br.close()
asyncio.run(main())
