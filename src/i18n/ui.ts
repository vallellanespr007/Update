// Textos de interfaz. Para la versión en inglés: añadir `en` con las mismas claves
// y activar el locale en astro.config.mjs. No mostrar selector hasta completar la traducción.
export const ui = {
  es: {
    'nav.home': 'Inicio',
    'nav.services': 'Servicios',
    'nav.projects': 'Proyectos',
    'nav.about': 'Nosotros',
    'nav.contact': 'Contacto',
    'cta.talk': 'Hablemos de tu proyecto',
    'cta.proposal': 'Solicita una propuesta',
    'cta.explore': 'Explora nuestro trabajo',
    'a11y.skip': 'Saltar al contenido',
    'a11y.menu': 'Abrir menú',
    'a11y.close': 'Cerrar menú',
  },
} as const;

export type Lang = keyof typeof ui;
export const t = (key: keyof (typeof ui)['es'], lang: Lang = 'es') => ui[lang][key];
