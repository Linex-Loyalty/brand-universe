#!/usr/bin/env python3
"""
Resuelve tokens.json (formato Tokens Studio) a CSS custom properties.

Los tokens usan alias como {color.surface.primary.default}. Escribirlos a mano
es donde aparecen los hex inventados, asi que este script los resuelve y emite
el CSS listo para pegar en un prototipo.

Uso:
    python3 scripts/build_css_vars.py                      # imprime el CSS
    python3 scripts/build_css_vars.py -o vars.css          # lo escribe a archivo
    python3 scripts/build_css_vars.py --grep button        # solo vars que matcheen
    python3 scripts/build_css_vars.py --resolve color.surface.primary.default
    python3 scripts/build_css_vars.py --list semantics.color.text

Marcas (Linex Travel por defecto, Linex Go, Linex Trip):
    python3 scripts/build_css_vars.py --brands                    # lista marcas
    python3 scripts/build_css_vars.py --brand linex-go -o vars.css
    python3 scripts/build_css_vars.py --brand linex-trip --report # paleta, reglas y contrastes
    python3 scripts/build_css_vars.py --brand linex-go --resolve color.surface.primary.default
"""

import argparse
import json
import os
import re
import sys

HERE = os.path.dirname(os.path.abspath(__file__))
DEFAULT_TOKENS = os.path.join(HERE, "..", "assets", "tokens.json")
BRANDS_DIR = os.path.join(HERE, "..", "assets", "brand", "brands")
DEFAULT_BRAND = "linex-travel"

PREFIX = {"primitives": "p", "semantics": "s", "components": "c"}

# Tokens cuyo valor es un numero crudo pero que en CSS necesitan unidad.
PX_TYPES = {"dimension", "sizing", "spacing", "borderRadius", "borderWidth", "fontSizes", "lineHeights"}
UNITLESS_TYPES = {"fontWeights", "opacity", "other", "color", "fontFamilies", "letterSpacing"}


def load(path):
    with open(path, encoding="utf-8") as fh:
        return json.load(fh)


def is_leaf(node):
    return isinstance(node, dict) and "value" in node and not isinstance(node.get("value"), dict)


def index_tokens(data):
    """Aplana el arbol. Indexa cada hoja dos veces: con y sin el top-level,
    porque los alias del archivo omiten primitives/semantics/components."""
    flat = {}       # ruta completa -> hoja
    lookup = {}     # ruta sin top-level -> hoja (para resolver alias)

    def walk(node, path):
        if is_leaf(node):
            full = ".".join(path)
            flat[full] = node
            short = ".".join(path[1:])
            lookup.setdefault(short, node)
            return
        if isinstance(node, dict):
            for key, child in node.items():
                walk(child, path + [key])

    for top, node in data.items():
        walk(node, [top])
    return flat, lookup


ALIAS_RE = re.compile(r"\{([^}]+)\}")


def resolve(value, lookup, seen=None, depth=0):
    """Sigue la cadena de alias hasta el valor literal."""
    if depth > 20:
        return value
    if not isinstance(value, str):
        return value
    seen = seen or set()

    def sub(match):
        ref = match.group(1).strip()
        if ref in seen:
            return match.group(0)
        target = lookup.get(ref)
        if target is None:
            return match.group(0)
        return str(resolve(target.get("value"), lookup, seen | {ref}, depth + 1))

    return ALIAS_RE.sub(sub, value)


def css_name(path):
    top = path.split(".")[0]
    rest = path.split(".")[1:]
    prefix = PREFIX.get(top, top)
    slug = "-".join(rest)
    slug = re.sub(r"([a-z0-9])([A-Z])", r"\1-\2", slug).lower()
    slug = re.sub(r"[^a-z0-9-]+", "-", slug)
    slug = re.sub(r"-{2,}", "-", slug).strip("-")
    return f"--{prefix}-{slug}"


def css_value(raw, token_type):
    if isinstance(raw, (int, float)):
        if token_type in PX_TYPES:
            return f"{raw}px"
        return str(raw)
    text = str(raw).strip()
    if text in ("", "none"):
        return text or "0"
    # numero puro que representa una dimension
    if re.fullmatch(r"-?\d+(\.\d+)?", text) and token_type in PX_TYPES:
        return f"{text}px"
    return text


SHADOW_PARTS = ("x", "y", "blur", "spread", "color")
TYPO_PARTS = ("fontWeight", "fontSize", "lineHeight", "fontFamily")


def compose_shadows(flat, lookup):
    """Las sombras vienen despiezadas (x/y/blur/spread/color) y en capas
    numeradas. Compone el shorthand de box-shadow para no armarlo a mano."""
    groups = {}
    for path, node in flat.items():
        parts = path.split(".")
        if parts[-1] not in SHADOW_PARTS or "shadow" not in parts:
            continue
        parent = ".".join(parts[:-1])
        groups.setdefault(parent, {})[parts[-1]] = resolve(node.get("value"), lookup)

    layered = {}
    for parent, parts in groups.items():
        if not all(k in parts for k in SHADOW_PARTS):
            continue
        layer = f"{parts['x']} {parts['y']} {parts['blur']} {parts['spread']} {parts['color']}"
        segs = parent.split(".")
        if segs[-1].isdigit():
            base, order = ".".join(segs[:-1]), int(segs[-1])
        else:
            base, order = parent, 0
        layered.setdefault(base, []).append((order, layer))

    out = {}
    for base, layers in layered.items():
        layers.sort()
        out[css_name(base)] = ", ".join(layer for _, layer in layers)
    return out


