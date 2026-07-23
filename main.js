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

  // Menú móvil
  var toggle = document.querySelector('.nav-toggle');
  var links = document.querySelector('.nav-links');
  if (toggle && links) {
    toggle.addEventListener('click', function () {
      links.classList.toggle('open');
    });
    links.querySelectorAll('a').forEach(function (a) {
      a.addEventListener('click', function () { links.classList.remove('open'); });
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
