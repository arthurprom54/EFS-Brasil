// Servidor mínimo, sem dependências: serve /site e expõe /api/poll e /api/contact.
// Uso: node server/server.mjs   (PORT=8080 SITE_DIR=../site DATA_DIR=./data)
import http from 'node:http'; import fs from 'node:fs'; import path from 'node:path'; import crypto from 'node:crypto'; import zlib from 'node:zlib';
import { fileURLToPath } from 'node:url';
const here = path.dirname(fileURLToPath(import.meta.url));
const PORT = +process.env.PORT || 8080, SITE = path.resolve(process.env.SITE_DIR || path.join(here, '../site')), DATA = path.resolve(process.env.DATA_DIR || path.join(here, 'data'));
const SECRET = process.env.VOTE_SECRET || crypto.randomBytes(16).toString('hex'); // defina VOTE_SECRET fixo em produção
fs.mkdirSync(DATA, { recursive: true });
const POLL = path.join(DATA, 'poll.json'), CONTACT = path.join(DATA, 'contact.jsonl');
let poll = { apoio: 0, contra: 0, voters: {} }; try { poll = JSON.parse(fs.readFileSync(POLL, 'utf8')); } catch {}
const save = () => fs.writeFileSync(POLL, JSON.stringify(poll));
const hits = new Map(); // limite por IP
function limited(ip, key, max, win) { const k = key + ip, n = Date.now(), a = (hits.get(k) || []).filter(t => n - t < win); a.push(n); hits.set(k, a); return a.length > max; }
const mime = { '.html': 'text/html; charset=utf-8', '.css': 'text/css; charset=utf-8', '.js': 'text/javascript; charset=utf-8', '.json': 'application/json', '.webmanifest': 'application/manifest+json', '.xml': 'application/xml', '.txt': 'text/plain; charset=utf-8', '.png': 'image/png', '.jpg': 'image/jpeg', '.webp': 'image/webp', '.ico': 'image/x-icon', '.woff': 'font/woff', '.woff2': 'font/woff2', '.svg': 'image/svg+xml', '.mp4': 'video/mp4' };
const sec = { 'X-Content-Type-Options': 'nosniff', 'Referrer-Policy': 'strict-origin-when-cross-origin', 'X-Frame-Options': 'DENY', 'Permissions-Policy': 'camera=(), microphone=(), geolocation=()', 'Content-Security-Policy': "default-src 'self'; img-src 'self' data:; style-src 'self' 'unsafe-inline'; script-src 'self' https://plausible.io https://www.googletagmanager.com; connect-src 'self' https://plausible.io https://*.google-analytics.com; font-src 'self'; frame-ancestors 'none'; base-uri 'self'; form-action 'self'" };
const json = (res, code, obj, extra = {}) => { res.writeHead(code, { 'Content-Type': 'application/json', 'Cache-Control': 'no-store', ...sec, ...extra }); res.end(JSON.stringify(obj)); };
const body = req => new Promise((ok, no) => { let b = ''; req.on('data', c => { b += c; if (b.length > 20000) { no(new Error('big')); req.destroy(); } }); req.on('end', () => ok(b)); });
const cookie = req => Object.fromEntries((req.headers.cookie || '').split(/;\s*/).filter(Boolean).map(c => { const i = c.indexOf('='); return [c.slice(0, i), c.slice(i + 1)]; }));
const pub = () => ({ apoio: poll.apoio, contra: poll.contra });
http.createServer(async (req, res) => {
  const u = new URL(req.url, 'http://x'), ip = (req.headers['x-forwarded-for'] || req.socket.remoteAddress || '').split(',')[0].trim();
  try {
    if (u.pathname === '/api/poll') {
      const id = cookie(req).efs_voter, vid = id && /^[a-f0-9]{32}$/.test(id) ? id : null;
      if (req.method === 'GET') return json(res, 200, { ...pub(), voted: vid && poll.voters[vid] || null });
      if (req.method === 'POST') {
        if (limited(ip, 'v', 30, 3600e3)) return json(res, 429, { error: 'limite' });
        let c; try { c = JSON.parse(await body(req)).choice; } catch { return json(res, 400, { error: 'json' }); }
        if (c !== 'apoio' && c !== 'contra') return json(res, 400, { error: 'opção inválida' });
        const nid = vid || crypto.randomBytes(16).toString('hex'), ck = { 'Set-Cookie': `efs_voter=${nid}; Max-Age=31536000; Path=/; SameSite=Lax; HttpOnly${process.env.INSECURE_COOKIE ? '' : '; Secure'}` };
        if (poll.voters[nid]) return json(res, 409, { ...pub(), voted: poll.voters[nid] }, ck);
        poll.voters[nid] = c; poll[c]++; save(); return json(res, 200, { ...pub(), voted: c }, ck);
      }
      return json(res, 405, { error: 'método' });
    }
    if (u.pathname === '/api/contact' && req.method === 'POST') {
      if (limited(ip, 'c', 5, 3600e3)) return json(res, 429, { error: 'limite' });
      let o; try { o = JSON.parse(await body(req)); } catch { return json(res, 400, { error: 'json' }); }
      const ok = typeof o.nome === 'string' && o.nome.trim().length >= 3 && /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/.test(o.email || '') && typeof o.mensagem === 'string' && o.mensagem.trim().length >= 10 && o.mensagem.length <= 2000 && o.consentimento === true;
      if (!ok) return json(res, 422, { error: 'dados inválidos' });
      fs.appendFileSync(CONTACT, JSON.stringify({ ts: new Date().toISOString(), nome: o.nome.trim().slice(0, 120), email: o.email.trim().slice(0, 160), assunto: String(o.assunto || '').slice(0, 80), mensagem: o.mensagem.trim() }) + '\n');
      return json(res, 200, { ok: true });
    }
    if (req.method !== 'GET' && req.method !== 'HEAD') return json(res, 405, { error: 'método' });
    let p = decodeURIComponent(u.pathname); if (p.endsWith('/')) p += 'index.html';
    let f = path.join(SITE, p); if (!f.startsWith(SITE)) return json(res, 403, { error: 'proibido' });
    if (!fs.existsSync(f) && fs.existsSync(f + '/index.html')) { res.writeHead(301, { Location: p + '/' }); return res.end(); }
    if (!fs.existsSync(f) || fs.statSync(f).isDirectory()) { const nf = path.join(SITE, '404.html'); res.writeHead(404, { 'Content-Type': mime['.html'], ...sec }); return res.end(fs.existsSync(nf) ? fs.readFileSync(nf) : 'Não encontrado'); }
    const ext = path.extname(f), buf = fs.readFileSync(f), cc = /\.(woff2?|png|jpg|webp|ico)$/.test(ext) ? 'public, max-age=31536000, immutable' : ext === '.html' ? 'no-cache' : 'public, max-age=3600';
    const h = { 'Content-Type': mime[ext] || 'application/octet-stream', 'Cache-Control': cc, ...sec };
    if (/^(\.html|\.css|\.js|\.xml|\.txt|\.json|\.webmanifest)$/.test(ext) && /gzip/.test(req.headers['accept-encoding'] || '')) { h['Content-Encoding'] = 'gzip'; h.Vary = 'Accept-Encoding'; res.writeHead(200, h); return res.end(zlib.gzipSync(buf)); }
    res.writeHead(200, h); res.end(buf);
  } catch (e) { json(res, 500, { error: 'erro interno' }); }
}).listen(PORT, () => console.log(`EFS Brasil em http://localhost:${PORT}  (site: ${SITE})`));
