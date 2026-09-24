# Mailing y landing pages

## Mailing

El correo es el único contexto donde las reglas de tokens se aplican distinto, porque los
clientes de correo no soportan custom properties. La solución no es abandonar los tokens:
es **resolverlos a valores literales** con el script y pegarlos inline.

```bash
python3 scripts/build_css_vars.py --resolve color.surface.primary.default                     # Travel -> #5B5CFF
python3 scripts/build_css_vars.py --brand linex-go --resolve color.surface.primary.default     # -> #FF725E
python3 scripts/build_css_vars.py --brand linex-trip --resolve components.button.primary.text.default  # -> #00145A
```

Con submarca, **el color del texto del botón cambia**: en Go y Trip no es blanco sino el
primario oscuro. Resolver siempre `components.button.primary.text.default` en vez de asumir
`#FFFFFF`. El esqueleto y el botón de abajo muestran valores de Linex Travel.

### Restricciones reales

- **Tablas para el layout.** Flex y grid no son confiables en Outlook.
- **Estilos inline.** Nada de clases; `<style>` en el `<head>` se descarta en varios clientes.
- **Sin custom properties.** `var(--...)` no resuelve: valor literal.
- **Ancho 600 px** para el contenedor principal.
- **La webfont no carga.** Diseñar asumiendo `Arial`/`Helvetica`; declarar Figtree igual para
  los clientes que sí la soporten.
- **Logo**: fuera del alcance de esta skill (ver `references/brand.md`). Si el mailing lo necesita, dejar el espacio marcado en vez de fabricar uno.
- **Imágenes con `alt` y bloqueadas por defecto.** La pieza debe comunicar sin ellas.
- **Modo oscuro**: los clientes invierten colores de forma impredecible. Evitar texto sobre
  fondos transparentes.

### Esqueleto

```html
<table role="presentation" width="100%" cellpadding="0" cellspacing="0" border="0"
       style="background-color:#F9FAFB;">
  <tr>
    <td align="center" style="padding:24px 16px;">
      <table role="presentation" width="600" cellpadding="0" cellspacing="0" border="0"
             style="width:600px;max-width:100%;background-color:#FFFFFF;border-radius:8px;">
        <tr>
          <td style="padding:32px;font-family:Figtree,'Helvetica Neue',Arial,sans-serif;
                     font-size:16px;line-height:22px;color:#344054;">
            <!-- contenido -->
          </td>
        </tr>
      </table>
    </td>
  </tr>
</table>
```

### Botón bulletproof

```html
<table role="presentation" cellpadding="0" cellspacing="0" border="0">
  <tr>
    <td align="center" bgcolor="#5B5CFF" style="border-radius:8px;">
      <a href="{{url}}" style="display:inline-block;padding:10px 16px;
         font-family:Figtree,Arial,sans-serif;font-size:14px;font-weight:600;line-height:20px;
         color:#FFFFFF;text-decoration:none;border-radius:8px;">
        Ver mi reserva
      </a>
    </td>
  </tr>
</table>
```

Los valores salen de los tokens de botón (`--c-button-primary-background-default`,
`--c-button-md-padding-*`, `--c-button-border-radius`), resueltos con el script.

## Landing pages

Aquí sí aplica todo lo del prototipo HTML: custom properties, flex/grid, estados reales.
Además:

- **Above the fold**: logo, propuesta de valor y un CTA único y claro.
- **Un solo CTA primario** por sección. En Go y Trip es el único lugar donde aparece la
  acción (coral / sky blue): no usarla para destacar precios ni datos. Los secundarios van en `tertiary` o `link`.
- **Mobile first**: el tráfico de travel es mayoritariamente móvil. Breakpoints en
  `max-width: 768px` y `max-width: 480px`.
- **Formularios**: mínimo de campos, labels visibles (no placeholders como label), errores
  inline con el token `--s-color-text-error-default` y texto explicativo, no solo color rojo.
- **Jerarquía tipográfica** con los shorthands: `--s-typography-heading-*` para títulos,
  `--s-typography-body-*` para copy.
- **Performance**: imágenes con `loading="lazy"` salvo la del hero, `width`/`height`
  declarados para evitar saltos de layout.

## Checklist de piezas de marketing

- [ ] Marca correcta y sus reglas respetadas (`references/brands.md`)
- [ ] Logo: espacio marcado y mencionado en la entrega, nunca fabricado
- [ ] Valores resueltos con el script, no escritos de memoria
- [ ] Correo: tablas, inline, 600 px, sin `var()`
- [ ] Legible sin imágenes y sin webfont
- [ ] Un CTA primario claro
- [ ] Contraste verificado en texto sobre fondos de color
