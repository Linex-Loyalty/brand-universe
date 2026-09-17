# Sistema de marca · Constelación Linex

Manuales de marca del grupo Linex y el sistema que los mantiene coherentes.

**Abre `index.html` con doble clic** para entrar al mapa de la constelación y
desde ahí a cualquier manual. No necesita servidor, ni instalación, ni
conexión.

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
| `docs/superpowers/` | Specs, planes y el registro de pruebas |

## La regla que gobierna todo

**Nada se inventa.** Si una marca no tiene logo, color o voz documentada,
aparece como pendiente. Nunca se aproxima ni se rellena.

*Un pendiente rotulado se resuelve; uno disimulado se hereda.*

## Cómo se cambia algo

Todo sale de `brand-tokens.json`. Se edita ahí y se regenera:

```bash
node tools/verificar-tokens.js      # valida que el dato no mienta
node tools/sync-constelacion.js     # regenera index.html
node --test tools/*.test.js         # corre las 42 pruebas
```

El verificador **recalcula cada contraste** que el JSON afirma y comprueba
contra el disco cada ruta. Si un número no se sostiene, falla — que es
exactamente lo que pasó la primera vez que corrió.

## Cómo se agrega un manual

Un manual nuevo no diseña nada: hereda los 82 componentes CSS que Trip y Go ya
comparten, y las quince secciones en tres bloques que son decisión escrita del
administrador de marca. El detalle está en
`.claude/skills/linex-brand/references/construir-manual.md`.

Antes de empezar, mira qué tiene la marca en el JSON. Si no tiene color, ni
voz, ni logo, el manual saldrá con quince secciones diciendo "pendiente" — y
entonces lo que hace falta es una sesión de marca, no un sitio.

## Estado

Dos manuales vigentes de ocho marcas.

**El pendiente más caro** es el logotipo de Linex Go: existe 1 de las 15 piezas
que su manual define, no es vectorial, y la falta de la versión negativa
**bloquea toda la papelería**.

**El más silencioso** es que Linex Loyalty tiene un acento —el Verde
`#C5F04A`— que solo funciona sobre fondo oscuro, y no tiene base oscura
definida. Un acento así no tiene medio sistema: tiene medio sistema.

**Y una deuda pendiente en Trip:** el cambio de color del 14 de septiembre de
2026 (Índigo → Azul Trip) no recalculó tres contrastes de su manual, que
siguen medidos contra el color anterior. Ninguna regla se rompe —los tres
siguen por encima de 7:1— pero los números están viejos. `brand-tokens.json`
trae los reales y lo registra en `marcas.linex-trip.cambio_color`.
