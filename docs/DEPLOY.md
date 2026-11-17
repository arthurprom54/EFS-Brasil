# Publicação: domínio próprio e HTTPS

O site é 100% estático (pasta `site/`). Só a **enquete (contagem real)** e o **formulário** precisam de um pequeno servidor (`server/server.mjs`, Node 18+, sem dependências).

## 1. Gerar o site com o seu domínio
```bash
node build.mjs --site-url=https://www.SEU-DOMINIO.com.br
```
Isso grava canonical, Open Graph, `sitemap.xml` e `robots.txt` com o domínio correto. **Faça isso antes de publicar.**

## 2. Escolha uma hospedagem
**A. Tudo em uma VPS (recomendado — enquete e formulário funcionam)**
1. Copie o projeto para `/var/www/efs-brasil` e rode `node server/server.mjs` (use `systemd` ou `pm2`; defina `PORT=8080` e `VOTE_SECRET`).
2. Instale o **Caddy** e use `deploy/Caddyfile`: ele obtém e renova o certificado HTTPS sozinho.
3. Dados ficam em `server/data/` (`poll.json`, `contact.jsonl`) — faça backup.

**B. Hospedagem estática (Cloudflare Pages, Netlify, Vercel, GitHub Pages)**
1. Publique a pasta `site/`; copie `deploy/_headers` para dentro dela (Netlify/Cloudflare).
2. Hospede o `server/server.mjs` separadamente (Render, Railway, Fly.io…) e, em `site/js/config.js`, aponte `POLL_API` e `FORM_ENDPOINT` para a URL completa (ex.: `https://api.SEU-DOMINIO.com.br/api/poll`). Libere esse host em `connect-src` do CSP.
3. Sem servidor, a enquete funciona em **modo local** (aviso visível) e o formulário avisa que o envio não está configurado.

## 3. Domínio (DNS)
| Tipo | Nome | Valor |
|---|---|---|
| A / AAAA | `@` e `www` | IP da VPS (opção A) |
| CNAME | `www` | endereço fornecido pelo host estático (opção B) |
Registro de domínio `.br`: registro.br. A propagação leva de minutos a 48 h.

## 4. HTTPS
- Caddy, Cloudflare Pages, Netlify e Vercel emitem e renovam o certificado automaticamente (Let's Encrypt) assim que o DNS aponta para eles.
- Ative redirecionamento HTTP→HTTPS e **HSTS** (já em `_headers`/Caddyfile). Se usar Nginx: `certbot --nginx -d www.SEU-DOMINIO.com.br`.
- Em produção **não** defina `INSECURE_COOKIE` (o cookie de voto é `Secure`).

## 5. Depois de publicar
1. Edite `site/js/config.js`: `PETITION_URL` (link do e-Cidadania), `ANALYTICS` (opcional).
3. Envie `https://www.SEU-DOMINIO.com.br/sitemap.xml` ao Google Search Console e Bing Webmaster.
4. Teste: `node build.mjs` → `python3 tests/audit.py` (SEO/links), `tests/func.py`, `tests/perf.py`.

## Observações honestas sobre a enquete
Um voto por navegador (cookie + armazenamento local) e limite por IP. Não impede fraude deliberada (limpar cookies, outro aparelho). Serve como termômetro, não como prova de apoio.

## Netlify com enquete global (Functions + Blobs)
O projeto já traz `netlify.toml`, `package.json` e `netlify/functions/` (poll e contact).
1. Suba **a pasta do projeto inteira** (não só `site/`) para um repositório no GitHub.
2. Na Netlify: *Add new site → Import an existing project* → escolha o repositório. Ela lê o `netlify.toml` (build `node build.mjs --site-url=$URL`, publica `site/`) e instala as funções.
3. A enquete passa a contar votos de todos (um voto por navegador). O contato guarda mensagens em *Blobs → efs-contato*.
Arrastar a pasta (Drop) **não** publica as funções: a enquete voltaria ao modo local.
