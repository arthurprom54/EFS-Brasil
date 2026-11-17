// Enquete global (apoio/contra) na Netlify: contagem única para todos os visitantes.
// Armazena em Netlify Blobs. Um voto por navegador (cookie assinado simples) + limite de taxa por IP.
import { getStore } from "@netlify/blobs";
const H = { "Content-Type": "application/json", "Cache-Control": "no-store" };
const out = (code, o, extra = {}) => new Response(JSON.stringify(o), { status: code, headers: { ...H, ...extra } });
const ck = r => Object.fromEntries((r.headers.get("cookie") || "").split(/;\s*/).filter(Boolean).map(c => { const i = c.indexOf("="); return [c.slice(0, i), c.slice(i + 1)]; }));
export default async (req, ctx) => {
  const store = getStore({ name: "efs-poll", consistency: "strong" });
  const id = ck(req).efs_voter, vid = id && /^[a-f0-9]{32}$/.test(id) ? id : null;
  const tally = async () => (await store.get("tally", { type: "json" })) || { apoio: 0, contra: 0 };
  if (req.method === "GET") {
    const t = await tally(), v = vid ? await store.get("v-" + vid) : null;
    return out(200, { apoio: t.apoio, contra: t.contra, voted: v });
  }
  if (req.method === "POST") {
    let c; try { c = (await req.json()).choice; } catch { return out(400, { error: "json" }); }
    if (c !== "apoio" && c !== "contra") return out(400, { error: "opção inválida" });
    const ip = ctx.ip || "x", hk = "ip-" + ip.replace(/[^a-f0-9.:]/gi, "_"), hour = Math.floor(Date.now() / 3600e3);
    const h = (await store.get(hk, { type: "json" })) || { hour, n: 0 };
    if (h.hour !== hour) { h.hour = hour; h.n = 0; }
    if (++h.n > 30) return out(429, { error: "limite" });
    await store.setJSON(hk, h);
    const nid = vid || [...crypto.getRandomValues(new Uint8Array(16))].map(b => b.toString(16).padStart(2, "0")).join("");
    const cookie = { "Set-Cookie": `efs_voter=${nid}; Max-Age=31536000; Path=/; SameSite=Lax; HttpOnly; Secure` };
    const prev = await store.get("v-" + nid);
    const t = await tally();
    if (prev) return out(409, { apoio: t.apoio, contra: t.contra, voted: prev }, cookie);
    await store.set("v-" + nid, c); t[c]++; await store.setJSON("tally", t);
    return out(200, { apoio: t.apoio, contra: t.contra, voted: c }, cookie);
  }
  return out(405, { error: "método" });
};
export const config = { path: "/api/poll" };
