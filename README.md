# Update Group — Website

Website de [Update Group](https://www.updategrouppr.com), en español e inglés.

- `index.html`: página principal.
- `services.html`: página de servicios con fotos y detalle de cada servicio.
- `site.css`: estilos compartidos por las dos páginas.
- `js/`: el código JavaScript de las páginas (`main.js` para la principal, `services.js` para servicios).
- `vendor/pdfjs/`: visor de PDF (pdf.js 3.11.174) guardado en el repo para no depender de otra página.
- `img/`: fotos de los servicios (generadas con AI en Higgsfield).
- `mark.png`: símbolo de la marca.
- `propuesta-ejemplo.pdf`: propuesta de ejemplo que se muestra en el portal de clientes.

## Verlo y publicarlo
- Local: abrir `index.html` en el navegador.
- En línea: cada push a `main` publica el website automáticamente con GitHub Actions
  (`.github/workflows/deploy.yml`). El progreso se ve en la pestaña **Actions** del repo.
- Requisito, una sola vez: Settings → Pages → Build and deployment → Source: **GitHub Actions**.
- La rama `pruebas` no se publica sola; para publicar sus cambios hay que pasarlos a `main`.

## Inglés y español (dos URLs)
- `index.html` y `services.html` son páginas **bilingües**: cada texto va dos veces, en `<span class="en">` y `<span class="es">` (o `<i>`). Se editan aquí, en un solo lugar.
- Al publicar, `tools/build_site.py` genera la carpeta `_site/` con:
  - `/` y `/services.html` → solo inglés.
  - `/es/` y `/es/services.html` → solo español, con título y descripción propios para Google.
  - `sitemap.xml` con las 4 páginas y las etiquetas `hreflang` que le dicen a Google cuál es cuál.
- En el sitio publicado el botón **EN/ES** lleva a la otra URL y recuerda la preferencia.
- Probarlo local: `python3 tools/build_site.py` y abrir `_site/index.html`.
- Los títulos y descripciones en español están en `ES_META`, dentro de `tools/build_site.py`.

## SEO
- Título, descripción, canonical, Open Graph (imagen `img/og-image.jpg`) y datos estructurados de negocio (JSON-LD) en el `<head>`.
- `robots.txt` y `sitemap.xml` usan el dominio `https://www.updategrouppr.com/`. Si el sitio se publica en otro dominio, hay que cambiarlos junto con los `canonical`.
- `404.html`: página de error con la marca.
- Favicons: `favicon.png`, `favicon-48.png`, `apple-touch-icon.png`, `icon-512.png`.

## Seguridad
- Las dos páginas tienen una política de seguridad (Content-Security-Policy) en el `<head>`. Solo deja cargar código desde este mismo sitio y las fuentes de Google.
- Por eso **no se puede poner código `<script>` directo dentro del HTML**: el navegador lo bloquea. Todo el JavaScript va en archivos dentro de `js/`.
- Si se añade algo de otra página (un video, un mapa, un chat), hay que permitir ese dominio en la política o no va a cargar.

## Importante antes de usarlo con clientes reales
- **Portal de clientes:** es un prototipo. La clave (`UPDATE2026`) está dentro del código, así que cualquiera puede verla. No subir propuestas reales hasta conectar un sistema con acceso protegido en el servidor.
- **Formulario de contacto:** envía a `/api/contact`, que necesita un servidor. En GitHub Pages ese servidor no existe, así que ahí el formulario muestra el aviso para escribir por WhatsApp.
