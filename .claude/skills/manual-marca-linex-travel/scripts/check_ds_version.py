#!/usr/bin/env python3
"""
Compara la copia local de tokens.json contra el repositorio de Theming Core.

La copia local sigue siendo la fuente para generar piezas: eso mantiene los
resultados reproducibles. Este script solo avisa cuando se quedo atras, y dice
exactamente que cambio, para que actualizar sea una decision informada y no un
copiar-pegar a ciegas.

    export AZDO_PAT=xxxxx                      # token de lectura de codigo
    python3 scripts/check_ds_version.py        # comparar
    python3 scripts/check_ds_version.py --update   # comparar y actualizar

Requiere red y credenciales, asi que corre en tu maquina, no dentro del chat:
el contenedor del chat no tiene habilitado dev.azure.com.
"""

import argparse
import base64
import json
import os
import shutil
import sys
import urllib.error
import urllib.request

HERE = os.path.dirname(os.path.abspath(__file__))
sys.path.insert(0, HERE)

from build_css_vars import index_tokens, resolve  # noqa: E402

ASSETS = os.path.join(HERE, "..", "assets")
CONFIG = os.path.join(ASSETS, "ds-source.json")


def load_json(path):
    with open(path, encoding="utf-8") as fh:
        return json.load(fh)


def build_url(cfg):
    return (
        f"https://dev.azure.com/{cfg['organization']}/{cfg['project']}"
        f"/_apis/git/repositories/{cfg['repository']}/items"
        f"?path={cfg['path']}"
        f"&versionDescriptor.version={cfg['branch']}"
        f"&includeContent=true&api-version={cfg['apiVersion']}"
    )


def fetch(cfg):
    env = cfg["auth"]["envVar"]
    pat = os.environ.get(env)
    if not pat:
        print(f"Falta la variable de entorno {env}.", file=sys.stderr)
        print(f"  export {env}=<tu Personal Access Token con lectura de codigo>", file=sys.stderr)
        return None

    req = urllib.request.Request(build_url(cfg))
    token = base64.b64encode(f":{pat}".encode()).decode()
    req.add_header("Authorization", f"Basic {token}")
    req.add_header("Accept", "application/json")

    try:
        with urllib.request.urlopen(req, timeout=30) as resp:
            payload = json.loads(resp.read().decode("utf-8"))
    except urllib.error.HTTPError as err:
        if err.code in (401, 203):
            print("Credenciales rechazadas. Revisa que el PAT no haya expirado y "
                  "que tenga permiso de lectura de codigo.", file=sys.stderr)
        elif err.code == 404:
            print(f"No existe '{cfg['path']}' en la rama '{cfg['branch']}'. "
                  "Ajusta 'path' o 'branch' en assets/ds-source.json.", file=sys.stderr)
        elif err.code == 403:
            print("403. Dos causas posibles: el PAT no tiene permiso de lectura de codigo, "
                  "o el entorno bloquea el dominio.", file=sys.stderr)
            print("Si corres esto dentro del chat de Claude, es lo segundo: "
                  "dev.azure.com no esta en la lista permitida. Corre el script en tu maquina.",
                  file=sys.stderr)
        else:
            print(f"Error HTTP {err.code} al consultar Azure DevOps.", file=sys.stderr)
        return None
    except urllib.error.URLError as err:
        print(f"No se pudo alcanzar dev.azure.com: {err.reason}", file=sys.stderr)
        print("Si estas dentro del chat de Claude, el dominio no esta habilitado: "
              "corre este script en tu maquina.", file=sys.stderr)
        return None

    content = payload.get("content")
    if content is None:
        print("La respuesta no trajo contenido del archivo.", file=sys.stderr)
        return None
    return json.loads(content)


def flatten_resolved(data):
    """Aplana a {ruta: valor final}, resolviendo los alias."""
    flat, lookup = index_tokens(data)
    return {path: str(resolve(node.get("value"), lookup)) for path, node in flat.items()}


def compare(local, remote):
    a, b = flatten_resolved(local), flatten_resolved(remote)
    added = sorted(set(b) - set(a))
    removed = sorted(set(a) - set(b))
    changed = sorted(k for k in set(a) & set(b) if a[k] != b[k])
    return added, removed, changed, a, b


def main():
    ap = argparse.ArgumentParser()
    ap.add_argument("--update", action="store_true", help="reemplaza la copia local si hay cambios")
    ap.add_argument("--quiet", action="store_true", help="solo avisa si hay diferencias")
    args = ap.parse_args()

    cfg = load_json(CONFIG)
    local_path = os.path.join(ASSETS, cfg["localSnapshot"])
    local = load_json(local_path)

    remote = fetch(cfg)
    if remote is None:
        return 2

    added, removed, changed, a, b = compare(local, remote)

    if not (added or removed or changed):
        if not args.quiet:
            print(f"Al dia: {len(a)} tokens, sin diferencias contra {cfg['branch']}.")
        return 0

    print(f"La copia local esta desactualizada (tomada el {cfg.get('snapshotTakenOn')}).")
    print(f"  {len(added)} nuevos  {len(removed)} eliminados  {len(changed)} con valor distinto\n")

    if removed:
        print("ELIMINADOS - las piezas que los usen quedan con var() inexistentes:")
        for k in removed[:20]:
            print(f"  {k}  (era {a[k]})")
        if len(removed) > 20:
            print(f"  ... y {len(removed) - 20} mas")
        print()

    if changed:
        print("VALOR DISTINTO - las piezas se ven diferente al regenerar:")
        for k in changed[:20]:
            print(f"  {k}  {a[k]} -> {b[k]}")
        if len(changed) > 20:
            print(f"  ... y {len(changed) - 20} mas")
        print()

    if added:
        print(f"NUEVOS ({len(added)}):")
        for k in added[:10]:
            print(f"  {k} = {b[k]}")
        if len(added) > 10:
            print(f"  ... y {len(added) - 10} mas")
        print()

    if args.update:
        shutil.copy(local_path, local_path + ".bak")
        with open(local_path, "w", encoding="utf-8") as fh:
            json.dump(remote, fh, indent=2, ensure_ascii=False)
        cfg["snapshotTakenOn"] = __import__("datetime").date.today().isoformat()
        with open(CONFIG, "w", encoding="utf-8") as fh:
            json.dump(cfg, fh, indent=2, ensure_ascii=False)
            fh.write("\n")
        print(f"Copia local actualizada. Respaldo en {os.path.basename(local_path)}.bak")
        print("\nSiguiente paso: pasa check_tokens.py sobre las piezas vivas.")
        print("Los tokens eliminados de arriba son el mapa de lo que hay que migrar.")
    else:
        print("Para actualizar:  python3 scripts/check_ds_version.py --update")

    return 1


if __name__ == "__main__":
    sys.exit(main())
