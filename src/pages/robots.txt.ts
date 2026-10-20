import type { APIRoute } from "astro";

export const GET: APIRoute = ({ site }) => {
  if (!site) {
    throw new Error("Set site in astro.config.mjs to generate the robots sitemap URL.");
  }

  const sitemapURL = new URL("/sitemap-index.xml", site);
  return new Response(
    `User-agent: *\nAllow: /\n\nSitemap: ${sitemapURL.href}\n`,
    { headers: { "Content-Type": "text/plain; charset=utf-8" } },
  );
};
