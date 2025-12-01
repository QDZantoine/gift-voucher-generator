import Link from "next/link";
import Image from "next/image";
import { Clock, MapPin, Phone, Mail, Instagram, Facebook } from "lucide-react";

export function PublicFooter() {
  return (
    <footer className="bg-gradient-to-b from-[#1A2B4B] to-[#0F1A2E] text-white">
      <div className="container mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-12 sm:py-16">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8 sm:gap-10 lg:gap-12">
          {/* Logo Section */}
          <div className="flex flex-col items-start sm:col-span-2 lg:col-span-1 space-y-4">
            <Link href="/" className="group">
              <Image
                src="/images/logo-blanc.svg"
                alt="Restaurant Influences"
                width={180}
                height={60}
                loading="lazy"
                unoptimized
                className="h-16 sm:h-20 w-auto transition-opacity duration-300 group-hover:opacity-80"
              />
            </Link>
            <p className="font-lato text-sm text-white/70 leading-relaxed max-w-xs">
              Une expérience culinaire moderne au cœur de Bayonne. Découvrez
              notre cuisine raffinée et nos bons cadeaux.
            </p>
          </div>

          {/* Horaires Section */}
          <div className="sm:col-span-1 lg:col-span-1">
            <h3 className="font-playfair-display text-xl font-semibold mb-5 flex items-center gap-2">
              <Clock className="w-5 h-5 text-white/80" />
              Horaires
            </h3>
            <div className="space-y-3">
              <div className="flex items-start gap-3 group">
                <div className="w-1 h-full bg-white/20 group-hover:bg-white/40 transition-colors rounded" />
                <div>
                  <p className="font-lato text-sm font-medium text-white/95">
                    Du Mardi au Samedi
                  </p>
                  <p className="font-lato text-xs text-white/70">
                    Service du soir
                  </p>
                </div>
              </div>
              <div className="flex items-start gap-3 group">
                <div className="w-1 h-full bg-white/20 group-hover:bg-white/40 transition-colors rounded" />
                <div>
                  <p className="font-lato text-sm font-medium text-white/95">
                    Vendredi & Samedi
                  </p>
                  <p className="font-lato text-xs text-white/70">
                    Service du midi
                  </p>
                </div>
              </div>
            </div>
          </div>

          {/* Contact Section */}
          <div className="sm:col-span-2 lg:col-span-2">
            <h3 className="font-playfair-display text-xl font-semibold mb-5 flex items-center gap-2">
              <Mail className="w-5 h-5 text-white/80" />
              Nous contacter
            </h3>
            <div className="grid sm:grid-cols-2 gap-4">
              <a
                href="https://share.google/y73qPqX6kbbpArkWO"
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-start gap-3 p-3 rounded-lg bg-white/5 hover:bg-white/10 transition-all duration-300 group"
                aria-label="Adresse du restaurant - 19 Rue Vieille Boucherie, 64100 Bayonne"
              >
                <MapPin className="w-5 h-5 text-white/60 group-hover:text-white/90 transition-colors flex-shrink-0 mt-0.5" />
                <div>
                  <p className="font-lato text-sm font-medium text-white/95">
                    19 Rue Vieille Boucherie
                  </p>
                  <p className="font-lato text-sm text-white/70">
                    64100 Bayonne
                  </p>
                </div>
              </a>
              <a
                href="tel:+33559017504"
                className="flex items-start gap-3 p-3 rounded-lg bg-white/5 hover:bg-white/10 transition-all duration-300 group"
                aria-label="Appeler le restaurant - 05 59 01 75 04"
              >
                <Phone className="w-5 h-5 text-white/60 group-hover:text-white/90 transition-colors flex-shrink-0 mt-0.5" />
                <div>
                  <p className="font-lato text-sm font-medium text-white/95">
                    05 59 01 75 04
                  </p>
                  <p className="font-lato text-xs text-white/70">
                    Réservations & Informations
                  </p>
                </div>
              </a>
              <a
                href="https://www.instagram.com/influences_bayonne/"
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-start gap-3 p-3 rounded-lg bg-white/5 hover:bg-white/10 transition-all duration-300 group"
                aria-label="Suivez-nous sur Instagram - @influences_bayonne"
              >
                <Instagram className="w-5 h-5 text-white/60 group-hover:text-white/90 transition-colors flex-shrink-0 mt-0.5" />
                <div>
                  <p className="font-lato text-sm font-medium text-white/95">
                    @influences_bayonne
                  </p>
                  <p className="font-lato text-xs text-white/70">
                    Suivez-nous sur Instagram
                  </p>
                </div>
              </a>
              <a
                href="https://www.facebook.com/p/Restaurant-Influences-100070718209314"
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-start gap-3 p-3 rounded-lg bg-white/5 hover:bg-white/10 transition-all duration-300 group"
                aria-label="Suivez-nous sur Facebook - Restaurant Influences"
              >
                <Facebook className="w-5 h-5 text-white/60 group-hover:text-white/90 transition-colors flex-shrink-0 mt-0.5" />
                <div>
                  <p className="font-lato text-sm font-medium text-white/95">
                    Restaurant Influences
                  </p>
                  <p className="font-lato text-xs text-white/70">
                    Suivez-nous sur Facebook
                  </p>
                </div>
              </a>
            </div>
          </div>
        </div>
      </div>

      {/* Legal Links & Copyright */}
      <div className="border-t border-white/10">
        <div className="container mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-6">
          <div className="flex flex-col gap-4">
            {/* Top row: Copyright & Links */}
            <div className="flex flex-col sm:flex-row justify-between items-center gap-4">
              {/* Copyright & Site Link */}
              <div className="flex flex-col sm:flex-row items-center gap-2 text-center sm:text-left">
                <p className="font-lato text-sm text-white/60">
                  © {new Date().getFullYear()} Restaurant Influences. Tous
                  droits réservés.
                </p>
                <span className="hidden sm:inline text-white/30">•</span>
                <a
                  href="https://restaurant-influences.fr/"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="font-lato text-sm text-white/70 hover:text-white transition-all duration-300 underline-offset-4 hover:underline"
                >
                  Site officiel
                </a>
              </div>

              {/* Legal Links */}
              <div className="flex flex-wrap justify-center items-center gap-2 sm:gap-4 text-sm font-lato">
                <Link
                  href="/mentions-legales"
                  className="text-white/70 hover:text-white transition-all duration-300 underline-offset-4 hover:underline px-2"
                >
                  Mentions Légales
                </Link>
                <span className="text-white/30">•</span>
                <Link
                  href="/politique-confidentialite"
                  className="text-white/70 hover:text-white transition-all duration-300 underline-offset-4 hover:underline px-2"
                >
                  Confidentialité
                </Link>
                <span className="text-white/30">•</span>
                <Link
                  href="/"
                  className="text-white/70 hover:text-white transition-all duration-300 underline-offset-4 hover:underline px-2"
                >
                  Offrir un bon
                </Link>
              </div>
            </div>

            {/* Bottom row: Made with love */}
            <div className="text-center pt-2 border-t border-white/5">
              <p className="font-lato text-xs text-white/50">
                Made with{" "}
                <span className="text-red-400 inline-block animate-pulse">
                  ❤️
                </span>{" "}
                by{" "}
                <a
                  href="https://www.anthea-digitalbloom.fr/"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-white/70 font-medium hover:text-white transition-all duration-300 underline-offset-4 hover:underline"
                >
                  Antoine Quendez
                </a>
              </p>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
}
