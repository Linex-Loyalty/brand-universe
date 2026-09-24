---
name: manual-marca-linex-travel
description: Manual de marca de la familia Linex Travel — Linex Travel (marca madre), Linex Go y Linex Trip — para diseñar y construir piezas con los tokens reales de Nomad DS y la paleta de cada marca — componentes React, prototipos HTML interactivos, mailing, landing pages y banners. Úsala siempre que se pida una pantalla, flujo, componente, prototipo, landing, mailing, banner o cualquier pieza visual que nombre Linex, Linex Travel, Linex Go o Linex Trip, cuando pregunten qué color, botón o combinación usar en alguna de esas marcas, y también cuando se mencionen tokens, botones, inputs, modales o calendarios del design system o iconos Font Awesome. Aplícala aunque el pedido suene simple, porque el valor está en que colores, tipografías y espaciados salgan del sistema y del manual de cada marca, no de valores inventados.
---

# Manual de marca — Linex Travel

Una familia, tres marcas, un solo design system:

| Marca | id | Primario | Acción (CTA) | Texto sobre la acción |
|---|---|---|---|---|
| Linex Travel | `linex-travel` | Nomad DS (azulVioleta) | Nomad DS | Nomad DS |
| Linex Go | `linex-go` | Petroleum `#012D33` | Coral `#FF725E` | Petroleum |
| Linex Trip | `linex-trip` | Trip Blue `#00145A` | Sky Blue `#00B5F5` | Trip Blue |

Los hex están aquí para reconocer la marca, no para copiarlos: en la pieza salen del script.

Esta skill produce interfaces que usan los tokens reales de Nomad DS en lugar de valores
aproximados. Ese es el punto: un `#5B5CFF` escrito a mano se ve bien en la demo y rompe la
consistencia en producción. Todo color, tamaño, radio, sombra y tipografía debe salir de
`assets/tokens.json`.

## Flujo

### 0. Identificar la marca

- Nombra **Linex Go** o **Linex Trip** → esa marca.
- Nombra **Linex Travel**, o el pedido es de producto Nomad DS sin submarca → `linex-travel`.
- Dice solo "Linex" y no hay forma de saber cuál → preguntar cuál de las tres antes de
  construir. Una pregunta, no un cuestionario. Elegir mal la marca invalida la pieza entera.
- Pide varias marcas a la vez (ej. el mismo banner para Go y Trip) → una pieza por marca,
  cada una generada con su `--brand`.

Después, leer las reglas de la marca: `references/brands.md` (sección de esa marca). Son
cortas y son las que más se rompen: qué color nunca rellena un botón, qué color solo va
sobre fondo oscuro.

### 1. Leer el manifiesto de marca

Antes de generar cualquier pieza, leer `assets/brand/brand.json`. Contiene la tipografía y
cómo se cargan los iconos. El logo está fuera del alcance de esta skill: se gestiona por
otro medio. Si una pieza lo necesita, dejar el espacio marcado y decirlo en la entrega — nunca
fabricarlo. Detalle en `references/brand.md`.

### 2. Generar las variables CSS

```bash
python3 scripts/build_css_vars.py --brand linex-go -o vars.css     # o linex-trip / linex-travel
```

Resuelve los ~1900 tokens y sus alias a custom properties **con la paleta de la marca ya
aplicada**. Go y Trip pisan tokens semánticos (y los pocos de componente que lo requieren)
antes de resolver alias, así que los componentes del DS heredan la marca en cascada: el
`--c-button-primary-background-default` de Go ya es coral y su texto ya es petroleum. Sin
`--brand` sale Linex Travel.

Además del DS, cada submarca emite su paleta con nombre propio:

- `--b-color-<nombre>` (ej. `--b-color-sand`, `--b-color-yellow`)
- `--b-role-<rol>` (ej. `--b-role-action`, `--b-role-accent`)

Usarlos solo para lo que el DS no cubre (eyebrows en el color de detalle, fondos editoriales).
Si existe un semántico, va el semántico.

```bash
python3 scripts/build_css_vars.py --brands                          # marcas disponibles
python3 scripts/build_css_vars.py --brand linex-trip --report       # paleta, reglas, contrastes
```

