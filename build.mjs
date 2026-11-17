// Gerador estático do site EFS Brasil. Uso: node build.mjs [--site-url=https://seudominio.com.br] [--out=site] [--link-index]
import fs from 'node:fs';
import path from 'node:path';
import { chapters, instruments, effects, params, guards, pendencias, refs, glossary, YOUTH_ARTS, NOTICE_MODEL } from './src/content.mjs';

const arg = (k, d) => (process.argv.find(a => a.startsWith('--' + k + '=')) || '').split('=')[1] || d;
const SITE = arg('site-url', 'https://SEU-DOMINIO.com.br').replace(/\/$/, '');
const OUT = path.resolve(arg('out', 'site'));
const LINK_INDEX = process.argv.includes('--link-index');
const DATE = '14/11/2026';
const data = JSON.parse(fs.readFileSync('src/data/articles.json', 'utf8'));
const art = {}; data.forEach((c, ci) => c.articles.forEach(a => { a.chap = ci + 1; art[a.n] = a; }));
const esc = s => String(s).replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;');
const range = c => { const a = data[c - 1].articles; return [a[0].n, a[a.length - 1].n]; };

const pages = [];
function rel(from, to) {
  if (from === '404.html') return '/' + to;
  const depth = from.split('/').filter(Boolean).length;
  let p = '../'.repeat(depth) + to; if (!p) p = './';
  if (LINK_INDEX && (to === '' || to.endsWith('/'))) p += 'index.html';
  return p;
}
const ico = (n) => `<span class="arr" aria-hidden="true">→</span>`;

function layout(P) {
  const R = to => rel(P.path, to);
  const url = SITE + '/' + P.path;
  const title = P.fullTitle || `${P.title} | EFS Brasil`;
  const nav = [['estatuto/', 'O Estatuto'], ['instrumentos/', 'Instrumentos'], ['impacto/', 'Impacto'], ['texto-integral/', 'Texto integral'], ['enquete/', 'Enquete']];
  const cur = h => (P.path === h || (h !== '' && P.path.startsWith(h) && h === 'estatuto/')) ? ' aria-current="page"' : '';
  const ld = [{ '@context': 'https://schema.org', '@type': 'WebSite', name: 'EFS Brasil — Estatuto da Floresta Sustentável', url: SITE + '/', inLanguage: 'pt-BR' }];
  if (P.path === '') ld.push({ '@context': 'https://schema.org', '@type': 'Organization', name: 'EFS Brasil', url: SITE + '/', logo: SITE + '/assets/icons/icon-512.png' });
  else if (!P.noindex) ld.push({ '@context': 'https://schema.org', '@type': 'BreadcrumbList', itemListElement: (P.crumbs || [['Início', '']]).concat([[P.crumb || P.title, P.path]]).map((c, i) => ({ '@type': 'ListItem', position: i + 1, name: c[0], item: SITE + '/' + c[1] })) });
  const hideCta = ['enquete/', 'obrigado/', '404.html'].includes(P.path);
  return `<!doctype html>
<html lang="pt-BR" class="no-js">
<head>
<meta charset="utf-8">
<meta name="viewport" content="width=device-width,initial-scale=1,viewport-fit=cover">
<title>${esc(title)}</title>
<meta name="description" content="${esc(P.desc)}">
<link rel="canonical" href="${url}">
<meta name="robots" content="${P.noindex ? 'noindex,follow' : 'index,follow,max-image-preview:large'}">
<meta name="theme-color" content="#06100b">
<meta property="og:type" content="website"><meta property="og:locale" content="pt_BR"><meta property="og:site_name" content="EFS Brasil">
<meta property="og:title" content="${esc(P.ogTitle || title)}"><meta property="og:description" content="${esc(P.desc)}">
<meta property="og:url" content="${url}"><meta property="og:image" content="${SITE}/assets/og-image.png"><meta property="og:image:width" content="1200"><meta property="og:image:height" content="630"><meta property="og:image:alt" content="EFS Brasil — Estatuto da Floresta Sustentável: projeto de lei em discussão">
<meta name="twitter:card" content="summary_large_image"><meta name="twitter:title" content="${esc(P.ogTitle || title)}"><meta name="twitter:description" content="${esc(P.desc)}"><meta name="twitter:image" content="${SITE}/assets/og-image.png">
<link rel="icon" href="${R('assets/favicon.ico')}" sizes="48x48"><link rel="icon" type="image/png" sizes="32x32" href="${R('assets/icons/icon-32.png')}"><link rel="icon" type="image/png" sizes="16x16" href="${R('assets/icons/icon-16.png')}">
<link rel="apple-touch-icon" href="${R('assets/icons/icon-180.png')}"><link rel="manifest" href="${R('site.webmanifest')}">
<link rel="preload" href="${R('assets/fonts/inter-display-800.woff')}" as="font" type="font/woff" crossorigin>
<link rel="preload" href="${R('assets/fonts/inter-400.woff')}" as="font" type="font/woff" crossorigin>
<link rel="preload" href="${R('assets/fonts/efs-condensed.woff')}" as="font" type="font/woff" crossorigin>
<link rel="stylesheet" href="${R('css/main.css')}">
<link rel="stylesheet" href="${R('css/look.css')}">
<noscript><style>#loader{display:none}</style></noscript>
${ld.map(o => `<script type="application/ld+json">${JSON.stringify(o)}</script>`).join('\n')}
</head>
<body${P.bodyClass ? ` class="${P.bodyClass}"` : ''}>
<div class="progress" aria-hidden="true"></div>
<div id="loader" aria-hidden="true"><img src="${R('assets/logo-mark@2x.png')}" width="72" height="72" alt=""></div>
<a class="skip" href="#conteudo">Pular para o conteúdo</a>
<div class="statusbar" role="note"><b>Projeto</b> <span>Minuta de lei — não é lei vigente</span> <a class="hide-s" href="${R('fontes-e-limites/')}">Entenda o status</a></div>
<header class="site-header"><div class="wrap header-in">
<a class="brand" href="${R('')}" aria-label="EFS Brasil — página inicial"><img src="${R('assets/logo-mark.png')}" srcset="${R('assets/logo-mark@2x.png')} 2x" width="38" height="38" alt=""><span>EFS BRASIL<small>ESTATUTO DA FLORESTA</small></span></a>
<nav class="nav" aria-label="Principal">${nav.map(n => `<a href="${R(n[0])}"${cur(n[0])}>${n[1]}</a>`).join('')}</nav>
<a class="btn sm head-cta" href="${R('enquete/')}"><span class="hide-s">Apoio ou contra?&nbsp;</span>Vote ${ico()}</a>
<button class="menu-btn" type="button" aria-expanded="false" aria-controls="mobile-nav" aria-label="Abrir menu"><b>Menu</b><span></span></button>
</div></header>
<div id="mobile-nav" class="mobile-nav" role="dialog" aria-modal="true" aria-label="Menu">
<div class="mn-grid"><nav aria-label="Menu completo" class="mn-links">${[...nav, ['sobre/','Sobre'], ['contato/','Contato']].map((n, i) => `<a href="${R(n[0])}" style="--i:${i}"><em>${String(i + 1).padStart(2, '0')}</em><span>${n[1]}</span><small>→</small></a>`).join('')}</nav>
<aside class="mn-side"><div class="mn-photo" aria-hidden="true"><img src="${R('assets/photo-river.webp')}" alt="" width="2000" height="1125" loading="lazy"></div><p class="eyebrow">Projeto de lei</p><p class="mn-note">90 artigos, 15 capítulos. Uma proposta em discussão — não é lei vigente.</p><a class="btn" href="${R('enquete/')}">Apoio ou contra? Vote ${ico()}</a></aside></div></div>
<main id="conteudo" tabindex="-1">
${P.body(R)}
</main>
<footer class="site-footer"><div class="wrap">
<div class="foot-grid">
<div><a class="brand" href="${R('')}"><img src="${R('assets/logo-mark.png')}" width="38" height="38" alt=""><span>EFS BRASIL<small>ESTATUTO DA FLORESTA SUSTENTÁVEL</small></span></a>
<p class="muted" style="margin-top:16px;max-width:36ch">Pela proteção das florestas. Pela segurança da população. Pelo futuro do Brasil.</p></div>
<div><h2>Proposta</h2><ul><li><a href="${R('estatuto/')}">O Estatuto</a></li><li><a href="${R('instrumentos/')}">Instrumentos</a></li><li><a href="${R('impacto/')}">Impacto e simulador</a></li><li><a href="${R('texto-integral/')}">Texto integral</a></li></ul></div>
<div><h2>Participe</h2><ul><li><a href="${R('enquete/')}">Enquete: apoio ou contra</a></li><li><a href="${R('enquete/#peticao')}">Petição e-Cidadania</a></li><li><a href="${R('contato/')}">Contato</a></li></ul></div>
<div><h2>Institucional</h2><ul><li><a href="${R('sobre/')}">Sobre</a></li><li><a href="${R('fontes-e-limites/')}">Fontes e limites</a></li><li><a href="${R('privacidade/')}">Privacidade</a></li><li><a href="${R('termos/')}">Termos de uso</a></li><li><button class="linkbtn" type="button" data-open-consent>Preferências de cookies</button></li></ul></div>
</div>
<div class="foot-note"><p><strong>Aviso:</strong> ${esc(NOTICE_MODEL)}</p><p>Edição técnica de referência de novembro de 2026 · Última atualização do site: ${DATE} · © <span data-year>2026</span> EFS Brasil.</p></div>
<p class="foot-mark" aria-hidden="true">EFS BRASIL</p></div></footer>
${hideCta ? '' : `<div class="sticky-cta"><a class="btn" href="${R('enquete/')}">Apoio ou contra? Vote agora ${ico()}</a></div>`}
<section id="consent" class="consent" role="dialog" aria-modal="false" aria-labelledby="consent-t">
<h2 id="consent-t">Sua privacidade</h2>
<p>Usamos armazenamento essencial (lembrar seu voto e suas escolhas). Estatísticas de acesso só são ativadas se você permitir. <a href="${R('privacidade/')}">Política de privacidade</a>.</p>
<p id="gpc-note" hidden>Detectamos um sinal de privacidade no seu navegador; por isso estatísticas começam desativadas.</p>
<fieldset class="prefs"><legend class="sr-only">Preferências</legend>
<label><input type="checkbox" checked disabled> <span><b>Essenciais</b> — sempre ativos: consentimento e voto da enquete neste navegador.</span></label>
<label><input type="checkbox" id="consent-analytics"> <span><b>Estatísticas de uso</b> — medem páginas visitadas de forma agregada, para melhorar o site.</span></label></fieldset>
<div class="btns"><button class="btn sm" type="button" data-consent="all">Aceitar tudo</button><button class="btn sm ghost" type="button" data-consent="essential">Só essenciais</button><button class="btn sm ghost" type="button" data-consent="prefs">Preferências</button><button class="btn sm" type="button" data-consent="save" id="save-pref">Salvar</button></div>
</section>
<script src="${R('js/config.js')}"></script>
<script src="${R('js/consent.js')}" defer></script>
<script src="${R('js/app.js')}" defer></script>
${(P.scripts || []).map(s => `<script src="${R('js/' + s)}" defer></script>`).join('\n')}
</body></html>`;
}

