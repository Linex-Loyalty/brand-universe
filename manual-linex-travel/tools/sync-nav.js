#!/usr/bin/env node
/* La navegación del manual de Linex Travel, desde una sola definición.
 *
 * POR QUÉ EXISTE
 * Son 15 secciones. Mantener el menú lateral y el paginador a mano en 24
 * archivos es cómo se desincronizan los manuales: alguien renombra una sección
 * y quedan seis páginas apuntando al nombre viejo. Aquí la lista vive una vez y
 * se inyecta en todas.
 *
 * El manual se está construyendo por bloques. Las secciones que todavía no
 * existen aparecen en el menú en gris y sin enlace, en vez de dar 404: quien
 * entra ve el mapa completo y sabe qué falta.
 *
 * USO
 *   node tools/sync-nav.js            aplica
 *   node tools/sync-nav.js --dry-run  dice qué cambiaría
 */

const fs = require("fs");
const path = require("path");

const RAIZ = path.resolve(__dirname, "..");
const DRY = process.argv.includes("--dry-run");

/* El índice es el mismo de los manuales de Linex Trip y Linex Go, por decisión
   del administrador de marca (2026-09-15): las mismas quince secciones, en los
   mismos tres bloques y en el mismo orden, para que quien conoce un manual del
   grupo sepa moverse en el otro sin volver a aprenderlo.

   La única ranura que varía entre manuales es la 02, y depende del estado del
   logotipo. En Trip es Propuestas de logo, porque su isotipo está sin decidir.
   Aquí es Estado del logotipo, como en Go: el de Travel ya está decidido y lo
   que falta son piezas —vertical, avatar, con eslogan— más tres cosas que no
   cuadran entre los archivos y el manual oficial. */
const BLOQUES = [
  {
    titulo: "A · Identidad visual",
    secciones: [
      { n: "01", archivo: "01-logotipo.html",            titulo: "Logotipo" },
      { n: "02", archivo: "02-estado-logotipo.html",     titulo: "Estado del logotipo" },
      { n: "03", archivo: "03-paleta-color.html",        titulo: "Paleta de color" },
      { n: "04", archivo: "04-tipografia.html",          titulo: "Tipografía" },
      { n: "05", archivo: "05-iconografia-canal.html",   titulo: "Iconografía y diseño por canal" },
      { n: "06", archivo: "06-sistema-fotografia.html",  titulo: "Sistema gráfico y fotografía" },
      { n: "07", archivo: "07-accesibilidad.html",       titulo: "Accesibilidad" },
    ],
  },
  {
    titulo: "B · Quién es y cómo habla",
    secciones: [
      { n: "08", archivo: "08-arquitectura.html",        titulo: "Arquitectura y nombre" },
      { n: "09", archivo: "09-audiencias.html",          titulo: "Audiencias" },
      { n: "10", archivo: "10-propuesta-valor.html",     titulo: "Propuesta de valor y claims" },
      { n: "11", archivo: "11-voz-tono.html",            titulo: "Voz y tono" },
      { n: "12", archivo: "12-vocabulario.html",         titulo: "Vocabulario" },
    ],
  },
  {
    titulo: "C · Cómo se aplica",
    secciones: [
      { n: "13", archivo: "13-promociones-cta.html",     titulo: "Promociones y CTA" },
      { n: "14", archivo: "14-entregables.html",         titulo: "Entregables y aplicaciones" },
      { n: "15", archivo: "15-redes-sociales.html",      titulo: "Redes sociales" },
    ],
  },
];

const TODAS = BLOQUES.flatMap(b => b.secciones);
const existe = s => fs.existsSync(path.join(RAIZ, s.archivo));

/* ---------- menú lateral ----------
   Misma estructura que el manual de Linex Trip: cada bloque es un <nav> con su
   propio aria-label (así el lector de pantalla puede saltar entre bloques, cosa
   que un <div> no permite) y el menú abre con la portada, para que volver al
   resumen sea un elemento de la lista y no solo el logo de arriba. */
