import Link from "next/link";
import { Waves } from "lucide-react";

export function PublicFooter() {
  return (
    <footer className="bg-[#1A2B4B] text-white py-8 sm:py-12 px-4 sm:px-6 lg:px-8">
      <div className="container mx-auto max-w-7xl grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-8 border-b border-gray-700/50 pb-6 sm:pb-8 mb-6 sm:mb-8">
        {/* Logo Section */}
        <div className="flex flex-col items-start sm:col-span-2 lg:col-span-1">
          <div className="flex items-center mb-2">
            <Waves className="h-6 w-6 sm:h-8 sm:w-8 mr-2 text-white" />
            <span className="font-playfair-display text-3xl sm:text-4xl font-bold">
              influences
            </span>
          </div>
          <span className="font-lato text-xs sm:text-sm tracking-widest uppercase -mt-1 text-white/80">
            Cuisine Moderne
          </span>
        </div>

        {/* Horaires Section */}
        <div className="sm:col-span-1 lg:col-span-1">
          <h3 className="font-playfair-display text-lg sm:text-xl font-semibold mb-3 sm:mb-4">
            Horaires
          </h3>
          <div className="space-y-1">
            <p className="font-lato text-sm text-white/90">
              Du Mardi au Samedi Soir
            </p>
            <p className="font-lato text-sm text-white/90">
              Vendredi et Samedi Midi
            </p>
          </div>
        </div>

        {/* Contact Section */}
        <div className="sm:col-span-1 lg:col-span-1">
          <h3 className="font-playfair-display text-lg sm:text-xl font-semibold mb-3 sm:mb-4">
            Nous contacter
          </h3>
          <div className="space-y-1">
            <p className="font-lato text-sm text-white/90">
              19 Rue Vieille Boucherie,
            </p>
            <p className="font-lato text-sm text-white/90">64100 Bayonne</p>
            <p className="font-lato text-sm text-white/90">05 59 01 75 04</p>
          </div>
        </div>
      </div>

      {/* Legal Links */}
      <div className="container mx-auto max-w-7xl text-center">
        <div className="flex flex-col sm:flex-row justify-center items-center gap-2 sm:gap-4 text-xs sm:text-sm font-lato">
          <Link
            href="/mentions-legales"
            className="text-white/70 hover:text-white transition-colors underline-offset-4 hover:underline"
          >
            Mentions Légales
          </Link>
          <span className="hidden sm:inline text-white/50">•</span>
          <Link
            href="/politique-confidentialite"
            className="text-white/70 hover:text-white transition-colors underline-offset-4 hover:underline"
          >
            Politique De Confidentialité
          </Link>
          <span className="hidden sm:inline text-white/50">•</span>
          <Link
            href="/"
            className="text-white/70 hover:text-white transition-colors underline-offset-4 hover:underline"
          >
            Offrir
          </Link>
        </div>
      </div>
    </footer>
  );
}