function add(P) { pages.push(P); }
const hero = (P, R) => '';
function pageHero({ eyebrow, h1, lead, crumbs, img }) {
  const ph = 1 + [...String(h1)].reduce((a, c) => a + c.charCodeAt(0), 0) % 5;
  return `<section class="page-hero ph${ph}${img ? ' has-img' : ''}"${img ? ` style="--img:url('${img}')"` : ''}><div class="wrap">
<nav class="crumbs" aria-label="Você está em"><ol>${crumbs.map(c => `<li>${c[1] ? `<a href="${c[1]}">${c[0]}</a>` : `<span aria-current="page">${c[0]}</span>`}</li>`).join('')}</ol></nav>
<p class="eyebrow" style="margin-top:22px">${eyebrow}</p><h1>${h1}</h1>${lead ? `<p class="lead">${lead}</p>` : ''}</div></section>`;
}
const youthTag = '<span class="tag-youth">Juventude (previsto no artigo)</span>';
const noticeProj = `<div class="notice warn" role="note"><strong>Status: projeto</strong><p>${esc(NOTICE_MODEL)}</p></div>`;

const pollBlock = (R, h = 'h2', id = '') => `<div class="poll" data-poll${id ? ` id="${id}"` : ''}>
<p class="eyebrow">Enquete pré-petição · sem cadastro</p>
<${h}>Você apoia a proposta do Estatuto da Floresta Sustentável?</${h}>
<p class="muted" style="max-width:60ch">Antes de votar, <a href="${R('estatuto/')}">entenda a proposta</a>. Um voto por navegador; nenhum dado pessoal é pedido.</p>
<div class="poll-choices" role="radiogroup" aria-label="Seu voto">
<button type="button" class="choice" role="radio" aria-checked="false" data-v="apoio"><span class="dot" aria-hidden="true"></span><span>Apoio<small>Sou a favor da proposta</small></span></button>
<button type="button" class="choice" role="radio" aria-checked="false" data-v="contra"><span class="dot" aria-hidden="true"></span><span>Contra<small>Sou contra a proposta</small></span></button></div>
<div class="poll-actions"><button type="button" class="btn" data-submit disabled>Registrar meu voto ${ico()}</button><button type="button" class="btn ghost sm" data-refresh>Atualizar números</button></div>
<p class="poll-status" data-status role="status" aria-live="polite"></p>
<div class="results" aria-live="polite" aria-label="Resultado parcial da enquete">
<div class="res-row"><div class="res-top"><span>Apoio <small data-pct="apoio"></small></span><b data-n="apoio"></b></div><div class="bar"><i data-bar="apoio"></i></div></div>
<div class="res-row"><div class="res-top"><span>Contra <small data-pct="contra"></small></span><b data-n="contra"></b></div><div class="bar c"><i data-bar="contra"></i></div></div>
<div class="res-total"><span>Total de votos: <b data-total></b></span><span>Atualizado às <b data-updated>—</b></span></div></div>
<p class="mode-note" data-mode hidden>Modo local: o servidor da enquete não respondeu, então os números mostram apenas votos feitos neste navegador. Não representam o público geral.</p>
<p class="muted" style="font-size:.85rem;margin-top:16px">Enquete informal, não científica e não vinculante. Não equivale a assinaturas de petição nem a pesquisa de opinião.</p></div>`;
const petitionBlock = (R) => `<div class="petition" data-petition id="peticao">
<p class="eyebrow">Petição pública · Portal e-Cidadania</p>
<div data-petition-empty><h3>Espaço reservado para o link da petição</h3><p>A petição ainda não foi publicada. Quando for criada no Portal e-Cidadania do Senado Federal, o link oficial aparecerá aqui. Nenhum apoio é contabilizado antes disso.</p></div>
<div data-petition-ready hidden><h3>A petição está aberta no e-Cidadania</h3><p>Apoie no site oficial do Senado Federal. A enquete deste site é apenas um termômetro e não substitui o apoio à petição.</p></div>
<a class="btn" data-petition-link href="#" target="_blank" rel="noopener noreferrer" hidden>Abrir petição no e-Cidadania ${ico()}</a></div>`;

