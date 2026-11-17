/* Leitor do texto integral: busca, filtro por capítulo, destaque. */
(function () {
  "use strict";
  var q = document.getElementById("q"), sel = document.getElementById("chap"), count = document.getElementById("count-res"), none = document.getElementById("none");
  if (!q) return;
  var arts = [].slice.call(document.querySelectorAll(".art")), seps = [].slice.call(document.querySelectorAll(".chap-sep"));
  function norm(s) { return s.toLowerCase().normalize("NFD").replace(/[̀-ͯ]/g, ""); }
  arts.forEach(function (a) { a._t = norm(a.textContent); a._p = a.querySelector("p"); a._orig = a._p.innerHTML; });
  function esc(s) { return s.replace(/[.*+?^${}()|[\]\\]/g, "\\$&"); }
  function run() {
    var term = norm(q.value.trim()), ch = sel.value, shown = 0, vis = {};
    arts.forEach(function (a) {
      var ok = (!ch || a.dataset.chap === ch) && (!term || a._t.indexOf(term) > -1); a.hidden = !ok; if (ok) { shown++; vis[a.dataset.chap] = 1; }
      a._p.innerHTML = a._orig;
      if (ok && term.length > 2) { var re = new RegExp("(" + esc(q.value.trim()).replace(/[aáàâãä]/gi, "[aáàâãä]").replace(/[eéèêë]/gi, "[eéèêë]").replace(/[iíìîï]/gi, "[iíìîï]").replace(/[oóòôõö]/gi, "[oóòôõö]").replace(/[uúùûü]/gi, "[uúùûü]").replace(/[cç]/gi, "[cç]") + ")", "gi"); a._p.innerHTML = a._orig.replace(re, "<mark>$1</mark>"); }
    });
    seps.forEach(function (s) { s.hidden = !vis[s.dataset.chap]; });
    count.textContent = shown + (shown === 1 ? " artigo" : " artigos") + " de 90"; none.hidden = shown > 0;
  }
  q.addEventListener("input", run); sel.addEventListener("change", run); run();
  var ps = new URLSearchParams(location.search); if (ps.get("q")) { q.value = ps.get("q"); run(); }
})();
