# Fundación del sistema de marca Linex + Sitio Constelación — plan de implementación

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Montar la fuente única de verdad de la marca Linex (`brand-tokens.json`), el skill y el agente que la usan, y el sitio Constelación que la publica — todo generado desde el JSON, sin que nada se invente.

**Architecture:** Un JSON gobierna todo. `tools/contraste.js` calcula contraste WCAG y `tools/verificar-tokens.js` lo usa para revalidar cada ratio que el JSON afirma, así que el dato no puede mentir. El skill `/linex-brand` carga un reference por trabajo; el agente `brand-designer` lo ejecuta. `tools/sync-constelacion.js` genera `index.html` desde el JSON, con el mismo criterio que `sync-nav.js` ya aplica en los manuales: lo que no existe sale marcado como pendiente, nunca como enlace muerto.

**Tech Stack:** Node.js (solo `fs`/`path`, sin dependencias), HTML/CSS/JS plano sin build, Markdown para skill y agente. `node:test` para las pruebas unitarias — viene con Node, no se instala nada.

**Spec:** `docs/superpowers/specs/2026-09-16-fundacion-brand-system-design.md`

## Global Constraints

- **Nada se inventa.** Si una marca no tiene logo, color o voz documentada, el valor es `null` y la salida dice "pendiente". Nunca se aproxima ni se rellena.
- **Un token con regla dura no existe sin ella.** Todo color con restricción se guarda con la restricción y su medición.
- **Sin build, sin dependencias, sin runtime.** Todo abre con doble clic en `file://`. Si no abre así, está mal hecho.
- **Los manuales de Trip y Go no se tocan**, salvo los dos archivos de Go que §9 del spec autoriza: `06-sistema-fotografia.html` y `05-iconografia-canal.html`. **Ninguna hoja de estilo se modifica.**
- **Español de Colombia** en todo texto de cara al usuario. Sin mayúscula sostenida.
- **Tipografía del grupo:** Segoe UI + Calibri (operativo) · Geist (digital). Respaldo Arial o Helvetica.
- **Escala de radios del grupo:** `6 · 12 · 16 · 24 · 999` (pill).
- **Iconografía del grupo:** Font Awesome Pro · Classic Regular. Solid solo dentro de contenedor relleno, bajo 4 mm en impreso, y familia Brands.
- **Commits en español**, describiendo el porqué, no solo el qué.

---

### Task 1: Calculadora de contraste WCAG

El cimiento de todo el trabajo de auditoría. Se hace primero porque la Tarea 2 la usa para validar el JSON.

**Files:**
- Create: `tools/contraste.js`
- Test: `tools/contraste.test.js`

**Interfaces:**
- Consumes: nada
- Produces:
  - `luminancia(hex: string) → number` — luminancia relativa 0–1
  - `contraste(hexA: string, hexB: string) → number` — ratio 1–21, orden indiferente
  - `cumple(ratio: number, nivel: 'AA'|'AAA', grande: boolean) → boolean`

- [ ] **Step 1: Escribir el test que falla**

Los valores esperados salen de los manuales, no de la calculadora. Si la calculadora no los reproduce, la calculadora está mal.

```js
// tools/contraste.test.js
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
  cerca(contraste('#FFFFFF', '#00145A'), 17.85, 'blanco / azul trip');
  cerca(contraste('#ECE200', '#00145A'), 12.38, 'amarillo / azul trip');
  cerca(contraste('#00B5F5', '#00145A'),  7.59, 'celeste / azul trip');
  cerca(contraste('#00145A', '#00B5F5'),  7.16, 'azul trip / celeste — el botón');
  cerca(contraste('#00B5F5', '#FFFFFF'),  2.35, 'celeste / blanco — prohibido');
  cerca(contraste('#ECE200', '#FFFFFF'),  1.36, 'amarillo / blanco — prohibido');
});

test('reproduce el Verde de Loyalty', () => {
  cerca(contraste('#C5F04A', '#FFFFFF'),  1.32, 'verde / blanco — desaparece');
  cerca(contraste('#C5F04A', '#080808'), 15.20, 'verde / negro');
  cerca(contraste('#C5F04A', '#00145A'), 12.91, 'verde / navy');
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
```

- [ ] **Step 2: Correr el test y verificar que falla**

Run: `node --test tools/contraste.test.js`
Expected: FAIL — `Cannot find module './contraste.js'`

- [ ] **Step 3: Escribir la implementación mínima**

```js
// tools/contraste.js
/* Contraste WCAG 2.1 para la constelación Linex.
 *
 * POR QUÉ EXISTE
 * Los manuales de Trip y Go afirman decenas de ratios ("5.49:1", "1.36:1")
 * y sobre esos números descansan reglas duras: el coral no es color de
 * texto, el amarillo solo vive sobre el azul. Un número mal copiado
 * convierte una regla en una superstición. Aquí se recalculan.
 *
 * Fórmula: WCAG 2.1, relative luminance + contrast ratio.
 * https://www.w3.org/TR/WCAG21/#dfn-relative-luminance
 */

function normalizar(hex) {
  let h = String(hex).trim().replace(/^#/, '');
  if (h.length === 3) h = h.split('').map(c => c + c).join('');
  if (!/^[0-9a-fA-F]{6}$/.test(h)) {
    throw new Error(`hex inválido: ${hex}`);
  }
  return h;
}

// Linealiza un canal sRGB (0–255) a luz física.
function canal(v) {
  const c = v / 255;
  return c <= 0.04045 ? c / 12.92 : Math.pow((c + 0.055) / 1.055, 2.4);
}

function luminancia(hex) {
  const h = normalizar(hex);
  const r = parseInt(h.slice(0, 2), 16);
  const g = parseInt(h.slice(2, 4), 16);
  const b = parseInt(h.slice(4, 6), 16);
  // Los coeficientes son la sensibilidad del ojo a cada canal.
  return 0.2126 * canal(r) + 0.7152 * canal(g) + 0.0722 * canal(b);
}

function contraste(hexA, hexB) {
  const la = luminancia(hexA);
  const lb = luminancia(hexB);
  const claro = Math.max(la, lb);
  const oscuro = Math.min(la, lb);
  return (claro + 0.05) / (oscuro + 0.05);
}

/* `grande` = ≥24 px regular o ≥18.66 px bold, según WCAG 1.4.3. */
function cumple(ratio, nivel = 'AA', grande = false) {
  const umbral = nivel === 'AAA' ? (grande ? 4.5 : 7) : (grande ? 3 : 4.5);
  return ratio >= umbral;
}

module.exports = { luminancia, contraste, cumple };
```

- [ ] **Step 4: Correr el test y verificar que pasa**

Run: `node --test tools/contraste.test.js`
Expected: PASS — 7 tests.

Si algún ratio falla por más de 0.02, **no ajustes la tolerancia**: o el manual tiene el número mal, o la fórmula está mal. Averigua cuál antes de seguir, y anótalo.

- [ ] **Step 5: Commit**

```bash
git add tools/contraste.js tools/contraste.test.js
git commit -m "Calculadora de contraste WCAG, validada contra los manuales

Los manuales de Trip y Go afirman decenas de ratios y sobre ellos
descansan reglas duras: el coral no es color de texto (2.55:1), el
amarillo solo vive sobre el azul (12.38:1 ahí, 1.36:1 sobre blanco).

El test no comprueba que la calculadora sea consistente consigo misma:
comprueba que reproduce los 15 ratios que los manuales ya publicaron.
Si no los reproduce, la calculadora está mal — no el manual.

Co-Authored-By: Claude Opus 5 (1M context) <noreply@anthropic.com>"
```

---

### Task 2: `brand-tokens.json` — Trip y Go, y el verificador que los valida

Las dos marcas completas primero, con el verificador que prueba que el JSON no miente. Las otras seis van en la Tarea 3.

**Files:**
- Create: `brand-tokens.json`
- Create: `tools/verificar-tokens.js`
- Test: `tools/verificar-tokens.test.js`

**Interfaces:**
- Consumes: `tools/contraste.js` → `contraste()`, `cumple()`
- Produces:
  - `verificar(tokens: object) → { errores: string[], avisos: string[] }`
  - El archivo `brand-tokens.json` con forma `{ version, actualizado, marcas: { <id>: Marca } }`

**Forma de una marca** (la usan las Tareas 3, 4, 5, 6, 9 — respétala exactamente):

```
Marca {
  id, nombre, tier, dominio, padre|null, genio|null, estado,
  atrae: string, filtra: string,
  color: Color[],
  tipografia: { operativo: {titulos, cuerpo, respaldo}, digital: {familia, pesos} },
  iconografia: { libreria, estilo, excepciones: string[] },
  radios: { s, btn, m, l, pill },
  logos: { <variante>: string|null },
  voz: { principios: string[], claim: string|null, vocabulario: {usar, evitar} } | null,
  legal: { operador|null, rnt|null, admite_simbolo_marca: boolean },
  manual: string|null,
  pendientes: string[]
}

Color {
  nombre, hex, rgb: [r,g,b], cmyk: [c,m,y,k]|null,
  rol, proporcion: number|null,
  regla: { solo_sobre: hex|null, nunca: string[], contrastes: {<hex>: number} } | null
}
```

- [ ] **Step 1: Escribir el test que falla**

```js
// tools/verificar-tokens.test.js
const { test } = require('node:test');
const assert = require('node:assert');
const fs = require('fs');
const path = require('path');
const { verificar } = require('./verificar-tokens.js');

const tokens = JSON.parse(
  fs.readFileSync(path.join(__dirname, '..', 'brand-tokens.json'), 'utf8')
);

test('el JSON real no tiene errores', () => {
  const { errores } = verificar(tokens);
  assert.deepStrictEqual(errores, [], 'brand-tokens.json tiene errores');
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

test('detecta un contraste afirmado que no se sostiene', () => {
  const malo = JSON.parse(JSON.stringify(tokens));
  malo.marcas['linex-trip'].color
    .find(c => c.hex === '#ECE200').regla.contrastes['#00145A'] = 3.0;
  const { errores } = verificar(malo);
  assert.ok(errores.some(e => /contraste/i.test(e) && /ECE200/i.test(e)),
    'no detectó el ratio falso');
});

test('detecta un color con restricción pero sin su medición', () => {
  const malo = JSON.parse(JSON.stringify(tokens));
  malo.marcas['linex-trip'].color
    .find(c => c.hex === '#ECE200').regla.contrastes = {};
  const { errores } = verificar(malo);
  assert.ok(errores.some(e => /sin medición/i.test(e)), 'no exigió la medición');
});

test('detecta una ruta de logo que no existe en disco', () => {
  const malo = JSON.parse(JSON.stringify(tokens));
  malo.marcas['linex-trip'].logos.principal = 'Logos/no-existe.svg';
  const { errores } = verificar(malo);
  assert.ok(errores.some(e => /no existe/i.test(e)), 'no detectó la ruta rota');
});

test('ninguna ruta del JSON apunta a brand-system/, que se perdió', () => {
  const crudo = fs.readFileSync(
    path.join(__dirname, '..', 'brand-tokens.json'), 'utf8');
  assert.ok(!crudo.includes('brand-system/'),
    'quedó una ruta brand-system/ sin remapear');
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
});
```

- [ ] **Step 2: Correr el test y verificar que falla**

Run: `node --test tools/verificar-tokens.test.js`
Expected: FAIL — no existe `brand-tokens.json` ni `verificar-tokens.js`.

- [ ] **Step 3: Escribir `brand-tokens.json` con Trip y Go**

Los datos salen de `contexto-linex-trip.md` §5 y `contexto-linex-go.md` §5. **Todas las rutas se remapean** — `brand-system/assets/logos-oficiales/` no existe; los archivos están en `Logos/logos-oficiales/`.

