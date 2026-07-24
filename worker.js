// worker.js — seo-painelsaude-proxy (catch-all)
var worker_default = {
  async fetch(request, env, ctx) {
    const url = new URL(request.url);
    const path = url.pathname;

    // ── Silos Astro + assets + sitemaps + home → seo-painelsaude ──
    if (path === "/" ||
        path.startsWith("/planos") ||
        path.startsWith("/simuladores") ||
        path.startsWith("/_astro") ||
        path.startsWith("/sitemap-planos") ||
        path.startsWith("/sitemap-simuladores") ||
        path.startsWith("/sitemap-index")) {
      const targetURL = `https://seo-painelsaude.pages.dev${path}${url.search}`;
      const response = await fetch(targetURL, {
        method: request.method,
        headers: request.headers
      });
      return new Response(response.body, {
        status: response.status,
        headers: response.headers
      });
    }

    // ── Tudo o resto → WordPress ──
    const newRequest = new Request(request.url, request);
    return fetch(newRequest);
  }
};
export {
  worker_default as default
};