def compose_typography(flat, lookup):
    """Shorthand de font: peso tamano/interlineado familia."""
    groups = {}
    for path, node in flat.items():
        parts = path.split(".")
        if parts[-1] not in TYPO_PARTS:
            continue
        parent = ".".join(parts[:-1])
        groups.setdefault(parent, {})[parts[-1]] = resolve(node.get("value"), lookup)

    out = {}
    for parent, parts in groups.items():
        if not all(k in parts for k in TYPO_PARTS):
            continue
        size = css_value(parts["fontSize"], "fontSizes")
        lh = css_value(parts["lineHeight"], "lineHeights")
        out[css_name(parent)] = f"{parts['fontWeight']} {size}/{lh} {parts['fontFamily']}"
    return out


def build(data, grep=None, brand=None):
    flat, lookup = index_tokens(data)
    lines, unresolved = [], []
    current_group = None

    for path in sorted(flat):
        if grep and grep.lower() not in path.lower():
            continue
        node = flat[path]
        raw = resolve(node.get("value"), lookup)
        if isinstance(raw, str) and "{" in raw:
            unresolved.append((path, raw))
        group = ".".join(path.split(".")[:2])
        if group != current_group:
            lines.append(f"\n  /* {group} */")
            current_group = group
        lines.append(f"  {css_name(path)}: {css_value(raw, node.get('type'))};")

    shorthands = {}
    shorthands.update(compose_shadows(flat, lookup))
    shorthands.update(compose_typography(flat, lookup))

    emitted = [line.strip().split(":")[0] for line in lines if line.strip().startswith("--")]
    extra = []
    for name in sorted(shorthands):
        if name in emitted:
            continue
        if grep and grep.lower() not in name.lower():
            continue
        extra.append(f"  {name}: {shorthands[name]};")
    if extra:
        lines.append("\n  /* shorthands compuestos */")
        lines.extend(extra)

    if brand is not None:
        blines = brand_css(brand)
        if grep:
            blines = [l for l in blines if not l.strip().startswith("/*") and grep.lower() in l.lower()]
        lines.extend(blines)
        header = f"  /* Marca activa: {brand['name']} ({brand['id']}) */"
        lines.insert(0, "\n" + header)

    css = ":root {" + "\n".join(lines) + "\n}\n"
    return css, unresolved, flat, lookup


# ---------------------------------------------------------------- marcas

def list_brands():
    out = {}
    for name in sorted(os.listdir(BRANDS_DIR)):
        if name.endswith(".json"):
            b = load(os.path.join(BRANDS_DIR, name))
            out[b["id"]] = b
    return out


def find_brand(key):
    """Acepta id ('linex-go') o alias ('Linex Go', 'go')."""
    key = (key or DEFAULT_BRAND).strip().lower()
    brands = list_brands()
    if key in brands:
        return brands[key]
    for b in brands.values():
        if key in [a.lower() for a in b.get("aliases", [])] or key == b["name"].lower():
            return b
    raise SystemExit(f"Marca desconocida: {key}. Disponibles: {', '.join(brands)}")


def _rgb(h):
    h = h.lstrip("#")
    return [int(h[i:i + 2], 16) for i in (0, 2, 4)]


def mix(a, b, amount):
    """Mezcla a hacia b (amount 0-1). Solo para estados que el manual no define."""
    ra, rb = _rgb(a), _rgb(b)
    return "#" + "".join(f"{round(x + (y - x) * amount):02X}" for x, y in zip(ra, rb))


def luminance(h):
    c = [v / 255 for v in _rgb(h)]
    c = [v / 12.92 if v <= 0.03928 else ((v + 0.055) / 1.055) ** 2.4 for v in c]
    return 0.2126 * c[0] + 0.7152 * c[1] + 0.0722 * c[2]


def contrast(a, b):
    la, lb = sorted((luminance(a), luminance(b)), reverse=True)
    return (la + 0.05) / (lb + 0.05)


def brand_value(spec, palette):
    """Devuelve (hex, derivado?) para un override: clave de paleta, hex o {mix}."""
    if isinstance(spec, dict) and "mix" in spec:
        a, b, amt = spec["mix"]
        return mix(palette[a]["hex"], palette[b]["hex"], amt), True
    if spec in palette:
        return palette[spec]["hex"], False
    return spec, False


def set_path(data, path, value):
    node = data
    for key in path.split("."):
        if not isinstance(node, dict) or key not in node:
            return False
        node = node[key]
    if not (isinstance(node, dict) and "value" in node):
        return False
    node["value"] = value
    return True


