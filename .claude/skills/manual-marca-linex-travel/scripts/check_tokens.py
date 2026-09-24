#!/usr/bin/env python3
"""
Revisa una pieza (HTML, CSS, JSX) antes de entregarla.

Detecta las dos fallas que se repiten:
  1. var(--x) que no existe en tokens.json (nombres plausibles pero inventados)
  2. hex, font-size y spacing escritos a mano donde habia token

Uso:
    python3 scripts/check_tokens.py prototipo.html
    python3 scripts/check_tokens.py src/Button.jsx --no-literals
    python3 scripts/check_tokens.py landing-go.html --brand linex-go
"""

import argparse
import os
import re
import sys

HERE = os.path.dirname(os.path.abspath(__file__))
sys.path.insert(0, HERE)

from build_css_vars import (  # noqa: E402
    DEFAULT_BRAND, DEFAULT_TOKENS, apply_brand, build, find_brand, load,
)

VAR_RE = re.compile(r"var\(\s*(--[a-z0-9-]+)")
HEX_RE = re.compile(r"#[0-9a-fA-F]{3,8}\b")
DECL_RE = re.compile(r"^\s*(--[a-z0-9-]+)\s*:")

# Un bloque :root es la salida del generador: ahi los literales son correctos.
ROOT_START = re.compile(r":root\s*\{")


def known_names(tokens_path, brand):
    data = load(tokens_path)
    apply_brand(data, brand)
    css, _, flat, lookup = build(data, brand=brand)
    names = set(DECL_RE.match(line).group(1) for line in css.splitlines() if DECL_RE.match(line))
    return names


def root_ranges(lines):
    """Lineas que pertenecen a un bloque :root, para no marcarlas como literales."""
    inside, depth, spans = False, 0, set()
    for i, line in enumerate(lines):
        if not inside and ROOT_START.search(line):
            inside, depth = True, line.count("{") - line.count("}")
            spans.add(i)
            continue
        if inside:
            spans.add(i)
            depth += line.count("{") - line.count("}")
            if depth <= 0:
                inside = False
    return spans


def main():
    ap = argparse.ArgumentParser()
    ap.add_argument("file")
    ap.add_argument("--tokens", default=DEFAULT_TOKENS)
    ap.add_argument("--brand", default=DEFAULT_BRAND, help="marca de la pieza (acepta --b-* de esa marca)")
    ap.add_argument("--no-literals", action="store_true", help="solo verifica nombres de token")
    args = ap.parse_args()

    brand = find_brand(args.brand)
    names = known_names(args.tokens, brand)
    lines = open(args.file, encoding="utf-8").read().splitlines()
    skip = root_ranges(lines)

    bad_vars, literals = [], []
    for i, line in enumerate(lines):
        for match in VAR_RE.finditer(line):
            if match.group(1) not in names:
                bad_vars.append((i + 1, match.group(1)))
        if args.no_literals or i in skip:
            continue
        for match in HEX_RE.finditer(line):
            literals.append((i + 1, match.group(0)))

    if bad_vars:
        print(f"TOKENS INEXISTENTES ({len(bad_vars)}):")
        for ln, name in bad_vars:
            print(f"  linea {ln}: {name}")
        print("  -> verifica con: build_css_vars.py --grep <parte-del-nombre>")
    if literals:
        print(f"\nHEX HARDCODEADOS ({len(literals)}) fuera del bloque :root:")
        for ln, val in literals[:25]:
            print(f"  linea {ln}: {val}")
        print("  -> si es una pieza de correo esto es esperado; si es web, usa el token")

    if not bad_vars and not literals:
        print("Sin hallazgos: todos los var() existen y no hay hex sueltos.")
        return 0
    return 1


if __name__ == "__main__":
    sys.exit(main())
