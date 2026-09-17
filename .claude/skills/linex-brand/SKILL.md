---
name: linex-brand
description: Use when working on Linex brand material — building or updating a brand manual, auditing a piece (color, contrast, logo usage, naming, vocabulary), or writing copy in a Linex brand voice. Covers the eight brands of the Linex constellation (Capital, Loyalty, Travel, Go, Trip, Marketplace, Rewards, School). Triggers on Linex brand colors, HEX values, logos, manuals, claims, CTA, tone of voice, WCAG contrast for Linex pieces.
---

# Sistema de marca de la constelación Linex

## La regla que manda sobre todas

**Nunca inventes un activo de marca.** No dibujes un logo que no esté en
`Logos/logos-oficiales/`, no fijes un HEX que nadie aprobó, no redactes una
voz que no esté documentada.

Cuando falte algo, **nómbralo como falta**. Decir "esta marca no tiene paleta
todavía" es información útil. Producir una paleta plausible es el fallo que
este sistema existe para evitar: se ve bien, nadie la cuestiona, y en seis
meses es la paleta.

## La fuente de verdad

`brand-tokens.json`, en la raíz del proyecto. Ocho marcas. **Léelo antes de
afirmar cualquier dato de marca** — nunca respondas de memoria.

- `null` significa pendiente, no "rellénalo tú".
- Todo color con restricción la trae en `regla`, con sus contrastes medidos.
- `estado: "confirmed_pending_trademark"` significa **sin ™ ni ®**.
- `pendientes` dice qué le falta a cada marca. Lo que empieza con
  `BLOQUEANTE` impide producir, no es un pendiente más.

Si un dato del JSON difiere de un manual, **manda el manual** — salvo los
contrastes, que se recalculan.

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

**El contraste se calcula, nunca se estima:**

```bash
node -e "const{contraste}=require('./tools/contraste.js');console.log(contraste('#FF725E','#FFFFFF').toFixed(2))"
```

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

**La regla de acción, común a todas las marcas.** El acento solo pinta lo que
se toca; nunca destaca un dato. El color oscuro nunca rellena un botón.

## Cómo se nombra cada marca

Siempre con espacio: **Linex Trip**, **Linex Go**. La forma compacta
(`linextrip`) existe solo donde el espacio no cabe: dominio, correo, handles,
hashtags, rutas y UI. Nunca `LinexGo`, `Linexgo`, `LINEXGO` ni `Linex-Go`.

## Antes de decir que terminaste

```bash
node --test tools/*.test.js     # todas las pruebas
node tools/verificar-tokens.js  # el JSON no miente
```

Pega la salida. No digas "listo" sin evidencia.
