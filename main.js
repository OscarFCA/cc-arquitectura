// C&C Recidencias — interacciones mínimas y deliberadas
(function () {
  var nav = document.querySelector('.nav');

  // NAV: transparente sobre hero, sólido al hacer scroll
  function onScroll() {
    if (!nav) return;
    if (window.scrollY > 40) {
      nav.classList.add('solid');
      nav.classList.remove('transparent');
    } else {
      nav.classList.remove('solid');
      nav.classList.add('transparent');
    }
  }
  window.addEventListener('scroll', onScroll, { passive: true });
  onScroll();

  // Menú móvil (overlay a pantalla completa)
  var toggle = document.querySelector('.nav-toggle');
  var links = document.querySelector('.nav-links');
  if (toggle && links && nav) {
    toggle.setAttribute('aria-expanded', 'false');
    function setMenu(open) {
      links.classList.toggle('open', open);
      toggle.classList.toggle('open', open);
      nav.classList.toggle('menu-open', open);
      toggle.setAttribute('aria-expanded', String(open));
      toggle.setAttribute('aria-label', open ? 'Cerrar menú' : 'Abrir menú');
      document.body.style.overflow = open ? 'hidden' : '';
    }
    toggle.addEventListener('click', function () {
      setMenu(!links.classList.contains('open'));
    });
    links.querySelectorAll('a').forEach(function (a) {
      a.addEventListener('click', function () { setMenu(false); });
    });
    document.addEventListener('keydown', function (e) {
      if (e.key === 'Escape' && links.classList.contains('open')) setMenu(false);
    });
  }

  // Hero video: reproducción lenta + fallback a portada si el autoplay se bloquea (iOS/ahorro de batería)
  var heroVideo = document.querySelector('.hero-media video');
  if (heroVideo) {
    heroVideo.muted = true;
    heroVideo.setAttribute('muted', '');
    heroVideo.playsInline = true;
    var media = heroVideo.parentElement;
    var poster = heroVideo.getAttribute('poster');
    var fallback = null;
    function showFallback() {
      if (fallback || !poster) return;
      fallback = document.createElement('img');
      fallback.src = poster;
      fallback.alt = '';
      fallback.style.cssText = 'position:absolute;inset:0;width:100%;height:100%;object-fit:cover;z-index:0';
      media.appendChild(fallback);
    }
    function hideFallback() { if (fallback) { fallback.remove(); fallback = null; } }
    function attempt() {
      heroVideo.playbackRate = 0.7;
      var pr = heroVideo.play();
      if (pr && pr.then) pr.then(hideFallback).catch(showFallback);
    }
    heroVideo.addEventListener('loadeddata', attempt);
    heroVideo.addEventListener('play', function () { heroVideo.playbackRate = 0.7; hideFallback(); });
    attempt();
    // reintentar al primer gesto del usuario (permite reproducir aun en modo de bajo consumo)
    ['touchend', 'click', 'scroll'].forEach(function (ev) {
      document.addEventListener(ev, function retry() {
        if (heroVideo.paused) attempt();
      }, { passive: true, once: false });
    });
  }

  // FAQ acordeón
  document.querySelectorAll('.faq button').forEach(function (btn) {
    btn.addEventListener('click', function () {
      var expanded = btn.getAttribute('aria-expanded') === 'true';
      var panel = btn.parentElement.querySelector('.a');
      btn.setAttribute('aria-expanded', String(!expanded));
      panel.style.maxHeight = expanded ? '0px' : panel.scrollHeight + 'px';
    });
  });

  // Lightbox / carrusel de galería
  var galImgs = Array.prototype.slice.call(document.querySelectorAll('.gallery img'));
  if (galImgs.length) {
    var lb = document.createElement('div');
    lb.className = 'lightbox';
    lb.setAttribute('role', 'dialog');
    lb.setAttribute('aria-modal', 'true');
    lb.setAttribute('aria-label', 'Galería de imágenes');
    lb.innerHTML =
      '<button class="lb-btn lb-close" aria-label="Cerrar">&times;</button>' +
      '<button class="lb-btn lb-nav lb-prev" aria-label="Anterior">&#8249;</button>' +
      '<div class="lb-stage"><img alt=""></div>' +
      '<button class="lb-btn lb-nav lb-next" aria-label="Siguiente">&#8250;</button>' +
      '<div class="lb-count"></div>';
    document.body.appendChild(lb);

    var lbImg = lb.querySelector('.lb-stage img');
    var lbCount = lb.querySelector('.lb-count');
    var idx = 0;

    function show(i) {
      idx = (i + galImgs.length) % galImgs.length;
      var src = galImgs[idx];
      lbImg.src = src.currentSrc || src.src;
      lbImg.alt = src.alt || '';
      lbCount.textContent = (idx + 1) + ' / ' + galImgs.length;
    }
    function open(i) {
      show(i);
      lb.classList.add('open');
      document.body.style.overflow = 'hidden';
    }
    function close() {
      lb.classList.remove('open');
      document.body.style.overflow = '';
    }

    galImgs.forEach(function (img, i) {
      img.parentElement.addEventListener('click', function () { open(i); });
    });
    lb.querySelector('.lb-close').addEventListener('click', close);
    lb.querySelector('.lb-next').addEventListener('click', function () { show(idx + 1); });
    lb.querySelector('.lb-prev').addEventListener('click', function () { show(idx - 1); });
    lb.addEventListener('click', function (e) { if (e.target === lb) close(); });
    document.addEventListener('keydown', function (e) {
      if (!lb.classList.contains('open')) return;
      if (e.key === 'Escape') close();
      else if (e.key === 'ArrowRight') show(idx + 1);
      else if (e.key === 'ArrowLeft') show(idx - 1);
    });
    // Swipe táctil
    var x0 = null;
    lb.addEventListener('touchstart', function (e) { x0 = e.touches[0].clientX; }, { passive: true });
    lb.addEventListener('touchend', function (e) {
      if (x0 === null) return;
      var dx = e.changedTouches[0].clientX - x0;
      if (Math.abs(dx) > 45) show(idx + (dx < 0 ? 1 : -1));
      x0 = null;
    });
  }

  // Reveal on scroll
  var reveals = document.querySelectorAll('.reveal');
  if (location.hash === '#shot') { reveals.forEach(function (el) { el.classList.add('in'); }); return; }
  if ('IntersectionObserver' in window && reveals.length) {
    var io = new IntersectionObserver(function (entries) {
      entries.forEach(function (e) {
        if (e.isIntersecting) { e.target.classList.add('in'); io.unobserve(e.target); }
      });
    }, { threshold: 0.12 });
    reveals.forEach(function (el) { io.observe(el); });
  } else {
    reveals.forEach(function (el) { el.classList.add('in'); });
  }
})();
