# Fundación del sistema de marca Linex — diseño

**Fecha:** 16 de septiembre de 2026
**Estado:** aprobado, listo para plan de implementación
**Fase:** 1 de 3 (Fundación → Sitio Constelación → Manuales faltantes)

---

## 1 · El problema

La carpeta de marca tiene hoy dos manuales terminados y buenos —Linex Trip y Linex Go—, los logos que existen, y el PDF del Modelo de Constelación que define la arquitectura de todo el grupo. Lo que no tiene es la capa que los conecta.

Los propios README lo dan por sentado: ambos hablan de un `brand-tokens.json`, de un skill `/linex-brand` y de un agente `brand-designer`. Ninguno de los tres existe. Sin ellos:

- Los tokens de color viven duplicados en el `:root` de dos hojas de estilo, sin una fuente que mande sobre ambas. El cambio de Índigo a Azul Trip de septiembre tuvo que aplicarse a mano en CSS, favicon y (un) JSON que hoy no está.
- No hay forma de responder "¿qué le falta a Linex Marketplace para tener manual?" sin abrir carpetas y leer README.
- Los cuatro manuales que faltan se construirían a mano, y divergirían del esqueleto que Trip y Go ya comparten.

## 2 · Qué construimos

Tres piezas, en esta carpeta, versionadas en git:

```
brand-tokens.json                      fuente única de verdad
.claude/
├── skills/linex-brand/
│   ├── SKILL.md                       router corto + cuándo usar qué
│   └── references/
│       ├── oficio-marca.md            CAPA 1 · oficio genérico
│       ├── constelacion.md            CAPA 2 · el modelo Linex
│       ├── construir-manual.md        trabajo 1
│       ├── auditar-pieza.md           trabajo 2
│       └── escribir-voz.md            trabajo 3
└── agents/brand-designer.md           el ejecutor
```

### Por qué un skill con references y no tres skills

Las reglas duras (contraste, el coral solo para acción, el amarillo solo sobre Azul Trip, Geist como tipografía bloqueada) aplican a los tres trabajos. Con tres skills separados esas reglas se duplican en tres archivos y el próximo cambio de color solo se aplica en los que alguien recuerde. Con un skill y references, cada regla se escribe una vez.

El `SKILL.md` se mantiene corto a propósito: dice qué es la constelación, qué trabajos existen y a qué reference ir. Solo se carga el reference del trabajo que toca.

### Por qué skill *y* agente

Son dos tamaños de trabajo distintos:

| | Skill `/linex-brand` | Agente `brand-designer` |
|---|---|---|
| Para | Preguntas y revisiones cortas | Trabajos largos que producen archivos |
| Ejemplo | "¿este coral cumple sobre blanco frío?" | "construye el manual de Marketplace" |
| Corre | En la conversación | Aparte; devuelve el resultado, no el volcado |

Regla práctica: **si produce archivos, va al agente; si produce una respuesta, va al skill.**

El skill también se activa solo, por su descripción, cuando la conversación es de colores, logos, manuales o copy de Linex.

---

## 3 · `brand-tokens.json`

La pieza crítica. Es lo que impide que el agente invente.

### Marcas que cubre

Del PDF del Modelo de Constelación, con el `id` que ya usan las carpetas de `Logos/logos-oficiales/`:

| `id` | Tier | Dominio | Genio | Manual |
|---|---|---|---|---|
| `linex-capital` | 1 · El fondo | linexcapital.com | — | — |
| `linex-loyalty` | 2 · Puerto espacial | linex-loyalty.com | Ixar | — |
| `linex-travel` | 3 · Estrella | linextravel.com | pendiente de nombre | — |
| `linex-go` | 3 · Sub-marca B2B de Travel | linexgo.com | — | `manual-linex-go/` |
| `linex-trip` | 3 · Sub-marca B2C de Travel | linextrip.com | — | `manual-linex-trip/` |
| `linex-marketplace` | 3 · Estrella | linexmarketplace.com | pendiente de nombre | — |
| `linex-rewards` | 3 · Estrella | linexrewards.com | Milton | — |
| `linex-school` | 3 · Estrella en expansión | linexschool.com | — | — |

`linex-capital` y `linex-school` entran en el JSON porque el modelo los define, aunque no tengan carpeta de logos. Marcados `pendiente`.

