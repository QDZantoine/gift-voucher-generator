import { MetadataRoute } from "next";

/**
 * Configuration robots.txt pour le référencement
 * @see https://nextjs.org/docs/app/api-reference/file-conventions/metadata/robots
 */
export default function robots(): MetadataRoute.Robots {
  const baseUrl = "https://influences-bayonne.fr";

  return {
    rules: [
      {
        userAgent: "*",
        allow: "/",
        disallow: [
          "/dashboard/",
          "/admin/",
          "/api/",
          "/_next/",
          "/login",
          "/register",
        ],
        crawlDelay: 1,
      },
      {
        userAgent: "Googlebot",
        allow: "/",
        disallow: ["/dashboard/", "/admin/", "/api/", "/login", "/register"],
      },
      {
        userAgent: "Googlebot-Image",
        allow: "/images/",
        disallow: ["/dashboard/", "/api/"],
      },
      // Bloquer les bots indésirables
      {
        userAgent: [
          "GPTBot",
          "ChatGPT-User",
          "CCBot",
          "anthropic-ai",
          "Claude-Web",
          "cohere-ai",
        ],
        disallow: ["/"],
      },
    ],
    sitemap: [`${baseUrl}/sitemap.xml`],
    host: baseUrl,
  };
}
