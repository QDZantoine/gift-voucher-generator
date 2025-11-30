import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // Configuration TypeScript stricte
  typescript: {
    // Ignorer les erreurs TypeScript pendant le build pour les fichiers générés
    ignoreBuildErrors: false,
  },

  // Configuration ESLint
  eslint: {
    // Ignorer les erreurs ESLint pendant le build pour les fichiers générés
    ignoreDuringBuilds: false,
  },

  webpack: (config, { isServer }) => {
    // Configuration pour Puppeteer et PDF generation
    if (isServer) {
      config.externals = [...(config.externals || []), "canvas", "puppeteer"];
    }

    // Ignorer les warnings pour les fichiers générés
    config.ignoreWarnings = [
      /Failed to parse source map/,
      /Critical dependency: the request of a dependency is an expression/,
    ];

    return config;
  },

  // Configuration des images
  images: {
    formats: ["image/avif", "image/webp"],
    deviceSizes: [640, 750, 828, 1080, 1200, 1920, 2048, 3840],
    imageSizes: [16, 32, 48, 64, 96, 128, 256, 384],
    minimumCacheTTL: 60,
    dangerouslyAllowSVG: true,
    contentDispositionType: "attachment",
    contentSecurityPolicy: "default-src 'self'; script-src 'none'; sandbox;",
  },

  // Configuration expérimentale pour Next.js 15
  experimental: {
    // Optimisations pour la production
    optimizePackageImports: ["lucide-react", "@radix-ui/react-icons"],
  },

  // Configuration pour Docker (standalone output)
  output: "standalone",
};

export default nextConfig;