### Forma de cada entrada

```
id, nombre, tier, dominio, genio, estado, padre
atrae / filtra        el posicionamiento del PDF: a quién habla, a quién saca
color[]               cada color con hex, rgb, cmyk, rol, proporción y reglas duras
tipografia{}          los dos registros: operativo y digital (ver abajo)
iconografia{}         librería y estilo — difiere por marca, no es de grupo
radios[]              escala de esquinas — difiere por marca, no es de grupo
logos{}               solo archivos que existen; lo ausente es null
voz{}                 principios, claim, vocabulario sí/no
legal{}               operador, RNT, y si admite ™/®
manual                ruta, o null
```

**`estado` toma cuatro valores**, no tres. A los ya previstos se suma el que los dos contextos usan de verdad: `confirmed_pending_trademark` — la marca está confirmada pero el registro sigue pendiente. Trip y Go están ahí, y eso arrastra una regla dura: **sin ™ ni ® mientras el registro esté pendiente**, porque hoy sería falso.

`estado` toma estos valores: `vigente` · `confirmed_pending_trademark` · `en-construccion` · `pendiente`.

### Tipografía — corrección al diseño original

La primera versión de este spec decía *"Geist — locked · central, igual para todas"*. **Era falso**, y los dos contextos de marca lo desmienten. La regla real, confirmada por el dueño de marca el 16 de septiembre de 2026:

| Registro | Fuentes | Dónde manda |
|---|---|---|
| **Operativo** | Segoe UI (títulos) + Calibri (cuerpo) | Cotizaciones, correo, Contact Center, Office |
| **Digital** | Geist | Sitios web y producto |

Respaldo: Arial o Helvetica. Nunca se sustituye por una tipografía con personalidad distinta.

**Lo `locked` es la pareja de registros, no una sola fuente.** La restricción que eligió Segoe UI y Calibri es concreta: las agencias producen cotizaciones todos los días y la marca tiene que verse consistente en sus manos **sin que instalen nada**.

Esto resuelve además el pendiente que el contexto de Go tenía abierto: Geist sí aplica a Go, en web y producto, aunque su manual v1.0 no la mencione.

**Regla de oro, común a las dos marcas:** Segoe UI manda en lo que se ve, Calibri sostiene lo que se lee, Geist viste el sitio y el producto. Nunca al revés.

### Las dos reglas que el JSON hace cumplir

**1. `null` no es un hueco que rellenar.** Si `logos.mono_blanco` es `null`, el manual escribe "versión monocromática aún no recibida". Nunca se dibuja una interpretación. Esto ya está escrito en `Logos/logos-oficiales/README.md`; el JSON lo vuelve verificable.

**2. Un token con regla dura no existe sin ella.** El Amarillo `#ECE200` no se guarda sin `solo_sobre: "#00145A"` y sin su medición de 1.36:1 sobre blanco. Un color sin su restricción es una invitación a usarlo mal.

### De dónde sale el dato

**Este JSON es una reconstrucción, no un archivo nuevo.** Existió un `brand-system/brand-tokens.json` —los dos contextos de marca dicen en su primera línea que se compilaron desde él— pero se perdió. La fuente primaria para rehacerlo son esos dos contextos, que traen prácticamente todo: los siete colores de cada marca con HEX, RGB, CMYK y proporción, las reglas duras redactadas, los estados legales, la voz y el vocabulario.

Los manuales HTML y su CSS quedan como fuente de contraste: si un dato difiere, **manda el manual**, que es lo que los propios contextos establecen sobre sí mismos.

Dos contrastes documentados se verificaron contra el cálculo WCAG antes de aceptar la fuente:

- Blanco sobre Coral `#FF725E` → 2.69:1, coincide con el README de Go
- Petróleo `#012D33` sobre Coral → 5.49:1, coincide con el comentario del CSS

Las otras seis marcas entran en `pendiente`, con `null` en todo lo no decidido.

**Excepción, fijada el 16 de septiembre de 2026 por el dueño de marca:** el acento de Linex Loyalty es el **Verde `#C5F04A`**. Sustituye al Dorado `#C99A3B` que el README de Trip registraba como *candidato*; ese dorado queda superado y no entra al JSON. Loyalty sigue `pendiente` en todo lo demás — no tiene base oscura, paleta completa, nombre de color, logo, voz ni manual.

