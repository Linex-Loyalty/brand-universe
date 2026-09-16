# Contexto de marca · Linex Trip

Documento de contexto completo de **Linex Trip**, compilado el 2026-09-16 desde
`brand-system/brand-tokens.json` y el manual standalone `brand-system/manual-linex-trip/`
(15 secciones + portada).

No reemplaza al manual: es el resumen cargable de una sola vez, para briefing de un
diseñador, de una agencia externa o de un agente de IA. Si algo de aquí contradice al
manual, **manda el manual**.

> Este documento cubre **solo Linex Trip**. Linex Go razona su color, su voz y su
> sistema por separado — su contexto está en `brand-system/deliverables/linex-go/contexto-linex-go.md`.

---

## 1 · Quién es

| | |
|---|---|
| **Nombre** | Linex Trip (con espacio, siempre) |
| **Forma compacta** | `linextrip` — solo dominio, correo, handles, hashtags, rutas y UI |
| **Tier** | 3 — estrella |
| **Rol** | Sub-marca dentro de Linex Travel |
| **Función** | Reserva de viajes B2C. Reemplaza a DestinoJet |
| **Dominio** | linextrip.com |
| **Audiencia** | Viajero final (canal B2C) |
| **Estado** | `confirmed_pending_trademark` — confirmado, registro de marca pendiente |
| **Padre** | linex-travel |
| **Genio (asistente de cara al cliente)** | Sin asignar (`null`) |
| **Operador legal** | Strategic Points S.A.S. · RNT 59151 y 82366 · Medellín, Colombia |

**Propósito.** Que cualquier viajero pueda comparar, decidir y reservar su viaje en
minutos, con precios claros y acompañamiento real — sin depender de una agencia física
ni de intermediarios confusos.

**Visión.** Ser la forma más inteligente de viajar en Latinoamérica.

**Qué nunca será.** Una plataforma fría que solo vende y desaparece. No promete lo que
no cumple ni esconde condiciones en letra pequeña.

---

## 2 · Arquitectura y gobernanza

```
Linex Loyalty        Tier 2 · nave nodriza del grupo
  └─ Linex Travel    Tier 3 · la estrella de viaje
       ├─ Linex Go   B2B · agencias y operadores
       └─ Linex Trip B2C · viajero final
```

**Hereda del grupo** (no se negocia por campaña): sistema de marca y convención de
naming (incluidas sub-marcas), tipografía y grilla sin variación, el Group Bar y la
navegación cruzada, el patrón de lead/CRM compartido.

