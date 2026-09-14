# Grupo Linex — Universo de marca

Sitio estático con los manuales de marca del Grupo Linex, para que cualquiera de la
compañía entre por una sola URL y tome lo que necesite —logotipo, colores, tipografía,
tono, reglas por pieza— sin pedirle acceso a nadie.

**URL:** https://linex-loyalty.github.io/brand-universe/

## Qué hay aquí

- `index.html` — el hub. La constelación con el estado real de cada marca: qué tiene
  acento definido, qué tiene manual publicado y qué está sin decidir.
- `grupo/` — Manual del Grupo Linex (18 secciones + las fichas delta por marca). El
  sistema común que heredan todas las estrellas: arquitectura, Group Bar, paleta
  fundacional, tipografía, accesibilidad y gobernanza.
- `trip/` — Manual de Linex Trip, la primera estrella con manual completo.

Cada marca es una carpeta. Cuando otra tenga manual, se agrega su carpeta y su tarjeta
en el hub aparece enlazada sola.

## Este repo es un export, no la fuente

La fuente editable vive en el proyecto interno del sistema de marca. **No edites nada
aquí a mano:** el siguiente despliegue lo sobrescribe.

Para publicar una actualización, desde el proyecto interno:

```
node tools/publicar-universo.js     # copia lo publicable y cose la navegación
node tools/generar-hub.js           # regenera el hub desde brand-tokens.json
cd brand-universe-publish
git add -A && git commit -m "..." && git push
```

El script copia **por lista blanca**: solo sale lo que está nombrado en él. Si mañana
alguien deja un PDF confidencial dentro de una carpeta ya publicada, no se filtra,
porque no está en la lista. Además aborta si detecta una ruta prohibida y verifica que
no queden enlaces rotos.

## Qué NO está aquí, a propósito

- Los PDFs de estrategia de marca marcados CONFIDENTIAL.
- `brand-tokens.json` — artefacto interno del skill y del agente de marca.
- Los estudios de color abiertos, que comparan unas estrellas contra otras.
- Los briefs y paquetes con destinatario concreto.
- **Las propuestas de logo de Linex Trip.** Son siete opciones sin decidir; en una URL
  abierta alguien tomaría una creyéndola aprobada. La sección existe en el manual
  interno y se publicará cuando haya una elegida.

## El estado del universo

Hoy hay una marca con manual completo (Trip) y ocho sin él. Eso no es un defecto del
sitio: el hub lo declara marca por marca, y sirve para ver de un vistazo qué decisiones
faltan y a quién pedírselas. A medida que cada estrella cierre su color, su logo y su
manual, la tarjeta correspondiente se enciende sola.
