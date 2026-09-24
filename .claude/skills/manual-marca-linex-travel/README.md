# manual-marca-linex-travel

Manual de marca de la familia Linex Travel (Linex Travel, Linex Go, Linex Trip). Produce
componentes React, prototipos HTML interactivos y piezas de marketing usando los tokens
reales de Nomad DS con la paleta de la marca aplicada como override.

Antes se llamaba `ui-designer-linex`. Si ambas quedan instaladas compiten por activarse:
borrar `ui-designer-linex` desde ajustes.

**Esta carpeta es la fuente de verdad.** El archivo `.skill` es solo el empaquetado para
distribuir e instalar. Si alguien edita un `.skill` suelto y no vuelca el cambio acá, ese
cambio se pierde en el siguiente empaquetado.

## Estructura

```
manual-marca-linex-travel/
├── SKILL.md                      flujo y reglas de decisión
├── references/
│   ├── tokens.md                 capas de token, catálogo semántico
│   ├── components.md             recetas de los 21 componentes del DS
│   ├── iconography.md            Font Awesome Pro Classic Regular
│   ├── brands.md                 paleta y reglas de Linex Go y Linex Trip
│   ├── brand.md                  tipografía (el logo está fuera de alcance)
│   └── marketing.md              mailing y landing pages
├── assets/
│   ├── tokens.json               export de Nomad DS (~1900 tokens)
│   ├── ds-source.json            de dónde se trae tokens.json
│   ├── brand/
│   │   ├── brand.json            manifiesto común: tipografía e iconos
│   │   └── brands/               una paleta + overrides por marca
│   │       ├── linex-travel.json
│   │       ├── linex-go.json
│   │       └── linex-trip.json
│   └── templates/prototype.html  base para prototipos
└── scripts/
    ├── build_css_vars.py         tokens.json → CSS custom properties
    ├── check_tokens.py           verifica una pieza antes de entregarla
    └── check_ds_version.py       compara la copia local contra el repo del DS
```

**El logo no es parte de esta skill.** Se gestiona por otro medio. Si una pieza lo necesita,
el criterio es dejar el espacio marcado y decirlo en la entrega — ver `references/brand.md`.

## Qué se edita y cada cuánto

| Archivo | Cambia cuando | Quién |
|---|---|---|
| `assets/tokens.json` | el DS publica una versión | se trae con `check_ds_version.py` |
| `assets/ds-source.json` | cambia el repo, la rama o la ruta del archivo | quien mantiene la skill |
| `assets/brand/brand.json` | cambia la tipografía o el kit de iconos | responsable de marca |
| `assets/brand/brands/*.json` | cambia la paleta o las reglas de una marca | responsable de marca |
| `references/*.md` | cambian criterios o aparecen componentes nuevos | quien mantiene la skill |
| `SKILL.md` | cambia el flujo o los modos de salida | quien mantiene la skill |

Los dos primeros son datos y van a cambiar seguido. Los dos últimos son criterio y cambian
poco.

## Actualizar los tokens

La copia local es la fuente para generar piezas: eso mantiene los resultados reproducibles
entre personas y entre días. El repositorio es la referencia contra la cual se compara.

```bash
export AZDO_PAT=<token de lectura de codigo>
python3 scripts/check_ds_version.py            # ¿hay versión nueva? ¿qué cambió?
python3 scripts/check_ds_version.py --update   # traerla
```

Corre en tu máquina, no dentro del chat: el contenedor del chat no tiene habilitado
`dev.azure.com`. El PAT va en una variable de entorno, nunca en el repo.

El reporte separa tres cosas, y la más importante es la primera:

- **Eliminados** — las piezas que los usaban quedan con `var()` inexistentes. Es el mapa de
  migración.
- **Valor distinto** — las piezas se ven diferente al regenerar. Ojo con el efecto cascada:
  un primitivo puede arrastrar decenas de tokens de componente.
- **Nuevos** — nada se rompe, pero puede haber algo que antes resolvías a mano.

