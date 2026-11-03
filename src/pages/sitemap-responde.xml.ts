import type { APIRoute } from 'astro';
import responde from '../data/responde.json';

export const GET: APIRoute = () => {
  const BASE = 'https://painelsaude.com.br';
  const INDEX_DATE = '2026-11-03';

  const urls = [
    `<url><loc>${BASE}/responde/</loc><lastmod>${INDEX_DATE}</lastmod><changefreq>weekly</changefreq><priority>0.8</priority></url>`,
    ...responde.map(item =>
      `<url><loc>${BASE}/responde/${item.slug}/</loc><lastmod>${(item as any).updated || INDEX_DATE}</lastmod><changefreq>monthly</changefreq><priority>0.7</priority></url>`
    )
  ].join('\n  ');

  return new Response(
    `<?xml version="1.0" encoding="UTF-8"?>\n<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n  ${urls}\n</urlset>`,
    { headers: { 'Content-Type': 'application/xml' } }
  );
};
