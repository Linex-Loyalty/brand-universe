# Marcas de la familia Linex Travel

Fuente de verdad de los datos: `assets/brand/brands/<id>.json`. Este archivo explica el
criterio; si algún hex o ratio no coincide, manda el JSON (y `--report` lo muestra resuelto).

## Cómo funciona el override

Linex Travel es la marca madre y usa Nomad DS sin cambios. Linex Go y Linex Trip **extienden**
Linex Travel: heredan tipografía, espaciado, radios, sombras, iconos, componentes y estados
de feedback (success / error / warning), y pisan solo color.

El override se aplica sobre `tokens.json` antes de resolver alias. Por eso basta con pisar
`semantics.color.surface.primary.default` para que botones, tabs, sliders y todo lo que
apunte a ese semántico cambien juntos. Solo se pisan tokens de componente cuando el DS
asume algo que la marca contradice — el caso central: en Nomad el texto del botón primario es
blanco; en Go y Trip es el color primario oscuro.

Qué **no** cambia por marca: `success`, `error`, `warning`, grises neutrales de borde y los
estados disabled. Si una pieza pide "error en coral", decir que coral es acción y que el
error sigue siendo el rojo del DS.

---

## Linex Go

| Color | Hex | Rol | % pieza | Variable |
|---|---|---|---|---|
| Navy | #15172F | Primario | 32 | `--b-color-navy` |
| Blue | #5B5CFF | Acento | 20 | `--b-color-blue` |
| Cool white | #F8F9FC | Respiro | 18 | `--b-color-cool-white` |
| Coral | #FF725E | Acción | 12 | `--b-color-coral` |
| Warm | #F3F0E9 | Soporte | 10 | `--b-color-warm` |
| Light coral | #FFE3DD | Superficie | 8 | `--b-color-light-coral` |

Paleta decidida por el dueño de marca el 2026-09-25. Reemplaza a la anterior: Petroleum
`#012D33`, Light petroleum `#004751` y Sand `#E6D5B8` salieron del sistema (ya no existen
`--b-color-petroleum`, `--b-color-light-petroleum` ni `--b-color-sand`). El navy y el blue
son los de Nomad DS / Linex Travel: Go se distingue de su marca madre por el coral y el logo,
no por el oscuro.

**Reglas que no se negocian**

- **Navy nunca rellena un botón.** El CTA es coral con texto navy (6.54:1).
- **Blue nunca rellena un botón.** En Linex Travel `#5B5CFF` es el botón; en Go la acción es
  coral, y un botón azul leería como Travel.
- **Coral es acción, y solo acción:** botones, CTAs, links. Nunca como texto sobre claro
  (2.55:1) y nunca para resaltar un dato, un precio o un descuento.
- **Coral y blue nunca se tocan** (1.77:1).
- **Light coral solo como fondo** (alertas, cards, highlights). Como tinta sobre claro da
  1.15:1, y sobre navy se confunde con la acción.
- Texto principal sobre claro: navy (16.69:1). Secundario: blue, **solo sobre blanco
  (4.75:1) o cool white (4.51:1, al límite)**. Sobre warm (4.17:1) o navy (3.70:1) el blue
  no es tinta.
- Warm es la alternativa editorial a cool white: piezas que se sienten documento, no interfaz.
- Fondos permitidos para el logo: cool white, warm y navy (este último solo con la versión
  negativa); nunca coral ni blue. El logo sigue fuera de alcance (ver `brand.md`).

**Cómo queda el DS con `--brand linex-go`**

| Token | Resuelve a |
|---|---|
| `--s-color-surface-primary-default` / `--c-button-primary-background-default` | Coral |
| `--c-button-primary-text-default` | Navy |
| `--s-color-surface-primary-subtle(st)` | Light coral |
| `--s-color-surface-secondary-default` | Navy (superficie oscura) |
| `--s-color-surface-secondary-strong` | Blue (contenedor de ícono, con blanco encima) |
| `--s-color-background-default` / `--s-color-surface-base-default` | Cool white |
| `--s-color-background-subtle` | Warm |
| `--s-color-text-neutral-strong(er)`, `--s-color-text-primary-default` | Navy |
| `--s-color-text-neutral-muted` | Blue (sobre warm, usar navy: 4.17:1 no alcanza) |
| `--s-color-text-link-default` | Navy (subrayado; coral no pasa como texto) |

