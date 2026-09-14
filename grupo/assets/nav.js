// Grupo Linex — Manual de Marca — navegación mobile
// Vanilla JS, sin dependencias. Único propósito: abrir/cerrar el sidebar en pantallas angostas.
(function () {
  document.addEventListener('DOMContentLoaded', function () {
    var toggle = document.querySelector('[data-nav-toggle]');
    var scrim = document.querySelector('[data-nav-scrim]');
    var body = document.body;

    function closeNav() {
      body.classList.remove('nav-open');
      if (toggle) toggle.setAttribute('aria-expanded', 'false');
    }
    function openNav() {
      body.classList.add('nav-open');
      if (toggle) toggle.setAttribute('aria-expanded', 'true');
    }

    if (toggle) {
      toggle.addEventListener('click', function () {
        if (body.classList.contains('nav-open')) closeNav(); else openNav();
      });
    }
    if (scrim) scrim.addEventListener('click', closeNav);

    // Close the drawer after following a link (mobile navigates to a new page anyway,
    // but this keeps state clean if the browser restores scroll/back-forward cache).
    document.querySelectorAll('.sidebar a').forEach(function (a) {
      a.addEventListener('click', closeNav);
    });

    document.addEventListener('keydown', function (e) {
      if (e.key === 'Escape') closeNav();
    });
  });
})();
