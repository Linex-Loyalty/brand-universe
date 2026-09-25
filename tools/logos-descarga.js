#!/usr/bin/env node
/* El paquete de logos de cada manual, y el botón que lo descarga.
 *
 * POR QUÉ EXISTE
 * La pregunta que más se repite sobre un manual es "¿dónde bajo el logo?".
 * La respuesta tiene que estar a un clic desde cualquier página, no
 * enterrada en la sección 01. Así que cada manual lleva un .zip con sus
 * logos oficiales y un botón en el menú lateral de sus 16 páginas; la
 * tarjeta de la Constelación enlaza al mismo .zip (ver sync-constelacion.js).
 *
 * QUÉ ENTRA EN EL ZIP
 * Solo lo que brand-tokens.json declara en `logos` — las versiones SVG —
 * más el PNG hermano de cada una, si existe en Logos/logos-oficiales/. Nada
 * de propuestas ni de copias sueltas: el paquete no puede repartir un logo
 * que el JSON no reconoce como oficial.
 *
 * DÓNDE VIVE
 * Dentro de cada manual (assets/descargas/), no en Logos/: un manual es
 * autocontenido y no referencia nada con ../ — así se manda la carpeta
 * suelta a un proveedor y el botón sigue funcionando.
 *
 * El zip es "stored" (sin compresión: SVG pequeños y PNG ya comprimidos) y
 * con fecha fija, para que el mismo contenido dé siempre los mismos bytes.
 * Eso es lo que permite a --check decir si quedó desactualizado.
 *
 * USO
 *   node tools/logos-descarga.js           # regenera zips y botones
 *   node tools/logos-descarga.js --check   # falla si algo quedó viejo
 */

const fs = require('fs');
const path = require('path');

const RAIZ = path.resolve(__dirname, '..');

const MANUALES = {
  'linex-travel': 'LinexTravel',
  'linex-go': 'LinexGo',
  'linex-trip': 'LinexTrip',
};

const VERSIONES = ['principal', 'negativo', 'monocromo', 'negro'];

/* Ruta del zip relativa a la raíz del repo, o null si la marca no tiene. */
function rutaZip(m) {
  const prefijo = MANUALES[m.id];
  if (!prefijo || !m.manual) return null;
  return `${m.manual}assets/descargas/${prefijo}-logos.zip`;
}

function archivosDe(m) {
  const lista = [];
  for (const v of VERSIONES) {
    const svg = m.logos && m.logos[v];
    if (!svg) continue;
    lista.push(svg);
    const png = svg.replace(/\.svg$/, '.png');
    if (fs.existsSync(path.join(RAIZ, png))) lista.push(png);
  }
  return [...new Set(lista)];
}

/* ---------- zip mínimo, determinista ---------- */

const TABLA_CRC = (() => {
  const t = new Uint32Array(256);
  for (let n = 0; n < 256; n++) {
    let c = n;
    for (let k = 0; k < 8; k++) c = c & 1 ? 0xEDB88320 ^ (c >>> 1) : c >>> 1;
    t[n] = c >>> 0;
  }
  return t;
})();

function crc32(buf) {
  let c = 0xFFFFFFFF;
  for (const b of buf) c = TABLA_CRC[(c ^ b) & 0xFF] ^ (c >>> 8);
  return (c ^ 0xFFFFFFFF) >>> 0;
}

// 2026-01-01 00:00, en formato MS-DOS.
const FECHA = ((2026 - 1980) << 9) | (1 << 5) | 1;
const HORA = 0;

function zip(entradas) {
  const locales = [];
  const centrales = [];
  let offset = 0;

  for (const { nombre, datos } of entradas) {
    const n = Buffer.from(nombre, 'utf8');
    const crc = crc32(datos);

    const local = Buffer.alloc(30);
    local.writeUInt32LE(0x04034b50, 0);
    local.writeUInt16LE(20, 4);        // versión necesaria
    local.writeUInt16LE(0x0800, 6);    // nombres en UTF-8
    local.writeUInt16LE(0, 8);         // stored
    local.writeUInt16LE(HORA, 10);
    local.writeUInt16LE(FECHA, 12);
    local.writeUInt32LE(crc, 14);
    local.writeUInt32LE(datos.length, 18);
    local.writeUInt32LE(datos.length, 22);
    local.writeUInt16LE(n.length, 26);
    local.writeUInt16LE(0, 28);
    locales.push(local, n, datos);

    const central = Buffer.alloc(46);
    central.writeUInt32LE(0x02014b50, 0);
    central.writeUInt16LE(20, 4);
    central.writeUInt16LE(20, 6);
    central.writeUInt16LE(0x0800, 8);
    central.writeUInt16LE(0, 10);
    central.writeUInt16LE(HORA, 12);
    central.writeUInt16LE(FECHA, 14);
    central.writeUInt32LE(crc, 16);
    central.writeUInt32LE(datos.length, 20);
    central.writeUInt32LE(datos.length, 24);
    central.writeUInt16LE(n.length, 28);
    central.writeUInt32LE(offset, 42);
    centrales.push(central, n);

    offset += 30 + n.length + datos.length;
  }

  const dir = Buffer.concat(centrales);
  const fin = Buffer.alloc(22);
  fin.writeUInt32LE(0x06054b50, 0);
  fin.writeUInt16LE(entradas.length, 8);
  fin.writeUInt16LE(entradas.length, 10);
  fin.writeUInt32LE(dir.length, 12);
  fin.writeUInt32LE(offset, 16);
  return Buffer.concat([...locales, dir, fin]);
}

