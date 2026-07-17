import { defineConfig } from 'astro/config';
import sitemap from '@astrojs/sitemap';

export default defineConfig({
  site: 'https://painelsaude.com.br',
  
  // Prefetching inteligente
  prefetch: {
    prefetchAll: true,
    defaultStrategy: 'viewport'
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
