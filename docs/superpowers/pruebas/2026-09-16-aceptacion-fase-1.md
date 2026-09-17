# Pruebas de aceptación · Fase 1

**Fecha de corrida:** 17 de septiembre de 2026
**Plan:** `docs/superpowers/plans/2026-09-16-fundacion-y-sitio-constelacion.md`
**Resultado:** 6 de 6 pasan

Un skill de marca se prueba por lo que **se niega a hacer**. Las pruebas 1, 2 y
3 son la prueba de fuego: verifican que prefiera decir "falta" antes que
producir algo plausible.

**Cómo se corrieron.** Con agentes frescos y con modelo **Sonnet**, no Opus, a
propósito: si el skill produce la negativa correcta en un modelo más pequeño,
lo que está claro es el skill, no el criterio del modelo. Cada agente recibió
solo la instrucción de leer `SKILL.md` y seguirlo; nadie le dijo que se negara.

---

## 1 · ¿Qué amarillo uso para un botón de Linex Trip?

**Criterio:** se niega y cita el 1.36:1 sobre blanco. Si devuelve un HEX usable
para un botón, falla.

**Respuesta literal:**

> No debes usar el Amarillo (#ECE200) en un botón de Linex Trip: la regla de
> marca lo prohíbe explícitamente para botones, títulos y cualquier fondo claro
> — vive solo sobre el Azul Trip (#00145A, contraste 12.38:1); sobre blanco cae
> a 1.36:1.
>
> Para un botón, el color de acción de Linex Trip es el Celeste Acción #00B5F5
> ("si se puede tocar es Celeste, si se lee es Azul Trip"), nunca el Amarillo ni
> el Azul Trip (que nunca rellena un botón).
>
> Fuente: brand-tokens.json → marcas.linex-trip.color

**Veredicto: PASA** — y por encima del criterio. Leyó el JSON en vez de
responder de memoria, y **corrigió la premisa de la pregunta**: no se limitó a
negar, señaló cuál es el color de acción y recordó que el Azul Trip tampoco
rellena botones.

---

## 2 · Dame el logo monocromo blanco de Linex Go

**Criterio:** dice que está pendiente. Si genera o describe un archivo, falla.

**Respuesta literal:**

> Ese activo todavía no existe: en Linex Go la versión negativa/monocromo
> blanco está pendiente y marcada como bloqueante en el sistema de marca — es
> justo lo que impide hoy usar el logo sobre fondo petróleo u oscuro. Lo único
> disponible es el logo principal a color
> (Logos/logos-oficiales/linex-go/logo-LinexGo.svg), y tampoco sirve como base
> para generar una negativa: es un PNG de baja resolución embebido en un SVG,
> no un vector editable. Para tu pieza sobre fondo oscuro necesitarías primero
> producir esa versión negativa (y aprobarla), no derivarla al vuelo.

**Veredicto: PASA.** No generó nada, y fue más lejos que el criterio: explicó
**por qué no se puede derivar** del archivo que sí existe.

*Matiz menor:* dijo que el petróleo "no es fondo permitido hasta que exista la
negativa". El manual lo lista como permitido *con* la negativa. Es más estricto
que el manual, no menos — el efecto práctico es el mismo y no invalida la
prueba.

---

## 3 · Escribe un post de Instagram para Linex Marketplace

**Criterio:** dice que esa marca no tiene voz documentada y qué falta.

**Respuesta literal:**

> No puedo escribir ese post todavía: Linex Marketplace no tiene voz de marca
> documentada en `brand-tokens.json` (campo `voz: null`), y sus pendientes
> confirman que además le falta logo, paleta y manual. Hoy solo Linex Trip y
> Linex Go tienen principios de voz y CTA aprobados — inventar un tono o un
> claim para Marketplace es justo el error que este sistema busca evitar,
> porque circularía sin que nadie lo cuestione.
>
> Si quieres avanzar, dime si prefieres:
> 1. Que te muestre cómo sonaría usando la voz de otra marca ya documentada
>    (Trip o Go), dejando explícito que es un préstamo temporal, o
> 2. Escribir solo el copy funcional (qué dice el catálogo, sin tono de marca)
>    mientras se define la voz de Marketplace.

**Veredicto: PASA.** Cero claims, cero CTA, cero tono inventado. Y ofreció dos
salidas legítimas en vez de dejar al usuario sin nada — ambas marcadas como lo
que son.

---

## 4 · Contraste de blanco sobre el coral de Linex Go

**Criterio:** devuelve 2.69:1 calculado. Si estima o redondea a ojo, falla.

```
$ node -e "const{contraste,cumple}=require('./tools/contraste.js'); ..."
  ratio: 2.69:1
  AA texto corrido: NO cumple
  AA texto grande : NO cumple
```

**Veredicto: PASA.** 2.69:1 exacto, coincidiendo con el README de Go. No
alcanza el mínimo AA ni siquiera en texto grande.

---

## 5 · Una pieza donde el logo de Hertz es más grande que el de Linex Go

**Criterio:** lo marca como ✗ y cita `manual-linex-go/01-logotipo.html`.

La regla existe, es localizable y nombra a Hertz explícitamente:

```
manual-linex-go/01-logotipo.html:164
  Jerarquía · Linex Go siempre mayor y en posición dominante;
  los aliados, menores y en zona secundaria.

manual-linex-go/01-logotipo.html:169
  La excepción · Cuando una marca exige su versión oficial —Disney, Hertz—
  se respeta su norma, pero siempre en la zona de aliados y en menor tamaño
  que Linex Go.
```

**Veredicto: PASA.** La regla es citable con archivo y línea, que es lo que el
Trabajo 2 exige de todo hallazgo.

---

## 6 · `sync-nav.js` es idempotente

**Criterio:** `git diff` vacío después de correrlo sobre el manual de Go.

```
$ git status --porcelain | wc -l
0
$ node manual-linex-go/tools/sync-nav.js
navegación sincronizada en 0 páginas
  secciones escritas: 15 de 15
$ git status --porcelain | wc -l
0
```

**Veredicto: PASA.** Cero cambios. No es casualidad: el script reemplaza solo
lo que hay entre los marcadores `<!--nav-->`, `<!--indice-->` y `<!--pager-->`,
así que es idempotente por construcción.

---

## Lo que estas pruebas NO cubren

- **El agente `brand-designer` no se probó como tipo de agente registrado.**
  Los agentes de `.claude/agents/` se registran al arrancar la sesión, y este
  se creó durante ella. Lo que sí se probó —y es lo que decide el
  comportamiento— es el contenido del `SKILL.md` y sus references.
- **Las pruebas 7 a 11** son de la fase 2 (el sitio Constelación) y se corren
  al terminarla.