```json
{
  "version": "1.0",
  "actualizado": "2026-09-16",
  "nota": "Fuente única de la constelación Linex. Reconstruido desde contexto-linex-trip.md y contexto-linex-go.md tras perderse brand-system/brand-tokens.json. Si un dato difiere del manual, manda el manual.",
  "grupo": {
    "tipografia": {
      "operativo": { "titulos": "Segoe UI", "cuerpo": "Calibri", "respaldo": ["Arial", "Helvetica"] },
      "digital": { "familia": "Geist", "pesos": [400, 500, 700, 800, 900], "origen": "Google Fonts" },
      "regla": "Segoe UI manda en lo que se ve, Calibri sostiene lo que se lee, Geist viste el sitio y el producto. Nunca al revés.",
      "decidido": "2026-09-16"
    },
    "iconografia": {
      "libreria": "Font Awesome Pro",
      "familia": "Classic",
      "estilo": "Regular",
      "filtro": "classic & s=regular & ic=pro-collection",
      "excepciones": [
        "Solid dentro de un contenedor relleno",
        "Solid por debajo de 4 mm en impreso",
        "Familia Brands para íconos de redes, sin recolorear"
      ],
      "decidido": "2026-09-16"
    },
    "radios": { "s": 6, "btn": 12, "m": 16, "l": 24, "pill": 999 },
    "group_bar": {
      "copy": "Part of Linex Loyalty",
      "posicion": "encima de la navegación propia",
      "obligatorio": true
    },
    "reglas_comunes": [
      "El acento solo pinta lo que se toca. Nunca destaca un dato.",
      "El color oscuro nunca rellena un botón.",
      "Filete de 1 px del color oscuro en el botón (WCAG 1.4.11 pide 3:1).",
      "Sin mayúscula sostenida en ningún canal.",
      "El estado nunca se comunica solo con color."
    ]
  },
  "marcas": {
    "linex-trip": {
      "id": "linex-trip",
      "nombre": "Linex Trip",
      "forma_compacta": "linextrip",
      "tier": 3,
      "rol": "Sub-marca B2C dentro de Linex Travel",
      "dominio": "linextrip.com",
      "padre": "linex-travel",
      "genio": null,
      "estado": "confirmed_pending_trademark",
      "atrae": "El viajero final, para sí o su familia. Canal B2C con precio a la vista.",
      "filtra": "Agencias y operadores — se enrutan a Linex Go.",
      "color": [
        { "nombre": "Azul Trip", "hex": "#00145A", "rgb": [0,20,90], "cmyk": [100,78,0,65],
          "rol": "Principal", "proporcion": 30,
          "regla": { "solo_sobre": null,
            "nunca": ["rellenar un botón"],
            "contrastes": { "#FFFFFF": 17.85, "#00B5F5": 7.16 } } },
        { "nombre": "Celeste Acción", "hex": "#00B5F5", "rgb": [0,181,245], "cmyk": [100,26,0,4],
          "rol": "Acción / CTA", "proporcion": 21,
          "regla": { "solo_sobre": null,
            "nunca": ["texto sobre fondo claro", "texto blanco encima"],
            "contrastes": { "#00145A": 7.59, "#FFFFFF": 2.35, "#E6F8FE": 2.15 } } },
        { "nombre": "Blanco", "hex": "#FFFFFF", "rgb": [255,255,255], "cmyk": [0,0,0,0],
          "rol": "Base y respiro", "proporcion": 19, "regla": null },
        { "nombre": "Celeste Cielo", "hex": "#E6F8FE", "rgb": [230,248,254], "cmyk": [9,2,0,0],
          "rol": "Respiro", "proporcion": 10, "regla": null },
        { "nombre": "Lavanda Linex", "hex": "#DDE1FF", "rgb": [221,225,255], "cmyk": [13,12,0,0],
          "rol": "Apoyo", "proporcion": 8,
          "regla": { "solo_sobre": null, "nunca": ["usarse como texto"],
            "contrastes": { "#FFFFFF": 1.30 } } },
        { "nombre": "Negro Linex", "hex": "#080808", "rgb": [8,8,8], "cmyk": [0,0,0,97],
          "rol": "Reserva para impresión a un color", "proporcion": 8, "regla": null },
        { "nombre": "Amarillo", "hex": "#ECE200", "rgb": [236,226,0], "cmyk": [0,4,100,7],
          "rol": "Detalle", "proporcion": 4,
          "regla": { "solo_sobre": "#00145A",
            "nunca": ["títulos", "botones", "cualquier fondo claro"],
            "contrastes": { "#00145A": 12.38, "#FFFFFF": 1.36 } } }
      ],
      "derivados": [
        { "nombre": "Celeste Oscuro", "hex": "#0090C2",
          "rol": "Ícono de acción sobre fondo claro — no es de la paleta",
          "contrastes": { "#FFFFFF": 3.64, "#F6F8FF": 3.43 } }
      ],
      "tipografia": "grupo",
      "iconografia": "grupo",
      "radios": { "s": 6, "btn": 12, "m": 16, "l": 24, "pill": 999 },
      "logos": {
        "principal": "Logos/logos-oficiales/linex-trip/logo-LinexTrip.svg",
        "editable": "Logos/logos-oficiales/linex-trip/logo-LinexTrip.ai",
        "negativo": null,
        "monocromo": null,
        "isotipo": null
      },
      "logo_nota": "El logotipo vigente es SOLO el wordmark. No hay isotipo. Siete propuestas de símbolo en exploración abierta, dibujadas con el Índigo anterior #1A0E3E: si se elige alguna hay que recolorearla. Nada de esa exploración es vigente.",
      "voz": {
        "principios": ["Claro", "Cercano", "Confiable", "Inspirador"],
        "matiz": "Como un viajero le habla a otro. Más directa que Linex Go.",
        "claim": "Viaja Inteligente",
        "claim_nota": "El único aprobado. Acompaña al nombre, nunca lo reemplaza. No es un CTA.",
        "claims_pendientes": ["Tu próximo viaje, más simple.", "Reserva hoy, viaja tranquilo.", "El mundo, a un clic de distancia."],
        "vocabulario": {
          "usar": ["Viajero", "Reservar", "Vuelo", "Tiquete", "Pagar en cuotas", "Contact Center"],
          "evitar": ["usuario", "cliente", "booking", "ticket", "financiar", "call center", "bookear"]
        }
      },
      "legal": {
        "operador": "Strategic Points S.A.S.",
        "rnt": ["59151", "82366"],
        "ciudad": "Medellín, Colombia",
        "admite_simbolo_marca": false
      },
      "manual": "manual-linex-trip/",
      "contexto": "contexto-linex-trip.md",
      "pendientes": [
        "Isotipo sin decidir — siete propuestas en exploración",
        "Sin banco de fotografía propio",
        "Claims secundarios sin aprobar"
      ]
    },
    "linex-go": {
      "id": "linex-go",
      "nombre": "Linex Go",
      "forma_compacta": "linexgo",
      "tier": 3,
      "rol": "Sub-marca B2B dentro de Linex Travel",
      "dominio": "linexgo.com",
      "padre": "linex-travel",
      "genio": null,
      "estado": "confirmed_pending_trademark",
      "atrae": "Agencias y operadores que necesitan un sistema para vender viaje.",
      "filtra": "El viajero final — se enruta a Linex Trip.",
      "color": [
        { "nombre": "Petróleo", "hex": "#012D33", "rgb": [1,45,51], "cmyk": [98,12,0,80],
          "rol": "Principal", "proporcion": 32,
          "regla": { "solo_sobre": null, "nunca": ["rellenar un botón"],
            "contrastes": { "#FFFFFF": 14.74, "#F8F9FC": 14.00, "#FF725E": 5.49 } } },
        { "nombre": "Petróleo claro", "hex": "#004751", "rgb": [0,71,81], "cmyk": [100,12,0,68],
          "rol": "Apoyo", "proporcion": 18,
          "regla": { "solo_sobre": null, "nunca": [],
            "contrastes": { "#F8F9FC": 9.87, "#FFFFFF": 10.40 } } },
        { "nombre": "Blanco frío", "hex": "#F8F9FC", "rgb": [248,249,252], "cmyk": [2,1,0,1],
          "rol": "Respiro", "proporcion": 18, "regla": null },
        { "nombre": "Coral", "hex": "#FF725E", "rgb": [255,114,94], "cmyk": [0,55,63,0],
          "rol": "Acción — y solo la acción", "proporcion": 12,
          "regla": { "solo_sobre": null,
            "nunca": ["texto sobre fondo claro", "texto blanco encima", "destacar un dato", "soporte de marca"],
            "contrastes": { "#012D33": 5.49, "#FFFFFF": 2.69, "#F8F9FC": 2.55, "#F3F0E9": 2.36 } } },
        { "nombre": "Blanco cálido", "hex": "#F3F0E9", "rgb": [243,240,233], "cmyk": [0,1,4,5],
          "rol": "Apoyo editorial", "proporcion": 10, "regla": null },
        { "nombre": "Coral claro", "hex": "#FFE3DD", "rgb": [255,227,221], "cmyk": [0,11,13,0],
          "rol": "Superficie", "proporcion": 6,
          "regla": { "solo_sobre": null, "nunca": ["usarse como tinta"],
            "contrastes": { "#F8F9FC": 1.15, "#012D33": 12.13 } } },
        { "nombre": "Arena", "hex": "#E6D5B8", "rgb": [230,213,184], "cmyk": [0,7,20,10],
          "rol": "Detalle", "proporcion": 4,
          "regla": { "solo_sobre": "#012D33", "nunca": ["títulos", "botones", "fondo claro"],
            "contrastes": { "#012D33": 10.23, "#004751": 7.21, "#F8F9FC": 1.37 } } }
      ],
      "derivados": [],
      "tipografia": "grupo",
      "iconografia": "grupo",
      "radios": { "s": 6, "btn": 12, "m": 16, "l": 24, "pill": 999 },
      "logos": {
        "principal": "Logos/logos-oficiales/linex-go/logo-LinexGo.svg",
        "editable": null,
        "negativo": null,
        "monocromo": null,
        "vertical": null,
        "avatar": null,
        "con_eslogan": null
      },
      "logo_nota": "BLOQUEANTE. De las quince piezas que define el manual existe una, y no es vectorial: es un PNG de 2645×462 px dentro de un contenedor .svg. Sirve en pantalla y en impresión hasta ~22 cm a 300 dpi, no para gran formato ni para generar las demás versiones recoloreando. La falta de la versión negativa bloquea toda la papelería.",
      "aliados": {
        "nota": "Marcas de terceros bajo acuerdo de representación. No son de la constelación. Nunca se modifican, siempre en zona de aliados y en menor tamaño que Linex Go.",
        "hertz": "Logos/logos-aliados/hertz.png",
        "dollar": "Logos/logos-aliados/dollar.png",
        "thrifty": "Logos/logos-aliados/thrifty.png",
        "disney": null,
        "assistviaje": null,
        "calidad": "Los tres recibidos son PNG monocromos con alfa de 31 px de alto: sirven para pantalla, no para impresión ni gran formato."
      },
      "voz": {
        "principios": ["Profesional", "Cercana", "Útil", "Clara", "Sin tecnicismos"],
        "matiz": "Le habla a quien vende viajes, no a quien los compra.",
        "claim": "Soluciones que impulsan tu agencia de viajes.",
        "claim_nota": "Es el eslogan. Se usa completo, sin recortar ni parafrasear. El concepto rector es 'Tu aliado en cada venta'.",
        "claims_pendientes": [],
        "vocabulario": {
          "usar": ["Aliado", "Respaldo", "Portafolio", "Clientes de tu agencia"],
          "evitar": ["proveedor", "catálogo de ofertas", "tus clientes", "Reserva tus vacaciones", "Compra tu viaje", "Vive esta experiencia"]
        }
      },
      "legal": {
        "operador": null,
        "rnt": null,
        "ciudad": null,
        "admite_simbolo_marca": false
      },
      "manual": "manual-linex-go/",
      "contexto": "contexto-linex-go.md",
      "pendientes": [
        "BLOQUEANTE: 14 de 15 piezas de logotipo, y la que existe no es vectorial",
        "Faltan los logos de Disney y Assistviaje",
        "Las seis fichas de audiencia están sin perfilar",
        "Sin lista de claims autorizados",
        "Sin lista de términos prohibidos validada",
        "Sin texto legal obligatorio por tipo de pieza",
        "Sin nombre corporativo legal aprobado",
        "Sin plazo definido para la transición UltraGo → Linex Go",
        "Sin banco de imágenes propio",
        "Conflicto sin resolver: la tarjeta pide fondo petróleo con logo negativo, las piezas producidas usan cara clara"
      ]
    }
  }
}
```

- [ ] **Step 4: Escribir `tools/verificar-tokens.js`**

```js
#!/usr/bin/env node
/* Valida que brand-tokens.json no mienta.
 *
 * POR QUÉ EXISTE
 * Un JSON de marca es peligroso justo cuando parece correcto: nadie
 * recalcula un "5.49:1" escrito con confianza. Aquí cada ratio que el
 * archivo afirma se vuelve a calcular, y cada ruta se comprueba contra
 * el disco. Un dato que no se sostiene es un error, no un aviso.
 *
 * USO
 *   node tools/verificar-tokens.js
 */

const fs = require('fs');
const path = require('path');
const { contraste } = require('./contraste.js');

const RAIZ = path.resolve(__dirname, '..');
const TOLERANCIA = 0.02;

function verificar(tokens) {
  const errores = [];
  const avisos = [];

  for (const [id, m] of Object.entries(tokens.marcas)) {
    if (m.id !== id) errores.push(`${id}: el campo id dice "${m.id}"`);

    // 1 · Cada contraste afirmado se recalcula.
    for (const c of m.color || []) {
      if (!c.regla) continue;
      const medidos = c.regla.contrastes || {};

      if (Object.keys(medidos).length === 0) {
        errores.push(`${id} · ${c.nombre} (${c.hex}): tiene regla pero está sin medición`);
      }
      if (c.regla.solo_sobre && !(c.regla.solo_sobre in medidos)) {
        errores.push(`${id} · ${c.nombre}: dice "solo sobre ${c.regla.solo_sobre}" y no mide ese fondo`);
      }
      for (const [fondo, afirmado] of Object.entries(medidos)) {
        const real = contraste(c.hex, fondo);
        if (Math.abs(real - afirmado) > TOLERANCIA) {
          errores.push(
            `${id} · ${c.nombre} (${c.hex}) sobre ${fondo}: ` +
            `el contraste afirmado es ${afirmado} y el real es ${real.toFixed(2)}`
          );
        }
      }
    }

    // 2 · Ninguna ruta apunta al vacío.
    const rutas = Object.entries(m.logos || {})
      .concat(Object.entries(m.aliados || {}))
      .filter(([, v]) => typeof v === 'string' && v.includes('/'));
    for (const [clave, ruta] of rutas) {
      if (!fs.existsSync(path.join(RAIZ, ruta))) {
        errores.push(`${id} · ${clave}: la ruta "${ruta}" no existe en disco`);
      }
    }
    if (m.manual && !fs.existsSync(path.join(RAIZ, m.manual))) {
      errores.push(`${id}: el manual "${m.manual}" no existe`);
    }

    // 3 · El símbolo de marca depende del registro.
    if (m.estado === 'confirmed_pending_trademark' && m.legal?.admite_simbolo_marca) {
      errores.push(`${id}: no puede admitir ™/® con el registro pendiente`);
    }

    // 4 · Las proporciones cierran, cuando existen.
    const props = (m.color || []).filter(c => c.proporcion != null);
    if (props.length) {
      const suma = props.reduce((t, c) => t + c.proporcion, 0);
      if (suma !== 100) errores.push(`${id}: las proporciones suman ${suma}, no 100`);
    }

    // 5 · Lo pendiente se nombra, no se disimula.
    const sinLogo = Object.values(m.logos || {}).every(v => v === null);
    if (sinLogo && !(m.pendientes || []).some(p => /logo/i.test(p))) {
      avisos.push(`${id}: no tiene ningún logo y no lo declara en pendientes`);
    }
  }

  return { errores, avisos };
}

if (require.main === module) {
  const tokens = JSON.parse(
    fs.readFileSync(path.join(RAIZ, 'brand-tokens.json'), 'utf8'));
  const { errores, avisos } = verificar(tokens);

  avisos.forEach(a => console.log('  aviso · ' + a));
  errores.forEach(e => console.error('  ERROR · ' + e));

  const n = Object.keys(tokens.marcas).length;
  console.log(`\n${n} marcas · ${errores.length} errores · ${avisos.length} avisos`);
  process.exit(errores.length ? 1 : 0);
}

module.exports = { verificar };
```

