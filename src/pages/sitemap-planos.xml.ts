import type { APIRoute } from 'astro';
import fs from 'node:fs';

export const GET: APIRoute = () => {
  const base = 'https://painelsaude.com.br';

  const operadoras = JSON.parse(fs.readFileSync('./src/data/operadoras.json', 'utf-8'));
  const cidades = JSON.parse(fs.readFileSync('./src/data/cidades_top500.json', 'utf-8'));

  let lastmod: Record<string, { hash: string; date: string }> = {};
  try {
    lastmod = JSON.parse(fs.readFileSync('./src/data/lastmod.json', 'utf-8'));
  } catch {
    // arquivo ausente: operadoras saem sem <lastmod>
  }

  const operadoraUrls = operadoras.slice(0, 200).map((op: any) => {
    const entry = lastmod[op.slug];
    const lastmodTag = entry ? `\n    <lastmod>${entry.date}</lastmod>` : '';
    return `
  <url>
    <loc>${base}/planos/operadora/${op.slug}</loc>${lastmodTag}
  </url>`;
  }).join('');

  const cidadeUrls = cidades.slice(0, 500).map((cidade: any) => `
  <url>
    <loc>${base}/planos/cidade/${cidade.slug}</loc>
  </url>`).join('');

  const sitemap = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
  <url>
    <loc>${base}/planos</loc>
  </url>${operadoraUrls}${cidadeUrls}
</urlset>`;

  return new Response(sitemap, {
    headers: {
      'Content-Type': 'application/xml',
      'Cache-Control': 'public, max-age=3600'
    }
  });
};
