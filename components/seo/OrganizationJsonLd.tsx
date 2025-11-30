/**
 * JSON-LD Schema.org pour l'Organisation Restaurant Influences
 * @see https://schema.org/Organization
 */

export function OrganizationJsonLd() {
  const structuredData = {
    "@context": "https://schema.org",
    "@type": "Organization",
    "@id": "https://restaurant-influences.fr/#organization",
    name: "Restaurant Influences",
    legalName: "Restaurant Influences SARL",
    url: "https://restaurant-influences.fr",
    logo: {
      "@type": "ImageObject",
      url: "https://gift.restaurant-influences.fr/images/logo-bleu.svg",
      width: 200,
      height: 70,
    },
    description:
      "Restaurant bistronomique proposant une cuisine moderne et raffinée à Bayonne, Pays Basque.",
    
    // Contact
    contactPoint: [
      {
        "@type": "ContactPoint",
        telephone: "+33-5-59-01-75-04",
        contactType: "Réservations",
        areaServed: "FR",
        availableLanguage: ["French", "English"],
        contactOption: "TollFree",
      },
      {
        "@type": "ContactPoint",
        email: "contact@restaurant-influences.fr",
        contactType: "Service Client",
        areaServed: "FR",
        availableLanguage: "French",
      },
    ],

    // Adresse
    address: {
      "@type": "PostalAddress",
      streetAddress: "19 Rue Vieille Boucherie",
      addressLocality: "Bayonne",
      addressRegion: "Nouvelle-Aquitaine",
      postalCode: "64100",
      addressCountry: "FR",
    },

    // Réseaux sociaux
    sameAs: [
      "https://www.facebook.com/restaurantinfluences",
      "https://www.instagram.com/restaurantinfluences",
      "https://restaurant-influences.fr",
    ],

    // Fondateurs
    founder: [
      {
        "@type": "Person",
        name: "Faustine",
        jobTitle: "Sommelière & Co-fondatrice",
      },
      {
        "@type": "Person",
        name: "Quentin",
        jobTitle: "Chef & Co-fondateur",
      },
    ],

    // Secteur d'activité
    industry: "Restaurant",
    keywords: [
      "restaurant gastronomique",
      "cuisine moderne",
      "produits locaux",
      "Bayonne",
      "Pays Basque",
      "bistronomie",
    ],

    // Informations légales
    vatID: "FR00000000000", // À remplacer par votre vrai numéro de TVA
    
    // Zone de service
    areaServed: {
      "@type": "GeoCircle",
      geoMidpoint: {
        "@type": "GeoCoordinates",
        latitude: 43.4929,
        longitude: -1.4748,
      },
      geoRadius: "50000", // 50km autour de Bayonne
    },
  };

  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(structuredData) }}
    />
  );
}

