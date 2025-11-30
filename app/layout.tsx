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
  metadataBase: new URL("https://gift.restaurant-influences.fr"),
  title: {
    default: "Influences Restaurant - Bons Cadeaux Bayonne | Gastronomie",
    template: "%s | Influences Restaurant Bayonne",
  },
  description:
    "Offrez une expérience gastronomique inoubliable avec les bons cadeaux du Restaurant Influences à Bayonne. Cuisine moderne et raffinée, produits locaux. Réservez en ligne.",
  keywords: [
    "restaurant bayonne",
    "bon cadeau restaurant",
    "gastronomie bayonne",
    "influences bayonne",
    "carte cadeau restaurant",
    "restaurant bistronomique",
    "cuisine moderne bayonne",
    "restaurant gastronomique bayonne",
    "cadeau gourmand",
    "restaurant pays basque",
  ],
  authors: [{ name: "Antoine Quendez", url: "https://gift.restaurant-influences.fr" }],
  creator: "Antoine Quendez",
  publisher: "Restaurant Influences",
  applicationName: "Influences Gift Cards",
  referrer: "origin-when-cross-origin",
  category: "Restaurant",
  formatDetection: {
    email: false,
    address: false,
    telephone: false,
  },
  verification: {
    // Ajoutez vos codes de vérification Google, Bing, etc.
    // google: "votre-code-verification-google",
    // yandex: "votre-code-verification-yandex",
  },
  appleWebApp: {
    title: "Influences Bayonne",
    statusBarStyle: "black-translucent",
    capable: true,
    startupImage: [
      {
        url: "/apple-icon.png",
        media: "(device-width: 320px) and (device-height: 568px) and (-webkit-device-pixel-ratio: 2)",
      },
    ],
  },
  manifest: "/manifest.json",
  openGraph: {
    type: "website",
    locale: "fr_FR",
    url: "https://gift.restaurant-influences.fr",
    siteName: "Restaurant Influences Bayonne",
    title: "Influences Restaurant - Bons Cadeaux Gastronomiques à Bayonne",
    description:
      "Offrez une expérience gastronomique unique au Restaurant Influences à Bayonne. Bons cadeaux personnalisés, cuisine moderne avec produits locaux.",
    images: [
      {
        url: "https://gift.restaurant-influences.fr/images/og-image.jpg",
        width: 1200,
        height: 630,
        alt: "Restaurant Influences Bayonne - Cuisine Moderne et Raffinée",
        type: "image/jpeg",
      },
      {
        url: "https://gift.restaurant-influences.fr/images/logo-bleu.svg",
        width: 800,
        height: 400,
        alt: "Logo Restaurant Influences",
        type: "image/svg+xml",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    site: "@influences_bayonne",
    creator: "@influences_bayonne",
    title: "Influences Restaurant - Bons Cadeaux Gastronomiques Bayonne",
    description:
      "Offrez l'expérience d'une cuisine moderne et raffinée. Bons cadeaux personnalisés pour le Restaurant Influences à Bayonne.",
    images: ["https://gift.restaurant-influences.fr/images/og-image.jpg"],
  },
  alternates: {
    canonical: "https://gift.restaurant-influences.fr",
    languages: {
      "fr-FR": "https://gift.restaurant-influences.fr",
      "x-default": "https://gift.restaurant-influences.fr",
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
      { url: "/icon1.png", sizes: "32x32", type: "image/png" },
      { url: "/icon0.svg", type: "image/svg+xml" },
    ],
    apple: [
      { url: "/apple-icon.png", sizes: "180x180", type: "image/png" },
    ],
  },
  other: {
    "mobile-web-app-capable": "yes",
    "apple-mobile-web-app-capable": "yes",
    "apple-mobile-web-app-status-bar-style": "black-translucent",
    "apple-mobile-web-app-title": "influences-bayonne",
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