El token nace con su regla dura, como exige la regla 2:

| Fondo | Contraste con `#C5F04A` |
|---|---|
| Blanco | **1.32:1** — desaparece |
| Negro | 15.20:1 |
| Navy tipo `#00145A` | 12.91:1 |

Necesita fondo oscuro, y Loyalty todavía no tiene uno definido. Fijar esa base es el siguiente dato que le falta a la marca.

---

## 4 · Los tres trabajos

### Hallazgo que los ancla

La columna vertebral de 15 secciones ya está probada dos veces. Trip y Go coinciden en 14 de 15, en el mismo orden y con los mismos nombres de archivo. Solo varía el slot 02 — `02-propuestas-logo` en Trip, `02-estado-logotipo` en Go.

Eso no es coincidencia: es un esqueleto canónico con una ranura libre. El agente lo hereda y adapta el 02; no inventa una estructura por marca.

| # | Sección | Bloque |
|---|---|---|
| 00 | Resumen ejecutivo (`index.html`) | Portada |
| 01 | Logotipo | A · Identidad visual |
| 02 | *ranura libre* — estado o propuestas de logo | A |
| 03 | Paleta de color | A |
| 04 | Tipografía | A |
| 05 | Iconografía y canal | A |
| 06 | Sistema gráfico y fotografía | A |
| 07 | Accesibilidad | A |
| 08 | Arquitectura de marca | B · Quién es y cómo habla |
| 09 | Audiencias | B |
| 10 | Propuesta de valor y claims | B |
| 11 | Voz y tono | B |
| 12 | Vocabulario | B |
| 13 | Promociones y CTA | C · Cómo se aplica |
| 14 | Entregables | C |
| 15 | Redes sociales | C |

El orden es de **referencia, no de inducción**: lo visual primero porque es lo que la gente viene a buscar. La inducción la cubre entera la portada. Decisión heredada de Trip y confirmada en Go.

### Trabajo 1 · Construir manuales

Contrato que hereda toda estrella nueva:

- **Sin build, sin dependencias, sin runtime.** Doble clic en `index.html` y funciona en `file://`. Si no abre con doble clic, está mal hecho.
- **Autocontenido.** Cada carpeta lleva su copia de `style.css`, `nav.js` y sus assets. Cero referencias a `../`. Es lo que permite mandar una carpeta suelta a un proveedor sin entregar todo el grupo.
- **Los tokens viven en `:root`**, no en las páginas. Única excepción: las muestras de paleta y los HEX escritos, donde el color *es* el dato.
- **La navegación no se edita a mano.** Se declara una vez en `tools/sync-nav.js` y el script regenera sidebar, `aria-current`, paginador, favicon e índice de portada en las 16 páginas. Idempotente, y no viaja en el entregable.
- **Numeración corrida 00–15**, igual al nombre del archivo. Si hay que intercalar, se renumera de verdad; nada de sufijos `06b`.
- **Lo que falta se rotula.** Go marca sus pendientes en coral dentro de la sección que les toca. Mismo comportamiento: si el JSON dice `null`, la página dice "pendiente". No se salta la sección ni se rellena.

**Divergencia resuelta.** Trip sincroniza con `sync-nav.ps1` (PowerShell), Go con `sync-nav.js` + `plantilla.js` + `sync-aliados.js` (Node). Los manuales nuevos usan **la de Go**: es la más completa y Node corre igual en Windows, Mac y CI. Trip conserva su `.ps1` sin cambios — no se toca en esta fase.

### Trabajo 2 · Auditar piezas

Entrada: un HTML, una imagen, un HEX o un texto. Salida: veredicto regla por regla.

| Qué revisa | Contra qué |
|---|---|
| Contraste | **Calculado**, no estimado. WCAG AA/AAA con el ratio escrito |
| Reglas duras de color | Coral solo acción · Amarillo solo sobre Azul Trip · Arena solo sobre Petróleo |
| Logos | Que el archivo exista en `logos-oficiales/`. Zona de seguridad. Aliados en su zona y **menores que Linex Go**, jamás recoloreados ni reproporcionados |
| Tipografía | El registro correcto para el canal: Segoe UI + Calibri en Office, Geist en web y producto |
| Nombre | "Linex Trip" con espacio. El "LinexTrip" compacto de las piezas viejas está superado |
| Vocabulario | La tabla sí decir / no decir de la sección 12 de esa marca |

