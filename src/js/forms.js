/* Formulário de contato: validação acessível, estados de carregamento e erro. */
(function () {
  "use strict";
  var cfg = window.EFS_CONFIG || {}, f = document.getElementById("contact-form"); if (!f) return;
  var summary = document.getElementById("form-summary"), status = document.getElementById("form-status"), btn = f.querySelector("[type=submit]");
  var rules = {
    nome: function (v) { return v.trim().length >= 3 ? "" : "Informe seu nome (mínimo de 3 caracteres)."; },
    email: function (v) { return /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/.test(v.trim()) ? "" : "Informe um e-mail válido, como nome@exemplo.com."; },
    assunto: function (v) { return v ? "" : "Escolha um assunto."; },
    mensagem: function (v) { var n = v.trim().length; return n < 10 ? "Escreva ao menos 10 caracteres." : n > 2000 ? "A mensagem passa de 2000 caracteres." : ""; },
    consentimento: function (v, el) { return el.checked ? "" : "É necessário concordar com o tratamento dos dados para enviar a mensagem."; }
  };
  function check(el) {
    var r = rules[el.name]; if (!r) return ""; var msg = r(el.value, el), out = document.getElementById("err-" + el.name);
    el.setAttribute("aria-invalid", msg ? "true" : "false"); if (out) out.textContent = msg; return msg;
  }
  [].forEach.call(f.elements, function (el) { if (rules[el.name]) { el.addEventListener("blur", function () { check(el); }); el.addEventListener("input", function () { if (el.getAttribute("aria-invalid") === "true") check(el); }); } });
  var cc = document.getElementById("count"), ta = f.elements.mensagem; if (ta && cc) ta.addEventListener("input", function () { cc.textContent = ta.value.length + "/2000"; });
  f.addEventListener("submit", function (e) {
    e.preventDefault(); status.textContent = ""; status.className = "poll-status";
    var errs = []; [].forEach.call(f.elements, function (el) { if (rules[el.name]) { var m = check(el); if (m) errs.push({ el: el, m: m }); } });
    if (f.elements.website && f.elements.website.value) return; /* honeypot */
    if (errs.length) {
      summary.hidden = false; summary.innerHTML = "<strong>Corrija " + errs.length + (errs.length > 1 ? " campos" : " campo") + " para enviar:</strong><ul></ul>";
      errs.forEach(function (x) { var li = document.createElement("li"), a = document.createElement("a"); a.href = "#" + x.el.id; a.textContent = x.m; a.addEventListener("click", function (ev) { ev.preventDefault(); x.el.focus(); }); li.appendChild(a); summary.querySelector("ul").appendChild(li); });
      summary.setAttribute("tabindex", "-1"); summary.focus(); return;
    }
    summary.hidden = true;
    if (!cfg.FORM_ENDPOINT) { status.className = "poll-status err"; status.textContent = "O envio ainda não foi configurado pelo administrador do site (FORM_ENDPOINT em js/config.js). Sua mensagem NÃO foi enviada."; return; }
    var old = btn.innerHTML; btn.disabled = true; btn.innerHTML = '<span class="spinner" aria-hidden="true"></span> Enviando…'; status.textContent = "Enviando…";
    var payload = { nome: f.elements.nome.value.trim(), email: f.elements.email.value.trim(), assunto: f.elements.assunto.value, mensagem: f.elements.mensagem.value.trim(), consentimento: true };
    fetch(cfg.FORM_ENDPOINT, { method: "POST", headers: { "Content-Type": "application/json", Accept: "application/json" }, body: JSON.stringify(payload) })
      .then(function (r) { if (!r.ok) throw new Error("http " + r.status); location.href = f.getAttribute("data-thanks"); })
      .catch(function () { btn.disabled = false; btn.innerHTML = old; status.className = "poll-status err"; status.textContent = "Não foi possível enviar agora. Tente novamente em instantes."; });
  });
})();
