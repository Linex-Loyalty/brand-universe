#!/usr/bin/env node
/* La franja de "Representamos a" del manual, desde los archivos reales.
 *
 * POR QUÉ EXISTE
 * Hertz, Dollar, Thrifty, Disney y Assistviaje son marcas de terceros. Sus logos
 * llegan por goteo y cada uno con su formato. Escribir la franja a mano lleva a
 * lo de siempre: una marca puesta como texto cuando ya existe su archivo, o un
 * <img> apuntando a algo que nadie subió.
 *
 * Aquí la lista vive una vez. Cada marca se dibuja con su logo si el archivo
 * está, y con su nombre en texto si todavía no — marcada como pendiente, para
 * que se vea qué falta en vez de disimularlo.
 *
 * DÓNDE VAN LOS ARCHIVOS
 *   brand-system/assets/logos-aliados/        ← la fuente
 *   manual-linex-go/assets/logos-aliados/     ← la copia que publica el sitio
 * El script copia de la primera a la segunda, así que basta con dejarlos en la
 * fuente y correrlo.
 *
 * USO
 *   node tools/sync-aliados.js            aplica
 *   node tools/sync-aliados.js --dry-run  dice qué cambiaría
 */

const fs = require("fs");
const path = require("path");

const RAIZ = path.resolve(__dirname, "..");
const FUENTE = path.resolve(RAIZ, "../assets/logos-aliados");
const COPIA = path.join(RAIZ, "assets/logos-aliados");
const PAGINA = path.join(RAIZ, "01-logotipo.html");
const DRY = process.argv.includes("--dry-run");

/* El orden es el del acuerdo comercial, no alfabético: es el que usa la sección
   11 del PDF oficial y el que espera ver el equipo de ventas. */
const ALIADOS = [
  { id: "hertz", nombre: "Hertz" },
  { id: "dollar", nombre: "Dollar" },
  { id: "thrifty", nombre: "Thrifty" },
  { id: "disney", nombre: "Disney" },
  { id: "assistviaje", nombre: "Assistviaje" },
];

const EXTENSIONES = [".svg", ".png", ".webp"];

function archivoDe(id) {
  for (const ext of EXTENSIONES) {
    if (fs.existsSync(path.join(FUENTE, id + ext))) return id + ext;
  }
  return null;
}

/* ---------- copiar la fuente al manual ---------- */
let copiados = 0;
if (!DRY) fs.mkdirSync(COPIA, { recursive: true });
for (const a of ALIADOS) {
  const f = archivoDe(a.id);
  if (!f) continue;
  const origen = path.join(FUENTE, f);
  const destino = path.join(COPIA, f);
  const distinto = !fs.existsSync(destino) ||
    fs.readFileSync(origen).compare(fs.readFileSync(destino)) !== 0;
  if (distinto) { if (!DRY) fs.copyFileSync(origen, destino); copiados++; }
}

/* ---------- dibujar la franja ----------
   Los logos van a la misma altura, no al mismo ancho: un logo horizontal y uno
   cuadrado con el mismo ancho se ven de tamaños distintos. La altura común es
   lo que cumple la regla de "todos del mismo tamaño entre sí".

   16 px y no más: los archivos que tenemos miden 31 px de alto, así que a 16 px
   siguen nítidos en pantallas de doble densidad (16 × 2 = 32) y por encima de
   eso empiezan a verse blandos. */
function franja() {
  const piezas = ALIADOS.map(a => {
    const f = archivoDe(a.id);
    return f
      ? `        <img src="assets/logos-aliados/${f}" alt="${a.nombre}" style="height:16px; width:auto; display:block; opacity:0.72;">`
      : `        <span class="small-note" style="font-weight:700; color:rgba(var(--base-rgb),0.66);">${a.nombre}<em style="font-style:normal; font-weight:700; color:var(--coral); font-size:9px; margin-left:4px;">falta</em></span>`;
  });
  return `      <div style="background:var(--paper); border-top:1px solid rgba(var(--base-rgb),0.1); padding:12px 20px; display:flex; align-items:center; gap:16px; flex-wrap:wrap;" data-aliados>
        <span class="small-note" style="font-size:9px; font-weight:700;">Representamos a</span>
${piezas.join("\n")}
      </div>`;
}

/* ---------- aplicar ---------- */
let t = fs.readFileSync(PAGINA, "utf8");
const antes = t;

/* La franja se reconoce por data-aliados; la primera vez todavía no lo lleva, así
   que se acepta también la versión escrita a mano que empieza por el rótulo. */
const marcado = /^ *<div style="background:var\(--paper\)[^>]*>\n(?: *<span class="small-note"[^>]*>Representamos a[\s\S]*?)<\/div>/m;
if (!marcado.test(t)) throw new Error("no encontré la franja de aliados en 01-logotipo.html");
t = t.replace(marcado, franja());

if (!DRY && t !== antes) fs.writeFileSync(PAGINA, t);

/* ---------- reportar ---------- */
const con = ALIADOS.filter(a => archivoDe(a.id));
const sin = ALIADOS.filter(a => !archivoDe(a.id));
console.log((DRY ? "SIMULACRO · " : "") + "franja de aliados " + (t === antes ? "sin cambios" : "actualizada"));
console.log("  copiados al manual: " + copiados);
console.log("  con logo: " + (con.length ? con.map(a => a.nombre).join(", ") : "ninguno"));
console.log("  pendientes: " + (sin.length ? sin.map(a => a.nombre).join(", ") : "ninguno"));
if (sin.length) console.log("  → déjalos en brand-system/assets/logos-aliados/ como " +
  sin.map(a => a.id + ".svg").join(", ") + " y vuelve a correr esto.");
