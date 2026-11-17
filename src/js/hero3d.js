/* Arara 3D no hero (three.js, r160, MIT). Carregado sob demanda; se algo falhar, o site segue com o fundo em foto. */
import * as THREE from "../assets/vendor/three.module.min.js";
import { GLTFLoader } from "../assets/vendor/jsm/loaders/GLTFLoader.js";
import { RoomEnvironment } from "../assets/vendor/jsm/environments/RoomEnvironment.js";

export function start(hero, opts) {
  opts = opts || {};
  var canvas = hero.querySelector("canvas.hero-3d");
  if (!canvas) return Promise.reject(new Error("sem canvas"));
  var small = innerWidth < 760;
  var renderer = new THREE.WebGLRenderer({ canvas: canvas, alpha: true, antialias: !small, powerPreference: "high-performance" });
  renderer.setClearColor(0x000000, 0);
  renderer.outputColorSpace = THREE.SRGBColorSpace;
  renderer.toneMapping = THREE.ACESFilmicToneMapping;
  renderer.toneMappingExposure = 1.05;
  var scene = new THREE.Scene();
  var cam = new THREE.PerspectiveCamera(32, 1, 0.1, 100);
  cam.position.set(0, 0, 7);

  var pm = new THREE.PMREMGenerator(renderer);
  scene.environment = pm.fromScene(new RoomEnvironment(), 0.04).texture;
  scene.environmentIntensity = 0.55;
  scene.add(new THREE.HemisphereLight(0xdfeccf, 0x0a2415, 0.9));
  var key = new THREE.DirectionalLight(0xfff0d0, 2.4); key.position.set(3, 4, 5); scene.add(key);
  var rim = new THREE.DirectionalLight(0xc6ff3d, 1.6); rim.position.set(-4, 2, -3); scene.add(rim);

  /* vaga-lumes */
  var N = small ? 70 : 140, pos = new Float32Array(N * 3), seed = [];
  for (var i = 0; i < N; i++) { seed.push([Math.random() * 6.3, 0.2 + Math.random() * 0.8, Math.random()]); pos[i * 3] = (Math.random() - 0.5) * 14; pos[i * 3 + 1] = (Math.random() - 0.5) * 8; pos[i * 3 + 2] = -3 + Math.random() * 6; }
  var pg = new THREE.BufferGeometry(); pg.setAttribute("position", new THREE.BufferAttribute(pos, 3));
  var dot = document.createElement("canvas"); dot.width = dot.height = 64; var dx = dot.getContext("2d");
  var gr = dx.createRadialGradient(32, 32, 0, 32, 32, 32); gr.addColorStop(0, "rgba(255,255,255,1)"); gr.addColorStop(0.3, "rgba(255,255,255,.55)"); gr.addColorStop(1, "rgba(255,255,255,0)"); dx.fillStyle = gr; dx.fillRect(0, 0, 64, 64);
  var pts = new THREE.Points(pg, new THREE.PointsMaterial({ size: small ? 0.07 : 0.06, map: new THREE.CanvasTexture(dot), color: 0xd8ff6a, transparent: true, opacity: 0.85, depthWrite: false, blending: THREE.AdditiveBlending }));
  scene.add(pts);

  var bird = new THREE.Group(); scene.add(bird); var mixer = null, ready = false;
  var mx = 0, my = 0, tx = 0, ty = 0, prog = 0, tprog = 0;
  function size() {
    var w = hero.clientWidth, h = hero.clientHeight, dpr = Math.min(devicePixelRatio || 1, small ? 1.5 : 2);
    renderer.setPixelRatio(dpr); renderer.setSize(w, h, false); cam.aspect = w / h; cam.updateProjectionMatrix();
  }
  size(); addEventListener("resize", function () { small = innerWidth < 760; size(); });
  hero.addEventListener("pointermove", function (e) { var r = hero.getBoundingClientRect(); tx = ((e.clientX - r.left) / r.width - 0.5) * 2; ty = ((e.clientY - r.top) / r.height - 0.5) * 2; }, { passive: true });

  return new Promise(function (resolve, reject) {
    new GLTFLoader().load(opts.model, function (g) {
      var m = g.scene, box = new THREE.Box3().setFromObject(m), c = box.getCenter(new THREE.Vector3()), sz = box.getSize(new THREE.Vector3());
      var k = 3.1 / Math.max(sz.x, sz.y, sz.z); m.scale.setScalar(k); m.position.copy(c).multiplyScalar(-k); bird.add(m);
      m.traverse(function (o) { if (o.isMesh) { o.frustumCulled = false; var mt = o.material; mt.roughness = 0.46; mt.metalness = 0; mt.envMapIntensity = 0.9; mt.side = THREE.DoubleSide; mt.needsUpdate = true; } });
      if (g.animations && g.animations.length) { mixer = new THREE.AnimationMixer(m); var a = mixer.clipAction(g.animations[0]); a.timeScale = 1.35; a.play(); }
      ready = true; canvas.classList.add("on"); resolve();
    }, undefined, reject);
  }).then(function () {
    var clock = new THREE.Clock(), vis = true, run = true;
    new IntersectionObserver(function (e) { vis = e[0].isIntersecting; }).observe(hero);
    addEventListener("scroll", function () { var h = hero.offsetHeight || 1; tprog = Math.max(0, Math.min(1.2, scrollY / (h * 0.9))); }, { passive: true });
    function frame() {
      requestAnimationFrame(frame);
      if (!vis || document.hidden || !run) return;
      var dt = Math.min(clock.getDelta(), 0.05), t = clock.elapsedTime;
      if (mixer) mixer.update(dt);
      mx += (tx - mx) * 0.05; my += (ty - my) * 0.05; prog += (tprog - prog) * 0.08;
      var sm = innerWidth < 760;
      /* trajetória: entra pela direita, ao rolar sobe e sai para a esquerda, crescendo */
      var bx = (sm ? 0.3 : 1.9) - prog * (sm ? 2.2 : 4.6) + mx * 0.35;
      var by = (sm ? 1.55 : 0.35) + prog * 2.6 - my * 0.25 + Math.sin(t * 1.3) * 0.12;
      var bz = prog * 3.4;
      bird.position.set(bx, by, bz);
      bird.rotation.set(-0.15 + prog * 0.6 + my * 0.12 + Math.sin(t * 1.1) * 0.04, -0.75 - prog * 0.9 + mx * 0.3, -0.18 + Math.sin(t * 0.9) * 0.08 - mx * 0.1);
      var s = sm ? 0.62 : 1; bird.scale.setScalar(s * (1 + prog * 0.35));
      var p = pg.attributes.position.array;
      for (var i = 0; i < N; i++) { var sd = seed[i]; p[i * 3 + 1] += Math.sin(t * sd[1] + sd[0]) * 0.0016 + 0.0009 * sd[1]; p[i * 3] += Math.cos(t * 0.4 * sd[1] + sd[0]) * 0.0012; if (p[i * 3 + 1] > 4.4) p[i * 3 + 1] = -4.4; }
      pg.attributes.position.needsUpdate = true; pts.position.x = -mx * 0.25; pts.position.y = prog * 0.8;
      renderer.render(scene, cam);
    }
    frame();
    return { stop: function () { run = false; } };
  });
}
