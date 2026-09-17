/* Ampliar una pieza de canal (14 · Entregables).
 *
 * POR QUE EXISTE
 * Las piezas del manual son HTML a tamaño real (un hero de 1440px, un email de
 * 600px, una tarjeta de 89mm), mostradas encogidas con la variable --escala.
 * Encogidas se leen como diagramas: el texto queda en 5px y nadie puede juzgar
 * la composición. Este lightbox vuelve a montar LA MISMA pieza a una escala que
 * llene la pantalla — no es una imagen ampliada, es el mismo DOM con otra
 * escala, así que el texto queda nítido a cualquier tamaño.
 *
 * Se clona el nodo en vez de moverlo para que la miniatura no desaparezca de la
 * página mientras el lightbox está abierto, y para no romper ningún estado.
 *
 * Sin dependencias y sin build: el manual tiene que abrir con doble clic.
 */
(function () {
  'use strict';

  var piezas = document.querySelectorAll('[data-ampliar]');
  if (!piezas.length) return;

  var overlay = null;
  var abridor = null;

  function escalaQueQuepa(el) {
    // La pieza declara su tamaño real en --pieza-w / --pieza-h (px de diseño).
    var cs = getComputedStyle(el);
    var w = parseFloat(cs.getPropertyValue('--pieza-w')) || el.offsetWidth;
    var h = parseFloat(cs.getPropertyValue('--pieza-h')) || el.offsetHeight;
    var dispW = window.innerWidth - 96;
    var dispH = window.innerHeight - 132;
    // Nunca por encima de 1: ampliar más allá del tamaño real solo emborrona
    // las fotos, que sí son mapas de bits aunque el resto sea HTML.
    var cabe = Math.min(1, dispW / w, dispH / h);
    // ...pero nunca por debajo de la miniatura: en una pantalla angosta el
    // cálculo de "lo que cabe" daba menos que la escala de la página, así que
    // pulsar Ampliar encogía la pieza. Si no cabe, que se desborde y el overlay
    // haga scroll — molesta menos que lo contrario.
    var mini = (parseFloat(cs.getPropertyValue("--escala")) || 1) *
               (parseFloat(cs.getPropertyValue("--f")) || 1);
    return Math.max(cabe, mini);
  }

  function cerrar() {
    if (!overlay) return;
    document.removeEventListener('keydown', onKey, true);
    overlay.remove();
    overlay = null;
    document.body.style.overflow = '';
    if (abridor) { abridor.focus(); abridor = null; }
  }

  function onKey(e) {
    if (e.key === 'Escape') { e.preventDefault(); cerrar(); return; }
    if (e.key !== 'Tab' || !overlay) return;
    // Trampa de foco: dentro del overlay solo hay un botón, así que el ciclo se
    // resuelve devolviendo el foco ahí en vez de dejarlo salir a la página de
    // atrás, que está inerte pero sigue siendo tabulable.
    var btn = overlay.querySelector('.lb-cerrar');
    e.preventDefault();
    btn.focus();
  }

  function abrir(pieza) {
    if (overlay) return;
    abridor = pieza;

    overlay = document.createElement('div');
    overlay.className = 'lb-overlay';
    overlay.setAttribute('role', 'dialog');
    overlay.setAttribute('aria-modal', 'true');
    overlay.setAttribute('aria-label', pieza.getAttribute('data-ampliar') || 'Pieza ampliada');

    var caja = document.createElement('div');
    caja.className = 'lb-caja';

    var clon = pieza.cloneNode(true);
    clon.removeAttribute('data-ampliar');
    clon.removeAttribute('tabindex');
    clon.removeAttribute('role');
    clon.removeAttribute('aria-label');
    clon.classList.add('es-clon');
    // --f es el multiplicador responsive de la miniatura; en el clon la escala ya
    // viene calculada contra el viewport real, así que se neutraliza o se
    // aplicaría dos veces.
    clon.style.setProperty('--f', 1);
    clon.style.setProperty('--escala', escalaQueQuepa(pieza));

    var btn = document.createElement('button');
    btn.type = 'button';
    btn.className = 'lb-cerrar';
    btn.textContent = 'Cerrar';

    caja.appendChild(clon);
    overlay.appendChild(btn);
    overlay.appendChild(caja);

    overlay.addEventListener('click', function (e) {
      // Solo el fondo cierra; un clic dentro de la pieza no.
      if (e.target === overlay || e.target === caja) cerrar();
    });
    btn.addEventListener('click', cerrar);

    document.body.appendChild(overlay);
    document.body.style.overflow = 'hidden';
    document.addEventListener('keydown', onKey, true);
    btn.focus();

    window.addEventListener('resize', function reajustar() {
      if (!overlay) { window.removeEventListener('resize', reajustar); return; }
      clon.style.setProperty('--escala', escalaQueQuepa(pieza));
    });
  }

  Array.prototype.forEach.call(piezas, function (pieza) {
    pieza.setAttribute('tabindex', '0');
    pieza.setAttribute('role', 'button');
    pieza.setAttribute('aria-label', 'Ampliar: ' + (pieza.getAttribute('data-ampliar') || 'pieza'));
    pieza.addEventListener('click', function () { abrir(pieza); });
    pieza.addEventListener('keydown', function (e) {
      if (e.key === 'Enter' || e.key === ' ') { e.preventDefault(); abrir(pieza); }
    });
  });
})();
