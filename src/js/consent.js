/* Consentimento de cookies/armazenamento + carregamento condicional de analytics. */
(function () {
  "use strict";
  var KEY = "efs-consent-v1", cfg = window.EFS_CONFIG || {};
  var banner = document.getElementById("consent");
  function read() { try { return JSON.parse(localStorage.getItem(KEY)); } catch (e) { return null; } }
  function write(v) { try { localStorage.setItem(KEY, JSON.stringify(v)); } catch (e) {} }
  var gpc = !!(navigator.globalPrivacyControl || navigator.doNotTrack === "1");
  var loaded = false;
  function loadAnalytics() {
    var a = cfg.ANALYTICS || {}; if (loaded || !a.provider) return; loaded = true;
    function add(src, attrs) { var s = document.createElement("script"); s.async = true; s.src = src; for (var k in attrs) s.setAttribute(k, attrs[k]); document.head.appendChild(s); }
    if (a.provider === "plausible" && a.domain) add("https://plausible.io/js/script.js", { defer: "", "data-domain": a.domain });
    else if (a.provider === "umami" && a.src && a.id) add(a.src, { defer: "", "data-website-id": a.id });
    else if (a.provider === "ga4" && a.id) {
      window.dataLayer = window.dataLayer || []; window.gtag = function () { window.dataLayer.push(arguments); };
      gtag("js", new Date()); gtag("config", a.id, { anonymize_ip: true }); add("https://www.googletagmanager.com/gtag/js?id=" + encodeURIComponent(a.id), {});
    }
  }
  function open(showPrefs) {
    if (!banner) return; banner.classList.add("open"); banner.classList.toggle("show-prefs", !!showPrefs);
    document.body.classList.add("consent-open");
    var cb = document.getElementById("consent-analytics"); var cur = read(); if (cb) cb.checked = cur ? !!cur.analytics : false;
    if (showPrefs) { var t = banner.querySelector("h2"); t.setAttribute("tabindex", "-1"); t.focus({ preventScroll: true }); }
  }
  function close() { if (!banner) return; banner.classList.remove("open", "show-prefs"); document.body.classList.remove("consent-open"); }
  function decide(analytics) { write({ analytics: analytics, ts: new Date().toISOString() }); close(); if (analytics) loadAnalytics(); document.dispatchEvent(new CustomEvent("efs:consent", { detail: { analytics: analytics } })); }
  var c = read();
  if (c && c.analytics) loadAnalytics();
  if (!c) setTimeout(function () { open(false); }, 900);
  if (banner) {
    banner.addEventListener("click", function (e) {
      var b = e.target.closest("[data-consent]"); if (!b) return; var a = b.getAttribute("data-consent");
      if (a === "all") decide(true); else if (a === "essential") decide(false);
      else if (a === "prefs") banner.classList.toggle("show-prefs");
      else if (a === "save") decide(!!document.getElementById("consent-analytics").checked);
    });
    banner.addEventListener("keydown", function (e) { if (e.key === "Escape") { if (!read()) decide(false); else close(); } });
  }
  document.addEventListener("click", function (e) { var t = e.target.closest("[data-open-consent]"); if (t) { e.preventDefault(); open(true); } });
  var note = document.getElementById("gpc-note"); if (note && gpc) note.hidden = false;
})();
