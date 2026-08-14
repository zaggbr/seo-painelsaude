import type { APIRoute } from 'astro';
import fs from 'node:fs';

export const GET: APIRoute = () => {
  const base = 'https://painelsaude.com.br';

  const operadoras = JSON.parse(fs.readFileSync('./src/data/operadoras.json', 'utf-8'));
  const cidades = JSON.parse(fs.readFileSync('./src/data/cidades_top500.json', 'utf-8'));

  const operadoraUrls = operadoras.slice(0, 200).map((op: any) => `
  <url>
    <loc>${base}/planos/operadora/${op.slug}</loc>
    <changefreq>monthly</changefreq>
    <priority>0.8</priority>
  </url>`).join('');

  const cidadeUrls = cidades.slice(0, 500).map((cidade: any) => `
  <url>
    <loc>${base}/planos/cidade/${cidade.slug}</loc>
    <changefreq>monthly</changefreq>
    <priority>0.8</priority>
  </url>`).join('');

  const sitemap = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
  <url>
    <loc>${base}/planos</loc>
    <changefreq>weekly</changefreq>
    <priority>1.0</priority>
  </url>${operadoraUrls}${cidadeUrls}
</urlset>`;

  return new Response(sitemap, {
    headers: {
      'Content-Type': 'application/xml',
      'Cache-Control': 'public, max-age=3600'
    }
  });
};