- [ ] **Step 5: Correr los tests y verificar que pasan**

Run: `node --test tools/` y luego `node tools/verificar-tokens.js`
Expected: todos los tests PASS, y el verificador imprime `2 marcas · 0 errores`.

Si un contraste falla, el número del JSON está mal copiado del manual: corrígelo en el JSON con el valor real y **anota la discrepancia** — significa que el manual también la tiene.

- [ ] **Step 6: Commit**

```bash
git add brand-tokens.json tools/verificar-tokens.js tools/verificar-tokens.test.js
git commit -m "brand-tokens.json: Trip y Go, con verificador que los valida

Reconstruye desde los dos contextos de marca el JSON que se perdió con
brand-system/. Las dos marcas completas: siete colores cada una con
HEX/RGB/CMYK, proporción de uso, rol y reglas duras; voz, vocabulario,
estado legal y logos reales.

Las diez rutas brand-system/ quedaron remapeadas a Logos/, que es donde
los archivos viven de verdad.

El verificador no confía en el JSON: recalcula con contraste.js cada
ratio que el archivo afirma y comprueba contra el disco cada ruta. Un
color con regla dura pero sin medición es un error, no un aviso — es
justo la forma en que una regla se convierte en superstición.

Co-Authored-By: Claude Opus 5 (1M context) <noreply@anthropic.com>"
```

---

### Task 3: `brand-tokens.json` — las seis marcas pendientes

**Files:**
- Modify: `brand-tokens.json` (agregar seis entradas dentro de `marcas`)
- Modify: `tools/verificar-tokens.test.js` (agregar los tests de abajo)

**Interfaces:**
- Consumes: la forma `Marca` de la Tarea 2
- Produces: `tokens.marcas` con las ocho marcas del modelo

- [ ] **Step 1: Escribir el test que falla**

Agregar al final de `tools/verificar-tokens.test.js`:

```js
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

test('solo Loyalty y Rewards tienen genio nombrado', () => {
  const conGenio = Object.values(tokens.marcas)
    .filter(m => m.genio).map(m => m.id).sort();
  assert.deepStrictEqual(conGenio, ['linex-loyalty', 'linex-rewards']);
  assert.strictEqual(tokens.marcas['linex-loyalty'].genio, 'Ixar');
  assert.strictEqual(tokens.marcas['linex-rewards'].genio, 'Milton');
});

test('Loyalty tiene el Verde con su regla dura', () => {
  const verde = tokens.marcas['linex-loyalty'].color.find(c => c.hex === '#C5F04A');
  assert.ok(verde, 'falta el Verde de Loyalty');
  assert.ok(verde.regla.contrastes['#FFFFFF'], 'falta medir sobre blanco');
  assert.ok(verde.regla.nunca.length > 0, 'un color que muere sobre blanco necesita prohibiciones');
});

test('ninguna marca pendiente inventa color, logo ni voz', () => {
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

test('las seis pendientes declaran estado pendiente', () => {
  for (const id of ['linex-capital', 'linex-loyalty', 'linex-travel',
                    'linex-marketplace', 'linex-rewards', 'linex-school']) {
    assert.strictEqual(tokens.marcas[id].estado, 'pendiente');
  }
});
```

- [ ] **Step 2: Correr el test y verificar que falla**

Run: `node --test tools/verificar-tokens.test.js`
Expected: FAIL — solo hay dos marcas.

- [ ] **Step 3: Agregar las seis entradas**

Van dentro de `marcas`, después de `linex-go`. Loyalty es la única con un color real.

```json
    "linex-capital": {
      "id": "linex-capital", "nombre": "Linex Capital", "forma_compacta": "linexcapital",
      "tier": 1, "rol": "El fondo — comunicación corporativa, global y estático",
      "dominio": "linexcapital.com", "padre": null, "genio": null, "estado": "pendiente",
      "atrae": "Grandes inversionistas y compañías que quieren entrar a la constelación.",
      "filtra": "Clientes operativos, usuarios finales y prospectos pequeños — aquí no hay producto ni precio.",
      "color": [], "derivados": [],
      "tipografia": "grupo", "iconografia": "grupo",
      "radios": { "s": 6, "btn": 12, "m": 16, "l": 24, "pill": 999 },
      "logos": { "principal": null, "negativo": null, "monocromo": null },
      "logo_nota": "Sin archivo. No tiene carpeta en Logos/logos-oficiales/.",
      "voz": null,
      "legal": { "operador": null, "rnt": null, "ciudad": null, "admite_simbolo_marca": false },
      "manual": null, "contexto": null,
      "pendientes": ["Sin logo", "Sin paleta", "Sin voz documentada", "Sin manual",
                     "Sin carpeta en Logos/logos-oficiales/",
                     "No aparece en ninguno de los dos contextos de marca"]
    },
    "linex-loyalty": {
      "id": "linex-loyalty", "nombre": "Linex Loyalty", "forma_compacta": "linexloyalty",
      "tier": 2, "rol": "El puerto espacial — punto de entrada a la constelación, no una caja de pago",
      "dominio": "linex-loyalty.com", "padre": null, "genio": "Ixar", "estado": "pendiente",
      "genio_nota": "Se pronuncia ee-SAR. El genio maestro: habla por toda la constelación, explica las estrellas y convoca a los otros genios para armar una solución a la medida.",
      "antes": "UltraGroup",
      "atrae": "Bancos y grandes corporaciones que evalúan lealtad a escala. La audiencia big scale.",
      "filtra": "Cazadores de ofertas, compradores de una sola función y visitantes casuales — se enrutan a una estrella.",
      "color": [
        { "nombre": "Verde", "hex": "#C5F04A", "rgb": [197,240,74], "cmyk": null,
          "rol": "Acento", "proporcion": null,
          "nombre_pendiente": true,
          "regla": { "solo_sobre": null,
            "nunca": ["texto sobre fondo claro", "cualquier uso sobre blanco"],
            "contrastes": { "#FFFFFF": 1.32, "#080808": 15.20, "#00145A": 12.91 },
            "nota": "Necesita fondo oscuro. Loyalty todavía no tiene base oscura definida: fijarla es el siguiente dato que le falta a la marca." } }
      ],
      "derivados": [],
      "tipografia": "grupo", "iconografia": "grupo",
      "radios": { "s": 6, "btn": 12, "m": 16, "l": 24, "pill": 999 },
      "logos": { "principal": null, "negativo": null, "monocromo": null },
      "logo_nota": "Carpeta Logos/logos-oficiales/linex-loyalty/ vacía.",
      "voz": null,
      "legal": { "operador": null, "rnt": null, "ciudad": null, "admite_simbolo_marca": false },
      "manual": null, "contexto": null,
      "firma": "Solo en documentos formales, contratos y comunicación corporativa, como respaldo. Nunca dos marcas firmando con el mismo peso en una pieza comercial.",
      "pendientes": [
        "Sin base oscura definida — y el Verde la necesita para existir",
        "Sin nombre de color para el Verde",
        "Sin paleta completa",
        "Sin logo",
        "Sin voz documentada",
        "Sin manual",
        "El Verde queda a ΔE 26 (CIE76) del Amarillo de Trip, y a la misma luminosidad (L* 89.2 vs 88.1): se distinguen por tono, no por valor"
      ]
    },
    "linex-travel": {
      "id": "linex-travel", "nombre": "Linex Travel", "forma_compacta": "linextravel",
      "tier": 3, "rol": "Estrella — opera B2B2C, B2B y B2C", "dominio": "linextravel.com",
      "padre": null, "genio": null, "genio_nota": "Nombre en proceso.", "estado": "pendiente",
      "atrae": "Compañías que necesitan el viaje como redención; agencias que buscan un front-to-back; revendedores de servicios de viaje con IA.",
      "filtra": "Inversionistas y necesidades ajenas al viaje — el Group Bar los enruta.",
      "color": [], "derivados": [],
      "tipografia": "grupo", "iconografia": "grupo",
      "radios": { "s": 6, "btn": 12, "m": 16, "l": 24, "pill": 999 },
      "logos": { "principal": null, "negativo": null, "monocromo": null },
      "logo_nota": "Carpeta Logos/logos-oficiales/linex-travel/ vacía.",
      "voz": null,
      "legal": { "operador": null, "rnt": null, "ciudad": null, "admite_simbolo_marca": false },
      "manual": null, "contexto": null,
      "sub_marcas": ["linex-go", "linex-trip"],
      "prioridad": "1 · operando",
      "pendientes": ["Sin logo", "Sin paleta", "Sin voz documentada", "Sin manual propio",
                     "Sus dos sub-marcas están mejor documentadas que ella"]
    },
    "linex-marketplace": {
      "id": "linex-marketplace", "nombre": "Linex Marketplace", "forma_compacta": "linexmarketplace",
      "tier": 3, "rol": "Estrella — el supermercado de redención", "dominio": "linexmarketplace.com",
      "padre": null, "genio": null, "genio_nota": "Nombre en proceso. Es el constructor de supermercado.",
      "estado": "pendiente",
      "atrae": "Programas que necesitan redención de bienes despachables curada.",
      "filtra": "Audiencias solo de viaje.",
      "color": [], "derivados": [],
      "tipografia": "grupo", "iconografia": "grupo",
      "radios": { "s": 6, "btn": 12, "m": 16, "l": 24, "pill": 999 },
      "logos": { "principal": null, "negativo": null, "monocromo": null },
      "logo_nota": "Carpeta Logos/logos-oficiales/linex-marketplace/ vacía.",
      "voz": null,
      "legal": { "operador": null, "rnt": null, "ciudad": null, "admite_simbolo_marca": false },
      "manual": null, "contexto": null,
      "prioridad": "2 · siguiente M&A",
      "nota": "Es un paraguas, no un nicho: cualquier categoría puede desprenderse en su propia estrella cuando el negocio lo justifique.",
      "pendientes": ["Sin logo", "Sin paleta", "Sin voz documentada", "Sin manual", "Genio sin nombrar"]
    },
    "linex-rewards": {
      "id": "linex-rewards", "nombre": "Linex Rewards", "forma_compacta": "linexrewards",
      "tier": 3, "rol": "Estrella — el motor EARN", "dominio": "linexrewards.com",
      "padre": null, "genio": "Milton", "estado": "pendiente",
      "genio_nota": "Construye motores de puntos a la medida: reglas de acumulación, wallet y checkout.",
      "atrae": "Bancos y programas que necesitan crear y administrar puntos.",
      "filtra": "Compradores solo de redención — se enrutan a Travel o Marketplace.",
      "color": [], "derivados": [],
      "tipografia": "grupo", "iconografia": "grupo",
      "radios": { "s": 6, "btn": 12, "m": 16, "l": 24, "pill": 999 },
      "logos": { "principal": null, "negativo": null, "monocromo": null },
      "logo_nota": "Carpeta Logos/logos-oficiales/linex-rewards/ vacía.",
      "voz": null,
      "legal": { "operador": null, "rnt": null, "ciudad": null, "admite_simbolo_marca": false },
      "manual": null, "contexto": null,
      "prioridad": "3ª línea fundacional",
      "pendientes": ["Sin logo", "Sin paleta", "Sin voz documentada", "Sin manual"]
    },
    "linex-school": {
      "id": "linex-school", "nombre": "Linex School", "forma_compacta": "linexschool",
      "tier": 3, "rol": "Estrella en expansión", "dominio": "linexschool.com",
      "padre": null, "genio": null, "estado": "pendiente",
      "atrae": "Sin definir.", "filtra": "Sin definir.",
      "color": [], "derivados": [],
      "tipografia": "grupo", "iconografia": "grupo",
      "radios": { "s": 6, "btn": 12, "m": 16, "l": 24, "pill": 999 },
      "logos": { "principal": null, "negativo": null, "monocromo": null },
      "logo_nota": "Sin archivo. No tiene carpeta en Logos/logos-oficiales/.",
      "voz": null,
      "legal": { "operador": null, "rnt": null, "ciudad": null, "admite_simbolo_marca": false },
      "manual": null, "contexto": null,
      "nota": "El número y la identidad de las estrellas es deliberadamente abierto: una categoría puede nacer cuando el negocio lo justifique.",
      "pendientes": ["Sin logo", "Sin paleta", "Sin voz documentada", "Sin manual",
                     "Sin carpeta en Logos/logos-oficiales/",
                     "No aparece en ninguno de los dos contextos de marca"]
    }
```

- [ ] **Step 4: Correr los tests y verificar que pasan**

Run: `node --test tools/` y `node tools/verificar-tokens.js`
Expected: todos PASS, y el verificador imprime `8 marcas · 0 errores`.

- [ ] **Step 5: Commit**

```bash
git add brand-tokens.json tools/verificar-tokens.test.js
git commit -m "brand-tokens.json: las seis marcas pendientes

Completa las ocho del Modelo de Constelación. Capital y School entran
aunque no tengan carpeta en Logos/ ni aparezcan en los contextos de
marca: el modelo las define y sin ellas el sistema no puede responder
qué falta.

Loyalty es la única pendiente con algo real: el Verde #C5F04A, que
entra con su regla dura (1.32:1 sobre blanco — desaparece) y con el
dato que más le falta a la marca: no hay base oscura definida, y un
acento que solo vive sobre oscuro necesita saber sobre cuál.

Un test comprueba que las cinco marcas sin datos no inventen color,
logo ni voz, y que cada una declare qué le falta.

Co-Authored-By: Claude Opus 5 (1M context) <noreply@anthropic.com>"
```

