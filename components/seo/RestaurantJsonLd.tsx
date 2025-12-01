/**
 * JSON-LD Schema.org pour le Restaurant Influences
 * @see https://schema.org/Restaurant
 * @see https://developers.google.com/search/docs/appearance/structured-data/local-business
 */

export function RestaurantJsonLd() {
  const structuredData = {
    "@context": "https://schema.org",
    "@type": "Restaurant",
    "@id": "https://restaurant-influences.fr/#restaurant",
    name: "Restaurant Influences",
    description:
      "Restaurant bistronomique à Bayonne proposant une cuisine moderne et raffinée avec des produits locaux. Cadre intimiste et feutré au cœur du Pays Basque.",
    image: [
      "https://gift.restaurant-influences.fr/images/logo-bleu.svg",
      "https://gift.restaurant-influences.fr/images/og-image.jpg",
    ],
    url: "https://restaurant-influences.fr",
    telephone: "+33559017504",
    email: "contact@restaurant-influences.fr",
    priceRange: "€€€",
    servesCuisine: ["French", "Basque", "Modern European"],
    menu: "https://restaurant-influences.fr/carte",
    acceptsReservations: "True",
    
    // Adresse
    address: {
      "@type": "PostalAddress",
      streetAddress: "19 Rue Vieille Boucherie",
      addressLocality: "Bayonne",
      addressRegion: "Nouvelle-Aquitaine",
      postalCode: "64100",
      addressCountry: "FR",
    },

    // Coordonnées GPS
    geo: {
      "@type": "GeoCoordinates",
      latitude: 43.4929,
      longitude: -1.4748,
    },

    // Horaires d'ouverture
    openingHoursSpecification: [
      {
        "@type": "OpeningHoursSpecification",
        dayOfWeek: ["Tuesday", "Wednesday", "Thursday"],
        opens: "19:00",
        closes: "21:30",
        description: "Service du soir",
      },
      {
        "@type": "OpeningHoursSpecification",
        dayOfWeek: "Friday",
        opens: "12:00",
        closes: "14:00",
        description: "Service du midi",
      },
      {
        "@type": "OpeningHoursSpecification",
        dayOfWeek: "Friday",
        opens: "19:00",
        closes: "21:30",
        description: "Service du soir",
      },
      {
        "@type": "OpeningHoursSpecification",
        dayOfWeek: "Saturday",
        opens: "12:00",
        closes: "14:00",
        description: "Service du midi",
      },
      {
        "@type": "OpeningHoursSpecification",
        dayOfWeek: "Saturday",
        opens: "19:00",
        closes: "21:30",
        description: "Service du soir",
      },
    ],

    // Réseaux sociaux (à compléter avec vos vrais liens)
    sameAs: [
      "https://www.facebook.com/restaurantinfluences",
      "https://www.instagram.com/restaurantinfluences",
      // Ajoutez d'autres réseaux sociaux
    ],

    // Équipe
    founder: {
      "@type": "Person",
      name: "Faustine & Quentin",
      jobTitle: "Fondateurs",
    },

    // Caractéristiques
    smokingAllowed: false,
    hasMenu: "https://restaurant-influences.fr/carte",
    
    // Évaluations (à mettre à jour avec de vraies données)
    aggregateRating: {
      "@type": "AggregateRating",
      ratingValue: "4.8",
      ratingCount: "150",
      bestRating: "5",
      worstRating: "1",
    },

    // Points forts
    amenityFeature: [
      {
        "@type": "LocationFeatureSpecification",
        name: "Terrasse",
        value: true,
      },
      {
        "@type": "LocationFeatureSpecification",
        name: "Cadre intimiste",
        value: true,
      },
      {
        "@type": "LocationFeatureSpecification",
        name: "Produits locaux",
        value: true,
      },
    ],

    // Offre de bon cadeau
    makesOffer: {
      "@type": "Offer",
      itemOffered: {
        "@type": "Product",
        name: "Bon Cadeau Restaurant Influences",
        description:
          "Offrez une expérience gastronomique inoubliable avec nos bons cadeaux",
        url: "https://gift.restaurant-influences.fr",
      },
      availability: "https://schema.org/InStock",
      priceCurrency: "EUR",
      validFrom: new Date().toISOString(),
    },
  };

  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(structuredData) }}
    />
  );
}


