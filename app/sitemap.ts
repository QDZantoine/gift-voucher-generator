import { MetadataRoute } from "next";

/**
 * Sitemap dynamique pour le référencement
 * @see https://nextjs.org/docs/app/api-reference/file-conventions/metadata/sitemap
 */
export default function sitemap(): MetadataRoute.Sitemap {
  const baseUrl = "https://influences-bayonne.fr";
  const currentDate = new Date();

  return [
    {
      url: baseUrl,
      lastModified: currentDate,
      changeFrequency: "weekly",
      priority: 1.0,
      alternates: {
        languages: {
          fr: baseUrl,
        },
      },
    },
    {
      url: `${baseUrl}/success`,
      lastModified: currentDate,
      changeFrequency: "monthly",
      priority: 0.3,
    },
    {
      url: `${baseUrl}/cancel`,
      lastModified: currentDate,
      changeFrequency: "monthly",
      priority: 0.1,
    },
    // Ajouter d'autres pages publiques si nécessaire
    // Note: Les pages /dashboard, /admin, /api sont exclues via robots.txt
  ];
}

// Configuration pour Next.js
export const revalidate = 3600; // Revalider toutes les heures
