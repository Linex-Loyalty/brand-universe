/* Ampliar una foto de referencia (15 · Redes sociales).
 *
 * POR QUÉ EXISTE
 * lightbox.js (14 · Entregables) clona una pieza HTML completa a otra escala
 * --pieza-w/--pieza-h son medidas de diseño, no de bitmap. Las fotos de esta
 * página son imágenes reales sin ese contrato, así que no comparten ese
 * script: aquí basta con mostrar la misma imagen más grande.
 *
 * Reutiliza las clases .lb-overlay/.lb-caja/.lb-cerrar ya definidas para el
 * otro lightbox, para que abrir cualquiera de los dos se sienta igual.
 *
 * Sin dependencias y sin build: el manual tiene que abrir con doble clic.
 */
(function () {
  'use strict';

  var fotos = document.querySelectorAll('[data-ampliar-foto]');
  if (!fotos.length) return;

  var overlay = null;
  var abridor = null;

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
    // Único elemento enfocable dentro del overlay: el ciclo del tab vuelve
    // siempre ahí en vez de escapar a la página de atrás.
    e.preventDefault();
    overlay.querySelector('.lb-cerrar').focus();
  }

  function abrir(foto) {
    if (overlay) return;
    abridor = foto;

    overlay = document.createElement('div');
    overlay.className = 'lb-overlay';
    overlay.setAttribute('role', 'dialog');
    overlay.setAttribute('aria-modal', 'true');
    overlay.setAttribute('aria-label', foto.getAttribute('alt') || 'Imagen ampliada');

    var caja = document.createElement('div');
    caja.className = 'lb-caja';

    var grande = document.createElement('img');
    grande.src = foto.currentSrc || foto.src;
    grande.alt = foto.getAttribute('alt') || '';
    grande.style.maxWidth = 'min(90vw, 720px)';
    grande.style.maxHeight = '85vh';
    grande.style.width = 'auto';
    grande.style.height = 'auto';
    grande.style.display = 'block';
    grande.style.borderRadius = '12px';
    grande.style.boxShadow = '0 24px 60px rgba(10, 8, 30, 0.4)';

    var btn = document.createElement('button');
    btn.type = 'button';
    btn.className = 'lb-cerrar';
    btn.textContent = 'Cerrar';

    caja.appendChild(grande);
    overlay.appendChild(btn);
    overlay.appendChild(caja);

    overlay.addEventListener('click', function (e) {
      if (e.target === overlay || e.target === caja) cerrar();
    });
    btn.addEventListener('click', cerrar);

    document.body.appendChild(overlay);
    document.body.style.overflow = 'hidden';
    document.addEventListener('keydown', onKey, true);
    btn.focus();
  }

  Array.prototype.forEach.call(fotos, function (foto) {
    foto.style.cursor = 'zoom-in';
    foto.setAttribute('tabindex', '0');
    foto.setAttribute('role', 'button');
    foto.setAttribute('aria-label', 'Ampliar: ' + (foto.getAttribute('alt') || 'imagen'));
    foto.addEventListener('click', function () { abrir(foto); });
    foto.addEventListener('keydown', function (e) {
      if (e.key === 'Enter' || e.key === ' ') { e.preventDefault(); abrir(foto); }
    });
  });
})();
