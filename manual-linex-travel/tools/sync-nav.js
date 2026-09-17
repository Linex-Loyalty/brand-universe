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
 * BILINGÜE
 * Cada título vive con su traducción al lado (titulo / titulo_en), y las tres
 * piezas que este script genera —menú, índice y paginador— emiten los dos,
 * envueltos en <span data-lang="es">/<span data-lang="en">. El selector de
 * idioma de assets/style.css decide cuál se ve; aquí no se decide nada de eso,
 * solo se escribe el dato una vez para que no se desincronice entre las 16
 * páginas. Si un título cambia, cambia en este archivo y en ningún otro.
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
    titulo: "A · Identidad visual", titulo_en: "A · Visual identity",
    secciones: [
      { n: "01", archivo: "01-logotipo.html",            titulo: "Logotipo",                          titulo_en: "Logo" },
      { n: "02", archivo: "02-estado-logotipo.html",     titulo: "Estado del logotipo",                titulo_en: "Logo status" },
      { n: "03", archivo: "03-paleta-color.html",        titulo: "Paleta de color",                    titulo_en: "Colour palette" },
      { n: "04", archivo: "04-tipografia.html",          titulo: "Tipografía",                         titulo_en: "Typography" },
      { n: "05", archivo: "05-iconografia-canal.html",   titulo: "Iconografía y diseño por canal",     titulo_en: "Iconography and channel design" },
      { n: "06", archivo: "06-sistema-fotografia.html",  titulo: "Sistema gráfico y fotografía",       titulo_en: "Graphic system and photography" },
      { n: "07", archivo: "07-accesibilidad.html",       titulo: "Accesibilidad",                      titulo_en: "Accessibility" },
    ],
  },
  {
    titulo: "B · Quién es y cómo habla", titulo_en: "B · Who it is and how it speaks",
    secciones: [
      { n: "08", archivo: "08-arquitectura.html",        titulo: "Arquitectura y nombre",              titulo_en: "Architecture and naming" },
      { n: "09", archivo: "09-audiencias.html",          titulo: "Audiencias",                         titulo_en: "Audiences" },
      { n: "10", archivo: "10-propuesta-valor.html",     titulo: "Propuesta de valor y claims",        titulo_en: "Value proposition and claims" },
      { n: "11", archivo: "11-voz-tono.html",            titulo: "Voz y tono",                         titulo_en: "Voice and tone" },
      { n: "12", archivo: "12-vocabulario.html",         titulo: "Vocabulario",                        titulo_en: "Vocabulary" },
    ],
  },
  {
    titulo: "C · Cómo se aplica", titulo_en: "C · How it is applied",
    secciones: [
      { n: "13", archivo: "13-promociones-cta.html",     titulo: "Promociones y CTA",                  titulo_en: "Promotions and CTAs" },
      { n: "14", archivo: "14-entregables.html",         titulo: "Entregables y aplicaciones",         titulo_en: "Deliverables and applications" },
      { n: "15", archivo: "15-redes-sociales.html",      titulo: "Redes sociales",                     titulo_en: "Social media" },
    ],
  },
];

/* Las pocas cadenas de interfaz que este script escribe fuera de BLOQUES. */
const UI = {
  portada: { es: "Portada", en: "Home" },
  resumen: { es: "Resumen ejecutivo", en: "Executive summary" },
  anterior: { es: "Anterior", en: "Previous" },
  siguiente: { es: "Siguiente", en: "Next" },
  enCurso: { es: "en curso", en: "in progress" },
};

/* Envuelve un par es/en en los dos spans que el CSS alterna. Es la única
   función que "sabe" del selector de idioma — todo lo demás solo la llama. */
const bi = (es, en) => `<span data-lang="es">${es}</span><span data-lang="en">${en}</span>`;

const TODAS = BLOQUES.flatMap(b => b.secciones);
const existe = s => fs.existsSync(path.join(RAIZ, s.archivo));

/* ---------- menú lateral ----------
   Misma estructura que el manual de Linex Trip: cada bloque es un <nav> con su
   propio aria-label (así el lector de pantalla puede saltar entre bloques, cosa
   que un <div> no permite) y el menú abre con la portada, para que volver al
   resumen sea un elemento de la lista y no solo el logo de arriba.

   El aria-label lleva los dos idiomas separados por "/": no es texto visible,
   así que el selector de idioma no lo puede alternar, y un lector de pantalla
   lee igual de bien "A · Identidad visual / A · Visual identity" que solo uno
   de los dos. */
function sidebar(actual) {
  const grupo = (etiquetaEs, etiquetaEn, tituloBi, items) =>
    `    <nav class="nav-group" aria-label="${etiquetaEs} / ${etiquetaEn}">
${tituloBi ? `        <span class="nav-group-title">${tituloBi}</span>\n` : ""}        <ul class="nav-list">
${items}
        </ul>
    </nav>`;

  const portadaActiva = actual === "index.html" ? ' class="active" aria-current="page"' : "";
  const portada = grupo(UI.portada.es, UI.portada.en, null,
    `          <li><a href="index.html"${portadaActiva}><span class="n">00</span><span>${bi(UI.resumen.es, UI.resumen.en)}</span></a></li>`);

  const grupos = BLOQUES.map(b => {
    const items = b.secciones.map(s => {
      const clase = s.archivo === actual ? ' class="active" aria-current="page"' : "";
      const titulo = bi(s.titulo, s.titulo_en);
      return existe(s)
        ? `          <li><a href="${s.archivo}"${clase}><span class="n">${s.n}</span><span>${titulo}</span></a></li>`
        : `          <li><span class="pendiente"><span class="n">${s.n}</span><span>${titulo}</span></span></li>`;
    }).join("\n");
    return grupo(b.titulo, b.titulo_en, bi(b.titulo, b.titulo_en), items);
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

  const dirPrev = bi("&larr; " + UI.anterior.es, "&larr; " + UI.anterior.en);
  const dirNext = bi(UI.siguiente.es + " &rarr;", UI.siguiente.en + " &rarr;");

  const izq = prev
    ? `<a class="prev" href="${prev.archivo}"><span class="dir">${dirPrev}</span><span class="lbl">${prev.n} &middot; ${bi(prev.titulo, prev.titulo_en)}</span></a>`
    : `<a class="prev" href="index.html"><span class="dir">${dirPrev}</span><span class="lbl">${bi(UI.portada.es, UI.portada.en)}</span></a>`;
  const der = next
    ? `<a class="next" href="${next.archivo}"><span class="dir">${dirNext}</span><span class="lbl">${next.n} &middot; ${bi(next.titulo, next.titulo_en)}</span></a>`
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
      const titulo = bi(s.titulo, s.titulo_en);
      const et = existe(s)
        ? '<a href="' + s.archivo + '" style="' + EST_LINK + ' color:var(--base);">'
          + '<span style="font-weight:700; flex:none; width:18px; color:var(--apoyo);">' + s.n + '</span>'
          + titulo + '</a>'
        : '<span style="' + EST_LINK + ' color:rgba(var(--base-rgb),0.45);">'
          + '<span style="font-weight:700; flex:none; width:18px;">' + s.n + '</span>'
          + titulo
          + '<em style="margin-left:auto; font-size:10.5px; font-weight:700; font-style:normal; color:var(--coral);">' + bi(UI.enCurso.es, UI.enCurso.en) + '</em></span>';
      return "        <li>" + et + "</li>";
    }).join("\n");
    return '      <div>\n'
      + '        <span class="nav-group-title" style="color:var(--apoyo); padding-left:0;">' + bi(b.titulo, b.titulo_en) + '</span>\n'
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
