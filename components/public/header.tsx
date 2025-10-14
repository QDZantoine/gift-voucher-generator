import Link from "next/link";

export function PublicHeader() {
  return (
    <header className="bg-[#F8F7F2] text-[#1A2B4B] py-4 sm:py-6 px-4 sm:px-6 lg:px-8 border-b border-gray-200/50">
      <div className="container mx-auto flex justify-between items-center max-w-7xl">
        {/* Logo */}
        <Link href="/" className="flex flex-col items-start group">
          <span className="font-playfair-display text-2xl sm:text-3xl font-bold transition-colors group-hover:text-[#1A2B4B]/80">
            influences
          </span>
          <span className="font-lato text-xs sm:text-sm tracking-widest uppercase -mt-1 text-[#1A2B4B]/70">
            Cuisine Moderne
          </span>
        </Link>

        {/* Navigation (simplifié pour la page publique) */}
        <nav className="hidden sm:flex space-x-6 lg:space-x-8">
          <Link
            href="/"
            className="font-lato text-sm font-medium hover:text-[#1A2B4B]/80 transition-colors relative after:absolute after:bottom-0 after:left-0 after:w-0 after:h-0.5 after:bg-[#1A2B4B] after:transition-all hover:after:w-full"
          >
            Accueil
          </Link>
          <Link
            href="/admin"
            className="font-lato text-sm font-medium hover:text-[#1A2B4B]/80 transition-colors relative after:absolute after:bottom-0 after:left-0 after:w-0 after:h-0.5 after:bg-[#1A2B4B] after:transition-all hover:after:w-full"
          >
            Admin
          </Link>
        </nav>
      </div>
    </header>
  );
}