**Cada hallazgo cita su fuente.** Nunca "esto se ve mal" — siempre "viola X, documentado en `manual-linex-go/01-logotipo.html`".

**Tres veredictos, no dos:** cumple ✓, viola ✗, y **sin regla documentada ?**. Decir "no hay regla para esto todavía" es información útil; fingir que sí la hay es el fallo que este sistema existe para evitar.

### Trabajo 3 · Escribir con voz de marca

Solo escribe con la voz de una marca que **tenga voz documentada**. Hoy son dos: Trip (claro, cercano, confiable, inspirador) y Go. Para las otras seis se niega y dice qué falta.

- **Los claims tienen estado.** "Viaja Inteligente" está vigente en Trip; los secundarios están *pendientes de aprobación* y no se usan como si ya lo estuvieran.
- **Lo que escribe pasa por el Trabajo 2 antes de entregarse.** El copy sale ya auditado contra su propia marca.

### La regla que comparten los tres

**Nunca inventa un activo de marca.** No dibuja un logo que no está en `logos-oficiales/`, no fija un HEX que nadie aprobó, no redacta una voz que no está documentada. Cuando falta algo, lo nombra como falta.

---

## 5 · Las dos capas

Separadas en dos archivos, para que la de abajo sirva fuera de Linex:

**`oficio-marca.md` — capa 1, genérica.** Jerarquía tipográfica, cálculo de contraste WCAG, sistemas de color y proporción de uso, arquitectura de marca (masterbrand / endorsed / house of brands), voz y tono, convivencia con marcas de terceros. No menciona Linex.

**`constelacion.md` — capa 2, Linex.** Los 3 tiers y su lógica, el Star Launch Kit con su división `locked · central` vs `free · per star`, los genios y qué construye cada uno, el posicionamiento atrae/filtra por sitio, y la gobernanza: qué decide el centro y qué decide cada estrella.

De lo `locked` del Star Launch Kit sale la parte no negociable del sistema: naming (incluidas sub-marcas), la pareja de registros tipográficos, la grilla, el Group Bar con su copy fijo `Part of Linex Loyalty` y el patrón de leads/CRM. De lo `free` sale lo que el agente **no** debe imponer: el color de acento, el matiz de tono, el presupuesto, la profundidad del sitio, el contenido, las campañas y el SEO.

### Las cuatro reglas que dos manuales independientes confirman

Trip y Go llegaron a lo mismo por separado, así que el agente las trata como regla de grupo con confianza:

1. **Regla de acción** — el acento solo pinta lo que se toca; nunca destaca un dato, y el color oscuro nunca rellena un botón.
2. **Filete de 1 px** — decidido el 2026-09-15 en ambas. El acento contra el papel no llega a los 3:1 de WCAG 1.4.11; el oscuro sí.
3. **Sin mayúscula sostenida** — en ningún canal. Se enfatiza con peso o tamaño.
4. **Frontera Trip / Go** — no se comparan, no se mezclan sus sistemas y nunca compiten por la misma palabra clave.

---

## 6 · Criterio de aceptación

Un skill de marca se prueba por lo que **se niega a hacer**. Estas seis pruebas se corren y se registra su salida antes de dar la fase por terminada:

| # | Se le pide | Tiene que pasar |
|---|---|---|
| 1 | "¿Qué amarillo uso para un botón de Trip?" | Se niega y cita el 1.36:1 sobre blanco. Si devuelve un HEX, falla |
| 2 | "Dame el logo mono blanco de Linex Go" | Dice que está pendiente. Si dibuja algo, falla |
| 3 | "Escribe un post para Linex Marketplace" | Dice que esa marca no tiene voz documentada y qué falta para tenerla |
| 4 | Contraste de blanco sobre coral | Devuelve **2.69:1** calculado. Si estima o redondea a ojo, falla |
| 5 | Pieza con el logo de Hertz más grande que Linex Go | Lo marca y cita la sección 01 del manual de Go |
| 6 | Correr `sync-nav.js` sobre Go sin cambiar nada | `git diff` vacío después de correrlo |

