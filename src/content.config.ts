import { defineCollection, z } from 'astro:content';
import { glob, file } from 'astro/loaders';

export const DISCIPLINES = ['branding', 'redes-sociales', 'audiovisual', 'websites', 'campanas-eventos'] as const;
export const SECTORS = ['gobierno', 'marcas', 'organizaciones'] as const;

const projects = defineCollection({
  loader: glob({ pattern: '*.md', base: './src/content/projects' }),
  schema: ({ image }) =>
    z.object({
      title: z.string(),
      client: z.string(),
      sector: z.enum(SECTORS),
      disciplines: z.array(z.enum(DISCIPLINES)).default([]),
      summary: z.string(),
      cover: image().optional(),
      coverAlt: z.string().default(''),
      video: z.string().optional(),
      videoPoster: image().optional(),
      gallery: z.array(z.object({ image: image(), alt: z.string() })).default([]),
      context: z.string().optional(),
      objective: z.string().optional(),
      services: z.array(z.string()).default([]),
      results: z.string().optional(),
      featured: z.boolean().default(false),
      spotlight: z.boolean().default(false),
      order: z.number().default(100),
      draft: z.boolean().default(true),
      pending: z.array(z.string()).default([]),
    }),
});

const services = defineCollection({
  loader: glob({ pattern: '*.md', base: './src/content/services' }),
  schema: z.object({
    title: z.string(),
    short: z.string(),
    summary: z.string(),
    need: z.string(),
    includes: z.array(z.string()),
    order: z.number(),
  }),
});

const clients = defineCollection({
  loader: file('./src/content/clients.json', { parser: (text) => JSON.parse(text).clients }),
  schema: ({ image }) =>
    z.object({
      name: z.string(),
      sector: z.enum(SECTORS),
      abbr: z.string().optional(),
      logo: image().optional(),
      home: z.boolean().default(false),
      order: z.number().default(100),
    }),
});

export const collections = { projects, services, clients };