Sobre superficie oscura (navy): titular en cool white, ícono en círculo blue con el ícono en
blanco, acción en coral con texto navy. El blue no va como texto sobre navy (3.70:1).

---

## Linex Trip

| Color | Hex | Rol | % pieza | Variable |
|---|---|---|---|---|
| Trip Blue | #00145A | Primario | 30 | `--b-color-trip-blue` |
| Action Sky Blue | #00B5F5 | Acción / CTA | 21 | `--b-color-sky-blue` |
| White | #FFFFFF | Base y respiro | 19 | `--b-color-white` |
| Sky Blue Tint | #E6F8FE | Respiro | 10 | `--b-color-sky-tint` |
| Linex Lavender | #DDE1FF | Soporte | 8 | `--b-color-lavender` |
| Linex Black | #080808 | Reserva | 8 | `--b-color-black` |
| Yellow | #ECE200 | Detalle | 4 | `--b-color-yellow` |

**Reglas que no se negocian**

- **Trip Blue nunca rellena un botón.** El CTA es sky blue con texto Trip Blue (7.16:1).
- **Sky Blue es todo lo que se toca** — botones, CTAs, links, en cualquier canal — como
  superficie. Nunca como texto sobre claro (2.35:1 sobre blanco).
- **Los precios no van en sky blue:** se leen, no se tocan. Van en Trip Blue.
- **Yellow solo sobre Trip Blue** (12.38:1): eyebrows, letra chica, separadores. Sobre
  blanco da 1.36:1. Nunca en titulares ni botones. Gana estatus porque aparece poco.
- **Lavender nunca como texto:** falla contraste incluso sobre blanco. Es fondo decorativo
  y uno de los tres fondos permitidos para el logo.
- **Linex Black casi no se usa:** ni logo, ni botones, ni fondos. Reserva para impresión a
  una tinta.
- Sobre Trip Blue: titular en blanco, detalle en yellow, acción en sky blue.
- Sky Blue Tint: fondo de pills, chips de categoría y cards suaves.

**Cómo queda el DS con `--brand linex-trip`**

| Token | Resuelve a |
|---|---|
| `--s-color-surface-primary-default` / `--c-button-primary-background-default` | Sky Blue |
| `--c-button-primary-text-default` | Trip Blue |
| `--s-color-surface-primary-subtle(st)` | Sky Blue Tint |
| `--s-color-surface-primary-muted`, `--s-color-surface-secondary-subtle` | Lavender |
| `--s-color-surface-secondary-default` | Trip Blue (superficie oscura) |
| `--s-color-background-subtle` | Sky Blue Tint |
| `--s-color-text-neutral-strong(er)`, `--s-color-text-primary-*` | Trip Blue |
| `--s-color-text-link-default` | Trip Blue (subrayado; sky blue no pasa como texto) |

El manual de Trip no define un color de texto secundario: `--s-color-text-neutral-default` y
`-muted` siguen en los grises de Nomad. Si marca define uno, va en `linex-trip.json`.

---

## Lo que el manual no define (y cómo se resolvió)

- **Hover / pressed de la acción.** Se derivan aclarando la acción (15 % y 25 % hacia el
  blanco de la marca). Oscurecer bajaría el contraste con el texto oscuro por debajo de
  4.5:1. El script los marca como derivados: decirlo en la entrega.
- **Tipografía de Go y Trip.** Se asume Figtree, heredada de Linex Travel. Si las submarcas
  tienen tipografía propia, se agrega `typography` en su JSON.
- **Bordes de componente con la acción.** Sky blue y coral sobre claro no llegan a 3:1 como
  indicador de UI. En inputs, chips o toggles seleccionados, el borde va en el primario.

## Agregar o actualizar una marca

1. Copiar `assets/brand/brands/linex-go.json` como plantilla.
2. `palette`: nombre, hex, rol, % y uso de cada color, tal como dice el manual.
3. `overrides`: ruta de token → clave de paleta, hex, o `{"mix": [a, b, cantidad]}` para
   derivados.
4. Correr `build_css_vars.py --brand <id>` y revisar stderr: overrides que apuntan a tokens
   inexistentes y valores derivados.
5. Buscar fugas del primario de Nomad: ningún `--s-`/`--c-` debería resolver a un hex de
   `primitives.color.azulVioleta` (el comando está en el README).
6. `--report` para revisar contrastes y volcar las reglas nuevas en este archivo.