**Es propio de Trip** (decide la marca): su color de acento (Celeste #00B5F5) y su matiz
de tono, el contenido vertical / campañas / SEO, la profundidad de producto (sitio curado
vs. web-app), el presupuesto y el go-to-market de cada capacidad.

**Group Bar.** Franja superior obligatoria en todo sitio de estrella, con el copy
`Part of Linex Loyalty`, enlazando a las demás marcas. Va **encima** de la barra de
navegación propia, no dentro de ella. No se rediseña por marca ni se quita por campaña.
Sirve para dos cosas: respaldar a una marca joven con el peso del grupo, y enrutar al
visitante equivocado hacia la marca correcta.

### Frontera con Linex Go

| | Linex Trip | Linex Go |
|---|---|---|
| Atiende a | El viajero final, para sí o su familia | Agencias y operadores |
| Canal | B2C, precio a la vista, Contact Center propio | B2B, tarifas y herramientas de reventa |

- Llega una agencia a Trip → se enruta a Linex Go. No se le arma tarifa B2B.
- Llega un viajero a Go → se enruta a Linex Trip, por el Group Bar o por el asesor.
- **No se comparan entre sí** en copy ni campañas: compiten con el mercado, no entre ellas.
- **No se mezclan los sistemas**: Trip no usa el color ni el tono de Go, ni al revés.
  Comparten tipografía y grilla porque eso es del grupo; el acento es de cada una.
- En buscador: Trip rankea lo que busca un viajero ("vuelos a San Andrés"), Go lo que
  busca una agencia ("sistema para agencias de viajes"). Nunca la misma palabra clave.

---

## 3 · Escritura del nombre · DECISIÓN 2026-09-11 (dueño de la marca)

El nombre es **"Linex Trip", con espacio**. La forma compacta no es una segunda manera de
llamar a la marca: existe solo donde el espacio no cabe.

| Contexto | Forma | Ejemplo |
|---|---|---|
| Prosa, titulares, copy de campaña | Linex Trip | "Linex Trip es la agencia de viajes online del viajero final." |
| Portada, títulos, encabezados | Linex Trip | "Linex Trip · Manual de marca" |
| Documentos legales, contratos, facturación | Linex Trip | Junto a la razón social y el RNT |
| Logotipo | Pieza gráfica | "Linex" + "Trip" con su color y su respiro |
| Dominio, URLs, correo | linextrip | linextrip.com · camila@linextrip.com |
| Handles de redes | @linextrip | Instagram, Facebook, TikTok |
| Hashtags | #LinexTrip | Un hashtag no admite el espacio |
| UI de producto, rutas, archivos | linextrip / linex-trip | Rutas del sitio, clases CSS |
| En voz alta | Dos palabras | Nunca deletreado ni como sigla |

**Reglas que no dependen del contexto**

- No se traduce: el nombre es el mismo en cualquier idioma o mercado.
- **"Trip" a secas es conversación interna** y de manual. Nunca de cara al viajero.
- No se abrevia en público: "LT" solo en documentos internos y en un monograma de avatar.
- El claim acompaña, no reemplaza: "Viaja Inteligente" va junto al nombre, nunca en su lugar.
- **Sin ™ ni ®** mientras el registro de marca esté pendiente: hoy sería falso.

**Nunca:** `linextrip` en minúscula sostenida dentro de un texto · `LT` como nombre público ·
`Linex Trip™` · `Linex Trip.com` (mezclar contextos).

> El error de hoy ya no es escribir el espacio: es **usar la forma equivocada para el
> contexto** — un titular de campaña que diga "LinexTrip", o una URL con espacio.

Arquitectura y naming son decisiones **LOCKED** a nivel de grupo: se escalan al
administrador del manual, no se cambian desde una campaña.

---

## 4 · Logotipo

**El logotipo vigente es SOLO el wordmark.** Linex Trip todavía no tiene isotipo.

- Archivo oficial: `brand-system/assets/logos-oficiales/linex-trip/logo-LinexTrip.svg`
  (también `.ai`). Ya viene actualizado con el Azul Trip nuevo.
- Paquete para legal / terceros, con las cuatro versiones en SVG y PNG:
  `brand-system/deliverables/linex-trip/logo-para-legal/`.
- Tres versiones oficiales: **color** (fondos claros, uso principal), **negativo**
  (fondos oscuros o fotografía), **monocromo** (grabados, sellos, un solo color — usa
  Azul Trip, no negro).
- **Zona de seguridad:** igual a la altura de la "L" de Linex, por los cuatro costados,
  medida desde el trazo completo y no desde la caja tipográfica. Ahí no entra texto,
  ícono ni borde.
- **Tamaño mínimo:** 120 px de ancho en digital · 30 mm en impreso.
- **Fondos permitidos:** Blanco `#FFFFFF` · Lavanda Linex `#DDE1FF` · Azul Trip `#00145A`.
- **Fondo prohibido:** Celeste sólido `#00B5F5`.
- **Nunca:** deformar, recolorear, separar más las dos palabras, añadir efectos.

### Siete propuestas de símbolo — exploración abierta, nada vigente

Viven en `brand-system/assets/logos-oficiales/linex-trip/propuesta/` y están explicadas,
probadas y ordenadas en `02-propuestas-logo.html`. Cada una lleva las mismas cinco
preguntas y las mismas cuatro pruebas (blanco, negativo, monocromo, ícono 32 px).

| # | Propuesta | Familia | Lectura corta |
|---|---|---|---|
| 01 | La etiqueta de equipaje | El objeto | **Recomendada.** Única que pasa las cuatro pruebas sin retoque y con dos lockups. Riesgo: se acerca a una etiqueta de precio |
| 02 | El pin con señal | El lugar | Dice dos pilares a la vez (destino + respuesta). Un solo lockup; se cierra en bordado |
| 03 | Los que viajan | La gente | La más humana y la más alineada al propósito. Usa un tercer azul `#0E58A1` fuera de paleta; se funde a 32 px |
| 04 | El punto lleno | El lugar | Imbatible en pequeño, y la más genérica de la categoría. Símbolo = letra |
| 05 | El origami | El movimiento | Ligera, dos lockups resueltos; se lee antes como mensajería o botón de play |
| 06 | El punto abierto | El lugar | La idea más elegante; no deja isotipo que pueda vivir solo |
| 07 | La órbita | El movimiento | Funciona en grande, frágil en pequeño; solo versión vertical |

**Tres advertencias sobre esa página**

1. Están dibujadas con el **Índigo anterior `#1A0E3E`**, no con el Azul Trip. Si se elige
   alguna, hay que recolorearla antes de nada.
2. El orden en que aparecen es **decisión del dueño de la marca**, no de quien mantiene
   el manual: no reordenar sin consultarle. El número del archivo es el de la lámina.
3. Hasta que el administrador de marca elija una, **ninguna pieza usa símbolo** y no se
   aproxima uno.

**Tres decisiones que arrastra la elección** (conviene resolverlas en la misma reunión):
si la bajada "Viaja Inteligente" es parte del logo; qué pasa si gana una propuesta con
símbolo celeste (recolorear a navy, o excepción explícita en accesibilidad); y qué pasa
con el tercer azul de la 03 (sustituirlo, o pasar la paleta de seis a siete colores).

---

## 5 · Color

### Cambio de color · 14 de septiembre de 2026 (dueño de marca)

El oscuro pasó de **Índigo `#1A0E3E`** a **Azul Trip `#00145A`**, y entró un tercer color:
**Amarillo `#ECE200`**, de detalle. Motivo del cambio de oscuro: **separar a Trip del navy
de Linex Go**. Ya está aplicado en todo el manual, en `assets/style.css`, en el favicon y
en `brand-tokens.json`.

### Los siete colores y su proporción propuesta

| Color | HEX | RGB | CMYK ref. | Rol | Uso |
|---|---|---|---|---|---|
| Azul Trip | `#00145A` | 0, 20, 90 | 100, 78, 0, 65 | Principal | 30% |
| Celeste Acción | `#00B5F5` | 0, 181, 245 | 100, 26, 0, 4 | Acción / CTA | 21% |
| Blanco | `#FFFFFF` | 255, 255, 255 | 0, 0, 0, 0 | Base y respiro | 19% |
| Celeste Cielo | `#E6F8FE` | 230, 248, 254 | 9, 2, 0, 0 | Respiro | 10% |
| Lavanda Linex | `#DDE1FF` | 221, 225, 255 | 13, 12, 0, 0 | Apoyo | 8% |
| Negro Linex | `#080808` | 8, 8, 8 | 0, 0, 0, 97 | Reserva | 8% |
| Amarillo | `#ECE200` | 236, 226, 0 | 0, 4, 100, 7 | Detalle | 4% |

Los **siete HEX son dato validado**. El porcentaje de uso es una **propuesta de guía
visual del manual**, no una cifra medida ni aprobada por negocio. Los CMYK están
calculados desde el HEX, no medidos en imprenta: son de referencia hasta confirmar con el
proveedor. Ningún color baja de 8% salvo el Amarillo, a propósito.

### Rol de cada color

- **Azul Trip** — sostiene el texto sobre fondos claros, viste tapas, banners y navegación
  en fondo oscuro, y es el texto que va encima del Celeste. **Nunca rellena un botón.**
- **Celeste Acción** — todo lo que se toca, en cualquier canal, incluidas redes. Va como
  superficie con el texto en Azul Trip encima. **Nunca como texto sobre fondo claro.**
- **Blanco** — fondo base de sitio, cotizaciones y piezas impresas.
- **Celeste Cielo** — fondo de cápsulas, chips de categoría y tarjetas tenues.
- **Lavanda Linex** — uno de los tres fondos permitidos para el logotipo y superficies
  decorativas discretas. **No se usa como texto:** falla contraste incluso sobre blanco.
- **Negro Linex** — casi no se usa. Reserva para impresión a un solo color.
- **Amarillo** — **solo sobre el Azul Trip.** Antetítulos, letra chica, separadores.

### La regla de acción: el Celeste actúa, el Azul Trip habla

> Si se puede tocar, es Celeste; si se lee, es Azul Trip.

Vale para **todos los canales sin excepción** — sitio, app, correo, WhatsApp, papelería,
presentaciones y redes.

| Elemento | Cómo se resuelve | Contraste |
|---|---|---|
| Botón / CTA | Relleno `#00B5F5`, texto `#00145A` (peso 700–800, mayúscula inicial), filete interior `#00145A` de 1 px | 7.16:1 · AAA |
| Enlace sobre fondo claro | Texto `#00145A` con subrayado Celeste | 16.83:1 |
| Enlace sobre Azul Trip | Texto `#00B5F5` | 7.16:1 |
| Ícono de acción sobre claro | Celeste Oscuro `#0090C2` | 3.64:1 |
| Precio | `#00145A` en negrita. No es una acción. En Celeste solo sobre superficie azul | — |

**Prohibido:** Azul Trip como relleno de un botón · blanco como texto sobre Celeste
(2.35:1) · Celeste como texto sobre fondo claro (2.35:1 sobre blanco, 2.15:1 sobre
Celeste Cielo).

**El filete de 1 px** (decidido 2026-09-15, antes era 2 px; Linex Go usa el mismo) existe
porque el Celeste contra el papel solo alcanza 2.22:1 y WCAG 1.4.11 pide 3:1 en el
contorno de un control. El Azul Trip contra el papel da 15.86:1, así que 1 px basta.

### La regla del Amarillo, que se rompe sola

Vive **únicamente sobre el Azul Trip**: ahí da 12.38:1; sobre blanco da 1.36:1 y no se lee.
Es el color más llamativo de la paleta, y por eso el primer impulso es ponerlo sobre
blanco. **No hay excepción** por tamaño, por grosor ni por tratarse de un ícono.

- **Sí:** antetítulos y etiquetas cortas sobre el azul · letra chica (condiciones,
  vigencias, notas al pie) · detalles menores (separadores, viñetas, filetes finos).
- **No:** títulos (el titular es blanco, siempre) · botones (la acción es Celeste,
  siempre) · cualquier cosa sobre fondo claro.

> **Pendiente de coordinación:** el Amarillo queda a **22 ΔE** del Dorado `#C99A3B` que
> Linex Loyalty tiene como candidato de acento. Conviene avisarle a Loyalty **antes** de
> que fije el suyo.

---

## 6 · Tipografía

Heredada del sistema tipográfico del grupo. Dos registros:

**Operativo** — cotizaciones, correo, Contact Center, documentos en Office:

- **Segoe UI** — principal, títulos. Bold/Semibold.
- **Calibri** — secundaria, cuerpo. Regular/Bold.
- Respaldo: Arial o Helvetica.

| Elemento | Especificación |
|---|---|
| Título de cotización | Segoe UI Bold, 20–24 px |
| Subtítulo / sección | Segoe UI Semibold, 16 px |
| Cuerpo / firma | Calibri Regular, 12–13 px |

**Digital** — linextrip.com, la app y redes: **Geist** (Regular · Medium · Black ·
ExtraBold), vía Google Fonts.

| Nivel | Especificación |
|---|---|
| H1 Hero | 32–40 px · ExtraBold (800) · 1 por vista |
| H2 Sección | 22–24 px · Bold (700) |
| H3 Subsección | 16–17 px · Medium/Semibold |
| Cuerpo / caption | 13–14 px / 11–12 px · Regular |

**Regla de oro.** Segoe UI manda en lo que se ve, Calibri sostiene lo que se lee, Geist
viste linextrip.com y el producto. Nunca al revés.

**Nunca mayúscula sostenida** (decidido 2026-09-15). Ningún texto de una pieza va todo en
mayúsculas: ni titulares, ni botones, ni etiquetas, ni antetítulos, en ningún canal. La
mayúscula sostenida borra el perfil de la palabra y obliga a leer letra por letra.

- **Excepciones:** siglas propias (IVA, COP, USD), el wordmark cuando el logotipo lo
  exija, y las etiquetas pequeñas del propio manual (documento interno, no pieza).
- **Se enfatiza** con peso, con tamaño o con una cápsula sólida Celeste con texto en Azul
  Trip. Nunca gritando, nunca con signos de exclamación en promesas de precio o
  disponibilidad.

Máximo dos pesos por pieza. Sin subrayado salvo enlaces. Sin cursiva decorativa. Precios
siempre en negrita, valor primero y código de moneda después: `$112 USD · $450.000 COP`.

---

## 7 · Iconografía

**Librería oficial:** Font Awesome Pro · familia **Classic** · estilo **Regular**.
Filtro exacto de búsqueda: `classic & s=regular & ic=pro-collection`.
Decidido 2026-09-10. Nunca se dibujan a mano ni se mezclan estilos ni librerías.

En el manual están empotrados como SVG inline (glifos extraídos de la fuente de
escritorio) para que no dependa de CDN ni de licencia instalada.

**Diccionario concepto → ícono** (un concepto, un ícono, siempre el mismo):

| Grupo | Íconos |
|---|---|
| Producto | `fa-plane-up` vuelos · `fa-plane-departure` salida · `fa-hotel` hoteles · `fa-bed` habitación/noches · `fa-car-side` autos · `fa-van-shuttle` traslados · `fa-suitcase` paquetes · `fa-suitcase-rolling` equipaje |
| Búsqueda y reserva | `fa-location-dot` destino · `fa-earth-americas` internacional · `fa-umbrella-beach` experiencias · `fa-calendar-days` fechas · `fa-clock` duración · `fa-magnifying-glass` buscar · `fa-user-group` viajeros · `fa-passport` documentos/visa |
| Precio y promoción | `fa-credit-card` pago · `fa-receipt` cotización · `fa-tag` precio/oferta · `fa-percent` descuento · `fa-ticket` cupón |
| Confianza y estado | `fa-circle-check` confirmado · `fa-shield-halved` asistencia/seguro · `fa-lock` pago seguro · `fa-star` calificación · `fa-triangle-exclamation` aviso · `fa-circle-info` información |
| Contacto y amenidades | `fa-headset` soporte humano · `fa-comment-dots` chat · `fa-utensils` comidas · `fa-wifi` wifi · `fa-arrow-right` siguiente paso |
| Redes (familia Brands) | `fa-whatsapp` · `fa-instagram` · `fa-facebook` · `fa-tiktok` |

**Dos excepciones de familia:** los íconos de redes viven en **Brands** (estilo único,
marcas registradas — no se recolorean ni se encierran en formas propias); y en impresos
**por debajo de 4 mm** se usa `fa-solid`, única excepción de estilo del manual.

**Color del ícono.** Un ícono es objeto gráfico: mínimo **3:1** (WCAG 1.4.11), no 4.5:1.

| Fondo | Celeste `#00B5F5` | Celeste Oscuro `#0090C2` | Azul Trip `#00145A` |
|---|---|---|---|
| Blanco `#FFFFFF` | 2.35:1 ✗ | 3.64:1 ✓ | 17.85:1 ✓ |
| Papel `#F6F8FF` | 2.22:1 ✗ | 3.43:1 ✓ | 16.82:1 ✓ |
| Celeste Cielo `#E6F8FE` | 2.15:1 ✗ | 3.33:1 ✓ | 16.34:1 ✓ |
| Lavanda `#DDE1FF` | 1.82:1 ✗ | 2.82:1 ✗ | 13.85:1 ✓ |
| Azul Trip `#00145A` | 7.59:1 ✓ | 4.90:1 ✓ | — |
| Celeste sólido | — | 1.55:1 ✗ | 7.59:1 ✓ |

> **La regla corta:** Celeste como color de ícono **solo sobre Azul Trip**. Sobre cualquier
> fondo claro, el ícono va en Celeste Oscuro `#0090C2` o en Azul Trip. Sobre Lavanda,
> únicamente Azul Trip. Y el combo "círculo Celeste con ícono blanco" **no se usa nunca**.

**Tamaño y entrega por canal**

| Canal | Tamaño | Color permitido | Qué se entrega |
|---|---|---|---|
| Web / App | 16 px mín · 20 px si va solo · 24 px en cabeceras | Azul Trip o Celeste Oscuro sobre claro; Celeste o blanco sobre navy | Clase `fa-regular` en el markup |
| Instagram / Facebook | 40 px mín sobre lienzo 1080 | Igual que web, medido contra el fondo real | SVG en el archivo + alt text del post |
| WhatsApp / Contact Center | 32 px mín (se ve en miniatura) | Blanco o Celeste sobre navy | PNG exportado, fondo sólido |
| Email | 20–24 px, exportado a 2× | Azul Trip sobre blanco | PNG con alt; **nunca** fuente de íconos |
| Papelería / impresos | 4 mm mín · `fa-solid` por debajo | Azul Trip en CMYK sobre blanco | Curvas (outlines) en el arte final |
| Gran formato | Escala libre, proporcional | Blanco o Celeste sobre navy | SVG vectorial, sin rasterizar |

**Accesibilidad en código**

```html
<i class="fa-regular fa-plane-up" aria-hidden="true"></i> Vuelos
<button aria-label="Buscar"><i class="fa-regular fa-magnifying-glass" aria-hidden="true"></i></button>
Vuelo <i class="fa-regular fa-circle-check" role="img" aria-label="confirmado"></i>
```

Área tocable de 44×44 px como estándar (WCAG 2.2 exige 24×24 como piso AA): el ícono
puede ser chico, el área de toque no. El ícono **nunca** es el único portador del dato.
En impresos, convertir a curvas antes de mandar arte y probar en escala de grises.

**Cifras vs. íconos:** un ícono necesita 3:1 porque es objeto gráfico; una cifra es texto
y necesita 4.5:1. Cuando van juntos en la misma tarjeta, manda el 4.5:1.

---

## 8 · Sistema gráfico

**Radios de esquina** — cinco valores, tokens `--radius-s` a `--radius-pill`. No hay
radios intermedios sueltos. Mientras más chico, más funcional se siente el elemento.

| Radio | Elemento | Por qué |
|---|---|---|
| 6 px | Chips de categoría | Casi cuadrado: se lee como control, no como pieza |
| 12 px | Botones primario y secundario | Redondo para invitar al clic, recto para seguir siendo acción |
| 16 px | Tarjetas (simple y de lista) | Contenedor con contenido propio. Aquí entra la sombra Nivel 1 |
| 24 px | Contenedores y banners | Paso de "reposo": pieza completa que se lee entera |
| total | Pills, badges y estados | **Radio total = dato, no acción.** Nunca se confunde con un botón |

**Sombras:** Nivel 1 (tarjetas en reposo) · Nivel 2 (logo, modales, tarjeta flotante).

**Tarjeta de producto.** La estructura no se rediseña por categoría: cambian solo tres
cosas — el chip de categoría, el dato de confianza de la segunda línea y la unidad del
precio (por persona / por noche / por día). Todo lo demás es idéntico: foto arriba de
120 px con degradado de lectura en la mitad inferior, radio 16 px + sombra, precio
bilingüe siempre visible y un solo CTA en píldora celeste.

La unidad del precio va siempre encima del valor y en minúscula: *un precio por noche
leído como total es la queja más cara que puede generar una tarjeta*.

**Versión compacta** (lista de resultados): mismo radio, sombra Nivel 1, miniatura
cuadrada de 64×64 sin gradiente, precio bilingüe siempre, sin CTA propio (toda la tarjeta
es tocable).

**Banners — cuatro variantes**, y la elección no es de gusto, depende del fondo donde caiga:

1. **Navy sólido** — logo con zona de seguridad completa, cuadrícula fina al 4%, mancha de
   gradiente Celeste en la esquina inferior derecha, radio 24 px, titular blanco de máx.
   2 líneas, precio bilingüe en tarjeta blanca flotante, un solo CTA en píldora celeste.
2. **Sobre foto** — degradado oscuro SOLO en la mitad inferior (existe para que el texto
   blanco pase contraste, no para tapar la foto), sin mancha de gradiente, precio
   integrado en el titular.
3. **Sobre fondo claro (variante papel)** — el mismo sistema con siete piezas invertidas:
   logo a color, borde de 1 px en Azul Trip al 10% + sombra Nivel 1, cuadrícula en Azul
   Trip al 5%, mancha al 28%, titular en Azul Trip, precio escrito directo sin tarjeta de
   respaldo, **CTA en píldora Azul Trip con texto blanco**. Evitar aquí: blanco puro de
   fondo, titular o precio en Celeste, CTA celeste con texto blanco, logo blanco y sombra
   Nivel 2.
4. **Barra de anuncio compacta** (navy o clara) — radio 12 px, sin foto ni logo, un
   mensaje de menos de 10 palabras y un CTA en la misma línea. Nunca como reemplazo del
   banner completo en redes. Si en la pantalla ya hay un banner navy, la barra va clara.

---

## 9 · Fotografía

> **AÚN NO EXISTE.** Trip todavía no tiene banco de fotos propio. En el manual hay
> marcadores de posición de color. Las fotos de las piezas de la sección 14 son la zona
> fotográfica recortada de tres piezas de redes reales que hay hoy — y **solo sirven en
> encuadre apaisado**. Ojo: esas piezas originales llevan el logo compacto "LinexTrip",
> anterior a la regla de nombre; por eso se usa su foto y nunca la pieza entera.

**Los tres tipos de imagen**

- **Viajeros** — una persona real haciendo fila o subiendo al avión, sonriendo de forma
  genuina (no a cámara), luz de día.
- **Destinos** — el lugar tal como lo ve el viajero al llegar (playa, calle, ciudad), sin
  gente posando.
- **Compra** — alguien mirando el teléfono o el laptop comparando precios, en casa o en un
  café, ambiente cotidiano.

**Usar:** luz natural (día o atardecer, nunca flash directo), colores como se ven en la
vida real, la persona haciendo algo.
**Evitar:** banco de imágenes genérico reconocible, saturación exagerada, poses
artificiales, filtros que cambien el color real de la piel.

---

## 10 · Accesibilidad

Base WCAG 2.1 heredada del sistema del grupo:

- **Contraste** — AA (mínimo no negociable): 4.5:1 en texto corrido, 3:1 en texto grande
  (≥24 px regular o ≥18.66 px bold). AAA (preferido cuando el combo ya lo alcanza sin
  costo): 7:1 y 4.5:1.
- **Áreas táctiles** — mínimo 44 × 44 px en cualquier botón o control, en app y web.
- **Texto alternativo** — toda imagen funcional lo lleva; las decorativas se marcan.
- **No solo color** — un estado (error, éxito, promoción) nunca se comunica solo con
  color: siempre lleva ícono o texto.

**Combinaciones propias de la paleta**

| Combinación | Contraste | Veredicto |
|---|---|---|
| Blanco sobre Azul Trip | 17.85:1 | ✓ AA · ✓ AAA — texto principal, cualquier tamaño |
| Celeste sobre Azul Trip | 7.59:1 | ✓ AA · ✓ AAA por poco — texto corrido incluido |
| Azul Trip sobre Celeste | 7.16:1 | ✓ AAA — el texto del botón |
| Amarillo sobre Azul Trip | 12.38:1 | ✓ — pasa de sobra, incluso en texto pequeño |
| Celeste sobre blanco | 2.35:1 | ✗ — falla incluso el mínimo AA de texto grande |
| Celeste sobre Celeste Cielo | 2.15:1 | ✗ |
| Amarillo sobre blanco | 1.36:1 | ✗ — no es que se lea mal: es que no se lee |
| Lavanda sobre blanco | ≈1.3:1 | ✗ — texto casi invisible |

**Las dos reglas que se rompen solas**

1. **Celeste nunca se usa como texto o precio sobre blanco.** Se reserva para acento,
   botón o fondo. Para texto sobre blanco, Azul Trip.
2. **El Amarillo vive únicamente sobre el Azul Trip.** Sin excepción por tamaño, grosor
   ni por tratarse de un ícono.

Ambas decisiones de color están **validadas** (decisión de color 2026; el Celeste se
evaluó frente a una propuesta en verde menta, descartada).

---

## 11 · Audiencias — tres arquetipos

Antes de diseñar se elige **un** arquetipo, no dos. Una pieza que le habla a los tres no
le habla a ninguno.

**Lo que está decidido:** el comportamiento de cada arquetipo (cómo compra, qué necesita,
qué lo hace abandonar, cómo se le habla). Si una pieza lo contradice, la pieza está mal.
**Lo que es hipótesis:** el perfil demográfico y de dispositivo — orienta una pieza, no se
cita como dato en un reporte a negocio.

### 01 · El planificador digital

*Compara antes de comprar y no quiere sentir que le ocultan algo.*

- **Perfil (hipótesis):** 28–45 años, ciudades principales de Colombia. Empieza en móvil,
  cierra en escritorio. Compra con 3–8 semanas de antelación. Lo confirma: GA4 + CRM.
- **Cómo compra:** entra por búsqueda o por un post con precio visible. Decide en días,
  volviendo varias veces. Lo primero que mira es el precio total y qué incluye.
- **Necesita:** comparación clara y transparencia de precio.
- **Lo hace abandonar:** un precio que cambia al final, o que no diga qué incluye.
- **Cómo le hablamos:** directo y con dato. CTA "Buscar vuelos" o "Ver disponibilidad".

### 02 · El decisor rápido

*Necesita salir pronto y quiere que se lo resuelvan en el mismo chat.*

- **Perfil (hipótesis):** 30–50 años, viaje por trabajo o urgencia familiar. Móvil casi
  exclusivo. Compra con 0–7 días de antelación. Lo confirma: WhatsApp Business + GA4 + CRM.
- **Cómo compra:** entra por WhatsApp o clic directo. Decide en la misma conversación. Lo
  primero que mira es si hay cupo y en cuánto queda.
- **Necesita:** respuesta inmediata y reserva en pocos pasos.
- **Lo hace abandonar:** un formulario largo, o una primera respuesta sin precio.
- **Cómo le hablamos:** corto, una sola opción, sin adornos. CTA "Escríbenos por WhatsApp".

### 03 · La familia viajera

*Organiza el viaje de varios y necesita saber cómo lo va a pagar.*

- **Perfil (hipótesis):** 35–55 años, decide en pareja, viaja con 2–4 acompañantes.
  Explora en móvil y cierra en escritorio. Compra con 1–4 meses de antelación,
  concentrada en vacaciones escolares y fin de año. Lo confirma: CRM + GA4.
- **Cómo compra:** entra por promoción de paquete o recomendación. Decide en semanas,
  consultando a otros. Lo primero que mira es qué incluye y si hay cuotas.
- **Necesita:** paquetes claros y flexibilidad de pago.
- **Lo hace abandonar:** no encontrar el precio por persona, o cuotas que aparecen al final.
- **Cómo le hablamos:** cálido y concreto, **sin urgencia falsa**. CTA "Cotiza tu viaje".

### Tabla de decisión rápida

| Arquetipo | Canal | Formato | Titular tipo | CTA | Precio |
|---|---|---|---|---|---|
| 01 · Planificador | Instagram feed, buscador, email | Post 4:5 o carrusel; landing | Destino + qué incluye | Ver disponibilidad / Buscar vuelos | Final por persona, USD y COP, en tarjeta |
| 02 · Decisor rápido | WhatsApp, story con enlace | Mensaje con una imagen; story 9:16 | Fecha y cupo concretos | Escríbenos por WhatsApp / Habla con un asesor | En la primera respuesta útil |
| 03 · Familia viajera | Instagram carrusel, email, banner | Carrusel 3–5 láminas; banner | Paquete + a quién alcanza | Cotiza tu viaje / Paga en cuotas | Por persona + total, y la cuota si aplica |

### Brief de campaña en seis líneas

Si una línea queda vacía, la pieza todavía no se puede diseñar.

1. **A quién** — un solo arquetipo, por nombre.
2. **Dónde** — canal y formato, tomados de la tabla.
3. **Promesa** — una frase, el beneficio concreto; no un adjetivo.
4. **Prueba** — el dato que la sostiene (precio final, cupos reales, qué incluye, vigencia).
5. **CTA** — uno, de la biblioteca aprobada.
6. **Qué no decir** — la objeción que no hay que activar, y lo prohibido de siempre.

---

## 12 · Propuesta de valor y claims

### Claim principal — **Viaja Inteligente**

Confirmado y en uso. Es el **único claim aprobado** de Linex Trip. Se escribe con inicial
mayúscula en las dos palabras y sin signos de exclamación.

- **Acompaña, no reemplaza:** va junto al nombre, nunca en su lugar. Una pieza puede llevar
  el logo sin el claim; nunca el claim sin la marca.
- **No es un CTA:** es promesa de marca, no acción. No va dentro de un botón.
- **Convivencia con el logo:** respeta su zona de seguridad y va en peso menor.
- **Dónde vive:** cierre de pieza, bio de redes, firma, cabecera de campaña. En una tarjeta
  de producto no aporta — ahí manda el precio.

### Los cuatro pilares

Cada uno con su prueba y —el campo que evita casi todos los problemas— **qué NO autoriza a
decir**.

**01 · Precios claros** — *Siempre en USD y COP, sin letra pequeña.*
Prueba: el precio bilingüe visible en toda pieza y tarjeta, con lo que incluye al lado,
nunca detrás de un toque ni revelado al final. Le pega al arquetipo 01, sostiene la
confianza de los tres. Titular tipo: "Cartagena, todo incluido — $112 USD · $450.000 COP".
**NO autoriza:** "sin costos", "sin comisiones", "el precio más bajo" ni "mejor precio
garantizado" sin una garantía de igualación real y documentada. *Claro no es gratis.*

**02 · Reserva en minutos** — *Sin filas, sin llamadas, desde el celular.*
Prueba: flujo de pocos pasos y cierre en el mismo chat con un asesor real. Arquetipo 02.
Titular tipo: "Sale mañana 6:20 a.m. — te lo reservo desde este chat".
**NO autoriza:** "automático", "inmediato" ni "en un clic" mientras haya un paso humano. Y
la velocidad nunca se cuenta con cuenta regresiva ni cupos falsos. *Minutos no es instantáneo.*

**03 · Paga en cuotas** — *Flexibilidad para organizar el presupuesto del viaje.*
Prueba: la cuota se muestra junto al precio total, calculada sobre el valor real, desde la
pieza. Arquetipo 03. Titular tipo: "San Andrés en familia — $245 USD por persona o 12
cuotas de $82.250 COP".
**NO autoriza:** "0% de interés" ni "aprobación inmediata" si la financiación los cobra o
depende de un tercero. La cuota **nunca va sola sin el precio total**. *Cuotas no es sin intereses.*

**04 · Acompañamiento real** — *Antes, durante y después de cada viaje.*
Prueba: un asesor con nombre que se identifica en la primera respuesta y sigue siendo la
misma vía después de comprar. Cierra al arquetipo 02 y tranquiliza al 03. Titular tipo:
"Camila te acompaña antes, durante y después del viaje".
**NO autoriza:** "24/7", "siempre disponible" ni "tu asesor personal" si atiende un equipo
rotativo. Nada de "te resolvemos cualquier cosa". *Real no es permanente.*

### Claims secundarios — propuestos, pendientes de Marketing

Los tres vienen del manual histórico y pasaron el mismo test de cinco preguntas. El
veredicto es una recomendación técnica, no una aprobación: aprobarlos o descartarlos es
decisión del dueño de la marca.

| Claim | Veredicto |
|---|---|
| "Tu próximo viaje, más simple." | Débil y genérico. Un competidor lo firma sin cambiar una palabra. Sirve como línea de apoyo en un email o landing, no como claim de campaña |
| "Reserva hoy, viaja tranquilo." | **El más fuerte, condicionado.** Aprobable solo en piezas con vigencia real visible: "hoy" implica fecha límite, y sin vigencia escrita es presión sin dato |
| "El mundo, a un clic de distancia." | Falla en 3 de 5. Ningún pilar habla de alcance; "a un clic" choca con el límite del pilar 02. Descartarlo o reescribirlo |

### Lo que nunca se promete

- Superlativos sin prueba ("el mejor precio", "garantizado") sin garantía real y reclamable.
- Urgencia falsa: cupos, cuentas regresivas o "última oportunidad" sin vigencia verdadera.
- Cobertura que no existe: destinos o servicios no documentados al momento de publicar.
- Disponibilidad que no se cumple: "24/7", "respuesta inmediata", "asesor personal".
- Precio incompleto: la cuota sin el total, el total sin la moneda, o un valor que cambie
  al final del proceso.

> **La prueba de fuego:** si alguien de servicio al cliente no puede sostener la promesa
> con lo que hoy existe, la pieza no sale. Cada promesa que el producto no cumple vuelve
> como reclamo, y el pilar 04 es el primero que se rompe.

---

## 13 · Voz y tono

**La voz es constante** (clara, cercana, confiable, inspiradora) — no cambia por canal,
campaña ni por quién escriba. **El tono es variable** — cómo suena esa voz según el
momento del viajero.

El matiz de Trip: **"como un viajero le habla a otro"**, más directa que Linex Go, porque
le habla al viajero final y no a una agencia.

### Los cuatro atributos, y su exceso

| Atributo | En la práctica | Qué NO es |
|---|---|---|
| **Claro** | El dato que decide va primero y completo: precio con las dos monedas, qué incluye, hasta cuándo. Nada importante bajo un "ver más" | **No es seco.** Quitar adornos no es escribir como un extracto bancario |
| **Cercano** | Trato de tú, frases cortas, el asesor con nombre propio. Se escribe como se habla | **No es confianzudo.** Ni apodos, ni chistes sobre el dinero del viajero, ni cadenas de emojis |
| **Confiable** | Solo se promete lo que el producto sostiene, y lo que puede cambiar se dice antes | **No es corporativo.** Blindarse tras "aplican T&C" sin explicar cuáles genera sospecha |
| **Inspirador** | El destino se nombra por lo que se hace ahí, no por adjetivos. La inspiración en el titular, el dato duro debajo | **No es cursi.** Nada de "vive la experiencia de tu vida" ni "paraísos de ensueño" |

### El tono según el momento

| Momento | Qué hace el tono | Qué va primero |
|---|---|---|
| Explorando | Inspira, pero con dato: nombra el plan concreto | El destino y qué se hace ahí |
| Comparando | Se vuelve preciso y quita adornos | El precio final y qué incluye |
| Comprando | Baja el volumen: acompaña, no vende más | Qué va a pasar ahora, paso por paso |
| Algo salió mal | Se hace responsable y concreto. **Cero marketing** | Qué pasó y qué significa para él |
| Después del viaje | Cercano sin pedir nada a cambio primero | El cierre humano, antes que la próxima venta |

### Cuando algo sale mal — el orden fijo del mensaje difícil

1. **Qué pasó**, en la primera línea y sin rodeos. Nunca una disculpa larga que retrase el dato.
2. **Qué significa para ti**: cómo le afecta el viaje, el dinero o la fecha.
3. **Qué estamos haciendo**, con la opción concreta ya resuelta si existe.
4. **Qué necesitamos de ti**, si hace falta: una sola acción, clara.
5. **Cuándo vuelvo a escribirte**, con un momento real.

**Nunca:** "Por políticas de la empresa" · "No depende de nosotros" · "Como le informamos
previamente" · "Lamentamos los inconvenientes ocasionados" (se pide perdón por lo
concreto: "perdón por el madrugón perdido") · emojis en un mensaje de problema, en
cualquier canal.

