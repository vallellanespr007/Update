import type { APIRoute } from 'astro';
const REVIEW = import.meta.env.PUBLIC_REVIEW === 'true';

export const GET: APIRoute = ({ site }) => {
  const body = REVIEW
    ? 'User-agent: *\nDisallow: /\n'
    : `User-agent: *\nAllow: /\nDisallow: /admin/\n\nSitemap: ${new URL('sitemap-index.xml', site).href}\n`;
  return new Response(body, { headers: { 'Content-Type': 'text/plain; charset=utf-8' } });
};
