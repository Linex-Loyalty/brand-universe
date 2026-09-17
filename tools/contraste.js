/* Contraste WCAG 2.1 para la constelación Linex.
 *
 * POR QUÉ EXISTE
 * Los manuales de Trip y Go afirman decenas de ratios ("5.49:1", "1.36:1")
 * y sobre esos números descansan reglas duras: el coral no es color de
 * texto, el amarillo solo vive sobre el azul. Un número mal copiado
 * convierte una regla en una superstición. Aquí se recalculan.
 *
 * Fórmula: WCAG 2.1, relative luminance + contrast ratio.
 * https://www.w3.org/TR/WCAG21/#dfn-relative-luminance
 */

function normalizar(hex) {
  let h = String(hex).trim().replace(/^#/, '');
  if (h.length === 3) h = h.split('').map(c => c + c).join('');
  if (!/^[0-9a-fA-F]{6}$/.test(h)) {
    throw new Error(`hex inválido: ${hex}`);
  }
  return h;
}

// Linealiza un canal sRGB (0–255) a luz física.
function canal(v) {
  const c = v / 255;
  return c <= 0.04045 ? c / 12.92 : Math.pow((c + 0.055) / 1.055, 2.4);
}

function luminancia(hex) {
  const h = normalizar(hex);
  const r = parseInt(h.slice(0, 2), 16);
  const g = parseInt(h.slice(2, 4), 16);
  const b = parseInt(h.slice(4, 6), 16);
  // Los coeficientes son la sensibilidad del ojo a cada canal.
  return 0.2126 * canal(r) + 0.7152 * canal(g) + 0.0722 * canal(b);
}

function contraste(hexA, hexB) {
  const la = luminancia(hexA);
  const lb = luminancia(hexB);
  const claro = Math.max(la, lb);
  const oscuro = Math.min(la, lb);
  return (claro + 0.05) / (oscuro + 0.05);
}

/* `grande` = ≥24 px regular o ≥18.66 px bold, según WCAG 1.4.3. */
function cumple(ratio, nivel = 'AA', grande = false) {
  const umbral = nivel === 'AAA' ? (grande ? 4.5 : 7) : (grande ? 3 : 4.5);
  return ratio >= umbral;
}

module.exports = { luminancia, contraste, cumple };