### Registro

- **Persona:** al viajero, de tú. La marca en primera del plural ("te acompañamos"); el
  asesor en primera del singular con su nombre ("soy Camila").
- **Frase:** corta y en voz activa, una idea por frase.
- **Emojis:** solo en redes y con moderación, nunca en cadena. Prohibidos en mensajes de
  problema, en precios y en documentos.
- **Signos:** sin mayúsculas sostenidas y sin exclamaciones en promesas de precio o
  disponibilidad.
- **Cifras:** precio con las dos monedas y separador de miles; horas en reloj local;
  fechas escritas, no solo numéricas.
- **Español:** el de Colombia, sin modismos que no se entiendan afuera. Nada de calcos del
  inglés ("aplicar a la promoción", "bookear").

### Sí decir / No decir

| Sí decir | No decir | Por qué |
|---|---|---|
| "Tu vuelo a Cartagena desde $112 USD · $450.000 COP, ida y vuelta." | "Precio increíble, ¡solo hoy!" | "Increíble" no es un dato y "solo hoy" casi nunca es cierto |
| "Reserva hoy y paga en cuotas." | "Tu última oportunidad, no lo pienses más." | Presionar una decisión de cientos de dólares destruye la confianza del pilar 04 |
| "Estamos contigo antes, durante y después de tu viaje." | "Nuestra plataforma vende por ti." | El diferencial es que hay una persona con nombre del otro lado |
| "Perdón por el madrugón perdido, ya te moví el traslado." | "Lamentamos los inconvenientes ocasionados." | Pedir perdón por lo concreto demuestra que alguien leyó el caso |
| "Cuatro días de Caribe, con los traslados ya resueltos." | "Vive la experiencia de tu vida en un paraíso de ensueño." | Es una frase que cualquier agencia puede firmar sin cambiar nada |