El script avisa por stderr de los **valores derivados** (hover/pressed de la acción): el
manual no los define y se calculan aclarando la acción para no perder contraste con el
texto oscuro. Mencionarlos en la entrega como pendientes de validar con marca.

Para trabajar en algo puntual:

```bash
python3 scripts/build_css_vars.py --grep button          # solo tokens de botón
python3 scripts/build_css_vars.py --list semantics.color.text
python3 scripts/build_css_vars.py --resolve color.surface.primary.default
```

No leas `tokens.json` completo: son 228 KB. Consulta lo que necesites con `--grep` o `--list`.

La copia local es la fuente, a propósito: mantiene los resultados reproducibles. Para saber
si se quedó atrás del repo de Theming Core está `scripts/check_ds_version.py`, que corre en
la máquina de la persona (el contenedor del chat no alcanza `dev.azure.com`). Si alguien
reporta que una pieza no coincide con el DS, ese es el primer lugar a mirar.

### 3. Elegir el modo de salida

| Piden | Entrega | Detalle en |
|---|---|---|
| Pantalla, flujo, demo navegable | Prototipo HTML interactivo (un archivo) | abajo, "Prototipos" |
| Componente o pantalla para el repo | React + CSS custom properties | abajo, "React" |
| Mailing, landing, banner | HTML de marketing | `references/marketing.md` |

Ante ambigüedad, prototipo HTML interactivo: es lo más rápido de revisar y lo que mejor
sostiene una conversación con PM/PO.

### 4. Construir

Consultar las referencias según lo que se esté armando:

- `references/brands.md` — paleta, roles y reglas de Linex Go y Linex Trip. **Leer siempre
  que la pieza sea de una submarca.**
- `references/tokens.md` — qué capa usar y cuál no tocar. **Leer siempre.**
- `references/components.md` — recetas de los componentes ya tokenizados en el DS.
- `references/iconography.md` — Font Awesome Pro Classic Regular.
- `references/brand.md` — tipografía y el criterio ante el logo (fuera de alcance).
- `references/marketing.md` — mailing y landings (restricciones de email).

## Regla de oro: la cadena de tokens

Los tokens van `primitives → semantics → components`. Consumir siempre lo más específico
disponible:

1. **Componentes** (`--c-button-primary-background-default`) — si el componente existe en el
   DS, sus tokens ya resuelven estados, tamaños y variantes. Usarlos tal cual.
2. **Semánticos** (`--s-color-text-neutral-default`, `--s-shadow-md`) — para todo lo que no
   sea un componente del DS: layout, secciones, piezas nuevas.
3. **Marca** (`--b-color-sand`, `--b-role-accent`) — solo en Go/Trip y solo para roles que el
   DS no tiene (detalle, fondos editoriales). Nunca para reemplazar un semántico.
4. **Primitivos** (`--p-color-azulVioleta-500`) — último recurso, y solo cuando no exista un
   semántico equivalente. Un primitivo en el código es señal de que falta un token semántico:
   vale la pena decirlo en la entrega.

Nunca escribir un hex, un `px` de espaciado o un `font-size` literal si existe token.
Si algo no tiene token, decirlo explícitamente en lugar de inventar el valor.

## Prototipos HTML interactivos

Partir de `assets/templates/prototype.html`. Un solo archivo, sin build. Reglas:

- Pegar el bloque `:root` generado por el script — no una versión recortada a ojo.
- Interacción real: los estados (hover, focus, disabled, loading, error, vacío) se
  implementan, no se describen. Un prototipo que no responde al click no sirve para validar.
- Estados vacíos y de error incluidos por defecto. Son los que más discusión destraban con
  producto y los que más se olvidan.
- Responsive con `max-width: 100%`, flex/grid y unidades relativas.
- Nada de `localStorage` ni `sessionStorage` si la pieza va a correr como artifact en chat:
  usar estado en memoria.

## React