// ---------- HOME ----------
add({ path: '', fullTitle: 'EFS Brasil — Estatuto da Floresta Sustentável (projeto de lei)', title: 'Início', ogTitle: 'EFS Brasil — Estatuto da Floresta Sustentável',
  desc: 'Projeto de lei em discussão: 90 artigos e 15 capítulos para restaurar ecossistemas, proteger águas, reduzir resíduos e fortalecer quem conserva a floresta. Não é lei vigente.',
  scripts: ['poll.js'], bodyClass: 'home',
  body: R => {
    const steps = [
      ['Prevenir', 'Prevenir antes de remediar', 'Prevenção e precaução abrem a lista de dez princípios do Estatuto. Os órgãos devem identificar riscos de poluição, escassez hídrica, calor extremo, enchentes, incêndios e desmatamento e priorizar as áreas mais expostas.', 'Arts. 3º e 7º', 'estatuto/capitulo-1/'],
      ['Restaurar', 'Restaurar mais do que se ocupa', 'Evitar, minimizar, restaurar e só então compensar. Para grandes empreendimentos, a referência é restaurar ao menos 105% da área do terreno, com 40 espécies nativas e 20 anos de manutenção.', 'Arts. 32 a 37', 'estatuto/capitulo-7/'],
      ['Águas', 'Proteger rios, nascentes e aquíferos', 'Controle de efluentes, dever de contenção e comunicação imediata de incidentes e relatório em até 12 horas quando houver risco grave e atual.', 'Arts. 41 a 45', 'estatuto/capitulo-8/'],
      ['Resíduos', 'Menos descarte irregular, mais informação', 'Ecopontos com alerta a 80% da capacidade, Regra dos 120 Dias para alegações de biodegradabilidade e proibição de promessas ambientais enganosas.', 'Arts. 14 a 25', 'estatuto/capitulo-4/'],
      ['Garantias', 'Fiscalizar com prova e com defesa', 'Satélites e inteligência artificial ajudam a triar alertas, mas nenhuma sanção sai de um algoritmo sozinho: há validação humana, contraditório e motivação.', 'Arts. 46 a 50 e 68 a 80', 'estatuto/capitulo-9/'],
      ['Guardiões', 'Fortalecer quem conserva', 'Assistência técnica, capacitação e infraestrutura para povos e comunidades tradicionais, agricultores familiares e cooperativas, com respeito a direitos territoriais e inclusão de mulheres e jovens.', 'Arts. 57, 58, 64 e 65', 'estatuto/capitulo-11/']
    ];
    return `
<section class="hero" aria-labelledby="h1">
<div class="hero-layers" aria-hidden="true">
<img class="on" src="${R('assets/photo-river.webp')}" alt="" width="2000" height="1125" fetchpriority="high" decoding="async">
<img src="${R('assets/photo-canoe.webp')}" alt="" width="2000" height="1125" loading="lazy" decoding="async">
<img src="${R('assets/photo-jaguar.webp')}" alt="" width="2000" height="1125" loading="lazy" decoding="async"></div>
<div class="hero-fog" aria-hidden="true"></div><div class="hero-light" aria-hidden="true"></div><canvas class="hero-3d" aria-hidden="true"></canvas><canvas id="fx" aria-hidden="true"></canvas>
<div class="wrap hero-body">
<p class="eyebrow hero-eyebrow">Projeto de lei federal · minuta em discussão</p>
<h1 id="h1" class="hero-title" aria-label="Estatuto da Floresta Sustentável"><span class="ln" aria-hidden="true"><span>Estatuto da</span></span><span class="ln" aria-hidden="true"><span class="lime">Floresta</span></span><span class="ln" aria-hidden="true"><span>Sustentável</span></span></h1>
<div class="hero-row">
<div class="hero-copy"><p class="lead">90 artigos e 15 capítulos para prevenir danos, restaurar ecossistemas, reduzir resíduos, proteger as águas e fortalecer quem conserva. <strong>Uma proposta — não é lei vigente.</strong></p>
<div class="hero-ctas"><a class="btn" href="${R('estatuto/')}">Entender a proposta ${ico()}</a><a class="btn ghost" href="${R('texto-integral/')}">Ler o texto</a></div></div>
<a class="orb" href="${R('enquete/')}" aria-label="Apoio ou contra? Vote na enquete"><svg viewBox="0 0 200 200" aria-hidden="true"><defs><path id="orbp" d="M100,100 m-82,0 a82,82 0 1,1 164,0 a82,82 0 1,1 -164,0"/></defs><text><textPath href="#orbp">APOIO OU CONTRA? · SEM CADASTRO · APOIO OU CONTRA? ·</textPath></text></svg><b>Vote<i>→</i></b></a>
</div></div><span class="scroll-cue" aria-hidden="true">Role</span></section>

<div class="marquee" aria-hidden="true"><div class="mq"><span>Projeto de lei · não é lei vigente</span><span>90 artigos</span><span>15 capítulos</span><span>Prevenir · Restaurar · Proteger</span><span>Projeto de lei · não é lei vigente</span><span>90 artigos</span><span>15 capítulos</span><span>Prevenir · Restaurar · Proteger</span></div></div>

<section class="section manifesto-sec"><div class="wrap">
<p class="eyebrow rv">A ideia</p>
<p class="manifesto" data-words>A floresta como política pública integrada. A proposta parte de uma convicção: proteger o ambiente precisa fazer parte de como o país planeja cidades, produz bens, cuida das águas e restaura ecossistemas, combinando prevenção, ciência, incentivos corretos, participação social, fiscalização e avaliação de resultados.</p>
<div class="narrow rv" style="margin-top:36px">${noticeProj}</div></div></section>

<section class="story" aria-labelledby="story-t"><h2 id="story-t" class="sr-only">Seis frentes da proposta</h2>
<div class="story-stage" aria-hidden="true"><div class="story-bg">
<img src="${R('assets/photo-canopy.webp')}" data-step="0" alt="" width="2000" height="1125" loading="lazy" decoding="async">
<img src="${R('assets/photo-river.webp')}" data-step="1,5" alt="" width="2000" height="1125" loading="lazy" decoding="async">
<img src="${R('assets/photo-canoe.webp')}" data-step="2" alt="" width="2000" height="1125" loading="lazy" decoding="async">
<img src="${R('assets/photo-jaguar.webp')}" data-step="3" alt="" width="2000" height="1125" loading="lazy" decoding="async">
<img src="${R('assets/photo-macaws.webp')}" data-step="4" alt="" width="2000" height="1125" loading="lazy" decoding="async"></div>
<div class="story-count"><b>01</b> <i>/ 06</i></div>
<div class="story-word">${steps.map((s, i) => `<span class="${i % 2 ? 'fill' : ''}">${s[0]}</span>`).join('')}</div></div>
<div class="story-steps">${steps.map((s, i) => `<div class="step"><div class="wrap"><div class="step-card"><p class="arts">${String(i + 1).padStart(2, '0')} · ${s[3]}</p><h3>${s[1]}</h3><p>${s[2]}</p><a class="link-arrow" href="${R(s[4])}">Ver o capítulo</a></div></div></div>`).join('')}</div></section>

<section class="section alt"><div class="wrap">
<div class="sec-head rv"><p class="eyebrow">A minuta em números</p><h2 class="h-xl">Cada número tem artigo e condição</h2><p class="lead">Parâmetros escritos no texto — referências de planejamento, prazos e limites. Nada aqui é resultado alcançado.</p></div>
<div class="stats">${params.map((p, i) => `<div class="stat rv" style="--i:${i % 5}"><b data-count="${p.v}">0${p.u ? `<i>${p.u}</i>` : ''}</b><span>${p.l}</span><small>${p.a}</small></div>`).join('')}</div>
<p style="margin-top:24px"><a class="link-arrow" href="${R('impacto/')}">Simule os parâmetros com seus próprios números</a></p>
</div></section>

<section class="hs" aria-labelledby="hs-t"><div class="hs-pin">
<div class="wrap hs-head"><p class="eyebrow">12 instrumentos</p><h2 id="hs-t" class="h-xl">As ferramentas da proposta</h2><p class="hs-hint" aria-hidden="true">Role →</p></div>
<div class="hs-track" tabindex="0" role="region" aria-label="Instrumentos da proposta (deslize ou role)">${instruments.map((i, k) => {
  const first = String(i.oque).split(/(?<=\.)\s/)[0];
  return `<a class="hs-card" href="${R('instrumentos/')}#${i.id}"><span class="hs-n">${String(k + 1).padStart(2, '0')}</span><h3>${i.nome}${i.youth ? youthTag : ''}</h3><p>${esc(first)}</p><small>Arts. ${i.arts.length > 1 ? i.arts[0] + '–' + i.arts[i.arts.length - 1] : i.arts[0]}</small></a>`;
}).join('')}<a class="hs-card hs-end" href="${R('instrumentos/')}"><span class="hs-n">→</span><h3>Ver todos os instrumentos</h3></a></div></div></section>

<section class="section paper bento-sec"><div class="wrap">
<div class="sec-head rv"><p class="eyebrow">15 capítulos</p><h2 class="h-xl">Navegue pela estrutura da lei</h2></div>
<div class="grid cards bento">${chapters.map(c => { const [a, b] = range(c.n); return `<a class="card rv" style="--i:${c.n % 4}" href="${R(`estatuto/capitulo-${c.n}/`)}"><span class="num">${String(c.n).padStart(2, '0')}</span><h3>${c.title}</h3><p>${c.kicker}</p><span class="meta">Arts. ${a}${b > a ? '–' + b : ''}</span></a>`; }).join('')}</div></div></section>

<section class="section alt net-sec"><canvas class="net" aria-hidden="true"></canvas><div class="wrap">
<div class="sec-head rv"><p class="eyebrow">Salvaguardas escritas na minuta</p><h2 class="h-xl">O que a proposta não faz</h2><p class="lead">Boa parte da credibilidade de uma lei está nos limites que ela impõe a si mesma.</p></div>
<ul class="guard" style="list-style:none;padding:0;margin:0">${guards.map(g => `<li class="rv"><div><b>${g[0]}</b><span>${g[1]}</span></div></li>`).join('')}</ul></div></section>

<section class="section"><div class="wrap">
<div class="sec-head rv"><p class="eyebrow">Impacto positivo</p><h2 class="h-xl">Onde a proposta busca fazer diferença</h2><p class="lead">Efeitos buscados pelos mecanismos do texto — hipóteses de política pública que dependem de aprovação, regulamentação e execução.</p></div>
<div class="fx-grid">${effects.slice(0, 6).map((e, i) => `<article class="fx rv" style="--i:${i % 3}"><span class="k">${e.tag}</span><h3>${e.area}</h3><p>${e.ef}</p><p class="cond">Arts. ${e.arts}</p></article>`).join('')}</div>
<p style="margin-top:28px"><a class="btn" href="${R('impacto/')}">Ver todos os efeitos e o simulador ${ico()}</a></p></div></section>

<section class="vote-band" aria-label="Chamada para votar"><div class="wrap"><p class="eyebrow">Participe</p><p class="vote-big" aria-hidden="true">Sua voz<br>na floresta</p><a class="orb orb-lg" href="#participe" aria-label="Ir para a enquete"><svg viewBox="0 0 200 200" aria-hidden="true"><text><textPath href="#orbp">APOIO OU CONTRA? · SEM CADASTRO · APOIO OU CONTRA? ·</textPath></text></svg><b>Vote<i>↓</i></b></a></div></section>
<section class="section alt" id="participe"><div class="wrap" style="display:grid;gap:28px;grid-template-columns:repeat(auto-fit,minmax(min(100%,420px),1fr));align-items:start">
<div class="rv">${pollBlock(R, 'h2')}</div>
<div class="rv" style="--i:2"><div class="sec-head"><p class="eyebrow">Próximo passo</p><h2 class="h-lg">Da enquete à petição pública</h2><p class="lead">A enquete mede o termômetro, sem cadastro. A petição oficial no e-Cidadania é onde o apoio formal acontece.</p></div>${petitionBlock(R)}</div></div></section>
<section class="section faq-sec"><div class="wrap narrow">
<div class="sec-head rv"><p class="eyebrow">Perguntas frequentes</p><h2 class="h-xl">Dúvidas rápidas</h2></div>
<div class="faq rv">
<details><summary>Isso já é lei?</summary><p>Não. É uma minuta de projeto de lei em discussão. Nada aqui está em vigor.</p></details>
<details><summary>Cria um novo órgão?</summary><p>Não. A denominação ANFS é funcional e não cria pessoa jurídica, cargo ou função (art. 11).</p></details>
<details><summary>A inteligência artificial pode multar?</summary><p>Não. Sistemas automatizados só triam alertas; nenhuma sanção, bloqueio ou restrição de direito sai de um sistema isolado (art. 49).</p></details>
<details><summary>O Pedágio Ambiental cobra alguma taxa?</summary><p>Não. A fórmula é uma referência técnica; qualquer cobrança exigiria lei específica (art. 53).</p></details>
<details><summary>Como posso participar?</summary><p>Votando na enquete (apoio ou contra, sem cadastro). Quando houver petição no e-Cidadania, o link aparecerá no espaço reservado nesta página.</p></details>
</div></div></section>`;
  } });