### La misma voz en el buscador (SEO)

El SEO es de lo que la gobernanza deja en manos de Trip. La regla que resuelve la tensión:
**la palabra clave va donde el buscador la necesita —title, primer párrafo, un H2— escrita
como la diría un viajero.** Si una frase no la diría un asesor en voz alta, no se publica
aunque rankee.

- **Title:** ~60 caracteres. Beneficio o plan + destino + Linex Trip al final. Precio solo
  si es real y vigente.
- **Meta description:** ~155 caracteres. Copy de marca con el dato duro (USD/COP, qué
  incluye) y cierre con un verbo de la biblioteca de CTA.
- **H1/H2:** un solo H1 que cumpla lo que promete el title. Los H2 responden preguntas
  reales del arquetipo.
- **URL:** minúscula, con guiones, sin fechas que caduquen. Aquí el nombre va compacto:
  `linextrip.com/vuelos/bogota-cartagena`.
- **Alt:** se escribe para accesibilidad; el beneficio de buscador viene de regalo.

**Nunca por posicionar:** repetir la palabra clave hasta que deje de sonar humana ·
prometer en el title lo que la página no tiene · páginas hechas solo para rankear ·
duplicar contenido entre Trip y Go.

---

## 14 · Vocabulario

| Usamos | En lugar de |
|---|---|
| Viajero | usuario / cliente |
| Reservar | booking / hacer check-out |
| Vuelo / tiquete | ticket |
| Pagar en cuotas | financiar / diferir |
| Contact Center | call center |
| Equipo de Linex Trip | Linex Trip's team |

