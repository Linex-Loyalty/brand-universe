# Manual de Marca Linex Trip - sincronizador de navegacion
#
# POR QUE EXISTE
# El manual es un sitio estatico sin build step y sin dependencias: cada pagina
# lleva su propio sidebar y su propio pager en HTML plano, para que funcione
# abierto con doble clic (file://), sin JS y al imprimirse. El costo de eso es
# que el menu esta duplicado en las 16 paginas: agregar una seccion obligaba a
# editar 16 archivos a mano (fue exactamente lo que paso al insertar 06b).
#
# Este script conserva la ventaja y elimina el costo: el menu se declara UNA vez
# aqui abajo, y el script reescribe el sidebar y el pager de todas las paginas.
# El HTML sigue siendo estatico; el script NO viaja en el entregable, es una
# herramienta de autoria.
#
# COMO SE USA
#   pwsh -File tools/sync-nav.ps1            # aplica los cambios
#   pwsh -File tools/sync-nav.ps1 -DryRun    # solo muestra que cambiaria
#
# COMO SE AGREGA UNA SECCION
#   1. Crea el archivo .html copiando cualquier pagina existente.
#   2. Agrega una linea a $Pages, en el orden de lectura, con su Group.
#   3. Corre el script. El sidebar, el pager y el aria-current de todas las
#      paginas quedan sincronizados.
#
# LOS BLOQUES (campo Group)
# El menu se parte en bloques con nombre en vez de ser una lista plana de
# dieciseis entradas: asi el orden se explica solo. El orden es de REFERENCIA,
# no de induccion - la identidad visual va primero porque es lo que la gente
# viene a buscar, y la induccion la cubre entera la portada (00). Ver
# docs/superpowers/specs/2026-09-14-reorganizacion-manual-trip-design.md
#
# Group = $null significa "sin titulo de bloque" y solo lo usa la portada.
# Paginas consecutivas con el mismo Group forman un bloque; no reordenar sin
# reagrupar, o se emiten dos bloques con el mismo titulo.
#
# Es idempotente: correrlo dos veces no cambia nada la segunda vez.

param([switch]$DryRun)

$ErrorActionPreference = 'Stop'
$Root = Split-Path -Parent $PSScriptRoot

# ---------------------------------------------------------------------------
# FUENTE UNICA DE VERDAD: el orden, los bloques y los nombres de las secciones.
# ---------------------------------------------------------------------------
$Pages = @(
  @{ File = 'index.html';                   N = '00'; Title = 'Resumen ejecutivo';             Group = $null }

  @{ File = '01-logotipo.html';             N = '01'; Title = 'Logotipo';                      Group = 'A · Identidad visual' }
  @{ File = '02-propuestas-logo.html';      N = '02'; Title = 'Propuestas de logo';            Group = 'A · Identidad visual' }
  @{ File = '03-paleta-color.html';         N = '03'; Title = 'Paleta de color';               Group = 'A · Identidad visual' }
  @{ File = '04-tipografia.html';           N = '04'; Title = 'Tipografía';                    Group = 'A · Identidad visual' }
  @{ File = '05-iconografia-canal.html';    N = '05'; Title = 'Iconografía y diseño por canal'; Group = 'A · Identidad visual' }
  @{ File = '06-sistema-fotografia.html';   N = '06'; Title = 'Sistema gráfico y fotografía';  Group = 'A · Identidad visual' }
  @{ File = '07-accesibilidad.html';        N = '07'; Title = 'Accesibilidad';                 Group = 'A · Identidad visual' }

  @{ File = '08-arquitectura.html';         N = '08'; Title = 'Arquitectura y nombre';         Group = 'B · Quién es y cómo habla' }
  @{ File = '09-audiencias.html';           N = '09'; Title = 'Audiencias';                    Group = 'B · Quién es y cómo habla' }
  @{ File = '10-propuesta-valor.html';      N = '10'; Title = 'Propuesta de valor y claims';   Group = 'B · Quién es y cómo habla' }
  @{ File = '11-voz-tono.html';             N = '11'; Title = 'Voz y tono';                    Group = 'B · Quién es y cómo habla' }
  @{ File = '12-vocabulario.html';          N = '12'; Title = 'Vocabulario';                   Group = 'B · Quién es y cómo habla' }

  @{ File = '13-promociones-cta.html';      N = '13'; Title = 'Promociones y CTA';             Group = 'C · Cómo se aplica' }
  @{ File = '14-entregables.html';          N = '14'; Title = 'Entregables y aplicaciones';    Group = 'C · Cómo se aplica' }
  @{ File = '15-redes-sociales.html';       N = '15'; Title = 'Redes sociales';                Group = 'C · Cómo se aplica' }
)

$Utf8NoBom = New-Object System.Text.UTF8Encoding($false)

