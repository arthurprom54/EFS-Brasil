// Formulário de contato: valida e guarda a mensagem em Netlify Blobs (ver no painel: Blobs > efs-contato).
import { getStore } from "@netlify/blobs";
const out = (code, o) => new Response(JSON.stringify(o), { status: code, headers: { "Content-Type": "application/json", "Cache-Control": "no-store" } });
export default async (req) => {
  if (req.method !== "POST") return out(405, { error: "método" });
  let o; try { o = await req.json(); } catch { return out(400, { error: "json" }); }
  const ok = typeof o.nome === "string" && o.nome.trim().length >= 3 && /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/.test(o.email || "") && typeof o.mensagem === "string" && o.mensagem.trim().length >= 10 && o.mensagem.length <= 2000 && o.consentimento === true;
  if (!ok) return out(422, { error: "dados inválidos" });
  const store = getStore({ name: "efs-contato", consistency: "strong" });
  await store.setJSON(new Date().toISOString() + "-" + Math.random().toString(36).slice(2, 8), { nome: o.nome.trim().slice(0, 120), email: o.email.trim().slice(0, 160), assunto: String(o.assunto || "").slice(0, 80), mensagem: o.mensagem.trim() });
  return out(200, { ok: true });
};
export const config = { path: "/api/contact" };