- **Precios y cifras:** valor con "$" primero y código de moneda después, con separador de
  miles: `$112 USD · $450.000 COP`.
- **Sin jerga técnica:** evitar "GDS", "PNR", "inventario" en comunicación al viajero.
- **Sin urgencia falsa:** "última oportunidad" o "solo hoy" solo si es literalmente cierto.

---

## 15 · Promociones y CTA

**Seis categorías de producto**, todas con el mismo chip (mismo radio total, mismo peso,
sin color propio): Vuelos · Hoteles · Paquetes · Autos · Asistencias · Experiencias.
Ninguna se destaca sobre otra en el menú de producto.

**Reglas de promoción**

- **Vigencia real** — toda promoción muestra fecha de vencimiento verdadera.
- **Sin presión falsa** — no se simulan cupos limitados que no existen.
- **Moneda doble** — USD y COP siempre visibles.
- Etiqueta de descuento en Azul Trip o Celeste sobre fondo sólido; **nunca en rojo** ni con
  signos de exclamación.

**Biblioteca de CTA aprobados**

| Intención | CTA |
|---|---|
| Descubrimiento | Buscar vuelos · Ver destinos · Cotiza tu viaje |
| Decisión | Reserva ahora · Ver disponibilidad · Paga en cuotas |
| Soporte | Habla con un asesor · Escríbenos por WhatsApp · Ver mi reserva |

