# Componentes tokenizados

Estos 21 componentes ya tienen tokens propios en `components`. Úsalos tal cual; no los
reconstruyas con semánticos.

`button · calendar · carousel · checkbox · combobox · dialog · divider · dropdown · form ·
gallery · input · menu · progress · radio · select · slider · spinner · tab · tag · text · tooltip`

Cualquier otra cosa (cards, headers, hero, steppers, tablas) se arma con la capa **semántica**
y se declara en la entrega como componente nuevo.

## Estructura típica

Casi todos separan **tamaño** de **variante**:

- Tamaño: `sm | md | lg` (a veces `xl`) → padding, gap, tipografía, iconSize
- Variante: `primary | secondary | tertiary | error | ghost | link` → colores por estado
- Estados por variante: `default | hover | focused | disabled` (a veces `pressed`, `active`)

Antes de escribir cualquier componente:

```bash
python3 scripts/build_css_vars.py --grep button
```

## Botón

```css
.btn {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  gap: var(--c-button-gap);
  border-radius: var(--c-button-border-radius);
  border: none;
  cursor: pointer;
  transition: background var(--p-duration-200) var(--p-easing-ease-out);
}

/* tamaño */
.btn--md {
  padding: var(--c-button-md-padding-y) var(--c-button-md-padding-x);
  font: var(--c-button-md-typography-font-weight)
        var(--c-button-md-typography-font-size)/var(--c-button-md-typography-line-height)
        var(--c-button-md-typography-font-family);
}
.btn--md .fa-regular { font-size: var(--c-button-md-icon-size); }

/* variante */
.btn--primary {
  background: var(--c-button-primary-background-default);
  color: var(--c-button-primary-text-default);
}
.btn--primary:hover  { background: var(--c-button-primary-background-hover); }
.btn--primary:disabled {
  background: var(--c-button-primary-background-disabled);
  color: var(--c-button-primary-text-disabled);
  cursor: not-allowed;
}
.btn--primary:focus-visible {
  outline: none;
  box-shadow: 0 0 0 var(--c-button-primary-focus-ring-spread) var(--c-button-primary-focus-ring-color);
}
```

Variantes disponibles: `primary`, `secondary`, `tertiary`, `error`, `ghost`, `link`, más
`primary-outline` / `error-outline` y `group` para botones agrupados.

## Input

Dos ramas: `control` (la caja) y `field` (label, helper text, mensaje de error).

```css
.input {
  border-radius: var(--c-input-control-border-radius);
  border: var(--c-input-control-border-width) solid var(--c-input-control-color-border-default);
  padding: var(--c-input-control-md-padding-y) var(--c-input-control-md-padding-x);
  gap: var(--c-input-control-gap);
  background: var(--c-input-control-color-background-default);
  color: var(--c-input-control-color-text-filled);
}
.input:focus  { border-color: var(--c-input-control-color-border-focus); }
.input[aria-invalid="true"] { border-color: var(--c-input-control-color-border-error); }
```

El label, el helper y el error salen de `--c-input-field-*`. No los tipografíes a ojo:
tienen tokens propios de tamaño y color.

## Tag

Tamaños `sm | md | lg | xl`; variantes `primary | neutral | success | error | warning`.

```css
.tag--success {
  background: var(--c-tag-success-background-default);
  color: var(--c-tag-success-text-default);
  border-radius: var(--c-tag-border-radius);
  gap: var(--c-tag-gap);
}
```

## Dialog

Tamaños `small | medium | large | full | drawer`, cada uno con `width` y `maxWidth` propios.

```css
.dialog-backdrop { background: var(--c-dialog-backdrop-color); backdrop-filter: blur(var(--c-dialog-backdrop-blur)); }
.dialog {
  background: var(--c-dialog-background);
  border-radius: var(--c-dialog-border-radius);
  box-shadow: var(--s-shadow-xl);
  width: var(--c-dialog-medium-width);
  max-width: var(--c-dialog-medium-max-width);
  max-height: var(--c-dialog-max-height);
}
```

Incluye `closeButton` (tamaño, posición, radio), `header`, `body`, `footer`, `gap`, `drag` y
`alert`. El botón de cierre tiene posición tokenizada (`top`/`right`): no lo posiciones a ojo.

## Cuando falta un token

Si el componente necesita algo que el DS no cubre, resolverlo con la capa semántica y
**decirlo en la entrega**: "el spacing interno de la card no tiene token, usé
`--p-layout-padding-lg`". Ese reporte es lo que alimenta la siguiente versión del DS.
