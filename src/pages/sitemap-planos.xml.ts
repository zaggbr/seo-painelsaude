import type { APIRoute } from 'astro';
import operadoras from '../data/operadoras.json';

export const GET: APIRoute = () => {
  const base = 'https://painelsaude.com.br';

  const urls = operadoras.slice(0, 200).map((op: any) => `
  <url>
    <loc>${base}/planos/operadora/${op.slug}</loc>
    <changefreq>monthly</changefreq>
    <priority>0.8</priority>
  </url>`).join('');

  const sitemap = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
  <url>
    <loc>${base}/planos</loc>
    <changefreq>weekly</changefreq>
    <priority>1.0</priority>
  </url>${urls}
</urlset>`;

  return new Response(sitemap, {
    headers: { 'Content-Type': 'application/xml' }
  });
};
