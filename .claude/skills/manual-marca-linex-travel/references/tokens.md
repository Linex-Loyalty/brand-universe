# Tokens — Nomad DS

## Cómo consultar

No abras `assets/tokens.json` completo (228 KB, ~1900 hojas). Usa el script:

```bash
python3 scripts/build_css_vars.py --list semantics.color.text     # ver una rama resuelta
python3 scripts/build_css_vars.py --grep dialog                   # CSS de un componente
python3 scripts/build_css_vars.py --resolve color.surface.primary.default   # un valor
python3 scripts/build_css_vars.py -o vars.css                     # todo
```

## Convención de nombres CSS

| Capa en JSON | Prefijo CSS | Ejemplo |
|---|---|---|
| `primitives` | `--p-` | `--p-color-azul-violeta-500` |
| `semantics` | `--s-` | `--s-color-text-neutral-default` |
| `components` | `--c-` | `--c-button-primary-background-hover` |

El camelCase del JSON se convierte a kebab-case: `azulVioleta` → `azul-violeta`,
`closeButton` → `close-button`.

## Capa semántica — catálogo

Las escalas de color siguen el patrón `subtlest → subtle → muted → default → strong → stronger`
(no todas las ramas tienen los seis niveles).

| Grupo | Ramas |
|---|---|
| `surface` | base, neutral, primary, secondary, success, error, warning |
| `text` | neutral, primary, secondary, link, success, error, warning |
| `border` | neutral, primary, secondary, success, error, warning |
| `icon` | neutral, primary, secondary, success, error, warning |
| `background` | default, subtle, inverse |
| `focus` | primary, secondary, error |

Valores de referencia (para reconocerlos, no para copiarlos a mano):

- `--s-color-surface-primary-default` = `#5B5CFF`
- `--s-color-text-neutral-default` = `#344054`, `-strong` = `#1D2939`, `-muted` = `#475467`
- `--s-color-text-link-default` = `#4040B3`
- `--s-color-text-error-default` = `#DC362E`

### Tipografía

Familia única: **Figtree** (`--p-font-families-primary`). El script compone shorthands listos:

```css
font: var(--s-typography-body-md-regular);   /* 400 16px/22px 'Figtree', sans-serif */
font: var(--s-typography-heading-lg-bold);   /* 700 48px/56px */
```

Escalas: `heading-{sm,md,lg,xl,2xl}` y `body-{xs,sm,md,lg,xl}`, cada una en
`regular | medium | semibold | bold`.

### Sombras

Vienen despiezadas en el JSON (x/y/blur/spread/color, a veces en dos capas). El script
también emite el shorthand compuesto — usa ese:

```css
box-shadow: var(--s-shadow-md);   /* 0px 4px 8px -2px rgba(0,0,0,.1), 0px 2px 4px -2px rgba(0,0,0,.06) */
```

Disponibles: `xs, sm, md, lg, xl, dialog`.

### Espaciado, radios e iconos

- Espaciado: `--p-space-*` (0 a 200) y los semánticos de layout `--p-layout-gap-{xs..3xl}` /
  `--p-layout-padding-{xs..3xl}`.
- Radios: `--p-border-radius-{none,xs,sm,md,lg,xl,2xl,3xl,full}` (md = 8px).
- Iconos: `--p-icon-size-{xs,sm,md,lg,xl}` = 12/16/20/24/32 px.

## Errores frecuentes

**Saltarse la capa.** `--p-color-azul-violeta-500` donde correspondía
`--s-color-surface-primary-default`. Funciona igual hoy y rompe el theming mañana.

**Inventar un token que suena plausible.** `--s-color-surface-primary-light` no existe; la
escala usa `subtle`/`subtlest`. Verificar con `--list` antes de escribir.

**Descomponer un shorthand a mano.** Si el script ya emite `--s-shadow-md`, no armes el
`box-shadow` sumando las cinco partes.

**Usar el token de componente equivocado.** Los componentes tienen tokens por variante Y por
tamaño: `--c-button-md-padding-x` es distinto de `--c-button-sm-padding-x`. Revisar con
`--grep button` antes de asumir.