Verbo en imperativo + beneficio concreto, en mayúscula inicial. Evitar "Click aquí",
"Enviar" genérico, mayúsculas sostenidas o exclamaciones.

**Cómo se construye el botón** (decidido 2026-09-15)

| | |
|---|---|
| Relleno | Celeste `#00B5F5`. Ningún otro elemento de la pieza lleva ese fondo |
| Texto | Azul Trip `#00145A`, peso 700–800, mayúscula inicial. 7.16:1 · AAA. **Nunca blanco** (2.35:1) |
| Filete | Azul Trip, 1 px interior. Sobre Azul Trip queda invisible, y no pasa nada |
| Forma | 999 px (cápsula) en piezas, redes y mensajería; 8 px dentro de una tarjeta o formulario |
| Área táctil | Mínimo 44×44 px reales. Si la etiqueta es corta crece el padding |
| Secundario | Sin relleno, contorno Azul Trip de 1 px, texto Azul Trip |
| Enlace de texto | Sobre claro: Azul Trip con subrayado Celeste. Sobre azul: Celeste liso |
| Jerarquía | Un solo principal por pieza o pantalla. Lo demás, secundario o enlace |

**Nunca:** botón relleno de Azul Trip · texto blanco sobre Celeste · dos botones llenos
compitiendo · mayúscula sostenida o exclamaciones en la etiqueta.