function New-Nav([string]$currentFile) {
  $blocks = @()
  $items = @()
  $groupOfBlock = $null
  $started = $false

  foreach ($p in $Pages) {
    if (-not $started -or $p.Group -ne $groupOfBlock) {
      if ($started) { $blocks += ,@($groupOfBlock, $items); $items = @() }
      $groupOfBlock = $p.Group
      $started = $true
    }
    if ($p.File -eq $currentFile) {
      $items += '          <li><a href="{0}" class="active" aria-current="page"><span class="n">{1}</span><span>{2}</span></a></li>' -f $p.File, $p.N, $p.Title
    } else {
      $items += '          <li><a href="{0}"><span class="n">{1}</span><span>{2}</span></a></li>' -f $p.File, $p.N, $p.Title
    }
  }
  if ($started) { $blocks += ,@($groupOfBlock, $items) }

  $out = foreach ($b in $blocks) {
    $label = $b[0]
    $lis = $b[1]
    # aria-label siempre presente: un <nav> sin nombre accesible no se distingue
    # de los otros tres en el rotor de un lector de pantalla.
    $aria = if ($label) { $label } else { 'Portada' }
    $titleLine = if ($label) { "        <span class=""nav-group-title"">$label</span>`n" } else { '' }
    @"
    <nav class="nav-group" aria-label="$aria">
$titleLine        <ul class="nav-list">
$($lis -join "`n")
        </ul>
    </nav>
"@
  }
  $out -join "`n"
}

function New-Shell([string]$currentFile) {
  @"
<body style="background:var(--paper);">
<a class="skip-link" href="#contenido">Saltar al contenido</a>
<div class="topbar">
  <span class="topbar-brand">Linex Trip <small>MANUAL DE MARCA</small></span>
  <button class="nav-toggle" data-nav-toggle aria-expanded="false" aria-controls="sidebar">
    <span class="bars" aria-hidden="true"><span></span><span></span><span></span></span>
    Menú
  </button>
</div>
<div class="nav-scrim" data-nav-scrim></div>
<div class="shell">
  <aside class="sidebar" id="sidebar">
    <a class="sidebar-brand" href="index.html">
      <span class="name">Linex Trip</span>
      <span class="tag">Manual de Marca &middot; v1.0</span>
    </a>

$(New-Nav $currentFile)

  </aside>
  <main class="main" id="contenido">
"@
}

function New-Pager([int]$i) {
  $parts = @()
  if ($i -gt 0) {
    $p = $Pages[$i - 1]
    $parts += '<a class="prev" href="{0}"><span class="dir">&larr; Anterior</span><span class="lbl">{1} &middot; {2}</span></a>' -f $p.File, $p.N, $p.Title
  } else {
    $parts += '<span class="spacer"></span>'
  }
  if ($i -lt $Pages.Count - 1) {
    $p = $Pages[$i + 1]
    $parts += '<a class="next" href="{0}"><span class="dir">Siguiente &rarr;</span><span class="lbl">{1} &middot; {2}</span></a>' -f $p.File, $p.N, $p.Title
  } else {
    $parts += '<span class="spacer"></span>'
  }
  '      <div class="pager">{0}</div>' -f ($parts -join '')
}

$changed = 0
for ($i = 0; $i -lt $Pages.Count; $i++) {
  $page = $Pages[$i]
  $path = Join-Path $Root $page.File
  if (-not (Test-Path $path)) { Write-Warning "no existe: $($page.File)"; continue }

  $text = [System.IO.File]::ReadAllText($path)
  $original = $text

  # 1. Shell: desde <body ...> hasta la apertura de <main>. Ancla estable, por eso
  #    el script se puede volver a correr sobre su propia salida.
  $shellRx = [regex]'(?s)<body[^>]*>.*?<main class="main"[^>]*>\r?\n'
  if ($shellRx.IsMatch($text)) {
    $text = $shellRx.Replace($text, { param($m) (New-Shell $page.File) + "`n" }, 1)
  } else {
    Write-Warning "no encontre el shell en $($page.File) - saltado"
    continue
  }

  # 2. Pager. No contiene <div> anidados, por eso el cierre no-greedy es seguro.
  $pagerRx = [regex]'(?s)[ \t]*<div class="pager">.*?</div>'
  if ($pagerRx.IsMatch($text)) {
    $text = $pagerRx.Replace($text, { param($m) (New-Pager $i) }, 1)
  } else {
    Write-Warning "no encontre el pager en $($page.File)"
  }

  # 3. Favicon: se inyecta una sola vez, antes de la hoja de estilo.
  if ($text -notmatch 'rel="icon"') {
    $text = $text.Replace(
      '<link rel="stylesheet" href="assets/style.css">',
      '<link rel="icon" href="assets/favicon.svg">' + "`n" + '<link rel="stylesheet" href="assets/style.css">')
  }

  if ($text -ne $original) {
    if ($DryRun) { Write-Output "cambiaria: $($page.File)" }
    else { [System.IO.File]::WriteAllText($path, $text, $Utf8NoBom); Write-Output "sincronizado: $($page.File)" }
    $changed++
  }
}

Write-Output ""
Write-Output ("paginas: {0} | modificadas: {1}{2}" -f $Pages.Count, $changed, $(if ($DryRun) { ' (dry run)' } else { '' }))
