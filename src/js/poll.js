/* Enquete pré-petição (Apoio / Contra) — sem cadastro. Contagem real, nunca simulada.
   Modos: "api" (servidor em /server) ou "local" (apenas este navegador, com aviso explícito). */
(function () {
  "use strict";
  var cfg = window.EFS_CONFIG || {}, d = document;
  var LOCAL = "efs-poll-local-v1", VOTED = "efs-poll-voted-v1";
  var state = { apoio: null, contra: null, mode: "loading", voted: null, updated: null };
  function ls(k, v) { try { if (v === undefined) return JSON.parse(localStorage.getItem(k)); localStorage.setItem(k, JSON.stringify(v)); } catch (e) {} return null; }
  var nf = new Intl.NumberFormat("pt-BR");
  var roots = [].slice.call(d.querySelectorAll("[data-poll]"));
  state.voted = ls(VOTED);

  function pct(n, t) { return t ? Math.round((n / t) * 1000) / 10 : 0; }
  function render() {
    var loading = state.mode === "loading", t = (state.apoio || 0) + (state.contra || 0);
    roots.forEach(function (r) {
      ["apoio", "contra"].forEach(function (k) {
        var n = r.querySelector('[data-n="' + k + '"]'), p = r.querySelector('[data-pct="' + k + '"]'), b = r.querySelector('[data-bar="' + k + '"]');
        if (n) n.innerHTML = loading ? '<span class="skeleton" aria-hidden="true"></span><span class="sr-only">carregando</span>' : nf.format(state[k]);
        if (p) p.textContent = loading ? "" : String(pct(state[k], t)).replace(".", ",") + "%";
        if (b) b.style.width = loading ? "0" : pct(state[k], t) + "%";
      });
      var tot = r.querySelector("[data-total]"); if (tot) tot.innerHTML = loading ? '<span class="skeleton" aria-hidden="true"></span>' : nf.format(t);
      var up = r.querySelector("[data-updated]"); if (up && state.updated) up.textContent = state.updated.toLocaleTimeString("pt-BR", { hour: "2-digit", minute: "2-digit" });
      var mode = r.querySelector("[data-mode]");
      if (mode) { mode.hidden = state.mode !== "local"; }
      var voted = !!state.voted;
      r.querySelectorAll(".choice").forEach(function (c) { c.disabled = voted; c.setAttribute("aria-checked", String(state.voted ? state.voted === c.getAttribute("data-v") : c.getAttribute("aria-checked") === "true")); });
      var sub = r.querySelector("[data-submit]"); if (sub) { sub.disabled = voted || loading; }
      var st = r.querySelector("[data-status]");
      if (st && voted && !st.dataset.keep) { st.className = "poll-status ok"; st.textContent = "Seu voto neste navegador: " + (state.voted === "apoio" ? "APOIO" : "CONTRA") + ". Obrigado por participar."; }
    });
  }
  function setStatus(r, msg, cls) { var st = r.querySelector("[data-status]"); if (st) { st.dataset.keep = cls === "err" ? "1" : ""; st.className = "poll-status " + (cls || ""); st.textContent = msg; } }

  function load() {
    var url = cfg.POLL_API; if (!url) return Promise.resolve(fallback());
    var ctrl = window.AbortController ? new AbortController() : null; var to = setTimeout(function () { ctrl && ctrl.abort(); }, 6000);
    return fetch(url, { headers: { Accept: "application/json" }, credentials: "same-origin", signal: ctrl ? ctrl.signal : undefined })
      .then(function (r) { clearTimeout(to); if (!r.ok) throw new Error("http " + r.status); return r.json(); })
      .then(function (j) { if (typeof j.apoio !== "number" || typeof j.contra !== "number") throw new Error("formato"); state.apoio = j.apoio; state.contra = j.contra; state.mode = "api"; if (j.voted) { state.voted = j.voted; ls(VOTED, j.voted); } state.updated = new Date(); })
      .catch(function () { clearTimeout(to); fallback(); });
  }
  function fallback() { var l = ls(LOCAL) || { apoio: 0, contra: 0 }; state.apoio = l.apoio; state.contra = l.contra; state.mode = "local"; state.updated = new Date(); }

  function vote(choice, r) {
    if (state.voted) return setStatus(r, "Este navegador já registrou um voto.", "err");
    var btn = r.querySelector("[data-submit]"); var old = btn.innerHTML; btn.disabled = true; btn.innerHTML = '<span class="spinner" aria-hidden="true"></span> Registrando…';
    setStatus(r, "Registrando seu voto…", "");
    var done = function () { btn.innerHTML = old; render(); };
    if (state.mode === "api") {
      fetch(cfg.POLL_API, { method: "POST", headers: { "Content-Type": "application/json", Accept: "application/json" }, credentials: "same-origin", body: JSON.stringify({ choice: choice }) })
        .then(function (res) { return res.json().then(function (j) { return { res: res, j: j }; }); })
        .then(function (o) {
          if (o.res.ok || o.res.status === 409) { state.apoio = o.j.apoio; state.contra = o.j.contra; state.voted = o.j.voted || choice; ls(VOTED, state.voted); state.updated = new Date(); done(); setStatus(r, o.res.status === 409 ? "Este navegador já tinha um voto registrado." : "Voto registrado. Obrigado!", "ok"); r.querySelector("[data-status]").dataset.keep = "1"; }
          else if (o.res.status === 429) { done(); btn.disabled = false; setStatus(r, "Muitas tentativas. Aguarde alguns minutos e tente novamente.", "err"); }
          else throw new Error("http");
        })
        .catch(function () { done(); btn.disabled = false; setStatus(r, "Não foi possível registrar agora. Verifique sua conexão e tente de novo.", "err"); });
    } else {
      var l = ls(LOCAL) || { apoio: 0, contra: 0 }; l[choice]++; ls(LOCAL, l); state.apoio = l.apoio; state.contra = l.contra; state.voted = choice; ls(VOTED, choice); state.updated = new Date();
      setTimeout(function () { done(); setStatus(r, "Voto salvo apenas neste navegador (modo local).", "ok"); r.querySelector("[data-status]").dataset.keep = "1"; }, 350);
    }
  }

  roots.forEach(function (r) {
    var group = r.querySelector('[role="radiogroup"]'), choices = [].slice.call(r.querySelectorAll(".choice"));
    function select(c) { choices.forEach(function (x) { x.setAttribute("aria-checked", String(x === c)); x.tabIndex = x === c ? 0 : -1; }); var sub = r.querySelector("[data-submit]"); if (sub && !state.voted) sub.disabled = false; r.dataset.choice = c.getAttribute("data-v"); setStatus(r, "", ""); }
    choices.forEach(function (c, i) {
      c.tabIndex = i === 0 ? 0 : -1;
      c.addEventListener("click", function () { select(c); });
      c.addEventListener("keydown", function (e) { var k = e.key, j = i; if (k === "ArrowRight" || k === "ArrowDown") j = (i + 1) % choices.length; else if (k === "ArrowLeft" || k === "ArrowUp") j = (i - 1 + choices.length) % choices.length; else return; e.preventDefault(); choices[j].focus(); select(choices[j]); });
    });
    var sub = r.querySelector("[data-submit]");
    if (sub) { sub.disabled = true; sub.addEventListener("click", function () { var c = r.dataset.choice; if (!c) return setStatus(r, "Escolha APOIO ou CONTRA antes de votar.", "err"); vote(c, r); }); }
    var rf = r.querySelector("[data-refresh]"); if (rf) rf.addEventListener("click", function () { state.mode = state.mode === "local" ? "local" : "loading"; render(); load().then(render); });
  });
  render(); load().then(render);
  setInterval(function () { if (!d.hidden && state.mode === "api") load().then(render); }, 45000);

  /* petição e-Cidadania */
  d.querySelectorAll("[data-petition]").forEach(function (p) {
    var url = (cfg.PETITION_URL || "").trim(); var ok = /^https:\/\/[^\s]+$/i.test(url);
    if (!ok) return; p.setAttribute("data-state", "ready");
    var a = p.querySelector("[data-petition-link]"); if (a) { a.href = url; a.hidden = false; }
    var ph = p.querySelector("[data-petition-empty]"); if (ph) ph.hidden = true;
    var rd = p.querySelector("[data-petition-ready]"); if (rd) rd.hidden = false;
  });
})();
