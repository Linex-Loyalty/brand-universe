# Trabajo 3 · Escribir con voz de marca

## Primero: ¿esta marca tiene voz?

Mira `voz` en `brand-tokens.json`.

**Si es `null`, no escribas.** Di qué falta: principios de voz, claim aprobado,
vocabulario. Hoy solo **Linex Trip** y **Linex Go** tienen voz documentada; las
otras seis no.

Improvisar un tono plausible para Marketplace es exactamente el fallo que este
sistema existe para evitar — y es peor que en color, porque un tono inventado
nadie lo detecta hasta que ya circuló.

## A quién le hablas

**Trip** le habla al viajero final, de tú, *como un viajero le habla a otro*.
Más directa que Go.

**Go** le habla a la agencia — **nunca al viajero final**. Un CTA como "Reserva
tus vacaciones" en una pieza de Go está mal no por cómo suena, sino por a quién
le habla: ese es el cliente de la agencia, y competir por él sería competir con
quien nos compra.

En Trip, elige **un** arquetipo antes de escribir: el planificador digital, el
decisor rápido o la familia viajera. *Una pieza que le habla a los tres no le
habla a ninguno.*

En Go hay seis interlocutores, y **ninguno es el viajero final**. Sus fichas
están sin perfilar: si necesitas las objeciones o el lenguaje a evitar de una
audiencia concreta, hoy no hay de dónde sacarlos. Dilo.

## Los claims tienen estado

**Linex Trip** — *"Viaja Inteligente"* es el **único aprobado**. Acompaña al
nombre, nunca lo reemplaza: una pieza puede llevar el logo sin el claim, nunca
el claim sin la marca. **No es un CTA**, no va dentro de un botón. Va en cierre
de pieza, bio de redes, firma o cabecera de campaña; en una tarjeta de producto
no aporta, ahí manda el precio.

Hay tres claims secundarios **pendientes de aprobación**. No se usan como si ya
lo estuvieran.

**Linex Go** — el eslogan es *"Soluciones que impulsan tu agencia de viajes"*,
y se usa **completo, sin recortar ni parafrasear**. El concepto rector es *"Tu
aliado en cada venta"*. La lista de claims autorizados con su evidencia sigue
sin aprobarse: hoy el manual dice bien qué no se puede afirmar, pero no la
contraparte.

## Lo que nunca se promete

- Superlativos sin garantía real y reclamable ("el mejor precio",
  "garantizado", "la mejor plataforma", "la opción número uno")
- Urgencia falsa: cupos, cuentas regresivas o "última oportunidad" sin vigencia
  verdadera
- Disponibilidad que no se cumple: "24/7", "respuesta inmediata", "asesor
  personal" si atiende un equipo rotativo
- Precio incompleto: la cuota sin el total, el total sin la moneda, o un valor
  que cambie al final

**Cómo se reemplaza un superlativo:** fuera el adjetivo, dentro el hecho
verificable. *"Tarifas negociadas con más de X operadores"* en vez de *"los
precios más bajos"*.

**La prueba de fuego:** si alguien de servicio al cliente no puede sostener la
promesa con lo que hoy existe, la pieza no sale.

## Registro

- **Trato de tú.** La marca en primera del plural ("te acompañamos"); el asesor
  en primera del singular y con su nombre ("soy Camila").
- **Frase corta, voz activa, una idea por frase.**
- **Sin mayúscula sostenida** y sin exclamaciones en promesas de precio o
  disponibilidad.
- **Emojis** solo en redes y con moderación, nunca en cadena. **Prohibidos** en
  mensajes de problema, en precios y en documentos.
- **Precio** con las dos monedas y separador de miles: `$112 USD · $450.000 COP`.
- **Español de Colombia**, sin modismos que no se entiendan afuera y sin calcos
  del inglés ("aplicar a la promoción", "bookear").
- **Sin jerga técnica** de cara al viajero: nada de GDS, PNR, inventario.

## Cuando algo sale mal — el orden fijo

1. **Qué pasó**, en la primera línea y sin rodeos. Nunca una disculpa larga que
   retrase el dato.
2. **Qué significa para ti**: cómo afecta el viaje, el dinero o la fecha.
3. **Qué estamos haciendo**, con la opción concreta ya resuelta si existe.
4. **Qué necesitamos de ti**, si hace falta: una sola acción, clara.
5. **Cuándo vuelvo a escribirte**, con un momento real.

Nunca *"Lamentamos los inconvenientes ocasionados"*, *"Por políticas de la
empresa"* ni *"Como le informamos previamente"*. Se pide perdón por lo
concreto: *"perdón por el madrugón perdido, ya te moví el traslado"*.

## Los CTA salen de la biblioteca

No se inventa un verbo. **Uno solo por pieza**, en imperativo y con beneficio
concreto, en mayúscula inicial. La lista completa está en `voz.cta` del JSON.

- **Trip** — Buscar vuelos · Ver destinos · Cotiza tu viaje · Reserva ahora ·
  Ver disponibilidad · Paga en cuotas · Habla con un asesor · Escríbenos por
  WhatsApp · Ver mi reserva
- **Go** — Consulta el portafolio · Cotiza para tus clientes · Solicita
  condiciones para tu agencia · Guarda esta guía · Agenda una demo de la
  plataforma · Conversa con nuestro equipo

Los de relación en Go suelen ir como acción **secundaria**, en contorno:
acompañan a un CTA comercial, no compiten con él.

Evita "Click aquí", "Enviar" genérico, mayúsculas sostenidas o exclamaciones.

## Antes de entregar

**Pasa lo que escribiste por el Trabajo 2.** El copy sale ya auditado contra su
propia marca: contraste del CTA, vocabulario, naming y claims con su estado
real. Si el botón que propusiste no cumple contraste, entérate tú antes que
quien lo va a publicar.
