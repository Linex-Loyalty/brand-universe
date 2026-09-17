#!/usr/bin/env node
/* El sitio Constelación, generado desde brand-tokens.json.
 *
 * POR QUÉ EXISTE
 * Es la puerta de entrada para que cualquiera en la compañía vea la
 * constelación completa y entre al manual que necesite. Se genera, no se
 * edita: es el mismo criterio que sync-nav.js aplica en los manuales, y
 * por la misma razón — un sitio escrito a mano se desincroniza del dato
 * la primera vez que cambia un color.
 *
 * CROMO NEUTRO
 * El grupo no tiene identidad propia: Linex Loyalty es la marca ancla y
 * su único token es el Verde, sin base oscura. Así que el sitio no se
 * pinta de ningún color que nadie aprobó. Los colores de marca aparecen
 * solo como DATO, dentro de la tarjeta de su marca.
 *
 * USO
 *   node tools/sync-constelacion.js
 */

const fs = require('fs');
const path = require('path');

const RAIZ = path.resolve(__dirname, '..');

const esc = s => String(s == null ? '' : s)
  .replace(/&/g, '&amp;').replace(/</g, '&lt;')
  .replace(/>/g, '&gt;').replace(/"/g, '&quot;');

const TIERS = [
  { n: 1, nombre: 'El fondo',
    nota: 'Comunicación corporativa · global y estático' },
  { n: 2, nombre: 'El puerto espacial',
    nota: 'El punto de entrada a la constelación — no una caja de pago' },
  { n: 3, nombre: 'Las estrellas',
    nota: 'Motores comerciales · cada una con su genio y su público' },
];

function swatches(m) {
  if (!m.color || !m.color.length) return '';
  const chips = m.color.map(c =>
    `<span class="sw"><i style="background:${esc(c.hex)}"></i>${esc(c.nombre)} ` +
    `<code>${esc(c.hex)}</code>` +
    (c.proporcion != null ? ` <em>${c.proporcion}%</em>` : '') +
    `</span>`).join('\n        ');
  return `\n      <div class="pal">\n        ${chips}\n      </div>`;
}

function pendientes(m) {
  if (!m.pendientes || !m.pendientes.length) return '';
  const items = m.pendientes.map(p => {
    const clase = /^BLOQUEANTE/.test(p) ? 'stop' : 'gap';
    return `<span class="${clase}">${esc(p)}</span>`;
  }).join('\n        ');
  return `\n      <div class="gaps">\n        ${items}\n      </div>`;
}

/* Un manual que no existe no lleva enlace. Nunca href="#". */
function acceso(m) {
  if (m.manual) {
    return `\n      <p class="acceso"><a class="btn" href="${esc(m.manual)}index.html">` +
           `Abrir el manual de ${esc(m.nombre)}</a></p>`;
  }
  return `\n      <p class="acceso sin"><span>Sin manual todavía</span></p>`;
}

function tarjeta(m) {
  // El riel de acento solo existe si la marca tiene un color real.
  const conColor = m.color && m.color.length;
  const acento = conColor
    ? ` style="--acento:${esc((m.color.find(c => /acci[oó]n|acento/i.test(c.rol)) || m.color[0]).hex)}"`
    : '';

  return `    <article class="marca${conColor ? '' : ' pend'}"${acento}>
      <div class="marca-top">
        <div>
          <h3>${esc(m.nombre)}</h3>
          <p class="dom">${esc(m.dominio)}</p>
        </div>
        <span class="pill ${m.manual ? 'live' : 'soon'}">${m.manual ? 'Vigente' : 'Pendiente'}</span>
      </div>
      <p class="rol">${esc(m.rol)}</p>${m.genio
        ? `\n      <p class="genio">Genio · <b>${esc(m.genio)}</b>${m.genio_nota ? ' — ' + esc(m.genio_nota) : ''}</p>`
        : ''}
      <div class="af">
        <div><h4>Atrae</h4><p>${esc(m.atrae)}</p></div>
        <div><h4>Filtra</h4><p>${esc(m.filtra)}</p></div>
      </div>${swatches(m)}${acceso(m)}${pendientes(m)}
    </article>`;
}

function construirSitio(tokens) {
  const marcas = Object.values(tokens.marcas);
  const conManual = marcas.filter(m => m.manual).length;
  const conColor = marcas.filter(m => m.color && m.color.length).length;

  const secciones = TIERS.map(t => {
    const deTier = marcas.filter(m => m.tier === t.n && !m.padre);
    const cuerpo = deTier.map(m => {
      const hijas = marcas.filter(h => h.padre === m.id);
      if (!hijas.length) return tarjeta(m);
      // Las sub-marcas viven DENTRO de la tarjeta de su estrella.
      return tarjeta(m).replace(/\n    <\/article>$/,
        `\n      <div class="subs">
        <p class="subs-label">Sub-marcas de canal — dentro de la estrella, nunca estrella propia</p>
        <div class="subs-grid">
${hijas.map(tarjeta).join('\n')}
        </div>
      </div>
    </article>`);
    }).join('\n');

    return `  <section class="tier">
    <div class="tier-head">
      <span class="tier-n">TIER ${t.n}</span>
      <h2>${esc(t.nombre)}</h2>
      <p class="tier-nota">${esc(t.nota)}</p>
    </div>
${cuerpo}
  </section>`;
  }).join('\n\n');

  // El CSS se INCRUSTA, no se enlaza: index.html tiene que ser un solo
  // archivo que alguien pueda mandar por correo y que abra con doble clic.
  // assets/constelacion.css es el fuente que se edita; esto es la salida.
  const css = fs.readFileSync(path.join(RAIZ, 'assets', 'constelacion.css'), 'utf8');

  return `<!doctype html>
<html lang="es">
<head>
<meta charset="utf-8">
<meta name="viewport" content="width=device-width, initial-scale=1">
<title>Constelación Linex · Manuales de marca</title>
<meta name="description" content="Las ocho marcas del grupo Linex, su lugar en los tres tiers y el manual de cada una.">
<link rel="preconnect" href="https://fonts.googleapis.com">
<link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
<link rel="stylesheet" href="https://fonts.googleapis.com/css2?family=Geist:wght@400;500;600;700;800&display=swap">
<style>
${css}
</style>
</head>
<body>
<!-- GENERADO POR tools/sync-constelacion.js — NO EDITAR A MANO.
     Cambia brand-tokens.json y corre: node tools/sync-constelacion.js -->
<div class="wrap">
  <header>
    <p class="eyebrow">Grupo Linex · Sistema de marca</p>
    <h1>Constelación Linex</h1>
    <p class="lede">Las ocho marcas del grupo, su lugar en los tres tiers, y el manual de cada una. Lo que todavía no existe aparece como pendiente — nada se aproxima.</p>
    <div class="tally">
      <div><b>${marcas.length}</b><span>marcas en el modelo</span></div>
      <div><b>${conManual}</b><span>con manual vigente</span></div>
      <div><b>${conColor}</b><span>con color definido</span></div>
      <div><b>${marcas.length - conManual}</b><span>pendientes</span></div>
    </div>
  </header>

${secciones}

  <footer>
    <p>Generado desde brand-tokens.json &middot; ${esc(tokens.actualizado)}</p>
    <p>Confidencial &mdash; marca y estrategia digital</p>
  </footer>
</div>
</body>
</html>
`;
}

if (require.main === module) {
  const tokens = JSON.parse(
    fs.readFileSync(path.join(RAIZ, 'brand-tokens.json'), 'utf8'));
  fs.writeFileSync(path.join(RAIZ, 'index.html'), construirSitio(tokens));
  const n = Object.keys(tokens.marcas).length;
  const conManual = Object.values(tokens.marcas).filter(m => m.manual).length;
  console.log(`index.html generado · ${n} marcas · ${conManual} con manual`);
}

module.exports = { construirSitio };
