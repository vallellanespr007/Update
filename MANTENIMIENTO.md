# Mantenimiento — Website Update Group

Sitio estático hecho con **Astro 5**. El contenido está en archivos (Markdown y JSON) y se edita desde un panel visual (**Decap CMS**) en `/admin/`. El hosting recomendado es **Netlify** (formularios, vistas previas, HTTPS y redirecciones incluidas).

## Estructura
```
src/content/projects/*.md     Proyectos (un archivo por proyecto) + media/ con sus imágenes
src/content/services/*.md     Las 9 áreas de servicio
src/content/clients.json      Clientes (nombre, sector, logo, si aparece en Inicio)
src/data/site.json            Datos de contacto, redes, analítica
src/assets/clients/           Logos de clientes
src/i18n/ui.ts                Textos de interfaz (preparado para inglés)
public/admin/config.yml       Configuración del panel de contenido
netlify.toml                  Build, vistas previas y redirecciones
```

## Comandos
```bash
npm install          # una sola vez
npm run dev          # versión de revisión local (muestra borradores) → http://localhost:4321
npm run build        # versión de producción (oculta borradores) → carpeta dist/
npm run build:review # versión de revisión estática
```

## Editar contenido
- **Desde el navegador (producción):** entrar a `https://www.updategrouppr.com/admin/`, iniciar sesión con GitHub y editar. Cada cambio pasa por *Borrador → En revisión → Listo* antes de publicarse.
- **En la computadora:** en una terminal `npm run cms`, en otra `npm run dev`, y abrir `http://localhost:4321/admin/`.

### Publicar un proyecto
1. Completar cliente, sector, disciplinas, resumen, imagen principal con texto alternativo, galería, contexto, objetivo y servicios confirmados.
2. Desmarcar **Borrador**. Marcar **Destacar en Inicio** si debe salir en Inicio (las primeras piezas destacadas también alimentan el hero).
3. Los resultados solo se llenan con datos aprobados por el cliente.

### Reglas que el sitio ya cumple
- Los borradores **no se publican** en producción, no entran al sitemap y no generan página.
- Sin proyectos publicados, Inicio usa una composición tipográfica y la sección de proyectos destacados se oculta.
- Sin email ni teléfono en `site.json`, el sitio no muestra esos datos.
- El formulario solo envía cuando el sitio se compila en Netlify. En otro entorno avisa que no está conectado (nunca muestra un éxito falso).

## Imágenes y video
- Subir imágenes grandes (mínimo 2000 px de ancho). Astro genera automáticamente versiones WebP en varios tamaños.
- Videos: MP4 (H.264), máximo ~15 MB, en `public/media/`. Siempre con controles; en Inicio solo se reproducen solos si el visitante no pidió reducir movimiento.
- Siempre escribir texto alternativo que describa la pieza.

## Analítica
Pegar el ID de GA4 y/o Meta Pixel en *Configuración → Datos del sitio → Analítica*. Si quedan vacíos, no se carga ningún script de seguimiento y la política de privacidad lo indica automáticamente.

## Versión en inglés (futuro)
1. Añadir `en` en `src/i18n/ui.ts` y `locales: ['es', 'en']` en `astro.config.mjs`.
2. Crear las páginas bajo `src/pages/en/` y los campos traducidos.
3. Mostrar el selector de idioma solo cuando todo esté traducido.
