# Site oficial EFS Brasil — Estatuto da Floresta Sustentável
Site multipágina estático (28 páginas) sobre a **minuta de projeto de lei** (90 artigos, 15 capítulos). Identificado em todas as páginas como PROJETO, não lei vigente.

```
node build.mjs [--site-url=https://seu-dominio] [--out=site]   # gera site/
node server/server.mjs                                          # serve site/ + API da enquete/contato
```
- `src/content.mjs`: textos dos capítulos, instrumentos, efeitos, pendências. `src/data/articles.json`: 90 artigos (extraídos do livro).
- `src/js/config.js` (publicado em `site/js/config.js`): link da petição, API da enquete, formulário, analytics.
- `docs/DEPLOY.md`: domínio e HTTPS. `deploy/`: `_headers`, `Caddyfile`. `tests/`: SEO/links, a11y, funcional, performance.
- Fontes: Inter (OFL), auto-hospedada; para usar Montserrat/Space Grotesk, troque os `.woff` e os `@font-face`.

## Visual (v3)
- `src/css/look.css`: camada visual (letras condensadas, faixa lima, menu em tela cheia, faixa horizontal, FAQ, rodapé).
- `tools/make_condensed.py`: gera a fonte `EFS Condensed` a partir da Inter Display Black.
- `tools/make_photos.py`: processa as fotos reais (`/tmp/p/*.png`) em `src/assets/photo-*.webp`.
- Fotos de terceiros: créditos "Fotos" no rodapé devem ser conferidos (fotos enviadas pelo cliente; se usar Unsplash, citar "Unsplash").

## Créditos de terceiros (3D)
- **three.js r160** — licença MIT (`src/assets/vendor/LICENSE-three.txt`). Arquivos copiados de raw.githubusercontent.com (mrdoob/three.js).
- **Modelo da arara (`macaw.glb`)** — `Parrot.glb`, exemplo do three.js (autoria mirada / ro.me). É um modelo *low-poly* estilizado, não fotorrealista. **Confirme a licença antes de publicar** (ou troque por um .glb licenciado em `src/assets/vendor/models/macaw.glb`). Para desligar o 3D: remova o bloco "3D loader" de `src/js/app.js` — o site usa as partículas 2D como alternativa (também acionada sem WebGL, com movimento reduzido ou `?no3d`).
