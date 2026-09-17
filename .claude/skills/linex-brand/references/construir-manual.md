# Trabajo 1 · Construir un manual de marca

## Antes de escribir una línea

Lee la entrada de la marca en `brand-tokens.json`. **Si `color` está vacío,
`voz` es `null` y todos los logos son `null`, el manual va a salir con quince
secciones diciendo "pendiente".**

Dilo antes de construirlo. Puede que lo que haga falta sea una sesión de
marca, no un sitio. Hoy están así Capital, Travel, Marketplace, Rewards y
School; Loyalty tiene un color y nada más.

## El esqueleto, que no se inventa

Quince secciones en tres bloques, más la portada. Es **decisión escrita del
administrador de marca del 2026-09-15**, citada en el comentario de
`manual-linex-go/tools/sync-nav.js`: las mismas secciones, en el mismo orden,
en todos los manuales del grupo, *"para que quien conoce un manual del grupo
sepa moverse en el otro sin volver a aprenderlo"*.

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
lo que la gente viene a buscar la mayoría de las veces que abre el manual. La
inducción la cubre entera la portada.

## El contrato técnico

Copia `manual-linex-go/` como base — es el que usa el sincronizador de Node.

1. **Sin build, sin dependencias, sin runtime.** Doble clic en `index.html` y
   funciona en `file://`. Si no abre así, está mal hecho.
2. **Autocontenido.** Copia propia de `assets/style.css`, `assets/nav.js` y
   los assets. **Cero referencias a `../`.** Es lo que permite mandar la
   carpeta suelta a un proveedor sin entregar todo el grupo.
3. **Los tokens viven en `:root`**, no en las páginas. Única excepción: las
   muestras de paleta y los HEX escritos, donde el color *es* el dato.
4. **Los 82 componentes CSS ya existen.** Trip y Go comparten toda la hoja
   salvo una clase (`.parte`, de Go). Un manual nuevo **no diseña
   componentes**: hereda los 82 y cambia su `:root`.
5. **La navegación no se edita a mano.** Se declara en `tools/sync-nav.js` y
   el script rellena tres marcadores en cada página:
   `<!--nav-->`, `<!--indice-->`, `<!--pager-->`. Reemplaza solo lo que hay
   entre marcadores, así que es **idempotente por construcción**.
6. **Numeración corrida 00–15**, igual al nombre del archivo. Si hay que
   intercalar, se renumera de verdad; nada de sufijos `06b`.

## Lo pendiente se rotula, no se salta

El sincronizador ya lo hace por ti, y con el mismo criterio que el JSON:

- Sección que aún no existe → **en gris y sin enlace** en el menú, no 404.
  *"Quien entra ve el mapa completo y sabe qué falta."*
- En el índice de la portada → marcada **"en curso"** en el color de acento.
- El paginador **la salta**: nunca lleva a una página que no está.

Aplica el mismo criterio dentro de cada página: si el JSON dice `null`, la
página lo dice. *"Versión monocromática aún no recibida"*, no un hueco.

## Cómo agregar una sección

1. Crea el `.html` copiando cualquier página existente (conserva los tres
   marcadores).
2. Agrega una línea a `BLOQUES` en `tools/sync-nav.js`, en el orden de lectura
   y con el bloque al que pertenece.
3. Corre `node tools/sync-nav.js` (o `--dry-run` para ver antes qué cambiaría).

`tools/plantilla.js` documenta el esqueleto de página —doctype, `<head>`,
skip-link, topbar, shell, sidebar, `main-inner`, `footer-meta`— pero **no lo
requiere nadie**: es referencia, no herramienta. Su comentario de cabecera
dice "las 23 secciones" y quedó viejo; hoy son 15.

**Ojo con `sync-nav.ps1` de Trip:** no es lo mismo. Trip **no tiene
marcadores** en ninguna de sus 16 páginas, así que los dos sincronizadores no
son intercambiables. Para un manual nuevo, siempre el de Go.

## Antes de dar por terminado

- [ ] Abre con doble clic, sin servidor
- [ ] Ninguna referencia a `../`
- [ ] `node tools/sync-nav.js` y después `git diff` vacío
- [ ] Todo `null` del JSON aparece rotulado como pendiente en su sección
- [ ] Los contrastes escritos se recalcularon con `tools/contraste.js`
- [ ] El nombre de la marca va con espacio en toda prosa
- [ ] `node tools/verificar-tokens.js` sin errores
