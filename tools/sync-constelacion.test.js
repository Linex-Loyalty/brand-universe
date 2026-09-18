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

/* Llevaba los seis ids sin manual escritos a mano y se quedó vieja el día que
   Linex Travel estrenó el suyo. Derivada exige más: que cada manual declarado
   se enlace, que ninguno sin declarar aparezca, y que el archivo exista. */
test('enlaza los manuales que existen, y solo esos', () => {
  const marcas = Object.values(tokens.marcas);
  const conManual = marcas.filter(m => m.manual);
  assert.ok(conManual.length > 0, 'ninguna marca declara manual');

  for (const m of conManual) {
    const href = `href="${m.manual}index.html"`;
    assert.ok(html.includes(href), `${m.id} declara manual y el sitio no lo enlaza`);
    assert.ok(fs.existsSync(path.join(__dirname, '..', m.manual, 'index.html')),
      `${m.id} enlaza ${m.manual} y ese archivo no existe en disco`);
  }

  for (const m of marcas.filter(m => !m.manual)) {
    assert.ok(!html.includes(`href="manual-${m.id.replace(/^linex-/, 'linex-')}/`),
      `${m.id} no tiene manual y el sitio lo enlaza`);
  }
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

test('el tema es claro por defecto, oscuro solo por elección explícita', () => {
  // Decisión del dueño de marca (2026-09-18): nada de auto-oscuro por
  // preferencia del sistema — quien entra ve claro, y el oscuro es un
  // interruptor visible, igual que el de idioma.
  assert.ok(!html.includes('prefers-color-scheme: dark'),
    'no debe depender de la preferencia del sistema operativo');
  assert.ok(html.includes('id="tema-claro"') && html.includes('id="tema-oscuro"'),
    'faltan los radios del selector de tema');
  assert.ok(/id="tema-claro"[^>]*\schecked/.test(html),
    'el tema claro debe ser el que arranca marcado');
  assert.ok(!/id="tema-oscuro"[^>]*\schecked/.test(html),
    'el tema oscuro no debe arrancar marcado');
  assert.ok(html.includes('#tema-oscuro:checked ~ .wrap'),
    'el oscuro debe aplicarse solo cuando el visitante lo elige');
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

/* ---------- el componente de pendientes ----------
   Cincuenta pendientes repartidos en ocho marcas no caben abiertos: la
   tarjeta pasa a ser su propia lista de tareas y entierra lo que la gente
   viene a buscar —la paleta y el botón del manual—. Van colapsados, con el
   conteo a la vista para que nadie tenga que abrirlos para saber cuántos son. */

/* Corta la tarjeta de una marca: de su <h3> al <h3> siguiente. Las
   sub-marcas van después del contenido propio de su estrella, así que
   esto devuelve lo de cada una sin mezclarlo. */
function tarjetaDe(doc, nombre) {
  const i = doc.indexOf(`<h3>${nombre}</h3>`);
  if (i < 0) return '';
  const j = doc.indexOf('<h3>', i + 1);
  return doc.slice(i, j < 0 ? doc.length : j);
}

test('los pendientes van colapsados y dicen cuántos son sin abrirlos', () => {
  for (const m of Object.values(tokens.marcas)) {
    const n = (m.pendientes || []).length;
    const card = tarjetaDe(html, m.nombre);
    if (!n) {
      assert.ok(!/<details class="gaps"/.test(card),
        `${m.nombre} no tiene pendientes y aun así muestra el desplegable`);
      continue;
    }
    assert.ok(/<details class="gaps"/.test(card),
      `los pendientes de ${m.nombre} no están colapsados`);
    const resumen = (card.match(/<summary[^>]*>([\s\S]*?)<\/summary>/) || [])[1] || '';
    assert.ok(resumen.includes(`<b>${n}</b>`),
      `el resumen de ${m.nombre} no dice que son ${n}: "${resumen.trim()}"`);
  }
});

/* Colapsar nunca puede esconder algo que detiene el trabajo. */
test('un pendiente bloqueante deja el desplegable abierto', () => {
  const t = copia();
  t.marcas['linex-school'].pendientes.push('BLOQUEANTE prueba');
  const card = tarjetaDe(construirSitio(t), t.marcas['linex-school'].nombre);
  assert.match(card, /<details class="gaps" open>/,
    'el bloqueante quedó escondido detrás de un desplegable cerrado');

  const sinBloqueante = tarjetaDe(html, tokens.marcas['linex-school'].nombre);
  assert.ok(!/<details class="gaps" open>/.test(sinBloqueante),
    'sin bloqueantes el desplegable debería nacer cerrado');
});

/* Una marca en pausa que se ve igual que una activa hace que alguien
   retome trabajo que el dueño de marca ya paró. */
test('la marca en pausa lo dice en la tarjeta, y solo ella', () => {
  const enPausa = Object.values(tokens.marcas).filter(m => m.estado_trabajo);
  const pills = html.match(/class="pill hold"/g) || [];
  assert.strictEqual(pills.length, enPausa.length,
    `${enPausa.length} marcas con estado de trabajo y ${pills.length} marcadas`);

  for (const m of enPausa) {
    const card = tarjetaDe(html, m.nombre);
    assert.ok(card.includes(m.estado_trabajo.estado), `${m.nombre} no dice su estado`);
    assert.ok(card.includes(m.estado_trabajo.al_retomar),
      `${m.nombre} no dice por dónde se retoma — que es lo único accionable`);
  }
});

/* Un desplegable hecho con <details> abre con doble clic sobre el archivo,
   sin servidor, y lo navega el teclado. Uno hecho con JS, no siempre. */
test('el sitio no depende de JavaScript', () => {
  assert.ok(!/<script/i.test(html), 'apareció un <script> en el sitio');
});

/* El componente de pendientes se lee en los dos modos. Los pares se
   declaran aquí a mano —el CSS no es analizable de forma confiable— y el
   valor se recalcula: es el mismo criterio que verificar-tokens.js aplica
   sobre el JSON. Un contraste escrito a mano envejece; uno medido, no. */
test('el componente de pendientes cumple AA en claro y en oscuro', () => {
  const { contraste, cumple } = require('./contraste.js');

  const claro = { surface: '#FFFFFF', sunk: '#EDF0F7', ink: '#0E1526',
    ink2: '#545E78', ink3: '#7A849C', stop: '#A33A32', stopbg: '#FBE9E7' };
  const oscuro = { surface: '#121827', sunk: '#0E1422', ink: '#E9EDF8',
    ink2: '#A2ACC6', ink3: '#7B85A0', stop: '#F09189', stopbg: '#2C1613' };

  // [qué es, frente, fondo, es objeto gráfico (umbral 3:1) o texto (4.5:1)]
  const pares = t => [
    ['píldora de estado de trabajo', t.ink, t.surface, false],
    ['resumen del desplegable', t.ink2, t.surface, false],
    ['conteo en negrita', t.ink, t.surface, false],
    ['triángulo del desplegable', t.ink2, t.surface, true],
    ['ítem de la lista', t.ink2, t.surface, false],
    ['viñeta del ítem', t.ink3, t.surface, true],
    ['ítem bloqueante', t.stop, t.stopbg, false],
    ['texto del bloque de pausa', t.ink2, t.sunk, false],
    ['rótulo AL RETOMAR', t.ink2, t.sunk, false],
  ];

  for (const [modo, t] of [['claro', claro], ['oscuro', oscuro]]) {
    for (const [qué, frente, fondo, gráfico] of pares(t)) {
      const r = contraste(frente, fondo);
      assert.ok(cumple(r, 'AA', gráfico),
        `${qué} en modo ${modo}: ${r.toFixed(2)}:1 — ` +
        `no llega a ${gráfico ? '3' : '4.5'}:1`);
    }
  }
});

/* ---------- bilingüe ----------
   El mismo mecanismo del manual de Linex Travel, con el mismo riesgo: un
   span[data-lang] puede terminar cerrando un elemento ajeno —una <li>, un
   <div>, un <article>— sin que el CONTEO de aperturas y cierres lo delate,
   porque no se agregó ni se quitó ninguna etiqueta, solo se anidó mal. Por
   eso se revisa el contenido de cada span, no solo su cantidad. */
test('el sitio es bilingüe: cada texto tiene su par en el otro idioma', () => {
  const es = (html.match(/data-lang="es"/g) || []).length;
  const en = (html.match(/data-lang="en"/g) || []).length;
  assert.strictEqual(es, en,
    `${es} marcas "es" contra ${en} "en" — un idioma quedó sin su par`);
  assert.ok(es > 0, 'no se encontró ningún span bilingüe');
});

test('ningún span bilingüe cierra un elemento ajeno', () => {
  const re = /<span data-lang="(es|en)">((?:(?!<span data-lang).)*?)<\/span>/gs;
  const rotos = [];
  let m;
  while ((m = re.exec(html))) {
    if (/<\/(div|li|article|section|ul|h[1-4]|p)>/.test(m[2])) rotos.push(m[0].slice(0, 80));
  }
  assert.deepStrictEqual(rotos, [],
    'un span[data-lang] envuelve el cierre de un elemento que no le pertenece');
});

test('el selector de idioma no depende de brand-tokens.json para existir', () => {
  // Aunque una marca no tenga _en, el sitio no deja un hueco: bi() cae de
  // vuelta al español bajo las dos banderas. Se comprueba con un token sin
  // traducir a propósito.
  const t = copia();
  delete t.marcas['linex-go'].atrae_en;
  const conHueco = construirSitio(t);
  const i = conHueco.indexOf('<h3>Linex Go</h3>');
  const bloque = conHueco.slice(i, i + 3000);
  assert.ok(/<span data-lang="en">Agencias y operadores/.test(bloque),
    'sin traducción, el inglés debería repetir el español, no quedar vacío');
});