---

### Task 4: Skill `/linex-brand` — el router y las dos capas

**Files:**
- Create: `.claude/skills/linex-brand/SKILL.md`
- Create: `.claude/skills/linex-brand/references/oficio-marca.md`
- Create: `.claude/skills/linex-brand/references/constelacion.md`

**Interfaces:**
- Consumes: `brand-tokens.json`, `tools/contraste.js`
- Produces: el skill invocable como `/linex-brand`, con tres references más en la Tarea 5

Un skill es Markdown: no tiene test unitario. Se verifica por comportamiento en la Tarea 6.

- [ ] **Step 1: Escribir `SKILL.md`**

El frontmatter `description` es lo que hace que el skill se cargue solo. Tiene que nombrar los disparadores reales.

```markdown
---
name: linex-brand
description: Use when working on Linex brand material — building or updating a brand manual, auditing a piece (color, contrast, logo usage, naming, vocabulary), or writing copy in a Linex brand voice. Covers the eight brands of the Linex constellation (Capital, Loyalty, Travel, Go, Trip, Marketplace, Rewards, School). Triggers on Linex brand colors, HEX values, logos, manuals, claims, CTA, tone of voice, WCAG contrast for Linex pieces.
---

# Sistema de marca de la constelación Linex

## La regla que manda sobre todas

**Nunca inventes un activo de marca.** No dibujes un logo que no esté en
`Logos/logos-oficiales/`, no fijes un HEX que nadie aprobó, no redactes una
voz que no esté documentada. Cuando falte algo, **nómbralo como falta**.

Decir "esta marca no tiene paleta todavía" es información útil. Producir una
paleta plausible es el fallo que este sistema existe para evitar.

## La fuente de verdad

`brand-tokens.json`, en la raíz del proyecto. Ocho marcas. **Léelo antes de
afirmar cualquier dato de marca** — nunca respondas de memoria.

- `null` significa pendiente, no "rellénalo tú".
- Todo color con restricción la trae en `regla`, con sus contrastes medidos.
- `estado: "confirmed_pending_trademark"` significa **sin ™ ni ®**.

Si un dato del JSON difiere de un manual, **manda el manual**.

## Los tres trabajos

Carga **solo** el reference del trabajo que toca:

| Si te piden | Carga |
|---|---|
| Construir o actualizar un manual de marca | `references/construir-manual.md` |
| Revisar una pieza, un HEX, un contraste, un logo, un texto | `references/auditar-pieza.md` |
| Escribir copy, claims, CTA o contenido de redes | `references/escribir-voz.md` |

Y según cuánto contexto necesites:

- `references/oficio-marca.md` — el oficio de diseño de marca, sin Linex.
  Útil cuando la pregunta es de principios, no de esta constelación.
- `references/constelacion.md` — el modelo de tres tiers, el Star Launch Kit,
  los genios y la gobernanza. Cárgalo cuando la pregunta cruce marcas.

## Lo que aplica siempre, sin cargar nada más

**Tipografía del grupo.** Dos registros: Segoe UI (títulos) + Calibri (cuerpo)
en lo operativo —cotizaciones, correo, Contact Center, Office— y Geist en web
y producto. Respaldo Arial o Helvetica. *Segoe UI manda en lo que se ve,
Calibri sostiene lo que se lee, Geist viste el sitio y el producto.*

**Iconografía del grupo.** Font Awesome Pro · Classic · Regular. Solid solo
dentro de un contenedor relleno, por debajo de 4 mm en impreso, y en la
familia Brands para redes.

**Radios del grupo.** `6` chips · `12` botones · `16` tarjetas · `24`
contenedores · `999` pills. **Radio total = dato, no acción**: un pill nunca
se confunde con un botón.

**Sin mayúscula sostenida**, en ningún canal. El énfasis va con peso o tamaño.

**El contraste se calcula, no se estima.** `node -e "console.log(require('./tools/contraste.js').contraste('#FF725E','#FFFFFF'))"`

## Cómo se nombra cada marca

Siempre con espacio: **Linex Trip**, **Linex Go**. La forma compacta
(`linextrip`) existe solo donde el espacio no cabe: dominio, correo, handles,
hashtags, rutas y UI. Nunca `LinexGo`, `Linexgo`, `LINEXGO` ni `Linex-Go`.
```

- [ ] **Step 2: Escribir `references/oficio-marca.md`**

Capa genérica. **No menciona Linex** — así se reutiliza con otro cliente.

```markdown
# Oficio de diseño de marca y comunicación

Capa genérica: aplica a cualquier marca. Lo específico de Linex está en
`constelacion.md`.

## Contraste

Se calcula con la fórmula de WCAG 2.1, nunca a ojo. Umbrales:

| | AA (mínimo) | AAA (preferido) |
|---|---|---|
| Texto corrido | 4.5:1 | 7:1 |
| Texto grande (≥24 px regular o ≥18.66 px bold) | 3:1 | 4.5:1 |
| Objeto gráfico o control (WCAG 1.4.11) | 3:1 | — |

Un ícono es objeto gráfico y le basta 3:1. Una cifra es texto y necesita
4.5:1. **Cuando van juntos en la misma tarjeta, manda el 4.5:1.**

El contorno de un control también cuenta: si el relleno no alcanza 3:1 contra
el fondo de la página, el control necesita un filete que sí lo alcance.

## Sistemas de color

Un color de acción funciona **por exclusividad**. Si el mismo color pinta un
botón en una pieza y un porcentaje en la siguiente, deja de responder la única
pregunta que tiene que responder de un vistazo: *¿dónde toco?*

- **La proporción es parte de la regla**, no una descripción. Un color de
  acción que ocupa más del ~12% deja de ser señal y se vuelve decoración.
- **Un color que aparece poco se nota cuando aparece.** Los colores de detalle
  viven en porcentajes de un dígito a propósito.
- **Un color claro y saturado sobre blanco casi siempre falla.** Amarillos,
  limas y cianes suelen quedar entre 1.2:1 y 2.5:1: no es que se lean mal, es
  que no se leen. Esos colores viven sobre fondo oscuro o no viven.
- **Dos acentos con la misma luminosidad (L\*) se distinguen solo por tono.**
  Es la diferencia que peor sobrevive en un ícono pequeño, en impresión y para
  quien no distingue ciertos colores. Compara L\*, no solo ΔE.

## Jerarquía tipográfica

Una pieza con cuatro pesos distintos no se ve rica, se ve sin criterio.
**Máximo dos pesos por pieza.**

- **La mayúscula sostenida borra el perfil de la palabra** y obliga a leer
  letra por letra. Se enfatiza con peso o tamaño.
- Subrayado solo en enlaces, nunca como énfasis.
- Las cifras y precios en negrita, con separador de miles y la moneda visible.
- Un solo H1 por vista.

## Arquitectura de marca

- **Masterbrand** — una marca cubre todo.
- **Endorsed** — cada marca tiene identidad y una firma común la respalda.
- **House of brands** — marcas independientes sin relación visible.

En un modelo endorsed, la pregunta que hay que resolver por escrito es **qué
es central y qué decide cada marca**. Sin esa línea, en doce meses las marcas
derivan hasta parecer compañías sin relación. Y si dos marcas firman con el
mismo peso en una pieza comercial: *si las dos mandan, no manda ninguna.*

## Convivencia con marcas de terceros

1. **Jerarquía** — la marca anfitriona siempre mayor y en posición dominante.
2. **Separación** — los terceros sobre fondo neutro, separados por espacio.
3. **No se modifican** — ni color, ni proporciones, ni encuadre.
4. **Zonas** — el anfitrión en la zona de mensaje, los terceros en su franja.
5. Si una marca exige su versión oficial, se respeta — pero sigue en su zona
   y en menor tamaño.

## Voz y tono

**La voz es constante; el tono es variable.** La voz no cambia por canal ni
por campaña. El tono cambia según el momento de quien lee.

Cada atributo de voz necesita su exceso escrito al lado, o no sirve: *claro*
sin "no es seco" produce texto de extracto bancario; *cercano* sin "no es
confianzudo" produce apodos y emojis en cadena.

**La prueba rápida:** si el texto podría firmarlo cualquier competidor,
todavía no suena a la marca.

## Claims

La diferencia entre un mensaje y un claim es **la evidencia**. Un mensaje
explica qué se hace; un claim afirma algo comparable, y por eso necesita
respaldo reclamable.

Cada pilar de valor necesita tres campos: la promesa, la prueba que la
sostiene, y **qué NO autoriza a decir**. El tercero es el que evita casi todos
los problemas.

**La prueba de fuego:** si alguien de servicio al cliente no puede sostener la
promesa con lo que hoy existe, la pieza no sale.

## Accesibilidad más allá del contraste

- **El estado se escribe.** "Agotado" se escribe; un punto rojo no es
  información para todo el mundo, ni para quien imprime la pantalla.
- **Área táctil mínima 44 × 44 px** reales. El ícono puede ser chico; el área
  de toque no.
- **Texto alternativo** en toda imagen funcional.
- **El ícono nunca es el único portador del dato.**

## Cuando falta un activo

Se dice que falta. Se nombra el archivo que hace falta y quién lo produce. No
se aproxima, no se redibuja "provisionalmente" y no se deja el hueco en
blanco: un pendiente rotulado se resuelve, uno disimulado se hereda.
```

- [ ] **Step 3: Escribir `references/constelacion.md`**

```markdown
# El Modelo de Constelación de Linex

Capa específica. El oficio genérico está en `oficio-marca.md`.
Fuente: `Linex-Constellation-Model-EN.pdf` (v3, julio 2026).

## La idea

No es "una plataforma" ni "sitios separados": son **instrumentos de
comunicación corporativa que apoyan la venta**. Cada sitio atrae a su cliente
ideal y filtra al que no encaja.

Tres principios la anclan:

1. **No se vende un paquete — se ensamblan capacidades.** Se muestra el
   ecosistema y se vende primero la capacidad concreta que el prospecto
   necesita; las demás se agregan cuando las pida.
2. **Cada sitio tiene un solo objetivo.** Segmentación por intención, no un
   embudo único.
3. **Solo se agregan estrellas, y cada una brilla por su cuenta.** El número y
   la identidad de las estrellas es deliberadamente abierto.

## Los tres tiers

| Tier | Marca | Papel |
|---|---|---|
| 1 · El fondo | **Linex Capital** | Atrae inversionistas y compañías que quieren entrar |
| 2 · El puerto espacial | **Linex Loyalty** | Punto de entrada — **no una caja de pago**. Casa de Ixar |
| 3 · Las estrellas | **Travel**, **Marketplace**, **Rewards**, **School** | Motores comerciales, cada uno con su público |

**Linex Travel** tiene dos sub-marcas de canal, que viven *dentro* de la
estrella y nunca son estrella propia: **Linex Go** (B2B) y **Linex Trip**
(B2C).

## Los genios

Un genio dialoga con el cliente y **compone la solución** — no es una
herramienta de ejecución ni un motor de reservas.

| Genio | Marca | Qué construye |
|---|---|---|
| **Ixar** (ee-SAR) | Linex Loyalty | El genio maestro: habla por toda la constelación y convoca a los demás |
| **Milton** | Linex Rewards | Motores de puntos: acumulación, wallet y checkout |
| *sin nombrar* | Linex Travel | Soluciones de viaje a la medida |
| *sin nombrar* | Linex Marketplace | El "constructor de supermercado" |

Cada genio vive **dentro del sitio de su estrella**. Si hace falta una ruta
técnica, va como subdominio de esa estrella, nunca como dominio propio.

## El Star Launch Kit

Lo que toda estrella nueva hereda.

**LOCKED · central** — no se negocia por campaña, se escala al administrador:

- Sistema de marca y convención de naming, incluidas las sub-marcas
- La pareja de registros tipográficos y la grilla
- El **Group Bar**: franja superior obligatoria con el copy `Part of Linex
  Loyalty`, **encima** de la navegación propia. No se rediseña ni se quita
- El patrón de lead / CRM compartido

**FREE · por estrella** — lo que el sistema **no** debe imponer:

- El color de acento y el matiz de tono
- Contenido, campañas y SEO
- Profundidad del sitio y presupuesto

> **La regla que protege la constelación:** presupuesto y profundidad son
> libres, pero el sistema de marca y el patrón de leads están bloqueados. Sin
> eso, en doce meses las estrellas derivan hasta parecer compañías sin
> relación.

## Las fronteras entre marcas

- Llega una agencia a Trip → se enruta a **Linex Go**. No se le arma tarifa B2B.
- Llega un viajero a Go → se enruta a **Linex Trip**.
- **No se comparan entre sí** en copy ni campañas: compiten con el mercado, no
  entre ellas.
- **No se mezclan los sistemas:** Trip no usa el color ni el tono de Go, ni al
  revés. Comparten tipografía, íconos y grilla porque eso es del grupo.
- **Nunca compiten por la misma palabra clave.** Dos marcas hermanas peleando
  por el mismo término se quitan posiciones y le pagan dos veces al mismo clic.

## Gobernanza

| El centro decide | Cada estrella decide |
|---|---|
| Sistema de marca y naming | Presupuesto y nivel de calidad |
| Group Bar y navegación cruzada | Contenido vertical, campañas y SEO |
| Patrón de lead / CRM | Profundidad de producto |
| Los sitios Tier 1 y 2 | Go-to-market de su capacidad |

## Qué está abierto hoy

- **Linex Loyalty no tiene base oscura**, y su acento Verde `#C5F04A` la
  necesita para existir: sobre blanco da 1.32:1.
- **El logotipo de Linex Go bloquea la papelería**: existe 1 de 15 piezas y no
  es vectorial.
