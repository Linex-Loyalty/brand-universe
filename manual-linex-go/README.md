# Manual de Marca · Linex Go

Sitio estático, sin dependencias ni build. Se abre con doble clic en `index.html`.

## Qué es

Las 15 secciones del "Sistema Operativo de Marca" de Linex Go, reconstruidas desde
`source-docs/legacy-manuals/Manual de marca Linex Go oficial.pdf` (v1.0, 89 páginas).

**El orden no es el del PDF.** El manual oficial abre por lo conceptual; aquí abre por
lo visual, que es lo que más se consulta — la misma decisión que se tomó en el manual de
Linex Trip. Cada sección anota de qué sección del PDF viene.

| Bloque | Secciones |
|---|---|
| A · Identidad visual | 01 a 07 |
| B · Quién es y cómo habla | 08 a 12 |
| C · Cómo se aplica | 13 a 15 |

## Cómo se mantiene

- **`tools/sync-nav.js`** tiene la lista de las 15 secciones una sola vez y genera el
  menú lateral, el paginador y el índice de la portada. Si se renombra o se agrega una
  sección, se edita ahí y se corre: `node tools/sync-nav.js`
- **`tools/plantilla.js`** es el armazón común de las páginas.
- **`tools/sync-aliados.js`** dibuja la franja de "Representamos a" de la sección 01 a
  partir de los archivos reales. Los logos se dejan en `../assets/logos-aliados/` y el
  script los copia al manual y redibuja la franja: `node tools/sync-aliados.js`. Las
  marcas que todavía no tienen archivo salen con su nombre en texto y marcadas como
  pendientes, para que se vea qué falta en vez de disimularlo.
- **`assets/style.css`** tiene la paleta en el `:root`. Los colores viven ahí, no en las
  páginas — salvo las muestras de paleta y los HEX escritos, que son el dato en sí.

## Lo que se corrigió del manual v1.0

1. **Los CTA usaban blanco sobre coral (2.69:1)** mientras la propia sección de color
   decía que "navy sobre coral es la única combinación accesible del coral". Se resolvió
   a favor de la regla escrita.
2. **El botón coral lleva filete navy de 2px**: el coral contra el blanco frío da 2.55:1
   y no define un contorno perceptible (WCAG 1.4.11 pide 3:1).
3. **El resumen para agentes** remitía a números de sección del orden viejo.

## Lo que sigue pendiente

- **El logotipo.** Hay una de las quince piezas que define el manual, y no es vectorial:
  es un PNG de 2645×462 px dentro de un `.svg`. Falta la versión negativa, sin la cual el
  logo no puede ir sobre navy — que es fondo permitido.
- Responsable y fecha de aprobación del manual · plazo de la transición UltraGo ·
  nombre corporativo legal · las seis fichas de audiencia · la lista de claims
  autorizados · la de términos prohibidos · el texto legal por tipo de pieza.

Todos están rotulados en coral dentro de la sección que les corresponde, como pide el
propio manual.
