/* Simuladores: calculam SOMENTE com parâmetros escritos na minuta + valores digitados pelo visitante.
   Não são previsões nem resultados. Funções puras expostas em window.EFSSim para teste. */
(function () {
  "use strict";
  var BRL = new Intl.NumberFormat("pt-BR", { style: "currency", currency: "BRL" });
  function N(n, d) { d = d || 0; return n.toLocaleString("pt-BR", { minimumFractionDigits: d, maximumFractionDigits: d }); }
  function clamp(v, a, b) { return Math.min(b, Math.max(a, v)); }
  var DAY = 86400000;
  function addDays(dt, n) { return new Date(dt.getTime() + n * DAY); }
  function addYears(dt, y) { var x = new Date(dt.getTime()); x.setUTCFullYear(x.getUTCFullYear() + y); return x; }
  function addMonths(dt, m) { var x = new Date(dt.getTime()); x.setUTCMonth(x.getUTCMonth() + m); return x; }
  function D(dt) { return dt.toLocaleDateString("pt-BR", { timeZone: "UTC" }); }

  var S = {};
  /* Arts. 33–36: Plano de Restauração Nativa */
  S.restauracao = function (i) {
    var area = i.terreno * 1.05;
    return { areaM2: area, ha: area / 10000, campos: area / 7140, gatilho: i.construida > 5000 || i.unidades > 50, porConstruida: i.construida > 5000, porUnidades: i.unidades > 50, especies: 40, anoIni: i.ano, anoFim: i.ano + 20 };
  };
  /* Art. 17: alerta antes da saturação (80%) e resposta em até 4 h quando prevista em contrato */
  S.residuos = function (i) {
    var alertaL = 0.8 * i.cap, atual = i.cap * i.nivel / 100;
    if (i.taxa <= 0) return { semEnchimento: true };
    var hFull = Math.max(0, (i.cap - atual) / i.taxa), jaAlerta = atual >= alertaL, hAlert = jaAlerta ? 0 : (alertaL - atual) / i.taxa;
    var margem = jaAlerta ? hFull : hFull - hAlert;
    return { jaAlerta: jaAlerta, hAlert: hAlert, hFull: hFull, margem: margem, cabe: margem >= i.resp, resp: i.resp, saturado: atual >= i.cap };
  };
  /* Arts. 39–40: até 10% da intensidade sem circulação, mantendo segurança */
  S.iluminacao = function (i) {
    var hs = clamp(i.hs, 0, i.h), base = i.n * i.w * i.h * 365 / 1000, red = i.n * i.w * hs * 0.9 * 365 / 1000;
    return { base: base, red: red, apos: base - red, pct: base ? red / base : 0, tarifa: i.tarifa > 0 ? red * i.tarifa : null, hs: hs };
  };
  /* Arts. 13, 24, 67, 87, 90: calendário legal */
  S.cronograma = function (i) {
    var vig = addDays(i.pub, 180), prot = addDays(vig, 180), marco = i.marco || vig;
    return { vig: vig, prot: prot, marco: marco, grande: addYears(marco, 3), media: addYears(marco, 5), micro: addYears(marco, 7), extG: addMonths(addYears(marco, 3), 24), extM: addMonths(addYears(marco, 5), 24), extP: addMonths(addYears(marco, 7), 24), marcoPadrao: !i.marco };
  };
  /* Arts. 76–77: faixa de multa, agravante e teto */
  S.sancoes = function (i) {
    var base = clamp(i.base, 5000, 50000000), fator = clamp(Math.round(i.fator), 1, 10), ag = Math.min(base * fator, 50000000), dia = clamp(i.diaria, 0, 1000000);
    return { base: base, baseAjustada: base !== i.base, fator: fator, agravada: ag, cap: base * fator > 50000000, dia: dia, diaAjustada: dia !== i.diaria, dias: i.dias, exposicao: dia * i.dias, passaTeto: dia * i.dias > 50000000 };
  };
  /* Art. 52: PA = (C×α) + (H×β) + (R×γ) — coeficientes ainda NÃO existem */
  S.pedagio = function (i) {
    var a = i.C * i.a, b = i.H * i.b, c = i.R * i.g, t = a + b + c;
    return { a: a, b: b, c: c, t: t, sa: t ? a / t : 0, sb: t ? b / t : 0, sc: t ? c / t : 0 };
  };
  /* Arts. 56 e 58: tetos PROPOSTOS de destinação (dependem de lei e orçamento) */
  S.destinacao = function (i) {
    return { ftt_multas: i.multas * 0.30, ftt_pa: i.pa * 0.10, fag: i.elegiveis * 0.20 };
  };
  window.EFSSim = S;

  function val(f, n) { var el = f.elements[n]; if (!el) return NaN; var v = String(el.value).replace(/\./g, function (m, off, s) { return /,/.test(s) ? "" : m; }).replace(",", "."); return v === "" ? NaN : parseFloat(v); }
  function row(k, v) { return "<div><dt>" + k + "</dt><dd>" + v + "</dd></div>"; }
  function flag(t, good) { return '<p class="flag' + (good ? " good" : "") + '">' + t + "</p>"; }
  var R = {
    restauracao: function (f) {
      var i = { terreno: val(f, "terreno"), construida: val(f, "construida") || 0, unidades: val(f, "unidades") || 0, ano: val(f, "ano") };
      if (!(i.terreno > 0)) return need("a área do terreno");
      var r = S.restauracao(i);
      return '<div class="big">' + N(r.areaM2) + '<small>m² de referência a restaurar (≥ 105% do terreno)</small></div><dl>' +
        row("Em hectares", N(r.ha, 2) + " ha — equivale a cerca de " + N(r.campos, 1) + " campos de futebol (105 × 68 m)") +
        row("Diversidade (art. 35)", "referência de pelo menos " + r.especies + " espécies nativas em projetos de grande escala, ajustável por decisão técnica motivada") +
        row("Manutenção (art. 36)", "referência de " + r.anoIni + " a " + r.anoFim + " (20 anos) para grandes empreendimentos") + "</dl>" +
        flag(r.gatilho ? "Pelos números informados, o empreendimento se enquadra na <b>referência inicial de triagem</b> do art. 33 (" + (r.porConstruida ? "área construída acima de 5.000 m²" : "") + (r.porConstruida && r.porUnidades ? " e " : "") + (r.porUnidades ? "mais de 50 unidades" : "") + "). O plano só é exigido quando a avaliação ambiental ou a regulamentação determinar." : "Abaixo dos gatilhos de triagem do art. 33 (área construída &gt; 5.000 m² ou &gt; 50 unidades). A avaliação ambiental ou critérios legais mais rigorosos ainda podem exigir o plano.", r.gatilho);
    },
    residuos: function (f) {
      var i = { cap: val(f, "cap"), nivel: val(f, "nivel"), taxa: val(f, "taxa"), resp: val(f, "resp") };
      if (!(i.cap > 0) || isNaN(i.nivel) || isNaN(i.taxa) || isNaN(i.resp)) return need("todos os campos");
      i.nivel = clamp(i.nivel, 0, 100); var r = S.residuos(i);
      if (r.semEnchimento) return flag("Com taxa de enchimento zero o recipiente nunca atinge o limite.", true);
      return '<div class="big">' + (r.jaAlerta ? "Alerta já devido" : N(r.hAlert, 1) + '<small>h até o alerta de 80%</small>') + '</div><dl>' +
        row("Até a saturação", N(r.hFull, 1) + " h") + row("Margem entre alerta e saturação", N(r.margem, 1) + " h") + "</dl>" +
        flag(r.cabe ? "Uma resposta operacional em até " + N(r.resp, 1) + " h <b>cabe na margem</b> entre o alerta e a saturação: o alerta antecipado permite coletar antes do transbordamento." : "A resposta de " + N(r.resp, 1) + " h <b>não cabe</b> na margem — o recipiente tenderia a saturar antes. Isso indicaria revisar capacidade, roteiro de coleta ou limiar de alerta.", r.cabe);
    },
    iluminacao: function (f) {
      var i = { n: val(f, "n"), w: val(f, "w"), h: val(f, "h"), hs: val(f, "hs"), tarifa: val(f, "tarifa") || 0 };
      if (!(i.n > 0 && i.w > 0 && i.h > 0) || isNaN(i.hs)) return need("pontos, potência e horas");
      var r = S.iluminacao(i);
      return '<div class="big">' + N(r.red) + '<small>kWh/ano a menos (' + N(r.pct * 100, 1) + '%)</small></div><dl>' +
        row("Consumo sem redução", N(r.base) + " kWh/ano") + row("Consumo com redução a 10% nas horas sem circulação", N(r.apos) + " kWh/ano") + (r.tarifa != null ? row("Valor aproximado pela tarifa informada", BRL.format(r.tarifa) + " por ano") : "") + "</dl>" +
        flag("Art. 40: a redução vale para áreas sensíveis com sensores, <b>sem circulação</b>, e só se mantidas a segurança viária, a acessibilidade e a resposta a emergências. Impossibilidade técnica deve ser documentada e compensada.", false);
    },
    cronograma: function (f) {
      var s = f.elements.pub.value; if (!s) return need("a data de publicação");
      var m = f.elements.marco.value, i = { pub: new Date(s + "T00:00:00Z"), marco: m ? new Date(m + "T00:00:00Z") : null }, r = S.cronograma(i);
      return '<div class="big">' + D(r.vig) + '<small>início da vigência (art. 90: 180 dias após a publicação)</small></div><dl>' +
        row("Protocolo de cooperação (art. 13)", "publicado em até 180 dias da vigência → até " + D(r.prot) + " (leitura literal: 360 dias após a publicação)") +
        row("Transição de sacolas fósseis (arts. 24 e 87), marco inicial em " + D(r.marco) + (r.marcoPadrao ? " (suposição: = vigência)" : ""), "grandes empresas até " + D(r.grande) + " · médias até " + D(r.media) + " · micro e pequenas até " + D(r.micro)) +
        row("Extensão possível (art. 67)", "até 24 meses, por decisão motivada e obrigação específica: " + D(r.extG) + " / " + D(r.extM) + " / " + D(r.extP)) + "</dl>" +
        flag("O marco inicial real dos prazos de transição é “a entrada em vigor dos requisitos técnicos aplicáveis” (art. 24) e depende de regulamento. As datas acima são ilustrativas.", false);
    },
    sancoes: function (f) {
      var i = { base: val(f, "base"), fator: val(f, "fator"), diaria: val(f, "diaria") || 0, dias: val(f, "dias") || 0 };
      if (!(i.base > 0) || isNaN(i.fator)) return need("valor-base e agravante");
      var r = S.sancoes(i);
      return '<div class="big">' + BRL.format(r.agravada) + '<small>multa após agravante (teto de R$ 50 mi)</small></div><dl>' +
        row("Multa-base considerada", BRL.format(r.base) + (r.baseAjustada ? " (ajustada à faixa de R$ 5 mil a R$ 50 mi do art. 76)" : "")) +
        row("Fator de agravamento (art. 77, até 10×)", "×" + r.fator + (r.cap ? " — o produto passaria de R$ 50 mi e foi limitado ao teto" : "")) +
        (i.dias > 0 ? row("Multa diária × " + N(i.dias) + " dias", BRL.format(r.exposicao) + " (diária considerada: " + BRL.format(r.dia) + (r.diaAjustada ? ", limitada a R$ 1 mi" : "") + ")") : "") + "</dl>" +
        flag("O agravamento (até 10×) só se aplica a descarte de resíduos perigosos em área especialmente protegida ou dano hídrico de gravidade excepcional, com nexo demonstrado. " + (r.passaTeto ? "A soma das diárias passa de R$ 50 mi; o texto <b>não esclarece</b> se o teto vale para essa soma — ponto de validação." : "Valores finais exigem motivação, proporcionalidade e dosimetria (art. 76)."), false);
    },
    pedagio: function (f) {
      var i = { C: val(f, "C"), H: val(f, "H"), R: val(f, "R"), a: val(f, "a"), b: val(f, "b"), g: val(f, "g") };
      if ([i.C, i.H, i.R, i.a, i.b, i.g].some(isNaN)) return need("todos os campos");
      var r = S.pedagio(i);
      return '<div class="big">' + N(r.t, 2) + '<small>pontuação ilustrativa (sem unidade)</small></div><dl>' +
        row("Carbono C × α", N(r.a, 2) + " (" + N(r.sa * 100, 1) + "%)") + row("Água H × β", N(r.b, 2) + " (" + N(r.sb * 100, 1) + "%)") + row("Resíduos R × γ", N(r.c, 2) + " (" + N(r.sc * 100, 1) + "%)") + "</dl>" +
        flag("<b>Art. 53: a fórmula não autoriza cobrança.</b> Os coeficientes α, β e γ ainda não existem — dependem de lei específica. Os valores aqui são didáticos e servem só para mostrar como cada termo pesa.", false);
    },
    destinacao: function (f) {
      var i = { multas: val(f, "multas") || 0, pa: val(f, "pa") || 0, elegiveis: val(f, "elegiveis") || 0 };
      var r = S.destinacao(i);
      return '<div class="big">' + BRL.format(r.ftt_multas + r.ftt_pa + r.fag) + '<small>soma dos tetos propostos (hipotético)</small></div><dl>' +
        row("Fundo de Transição Tecnológica — multas graves (até 30%)", BRL.format(r.ftt_multas)) + row("Fundo de Transição Tecnológica — Pedágio Ambiental (até 10%)", BRL.format(r.ftt_pa)) + row("Fundo de Amparo ao Guardião — multas elegíveis (até 20%)", BRL.format(r.fag)) + "</dl>" +
        flag("São <b>tetos de proposta</b>, não destinações automáticas (arts. 56 e 58): dependem de autorização legal e orçamentária, de arrecadação efetiva e de não contrariar vinculações existentes. O Pedágio Ambiental nem existe ainda.", false);
    }
  };
  function need(w) { return flag("Preencha " + w + " com números válidos para ver o resultado.", false); }

  var forms = [].slice.call(document.querySelectorAll("[data-sim]"));
  forms.forEach(function (f) {
    var out = f.parentElement.querySelector("[data-out]"), id = f.getAttribute("data-sim");
    function upd() { out.innerHTML = R[id](f); }
    f.addEventListener("input", upd); f.addEventListener("submit", function (e) { e.preventDefault(); upd(); });
    if (id === "cronograma" && !f.elements.pub.value) f.elements.pub.value = new Date().toISOString().slice(0, 10);
    upd();
  });
  /* abas */
  var tabs = [].slice.call(document.querySelectorAll("[data-tab]")), panels = [].slice.call(document.querySelectorAll("[data-panel]"));
  function show(id) { tabs.forEach(function (t) { t.setAttribute("aria-selected", String(t.getAttribute("data-tab") === id)); }); panels.forEach(function (p) { p.hidden = p.getAttribute("data-panel") !== id; }); }
  tabs.forEach(function (t, i) {
    t.addEventListener("click", function () { show(t.getAttribute("data-tab")); history.replaceState(null, "", "#sim-" + t.getAttribute("data-tab")); });
    t.addEventListener("keydown", function (e) { var j = i; if (e.key === "ArrowRight") j = (i + 1) % tabs.length; else if (e.key === "ArrowLeft") j = (i - 1 + tabs.length) % tabs.length; else return; e.preventDefault(); tabs[j].focus(); tabs[j].click(); });
  });
  var h = location.hash.match(/^#sim-(\w+)/); if (h && tabs.some(function (t) { return t.getAttribute("data-tab") === h[1]; })) show(h[1]);
})();
