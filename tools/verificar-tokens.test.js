const { test } = require('node:test');
const assert = require('node:assert');
const fs = require('fs');
const path = require('path');
const { verificar } = require('./verificar-tokens.js');

const RUTA = path.join(__dirname, '..', 'brand-tokens.json');
const crudo = fs.readFileSync(RUTA, 'utf8');
const tokens = JSON.parse(crudo);
const copia = () => JSON.parse(crudo);

/* ---------- el archivo real ---------- */

test('el JSON real no tiene errores', () => {
  const { errores } = verificar(tokens);
  assert.deepStrictEqual(errores, [], 'brand-tokens.json tiene errores');
});

test('están las ocho marcas del modelo', () => {
  assert.deepStrictEqual(Object.keys(tokens.marcas).sort(), [
    'linex-capital', 'linex-go', 'linex-loyalty', 'linex-marketplace',
    'linex-rewards', 'linex-school', 'linex-travel', 'linex-trip'
  ]);
});

test('los tiers coinciden con el Modelo de Constelación', () => {
  assert.strictEqual(tokens.marcas['linex-capital'].tier, 1);
  assert.strictEqual(tokens.marcas['linex-loyalty'].tier, 2);
  for (const id of ['linex-travel', 'linex-marketplace', 'linex-rewards',
                    'linex-school', 'linex-go', 'linex-trip']) {
    assert.strictEqual(tokens.marcas[id].tier, 3, `${id} debería ser tier 3`);
  }
});

test('Go y Trip cuelgan de Travel; nadie más tiene padre', () => {
  assert.strictEqual(tokens.marcas['linex-go'].padre, 'linex-travel');
  assert.strictEqual(tokens.marcas['linex-trip'].padre, 'linex-travel');
  const conPadre = Object.values(tokens.marcas).filter(m => m.padre).map(m => m.id).sort();
  assert.deepStrictEqual(conPadre, ['linex-go', 'linex-trip']);
});

test('solo Loyalty y Rewards tienen genio nombrado', () => {
  const conGenio = Object.values(tokens.marcas)
    .filter(m => m.genio).map(m => m.id).sort();
  assert.deepStrictEqual(conGenio, ['linex-loyalty', 'linex-rewards']);
  assert.strictEqual(tokens.marcas['linex-loyalty'].genio, 'Ixar');
  assert.strictEqual(tokens.marcas['linex-rewards'].genio, 'Milton');
});

test('Trip y Go tienen siete colores cada una', () => {
  assert.strictEqual(tokens.marcas['linex-trip'].color.length, 7);
  assert.strictEqual(tokens.marcas['linex-go'].color.length, 7);
});

test('las proporciones de cada marca documentada suman 100', () => {
  for (const id of ['linex-trip', 'linex-go']) {
    const suma = tokens.marcas[id].color.reduce((t, c) => t + (c.proporcion || 0), 0);
    assert.strictEqual(suma, 100, `${id} suma ${suma}, no 100`);
  }
});

test('Loyalty tiene el Verde con su regla dura', () => {
  const verde = tokens.marcas['linex-loyalty'].color.find(c => c.hex === '#C5F04A');
  assert.ok(verde, 'falta el Verde de Loyalty');
  assert.ok(verde.regla.contrastes['#FFFFFF'], 'falta medir sobre blanco');
  assert.ok(verde.regla.nunca.length > 0,
    'un color que muere sobre blanco necesita prohibiciones');
});

/* La regla de oro del sistema, hecha mecánica: el dato tiene que tener
   procedencia. Una marca sin manual, sin contexto y sin documento fuente no
   puede tener paleta, voz ni logo — eso sería dato inventado.

   Antes esta prueba llevaba los cinco ids escritos a mano y se quedó vieja el
   día que Linex Travel consiguió su manual oficial. Derivada no se envejece. */