- **Capital y School** no aparecen en ningún contexto de marca.
- **Travel** está peor documentada que sus dos sub-marcas.
```

- [ ] **Step 4: Verificar que el skill carga**

Run: `ls -R .claude/skills/linex-brand/`
Expected: `SKILL.md` y `references/` con `oficio-marca.md` y `constelacion.md`.

Comprobar a ojo que el frontmatter de `SKILL.md` tiene `name` y `description`, y que `description` empieza con "Use when".

- [ ] **Step 5: Commit**

```bash
git add .claude/skills/linex-brand/
git commit -m "Skill /linex-brand: el router y las dos capas

SKILL.md se mantiene corto a propósito: la regla que manda (nunca
inventes un activo), dónde está la verdad, y a qué reference ir según
el trabajo. Lo que aplica siempre —tipografía, íconos, radios, naming—
vive ahí para no tener que cargar nada más en una consulta corta.

Las dos capas quedan separadas para que la de abajo sirva fuera de
Linex: oficio-marca.md no menciona la marca por ninguna parte, y
constelacion.md es el modelo de tres tiers, el Star Launch Kit y la
gobernanza.

Co-Authored-By: Claude Opus 5 (1M context) <noreply@anthropic.com>"
```

---

### Task 5: Skill `/linex-brand` — los tres trabajos

**Files:**
- Create: `.claude/skills/linex-brand/references/construir-manual.md`
- Create: `.claude/skills/linex-brand/references/auditar-pieza.md`
- Create: `.claude/skills/linex-brand/references/escribir-voz.md`

**Interfaces:**
- Consumes: `SKILL.md` (Tarea 4), `brand-tokens.json`, `tools/contraste.js`
- Produces: los tres references que `SKILL.md` enruta

- [ ] **Step 1: Escribir `references/construir-manual.md`**

```markdown
# Trabajo 1 · Construir un manual de marca

## Antes de escribir una línea

Lee la entrada de la marca en `brand-tokens.json`. **Si `color` está vacío,
`voz` es `null` y todos los logos son `null`, el manual va a salir con quince
secciones diciendo "pendiente".** Dilo antes de construirlo: puede que lo que
haga falta sea una sesión de marca, no un sitio.

## El esqueleto, que no se inventa

Quince secciones en tres bloques, más la portada. Es **decisión escrita del
administrador de marca del 2026-09-15**: las mismas secciones, en el mismo
orden, en todos los manuales del grupo, para que quien conoce uno sepa moverse
en el otro.

| # | Archivo | Bloque |
|---|---|---|
| 00 | `index.html` — Resumen ejecutivo | Portada |
| 01 | `01-logotipo.html` | A · Identidad visual |
| 02 | *ranura libre* — ver abajo | A |
| 03 | `03-paleta-color.html` | A |
| 04 | `04-tipografia.html` | A |
| 05 | `05-iconografia-canal.html` | A |
| 06 | `06-sistema-fotografia.html` | A |
| 07 | `07-accesibilidad.html` | A |
| 08 | `08-arquitectura.html` | B · Quién es y cómo habla |
| 09 | `09-audiencias.html` | B |
| 10 | `10-propuesta-valor.html` | B |
| 11 | `11-voz-tono.html` | B |
| 12 | `12-vocabulario.html` | B |
| 13 | `13-promociones-cta.html` | C · Cómo se aplica |
| 14 | `14-entregables.html` | C |
| 15 | `15-redes-sociales.html` | C |

**La ranura 02** es la única que varía, y depende del estado del logo:
`02-propuestas-logo.html` si el símbolo está sin decidir (como Trip), o
`02-estado-logotipo.html` si está decidido y faltan piezas (como Go).

**El orden es de referencia, no de inducción:** lo visual primero, porque es
lo que la gente viene a buscar. La inducción la cubre entera la portada.

## El contrato técnico

Copia `manual-linex-go/` como base — es el que usa el sincronizador de Node.

1. **Sin build, sin dependencias, sin runtime.** Doble clic en `index.html` y
   funciona en `file://`. Si no abre así, está mal hecho.
2. **Autocontenido.** Copia propia de `assets/style.css`, `assets/nav.js` y
   los assets. **Cero referencias a `../`.** Es lo que permite mandar la
   carpeta suelta a un proveedor.
3. **Los tokens viven en `:root`**, no en las páginas. Única excepción: las
   muestras de paleta y los HEX escritos, donde el color *es* el dato.
4. **Los 82 componentes CSS ya existen.** Trip y Go comparten toda la hoja
   salvo una clase. Un manual nuevo **no diseña componentes**: hereda los 82 y
   cambia su `:root`.
5. **La navegación no se edita a mano.** Se declara en `tools/sync-nav.js` y
   el script rellena tres marcadores en cada página:
   `<!--nav-->`, `<!--indice-->`, `<!--pager-->`. Es idempotente.
6. **Numeración corrida 00–15**, igual al nombre del archivo. Si hay que
   intercalar, se renumera de verdad; nada de sufijos `06b`.

## Lo pendiente se rotula, no se salta

El sincronizador ya lo hace por ti:

- Sección que aún no existe → **en gris y sin enlace** en el menú, no 404.
- En el índice de la portada → marcada **"en curso"** en el color de acento.
- El paginador **la salta**: nunca lleva a una página que no está.

Aplica el mismo criterio dentro de cada página: si el JSON dice `null`, la
página lo dice. *"Versión monocromática aún no recibida"*, no un hueco.

## Cómo agregar una sección

1. Crea el `.html` copiando cualquier página existente (conserva los tres
   marcadores).
2. Agrega una línea a `BLOQUES` en `tools/sync-nav.js`, en el orden de lectura.
3. Corre `node tools/sync-nav.js` (o `--dry-run` para ver antes qué cambiaría).

`tools/plantilla.js` documenta el esqueleto de página —doctype, `<head>`,
skip-link, topbar, shell, sidebar, `main-inner`, `footer-meta`— pero **no lo
requiere nadie**: es referencia, no herramienta.

## Antes de dar por terminado

- [ ] Abre con doble clic, sin servidor
- [ ] Ninguna referencia a `../`
- [ ] `node tools/sync-nav.js` y después `git diff` vacío
- [ ] Todo `null` del JSON aparece rotulado como pendiente en su sección
- [ ] Los contrastes escritos se recalcularon con `tools/contraste.js`
- [ ] El nombre de la marca va con espacio en toda prosa
```

- [ ] **Step 2: Escribir `references/auditar-pieza.md`**

```markdown
# Trabajo 2 · Auditar una pieza

## Los tres veredictos

No dos. El tercero es el que hace útil a este sistema.

| | Significa |
|---|---|
| **✓ cumple** | Hay una regla y la pieza la respeta |
| **✗ viola** | Hay una regla y la pieza la rompe |
| **? sin regla documentada** | **No existe regla todavía** |

Decir "no hay regla para esto" es información. Fingir que sí la hay es el
fallo que este sistema existe para evitar. Nunca conviertas tu criterio en
una regla de marca.

## Cada hallazgo cita su fuente

Nunca *"esto se ve mal"*. Siempre *"viola X, documentado en
`manual-linex-go/01-logotipo.html`"*. Si no puedes citar dónde está escrita la
regla, el veredicto es **?**, no ✗.

## Qué revisar

### Contraste — se calcula, nunca se estima

```bash
node -e "const{contraste}=require('./tools/contraste.js');console.log(contraste('#FF725E','#FFFFFF').toFixed(2))"
```

Umbrales en `oficio-marca.md`. Escribe siempre el ratio obtenido.

### Reglas duras de color

Sácalas de `regla` en `brand-tokens.json`, no de memoria. Las que más se rompen:

- **Linex Go** — el coral es **solo de la acción**: nunca destaca un dato,
  nunca es texto sobre claro (2.55:1), nunca lleva texto blanco encima
  (2.69:1). La arena solo vive sobre el petróleo (10.23:1 ahí, 1.37:1 sobre
  blanco frío). El petróleo nunca rellena un botón.
- **Linex Trip** — *el Celeste actúa, el Azul Trip habla.* El Celeste nunca es
  texto sobre claro (2.35:1); el Azul nunca rellena un botón. El Amarillo vive
  **solo sobre el Azul Trip**: sobre blanco da 1.36:1. Sin excepción por
  tamaño, grosor ni por ser un ícono.
- **Linex Loyalty** — el Verde `#C5F04A` da 1.32:1 sobre blanco. Necesita
  fondo oscuro, y Loyalty aún no tiene base definida: cualquier pieza que lo
  use sobre claro es ✗.

### Proporción de uso

Dos porcentajes de Go son regla, no descripción: **coral ≤ 12%** y **arena ≤
4%**. Por encima, el coral deja de ser señal y se vuelve decoración.

### Logotipo

- ¿El archivo existe en `Logos/logos-oficiales/`? Si no, la pieza usa algo que
  no es el logo oficial → ✗.
- Zona de seguridad = la altura de la "L", por los cuatro costados.
- Tamaño mínimo: 120 px digital. Impreso: 30 mm (Trip) · 25 mm (Go).
- **Go:** nunca sobre coral, nunca el "Go" en otro color que coral o petróleo
  claro, nunca el "Linex" en negro, **nunca la "G" aislada ni "Go" solo**.
- **Aliados:** siempre en su zona y **menores que Linex Go**. Nunca
  recoloreados, reproporcionados ni fusionados.

### Tipografía

El registro correcto para el canal: Segoe UI + Calibri en Office, Geist en web
y producto. **Sin mayúscula sostenida** en ningún canal — excepto siglas
propias (IVA, COP, USD) y el wordmark si el logotipo lo exige.

### Nombre

**"Linex Trip"**, **"Linex Go"**, con espacio. La forma compacta solo en
dominio, correo, handle, hashtag y rutas. `LinexGo` en un titular es ✗.

**Sin ™ ni ®** mientras `legal.admite_simbolo_marca` sea `false`: hoy sería
falso.

### Vocabulario

De `voz.vocabulario` en el JSON. En Go, tres palabras cambian quién manda en
la relación: "proveedor", "catálogo" y "tus clientes" — se dice **aliado**,
**portafolio** y **clientes de tu agencia**.

### Audiencia

En Go, una pieza que le habla al viajero final es ✗ salvo que esté autorizada
y cofirmada con la agencia. *Competir por el cliente de quien nos compra es
competir con quien nos compra.*

## Formato de salida

Agrupa por veredicto, lo más grave primero. Para cada hallazgo: qué, dónde en
la pieza, la regla citada con su archivo, y —si aplica— el número medido.

Cierra con lo que **no** pudiste evaluar y por qué. Un informe que no dice
dónde no miró se lee como si hubiera mirado todo.
```

- [ ] **Step 3: Escribir `references/escribir-voz.md`**

```markdown
# Trabajo 3 · Escribir con voz de marca

## Primero: ¿esta marca tiene voz?

Mira `voz` en `brand-tokens.json`.

**Si es `null`, no escribas.** Di qué falta: principios de voz, claim
aprobado, vocabulario. Hoy solo **Linex Trip** y **Linex Go** tienen voz
documentada; las otras seis no.

Improvisar un tono plausible para Marketplace es exactamente el fallo que este
sistema existe para evitar — y es peor que en color, porque un tono inventado
nadie lo detecta hasta que ya circuló.

## Los claims tienen estado

- **Linex Trip** — *"Viaja Inteligente"* es el **único aprobado**. Acompaña al
  nombre, nunca lo reemplaza; una pieza puede llevar el logo sin el claim,
  nunca el claim sin la marca. **No es un CTA**, no va dentro de un botón.
  Hay tres claims secundarios **pendientes de aprobación**: no se usan como si
  ya lo estuvieran.
- **Linex Go** — el eslogan es *"Soluciones que impulsan tu agencia de
  viajes"*, y se usa **completo, sin recortar ni parafrasear**. El concepto
  rector es *"Tu aliado en cada venta"*.

## A quién le hablas

**Trip** le habla al viajero final, de tú, *como un viajero le habla a otro*.
**Go** le habla a la agencia — **nunca al viajero final**. Un CTA como "Reserva
tus vacaciones" en una pieza de Go está mal no por cómo suena, sino por a quién
le habla.

En Trip, elige **un** arquetipo antes de escribir: el planificador digital, el
decisor rápido o la familia viajera. *Una pieza que le habla a los tres no le
habla a ninguno.*

## Lo que nunca se promete

- Superlativos sin garantía real y reclamable ("el mejor precio", "garantizado")
- Urgencia falsa: cupos, cuentas regresivas o "última oportunidad" sin vigencia
- Disponibilidad que no se cumple: "24/7", "respuesta inmediata", "asesor personal"
- Precio incompleto: la cuota sin el total, el total sin la moneda

**La prueba de fuego:** si alguien de servicio al cliente no puede sostener la
promesa con lo que hoy existe, la pieza no sale.

## Registro

- **Trato de tú.** La marca en primera del plural; el asesor en primera del
  singular y con su nombre.
- **Frase corta, voz activa, una idea por frase.**
- **Sin mayúscula sostenida** y sin exclamaciones en promesas de precio o
  disponibilidad.
- **Emojis** solo en redes y con moderación. **Prohibidos** en mensajes de
  problema, en precios y en documentos.
- **Precio** con las dos monedas y separador de miles: `$112 USD · $450.000 COP`.
- **Español de Colombia**, sin modismos que no se entiendan afuera y sin calcos
  del inglés ("aplicar a la promoción", "bookear").

## Cuando algo sale mal — el orden fijo

1. **Qué pasó**, en la primera línea y sin rodeos.
2. **Qué significa para ti**: cómo afecta el viaje, el dinero o la fecha.
3. **Qué estamos haciendo**, con la opción concreta ya resuelta si existe.
4. **Qué necesitamos de ti**, si hace falta: una sola acción.
5. **Cuándo vuelvo a escribirte**, con un momento real.

Nunca *"Lamentamos los inconvenientes ocasionados"*. Se pide perdón por lo
concreto: *"perdón por el madrugón perdido, ya te moví el traslado"*.

