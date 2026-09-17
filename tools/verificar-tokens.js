#!/usr/bin/env node
/* Valida que brand-tokens.json no mienta.
 *
 * POR QUÉ EXISTE
 * Un JSON de marca es peligroso justo cuando parece correcto: nadie
 * recalcula un "5.49:1" escrito con confianza. Aquí cada ratio que el
 * archivo afirma se vuelve a calcular, y cada ruta se comprueba contra
 * el disco. Un dato que no se sostiene es un error, no un aviso.
 *
 * Esto no es teórico: la primera corrida destapó que el cambio de color
 * de Linex Trip del 14 de septiembre de 2026 dejó tres contrastes sin
 * recalcular, todavía medidos contra el Índigo anterior.
 *
 * USO
 *   node tools/verificar-tokens.js
 */

const fs = require('fs');
const path = require('path');
const { contraste } = require('./contraste.js');

const RAIZ = path.resolve(__dirname, '..');
const TOLERANCIA = 0.02;

/* Reúne toda ruta que la marca declare, venga del campo que venga.
   Se reconoce por la forma, no por el nombre del campo: así una ruta
   nueva no se escapa de la comprobación por olvido. */
function rutasDe(marca) {
  const encontradas = [];
  const esRuta = v => typeof v === 'string' && /^[A-Za-z0-9._-]+\//.test(v);

  const recorrer = (valor, camino) => {
    if (esRuta(valor)) encontradas.push([camino, valor]);
    else if (valor && typeof valor === 'object' && !Array.isArray(valor)) {
      for (const [k, v] of Object.entries(valor)) recorrer(v, `${camino}.${k}`);
    }
  };

  for (const campo of ['logos', 'aliados', 'manual', 'contexto', 'propuestas_logo']) {
    recorrer(marca[campo], campo);
  }
  return encontradas;
}

function verificar(tokens) {
  const errores = [];
  const avisos = [];

  for (const [id, m] of Object.entries(tokens.marcas)) {
    if (m.id !== id) errores.push(`${id}: el campo id dice "${m.id}"`);

    // 1 · Cada contraste afirmado se recalcula.
    for (const c of (m.color || []).concat(m.derivados || [])) {
      const medidos = c.regla ? (c.regla.contrastes || {}) : (c.contrastes || {});

      if (c.regla) {
        if (Object.keys(medidos).length === 0) {
          errores.push(`${id} · ${c.nombre} (${c.hex}): tiene regla pero está sin medición`);
        }
        if (c.regla.solo_sobre && !(c.regla.solo_sobre in medidos)) {
          errores.push(`${id} · ${c.nombre}: dice "solo sobre ${c.regla.solo_sobre}" y no mide ese fondo`);
        }
      }

      for (const [fondo, afirmado] of Object.entries(medidos)) {
        const real = contraste(c.hex, fondo);
        if (Math.abs(real - afirmado) > TOLERANCIA) {
          errores.push(
            `${id} · ${c.nombre} (${c.hex}) sobre ${fondo}: ` +
            `el contraste afirmado es ${afirmado} y el real es ${real.toFixed(2)}`
          );
        }
      }
    }

    // 2 · Ninguna ruta apunta al vacío.
    for (const [campo, ruta] of rutasDe(m)) {
      if (!fs.existsSync(path.join(RAIZ, ruta))) {
        errores.push(`${id} · ${campo}: la ruta "${ruta}" no existe en disco`);
      }
    }

    // 3 · El símbolo de marca depende del registro.
    if (m.estado === 'confirmed_pending_trademark' && m.legal && m.legal.admite_simbolo_marca) {
      errores.push(`${id}: no puede admitir ™/® con el registro pendiente`);
    }

    // 4 · Las proporciones cierran, cuando existen.
    const props = (m.color || []).filter(c => c.proporcion != null);
    if (props.length) {
      const suma = props.reduce((t, c) => t + c.proporcion, 0);
      if (suma !== 100) errores.push(`${id}: las proporciones suman ${suma}, no 100`);
    }

    // 5 · Un color con restricción de fondo la trae escrita.
    for (const c of m.color || []) {
      if (c.regla && c.regla.solo_sobre && !(c.regla.nunca || []).length) {
        avisos.push(`${id} · ${c.nombre}: dice dónde vive pero no dónde no`);
      }
    }

    // 6b · El sitio Constelación es bilingüe: un pendientes_en que se
    // desalinea de pendientes deja al visitante en inglés leyendo un ítem
    // que no corresponde, o ninguno.
    if (m.pendientes_en && m.pendientes_en.length !== (m.pendientes || []).length) {
      errores.push(`${id}: pendientes_en tiene ${m.pendientes_en.length} ítems y pendientes tiene ${(m.pendientes || []).length}`);
    }

    // 6 · Lo pendiente se nombra, no se disimula.
    const sinLogo = Object.values(m.logos || {}).every(v => v === null);
    if (sinLogo && !(m.pendientes || []).some(p => /logo/i.test(p))) {
      avisos.push(`${id}: no tiene ningún logo y no lo declara en pendientes`);
    }
    if (!(m.color || []).length && !(m.pendientes || []).some(p => /paleta|color/i.test(p))) {
      avisos.push(`${id}: no tiene color y no lo declara en pendientes`);
    }
  }

  return { errores, avisos };
}

if (require.main === module) {
  const tokens = JSON.parse(
    fs.readFileSync(path.join(RAIZ, 'brand-tokens.json'), 'utf8'));
  const { errores, avisos } = verificar(tokens);

  avisos.forEach(a => console.log('  aviso · ' + a));
  errores.forEach(e => console.error('  ERROR · ' + e));

  const n = Object.keys(tokens.marcas).length;
  const conManual = Object.values(tokens.marcas).filter(m => m.manual).length;
  console.log(`\n${n} marcas · ${conManual} con manual · ${errores.length} errores · ${avisos.length} avisos`);
  process.exit(errores.length ? 1 : 0);
}

module.exports = { verificar };
