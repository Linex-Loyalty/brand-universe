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

test('ninguna marca sin datos inventa color, logo ni voz', () => {
  for (const id of ['linex-capital', 'linex-travel', 'linex-marketplace',
                    'linex-rewards', 'linex-school']) {
    const m = tokens.marcas[id];
    assert.deepStrictEqual(m.color, [], `${id} tiene colores inventados`);
    assert.strictEqual(m.voz, null, `${id} tiene voz inventada`);
    assert.ok(Object.values(m.logos).every(v => v === null),
      `${id} tiene un logo inventado`);
    assert.ok(m.pendientes.length > 0, `${id} no declara qué le falta`);
  }
});

test('las seis sin manual declaran estado pendiente', () => {
  for (const id of ['linex-capital', 'linex-loyalty', 'linex-travel',
                    'linex-marketplace', 'linex-rewards', 'linex-school']) {
    assert.strictEqual(tokens.marcas[id].estado, 'pendiente');
  }
});

test('una marca sin registro de marca no admite el símbolo', () => {
  for (const id of ['linex-trip', 'linex-go']) {
    const m = tokens.marcas[id];
    assert.strictEqual(m.estado, 'confirmed_pending_trademark');
    assert.strictEqual(m.legal.admite_simbolo_marca, false,
      `${id} no puede admitir ™/® con el registro pendiente`);
  }
});

test('Trip y Go comparten iconografía y radios', () => {
  const t = tokens.marcas['linex-trip'];
  const g = tokens.marcas['linex-go'];
  assert.deepStrictEqual(t.iconografia, g.iconografia);
  assert.deepStrictEqual(t.radios, g.radios);
  assert.deepStrictEqual(t.radios, { s: 6, btn: 12, m: 16, l: 24, pill: 999 });
  assert.deepStrictEqual(t.radios, tokens.grupo.radios);
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

test('Trip registra la deuda de contraste del cambio de color', () => {
  const cc = tokens.marcas['linex-trip'].cambio_color;
  assert.ok(cc, 'falta el registro del cambio de color');
  assert.ok(/1A0E3E/i.test(cc.que), 'no nombra el Índigo que se reemplazó');
  assert.ok(/16\.83|17\.85/.test(cc.deuda), 'no registra los contrastes viejos');
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