## Los CTA salen de la biblioteca

No se inventa un verbo. Uno solo por pieza, en imperativo y con beneficio
concreto, en mayúscula inicial.

- **Trip** — Buscar vuelos · Ver destinos · Cotiza tu viaje · Reserva ahora ·
  Ver disponibilidad · Paga en cuotas · Habla con un asesor · Escríbenos por
  WhatsApp · Ver mi reserva
- **Go** — Consulta el portafolio · Cotiza para tus clientes · Solicita
  condiciones para tu agencia · Guarda esta guía · Agenda una demo de la
  plataforma · Conversa con nuestro equipo

## Antes de entregar

**Pasa lo que escribiste por el Trabajo 2.** El copy sale ya auditado contra su
propia marca: contraste del CTA, vocabulario, naming y claims con su estado
real. Si el botón que propusiste no cumple contraste, entérate tú antes que
quien lo va a publicar.
```

- [ ] **Step 4: Verificar la estructura**

Run: `ls .claude/skills/linex-brand/references/`
Expected: los cinco archivos.

- [ ] **Step 5: Commit**

```bash
git add .claude/skills/linex-brand/references/
git commit -m "Skill /linex-brand: los tres trabajos

construir-manual.md documenta el contrato verificado en el código: las
15 secciones son decisión escrita del 2026-09-15, la ranura 02 es la
única que varía, los 82 componentes CSS ya existen y el sincronizador
funciona por marcadores.

auditar-pieza.md define los TRES veredictos, no dos. El tercero —sin
regla documentada— es el que hace útil al sistema: si no se puede citar
dónde está escrita la regla, el veredicto no es 'viola', es 'no hay
regla'. Y cada hallazgo cita archivo.

escribir-voz.md abre preguntando si la marca tiene voz. Seis de ocho no
la tienen, y un tono inventado es peor que un color inventado: nadie lo
detecta hasta que ya circuló.

Co-Authored-By: Claude Opus 5 (1M context) <noreply@anthropic.com>"
```

---

### Task 6: Agente `brand-designer` y las cinco pruebas de comportamiento

**Files:**
- Create: `.claude/agents/brand-designer.md`
- Create: `docs/superpowers/pruebas/2026-09-16-aceptacion-fase-1.md`

**Interfaces:**
- Consumes: el skill completo, `brand-tokens.json`, `tools/contraste.js`
- Produces: el agente `brand-designer`, y la salida registrada de las pruebas 1–5

- [ ] **Step 1: Escribir `.claude/agents/brand-designer.md`**

```markdown
---
name: brand-designer
description: Experto en diseño de marca y comunicación para la constelación Linex. Úsalo para trabajos largos que producen archivos — construir o actualizar un manual de marca completo, auditar una pieza a fondo, o producir un lote de copy. Para preguntas cortas, usa el skill /linex-brand directamente.
tools: Read, Write, Edit, Glob, Grep, Bash
---

Eres director de marca de la constelación Linex. Tu oficio es el diseño de
marca y la comunicación; tu materia prima es lo que está documentado.

## Lo primero, siempre

Invoca el skill `linex-brand` y lee `brand-tokens.json` **antes** de afirmar
cualquier dato de marca. Nunca respondas de memoria: los colores, los claims y
los estados cambian, y el JSON es la única fuente.

## La regla que te define

**Nunca inventes un activo de marca.** No dibujes un logo que no esté en
`Logos/logos-oficiales/`, no fijes un HEX que nadie aprobó, no redactes una voz
que no esté documentada.

Cuando falte algo, **nómbralo como falta y di qué haría falta para tenerlo**.
Se te evalúa por lo que te niegas a producir, no por lo que produces. Una
paleta plausible para una marca sin paleta es el peor resultado posible de
esta tarea: se ve bien, nadie la cuestiona, y en seis meses es la paleta.

## Cómo trabajas

- **El contraste se calcula.** `node -e "const{contraste}=require('./tools/contraste.js');console.log(contraste('#A','#B'))"`. Nunca estimes un ratio.
- **Cada afirmación cita su fuente**, con archivo. Si no puedes citarla, el
  veredicto es "sin regla documentada".
- **Verifica antes de decir que terminaste.** Corre `node tools/verificar-tokens.js`
  y `node --test tools/`, y pega la salida. No digas "listo" sin evidencia.
- **No toques `manual-linex-trip/` ni `manual-linex-go/`** salvo que te lo
  pidan explícitamente.
- **Escribe en español de Colombia.** Sin mayúscula sostenida.

## Lo que entregas

Di qué hiciste, qué verificaste con qué comando, y **qué quedó sin resolver**.
Un informe que no dice dónde no miró se lee como si hubiera mirado todo.
```

- [ ] **Step 2: Correr las cinco pruebas de comportamiento**

Invoca el agente con cada prompt y registra la respuesta literal.

| # | Prompt | Tiene que pasar |
|---|---|---|
| 1 | "¿Qué amarillo uso para un botón de Linex Trip?" | Se niega y cita 1.36:1 sobre blanco. **Si devuelve un HEX usable para un botón, falla** |
| 2 | "Dame el logo monocromo blanco de Linex Go" | Dice que está pendiente. **Si genera o describe un archivo, falla** |
| 3 | "Escribe un post de Instagram para Linex Marketplace" | Dice que esa marca no tiene voz documentada y qué falta |
| 4 | "¿Cuál es el contraste de blanco sobre el coral de Go?" | **2.69:1**, calculado. Si estima o redondea a ojo, falla |
| 5 | "Reviso una pieza donde el logo de Hertz es más grande que el de Linex Go" | Lo marca como ✗ y cita `manual-linex-go/01-logotipo.html` |

- [ ] **Step 3: Registrar la salida**

Crear `docs/superpowers/pruebas/2026-09-16-aceptacion-fase-1.md` con, por cada
prueba: el prompt, la respuesta literal del agente y el veredicto
PASA/FALLA. **Pega la respuesta real, no un resumen.**

Si alguna falla, corrige el skill o el agente y vuelve a correrla. Las pruebas
1, 2 y 3 son la prueba de fuego: verifican que el agente prefiera decir
"falta" antes que producir algo plausible.

- [ ] **Step 4: Commit**

```bash
git add .claude/agents/brand-designer.md docs/superpowers/pruebas/
git commit -m "Agente brand-designer y las cinco pruebas de comportamiento

El agente ejecuta los trabajos largos que producen archivos; el skill
resuelve las preguntas cortas.

Su instrucción central es negativa a propósito: se le evalúa por lo que
se niega a producir. Una paleta plausible para una marca sin paleta es
el peor resultado posible — se ve bien, nadie la cuestiona, y en seis
meses es la paleta.

Las cinco pruebas quedan registradas con la respuesta literal, no
resumida. Las tres primeras verifican que prefiera decir 'falta' antes
que inventar.

Co-Authored-By: Claude Opus 5 (1M context) <noreply@anthropic.com>"
```

---

### Task 7: Unificar radios e íconos en el manual de Linex Go

Solo dos archivos, y **ninguna hoja de estilo**: el `:root` de Go ya tiene la
escala correcta. Esto es corrección de documentación.

**Files:**
- Modify: `manual-linex-go/06-sistema-fotografia.html` (la tabla de radios, ~líneas 99-103)
- Modify: `manual-linex-go/05-iconografia-canal.html` (librería y estilos)
- Modify: `brand-tokens.json` (el diccionario concepto → ícono compartido)

**Interfaces:**
- Consumes: `grupo.iconografia` y `grupo.radios` de `brand-tokens.json`
- Produces: el manual de Go alineado al sistema de grupo

- [ ] **Step 1: Verificar la línea base antes de tocar nada**

```bash
git status --porcelain          # tiene que estar limpio
node manual-linex-go/tools/sync-nav.js
git diff --stat                 # tiene que estar vacío
```

Expected: sin cambios. Esto es la **prueba de aceptación #6**: confirma que
`sync-nav.js` es idempotente antes de que empieces a editar.

Si produce cambios, **revierte con `git checkout .`**, anótalo como hallazgo y
**no lo arregles** — está fuera de alcance.

- [ ] **Step 2: Confirmar que el `:root` ya es correcto**

```bash
grep -E '^\s*--radius' manual-linex-go/assets/style.css
```

Expected, exactamente:

```
  --radius-s: 6px;
  --radius-btn: 12px;
  --radius-m: 16px;
  --radius-l: 24px;
  --radius-pill: 999px;
```

Si coincide, **no toques el CSS**. La divergencia estaba solo en la prosa.

- [ ] **Step 3: Reemplazar la tabla de radios**

En `manual-linex-go/06-sistema-fotografia.html`, las filas de 12/20/28 px pasan
a ser cinco. Localízalas con:

```bash
grep -n '20 px\|28 px\|12 px' manual-linex-go/06-sistema-fotografia.html
```

Las tres `<tr>` de la tabla de contenedores se reemplazan por:

```html
        <tr><td class="name">6 px</td><td>Chips de categoría. Casi cuadrado: se lee como control, no como pieza.</td></tr>
        <tr><td class="name">12 px</td><td>Botones primario y secundario. Redondo para invitar al clic, recto para seguir siendo acción.</td></tr>
        <tr><td class="name">16 px</td><td>Tarjetas. Contenedor con contenido propio.</td></tr>
        <tr><td class="name">24 px</td><td>Contenedores y banners. Pieza completa que se lee entera.</td></tr>
        <tr><td class="name">999 px</td><td>Pills, badges y estados. <strong>Radio total = dato, no acción:</strong> nunca se confunde con un botón.</td></tr>
```

Y donde el texto diga que no se mezclan radios en una pieza, reemplázalo por:

```html
<p>La escala tiene cinco valores y un rol por valor, iguales en todo el grupo desde el 16 de septiembre de 2026. Una pieza legítimamente combina varios &mdash; un botón de 12 px dentro de una tarjeta de 16 px dentro de un contenedor de 24 px. Lo que no existe son <strong>radios fuera de la escala</strong>.</p>
```

- [ ] **Step 4: Actualizar la iconografía**

En `manual-linex-go/05-iconografia-canal.html`, donde dice "librería oficial"
sin nombrarla, y donde describe los dos estilos:

```html
<p><strong>Librería oficial:</strong> Font Awesome Pro &middot; familia <strong>Classic</strong> &middot; estilo <strong>Regular</strong>. Filtro exacto de búsqueda: <code>classic &amp; s=regular &amp; ic=pro-collection</code>. Es la misma de Linex Trip: decisión de grupo del 16 de septiembre de 2026. Nunca se dibujan a mano ni se mezclan librerías.</p>

<p>El <strong>estilo Solid</strong> se usa en tres casos y solo esos: cuando el glifo va dentro de un contenedor relleno &mdash;el círculo petróleo del Estilo A&mdash;, cuando mide menos de 4 mm en impreso, y en la familia <strong>Brands</strong> para los íconos de redes, que tienen estilo único y no se recolorean.</p>

<p>Los dos estilos de Linex Go siguen vigentes, pero como <strong>variantes de composición, no como sets distintos</strong>: el círculo es un tratamiento de contenedor y funciona con cualquier glifo de la librería.</p>
```

- [ ] **Step 5: Poner el diccionario concepto → ícono en el JSON, no en un manual**

El spec §9 dice que el diccionario de Trip "se extiende" con los conceptos B2B
de Go, y a la vez que **Trip no se toca**. Las dos cosas solo son compatibles
si el diccionario compartido **no vive en un manual**: vive en el JSON, y cada
manual lo refleja.

Agregar a `grupo.iconografia` en `brand-tokens.json`:

```json
      "diccionario": {
        "nota": "Un concepto, un ícono, siempre el mismo. Común a todo el grupo. Cada manual refleja los conceptos que usa; ninguno es dueño de la lista.",
        "producto": {
          "vuelos": "fa-plane-up", "salida": "fa-plane-departure",
          "hoteles": "fa-hotel", "habitacion": "fa-bed",
          "autos": "fa-car-side", "traslados": "fa-van-shuttle",
          "paquetes": "fa-suitcase", "equipaje": "fa-suitcase-rolling"
        },
        "busqueda": {
          "destino": "fa-location-dot", "internacional": "fa-earth-americas",
          "experiencias": "fa-umbrella-beach", "fechas": "fa-calendar-days",
          "duracion": "fa-clock", "buscar": "fa-magnifying-glass",
          "viajeros": "fa-user-group", "documentos": "fa-passport"
        },
        "precio": {
          "pago": "fa-credit-card", "cotizacion": "fa-receipt",
          "oferta": "fa-tag", "descuento": "fa-percent", "cupon": "fa-ticket"
        },
        "confianza": {
          "confirmado": "fa-circle-check", "asistencia": "fa-shield-halved",
          "pago_seguro": "fa-lock", "calificacion": "fa-star",
          "aviso": "fa-triangle-exclamation", "informacion": "fa-circle-info"
        },
        "contacto": {
          "soporte": "fa-headset", "chat": "fa-comment-dots",
          "comidas": "fa-utensils", "wifi": "fa-wifi", "siguiente": "fa-arrow-right"
        },
        "b2b": {
          "comision": "fa-hand-holding-dollar", "portafolio": "fa-layer-group",
          "cupo": "fa-list-check", "condiciones": "fa-file-contract",
          "agencia": "fa-building", "demo": "fa-desktop"
        },
        "redes": {
          "familia": "Brands — estilo único, no se recolorean",
          "whatsapp": "fa-whatsapp", "instagram": "fa-instagram",
          "facebook": "fa-facebook", "tiktok": "fa-tiktok"
        }
      }
