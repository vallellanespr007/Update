import { getCollection, type CollectionEntry } from 'astro:content';

/** Modo revisión: muestra borradores con su lista de pendientes. Nunca activar en producción. */
export const REVIEW = import.meta.env.PUBLIC_REVIEW === 'true';

export const DISCIPLINE_LABELS: Record<string, string> = {
  branding: 'Branding',
  'redes-sociales': 'Redes sociales',
  audiovisual: 'Audiovisual',
  websites: 'Websites',
  'campanas-eventos': 'Campañas y eventos',
};

export const SECTOR_LABELS: Record<string, string> = {
  marcas: 'Marcas y empresas',
  gobierno: 'Gobierno e instituciones',
  organizaciones: 'Organizaciones y causas',
};

export async function getProjects() {
  const all = await getCollection('projects', ({ data }) => REVIEW || !data.draft);
  return all.sort((a, b) => a.data.order - b.data.order);
}

export async function getServices() {
  return (await getCollection('services')).sort((a, b) => a.data.order - b.data.order);
}

export async function getClients() {
  return (await getCollection('clients')).sort((a, b) => a.data.order - b.data.order);
}

export function disciplinesText(p: CollectionEntry<'projects'>) {
  return p.data.disciplines.map((d) => DISCIPLINE_LABELS[d]).join(' · ');
}
