import type { APIRoute } from 'astro';
import responde from '../data/responde.json';

export const GET: APIRoute = () => {
  const BASE = 'https://painelsaude.com.br';
  const today = new Date().toISOString().split('T')[0];

  const urls = [
    `<url><loc>${BASE}/responde/</loc><lastmod>${today}</lastmod><changefreq>weekly</changefreq><priority>0.8</priority></url>`,
    ...responde.map(item =>
      `<url><loc>${BASE}/responde/${item.slug}/</loc><lastmod>${today}</lastmod><changefreq>monthly</changefreq><priority>0.7</priority></url>`
    )
  ].join('\n  ');

  return new Response(
    `<?xml version="1.0" encoding="UTF-8"?>\n<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n  ${urls}\n</urlset>`,
    { headers: { 'Content-Type': 'application/xml' } }
  );
};