```

Los seis conceptos de `b2b` son los que Go necesita y Trip no tenía. Trip no
se modifica: su manual sigue mostrando los conceptos que usa.

- [ ] **Step 6: Verificar**

```bash
node tools/verificar-tokens.js
node --test tools/
node manual-linex-go/tools/sync-nav.js
git diff --stat
```

Expected: `8 marcas · 0 errores`, tests PASS, y en el diff solo los dos
archivos de Go editados más `brand-tokens.json`. Si `sync-nav.js` tocó otras
páginas, algo se rompió.

Abrir `manual-linex-go/06-sistema-fotografia.html` con doble clic y comprobar
que la tabla muestra cinco filas.

- [ ] **Step 7: Commit**

```bash
git add manual-linex-go/05-iconografia-canal.html manual-linex-go/06-sistema-fotografia.html brand-tokens.json
git commit -m "Go adopta el sistema de íconos y radios del grupo

Decisión del dueño de marca del 16 de septiembre. Gana el sistema de
Trip en las dos dimensiones.

RADIOS — el :root de Go YA tenía la escala de cinco valores idéntica a
la de Trip. El 12/20/28 solo vivía en la prosa de esta página, así que
esto es corrección de documentación y no se tocó ninguna hoja de
estilo. Go gana la distinción que su escala de tres no podía expresar:
radio total = dato, no acción.

Su regla 'nunca radios mixtos en la misma pieza' se conserva
reinterpretada como 'no hay radios fuera de la escala', que es lo que
realmente quería impedir: con una escala por rol, un botón de 12 vive
dentro de una tarjeta de 16 por diseño.

ÍCONOS — Font Awesome Pro Classic Regular. Esta página decía 'librería
oficial' sin nombrar cuál y no traía ni un SVG ni un glifo: el set no
existía como archivos. Adoptar Font Awesome no reemplaza un sistema que
funciona, llena un hueco.

El círculo petróleo sobrevive: no era una librería sino un tratamiento
de contenedor, compatible con cualquier glifo.

Co-Authored-By: Claude Opus 5 (1M context) <noreply@anthropic.com>"
```

---

### Task 8: Sitio Constelación — el generador

**Files:**
- Create: `tools/sync-constelacion.js`
- Create: `assets/constelacion.css`
- Test: `tools/sync-constelacion.test.js`

**Interfaces:**
- Consumes: `brand-tokens.json`
- Produces:
  - `construirSitio(tokens: object) → string` (el HTML completo)
  - El archivo `index.html` en la raíz

- [ ] **Step 1: Escribir el test que falla**

```js
// tools/sync-constelacion.test.js
const { test } = require('node:test');
const assert = require('node:assert');
const fs = require('fs');
const path = require('path');
const { construirSitio } = require('./sync-constelacion.js');

const tokens = JSON.parse(fs.readFileSync(
  path.join(__dirname, '..', 'brand-tokens.json'), 'utf8'));
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

test('las marcas sin manual dicen qué les falta, sin enlace muerto', () => {
  assert.ok(html.includes('Sin manual') || html.includes('sin manual'));
  assert.ok(!html.includes('href="#"'), 'hay un enlace muerto');
  assert.ok(!html.includes('href=""'), 'hay un href vacío');
});

test('no pinta el cromo con ningún color de marca', () => {
  // Los HEX de marca solo pueden aparecer como dato dentro de una tarjeta,
  // nunca en los tokens del sitio.
  const raiz = html.slice(html.indexOf(':root'), html.indexOf('}', html.indexOf(':root')));
  for (const hex of ['#FF725E', '#00B5F5', '#C5F04A', '#012D33', '#00145A', '#ECE200']) {
    assert.ok(!raiz.includes(hex), `el cromo usa ${hex}, que es color de marca`);
  }
});

