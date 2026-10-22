import { defineConfig } from 'astro/config';
import sitemap from '@astrojs/sitemap';

// Modo revisión: muestra borradores y marca el sitio como noindex.
const REVIEW = process.env.PUBLIC_REVIEW === 'true';

export default defineConfig({
  site: 'https://www.updategrouppr.com',
  trailingSlash: 'always',
  i18n: {
    defaultLocale: 'es',
    locales: ['es'], // Añadir 'en' cuando la traducción esté completa.
  },
  integrations: REVIEW ? [] : [sitemap({ filter: (page) => !page.includes('/gracias/') })],
  image: { responsiveStyles: true },
});
