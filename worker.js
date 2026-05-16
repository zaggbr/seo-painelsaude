export default {
  async fetch(request, env, ctx) {
    const url = new URL(request.url);

    if (url.pathname === '/sitemap-planos.xml') {
      const response = await fetch('https://seo-painelsaude.pages.dev/sitemap-planos.xml');
      return new Response(response.body, {
        status: response.status,
        headers: { 'Content-Type': 'application/xml', 'Cache-Control': 'public, max-age=3600' }
      });
    }

    if (url.pathname.startsWith('/planos')) {
      const targetURL = `https://seo-painelsaude.pages.dev${url.pathname}${url.search}`;
      const response = await fetch(targetURL, {
        method: request.method,
        headers: request.headers,
      });
      return new Response(response.body, {
        status: response.status,
        headers: response.headers,
      });
    }

    // Todo o resto vai para o WordPress
    const newRequest = new Request(request.url, request);
    return fetch(newRequest);
  }
};