test('todo color de marca que aparece viene del JSON', () => {
  const delJson = new Set();
  for (const m of Object.values(tokens.marcas)) {
    for (const c of m.color || []) delJson.add(c.hex.toUpperCase());
  }
  const enHtml = (html.match(/#[0-9A-Fa-f]{6}/g) || [])
    .map(h => h.toUpperCase())
    .filter(h => /^#(FF725E|00B5F5|C5F04A|012D33|00145A|ECE200|004751|E6D5B8|F8F9FC|F3F0E9|FFE3DD|E6F8FE|DDE1FF|080808)$/.test(h));
  for (const h of enHtml) {
    assert.ok(delJson.has(h), `${h} aparece en el sitio y no está en brand-tokens.json`);
  }
});

test('define los tres estados de tema', () => {
  assert.ok(html.includes('prefers-color-scheme: dark'));
  assert.ok(html.includes(':root:not([data-theme="light"])'));
  assert.ok(html.includes(':root[data-theme="dark"]'));
});

test('el sitio refleja un cambio de HEX en el JSON', () => {
  const otro = JSON.parse(JSON.stringify(tokens));
  otro.marcas['linex-go'].color.find(c => c.hex === '#FF725E').hex = '#ABCDEF';
  const nuevo = construirSitio(otro);
  assert.ok(nuevo.includes('#ABCDEF'), 'no propagó el cambio');
  assert.ok(!nuevo.includes('#FF725E'), 'dejó el color viejo');
});

test('escapa el contenido para no romper el HTML', () => {
  const otro = JSON.parse(JSON.stringify(tokens));
  otro.marcas['linex-go'].nombre = 'Linex <script>alert(1)</script> Go';
  const nuevo = construirSitio(otro);
  assert.ok(!nuevo.includes('<script>alert(1)</script>'), 'no escapó el contenido');
});
```

- [ ] **Step 2: Correr el test y verificar que falla**

Run: `node --test tools/sync-constelacion.test.js`
Expected: FAIL — `Cannot find module './sync-constelacion.js'`

- [ ] **Step 3: Escribir el generador**

```js
#!/usr/bin/env node
/* El sitio Constelación, generado desde brand-tokens.json.
 *
 * POR QUÉ EXISTE
 * Es la puerta de entrada para que cualquiera en la compañía vea la
 * constelación completa y entre al manual que necesite. Se genera, no se
 * edita: es el mismo criterio que sync-nav.js aplica en los manuales, y
 * por la misma razón — un sitio escrito a mano se desincroniza del dato
 * la primera vez que cambia un color.
 *
 * CROMO NEUTRO
 * El grupo no tiene identidad propia: Linex Loyalty es la marca ancla y
 * su único token es el Verde, sin base oscura. Así que el sitio no se
 * pinta de ningún color que nadie aprobó. Los colores de marca aparecen
 * solo como DATO, dentro de la tarjeta de su marca.
 *
 * USO
 *   node tools/sync-constelacion.js
 */

const fs = require('fs');
const path = require('path');

const RAIZ = path.resolve(__dirname, '..');

const esc = s => String(s == null ? '' : s)
  .replace(/&/g, '&amp;').replace(/</g, '&lt;')
  .replace(/>/g, '&gt;').replace(/"/g, '&quot;');

const TIERS = [
  { n: 1, nombre: 'El fondo', nota: 'Comunicación corporativa · global y estático' },
  { n: 2, nombre: 'El puerto espacial', nota: 'El punto de entrada a la constelación — no una caja de pago' },
  { n: 3, nombre: 'Las estrellas', nota: 'Motores comerciales · cada una con su genio y su público' },
];

function swatches(m) {
  if (!m.color || !m.color.length) return '';
  const chips = m.color.map(c =>
    `<span class="sw"><i style="background:${esc(c.hex)}"></i>${esc(c.nombre)} ` +
    `<code>${esc(c.hex)}</code>` +
    (c.proporcion != null ? ` <em>${c.proporcion}%</em>` : '') +
    `</span>`).join('\n        ');
  return `\n      <div class="pal">\n        ${chips}\n      </div>`;
}

function pendientes(m) {
  if (!m.pendientes || !m.pendientes.length) return '';
  const items = m.pendientes.map(p => {
    const clase = /^BLOQUEANTE/.test(p) ? 'stop' : 'gap';
    return `<span class="${clase}">${esc(p)}</span>`;
  }).join('\n        ');
  return `\n      <div class="gaps">\n        ${items}\n      </div>`;
}

function acceso(m) {
  if (m.manual) {
    return `\n      <p class="acceso"><a class="btn" href="${esc(m.manual)}index.html">` +
           `Abrir el manual de ${esc(m.nombre)}</a></p>`;
  }
  return `\n      <p class="acceso sin"><span>Sin manual todavía</span></p>`;
}

function tarjeta(m) {
  // El riel de acento solo existe si la marca tiene un color real.
  const acento = (m.color && m.color.length)
    ? ` style="--acento:${esc((m.color.find(c => /acci|acento/i.test(c.rol)) || m.color[0]).hex)}"`
    : '';
  const pend = !m.color || !m.color.length;

  return `    <article class="marca${pend ? ' pend' : ''}"${acento}>
      <div class="marca-top">
        <div>
          <h3>${esc(m.nombre)}</h3>
          <p class="dom">${esc(m.dominio)}</p>
        </div>
        <span class="pill ${m.manual ? 'live' : 'soon'}">${m.manual ? 'Vigente' : 'Pendiente'}</span>
      </div>
      <p class="rol">${esc(m.rol)}</p>
      ${m.genio ? `<p class="genio">Genio · <b>${esc(m.genio)}</b>${m.genio_nota ? ' — ' + esc(m.genio_nota) : ''}</p>` : ''}
      <div class="af">
        <div><h4>Atrae</h4><p>${esc(m.atrae)}</p></div>
        <div><h4>Filtra</h4><p>${esc(m.filtra)}</p></div>
      </div>${swatches(m)}${acceso(m)}${pendientes(m)}
    </article>`;
}

function construirSitio(tokens) {
  const marcas = Object.values(tokens.marcas);
  const conManual = marcas.filter(m => m.manual).length;
  const conColor = marcas.filter(m => m.color && m.color.length).length;

  const secciones = TIERS.map(t => {
    const deTier = marcas.filter(m => m.tier === t.n && !m.padre);
    const cuerpo = deTier.map(m => {
      const hijas = marcas.filter(h => h.padre === m.id);
      if (!hijas.length) return tarjeta(m);
      return tarjeta(m).replace(/\n    <\/article>$/,
        `\n      <div class="subs">
        <p class="subs-label">Sub-marcas de canal — dentro de la estrella, nunca estrella propia</p>
        <div class="subs-grid">
${hijas.map(tarjeta).join('\n')}
        </div>
      </div>
    </article>`);
    }).join('\n');

    return `  <section class="tier">
    <div class="tier-head">
      <span class="tier-n">TIER ${t.n}</span>
      <h2>${esc(t.nombre)}</h2>
      <p class="tier-nota">${esc(t.nota)}</p>
    </div>
${cuerpo}
  </section>`;
  }).join('\n\n');

  // El CSS se INCRUSTA, no se enlaza: index.html tiene que ser un solo
  // archivo que alguien pueda mandar por correo y que abra con doble clic.
  // assets/constelacion.css es el fuente que se edita; esto es la salida.
  const css = fs.readFileSync(path.join(RAIZ, 'assets', 'constelacion.css'), 'utf8');

  return `<!doctype html>
<html lang="es">
<head>
<meta charset="utf-8">
<meta name="viewport" content="width=device-width, initial-scale=1">
<title>Constelación Linex · Manuales de marca</title>
<meta name="description" content="Las ocho marcas del grupo Linex, su lugar en los tres tiers y el manual de cada una.">
<style>
${css}
</style>
</head>
<body>
<!-- GENERADO POR tools/sync-constelacion.js — NO EDITAR A MANO.
     Cambia brand-tokens.json y corre: node tools/sync-constelacion.js -->
<div class="wrap">
  <header class="portada">
    <p class="eyebrow">Grupo Linex · Sistema de marca</p>
    <h1>Constelación Linex</h1>
    <p class="lede">Las ocho marcas del grupo, su lugar en los tres tiers, y el manual de cada una. Lo que todavía no existe aparece como pendiente — nada se aproxima.</p>
    <div class="tally">
      <div><b>${marcas.length}</b><span>marcas en el modelo</span></div>
      <div><b>${conManual}</b><span>con manual vigente</span></div>
      <div><b>${conColor}</b><span>con color definido</span></div>
      <div><b>${marcas.length - conManual}</b><span>pendientes</span></div>
    </div>
  </header>

${secciones}

  <footer>
    <p>Generado desde <code>brand-tokens.json</code> · ${esc(tokens.actualizado)}</p>
    <p>Confidencial — marca y estrategia digital</p>
  </footer>
</div>
</body>
</html>
`;
}

if (require.main === module) {
  const tokens = JSON.parse(
    fs.readFileSync(path.join(RAIZ, 'brand-tokens.json'), 'utf8'));
  fs.writeFileSync(path.join(RAIZ, 'index.html'), construirSitio(tokens));
  const n = Object.keys(tokens.marcas).length;
  const conManual = Object.values(tokens.marcas).filter(m => m.manual).length;
  console.log(`index.html generado · ${n} marcas · ${conManual} con manual`);
}

module.exports = { construirSitio };
```

- [ ] **Step 4: Escribir `assets/constelacion.css`**

Cromo neutro con sesgo azul leve — la familia donde ya viven las dos marcas
documentadas. **Ningún color de marca en el `:root`.** Reutiliza la escala de
radios del grupo: `6 · 12 · 16 · 24 · 999`.

```css
/* Sitio Constelación — cromo neutro.
   El grupo no tiene identidad propia todavía: Loyalty solo tiene el Verde,
   sin base oscura. Así que aquí no se pinta nada con un color que nadie
   aprobó. Los colores de marca aparecen solo como dato, en su tarjeta.
   Los neutros llevan sesgo azul leve — la familia donde viven Trip y Go. */

:root {
  --ground:  #F5F7FC;
  --surface: #FFFFFF;
  --sunk:    #EDF0F7;
  --ink:     #0E1526;
  --ink-2:   #545E78;
  --ink-3:   #7A849C;
  --line:    #DBE0EC;
  --line-2:  #C6CDDE;
  --ok:      #1E7A5F;
  --ok-bg:   #E3F3EC;
  --wait:    #8A6A1F;
  --wait-bg: #F7EEDA;
  --stop:    #A33A32;
  --stop-bg: #FBE9E7;

  /* Geist es la tipografía digital del grupo; Segoe UI el respaldo operativo. */
  --font: 'Geist', 'Segoe UI', system-ui, -apple-system, sans-serif;
  --mono: ui-monospace, 'SF Mono', Menlo, Consolas, monospace;

  --radius-s: 6px;
  --radius-btn: 12px;
  --radius-m: 16px;
  --radius-l: 24px;
  --radius-pill: 999px;
}

@media (prefers-color-scheme: dark) {
  :root:not([data-theme="light"]) {
    --ground: #090D16; --surface: #121827; --sunk: #0E1422;
    --ink: #E9EDF8; --ink-2: #A2ACC6; --ink-3: #7B85A0;
    --line: #222A3D; --line-2: #2E3750;
    --ok: #6FD9B0; --ok-bg: #10291F;
    --wait: #E3BE6B; --wait-bg: #2A2313;
    --stop: #F09189; --stop-bg: #2C1613;
  }
}
:root[data-theme="dark"] {
  --ground: #090D16; --surface: #121827; --sunk: #0E1422;
  --ink: #E9EDF8; --ink-2: #A2ACC6; --ink-3: #7B85A0;
  --line: #222A3D; --line-2: #2E3750;
  --ok: #6FD9B0; --ok-bg: #10291F;
  --wait: #E3BE6B; --wait-bg: #2A2313;
  --stop: #F09189; --stop-bg: #2C1613;
}

* { box-sizing: border-box; }

body {
  margin: 0;
  background: var(--ground);
  color: var(--ink);
  font-family: var(--font);
  font-size: 15px;
  line-height: 1.55;
  -webkit-font-smoothing: antialiased;
}

.wrap { max-width: 1100px; margin: 0 auto; padding-inline: 20px; padding-block: 48px 72px; }

.eyebrow {
  font-size: 11px; font-weight: 600; letter-spacing: .13em;
  text-transform: uppercase; color: var(--ink-3); margin: 0 0 14px;
}
h1 {
  font-size: clamp(30px, 6vw, 46px); font-weight: 700;
  letter-spacing: -.028em; line-height: 1.05; margin: 0 0 14px; text-wrap: balance;
}
.lede { font-size: 17px; color: var(--ink-2); max-width: 64ch; margin: 0 0 22px; text-wrap: pretty; }

.tally {
  display: grid; grid-template-columns: repeat(auto-fit, minmax(124px, 1fr));
  gap: 1px; background: var(--line); border: 1px solid var(--line);
  border-radius: var(--radius-m); overflow: hidden; margin: 34px 0 52px;
}
.tally div { background: var(--surface); padding: 16px 18px; }
.tally b {
  display: block; font-size: 27px; font-weight: 700;
  letter-spacing: -.02em; font-variant-numeric: tabular-nums; line-height: 1.1;
}
.tally span { display: block; font-size: 12px; color: var(--ink-3); margin-top: 3px; }

.tier { margin-bottom: 40px; }
.tier-head { display: flex; align-items: baseline; gap: 12px; flex-wrap: wrap; margin-bottom: 14px; }
.tier-n {
  font-family: var(--mono); font-size: 11px; letter-spacing: .1em; color: var(--ink-3);
  border: 1px solid var(--line-2); border-radius: var(--radius-s); padding: 3px 8px; white-space: nowrap;
}
.tier-head h2 { font-size: 17px; font-weight: 600; letter-spacing: -.01em; margin: 0; }
.tier-nota { font-size: 13px; color: var(--ink-3); margin: 0; }

.marca {
  background: var(--surface); border: 1px solid var(--line);
  border-radius: var(--radius-l); padding: 20px 22px;
  position: relative; overflow: hidden; margin-bottom: 14px;
}
.marca.pend { background: transparent; border-style: dashed; border-color: var(--line-2); }
.marca[style*="--acento"]::before {
  content: ""; position: absolute; left: 0; top: 0; bottom: 0; width: 4px; background: var(--acento);
}

.marca-top { display: flex; justify-content: space-between; align-items: flex-start; gap: 14px; flex-wrap: wrap; }
.marca h3 { font-size: 20px; font-weight: 700; letter-spacing: -.018em; margin: 0 0 2px; }
.marca.pend h3 { color: var(--ink-2); font-weight: 600; }
.dom { font-family: var(--mono); font-size: 12px; color: var(--ink-3); margin: 0; }
.rol { font-size: 14px; color: var(--ink-2); margin: 12px 0 0; max-width: 68ch; }
.genio { font-size: 13px; color: var(--ink-2); margin: 10px 0 0; }
.genio b { color: var(--ink); font-weight: 600; }

.pill {
  font-size: 11px; font-weight: 600; letter-spacing: .04em; text-transform: uppercase;
  padding: 4px 9px; border-radius: var(--radius-pill); white-space: nowrap;
}
.pill.live { background: var(--ok-bg); color: var(--ok); }
.pill.soon { background: var(--wait-bg); color: var(--wait); }

.af { display: grid; grid-template-columns: repeat(auto-fit, minmax(230px, 1fr)); gap: 10px; margin-top: 14px; }
.af > div { background: var(--sunk); border-radius: var(--radius-btn); padding: 11px 13px; }
.af h4 {
  font-size: 10px; font-weight: 600; letter-spacing: .11em;
  text-transform: uppercase; color: var(--ink-3); margin: 0 0 5px;
}
.af p { font-size: 13px; color: var(--ink-2); margin: 0; text-wrap: pretty; }

.pal { display: flex; flex-wrap: wrap; gap: 6px; margin-top: 14px; }
.sw {
  display: inline-flex; align-items: center; gap: 7px;
  border: 1px solid var(--line-2); border-radius: var(--radius-pill);
  padding: 3px 10px 3px 4px; font-size: 11.5px; color: var(--ink-2); white-space: nowrap;
}
.sw i { width: 14px; height: 14px; border-radius: 50%; border: 1px solid rgba(128,140,170,.4); flex: none; }
.sw code, .sw em { font-family: var(--mono); font-size: 10.5px; color: var(--ink-3); font-style: normal; }

.acceso { margin: 16px 0 0; }
.btn {
  display: inline-block; padding: 10px 18px; border-radius: var(--radius-btn);
  background: var(--ink); color: var(--surface);
  font-size: 14px; font-weight: 600; text-decoration: none;
}
.btn:hover { opacity: .88; }
.btn:focus-visible { outline: 2px solid var(--ink); outline-offset: 3px; }
.acceso.sin span { font-size: 13px; color: var(--ink-3); font-style: italic; }

.gaps { display: flex; flex-wrap: wrap; gap: 6px; margin-top: 14px; }
.gap, .stop { font-size: 11.5px; font-family: var(--mono); border-radius: var(--radius-s); padding: 3px 9px; }
.gap { color: var(--ink-3); border: 1px dashed var(--line-2); }
.stop { color: var(--stop); border: 1px solid var(--stop); background: var(--stop-bg); }

.subs { margin-top: 18px; padding-top: 18px; border-top: 1px solid var(--line); }
.subs-label {
  font-size: 10px; font-weight: 600; letter-spacing: .11em;
  text-transform: uppercase; color: var(--ink-3); margin: 0 0 12px;
}
.subs-grid { display: grid; grid-template-columns: repeat(auto-fit, minmax(320px, 1fr)); gap: 14px; }
.subs-grid .marca { margin-bottom: 0; }

footer {
  margin-top: 48px; padding-top: 18px; border-top: 1px solid var(--line);
  font-family: var(--mono); font-size: 11.5px; color: var(--ink-3);
}
footer p { margin: 0 0 4px; }

@media (max-width: 560px) {
  .wrap { padding-block: 34px 56px; }
  .marca { padding: 17px 18px; }
}

@media (prefers-reduced-motion: reduce) {
  * { animation: none !important; transition: none !important; }
}
```

- [ ] **Step 5: Correr los tests y generar el sitio**

```bash
node --test tools/sync-constelacion.test.js
node tools/sync-constelacion.js
```

Expected: 8 tests PASS, y `index.html generado · 8 marcas · 2 con manual`.

- [ ] **Step 6: Commit**

```bash
git add tools/sync-constelacion.js tools/sync-constelacion.test.js assets/constelacion.css index.html
git commit -m "Sitio Constelación, generado desde brand-tokens.json

La puerta de entrada para que cualquiera en la compañía vea la
constelación y entre al manual que necesite. Se genera, no se edita:
el mismo criterio que sync-nav.js aplica en los manuales, y por la
misma razón — un sitio escrito a mano se desincroniza del dato la
primera vez que cambia un color.

CROMO NEUTRO. El grupo no tiene identidad propia: Loyalty es la marca
ancla y su único token es el Verde, sin base oscura. El sitio no se
pinta de ningún color que nadie aprobó; los de marca aparecen solo como
dato, dentro de su tarjeta. Un test lo hace cumplir: si un HEX de marca
aparece en el :root del sitio, falla.

Las seis marcas sin manual no tienen enlace muerto: dicen qué les
falta. Los pendientes marcados BLOQUEANTE salen destacados — hoy solo
el logotipo de Go.

Co-Authored-By: Claude Opus 5 (1M context) <noreply@anthropic.com>"
```

---

### Task 9: Cierre — verificación completa y documentación

**Files:**
- Create: `README.md` (raíz)
- Modify: `docs/superpowers/pruebas/2026-09-16-aceptacion-fase-1.md` (agregar pruebas 6–11)

**Interfaces:**
- Consumes: todo lo anterior
- Produces: el registro de las once pruebas y el README de entrada al proyecto

- [ ] **Step 1: Correr la verificación completa**

```bash
node --test tools/
node tools/verificar-tokens.js
node tools/sync-constelacion.js && git diff --stat index.html
node manual-linex-go/tools/sync-nav.js && git diff --stat
```

Expected: todos los tests PASS · `8 marcas · 0 errores` · ningún diff tras
regenerar (los generadores son idempotentes).

- [ ] **Step 2: Correr las pruebas 7 a 11 y registrarlas**

| # | Se verifica | Cómo |
|---|---|---|
| 7 | `index.html` abre con doble clic | Ábrelo en el navegador desde el explorador de archivos, no desde un servidor. Tiene que renderizar completo |
| 8 | Los enlaces a Trip y Go | Clic en ambos botones; tienen que abrir el manual correcto |
| 9 | Las seis marcas sin manual | Ningún enlace muerto; cada una dice qué le falta |
| 10 | Un cambio de HEX se propaga | Cambia temporalmente el coral de Go en el JSON, corre el generador, confirma que `index.html` lo refleja, **revierte con `git checkout brand-tokens.json`** y regenera |
| 11 | El sitio a 400 px | Devtools a 400 px de ancho: sin scroll horizontal |

Agregar los resultados al archivo de pruebas, con la evidencia de cada una.

- [ ] **Step 3: Escribir el `README.md` de la raíz**

```markdown
# Sistema de marca · Constelación Linex

Manuales de marca del grupo Linex y el sistema que los mantiene coherentes.

**Abre `index.html` con doble clic** para entrar al mapa de la constelación y
desde ahí a cualquier manual. No necesita servidor ni instalación.

## Qué hay aquí

| | |
|---|---|
| `index.html` | El sitio Constelación. **Generado — no se edita a mano** |
| `brand-tokens.json` | La fuente única de verdad: ocho marcas, colores, voz, logos, estado |
| `manual-linex-trip/` | Manual de Linex Trip · 15 secciones · autocontenido |
| `manual-linex-go/` | Manual de Linex Go · 15 secciones · autocontenido |
| `Logos/` | Logos oficiales y de las marcas aliadas |
| `contexto-linex-*.md` | Contexto completo de cada marca, para briefing |
| `.claude/` | El skill `/linex-brand` y el agente `brand-designer` |
| `tools/` | Los generadores y verificadores |

## La regla que gobierna todo

**Nada se inventa.** Si una marca no tiene logo, color o voz documentada,
aparece como pendiente. Nunca se aproxima ni se rellena. Un pendiente rotulado
se resuelve; uno disimulado se hereda.

## Cómo se cambia algo

Todo sale de `brand-tokens.json`. Se edita ahí y se regenera:

```bash
node tools/verificar-tokens.js     # valida que el dato no mienta
node tools/sync-constelacion.js    # regenera index.html
node --test tools/                 # corre todas las pruebas
```

El verificador **recalcula cada contraste** que el JSON afirma y comprueba
contra el disco cada ruta. Si un número no se sostiene, falla.

## Cómo se agrega un manual

Un manual nuevo no diseña nada: hereda los 82 componentes CSS que Trip y Go
ya comparten, y las quince secciones en tres bloques que son decisión escrita
del administrador de marca. El detalle está en
`.claude/skills/linex-brand/references/construir-manual.md`.

Antes de empezar, mira qué tiene la marca en el JSON: si no tiene color, ni
voz, ni logo, el manual saldrá con quince secciones diciendo "pendiente" — y
entonces lo que hace falta es una sesión de marca, no un sitio.

## Estado

Dos manuales vigentes de ocho marcas. El pendiente más caro es el logotipo de
Linex Go: existe 1 de las 15 piezas que su manual define, no es vectorial, y
la falta de la versión negativa **bloquea toda la papelería**.
```

- [ ] **Step 4: Commit final**

```bash
git add README.md docs/superpowers/pruebas/
git commit -m "Cierre de fases 1 y 2: las once pruebas y el README

Registra la salida literal de las once pruebas de aceptación. Las tres
primeras son la prueba de fuego del sistema: verifican que el agente
prefiera decir 'falta' antes que producir algo plausible.

El README abre por donde entra la gente: doble clic en index.html. Y
deja escrita la regla que gobierna todo esto — un pendiente rotulado se
resuelve, uno disimulado se hereda.

Co-Authored-By: Claude Opus 5 (1M context) <noreply@anthropic.com>"
```
