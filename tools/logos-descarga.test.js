const test = require('node:test');
const assert = require('node:assert');
const fs = require('fs');
const path = require('path');
const { rutaZip, archivosDe, revisar, crc32 } = require('./logos-descarga.js');

const RAIZ = path.resolve(__dirname, '..');
const tokens = JSON.parse(fs.readFileSync(path.join(RAIZ, 'brand-tokens.json'), 'utf8'));
const MARCAS = ['linex-travel', 'linex-go', 'linex-trip'];

test('crc32 da el valor de referencia', () => {
  assert.strictEqual(crc32(Buffer.from('123456789')), 0xCBF43926);
});

/* Si alguien cambia un logo y no regenera, el botón reparte el viejo. */
test('zips y botones están al día con Logos/ y brand-tokens.json', () => {
  assert.deepStrictEqual(revisar(tokens, false), []);
});

test('cada paquete trae solo logos oficiales, en SVG y PNG', () => {
  for (const id of MARCAS) {
    const archivos = archivosDe(tokens.marcas[id]);
    assert.ok(archivos.length >= 4, `${id}: el paquete trae ${archivos.length} archivos`);
    for (const a of archivos) {
      assert.ok(a.startsWith('Logos/logos-oficiales/'), `${id}: ${a} no es un logo oficial`);
      assert.ok(!/propuesta/i.test(a), `${id}: ${a} es una propuesta`);
      assert.ok(/\.(svg|png)$/.test(a), `${id}: ${a} no es SVG ni PNG`);
    }
  }
});

test('el zip vive dentro del manual y cada página lo enlaza sin salir de él', () => {
  for (const id of MARCAS) {
    const m = tokens.marcas[id];
    const zip = rutaZip(m);
    assert.ok(zip.startsWith(m.manual), `${id}: el zip no está dentro de ${m.manual}`);
    assert.ok(fs.existsSync(path.join(RAIZ, zip)), `${id}: falta ${zip}`);
    const dir = path.join(RAIZ, m.manual);
    for (const f of fs.readdirSync(dir).filter(f => f.endsWith('.html'))) {
      const html = fs.readFileSync(path.join(dir, f), 'utf8');
      const enlace = `href="assets/descargas/${path.basename(zip)}" download`;
      assert.strictEqual(html.split(enlace).length - 1, 1, `${m.manual}${f}: el botón no aparece una vez`);
    }
  }
});
