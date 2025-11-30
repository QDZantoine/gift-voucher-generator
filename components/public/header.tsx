import Link from "next/link";
import Image from "next/image";
import { Home } from "lucide-react";

export function PublicHeader() {
  return (
    <header className="sticky top-0 z-50 bg-white/95 backdrop-blur-md text-[#1A2B4B] border-b border-gray-200/80 shadow-sm">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 max-w-7xl">
        <div className="flex justify-between items-center h-20 sm:h-24">
          {/* Logo */}
          <Link href="/" className="flex items-center group relative">
            <div className="relative overflow-hidden">
              <Image
                src="/images/logo-bleu.svg"
                alt="Restaurant Influences - Cuisine Moderne"
                width={200}
                height={70}
                priority
                className="h-14 sm:h-20 w-auto transition-all duration-300 group-hover:scale-105"
              />
            </div>
          </Link>

          {/* Navigation */}
          <nav className="flex items-center space-x-8">
            {/* Bouton Accueil - Desktop */}
            <Link
              href="/"
              className="hidden sm:flex items-center gap-2 font-lato text-sm font-medium text-[#1A2B4B] hover:text-[#1A2B4B]/70 transition-all duration-300 relative group px-4 py-2"
            >
              <Home className="w-4 h-4" />
              <span>Accueil</span>
              <span className="absolute inset-x-0 bottom-0 h-0.5 bg-[#1A2B4B] transform scale-x-0 group-hover:scale-x-100 transition-transform duration-300" />
            </Link>

            {/* Bouton Accueil - Mobile */}
            <Link
              href="/"
              className="sm:hidden flex items-center justify-center w-10 h-10 rounded-full bg-[#1A2B4B] text-white hover:bg-[#1A2B4B]/90 transition-all duration-300 shadow-md hover:shadow-lg"
              aria-label="Retour à l'accueil"
            >
              <Home className="w-5 h-5" />
            </Link>
          </nav>
        </div>
      </div>
    </header>
  );
}
