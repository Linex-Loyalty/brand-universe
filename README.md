# Universo de marca · Grupo Linex

**Entra aquí → https://linex-loyalty.github.io/brand-universe/**

Este es el lugar donde está la marca del Grupo Linex. Si necesitas el logotipo, los
colores exactos, la tipografía, el tono con el que hablamos o cómo se arma una pieza
concreta —un post, un correo, una tarjeta, una página—, entras por esa URL y lo tomas.
No hay que pedir acceso ni preguntarle a nadie.

## Qué vas a encontrar

**El hub.** La portada muestra las nueve marcas de la constelación agrupadas por tier,
y de cada una dice la verdad: qué tiene color de acento definido, qué tiene manual
publicado y qué todavía está sin decidir. Si una tarjeta se ve apagada es porque a esa
marca le falta una decisión, no porque falte la página.

**Manual del Grupo Linex.** El sistema común que heredan todas las marcas: arquitectura
de la constelación, Group Bar, paleta fundacional, tipografía, accesibilidad y las
fichas de cada estrella.

**Manual de Linex Trip.** La primera marca con manual completo: logotipo, paleta,
tipografía, iconografía, fotografía, audiencias, voz y tono, vocabulario, y las piezas
resueltas por canal —web, WhatsApp, correo, papelería y redes.

Cada marca es una carpeta. Cuando otra cierre su manual, se agrega la suya y su tarjeta
en el hub aparece enlazada sola.

## Cómo se usa

Abre la URL, busca tu marca, y copia el dato o descarga el archivo que necesites. Los
valores que aparecen ahí —el HEX, el nombre de la fuente, la regla de uso— son los
oficiales. Si algo que necesitas no está, es porque está pendiente de decidir: el manual
lo dice como pendiente en vez de inventarlo, y ahí sabes que hay que escalarlo.

¿Falta algo de tu marca, ves un dato viejo o necesitas una pieza que no está resuelta?
Escríbele al administrador de marca.

---

## Para quien mantiene el sitio

Este repositorio es un **export**, no la fuente. La fuente editable vive en el proyecto
interno del sistema de marca. **No edites nada aquí a mano:** el siguiente despliegue lo
sobrescribe.

Para publicar una actualización, desde el proyecto interno:

```
node tools/publicar-universo.js     # copia lo publicable y cose la navegación
node tools/generar-hub.js           # regenera el hub desde brand-tokens.json
cd brand-universe-publish
git add -A && git commit -m "..." && git push
```

El script copia **por lista blanca**: solo sale lo que está nombrado en él. Si mañana
alguien deja un PDF confidencial dentro de una carpeta ya publicada, no se filtra, porque
no está en la lista. Además aborta si detecta una ruta prohibida y verifica que no queden
enlaces rotos antes de terminar.

### Qué no está aquí, a propósito

- Los PDFs de estrategia de marca marcados CONFIDENTIAL.
- `brand-tokens.json` — artefacto interno del skill y del agente de marca.
- Los estudios de color abiertos, que comparan unas estrellas contra otras.
- Los briefs y paquetes con destinatario concreto.
- **Las propuestas de logo de Linex Trip.** Son siete opciones sin decidir; en una URL
  abierta alguien tomaría una creyéndola aprobada. Se publicará cuando haya una elegida.
- **Gobernanza y pendientes del manual de grupo.** Quién controla qué y qué decisiones
  siguen abiertas es material de trabajo del equipo de marca, no manual de consulta.

La regla es: no se publica lo que no está decidido. Agregar algo después es un comando;
sacarlo de un sitio ya indexado, no.
