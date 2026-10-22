# Plan para conectar el dominio y migrar — www.updategrouppr.com

El sitio actual (WordPress) **sigue en producción** hasta que se apruebe la nueva versión.

## Fase 1 — Revisión (sin tocar el dominio)
1. El código está en GitHub: `vallellanespr007/Update`.
2. En Netlify: *Add new site → Import from GitHub* → seleccionar el repositorio. Netlify lee `netlify.toml` automáticamente.
3. Se obtiene una URL temporal (ej. `updategroup.netlify.app`). Compartirla para revisión.
   - Las ramas y deploy previews se publican en **modo revisión** (muestran borradores y no se indexan).
4. El panel ya apunta al repositorio `vallellanespr007/Update` (en `public/admin/config.yml`).
5. Panel de contenido: en GitHub crear una *OAuth App* (Homepage `https://www.updategrouppr.com`, callback `https://api.netlify.com/auth/done`) y registrar el Client ID/Secret en Netlify → *Site configuration → Access & security → OAuth → GitHub*.
6. Formularios: en Netlify → *Forms*, activar la detección de formularios y configurar las notificaciones por email al correo verificado. **Hacer un envío de prueba** y confirmar que llega al correo.

## Fase 2 — Aprobación
- Completar `PENDIENTES.md` (logo SVG, email, autorizaciones, proyectos).
- Revisar en celular, tablet y escritorio.
- Hacer un envío real del formulario y confirmar que llega.

## Fase 3 — Conectar el dominio
1. Bajar el TTL de los registros DNS actuales a 300 s un día antes.
2. En Netlify → *Domain management* → añadir `www.updategrouppr.com` (dominio principal) y `updategrouppr.com` (redirige a www).
3. En el registrador del dominio:
   - `www` → **CNAME** a `<sitio>.netlify.app`
   - `@` (raíz) → **A** a `75.2.60.5` (balanceador de Netlify), o usar Netlify DNS.
   - **No tocar los registros MX** (el correo debe seguir funcionando).
4. Netlify emite el certificado HTTPS automáticamente.
5. Verificar: inicio, cada página, formulario, `/sitemap-index.xml`, `/robots.txt`.
6. En Google Search Console: añadir la propiedad y enviar el sitemap.
7. Mantener una copia de seguridad del WordPress (archivos + base de datos) por al menos 3 meses.

## Mapa de redirecciones (configuradas en netlify.toml)
| URL anterior | Nueva URL | Tipo |
|---|---|---|
| `/` | `/` | — |
| `/servicios/` | `/servicios/` | Se conserva |
| `/contact-us/`, `/contact/` | `/contacto/` | 301 |
| `/about/` | `/nosotros/` | 301 |
| `/portfolio/` | `/proyectos/` | 301 |
| `/feed/`, `/comments/feed/` | `/` | 301 |
| `/wp-content/uploads/*` | `/` | 301 |
| `/wp-admin/*`, `/wp-login.php` | `/` | 301 |
| `/?p=*` | `/` | 301 |
| `/xmlrpc.php`, `/wp-json/*` | — | 410 |

El sitio actual solo tenía dos páginas públicas (Inicio y Servicios), así que el impacto en SEO es mínimo.
