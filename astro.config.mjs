import { defineConfig } from 'astro/config';

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

  integrations: [],
  
  // Vite config para otimização
  vite: {
    build: {
      cssMinify: true,
      minify: true,
    }
  }
});