---

## 16 · Entregables y canales

**Activos oficiales**

| Activo | Dónde |
|---|---|
| Logotipo | SVG · color/negativo/mono · `assets/logos-oficiales/linex-trip/` |
| Paleta | Tokens HEX/RGB/CMYK · `brand-tokens.json` y sección 03 |
| Tipografía Geist | Google Fonts · pesos 400–900 |
| Íconos | Font Awesome Pro · Classic Regular |
| Este manual | HTML/CSS/JS plano · sitio estático standalone |
| Repositorio central | **Pendiente validar con negocio** |

### Página web

- **Group Bar arriba de todo** — obligatorio, no se rediseña.
- Hero Azul Trip a sangre (1440×750 px en desktop), **un solo titular**, sin segundo
  mensaje compitiendo ni dos botones.
- El buscador es el punto focal: tarjeta blanca con sombra Nivel 2, montada sobre el borde
  inferior del hero. Es lo único que se despega del fondo.
- Un solo CTA principal por pantalla ("Buscar vuelos"); "Habla con un asesor" va en
  contorno.
- Los resultados no se rediseñan: son las tarjetas de producto del sistema gráfico.

### WhatsApp y Contact Center

- **Cinco líneas antes del corte.** Lo que importa (destino, precio, vigencia) va antes del
  "Leer más" o no se lee.