// ---------- ESTATUTO ----------
add({ path: 'estatuto/', title: 'O Estatuto: 90 artigos e 15 capítulos explicados', desc: 'Entenda o projeto do Estatuto da Floresta Sustentável: ementa, estrutura em 15 capítulos, salvaguardas e o que depende de lei, regulamento e orçamento.', crumb: 'O Estatuto', scripts: [],
  body: R => `${pageHero({ eyebrow: 'A proposta', h1: 'O Estatuto, capítulo a capítulo', lead: 'Ementa, estrutura e linguagem simples. Cada capítulo traz o que prevê, os limites escritos no texto e o efeito que busca.', crumbs: [['Início', R('')], ['O Estatuto', '']] })}
<section class="section paper"><div class="wrap"><div class="narrow">
<div class="notice warn" role="note"><strong>Status: projeto</strong><p>${esc(NOTICE_MODEL)}</p></div>
<h2 class="h-lg" style="margin:40px 0 14px">Ementa</h2>
<p class="lead">Institui o Estatuto da Floresta Sustentável — EFS Brasil e estabelece diretrizes, programas e instrumentos de cooperação para restauração ecológica, economia circular, proteção das águas, fiscalização ambiental e apoio a comunidades guardiãs.</p>
<h2 class="h-lg" style="margin:40px 0 14px">Como a minuta está construída</h2>
<p>Ela combina quatro tipos de comando, que precisam ser lidos de forma diferente: <b>proibições</b> (descarte irregular, alegações enganosas), <b>deveres de órgãos públicos</b> (relatórios, protocolo de cooperação), <b>metas e referências técnicas</b> (105%, 80%, 24 horas) e <b>garantias de processo</b> (validação humana, defesa). Uma referência técnica não é obrigação de resultado imediato, e uma fórmula não é cobrança.</p>
<h2 class="h-lg" style="margin:40px 0 14px">Como ler</h2>
<ul><li><b>Minuta</b>: texto de projeto com 90 artigos, sem força de lei.</li><li><b>Direito vigente</b>: normas já em vigor, citadas em <a href="${R('fontes-e-limites/')}">Fontes e limites</a>.</li><li><b>Recomendação técnica</b>: sugestão de aperfeiçoamento; não é redação aprovada.</li></ul></div>
<h2 class="h-xl" style="margin:70px 0 28px">15 capítulos</h2>
<div class="grid cards">${chapters.map(c => { const [a, b] = range(c.n); return `<a class="card" href="${R(`estatuto/capitulo-${c.n}/`)}"><span class="num">${String(c.n).padStart(2, '0')}</span><h3>${c.title}</h3><p>${c.kicker}</p><span class="meta">Arts. ${a}${b > a ? '–' + b : ''}</span></a>`; }).join('')}</div>
<p style="margin-top:36px"><a class="btn dark" href="${R('texto-integral/')}">Ler o texto integral ${ico()}</a></p></div></section>` });

// ---------- CAPÍTULOS ----------
chapters.forEach(c => {
  const [a, b] = range(c.n), rm = ['', 'I', 'II', 'III', 'IV', 'V', 'VI', 'VII', 'VIII', 'IX', 'X', 'XI', 'XII', 'XIII', 'XIV', 'XV'][c.n];
  const prev = chapters[c.n - 2], next = chapters[c.n];
  add({ path: `estatuto/capitulo-${c.n}/`, title: `Cap. ${c.n} — ${c.short}`, crumb: `Capítulo ${c.n}`, crumbs: [['Início', ''], ['O Estatuto', 'estatuto/']],
    desc: `${c.kicker} Arts. ${a}${b > a ? ' a ' + b : ''} da minuta do Estatuto da Floresta Sustentável (projeto, não lei vigente).`.slice(0, 175),
    body: R => `${pageHero({ eyebrow: `Capítulo ${rm} · Arts. ${a}${b > a ? '–' + b : ''}`, h1: c.title, lead: c.kicker, crumbs: [['Início', R('')], ['O Estatuto', R('estatuto/')], [`Capítulo ${c.n}`, '']] })}
<section class="section paper"><div class="wrap chap-grid"><div class="prose">
<div class="notice warn" role="note"><strong>Projeto — não é lei vigente</strong><p>O que está descrito aqui é proposta. Só produz efeitos jurídicos se for aprovada, publicada e entrar em vigor.</p></div>
<h2>O que o capítulo propõe</h2>${c.resumo.map(p => `<p>${p}</p>`).join('')}
<h2>Pontos-chave</h2><ul class="points">${c.pontos.map(p => `<li><span class="a">${p[0]}</span><span>${p[1]}${p[2] ? ' ' + youthTag : ''}</span></li>`).join('')}</ul>
<h2>Limites e salvaguardas</h2><ul class="points limits">${c.limites.map(p => `<li><span class="a">${p[0]}</span><span>${p[1]}</span></li>`).join('')}</ul>
<h2>Texto dos artigos</h2><p class="muted">Redação da minuta, reproduzida sem alterações.</p>
${data[c.n - 1].articles.map(x => `<article class="art" id="art-${x.n}"><h3><span class="n">${x.n}º</span> ${esc(x.title)}${YOUTH_ARTS.includes(x.n) ? youthTag : ''}</h3><p>${esc(x.body)}</p></article>`).join('')}
</div>
<aside class="aside-sticky"><div class="effect"><h2>Efeito buscado</h2><p>${c.efeito}</p><p style="margin-top:10px;font-size:.82rem;opacity:.8">Hipótese de política pública: depende de aprovação, regulamentação e execução.</p></div>
<p style="margin-top:18px"><a class="btn dark" href="${R('enquete/')}">Apoio ou contra? Vote ${ico()}</a></p></aside></div>
<div class="wrap"><nav class="pager" aria-label="Outros capítulos">${prev ? `<a href="${R(`estatuto/capitulo-${prev.n}/`)}"><small>← Anterior</small><b>${prev.n}. ${prev.short}</b></a>` : '<span></span>'}${next ? `<a class="next" href="${R(`estatuto/capitulo-${next.n}/`)}"><small>Próximo →</small><b>${next.n}. ${next.short}</b></a>` : '<span></span>'}</nav></div></section>` });
});