test('ninguna marca sin fuente tiene color, voz ni logo', () => {
  for (const m of Object.values(tokens.marcas)) {
    if (m.manual || m.contexto || m.fuente) continue;
    assert.deepStrictEqual(m.color, [], `${m.id}: paleta sin fuente que la respalde`);
    assert.strictEqual(m.voz, null, `${m.id}: voz sin fuente`);
    assert.ok(Object.values(m.logos).every(v => v === null),
      `${m.id}: logo sin fuente`);
    assert.ok(m.pendientes.length > 0, `${m.id} no declara qué le falta`);
  }
});

/* El estado describe la MARCA, no el manual. Linex Travel tuvo paleta y voz
   antes que manual, y ahí dejó de estar pendiente. Sin una de las dos, no hay
   marca definida todavía. */
test('a la marca sin paleta o sin voz le corresponde estado pendiente', () => {
  for (const m of Object.values(tokens.marcas)) {
    if (m.color.length && m.voz) continue;
    assert.strictEqual(m.estado, 'pendiente',
      `${m.id} no tiene marca definida y su estado dice "${m.estado}"`);
  }
});

test('ninguna marca con el registro pendiente admite el símbolo', () => {
  const conEstado = Object.values(tokens.marcas)
    .filter(m => m.estado === 'confirmed_pending_trademark');
  assert.ok(conEstado.length > 0, 'nadie declara el estado de registro');
  for (const m of conEstado) {
    assert.strictEqual(m.legal.admite_simbolo_marca, false,
      `${m.id} no puede admitir ™/® con el registro pendiente`);
  }
});

/* Ya no son dos: Travel entró con la misma decisión de grupo. La prueba
   recorre todas las que dicen heredar del grupo, sin nombrarlas. */
test('toda marca que hereda del grupo comparte iconografía y radios', () => {
  const herederas = Object.values(tokens.marcas)
    .filter(m => m.iconografia === 'grupo');
  assert.ok(herederas.length >= 3, 'esperaba al menos Trip, Go y Travel');
  for (const m of herederas) {
    assert.deepStrictEqual(m.radios, tokens.grupo.radios,
      `${m.id} dice heredar del grupo pero tiene otros radios`);
    assert.deepStrictEqual(m.radios, { s: 6, btn: 12, m: 16, l: 24, pill: 999 });
  }
});

/* brand-system/ se perdió y sus diez rutas quedaron rotas. El archivo puede
   NOMBRARLO en prosa para explicar de dónde viene el dato — eso es historia
   útil. Lo que no puede es tener un VALOR que sea una ruta ahí dentro, porque
   entonces el agente mandaría a alguien a un sitio que no existe. */