function construirZip(m) {
  return zip(archivosDe(m).map(ruta => ({
    nombre: path.basename(ruta),
    datos: fs.readFileSync(path.join(RAIZ, ruta)),
  })));
}

/* ---------- el botón del menú lateral ---------- */

const INICIO = '<!--descarga-logos-->';
const FIN = '<!--/descarga-logos-->';

function boton(m, eol) {
  const archivo = path.basename(rutaZip(m));
  return `${INICIO}${eol}    <a class="descarga-logos" href="assets/descargas/${archivo}" download>` +
    `<span data-lang="es">Descargar logos</span><span data-lang="en">Download logos</span>` +
    `<small>SVG + PNG &middot; .zip</small></a>${eol}    ${FIN}`;
}

/* Va justo debajo del selector de idioma del menú lateral — no del de la
   barra superior, que aparece antes en el archivo. Respeta el fin de línea
   de cada página: Trip y Go van en CRLF, Travel en LF. */
function conBoton(html, m) {
  const eol = html.includes('\r\n') ? '\r\n' : '\n';
  const bloque = boton(m, eol);
  const a = html.indexOf(INICIO);
  if (a !== -1) {
    const b = html.indexOf(FIN, a);
    if (b === -1) throw new Error('marcador de cierre ausente');
    return html.slice(0, a) + bloque + html.slice(b + FIN.length);
  }
  const marca = html.indexOf('class="sidebar-brand"');
  if (marca === -1) return null;
  const selector = html.indexOf('<div class="idioma-switch">', marca);
  const cierre = html.indexOf('</div>', selector);
  if (selector === -1 || cierre === -1) return null;
  const tras = cierre + '</div>'.length;
  return html.slice(0, tras) + eol + '    ' + bloque + html.slice(tras);
}

/* ---------- orquestación ---------- */

function revisar(tokens, escribir) {
  const viejos = [];
  for (const id of Object.keys(MANUALES)) {
    const m = tokens.marcas[id];
    const ruta = rutaZip(m);
    if (!ruta) continue;

    const zipNuevo = construirZip(m);
    const zipDisco = path.join(RAIZ, ruta);
    if (!fs.existsSync(zipDisco) || !fs.readFileSync(zipDisco).equals(zipNuevo)) {
      viejos.push(ruta);
      if (escribir) {
        fs.mkdirSync(path.dirname(zipDisco), { recursive: true });
        fs.writeFileSync(zipDisco, zipNuevo);
      }
    }

    const dirManual = path.join(RAIZ, m.manual);
    for (const f of fs.readdirSync(dirManual).filter(f => f.endsWith('.html'))) {
      const p = path.join(dirManual, f);
      const antes = fs.readFileSync(p, 'utf8');
      const despues = conBoton(antes, m);
      if (despues === null) throw new Error(`${m.manual}${f}: no encuentro el menú lateral`);
      if (despues !== antes) {
        viejos.push(`${m.manual}${f}`);
        if (escribir) fs.writeFileSync(p, despues);
      }
    }
  }
  return viejos;
}

if (require.main === module) {
  const tokens = JSON.parse(fs.readFileSync(path.join(RAIZ, 'brand-tokens.json'), 'utf8'));
  const check = process.argv.includes('--check');
  const viejos = revisar(tokens, !check);
  if (check) {
    if (viejos.length) {
      console.error('Desactualizado — corre node tools/logos-descarga.js:\n  ' + viejos.join('\n  '));
      process.exit(1);
    }
    console.log('zips y botones al día');
  } else {
    console.log(viejos.length ? `actualizados ${viejos.length} archivos` : 'nada que cambiar');
  }
}

module.exports = { rutaZip, archivosDe, construirZip, conBoton, revisar, crc32 };
