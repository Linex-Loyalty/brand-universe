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
 * BILINGÜE
 * Mismo mecanismo que el manual de Linex Travel: cada texto vive dos
 * veces, envuelto en <span data-lang="es">/<span data-lang="en">, y un
 * selector solo-CSS decide cuál se ve. Sin JavaScript — esta página tiene
 * una prueba que lo exige ("el sitio no depende de JavaScript"), porque
 * tiene que abrir con doble clic y funcionar como archivo, sin servidor.
 *
 * Un campo sin su "_en" no se inventa: bi() cae de vuelta al español bajo
 * las dos banderas, para que nunca aparezca un hueco en blanco — pero eso
 * es una señal de que falta traducir, no una traducción lograda.
 *
 * USO
 *   node tools/sync-constelacion.js
 */

const fs = require('fs');
const path = require('path');

const RAIZ = path.resolve(__dirname, '..');
const { rutaZip } = require('./logos-descarga.js');

const esc = s => String(s == null ? '' : s)
  .replace(/&/g, '&amp;').replace(/</g, '&lt;')
  .replace(/>/g, '&gt;').replace(/"/g, '&quot;');

/* Envuelve un texto en sus dos idiomas. Si falta la versión en inglés,
 * repite el español bajo las dos banderas — nunca un hueco vacío. */
function bi(es, en) {
  const safeEs = esc(es);
  const safeEn = en != null ? esc(en) : safeEs;
  return `<span data-lang="es">${safeEs}</span><span data-lang="en">${safeEn}</span>`;
}

const TIERS = [
  { n: 1, nombre: 'El fondo', nombre_en: 'The foundation',
    nota: 'Comunicación corporativa · global y estático',
    nota_en: 'Corporate communication · global and static' },
  { n: 2, nombre: 'El puerto espacial', nombre_en: 'The space port',
    nota: 'El punto de entrada a la constelación — no una caja de pago',
    nota_en: "The constellation's point of entry — not a payment box" },
  { n: 3, nombre: 'Las estrellas', nombre_en: 'The stars',
    nota: 'Motores comerciales · cada una con su genio y su público',
    nota_en: 'Commercial engines · each with its own genie and audience' },
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

/* Cincuenta y tantos pendientes repartidos en ocho marcas no caben
 * abiertos: la tarjeta se vuelve su propia lista de tareas y entierra lo
 * que la gente viene a buscar —la paleta y el botón del manual—. Van
 * colapsados, con el conteo a la vista: el número es el dato, la lista es
 * el detalle.
 *
 * <details> nativo, no JavaScript: abre con doble clic sobre el archivo,
 * sin servidor, lo navega el teclado y se imprime desplegado.
 *
 * Un bloqueante nace abierto. Colapsar sirve para ordenar lo que espera,
 * nunca para esconder lo que detiene.
 *
 * Y son <li>, no chips: el pendiente más largo de hoy tiene 261
 * caracteres. Un chip de 261 caracteres no es un chip, es un párrafo con
 * borde. */
function pendientes(m) {
  if (!m.pendientes || !m.pendientes.length) return '';

  const esBloqueante = p => /^BLOQUEANTE/.test(p);
  const n = m.pendientes.length;
  const bloqueantes = m.pendientes.filter(esBloqueante).length;
  const pendientesEn = m.pendientes_en || [];

  const items = m.pendientes.map((p, i) =>
    `<li class="${esBloqueante(p) ? 'stop' : 'gap'}">${bi(p, pendientesEn[i])}</li>`
  ).join('\n          ');

  const resumen = `<b>${n}</b> ${bi(n === 1 ? 'pendiente' : 'pendientes', n === 1 ? 'pending item' : 'pending items')}` +
    (bloqueantes
      ? ` <span class="sum-stop">· ${bloqueantes} ${bi(bloqueantes === 1 ? 'bloqueante' : 'bloqueantes', bloqueantes === 1 ? 'blocker' : 'blockers')}</span>`
      : '');

  return `\n      <details class="gaps"${bloqueantes ? ' open' : ''}>
        <summary>${resumen}</summary>
        <ul class="gap-list">
          ${items}
        </ul>
      </details>`;
}

/* Una marca en pausa que se ve igual que una activa hace que alguien
 * retome trabajo que el dueño de marca ya paró. El "al retomar" viaja con
 * ella porque es lo único accionable del bloque: sin eso, retomar empieza
 * por reconstruir por qué se paró. */
function pausa(m) {
  const e = m.estado_trabajo;
  if (!e) return '';
  const titulo = e.estado.charAt(0).toUpperCase() + e.estado.slice(1);
  const tituloEn = e.estado_en
    ? e.estado_en.charAt(0).toUpperCase() + e.estado_en.slice(1)
    : null;
  return `\n      <div class="pausa">
        <p class="pausa-q"><b>${bi(titulo, tituloEn)}</b>${e.fecha ? ' · ' + esc(e.fecha) : ''} — ${bi(e.decision, e.decision_en)}</p>${e.al_retomar
          ? `\n        <p class="pausa-r"><span>${bi('Al retomar', 'When resuming')}</span>${bi(e.al_retomar, e.al_retomar_en)}</p>`
          : ''}
      </div>`;
}

/* Descargas de la tarjeta: los logos de la marca (el mismo .zip que baja el
 * botón del menú lateral de su manual, ver tools/logos-descarga.js) y, solo
 * en Travel, la skill de diseño — cubre Travel, Go y Trip pero vive una sola
 * vez, en la estrella que las agrupa como familia.
 *
 * Van aparte del botón del manual y con otro peso a propósito: tres botones
 * rellenos apilados se leían como tres caminos iguales. Abrir el manual es
 * LA acción de la tarjeta; lo que se descarga es un archivo, y se rotula como
 * tal — ícono de descarga y tipo de archivo a la vista. */
const ICONO_DESCARGA = '<svg class="dl-ico" viewBox="0 0 16 16" aria-hidden="true" focusable="false">' +
  '<path d="M8 2v8m0 0L4.5 6.5M8 10l3.5-3.5M2.5 13.5h11" fill="none" stroke="currentColor" ' +
  'stroke-width="1.6" stroke-linecap="round" stroke-linejoin="round"/></svg>';

/* Un enlace que sale del sitio no baja un archivo: abre otra página. Lleva
 * su propio ícono para no prometer una descarga que no ocurre al clic. */
const ICONO_EXTERNO = '<svg class="dl-ico" viewBox="0 0 16 16" aria-hidden="true" focusable="false">' +
  '<path d="M6.5 3.5h-3v9h9v-3M9 2.5h4.5V7M13.5 2.5 7 9" fill="none" stroke="currentColor" ' +
  'stroke-width="1.6" stroke-linecap="round" stroke-linejoin="round"/></svg>';

/* La skill de diseño se publica en Atlas, no como archivo del repositorio. */
const SKILL_URL = 'https://atlas.linexrewards.com/artifact/manual-marca-linex-travel';

function enlaceDescarga(href, es, en, formato) {
  const externo = /^https?:\/\//.test(href);
  const attrs = externo ? ' target="_blank" rel="noopener"' : ' download';
  return `
          <a class="dl" href="${esc(href)}"${attrs}>${externo ? ICONO_EXTERNO : ICONO_DESCARGA}` +
         `<span class="dl-txt"><b>${bi(es, en)}</b><small>${esc(formato)}</small></span></a>`;
}

function descargas(m) {
  const items = [];
  const zip = rutaZip(m);
  if (zip && fs.existsSync(path.join(RAIZ, zip))) {
    items.push(enlaceDescarga(zip, 'Logos', 'Logos', 'SVG + PNG · .zip'));
  }
  if (m.id === 'linex-travel') {
    items.push(enlaceDescarga(SKILL_URL,
      'Skill de diseño', 'Design skill', 'Travel · Go · Trip · Atlas'));
  }
  if (!items.length) return '';
  return `
      <div class="descargas">
        <p class="descargas-t">${bi('Descargas', 'Downloads')}</p>
        <div class="descargas-l">${items.join('')}
        </div>
      </div>`;
}

/* Un manual que no existe no lleva enlace. Nunca href="#". */
function acceso(m) {
  if (m.manual) {
    return `\n      <p class="acceso"><a class="btn" href="${esc(m.manual)}index.html">` +
           `${bi('Abrir el manual de ' + m.nombre, 'Open the ' + m.nombre + ' manual')}</a></p>`;
  }
  return `\n      <p class="acceso sin"><span>${bi('Sin manual todavía', 'No manual yet')}</span></p>`;
}

/* Solo tres marcas tienen un archivo de logo real hoy: las tres que
 * tienen manual. Las otras cinco no tienen manual ni logo todavía — la
 * tarjeta no inventa uno, se queda con el nombre en texto, como siempre. */
const LOGOS = {
  'linex-travel': 'manual-linex-travel/assets/logos/color.svg',
  'linex-go': 'manual-linex-go/assets/logos/color.svg',
  'linex-trip': 'manual-linex-trip/assets/logos/wordmark-color.svg',
};

/* Alto por defecto: 22px (.marca-logo en constelacion.css). Travel es la
 * única excepción — su isotipo se lee más chico que el de Go y Trip a esa
 * misma altura, así que necesita más para pesar igual en la tarjeta. */
const LOGO_ALTURAS = {
  'linex-travel': 39,
};

function tarjeta(m) {
  // El riel de acento solo existe si la marca tiene un color real.
  // Manda el color de acción: en Go el acento azul es el de Travel, y el
  // riel de su tarjeta quedaría igual al de la marca madre.
  const conColor = m.color && m.color.length;
  const acento = conColor
    ? ` style="--acento:${esc((m.color.find(c => /acci[oó]n/i.test(c.rol)) || m.color.find(c => /acento/i.test(c.rol)) || m.color[0]).hex)}"`
    : '';
  const logo = LOGOS[m.id];
  const altura = LOGO_ALTURAS[m.id];

  // Con logo, el nombre en texto sobra — el logo ya lo dice. Sin logo, el
  // nombre en texto es lo único que dice qué marca es esta tarjeta.
  const nombre = logo
    ? `\n          <img class="marca-logo" src="${esc(logo)}" alt="${esc(m.nombre)}"${altura ? ` style="height: ${altura}px;"` : ''}>`
    : `\n          <h3>${esc(m.nombre)}</h3>`;

  return `    <article class="marca${conColor ? '' : ' pend'}"${acento}>
      <div class="marca-top">
        <div>${nombre}
          <p class="dom">${esc(m.dominio)}</p>
        </div>
        <div class="pills">
          <span class="pill ${m.manual ? 'live' : 'soon'}">${bi(m.manual ? 'Vigente' : 'Pendiente', m.manual ? 'Live' : 'Pending')}</span>${m.estado_trabajo
            ? `
          <span class="pill hold">${bi(m.estado_trabajo.estado, m.estado_trabajo.estado_en)}</span>`
            : ''}
        </div>
      </div>
      <p class="rol">${bi(m.rol, m.rol_en)}</p>${m.genio
        ? `\n      <p class="genio">${bi('Genio', 'Genie')} · <b>${esc(m.genio)}</b>${m.genio_nota ? ' — ' + bi(m.genio_nota, m.genio_nota_en) : ''}</p>`
        : ''}${pausa(m)}
      <div class="af">
        <div><h4>${bi('Atrae', 'Attracts')}</h4><p>${bi(m.atrae, m.atrae_en)}</p></div>
        <div><h4>${bi('Filtra', 'Filters out')}</h4><p>${bi(m.filtra, m.filtra_en)}</p></div>
      </div>${swatches(m)}${acceso(m)}${descargas(m)}${pendientes(m)}
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
        <p class="subs-label">${bi('Sub-marcas de canal — dentro de la estrella, nunca estrella propia', 'Channel sub-brands — inside the star, never a star of their own')}</p>
        <div class="subs-grid">
${hijas.map(tarjeta).join('\n')}
        </div>
      </div>
    </article>`);
    }).join('\n');

    return `  <section class="tier">
    <div class="tier-head">
      <span class="tier-n">TIER ${t.n}</span>
      <h2>${bi(t.nombre, t.nombre_en)}</h2>
      <p class="tier-nota">${bi(t.nota, t.nota_en)}</p>
    </div>
${cuerpo}
  </section>`;
  }).join('\n\n');

  // El CSS se INCRUSTA, no se enlaza: index.html tiene que ser un solo
  // archivo que alguien pueda mandar por correo y que abra con doble clic.
  // assets/constelacion.css es el fuente que se edita; esto es la salida.
  const css = fs.readFileSync(path.join(RAIZ, 'assets', 'constelacion.css'), 'utf8');

  return `<!doctype html>
<html lang="en">
<head>
<meta charset="utf-8">
<meta name="viewport" content="width=device-width, initial-scale=1">
<title>Linex Constellation · Brand manuals</title>
<meta name="description" content="The Linex group's eight brands, their place in the three tiers, and each one's manual.">
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
<input type="radio" name="idioma" id="idioma-es" class="idioma-radio">
<input type="radio" name="idioma" id="idioma-en" class="idioma-radio" checked>
<input type="radio" name="tema" id="tema-claro" class="idioma-radio" checked>
<input type="radio" name="tema" id="tema-oscuro" class="idioma-radio">
<div class="wrap">
  <div class="chrome-switches">
    <div class="idioma-switch"><label for="idioma-es">ES</label><label for="idioma-en">EN</label></div>
    <div class="tema-switch"><label for="tema-claro">Claro</label><label for="tema-oscuro">Oscuro</label></div>
  </div>
  <header>
    <p class="eyebrow">${bi('Grupo Linex · Sistema de marca', 'Linex Group · Brand system')}</p>
    <h1>${bi('Constelación Linex', 'Linex Constellation')}</h1>
    <p class="lede">${bi("Las ocho marcas del grupo, su lugar en los tres tiers, y el manual de cada una. Lo que todavía no existe aparece como pendiente — nada se aproxima.", "The group's eight brands, their place in the three tiers, and each one's manual. Whatever doesn't exist yet shows up as pending — nothing gets approximated.")}</p>
    <div class="tally">
      <div><b>${marcas.length}</b><span>${bi('marcas en el modelo', 'brands in the model')}</span></div>
      <div><b>${conManual}</b><span>${bi('con manual vigente', 'with a live manual')}</span></div>
      <div><b>${conColor}</b><span>${bi('con color definido', 'with colour defined')}</span></div>
      <div><b>${marcas.length - conManual}</b><span>${bi('pendientes', 'pending')}</span></div>
    </div>
  </header>

${secciones}

  <footer>
    <p>${bi('Generado desde brand-tokens.json', 'Generated from brand-tokens.json')} &middot; ${esc(tokens.actualizado)}</p>
    <p>${bi('Confidencial — marca y estrategia digital', 'Confidential — brand and digital strategy')}</p>
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
