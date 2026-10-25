# Update Group — Website

Website de [Update Group](https://www.updategrouppr.com), en español e inglés.

- `index.html`: página principal.
- `services.html`: página de servicios con fotos y detalle de cada servicio.
- `site.css`: estilos compartidos por las dos páginas.
- `js/`: el código JavaScript de las páginas (`main.js` para la principal, `services.js` para servicios).
- `vendor/pdfjs/`: visor de PDF (pdf.js 3.11.174) guardado en el repo para no depender de otra página. Solo se descarga al abrir una propuesta en el portal.
- `img/`: fotos de los servicios (generadas con AI en Higgsfield).
- `mark.png`: símbolo de la marca (original). De aquí salen `img/mark-76.webp` (menú), `img/mark-360.webp` (pase y pasaporte), `img/favicon-32.png` y `img/apple-touch-icon.png`.
- `img/clients/`: logos de clientes en WebP, al doble del tamaño en que se ven.
- `img/og.jpg`: imagen que sale al compartir el link (captura del hero, 1200×630).
- `propuesta-ejemplo.pdf`: propuesta de ejemplo que se muestra en el portal de clientes.

## Verlo y publicarlo
- Local: abrir `index.html` en el navegador.
- En línea: cada push a `main` publica el website automáticamente con GitHub Actions
  (`.github/workflows/deploy.yml`). El progreso se ve en la pestaña **Actions** del repo.
- Requisito, una sola vez: Settings → Pages → Build and deployment → Source: **GitHub Actions**.
- La rama `pruebas` no se publica sola; para publicar sus cambios hay que pasarlos a `main`.

## Seguridad
- Las dos páginas tienen una política de seguridad (Content-Security-Policy) en el `<head>`. Solo deja cargar código desde este mismo sitio y las fuentes de Google.
- Por eso **no se puede poner código `<script>` directo dentro del HTML**: el navegador lo bloquea. Todo el JavaScript va en archivos dentro de `js/`.
- Si se añade algo de otra página (un video, un mapa, un chat), hay que permitir ese dominio en la política o no va a cargar.

## Importante antes de usarlo con clientes reales
- **Portal de clientes: apagado.** No hay ningún botón ni enlace hacia él en el website, porque todavía es un prototipo y no tiene acceso protegido de verdad. El código y la ruta siguen ahí: solo abre con el link directo `index.html#portal`. Para volver a mostrarlo, hay que reponer las entradas (botón del menú, enlace del hero y la tarjeta del portal) y el texto del paso 02 y del contacto.
- **Portal de clientes, por qué es prototipo:** La clave (`UPDATE2026`) está dentro del código, así que cualquiera puede verla. No subir propuestas reales hasta conectar un sistema con acceso protegido en el servidor.
- **Formulario de contacto:** envía a `/api/contact`, que necesita un servidor. Si el servidor no contesta (por ejemplo en GitHub Pages, donde no existe), el formulario no borra los datos y ofrece un botón para enviar la misma solicitud por WhatsApp, ya escrita.
