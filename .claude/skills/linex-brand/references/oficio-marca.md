# Oficio de diseño de marca y comunicación

Capa genérica: aplica a cualquier marca. Lo específico de esta constelación
está en `constelacion.md`.

## Contraste

Se calcula con la fórmula de WCAG 2.1, nunca a ojo. Umbrales:

| | AA (mínimo) | AAA (preferido) |
|---|---|---|
| Texto corrido | 4.5:1 | 7:1 |
| Texto grande (≥24 px regular o ≥18.66 px bold) | 3:1 | 4.5:1 |
| Objeto gráfico o control (WCAG 1.4.11) | 3:1 | — |

Un ícono es objeto gráfico y le basta 3:1. Una cifra es texto y necesita
4.5:1. **Cuando van juntos en la misma tarjeta, manda el 4.5:1.**

El contorno de un control también cuenta: si el relleno no alcanza 3:1 contra
el fondo de la página, el control necesita un filete que sí lo alcance.

**El contraste es simétrico.** `contraste(A, B)` y `contraste(B, A)` son el
mismo número por definición. Si un manual afirma dos valores distintos para el
mismo par, uno de los dos está mal.

**Un cambio de color invalida todos los ratios medidos contra él.** Cuando una
marca cambia su oscuro, cada contraste que lo usaba de fondo hay que
recalcularlo. Los números viejos sobreviven en las tablas y nadie los
cuestiona, porque un ratio escrito con dos decimales parece un hecho.

## Sistemas de color

Un color de acción funciona **por exclusividad**. Si el mismo color pinta un
botón en una pieza y un porcentaje en la siguiente, deja de responder la única
pregunta que tiene que responder de un vistazo: *¿dónde toco?*

- **La proporción es parte de la regla**, no una descripción. Un color de
  acción que ocupa más del ~12% deja de ser señal y se vuelve decoración.
- **Un color que aparece poco se nota cuando aparece.** Los colores de detalle
  viven en porcentajes de un dígito a propósito.
- **Un color claro y saturado sobre blanco casi siempre falla.** Amarillos,
  limas y cianes suelen quedar entre 1.2:1 y 2.5:1: no es que se lean mal, es
  que no se leen. Esos colores viven sobre fondo oscuro o no viven.
- **Un acento que solo funciona sobre oscuro necesita saber sobre cuál.** Una
  marca con acento claro y sin base oscura definida no tiene sistema todavía,
  tiene medio sistema.
- **Dos acentos con la misma luminosidad (L\*) se distinguen solo por tono.**
  Es la diferencia que peor sobrevive en un ícono pequeño, en impresión y para
  quien no distingue ciertos colores. Compara L\*, no solo ΔE.

## Jerarquía tipográfica

Una pieza con cuatro pesos distintos no se ve rica, se ve sin criterio.
**Máximo dos pesos por pieza.**

- **La mayúscula sostenida borra el perfil de la palabra** y obliga a leer
  letra por letra. Se enfatiza con peso o tamaño.
- Subrayado solo en enlaces, nunca como énfasis.
- Las cifras y precios en negrita, con separador de miles y la moneda visible.
- Un solo H1 por vista.

**La tipografía de trabajo la elige la restricción, no el gusto.** Si quien
produce el material diario son terceros con Office, la marca necesita fuentes
que ya estén instaladas. Una tipografía que hay que instalar se sustituye
sola, y se sustituye mal.

## Arquitectura de marca

- **Masterbrand** — una marca cubre todo.
- **Endorsed** — cada marca tiene identidad y una firma común la respalda.
- **House of brands** — marcas independientes sin relación visible.

En un modelo endorsed, la pregunta que hay que resolver por escrito es **qué
es central y qué decide cada marca**. Sin esa línea, en doce meses las marcas
derivan hasta parecer compañías sin relación. Y si dos marcas firman con el
mismo peso en una pieza comercial: *si las dos mandan, no manda ninguna.*

**Dos marcas hermanas no compiten entre sí.** No se comparan en copy, no se
posicionan como "mejor que" la otra, y nunca pelean por la misma palabra
clave: se quitan posiciones y le pagan dos veces al mismo clic.

## Convivencia con marcas de terceros

1. **Jerarquía** — la marca anfitriona siempre mayor y en posición dominante.
2. **Separación** — los terceros sobre fondo neutro, separados por espacio.
3. **No se modifican** — ni color, ni proporciones, ni encuadre.
4. **Zonas** — el anfitrión en la zona de mensaje, los terceros en su franja.
5. Si una marca exige su versión oficial, se respeta — pero sigue en su zona
   y en menor tamaño.

## Voz y tono

**La voz es constante; el tono es variable.** La voz no cambia por canal ni
por campaña. El tono cambia según el momento de quien lee.

Cada atributo de voz necesita su exceso escrito al lado, o no sirve: *claro*
sin "no es seco" produce texto de extracto bancario; *cercano* sin "no es
confianzudo" produce apodos y emojis en cadena.

**La prueba rápida:** si el texto podría firmarlo cualquier competidor,
todavía no suena a la marca.

## Claims

La diferencia entre un mensaje y un claim es **la evidencia**. Un mensaje
explica qué se hace; un claim afirma algo comparable, y por eso necesita
respaldo reclamable.

Cada pilar de valor necesita tres campos: la promesa, la prueba que la
sostiene, y **qué NO autoriza a decir**. El tercero es el que evita casi todos
los problemas.

**La prueba de fuego:** si alguien de servicio al cliente no puede sostener la
promesa con lo que hoy existe, la pieza no sale. Cada promesa que el producto
no cumple vuelve como reclamo.

## Accesibilidad más allá del contraste

- **El estado se escribe.** "Agotado" se escribe; un punto rojo no es
  información para todo el mundo, ni para quien imprime la pantalla.
- **Área táctil mínima 44 × 44 px** reales. El ícono puede ser chico; el área
  de toque no.
- **Texto alternativo** en toda imagen funcional.
- **El ícono nunca es el único portador del dato.**

## Cuando falta un activo

Se dice que falta. Se nombra el archivo que hace falta y quién lo produce. No
se aproxima, no se redibuja "provisionalmente" y no se deja el hueco en
blanco: **un pendiente rotulado se resuelve, uno disimulado se hereda.**

Y hay una diferencia que conviene marcar: un pendiente que impide producir no
es un pendiente más. Si falta la versión negativa de un logo y el fondo oscuro
es un fondo permitido, no es que falte un archivo — es que la papelería no se
puede imprimir.
