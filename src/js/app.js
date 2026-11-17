/* EFS Brasil — comportamento global: navegação, animações, scrollytelling, contadores. */
(function () {
  "use strict";
  var d = document, root = d.documentElement, reduce = matchMedia("(prefers-reduced-motion: reduce)").matches;
  root.classList.remove("no-js");

  /* loader */
  var loader = d.getElementById("loader");
  function hideLoader() { if (loader) { loader.classList.add("done"); setTimeout(function () { loader.remove(); }, 600); } }
  if (d.readyState === "complete") hideLoader(); else addEventListener("load", hideLoader);
  setTimeout(hideLoader, 1400);

  /* header + progress */
  var header = d.querySelector(".site-header"), prog = d.querySelector(".progress"), ticking = false, sy = 0;
  var cta = d.querySelector(".sticky-cta");
  function onScroll() {
    sy = window.scrollY || 0;
    if (!ticking) { ticking = true; requestAnimationFrame(function () {
      ticking = false;
      if (header) header.classList.toggle("scrolled", sy > 24);
      var max = Math.max(1, d.documentElement.scrollHeight - innerHeight);
      if (prog) prog.style.setProperty("--p", Math.min(1, sy / max).toFixed(4));
      if (!reduce && hero && sy < innerHeight * 1.2) hero.style.setProperty("--sy", sy);
      if (cta) cta.classList.toggle("show", sy > 420);
    }); }
  }
  var hero = d.querySelector(".hero");
  addEventListener("scroll", onScroll, { passive: true }); onScroll();

  /* mobile menu */
  var mb = d.querySelector(".menu-btn"), mn = d.getElementById("mobile-nav");
  if (mb && mn) {
    function setMenu(o) { mb.setAttribute("aria-expanded", o); mb.setAttribute("aria-label", o ? "Fechar menu" : "Abrir menu"); var lb = mb.querySelector("b"); if (lb) lb.textContent = o ? "Fechar" : "Menu"; mn.classList.toggle("open", o); d.body.style.overflow = o ? "hidden" : ""; }
    mb.addEventListener("click", function () { setMenu(mb.getAttribute("aria-expanded") !== "true"); });
    mn.addEventListener("click", function (e) { if (e.target.closest("a")) setMenu(false); });
    d.addEventListener("keydown", function (e) { if (e.key === "Escape" && mn.classList.contains("open")) { setMenu(false); mb.focus(); } });
    
  }

  /* reveal */
  var rvs = [].slice.call(d.querySelectorAll(".rv"));
  if ("IntersectionObserver" in window && !reduce) {
    var io = new IntersectionObserver(function (es) { es.forEach(function (e) { if (e.isIntersecting) { e.target.classList.add("in"); io.unobserve(e.target); } }); }, { rootMargin: "0px 0px -8% 0px", threshold: .08 });
    rvs.forEach(function (el) { io.observe(el); });
  } else rvs.forEach(function (el) { el.classList.add("in"); });

  /* contadores */
  function fmt(n, dec) { return n.toLocaleString("pt-BR", { minimumFractionDigits: dec, maximumFractionDigits: dec }); }
  var cn = [].slice.call(d.querySelectorAll("[data-count]"));
  function runCount(el) {
    var to = parseFloat(el.getAttribute("data-count")), dec = (el.getAttribute("data-count").split(".")[1] || "").length, t0 = null, dur = 1400;
    if (reduce) { el.firstChild.nodeValue = fmt(to, dec); return; }
    function step(t) { if (!t0) t0 = t; var p = Math.min(1, (t - t0) / dur), e = 1 - Math.pow(1 - p, 4); el.firstChild.nodeValue = fmt(to * e, dec); if (p < 1) requestAnimationFrame(step); }
    requestAnimationFrame(step);
  }
  if ("IntersectionObserver" in window) {
    var co = new IntersectionObserver(function (es) { es.forEach(function (e) { if (e.isIntersecting) { runCount(e.target); co.unobserve(e.target); } }); }, { threshold: .6 });
    cn.forEach(function (el) { co.observe(el); });
  }

  /* scrollytelling */
  var story = d.querySelector(".story");
  if (story && "IntersectionObserver" in window) {
    var steps = [].slice.call(story.querySelectorAll(".step")), words = [].slice.call(story.querySelectorAll(".story-word span")), bgs = [].slice.call(story.querySelectorAll(".story-bg img")), cnt = story.querySelector(".story-count b");
    function setStep(i) {
      steps.forEach(function (s, k) { s.classList.toggle("on", k === i); });
      words.forEach(function (w, k) { w.classList.toggle("on", k === i); });
      bgs.forEach(function (b, k) { b.classList.toggle("on", b.getAttribute("data-step").split(",").indexOf(String(i)) > -1); });
      if (cnt) cnt.textContent = String(i + 1).padStart(2, "0");
    }
    var so = new IntersectionObserver(function (es) { es.forEach(function (e) { if (e.isIntersecting) setStep(steps.indexOf(e.target)); }); }, { rootMargin: "-45% 0px -45% 0px" });
    steps.forEach(function (s) { so.observe(s); }); setStep(0);
  }

  /* partículas (vaga-lumes/pólen) no hero */
  var cv = d.getElementById("fx");
  if (cv && hero && !reduce && cv.getContext) {
    var ctx = cv.getContext("2d"), ps = [], run = true, DPR = Math.min(2, devicePixelRatio || 1), w = 0, h = 0;
    function size() { w = cv.clientWidth; h = cv.clientHeight; cv.width = w * DPR; cv.height = h * DPR; ctx.setTransform(DPR, 0, 0, DPR, 0, 0); }
    size(); addEventListener("resize", size);
    var n = innerWidth < 700 ? 26 : 54;
    for (var i = 0; i < n; i++) ps.push({ x: Math.random(), y: Math.random(), r: Math.random() * 1.8 + .5, vx: (Math.random() - .5) * .00006, vy: -Math.random() * .00012 - .00003, ph: Math.random() * 6.28, c: Math.random() < .35 ? "140,198,63" : "242,178,58" });
    var last = 0;
    (function loop(t) {
      if (run) {
        var dt = Math.min(48, t - last); last = t; ctx.clearRect(0, 0, w, h);
        for (var k = 0; k < ps.length; k++) {
          var p = ps[k]; p.x += p.vx * dt + Math.sin(t / 1800 + p.ph) * .00005 * dt; p.y += p.vy * dt;
          if (p.y < -.05) { p.y = 1.05; p.x = Math.random(); } if (p.x < -.05) p.x = 1.05; if (p.x > 1.05) p.x = -.05;
          var a = .35 + .55 * Math.abs(Math.sin(t / 900 + p.ph));
          ctx.beginPath(); ctx.fillStyle = "rgba(" + p.c + "," + a.toFixed(2) + ")"; ctx.shadowColor = "rgba(" + p.c + ",.9)"; ctx.shadowBlur = 10;
          ctx.arc(p.x * w, p.y * h, p.r, 0, 6.283); ctx.fill();
        }
      }
      requestAnimationFrame(loop);
    })(0);
    if ("IntersectionObserver" in window) new IntersectionObserver(function (es) { run = es[0].isIntersecting; }).observe(hero);
    d.addEventListener("visibilitychange", function () { run = !d.hidden; });
    /* parallax suave com o mouse */
    if (matchMedia("(pointer:fine)").matches) hero.addEventListener("pointermove", function (e) {
      var x = (e.clientX / innerWidth - .5), y = (e.clientY / innerHeight - .5);
      hero.querySelectorAll(".hero-layers img").forEach(function (im) { var k = parseFloat(getComputedStyle(im).getPropertyValue("--k")) || 0; im.style.translate = (-x * k * 60) + "px " + (-y * k * 30) + "px"; });
    });
  }

  /* manifesto: palavras acendem conforme a rolagem */
  var mf = d.querySelector("[data-words]");
  if (mf) {
    var hl = /(floresta|prevenção|ciência|águas|restaura\w*)/i, ws = mf.textContent.trim().split(/\s+/);
    mf.innerHTML = ws.map(function (w) { return '<span class="w' + (hl.test(w) ? " hl" : "") + '">' + w + "</span>"; }).join(" ");
    var spans = [].slice.call(mf.querySelectorAll(".w"));
    if (reduce) mf.classList.add("static"); else {
      var upd = function () {
        var r = mf.getBoundingClientRect(), p = (innerHeight * .85 - r.top) / (r.height + innerHeight * .25);
        var n = Math.round(Math.max(0, Math.min(1, p)) * spans.length);
        spans.forEach(function (s, i) { s.classList.toggle("on", i < n); });
      };
      addEventListener("scroll", upd, { passive: true }); addEventListener("resize", upd); upd();
    }
  }

  /* constelação de pontos ligados */
  var net = d.querySelector("canvas.net");
  if (net && !reduce && net.getContext) {
    var nx = net.getContext("2d"), nw = 0, nh = 0, pts = [], nrun = true;
    var nsize = function () { var r = net.parentNode.getBoundingClientRect(), dpr = Math.min(devicePixelRatio || 1, 2); nw = r.width; nh = r.height; net.width = nw * dpr; net.height = nh * dpr; nx.setTransform(dpr, 0, 0, dpr, 0, 0); };
    nsize(); addEventListener("resize", nsize);
    var ncount = innerWidth < 700 ? 34 : 70;
    for (var q = 0; q < ncount; q++) pts.push({ x: Math.random(), y: Math.random(), vx: (Math.random() - .5) * .00018, vy: (Math.random() - .5) * .00018 });
    new IntersectionObserver(function (es) { nrun = es[0].isIntersecting; }).observe(net);
    (function nloop() {
      requestAnimationFrame(nloop); if (!nrun || d.hidden) return;
      nx.clearRect(0, 0, nw, nh);
      pts.forEach(function (p) { p.x += p.vx * 16; p.y += p.vy * 16; if (p.x < 0 || p.x > 1) p.vx *= -1; if (p.y < 0 || p.y > 1) p.vy *= -1; });
      var lim = Math.min(nw, 900) * .17;
      for (var a = 0; a < pts.length; a++) {
        for (var b = a + 1; b < pts.length; b++) {
          var dx = (pts[a].x - pts[b].x) * nw, dy = (pts[a].y - pts[b].y) * nh, dist = Math.sqrt(dx * dx + dy * dy);
          if (dist < lim) { nx.strokeStyle = "rgba(198,255,61," + (.35 * (1 - dist / lim)).toFixed(3) + ")"; nx.beginPath(); nx.moveTo(pts[a].x * nw, pts[a].y * nh); nx.lineTo(pts[b].x * nw, pts[b].y * nh); nx.stroke(); }
        }
        nx.fillStyle = "rgba(198,255,61,.9)"; nx.beginPath(); nx.arc(pts[a].x * nw, pts[a].y * nh, 2.2, 0, 6.3); nx.fill();
      }
    })();
  }

  /* faixa horizontal fixada (instrumentos) */
  var hsEl = d.querySelector(".hs");
  if (hsEl && !reduce) {
    var hsTrack = hsEl.querySelector(".hs-track"), hsPin = hsEl.querySelector(".hs-pin"), hsMax = 0;
    var hsMq = matchMedia("(min-width:900px) and (hover:hover)");
    var hsSize = function () {
      if (!hsMq.matches) { hsEl.classList.remove("hs-on"); hsEl.style.height = ""; hsTrack.style.transform = ""; return; }
      hsEl.classList.add("hs-on"); hsTrack.style.transform = "";
      hsMax = Math.max(0, hsTrack.scrollWidth - innerWidth);
      hsEl.style.height = (hsPin.offsetHeight + hsMax) + "px";
      hsMove();
    };
    var hsMove = function () {
      if (!hsEl.classList.contains("hs-on")) return;
      var r = hsEl.getBoundingClientRect(), top = parseFloat(getComputedStyle(hsPin).top) || 0;
      var p = Math.max(0, Math.min(1, (top - r.top) / Math.max(1, hsMax)));
      hsTrack.style.transform = "translate3d(" + (-p * hsMax).toFixed(1) + "px,0,0)";
    };
    addEventListener("scroll", hsMove, { passive: true }); addEventListener("resize", hsSize); hsMq.addEventListener("change", hsSize);
    (d.fonts && d.fonts.ready ? d.fonts.ready : Promise.resolve()).then(hsSize); hsSize();
  }

  /* luz que segue o cursor no hero */
  var hl = d.querySelector(".hero-light");
  if (hl && hero && !reduce) hero.addEventListener("pointermove", function (e) { var r = hero.getBoundingClientRect(); hl.style.setProperty("--mx", (e.clientX - r.left) + "px"); hl.style.setProperty("--my", (e.clientY - r.top) + "px"); }, { passive: true });

  /* arara 3D (three.js) — só se houver WebGL, sem preferência por menos movimento e conexão sem economia de dados */
  if (hero && !reduce && !(navigator.connection && navigator.connection.saveData)) {
    var gl3 = false; try { var tc = d.createElement("canvas"); gl3 = !!(tc.getContext("webgl2") || tc.getContext("webgl")); } catch (e) {}
    if (gl3 && !/[?&]no3d\b/.test(location.search)) {
      var base = (d.currentScript && d.currentScript.src) || (function () { var s = d.querySelector('script[src*="app.js"]'); return s ? s.src : location.href; })();
      var go = function () {
        import(new URL("hero3d.js", base).href).then(function (m) { return m.start(hero, { model: new URL("../assets/vendor/models/macaw.glb", base).href }); })
          .then(function () { var f = d.getElementById("fx"); if (f) f.style.display = "none"; hero.classList.add("has-3d"); })
          .catch(function () { /* fallback: foto + partículas 2D */ });
      };
      if ("requestIdleCallback" in window) requestIdleCallback(go, { timeout: 2500 }); else setTimeout(go, 1200);
    }
  }

  /* slideshow cinematográfico do hero */
  if (hero) {
    var sl = [].slice.call(hero.querySelectorAll(".hero-layers img")), si = 0;
    if (sl.length > 1 && !reduce) setInterval(function () {
      if (d.hidden) return; sl[si].classList.remove("on"); si = (si + 1) % sl.length; sl[si].classList.add("on");
    }, 7000);
  }

  /* vídeo opcional */
  var cfg = window.EFS_CONFIG || {};
  if (cfg.HERO_VIDEO && hero && !reduce) {
    var v = d.createElement("video"); v.src = cfg.HERO_VIDEO; v.muted = true; v.loop = true; v.autoplay = true; v.playsInline = true; v.setAttribute("aria-hidden", "true"); v.className = "hero-video";
    v.style.cssText = "position:absolute;inset:0;width:100%;height:100%;object-fit:cover;opacity:.55;z-index:0";
    hero.querySelector(".hero-layers").appendChild(v); v.play().catch(function () {});
  }

  /* copiar link de artigo */
  d.addEventListener("click", function (e) {
    var b = e.target.closest("[data-copy]"); if (!b) return;
    var url = location.origin + location.pathname + b.getAttribute("data-copy");
    (navigator.clipboard ? navigator.clipboard.writeText(url) : Promise.reject()).then(function () { b.textContent = "Link copiado"; setTimeout(function () { b.textContent = "Copiar link"; }, 1800); }).catch(function () { location.hash = b.getAttribute("data-copy"); });
  });

  /* ano */
  d.querySelectorAll("[data-year]").forEach(function (el) { el.textContent = new Date().getFullYear(); });
})();
