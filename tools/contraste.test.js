const { test } = require('node:test');
const assert = require('node:assert');
const { luminancia, contraste, cumple } = require('./contraste.js');

// Tolerancia: los manuales redondean a dos decimales.
const cerca = (a, b, msg) => assert.ok(Math.abs(a - b) < 0.02,
  `${msg}: esperado ~${b}, obtenido ${a.toFixed(4)}`);

test('reproduce los contrastes documentados de Linex Go', () => {
  cerca(contraste('#FFFFFF', '#012D33'), 14.74, 'blanco / petróleo');
  cerca(contraste('#012D33', '#F8F9FC'), 14.00, 'petróleo / blanco frío');
  cerca(contraste('#E6D5B8', '#012D33'), 10.23, 'arena / petróleo');
  cerca(contraste('#012D33', '#FF725E'),  5.49, 'petróleo / coral');
  cerca(contraste('#FFFFFF', '#FF725E'),  2.69, 'blanco / coral — prohibido');
  cerca(contraste('#E6D5B8', '#F8F9FC'),  1.37, 'arena / blanco frío — prohibido');
});

test('reproduce los contrastes documentados de Linex Trip', () => {
  cerca(contraste('#ECE200', '#00145A'), 12.38, 'amarillo / azul trip');
  cerca(contraste('#00145A', '#00B5F5'),  7.16, 'azul trip / celeste — el botón');
  cerca(contraste('#0090C2', '#FFFFFF'),  3.64, 'celeste oscuro / blanco — ícono');
  cerca(contraste('#00B5F5', '#FFFFFF'),  2.35, 'celeste / blanco — prohibido');
  cerca(contraste('#00B5F5', '#E6F8FE'),  2.15, 'celeste / celeste cielo — prohibido');
  cerca(contraste('#ECE200', '#FFFFFF'),  1.36, 'amarillo / blanco — prohibido');
});

/* Tres cifras del manual de Trip quedaron sin recalcular tras el cambio de
   color del 14 de septiembre de 2026 (Índigo #1A0E3E → Azul Trip #00145A).
   Coinciden exactamente con el Índigo viejo, a dos decimales:

     par                 manual   con Índigo   con Azul Trip
     blanco / navy       17.85      17.85          16.83
     celeste / navy       7.59       7.59           7.16
     papel  / navy       16.82      16.82          15.86

   El manual quedó a medias: contiene 16.82 y 16.83, 7.59 y 7.16. El Amarillo
   está bien porque nació con el color nuevo.

   NINGUNA REGLA SE ROMPE: los tres pares siguen por encima de 7:1, así que
   los veredictos AAA del manual se sostienen. Solo los números están viejos.

   Estos tests fijan el valor REAL. Corregir el manual de Trip está fuera del
   alcance de esta fase; queda reportado. */
test('detecta los ratios que el cambio de color dejó viejos en Trip', () => {
  cerca(contraste('#FFFFFF', '#00145A'), 16.83, 'blanco / azul trip (el manual dice 17.85)');
  cerca(contraste('#00B5F5', '#00145A'),  7.16, 'celeste / azul trip (el manual dice 7.59)');
  cerca(contraste('#F6F8FF', '#00145A'), 15.86, 'papel / azul trip (el manual dice 16.82)');

  // Y la prueba de que vienen del Índigo: con el color viejo dan exacto.
  cerca(contraste('#FFFFFF', '#1A0E3E'), 17.85, 'blanco / índigo viejo');
  cerca(contraste('#00B5F5', '#1A0E3E'),  7.59, 'celeste / índigo viejo');
  cerca(contraste('#F6F8FF', '#1A0E3E'), 16.82, 'papel / índigo viejo');
});

test('reproduce el Verde de Loyalty', () => {
  cerca(contraste('#C5F04A', '#FFFFFF'),  1.32, 'verde / blanco — desaparece');
  cerca(contraste('#C5F04A', '#080808'), 15.20, 'verde / negro');
  // 12.77, no 12.91: el 12.91 fue un error de cálculo a mano durante el diseño.
  cerca(contraste('#C5F04A', '#00145A'), 12.77, 'verde / navy');
});

test('el orden de los argumentos no altera el resultado', () => {
  assert.strictEqual(
    contraste('#FFFFFF', '#012D33'),
    contraste('#012D33', '#FFFFFF')
  );
});

test('acepta hex de tres dígitos y sin almohadilla', () => {
  cerca(contraste('#FFF', '#012D33'), 14.74, 'hex corto');
  cerca(contraste('FFFFFF', '012D33'), 14.74, 'sin almohadilla');
});

test('rechaza un hex inválido en vez de devolver un número falso', () => {
  assert.throws(() => luminancia('#GGGGGG'), /hex inválido/);
  assert.throws(() => luminancia('#12345'),  /hex inválido/);
});

test('cumple aplica los umbrales de WCAG 2.1', () => {
  assert.strictEqual(cumple(4.5,  'AA',  false), true);
  assert.strictEqual(cumple(4.49, 'AA',  false), false);
  assert.strictEqual(cumple(3.0,  'AA',  true),  true);
  assert.strictEqual(cumple(7.0,  'AAA', false), true);
  assert.strictEqual(cumple(4.5,  'AAA', true),  true);
  assert.strictEqual(cumple(4.49, 'AAA', true),  false);
});
