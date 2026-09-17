/* Utilidad con la que se escribió el manual bilingüe. No es parte del sitio
 * publicado: es la herramienta para mantenerlo. Ver también
 * tools/verificar-bilingue.js, que revisa el resultado después.
 *
 * Cuatro funciones, para cuatro formas distintas de envolver contenido:
 *
 * aplicar()          — prosa normal (párrafos, li, celda suelta, notas). El
 *                       texto encontrado se envuelve TAL CUAL en dos <span>.
 *                       Válido siempre que el fragmento no cruce el límite de
 *                       una celda o de una fila: un <span> no puede contener
 *                       una <tr>, ni una <th>, ni un cierre-y-apertura de
 *                       <td>, sin que el navegador rompa la tabla al leerla.
 *
 * aplicarFila()      — filas de tabla completas, con una o varias celdas. NO
 *                       se envuelven en <span>: se DUPLICAN. Cada <tr>
 *                       original se marca data-lang="es" y se inserta al lado
 *                       un <tr data-lang="en"> con la traducción. Dos filas
 *                       reales, cada una válida por sí sola.
 *
 * aplicarTitulo()    — el texto interior de un título (o de cualquier
 *                       etiqueta) sin tocar la etiqueta misma. Existe para
 *                       cuando el texto solo podría coincidir por accidente
 *                       con otra cadena del archivo — una meta description,
 *                       por ejemplo — o cuando el fragmento cruzaría un
 *                       límite si se envolviera entero.
 *
 * aplicarTituloTodas() — como aplicarTitulo(), pero para una etiqueta que se
 *                       repite idéntica a propósito ("falta", "en archivo",
 *                       en varias filas de estado). Nunca se busca la palabra
 *                       sola: una palabra corta es substring de otra más
 *                       larga ("falta" dentro de "faltan"), y un split
 *                       literal la rompería donde no corresponde.
 *
 * Las cuatro verifican que el texto de búsqueda aparezca las veces que
 * corresponde, para no tocar el lugar equivocado ni fallar en silencio.
 */
const fs = require('fs');

function bi(es, en) {
  return `<span data-lang="es">${es}</span><span data-lang="en">${en}</span>`;
}

function leer(archivo) {
  const raw = fs.readFileSync(archivo, 'utf8');
  const eol = raw.includes('\r\n') ? '\r\n' : '\n';
  return { s: raw.split('\r\n').join('\n'), eol };
}

function escribir(archivo, s, eol) {
  fs.writeFileSync(archivo, s.split('\n').join(eol));
}

function unaVez(archivo, s, buscado, etiqueta) {
  const n = s.split(buscado).length - 1;
  if (n !== 1) throw new Error(`${archivo}: ${etiqueta} "${buscado.slice(0, 60)}..." aparece ${n} veces, esperaba 1`);
}

/* Guarda contra el error que ya nos mordió varias veces: un fragmento que
 * empieza a mitad de un elemento ajeno y termina a mitad de otro — por
 * ejemplo "REGLA</span>\n<p>...</p>", que arranca DENTRO de un <span> ajeno
 * y sigue hasta cerrar un <p> completo. Envolver eso en un <span> nuevo deja
 * el <span> original sin cerrar y filtrándose indefinidamente.
 *
 * Un <span> anidado COMPLETO adentro del fragmento —abre y cierra los dos
 * dentro del mismo fragmento— es perfectamente válido: un <span> puede
 * contener otro. Lo que no es válido es que el fragmento cierre MÁS spans
 * de los que abre: eso solo pasa cuando el primer cierre pertenece a un
 * <span> que se abrió afuera. Por eso se cuenta el balance, no se prohíbe
 * el carácter. */