test('ningún valor del JSON es una ruta a brand-system/', () => {
  const rutas = [];
  const recorrer = v => {
    if (typeof v === 'string') { if (/^brand-system\//.test(v)) rutas.push(v); }
    else if (v && typeof v === 'object') Object.values(v).forEach(recorrer);
  };
  recorrer(tokens);
  assert.deepStrictEqual(rutas, [], 'quedaron rutas brand-system/ sin remapear');
});

test('toda ruta declarada existe en disco', () => {
  const faltan = [];
  const recorrer = v => {
    if (typeof v === 'string') {
      if (/^(Logos|manual-linex|docs|assets|tools)\//.test(v) &&
          !fs.existsSync(path.join(__dirname, '..', v))) faltan.push(v);
    } else if (v && typeof v === 'object') Object.values(v).forEach(recorrer);
  };
  recorrer(tokens);
  assert.deepStrictEqual(faltan, [], 'hay rutas que no existen');
});

/* La deuda se saldó el 17-sep-2026, pero el registro se queda: es la historia
   que explica por qué alguien puede encontrar un 17.85 en una copia vieja. */
test('Trip conserva el registro del cambio de color y su corrección', () => {
  const cc = tokens.marcas['linex-trip'].cambio_color;
  assert.ok(cc, 'falta el registro del cambio de color');
  assert.ok(/1A0E3E/i.test(cc.que), 'no nombra el Índigo que se reemplazó');
  assert.ok(/SALDADA/.test(cc.deuda), 'no registra que la deuda se corrigió');
  assert.ok(cc.correcciones, 'falta la tabla de correcciones');
});

/* Cada corrección se vuelve a calcular: si alguien "arregla" un número a mano
   y se equivoca, esto lo atrapa. */
test('las seis correcciones de contraste de Trip se sostienen', () => {
  const { contraste } = require('./contraste.js');
  const navy = '#00145A';
  const pares = {
    blanco_sobre_navy: '#FFFFFF', celeste_sobre_navy: '#00B5F5',
    papel_sobre_navy: '#F6F8FF', celeste_cielo_sobre_navy: '#E6F8FE',
    lavanda_sobre_navy: '#DDE1FF', celeste_oscuro_sobre_navy: '#0090C2',
  };
  const c = tokens.marcas['linex-trip'].cambio_color.correcciones;
  for (const [k, hex] of Object.entries(pares)) {
    const real = contraste(hex, navy);
    assert.ok(Math.abs(real - c[k].real) < 0.02,
      `${k}: el JSON dice ${c[k].real} y el real es ${real.toFixed(2)}`);
    assert.ok(Math.abs(real - c[k].decia) > 0.1,
      `${k}: el valor viejo ${c[k].decia} no era erróneo`);
  }
});

/* El manual ya no debe contener ninguno de los seis valores viejos. */
test('el manual de Trip ya no tiene ratios del Índigo', () => {
  const viejos = ['17.85:1', '7.59:1', '16.82:1', '16.34:1', '13.85:1', '4.90:1'];
  const dir = path.join(__dirname, '..', 'manual-linex-trip');
  const encontrados = [];
  for (const f of fs.readdirSync(dir).filter(f => f.endsWith('.html'))) {
    const t = fs.readFileSync(path.join(dir, f), 'utf8');
    for (const v of viejos) if (t.includes(v)) encontrados.push(`${f}: ${v}`);
  }
  assert.deepStrictEqual(encontrados, [], 'quedaron ratios del Índigo');
});

/* ---------- el verificador detecta lo que tiene que detectar ---------- */

test('detecta un contraste afirmado que no se sostiene', () => {
  const malo = copia();
  malo.marcas['linex-trip'].color
    .find(c => c.hex === '#ECE200').regla.contrastes['#00145A'] = 3.0;
  const { errores } = verificar(malo);
  assert.ok(errores.some(e => /contraste/i.test(e) && /ECE200/i.test(e)),
    'no detectó el ratio falso');
});

test('detecta un color con restricción pero sin su medición', () => {
  const malo = copia();
  malo.marcas['linex-trip'].color
    .find(c => c.hex === '#ECE200').regla.contrastes = {};
  const { errores } = verificar(malo);
  assert.ok(errores.some(e => /sin medición/i.test(e)), 'no exigió la medición');
});

test('detecta una ruta de logo que no existe en disco', () => {
  const malo = copia();
  malo.marcas['linex-trip'].logos.principal = 'Logos/no-existe.svg';
  const { errores } = verificar(malo);
  assert.ok(errores.some(e => /no existe/i.test(e)), 'no detectó la ruta rota');
});

test('detecta proporciones que no cierran', () => {
  const malo = copia();
  malo.marcas['linex-go'].color[0].proporcion = 99;
  const { errores } = verificar(malo);
  assert.ok(errores.some(e => /proporciones suman/i.test(e)), 'no detectó la suma mala');
});

test('detecta un ™ con el registro pendiente', () => {
  const malo = copia();
  malo.marcas['linex-go'].legal.admite_simbolo_marca = true;
  const { errores } = verificar(malo);
  assert.ok(errores.some(e => /registro pendiente/i.test(e)), 'no detectó el símbolo indebido');
});

test('detecta un id que no coincide con su clave', () => {
  const malo = copia();
  malo.marcas['linex-go'].id = 'otra-cosa';
  const { errores } = verificar(malo);
  assert.ok(errores.some(e => /el campo id dice/i.test(e)), 'no detectó el id cruzado');
});
