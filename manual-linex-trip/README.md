# manual-linex-trip/ — Manual de Marca standalone de Linex Trip (vigente)

Este es el **manual de marca standalone y autocontenido de Linex Trip**, listo para compartir aparte con cualquier persona (interna o externa) que lo pida, sin necesidad de entregarle el manual completo de Linex Travel.

No confundir con:

- `brand-system/manual-linex-trip-legacy/` — el manual anterior de 23 secciones, **superado y ya borrado** (septiembre 2026), una vez reconciliado su contenido dentro de este manual. Se menciona aquí solo para que una referencia vieja a esa ruta no confunda: no existe.
- `brand-system/manual-linex-travel/` — el manual de Linex Travel, que conserva de Linex Trip **solo la sección 21** (`Delta_LinexTrip.dc.html` / `site/delta-trip.html`): identidad, tier, tokens y estado, con un puntero a este manual. Las sub-secciones 21.1–21.10 que duplicaban este detalle se eliminaron en septiembre 2026 — este manual es la fuente única. Eso responde a la necesidad de gobernanza: el grupo necesita seguir mostrando las 6 marcas completas en un solo documento. Ambos manuales coexistían a propósito y su contenido de marca era idéntico en sustancia — solo cambiaba la numeración. **Desde la consolidación de septiembre 2026 (ver abajo) esto ya no es del todo cierto**: este manual ganó tres secciones nuevas (02 Audiencias, 03 Propuesta de valor y claims, 04 Voz y tono) rescatadas del legacy que el lado del grupo (`delta-trip*.html`) todavía no tiene. Pendiente: si el dueño de marca quiere mantener la paridad, replicar esas tres secciones también como `delta-trip-*.html` en `manual-linex-travel/` — no se hizo en esta consolidación porque el alcance pedido era solo este manual standalone.

### Cambio de color · 14 de septiembre de 2026

El oscuro de la marca pasó de **Índigo `#1A0E3E`** a **Azul Trip `#00145A`**, y entró un tercer color: **Amarillo `#ECE200`**, de detalle. Decisión del dueño de marca; el motivo del cambio de oscuro fue separar a Trip del navy de Linex Go.

Ya está aplicado en todo el manual, en `assets/style.css` (tokens `--navy` y `--amarillo`), en `assets/favicon.svg` y en `brand-tokens.json`. Dos cosas quedaron deliberadamente sin tocar:

- **`assets/logos/*.svg`** — son las propuestas de símbolo del diseñador, dibujadas con el Índigo anterior. `02-propuestas-logo.html` lo dice en su primer aviso: si se elige alguna, hay que recolorearla.
- **El logo oficial** `logo-LinexTrip.svg` ya venía actualizado por el diseñador con el azul nuevo.

**Regla dura del Amarillo:** vive únicamente sobre el Azul Trip. Sobre el azul da 12.38:1; sobre blanco da 1.36:1 y es ilegible. Textos pequeños y elementos menores, en web y en redes; nunca títulos ni botones.

**Pendiente de coordinación:** el Amarillo queda a 22 ΔE del Dorado `#C99A3B` que Linex Loyalty tiene como candidato de acento. Conviene avisarle a Loyalty antes de que fije el suyo.

## Contenido

El menú va en **orden de referencia, no de inducción**: la identidad visual primero, porque es lo que la gente viene a buscar la mayoría de las veces que abre el manual. La inducción la cubre entera la portada. El porqué del orden y de los bloques está en `docs/superpowers/specs/2026-09-14-reorganizacion-manual-trip-design.md`.

**Portada**

- `index.html` — 00 · Resumen ejecutivo: quién es Linex Trip, propósito/visión, arquitectura resumida, color, logo y tono en un vistazo. Es la puerta de entrada para quien no conoce la marca.

**A · Identidad visual**

- `01-logotipo.html` — Logotipo: variantes, zona de seguridad, mal uso.
- `02-propuestas-logo.html` — Propuestas de logo: las siete propuestas de símbolo en exploración, con el moodboard por familias (el lugar / el movimiento / la gente y el objeto), una ficha por propuesta con las mismas cinco preguntas (qué ves / qué dice / a quién reconoce / dónde brilla y dónde sufre / chequeo del sistema) y las mismas cuatro pruebas (blanco, negativo, monocromo, ícono 32px). El orden en que aparecen es deliberado y no se anuncia como tal en la página: es decisión del dueño de la marca, no de quien la mantiene — no reordenar sin consultarle. **Exploración abierta: nada de esa página es vigente** — el logotipo oficial sigue siendo el wordmark de `01`.
- `03-paleta-color.html` — Paleta de color: los **siete** colores oficiales, su proporción de uso propuesta y el HEX/RGB/CMYK y rol de cada uno.
- `04-tipografia.html` — Tipografía y jerarquía H1–H3.
- `05-iconografia-canal.html` — Iconografía: librería oficial (Font Awesome Pro · Classic Regular), diccionario concepto → ícono, accesibilidad del ícono canal por canal (web, redes, email, impresos) y tamaño/color/entrega por canal.
- `06-sistema-fotografia.html` — Sistema gráfico y criterio fotográfico.
- `07-accesibilidad.html` — Contraste, áreas táctiles, combinaciones de paleta permitidas y la legibilidad medida de Celeste y de Amarillo. Cierra el bloque visual a propósito: es la restricción que aplica a todo lo anterior, y va justo antes del bloque donde se violaría.

