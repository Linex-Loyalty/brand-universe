# Trabajo 2 · Auditar una pieza

## Los tres veredictos

No dos. El tercero es el que hace útil a este sistema.

| | Significa |
|---|---|
| **✓ cumple** | Hay una regla y la pieza la respeta |
| **✗ viola** | Hay una regla y la pieza la rompe |
| **? sin regla documentada** | **No existe regla todavía** |

Decir "no hay regla para esto" es información. Fingir que sí la hay es el
fallo que este sistema existe para evitar. **Nunca conviertas tu criterio en
una regla de marca.**

## Cada hallazgo cita su fuente

Nunca *"esto se ve mal"*. Siempre *"viola X, documentado en
`manual-linex-go/01-logotipo.html`"*. Si no puedes citar dónde está escrita la
regla, el veredicto es **?**, no ✗.

## Qué revisar

### Contraste — se calcula, nunca se estima

```bash
node -e "const{contraste}=require('./tools/contraste.js');console.log(contraste('#FF725E','#FFFFFF').toFixed(2))"
```

Umbrales en `oficio-marca.md`. **Escribe siempre el ratio obtenido.**

Dos cautelas aprendidas en este proyecto:

- **No copies un ratio de un manual: recalcúlalo.** Tres cifras del manual de
  Trip quedaron viejas tras el cambio de color del 14 de septiembre y siguen
  medidas contra el Índigo anterior (dice 17.85, es 16.83). El JSON trae los
  reales.
- **El contraste es simétrico.** Si un manual afirma dos valores distintos
  para el mismo par, uno está mal. En Trip pasa: 7.59 y 7.16 son el mismo par.

### Reglas duras de color

Sácalas de `regla` en `brand-tokens.json`, no de memoria. Las que más se rompen:

- **Linex Go** — el coral es **solo de la acción**: nunca destaca un dato,
  nunca es texto sobre claro (2.55:1), nunca lleva texto blanco encima
  (2.69:1), nunca es fondo del logotipo. La arena solo vive sobre el petróleo
  (10.23:1 ahí, 1.37:1 sobre blanco frío). El petróleo nunca rellena un botón.
  El coral claro es superficie, no tinta (1.15:1).
- **Linex Trip** — *el Celeste actúa, el Azul Trip habla.* El Celeste nunca es
  texto sobre claro (2.35:1); el Azul nunca rellena un botón. El Amarillo vive
  **solo sobre el Azul Trip**: sobre blanco da 1.36:1. Sin excepción por
  tamaño, grosor ni por ser un ícono. La Lavanda no se usa como texto (1.29:1).
- **Linex Loyalty** — el Verde `#C5F04A` da 1.32:1 sobre blanco. Necesita
  fondo oscuro, y Loyalty aún no tiene base definida: cualquier pieza que lo
  use sobre claro es ✗.

### Proporción de uso

Dos porcentajes de Go son regla, no descripción: **coral ≤ 12%** y **arena ≤
4%**. Por encima, el coral deja de ser señal y se vuelve decoración.

En Trip las proporciones son **propuesta de guía visual del manual**, no cifra
aprobada por negocio: orientan, no se auditan como regla dura.

### Logotipo

- ¿El archivo existe en `Logos/logos-oficiales/`? Si no, la pieza usa algo que
  no es el logo oficial → ✗.
- Zona de seguridad = la altura de la "L", por los cuatro costados, medida
  desde el trazo y no desde la caja tipográfica.
- Tamaño mínimo: 120 px digital. Impreso: 30 mm (Trip) · 25 mm (Go).
- **Fondos permitidos** en `logo_fondos` del JSON. Go: blanco frío, blanco
  cálido y petróleo —este último **solo con la negativa, que no existe**.
  Trip: blanco, lavanda y azul trip; nunca sobre celeste sólido.
- **Go:** nunca el "Go" en otro color que coral o petróleo claro, nunca el
  "Linex" en negro, nunca rotado, enmarcado ni con efectos, y **nunca la "G"
  aislada ni "Go" solo** — *Go no es una marca por sí misma.*
- **Trip:** el logotipo vigente es solo el wordmark. **No hay isotipo.** Las
  siete propuestas de símbolo son exploración abierta: si una pieza usa un
  símbolo, es ✗.
- **Aliados:** siempre en su zona y **menores que Linex Go**. Nunca
  recoloreados, reproporcionados ni fusionados con la marca.

### Tipografía

El registro correcto para el canal: Segoe UI + Calibri en Office, Geist en web
y producto. **Sin mayúscula sostenida** en ningún canal — excepto siglas
propias (IVA, COP, USD) y el wordmark si el logotipo lo exige.

Máximo dos pesos por pieza.

### Iconografía y radios

Font Awesome Pro · Classic · Regular. Solid solo dentro de contenedor relleno,
bajo 4 mm en impreso, o familia Brands.

Radios: `6 · 12 · 16 · 24 · 999`. **Un radio fuera de la escala es ✗.** Y el
radio total significa dato: si un pill se comporta como botón, es ✗.

### Nombre

**"Linex Trip"**, **"Linex Go"**, con espacio. La forma compacta solo en
dominio, correo, handle, hashtag y rutas. `LinexGo` en un titular es ✗.

**Sin ™ ni ®** mientras `legal.admite_simbolo_marca` sea `false`: hoy sería
falso para las dos.

### Vocabulario

De `voz.vocabulario` en el JSON. En Go, tres palabras cambian quién manda en
la relación: "proveedor", "catálogo" y "tus clientes" — se dice **aliado**,
**portafolio** y **clientes de tu agencia**.

### Audiencia

En Go, una pieza que le habla al viajero final es ✗ salvo que esté autorizada
y cofirmada con la agencia. *Competir por el cliente de quien nos compra es
competir con quien nos compra.* Los CTA "Reserva tus vacaciones", "Compra tu
viaje" y "Vive esta experiencia" están prohibidos por eso, no por cómo suenan.

### Datos y promesas

- Toda cifra lleva **periodo y fuente** en la misma pieza. Si falta uno de los
  dos, la cifra no se publica.
- Vigencia y moneda son los campos que más se olvidan: van siempre visibles.
- Nada de urgencia falsa: cupos o cuentas regresivas sin vigencia real.

## Formato de salida

Agrupa por veredicto, lo más grave primero. Para cada hallazgo: qué, dónde en
la pieza, la regla citada con su archivo, y —si aplica— el número medido.

Cierra con **lo que no pudiste evaluar y por qué**. Un informe que no dice
dónde no miró se lee como si hubiera mirado todo.
