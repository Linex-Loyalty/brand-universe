const { test } = require('node:test');
const assert = require('node:assert');
const fs = require('fs');
const path = require('path');
const { construirSitio } = require('./sync-constelacion.js');

const RUTA = path.join(__dirname, '..', 'brand-tokens.json');
const crudo = fs.readFileSync(RUTA, 'utf8');
const tokens = JSON.parse(crudo);
const copia = () => JSON.parse(crudo);
const html = construirSitio(tokens);

test('incluye las ocho marcas', () => {
  for (const m of Object.values(tokens.marcas)) {
    assert.ok(html.includes(m.nombre), `falta ${m.nombre}`);
  }
});

test('enlaza solo los manuales que existen', () => {
  assert.ok(html.includes('href="manual-linex-trip/index.html"'));
  assert.ok(html.includes('href="manual-linex-go/index.html"'));
  assert.ok(!/href="manual-linex-(travel|rewards|marketplace|school|capital|loyalty)/.test(html),
    'enlaza un manual que no existe');
});

test('las marcas sin manual no dejan enlaces muertos', () => {
  assert.ok(html.includes('Sin manual todavía'));
  assert.ok(!html.includes('href="#"'), 'hay un enlace muerto');
  assert.ok(!html.includes('href=""'), 'hay un href vacío');
});

/* El sitio es del grupo, y el grupo no tiene identidad propia. Si un HEX de
   marca se cuela en los tokens del cromo, el sitio se estaría pintando con un
   color que nadie aprobó para él. */
test('no pinta el cromo con ningún color de marca', () => {
  const desde = html.indexOf(':root {');
  const hasta = html.indexOf('}', desde);
  const raiz = html.slice(desde, hasta);
  for (const hex of ['#FF725E', '#00B5F5', '#C5F04A', '#012D33', '#00145A', '#ECE200', '#E6D5B8', '#004751']) {
    assert.ok(!raiz.includes(hex), `el cromo usa ${hex}, que es color de marca`);
  }
});

test('todo color de marca que aparece viene del JSON', () => {
  const delJson = new Set();
  for (const m of Object.values(tokens.marcas)) {
    for (const c of (m.color || []).concat(m.derivados || [])) {
      delJson.add(c.hex.toUpperCase());
    }
  }
  const marcaHex = /^#(FF725E|00B5F5|C5F04A|012D33|00145A|ECE200|004751|E6D5B8|FFE3DD|E6F8FE|DDE1FF|0090C2)$/;
  const enHtml = (html.match(/#[0-9A-Fa-f]{6}/g) || [])
    .map(h => h.toUpperCase()).filter(h => marcaHex.test(h));
  for (const h of enHtml) {
    assert.ok(delJson.has(h), `${h} aparece en el sitio y no está en brand-tokens.json`);
  }
});

test('define los tres estados de tema', () => {
  assert.ok(html.includes('prefers-color-scheme: dark'));
  assert.ok(html.includes(':root:not([data-theme="light"])'));
  assert.ok(html.includes(':root[data-theme="dark"]'));
});

test('el body pinta su propio fondo', () => {
  assert.ok(/body\s*\{[^}]*background:\s*var\(--ground\)/.test(html),
    'el body sin fondo propio hereda el del anfitrión');
});

test('el sitio refleja un cambio de HEX en el JSON', () => {
  const otro = copia();
  otro.marcas['linex-go'].color.find(c => c.hex === '#FF725E').hex = '#ABCDEF';
  const nuevo = construirSitio(otro);
  assert.ok(nuevo.includes('#ABCDEF'), 'no propagó el cambio');
  assert.ok(!nuevo.includes('#FF725E'), 'dejó el color viejo');
});

test('un manual nuevo en el JSON aparece enlazado', () => {
  const otro = copia();
  otro.marcas['linex-rewards'].manual = 'manual-linex-go/';
  const nuevo = construirSitio(otro);
  const bloque = nuevo.slice(nuevo.indexOf('Linex Rewards'));
  assert.ok(bloque.includes('Abrir el manual de Linex Rewards'),
    'no enlazó el manual nuevo');
});

test('escapa el contenido para no romper el HTML', () => {
  const otro = copia();
  otro.marcas['linex-go'].nombre = 'Linex <script>alert(1)</script> Go';
  const nuevo = construirSitio(otro);
  assert.ok(!nuevo.includes('<script>alert(1)</script>'), 'no escapó el contenido');
});

test('Go y Trip salen anidadas dentro de Travel', () => {
  const travel = html.indexOf('Linex Travel');
  const subs = html.indexOf('Sub-marcas de canal', travel);
  const go = html.indexOf('Linex Go', subs);
  const trip = html.indexOf('Linex Trip', subs);
  assert.ok(subs > travel, 'falta el bloque de sub-marcas dentro de Travel');
  assert.ok(go > subs && trip > subs, 'Go y Trip no están anidadas');
});

/* No se exige que EXISTA un bloqueante — ojalá no exista ninguno. Se exige la
   correspondencia en los dos sentidos: todo bloqueante del JSON sale
   destacado, y nada sale destacado sin serlo. */
test('los pendientes BLOQUEANTE, y solo esos, se destacan aparte', () => {
  const enJson = Object.values(tokens.marcas)
    .flatMap(m => m.pendientes || [])
    .filter(p => /^BLOQUEANTE/.test(p));

  const stops = html.match(/class="stop">([^<]*)</g) || [];
  assert.strictEqual(stops.length, enJson.length,
    `el JSON tiene ${enJson.length} bloqueantes y el sitio destaca ${stops.length}`);
  assert.ok(stops.every(s => /BLOQUEANTE/.test(s)),
    'algo se marcó como bloqueante sin serlo');
});

test('cada marca dice si tiene manual o qué le falta', () => {
  for (const m of Object.values(tokens.marcas)) {
    const i = html.indexOf(`<h3>${m.nombre}</h3>`);
    assert.ok(i > -1, `falta la tarjeta de ${m.nombre}`);
    const bloque = html.slice(i, i + 4000);
    assert.ok(/Abrir el manual|Sin manual todavía/.test(bloque),
      `${m.nombre} no dice su estado de manual`);
  }
});