// ---------- INSTRUMENTOS ----------
add({ path: 'instrumentos/', title: 'Instrumentos da proposta: 120 Dias, Selo, 105% e mais', crumb: 'Instrumentos',
  desc: 'Regra dos 120 Dias, Selo Verde, restauração de 105%, ecopontos, Pedágio Ambiental, fundos e Protocolo de Tolerância Zero: o que cada instrumento prevê e o que não é.',
  body: R => `${pageHero({ eyebrow: 'Instrumentos', h1: 'O que cada instrumento prevê — e o que não é', lead: 'Doze instrumentos da minuta explicados com seus limites. Tudo é proposta.', crumbs: [['Início', R('')], ['Instrumentos', '']] })}
<section class="section"><div class="wrap">
<div class="notice warn" role="note" style="margin-bottom:30px"><strong>Status: projeto</strong><p>Nenhum órgão, fundo, selo ou obrigação descrito aqui existe por causa desta minuta. Eles só existiriam após aprovação e regulamentação.</p></div>
${instruments.map(i => `<article class="inst" id="${i.id}"><div class="inst-head"><h2>${i.nome}${i.youth ? youthTag : ''}</h2><p class="lead" style="margin-top:14px">${i.oque}</p><p class="arts">${i.arts.map(n => `<a class="chip" href="${R('texto-integral/')}#art-${n}">Art. ${n}</a>`).join('')}<a class="chip" href="${R(`estatuto/capitulo-${i.chap}/`)}">Capítulo ${i.chap}</a></p></div>
<div class="inst-cols"><div><h3>O que prevê</h3><ul>${i.prevê.map(x => `<li>${x}</li>`).join('')}</ul></div><div class="no"><h3>O que não é / limites</h3><ul>${i.naoE.map(x => `<li>${x}</li>`).join('')}</ul></div></div></article>`).join('')}
</div></section>` });

// ---------- IMPACTO ----------
const field = (n, l, v, h = '', extra = '') => `<div class="field"><label for="${n}">${l}</label><input class="input" id="${n}" name="${n}" type="number" step="any" inputmode="decimal" value="${v}" ${extra}>${h ? `<span class="hint">${h}</span>` : ''}</div>`;
const sims = [
  ['restauracao', 'Restauração', 'Plano de Restauração Nativa', 'Arts. 33 a 36', 'Quanto de área restaurar, como referência, para um terreno.', `${field('terreno', 'Área do terreno (m²)', 20000)}${field('construida', 'Área construída (m²)', 8000)}${field('unidades', 'Unidades (condomínio)', 0)}${field('ano', 'Ano de início', 2027, '', 'step="1"')}`, 'Usa as referências do texto: 105% do terreno, gatilhos de 5.000 m² ou 50 unidades, 40 espécies e 20 anos.'],
  ['residuos', 'Alerta 80%', 'Alerta de capacidade do ecoponto', 'Art. 17', 'Quanto tempo de margem o alerta a 80% dá para a coleta.', `${field('cap', 'Capacidade útil (litros)', 1100)}${field('nivel', 'Nível atual (%)', 20)}${field('taxa', 'Enchimento (litros por hora)', 25)}${field('resp', 'Resposta prevista (horas)', 4)}`, 'Premissa: enchimento constante. O prazo de 4 h vale quando previsto em contrato e tecnicamente viável.'],
  ['iluminacao', 'Iluminação', 'Iluminação em áreas sensíveis', 'Arts. 39 e 40', 'Energia poupada ao reduzir a 10% da intensidade sem circulação.', `${field('n', 'Pontos de luz', 50)}${field('w', 'Potência por ponto (W)', 60)}${field('h', 'Horas acesas por noite', 12)}${field('hs', 'Horas sem circulação por noite', 6)}${field('tarifa', 'Tarifa (R$/kWh) — opcional', '', 'Deixe vazio para ocultar o valor em reais')}`, 'Premissa: potência proporcional à intensidade (aproximação).'],
  ['cronograma', 'Calendário legal', 'Calendário a partir da publicação', 'Arts. 13, 24, 67, 87 e 90', 'Datas-limite se a lei fosse publicada em uma data escolhida por você.', `<div class="field"><label for="pub">Data de publicação (hipotética)</label><input class="input" id="pub" name="pub" type="date"></div><div class="field"><label for="marco">Marco dos requisitos técnicos (opcional)</label><input class="input" id="marco" name="marco" type="date"><span class="hint">Vazio = igual ao início da vigência</span></div>`, 'Datas ilustrativas: o marco real depende de regulamento.'],
  ['sancoes', 'Multas', 'Faixa de multa e agravante', 'Arts. 76 e 77', 'Como a faixa, o agravante e o teto interagem.', `${field('base', 'Multa-base (R$)', 100000)}${field('fator', 'Agravamento (1 a 10×)', 1)}${field('diaria', 'Multa diária (R$)', 0)}${field('dias', 'Dias de infração continuada', 0)}`, 'Valores fora da faixa são ajustados e sinalizados.'],
  ['pedagio', 'Pedágio (fórmula)', 'Fórmula do Pedágio Ambiental', 'Arts. 52 e 53', 'Peso de cada termo na fórmula PA = C·α + H·β + R·γ.', `${field('C', 'C — emissões (tCO₂e)', 1000)}${field('H', 'H — água (m³)', 5000)}${field('R', 'R — resíduos não reciclados (kg)', 2000)}${field('a', 'α (didático)', 1)}${field('b', 'β (didático)', 1)}${field('g', 'γ (didático)', 1)}`, 'Os coeficientes reais NÃO existem. Valores 1 são só didáticos; a fórmula não autoriza cobrança.'],
  ['destinacao', 'Fundos', 'Tetos de destinação propostos', 'Arts. 56 e 58', 'Tetos máximos propostos, se a lei e o orçamento permitirem.', `${field('multas', 'Multas graves arrecadadas (R$)', 0)}${field('pa', 'Arrecadação do Pedágio (R$)', 0)}${field('elegiveis', 'Multas elegíveis ao FAG (R$)', 0)}`, 'Valores hipotéticos digitados por você; nada disso está arrecadado.']
];
add({ path: 'impacto/', title: 'Impacto positivo e simulador da minuta', crumb: 'Impacto', scripts: ['sim.js'],
  desc: 'Veja onde a proposta busca gerar efeitos positivos e simule restauração, alerta de ecopontos, iluminação, prazos, multas e fórmulas com os parâmetros da minuta.',
  body: R => `${pageHero({ eyebrow: 'Impacto e números', h1: 'Onde a proposta busca fazer diferença', lead: 'Efeitos buscados por área e simuladores que calculam apenas com os parâmetros escritos na minuta.', crumbs: [['Início', R('')], ['Impacto', '']] })}
<section class="section"><div class="wrap">
<figure style="margin:0 0 36px;border-radius:var(--r);overflow:hidden;max-height:340px"><img src="${R('assets/photo-river.webp')}" width="2000" height="1125" alt="Vista aérea de um rio sinuoso cortando a floresta amazônica" style="width:100%;height:340px;object-fit:cover" loading="lazy"><figcaption class="sr-only">Floresta amazônica vista de cima</figcaption></figure>
<div class="notice warn" role="note" style="margin-bottom:34px"><strong>Transparência sobre os números</strong><p>Este site <b>não apresenta cifras de ganho econômico, de saúde ou de clima</b>: os valores macroeconômicos do dossiê não foram confirmados por estudos primários (Livro de Referência, cap. 26). O que segue são efeitos buscados pelos mecanismos do texto e cálculos com seus parâmetros.</p></div>
<div class="sec-head"><p class="eyebrow">Efeitos buscados</p><h2 class="h-xl">Nove áreas, nove mecanismos</h2></div>
<div class="fx-grid">${effects.map((e, i) => `<article class="fx"><span class="k">${e.tag}${e.youth ? ' · juventude prevista nos artigos' : ''}</span><h3>${e.area}</h3><p><b>Mecanismo.</b> ${e.mec}</p><p><b>Efeito buscado.</b> ${e.ef}</p><p class="cond"><b>Condição.</b> ${e.cond}</p><p class="cond"><b>Como medir.</b> ${e.ind}</p><a class="link-arrow" href="${R('texto-integral/')}">Arts. ${e.arts}</a></article>`).join('')}</div></div></section>
<section class="section paper" id="simulador"><div class="wrap">
<div class="sec-head"><p class="eyebrow">Simulador</p><h2 class="h-xl">Calcule com os parâmetros da minuta</h2><p class="lead">Digite valores e veja o que o texto prevê. É uma simulação didática: não prevê resultados nem substitui estudo técnico.</p></div>
<div class="sim-tabs" role="tablist" aria-label="Simuladores">${sims.map((s, i) => `<button type="button" role="tab" id="tab-${s[0]}" aria-selected="${i === 0}" data-tab="${s[0]}">${s[1]}</button>`).join('')}</div>
${sims.map((s, i) => `<div class="sim" data-panel="${s[0]}" ${i ? 'hidden' : ''} role="tabpanel" aria-labelledby="tab-${s[0]}"><div><p class="arts">${s[3]}</p><h3>${s[2]}</h3><p class="muted">${s[4]}</p></div>
<form data-sim="${s[0]}" novalidate><div class="sim-in">${s[5]}</div></form><div class="sim-out" data-out aria-live="polite"></div><p class="assume"><b>Premissas:</b> ${s[6]}</p></div>`).join('')}
</div></section>
<section class="section"><div class="wrap"><p class="eyebrow">Gostou? Opine.</p><h2 class="h-lg" style="margin:12px 0 22px;max-width:20ch">Depois de conhecer a proposta, diga o que pensa</h2><a class="btn" href="${R('enquete/')}">Ir para a enquete ${ico()}</a></div></section>` });