Las tres primeras son la prueba de fuego: **prefieren decir "falta" antes que producir algo plausible.**

La prueba 6 escribe sobre `manual-linex-go/`, que §7 declara fuera de alcance. No es contradicción: el punto de la prueba es justamente que **no cambie nada**. Se verifica con `git diff` sobre el árbol limpio, y si el script resultara no ser idempotente, se revierte con `git checkout` y se reporta como hallazgo — no se "arregla" el manual en esta fase.

---

## 7 · Fuera de alcance

Deliberadamente, en esta fase no se hace:

- **El sitio Constelación** — fase 2.
- **Los cuatro manuales faltantes** (Loyalty, Travel, Marketplace, Rewards) — fase 3.
- **Vigilancia de constelación** (detectar colisiones de color entre estrellas, auditar el Group Bar). Se evaluó y se dejó fuera.
- **Ningún cambio a `manual-linex-trip/` ni `manual-linex-go/`.** Se leen para extraer tokens; no se tocan. Lo que ya funciona se queda quieto.
- **Migrar Trip de PowerShell a Node.** Su `sync-nav.ps1` sigue como está.

---

## 8 · Riesgos conocidos

**El JSON puede desincronizarse del CSS.** `brand-tokens.json` nace como fuente de verdad, pero los `:root` de Trip y Go siguen siendo copias independientes — nada las genera desde el JSON. Mitigación en esta fase: el Trabajo 2 incluye un chequeo de que los HEX del JSON y los del CSS coincidan, para que la deriva se detecte en vez de acumularse. Generar el CSS desde el JSON es una decisión posterior, y toca archivos que aquí están fuera de alcance.

**El Amarillo de Trip y el Verde de Loyalty comparten luminosidad.** El README de Trip dejó anotado que el Amarillo `#ECE200` quedaba a 22 ΔE del Dorado candidato. Con el Verde `#C5F04A` ya fijado, la distancia sube a **ΔE 26 (CIE76)** — mejora, pero el número de arriba no es el problema:

- `#ECE200` → L\* 88.1
- `#C5F04A` → L\* 89.2

**Prácticamente la misma luminosidad.** Se comportan idéntico frente al contraste (los dos mueren sobre blanco, los dos brillan sobre oscuro) y a tamaño pequeño son fáciles de confundir. Dos estrellas vecinas con acentos que se distinguen solo por el tono, no por el valor.

El JSON lo registra como riesgo abierto. Resolverlo —o decidir que no importa, porque Trip y Loyalty rara vez aparecen juntos— es decisión del dueño de marca, no del sistema.

**El logotipo de Linex Go es un bloqueo de producción, no un pendiente más.** De las **quince piezas** que su propio manual define, existe **una** — y no es vectorial: es un PNG de 2645×462 px dentro de un `.svg`. Falta la versión negativa, sin la cual el logo no puede ir sobre petróleo, que es uno de los tres fondos permitidos. **Eso bloquea toda la papelería.** El JSON lo registra como `bloqueante`, no como `pendiente`.

**Íconos y radios divergen entre Trip y Go, en dimensiones que el modelo declara `locked`.**

| Dimensión | Linex Trip | Linex Go |
|---|---|---|
| Librería de íconos | Font Awesome Pro · Classic Regular | Set propio cerrado, dos estilos |
| Escala de radios | `6 / 12 / 16 / 24 / pill` | `12 / 20 / 28` |

El Star Launch Kit dice que la grilla es `locked · central`, y dos manuales vigentes no coinciden. Puede ser una decisión que nunca se escribió o puede ser deriva; el spec no lo resuelve. **El agente audita cada marca contra su propio manual** y registra la divergencia como riesgo abierto, en vez de elegir un ganador por su cuenta.

**Los aliados de Go están a medias.** 3 de 5 recibidos (Hertz, Dollar, Thrifty), y los tres son PNG monocromos de 31 px de alto: sirven para pantalla, no para impresión ni gran formato. Faltan Disney y Assistviaje.

**Los contextos de marca quedan desactualizados en un punto.** Ambos se compilaron el 16 de septiembre y el contexto de Trip todavía registra el Dorado `#C99A3B` como candidato de Loyalty. La decisión del Verde `#C5F04A` es posterior. Al reconstruir el JSON se corrige esa línea en el contexto.
