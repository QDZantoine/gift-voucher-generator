/**
 * Composant unifié pour les données structurées JSON-LD
 * Fusionne Organization et Restaurant en un seul script pour éviter les doublons
 * @see https://schema.org/docs/documents.html#json-ld
 *
 * Utilise @graph pour regrouper plusieurs entités dans un seul script JSON-LD
 * Cela évite l'erreur "L'avis contient plusieurs notes cumulées" de Google Search Console
 */

export function UnifiedStructuredData() {
  const structuredData = {
    "@context": "https://schema.org",
    "@graph": [
      // Organisation
      {
        "@type": "Organization",
        "@id": "https://restaurant-influences.fr/#organization",
        name: "Restaurant Influences",
        legalName: "Restaurant Influences SARL",
        url: "https://restaurant-influences.fr",
        logo: {
          "@type": "ImageObject",
          url: "https://influences-bayonne.fr/images/logo-bleu.svg",
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

        // Réseaux sociaux et sites
        sameAs: [
          "https://restaurant-influences.fr",
          "https://influences-bayonne.fr",
          "https://www.facebook.com/restaurantinfluences",
          "https://www.instagram.com/restaurantinfluences",
        ],

        // Développeur / Créateur du site
        creator: {
          "@type": "Person",
          name: "Antoine Quendez",
          url: "https://www.anthea-digitalbloom.fr",
          jobTitle: "Développeur Web",
          worksFor: {
            "@type": "Organization",
            name: "ANTHEA Digital Bloom",
            url: "https://www.anthea-digitalbloom.fr",
          },
        },

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
      },

      // Restaurant (avec UN SEUL AggregateRating)
      {
        "@type": "Restaurant",
        "@id": "https://restaurant-influences.fr/#restaurant",
        // Relation avec l'Organization parente
        parentOrganization: {
          "@id": "https://restaurant-influences.fr/#organization",
        },
        name: "Restaurant Influences",
        description:
          "Restaurant bistronomique à Bayonne proposant une cuisine moderne et raffinée avec des produits locaux. Cadre intimiste et feutré au cœur du Pays Basque.",
        image: [
          "https://influences-bayonne.fr/images/logo-bleu.svg",
          "https://influences-bayonne.fr/opengraph-image",
        ],
        url: "https://restaurant-influences.fr",
        telephone: "+33559017504",
        email: "contact@restaurant-influences.fr",
        priceRange: "€€€",
        servesCuisine: ["French", "Basque", "Modern European"],
        menu: "https://restaurant-influences.fr/carte",
        acceptsReservations: true,

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

        // Réseaux sociaux et sites
        sameAs: [
          "https://restaurant-influences.fr",
          "https://influences-bayonne.fr",
          "https://www.facebook.com/restaurantinfluences",
          "https://www.instagram.com/restaurantinfluences",
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

        // UN SEUL AggregateRating pour éviter l'erreur Google Search Console
        // Utilisation de nombres pour ratingValue et ratingCount selon les bonnes pratiques Schema.org
        aggregateRating: {
          "@type": "AggregateRating",
          ratingValue: 4.8,
          ratingCount: 150,
          bestRating: 5,
          worstRating: 1,
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
            url: "https://influences-bayonne.fr",
          },
          availability: "https://schema.org/InStock",
          priceCurrency: "EUR",
          validFrom: new Date().toISOString(),
        },
      },
    ],
  };

  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{
        __html: JSON.stringify(structuredData, null, 0),
      }}
    />
  );
}