// ---------- TEXTO INTEGRAL ----------
add({ path: 'texto-integral/', title: 'Texto integral da minuta — 90 artigos', crumb: 'Texto integral', scripts: ['reader.js'],
  desc: 'Leia a redação integral dos 90 artigos do projeto do Estatuto da Floresta Sustentável, com busca e filtro por capítulo. Minuta de projeto de lei, não lei vigente.',
  body: R => `${pageHero({ eyebrow: 'Apêndice A', h1: 'Texto integral da minuta', lead: 'Projeto de Lei nº ____, de 2026. O Congresso Nacional decreta…', crumbs: [['Início', R('')], ['Texto integral', '']] })}
<section class="paper"><div class="reader-bar"><div class="wrap row"><label class="sr-only" for="q">Buscar no texto</label><input class="input" id="q" type="search" placeholder="Buscar: restauração, 120 dias, multa…" style="flex:1 1 220px;max-width:420px"><label class="sr-only" for="chap">Filtrar por capítulo</label><select class="input" id="chap" style="flex:0 1 280px"><option value="">Todos os capítulos</option>${chapters.map(c => `<option value="${c.n}">${c.n}. ${c.short}</option>`).join('')}</select><span class="count" id="count-res" role="status" aria-live="polite">90 artigos de 90</span></div></div>
<div class="section" style="padding-top:36px"><div class="wrap"><div class="prose" style="max-width:80ch">
<div class="notice warn" role="note"><strong>Reprodução fiel</strong><p>${esc(NOTICE_MODEL)} Metas e referências numéricas do texto são propostas condicionadas, não resultados.</p></div>
<p id="none" hidden class="notice" style="margin-top:20px">Nenhum artigo encontrado. Tente outra palavra.</p>
${data.map((c, ci) => `<div class="chap-sep" data-chap="${ci + 1}" id="cap-${ci + 1}"><small>Capítulo ${c.roman}</small><h2>${esc(c.title)}</h2></div>${c.articles.map(x => `<article class="art" id="art-${x.n}" data-chap="${ci + 1}"><h3><span class="n">${x.n}º</span> ${esc(x.title)}${YOUTH_ARTS.includes(x.n) ? youthTag : ''}<button class="linkbtn perma" type="button" data-copy="#art-${x.n}">Copiar link</button></h3><p>${esc(x.body)}</p></article>`).join('')}`).join('')}
</div></div></div></section>` });

// ---------- ENQUETE ----------
add({ path: 'enquete/', title: 'Enquete: apoio ou contra o Estatuto da Floresta', crumb: 'Enquete', scripts: ['poll.js'],
  desc: 'Participe da enquete pré-petição, sem cadastro: apoio ou contra o projeto do Estatuto da Floresta Sustentável. Veja os números e o espaço da petição no e-Cidadania.',
  body: R => `${pageHero({ eyebrow: 'Pré-petição', h1: 'Apoio ou contra?', lead: 'Um teste rápido, sem cadastro, antes da petição pública no e-Cidadania.', crumbs: [['Início', R('')], ['Enquete', '']] })}
<section class="section"><div class="wrap" style="display:grid;gap:28px;grid-template-columns:repeat(auto-fit,minmax(min(100%,440px),1fr));align-items:start">
<div>${pollBlock(R, 'h2', 'votar')}</div>
<div><div class="sec-head"><h2 class="h-lg">Como funciona</h2></div><ul class="guard" style="list-style:none;padding:0;margin:0 0 28px;grid-template-columns:1fr"><li><div><b>Sem cadastro</b><span>Você só escolhe APOIO ou CONTRA. Não pedimos nome, e-mail ou documento.</span></div></li><li><div><b>Um voto por navegador</b><span>O navegador guarda que você já votou. Isso reduz votos repetidos, mas não impede fraude deliberada.</span></div></li><li><div><b>Números reais</b><span>Mostramos apenas os votos efetivamente recebidos. Se o servidor estiver fora do ar, avisamos.</span></div></li><li><div><b>Não é a petição</b><span>A enquete não vale como assinatura no e-Cidadania nem como pesquisa de opinião.</span></div></li></ul>
${petitionBlock(R)}</div></div></section>` });

// ---------- SOBRE ----------
add({ path: 'sobre/', title: 'Sobre o EFS Brasil', crumb: 'Sobre',
  desc: 'Quem propõe o Estatuto da Floresta Sustentável, o que o EFS Brasil é e o que não é: iniciativa independente da sociedade civil, apartidária e sem poder de fiscalização.',
  body: R => `${pageHero({ eyebrow: 'Sobre', h1: 'Uma proposta da sociedade civil', lead: 'Pela proteção das florestas. Pela segurança da população. Pelo futuro do Brasil.', crumbs: [['Início', R('')], ['Sobre', '']] })}
<section class="section paper"><div class="wrap narrow prose">
<h2>O que é o EFS Brasil</h2><p>O EFS Brasil — Estatuto da Floresta Sustentável é a denominação de uma proposta de projeto de lei federal, com 90 artigos em 15 capítulos, que reúne diretrizes e instrumentos para uma política pública ambiental integrada. A autoria da proposta e o texto institucional são de <b>Vilson Arthur Dantas Maia Saraiva</b>.</p>
<h2>Princípios</h2><ul><li><b>Independência.</b> Autonomia perante interesses partidários, econômicos ou particulares. Ser apartidário não é evitar o debate público.</li><li><b>Evidência e integridade.</b> Propostas partem de problemas identificados e diferenciam fato, hipótese, previsão, opinião e proposta. Quando faltam dados, a resposta correta é sinalizar a lacuna.</li><li><b>Responsabilidade pública.</b> Reconhecer correções, divulgar critérios e comunicar os limites dos resultados.</li></ul>
<h2>O que o EFS Brasil não é</h2><p>Não é órgão de governo, partido, universidade, órgão fiscalizador nem parte do Poder Legislativo. Não aplica multas, não concede licenças, não embarga atividades e não exerce poder de polícia. Esses atos dependem de autoridades legalmente competentes.</p>
<div class="notice warn"><strong>Transparência</strong><p>Este site não afirma apoio, patrocínio ou aprovação de nenhum órgão, parlamentar ou instituição. Convergência temática, quando documentada, não equivale a apoio oficial.</p></div>
<h2>Quer contribuir?</h2><p>Leia a proposta, <a href="${R('enquete/')}">participe da enquete</a> ou <a href="${R('contato/')}">envie uma sugestão</a>.</p></div></section>` });

