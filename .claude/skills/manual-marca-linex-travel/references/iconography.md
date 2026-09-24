# Iconografía — Font Awesome Pro, Classic Regular

## Principio

El markup no cambia nunca. Lo único que cambia entre entornos es **cómo se carga la
librería**, y eso vive en `assets/brand/brand.json → icons`. Así, cuando se resuelva la
licencia Pro, no hay que reescribir ninguna pieza ya entregada.

```html
<i class="fa-regular fa-calendar" aria-hidden="true"></i>
```

- Familia: `classic` (implícita — no escribir `fa-classic`)
- Estilo: `regular` → prefijo `fa-regular`
- Nunca mezclar con `fa-solid`, `fa-light`, `fa-thin`, `fa-duotone` ni `fa-sharp`

`fa-brands` es la excepción legítima: logos de terceros (Visa, Google, WhatsApp) solo
existen en esa familia.

## Modos de carga

Leer `brand.json → icons.mode` y actuar en consecuencia.

### `kit-cdn`

Kit propio con iconos Pro habilitados. Va en el `<head>`, antes del CSS de la pieza:

```html
<script src="https://kit.fontawesome.com/YOUR_KIT_CODE.js" crossorigin="anonymous"></script>
```

Sustituir `YOUR_KIT_CODE` por el código real desde `brand.json → icons.kitCode`. **El código
real nunca va en un repositorio público ni en una skill que se distribuya**: es consumo
directo contra la cuenta de quien lo generó, sin necesidad de más credenciales.

Es el modo para prototipos, landings y cualquier pieza web. El embed es siempre un
`<script>` aunque el kit esté configurado como Web Font — el script inyecta el CSS.

**Si un icono sale vacío, revisar en este orden:**

1. **Restricción de dominios del kit.** Si el kit limita dominios y la pieza se abre fuera
   de esa lista, los iconos no pintan y no hay error en consola. Es la causa más común y la
   que más tiempo hace perder, porque parece un problema del icono.
2. **Nombre del icono.** Verificar en fontawesome.com. Un nombre inexistente falla en
   silencio igual que el caso anterior.
3. **Estilo no incluido en el subset.** Si el kit solo tiene Classic Regular activo y el
   icono se pidió en otro estilo, no está en el kit.

Nunca sustituir por `fa-solid` para que "se vea": Regular es decisión de marca y el cambio
silencioso se propaga a producción.

### `free-cdn-fallback` — solo emergencia

```html
<link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.7.2/css/all.min.css">
```

El CDN gratuito trae un set de Classic Regular muy reducido. Con el kit disponible, este
modo no tiene razón de uso.

### `kit-npm` — recomendado para React

Los iconos Pro solo se distribuyen por paquete de kit:

```js
import { faCalendar } from '@awesome.me/kit-YOUR_KIT_CODE/icons/classic/regular';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';

<FontAwesomeIcon icon={faCalendar} />
```

Requiere el API token de la cuenta en un `.npmrc` local o en variables de entorno del CI.
El token nunca va al repositorio.

### `self-hosted`

CSS y webfonts descargados y servidos desde el propio dominio. Apuntar `stylesheetUrl` a la
ruta pública del `all.min.css`.

## Tamaños

Siempre por token, nunca px suelto ni las clases `fa-lg` / `fa-2x`:

```css
.icon-sm { font-size: var(--p-icon-size-sm); }   /* 16 */
.icon-md { font-size: var(--p-icon-size-md); }   /* 20 */
```

`xs 12 · sm 16 · md 20 · lg 24 · xl 32`

Dentro de componentes, usar el token del componente: `--c-button-md-icon-size`,
`--c-input-control-icon-size-default`, `--c-tag-icon-size`.

## Color

El icono hereda `currentColor` por defecto. Cuando necesite color propio, usar la rama
`icon` de la capa semántica (`--s-color-icon-neutral-default`,
`--s-color-icon-primary-default`), no la rama `text`.

## Accesibilidad

- Decorativo (acompaña texto visible): `aria-hidden="true"`.
- Portador de significado (botón solo-icono): `aria-label` descriptivo en el botón.
- Nunca un icono como único indicador de estado. Error = icono **y** color **y** texto.

## Nombres de iconos frecuentes en travel

Verificar siempre en fontawesome.com antes de usar uno que no esté en esta lista — un nombre
inventado falla silenciosamente.

`fa-plane` · `fa-plane-departure` · `fa-plane-arrival` · `fa-hotel` · `fa-bed` · `fa-car` ·
`fa-suitcase-rolling` · `fa-calendar` · `fa-calendar-days` · `fa-location-dot` ·
`fa-magnifying-glass` · `fa-user` · `fa-users` · `fa-credit-card` · `fa-ticket` · `fa-star` ·
`fa-circle-check` · `fa-circle-exclamation` · `fa-circle-info` · `fa-chevron-down` ·
`fa-chevron-right` · `fa-xmark` · `fa-filter` · `fa-arrow-right-arrow-left`