Después de actualizar, pasá `check_tokens.py` sobre las piezas vivas.

Si `ds-source.json` apunta a la ruta equivocada, el script lo dice con el path y la rama que
intentó. Ajustá `path` y `branch` ahí.

Después, pasá el verificador sobre las piezas ya entregadas que tengas a mano:

```bash
python3 scripts/check_tokens.py ruta/a/pieza.html
```

Si un token se renombró o desapareció, las piezas que lo usaban quedan con `var()`
inexistentes. No fallan visiblemente — simplemente dejan de aplicar el valor. El verificador
los encuentra y te da el mapa de migración.

## Logo

No es parte de esta skill; se gestiona por otro medio. Si una pieza lo necesita, el criterio
es dejar el espacio marcado y decirlo en la entrega, nunca fabricarlo. Detalle en
`references/brand.md`.

## Actualizar los iconos

Todo vive en `assets/brand/brand.json → icons`. Cambiar `mode` y los campos del kit; el
markup `fa-regular fa-{nombre}` no cambia nunca. Ver `references/iconography.md`.

## Empaquetar

Un `.skill` es un zip con la carpeta en la raíz. Desde el directorio padre:

```bash
zip -r manual-marca-linex-travel.skill manual-marca-linex-travel/ -x "*__pycache__*" -x "*.DS_Store"
```

Luego se sube desde la tarjeta de archivo en Claude y se guarda.

**El nombre no cambia más.** Tiene que seguir siendo `manual-marca-linex-travel`, no `-v2`
ni `-final`. Dos skills con nombres distintos y descripciones parecidas compiten por activarse
y el resultado es impredecible. Si al guardar queda duplicada, borrá la anterior desde
ajustes.

## Antes de publicar una versión

```bash
python3 scripts/check_ds_version.py
python3 scripts/check_tokens.py assets/templates/prototype.html
```

Y revisar que el `description` del frontmatter siga describiendo lo que la skill hace
realmente. Es lo que decide si se activa; si la skill creció y la descripción no, deja de
dispararse en los casos nuevos.

## Antes de hacerla pública

Dos archivos tienen placeholders a propósito, y hay que completarlos con datos reales para
que la skill funcione — pero esos datos reales **no vuelven a este repo si es público**.

- **`assets/brand/brand.json → icons.kitCode`** (`YOUR_KIT_CODE`). Es consumo directo contra
  la cuenta de Font Awesome de quien lo generó: cualquiera con el código puede insertarlo en
  su propia página. Completalo en un fork o copia privada, o cargalo en tiempo de build desde
  una variable de entorno si el pipeline lo permite.
- **`assets/ds-source.json`** (`organization`, `project`, `repository`, `webUrl`). No dan
  acceso sin el PAT, pero identifican dónde vive tu repo interno. Mismo tratamiento.

Antes de cada release público, correr:

```bash
grep -rn "YOUR_KIT_CODE\|YOUR_ORG\|YOUR_PROJECT\|YOUR_REPO" .
```

Si no devuelve nada, alguien completó los placeholders con valores reales en esta copia — no
publicar así.

## Revisar fugas de marca

Después de tocar una paleta, ningún token `--s-`/`--c-` de Go o Trip debería seguir
resolviendo al azulVioleta de Nomad:

```bash
python3 scripts/build_css_vars.py --list primitives.color.azulVioleta | awk '{print $3}' > /tmp/av.txt
python3 scripts/build_css_vars.py --brand linex-go 2>/dev/null | grep -E -- '--(s|c)-' | grep -iF -f /tmp/av.txt
```

Sin salida = sin fugas.

## Pendientes conocidos

- Hover/pressed de la acción en Go y Trip son derivados: validar con marca.
- Tipografía de Go y Trip asumida Figtree hasta que el manual diga otra cosa.
- Linex Trip no define color de texto secundario (queda el gris de Nomad).

- El logo no es parte de esta skill: se gestiona por otro medio, sin fecha ni mecanismo
  definido dentro de este repo.