def apply_brand(data, brand):
    """Pisa los tokens del DS con la paleta de la marca ANTES de resolver alias,
    para que los componentes hereden en cascada (patron multi-tenant)."""
    palette = brand.get("palette", {})
    derived, missing = [], []
    for path, spec in brand.get("overrides", {}).items():
        value, is_derived = brand_value(spec, palette)
        if not set_path(data, path, value):
            missing.append(path)
        elif is_derived:
            derived.append((path, value))
    return derived, missing


def brand_css(brand):
    """Variables propias de la marca: --b-color-<paleta> y --b-role-<rol>."""
    palette = brand.get("palette", {})
    if not palette:
        return []
    lines = [f"\n  /* marca: {brand['name']} — paleta */"]
    for key, sw in palette.items():
        lines.append(f"  --b-color-{key}: {sw['hex']};")
    lines.append(f"\n  /* marca: {brand['name']} — roles */")
    for role, key in brand.get("roles", {}).items():
        if key in palette:
            lines.append(f"  --b-role-{role}: var(--b-color-{key});")
    return lines


def brand_report(brand):
    palette = brand.get("palette", {})
    print(f"# {brand['name']} ({brand['id']})")
    if not palette:
        print("Usa Nomad DS sin overrides.")
        for r in brand.get("rules", []):
            print(f"- {r}")
        return
    print("\n## Paleta")
    for key, sw in palette.items():
        print(f"  {sw['name']:<16} {sw['hex']}  {sw['role']} · {sw['share']}%  (--b-color-{key})")
    print("\n## Reglas")
    for r in brand.get("rules", []):
        print(f"- {r}")
    print("\n## Contrastes (texto >= 4.5 · texto grande/UI >= 3.0)")
    keys = list(palette)
    rows = []
    for i, a in enumerate(keys):
        for b in keys[i + 1:]:
            rows.append((contrast(palette[a]["hex"], palette[b]["hex"]), a, b))
    for ratio, a, b in sorted(rows, reverse=True):
        mark = "OK " if ratio >= 4.5 else ("3.0" if ratio >= 3 else "NO ")
        print(f"  [{mark}] {ratio:5.2f}:1  {palette[a]['name']} / {palette[b]['name']}")


def main():
    ap = argparse.ArgumentParser()
    ap.add_argument("--tokens", default=DEFAULT_TOKENS)
    ap.add_argument("-o", "--out")
    ap.add_argument("--grep", help="filtra por subcadena de la ruta del token")
    ap.add_argument("--resolve", help="resuelve una ruta y muestra el valor final")
    ap.add_argument("--list", dest="list_path", help="lista las hojas bajo una ruta")
    ap.add_argument("--brand", default=DEFAULT_BRAND,
                    help="linex-travel (defecto), linex-go, linex-trip — o sus alias")
    ap.add_argument("--brands", action="store_true", help="lista las marcas disponibles")
    ap.add_argument("--report", action="store_true", help="paleta, reglas y contrastes de la marca")
    args = ap.parse_args()

    if args.brands:
        for b in list_brands().values():
            print(f"{b['id']:<14} {b['name']:<14} alias: {', '.join(b.get('aliases', []))}")
        return

    brand = find_brand(args.brand)
    if args.report:
        brand_report(brand)
        return

    data = load(args.tokens)
    derived, missing = apply_brand(data, brand)
    if missing:
        print(f"/* {len(missing)} overrides apuntan a tokens que no existen en el DS: */", file=sys.stderr)
        for m in missing:
            print(f"  {m}", file=sys.stderr)

    if args.resolve:
        _, lookup = index_tokens(data)
        node = lookup.get(args.resolve)
        if node is None:
            flat, _ = index_tokens(data)
            node = flat.get(args.resolve)
        if node is None:
            print(f"No existe el token: {args.resolve}", file=sys.stderr)
            sys.exit(1)
        print(resolve(node.get("value"), lookup))
        return

    if args.list_path:
        flat, lookup = index_tokens(data)
        hits = [p for p in sorted(flat) if p.startswith(args.list_path)]
        if not hits:
            print(f"Sin resultados bajo: {args.list_path}", file=sys.stderr)
            sys.exit(1)
        for p in hits:
            print(f"{p} = {resolve(flat[p].get('value'), lookup)}")
        return

    css, unresolved, flat, _ = build(data, args.grep, brand)

    if args.out:
        with open(args.out, "w", encoding="utf-8") as fh:
            fh.write(css)
        print(f"{len(flat)} tokens [{brand['name']}] -> {args.out}")
    else:
        print(css)

    if derived:
        print(f"\n/* {len(derived)} valores derivados (el manual no los define; validar con marca): */",
              file=sys.stderr)
        for path, value in derived:
            print(f"  {path} = {value}", file=sys.stderr)

    if unresolved:
        print(f"\n/* {len(unresolved)} alias sin resolver */", file=sys.stderr)
        for path, raw in unresolved[:15]:
            print(f"  {path} -> {raw}", file=sys.stderr)


if __name__ == "__main__":
    main()