- Custom properties CSS, no valores hardcodeados: `background: var(--c-button-primary-background-default)`.
- Un archivo por componente, props sin valores requeridos sin default, export default.
- Iconos: seguir el modo definido en `brand.json` (ver `references/iconography.md`).
- No inventar nombres de componentes del DS. Los que existen tokenizados son:
  button, calendar, carousel, checkbox, combobox, dialog, divider, dropdown, form, gallery,
  input, menu, progress, radio, select, slider, spinner, tab, tag, text, tooltip.
  Si se pide algo fuera de esa lista, construirlo con tokens semánticos y avisar que es
  un componente nuevo, no uno del DS.

## Iconos

Font Awesome Pro, familia Classic, estilo Regular. El markup es siempre el mismo:

```html
<i class="fa-regular fa-calendar" aria-hidden="true"></i>
```

Lo único que cambia entre entornos es cómo se carga la librería, y eso está en
`brand.json → icons`. **Modo activo: `kit-cdn`.** Requiere completar `kitCode` en el
manifiesto con el código real de tu cuenta de Font Awesome Pro — el placeholder
`YOUR_KIT_CODE` no carga iconos por sí solo. En prototipos y landings va el script del kit
en el `<head>`; en React, el paquete npm del mismo kit. Detalle en
`references/iconography.md`.

Si un icono sale vacío, la causa más probable **no** es el nombre sino la restricción de
dominios del kit: no falla, simplemente no pinta. Verificar eso antes de cambiar el icono.

Tamaños: usar `--p-icon-size-xs|sm|md|lg|xl` (12/16/20/24/32 px), nunca un px suelto.

## Logo

Fuera del alcance de esta skill. No fabricar uno, no reconstruirlo tipografiando el nombre
de la marca, no reusar un símbolo de otra marca. Si una pieza lo necesita, dejar el espacio
marcado y mencionarlo en la entrega.

## Accesibilidad

No es un extra al final; es parte de la entrega:

- Contraste mínimo 4.5:1 en texto. Los pares de `text` sobre `surface` de la capa semántica
  ya cumplen — combinaciones nuevas hay que verificarlas. En submarcas, `--report` lista
  todos los pares de la paleta con su ratio.
- Ojo en Go y Trip: la acción (coral / sky blue) sobre fondo claro da menos de 3:1 como
  borde de componente. El botón se lee por su texto, pero en campos, chips o toggles la
  acción no puede ser el único indicador: sumar borde en el primario de la marca.
- Foco visible siempre: usar los tokens `focusRing` del componente, no `outline: none`.
- Targets táctiles de 44x44 px mínimo.
- Labels reales en formularios, `aria-hidden` en iconos decorativos, jerarquía de headings
  coherente.

## Antes de entregar

Pasar el verificador. Detecta las dos fallas que más se repiten: nombres de token que suenan
plausibles pero no existen, y hex escritos a mano.

```bash
python3 scripts/check_tokens.py mi-prototipo.html
python3 scripts/check_tokens.py src/Button.jsx --no-literals
python3 scripts/check_tokens.py landing-trip.html --brand linex-trip   # acepta los --b-* de esa marca
```

Un `var()` inexistente no rompe nada visiblemente — el navegador lo ignora y el elemento
queda con el color por defecto. Por eso se verifica en vez de confiar en que se ve bien.

- [ ] Marca correcta: `--brand` usado al generar y al verificar
- [ ] Reglas de la marca respetadas (ver `references/brands.md`): el primario no rellena
      botones, el color de detalle solo sobre el primario, la acción nunca como texto sobre claro
- [ ] `check_tokens.py` sin hallazgos
- [ ] Cero hex, cero px de espaciado y cero font-size literales fuera del bloque `:root`
- [ ] Logo: espacio marcado y mencionado si la pieza lo necesita — nunca fabricado
- [ ] Estados hover/focus/disabled/error/vacío implementados donde aplique
- [ ] Iconos en `fa-regular`, con tamaño por token
- [ ] Mencionar en la entrega: marca usada, valores derivados sin validar, tokens que
      faltaron, iconos que no renderizan, o que falta el logo si la pieza lo necesitaba

Ese último punto importa: la entrega honesta sobre lo que faltó es más útil que una pieza
que aparenta estar completa.