**B · Quién es y cómo habla**

- `08-arquitectura.html` — Arquitectura y escritura del nombre.
- `09-audiencias.html` — Audiencias: los tres arquetipos de viajero (planificador digital, decisor rápido, familia viajera).
- `10-propuesta-valor.html` — Propuesta de valor y claims: el claim principal ("Viaja Inteligente"), los cuatro pilares de valor y los claims secundarios pendientes de aprobación.
- `11-voz-tono.html` — Voz y tono: los cuatro principios (claro, cercano, confiable, inspirador) y la tabla sí decir / no decir.
- `12-vocabulario.html` — Vocabulario.

**C · Cómo se aplica**

- `13-promociones-cta.html` — Componentes de precio, reglas de promoción y biblioteca de CTA.
- `14-entregables.html` — Activos oficiales y, canal por canal (página web, WhatsApp/Contact Center, email, papelería), las reglas de composición con la pieza armada al lado.
- `15-redes-sociales.html` — Cómo se arma una pieza de Instagram (post, story y carrusel armados, con margen seguro), lenguaje gráfico observado en redes (incl. nota sobre las referencias de una aerolínea aliada), reglas de uso de IA para producir contenido de marca, formatos de pieza y kit de prompt para generación de imagen con IA.

**Archivos de apoyo**
- `assets/style.css` y `assets/nav.js` — copia independiente de los mismos estilos/script del sitio del manual de Linex Travel, para que esta carpeta sea 100% portátil (no depende de `../manual-linex-travel/`).
- `assets/favicon.svg` — marca reducida para la pestaña del navegador (Índigo #1A0E3E + la "T" de Trip en Celeste #00B5F5).
- `assets/lightbox.js` — ampliar las piezas de canal de `14 · Entregables`. Vanilla, sin dependencias, funciona con doble clic en `file://`. Cada pieza está maquetada UNA vez a su tamaño real (el hero a 1440 px, el email a 600, la tarjeta a 89×51 mm) y se muestra encogida con la variable CSS `--escala`; el lightbox clona ese mismo nodo y le sube la escala, así que la miniatura y la versión ampliada son el mismo DOM y el texto se lee nítido en las dos. Si se agrega una pieza nueva, basta con `data-ampliar="<nombre>"` y declarar `--pieza-w`/`--pieza-h`.
- `assets/foto-san-andres.webp`, `assets/foto-vuelos.webp`, `assets/foto-cartagena.webp` — la fotografía de las piezas de `14`. Son la zona fotográfica recortada (vía `object-position`, sin reencodear) de las tres piezas de redes que están en `brand-system/assets/referencias-graficas/linex-trip/` (`image1`, `image2`, `image3`). **Solo sirven en encuadre apaisado**: en cuadrado se cuela el titular de San Andrés y el sello de precio de Cartagena. Ojo: esas piezas originales llevan el logo en forma compacta "LinexTrip", anterior a la regla de nombre — por eso se usa su foto y nunca la pieza entera.
- `assets/logos/` — los assets de `02 · Propuestas de logo`. Por cada propuesta: el lockup principal (`p1.svg`…`p7.svg`), su negativo (`-neg`, navy→blanco), su monocromo (`-mono`, celeste→navy), el símbolo aislado y recortado (`s1.svg`…`s7.svg`) y, donde existe, el lockup vertical (`p1-vertical.svg`, `p5-vertical.svg`). **El número del archivo es el de la lámina, no el del diseñador** — si se reordenan las propuestas hay que renombrar los assets en el mismo cambio. Correspondencia con los archivos originales, que viven en `brand-system/assets/logos-oficiales/linex-trip/propuesta/`:

  | Lámina | Archivo original del diseñador |
  |---|---|
  | 01 · La etiqueta de equipaje | `propuesta5-1.svg` (y `propuesta5.svg`, vertical) |
  | 02 · El pin con señal | `propuesta1.svg` |
  | 03 · Los que viajan | `propuesta3.svg` |
  | 04 · El punto lleno | `propuesta7.svg` |
  | 05 · El origami | `propuesta6-1.svg` (y `propuesta6.svg`, vertical) |
  | 06 · El punto abierto | `propuesta2.svg` |
  | 07 · La órbita | `propuesta4.svg` |

  Los `-neg`, `-mono` y `s*` son derivados mecánicos generados para las pruebas de la ficha, no arte nuevo. Si llegan propuestas corregidas, se regeneran desde el original y no se editan aquí.
- `tools/sync-nav.ps1` — herramienta de autoría, **no** parte del entregable. Ver "Cómo agregar una sección".

- **`S10 (Paleta de color)` del legacy sí terminó recuperada**, en `03-paleta-color.html` (septiembre 2026), con la proporción de uso y el CMYK de referencia que antes no estaban en ningún lado. La nota de más abajo que decía que no se integraba queda superada por esa página.

### Consolidación con `manual-linex-trip-legacy/` (septiembre 2026)

Las secciones de Audiencias, Propuesta de valor y claims y Voz y tono (hoy 09, 10 y 11) son nuevas en este manual: rescatan contenido específico de Linex Trip del manual legacy de 23 secciones que nunca había tenido página propia aquí (solo se mencionaba de pasada en el resumen ejecutivo). También se integró en `15-redes-sociales.html` la parte de la antigua sección de uso de IA del legacy que no se solapaba con las reglas de agentes de IA del grupo.

No se integró del legacy:
- **S03 (Marcas que representamos)** — describía una arquitectura de marca anterior a la Constelación actual (trataba a Linex Loyalty como un par de Travel/Go/Trip en vez de la marca ancla de Tier 1); además, su contenido de categorías de producto y proveedores es catálogo comercial sujeto a cambio contractual, no un tema de identidad de marca. Superado, no se recupera.
- ~~**S10 (Paleta de color)**~~ — **sí se integró después**, como `03-paleta-color.html`. La razón original para dejarla fuera (los HEX ya estaban en `brand-tokens.json` y repetidos en `01-logotipo.html` y en el kit de prompt de `15-redes-sociales.html`) dejó de aplicar cuando se sumaron la proporción de uso propuesta y el CMYK de referencia, que no vivían en ningún otro lado.
- **S20 (Reglas para agentes) y S21 (Gobernanza y versiones)** — ya cubiertos a nivel de todo el grupo en `manual-linex-travel/S15_ReglasParaAgentesIA.dc.html` y `S16_GobernanzaYVersiones.dc.html` (que además ya cita explícitamente la razón social y RNT de Trip). Un manual de marca de Trip no necesita su propia versión paralela de esas reglas.

## Cómo usarlo

Es HTML/CSS/JS plano, sin runtime de Claude ni dependencias de build:

- Abre `index.html` con doble clic (`file://`) para verlo localmente.
- O sube toda la carpeta tal cual a cualquier hosting estático (GitHub Pages, servidor interno, etc.) para compartir un link.

## Cómo agregar una sección

El menú lateral y el pager anterior/siguiente son HTML estático en cada página (así el manual funciona con doble clic, sin JS y al imprimirse), pero **no se editan a mano**: se declaran una sola vez en `tools/sync-nav.ps1`.

1. Crea el `.html` copiando cualquier página existente.
2. Agrega una línea a `$Pages` en `tools/sync-nav.ps1`, en el orden de lectura y con el `Group` (bloque) al que pertenece.
3. Corre `pwsh -File tools/sync-nav.ps1` (o `-DryRun` para ver antes qué cambiaría).

Eso sincroniza el sidebar, el `aria-current`, el pager y el favicon de todas las páginas. El script es idempotente y **no viaja en el entregable**: quien reciba la carpeta solo necesita los `.html` y `assets/`.

La numeración va corrida de 00 a 15 y coincide con el nombre del archivo. El viejo parche de sufijos (`06b`, `06c`) desapareció en la reorganización de septiembre 2026: si hay que intercalar una sección, se renumera de verdad con el script y se reescriben los enlaces, no se cuelga una letra.

## Mantenimiento

Este manual y las secciones 21/21.1–21.10 de `manual-linex-travel/site/` deben mantenerse en sincronía de contenido (misma sustancia, solo cambia numeración y que este no tiene nav/links de vuelta al grupo). Si el dueño de marca aprueba un cambio de contenido para Linex Trip, actualiza ambos lugares en el mismo cambio, y actualiza también `brand-system/brand-tokens.json` si el cambio fija o modifica un token (color, tipografía, estado).
