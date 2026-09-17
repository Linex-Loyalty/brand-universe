# logos-oficiales/ — logos reales por marca

Esta carpeta es la **única fuente de logos reales** de la constelación Linex. Existe para que ningún manual, sitio o pieza tenga que inventar, aproximar o recrear un logotipo — si el archivo no está aquí, esa marca no tiene logo todavía y así debe decirse (igual que un `accent_color_hex: null` en `brand-tokens.json`).

## Cómo soltar los archivos

Una carpeta por marca, usando el mismo `id` que `brand-tokens.json` (`linex-loyalty`, `linex-travel`, `linex-go`, `linex-trip`, `linex-marketplace`, `linex-rewards`). Dentro de cada una, formato **SVG** (vectorial, para que escale sin perder calidad) con estos nombres cuando existan — no hace falta tener todos, solo los que la marca realmente tenga producidos:

| Archivo | Qué es |
|---|---|
| `principal.svg` | Versión principal / isologo (símbolo + texto juntos) |
| `horizontal.svg` | Lockup horizontal |
| `vertical.svg` | Lockup vertical / apilado |
| `isotipo.svg` | Solo el símbolo, sin texto |
| `wordmark.svg` | Solo el texto/nombre, sin símbolo |
| `mono-blanco.svg` | Versión monocromática blanca (para fondos oscuros) |
| `mono-negro.svg` | Versión monocromática negra (para fondos claros) |

Cualquier otro archivo que tengas (variantes con tagline, versión de app icon, etc.) puedes agregarlo con un nombre descriptivo — no es necesario ceñirse solo a esta lista.

## Regla que aplica siempre

**Nunca se genera ni aproxima un logotipo que no esté en esta carpeta.** Si a una marca le falta un archivo (p. ej. no hay `mono-blanco.svg` de Linex Go), el manual y cualquier pieza deben decirlo como pendiente ("versión monocromática aún no recibida") en vez de dibujar una interpretación. Esto aplica al agente `brand-designer` y a cualquiera que construya sobre `brand-system/`.

## Estado actual

| Marca | Estado |
|---|---|
| `linex-trip` | `logo-LinexTrip.svg` recibido (principal) |
| `linex-loyalty` | Pendiente — carpeta vacía |
| `linex-travel` | Pendiente — carpeta vacía |
| `linex-go` | Pendiente — carpeta vacía |
| `linex-marketplace` | Pendiente — carpeta vacía |
| `linex-rewards` | Pendiente — carpeta vacía |

Actualiza esta tabla cada vez que llegue un archivo nuevo — es lo que le permite al skill `/linex-brand` y al agente `brand-designer` saber qué está disponible sin tener que listar la carpeta cada vez.
