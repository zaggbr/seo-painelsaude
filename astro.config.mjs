import { defineConfig } from 'astro/config';
import sitemap from '@astrojs/sitemap';

export default defineConfig({
  site: 'https://painelsaude.com.br',
  
  // Redirecionamentos de SEO (Astro)
  redirects: {
    '/home': '/',
  },
  
  // Prefetching inteligente
  prefetch: {
    prefetchAll: true,
    defaultStrategy: 'viewport'
  },
  
  // Configuração de Imagens Externas
  image: {
    domains: ['seo-painelsaude.pages.dev', 'painelsaude.com.br'],
  },
  
  // Integrações
  integrations: [
    sitemap({
      filter: (page) => {
        // Excluir páginas não canônicas
        return !page.includes('/page/') && 
               !page.includes('/feed/') &&
               !page.includes('/home/');
      },
      changefreq: 'weekly',
      priority: 0.7,
      lastmod: new Date(),
      serialize: (item) => {
        const path = new URL(item.url).pathname;
        
        // Home (neste escopo do proxy: /planos ou root)
        if (path === '/' || path === '/planos/' || path === '/planos') {
          return { ...item, changefreq: 'daily', priority: 1.0 };
        }
        
        // Simuladores
        if (path.startsWith('/simuladores/')) {
          return { ...item, changefreq: 'monthly', priority: 0.9 };
        }
        
        // Operadoras (Ex: 114+ páginas)
        if (path.startsWith('/planos/operadora/')) {
          return { ...item, changefreq: 'monthly', priority: 0.6 };
        }
        
        return item;
      },
    }),
  ],
  
  // Vite config para otimização
  vite: {
    build: {
      cssMinify: true,
      minify: true,
    }
  }
});