function sidebar(actual) {
  const grupo = (etiqueta, titulo, items) =>
    `    <nav class="nav-group" aria-label="${etiqueta}">
${titulo ? `        <span class="nav-group-title">${titulo}</span>\n` : ""}        <ul class="nav-list">
${items}
        </ul>
    </nav>`;

  const portadaActiva = actual === "index.html" ? ' class="active" aria-current="page"' : "";
  const portada = grupo("Portada", null,
    `          <li><a href="index.html"${portadaActiva}><span class="n">00</span><span>Resumen ejecutivo</span></a></li>`);

  const grupos = BLOQUES.map(b => {
    const items = b.secciones.map(s => {
      const clase = s.archivo === actual ? ' class="active" aria-current="page"' : "";
      return existe(s)
        ? `          <li><a href="${s.archivo}"${clase}><span class="n">${s.n}</span><span>${s.titulo}</span></a></li>`
        : `          <li><span class="pendiente"><span class="n">${s.n}</span><span>${s.titulo}</span></span></li>`;
    }).join("\n");
    return grupo(b.titulo, b.titulo, items);
  });

  return [portada].concat(grupos).join("\n");
}

/* ---------- paginador ----------
   Salta las secciones que todavía no existen: el paginador nunca lleva a un 404. */
function pager(actual) {
  const escritas = TODAS.filter(existe);
  const i = escritas.findIndex(s => s.archivo === actual);
  const prev = i > 0 ? escritas[i - 1] : null;
  const next = i >= 0 && i < escritas.length - 1 ? escritas[i + 1] : null;

  const izq = prev
    ? `<a class="prev" href="${prev.archivo}"><span class="dir">&larr; Anterior</span><span class="lbl">${prev.n} &middot; ${prev.titulo}</span></a>`
    : `<a class="prev" href="index.html"><span class="dir">&larr; Anterior</span><span class="lbl">Portada</span></a>`;
  const der = next
    ? `<a class="next" href="${next.archivo}"><span class="dir">Siguiente &rarr;</span><span class="lbl">${next.n} &middot; ${next.titulo}</span></a>`
    : `<span class="spacer"></span>`;
  return `      <div class="pager">${izq}${der}</div>`;
}

/* ---------- índice de la portada ----------
   La portada lista las 15 por bloque. Sale de la misma definición que el menú,
   así que los dos no se pueden desincronizar. */
const EST_LINK = 'display:flex; gap:10px; padding:7px 0; font-size:13.5px; border-bottom:1px solid rgba(var(--base-rgb),0.07);';

function indice() {
  return BLOQUES.map(b => {
    const filas = b.secciones.map(s => {
      const et = existe(s)
        ? '<a href="' + s.archivo + '" style="' + EST_LINK + ' color:var(--base);">'
          + '<span style="font-weight:700; flex:none; width:18px; color:var(--apoyo);">' + s.n + '</span>'
          + s.titulo + '</a>'
        : '<span style="' + EST_LINK + ' color:rgba(var(--base-rgb),0.45);">'
          + '<span style="font-weight:700; flex:none; width:18px;">' + s.n + '</span>'
          + s.titulo
          + '<em style="margin-left:auto; font-size:10.5px; font-weight:700; font-style:normal; color:var(--coral);">en curso</em></span>';
      return "        <li>" + et + "</li>";
    }).join("\n");
    return '      <div>\n'
      + '        <span class="nav-group-title" style="color:var(--apoyo); padding-left:0;">' + b.titulo + '</span>\n'
      + '        <ul style="list-style:none; margin:8px 0 0; padding:0;">\n'
      + filas + "\n"
      + "        </ul>\n"
      + "      </div>";
  }).join("\n");
}

/* ---------- aplicar ---------- */
let tocados = 0;
for (const s of [{ archivo: "index.html" }].concat(TODAS.filter(existe))) {
  const p = path.join(RAIZ, s.archivo);
  let t = fs.readFileSync(p, "utf8");
  const antes = t;

  t = t.replace(/<!--nav-->[\s\S]*?<!--\/nav-->/,
    "<!--nav-->\n" + sidebar(s.archivo) + "\n    <!--/nav-->");
  t = t.replace(/<!--indice-->[\s\S]*?<!--\/indice-->/,
    '<!--indice-->\n  <div class="grid-3" style="gap:22px; align-items:start;">\n'
    + indice() + "\n  </div>\n  <!--/indice-->");
  t = t.replace(/<!--pager-->[\s\S]*?<!--\/pager-->/,
    "<!--pager-->\n" + pager(s.archivo) + "\n      <!--/pager-->");

  if (t !== antes) { if (!DRY) fs.writeFileSync(p, t); tocados++; }
}

const hechas = TODAS.filter(existe).length;
console.log((DRY ? "SIMULACRO · " : "") + "navegación sincronizada en " + tocados + " páginas");
console.log("  secciones escritas: " + hechas + " de " + TODAS.length);
const faltan = TODAS.filter(s => !existe(s));
if (faltan.length) console.log("  faltan: " + faltan.map(s => s.n).join(" "));