// ---------- FONTES E LIMITES ----------
add({ path: 'fontes-e-limites/', title: 'Fontes, status e limites da proposta', crumb: 'Fontes e limites',
  desc: 'Status de projeto, aviso jurídico, pontos que exigem validação antes do protocolo, leis citadas com links oficiais e glossário do Estatuto da Floresta Sustentável.',
  body: R => `${pageHero({ eyebrow: 'Transparência', h1: 'Fontes, status e limites', lead: 'O que é fato, o que é proposta e o que ainda precisa ser validado.', crumbs: [['Início', R('')], ['Fontes e limites', '']] })}
<section class="section paper"><div class="wrap narrow prose">
<div class="notice warn"><strong>Status</strong><p>${esc(NOTICE_MODEL)}</p></div>
<div class="notice" style="margin-top:16px"><strong>Aviso jurídico essencial</strong><p>O conteúdo deste site não é parecer jurídico vinculante, não atesta constitucionalidade integral e não substitui revisão por consultoria legislativa, assessoria jurídica, especialistas técnicos ou órgãos competentes.</p></div>
<h2>Regras de transparência</h2><ul><li>Nenhuma meta é apresentada como resultado alcançado.</li><li>Nenhum órgão, fundo, selo ou obrigação previsto só na minuta é descrito como existente.</li><li>Quando um dado não está demonstrado pelos documentos consultados, é tratado como pendência ou hipótese.</li></ul>
<h2 id="pendencias">Pontos que exigem validação antes do protocolo</h2><ol>${pendencias.map(p => `<li><b>${p[0]}.</b> ${p[1]}</li>`).join('')}</ol>
<h2 id="leis">Direito vigente relacionado</h2><p>Conforme o Livro de Referência (consulta com data de corte em 14 de novembro de 2026). Confira sempre o texto atualizado nos links oficiais.</p><ul>${refs.map(r => `<li><a href="${r[1]}" rel="noopener noreferrer" target="_blank">${r[0]}</a></li>`).join('')}</ul>
<h2 id="glossario">Glossário e siglas</h2><dl>${glossary.map(g => `<dt style="font-weight:700;margin-top:12px">${g[0]}</dt><dd style="margin:2px 0 0">${g[1]}</dd>`).join('')}</dl>
<h2>Histórico</h2><ul><li>Minuta ampliada revisada em 26/10/2026 (90 artigos, 15 capítulos).</li><li>Livro de referência: edição técnica de novembro de 2026.</li><li>Site publicado e atualizado em ${DATE}.</li></ul></div></section>` });

// ---------- CONTATO ----------
add({ path: 'contato/', title: 'Contato e sugestões', crumb: 'Contato', scripts: ['forms.js'],
  desc: 'Envie dúvidas, sugestões de melhoria ou pedidos de imprensa sobre o projeto do Estatuto da Floresta Sustentável.',
  body: R => `${pageHero({ eyebrow: 'Fale conosco', h1: 'Contato', lead: 'Dúvidas, sugestões sobre o texto ou pedidos de imprensa.', crumbs: [['Início', R('')], ['Contato', '']] })}
<section class="section"><div class="wrap">
<form id="contact-form" class="form" novalidate data-thanks="${R('obrigado/')}" aria-describedby="form-status">
<div id="form-summary" class="form-summary" role="alert" hidden></div>
<div class="field"><label for="nome">Nome</label><input class="input" id="nome" name="nome" autocomplete="name" required aria-describedby="err-nome"><span id="err-nome" class="err-msg"></span></div>
<div class="field"><label for="email">E-mail</label><input class="input" id="email" name="email" type="email" autocomplete="email" required aria-describedby="err-email"><span id="err-email" class="err-msg"></span></div>
<div class="field"><label for="assunto">Assunto</label><select class="input" id="assunto" name="assunto" required aria-describedby="err-assunto"><option value="">Selecione…</option><option>Dúvida sobre a proposta</option><option>Sugestão de melhoria do texto</option><option>Imprensa</option><option>Outro</option></select><span id="err-assunto" class="err-msg"></span></div>
<div class="field"><label for="mensagem">Mensagem</label><textarea class="input" id="mensagem" name="mensagem" required aria-describedby="err-mensagem hint-msg"></textarea><span id="hint-msg" class="hint">Até 2000 caracteres · <span id="count">0/2000</span></span><span id="err-mensagem" class="err-msg"></span></div>
<div class="hp" aria-hidden="true"><label for="website">Não preencha</label><input id="website" name="website" tabindex="-1" autocomplete="off"></div>
<div class="field"><div class="check"><input type="checkbox" id="consentimento" name="consentimento" aria-describedby="err-consentimento"><label for="consentimento" style="font-weight:400">Concordo com o uso dos meus dados para responder a esta mensagem, conforme a <a href="${R('privacidade/')}">Política de Privacidade</a>.</label></div><span id="err-consentimento" class="err-msg"></span></div>
<div><button class="btn" type="submit">Enviar mensagem ${ico()}</button></div>
<p id="form-status" class="poll-status" role="status" aria-live="polite"></p>
</form></div></section>` });

// ---------- OBRIGADO ----------
add({ path: 'obrigado/', title: 'Mensagem enviada — obrigado', noindex: true, bodyClass: 'thanks',
  desc: 'Recebemos sua mensagem. Obrigado por contribuir com o debate sobre o Estatuto da Floresta Sustentável.',
  body: R => `<section class="page-hero" style="min-height:70vh;display:grid;align-items:center"><div class="wrap"><p class="eyebrow">Tudo certo</p><h1>Obrigado!</h1><p class="lead">Sua mensagem foi enviada. Enquanto isso, conheça a proposta ou dê sua opinião na enquete.</p><div class="hero-ctas" style="margin-top:28px"><a class="btn" href="${R('enquete/')}">Ir para a enquete ${ico()}</a><a class="btn ghost" href="${R('estatuto/')}">Entender a proposta</a></div></div></section>` });

