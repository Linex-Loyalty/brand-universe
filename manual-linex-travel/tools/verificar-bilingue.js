#!/usr/bin/env node
/* Verifica el selector de idioma en las 16 páginas del manual.
 *
 * POR QUÉ EXISTE
 * Construir el bilingüe costó tres clases de error, cada una silenciosa
 * hasta que alguien abría la página en un navegador real:
 *
 *   1. Un <span data-lang> que cierra un elemento que no abrió — por
 *      ejemplo "REGLA</span>\n<p>...", que empieza a mitad de un <span>
 *      ajeno. Deja ese span original sin cerrar, filtrándose indefinidamente.
 *   2. Lo mismo con <div>: un fragmento que termina en un "<" suelto se come
 *      el inicio del cierre real que viene después, y ese cierre queda
 *      mutilado en "/div>" — sin su "<", deja de ser una etiqueta.
 *   3. Un <span> que envuelve contenido de tabla — una <tr>, o un cruce de
 *      </td><td>, o varias <th> completas. Un <span> no puede contener eso
 *      legalmente: el navegador saca ese contenido de la tabla al analizarlo
 *      ("foster parenting"), y lo rompe en los dos idiomas por igual.
 *
 * Las dos primeras las bloquea tools/envolver.js en el momento de escribir
 * (sinCruces). La tercera es más traicionera: el CONTEO de aperturas y
 * cierres no cambia —no se agregó ni se quitó ninguna etiqueta, solo se
 * anidó mal—, así que un chequeo de balance simple no la detecta. Solo se
 * ve inspeccionando qué hay DENTRO de cada span ya escrito. Por eso este
 * script revisa el resultado, no la intención.
 *
 * USO
 *   node tools/verificar-bilingue.js
 */

const fs = require('fs');
const path = require('path');

const RAIZ = path.resolve(__dirname, '..');
const PAGINAS = ['index.html', ...fs.readdirSync(RAIZ)
  .filter(f => /^\d\d-.*\.html$/.test(f))
  .sort()];

let errores = 0;

for (const archivo of PAGINAS) {
  const s = fs.readFileSync(path.join(RAIZ, archivo), 'utf8');

  // 1 · todo span[data-lang] cierra dentro de su propio ámbito, nunca una
  //     celda o fila ajena.
  const reSpan = /<span data-lang="(es|en)">((?:(?!<span data-lang).)*?)<\/span>/gs;
  let m;
  while ((m = reSpan.exec(s))) {
    if (/<\/(td|th|tr)>/.test(m[2])) {
      console.log(`✖ ${archivo}: un span[data-lang="${m[1]}"] cierra una celda o fila ajena`);
      console.log(`  contenido: ${m[2].slice(0, 80)}...`);
      errores++;
    }
  }

  // 2 · los dos idiomas aparecen el mismo número de veces. Si no, alguien
  //     tradujo un fragmento y olvidó el otro, o viceversa.
  const es = (s.match(/data-lang="es"/g) || []).length;
  const en = (s.match(/data-lang="en"/g) || []).length;
  if (es !== en) {
    console.log(`✖ ${archivo}: ${es} marcas "es" contra ${en} "en" — un idioma quedó sin su par`);
    errores++;
  }

  // 3 · toda <tr data-lang="es"> tiene su <tr data-lang="en"> hermana, y
  //     viceversa — las filas duplicadas siempre van en pareja.
  const trEs = (s.match(/<tr data-lang="es"/g) || []).length;
  const trEn = (s.match(/<tr data-lang="en"/g) || []).length;
  if (trEs !== trEn) {
    console.log(`✖ ${archivo}: ${trEs} filas <tr data-lang="es"> contra ${trEn} "en"`);
    errores++;
  }

  // 4 · balance genérico de etiquetas — atrapa cualquier <div>/<span>/<tr>
  //     que un guion de traducción haya mutilado.
  for (const t of ['div', 'span', 'section', 'table', 'tr', 'td', 'th', 'p', 'ul', 'li', 'figure', 'figcaption']) {
    const abre = (s.match(new RegExp(`<${t}[ >]`, 'g')) || []).length;
    const cierra = (s.match(new RegExp(`</${t}>`, 'g')) || []).length;
    if (abre !== cierra) {
      console.log(`✖ ${archivo}: <${t}> desbalanceado — ${abre} aperturas, ${cierra} cierres`);
      errores++;
    }
  }
}

if (errores) {
  console.log(`\n${errores} problema(s) en ${PAGINAS.length} páginas`);
  process.exit(1);
}
console.log(`${PAGINAS.length} páginas · selector de idioma verificado · 0 problemas`);
