/* El armazón de una página del manual de Linex Travel.
 *
 * POR QUÉ EXISTE
 * Las 23 secciones comparten cabecera, topbar, sidebar y pie. Escribir eso a
 * mano 23 veces es cómo se cuelan las diferencias: una página con el favicon
 * viejo, otra sin el enlace de saltar al contenido, otra con el <title> en otro
 * formato. Aquí el armazón vive una vez y cada sección solo aporta su contenido.
 *
 * Los marcadores <!--nav--> y <!--pager--> los rellena sync-nav.js después.
 */

function pagina({ n, titulo, meta, h1, lede, cuerpo }) {
  return `<!doctype html>
<html lang="es">
<head>
<meta charset="utf-8">
<meta name="viewport" content="width=device-width, initial-scale=1">
<title>${n} · ${titulo} · Manual de Marca Linex Travel</title>
<meta name="description" content="${meta}">
<link rel="icon" href="assets/favicon.svg">
<link rel="stylesheet" href="assets/style.css">
</head>
<body style="background:var(--paper);">
<a class="skip-link" href="#contenido">Saltar al contenido</a>
<div class="topbar">
  <span class="topbar-brand">Linex Travel <small>MANUAL DE MARCA</small></span>
  <button class="nav-toggle" data-nav-toggle aria-expanded="false" aria-controls="sidebar">
    <span class="bars" aria-hidden="true"><span></span><span></span><span></span></span>
    Menú
  </button>
</div>
<div class="nav-scrim" data-nav-scrim></div>
<div class="shell">
  <aside class="sidebar" id="sidebar">
    <a class="sidebar-brand" href="index.html">
      <span class="name">Linex Travel</span>
      <span class="tag">Manual de Marca &middot; v1.0</span>
    </a>
    <!--nav-->
    <!--/nav-->
  </aside>
  <main class="main" id="contenido">
    <div class="main-inner">

<p class="page-index"><span class="page-index-n">${n}</span><span class="eyebrow">${titulo}</span></p>
<h1 class="page-title">${h1}</h1>
<p class="lede">${lede}</p>

${cuerpo}

      <div class="footer-meta">
        <span>manual-marca-linex-travel-v1.0 &middot; sitio estático de distribución</span>
        <span>Manual de Marca de Linex Travel &middot; 2026</span>
      </div>
      <!--pager-->
      <!--/pager-->
    </div>
  </main>
</div>
<script src="assets/nav.js"></script>
</body>
</html>
`;
}

module.exports = { pagina };
