import type { Metadata } from "next";
import { Playfair_Display, Lato } from "next/font/google";
import "./globals.css";
import { Toaster } from "@/components/ui/sonner";
import { ThemeProvider } from "@/components/theme-provider";
import { StructuredData } from "@/components/seo/StructuredData";

// Configuration des polices selon la charte graphique du restaurant
const playfairDisplay = Playfair_Display({
  subsets: ["latin"],
  variable: "--font-playfair-display",
  display: "swap",
});

const lato = Lato({
  subsets: ["latin"],
  variable: "--font-lato",
  weight: ["100", "300", "400", "700", "900"],
  display: "swap",
});

export const metadata: Metadata = {
  metadataBase: new URL("https://influences-bayonne.fr"),
  title: {
    default: "Bons Cadeaux Restaurant Influences Bayonne | Cuisine Moderne",
    template: "%s | Restaurant Influences Bayonne",
  },
  description:
    "Offrez un moment de partage avec les bons cadeaux du Restaurant Influences à Bayonne. Cuisine moderne et raffinée, produits locaux du Pays Basque. Réservez en ligne.",
  keywords: [
    "bon cadeau restaurant bayonne",
    "restaurant influences bayonne",
    "carte cadeau restaurant pays basque",
    "restaurant gastronomique bayonne",
    "bon cadeau gastronomique",
    "restaurant bistronomique bayonne",
    "cuisine moderne bayonne",
    "restaurant 64100",
    "cadeau restaurant bayonne",
    "restaurant influences",
    "bon cadeau influences",
    "restaurant vieille boucherie bayonne",
  ],
  authors: [
    { name: "Antoine Quendez", url: "https://www.anthea-digitalbloom.fr" },
    { name: "Restaurant Influences", url: "https://restaurant-influences.fr" },
  ],
  creator: "Antoine Quendez",
  publisher: "Restaurant Influences",
  applicationName: "Restaurant Influences - Bons Cadeaux",
  referrer: "origin-when-cross-origin",
  category: "Restaurant",
  classification: "Gastronomie, Restaurant, Bons Cadeaux",
  formatDetection: {
    email: false,
    address: false,
    telephone: false,
  },
  verification: {
    // Ajoutez vos codes de vérification Google, Bing, etc.
    // google: "votre-code-verification-google",
    // bing: "votre-code-verification-bing",
    // yandex: "votre-code-verification-yandex",
  },
  appleWebApp: {
    title: "influences-bayonne",
    statusBarStyle: "black-translucent",
    capable: true,
    startupImage: [
      {
        url: "/apple-touch-icon.png",
        media:
          "(device-width: 320px) and (device-height: 568px) and (-webkit-device-pixel-ratio: 2)",
      },
    ],
  },
  manifest: "/site.webmanifest",
  openGraph: {
    type: "website",
    locale: "fr_FR",
    url: "https://influences-bayonne.fr",
    siteName: "Restaurant Influences Bayonne",
    title: "Bons Cadeaux Restaurant Influences - Cuisine Moderne à Bayonne",
    description:
      "Offrez une expérience gastronomique unique au Restaurant Influences à Bayonne. Bons cadeaux personnalisés, cuisine moderne avec produits locaux du Pays Basque. Valable 1 an.",
    // Next.js utilise automatiquement opengraph-image.tsx si présent
    // L'image est générée dynamiquement à /opengraph-image
    images: [
      {
        url: "https://influences-bayonne.fr/opengraph-image",
        width: 1200,
        height: 630,
        alt: "Restaurant Influences Bayonne - Bons Cadeaux Gastronomiques",
        type: "image/png",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    site: "@influences_bayonne",
    creator: "@influences_bayonne",
    title: "Bons Cadeaux Restaurant Influences - Cuisine Moderne Bayonne",
    description:
      "Offrez l'expérience d'une cuisine moderne et raffinée au Restaurant Influences à Bayonne. Bons cadeaux personnalisés, produits locaux du Pays Basque.",
    // Utilise la même image que Open Graph (générée dynamiquement)
    images: ["https://influences-bayonne.fr/opengraph-image"],
  },
  alternates: {
    canonical: "https://influences-bayonne.fr",
    languages: {
      "fr-FR": "https://influences-bayonne.fr",
      "x-default": "https://influences-bayonne.fr",
    },
  },
  robots: {
    index: true,
    follow: true,
    nocache: false,
    googleBot: {
      index: true,
      follow: true,
      noimageindex: false,
      "max-video-preview": -1,
      "max-image-preview": "large",
      "max-snippet": -1,
    },
  },
  icons: {
    icon: [
      // Favicons générés par RealFaviconGenerator
      { url: "/favicon-96x96.png", sizes: "96x96", type: "image/png" },
      { url: "/favicon.svg", type: "image/svg+xml" },
      { url: "/favicon.ico", sizes: "any" },
    ],
    apple: [{ url: "/apple-touch-icon.png", sizes: "180x180", type: "image/png" }],
    shortcut: [{ url: "/favicon.ico" }],
    other: [
      // PWA icons depuis site.webmanifest
      {
        rel: "apple-touch-icon",
        url: "/web-app-manifest-192x192.png",
        sizes: "192x192",
      },
      {
        rel: "apple-touch-icon",
        url: "/web-app-manifest-512x512.png",
        sizes: "512x512",
      },
    ],
  },
  other: {
    "mobile-web-app-capable": "yes",
    "apple-mobile-web-app-capable": "yes",
    "apple-mobile-web-app-status-bar-style": "black-translucent",
    "apple-mobile-web-app-title": "Influences Bayonne",
    "geo.region": "FR-NAQ",
    "geo.placename": "Bayonne",
    "geo.position": "43.4929;-1.4748",
    ICBM: "43.4929, -1.4748",
    "site:official": "https://restaurant-influences.fr",
    "site:developer": "https://www.anthea-digitalbloom.fr",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="fr" suppressHydrationWarning>
      <head>
        {/* Favicons générés par RealFaviconGenerator */}
        <link rel="icon" type="image/png" href="/favicon-96x96.png" sizes="96x96" />
        <link rel="icon" type="image/svg+xml" href="/favicon.svg" />
        <link rel="shortcut icon" href="/favicon.ico" />
        <link rel="apple-touch-icon" sizes="180x180" href="/apple-touch-icon.png" />
        <meta name="apple-mobile-web-app-title" content="influences-bayonne" />
        <link rel="manifest" href="/site.webmanifest" />
        <StructuredData />
      </head>
      <body
        className={`${playfairDisplay.variable} ${lato.variable} font-lato bg-[#F8F7F2] text-[#1A2B4B]`}
      >
        <ThemeProvider
          attribute="class"
          defaultTheme="light"
          enableSystem
          disableTransitionOnChange
        >
          {children}
          <Toaster />
        </ThemeProvider>
      </body>
    </html>
  );
}
