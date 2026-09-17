#!/usr/bin/env node
/* Vuelve bilingüe la navegación de Linex Trip (menú lateral + paginador),
 * que a diferencia de Go y Travel no tiene <!--nav--> ni <!--pager--> ni
 * un tools/sync-nav.js: cada una de las 16 páginas trae ese HTML escrito a
 * mano, idéntico entre sí salvo la clase "active" de la sección en curso.
 *
 * Este script no genera el menú desde cero — busca y reemplaza los mismos
 * fragmentos exactos en las 16 páginas, con la misma guardia de "debe
 * aparecer exactamente una vez" que usa tools/envolver.js, para no
 * arriesgar una coincidencia de más o de menos.
 *
 * USO
 *   node tools/sync-nav-bilingue.js
 */
const fs = require('fs');
const path = require('path');
const { bi } = require('./envolver.js');

const RAIZ = path.resolve(__dirname, '..');

const SECCIONES = [
  { n: '00', archivo: 'index.html', es: 'Resumen ejecutivo', en: 'Executive summary' },
  { n: '01', archivo: '01-logotipo.html', es: 'Logotipo', en: 'Logo' },
  { n: '02', archivo: '02-propuestas-logo.html', es: 'Propuestas de logo', en: 'Logo proposals' },
  { n: '03', archivo: '03-paleta-color.html', es: 'Paleta de color', en: 'Colour palette' },
  { n: '04', archivo: '04-tipografia.html', es: 'Tipografía', en: 'Typography' },
  { n: '05', archivo: '05-iconografia-canal.html', es: 'Iconografía y diseño por canal', en: 'Iconography and channel design' },
  { n: '06', archivo: '06-sistema-fotografia.html', es: 'Sistema gráfico y fotografía', en: 'Graphic system and photography' },
  { n: '07', archivo: '07-accesibilidad.html', es: 'Accesibilidad', en: 'Accessibility' },
  { n: '08', archivo: '08-arquitectura.html', es: 'Arquitectura y nombre', en: 'Architecture and naming' },
  { n: '09', archivo: '09-audiencias.html', es: 'Audiencias', en: 'Audiences' },
  { n: '10', archivo: '10-propuesta-valor.html', es: 'Propuesta de valor y claims', en: 'Value proposition and claims' },
  { n: '11', archivo: '11-voz-tono.html', es: 'Voz y tono', en: 'Voice and tone' },
  { n: '12', archivo: '12-vocabulario.html', es: 'Vocabulario', en: 'Vocabulary' },
  { n: '13', archivo: '13-promociones-cta.html', es: 'Promociones y CTA', en: 'Promotions and CTAs' },
  { n: '14', archivo: '14-entregables.html', es: 'Entregables y aplicaciones', en: 'Deliverables and applications' },
  { n: '15', archivo: '15-redes-sociales.html', es: 'Redes sociales', en: 'Social media' },
];

const BLOQUES_ARIA = [
  ['Portada', 'Home'],
  ['A · Identidad visual', 'A · Visual identity'],
  ['B · Quién es y cómo habla', 'B · Who it is and how it speaks'],
  ['C · Cómo se aplica', 'C · How it is applied'],
];

function unaVez(s, archivo, buscado) {
  const n = s.split(buscado).length - 1;
  if (n !== 1) throw new Error(`${archivo}: "${buscado.slice(0, 60)}" aparece ${n} veces`);
  return n;
}

function procesar(archivo) {
  const p = path.join(RAIZ, archivo);
  const raw = fs.readFileSync(p, 'utf8');
  const eol = raw.includes('\r\n') ? '\r\n' : '\n';
  let s = raw.split('\r\n').join('\n');

  if (s.includes('nav-group-title">' + '<span data-lang')) {
    console.log(`  = ${archivo} ya tenía la navegación bilingüe`);
    return;
  }

  // 1 · aria-label de los 4 bloques del menú (atributo, no puede llevar spans)
  for (const [es, en] of BLOQUES_ARIA) {
    const buscado = `aria-label="${es}"`;
    unaVez(s, archivo, buscado);
    s = s.split(buscado).join(`aria-label="${es} / ${en}"`);
  }

  // 2 · título visible de los 3 bloques con encabezado (Portada no tiene)
  for (const [es, en] of BLOQUES_ARIA.slice(1)) {
    const buscado = `<span class="nav-group-title">${es}</span>`;
    unaVez(s, archivo, buscado);
    s = s.split(buscado).join(`<span class="nav-group-title">${bi(es, en)}</span>`);
  }

  // 3 · las 16 entradas del menú lateral (número + título)
  for (const sec of SECCIONES) {
    const buscado = `<span class="n">${sec.n}</span><span>${sec.es}</span>`;
    unaVez(s, archivo, buscado);
    s = s.split(buscado).join(`<span class="n">${sec.n}</span><span>${bi(sec.es, sec.en)}</span>`);
  }

  // 4 · dirección del paginador (0 o 1 de cada uno, según si hay anterior/siguiente)
  const dirAnterior = '<span class="dir">&larr; Anterior</span>';
  if (s.includes(dirAnterior)) {
    unaVez(s, archivo, dirAnterior);
    s = s.split(dirAnterior).join(`<span class="dir">${bi('&larr; Anterior', '&larr; Previous')}</span>`);
  }
  const dirSiguiente = '<span class="dir">Siguiente &rarr;</span>';
  if (s.includes(dirSiguiente)) {
    unaVez(s, archivo, dirSiguiente);
    s = s.split(dirSiguiente).join(`<span class="dir">${bi('Siguiente &rarr;', 'Next &rarr;')}</span>`);
  }

  // 5 · etiqueta del paginador (número + título de la página vecina)
  for (const sec of SECCIONES) {
    const buscado = `<span class="lbl">${sec.n} &middot; ${sec.es}</span>`;
    const n = s.split(buscado).length - 1;
    if (n > 1) throw new Error(`${archivo}: "${buscado}" aparece ${n} veces`);
    if (n === 1) s = s.split(buscado).join(`<span class="lbl">${sec.n} &middot; ${bi(sec.es, sec.en)}</span>`);
  }

  fs.writeFileSync(p, s.split('\n').join(eol));
  console.log(`  ✓ ${archivo} — navegación bilingüe`);
}

if (require.main === module) {
  const archivos = ['index.html'].concat(SECCIONES.slice(1).map(s => s.archivo));
  for (const a of archivos) procesar(a);
}

module.exports = { procesar, SECCIONES, BLOQUES_ARIA };
