# Manual de Marca · Linex Travel

Sitio estático, sin dependencias ni build. Se abre con doble clic en `index.html`.

## Qué es

Las 15 secciones del manual de marca de Linex Travel, construidas el 17 de
septiembre de 2026 a partir del documento oficial de la marca —*Manual de marca
Linex-Ultragroup OFICIAL*, 28 páginas, del 10 de septiembre de 2026—.

**Ese PDF no está en el repositorio y se puede borrar.** Es fuente de consulta,
no material distribuible: todo lo que servía quedó aquí y en `brand-tokens.json`.

**El orden no es el del PDF.** El documento oficial abre por lo conceptual; aquí
se abre por lo visual, que es lo que más se consulta. Es la misma estructura de
los manuales de Linex Trip y Linex Go, por decisión del administrador de marca
del 15 de septiembre de 2026: las mismas quince secciones, en los mismos tres
bloques y en el mismo orden, para que quien conoce un manual del grupo sepa
moverse en el otro sin volver a aprenderlo.

| Bloque | Secciones |
|---|---|
| A · Identidad visual | 01 a 07 |
| B · Quién es y cómo habla | 08 a 12 |
| C · Cómo se aplica | 13 a 15 |

## Lo que hay que saber antes de usarlo

Tres cosas que este manual dice y que conviene no descubrir a mitad de una pieza:

- **El color más reconocible de la marca no sirve para texto.** El Azul violeta
  `#5B5CFF` —el de la palabra *Travel*— da 3.69:1 sobre el fondo lavanda y no
  alcanza AA. El Azul violeta rellena; el Violeta escribe.
- **Sobre fondo oscuro no sirve ninguno de los dos violetas.** Ahí el texto va
  en blanco, Lavanda o Lila claro.
- **Los archivos del logotipo no están pintados con la paleta.** Es transitorio
  y está documentado en la sección 01: por decisión del dueño de marca mandan
  los archivos mientras se recolorean.

## Cómo se mantiene

- **`tools/sync-nav.js`** tiene la lista de las 15 secciones una sola vez y
  genera el menú lateral, el paginador y el índice de la portada. Si se renombra
  o se agrega una sección, se edita ahí y se corre: `node tools/sync-nav.js`.
  Rellena solo lo que hay entre marcadores, así que es idempotente: correrlo dos
  veces seguidas no cambia nada.
- **`tools/plantilla.js`** es el armazón común de las páginas. Es referencia, no
  herramienta: no lo requiere nadie.
- **`assets/style.css`** son los 82 componentes compartidos con Trip y Go. Un
  manual nuevo no diseña componentes: hereda los 82 y cambia su `:root`.

## Los contrastes

Ninguno se escribió a mano. Todos salen de `tools/contraste.js` en la raíz del
repositorio, con la fórmula de WCAG 2.1, y una prueba automática los recalcula.

```bash
node -e "const{contraste}=require('../tools/contraste.js');console.log(contraste('#5B5CFF','#DDE1FF').toFixed(2))"
```

## Qué no está aquí

Los fuentes de diseño —`.ai`, `.psd`— no se distribuyen en este repositorio. Se
piden por separado.

Los logotipos de las marcas representadas —Hertz, Dollar, Thrifty y Walt Disney
World— tampoco están: son marcas de terceros con sus propias condiciones de uso.
No se recrean ni se toman de internet.