// ---------- PRIVACIDADE ----------
const todo = t => `<mark class="todo" style="background:#ffe38a;color:#000;padding:0 4px;border-radius:3px">[PREENCHER: ${t}]</mark>`;
add({ path: 'privacidade/', title: 'Política de Privacidade (LGPD)', crumb: 'Privacidade',
  desc: 'Como o site do EFS Brasil trata dados: enquete sem cadastro, formulário de contato, cookies, estatísticas somente com consentimento e seus direitos pela LGPD.',
  body: R => `${pageHero({ eyebrow: 'Legal', h1: 'Política de Privacidade', lead: 'Em linguagem simples: o que coletamos, por quê e como você controla.', crumbs: [['Início', R('')], ['Privacidade', '']] })}
<section class="section paper"><div class="wrap narrow prose">
<p><i>Última atualização: ${DATE}.</i></p>
<div class="notice"><strong>Resumo</strong><p>A enquete não pede nome, e-mail nem documento. Estatísticas de acesso só funcionam se você aceitar. Mensagens de contato são usadas apenas para responder.</p></div>
<h2>1. Quem é o controlador</h2><p>Controlador dos dados: a equipe responsável pelo site EFS Brasil. Para exercer seus direitos, use o <a href="${R('contato/')}">formulário de contato</a>.</p>
<h2>2. Dados tratados e finalidades</h2><ul>
<li><b>Enquete (apoio/contra).</b> Registramos a opção escolhida e um identificador técnico anônimo (cookie ou armazenamento local) para limitar votos repetidos. Não pedimos dados pessoais. Base legal: legítimo interesse na integridade da enquete (LGPD, art. 7º, IX).</li>
<li><b>Formulário de contato.</b> Nome, e-mail, assunto e mensagem, para responder. Base legal: consentimento (art. 7º, I).</li>
<li><b>Estatísticas de acesso (opcional).</b> Páginas visitadas, de forma agregada, somente após consentimento (art. 7º, I).</li>
<li><b>Dados técnicos de servidor.</b> Endereço IP e data/hora em registros de segurança, por tempo limitado.</li></ul>
<h2>3. Cookies e armazenamento local</h2><div style="overflow-x:auto"><table style="border-collapse:collapse;width:100%;font-size:.95rem"><thead><tr><th style="text-align:left;padding:8px;border-bottom:2px solid #0f3d26">Nome</th><th style="text-align:left;padding:8px;border-bottom:2px solid #0f3d26">Tipo</th><th style="text-align:left;padding:8px;border-bottom:2px solid #0f3d26">Finalidade</th></tr></thead><tbody>
<tr><td style="padding:8px">efs-consent-v1</td><td>Essencial</td><td>Lembrar sua escolha de cookies.</td></tr>
<tr><td style="padding:8px">efs-poll-voted-v1</td><td>Essencial</td><td>Lembrar que este navegador já votou.</td></tr>
<tr><td style="padding:8px">efs_voter</td><td>Essencial</td><td>Cookie anônimo do servidor da enquete para evitar votos repetidos.</td></tr>
<tr><td style="padding:8px">Analytics</td><td>Opcional</td><td>Estatísticas agregadas; só após consentimento.</td></tr></tbody></table></div>
<p>Você pode mudar a escolha a qualquer momento em “Preferências de cookies”, no rodapé. Respeitamos o sinal Global Privacy Control: com ele, estatísticas começam desativadas.</p>
<h2>4. Compartilhamento</h2><p>Não vendemos dados. Podemos usar prestadores de hospedagem e infraestrutura estritamente para operar o site.</p>
<h2>5. Retenção</h2><p>Mensagens: guardadas apenas pelo tempo necessário para responder. Votos da enquete: mantidos de forma anônima e agregada. Registros de segurança: por tempo limitado.</p>
<h2>6. Seus direitos (LGPD, art. 18)</h2><p>Confirmação de tratamento, acesso, correção, anonimização, eliminação, portabilidade, informação sobre compartilhamento e revogação do consentimento. Solicite pelo formulário de contato. Você também pode reclamar à Autoridade Nacional de Proteção de Dados (ANPD).</p>
<h2>7. Crianças e adolescentes</h2><p>O site não coleta intencionalmente dados pessoais de menores. Menores de 18 anos devem usar o formulário de contato com supervisão de responsável.</p>
<h2>8. Segurança</h2><p>Usamos HTTPS, limitação de acesso e minimização de dados. Nenhum sistema é totalmente imune a incidentes; em caso de incidente relevante, comunicaremos conforme a lei.</p>
<h2>9. Mudanças</h2><p>Alterações serão publicadas nesta página com nova data.</p></div></section>` });

// ---------- TERMOS ----------
add({ path: 'termos/', title: 'Termos de Uso e natureza do conteúdo', crumb: 'Termos',
  desc: 'Termos de uso do site do EFS Brasil: natureza de projeto do conteúdo, limites da enquete, uso permitido, propriedade intelectual e responsabilidades.',
  body: R => `${pageHero({ eyebrow: 'Legal', h1: 'Termos de Uso', lead: 'Regras simples para usar o site com clareza sobre o que ele é.', crumbs: [['Início', R('')], ['Termos', '']] })}
<section class="section paper"><div class="wrap narrow prose">
<p><i>Última atualização: ${DATE}.</i></p>
<h2>1. Natureza do conteúdo</h2><p>${esc(NOTICE_MODEL)} O site tem caráter informativo e não constitui parecer jurídico, aconselhamento técnico, oferta ou promessa de resultado.</p>
<h2>2. Enquete</h2><p>A enquete “apoio ou contra” é informal, não científica e não vinculante. Os números refletem apenas quem participou e não representam a população. A enquete não substitui nem equivale a assinaturas de petição no Portal e-Cidadania. É vedado usar automação ou meios para manipular os resultados.</p>
<h2>3. Simuladores</h2><p>Os cálculos usam parâmetros da minuta e valores digitados por você. São ilustrativos, não preveem resultados e não substituem estudos técnicos, jurídicos ou fiscais.</p>
<h2>4. Uso permitido</h2><p>Você pode ler, citar e compartilhar o conteúdo, indicando a fonte. Não use o site para fins ilícitos, para enviar conteúdo ofensivo ou para tentar comprometer sua segurança.</p>
<h2>5. Propriedade intelectual</h2><p>Textos, marca e identidade visual do EFS Brasil pertencem aos seus titulares. Leis e normas citadas são de domínio público. O conteúdo editorial deste site é licenciado sob <a href="https://creativecommons.org/licenses/by-nc/4.0/deed.pt-br" rel="noopener" target="_blank">Creative Commons Atribuição-NãoComercial 4.0 Internacional (CC BY-NC 4.0)</a>: você pode copiar, redistribuir e adaptar, desde que dê o crédito adequado e não use para fins comerciais.</p>
<h2>6. Links externos</h2><p>Links para sites oficiais e de terceiros são oferecidos por conveniência; não controlamos seu conteúdo.</p>
<h2>7. Responsabilidade</h2><p>Buscamos manter informações corretas e corrigimos erros quando identificados, mas não garantimos ausência de falhas ou disponibilidade ininterrupta.</p>
<h2>8. Lei aplicável</h2><p>Estes termos seguem as leis do Brasil. Eventuais disputas seguem o foro previsto na legislação brasileira.</p></div></section>` });

// ---------- 404 ----------
add({ path: '404.html', title: 'Página não encontrada', noindex: true,
  desc: 'A página que você procura não existe ou mudou de lugar. Volte ao início ou leia o Estatuto da Floresta Sustentável.',
  body: R => `<section class="page-hero" style="min-height:75vh;display:grid;align-items:center"><div class="wrap"><p class="eyebrow">Erro 404</p><h1>Trilha perdida</h1><p class="lead">Não encontramos esta página. Ela pode ter mudado de lugar.</p><div class="hero-ctas" style="margin-top:28px"><a class="btn" href="${R('')}">Voltar ao início ${ico()}</a><a class="btn ghost" href="${R('texto-integral/')}">Ler o texto integral</a><a class="btn ghost" href="${R('enquete/')}">Enquete</a></div></div></section>` });

// ---------- EMIT ----------
fs.rmSync(OUT, { recursive: true, force: true }); fs.mkdirSync(OUT, { recursive: true });
const copy = (s, d) => { fs.mkdirSync(path.dirname(d), { recursive: true }); fs.copyFileSync(s, d); };
const cp = (src, dst) => { for (const f of fs.readdirSync(src, { withFileTypes: true })) { const s = path.join(src, f.name), d = path.join(dst, f.name); f.isDirectory() ? cp(s, d) : copy(s, d); } };
cp('src/css', path.join(OUT, 'css')); cp('src/js', path.join(OUT, 'js')); cp('src/assets', path.join(OUT, 'assets'));
for (const f of ['icon-master.png', 'icon-512.png']) fs.rmSync(path.join(OUT, 'assets', f), { force: true });
for (const P of pages) {
  const file = P.path.endsWith('.html') ? P.path : P.path + 'index.html';
  const d = path.join(OUT, file); fs.mkdirSync(path.dirname(d), { recursive: true }); fs.writeFileSync(d, layout(P));
}
const idx = pages.filter(p => !p.noindex);
fs.writeFileSync(path.join(OUT, 'sitemap.xml'), `<?xml version="1.0" encoding="UTF-8"?>\n<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n${idx.map(p => `  <url><loc>${SITE}/${p.path}</loc><lastmod>2026-11-14</lastmod><changefreq>${p.path === '' ? 'weekly' : 'monthly'}</changefreq><priority>${p.path === '' ? '1.0' : p.path.startsWith('estatuto/capitulo') ? '0.6' : '0.8'}</priority></url>`).join('\n')}\n</urlset>\n`);
fs.writeFileSync(path.join(OUT, 'robots.txt'), `User-agent: *\nAllow: /\nDisallow: /api/\n\nSitemap: ${SITE}/sitemap.xml\n`);
fs.writeFileSync(path.join(OUT, 'site.webmanifest'), JSON.stringify({ name: 'EFS Brasil — Estatuto da Floresta Sustentável', short_name: 'EFS Brasil', lang: 'pt-BR', start_url: './', display: 'standalone', background_color: '#06100b', theme_color: '#0f3d26', icons: [{ src: 'assets/icons/icon-192.png', sizes: '192x192', type: 'image/png' }, { src: 'assets/icons/icon-512.png', sizes: '512x512', type: 'image/png' }, { src: 'assets/icons/maskable-512.png', sizes: '512x512', type: 'image/png', purpose: 'maskable' }] }, null, 2));
console.log(`OK: ${pages.length} páginas → ${OUT} (${SITE})`);