function sinCruces(archivo, es) {
  const abre = (es.match(/<span[ >]/g) || []).length;
  const cierra = (es.match(/<\/span>/g) || []).length;
  if (cierra > abre) {
    throw new Error(`${archivo}: el fragmento cierra un <span> que no abrió — cruza el límite de un elemento ajeno: "${es.slice(0, 60)}..."`);
  }
  /* Segunda guarda, distinta: un "<" suelto al FINAL del fragmento — el
   * mismo error de antes pero con <div> en vez de <span> (nos mordió en las
   * tarjetas de "Qué combinaciones se permiten"). Si el fragmento termina
   * justo en ese "<", envolverlo en un span se traga el "<" del cierre real
   * que viene después, y ese cierre queda mutilado en "/div>" sin su "<" —
   * deja de ser una etiqueta. Un fragmento válido nunca termina a mitad de
   * abrir una etiqueta. */
  if (es.endsWith('<')) {
    throw new Error(`${archivo}: el fragmento termina en un "<" suelto — probablemente se comió el inicio de un cierre real como "</div>": "...${es.slice(-30)}"`);
  }
  /* Y la misma idea al principio: un fragmento que empieza con "/algo>"
   * (sin su "<") es la otra mitad de un cierre que el fragmento anterior ya
   * se comió. Si esto se dispara, el bug está en el par de ANTES, no en este. */
  if (/^\/[a-zA-Z]/.test(es)) {
    throw new Error(`${archivo}: el fragmento empieza con "${es.slice(0, 10)}" — parece la mitad de un cierre sin su "<". Revisa el par anterior.`);
  }
  /* Tercera guarda: un fragmento nunca cierra una celda o una fila que no es
   * suya. "Nombre</td><td>Contenido" cruza de un <td> a otro — envolverlo en
   * un span dejaría ese span abarcando dos celdas, que un <span> no puede
   * hacer. Esto no es "abrir sin cerrar" como las guardas de arriba: aquí SÍ
   * hay un cierre, pero pertenece a una celda ajena. Si hace falta traducir
   * una fila completa, es aplicarFila(); si es una celda sola, aplicarTitulo()
   * con abre="<td...>" y cierra="</td>". */
  if (/<\/(td|th|tr)>/.test(es)) {
    throw new Error(`${archivo}: el fragmento cierra una celda o fila ajena — usa aplicarFila() o aplicarTitulo(): "${es.slice(0, 60)}..."`);
  }
}

function aplicar(archivo, pares) {
  let { s, eol } = leer(archivo);
  for (const [es, en] of pares) {
    sinCruces(archivo, es);
    unaVez(archivo, s, es, 'texto');
    s = s.replace(es, bi(es, en));
  }
  escribir(archivo, s, eol);
  console.log(`  ✓ ${archivo} — ${pares.length} bloques de prosa envueltos`);
}

/* filas: array de [tr_original_completo, tr_en_completo].
 * tr_original_completo debe empezar en "<tr>" (sin atributos) y tr_en_completo
 * es la fila COMPLETA en inglés, con su propia apertura "<tr>". */
function aplicarFila(archivo, filas) {
  let { s, eol } = leer(archivo);
  for (const [trEs, trEn] of filas) {
    unaVez(archivo, s, trEs, 'fila');
    if (!trEs.startsWith('<tr>')) throw new Error(`${archivo}: la fila ES no empieza en <tr>: ${trEs.slice(0, 40)}`);
    if (!trEn.startsWith('<tr>')) throw new Error(`${archivo}: la fila EN no empieza en <tr>: ${trEn.slice(0, 40)}`);
    const conEs = trEs.replace('<tr>', '<tr data-lang="es">');
    const conEn = trEn.replace('<tr>', '<tr data-lang="en">');
    s = s.replace(trEs, conEs + conEn);
  }
  escribir(archivo, s, eol);
  console.log(`  ✓ ${archivo} — ${filas.length} filas de tabla duplicadas`);
}

/* Para títulos y cualquier caso donde el texto a traducir podría
 * coincidir por accidente con otra cadena del archivo (una meta description,
 * por ejemplo). Se ancla con la etiqueta que lo abre y la que lo cierra, así
 * que solo hace falta que abre+texto+cierra sea único — casi siempre lo es,
 * aunque el texto solo no lo fuera. La etiqueta en sí NUNCA entra al span. */
function aplicarTitulo(archivo, abre, es, en, cierra) {
  let { s, eol } = leer(archivo);
  const buscado = abre + es + cierra;
  unaVez(archivo, s, buscado, 'título');
  s = s.replace(buscado, abre + bi(es, en) + cierra);
  escribir(archivo, s, eol);
  console.log(`  ✓ ${archivo} — título envuelto: ${es.slice(0, 40)}`);
}

/* Como aplicarTitulo, pero para una etiqueta que se repite idéntica varias
 * veces a propósito —"falta", "en archivo", "sin archivo", en varias filas
 * de estado—. NUNCA se busca la palabra sola: siempre anclada a la etiqueta
 * que la contiene (abre/cierra), porque una palabra corta como "falta" es
 * substring de otras ("faltan") y un split literal la rompería donde no
 * corresponde. Exige al menos una aparición, y traduce todas. */
function aplicarTituloTodas(archivo, abre, es, en, cierra) {
  let { s, eol } = leer(archivo);
  const buscado = abre + es + cierra;
  const n = s.split(buscado).length - 1;
  if (n < 1) throw new Error(`${archivo}: "${buscado.slice(0, 60)}" no aparece ninguna vez`);
  s = s.split(buscado).join(abre + bi(es, en) + cierra);
  escribir(archivo, s, eol);
  console.log(`  ✓ ${archivo} — "${es}" traducido en sus ${n} apariciones`);
}

module.exports = { aplicar, aplicarFila, aplicarTitulo, aplicarTituloTodas, bi };