- **Jerarquía obligatoria, siempre en este orden:** producto y destino → precio → vigencia
  → condiciones → CTA. No se reordena por campaña.
- Una sola imagen por mensaje (1:1 o 4:5), con el dato clave **también escrito** en el
  texto. Nunca el precio solo dentro de la imagen.
- El asesor se identifica con nombre en la primera respuesta; el precio aparece en la
  primera respuesta útil, no después de tres preguntas.
- Sin cadenas de emojis, sin mayúsculas sostenidas, sin "¡última oportunidad!".
- Avatar circular Azul Trip con el monograma en Celeste, 640×640 px.
- La burbuja del asesor va en Celeste `#00B5F5`, **nunca en el verde de WhatsApp** `#25D366`.

### Email

- **600 px de ancho y una sola columna.**
- Un solo CTA principal, en **píldora Azul Trip con texto blanco**: en fondo claro el botón
  es la única mancha oscura y así aguanta si el cliente fuerza modo oscuro.
- **Tiene que funcionar sin imágenes:** precio, fechas y condiciones van como texto; los
  íconos como PNG con alt escrito.
- Asunto corto, sin exclamaciones, con el dato concreto adelante.
- **Pie legal completo:** razón social, RNT y baja de suscripción. Es la condición para
  poder seguir escribiendo.

### Papelería y firma de correo

- Tarjeta 89×51 mm en **CMYK**, con los valores de la paleta — no se convierte el HEX a ojo
  en la imprenta.
- Hoja carta 216×279 mm, margen 19×20 mm. Sobre DL 220×110 mm.
- Mismo lockup en tarjeta y firma: nombre, cargo y contacto en el mismo orden.
- **Razón social y RNT visibles** (Strategic Points S.A.S. · RNT 59151 y 82366): requisito
  de la operación, no un detalle que se pueda sacar por espacio.
- Íconos mínimo 4 mm en Azul Trip sobre blanco; por debajo pasan a `fa-solid`. El reverso
  de la tarjeta y la firma están justo en ese umbral.
- Nada de degradados en papel chico.

---

## 17 · Redes sociales

**Formatos**

| Formato | Tamaño |
|---|---|
| Feed post | 1080×1350 px (4:5) |
| Story / Reel cover | 1080×1920 px (9:16) |
| Carrusel | 1080×1350 px, 3–10 slides |
| Portada Facebook | 1200×630 px |
| Avatar / perfil | 500×500 px (círculo) |

**Reglas duras**

- **Margen seguro:** 120 px arriba y abajo en story/reel. Nada crítico ahí: ni titular, ni
  precio, ni CTA.
- **Primera lámina:** titular + beneficio concreto, nada más. Si no se entiende sola, el
  carrusel no se abre.
- **Última lámina:** un solo CTA de la biblioteca, con flecha. Nunca dos compitiendo.
- **El precio nunca va suelto sobre la foto:** va en tarjeta blanca o Azul Trip, con USD y
  COP visibles.
- Titular en máximo 2 líneas — en el feed comprimido, la tercera ya no se lee.
- El indicador "n/N" va siempre visible en la esquina superior de un carrusel.
- **Perfil:** avatar 500×500 en Azul Trip con monograma en Celeste, bio "Viaja Inteligente",
  hashtags propios `#ViajaInteligente` y `#LinexTrip`.
- **Texto alternativo obligatorio** en cada publicación.

### Lenguaje gráfico observado (15 referencias entregadas por el dueño de marca)

Lo que se toma: **collage por capas** (foto a sangre + bloque de texto plano en cápsula +
máximo un badge tipo sticker: estampilla postal con borde dentado, cinta washi, Polaroid),
fotografía de gente real viviendo el destino con luz natural, un dato preciso siempre
visible, humor cotidiano tipo meme, pin de ubicación como bloque recurrente, indicador n/N.

Lo que **no** se toma: la mayúscula sostenida de los titulares (es lo que hace la
categoría, no lo que hace Trip) y la paleta vibrante de la referencia — Trip usa siempre
su paleta oficial.

**Decisiones del dueño de marca sobre redes**

- **Color · RESUELTO** — las referencias solo aportan lenguaje visual y compositivo; el kit
  de redes usa siempre la paleta oficial de Trip.
- **Ícono · DIFERIDO, no bloquea** — sólido (como la referencia) vs. Classic Regular
  (oficial). Mientras tanto, **cualquier pieza real usa Classic Regular**; el estilo sólido
  queda como excepción a aprobar. En ambos casos el color lo fija la tabla de contraste.

### Reglas de uso de IA para producir contenido


**Plantilla de prompt en 7 pasos** (los pasos 3 y 4 son fijos, no se editan por pieza):

1. **Escena** — sujeto, acción y destino, literal y concreto.
2. **Fotografía** — realista, luz natural cálida, alta saturación. Nunca CGI evidente ni
   banco genérico.
3. **Marca (obligatorio)** — wordmark "Linex Trip", Geist ExtraBold/Black, "Linex" en Azul
   Trip `#00145A` y "Trip" en Celeste `#00B5F5`, sobre blanco o navy — nunca sobre celeste
   sólido — con zona de seguridad igual a la altura de la "L".
4. **Paleta** — `#00145A` · `#00B5F5` · `#DDE1FF` · `#E6F8FE` · `#FFFFFF` · `#080808`.
5. **Composición** — collage por capas. Titular en mayúscula inicial, bold condensado, máx.
   2 líneas.
6. **Formato** — uno de la tabla, con el aspect ratio declarado en el prompt.
7. **Evitar** — logos de terceros, texto generado ilegible, manos u ojos deformes, marcas
   de agua.

> **Revisar antes de publicar:** las 4 piezas ya generadas con IA que están guardadas como
> referencia **no traen el precio bilingüe** USD · COP; una tiene un número mal generado; y
> dos usan mecánica de "Puntos" (Loyalty/Rewards) **no validada como parte del producto de
> Trip**. Sirven como referencia de estilo, no de producto, y ninguna está aprobada para
> publicar tal cual.

---


