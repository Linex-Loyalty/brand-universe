// Manual de Marca LinexTrip — navegación mobile
// Vanilla JS, sin dependencias. Único propósito: abrir/cerrar el sidebar en
// pantallas angostas. El menú en sí es HTML estático (ver tools/sync-nav.ps1),
// así que sin JS la navegación sigue funcionando: solo queda siempre visible.
(function () {
  document.addEventListener('DOMContentLoaded', function () {
    var toggle = document.querySelector('[data-nav-toggle]');
    var scrim = document.querySelector('[data-nav-scrim]');
    var sidebar = document.getElementById('sidebar');
    var body = document.body;

    if (!toggle || !sidebar) return;

    function closeNav(returnFocus) {
      if (!body.classList.contains('nav-open')) return;
      body.classList.remove('nav-open');
      body.style.overflow = '';
      toggle.setAttribute('aria-expanded', 'false');
      // Devolver el foco al botón: sin esto, al cerrar con Escape el foco
      // queda perdido al inicio del documento.
      if (returnFocus) toggle.focus();
    }

    function openNav() {
      body.classList.add('nav-open');
      // El drawer es una capa sobre el contenido: si el body sigue scrolleando,
      // la página se mueve por detrás mientras el menú está abierto.
      body.style.overflow = 'hidden';
      toggle.setAttribute('aria-expanded', 'true');
      var first = sidebar.querySelector('a, button');
      if (first) first.focus();
    }

    toggle.addEventListener('click', function () {
      if (body.classList.contains('nav-open')) closeNav(true); else openNav();
    });

    if (scrim) scrim.addEventListener('click', function () { closeNav(true); });

    // Cerrar tras seguir un enlace (mobile navega a otra página de todos modos,
    // pero deja el estado limpio si el navegador restaura scroll o usa la caché
    // de atrás/adelante).
    sidebar.querySelectorAll('a').forEach(function (a) {
      a.addEventListener('click', function () { closeNav(false); });
    });

    document.addEventListener('keydown', function (e) {
      if (e.key === 'Escape') { closeNav(true); return; }

      // Mientras el drawer está abierto, el tabulador se queda dentro: es una
      // capa modal, tabular hacia el contenido de atrás no lleva a ninguna parte
      // visible.
      if (e.key !== 'Tab' || !body.classList.contains('nav-open')) return;

      var focusables = sidebar.querySelectorAll('a[href], button:not([disabled])');
      if (!focusables.length) return;
      var first = focusables[0];
      var last = focusables[focusables.length - 1];

      if (e.shiftKey && document.activeElement === first) {
        e.preventDefault();
        last.focus();
      } else if (!e.shiftKey && document.activeElement === last) {
        e.preventDefault();
        first.focus();
      }
    });

    // Si la ventana se ensancha hasta que el sidebar vuelve a ser fijo, el estado
    // "abierto" deja de tener sentido y el overflow:hidden quedaría pegado.
    window.addEventListener('resize', function () {
      if (window.innerWidth > 900) closeNav(false);
    });
  });
})();
